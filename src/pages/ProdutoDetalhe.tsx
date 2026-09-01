import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useListing, useListingReviews } from "@/hooks/useListings";
import { useFavoriteIds, useToggleFavorite } from "@/hooks/useFavorites";
import { calculatePrice, countDays, formatBRL } from "@/lib/pricing";

const HIGHLIGHTS = [
  { icon: Zap, label: "Retirada combinada com o dono", detail: "Vocês acertam local e horário pelo chat." },
  { icon: ShieldCheck, label: "Proteção Loquei", detail: "Danos e roubo cobertos até o valor da caução." },
  { icon: CheckCircle2, label: "Dono verificado", detail: "Identidade confirmada antes de anunciar." },
  { icon: CalendarIcon, label: "Cancelamento grátis", detail: "Até 24h antes da retirada." },
];

const ProdutoDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: listing, isLoading, isError } = useListing(id);
  const { data: reviews = [] } = useListingReviews(id);
  const { data: favoriteIds = [] } = useFavoriteIds(user?.id);
  const toggleFavorite = useToggleFavorite(user?.id);

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const favorited = listing ? favoriteIds.includes(listing.id) : false;

  // Sem datas escolhidas, mostramos o preço de uma diária como referência.
  const breakdown = useMemo(() => {
    if (!listing) return null;
    const days = startDate && endDate ? countDays(startDate, endDate) : 1;
    return calculatePrice(listing.price_per_day, days, listing.deposit);
  }, [listing, startDate, endDate]);

  const handleReserve = () => {
    if (!listing) return;
    if (!startDate || !endDate) {
      toast.error("Escolha as datas de retirada e devolução");
      return;
    }
    const params = new URLSearchParams({
      inicio: format(startDate, "yyyy-MM-dd"),
      fim: format(endDate, "yyyy-MM-dd"),
    });
    navigate(`/checkout/${listing.id}?${params}`);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!");
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-2">Item não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            Este anúncio pode ter sido removido ou pausado pelo dono.
          </p>
          <Button asChild>
            <Link to="/buscar">Ver outros itens</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const [cover, ...gallery] = listing.images;
  const ownerName = listing.owner?.name ?? "Anunciante";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{listing.title}</h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm md:text-base">
              {listing.rating_count > 0 ? (
                <>
                  <Star className="h-4 w-4 fill-foreground" />
                  <span className="font-semibold">{listing.rating_avg}</span>
                  <span className="text-muted-foreground">
                    ({listing.rating_count} {listing.rating_count === 1 ? "avaliação" : "avaliações"})
                  </span>
                  <span className="text-muted-foreground">•</span>
                </>
              ) : (
                <span className="text-muted-foreground">Ainda sem avaliações •</span>
              )}
              <span className="font-medium">{listing.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="px-2" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="px-2"
                aria-pressed={favorited}
                onClick={() =>
                  toggleFavorite.mutate(
                    { listingId: listing.id, favorited },
                    {
                      onError: (error) =>
                        toast.error(error instanceof Error ? error.message : "Erro ao salvar"),
                    },
                  )
                }
              >
                <Heart className={`h-4 w-4 mr-2 ${favorited ? "fill-red-500 text-red-500" : ""}`} />
                {favorited ? "Salvo" : "Salvar"}
              </Button>
            </div>
          </div>
        </div>

        {/* Galeria */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden mb-8 md:mb-12 bg-muted">
          <div className="md:col-span-2 h-full">
            {cover && (
              <img src={cover} alt={listing.title} className="w-full h-full object-cover" />
            )}
          </div>
          {gallery.slice(0, 4).map((image, index) => (
            <div key={image} className={`hidden md:block h-full ${index < 2 ? "" : ""}`}>
              <img
                src={image}
                alt={`${listing.title} — foto ${index + 2}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Dono */}
            <div className="flex items-center justify-between pb-6 border-b">
              <div>
                <h2 className="text-xl font-semibold mb-1">Anunciado por {ownerName}</h2>
                {listing.owner?.created_at && (
                  <p className="text-muted-foreground">
                    Na Loquei desde {format(new Date(listing.owner.created_at), "MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                )}
              </div>
              <Avatar className="h-14 w-14">
                <AvatarImage src={listing.owner?.avatar_url ?? undefined} />
                <AvatarFallback>{ownerName[0]}</AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4 pb-6 border-b">
              {HIGHLIGHTS.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <item.icon className="h-6 w-6 text-foreground mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold">{item.label}</h3>
                    <p className="text-muted-foreground text-sm">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pb-6 border-b">
              <h2 className="text-xl font-semibold mb-4">Sobre este item</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            <div className="pb-6 border-b">
              <h2 className="text-xl font-semibold mb-4">Disponibilidade</h2>
              <p className="text-muted-foreground mb-4">
                Escolha a data de retirada e a de devolução.
              </p>
              <div className="border rounded-xl p-4 inline-block">
                <Calendar
                  mode="range"
                  selected={{ from: startDate, to: endDate }}
                  onSelect={(range) => {
                    setStartDate(range?.from);
                    setEndDate(range?.to);
                  }}
                  disabled={{ before: new Date() }}
                  locale={ptBR}
                  numberOfMonths={1}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 fill-foreground" />
                <h2 className="text-xl font-semibold">
                  {listing.rating_count > 0
                    ? `${listing.rating_avg} • ${listing.rating_count} avaliações`
                    : "Avaliações"}
                </h2>
              </div>

              {reviews.length === 0 ? (
                <p className="text-muted-foreground">
                  {listing.rating_count > 0
                    ? "Nenhum comentário escrito ainda."
                    : "Este item ainda não recebeu avaliações. Seja o primeiro a alugar."}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={review.author?.avatar_url ?? undefined} />
                          <AvatarFallback>{review.author?.name?.[0] ?? "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{review.author?.name ?? "Usuário"}</p>
                          <p className="text-muted-foreground text-xs">
                            {format(new Date(review.created_at), "MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card de reserva */}
          <div className="relative">
            <div className="sticky top-28">
              <Card className="shadow-xl border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-bold">{formatBRL(listing.price_per_day)}</span>
                      <span className="text-muted-foreground text-sm"> / dia</span>
                    </div>
                    {listing.rating_count > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3 w-3 fill-foreground" />
                        <span className="font-semibold">{listing.rating_avg}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 border rounded-xl overflow-hidden">
                    {([
                      ["Retirada", startDate, setStartDate] as const,
                      ["Devolução", endDate, setEndDate] as const,
                    ]).map(([label, value, setValue]) => (
                      <div key={label} className="p-3 border-r last:border-r-0">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                          {label}
                        </span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="p-0 h-auto font-normal text-left w-full justify-start hover:bg-transparent">
                              {value ? format(value, "dd/MM/yyyy") : "Adicionar data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={value}
                              onSelect={setValue}
                              disabled={{ before: label === "Devolução" && startDate ? startDate : new Date() }}
                              locale={ptBR}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full py-6 text-lg font-semibold"
                    onClick={handleReserve}
                    disabled={listing.owner_id === user?.id}
                  >
                    {listing.owner_id === user?.id ? "Este item é seu" : "Reservar"}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Você não será cobrado ainda
                  </p>

                  {breakdown && (
                    <>
                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            {formatBRL(listing.price_per_day)} x {breakdown.days}{" "}
                            {breakdown.days === 1 ? "dia" : "dias"}
                          </span>
                          <span>{formatBRL(breakdown.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Taxa de serviço Loquei</span>
                          <span>{formatBRL(breakdown.serviceFee)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Proteção do item</span>
                          <span>{formatBRL(breakdown.insuranceFee)}</span>
                        </div>
                        {breakdown.deposit > 0 && (
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Caução (bloqueada, devolvida depois)</span>
                            <span>{formatBRL(breakdown.deposit)}</span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="flex justify-between font-bold text-lg pt-2">
                        <span>Total</span>
                        <span>{formatBRL(breakdown.total)}</span>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="justify-center border-t p-4 bg-muted/20">
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <Flag className="h-4 w-4" />
                    <span className="underline">Denunciar este anúncio</span>
                  </button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        <div className="py-12 border-t mt-12">
          <h2 className="text-xl font-semibold mb-4">Onde você vai retirar</h2>
          <p className="text-muted-foreground mb-6">{listing.location}</p>
          <div className="w-full h-[400px] bg-muted rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
            <MapPin className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
            <span className="text-muted-foreground">
              O endereço exato é revelado após a reserva confirmada
            </span>
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProdutoDetalhe;
