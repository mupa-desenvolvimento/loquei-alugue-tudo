import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured, requireSupabase } from "@/lib/supabase";
import type { Listing, Promotion, PromotionPlan } from "@/types/database";

export interface PromotionWithPlan extends Promotion {
  plan: Pick<PromotionPlan, "slug" | "name" | "kind" | "duration_days"> | null;
  listing: Pick<Listing, "id" | "title"> | null;
}

export function usePromotionPlans() {
  return useQuery<PromotionPlan[]>({
    queryKey: ["promotion-plans"],
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      if (!isSupabaseConfigured) return [];
      const { data, error } = await supabase!
        .from("promotion_plans")
        .select("*")
        .eq("active", true)
        .order("sort");
      if (error) throw error;
      return (data ?? []) as PromotionPlan[];
    },
  });
}

/** Contratações do usuário logado. */
export function useMyPromotions(userId: string | undefined) {
  return useQuery<PromotionWithPlan[]>({
    queryKey: ["promotions", userId],
    enabled: Boolean(userId) && isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase!
        .from("promotions")
        .select(`
          *,
          plan:promotion_plans!promotions_plan_slug_fkey (slug, name, kind, duration_days),
          listing:listings!promotions_listing_id_fkey (id, title)
        `)
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as PromotionWithPlan[];
    },
  });
}

export interface NovaPromocao {
  plan_slug: string;
  user_id: string;
  amount: number;
  listing_id?: string | null;
  banner_id?: string | null;
}

/**
 * Cria a contratação como `pending`. Quem confirma o pagamento e libera o
 * benefício é o webhook do provedor — o RLS impede o cliente de nascer paga.
 */
export function useCreatePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NovaPromocao) => {
      const { data, error } = await requireSupabase()
        .from("promotions")
        .insert({ ...input, status: "pending" })
        .select()
        .single();
      if (error) throw error;
      return data as Promotion;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["promotions"] }),
  });
}

export function useCancelPromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await requireSupabase()
        .from("promotions")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["promotions"] }),
  });
}

/**
 * Abre o checkout do Mercado Pago para uma contratação pendente.
 *
 * A Edge Function fala com o Mercado Pago usando o access token, que fica
 * só no servidor. O cliente recebe apenas a URL para onde redirecionar.
 */
export async function iniciarPagamento(promotionId: string): Promise<string> {
  const { data, error } = await requireSupabase().functions.invoke("criar-pagamento", {
    body: { promotion_id: promotionId },
  });
  if (error) throw error;

  const url = (data as { checkout_url?: string })?.checkout_url;
  if (!url) throw new Error("O provedor não devolveu o endereço de pagamento");
  return url;
}

// ------------------------------------------------------------ admin

export function useAdminPromotions() {
  return useQuery<PromotionWithPlan[]>({
    queryKey: ["admin", "promotions"],
    queryFn: async () => {
      const { data, error } = await requireSupabase()
        .from("promotions")
        .select(`
          *,
          plan:promotion_plans!promotions_plan_slug_fkey (slug, name, kind, duration_days),
          listing:listings!promotions_listing_id_fkey (id, title)
        `)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as unknown as PromotionWithPlan[];
    },
  });
}

export interface AdminRevenue {
  promotions_paid: number;
  promotions_pending: number;
  promotions_revenue: number;
  active_featured: number;
  pro_members: number;
  mrr: number;
}

export function useAdminRevenue() {
  return useQuery<AdminRevenue | null>({
    queryKey: ["admin", "revenue"],
    queryFn: async () => {
      const { data, error } = await requireSupabase().rpc("admin_revenue");
      if (error) throw error;
      return (data ?? null) as AdminRevenue | null;
    },
  });
}

/** Libera o benefício de uma contratação — usado quando o admin confirma na mão. */
export function useActivatePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const client = requireSupabase();
      const { error: erroPago } = await client
        .from("promotions")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("id", id);
      if (erroPago) throw erroPago;

      const { error } = await client.rpc("activate_promotion", { promotion_id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

/** Encerra o que passou da validade. */
export function useExpirePromotions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await requireSupabase().rpc("expire_promotions");
      if (error) throw error;
      return data as number;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export interface ItemConciliado {
  promocao: string;
  valor_devido: number;
  pagamentos_encontrados: number;
  status_no_provedor: string[];
  resultado: string;
}

export interface Conciliacao {
  conta_do_token: { id: number; apelido: string; site: string; email: string } | string;
  pendentes: number;
  relatorio: ItemConciliado[];
}

/**
 * Pergunta ao Mercado Pago o que houve com as contratações pendentes e
 * libera as que já foram pagas.
 *
 * Existe porque notificação se perde — provedor fora do ar, rede, webhook
 * mal configurado — e sem uma segunda via o cliente paga e fica esperando.
 */
export function useConciliarPagamentos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await requireSupabase()
        .functions.invoke("conciliar-pagamento", { body: {} });
      if (error) throw error;
      return data as Conciliacao;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export interface PaymentEvent {
  id: string;
  event_type: string | null;
  data_id: string | null;
  promotion_id: string | null;
  signature_ok: boolean | null;
  outcome: string;
  detail: string | null;
  received_at: string;
}

/** Últimas notificações recebidas do provedor — a trilha de auditoria. */
export function usePaymentEvents() {
  return useQuery<PaymentEvent[]>({
    queryKey: ["admin", "payment-events"],
    queryFn: async () => {
      const { data, error } = await requireSupabase()
        .from("payment_events")
        .select("id, event_type, data_id, promotion_id, signature_ok, outcome, detail, received_at")
        .order("received_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return (data ?? []) as PaymentEvent[];
    },
  });
}
