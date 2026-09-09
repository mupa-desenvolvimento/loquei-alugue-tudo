import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/** Moldura comum dos documentos legais: termos, privacidade e afins. */
export default function PaginaLegal({
  titulo,
  atualizadoEm,
  resumo,
  children,
}: {
  titulo: string;
  atualizadoEm: string;
  resumo: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold lg:text-4xl">{titulo}</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Última atualização: {atualizadoEm}
        </p>

        <div className="mt-6 rounded-xl border bg-muted/40 p-4 text-sm leading-relaxed">
          <strong className="font-semibold">Em resumo:</strong> {resumo}
        </div>

        {/* `prose` vem do @tailwindcss/typography, já instalado no projeto. */}
        <article
          className="prose prose-slate mt-10 max-w-none
            prose-headings:font-semibold prose-headings:text-foreground
            prose-p:text-foreground/80 prose-li:text-foreground/80
            prose-strong:text-foreground prose-a:text-primary"
        >
          {children}
        </article>

        <div className="mt-12 border-t pt-6 text-sm text-foreground/70">
          Dúvidas sobre este documento?{" "}
          <a href="mailto:contato@loquei.com.br" className="text-primary hover:underline">
            contato@loquei.com.br
          </a>
          {" · "}
          <Link to="/" className="text-primary hover:underline">
            Voltar para o início
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
