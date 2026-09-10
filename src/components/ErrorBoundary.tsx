import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

/**
 * Rede de segurança para erros de renderização.
 *
 * Sem isto, qualquer exceção não tratada dentro de um componente desmonta a
 * árvore inteira e o visitante fica olhando uma página em branco, sem nenhuma
 * pista do que houve nem como sair.
 */
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { erro: Error | null }
> {
  state = { erro: null as Error | null };

  static getDerivedStateFromError(erro: Error) {
    return { erro };
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    // Enquanto não houver serviço de monitoramento, o console é o que temos.
    console.error("Erro não tratado na interface:", erro, info.componentStack);
  }

  render() {
    if (!this.state.erro) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertTriangle className="h-12 w-12 text-foreground/40" />
        <h1 className="text-2xl font-bold">Alguma coisa quebrou aqui</h1>
        <p className="max-w-md text-foreground/70">
          O erro foi do nosso lado, não do seu. Tente recarregar a página; se
          continuar, escreva para{" "}
          <a href="mailto:contato@loquei.com.br" className="text-primary hover:underline">
            contato@loquei.com.br
          </a>
          .
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Recarregar</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Voltar para o início
          </Button>
        </div>

        {import.meta.env.DEV && (
          <pre className="mt-6 max-w-2xl overflow-auto rounded-lg bg-muted p-4 text-left text-xs">
            {this.state.erro.message}
          </pre>
        )}
      </div>
    );
  }
}
