import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Booking, BookingStatus, ListingWithOwner } from "@/types/database";

export interface BookingWithListing extends Booking {
  listing: Pick<
    ListingWithOwner,
    "id" | "title" | "images" | "location" | "owner_id" | "price_per_day"
  > | null;
}

const SELECT = `
  *,
  listing:listings!bookings_listing_id_fkey (id, title, images, location, owner_id, price_per_day)
`;

/** Reservas em que o usuário é o locatário (painel do locatário). */
export function useMyBookings(renterId: string | undefined) {
  return useQuery<BookingWithListing[]>({
    queryKey: ["bookings", "renter", renterId],
    enabled: Boolean(renterId),
    queryFn: async () => {
      if (!isSupabaseConfigured) return [];
      const { data, error } = await supabase!
        .from("bookings")
        .select(SELECT)
        .eq("renter_id", renterId!)
        .order("start_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as BookingWithListing[];
    },
  });
}

/**
 * Reservas recebidas nos anúncios do usuário (painel do locador).
 * O RLS já libera essas linhas para o dono do anúncio; o filtro por
 * `listing.owner_id` acontece via inner join.
 */
export function useReceivedBookings(ownerId: string | undefined) {
  return useQuery<BookingWithListing[]>({
    queryKey: ["bookings", "owner", ownerId],
    enabled: Boolean(ownerId),
    queryFn: async () => {
      if (!isSupabaseConfigured) return [];
      const { data, error } = await supabase!
        .from("bookings")
        .select(`
          *,
          listing:listings!inner (id, title, images, location, owner_id, price_per_day)
        `)
        .eq("listing.owner_id", ownerId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as BookingWithListing[];
    },
  });
}

export interface NewBooking {
  listing_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  daily_price: number;
  subtotal: number;
  service_fee: number;
  insurance_fee: number;
  deposit: number;
  total: number;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: NewBooking) => {
      if (!isSupabaseConfigured) {
        return { ...input, id: `demo-booking-${Date.now()}`, status: "pending" } as Booking;
      }
      const { data, error } = await supabase!
        .from("bookings")
        .insert({ ...input, status: "pending" })
        .select()
        .single();
      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      if (!isSupabaseConfigured) return;
      const { error } = await supabase!
        .from("bookings")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });
}
