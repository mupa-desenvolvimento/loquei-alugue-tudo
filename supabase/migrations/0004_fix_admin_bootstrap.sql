-- Corrige o trigger da migração 0003, que impedia criar o primeiro admin.
--
-- O trigger revertia `role` sempre que quem editava não fosse admin. Só que
-- ele também roda nos comandos do SQL Editor e da service_role, onde
-- `auth.uid()` é NULL — então o UPDATE de promoção dizia "sucesso" e não
-- mudava nada, e nunca havia como ter o primeiro admin.
--
-- Agora o trigger só protege as colunas quando existe um usuário autenticado.
-- Isso não abre brecha: uma requisição anônima pela API nem chega no trigger,
-- porque a policy `profiles_update` exige `auth.uid() = id`, e uid nulo nunca
-- casa. `auth.uid()` nulo significa conexão de servidor, que já tem acesso
-- total ao banco de qualquer maneira.

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
  end if;
  return new;
end;
$$;

-- ============================================ PROMOVA SEU USUÁRIO AQUI
-- Cadastre-se no app com o seu email ANTES de rodar isto: a linha em
-- `profiles` só nasce no cadastro, e um UPDATE sem linha não faz nada.
--
-- Confira se pegou (tem que voltar 'admin'):
--   select email, role from public.profiles where email = 'voce@exemplo.com';

-- update public.profiles set role = 'admin' where email = 'voce@exemplo.com';
