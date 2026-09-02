-- Fecha dois caminhos para obter promoção paga sem pagar.
--
-- 1. `activate_promotion` e `expire_promotions` estavam ao alcance de
--    qualquer usuário autenticado. Revogar de `anon, authenticated` não
--    bastou: no Postgres a função nasce com EXECUTE para PUBLIC, e os papéis
--    herdam dele. Em vez de mexer só no GRANT, as funções passam a conferir
--    quem chamou -- o admin precisa executá-las pela tela.
--
-- 2. A policy de update de `listings` libera o dono a alterar a própria
--    linha, e `featured_until` é uma coluna dela: bastava um PATCH para o
--    anúncio virar destaque de graça. O mesmo valia para `profiles.plan`,
--    que decide a comissão cobrada.
--
-- Verificado antes: o dono conseguia se destacar até 2030 com um PATCH.

-- ---------------------------------------------------------- funções
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
  -- auth.uid() nulo = service_role (webhook do provedor) ou SQL Editor.
  if auth.uid() is not null and not public.is_admin() then
    raise exception 'apenas a administração pode liberar uma promoção';
  end if;

  select * into promo from public.promotions where id = promotion_id;
  if not found then
    raise exception 'promoção % não encontrada', promotion_id;
  end if;

  -- Só libera o que foi pago, e uma vez só: reentrega de webhook ou clique
  -- repetido não pode estender o prazo de novo.
  if promo.status not in ('paid', 'pending') then
    raise exception 'promoção % está como %', promotion_id, promo.status;
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

create or replace function public.expire_promotions()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  total int;
begin
  if auth.uid() is not null and not public.is_admin() then
    raise exception 'apenas a administração pode encerrar promoções';
  end if;

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

-- ------------------------------------------------- colunas protegidas
/*
 * Impede que o dono do anúncio escreva os campos que representam algo pago.
 * Devolve o valor anterior em vez de recusar, para não quebrar um update
 * legítimo que só passou pelas colunas junto com as outras.
 */
create or replace function public.protect_listing_promotion_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.featured_until := old.featured_until;
    new.category_top_until := old.category_top_until;
  end if;
  return new;
end;
$$;

drop trigger if exists listings_protect_promotion on public.listings;
create trigger listings_protect_promotion
  before update on public.listings
  for each row execute function public.protect_listing_promotion_columns();

-- O plano do perfil decide a comissão cobrada: mesma proteção de `role`.
create or replace function public.protect_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.blocked_at := old.blocked_at;
    new.plan := old.plan;
    new.pro_until := old.pro_until;
  end if;
  return new;
end;
$$;
