import { useCallback, useEffect, useRef, useState } from "react";

export interface Banner {
  image: string;
  /** Texto alternativo — descreve a cena, não o produto. */
  alt: string;
  /** Destino ao clicar, quando o banner é patrocinado ou aponta para uma busca. */
  link?: string;
}

const INTERVALO = 6000;

/**
 * Fundo do hero: cinco banners em rotação, com crossfade e zoom lento.
 *
 * A imagem ativa fica com `opacity-100` e as outras com `opacity-0`, todas
 * empilhadas — assim nenhuma some do DOM e a troca não pisca. Quem tem
 * "reduzir movimento" ligado no sistema recebe as imagens paradas.
 */
export default function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [semMovimento, setSemMovimento] = useState(false);
  const timer = useRef<number>();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => setSemMovimento(mq.matches);
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, []);

  const avancar = useCallback(
    (indice?: number) =>
      setAtual((anterior) => indice ?? (anterior + 1) % banners.length),
    [banners.length],
  );

  useEffect(() => {
    if (pausado || semMovimento || banners.length < 2) return;
    timer.current = window.setTimeout(() => avancar(), INTERVALO);
    return () => window.clearTimeout(timer.current);
  }, [atual, pausado, semMovimento, banners.length, avancar]);

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-neutral-900"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      {banners.map((banner, indice) => (
        <div
          key={banner.image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            indice === atual ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={indice !== atual}
        >
          <img
            src={banner.image}
            alt={indice === atual ? banner.alt : ""}
            // A primeira entra com a página; as demais podem esperar.
            loading={indice === 0 ? "eager" : "lazy"}
            fetchPriority={indice === 0 ? "high" : "low"}
            className={`h-full w-full object-cover ${
              indice === atual && !semMovimento ? "animate-ken-burns" : ""
            }`}
          />
        </div>
      ))}

      {/* Escurece o suficiente para o texto branco passar no contraste. */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Indicadores */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {banners.map((banner, indice) => (
          <button
            key={banner.image}
            type="button"
            onClick={() => avancar(indice)}
            aria-label={`Ver banner ${indice + 1} de ${banners.length}`}
            aria-current={indice === atual}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              indice === atual ? "w-8 bg-white" : "w-4 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
