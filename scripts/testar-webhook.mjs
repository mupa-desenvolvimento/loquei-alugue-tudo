/**
 * Exercita o portão de assinatura do webhook-mercadopago.
 *
 * Testa o caminho crítico de segurança sem mover dinheiro: usa um id de
 * pagamento inexistente, então mesmo o caso de assinatura válida para em
 * "pagamento não encontrado" — depois de já ter provado que a assinatura
 * passou. Nenhuma promoção é liberada.
 *
 * O que cada caso deve produzir em `payment_events`:
 *
 *   sem assinatura      -> signature_ok=false, outcome='recusado'
 *   assinatura torta    -> signature_ok=false, outcome='recusado'
 *   segredo errado      -> signature_ok=false, outcome='recusado'
 *   ts fora da janela   -> signature_ok=false, outcome='recusado'
 *   sem data.id         -> outcome='ignorado'
 *   assinatura válida   -> signature_ok=true,  outcome='erro' (id inexistente)
 *
 * Só a última linha prova que o segredo configurado na função é o mesmo que
 * você tem em mãos. As outras provam que a recusa funciona.
 *
 * Uso (o segredo nunca entra na linha de comando, para não ficar no histórico):
 *
 *   export SUPABASE_URL="https://xxxx.supabase.co"
 *   export MERCADOPAGO_WEBHOOK_SECRET="..."
 *   node scripts/testar-webhook.mjs
 *
 * Sem rede, só para conferir o próprio assinador:
 *
 *   node scripts/testar-webhook.mjs --selfcheck
 */

const HEX = (buf) =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

/** Mesmo manifesto que a Edge Function monta. */
const manifesto = (dataId, requestId, ts) =>
  `id:${dataId};request-id:${requestId};ts:${ts};`;

async function assinar(secret, dataId, requestId, ts) {
  const chave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const assinado = await crypto.subtle.sign(
    "HMAC",
    chave,
    new TextEncoder().encode(manifesto(dataId, requestId, ts)),
  );
  return HEX(assinado);
}

/**
 * Reimplementa a verificação da Edge Function, para provar que o assinador
 * daqui produz algo que ela aceitaria — sem depender da rede.
 */
async function verificarComoAFuncao(secret, headers, dataId) {
  const assinatura = headers["x-signature"];
  const requestId = headers["x-request-id"];
  if (!assinatura) return { valida: false, motivo: "sem cabeçalho x-signature" };
  if (!requestId) return { valida: false, motivo: "sem cabeçalho x-request-id" };

  const partes = Object.fromEntries(
    assinatura.split(",").map((p) => p.split("=").map((s) => s.trim())),
  );
  const { ts, v1 } = partes;
  if (!ts || !v1) return { valida: false, motivo: "x-signature malformado" };

  const idadeMinutos = (Date.now() - Number(ts) * 1000) / 60000;
  if (!Number.isFinite(idadeMinutos) || Math.abs(idadeMinutos) > 10) {
    return { valida: false, motivo: `fora da janela (${idadeMinutos.toFixed(0)} min)` };
  }

  const esperado = await assinar(secret, dataId, requestId, ts);
  return esperado === v1
    ? { valida: true, motivo: "" }
    : { valida: false, motivo: "assinatura não confere" };
}

// --------------------------------------------------------------- selfcheck
async function selfcheck() {
  const secret = "segredo-de-teste-nao-usar-em-producao";
  const dataId = "1234567890";
  const requestId = "req-abc-123";
  const agora = Math.floor(Date.now() / 1000);

  const casos = [];

  const v1 = await assinar(secret, dataId, requestId, agora);
  casos.push([
    "assinatura recém-gerada é aceita",
    await verificarComoAFuncao(secret, { "x-signature": `ts=${agora},v1=${v1}`, "x-request-id": requestId }, dataId),
    true,
  ]);

  casos.push([
    "segredo diferente é recusado",
    await verificarComoAFuncao("outro-segredo", { "x-signature": `ts=${agora},v1=${v1}`, "x-request-id": requestId }, dataId),
    false,
  ]);

  casos.push([
    "data.id diferente é recusado",
    await verificarComoAFuncao(secret, { "x-signature": `ts=${agora},v1=${v1}`, "x-request-id": requestId }, "9999"),
    false,
  ]);

  const velho = agora - 20 * 60;
  const v1Velho = await assinar(secret, dataId, requestId, velho);
  casos.push([
    "ts de 20 min atrás é recusado",
    await verificarComoAFuncao(secret, { "x-signature": `ts=${velho},v1=${v1Velho}`, "x-request-id": requestId }, dataId),
    false,
  ]);

  casos.push([
    "x-signature sem v1 é recusado",
    await verificarComoAFuncao(secret, { "x-signature": `ts=${agora}`, "x-request-id": requestId }, dataId),
    false,
  ]);

  casos.push([
    "sem x-request-id é recusado",
    await verificarComoAFuncao(secret, { "x-signature": `ts=${agora},v1=${v1}` }, dataId),
    false,
  ]);

  console.log("\n  SELFCHECK DO ASSINADOR (sem rede)\n");
  let falhas = 0;
  for (const [nome, resultado, esperado] of casos) {
    const ok = resultado.valida === esperado;
    if (!ok) falhas++;
    const marca = ok ? "OK  " : "FALHA";
    const extra = resultado.motivo ? `  (${resultado.motivo})` : "";
    console.log(`  ${marca}  ${nome}${extra}`);
  }
  console.log(`\n  ${casos.length - falhas}/${casos.length} passaram\n`);
  process.exit(falhas ? 1 : 0);
}

