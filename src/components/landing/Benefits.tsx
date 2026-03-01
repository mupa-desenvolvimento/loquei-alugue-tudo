
import { Check } from "lucide-react";

const Benefits = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            A escolha inteligente para todos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Seja para ganhar uma renda extra ou para economizar no dia a dia, 
            a Loquei tem vantagens reais para você.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Para quem anuncia (Proprietários) */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-blue-200 transition-colors duration-300">
            <div className="bg-blue-600 p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Para quem Anuncia</h3>
              <p className="opacity-90">Transforme itens parados em dinheiro</p>
            </div>
            <div className="p-8 space-y-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 p-1 rounded-full">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Renda Extra Passiva</span>
                    <span className="text-gray-600 text-sm">Seus bens trabalhando por você enquanto você descansa.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 p-1 rounded-full">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Segurança Garantida</span>
                    <span className="text-gray-600 text-sm">Identidade verificada e contrato digital em todas as locações.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 p-1 rounded-full">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Controle Total</span>
                    <span className="text-gray-600 text-sm">Você define o preço, disponibilidade e regras de uso.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Para quem aluga (Locatários) */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-green-200 transition-colors duration-300">
            <div className="bg-green-500 p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Para quem Aluga</h3>
              <p className="opacity-90">Use o que precisa, pague pouco</p>
            </div>
            <div className="p-8 space-y-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-blue-100 p-1 rounded-full">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Economia Real</span>
                    <span className="text-gray-600 text-sm">Pague uma fração do valor de compra. Use e devolva.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-blue-100 p-1 rounded-full">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Sem Manutenção</span>
                    <span className="text-gray-600 text-sm">Esqueça custos de reparo e armazenamento eterno.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-blue-100 p-1 rounded-full">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Acesso Imediato</span>
                    <span className="text-gray-600 text-sm">Encontre o que precisa perto de você em minutos.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
