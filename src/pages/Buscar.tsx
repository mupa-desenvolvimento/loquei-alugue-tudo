import { useState } from "react";
import { Search, Filter, Grid, List, Heart, Star, MapPin, Crown, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Buscar = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentBanner, setCurrentBanner] = useState(0);

  // Featured banners for promoted items
  const featuredBanners = [
    {
      id: 1,
      title: "Equipamentos Profissionais",
      description: "Ferramentas de alta qualidade para seus projetos",
      image: "/placeholder.svg",
      category: "Ferramentas",
      price: "A partir de R$ 25/dia",
      promoted: true,
      promotionType: "destaque"
    },
    {
      id: 2,
      title: "Câmeras e Equipamentos de Foto",
      description: "Capture momentos únicos com equipamentos profissionais",
      image: "/placeholder.svg",
      category: "Eletrônicos",
      price: "A partir de R$ 50/dia",
      promoted: true,
      promotionType: "premium"
    },
    {
      id: 3,
      title: "Equipamentos para Eventos",
      description: "Tudo para seu evento ser um sucesso",
      image: "/placeholder.svg",
      category: "Eventos",
      price: "A partir de R$ 80/dia",
      promoted: true,
      promotionType: "destaque"
    }
  ];

  // Mock data for demonstration
  const items = [
    {
      id: 1,
      name: "Furadeira Professional Bosch",
      category: "Ferramentas",
      price: 25,
      rating: 4.8,
      reviews: 32,
      location: "São Paulo, SP",
      owner: "João Silva",
      image: "/placeholder.svg",
      promoted: false
    },
    {
      id: 2,
      name: "Câmera DSLR Canon EOS",
      category: "Eletrônicos",
      price: 80,
      rating: 4.9,
      reviews: 18,
      location: "Rio de Janeiro, RJ", 
      owner: "Maria Santos",
      image: "/placeholder.svg",
      promoted: true,
      promotionType: "destaque"
    },
    {
      id: 3,
      name: "Serra Circular Profissional",
      category: "Ferramentas",
      price: 45,
      rating: 4.7,
      reviews: 24,
      location: "Belo Horizonte, MG",
      owner: "Pedro Costa",
      image: "/placeholder.svg",
      promoted: true,
      promotionType: "premium"
    },
    {
      id: 4,
      name: "Projetor Full HD 3000 Lumens",
      category: "Eletrônicos",
      price: 60,
      rating: 4.6,
      reviews: 15,
      location: "Salvador, BA",
      owner: "Ana Lima",
      image: "/placeholder.svg",
      promoted: false
    }
  ];

  const categories = [
    { id: "all", name: "Todas", icon: "🔍", gradient: "from-blue-500 to-purple-600" },
    { id: "tools", name: "Ferramentas", icon: "🔧", gradient: "from-orange-500 to-red-500" },
    { id: "electronics", name: "Eletrônicos", icon: "📱", gradient: "from-blue-500 to-cyan-500" },
    { id: "vehicles", name: "Veículos", icon: "🚗", gradient: "from-green-500 to-teal-500" },
    { id: "home", name: "Casa & Jardim", icon: "🏠", gradient: "from-pink-500 to-rose-500" },
    { id: "sports", name: "Esportes", icon: "⚽", gradient: "from-yellow-500 to-orange-500" },
    { id: "events", name: "Eventos", icon: "🎉", gradient: "from-purple-500 to-pink-500" },
    { id: "music", name: "Música", icon: "🎵", gradient: "from-indigo-500 to-purple-500" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter(item => 
        item.category.toLowerCase() === categories.find(cat => cat.id === selectedCategory)?.name.toLowerCase()
      );

  // Auto-rotate banner
  useState(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % featuredBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Featured Banner Carousel */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {featuredBanners.map((banner, index) => (
                <div key={banner.id} className="w-full flex-shrink-0">
                  <div className={`relative h-80 bg-gradient-to-r ${
                    banner.promotionType === 'destaque' 
                      ? 'from-primary/90 to-accent/90' 
                      : 'from-secondary/90 to-primary/90'
                  } rounded-3xl overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                    <div className="relative z-10 h-full flex items-center">
                      <div className="container mx-auto px-8">
                        <div className="max-w-2xl text-white">
                          <div className="flex items-center gap-2 mb-4">
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                              {banner.promotionType === 'destaque' ? (
                                <><Crown className="h-3 w-3 mr-1" /> Destaque Principal</>
                              ) : (
                                <><Zap className="h-3 w-3 mr-1" /> Premium</>
                              )}
                            </Badge>
                            <Badge variant="outline" className="border-white/30 text-white">
                              {banner.category}
                            </Badge>
                          </div>
                          <h1 className="text-4xl md:text-5xl font-bold mb-4">{banner.title}</h1>
                          <p className="text-xl text-white/90 mb-6">{banner.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold">{banner.price}</span>
                            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                              Ver Produtos
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Banner Navigation */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
              {featuredBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentBanner === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            
            {/* Arrow Navigation */}
            <button
              onClick={() => setCurrentBanner(currentBanner === 0 ? featuredBanners.length - 1 : currentBanner - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-white transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => setCurrentBanner(currentBanner === featuredBanners.length - 1 ? 0 : currentBanner + 1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-white transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Localização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sp">São Paulo</SelectItem>
                  <SelectItem value="rj">Rio de Janeiro</SelectItem>
                  <SelectItem value="mg">Belo Horizonte</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white text-xl shadow-lg`}>
                    {category.icon}
                  </div>
                  <h3 className="font-medium text-sm">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Results and View Controls */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{filteredItems.length} produtos encontrados</h2>
              <p className="text-muted-foreground">
                {selectedCategory !== "all" && `Categoria: ${categories.find(cat => cat.id === selectedCategory)?.name}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="aspect-video bg-muted rounded-t-xl overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {item.promoted && (
                      <Badge 
                        variant="secondary" 
                        className={`absolute top-3 left-3 ${
                          item.promotionType === 'destaque' 
                            ? 'bg-amber-500/90 text-white' 
                            : 'bg-blue-500/90 text-white'
                        }`}
                      >
                        {item.promotionType === 'destaque' ? (
                          <><Crown className="h-3 w-3 mr-1" /> Destaque</>
                        ) : (
                          <><Zap className="h-3 w-3 mr-1" /> Premium</>
                        )}
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{item.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{item.rating}</span>
                        <span className="text-sm text-muted-foreground">({item.reviews})</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-primary">R$ {item.price}/dia</p>
                      <Button size="sm">
                        Ver Item
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-32 h-24 bg-muted rounded-xl overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {item.promoted && (
                        <Badge 
                          variant="secondary" 
                          className={`absolute -top-2 -left-2 ${
                            item.promotionType === 'destaque' 
                              ? 'bg-amber-500/90 text-white' 
                              : 'bg-blue-500/90 text-white'
                          }`}
                        >
                          {item.promotionType === 'destaque' ? (
                            <><Crown className="h-3 w-3 mr-1" /> Destaque</>
                          ) : (
                            <><Zap className="h-3 w-3 mr-1" /> Premium</>
                          )}
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                          <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{item.rating}</span>
                              <span className="text-sm text-muted-foreground">({item.reviews} avaliações)</span>
                            </div>
                            <Badge variant="outline">
                              {item.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Por {item.owner}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary mb-3">R$ {item.price}/dia</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button size="sm">
                              Ver Item
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

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <div className="flex gap-2">
            <Button variant="outline">Anterior</Button>
            <Button variant="default">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Próximo</Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Buscar;