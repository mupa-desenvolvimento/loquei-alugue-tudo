import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Anunciar from "./pages/Anunciar";
import ComoFunciona from "./pages/ComoFunciona";
import Favoritos from "./pages/Favoritos";
import Mensagens from "./pages/Mensagens";
import Buscar from "./pages/Buscar";
import Login from "./pages/Login";
import Cadastrar from "./pages/Cadastrar";
import PainelLocador from "./pages/PainelLocador";
import PainelLocatario from "./pages/PainelLocatario";
import ProdutoDetalhe from "./pages/ProdutoDetalhe";
import Checkout from "./pages/Checkout";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Admin from "./pages/Admin";
import Notificacoes from "./pages/Notificacoes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const protect = (element: JSX.Element) => <ProtectedRoute>{element}</ProtectedRoute>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/como-funciona" element={<ComoFunciona />} />
            <Route path="/buscar" element={<Buscar />} />
            <Route path="/entrar" element={<Login />} />
            <Route path="/cadastrar" element={<Cadastrar />} />
            <Route path="/produto/:id" element={<ProdutoDetalhe />} />

            {/* Exigem sessão */}
            <Route path="/anunciar" element={protect(<Anunciar />)} />
            <Route path="/favoritos" element={protect(<Favoritos />)} />
            <Route path="/mensagens" element={protect(<Mensagens />)} />
            <Route path="/painel-locador" element={protect(<PainelLocador />)} />
            <Route path="/painel-locatario" element={protect(<PainelLocatario />)} />
            <Route path="/checkout/:productId" element={protect(<Checkout />)} />
            <Route path="/perfil" element={protect(<Perfil />)} />
            <Route path="/notificacoes" element={protect(<Notificacoes />)} />

            {/* Administração */}
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
