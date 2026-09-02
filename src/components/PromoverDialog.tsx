import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  usePromotionPlans, useCreatePromotion, iniciarPagamento,
} from "@/hooks/usePromotions";
import { formatBRL } from "@/lib/pricing";
import type { ListingWithOwner } from "@/types/database";

/**
 * Contratação de destaque para um anúncio.
 *
 * Cria a promoção como pendente e manda o locador para o checkout do
 * Mercado Pago. Quem libera o benefício é o webhook, depois do pagamento
 * confirmado — não esta tela.
 */
export default function PromoverDialog({
  listing,
  onClose,
}: {
  listing: ListingWithOwner | null;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { data: planos = [] } = usePromotionPlans();
  const criar = useCreatePromotion();
  const [planoSlug, setPlanoSlug] = useState("");
  const [redirecionando, setRedirecionando] = useState(false);

  // Só os planos que se aplicam a um anúncio específico.
  const disponiveis = planos.filter(
    (plano) => plano.kind === "featured" || plano.kind === "category_top",
  );
  const plano = disponiveis.find((p) => p.slug === planoSlug);

  const contratar = async () => {
    if (!user || !listing || !plano) {
      toast.error("Escolha um plano");
      return;
    }

    setRedirecionando(true);
    try {
      const promocao = await criar.mutateAsync({
        plan_slug: plano.slug,
        user_id: user.id,
        listing_id: listing.id,
        amount: plano.price,
      });

      const url = await iniciarPagamento(promocao.id);
      window.location.href = url;
    } catch (erro) {
      console.error(erro);
      toast.error(
        erro instanceof Error && erro.message.includes("endereço de pagamento")
          ? "O pagamento ainda não está configurado. Fale com a Loquei."
          : "Não foi possível iniciar o pagamento",
      );
      setRedirecionando(false);
    }
  };

  return (
    <Dialog open={listing !== null} onOpenChange={(aberto) => !aberto && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Promover anúncio
          </DialogTitle>
          <DialogDescription className="line-clamp-1">{listing?.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Escolha o plano</Label>
            <Select value={planoSlug} onValueChange={setPlanoSlug}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {disponiveis.map((opcao) => (
                  <SelectItem key={opcao.slug} value={opcao.slug}>
                    {opcao.name} — {formatBRL(opcao.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {plano && (
            <div className="rounded-xl border bg-muted/40 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold">{plano.name}</span>
                <Badge variant="secondary">{plano.duration_days} dias</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{plano.description}</p>
              <div className="mt-3 flex items-baseline justify-between border-t pt-3">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-2xl font-bold">{formatBRL(plano.price)}</span>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            O pagamento é processado pelo Mercado Pago. O destaque começa a valer
            assim que o pagamento for aprovado.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={contratar} disabled={!plano || redirecionando}>
            {redirecionando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ir para o pagamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