// ------------------------------------------------------------- teste real
async function chamar(url, corpo, headers) {
  const inicio = Date.now();
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "user-agent": "bisao-teste-webhook", ...headers },
      body: JSON.stringify(corpo),
    });
    const texto = await r.text();
    return { status: r.status, corpo: texto.slice(0, 240), ms: Date.now() - inicio };
  } catch (erro) {
    return { status: 0, corpo: String(erro), ms: Date.now() - inicio };
  }
}

async function testarRemoto() {
  const base = process.env.SUPABASE_URL;
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

  if (!base) {
    console.error("\n  Falta SUPABASE_URL. Exemplo:\n    export SUPABASE_URL=\"https://xxxx.supabase.co\"\n");
    process.exit(2);
  }
  if (!secret) {
    console.error("\n  Falta MERCADOPAGO_WEBHOOK_SECRET (o mesmo configurado na função).\n");
    process.exit(2);
  }

  const url = `${base.replace(/\/+$/, "")}/functions/v1/webhook-mercadopago`;
  // Id inexistente de propósito: a consulta ao provedor falha e nada é
  // liberado, mesmo quando a assinatura passa.
  const dataId = process.env.DATA_ID ?? "000000000000";
  const requestId = `teste-${Date.now()}`;
  const agora = Math.floor(Date.now() / 1000);
  const corpo = { type: "payment", data: { id: dataId } };

  const valida = await assinar(secret, dataId, requestId, agora);
  const velho = agora - 20 * 60;
  const validaVelha = await assinar(secret, dataId, requestId, velho);

  const casos = [
    ["sem x-signature", corpo, { "x-request-id": requestId }, "recusado"],
    ["x-signature malformado", corpo, { "x-signature": "lixo", "x-request-id": requestId }, "recusado"],
    ["assinado com segredo errado", corpo,
      { "x-signature": `ts=${agora},v1=${"0".repeat(64)}`, "x-request-id": requestId }, "recusado"],
    ["ts fora da janela (20 min)", corpo,
      { "x-signature": `ts=${velho},v1=${validaVelha}`, "x-request-id": requestId }, "recusado"],
    ["sem data.id", { type: "payment" }, { "x-signature": `ts=${agora},v1=${valida}`, "x-request-id": requestId }, "ignorado"],
    ["ASSINATURA VÁLIDA (id inexistente)", corpo,
      { "x-signature": `ts=${agora},v1=${valida}`, "x-request-id": requestId }, "aceita a assinatura"],
  ];

  console.log(`\n  TESTE DO WEBHOOK\n  ${url}\n  data.id de teste: ${dataId}\n`);

  for (const [nome, body, headers, esperado] of casos) {
    const r = await chamar(url, body, headers);
    console.log(`  ${nome}`);
    console.log(`     esperado: ${esperado}`);
    console.log(`     HTTP ${r.status} em ${r.ms}ms  ->  ${r.corpo}`);
    console.log("");
  }

  console.log("  Agora confira a trilha no Supabase (SQL Editor):");
  console.log("    select received_at, event_type, data_id, signature_ok, outcome, detail");
  console.log("      from payment_events order by received_at desc limit 10;\n");
  console.log("  A última chamada deve aparecer com signature_ok = true.");
  console.log("  Se TODAS vierem com signature_ok = false, o segredo da função");
  console.log("  não é o que você exportou aqui.\n");
}

if (process.argv.includes("--selfcheck")) {
  await selfcheck();
} else {
  await testarRemoto();
}
