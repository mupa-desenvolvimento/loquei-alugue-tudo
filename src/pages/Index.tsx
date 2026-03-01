import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  Smartphone, 
  Car, 
  Home, 
  Trophy, 
  PartyPopper, 
  Music, 
  LayoutGrid,
  Star,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Todos", icon: LayoutGrid },
    { id: "tools", name: "Ferramentas", icon: Wrench },
    { id: "electronics", name: "Eletrônicos", icon: Smartphone },
    { id: "vehicles", name: "Veículos", icon: Car },
    { id: "home", name: "Casa & Jardim", icon: Home },
    { id: "sports", name: "Esportes", icon: Trophy },
    { id: "events", name: "Eventos", icon: PartyPopper },
    { id: "music", name: "Música", icon: Music },
  ];

  const items = [
    {
      id: 1,
      name: "Furadeira Professional Bosch",
      category: "Ferramentas",
      price: 25,
      rating: 4.9,
      location: "São Paulo, SP",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dates: "15-20 Jan"
    },
    {
      id: 2,
      name: "Câmera Sony Alpha a7III",
      category: "Eletrônicos",
      price: 150,
      rating: 5.0,
      location: "Rio de Janeiro, RJ", 
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dates: "10-12 Fev",
      guestFavorite: true
    },
    {
      id: 3,
      name: "Prancha de Surf Longboard",
      category: "Esportes",
      price: 45,
      rating: 4.8,
      location: "Florianópolis, SC",
      image: "https://images.unsplash.com/photo-1531722569936-825d3dd91b15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dates: "Hoje"
    },
    {
      id: 4,
      name: "Caixa de Som JBL PartyBox",
      category: "Música",
      price: 80,
      rating: 4.7,
      location: "Salvador, BA",
      image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dates: "20-22 Jan"
    },
    {
      id: 5,
      name: "Barraca de Camping 4 Pessoas",
      category: "Esportes",
      price: 60,
      rating: 4.6,
      location: "Belo Horizonte, MG",
      image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dates: "05-10 Mar"
    },
    {
      id: 6,
      name: "Drone DJI Mini 3 Pro",
      category: "Eletrônicos",
      price: 120,
      rating: 4.95,
      location: "Curitiba, PR",
      image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dates: "Amanhã"
    },
    {
      id: 7,
      name: "Bicicleta Mountain Bike",
      category: "Esportes",
      price: 55,
      rating: 4.8,
      location: "Brasília, DF",
      image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dates: "12-14 Fev"
    },
    {
      id: 8,
      name: "Kit Iluminação Estúdio",
      category: "Eletrônicos",
      price: 90,
      rating: 5.0,
      location: "Porto Alegre, RS",
      image: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dates: "25-28 Jan",
      guestFavorite: true
    }
  ];

  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter(item => item.category === categories.find(c => c.id === selectedCategory)?.name);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Categories Bar */}
      <div className="sticky top-[72px] z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center gap-2 min-w-[64px] transition-all group ${
                  selectedCategory === category.id 
                    ? "text-primary border-b-2 border-primary pb-1" 
                    : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted-foreground/30 pb-1"
                }`}
              >
                <category.icon className={`h-6 w-6 ${selectedCategory === category.id ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} />
                <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {filteredItems.map((item) => (
            <Link key={item.id} to={`/produto/${item.id}`} className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-muted mb-3">
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
                <p className="text-muted-foreground text-sm">{item.dates}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-semibold">R$ {item.price}</span>
                  <span className="text-sm text-foreground">/ dia</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;