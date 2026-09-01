-- Busca sem sensibilidade a acento: "camera" precisa encontrar "Câmera".
create extension if not exists unaccent;
create extension if not exists pg_trgm;

-- `unaccent` não é immutable por padrão, então a coluna gerada usa um wrapper.
create or replace function public.normalize_text(value text)
returns text
language sql
immutable
strict
parallel safe
set search_path = public, extensions
as $$
  select lower(unaccent(value));
$$;

alter table public.listings
  drop column if exists search_text;

alter table public.listings
  add column search_text text
  generated always as (
    public.normalize_text(coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(location, ''))
  ) stored;

create index if not exists listings_search_trgm_idx
  on public.listings using gin (search_text gin_trgm_ops);
