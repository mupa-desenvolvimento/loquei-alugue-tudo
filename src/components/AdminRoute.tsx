import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Esconde as rotas de administração de quem não é admin.
 *
 * É só navegação: quem realmente impede um usuário comum de ler ou alterar
 * dados alheios é o RLS (`is_admin()` na migração 0003). Mesmo que alguém
 * force a URL, as consultas voltam vazias.
 */
export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <Navigate to="/entrar" replace state={{ from: "/admin" }} />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
}
