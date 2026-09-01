-- Expande o catálogo para 12 categorias e cria o papel de administrador.

-- ======================================================== categorias
update public.categories set name = 'Festas e Eventos' where slug = 'festas';

insert into public.categories (slug, name, icon, sort) values
  ('ferramentas',   'Ferramentas',       '🔧',  1),
  ('construcao',    'Construção',        '🏗️',  2),
  ('eletronicos',   'Eletrônicos',       '💻',  3),
  ('foto-video',    'Foto e Vídeo',      '📷',  4),
  ('audio-musica',  'Áudio e Música',    '🎸',  5),
  ('festas',        'Festas e Eventos',  '🎉',  6),
  ('esportes',      'Esportes',          '⚽',  7),
  ('camping',       'Camping',           '⛺',  8),
  ('casa-jardim',   'Casa e Jardim',     '🪴',  9),
  ('mobilidade',    'Mobilidade',        '🚲', 10),
  ('bebe-infantil', 'Bebê e Infantil',   '🍼', 11),
  ('outros',        'Outros',            '📦', 99)
on conflict (slug) do update
  set name = excluded.name,
      icon = excluded.icon,
      sort = excluded.sort;

-- ============================================================ admin
alter table public.profiles
  add column if not exists role text not null default 'user'
    check (role in ('user', 'admin')),
  add column if not exists blocked_at timestamptz;

/*
 * SECURITY DEFINER de propósito: a policy de `profiles` não pode consultar
 * `profiles` por RLS — isso causaria recursão infinita. A função roda com os
 * privilégios do dono e enxerga a tabela direto.
 */
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
     where id = auth.uid()
       and role = 'admin'
       and blocked_at is null
  );
$$;

create or replace function public.is_blocked()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and blocked_at is not null
  );
$$;

/*
 * Sem isto, qualquer usuário se promoveria a admin com um PATCH em
 * /rest/v1/profiles — a policy de update libera a própria linha, e `role`
 * é uma coluna dela. O trigger devolve os campos sensíveis ao valor antigo
 * quando quem edita não é admin.
 */
create or replace function public.protect_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.role := old.role;
    new.blocked_at := old.blocked_at;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_privileged_columns();

-- Admin enxerga e administra tudo. Políticas permissivas somam com as
-- existentes (OR), então as regras normais dos usuários seguem valendo.
drop policy if exists profiles_admin on public.profiles;
create policy profiles_admin on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists listings_admin on public.listings;
create policy listings_admin on public.listings for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists bookings_admin on public.bookings;
create policy bookings_admin on public.bookings for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists reviews_admin on public.reviews;
create policy reviews_admin on public.reviews for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists categories_admin on public.categories;
create policy categories_admin on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- Conta bloqueada não anuncia nem reserva.
drop policy if exists listings_insert on public.listings;
create policy listings_insert on public.listings for insert
  with check (owner_id = auth.uid() and not public.is_blocked());

drop policy if exists bookings_insert on public.bookings;
create policy bookings_insert on public.bookings for insert
  with check (renter_id = auth.uid() and not public.is_blocked());

-- ===================================================== notificações
-- Mensagens do administrador para os usuários. Separado de `messages`,
-- que é a conversa entre locador e locatário sobre um item.
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  sender_id   uuid references public.profiles(id) on delete set null,
  title       text not null,
  body        text not null,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists notifications_select on public.notifications;
create policy notifications_select on public.notifications for select
  using (user_id = auth.uid() or public.is_admin());

-- Só admin envia; o usuário apenas marca a própria como lida.
drop policy if exists notifications_insert on public.notifications;
create policy notifications_insert on public.notifications for insert
  with check (public.is_admin());

drop policy if exists notifications_update on public.notifications;
create policy notifications_update on public.notifications for update
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists notifications_delete on public.notifications;
create policy notifications_delete on public.notifications for delete
  using (public.is_admin());

-- ============================================ visão agregada do admin
-- Números do painel sem baixar todas as linhas para o cliente.
create or replace function public.admin_stats()
returns json
language sql
stable
security definer
set search_path = public
as $$
  select case when not public.is_admin() then null else json_build_object(
    'users',            (select count(*) from public.profiles),
    'blocked_users',    (select count(*) from public.profiles where blocked_at is not null),
    'listings_active',  (select count(*) from public.listings where status = 'active'),
    'listings_total',   (select count(*) from public.listings),
    'bookings_total',   (select count(*) from public.bookings),
    'bookings_pending', (select count(*) from public.bookings where status = 'pending'),
    'gmv',              (select coalesce(sum(total), 0) from public.bookings
                          where status in ('confirmed','active','returned','completed')),
    'revenue',          (select coalesce(sum(service_fee + insurance_fee), 0) from public.bookings
                          where status in ('confirmed','active','returned','completed'))
  ) end;
$$;

-- ============================================ PROMOVA SEU USUÁRIO AQUI
-- Troque pelo email da sua conta e rode. Este é o único jeito de criar o
-- primeiro admin: pela API nenhum usuário consegue se promover.
--
--   update public.profiles set role = 'admin' where email = 'voce@exemplo.com';
