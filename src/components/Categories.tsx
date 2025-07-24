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
    color: "from-brand-yellow to-brand-yellow/80"
  },
  {
    name: "Fotografia",
    icon: Camera,
    description: "Câmeras, lentes, equipamentos",
    count: "850 itens",
    color: "from-brand-blue to-brand-blue/80"
  },
  {
    name: "Moda",
    icon: Shirt,
    description: "Roupas, acessórios, calçados",
    count: "1.5k itens",
    color: "from-brand-green to-brand-green-light"
  },
  {
    name: "Esportes",
    icon: Bike,
    description: "Bikes, equipamentos, acessórios",
    count: "920 itens",
    color: "from-brand-green to-brand-green-light"
  },
  {
    name: "Áudio & Música",
    icon: Music,
    description: "Som, instrumentos, equipamentos",
    count: "640 itens",
    color: "from-brand-blue to-brand-green"
  },
  {
    name: "Veículos",
    icon: Car,
    description: "Carros, motos, utilitários",
    count: "380 itens",
    color: "from-brand-yellow to-brand-blue"
  },
  {
    name: "Eletrônicos",
    icon: Laptop,
    description: "Notebooks, tablets, gadgets",
    count: "1.2k itens",
    color: "from-brand-blue to-brand-yellow"
  },
  {
    name: "Casa & Jardim",
    icon: Home,
    description: "Móveis, decoração, utensílios",
    count: "760 itens",
    color: "from-brand-green to-brand-blue"
  }
];

const Categories = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore por <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">Categorias</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre exatamente o que precisa ou descubra oportunidades de locação em diferentes nichos
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-card hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {category.description}
                      </p>
                      <div className="text-xs font-medium text-brand-blue">
                        {category.count}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
          >
            Ver todas as categorias
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Categories;