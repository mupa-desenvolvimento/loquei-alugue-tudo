import { useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Star, CreditCard, Lock, Loader2, ShieldCheck } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useListing } from "@/hooks/useListings";
import { useCreateBooking } from "@/hooks/useBookings";
import { calculatePrice, countDays, formatBRL } from "@/lib/pricing";

const Checkout = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: listing, isLoading } = useListing(productId);
  const createBooking = useCreateBooking();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [message, setMessage] = useState("");

  const startParam = searchParams.get("inicio");
  const endParam = searchParams.get("fim");

  if (isLoading) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-12 max-w-6xl space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Item indisponível</h1>
        <p className="text-muted-foreground">Este anúncio não está mais aceitando reservas.</p>
        <Button asChild>
          <Link to="/buscar">Ver outros itens</Link>
        </Button>
      </div>
    );
  }

  // Sem datas na URL o checkout não tem o que cobrar — volta para o anúncio.
  if (!startParam || !endParam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Escolha as datas primeiro</h1>
        <p className="text-muted-foreground">
          Selecione retirada e devolução na página do item para ver o valor.
        </p>
        <Button asChild>
          <Link to={`/produto/${listing.id}`}>Voltar para o item</Link>
        </Button>
      </div>
    );
  }

  const days = countDays(startParam, endParam);
  const price = calculatePrice(listing.price_per_day, days, listing.deposit);
  const ownerName = listing.owner?.name ?? "o dono";

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await createBooking.mutateAsync({
        listing_id: listing.id,
        renter_id: user.id,
        start_date: startParam,
        end_date: endParam,
        daily_price: listing.price_per_day,
        subtotal: price.subtotal,
        service_fee: price.serviceFee,
        insurance_fee: price.insuranceFee,
        deposit: price.deposit,
        total: price.total,
      });
      toast.success("Solicitação enviada! Aguarde a confirmação do dono.");
      navigate("/painel-locatario");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível enviar a solicitação");
    }
  };

  const priceRows = [
    [`${formatBRL(listing.price_per_day)} x ${days} ${days === 1 ? "dia" : "dias"}`, price.subtotal],
    ["Taxa de serviço", price.serviceFee],
    ["Proteção do item", price.insuranceFee],
  ] as const;

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
        <Link
          to={`/produto/${listing.id}`}
          className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors w-fit font-medium"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para o item
        </Link>

        <h1 className="text-3xl font-bold mb-12">Solicitar locação</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-semibold mb-4">Sua locação</h2>
              <div className="flex justify-between items-center py-4 border-b">
                <div>
                  <h3 className="font-medium">Datas</h3>
                  <p className="text-muted-foreground">
                    {format(parseISO(startParam), "d 'de' MMM", { locale: ptBR })} —{" "}
                    {format(parseISO(endParam), "d 'de' MMM", { locale: ptBR })}
                  </p>
                </div>
                <Button variant="link" className="font-semibold underline" asChild>
                  <Link to={`/produto/${listing.id}`}>Editar</Link>
                </Button>
              </div>
              <div className="flex justify-between items-center py-4 border-b">
                <div>
                  <h3 className="font-medium">Retirada</h3>
                  <p className="text-muted-foreground">{listing.location}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Pagamento</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <Label
                  htmlFor="card"
                  className="flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:border-foreground transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="card" id="card" />
                    <span className="font-medium">Cartão de crédito</span>
                  </div>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </Label>

                <Label
                  htmlFor="pix"
                  className="flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:border-foreground transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="pix" id="pix" />
                    <span className="font-medium">Pix</span>
                  </div>
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </Label>
              </RadioGroup>

              <div className="mt-4 flex gap-3 rounded-xl bg-muted/40 border p-4 text-sm text-muted-foreground">
                <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
                <p>
                  Nada é cobrado agora. O pagamento só é processado depois que {ownerName} aceitar
                  a solicitação — e os dados do cartão são coletados pelo provedor de pagamento,
                  nunca por esta tela.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Mensagem para o dono</h2>
              <p className="text-muted-foreground mb-4 text-sm">
                Conte para {ownerName} por que você quer o item e quando pretende buscá-lo.
              </p>
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={listing.owner?.avatar_url ?? undefined} />
                  <AvatarFallback>{ownerName[0]}</AvatarFallback>
                </Avatar>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="flex-1 min-h-[120px] p-3 rounded-xl border resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder={`Olá ${ownerName}! Gostaria de alugar seu item para...`}
                />
              </div>
            </section>

            <Separator />

            <section>
              <p className="text-xs text-muted-foreground mb-6">
                Ao continuar, você concorda com as Regras de Locação e autoriza a Loquei a cobrar
                seu método de pagamento caso seja responsável por danos ao item.
              </p>
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={createBooking.isPending}
                className="w-full md:w-auto px-12 py-6 text-lg font-bold"
              >
                {createBooking.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Solicitar locação
              </Button>
            </section>
          </div>

          {/* Resumo */}
          <div className="lg:block">
            <div className="sticky top-32 border rounded-xl p-6 shadow-sm">
              <div className="flex gap-4 mb-6">
                {listing.images[0] && (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Locação de item</p>
                  <h3 className="font-medium text-sm line-clamp-2">{listing.title}</h3>
                  {listing.rating_count > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-foreground" />
                      <span className="font-medium">{listing.rating_avg}</span>
                      <span className="text-muted-foreground">({listing.rating_count})</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="font-semibold text-lg mb-4">Detalhes do preço</h3>

              <div className="space-y-3">
                {priceRows.map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span>{label}</span>
                    <span>{formatBRL(value)}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total (BRL)</span>
                <span>{formatBRL(price.total)}</span>
              </div>

              {price.deposit > 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Além disso, {formatBRL(price.deposit)} ficam bloqueados como caução e voltam
                  para você quando o item for devolvido sem danos.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
