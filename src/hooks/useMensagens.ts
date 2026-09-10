import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured, requireSupabase } from "@/lib/supabase";
import type { Message, Profile, Listing } from "@/types/database";

export interface ConversaComContexto {
  id: string;
  listing_id: string | null;
  owner_id: string;
  renter_id: string;
  created_at: string;
  listing: Pick<Listing, "id" | "title" | "images"> | null;
  owner: Pick<Profile, "id" | "name" | "avatar_url"> | null;
  renter: Pick<Profile, "id" | "name" | "avatar_url"> | null;
}

const SELECT_CONVERSA = `
  id, listing_id, owner_id, renter_id, created_at,
  listing:listings!conversations_listing_id_fkey (id, title, images),
  owner:profiles!conversations_owner_id_fkey (id, name, avatar_url),
  renter:profiles!conversations_renter_id_fkey (id, name, avatar_url)
`;

/**
 * Conversas de quem está logado.
 *
 * O RLS já limita às conversas em que a pessoa é locador ou locatário, então
 * não filtramos por usuário aqui — o banco faz isso.
 */
export function useConversas(userId: string | undefined) {
  return useQuery<ConversaComContexto[]>({
    queryKey: ["conversas", userId],
    enabled: Boolean(userId) && isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase!
        .from("conversations")
        .select(SELECT_CONVERSA)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as ConversaComContexto[];
    },
  });
}

export interface MensagemComAutor extends Message {
  sender: Pick<Profile, "id" | "name" | "avatar_url"> | null;
}

export function useMensagens(conversaId: string | undefined) {
  return useQuery<MensagemComAutor[]>({
    queryKey: ["mensagens", conversaId],
    enabled: Boolean(conversaId) && isSupabaseConfigured,
    // Sem realtime configurado, uma consulta periódica basta enquanto a
    // conversa está aberta. `refetchIntervalInBackground` fica falso: aba
    // escondida não precisa buscar.
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    queryFn: async () => {
      const { data, error } = await supabase!
        .from("messages")
        .select(`*, sender:profiles!messages_sender_id_fkey (id, name, avatar_url)`)
        .eq("conversation_id", conversaId!)
        .order("created_at");
      if (error) throw error;
      return (data ?? []) as unknown as MensagemComAutor[];
    },
  });
}

export function useEnviarMensagem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      conversationId,
      senderId,
      body,
    }: {
      conversationId: string;
      senderId: string;
      body: string;
    }) => {
      const { error } = await requireSupabase()
        .from("messages")
        .insert({ conversation_id: conversationId, sender_id: senderId, body });
      if (error) throw error;
    },
    onSuccess: (_dados, variaveis) => {
      queryClient.invalidateQueries({ queryKey: ["mensagens", variaveis.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversas"] });
    },
  });
}

/**
 * Abre a conversa entre locatário e dono sobre um item, ou devolve a que já
 * existe. A restrição única em (listing_id, owner_id, renter_id) garante que
 * dois cliques não criem duas conversas.
 */
export function useAbrirConversa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      listingId,
      ownerId,
      renterId,
    }: {
      listingId: string;
      ownerId: string;
      renterId: string;
    }) => {
      const client = requireSupabase();

      const { data: existente } = await client
        .from("conversations")
        .select("id")
        .eq("listing_id", listingId)
        .eq("owner_id", ownerId)
        .eq("renter_id", renterId)
        .maybeSingle();

      if (existente) return existente.id as string;

      const { data, error } = await client
        .from("conversations")
        .insert({ listing_id: listingId, owner_id: ownerId, renter_id: renterId })
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversas"] }),
  });
}

/** Marca como lidas as mensagens que a outra pessoa mandou. */
export function useMarcarLidas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      const { error } = await requireSupabase()
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .neq("sender_id", userId)
        .is("read_at", null);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversas"] }),
  });
}
