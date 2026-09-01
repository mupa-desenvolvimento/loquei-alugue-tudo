import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Notification } from "@/types/database";

/** Mensagens que a administração enviou para o usuário logado. */
export function useMyNotifications(userId: string | undefined) {
  return useQuery<Notification[]>({
    queryKey: ["notifications", userId],
    enabled: Boolean(userId) && isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase!
        .from("notifications")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as Notification[];
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase!
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
