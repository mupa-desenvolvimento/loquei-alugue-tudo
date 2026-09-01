import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useMyBookings, type BookingWithListing } from "@/hooks/useBookings";
import { formatBRL } from "@/lib/pricing";
import type { BookingStatus } from "@/types/database";

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Aguardando aprovação",
  confirmed: "Confirmada",
  active: "Em andamento",
  returned: "Devolvida",
  completed: "Concluída",
  cancelled: "Cancelada",
  rejected: "Recusada",
};

const TAB_STATUSES: Record<string, BookingStatus[]> = {
  upcoming: ["pending", "confirmed"],
  active: ["active"],
  past: ["returned", "completed", "cancelled", "rejected"],
};

const TAB_STYLE =
  "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 mr-8 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors";

const BookingCard = ({ booking }: { booking: BookingWithListing }) => (
  <Card className="overflow-hidden hover:shadow-md transition-shadow group border-muted-foreground/20">
    <div className="aspect-video relative overflow-hidden bg-muted">
      {booking.listing?.images?.[0] && (
        <img
          src={booking.listing.images[0]}
          alt={booking.listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      )}
      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
        {STATUS_LABEL[booking.status]}
      </div>
    </div>
    <CardHeader className="p-4">
      <CardTitle className="text-lg line-clamp-1">
        {booking.listing?.title ?? "Item removido"}
      </CardTitle>
      <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        {format(parseISO(booking.start_date), "d 'de' MMM", { locale: ptBR })} —{" "}
        {format(parseISO(booking.end_date), "d 'de' MMM", { locale: ptBR })}
      </div>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{booking.listing?.location}</span>
        <span className="font-semibold">{formatBRL(booking.total)}</span>
      </div>
    </CardContent>
    <CardFooter className="p-4 bg-muted/20 flex gap-2">
      <Button variant="outline" size="sm" className="flex-1 bg-background" asChild>
        <Link to={`/produto/${booking.listing_id}`}>Ver item</Link>
      </Button>
      <Button size="sm" className="flex-1" asChild>
        <Link to="/mensagens">Mensagem</Link>
      </Button>
    </CardFooter>
  </Card>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-16 rounded-xl bg-muted/5 border-2 border-dashed">
    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
    <h3 className="text-lg font-medium mb-2">Nenhuma locação encontrada</h3>
    <p className="text-muted-foreground mb-6">{message}</p>
    <Button asChild>
      <Link to="/buscar">Começar a explorar</Link>
    </Button>
  </div>
);

const PainelLocatario = () => {
  const { user } = useAuth();
  const { data: bookings = [], isLoading } = useMyBookings(user?.id);

  const tabs = [
    { value: "upcoming", label: "Próximas", empty: "Você não tem nenhuma locação agendada." },
    { value: "active", label: "Em andamento", empty: "Você não tem locações em andamento." },
    { value: "past", label: "Anteriores", empty: "Você não tem locações anteriores." },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Minhas locações</h1>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-transparent border-b w-full justify-start h-auto p-0 rounded-none mb-8 overflow-x-auto">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className={TAB_STYLE}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => {
            const filtered = bookings.filter((booking) =>
              TAB_STATUSES[tab.value].includes(booking.status),
            );

            return (
              <TabsContent key={tab.value} value={tab.value} className="mt-0 focus-visible:outline-none">
                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className="h-72 w-full rounded-xl" />
                    ))}
                  </div>
                ) : filtered.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                    {filtered.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message={tab.empty} />
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default PainelLocatario;
