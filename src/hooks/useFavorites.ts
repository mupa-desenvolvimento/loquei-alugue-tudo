import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { demoListings } from "@/data/demoListings";
import type { ListingWithOwner } from "@/types/database";

const DEMO_KEY = "loquei_demo_favorites";

const readDemo = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_KEY) || "[]");
  } catch {
    return [];
  }
};

/** Ids favoritados — barato o bastante para o coração de cada card consultar. */
export function useFavoriteIds(userId: string | undefined) {
  return useQuery<string[]>({
    queryKey: ["favorites", "ids", userId],
    queryFn: async () => {
      if (!isSupabaseConfigured) return readDemo();
      if (!userId) return [];
      const { data, error } = await supabase!
        .from("favorites")
        .select("listing_id")
        .eq("user_id", userId);
      if (error) throw error;
      return (data ?? []).map((row) => row.listing_id as string);
    },
  });
}

export function useFavoriteListings(userId: string | undefined) {
  return useQuery<ListingWithOwner[]>({
    queryKey: ["favorites", "listings", userId],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const ids = readDemo();
        return demoListings.filter((l) => ids.includes(l.id));
      }
      if (!userId) return [];

      const { data, error } = await supabase!
        .from("favorites")
        .select(`
          listing:listings!inner (
            *,
            owner:profiles!listings_owner_id_fkey (id, name, avatar_url, created_at),
            category:categories!listings_category_slug_fkey (slug, name, icon)
          )
        `)
        .eq("user_id", userId);
      if (error) throw error;

      return (data ?? [])
        .map((row) => (row as { listing: unknown }).listing)
        .filter(Boolean) as ListingWithOwner[];
    },
  });
}

export function useToggleFavorite(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, favorited }: { listingId: string; favorited: boolean }) => {
      if (!isSupabaseConfigured) {
        const ids = readDemo();
        const next = favorited ? ids.filter((id) => id !== listingId) : [...ids, listingId];
        localStorage.setItem(DEMO_KEY, JSON.stringify(next));
        return;
      }
      if (!userId) throw new Error("Entre na sua conta para salvar favoritos");

      const query = supabase!.from("favorites");
      const { error } = favorited
        ? await query.delete().eq("user_id", userId).eq("listing_id", listingId)
        : await query.insert({ user_id: userId, listing_id: listingId });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });
}
