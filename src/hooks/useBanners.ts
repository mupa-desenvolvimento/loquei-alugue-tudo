import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured, requireSupabase } from "@/lib/supabase";
import type { Banner } from "@/types/database";

/**
 * Banners do carrossel da home.
 *
 * O RLS já filtra por `active` e pela janela de exibição, então o que chega
 * aqui é o que pode aparecer. Um admin recebe todos, inclusive os agendados.
 */
export function useBanners() {
  return useQuery<Banner[]>({
    queryKey: ["banners"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      if (!isSupabaseConfigured) return [];
      const { data, error } = await supabase!
        .from("banners")
        .select("*")
        .eq("active", true)
        .order("position");
      if (error) throw error;
      return (data ?? []) as Banner[];
    },
  });
}

/** Todos os banners, para a tela de administração. */
export function useAllBanners() {
  return useQuery<Banner[]>({
    queryKey: ["banners", "admin"],
    queryFn: async () => {
      const { data, error } = await requireSupabase()
        .from("banners")
        .select("*")
        .order("position");
      if (error) throw error;
      return (data ?? []) as Banner[];
    },
  });
}

export type BannerInput = Partial<Banner> & { image_url: string; alt: string };

export function useSaveBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (banner: BannerInput) => {
      const client = requireSupabase();
      const payload = { ...banner, updated_at: new Date().toISOString() };

      const { error } = banner.id
        ? await client.from("banners").update(payload).eq("id", banner.id)
        : await client.from("banners").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banners"] }),
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await requireSupabase().from("banners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banners"] }),
  });
}

const BUCKET = "banners";

/** Envia a imagem do banner. A policy do bucket só aceita gravação de admin. */
export async function uploadBannerImage(file: File): Promise<string> {
  const client = requireSupabase();

  if (file.size > 8 * 1024 * 1024) throw new Error("A imagem passa de 8MB");
  if (!file.type.startsWith("image/")) throw new Error("O arquivo não é uma imagem");

  const extensao = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const chave = `${crypto.randomUUID()}.${extensao}`;

  const { error } = await client.storage.from(BUCKET).upload(chave, file, {
    contentType: file.type,
    cacheControl: "31536000",
  });
  if (error) throw error;

  return client.storage.from(BUCKET).getPublicUrl(chave).data.publicUrl;
}
