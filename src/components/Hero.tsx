import { Search, ArrowRight, TrendingUp, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-loquei.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Loquei - Marketplace de Locação"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/40" />
      </div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
                  Se você tem,
                </span>
                <br />
                alguém quer alugar
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                A Loquei conecta quem tem com quem precisa. Alugue ou anuncie qualquer item 
                de forma segura, rápida e econômica.
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-card p-6 rounded-2xl shadow-lg border">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  O que você precisa alugar?
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Ex: furadeira, câmera, vestido..."
                      className="pl-10 pr-4 py-3 text-base border-2"
                    />
                  </div>
                  <Button size="lg" className="bg-gradient-to-r from-brand-blue to-brand-green text-white border-0 px-8">
                    Buscar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-brand-blue/10">
                  <TrendingUp className="h-6 w-6 text-brand-blue" />
                </div>
                <div className="text-2xl font-bold text-foreground">10k+</div>
                <div className="text-sm text-muted-foreground">Itens disponíveis</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-brand-green/10">
                  <Users className="h-6 w-6 text-brand-green" />
                </div>
                <div className="text-2xl font-bold text-foreground">5k+</div>
                <div className="text-sm text-muted-foreground">Usuários ativos</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-brand-green/10">
                  <Shield className="h-6 w-6 text-brand-green" />
                </div>
                <div className="text-2xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground">Seguro</div>
              </div>
            </div>
          </div>

          {/* CTA Side */}
          <div className="lg:flex lg:flex-col lg:items-center space-y-6">
            <div className="bg-card p-8 rounded-2xl shadow-xl border space-y-6">
              <h3 className="text-2xl font-bold text-center">
                Comece a ganhar dinheiro hoje
              </h3>
              <p className="text-muted-foreground text-center">
                Transforme seus itens parados em fonte de renda. É fácil, rápido e seguro.
              </p>
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-brand-yellow to-brand-blue text-white border-0 text-lg py-6"
                >
                  Anunciar meu primeiro item
                </Button>
                <Button variant="outline" size="lg" className="w-full text-lg py-6">
                  Ver como funciona
                </Button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                ✓ Cadastro gratuito ✓ Sem taxa de adesão ✓ Suporte 24h
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;