-- Permite marcar como lida a mensagem que a outra pessoa enviou.
--
-- A tabela `messages` nasceu na 0001 só com policies de select e insert.
-- Sem uma de update, o RLS recusa em silêncio: a chamada volta com sucesso e
-- zero linhas afetadas, e o contador de não lidas nunca zera.
--
-- Só quem recebeu pode marcar, e só o campo `read_at`: um trigger impede que
-- alguém edite o texto de uma mensagem já enviada, seja a própria ou a alheia.

create or replace function public.protect_message_content()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.pode_administrar() then
    new.body := old.body;
    new.sender_id := old.sender_id;
    new.conversation_id := old.conversation_id;
    new.created_at := old.created_at;
  end if;
  return new;
end;
$$;

drop trigger if exists messages_protect_content on public.messages;
create trigger messages_protect_content
  before update on public.messages
  for each row execute function public.protect_message_content();

drop policy if exists messages_update on public.messages;
create policy messages_update on public.messages for update
  using (
    -- participante da conversa, mas não o autor: quem lê é o destinatário
    sender_id <> auth.uid()
    and exists (
      select 1 from public.conversations c
       where c.id = conversation_id
         and (c.owner_id = auth.uid() or c.renter_id = auth.uid())
    )
  );

revoke execute on function public.protect_message_content() from public, anon, authenticated;
