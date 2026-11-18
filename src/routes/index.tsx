import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import { ProdutoCard } from "@/components/loja/ProdutoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LINK_INSTAGRAM } from "@/lib/contato";
import { imagemHero } from "@/lib/imagens";
import { consultarProduto, formatarPreco, type Produto } from "@/lib/produtos";
import { useProdutos } from "@/lib/produtos-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entre Fios e Recomeços — Bolsas de crochê feitas à mão" },
      {
        name: "description",
        content: "Vitrine de bolsas de crochê feitas à mão, de R$ 130 a R$ 300. Encomende pelo WhatsApp ou Instagram.",
      },
      { property: "og:title", content: "Entre Fios e Recomeços — Vitrine" },
      { property: "og:description", content: "Bolsas de crochê feitas à mão. Tecendo novos caminhos, ponto a ponto." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Vitrine,
});

type Resultado = { tipo: "encontrado"; produto: Produto } | { tipo: "nao-encontrado" } | null;

function Vitrine() {
  const produtos = useProdutos();
  const [busca, setBusca] = useState("");
  const [resultado, setResultado] = useState<Resultado>(null);

  function consultar(e: FormEvent) {
    e.preventDefault();
    const produto = consultarProduto(produtos, busca);
    setResultado(produto ? { tipo: "encontrado", produto } : { tipo: "nao-encontrado" });
  }

  return (
    <>
      <section className="bg-trama">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div className="animate-subir">
            <p className="font-script text-2xl text-primary">Feita à mão, com muito carinho</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-foreground sm:text-6xl">
              Cada ponto, <span className="font-script text-primary">um recomeço.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Bolsas de crochê criadas uma a uma, tecendo novos caminhos, ponto a ponto. Escolha a sua
              e fale com a gente pelo WhatsApp ou Instagram.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <a href="#pecas">Ver as peças</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <a href={LINK_INSTAGRAM} target="_blank" rel="noreferrer">
                  <Instagram /> Seguir no Instagram
                </a>
              </Button>
            </div>
          </div>
          <div className="relative animate-subir [animation-delay:150ms]">
            <div className="moldura-fio relative rotate-1 rounded-[2.4rem] p-2 shadow-soft">
              <img
                src={imagemHero}
                alt="Bolsa de crochê hexagonal rosé com flores, a Bolsa Flor de Lótus"
                className="aspect-[4/5] w-full -rotate-1 rounded-[2rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-16">
        <div className="rounded-3xl bg-secondary p-6 sm:p-8">
          <h2 className="font-display text-2xl text-secondary-foreground">Consultar produto</h2>
          <p className="mt-1 text-sm text-secondary-foreground/80">Digite o nome da peça para ver o preço.</p>
          <form onSubmit={consultar} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Ex.: Bolsa Girassol"
              aria-label="Nome do produto"
              className="h-11 rounded-full bg-card px-5"
            />
            <Button type="submit" variant="hero" className="h-11 px-6">
              <Search /> Consultar
            </Button>
          </form>
          {resultado && (
            <p
              role="status"
              className={
                resultado.tipo === "encontrado"
                  ? "mt-4 font-semibold text-secondary-foreground"
                  : "mt-4 font-semibold text-destructive"
              }
            >
              {resultado.tipo === "encontrado"
                ? `Produto encontrado: ${resultado.produto.nome} - ${formatarPreco(resultado.produto.preco)}`
                : "Produto não encontrado."}
            </p>
          )}
        </div>
      </section>

      <section id="pecas" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl text-foreground">Nossas <span className="font-script text-primary">peças</span></h2>
          <p className="text-sm text-muted-foreground">{produtos.length} produtos cadastrados</p>
        </div>
        {produtos.length === 0 ? (
          <p className="mt-8 rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Nenhum produto cadastrado ainda.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((produto, i) => (
              <ProdutoCard key={produto.id} produto={produto} numero={i + 1} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
