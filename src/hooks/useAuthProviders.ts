import { useQuery } from "@tanstack/react-query";
import { isSupabaseConfigured } from "@/lib/supabase";

/**
 * Descobre quais logins sociais estão de fato habilitados no projeto.
 *
 * O endpoint `/auth/v1/settings` é público e devolve a lista de provedores
 * ativos. Consultamos porque um botão "Continuar com Google" que leva a um
 * erro é pior do que não ter o botão: é o primeiro clique de quem chega.
 */
export type SocialProvider = "google" | "facebook";

export function useAuthProviders() {
  return useQuery<SocialProvider[]>({
    queryKey: ["auth-providers"],
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      if (!isSupabaseConfigured) return [];

      const url = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      try {
        const res = await fetch(`${url}/auth/v1/settings`, {
          headers: { apikey: anonKey },
        });
        if (!res.ok) return [];

        const settings = (await res.json()) as { external?: Record<string, boolean> };
        return (["google", "facebook"] as SocialProvider[]).filter(
          (provider) => settings.external?.[provider],
        );
      } catch {
        // Sem rede ou projeto fora do ar: some com os botões em vez de
        // oferecer um caminho que não vai funcionar.
        return [];
      }
    },
  });
}
