-- Banners gerenciáveis e os produtos pagos da plataforma.

-- ========================================================== banners
-- Alimentam o carrossel da home. `kind` separa o banner editorial (feito
-- pela Loquei) do patrocinado (espaço vendido), que tem anunciante e prazo.
create table if not exists public.banners (
  id           uuid primary key default gen_random_uuid(),
  title        text,
  subtitle     text,
  image_url    text not null,
  link_url     text,
  alt          text not null default '',
  position     int  not null default 0,
  active       boolean not null default true,
  kind         text not null default 'editorial' check (kind in ('editorial', 'sponsored')),
  sponsor_name text,
  starts_at    timestamptz,
  ends_at      timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists banners_ordem_idx on public.banners (active, position);

alter table public.banners enable row level security;

-- Visitante só vê banner ativo e dentro da janela de exibição.
drop policy if exists banners_select on public.banners;
create policy banners_select on public.banners for select using (
  public.is_admin()
  or (
    active
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  )
);

drop policy if exists banners_admin on public.banners;
create policy banners_admin on public.banners for all
  using (public.is_admin()) with check (public.is_admin());

-- ==================================================== planos pagos
create table if not exists public.promotion_plans (
  slug          text primary key,
  name          text not null,
  description   text not null,
  -- featured: sobe na busca inteira | category_top: sobe só na categoria
  -- banner: espaço na home        | pro: assinatura do locador
  kind          text not null check (kind in ('featured', 'category_top', 'banner', 'pro')),
  price         numeric(10,2) not null check (price >= 0),
  duration_days int not null check (duration_days > 0),
  active        boolean not null default true,
  sort          int not null default 0
);

insert into public.promotion_plans (slug, name, description, kind, price, duration_days, sort) values
  ('destaque-7',  'Destaque por 7 dias',  'Seu item aparece antes dos demais em toda a busca, com selo de destaque.', 'featured', 29.90, 7, 1),
  ('destaque-15', 'Destaque por 15 dias', 'Duas semanas no topo da busca, com selo de destaque.', 'featured', 49.90, 15, 2),
  ('categoria-7', 'Topo da categoria',    'Primeiro lugar dentro da categoria do seu item, por 7 dias.', 'category_top', 14.90, 7, 3),
  ('banner-15',   'Banner na home',       'Seu banner no carrossel da página inicial por 15 dias.', 'banner', 199.00, 15, 4),
  ('pro-mensal',  'Plano Pro',            'Comissão de 5% em vez de 10%, selo de locador verificado e prioridade no suporte.', 'pro', 39.90, 30, 5)
on conflict (slug) do update
  set name = excluded.name,
      description = excluded.description,
      kind = excluded.kind,
      price = excluded.price,
      duration_days = excluded.duration_days,
      sort = excluded.sort;

alter table public.promotion_plans enable row level security;

drop policy if exists plans_select on public.promotion_plans;
create policy plans_select on public.promotion_plans for select using (active or public.is_admin());

drop policy if exists plans_admin on public.promotion_plans;
create policy plans_admin on public.promotion_plans for all
  using (public.is_admin()) with check (public.is_admin());

-- ================================================ contratações
create table if not exists public.promotions (
  id            uuid primary key default gen_random_uuid(),
  plan_slug     text not null references public.promotion_plans(slug),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  listing_id    uuid references public.listings(id) on delete cascade,
  banner_id     uuid references public.banners(id) on delete set null,
  amount        numeric(10,2) not null,
  status        text not null default 'pending'
                check (status in ('pending', 'paid', 'active', 'expired', 'cancelled', 'refunded')),
  starts_at     timestamptz,
  ends_at       timestamptz,
  -- Preenchidos pelo webhook do provedor; nunca pelo cliente.
  provider      text,
  provider_ref  text,
  paid_at       timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists promotions_user_idx on public.promotions (user_id, created_at desc);
create index if not exists promotions_status_idx on public.promotions (status, ends_at);
create unique index if not exists promotions_provider_ref_idx
  on public.promotions (provider, provider_ref) where provider_ref is not null;

alter table public.promotions enable row level security;

drop policy if exists promotions_select on public.promotions;
create policy promotions_select on public.promotions for select
  using (user_id = auth.uid() or public.is_admin());

-- O usuário cria o pedido, mas sempre como 'pending' e no próprio nome:
-- quem marca como pago é o webhook, com a service_role.
drop policy if exists promotions_insert on public.promotions;
create policy promotions_insert on public.promotions for insert with check (
  user_id = auth.uid()
  and status = 'pending'
  and not public.is_blocked()
);

drop policy if exists promotions_cancel on public.promotions;
create policy promotions_cancel on public.promotions for update
  using (user_id = auth.uid() and status = 'pending')
  with check (status in ('pending', 'cancelled'));

drop policy if exists promotions_admin on public.promotions;
create policy promotions_admin on public.promotions for all
  using (public.is_admin()) with check (public.is_admin());

-- ==================================== efeitos das promoções ativas
alter table public.listings
  add column if not exists featured_until     timestamptz,
  add column if not exists category_top_until timestamptz;

create index if not exists listings_featured_idx on public.listings (featured_until desc nulls last);

alter table public.profiles
  add column if not exists plan      text not null default 'free' check (plan in ('free', 'pro')),
  add column if not exists pro_until timestamptz;

/*
 * Aplica o efeito de uma promoção paga. Chamada pelo webhook do provedor
 * e pelo admin, nunca pelo cliente — é o único ponto que escreve
 * `featured_until`, `category_top_until` e o plano do perfil.
 */
create or replace function public.activate_promotion(promotion_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  promo public.promotions%rowtype;
  plano public.promotion_plans%rowtype;
  fim   timestamptz;
begin
  select * into promo from public.promotions where id = promotion_id;
  if not found then
    raise exception 'promoção % não encontrada', promotion_id;
  end if;

  select * into plano from public.promotion_plans where slug = promo.plan_slug;
  fim := now() + (plano.duration_days || ' days')::interval;

  update public.promotions
     set status = 'active', starts_at = now(), ends_at = fim, updated_at = now()
   where id = promotion_id;

  if plano.kind = 'featured' then
    update public.listings set featured_until = fim where id = promo.listing_id;
  elsif plano.kind = 'category_top' then
    update public.listings set category_top_until = fim where id = promo.listing_id;
  elsif plano.kind = 'pro' then
    -- Renovação soma ao tempo que ainda resta, em vez de encurtar.
    update public.profiles
       set plan = 'pro',
           pro_until = greatest(coalesce(pro_until, now()), now())
                       + (plano.duration_days || ' days')::interval
     where id = promo.user_id;
  elsif plano.kind = 'banner' and promo.banner_id is not null then
    update public.banners
       set active = true, starts_at = now(), ends_at = fim
     where id = promo.banner_id;
  end if;
end;
$$;

revoke execute on function public.activate_promotion(uuid) from anon, authenticated;

/*
 * Encerra o que venceu. Sem isto, um destaque pago continuaria valendo para
 * sempre. Ideal agendar com pg_cron; enquanto isso, o painel do admin chama.
 */
create or replace function public.expire_promotions()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  total int;
begin
  update public.promotions
     set status = 'expired', updated_at = now()
   where status = 'active' and ends_at is not null and ends_at < now();
  get diagnostics total = row_count;

  update public.listings set featured_until = null
   where featured_until is not null and featured_until < now();

  update public.listings set category_top_until = null
   where category_top_until is not null and category_top_until < now();

  update public.profiles set plan = 'free'
   where plan = 'pro' and pro_until is not null and pro_until < now();

  return total;
end;
$$;

-- ================================================ receita do admin
create or replace function public.admin_revenue()
returns json
language sql
stable
security definer
set search_path = public
as $$
  select case when not public.is_admin() then null else json_build_object(
    'promotions_paid',   (select count(*) from public.promotions where status in ('paid','active','expired')),
    'promotions_pending',(select count(*) from public.promotions where status = 'pending'),
    'promotions_revenue',(select coalesce(sum(amount), 0) from public.promotions where status in ('paid','active','expired')),
    'active_featured',   (select count(*) from public.listings where featured_until > now()),
    'pro_members',       (select count(*) from public.profiles where plan = 'pro'),
    'mrr',               (select coalesce(sum(p.price), 0)
                            from public.profiles pr
                            join public.promotion_plans p on p.kind = 'pro'
                           where pr.plan = 'pro')
  ) end;
$$;

-- ============================================ storage dos banners
insert into storage.buckets (id, name, public)
values ('banners', 'banners', true)
on conflict (id) do nothing;

drop policy if exists banner_images_read on storage.objects;
create policy banner_images_read on storage.objects for select
  using (bucket_id = 'banners');

drop policy if exists banner_images_write on storage.objects;
create policy banner_images_write on storage.objects for insert to authenticated
  with check (bucket_id = 'banners' and public.is_admin());

drop policy if exists banner_images_delete on storage.objects;
create policy banner_images_delete on storage.objects for delete to authenticated
  using (bucket_id = 'banners' and public.is_admin());
