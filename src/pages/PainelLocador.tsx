import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { storageService } from "@/services/storage";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Package,
  Star,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Calendar,
  Camera,
  CreditCard,
  User,
  Check,
  X,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMyListings, useUpdateListingStatus } from "@/hooks/useListings";
import { useReceivedBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import { formatBRL, OWNER_COMMISSION_RATE } from "@/lib/pricing";
import type { BookingStatus } from "@/types/database";

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Aguardando você",
  confirmed: "Confirmada",
  active: "Em andamento",
  returned: "Devolvida",
  completed: "Concluída",
  cancelled: "Cancelada",
  rejected: "Recusada",
};

const PainelLocador = () => {
  const { user, updateUser } = useAuth();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { data: listings = [], isLoading: loadingListings } = useMyListings(user?.id);
  const { data: bookings = [], isLoading: loadingBookings } = useReceivedBookings(user?.id);
  const updateListingStatus = useUpdateListingStatus();
  const updateBookingStatus = useUpdateBookingStatus();

  const pending = bookings.filter((booking) => booking.status === "pending");

  // Receita = repasse ao locador nas reservas já concluídas.
  const stats = useMemo(() => {
    const settled = bookings.filter((b) => b.status === "completed" || b.status === "returned");
    const revenue = settled.reduce((sum, b) => sum + b.subtotal * (1 - OWNER_COMMISSION_RATE), 0);
    const active = bookings.filter((b) => b.status === "active" || b.status === "confirmed").length;
    const accepted = bookings.filter((b) => b.status !== "rejected" && b.status !== "pending").length;

    return {
      revenue,
      active,
      conversion: bookings.length ? (accepted / bookings.length) * 100 : 0,
    };
  }, [bookings]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const url = await storageService.uploadImage(file, "avatars");
      await updateUser({ avatar: url });
      toast.success("Foto de perfil atualizada!");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar foto");
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const respondToBooking = (id: string, status: BookingStatus) => {
    updateBookingStatus.mutate(
      { id, status },
      {
        onSuccess: () =>
          toast.success(status === "confirmed" ? "Reserva confirmada!" : "Solicitação recusada"),
        onError: () => toast.error("Não foi possível atualizar a reserva"),
      },
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Painel do Locador</h1>
            <p className="text-muted-foreground">Gerencie seus anúncios e as solicitações recebidas</p>
          </div>
          <Button asChild className="gap-2">
            <Link to="/anunciar">
              <Plus className="h-4 w-4" />
              Novo anúncio
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="produtos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="produtos">Meus anúncios</TabsTrigger>
            <TabsTrigger value="solicitacoes">
              Solicitações
              {pending.length > 0 && (
                <Badge className="ml-2 px-1.5 py-0 text-[10px]">{pending.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="perfil">Meu perfil</TabsTrigger>
          </TabsList>

          {/* Anúncios */}
          <TabsContent value="produtos" className="space-y-4">
            {loadingListings && <Skeleton className="h-28 w-full rounded-xl" />}

            {!loadingListings && listings.length === 0 && (
              <Card>
                <CardContent className="py-16 text-center">
                  <Package className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="font-medium mb-1">Você ainda não tem anúncios</p>
                  <p className="text-muted-foreground text-sm mb-6">
                    Publique o primeiro item e comece a receber solicitações.
                  </p>
                  <Button asChild>
                    <Link to="/anunciar">Anunciar item</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {listings.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                        {item.images[0] ? (
                          <img src={item.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-muted-foreground">{item.category?.name}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {item.rating_count > 0 ? `${item.rating_avg} (${item.rating_count})` : "sem avaliações"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {(() => {
                              const total = bookings.filter((b) => b.listing_id === item.id).length;
                              return `${total} ${total === 1 ? "reserva" : "reservas"}`;
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {formatBRL(item.price_per_day)}<span className="text-sm font-normal">/dia</span>
                      </p>
                      <Badge variant={item.status === "active" ? "default" : "secondary"} className="mt-2">
                        {item.status === "active" ? "Ativo" : item.status === "paused" ? "Pausado" : "Rascunho"}
                      </Badge>
                      <div className="flex gap-2 mt-2 justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/produto/${item.id}`}>Ver</Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateListingStatus.mutate({
                              id: item.id,
                              status: item.status === "active" ? "paused" : "active",
                            })
                          }
                        >
                          {item.status === "active" ? "Pausar" : "Reativar"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Solicitações */}
          <TabsContent value="solicitacoes" className="space-y-4">
            {loadingBookings && <Skeleton className="h-24 w-full rounded-xl" />}

            {!loadingBookings && bookings.length === 0 && (
              <Card>
                <CardContent className="py-16 text-center text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma solicitação por enquanto.</p>
                </CardContent>
              </Card>
            )}

            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{booking.listing?.title ?? "Item removido"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(booking.start_date), "d 'de' MMM", { locale: ptBR })} —{" "}
                      {format(parseISO(booking.end_date), "d 'de' MMM", { locale: ptBR })}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      {STATUS_LABEL[booking.status]}
                    </Badge>
                  </div>

                  <div className="text-right space-y-2">
                    <p className="text-lg font-bold">{formatBRL(booking.subtotal)}</p>
                    <p className="text-xs text-muted-foreground">
                      Você recebe {formatBRL(booking.subtotal * (1 - OWNER_COMMISSION_RATE))}
                    </p>
                    {booking.status === "pending" && (
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          onClick={() => respondToBooking(booking.id, "confirmed")}
                          disabled={updateBookingStatus.isPending}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aceitar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => respondToBooking(booking.id, "rejected")}
                          disabled={updateBookingStatus.isPending}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Recusar
                        </Button>
                      </div>
                    )}
                    {booking.status === "confirmed" && (
                      <Button size="sm" variant="outline" onClick={() => respondToBooking(booking.id, "active")}>
                        Marcar como retirado
                      </Button>
                    )}
                    {booking.status === "active" && (
                      <Button size="sm" variant="outline" onClick={() => respondToBooking(booking.id, "returned")}>
                        Confirmar devolução
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Financeiro */}
          <TabsContent value="financeiro" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recebido (líquido)</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatBRL(stats.revenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    Já descontada a comissão de {OWNER_COMMISSION_RATE * 100}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Locações ativas</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.active}</div>
                  <p className="text-xs text-muted-foreground">Confirmadas ou em andamento</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de aceite</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.conversion.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Solicitações que viraram reserva</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Perfil */}
          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do perfil</CardTitle>
                <CardDescription>Seus dados públicos como locador</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <Avatar className="w-20 h-20 border-2 border-border">
                      <AvatarImage src={user?.avatar} className="object-cover" />
                      <AvatarFallback className="text-lg bg-muted">
                        {user?.name?.substring(0, 2).toUpperCase() || "LO"}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      {uploadingAvatar ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                      ) : (
                        <Camera className="text-white h-6 w-6" />
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{user?.name}</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Seus números</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Anúncios publicados</span>
                        <span className="font-medium">{listings.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total de reservas</span>
                        <span className="font-medium">{bookings.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avaliação média</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {listings.length
                              ? (
                                  listings.reduce((sum, l) => sum + l.rating_avg, 0) / listings.length
                                ).toFixed(1)
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Configurações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" disabled>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Dados bancários (em breve)
                      </Button>
                      <Button variant="outline" className="w-full justify-start" disabled>
                        <User className="h-4 w-4 mr-2" />
                        Verificação de identidade (em breve)
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default PainelLocador;
