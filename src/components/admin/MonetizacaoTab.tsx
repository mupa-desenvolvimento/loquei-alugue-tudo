import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DollarSign, Star, Crown, Clock, RefreshCw, Check, RotateCw, ShieldCheck, ShieldAlert,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  useAdminPromotions, useAdminRevenue, useActivatePromotion, useExpirePromotions,
  usePromotionPlans, useConciliarPagamentos, usePaymentEvents,
} from "@/hooks/usePromotions";
import { formatBRL } from "@/lib/pricing";
import type { PromotionStatus } from "@/types/database";

const STATUS: Record<PromotionStatus, { rotulo: string; variante: "default" | "secondary" | "destructive" }> = {
  pending: { rotulo: "Aguardando pagamento", variante: "secondary" },
  paid: { rotulo: "Pago", variante: "default" },
  active: { rotulo: "Ativo", variante: "default" },
  expired: { rotulo: "Expirado", variante: "secondary" },
  cancelled: { rotulo: "Cancelado", variante: "secondary" },
  refunded: { rotulo: "Estornado", variante: "destructive" },
};

export default function MonetizacaoTab() {
  const { data: receita, isLoading: carregandoReceita } = useAdminRevenue();
  const conciliar = useConciliarPagamentos();
  const { data: eventos = [] } = usePaymentEvents();
  const { data: promocoes = [], isLoading } = useAdminPromotions();
  const { data: planos = [] } = usePromotionPlans();
  const ativar = useActivatePromotion();
  const expirar = useExpirePromotions();

  return (
    <div className="space-y-8">
      {/* Receita */}
      {carregandoReceita ? (
        <Skeleton className="h-28 w-full rounded-xl" />
      ) : receita && (
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { titulo: "Receita de promoções", valor: formatBRL(receita.promotions_revenue), nota: `${receita.promotions_paid} contratações pagas`, icone: DollarSign },
            { titulo: "Receita recorrente", valor: formatBRL(receita.mrr), nota: `${receita.pro_members} locadores no Pro`, icone: Crown },
            { titulo: "Destaques ativos", valor: String(receita.active_featured), nota: "anúncios em evidência agora", icone: Star },
            { titulo: "Aguardando pagamento", valor: String(receita.promotions_pending), nota: "pedidos em aberto", icone: Clock },
          ].map(({ titulo, valor, nota, icone: Icone }) => (
            <Card key={titulo}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{titulo}</CardTitle>
                <Icone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{valor}</div>
                <p className="text-xs text-muted-foreground">{nota}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Planos */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Produtos à venda</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {planos.map((plano) => (
            <Card key={plano.slug}>
              <CardContent className="p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h4 className="font-semibold">{plano.name}</h4>
                  <Badge variant="secondary">{plano.duration_days} dias</Badge>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{plano.description}</p>
                <p className="text-2xl font-bold">{formatBRL(plano.price)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Preços e textos ficam na tabela <code>promotion_plans</code> — dá para
          ajustar sem mexer no código.
        </p>
      </div>

      {/* Contratações */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Contratações</h3>
          <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() =>
              conciliar.mutate(undefined, {
                onSuccess: (resultado) => {
                  const liberadas = resultado.relatorio.filter((r) =>
                    r.resultado === "liberado").length;
                  if (liberadas > 0) {
                    toast.success(
                      `${liberadas} ${liberadas === 1 ? "contratação liberada" : "contratações liberadas"}`,
                    );
                  } else if (resultado.pendentes === 0) {
                    toast.info("Nenhuma contratação pendente");
                  } else {
                    toast.info(
                      `${resultado.pendentes} pendente(s), nenhum pagamento aprovado no provedor`,
                    );
                  }
                },
                onError: (erro) =>
                  toast.error(
                    erro instanceof Error ? erro.message : "Não foi possível conciliar",
                  ),
              })
            }
            disabled={conciliar.isPending}
          >
            <RotateCw className={`mr-2 h-3.5 w-3.5 ${conciliar.isPending ? "animate-spin" : ""}`} />
            Conciliar pagamentos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              expirar.mutate(undefined, {
                onSuccess: (total) =>
                  toast.success(
                    total > 0 ? `${total} promoções encerradas` : "Nada vencido no momento",
                  ),
                onError: () => toast.error("Não foi possível processar"),
              })
            }
            disabled={expirar.isPending}
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${expirar.isPending ? "animate-spin" : ""}`} />
            Encerrar vencidas
          </Button>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-xl" />
        ) : promocoes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhuma contratação ainda.
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promocoes.map((promocao) => (
                  <TableRow key={promocao.id}>
                    <TableCell className="font-medium">{promocao.plan?.name ?? promocao.plan_slug}</TableCell>
                    <TableCell className="max-w-[16rem] truncate text-muted-foreground">
                      {promocao.listing?.title ?? "—"}
                    </TableCell>
                    <TableCell>{formatBRL(promocao.amount)}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {promocao.ends_at
                        ? `até ${format(parseISO(promocao.ends_at), "dd/MM/yy", { locale: ptBR })}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS[promocao.status].variante}>
                        {STATUS[promocao.status].rotulo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {promocao.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={ativar.isPending}
                          onClick={() =>
                            ativar.mutate(promocao.id, {
                              onSuccess: () => toast.success("Promoção liberada"),
                              onError: () => toast.error("Não foi possível liberar"),
                            })
                          }
                        >
                          <Check className="mr-1 h-3.5 w-3.5" />
                          Confirmar pagamento
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <p className="mt-3 text-sm text-muted-foreground">
          O pagamento pelo Mercado Pago libera a promoção sozinho, pelo webhook.
          <strong className="text-foreground"> Conciliar pagamentos</strong> pergunta
          ao provedor o que houve com as pendentes e libera as que já foram pagas —
          use quando uma notificação se perder. Já o botão de confirmar, na linha,
          serve para pagamento fora da plataforma (um Pix direto, por exemplo).
        </p>
      </div>

      {/* Trilha de auditoria */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Notificações do provedor</h3>
        {eventos.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Nenhuma notificação recebida ainda. Se um pagamento foi feito e nada
              aparece aqui, o provedor não chegou a chamar a plataforma.
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quando</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Assinatura</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Detalhe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventos.map((evento) => (
                  <TableRow key={evento.id}>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {format(parseISO(evento.received_at), "dd/MM HH:mm:ss", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-sm">{evento.event_type ?? "—"}</TableCell>
                    <TableCell>
                      {evento.signature_ok === null ? (
                        <span className="text-sm text-muted-foreground">—</span>
                      ) : evento.signature_ok ? (
                        <ShieldCheck className="h-4 w-4 text-emerald-600" aria-label="válida" />
                      ) : (
                        <ShieldAlert className="h-4 w-4 text-destructive" aria-label="inválida" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={evento.outcome === "liberado" ? "default" : "secondary"}>
                        {evento.outcome}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[22rem] truncate text-sm text-muted-foreground">
                      {evento.detail}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <p className="mt-3 text-sm text-muted-foreground">
          Registro de tudo que o Mercado Pago envia, inclusive o que foi recusado.
          O histórico não pode ser apagado pelo painel.
        </p>
      </div>
    </div>
  );
}
