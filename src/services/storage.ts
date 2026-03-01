import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Interface para o serviço de armazenamento
export interface StorageService {
  uploadImage(file: File, path?: string): Promise<string>;
  deleteImage(url: string): Promise<void>;
}

// Implementação Mock (Local) para desenvolvimento sem credenciais
class LocalStorageService implements StorageService {
  async uploadImage(file: File): Promise<string> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Cria URL temporária local
    return URL.createObjectURL(file);
  }

  async deleteImage(url: string): Promise<void> {
    console.log(`Mock delete: ${url}`);
  }
}

// Implementação Real (Cloudflare R2 via AWS SDK v3)
class CloudflareR2Service implements StorageService {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    const accountId = import.meta.env.VITE_R2_ACCOUNT_ID;
    const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY_ID;
    const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
    this.bucket = import.meta.env.VITE_R2_BUCKET_NAME || "loquei-images";
    this.publicUrl = import.meta.env.VITE_R2_PUBLIC_URL || "";

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error("Credenciais do Cloudflare R2 não configuradas");
    }

    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadImage(file: File, path: string = "uploads"): Promise<string> {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${path}/${crypto.randomUUID()}.${fileExtension}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: file,
        ContentType: file.type,
      });

      await this.client.send(command);

      // Retorna a URL pública se configurada, senão a URL do R2 (que pode ser privada)
      return this.publicUrl 
        ? `${this.publicUrl}/${fileName}`
        : `https://${this.bucket}.r2.cloudflarestorage.com/${fileName}`;
    } catch (error) {
      console.error("Erro no upload para R2:", error);
      throw error;
    }
  }

  async deleteImage(url: string): Promise<void> {
    // Extrair a key da URL seria necessário aqui
    console.log(`Delete não implementado totalmente para: ${url}`);
  }
}

// Factory para decidir qual serviço usar
function createStorageService(): StorageService {
  const useR2 = import.meta.env.VITE_USE_R2 === "true";
  
  if (useR2) {
    try {
      return new CloudflareR2Service();
    } catch (error) {
      console.warn("Falha ao inicializar R2, usando armazenamento local:", error);
      return new LocalStorageService();
    }
  }
  
  return new LocalStorageService();
}

export const storageService = createStorageService();
