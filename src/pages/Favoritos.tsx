import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, Trash2 } from "lucide-react";

const Favoritos = () => {
  const favoriteItems = [
    {
      id: 1,
      title: "Furadeira de Impacto Bosch",
      location: "Vila Madalena, SP",
      price: "R$ 25",
      rating: 4.8,
      reviews: 32,
      image: "/placeholder.svg",
      owner: "João Silva"
    },
    {
      id: 2,
      title: "Câmera DSLR Canon EOS",
      location: "Copacabana, RJ",
      price: "R$ 80",
      rating: 4.9,
      reviews: 18,
      image: "/placeholder.svg",
      owner: "Maria Santos"
    },
    {
      id: 3,
      title: "Prancha de Surf 6'2\"",
      location: "Barra da Tijuca, RJ",
      price: "R$ 35",
      rating: 4.7,
      reviews: 24,
      image: "/placeholder.svg",
      owner: "Pedro Costa"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Meus Favoritos
              </h1>
              <p className="text-muted-foreground">
                {favoriteItems.length} {favoriteItems.length === 1 ? 'item salvo' : 'itens salvos'}
              </p>
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Limpar todos</span>
            </Button>
          </div>

          {favoriteItems.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum item favoritado</h3>
                <p className="text-muted-foreground mb-6">
                  Adicione itens aos seus favoritos para encontrá-los facilmente depois
                </p>
                <Button className="bg-gradient-to-r from-brand-blue to-brand-green text-white">
                  Explorar Itens
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {favoriteItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                              <MapPin className="h-4 w-4" />
                              <span>{item.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-accent fill-accent" />
                                <span className="text-sm font-medium">{item.rating}</span>
                                <span className="text-sm text-muted-foreground">
                                  ({item.reviews} avaliações)
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Por {item.owner}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-brand-green mb-2">
                              {item.price}<span className="text-sm font-normal">/dia</span>
                            </div>
                            <Badge variant="secondary" className="bg-brand-green/10 text-brand-green">
                              Disponível
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" className="bg-gradient-to-r from-brand-blue to-brand-green text-white">
                          Ver Item
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                          <Trash2 className="h-4 w-4" />
                          <span>Remover</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {favoriteItems.length > 0 && (
            <div className="mt-8 text-center">
              <Button variant="outline" className="px-8">
                Carregar mais itens
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favoritos;