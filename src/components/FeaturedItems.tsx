import { Heart, MapPin, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const featuredItems = [
  {
    id: 1,
    title: "Furadeira Profissional Bosch",
    description: "Ideal para reformas e projetos DIY",
    price: "R$ 25",
    period: "/dia",
    location: "São Paulo, SP",
    rating: 4.9,
    reviews: 47,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop",
    category: "Ferramentas",
    owner: "João Silva",
    ownerType: "PF",
    available: true,
    featured: true
  },
  {
    id: 2,
    title: "Câmera DSLR Canon EOS",
    description: "Perfeita para eventos e ensaios",
    price: "R$ 80",
    period: "/dia",
    location: "Rio de Janeiro, RJ",
    rating: 5.0,
    reviews: 23,
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
    category: "Fotografia",
    owner: "Maria Fotografia",
    ownerType: "PJ",
    available: true,
    featured: true
  },
  {
    id: 3,
    title: "Vestido de Festa Longo",
    description: "Elegante para ocasiões especiais",
    price: "R$ 120",
    period: "/evento",
    location: "Belo Horizonte, MG",
    rating: 4.8,
    reviews: 31,
    image: "https://images.unsplash.com/photo-1566479179817-c7ebv890?w=400&h=300&fit=crop",
    category: "Moda",
    owner: "Atelier Bella",
    ownerType: "PJ",
    available: true,
    featured: false
  },
  {
    id: 4,
    title: "Bike Elétrica Urban",
    description: "Transporte sustentável pela cidade",
    price: "R$ 45",
    period: "/dia",
    location: "Porto Alegre, RS",
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    category: "Transporte",
    owner: "EcoBikes",
    ownerType: "PJ",
    available: false,
    featured: true
  },
  {
    id: 5,
    title: "Caixa de Som Profissional",
    description: "Som de qualidade para eventos",
    price: "R$ 60",
    period: "/dia",
    location: "Brasília, DF",
    rating: 4.9,
    reviews: 15,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
    category: "Áudio",
    owner: "Sound Pro",
    ownerType: "PJ",
    available: true,
    featured: false
  },
  {
    id: 6,
    title: "Notebook Gamer Alienware",
    description: "Alto desempenho para trabalho e jogos",
    price: "R$ 90",
    period: "/dia",
    location: "Curitiba, PR",
    rating: 5.0,
    reviews: 12,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    category: "Eletrônicos",
    owner: "TechRental",
    ownerType: "PJ",
    available: true,
    featured: true
  }
];

const FeaturedItems = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brand-dark">
            Itens em <span className="text-primary">destaque</span>
          </h2>
          <p className="text-xl text-brand-gray max-w-3xl mx-auto leading-relaxed">
            Descubra os itens mais procurados e bem avaliados da nossa comunidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <div 
              key={item.id}
              className="group bg-white rounded-3xl shadow-airbnb hover:shadow-airbnb-hover transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.featured && (
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    Destaque
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-brand-gray hover:text-primary transition-colors rounded-full w-10 h-10 p-0"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-xl group-hover:text-primary transition-colors text-brand-dark mb-2">
                    {item.title}
                  </h3>
                  <p className="text-brand-gray leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm">
                    <MapPin className="h-4 w-4 text-brand-gray" />
                    <span className="text-brand-gray">{item.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-brand-dark">{item.rating}</span>
                    <span className="text-sm text-brand-gray">({item.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-2xl font-bold text-brand-dark">
                    {item.price}
                    <span className="text-sm font-normal text-brand-gray">{item.period}</span>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-2 font-medium transition-all duration-200 hover:scale-105"
                    disabled={!item.available}
                  >
                    {item.available ? 'Ver detalhes' : 'Indisponível'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white rounded-2xl px-8 py-4 font-semibold text-lg transition-all duration-200"
          >
            Ver todos os itens
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;