-- Registro de tudo que o provedor de pagamento envia.
--
-- Sem isto, uma notificacao recusada nao deixa rastro consultavel: o unico
-- sinal e a contratacao seguir 'pending', sem dizer se o provedor chamou, se
-- a assinatura falhou ou se o pagamento nem foi aprovado.
--
-- Serve para diagnostico e tambem como trilha de auditoria: dinheiro que
-- entra precisa ter historico.

create table if not exists public.payment_events (
  id            uuid primary key default gen_random_uuid(),
  provider      text not null default 'mercadopago',
  event_type    text,
  data_id       text,
  promotion_id  uuid references public.promotions(id) on delete set null,
  -- false quando a assinatura nao confere: e o caso que mais interessa.
  signature_ok  boolean,
  outcome       text not null,
  detail        text,
  headers       jsonb,
  received_at   timestamptz not null default now()
);

create index if not exists payment_events_recebidos_idx
  on public.payment_events (received_at desc);

alter table public.payment_events enable row level security;

-- Só a administração lê. Não existe policy de insert, update ou delete de
-- propósito: a escrita vem da service_role (o webhook), que ignora RLS, e
-- nem o admin apaga pela API. Trilha de auditoria de dinheiro não deveria
-- ser editável por quem opera o sistema -- para limpar, só direto no banco.
drop policy if exists payment_events_admin on public.payment_events;
create policy payment_events_admin on public.payment_events for select
  using (public.is_admin());
