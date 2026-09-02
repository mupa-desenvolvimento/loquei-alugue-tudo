/**
 * Recebe as notificações do Mercado Pago e libera o que foi pago.
 *
 * Este é o único caminho que marca uma contratação como paga. Por isso duas
 * regras valem aqui e em nenhum outro lugar:
 *
 * 1. a assinatura do Mercado Pago é conferida antes de qualquer coisa — sem
 *    isso, qualquer pessoa que descobrisse a URL liberaria destaques de graça;
 * 2. o valor pago é lido da API do Mercado Pago, nunca do corpo recebido.
 *
 * Implante com `--no-verify-jwt`: quem chama é o Mercado Pago, que não tem
 * sessão de usuário.
 */
import { createClient } from "jsr:@supabase/supabase-js@2";

const ok = (corpo: unknown, status = 200) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { "Content-Type": "application/json" },
  });

/** Compara sem vazar, pelo tempo de resposta, quantos bytes bateram. */
function comparaSegura(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diferenca = 0;
  for (let i = 0; i < a.length; i++) diferenca |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diferenca === 0;
}

async function assinaturaConfere(req: Request, dataId: string): Promise<boolean> {
  const secret = Deno.env.get("MERCADOPAGO_WEBHOOK_SECRET");
  if (!secret) {
    console.error("MERCADOPAGO_WEBHOOK_SECRET ausente: recusando a notificação");
    return false;
  }

  const assinatura = req.headers.get("x-signature");
  const requestId = req.headers.get("x-request-id");
  if (!assinatura || !requestId) return false;

  // Formato: "ts=1700000000,v1=abc123..."
  const partes = Object.fromEntries(
    assinatura.split(",").map((p) => p.split("=").map((s) => s.trim())),
  ) as Record<string, string>;
  const { ts, v1 } = partes;
  if (!ts || !v1) return false;

  // Notificação muito antiga é replay: recusa.
  const idadeMinutos = (Date.now() - Number(ts) * 1000) / 60000;
  if (!Number.isFinite(idadeMinutos) || Math.abs(idadeMinutos) > 10) return false;

  const manifesto = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const chave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const assinado = await crypto.subtle.sign("HMAC", chave, new TextEncoder().encode(manifesto));
  const esperado = Array.from(new Uint8Array(assinado))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return comparaSegura(esperado, v1);
}

Deno.serve(async (req) => {
  try {
    const corpo = await req.json().catch(() => ({}));
    const dataId = String(corpo?.data?.id ?? "");

    if (!dataId) return ok({ ignorado: "sem data.id" });
    if (!(await assinaturaConfere(req, dataId))) {
      console.error("Assinatura inválida no webhook");
      return ok({ error: "assinatura inválida" }, 401);
    }

    // Só pagamento interessa; o Mercado Pago manda outros tipos de evento.
    if (corpo.type && corpo.type !== "payment") return ok({ ignorado: corpo.type });

    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN")!;
    const resposta = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!resposta.ok) {
      console.error("Não consegui consultar o pagamento", dataId);
      return ok({ error: "pagamento não encontrado" }, 404);
    }

    const pagamento = await resposta.json();
    const promotionId = pagamento.external_reference as string | undefined;
    if (!promotionId) return ok({ ignorado: "sem external_reference" });

    // service_role: precisa escrever em tabelas que o RLS fecha para todos.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: promocao } = await supabase
      .from("promotions")
      .select("id, amount, status")
      .eq("id", promotionId)
      .maybeSingle();

    if (!promocao) return ok({ ignorado: "contratação inexistente" });
    // Reentrega da mesma notificação não pode estender o prazo de novo.
    if (promocao.status !== "pending") return ok({ ignorado: `já estava ${promocao.status}` });

    if (pagamento.status !== "approved") {
      await supabase
        .from("promotions")
        .update({ provider: "mercadopago", provider_ref: String(dataId) })
        .eq("id", promotionId);
      return ok({ registrado: pagamento.status });
    }

    // O valor vem do Mercado Pago, não do que o cliente mandou.
    const pago = Number(pagamento.transaction_amount);
    if (pago + 0.01 < Number(promocao.amount)) {
      console.error(`Pagamento menor que o devido em ${promotionId}: ${pago} < ${promocao.amount}`);
      return ok({ error: "valor insuficiente" }, 400);
    }

    await supabase
      .from("promotions")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        provider: "mercadopago",
        provider_ref: String(dataId),
      })
      .eq("id", promotionId);

    const { error } = await supabase.rpc("activate_promotion", { promotion_id: promotionId });
    if (error) {
      console.error("Falha ao liberar a promoção", promotionId, error);
      return ok({ error: "falha ao liberar" }, 500);
    }

    return ok({ liberado: promotionId });
  } catch (erro) {
    console.error(erro);
    return ok({ error: "erro inesperado" }, 500);
  }
});
