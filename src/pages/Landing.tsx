import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import HeroCarousel, { type Banner } from "@/components/landing/HeroCarousel";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, ShieldCheck, Wallet, Clock, ArrowRight, MapPin, TrendingUp,
} from "lucide-react";
import { useCategories, useListings } from "@/hooks/useListings";
import { useBanners } from "@/hooks/useBanners";
import { formatBRL, OWNER_COMMISSION_RATE } from "@/lib/pricing";

const foto = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=80`;

/** Usados só enquanto o admin não cadastrar nenhum banner. */
const BANNERS_PADRAO: Banner[] = [
  { image: foto("photo-1426927308491-6380b6a9936f"), alt: "Bancada de oficina com ferramentas organizadas" },
  { image: foto("photo-1526170375885-4d8ecf77b99f"), alt: "Lentes e equipamento fotográfico sobre a mesa" },
  { image: foto("photo-1530103862676-de8c9debad1d"), alt: "Balões coloridos preparados para uma festa" },
  { image: foto("photo-1523987355523-c7b5b0dd90a7"), alt: "Barraca montada em area de camping" },
  { image: foto("photo-1485965120184-e220f721d03e"), alt: "Bicicleta encostada em um muro na cidade" },
];

const VANTAGENS = [
  {
    icon: Wallet,
    titulo: "Pague só pelos dias que usar",
    texto:
      "Uma furadeira custa R$ 400 e fica parada o ano inteiro. Alugar sai por R$ 25 no dia em que você precisa dela.",
  },
  {
    icon: ShieldCheck,
    titulo: "Proteção em toda locação",
    texto:
      "Cada aluguel inclui cobertura para dano e roubo, e a caução fica bloqueada — não cobrada — até o item voltar.",
  },
  {
    icon: Clock,
    titulo: "Perto de você, hoje",
    texto:
      "Você combina retirada e devolução direto com o dono. Sem frete, sem espera, sem burocracia.",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const [termo, setTermo] = useState("");
  const [categoria, setCategoria] = useState("all");

  const { data: categories = [] } = useCategories();
  const { data: destaques = [], isLoading } = useListings({});
  const { data: bannersDoBanco = [] } = useBanners();

  // O que o admin cadastrar substitui o padrão; sem nada cadastrado, a home
  // continua com imagem em vez de um vazio.
  const banners = bannersDoBanco.length
    ? bannersDoBanco.map((b) => ({ image: b.image_url, alt: b.alt, link: b.link_url ?? undefined }))
    : BANNERS_PADRAO;

  const buscar = (evento: React.FormEvent) => {
    evento.preventDefault();
    const params = new URLSearchParams();
    if (termo.trim()) params.set("q", termo.trim());
    if (categoria !== "all") params.set("categoria", categoria);
    navigate(`/buscar${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Cabeçalho enxuto, como o da referência */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/46d0dc9e-74fd-49cf-8e73-306a25807b36.png"
              alt="Loquei"
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="text-white hover:bg-white/15 hover:text-white">
              <Link to="/entrar">Entrar</Link>
            </Button>
            <Button asChild className="rounded-full font-semibold">
              <Link to="/anunciar">Anuncie na Loquei</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------ hero */}
      <section className="relative min-h-[38rem] lg:min-h-[44rem]">
        <HeroCarousel banners={banners} />

        <div className="container relative z-10 mx-auto px-4 pt-32 pb-20 lg:pt-40">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
            {/* Chamada + busca */}
            <div className="max-w-2xl animate-fade-up">
              <h1 className="text-4xl font-bold leading-[1.1] text-white drop-shadow-sm md:text-5xl lg:text-6xl">
                Procurando algo para alugar?
              </h1>
              <p className="mt-5 max-w-xl text-lg text-white/85">
                Ferramenta, câmera, som para a festa, barraca de camping. Alugue de
                quem tem por perto e pague só pelos dias que precisar.
              </p>

              <form
                onSubmit={buscar}
                className="mt-8 rounded-3xl bg-background p-4 shadow-2xl sm:p-5"
              >
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_13rem_auto]">
                  <div className="space-y-1.5">
                    <Label htmlFor="busca" className="text-xs font-semibold uppercase text-foreground/70">
                      O que você precisa
                    </Label>
                    <Input
                      id="busca"
                      value={termo}
                      onChange={(evento) => setTermo(evento.target.value)}
                      placeholder="Ex.: furadeira, projetor, caiaque"
                      className="h-12 rounded-xl border-2 text-base"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="categoria" className="text-xs font-semibold uppercase text-foreground/70">
                      Categoria
                    </Label>
                    <Select value={categoria} onValueChange={setCategoria}>
                      <SelectTrigger id="categoria" className="h-12 rounded-xl border-2 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.slug} value={cat.slug}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="h-12 gap-2 self-end rounded-xl px-8 text-base font-semibold"
                  >
                    <Search className="h-5 w-5" />
                    Buscar
                  </Button>
                </div>
              </form>

              <p className="mt-4 text-sm text-white/75">
                {destaques.length > 0
                  ? `${destaques.length}+ itens disponíveis em ${categories.length} categorias`
                  : "Milhares de itens esperando para serem usados"}
              </p>
            </div>

            {/* Chamada para o locador, à direita */}
            <aside className="animate-fade-up rounded-3xl bg-background/95 p-6 shadow-2xl backdrop-blur lg:mt-24">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <TrendingUp className="h-3.5 w-3.5" />
                Para quem tem itens parados
              </div>
              <h2 className="text-xl font-bold leading-snug">
                Sua furadeira pode pagar as contas do mês
              </h2>
              <p className="mt-2 text-sm text-foreground/70">
                Anuncie de graça, defina sua diária e receba{" "}
                <strong className="text-foreground">
                  {Math.round((1 - OWNER_COMMISSION_RATE) * 100)}%
                </strong>{" "}
                de cada locação. Você aprova quem aluga.
              </p>
              <Button asChild className="mt-5 h-12 w-full rounded-xl font-semibold">
                <Link to="/anunciar">
                  Anunciar meu item
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="mt-3 text-center text-xs text-foreground/70">
                Leva menos de 5 minutos
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- vantagens */}
      <section className="container mx-auto px-4 py-16 lg:py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {VANTAGENS.map(({ icon: Icone, titulo, texto }) => (
            <div key={titulo}>
              <Icone className="mb-4 h-8 w-8 text-foreground" strokeWidth={1.5} />
              <h3 className="mb-2 text-xl font-semibold">{titulo}</h3>
              <p className="leading-relaxed text-foreground/70">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- destaques */}
      <section className="container mx-auto px-4 pb-16 lg:pb-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold lg:text-3xl">Em destaque agora</h2>
            <p className="text-foreground/70">Itens recém-anunciados perto de você</p>
          </div>
          <Button variant="outline" asChild className="rounded-full">
            <Link to="/buscar">
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, indice) => (
              <div key={indice} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}

          {!isLoading &&
            destaques.slice(0, 8).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
        </div>
      </section>

      {/* ------------------------------------------------ categorias rápidas */}
      {categories.length > 0 && (
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-2xl font-bold lg:text-3xl">Explore por categoria</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/buscar?categoria=${cat.slug}`}
                  className="group flex items-center gap-2 rounded-full border bg-background px-5 py-3 font-medium transition-colors hover:border-foreground"
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------- chamada final */}
      <section className="border-t py-16 lg:py-24">
        <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold lg:text-4xl">
              Ganhe com o que já está na sua garagem
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground/70">
              Uma serra parada há dois anos, o projetor usado uma vez, a barraca da
              viagem que não se repetiu. Na Loquei esses itens viram renda — e você
              decide o preço, as datas e para quem aluga.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-full px-8 font-semibold">
                <Link to="/anunciar">Começar a anunciar</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-8">
                <Link to="/como-funciona">Como funciona</Link>
              </Button>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-6">
            {[
              { rotulo: "Você recebe", valor: `${Math.round((1 - OWNER_COMMISSION_RATE) * 100)}%`, nota: "de cada locação" },
              { rotulo: "Para anunciar", valor: formatBRL(0), nota: "sem mensalidade" },
              { rotulo: "Categorias", valor: String(categories.length), nota: "de ferramentas a bebê" },
              { rotulo: "Retirada", valor: "Local", nota: "combinada no chat" },
            ].map((item) => (
              <div key={item.rotulo} className="rounded-2xl border bg-muted/30 p-6">
                <dt className="text-sm text-foreground/70">{item.rotulo}</dt>
                <dd className="mt-1 text-3xl font-bold">{item.valor}</dd>
                <dd className="mt-1 flex items-center gap-1 text-sm text-foreground/70">
                  <MapPin className="h-3.5 w-3.5" />
                  {item.nota}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
