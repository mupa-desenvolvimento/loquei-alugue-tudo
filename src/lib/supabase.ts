import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * O app roda em dois modos:
 *
 * - **conectado**: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` definidos.
 *   Auth, anúncios, reservas e imagens vão para o Supabase.
 * - **demo**: sem credenciais. Usa dados de exemplo e auth local, para que a
 *   interface continue navegável sem backend. Nada é persistido de verdade.
 *
 * A chave `anon` é pública por design — quem protege os dados é o RLS
 * definido em `supabase/migrations`. Nenhum segredo (service_role, chaves de
 * storage) pode entrar no bundle do cliente.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/** Usa quando o caminho de código só faz sentido com backend conectado. */
export function requireSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(
      "Supabase não configurado. Copie .env.example para .env e preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.",
    );
  }
  return supabase;
}
