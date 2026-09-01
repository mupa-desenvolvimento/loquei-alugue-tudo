import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Só renderiza a rota para quem está autenticado. Guarda a rota pretendida em
 * `state.from` para o login devolver o usuário ao lugar certo.
 *
 * Isto é conveniência de navegação — a proteção real dos dados é o RLS.
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/entrar" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
