-- Encerra sozinho o que foi pago e venceu.
--
-- Ate aqui `expire_promotions()` so rodava quando o admin clicava no painel.
-- Sem alguem clicando, um destaque de 7 dias continuaria no topo da busca
-- indefinidamente -- entregando de graca o que foi vendido por prazo.

create extension if not exists pg_cron with schema extensions;

/*
 * De hora em hora. Destaques sao vendidos em dias, entao essa granularidade
 * basta: no pior caso o anuncio fica no topo 59 minutos a mais.
 *
 * A funcao roda sem usuario autenticado (auth.uid() nulo), o que a guarda
 * interna trata como chamada de servidor -- o mesmo caminho do webhook.
 */
select cron.unschedule('expirar-promocoes')
 where exists (select 1 from cron.job where jobname = 'expirar-promocoes');

select cron.schedule(
  'expirar-promocoes',
  '0 * * * *',
  $$select public.expire_promotions()$$
);

-- Para conferir o agendamento e as ultimas execucoes:
--
--   select jobid, jobname, schedule, active from cron.job;
--
--   select j.jobname, d.status, d.return_message, d.start_time
--     from cron.job_run_details d
--     join cron.job j using (jobid)
--    where j.jobname = 'expirar-promocoes'
--    order by d.start_time desc
--    limit 10;
