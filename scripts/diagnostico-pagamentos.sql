-- Diagnóstico do fluxo de pagamento. Rode no SQL Editor do Supabase.
-- Só leitura: nenhuma consulta aqui altera dados.

-- ============================================================ 1. O portão
-- O webhook recusou alguma coisa? Se houver linhas com signature_ok = false,
-- ou o segredo está errado, ou alguém está batendo na URL sem credencial.
select received_at, event_type, data_id, signature_ok, outcome, detail
  from public.payment_events
 order by received_at desc
 limit 20;

-- Resumo por desfecho: dá o formato do problema em uma olhada.
select outcome,
       count(*)                                as total,
       count(*) filter (where signature_ok)     as com_assinatura_ok,
       count(*) filter (where not signature_ok) as com_assinatura_ruim,
       max(received_at)                         as mais_recente
  from public.payment_events
 group by outcome
 order by total desc;

-- ==================================================== 2. Contratações presas
-- Pendente há mais de 30 min com o provedor já registrado significa que o
-- checkout abriu e a notificação não chegou (ou foi recusada).
select p.id,
       p.plan_slug,
       p.amount,
       p.status,
       p.provider,
       p.provider_ref,
       p.created_at,
       round(extract(epoch from (now() - p.created_at)) / 60) as minutos_parada,
       (select count(*) from public.payment_events e where e.promotion_id = p.id) as eventos
  from public.promotions p
 where p.status = 'pending'
   and p.created_at < now() - interval '30 minutes'
 order by p.created_at desc;

-- =============================================== 3. Valor cobrado x tabelado
-- IMPORTANTE: `promotions.amount` vem do cliente. A RLS de insert confere
-- user_id e status, mas não confere o preço contra o plano. Qualquer linha
-- aqui é uma contratação que pagou (ou pagaria) diferente do tabelado.
select p.id,
       p.plan_slug,
       p.amount        as cobrado,
       pl.price        as tabelado,
       p.amount - pl.price as diferenca,
       p.status,
       p.created_at
  from public.promotions p
  join public.promotion_plans pl on pl.slug = p.plan_slug
 where p.amount <> pl.price
 order by p.created_at desc;

-- ================================================ 4. Liberação sem pagamento
-- Promoção ativa sem paid_at, ou sem evento de liberação registrado.
-- Deveria vir vazio.
select p.id, p.plan_slug, p.status, p.amount, p.paid_at, p.provider_ref
  from public.promotions p
 where p.status in ('paid', 'active')
   and (p.paid_at is null or p.provider_ref is null)
 order by p.created_at desc;

-- ===================================================== 5. Liberação duplicada
-- Mais de um evento 'liberado' para a mesma contratação indica reentrega de
-- webhook que passou pela checagem de status. Para plano 'pro' isso soma
-- prazo duas vezes.
select promotion_id, count(*) as liberacoes, min(received_at) as primeira, max(received_at) as ultima
  from public.payment_events
 where outcome = 'liberado' and promotion_id is not null
 group by promotion_id
having count(*) > 1;

-- ================================================= 6. Agendamento da expiração
select jobid, schedule, jobname, active
  from cron.job
 where command ilike '%expire_promotions%';

-- Últimas execuções do agendamento.
select j.jobname, r.status, r.start_time, r.return_message
  from cron.job_run_details r
  join cron.job j on j.jobid = r.jobid
 where j.command ilike '%expire_promotions%'
 order by r.start_time desc
 limit 10;
