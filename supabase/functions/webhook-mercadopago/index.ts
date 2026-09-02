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
 * Toda chamada é registrada em `payment_events`, inclusive as recusadas: sem
 * esse rastro, uma notificação perdida só aparece como uma contratação que
 * ficou 'pending' para sempre, sem dizer o motivo.
 *
 * Respondemos 200 mesmo quando recusamos. O Mercado Pago valida a URL ao
 * cadastrar o webhook e trata resposta de erro como endpoint quebrado --
 * chegando a não ativar a configuração. Isso não afrouxa nada: recusa
 * continua sendo recusa, nada é liberado, e o motivo fica no log. O status
 * HTTP é só o que o provedor enxerga.
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

const admin = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

/** Grava o que aconteceu; nunca deixa o registro derrubar a requisição. */
async function registrar(campos: Record<string, unknown>) {
  try {
    await admin().from("payment_events").insert(campos);
  } catch (erro) {
    console.error("nao consegui registrar o evento:", erro);
  }
}

/** Compara sem vazar, pelo tempo de resposta, quantos bytes bateram. */
function comparaSegura(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diferenca = 0;
  for (let i = 0; i < a.length; i++) diferenca |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diferenca === 0;
}

async function conferirAssinatura(
  req: Request,
  dataId: string,
): Promise<{ valida: boolean; motivo: string }> {
  const secret = Deno.env.get("MERCADOPAGO_WEBHOOK_SECRET");
  if (!secret) return { valida: false, motivo: "MERCADOPAGO_WEBHOOK_SECRET ausente" };

  const assinatura = req.headers.get("x-signature");
  const requestId = req.headers.get("x-request-id");
  if (!assinatura) return { valida: false, motivo: "sem cabeçalho x-signature" };
  if (!requestId) return { valida: false, motivo: "sem cabeçalho x-request-id" };

  // Formato: "ts=1700000000,v1=abc123..."
  const partes = Object.fromEntries(
    assinatura.split(",").map((p) => p.split("=").map((s) => s.trim())),
  ) as Record<string, string>;
  const { ts, v1 } = partes;
  if (!ts || !v1) return { valida: false, motivo: "x-signature malformado" };

  const idadeMinutos = (Date.now() - Number(ts) * 1000) / 60000;
  if (!Number.isFinite(idadeMinutos) || Math.abs(idadeMinutos) > 10) {
    return { valida: false, motivo: `notificação fora da janela (${idadeMinutos.toFixed(0)} min)` };
  }

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

  return comparaSegura(esperado, v1)
    ? { valida: true, motivo: "" }
    : { valida: false, motivo: "assinatura nao confere com o segredo configurado" };
}

Deno.serve(async (req) => {
  const cabecalhos = {
    "x-signature": req.headers.get("x-signature"),
    "x-request-id": req.headers.get("x-request-id"),
    "user-agent": req.headers.get("user-agent"),
  };

  try {
    const corpo = await req.json().catch(() => ({}));
    const dataId = String(corpo?.data?.id ?? "");
    const tipo = corpo?.type ?? corpo?.topic ?? null;

    if (!dataId) {
      await registrar({ event_type: tipo, outcome: "ignorado", detail: "sem data.id",
                        headers: cabecalhos });
      return ok({ ignorado: "sem data.id" });
    }

    const { valida, motivo } = await conferirAssinatura(req, dataId);
    if (!valida) {
      await registrar({ event_type: tipo, data_id: dataId, signature_ok: false,
                        outcome: "recusado", detail: motivo, headers: cabecalhos });
      console.error("assinatura invalida:", motivo);
      return ok({ recusado: "assinatura inválida" });
    }

    // Só pagamento interessa; o Mercado Pago manda outros tipos de evento.
    if (tipo && tipo !== "payment") {
      await registrar({ event_type: tipo, data_id: dataId, signature_ok: true,
                        outcome: "ignorado", detail: `tipo ${tipo}`, headers: cabecalhos });
      return ok({ ignorado: tipo });
    }

    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN")!;
    const resposta = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!resposta.ok) {
      await registrar({ event_type: tipo, data_id: dataId, signature_ok: true,
                        outcome: "erro", detail: `consulta ao pagamento falhou: ${resposta.status}`,
                        headers: cabecalhos });
      return ok({ recusado: "pagamento não encontrado" });
    }

    const pagamento = await resposta.json();
    const promotionId = pagamento.external_reference as string | undefined;
    if (!promotionId) {
      await registrar({ event_type: tipo, data_id: dataId, signature_ok: true,
                        outcome: "ignorado", detail: "pagamento sem external_reference",
                        headers: cabecalhos });
      return ok({ ignorado: "sem external_reference" });
    }

    const supabase = admin();
    const { data: promocao } = await supabase
      .from("promotions")
      .select("id, amount, status")
      .eq("id", promotionId)
      .maybeSingle();

    if (!promocao) {
      await registrar({ event_type: tipo, data_id: dataId, signature_ok: true,
                        outcome: "ignorado", detail: `contratação ${promotionId} não existe`,
                        headers: cabecalhos });
      return ok({ ignorado: "contratação inexistente" });
    }

    // Reentrega da mesma notificação não pode estender o prazo de novo.
    if (promocao.status !== "pending") {
      await registrar({ event_type: tipo, data_id: dataId, promotion_id: promotionId,
                        signature_ok: true, outcome: "ignorado",
                        detail: `já estava ${promocao.status}`, headers: cabecalhos });
      return ok({ ignorado: `já estava ${promocao.status}` });
    }

    if (pagamento.status !== "approved") {
      await supabase
        .from("promotions")
        .update({ provider: "mercadopago", provider_ref: String(dataId) })
        .eq("id", promotionId);
      await registrar({ event_type: tipo, data_id: dataId, promotion_id: promotionId,
                        signature_ok: true, outcome: "aguardando",
                        detail: `pagamento ${pagamento.status}`, headers: cabecalhos });
      return ok({ registrado: pagamento.status });
    }

    // O valor vem do Mercado Pago, não do que o cliente mandou.
    const pago = Number(pagamento.transaction_amount);
    if (pago + 0.01 < Number(promocao.amount)) {
      await registrar({ event_type: tipo, data_id: dataId, promotion_id: promotionId,
                        signature_ok: true, outcome: "recusado",
                        detail: `pago ${pago} < devido ${promocao.amount}`, headers: cabecalhos });
      return ok({ recusado: "valor insuficiente" });
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
      await registrar({ event_type: tipo, data_id: dataId, promotion_id: promotionId,
                        signature_ok: true, outcome: "erro",
                        detail: `falha ao liberar: ${error.message}`, headers: cabecalhos });
      console.error("Falha ao liberar a promoção", promotionId, error);
      return ok({ error: "falha ao liberar" }, 500);
    }

    await registrar({ event_type: tipo, data_id: dataId, promotion_id: promotionId,
                      signature_ok: true, outcome: "liberado",
                      detail: `pagamento aprovado de ${pago}`, headers: cabecalhos });
    return ok({ liberado: promotionId });
  } catch (erro) {
    await registrar({ outcome: "erro", detail: String(erro), headers: cabecalhos });
    console.error(erro);
    return ok({ error: "erro inesperado" }, 500);
  }
});
