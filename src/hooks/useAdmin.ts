import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { requireSupabase } from "@/lib/supabase";
import type {
  Booking,
  BookingStatus,
  Category,
  Listing,
  ListingStatus,
  Profile,
} from "@/types/database";

/** Anúncio com o dono resolvido, como a tabela do admin exibe. */
export type AdminListing = Listing & {
  owner: Pick<Profile, "id" | "name" | "email"> | null;
};

export type AdminBooking = Booking & {
  listing: Pick<Listing, "id" | "title"> | null;
  renter: Pick<Profile, "id" | "name" | "email"> | null;
};

/**
 * Consultas do painel administrativo.
 *
 * Nenhuma delas depende de o cliente "ser admin": quem decide é o RLS. Um
 * usuário comum que chamasse estes hooks receberia apenas as próprias linhas.
 */

export interface AdminStats {
  users: number;
  blocked_users: number;
  listings_active: number;
  listings_total: number;
  bookings_total: number;
  bookings_pending: number;
  gmv: number;
  revenue: number;
}

export function useAdminStats() {
  return useQuery<AdminStats | null>({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data, error } = await requireSupabase().rpc("admin_stats");
      if (error) throw error;
      return (data ?? null) as AdminStats | null;
    },
  });
}

export function useAdminUsers(search = "") {
  return useQuery<Profile[]>({
    queryKey: ["admin", "users", search],
    queryFn: async () => {
      let query = requireSupabase().from("profiles").select("*");
      if (search.trim()) {
        const termo = `%${search.trim()}%`;
        query = query.or(`name.ilike.${termo},email.ilike.${termo}`);
      }
      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as Profile[];
    },
  });
}

/** Todos os anúncios, inclusive pausados e de outros donos. */
export function useAdminListings(search = "") {
  return useQuery<AdminListing[]>({
    queryKey: ["admin", "listings", search],
    queryFn: async () => {
      let query = requireSupabase()
        .from("listings")
        .select("*, owner:profiles!listings_owner_id_fkey (id, name, email)");
      if (search.trim()) {
        query = query.ilike("title", `%${search.trim()}%`);
      }
      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as unknown as AdminListing[];
    },
  });
}

export function useAdminBookings() {
  return useQuery<AdminBooking[]>({
    queryKey: ["admin", "bookings"],
    queryFn: async () => {
      const { data, error } = await requireSupabase()
        .from("bookings")
        .select(`
          *,
          listing:listings!bookings_listing_id_fkey (id, title),
          renter:profiles!bookings_renter_id_fkey (id, name, email)
        `)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as unknown as AdminBooking[];
    },
  });
}

function useAdminMutation<T>(fn: (client: ReturnType<typeof requireSupabase>, input: T) => Promise<void>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: T) => fn(requireSupabase(), input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useSetListingStatus() {
  return useAdminMutation<{ id: string; status: ListingStatus }>(async (client, { id, status }) => {
    const { error } = await client
      .from("listings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  });
}

export function useSetBookingStatus() {
  return useAdminMutation<{ id: string; status: BookingStatus }>(async (client, { id, status }) => {
    const { error } = await client
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  });
}

/** Bloquear impede a conta de anunciar e de reservar (ver policies da 0003). */
export function useSetUserBlocked() {
  return useAdminMutation<{ id: string; blocked: boolean }>(async (client, { id, blocked }) => {
    const { error } = await client
      .from("profiles")
      .update({ blocked_at: blocked ? new Date().toISOString() : null })
      .eq("id", id);
    if (error) throw error;
  });
}

export function useSetUserRole() {
  return useAdminMutation<{ id: string; role: "user" | "admin" }>(async (client, { id, role }) => {
    const { error } = await client.from("profiles").update({ role }).eq("id", id);
    if (error) throw error;
  });
}

export function useSaveCategory() {
  return useAdminMutation<Partial<Category> & { slug: string }>(async (client, category) => {
    const { error } = await client.from("categories").upsert(category);
    if (error) throw error;
  });
}

export function useDeleteCategory() {
  return useAdminMutation<string>(async (client, slug) => {
    const { error } = await client.from("categories").delete().eq("slug", slug);
    if (error) throw error;
  });
}

/** Mensagem do administrador para um usuário (tabela `notifications`). */
export function useSendNotification() {
  return useAdminMutation<{ userIds: string[]; title: string; body: string; senderId: string }>(
    async (client, { userIds, title, body, senderId }) => {
      const { error } = await client.from("notifications").insert(
        userIds.map((userId) => ({ user_id: userId, sender_id: senderId, title, body })),
      );
      if (error) throw error;
    },
  );
}
