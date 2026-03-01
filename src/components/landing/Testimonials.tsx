
import { Star } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Histórias de quem já economizou
          </h2>
          <p className="text-lg text-gray-600">
            Junte-se a milhares de brasileiros que estão mudando a forma de consumir.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-8 rounded-2xl relative">
            <div className="flex gap-1 mb-4 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-gray-700 italic mb-6">
              "Precisava de uma furadeira de impacto para instalar umas prateleiras. 
              Comprar custaria R$ 400. Aluguei por R$ 35 o dia aqui no meu bairro. 
              Economia absurda!"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
                R
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Ricardo Mendes</h4>
                <p className="text-sm text-gray-500">Alugou Ferramentas</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl relative">
            <div className="flex gap-1 mb-4 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-gray-700 italic mb-6">
              "Tenho uma câmera profissional parada há meses. Anunciei na Loquei e na primeira semana já aluguei 2 vezes.
              O dinheiro do aluguel já pagou a manutenção dela."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold text-xl">
                C
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Camila Torres</h4>
                <p className="text-sm text-gray-500">Anunciou Equipamentos</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl relative">
            <div className="flex gap-1 mb-4 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-gray-700 italic mb-6">
              "Aluguei uma barraca de camping para o fim de semana. O processo foi super seguro, 
              com contrato digital e tudo. Recomendo demais!"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold text-xl">
                F
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Felipe Araújo</h4>
                <p className="text-sm text-gray-500">Alugou Camping</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
