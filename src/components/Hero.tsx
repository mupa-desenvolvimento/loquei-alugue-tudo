import { Search, ArrowRight, TrendingUp, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-loquei.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50">
      {/* Background with subtle overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Loquei - Marketplace de Locação"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-gray-50/90" />
      </div>

      <div className="relative container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Main Content */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-brand-dark">
              Alugue qualquer coisa,
              <br />
              <span className="text-primary">
                em qualquer lugar
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-brand-gray max-w-2xl mx-auto leading-relaxed">
              Descubra itens únicos perto de você ou transforme seus objetos em fonte de renda
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-3xl shadow-airbnb border border-gray-100 p-8 max-w-3xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-brand-dark">
                O que você está procurando?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-gray h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Furadeira, câmera fotográfica, vestido de festa..."
                    className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl hover:border-primary focus:border-primary transition-all duration-200"
                  />
                </div>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105" 
                  asChild
                >
                  <Link to="/buscar">
                    Buscar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-brand-dark">10k+</div>
              <div className="text-brand-gray">Itens disponíveis</div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-brand-dark">5k+</div>
              <div className="text-brand-gray">Usuários ativos</div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-brand-dark">100%</div>
              <div className="text-brand-gray">Seguro</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button 
              size="lg" 
              className="bg-brand-dark hover:bg-brand-dark/90 text-white rounded-2xl px-8 py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              asChild
            >
              <Link to="/anunciar">Anunciar item</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white rounded-2xl px-8 py-4 font-semibold text-lg transition-all duration-200"
              asChild
            >
              <Link to="/como-funciona">Como funciona</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;