import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { formatarPreco, type Produto } from "@/lib/produtos";

const INTERVALO_MS = 4500;
const TEMPO_ESMAECER = 450;

type Foto = { url: string; nome: string; preco: number };

function querPoucoMovimento() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Imagem do topo: troca sozinha entre as bolsas da loja. A foto atual esmaece
 * primeiro e só depois a próxima aparece, assim as duas nunca ficam uma por
 * cima da outra. Para ao passar o mouse ou ao focar, e tem botão de pausar.
 */
export function HeroCarrossel({ produtos }: { produtos: Produto[] }) {
  const fotos: Foto[] = produtos
    .filter((produto) => Boolean(produto.imagem))
    .map((produto) => ({
      url: produto.imagem as string,
      nome: produto.nome,
      preco: produto.preco,
    }));
  const total = fotos.length;
  const [indice, setIndice] = useState(0);
  const [mostrando, setMostrando] = useState(true);
  const [pausado, setPausado] = useState(false);
  const tempoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function trocar(proximo: number) {
    if (total === 0) return;
    const alvo = ((proximo % total) + total) % total;
    const espera = querPoucoMovimento() ? 0 : TEMPO_ESMAECER;
    if (tempoRef.current) clearTimeout(tempoRef.current);
    if (espera === 0) {
      setIndice(alvo);
      setMostrando(true);
      return;
    }
    setMostrando(false);
    tempoRef.current = setTimeout(() => {
      setIndice(alvo);
      setMostrando(true);
    }, espera);
  }

  useEffect(() => {
    if (total <= 1 || pausado) return;
    if (querPoucoMovimento()) return;
    const tempo = setInterval(() => trocar(indice + 1), INTERVALO_MS);
    return () => {
      clearInterval(tempo);
      if (tempoRef.current) clearTimeout(tempoRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, pausado, indice]);

  if (total === 0) return null;

  const atual = fotos[Math.min(indice, total - 1)] ?? fotos[0];
  if (!atual) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <div className="moldura-fio relative rotate-1 rounded-[2.4rem] p-2 shadow-soft">
        <div className="relative aspect-[4/5] w-full -rotate-1 overflow-hidden rounded-[2rem] bg-muted">
          {fotos.map((foto, i) => (
            <img
              key={`${foto.url}-${i}`}
              src={foto.url}
              alt={i === indice ? `${atual.nome}: ${formatarPreco(atual.preco)}` : ""}
              aria-hidden={i === indice ? undefined : true}
              loading={i === 0 ? "eager" : "lazy"}
              className={
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-[450ms] ease-out " +
                (i === indice && mostrando ? "opacity-100" : "opacity-0")
              }
            />
          ))}
          <div className="pointer-events-none absolute inset-x-3 bottom-3">
            <span className="inline-block rounded-full bg-background/90 px-4 py-2 font-display text-sm text-foreground shadow-soft">
              {atual.nome} · {formatarPreco(atual.preco)}
            </span>
          </div>
        </div>
      </div>

      {total > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPausado((v) => !v)}
            aria-label={pausado ? "Continuar a troca automática das fotos" : "Pausar a troca automática das fotos"}
            className="mr-1 inline-flex size-8 items-center justify-center rounded-full border border-dashed border-primary/50 text-primary transition-colors hover:bg-secondary"
          >
            {pausado ? <Play className="size-4" /> : <Pause className="size-4" />}
          </button>
          {fotos.map((foto, i) => (
            <button
              key={`ponto-${foto.url}-${i}`}
              type="button"
              onClick={() => trocar(i)}
              aria-label={`Mostrar ${foto.nome}`}
              aria-current={i === indice}
              className={
                "h-2.5 rounded-full transition-all duration-300 " +
                (i === indice ? "w-7 bg-primary" : "w-2.5 bg-border hover:bg-primary/50")
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
