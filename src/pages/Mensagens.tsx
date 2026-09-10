import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Send, ArrowLeft, Package } from "lucide-react";
import { format, isToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  useConversas,
  useMensagens,
  useEnviarMensagem,
  useMarcarLidas,
  type ConversaComContexto,
} from "@/hooks/useMensagens";

/** Hora para mensagem de hoje; data curta para as mais antigas. */
const quando = (iso: string) => {
  const data = parseISO(iso);
  return isToday(data)
    ? format(data, "HH:mm")
    : format(data, "d 'de' MMM", { locale: ptBR });
};

const Mensagens = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: conversas = [], isLoading } = useConversas(user?.id);

  const conversaAtiva = searchParams.get("conversa");
  const { data: mensagens = [], isLoading: carregandoMensagens } = useMensagens(
    conversaAtiva ?? undefined,
  );
  const enviar = useEnviarMensagem();
  const marcarLidas = useMarcarLidas();

  const [texto, setTexto] = useState("");
  const fimDaLista = useRef<HTMLDivElement>(null);

  const conversa = useMemo(
    () => conversas.find((c) => c.id === conversaAtiva) ?? null,
    [conversas, conversaAtiva],
  );

  /** Quem está do outro lado desta conversa. */
  const outraPessoa = (c: ConversaComContexto) =>
    c.owner_id === user?.id ? c.renter : c.owner;

  useEffect(() => {
    fimDaLista.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens.length]);

  useEffect(() => {
    if (conversaAtiva && user) {
      marcarLidas.mutate({ conversationId: conversaAtiva, userId: user.id });
    }
    // marcarLidas é estável o bastante; incluí-lo relançaria a cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversaAtiva, user?.id, mensagens.length]);

  const submeter = (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!texto.trim() || !conversaAtiva || !user) return;

    const corpo = texto.trim();
    setTexto("");
    enviar.mutate(
      { conversationId: conversaAtiva, senderId: user.id, body: corpo },
      {
        onError: () => {
          toast.error("Não foi possível enviar");
          setTexto(corpo); // devolve o texto para não perder o que foi escrito
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold">Mensagens</h1>

        {isLoading && <Skeleton className="h-96 w-full rounded-xl" />}

        {!isLoading && conversas.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed py-20 text-center">
            <MessageCircle className="mx-auto mb-4 h-12 w-12 text-foreground/40" />
            <h2 className="text-lg font-semibold">Nenhuma conversa ainda</h2>
            <p className="mx-auto mt-2 max-w-md text-foreground/70">
              As conversas aparecem aqui quando você solicita uma locação ou
              recebe uma solicitação. É por aqui que vocês combinam retirada e
              devolução.
            </p>
            <Button asChild className="mt-6">
              <Link to="/buscar">Encontrar um item</Link>
            </Button>
          </div>
        )}

        {conversas.length > 0 && (
          <div className="grid gap-4 overflow-hidden rounded-xl border md:grid-cols-[20rem_1fr] md:h-[32rem]">
            {/* Lista de conversas — no celular some quando uma está aberta */}
            <aside
              className={`border-r bg-muted/20 md:overflow-y-auto ${
                conversaAtiva ? "hidden md:block" : "block"
              }`}
            >
              {conversas.map((c) => {
                const pessoa = outraPessoa(c);
                const ativa = c.id === conversaAtiva;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSearchParams({ conversa: c.id })}
                    className={`flex w-full items-center gap-3 border-b p-4 text-left transition-colors hover:bg-muted/50 ${
                      ativa ? "bg-background" : ""
                    }`}
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={pessoa?.avatar_url ?? undefined} />
                      <AvatarFallback>{pessoa?.name?.[0] ?? "?"}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{pessoa?.name ?? "Usuário"}</p>
                      <p className="truncate text-sm text-foreground/70">
                        {c.listing?.title ?? "Item removido"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </aside>

            {/* Conversa */}
            <section className={`flex flex-col ${conversaAtiva ? "flex" : "hidden md:flex"}`}>
              {!conversa ? (
                <div className="flex flex-1 items-center justify-center p-8 text-center text-foreground/70">
                  Escolha uma conversa para ver as mensagens
                </div>
              ) : (
                <>
                  <header className="flex items-center gap-3 border-b p-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSearchParams({})}
                      aria-label="Voltar para a lista"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={outraPessoa(conversa)?.avatar_url ?? undefined} />
                      <AvatarFallback>{outraPessoa(conversa)?.name?.[0] ?? "?"}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {outraPessoa(conversa)?.name ?? "Usuário"}
                      </p>
                      {conversa.listing && (
                        <Link
                          to={`/produto/${conversa.listing.id}`}
                          className="flex items-center gap-1 truncate text-xs text-foreground/70 hover:underline"
                        >
                          <Package className="h-3 w-3" />
                          {conversa.listing.title}
                        </Link>
                      )}
                    </div>
                  </header>

                  <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    {carregandoMensagens && <Skeleton className="h-16 w-2/3" />}

                    {!carregandoMensagens && mensagens.length === 0 && (
                      <p className="py-8 text-center text-sm text-foreground/70">
                        Nenhuma mensagem ainda. Combine aqui o local e o horário da
                        retirada.
                      </p>
                    )}

                    {mensagens.map((mensagem) => {
                      const minha = mensagem.sender_id === user?.id;
                      return (
                        <div
                          key={mensagem.id}
                          className={`flex ${minha ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                              minha
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{mensagem.body}</p>
                            <p
                              className={`mt-1 text-[10px] ${
                                minha ? "text-primary-foreground/70" : "text-foreground/50"
                              }`}
                            >
                              {quando(mensagem.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={fimDaLista} />
                  </div>

                  <form onSubmit={submeter} className="flex gap-2 border-t p-4">
                    <Input
                      value={texto}
                      onChange={(evento) => setTexto(evento.target.value)}
                      placeholder="Escreva sua mensagem"
                      aria-label="Mensagem"
                      maxLength={2000}
                    />
                    <Button type="submit" disabled={!texto.trim() || enviar.isPending}>
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Enviar</span>
                    </Button>
                  </form>
                </>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Mensagens;
