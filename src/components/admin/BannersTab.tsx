import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Upload, Loader2, ImageOff, ArrowUp, ArrowDown } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  useAllBanners, useSaveBanner, useDeleteBanner, uploadBannerImage,
} from "@/hooks/useBanners";
import type { Banner, BannerKind } from "@/types/database";

const VAZIO = {
  title: "",
  subtitle: "",
  image_url: "",
  link_url: "",
  alt: "",
  position: 0,
  active: true,
  kind: "editorial" as BannerKind,
  sponsor_name: "",
  starts_at: "",
  ends_at: "",
};

type Formulario = typeof VAZIO & { id?: string };

const paraFormulario = (banner: Banner): Formulario => ({
  id: banner.id,
  title: banner.title ?? "",
  subtitle: banner.subtitle ?? "",
  image_url: banner.image_url,
  link_url: banner.link_url ?? "",
  alt: banner.alt,
  position: banner.position,
  active: banner.active,
  kind: banner.kind,
  sponsor_name: banner.sponsor_name ?? "",
  starts_at: banner.starts_at?.slice(0, 10) ?? "",
  ends_at: banner.ends_at?.slice(0, 10) ?? "",
});

/** Gerencia os banners do carrossel da home. */
export default function BannersTab() {
  const { data: banners = [], isLoading } = useAllBanners();
  const salvar = useSaveBanner();
  const remover = useDeleteBanner();

  const [form, setForm] = useState<Formulario | null>(null);
  const [enviando, setEnviando] = useState(false);

  const enviarImagem = async (evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0];
    if (!arquivo || !form) return;

    setEnviando(true);
    try {
      const url = await uploadBannerImage(arquivo);
      setForm({ ...form, image_url: url });
      toast.success("Imagem enviada");
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Falha ao enviar a imagem");
    } finally {
      setEnviando(false);
      evento.target.value = "";
    }
  };

  const submeter = () => {
    if (!form) return;
    if (!form.image_url) {
      toast.error("O banner precisa de uma imagem");
      return;
    }
    if (!form.alt.trim()) {
      toast.error("Descreva a imagem no campo de acessibilidade");
      return;
    }

    salvar.mutate(
      {
        ...(form.id ? { id: form.id } : {}),
        title: form.title.trim() || null,
        subtitle: form.subtitle.trim() || null,
        image_url: form.image_url,
        link_url: form.link_url.trim() || null,
        alt: form.alt.trim(),
        position: Number(form.position) || 0,
        active: form.active,
        kind: form.kind,
        sponsor_name: form.kind === "sponsored" ? form.sponsor_name.trim() || null : null,
        starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
        ends_at: form.ends_at ? new Date(`${form.ends_at}T23:59:59`).toISOString() : null,
      },
      {
        onSuccess: () => {
          toast.success(form.id ? "Banner atualizado" : "Banner criado");
          setForm(null);
        },
        onError: (erro) =>
          toast.error(erro instanceof Error ? erro.message : "Não foi possível salvar"),
      },
    );
  };

  const mover = (banner: Banner, direcao: -1 | 1) =>
    salvar.mutate({
      id: banner.id,
      image_url: banner.image_url,
      alt: banner.alt,
      position: Math.max(0, banner.position + direcao),
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Os banners aparecem no carrossel da home, em ordem crescente de posição.
          Fora do período agendado, o banner não é exibido.
        </p>
        <Button onClick={() => setForm({ ...VAZIO, position: banners.length })}>
          <Plus className="mr-2 h-4 w-4" />
          Novo banner
        </Button>
      </div>

      {isLoading && <Skeleton className="h-40 w-full rounded-xl" />}

      {!isLoading && banners.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <ImageOff className="mx-auto mb-4 h-10 w-10 opacity-50" />
            <p className="mb-1 font-medium text-foreground">Nenhum banner cadastrado</p>
            <p className="text-sm">Enquanto não houver banner ativo, a home usa as imagens padrão.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {banners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden">
            <div className="relative aspect-[21/9] bg-muted">
              <img src={banner.image_url} alt={banner.alt} className="h-full w-full object-cover" />
              <div className="absolute left-3 top-3 flex gap-2">
                <Badge variant={banner.active ? "default" : "secondary"}>
                  {banner.active ? "Ativo" : "Pausado"}
                </Badge>
                {banner.kind === "sponsored" && (
                  <Badge variant="secondary" className="bg-amber-500/90 text-white">
                    Patrocinado
                  </Badge>
                )}
              </div>
              <Badge variant="secondary" className="absolute right-3 top-3">
                #{banner.position}
              </Badge>
            </div>

            <CardContent className="space-y-3 p-4">
              <div>
                <h3 className="font-semibold">{banner.title || "(sem título)"}</h3>
                {banner.sponsor_name && (
                  <p className="text-sm text-muted-foreground">Anunciante: {banner.sponsor_name}</p>
                )}
                {(banner.starts_at || banner.ends_at) && (
                  <p className="text-xs text-muted-foreground">
                    {banner.starts_at ? format(parseISO(banner.starts_at), "dd/MM/yy", { locale: ptBR }) : "sempre"}
                    {" — "}
                    {banner.ends_at ? format(parseISO(banner.ends_at), "dd/MM/yy", { locale: ptBR }) : "sem fim"}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setForm(paraFormulario(banner))}>
                  Editar
                </Button>
                <Button variant="outline" size="sm" onClick={() => mover(banner, -1)} aria-label="Subir">
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => mover(banner, 1)} aria-label="Descer">
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    salvar.mutate({
                      id: banner.id,
                      image_url: banner.image_url,
                      alt: banner.alt,
                      active: !banner.active,
                    })
                  }
                >
                  {banner.active ? "Pausar" : "Ativar"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!confirm(`Remover o banner "${banner.title || banner.alt}"?`)) return;
                    remover.mutate(banner.id, {
                      onSuccess: () => toast.success("Banner removido"),
                      onError: () => toast.error("Não foi possível remover"),
                    });
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Um único diálogo, controlado por estado */}
      <Dialog open={form !== null} onOpenChange={(aberto) => !aberto && setForm(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{form?.id ? "Editar banner" : "Novo banner"}</DialogTitle>
          </DialogHeader>

          {form && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Imagem</Label>
                {form.image_url ? (
                  <div className="relative overflow-hidden rounded-xl border">
                    <img src={form.image_url} alt="" className="aspect-[21/9] w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex aspect-[21/9] items-center justify-center rounded-xl border-2 border-dashed text-sm text-muted-foreground">
                    Nenhuma imagem
                  </div>
                )}
                <div className="flex gap-2">
                  <label className="flex-1">
                    <Button asChild variant="outline" className="w-full" disabled={enviando}>
                      <span>
                        {enviando ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        Enviar imagem
                      </span>
                    </Button>
                    <input type="file" accept="image/*" className="hidden" onChange={enviarImagem} disabled={enviando} />
                  </label>
                </div>
                <Input
                  placeholder="ou cole o endereço de uma imagem"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alt">Descrição da imagem</Label>
                <Input
                  id="alt"
                  value={form.alt}
                  onChange={(e) => setForm({ ...form, alt: e.target.value })}
                  placeholder="Ex.: bancada de oficina com ferramentas"
                />
                <p className="text-xs text-muted-foreground">
                  Lida por leitores de tela e exibida se a imagem não carregar.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título (opcional)</Label>
                  <Input
                    id="titulo"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posicao">Posição</Label>
                  <Input
                    id="posicao"
                    type="number"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Link ao clicar (opcional)</Label>
                <Input
                  id="link"
                  value={form.link_url}
                  onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                  placeholder="/buscar?categoria=ferramentas"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={form.kind}
                    onValueChange={(valor) => setForm({ ...form, kind: valor as BannerKind })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editorial">Editorial (da Loquei)</SelectItem>
                      <SelectItem value="sponsored">Patrocinado (vendido)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.kind === "sponsored" && (
                  <div className="space-y-2">
                    <Label htmlFor="anunciante">Anunciante</Label>
                    <Input
                      id="anunciante"
                      value={form.sponsor_name}
                      onChange={(e) => setForm({ ...form, sponsor_name: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="inicio">Exibir a partir de</Label>
                  <Input
                    id="inicio"
                    type="date"
                    value={form.starts_at}
                    onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fim">Exibir até</Label>
                  <Input
                    id="fim"
                    type="date"
                    value={form.ends_at}
                    onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="ativo"
                  checked={form.active}
                  onCheckedChange={(valor) => setForm({ ...form, active: valor })}
                />
                <Label htmlFor="ativo">Ativo</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setForm(null)}>Cancelar</Button>
            <Button onClick={submeter} disabled={salvar.isPending || enviando}>
              {salvar.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
