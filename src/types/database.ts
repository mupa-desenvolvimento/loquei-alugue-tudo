/**
 * Tipos do banco, espelhando `supabase/migrations/0001_init.sql`.
 *
 * Escrito à mão para não depender da CLI. Se o schema mudar, regenere com:
 *   npx supabase gen types typescript --project-id <ref> > src/types/database.ts
 */

export type UserType = "pf" | "pj";
export type UserProfile = "locador" | "locatario";
export type UserRole = "user" | "admin";
export type ListingStatus = "draft" | "active" | "paused" | "removed";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "returned"
  | "completed"
  | "cancelled"
  | "rejected";

export type Profile = {
  id: string;
  name: string;
  email: string;
  type: UserType;
  profile: UserProfile;
  phone: string | null;
  company_name: string | null;
  cnpj: string | null;
  avatar_url: string | null;
  role: UserRole;
  /** Preenchido quando um admin bloqueia a conta. */
  blocked_at: string | null;
  created_at: string;
  updated_at: string;
}

export type Category = {
  slug: string;
  name: string;
  icon: string;
  sort: number;
}

export type Listing = {
  id: string;
  owner_id: string;
  category_slug: string;
  title: string;
  description: string;
  price_per_day: number;
  deposit: number;
  location: string;
  lat: number | null;
  lng: number | null;
  images: string[];
  status: ListingStatus;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  /** Coluna gerada: título + descrição + local, sem acento e em minúsculas. */
  search_text?: string;
}

/** Anúncio já com o dono e a categoria resolvidos, como as telas consomem. */
export interface ListingWithOwner extends Listing {
  owner: Pick<Profile, "id" | "name" | "avatar_url" | "created_at"> | null;
  category: Pick<Category, "slug" | "name" | "icon"> | null;
}

export type Booking = {
  id: string;
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
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export type Review = {
  id: string;
  booking_id: string;
  listing_id: string;
  author_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export type Favorite = {
  user_id: string;
  listing_id: string;
  created_at: string;
}

export type Conversation = {
  id: string;
  listing_id: string | null;
  owner_id: string;
  renter_id: string;
  created_at: string;
}

export type Notification = {
  id: string;
  user_id: string;
  sender_id: string | null;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

/** Formato que o supabase-js espera para cada tabela. */
type Row<T> = {
  Row: T;
  Insert: Partial<T>;
  Update: Partial<T>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: Row<Profile>;
      categories: Row<Category>;
      listings: Row<Listing>;
      bookings: Row<Booking>;
      reviews: Row<Review>;
      favorites: Row<Favorite>;
      conversations: Row<Conversation>;
      messages: Row<Message>;
      notifications: Row<Notification>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
