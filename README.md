# Loquei

Marketplace peer-to-peer de aluguel de itens: quem tem uma furadeira parada anuncia,
quem precisa dela por um fim de semana aluga.

Stack: Vite + React + TypeScript + Tailwind + shadcn/ui, com Supabase (Postgres, Auth
e Storage) como backend.

## Rodando localmente

```bash
npm install
npm run dev
```

O app sobe em `http://localhost:8080` e funciona em **modo demo** sem nenhuma
configuração: dados de exemplo, login local, nada persistido. Serve para navegar pela
interface, não para uso real.

## Conectando o backend

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode na ordem os arquivos de `supabase/migrations/`:
   - `0001_init.sql` — tabelas, triggers, políticas de RLS e o bucket de imagens;
   - `0002_search_unaccent.sql` — busca que ignora acentos.
3. Copie `.env.example` para `.env` e preencha com os valores de **Project Settings → API**:

   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=...
   ```

4. Reinicie o `npm run dev`. O app detecta as variáveis e passa a usar o Supabase.

### Sobre segredos

Tudo com prefixo `VITE_` é embutido no bundle JavaScript e fica visível para qualquer
visitante. Só a URL e a chave **anon** podem ir para o `.env` — elas são públicas por
design, e quem protege os dados é o RLS definido nas migrações. `service_role`, chaves
de storage e credenciais de pagamento nunca entram no cliente.

## Modelo de dados

| Tabela | Papel |
| --- | --- |
| `profiles` | Espelha `auth.users`; dados públicos do usuário. Senha só existe em `auth.users`. |
| `categories` | Categorias fixas dos anúncios. |
| `listings` | Anúncios: preço/dia, caução, fotos, localização, status e nota média. |
| `bookings` | Reservas, do pedido à devolução (`pending → confirmed → active → returned`). |
| `reviews` | Avaliação por reserva; recalcula a nota do anúncio via trigger. |
| `favorites` | Itens salvos por usuário. |
| `conversations` / `messages` | Chat entre locador e locatário. |

RLS está ativo em todas as tabelas: anúncios ativos são públicos, reservas só aparecem
para as duas partes envolvidas, favoritos são privados e só quem alugou (e devolveu)
pode avaliar.

## Regras de preço

Centralizadas em [`src/lib/pricing.ts`](src/lib/pricing.ts):

- taxa de serviço do locatário: 12%
- proteção do item: 8%
- comissão do locador: 10%, descontada do repasse
- caução: bloqueada, não cobrada — volta se o item retornar sem danos

## O que ainda não existe

- **Pagamento.** O checkout cria a reserva, mas nenhum valor é cobrado — falta integrar
  um gateway (os dados de cartão devem ser coletados pelo provedor, nunca por uma tela nossa).
- **Mensagens.** As tabelas existem; a página `/mensagens` ainda usa dados de exemplo.
- **Mapa.** A busca e a página do item mostram um placeholder no lugar do mapa.
- **Verificação de identidade** e **conta bancária do locador**.
