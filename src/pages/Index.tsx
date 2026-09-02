import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LayoutGrid, PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories, useListings } from "@/hooks/useListings";
import { useAuth } from "@/contexts/AuthContext";
import Landing from "./Landing";

const Index = () => {
  const { isAuthenticated, isLoading: verificandoSessao } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: categories = [] } = useCategories();
  const { data: listings = [], isLoading } = useListings({ category: selectedCategory });

  // Visitante ve a landing; quem ja tem conta cai direto no catalogo.
  // O retorno vem depois dos hooks acima para nao mudar a ordem entre renders.
  if (!verificandoSessao && !isAuthenticated) return <Landing />;

  const tabs = [{ slug: "all", name: "Todos", icon: null }, ...categories];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Barra de categorias */}
      <div className="sticky top-[72px] z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-4">
            {tabs.map((category) => (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                aria-pressed={selectedCategory === category.slug}
                className={`flex flex-col items-center gap-2 min-w-[64px] transition-all pb-1 ${
                  selectedCategory === category.slug
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted-foreground/30"
                }`}
              >
                {category.icon ? (
                  <span className="text-2xl leading-6">{category.icon}</span>
                ) : (
                  <LayoutGrid className="h-6 w-6" />
                )}
                <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
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

        {!isLoading && listings.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <PackageOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium text-foreground">Nada por aqui ainda</p>
            <p className="text-sm mb-6">Seja o primeiro a anunciar nesta categoria.</p>
            <Button asChild>
              <Link to="/anunciar">Anunciar um item</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
