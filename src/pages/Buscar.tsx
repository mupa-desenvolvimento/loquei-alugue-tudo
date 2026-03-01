import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Map as MapIcon, 
  List, 
  Heart, 
  Star, 
  SlidersHorizontal, 
  ChevronDown,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Buscar = () => {
  const [showMap, setShowMap] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);

  // Mock data aligned with Index.tsx style but more comprehensive
  const items = [
    {
      id: 1,
      name: "Furadeira Professional Bosch",
      category: "Ferramentas",
      price: 25,
      rating: 4.8,
      reviews: 32,
      location: "São Paulo, SP",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      coordinates: { lat: -23.550520, lng: -46.633308 },
      guestFavorite: true
    },
    {
      id: 2,
      name: "Câmera DSLR Canon EOS",
      category: "Eletrônicos",
      price: 80,
      rating: 4.9,
      reviews: 18,
      location: "Rio de Janeiro, RJ", 
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      coordinates: { lat: -22.906847, lng: -43.172896 },
      guestFavorite: false
    },
    {
      id: 3,
      name: "Serra Circular Profissional",
      category: "Ferramentas",
      price: 45,
      rating: 4.7,
      reviews: 24,
      location: "Belo Horizonte, MG",
      image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      coordinates: { lat: -19.916681, lng: -43.934493 },
      guestFavorite: true
    },
    {
      id: 4,
      name: "Projetor Full HD 3000 Lumens",
      category: "Eletrônicos",
      price: 60,
      rating: 4.6,
      reviews: 15,
      location: "Salvador, BA",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      coordinates: { lat: -12.977749, lng: -38.501630 },
      guestFavorite: false
    },
    {
      id: 5,
      name: "Kit Ferramentas Completo",
      category: "Ferramentas",
      price: 35,
      rating: 4.5,
      reviews: 10,
      location: "Curitiba, PR",
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      coordinates: { lat: -25.4284, lng: -49.2733 },
      guestFavorite: false
    },
    {
      id: 6,
      name: "Caixa de Som JBL PartyBox",
      category: "Eventos",
      price: 120,
      rating: 4.9,
      reviews: 45,
      location: "Florianópolis, SC",
      image: "https://images.unsplash.com/photo-1545459720-aac3e5ca9678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      coordinates: { lat: -27.5959, lng: -48.5480 },
      guestFavorite: true
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Sticky Filter Bar */}
      <div className="sticky top-[72px] z-30 bg-background border-b px-4 py-3 hidden md:block">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full border-gray-300 hover:border-black">
                  Preço <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4" align="start">
                <DropdownMenuLabel>Faixa de preço</DropdownMenuLabel>
                <div className="py-4">
                  <Slider 
                    defaultValue={[0, 500]} 
                    max={1000} 
                    step={10} 
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between mt-4 text-sm">
                    <div className="border rounded-md px-3 py-1">
                      <span className="text-muted-foreground text-xs block">Mínimo</span>
                      <span>R$ {priceRange[0]}</span>
                    </div>
                    <div className="border rounded-md px-3 py-1">
                      <span className="text-muted-foreground text-xs block">Máximo</span>
                      <span>R$ {priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setPriceRange([0, 1000])}>Limpar</Button>
                  <Button size="sm">Aplicar</Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="rounded-full border-gray-300 hover:border-black">
              Tipo de item
            </Button>
            
            <Button variant="outline" className="rounded-full border-gray-300 hover:border-black">
              Marca
            </Button>
            
            <Button variant="outline" className="rounded-full border-gray-300 hover:border-black flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </Button>
          </div>

          <div className="flex items-center gap-2 border-l pl-4 ml-4">
            <div className="flex items-center space-x-2">
              <Switch id="map-mode" checked={showMap} onCheckedChange={setShowMap} />
              <Label htmlFor="map-mode" className="cursor-pointer flex items-center gap-2">
                Mostrar mapa <MapIcon className="h-4 w-4" />
              </Label>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 flex">
        {/* Product Grid */}
        <div className={`flex-1 p-6 ${showMap ? 'lg:w-3/5' : 'container mx-auto'}`}>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              {items.length} resultados encontrados
            </h1>
            {/* Mobile Map Toggle */}
            <Button 
              className="md:hidden fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 rounded-full shadow-lg px-6"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? (
                <>Lista <List className="ml-2 h-4 w-4" /></>
              ) : (
                <>Mapa <MapIcon className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>

          <div className={`grid gap-6 ${
            showMap 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          }`}>
            {items.map((item) => (
              <Link key={item.id} to={`/produto/${item.id}`} className="group cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted mb-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                  <button className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Heart className="h-6 w-6 text-white drop-shadow-md stroke-[2px]" />
                  </button>
                  {item.guestFavorite && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-xs font-semibold px-2 py-1 rounded shadow-sm">
                      Destaque
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-base truncate pr-2">{item.location}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-foreground" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm truncate">{item.name}</p>
                  <p className="text-muted-foreground text-sm">
                    <span className="font-semibold text-foreground">R$ {item.price}</span> / dia
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Map Side Panel */}
        {showMap && (
          <div className="hidden lg:block w-2/5 sticky top-[137px] h-[calc(100vh-137px)] bg-muted border-l">
            <div className="h-full w-full flex items-center justify-center bg-slate-100 text-muted-foreground">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Mapa interativo</p>
                <p className="text-sm">(Em desenvolvimento)</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {!showMap && <Footer />}
    </div>
  );
};

export default Buscar;
