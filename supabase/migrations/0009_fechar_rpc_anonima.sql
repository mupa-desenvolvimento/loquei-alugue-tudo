-- URGENTE: qualquer visitante liberava promoção paga de graça.
--
-- A migração 0006 trocou o REVOKE por uma checagem interna:
--
--     if auth.uid() is not null and not public.is_admin() then raise ...
--
-- A intenção era deixar passar o webhook (service_role) e o pg_cron, que
-- rodam sem usuário autenticado. Só que uma chamada anônima pela API pública
-- TAMBÉM tem auth.uid() nulo. Resultado: bastava um POST em
-- /rest/v1/rpc/activate_promotion com a chave anon -- que é pública e vai no
-- bundle -- para ativar qualquer contratação sem pagar.
--
-- Verificado antes desta migração: sem login, uma contratação 'pending'
-- virou 'active' e o anúncio ganhou destaque por 7 dias.
--
-- A correção troca "não tem usuário" por uma lista explícita de quem pode:
-- administrador, service_role (webhook) e postgres (pg_cron e SQL Editor).
-- `auth.role()` lê o papel do JWT e é nulo quando não há JWT nenhum.

create or replace function public.pode_administrar()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
      or coalesce(auth.role(), 'postgres') in ('service_role', 'postgres');
$$;

comment on function public.pode_administrar() is
  'Quem pode executar rotina administrativa: admin, o webhook (service_role) '
  'ou uma conexão de servidor sem JWT (pg_cron, SQL Editor). Chamada anônima '
  'pela API pública tem auth.role() = anon e NÃO passa.';

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
  if not public.pode_administrar() then
    raise exception 'sem permissão para liberar promoção';
  end if;

  select * into promo from public.promotions where id = promotion_id;
  if not found then
    raise exception 'promoção % não encontrada', promotion_id;
  end if;

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
  if not public.pode_administrar() then
    raise exception 'sem permissão para encerrar promoções';
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

-- Mesma proteção nos gatilhos: sem usuário autenticado não é mais sinônimo
-- de chamada confiável.
create or replace function public.protect_listing_promotion_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.pode_administrar() then
    new.featured_until := old.featured_until;
    new.category_top_until := old.category_top_until;
  end if;
  return new;
end;
$$;

create or replace function public.protect_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.pode_administrar() then
    new.role := old.role;
    new.blocked_at := old.blocked_at;
    new.plan := old.plan;
    new.pro_until := old.pro_until;
  end if;
  return new;
end;
$$;

-- ------------------------------------------------- defesa em profundidade
-- Mesmo com a checagem acima, nada disso precisa estar ao alcance de quem
-- não fez login. Revogar de PUBLIC também, senão os papéis herdam dele --
-- foi o que fez o REVOKE da 0006 não surtir efeito.
revoke execute on function public.activate_promotion(uuid) from public, anon;
revoke execute on function public.expire_promotions() from public, anon;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.refresh_listing_rating() from public, anon, authenticated;
revoke execute on function public.protect_listing_promotion_columns() from public, anon, authenticated;
revoke execute on function public.protect_privileged_columns() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
revoke execute on function public.admin_stats() from public, anon;
revoke execute on function public.admin_revenue() from public, anon;
revoke execute on function public.pode_administrar() from public, anon;

-- O admin chama activate_promotion e expire_promotions pelo painel, logado.
grant execute on function public.activate_promotion(uuid) to authenticated;
grant execute on function public.expire_promotions() to authenticated;
