import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Star, ShieldCheck, CreditCard, Lock } from "lucide-react";

const Checkout = () => {
  const { productId } = useParams();
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Mock data
  const product = {
    id: productId,
    title: "Furadeira de Impacto Bosch Professional",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 45,
    rating: 4.92,
    reviews: 128,
    location: "Vila Madalena, SP",
    host: "Ricardo Oliveira"
  };

  const bookingDetails = {
    dates: "15 Fev - 20 Fev",
    days: 5,
    total: product.price * 5,
    serviceFee: 45,
    insurance: 30
  };

  const totalAmount = bookingDetails.total + bookingDetails.serviceFee + bookingDetails.insurance;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 h-20 flex items-center">
          <Link to="/">
            <img 
              src="/lovable-uploads/46d0dc9e-74fd-49cf-8e73-306a25807b36.png" 
              alt="Loquei" 
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ChevronLeft className="h-4 w-4" />
          <Link to={`/produto/${productId}`} className="font-medium">Voltar para o item</Link>
        </div>

        <h1 className="text-3xl font-bold mb-12">Solicitar locação</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Form */}
          <div className="space-y-10">
            {/* Trip Details */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Sua locação</h2>
              <div className="flex justify-between items-center py-4 border-b">
                <div>
                  <h3 className="font-medium">Datas</h3>
                  <p className="text-muted-foreground">{bookingDetails.dates}</p>
                </div>
                <Button variant="link" className="font-semibold underline">Editar</Button>
              </div>
              <div className="flex justify-between items-center py-4 border-b">
                <div>
                  <h3 className="font-medium">Quantidade</h3>
                  <p className="text-muted-foreground">1 item</p>
                </div>
                <Button variant="link" className="font-semibold underline">Editar</Button>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Pagamento</h2>
              <RadioGroup defaultValue="card" onValueChange={setPaymentMethod} className="space-y-4">
                <div className="flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:border-black transition-colors">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="font-medium cursor-pointer">Cartão de Crédito</Label>
                  </div>
                  <div className="flex gap-1">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:border-black transition-colors">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="font-medium cursor-pointer">Pix</Label>
                  </div>
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Número do cartão</Label>
                      <Input placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Validade</Label>
                        <Input placeholder="MM/AA" />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input placeholder="123" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Message to Host */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Mensagem para o locador</h2>
              <p className="text-muted-foreground mb-4 text-sm">
                Conte ao Ricardo por que você está alugando este item e quando pretende buscá-lo.
              </p>
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>RO</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea 
                    className="w-full min-h-[120px] p-3 rounded-xl border resize-none focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Olá Ricardo! Gostaria de alugar sua furadeira para..."
                  ></textarea>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <p className="text-xs text-muted-foreground mb-6">
                Ao selecionar o botão abaixo, eu concordo com as Regras do Locador, Regras de Locação para Locatários, e que a Loquei pode cobrar meu método de pagamento se eu for responsável por danos.
              </p>
              <Button size="lg" className="w-full md:w-auto px-12 py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-white">
                Solicitar locação
              </Button>
            </section>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="hidden lg:block">
            <div className="sticky top-32 border rounded-xl p-6 shadow-sm">
              <div className="flex gap-4 mb-6">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Locação de item</p>
                  <h3 className="font-medium text-sm line-clamp-2">{product.title}</h3>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-foreground" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews} avaliações)</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="font-semibold text-lg mb-4">Detalhes do preço</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="underline decoration-muted-foreground/50">R$ {product.price} x {bookingDetails.days} dias</span>
                  <span>R$ {bookingDetails.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline decoration-muted-foreground/50">Taxa de serviço</span>
                  <span>R$ {bookingDetails.serviceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline decoration-muted-foreground/50">Seguro de proteção</span>
                  <span>R$ {bookingDetails.insurance}</span>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total (BRL)</span>
                <span>R$ {totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
