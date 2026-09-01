import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Map as MapIcon,
  List,
  Search,
  SlidersHorizontal,
  ChevronDown,
  MapPin,
  PackageOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories, useListings } from "@/hooks/useListings";

const MAX_PRICE = 1000;

const Buscar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMap, setShowMap] = useState(false);

  // A busca e a categoria vivem na URL: o resultado fica compartilhável.
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("categoria") ?? "all";
  const [term, setTerm] = useState(q);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [appliedPrice, setAppliedPrice] = useState<[number, number]>([0, MAX_PRICE]);

  const { data: categories = [] } = useCategories();
  const filters = useMemo(
    () => ({
      q: q || undefined,
      category,
      minPrice: appliedPrice[0] > 0 ? appliedPrice[0] : undefined,
      maxPrice: appliedPrice[1] < MAX_PRICE ? appliedPrice[1] : undefined,
    }),
    [q, category, appliedPrice],
  );

  const { data: listings = [], isLoading, isError } = useListings(filters);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Barra de filtros */}
      <div className="sticky top-[72px] z-30 bg-background border-b px-4 py-3">
        <div className="container mx-auto flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <form
            className="relative w-full lg:max-w-sm"
            onSubmit={(event) => {
              event.preventDefault();
              updateParam("q", term.trim());
            }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="O que você precisa alugar?"
              className="pl-9 rounded-full"
              aria-label="Buscar itens"
            />
          </form>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Button
              variant={category === "all" ? "default" : "outline"}
              className="rounded-full shrink-0"
              onClick={() => updateParam("categoria", "all")}
            >
              Todos
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.slug}
                variant={category === cat.slug ? "default" : "outline"}
                className="rounded-full shrink-0"
                onClick={() => updateParam("categoria", cat.slug)}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
              </Button>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full shrink-0">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Preço <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4" align="end">
                <DropdownMenuLabel>Faixa de preço por dia</DropdownMenuLabel>
                <div className="py-4">
                  <Slider
                    max={MAX_PRICE}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                  />
                  <div className="flex justify-between mt-4 text-sm">
                    <div className="border rounded-md px-3 py-1">
                      <span className="text-muted-foreground text-xs block">Mínimo</span>
                      <span>R$ {priceRange[0]}</span>
                    </div>
                    <div className="border rounded-md px-3 py-1">
                      <span className="text-muted-foreground text-xs block">Máximo</span>
                      <span>R$ {priceRange[1]}{priceRange[1] === MAX_PRICE ? "+" : ""}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="flex justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPriceRange([0, MAX_PRICE]);
                      setAppliedPrice([0, MAX_PRICE]);
                    }}
                  >
                    Limpar
                  </Button>
                  <Button size="sm" onClick={() => setAppliedPrice(priceRange)}>
                    Aplicar
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden lg:flex items-center space-x-2 border-l pl-4 ml-2 shrink-0">
              <Switch id="map-mode" checked={showMap} onCheckedChange={setShowMap} />
              <Label htmlFor="map-mode" className="cursor-pointer flex items-center gap-2">
                Mapa <MapIcon className="h-4 w-4" />
              </Label>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 flex">
        <div className={`flex-1 p-6 ${showMap ? "lg:w-3/5" : "container mx-auto"}`}>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              {isLoading
                ? "Buscando itens..."
                : `${listings.length} ${listings.length === 1 ? "resultado" : "resultados"}`}
              {q && <span className="text-muted-foreground font-normal"> para “{q}”</span>}
            </h1>

            <Button
              className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-full shadow-lg px-6"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? (
                <>Lista <List className="ml-2 h-4 w-4" /></>
              ) : (
                <>Mapa <MapIcon className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>

          <div
            className={`grid gap-6 ${
              showMap
                ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            }`}
          >
            {isLoading &&
              Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}

            {!isLoading &&
              listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
          </div>

          {isError && (
            <p className="text-center text-muted-foreground py-16">
              Não foi possível carregar os itens. Tente novamente.
            </p>
          )}

          {!isLoading && !isError && listings.length === 0 && (
            <div className="text-center py-24 text-muted-foreground">
              <PackageOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium text-foreground">Nenhum item encontrado</p>
              <p className="text-sm">Tente outra busca ou amplie a faixa de preço.</p>
            </div>
          )}
        </div>

        {showMap && (
          <div className="hidden lg:block w-2/5 sticky top-[137px] h-[calc(100vh-137px)] bg-muted border-l">
            <div className="h-full w-full flex items-center justify-center bg-slate-100 text-muted-foreground">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Mapa interativo</p>
                <p className="text-sm">(Em desenvolvimento)</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {!showMap && <Footer />}
    </div>
  );
};

export default Buscar;
