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
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Itens em <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">Destaque</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra os itens mais procurados e bem avaliados da nossa comunidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <Card 
              key={item.id}
              className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.featured && (
                  <Badge className="absolute top-3 left-3 bg-brand-yellow text-brand-gray-dark">
                    Destaque
                  </Badge>
                )}
                {!item.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      Indisponível
                    </Badge>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    <Badge 
                      variant={item.ownerType === 'PJ' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {item.ownerType}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-1 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{item.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{item.rating}</span>
                      <span className="text-sm text-muted-foreground">({item.reviews} avaliações)</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {item.price}
                        <span className="text-sm font-normal text-muted-foreground">
                          {item.period}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-brand-blue to-brand-green text-white border-0 hover:from-brand-blue-dark hover:to-brand-green"
                    disabled={!item.available}
                  >
                    {item.available ? 'Ver detalhes' : 'Indisponível'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
          >
            Ver todos os itens
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;