-- Loquei — schema inicial
-- Marketplace P2P de aluguel de itens.
-- Aplique no SQL Editor do Supabase (ou via `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- perfis
-- Espelha auth.users. A senha vive em auth.users (hash bcrypt), nunca aqui.
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  name          text not null,
  email         text not null,
  type          text not null default 'pf' check (type in ('pf', 'pj')),
  profile       text not null default 'locatario' check (profile in ('locador', 'locatario')),
  phone         text,
  company_name  text,
  cnpj          text,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Cria o profile automaticamente quando o usuário se cadastra.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, type, profile, phone, company_name, cnpj)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'type', 'pf'),
    coalesce(new.raw_user_meta_data->>'profile', 'locatario'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'cnpj'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------ categorias
create table if not exists public.categories (
  slug  text primary key,
  name  text not null,
  icon  text not null,
  sort  int  not null default 0
);

insert into public.categories (slug, name, icon, sort) values
  ('ferramentas', 'Ferramentas', '🔧', 1),
  ('eletronicos', 'Eletrônicos', '📷', 2),
  ('esportes',    'Esportes',    '⚽', 3),
  ('festas',      'Festas',      '🎉', 4),
  ('camping',     'Camping',     '⛺', 5),
  ('outros',      'Outros',      '📦', 6)
on conflict (slug) do nothing;

-- --------------------------------------------------------------- anúncios
create table if not exists public.listings (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null references public.profiles(id) on delete cascade,
  category_slug  text not null references public.categories(slug),
  title          text not null,
  description    text not null,
  price_per_day  numeric(10,2) not null check (price_per_day > 0),
  deposit        numeric(10,2) not null default 0 check (deposit >= 0),
  location       text not null,
  lat            double precision,
  lng            double precision,
  images         text[] not null default '{}',
  status         text not null default 'active' check (status in ('draft', 'active', 'paused', 'removed')),
  rating_avg     numeric(3,2) not null default 0,
  rating_count   int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists listings_owner_idx    on public.listings (owner_id);
create index if not exists listings_category_idx on public.listings (category_slug);
create index if not exists listings_status_idx   on public.listings (status);
-- Busca textual em português por título + descrição.
create index if not exists listings_search_idx on public.listings
  using gin (to_tsvector('portuguese', title || ' ' || description));

-- --------------------------------------------------------------- reservas
create table if not exists public.bookings (
  id            uuid primary key default gen_random_uuid(),
  listing_id    uuid not null references public.listings(id) on delete cascade,
  renter_id     uuid not null references public.profiles(id) on delete cascade,
  start_date    date not null,
  end_date      date not null,
  daily_price   numeric(10,2) not null,
  subtotal      numeric(10,2) not null,
  service_fee   numeric(10,2) not null default 0,
  insurance_fee numeric(10,2) not null default 0,
  deposit       numeric(10,2) not null default 0,
  total         numeric(10,2) not null,
  status        text not null default 'pending'
                check (status in ('pending', 'confirmed', 'active', 'returned', 'completed', 'cancelled', 'rejected')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint bookings_dates_ok check (end_date >= start_date)
);

create index if not exists bookings_listing_idx on public.bookings (listing_id);
create index if not exists bookings_renter_idx  on public.bookings (renter_id);

-- --------------------------------------------------------------- avaliações
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null unique references public.bookings(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  author_id   uuid not null references public.profiles(id) on delete cascade,
  rating      int not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now()
);

-- Mantém rating_avg/rating_count do anúncio em dia.
create or replace function public.refresh_listing_rating()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  target uuid := coalesce(new.listing_id, old.listing_id);
begin
  update public.listings l
     set rating_avg   = coalesce((select round(avg(rating)::numeric, 2) from public.reviews where listing_id = target), 0),
         rating_count = (select count(*) from public.reviews where listing_id = target)
   where l.id = target;
  return null;
end;
$$;

drop trigger if exists on_review_change on public.reviews;
create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_listing_rating();

-- --------------------------------------------------------------- favoritos
create table if not exists public.favorites (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, listing_id)
);

-- --------------------------------------------------------------- mensagens
create table if not exists public.conversations (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid references public.listings(id) on delete set null,
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  renter_id   uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (listing_id, owner_id, renter_id)
);

create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.conversations(id) on delete cascade,
  sender_id        uuid not null references public.profiles(id) on delete cascade,
  body             text not null,
  read_at          timestamptz,
  created_at       timestamptz not null default now()
);

create index if not exists messages_conversation_idx on public.messages (conversation_id, created_at);

-- ================================================================ RLS
alter table public.profiles      enable row level security;
alter table public.categories    enable row level security;
alter table public.listings      enable row level security;
alter table public.bookings      enable row level security;
alter table public.reviews       enable row level security;
alter table public.favorites     enable row level security;
alter table public.conversations enable row level security;
alter table public.messages      enable row level security;

-- profiles: perfil é público (nome/avatar aparecem no anúncio); só o dono edita.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select using (true);
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- categories: leitura pública, escrita só via service role.
drop policy if exists categories_select on public.categories;
create policy categories_select on public.categories for select using (true);

-- listings: anúncios ativos são públicos; o dono vê e mexe nos seus.
drop policy if exists listings_select on public.listings;
create policy listings_select on public.listings for select
  using (status = 'active' or owner_id = auth.uid());
drop policy if exists listings_insert on public.listings;
create policy listings_insert on public.listings for insert with check (owner_id = auth.uid());
drop policy if exists listings_update on public.listings;
create policy listings_update on public.listings for update using (owner_id = auth.uid());
drop policy if exists listings_delete on public.listings;
create policy listings_delete on public.listings for delete using (owner_id = auth.uid());

-- bookings: visíveis para o locatário e para o dono do anúncio.
drop policy if exists bookings_select on public.bookings;
create policy bookings_select on public.bookings for select using (
  renter_id = auth.uid()
  or exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
);
drop policy if exists bookings_insert on public.bookings;
create policy bookings_insert on public.bookings for insert with check (renter_id = auth.uid());
drop policy if exists bookings_update on public.bookings;
create policy bookings_update on public.bookings for update using (
  renter_id = auth.uid()
  or exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
);

-- reviews: leitura pública; só quem alugou avalia, e só depois de devolver.
drop policy if exists reviews_select on public.reviews;
create policy reviews_select on public.reviews for select using (true);
drop policy if exists reviews_insert on public.reviews;
create policy reviews_insert on public.reviews for insert with check (
  author_id = auth.uid()
  and exists (
    select 1 from public.bookings b
     where b.id = booking_id
       and b.renter_id = auth.uid()
       and b.status in ('returned', 'completed')
  )
);

-- favorites: privados.
drop policy if exists favorites_all on public.favorites;
create policy favorites_all on public.favorites for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- conversations / messages: só os dois participantes.
drop policy if exists conversations_select on public.conversations;
create policy conversations_select on public.conversations for select
  using (owner_id = auth.uid() or renter_id = auth.uid());
drop policy if exists conversations_insert on public.conversations;
create policy conversations_insert on public.conversations for insert
  with check (owner_id = auth.uid() or renter_id = auth.uid());

drop policy if exists messages_select on public.messages;
create policy messages_select on public.messages for select using (
  exists (select 1 from public.conversations c
           where c.id = conversation_id and (c.owner_id = auth.uid() or c.renter_id = auth.uid()))
);
drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages for insert with check (
  sender_id = auth.uid()
  and exists (select 1 from public.conversations c
               where c.id = conversation_id and (c.owner_id = auth.uid() or c.renter_id = auth.uid()))
);

-- ================================================== Storage (imagens)
insert into storage.buckets (id, name, public)
values ('listings', 'listings', true)
on conflict (id) do nothing;

drop policy if exists listing_images_read on storage.objects;
create policy listing_images_read on storage.objects for select
  using (bucket_id = 'listings');

-- O usuário só escreve dentro da própria pasta: listings/<uid>/arquivo.jpg
drop policy if exists listing_images_write on storage.objects;
create policy listing_images_write on storage.objects for insert to authenticated
  with check (bucket_id = 'listings' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists listing_images_delete on storage.objects;
create policy listing_images_delete on storage.objects for delete to authenticated
  using (bucket_id = 'listings' and (storage.foldername(name))[1] = auth.uid()::text);
