import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavoriteListings } from "@/hooks/useFavorites";

const Favoritos = () => {
  const { user } = useAuth();
  const { data: favorites = [], isLoading } = useFavoriteListings(user?.id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Meus favoritos</h1>
          <p className="text-muted-foreground">
            {isLoading
              ? "Carregando..."
              : `${favorites.length} ${favorites.length === 1 ? "item salvo" : "itens salvos"}`}
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && favorites.length === 0 && (
          <div className="text-center py-24">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-lg font-medium mb-2">Nenhum favorito ainda</h2>
            <p className="text-muted-foreground mb-6">
              Toque no coração dos itens que te interessam para guardá-los aqui.
            </p>
            <Button asChild>
              <Link to="/buscar">Explorar itens</Link>
            </Button>
          </div>
        )}

        {!isLoading && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {favorites.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favoritos;
