import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const BUCKET = "listings";
const MAX_BYTES = 5 * 1024 * 1024;

export interface StorageService {
  uploadImage(file: File, path?: string): Promise<string>;
  deleteImage(url: string): Promise<void>;
}

/**
 * Modo demo: gera uma URL de objeto local. Some no reload — é só para
 * navegar pela interface sem backend.
 */
class LocalStorageService implements StorageService {
  async uploadImage(file: File): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return URL.createObjectURL(file);
  }

  async deleteImage(url: string): Promise<void> {
    if (url.startsWith("blob:")) URL.revokeObjectURL(url);
  }
}

/**
 * Supabase Storage.
 *
 * O upload é feito com o token do próprio usuário e a policy
 * `listing_images_write` só aceita gravação dentro de `<user_id>/`, então
 * ninguém sobrescreve arquivo de outro. Nenhuma credencial de storage vai
 * para o cliente — foi assim que a chave secreta do R2 vazava antes.
 */
class SupabaseStorageService implements StorageService {
  async uploadImage(file: File, path = "items"): Promise<string> {
    const client = supabase!;

    if (file.size > MAX_BYTES) {
      throw new Error(`"${file.name}" passa de 5MB`);
    }
    if (!file.type.startsWith("image/")) {
      throw new Error(`"${file.name}" não é uma imagem`);
    }

    const { data: auth } = await client.auth.getUser();
    if (!auth.user) throw new Error("Faça login para enviar imagens");

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const key = `${auth.user.id}/${path}/${crypto.randomUUID()}.${extension}`;

    const { error } = await client.storage.from(BUCKET).upload(key, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) throw error;

    return client.storage.from(BUCKET).getPublicUrl(key).data.publicUrl;
  }

  async deleteImage(url: string): Promise<void> {
    const marker = `/${BUCKET}/`;
    const index = url.indexOf(marker);
    if (index === -1) return;

    const key = decodeURIComponent(url.slice(index + marker.length));
    const { error } = await supabase!.storage.from(BUCKET).remove([key]);
    if (error) throw error;
  }
}

export const storageService: StorageService = isSupabaseConfigured
  ? new SupabaseStorageService()
  : new LocalStorageService();
