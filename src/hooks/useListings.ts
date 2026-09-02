import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { demoListings, demoCategories } from "@/data/demoListings";
import type { Category, Listing, ListingWithOwner } from "@/types/database";

/** Colunas + joins que as telas de listagem/detalhe consomem. */
const SELECT = `
  *,
  owner:profiles!listings_owner_id_fkey (id, name, avatar_url, created_at),
  category:categories!listings_category_slug_fkey (slug, name, icon)
`;

export interface ListingFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  ownerId?: string;
}

/**
 * Minúsculas e sem acento, para que "camera" encontre "Câmera".
 * O equivalente no banco é a coluna gerada `search_text` (migração 0002).
 */
const normalize = (value: string) =>
  value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function applyDemoFilters(filters: ListingFilters): ListingWithOwner[] {
  const term = filters.q?.trim() ? normalize(filters.q.trim()) : undefined;
  return demoListings.filter((item) => {
    if (filters.category && filters.category !== "all" && item.category_slug !== filters.category) return false;
    if (filters.ownerId && item.owner_id !== filters.ownerId) return false;
    if (filters.minPrice != null && item.price_per_day < filters.minPrice) return false;
    if (filters.maxPrice != null && item.price_per_day > filters.maxPrice) return false;
    if (term && !normalize(`${item.title} ${item.description} ${item.location}`).includes(term)) return false;
    return true;
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    staleTime: 1000 * 60 * 60,
    queryFn: async () => {
      if (!isSupabaseConfigured) return demoCategories;
      const { data, error } = await supabase!.from("categories").select("*").order("sort");
      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useListings(filters: ListingFilters = {}) {
  return useQuery<ListingWithOwner[]>({
    queryKey: ["listings", filters],
    queryFn: async () => {
      if (!isSupabaseConfigured) return applyDemoFilters(filters);

      let query = supabase!.from("listings").select(SELECT).eq("status", "active");

      if (filters.category && filters.category !== "all") query = query.eq("category_slug", filters.category);
      if (filters.ownerId) query = query.eq("owner_id", filters.ownerId);
      if (filters.minPrice != null) query = query.gte("price_per_day", filters.minPrice);
      if (filters.maxPrice != null) query = query.lte("price_per_day", filters.maxPrice);
      if (filters.q?.trim()) {
        // `search_text` já é minúscula e sem acento (migração 0002).
        query = query.ilike("search_text", `%${normalize(filters.q.trim())}%`);
      }

      /*
       * Quem pagou destaque vem primeiro. `nullsFirst: false` manda os sem
       * destaque para o fim, e o desempate é pelo mais recente.
       *
       * Dentro de uma categoria, `category_top_until` tem prioridade: é o
       * produto mais barato e só vale ali.
       */
      if (filters.category && filters.category !== "all") {
        query = query.order("category_top_until", { ascending: false, nullsFirst: false });
      }

      const { data, error } = await query
        .order("featured_until", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;
      return (data ?? []) as unknown as ListingWithOwner[];
    },
  });
}

export function useListing(id: string | undefined) {
  return useQuery<ListingWithOwner | null>({
    queryKey: ["listing", id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!isSupabaseConfigured) return demoListings.find((l) => l.id === id) ?? null;

      const { data, error } = await supabase!.from("listings").select(SELECT).eq("id", id!).maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as ListingWithOwner | null;
    },
  });
}

/** Anúncios do usuário logado, incluindo rascunhos e pausados. */
export function useMyListings(ownerId: string | undefined) {
  return useQuery<ListingWithOwner[]>({
    queryKey: ["my-listings", ownerId],
    enabled: Boolean(ownerId),
    queryFn: async () => {
      if (!isSupabaseConfigured) return demoListings.filter((l) => l.owner_id === ownerId);

      const { data, error } = await supabase!
        .from("listings")
        .select(SELECT)
        .eq("owner_id", ownerId!)
        .neq("status", "removed")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as ListingWithOwner[];
    },
  });
}

export interface ReviewWithAuthor {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  author: { id: string; name: string; avatar_url: string | null } | null;
}

export function useListingReviews(listingId: string | undefined) {
  return useQuery<ReviewWithAuthor[]>({
    queryKey: ["reviews", listingId],
    enabled: Boolean(listingId),
    queryFn: async () => {
      if (!isSupabaseConfigured) return [];
      const { data, error } = await supabase!
        .from("reviews")
        .select(`
          id, rating, comment, created_at,
          author:profiles!reviews_author_id_fkey (id, name, avatar_url)
        `)
        .eq("listing_id", listingId!)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as unknown as ReviewWithAuthor[];
    },
  });
}

export interface NewListing {
  category_slug: string;
  title: string;
  description: string;
  price_per_day: number;
  deposit?: number;
  location: string;
  images: string[];
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: NewListing & { owner_id: string }) => {
      if (!isSupabaseConfigured) {
        // Modo demo: nada é persistido, mas o fluxo da tela continua completo.
        return { ...input, id: `demo-new-${Date.now()}` } as unknown as Listing;
      }

      const { data, error } = await supabase!
        .from("listings")
        .insert({ ...input, deposit: input.deposit ?? 0, status: "active" })
        .select()
        .single();
      if (error) throw error;
      return data as Listing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}

export function useUpdateListingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Listing["status"] }) => {
      if (!isSupabaseConfigured) return;
      const { error } = await supabase!
        .from("listings")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}
