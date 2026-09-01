import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthProviders, type SocialProvider } from "@/hooks/useAuthProviders";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z" />
    <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1 .7-2.3 1.1-4 1.1-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.4a12 12 0 0 0 0 10.8l4-3.1Z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path
      fill="#1877F2"
      d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.8V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12Z"
    />
  </svg>
);

const PROVIDERS: Record<SocialProvider, { nome: string; Icone: () => JSX.Element }> = {
  google: { nome: "Google", Icone: GoogleIcon },
  facebook: { nome: "Facebook", Icone: FacebookIcon },
};

/**
 * Botões de login social.
 *
 * Renderiza apenas os provedores realmente habilitados no projeto Supabase.
 * Quando nenhum está, o bloco inteiro (inclusive o separador) some — antes
 * havia dois botões fixos que não faziam nada ao serem clicados.
 */
export default function SocialAuthButtons({
  verbo = "Continuar",
  redirectTo,
}: {
  verbo?: string;
  redirectTo?: string;
}) {
  const { signInWithProvider } = useAuth();
  const { data: providers = [] } = useAuthProviders();
  const [carregando, setCarregando] = useState<SocialProvider | null>(null);

  if (providers.length === 0) return null;

  const entrar = async (provider: SocialProvider) => {
    setCarregando(provider);
    try {
      await signInWithProvider(provider, redirectTo);
    } finally {
      // O navegador sai da página no fluxo feliz; isto cobre o erro.
      setCarregando(null);
    }
  };

  return (
    <>
      <Separator className="my-6" />
      <div className="space-y-3">
        {providers.map((provider) => {
          const { nome, Icone } = PROVIDERS[provider];
          return (
            <Button
              key={provider}
              type="button"
              variant="outline"
              className="w-full h-12 rounded-2xl border-2 gap-3"
              disabled={carregando !== null}
              onClick={() => entrar(provider)}
            >
              {carregando === provider ? <Loader2 className="h-5 w-5 animate-spin" /> : <Icone />}
              {verbo} com {nome}
            </Button>
          );
        })}
      </div>
    </>
  );
}
