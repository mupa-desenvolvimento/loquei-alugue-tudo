import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Star, 
  Heart, 
  Filter,
  Grid,
  List,
  SlidersHorizontal 
} from "lucide-react";
import { useState } from "react";

const Buscar = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const items = [
    {
      id: 1,
      title: "Furadeira de Impacto Bosch GSB 550",
      location: "Vila Madalena, SP",
      price: "R$ 25",
      rating: 4.8,
      reviews: 32,
      image: "/placeholder.svg",
      owner: "João Silva",
      category: "Ferramentas",
      available: true
    },
    {
      id: 2,
      title: "Câmera DSLR Canon EOS Rebel T7i",
      location: "Copacabana, RJ", 
      price: "R$ 80",
      rating: 4.9,
      reviews: 18,
      image: "/placeholder.svg",
      owner: "Maria Santos",
      category: "Eletrônicos",
      available: true
    },
    {
      id: 3,
      title: "Prancha de Surf 6'2\" Fish Tail",
      location: "Barra da Tijuca, RJ",
      price: "R$ 35", 
      rating: 4.7,
      reviews: 24,
      image: "/placeholder.svg",
      owner: "Pedro Costa",
      category: "Esportes",
      available: false
    },
    {
      id: 4,
      title: "Projetor Full HD 3000 Lumens",
      location: "Pinheiros, SP",
      price: "R$ 45",
      rating: 4.6,
      reviews: 15,
      image: "/placeholder.svg", 
      owner: "Ana Lima",
      category: "Eletrônicos",
      available: true
    }
  ];

  const categories = ["Todos", "Ferramentas", "Eletrônicos", "Esportes", "Eventos", "Casa"];
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredItems = selectedCategory === "Todos" 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-muted/30 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="O que você precisa?" className="pl-9" />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Localização" className="pl-9" />
            </div>
            <select className="w-full p-2 border rounded-md">
              <option>Preço máximo</option>
              <option>Até R$ 25</option>
              <option>Até R$ 50</option>
              <option>Até R$ 100</option>
              <option>Acima de R$ 100</option>
            </select>
            <Button className="bg-gradient-to-r from-brand-blue to-brand-green text-white">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
          
          {/* Categorias */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-brand-blue text-white" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Resultados Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {filteredItems.length} itens encontrados
            </h1>
            <p className="text-muted-foreground">
              {selectedCategory !== "Todos" && `Categoria: ${selectedCategory}`}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm" 
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Grid de Itens */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    {!item.available && (
                      <Badge className="absolute bottom-2 left-2 bg-red-500 text-white">
                        Indisponível
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                    
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{item.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-accent fill-accent" />
                      <span className="text-xs font-medium">{item.rating}</span>
                      <span className="text-xs text-muted-foreground">({item.reviews})</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-brand-green">
                        {item.price}<span className="text-xs font-normal">/dia</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Lista de Itens */
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-32 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
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
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Por {item.owner}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-brand-green mb-2">
                            {item.price}<span className="text-sm font-normal">/dia</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-brand-blue to-brand-green text-white"
                              disabled={!item.available}
                            >
                              {item.available ? 'Ver Item' : 'Indisponível'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Paginação */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Anterior</Button>
            <Button size="sm" className="bg-brand-blue text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Próximo</Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Buscar;