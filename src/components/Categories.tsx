import { 
  Camera, 
  Hammer, 
  Shirt, 
  Bike, 
  Music, 
  Car, 
  Laptop, 
  Home,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    name: "Ferramentas",
    icon: Hammer,
    description: "Furadeiras, serras, equipamentos",
    count: "2.1k itens",
    color: "bg-orange-500"
  },
  {
    name: "Fotografia",
    icon: Camera,
    description: "Câmeras, lentes, equipamentos",
    count: "850 itens",
    color: "bg-blue-500"
  },
  {
    name: "Moda",
    icon: Shirt,
    description: "Roupas, acessórios, calçados",
    count: "1.5k itens",
    color: "bg-pink-500"
  },
  {
    name: "Esportes",
    icon: Bike,
    description: "Bikes, equipamentos, acessórios",
    count: "920 itens",
    color: "bg-green-500"
  },
  {
    name: "Áudio & Música",
    icon: Music,
    description: "Som, instrumentos, equipamentos",
    count: "640 itens",
    color: "bg-purple-500"
  },
  {
    name: "Veículos",
    icon: Car,
    description: "Carros, motos, utilitários",
    count: "380 itens",
    color: "bg-red-500"
  },
  {
    name: "Eletrônicos",
    icon: Laptop,
    description: "Notebooks, tablets, gadgets",
    count: "1.2k itens",
    color: "bg-indigo-500"
  },
  {
    name: "Casa & Jardim",
    icon: Home,
    description: "Móveis, decoração, utensílios",
    count: "760 itens",
    color: "bg-teal-500"
  }
];

const Categories = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brand-dark">
            Explore por <span className="text-primary">categorias</span>
          </h2>
          <p className="text-xl text-brand-gray max-w-3xl mx-auto leading-relaxed">
            Encontre exatamente o que precisa ou descubra oportunidades de locação em diferentes nichos
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div 
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-airbnb hover:shadow-airbnb-hover transition-all duration-300 cursor-pointer hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors text-brand-dark">
                      {category.name}
                    </h3>
                    <p className="text-sm text-brand-gray mb-3 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1 inline-block">
                      {category.count}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white rounded-2xl px-8 py-4 font-semibold text-lg transition-all duration-200"
          >
            Ver todas as categorias
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Categories;