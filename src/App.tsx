import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/anunciar" element={<Anunciar />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/mensagens" element={<Mensagens />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/cadastrar" element={<Cadastrar />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
