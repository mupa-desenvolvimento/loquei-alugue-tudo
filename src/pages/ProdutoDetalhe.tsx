import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { 
  Star, 
  MapPin, 
  Share, 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Calendar as CalendarIcon,
  Flag,
  ChevronRight
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const ProdutoDetalhe = () => {
  const { id } = useParams();
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock data for the product
  const product = {
    id: id,
    title: "Furadeira de Impacto Bosch Professional GSB 13 RE",
    description: "Furadeira de impacto potente e robusta, ideal para trabalhos pesados em concreto, madeira e metal. Acompanha maleta e kit de brocas. Equipamento revisado e em perfeito estado de conservação.",
    price: 45,
    rating: 4.92,
    reviewCount: 128,
    location: "Vila Madalena, São Paulo, SP",
    host: {
      name: "Ricardo Oliveira",
      avatar: "https://github.com/shadcn.png",
      joined: "Membro desde 2021",
      rating: 4.95,
      reviews: 342,
      verified: true
    },
    images: [
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581147036324-c17ac41efa63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566937169390-7be4c63b8a0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: [
      { icon: Zap, label: "Entrega Expressa" },
      { icon: ShieldCheck, label: "Seguro Incluso" },
      { icon: CheckCircle2, label: "Revisado Recentemente" },
      { icon: CalendarIcon, label: "Cancelamento Grátis" }
    ],
    reviews: [
      {
        id: 1,
        user: "Ana Clara",
        avatar: "",
        date: "Fevereiro 2024",
        rating: 5,
        comment: "Equipamento excelente! O Ricardo foi super atencioso e explicou como usar. Recomendo muito."
      },
      {
        id: 2,
        user: "Marcos Silva",
        avatar: "",
        date: "Janeiro 2024",
        rating: 5,
        comment: "Furadeira muito potente, serviu perfeitamente para o que eu precisava. Preço justo."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {product.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm md:text-base">
              <Star className="h-4 w-4 fill-foreground" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted-foreground underline cursor-pointer">
                ({product.reviewCount} avaliações)
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="font-medium underline cursor-pointer">
                {product.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="underline hover:no-underline hover:bg-transparent px-2">
                <Share className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="ghost" size="sm" className="underline hover:no-underline hover:bg-transparent px-2">
                <Heart className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden mb-8 md:mb-12 relative">
          <div className="md:col-span-2 h-full">
            <img 
              src={product.images[0]} 
              alt={product.title} 
              className="w-full h-full object-cover cursor-pointer hover:brightness-95 transition-all"
            />
          </div>
          <div className="hidden md:grid grid-cols-1 gap-2 h-full">
            <img 
              src={product.images[1]} 
              alt="Detail 1" 
              className="w-full h-full object-cover cursor-pointer hover:brightness-95 transition-all" 
            />
            <img 
              src={product.images[2]} 
              alt="Detail 2" 
              className="w-full h-full object-cover cursor-pointer hover:brightness-95 transition-all" 
            />
          </div>
          <div className="hidden md:grid grid-cols-1 gap-2 h-full">
            <img 
              src={product.images[3]} 
              alt="Detail 3" 
              className="w-full h-full object-cover cursor-pointer hover:brightness-95 transition-all" 
            />
            <img 
              src={product.images[4]} 
              alt="Detail 4" 
              className="w-full h-full object-cover cursor-pointer hover:brightness-95 transition-all" 
            />
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute bottom-4 right-4 shadow-md border-black/10"
          >
            Mostrar todas as fotos
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column (Details) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <div className="flex items-center justify-between pb-6 border-b">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Anunciado por {product.host.name}
                </h2>
                <p className="text-muted-foreground">
                  {product.host.joined} • {product.host.rating} ({product.host.reviews} avaliações)
                </p>
              </div>
              <Avatar className="h-14 w-14">
                <AvatarImage src={product.host.avatar} />
                <AvatarFallback>{product.host.name[0]}</AvatarFallback>
              </Avatar>
            </div>

            {/* Highlights */}
            <div className="space-y-4 pb-6 border-b">
              {product.amenities.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <item.icon className="h-6 w-6 text-foreground mt-1" />
                  <div>
                    <h3 className="font-semibold">{item.label}</h3>
                    <p className="text-muted-foreground text-sm">
                      Detalhes adicionais sobre este benefício.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="pb-6 border-b">
              <h2 className="text-xl font-semibold mb-4">Sobre este item</h2>
              <p className="text-foreground leading-relaxed">
                {product.description}
              </p>
              <Button variant="link" className="px-0 mt-2 font-semibold text-foreground underline decoration-1 underline-offset-2">
                Mostrar mais
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Calendar Preview */}
            <div className="pb-6 border-b">
              <h2 className="text-xl font-semibold mb-4">Disponibilidade</h2>
              <p className="text-muted-foreground mb-4">Selecione as datas para ver a disponibilidade exata</p>
              <div className="border rounded-xl p-4 inline-block">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                  locale={ptBR}
                />
              </div>
            </div>

            {/* Reviews Preview */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 fill-foreground" />
                <h2 className="text-xl font-semibold">
                  {product.rating} • {product.reviewCount} avaliações
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{review.user[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{review.user}</p>
                        <p className="text-muted-foreground text-xs">{review.date}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-6 w-full md:w-auto">
                Mostrar todas as {product.reviewCount} avaliações
              </Button>
            </div>
          </div>

          {/* Right Column (Sticky Booking Card) */}
          <div className="relative">
            <div className="sticky top-28">
              <Card className="shadow-xl border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-bold">R$ {product.price}</span>
                      <span className="text-muted-foreground text-sm"> / dia</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-foreground" />
                      <span className="font-semibold">{product.rating}</span>
                      <span className="text-muted-foreground underline">({product.reviewCount} avaliações)</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 border rounded-xl overflow-hidden">
                    <div className="p-3 border-r hover:bg-muted/50 transition-colors cursor-pointer border-b md:border-b-0">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block">Retirada</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="p-0 h-auto font-normal text-left w-full hover:bg-transparent">
                            {date ? format(date, "d/MM/yyyy") : <span>Data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="p-3 hover:bg-muted/50 transition-colors cursor-pointer border-b md:border-b-0">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block">Devolução</label>
                      <span className="text-sm block py-1 text-muted-foreground">Adicionar data</span>
                    </div>
                  </div>

                  <Button className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-white" asChild>
                    <Link to={`/checkout/${product.id}`}>
                      Reservar
                    </Link>
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground">
                    Você não será cobrado ainda
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="underline">R$ {product.price} x 5 dias</span>
                      <span>R$ {product.price * 5}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="underline">Taxa de serviço Loquei</span>
                      <span>R$ 45</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="underline">Seguro de proteção</span>
                      <span>R$ 30</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span>R$ {product.price * 5 + 45 + 30}</span>
                  </div>
                </CardContent>
                <CardFooter className="justify-center border-t p-4 bg-muted/20">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Flag className="h-4 w-4" />
                    <span className="underline cursor-pointer">Denunciar este anúncio</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        {/* Location Map Placeholder */}
        <div className="py-12 border-t mt-12">
          <h2 className="text-xl font-semibold mb-4">Onde você vai retirar</h2>
          <p className="text-muted-foreground mb-6">{product.location}</p>
          <div className="w-full h-[400px] bg-muted rounded-xl flex items-center justify-center relative overflow-hidden">
            <MapPin className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
            <span className="text-muted-foreground">Mapa indisponível na visualização demo</span>
            
            {/* Fake Map Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
              style={{
                backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            ></div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProdutoDetalhe;
