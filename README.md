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
2. No **SQL Editor**, rode **em ordem** todos os arquivos de `supabase/migrations/`:
   - `0001_init.sql` — tabelas, triggers, RLS e o bucket de imagens;
   - `0002_search_unaccent.sql` — busca que ignora acentos;
   - `0003_admin_and_categories.sql` — papel de admin, 12 categorias, notificações;
   - `0004_fix_admin_bootstrap.sql` — correção que permite criar o primeiro admin;
   - `0005_banners_and_monetization.sql` — banners e produtos pagos;
   - `0006_fix_promotion_privileges.sql` — impede obter promoção sem pagar;
   - `0007_agendar_expiracao.sql` — encerra promoções vencidas de hora em hora.
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

### Login com Google e Facebook

Os botões de login social aparecem **apenas** quando o provedor está habilitado
no projeto — o app consulta `/auth/v1/settings` e esconde o que não funciona.
Enquanto nenhum estiver ligado, a tela mostra só o login por email.

Para habilitar:

1. Crie as credenciais OAuth no provedor:
   - **Google**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials) →
     *Create credentials* → *OAuth client ID* → tipo *Web application*.
   - **Facebook**: [Meta for Developers](https://developers.facebook.com/apps) →
     novo app → produto *Facebook Login*.
2. Em ambos, registre como URI de redirecionamento autorizada:
   `https://<seu-projeto>.supabase.co/auth/v1/callback`
3. No Supabase, em **Authentication → Sign In / Providers**, ative o provedor e
   cole o *Client ID* e o *Client Secret*.
4. Ainda em **Authentication → URL Configuration**, inclua as URLs do app
   (`http://localhost:8080` e o domínio de produção) em *Redirect URLs*.

O `Client Secret` fica só no Supabase — nunca no `.env` do front.

Quem entra por login social cai no perfil `locatario` por padrão, já que o
provedor não informa se a pessoa quer alugar ou anunciar.

### Pagamentos (Mercado Pago)

A cobrança das promoções roda em duas Edge Functions, e não no front: o
`ACCESS_TOKEN` do Mercado Pago move dinheiro e nunca pode ir para o bundle.

```bash
npx supabase login
npx supabase link --project-ref <seu-project-ref>

npx supabase secrets set MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
npx supabase secrets set MERCADOPAGO_WEBHOOK_SECRET=...
npx supabase secrets set SITE_URL=https://seu-dominio.com.br

npx supabase functions deploy criar-pagamento
npx supabase functions deploy webhook-mercadopago --no-verify-jwt
```

O `--no-verify-jwt` no webhook é obrigatório: quem chama é o Mercado Pago, que
não tem sessão de usuário. A autenticação dele é a assinatura `x-signature`,
conferida dentro da função.

No painel do Mercado Pago, em **Suas integrações → Webhooks**, aponte para
`https://<projeto>.supabase.co/functions/v1/webhook-mercadopago`, marque o
evento de **pagamentos** e copie a chave secreta gerada para o
`MERCADOPAGO_WEBHOOK_SECRET`.

Comece com as credenciais de **teste** — o checkout devolve `sandbox_init_point`
e nenhum dinheiro real circula.

O projeto também declara o [MCP Server do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/mcp-server/overview)
em `.mcp.json`. Ele serve para consultar a documentação, criar usuários de
teste, configurar webhooks e medir a qualidade da integração direto do editor.
Exige um cliente com MCP e autenticação por OAuth:

```bash
claude mcp add --transport http mercadopago https://mcp.mercadopago.com/mcp
```

### O que é vendido

| Produto | Efeito |
| --- | --- |
| Destaque (7 ou 15 dias) | O anúncio sobe em toda a busca e ganha selo |
| Topo da categoria | Primeiro lugar só dentro da categoria do item |
| Banner na home | Espaço no carrossel, com período e link próprios |
| Plano Pro | Comissão de 5% em vez de 10%, por 30 dias |

Preços e textos ficam na tabela `promotion_plans` e são editáveis pelo painel,
sem mexer no código.

Nada disso é liberado pelo cliente: a promoção nasce como `pending`, e só o
webhook (ou um admin, para pagamento fora da plataforma) chama
`activate_promotion`. Triggers impedem que o dono do anúncio escreva
`featured_until` ou vire Pro por conta própria.

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
| `banners` | Carrossel da home, editorial ou patrocinado, com período de exibição. |
| `promotion_plans` | Produtos à venda: destaque, topo de categoria, banner, Pro. |
| `promotions` | Contratações e seu estado de pagamento. |

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

- **Cobrança da locação.** O gateway já cobra as promoções, mas o checkout de
  aluguel ainda só cria a reserva, sem cobrar.
- **Mensagens.** As tabelas existem; a página `/mensagens` ainda usa dados de exemplo.
- **Mapa.** A busca e a página do item mostram um placeholder no lugar do mapa.
- **Verificação de identidade** e **conta bancária do locador**.
- **Login social.** O código está pronto; falta criar as credenciais no Google e
  no Facebook e ativá-las no Supabase (ver acima).
