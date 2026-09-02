import { Link } from "react-router-dom";
import { Heart, Star, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useFavoriteIds, useToggleFavorite } from "@/hooks/useFavorites";
import { formatBRL } from "@/lib/pricing";
import type { ListingWithOwner } from "@/types/database";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3C/svg%3E";

/** Card de anúncio usado na home, na busca e nos favoritos. */
export default function ListingCard({ listing }: { listing: ListingWithOwner }) {
  const { user } = useAuth();
  const { data: favoriteIds = [] } = useFavoriteIds(user?.id);
  const toggleFavorite = useToggleFavorite(user?.id);

  const favorited = favoriteIds.includes(listing.id);
  // O selo some sozinho quando a data passa, mesmo antes de a rotina de
  // expiracao rodar no banco.
  const emDestaque =
    Boolean(listing.featured_until) && new Date(listing.featured_until!) > new Date();

  const handleFavorite = (event: React.MouseEvent) => {
    event.preventDefault(); // o card inteiro é um link
    toggleFavorite.mutate(
      { listingId: listing.id, favorited },
      { onError: (error) => toast.error(error instanceof Error ? error.message : "Erro ao salvar") },
    );
  };

  return (
    <Link to={`/produto/${listing.id}`} className="group cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted mb-3">
        <img
          src={listing.images[0] ?? PLACEHOLDER}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
        />
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={favorited ? "Remover dos favoritos" : "Salvar nos favoritos"}
          aria-pressed={favorited}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-black/10 transition-colors"
        >
          <Heart
            className={`h-6 w-6 drop-shadow-md stroke-[2px] ${
              favorited ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>
        {emDestaque ? (
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
            <Sparkles className="h-3 w-3" />
            Destaque
          </div>
        ) : (
          listing.rating_count >= 10 && listing.rating_avg >= 4.8 && (
            <div className="absolute left-3 top-3 rounded bg-white/95 px-2 py-1 text-xs font-semibold shadow-sm backdrop-blur">
              Bem avaliado
            </div>
          )
        )}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-base truncate">{listing.location}</h3>
          {listing.rating_count > 0 && (
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="h-3 w-3 fill-foreground" />
              <span>{listing.rating_avg}</span>
            </div>
          )}
        </div>
        <p className="text-muted-foreground text-sm truncate">{listing.title}</p>
        <p className="text-muted-foreground text-sm">
          <span className="font-semibold text-foreground">{formatBRL(listing.price_per_day)}</span> / dia
        </p>
      </div>
    </Link>
  );
}
