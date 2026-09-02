/**
 * Abre um checkout do Mercado Pago para uma contratação pendente.
 *
 * Roda no servidor porque usa o MERCADOPAGO_ACCESS_TOKEN. Esse token move
 * dinheiro: se fosse para o bundle do front, qualquer visitante o leria.
 *
 * Fluxo: o cliente cria a `promotion` como 'pending' (o RLS não deixa nascer
 * paga) e chama esta função. Quem confirma o pagamento é o webhook.
 */
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (corpo: unknown, status = 200) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    if (!accessToken) return json({ error: "Pagamento não configurado" }, 500);

    const authorization = req.headers.get("Authorization");
    if (!authorization) return json({ error: "Não autenticado" }, 401);

    const { promotion_id } = await req.json();
    if (!promotion_id) return json({ error: "promotion_id é obrigatório" }, 400);

    // Cliente com o token de quem chamou: o RLS continua valendo, então
    // ninguém consegue pagar (nem ler) a contratação de outra pessoa.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authorization } } },
    );

    const { data: usuario } = await supabase.auth.getUser();
    if (!usuario.user) return json({ error: "Não autenticado" }, 401);

    const { data: promocao, error } = await supabase
      .from("promotions")
      .select("id, amount, status, user_id, plan:promotion_plans!promotions_plan_slug_fkey (name)")
      .eq("id", promotion_id)
      .maybeSingle();

    if (error || !promocao) return json({ error: "Contratação não encontrada" }, 404);
    if (promocao.user_id !== usuario.user.id) return json({ error: "Contratação de outro usuário" }, 403);
    if (promocao.status !== "pending") return json({ error: "Esta contratação já foi processada" }, 409);

    const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:8080";
    const plano = (promocao.plan as { name?: string } | null)?.name ?? "Promoção Loquei";

    const resposta = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        // Evita cobrar duas vezes se a chamada for repetida.
        "X-Idempotency-Key": promocao.id,
      },
      body: JSON.stringify({
        items: [{
          id: promocao.id,
          title: plano,
          quantity: 1,
          currency_id: "BRL",
          unit_price: Number(promocao.amount),
        }],
        payer: { email: usuario.user.email },
        // Volta para a plataforma sabendo o que aconteceu.
        back_urls: {
          success: `${siteUrl}/painel-locador?pagamento=sucesso`,
          pending: `${siteUrl}/painel-locador?pagamento=pendente`,
          failure: `${siteUrl}/painel-locador?pagamento=falhou`,
        },
        auto_return: "approved",
        // Amarra a preferência à contratação: o webhook usa isto para saber
        // qual promoção liberar.
        external_reference: promocao.id,
        notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/webhook-mercadopago`,
        statement_descriptor: "LOQUEI",
      }),
    });

    const preferencia = await resposta.json();
    if (!resposta.ok) {
      console.error("Mercado Pago recusou a preferência:", preferencia);
      return json({ error: "Não foi possível abrir o pagamento" }, 502);
    }

    await supabase
      .from("promotions")
      .update({ provider: "mercadopago", provider_ref: preferencia.id })
      .eq("id", promocao.id);

    // `sandbox_init_point` só existe com credencial de teste.
    return json({ checkout_url: preferencia.init_point ?? preferencia.sandbox_init_point });
  } catch (erro) {
    console.error(erro);
    return json({ error: "Erro inesperado" }, 500);
  }
});
