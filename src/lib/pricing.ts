import { parseISO } from "date-fns";

/**
 * Regras de preço da Loquei, num lugar só.
 *
 * O que a plataforma cobra:
 * - taxa de serviço do locatário (SERVICE_FEE_RATE) — receita da Loquei;
 * - proteção do item (PROTECTION_RATE) — cobre dano/roubo até o valor da caução;
 * - comissão do locador (OWNER_COMMISSION_RATE), descontada do repasse.
 *
 * A caução é bloqueada, não cobrada: volta ao locatário se o item retornar ok.
 */
export const SERVICE_FEE_RATE = 0.12;
export const PROTECTION_RATE = 0.08;
export const OWNER_COMMISSION_RATE = 0.1;

export interface PriceBreakdown {
  days: number;
  dailyPrice: number;
  subtotal: number;
  serviceFee: number;
  insuranceFee: number;
  deposit: number;
  /** O que o locatário paga agora (sem a caução, que é bloqueio). */
  total: number;
  /** O que o locador recebe depois da devolução. */
  ownerPayout: number;
}

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Dias cobrados; a diária mínima é 1, e o dia de devolução não conta.
 *
 * Strings "aaaa-mm-dd" passam por `parseISO` de propósito: `new Date("2026-09-10")`
 * seria lido como meia-noite UTC e, em fusos negativos como o do Brasil, cairia
 * no dia anterior.
 */
export function countDays(start: Date | string, end: Date | string): number {
  const a = typeof start === "string" ? parseISO(start) : start;
  const b = typeof end === "string" ? parseISO(end) : end;
  const ms = b.getTime() - a.getTime();
  return Math.max(1, Math.round(ms / 86_400_000));
}

export function calculatePrice(
  dailyPrice: number,
  days: number,
  deposit = 0,
): PriceBreakdown {
  const subtotal = round(dailyPrice * days);
  const serviceFee = round(subtotal * SERVICE_FEE_RATE);
  const insuranceFee = round(subtotal * PROTECTION_RATE);

  return {
    days,
    dailyPrice,
    subtotal,
    serviceFee,
    insuranceFee,
    deposit,
    total: round(subtotal + serviceFee + insuranceFee),
    ownerPayout: round(subtotal * (1 - OWNER_COMMISSION_RATE)),
  };
}

export const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
