import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MessageCircle, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import { ProdutoCard } from "@/components/loja/ProdutoCard";
import { HeroCarrossel } from "@/components/loja/HeroCarrossel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LINK_INSTAGRAM, linkWhatsApp } from "@/lib/contato";
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
            <HeroCarrossel produtos={produtos} />
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
      <section id="encomendas" className="mt-16 bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="font-script text-2xl text-primary">Do seu jeitinho</p>
            <h2 className="mt-2 font-display text-3xl text-secondary-foreground sm:text-4xl">Peças sob encomenda</h2>
            <p className="mt-4 max-w-xl text-secondary-foreground/80">Tem uma bolsa ou acessório em mente? Conte suas ideias e as cores que você quer. Combinamos o modelo, as cores, o valor e o prazo pelo WhatsApp ou Instagram.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="whatsapp" size="lg" className="px-5">
              <a href={linkWhatsApp("Olá! Gostaria de fazer um pedido sob encomenda na Entre Fios e Recomeços. Podemos conversar sobre o modelo, as cores, o valor e o prazo?")} target="_blank" rel="noreferrer"><MessageCircle /> Encomendar pelo WhatsApp</a>
            </Button>
            <Button asChild variant="instagram" size="lg" className="px-5">
              <a href={LINK_INSTAGRAM} target="_blank" rel="noreferrer"><Instagram /> Encomendar pelo Instagram</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
