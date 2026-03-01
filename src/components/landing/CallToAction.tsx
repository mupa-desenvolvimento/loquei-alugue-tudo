
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 bg-blue-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-800 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-600 opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Pronto para lucrar ou economizar?
        </h2>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
          Junte-se à comunidade que está revolucionando a forma de consumir. 
          É rápido, seguro e totalmente gratuito para começar.
        </p>

        <div className="flex flex-col items-center gap-6">
          <Button 
            size="lg" 
            className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg h-16 px-10 rounded-full shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-1"
            asChild
          >
            <Link to="/cadastrar">
              Começar Agora Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-blue-200 text-sm">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-400" />
              <span>Sem mensalidade</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-blue-400 rounded-full"></div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-400" />
              <span>Sem taxas escondidas</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-blue-400 rounded-full"></div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-400" />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
