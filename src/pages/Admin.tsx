import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Users, Package, CalendarDays, DollarSign, ShieldAlert, Search, Send, Trash2, Plus,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  useAdminStats, useAdminUsers, useAdminListings, useAdminBookings,
  useSetListingStatus, useSetBookingStatus, useSetUserBlocked, useSetUserRole,
  useSaveCategory, useDeleteCategory, useSendNotification,
} from "@/hooks/useAdmin";
import { useCategories } from "@/hooks/useListings";
import BannersTab from "@/components/admin/BannersTab";
import MonetizacaoTab from "@/components/admin/MonetizacaoTab";
import { formatBRL } from "@/lib/pricing";
import type { BookingStatus, ListingStatus, Profile } from "@/types/database";

const BOOKING_STATUSES: BookingStatus[] = [
  "pending", "confirmed", "active", "returned", "completed", "cancelled", "rejected",
];

const StatCard = ({ title, value, hint, icon: Icon }: {
  title: string; value: string; hint?: string; icon: typeof Users;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </CardContent>
  </Card>
);

/**
 * Envia uma mensagem da administração para um usuário.
 *
 * Um único diálogo no nível da página, controlado por `target`, em vez de um
 * por linha da tabela: com 200 usuários listados seriam 200 diálogos montados,
 * e a linha (com o diálogo dentro) se recria a cada revalidação da lista.
 */
function MessageDialog({ target, onClose }: { target: Profile | null; onClose: () => void }) {
  const { user } = useAuth();
  const send = useSendNotification();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const submit = () => {
    if (!target) return;
    if (!title.trim() || !body.trim()) {
      toast.error("Preencha assunto e mensagem");
      return;
    }
    send.mutate(
      { userIds: [target.id], title: title.trim(), body: body.trim(), senderId: user!.id },
      {
        onSuccess: () => {
          toast.success(`Mensagem enviada para ${target.name}`);
          setTitle("");
          setBody("");
          onClose();
        },
        onError: () => toast.error("Não foi possível enviar"),
      },
    );
  };

  return (
    <Dialog open={Boolean(target)} onOpenChange={(aberto) => !aberto && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mensagem para {target?.name}</DialogTitle>
          <DialogDescription>
            Chega como notificação dentro da plataforma — não envia email.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assunto">Assunto</Label>
            <Input id="assunto" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem</Label>
            <Textarea id="mensagem" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={send.isPending}>Enviar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const Admin = () => {
  const { data: stats, isLoading: loadingStats } = useAdminStats();
  const [userSearch, setUserSearch] = useState("");
  const [listingSearch, setListingSearch] = useState("");

  const { data: users = [], isLoading: loadingUsers } = useAdminUsers(userSearch);
  const { data: listings = [], isLoading: loadingListings } = useAdminListings(listingSearch);
  const { data: bookings = [], isLoading: loadingBookings } = useAdminBookings();
  const { data: categories = [] } = useCategories();

  const setListingStatus = useSetListingStatus();
  const setBookingStatus = useSetBookingStatus();
  const setBlocked = useSetUserBlocked();
  const setRole = useSetUserRole();
  const saveCategory = useSaveCategory();
  const deleteCategory = useDeleteCategory();

  const [novaCategoria, setNovaCategoria] = useState({ slug: "", name: "", icon: "", sort: "50" });
  const [messageTarget, setMessageTarget] = useState<Profile | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Administração</h1>
          <p className="text-muted-foreground">Visão geral e gestão da plataforma</p>
        </div>

        <Tabs defaultValue="visao" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="visao">Visão geral</TabsTrigger>
            <TabsTrigger value="anuncios">Anúncios</TabsTrigger>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="reservas">Reservas</TabsTrigger>
            <TabsTrigger value="categorias">Categorias</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="monetizacao">Monetização</TabsTrigger>
          </TabsList>

          {/* ---------------------------------------------------- visão geral */}
          <TabsContent value="visao" className="space-y-6">
            {loadingStats && <Skeleton className="h-28 w-full rounded-xl" />}
            {stats && (
              <>
                <div className="grid gap-4 md:grid-cols-4">
                  <StatCard title="Usuários" value={String(stats.users)} icon={Users}
                    hint={`${stats.blocked_users} bloqueados`} />
                  <StatCard title="Anúncios ativos" value={String(stats.listings_active)} icon={Package}
                    hint={`${stats.listings_total} no total`} />
                  <StatCard title="Reservas" value={String(stats.bookings_total)} icon={CalendarDays}
                    hint={`${stats.bookings_pending} aguardando resposta`} />
                  <StatCard title="Receita da Loquei" value={formatBRL(stats.revenue)} icon={DollarSign}
                    hint={`GMV de ${formatBRL(stats.gmv)}`} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Receita = taxa de serviço + proteção das reservas aceitas. GMV é o valor total
                  transacionado.
                </p>
              </>
            )}
            {!loadingStats && !stats && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <ShieldAlert className="h-10 w-10 mx-auto mb-4 opacity-50" />
                  Não foi possível carregar as métricas.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ------------------------------------------------------- anúncios */}
          <TabsContent value="anuncios" className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar por título"
                value={listingSearch} onChange={(e) => setListingSearch(e.target.value)} />
            </div>

            {loadingListings ? <Skeleton className="h-64 w-full" /> : (
              <div className="border rounded-xl overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Anúncio</TableHead>
                      <TableHead>Dono</TableHead>
                      <TableHead>Diária</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium max-w-xs truncate">
                          <Link to={`/produto/${item.id}`} className="hover:underline">{item.title}</Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.owner?.name}</TableCell>
                        <TableCell>{formatBRL(item.price_per_day)}</TableCell>
                        <TableCell>
                          <Badge variant={item.status === "active" ? "default" : "secondary"}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={item.status}
                            onValueChange={(status) =>
                              setListingStatus.mutate({ id: item.id, status: status as ListingStatus })
                            }
                          >
                            <SelectTrigger className="w-32 ml-auto"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {(["active", "paused", "removed"] as ListingStatus[]).map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* ------------------------------------------------------- usuários */}
          <TabsContent value="usuarios" className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar por nome ou email"
                value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
            </div>

            {loadingUsers ? <Skeleton className="h-64 w-full" /> : (
              <div className="border rounded-xl overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Situação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                        <TableCell>
                          {u.profile}
                          {u.role === "admin" && <Badge className="ml-2">admin</Badge>}
                        </TableCell>
                        <TableCell>
                          {u.blocked_at
                            ? <Badge variant="destructive">bloqueado</Badge>
                            : <span className="text-muted-foreground text-sm">ativo</span>}
                        </TableCell>
                        <TableCell className="text-right space-x-2 whitespace-nowrap">
                          <Button variant="outline" size="sm" onClick={() => setMessageTarget(u)}
                            aria-label={`Enviar mensagem para ${u.name}`}>
                            <Send className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="outline" size="sm"
                            onClick={() => setBlocked.mutate({ id: u.id, blocked: !u.blocked_at })}>
                            {u.blocked_at ? "Desbloquear" : "Bloquear"}
                          </Button>
                          <Button variant="outline" size="sm"
                            onClick={() => setRole.mutate({
                              id: u.id, role: u.role === "admin" ? "user" : "admin",
                            })}>
                            {u.role === "admin" ? "Remover admin" : "Tornar admin"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* ------------------------------------------------------- reservas */}
          <TabsContent value="reservas" className="space-y-4">
            {loadingBookings ? <Skeleton className="h-64 w-full" /> : (
              <div className="border rounded-xl overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Locatário</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium max-w-xs truncate">{b.listing?.title}</TableCell>
                        <TableCell className="text-muted-foreground">{b.renter?.name}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {format(parseISO(b.start_date), "dd/MM", { locale: ptBR })} —{" "}
                          {format(parseISO(b.end_date), "dd/MM/yy", { locale: ptBR })}
                        </TableCell>
                        <TableCell>{formatBRL(b.total)}</TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={b.status}
                            onValueChange={(status) =>
                              setBookingStatus.mutate({ id: b.id, status: status as BookingStatus })
                            }
                          >
                            <SelectTrigger className="w-36 ml-auto"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {BOOKING_STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* ----------------------------------------------------- categorias */}
          <TabsContent value="categorias" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Nova categoria</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-5 items-end">
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={novaCategoria.slug} placeholder="jardinagem"
                    onChange={(e) => setNovaCategoria({ ...novaCategoria, slug: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={novaCategoria.name} placeholder="Jardinagem"
                    onChange={(e) => setNovaCategoria({ ...novaCategoria, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Ícone</Label>
                  <Input value={novaCategoria.icon} placeholder="🌱"
                    onChange={(e) => setNovaCategoria({ ...novaCategoria, icon: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Ordem</Label>
                  <Input type="number" value={novaCategoria.sort}
                    onChange={(e) => setNovaCategoria({ ...novaCategoria, sort: e.target.value })} />
                </div>
                <Button
                  onClick={() => {
                    const slug = novaCategoria.slug.trim();
                    if (!slug || !novaCategoria.name.trim()) {
                      toast.error("Slug e nome são obrigatórios");
                      return;
                    }
                    saveCategory.mutate(
                      {
                        slug,
                        name: novaCategoria.name.trim(),
                        icon: novaCategoria.icon.trim() || "📦",
                        sort: Number(novaCategoria.sort) || 50,
                      },
                      {
                        onSuccess: () => {
                          toast.success("Categoria salva");
                          setNovaCategoria({ slug: "", name: "", icon: "", sort: "50" });
                        },
                        onError: () => toast.error("Não foi possível salvar"),
                      },
                    );
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </CardContent>
            </Card>

            <div className="border rounded-xl overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ícone</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Ordem</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((c) => (
                    <TableRow key={c.slug}>
                      <TableCell className="text-xl">{c.icon}</TableCell>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                      <TableCell>{c.sort}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline" size="sm"
                          onClick={() =>
                            deleteCategory.mutate(c.slug, {
                              onSuccess: () => toast.success("Categoria removida"),
                              onError: () =>
                                toast.error("Não dá para remover: há anúncios nesta categoria"),
                            })
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          {/* --------------------------------------------------------- banners */}
          <TabsContent value="banners">
            <BannersTab />
          </TabsContent>

          {/* ----------------------------------------------------- monetização */}
          <TabsContent value="monetizacao">
            <MonetizacaoTab />
          </TabsContent>
        </Tabs>
      </main>

      <MessageDialog target={messageTarget} onClose={() => setMessageTarget(null)} />
    </div>
  );
};

export default Admin;
