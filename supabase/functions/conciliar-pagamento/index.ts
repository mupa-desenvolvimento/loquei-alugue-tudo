/**
 * Confere no Mercado Pago o que aconteceu com as contratações pendentes e
 * libera as que já foram pagas.
 *
 * O webhook é o caminho normal, mas notificação se perde: provedor fora do
 * ar, webhook mal configurado, falha de rede. Sem uma segunda via, o cliente
 * paga e fica esperando -- foi exatamente o que aconteceu aqui.
 *
 * Aqui a fonte da verdade é a API do Mercado Pago, consultada com o nosso
 * token: não confiamos em nada que venha do cliente. Por isso esta função
 * pode liberar a promoção com segurança, mesmo sem assinatura de webhook.
 *
 * Só administradores chamam. Serve também de diagnóstico: devolve o que o
 * provedor respondeu para cada contratação.
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

    // Confere que quem chamou é admin, usando o token de quem chamou.
    const comoUsuario = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authorization } } },
    );
    const { data: sessao } = await comoUsuario.auth.getUser();
    if (!sessao.user) return json({ error: "Não autenticado" }, 401);

    const { data: perfil } = await comoUsuario
      .from("profiles").select("role").eq("id", sessao.user.id).maybeSingle();
    if (perfil?.role !== "admin") return json({ error: "Só administradores" }, 403);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Diagnóstico de ambiente: a qual conta pertence o token configurado.
    const conta = await fetch("https://api.mercadopago.com/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((r) => r.json()).catch(() => null);

    const { data: pendentes } = await admin
      .from("promotions")
      .select("id, amount, status, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(50);

    const relatorio = [];

    for (const promocao of pendentes ?? []) {
      // Procura no Mercado Pago qualquer pagamento amarrado a esta contratação.
      const busca = await fetch(
        `https://api.mercadopago.com/v1/payments/search?external_reference=${promocao.id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      ).then((r) => r.json()).catch((e) => ({ erro: String(e) }));

      const pagamentos = (busca?.results ?? []) as Array<Record<string, unknown>>;
      const aprovado = pagamentos.find((p) => p.status === "approved");

      const item: Record<string, unknown> = {
        promocao: promocao.id,
        valor_devido: promocao.amount,
        pagamentos_encontrados: pagamentos.length,
        status_no_provedor: pagamentos.map((p) => p.status),
      };

      if (aprovado) {
        const pago = Number(aprovado.transaction_amount);
        if (pago + 0.01 < Number(promocao.amount)) {
          item.resultado = `pago ${pago} e devido ${promocao.amount}: nao liberado`;
        } else {
          await admin.from("promotions").update({
            status: "paid",
            paid_at: new Date().toISOString(),
            provider: "mercadopago",
            provider_ref: String(aprovado.id),
          }).eq("id", promocao.id);

          const { error } = await admin.rpc("activate_promotion", { promotion_id: promocao.id });

          await admin.from("payment_events").insert({
            event_type: "conciliacao",
            data_id: String(aprovado.id),
            promotion_id: promocao.id,
            signature_ok: null,
            outcome: error ? "erro" : "liberado",
            detail: error
              ? `falha ao liberar: ${error.message}`
              : `conciliado com o provedor: pagamento aprovado de ${pago}`,
          });

          item.resultado = error ? `erro ao liberar: ${error.message}` : "liberado";
        }
      } else {
        item.resultado = pagamentos.length
          ? "encontrado, mas nenhum aprovado"
          : "nenhum pagamento no provedor";
      }

      relatorio.push(item);
    }

    return json({
      conta_do_token: conta
        ? { id: conta.id, apelido: conta.nickname, site: conta.site_id, email: conta.email }
        : "nao consegui consultar",
      pendentes: pendentes?.length ?? 0,
      relatorio,
    });
  } catch (erro) {
    console.error(erro);
    return json({ error: String(erro) }, 500);
  }
});
