
import { UserPlus, Search, TrendingUp, Handshake } from "lucide-react";

const Solution = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-green-600 font-bold tracking-wider uppercase text-sm">Passo a Passo</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
            Simples assim.
          </h2>
          <p className="text-xl text-gray-600">
            A Loquei conecta quem precisa com quem tem. Sem burocracia desnecessária.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>

          <div className="text-center relative">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-lg">
              <UserPlus className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Crie sua conta</h3>
            <p className="text-gray-600 leading-relaxed">
              Cadastre-se gratuitamente em segundos. Verificamos a identidade de todos 
              para garantir sua segurança.
            </p>
          </div>

          <div className="text-center relative">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-lg">
              <Search className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Encontre ou Anuncie</h3>
            <p className="text-gray-600 leading-relaxed">
              Busque o que precisa ou tire fotos do que tem parado. 
              Defina o preço e a disponibilidade.
            </p>
          </div>

          <div className="text-center relative">
            <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-lg">
              <Handshake className="w-10 h-10 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Feche Negócio</h3>
            <p className="text-gray-600 leading-relaxed">
              Combine a entrega e o pagamento seguro pela plataforma. 
              Ganhe dinheiro ou economize.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
