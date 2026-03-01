
import { PackageX, Wallet, Archive } from "lucide-react";

const Problem = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Por que deixar seu dinheiro parado?
          </h2>
          <p className="text-lg text-gray-600">
            Todos os dias, milhares de reais são desperdiçados em itens que usamos apenas uma vez 
            ou que ficam acumulando poeira na garagem.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <Wallet className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Comprar custa caro</h3>
            <p className="text-gray-600">
              Por que pagar o preço cheio em algo que você vai usar apenas uma vez no ano? 
              O custo de oportunidade é altíssimo.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <Archive className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Itens acumulando poeira</h3>
            <p className="text-gray-600">
              Ferramentas, equipamentos de camping, vestidos de festa... tudo isso ocupa espaço 
              e desvaloriza a cada dia que passa.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <PackageX className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Estoque ocioso</h3>
            <p className="text-gray-600">
              Para empresas, equipamento parado é prejuízo. Transforme seus ativos ociosos 
              em uma nova fonte de receita recorrente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
