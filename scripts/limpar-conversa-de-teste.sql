-- Remove a conversa que eu criei para testar o chat.
--
-- Não dá para fazer pela API: `conversations` não tem policy de delete, de
-- propósito -- histórico de conversa não deveria sumir porque um dos lados
-- apertou um botão. Rode uma vez e apague este arquivo.

delete from public.messages     where conversation_id = '5204f3eb-2d5c-44b9-afd6-c8d08eb7b9ba';
delete from public.conversations where id = '5204f3eb-2d5c-44b9-afd6-c8d08eb7b9ba';

select (select count(*) from public.conversations) as conversas,
       (select count(*) from public.messages)      as mensagens;
