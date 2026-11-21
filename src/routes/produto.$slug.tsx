import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Instagram, MessageCircle, Package, Ruler } from "lucide-react";

import { BotaoCarrinho } from "@/components/loja/BotaoCarrinho";
import { Button } from "@/components/ui/button";
import { LINK_INSTAGRAM, linkWhatsApp } from "@/lib/contato";
import { buscarProdutoPorSlug, formatarPreco, slugDeProduto, type Produto } from "@/lib/produtos";
import { produtosQuery, useProdutos } from "@/lib/produtos-store";

export const Route = createFileRoute("/produto/$slug")({
  loader: async ({ context, params }): Promise<{ produto: Produto }> => {
    const produtos = await context.queryClient.ensureQueryData(produtosQuery);
    const produto = buscarProdutoPorSlug(produtos, params.slug);
    if (!produto) throw notFound();
    return { produto };
  },
  head: ({ loaderData }) => {
    const produto = loaderData?.produto;
    const resumo = produto?.descricao?.trim() || "Peça de crochê feita à mão pela Entre Fios e Recomeços.";
    const titulo = produto
      ? `${produto.nome} — Entre Fios e Recomeços`
      : "Peça indisponível — Entre Fios e Recomeços";
    return {
      meta: [
        { title: titulo },
        { name: "description", content: resumo },
        { property: "og:title", content: titulo },
        { property: "og:description", content: resumo },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary" },
        ...(produto ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: PaginaProduto,
});

const DETALHES = [
  { chave: "material", rotulo: "Material", icone: Package },
  { chave: "medidas", rotulo: "Medidas", icone: Ruler },
] as const;

function PaginaProduto() {
  const { produto } = Route.useLoaderData();
  const produtos = useProdutos();
  const outras = produtos.filter((p) => p.id !== produto.id).slice(0, 6);
  const preenchidos = DETALHES.filter((d) => (produto[d.chave] ?? "").trim());
  const mensagem = `Olá! Vi a peça "${produto.nome}" (${formatarPreco(produto.preco)}) no site e quero saber mais detalhes.`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full border border-dashed border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Voltar à vitrine
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-start">
        <div className="moldura-fio relative rotate-1 rounded-[2.4rem] p-2 shadow-soft">
          <div className="relative aspect-[4/5] w-full -rotate-1 overflow-hidden rounded-[2rem] bg-secondary">
            <img src={produto.imagem} alt={produto.nome} className="h-full w-full object-contain" />
          </div>
        </div>

        <div className="animate-subir">
          <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            {produto.categoria}
          </span>
          <h1 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            {produto.nome}
          </h1>
          <p className="mt-3 text-3xl font-bold text-primary">{formatarPreco(produto.preco)}</p>

          <p className="mt-6 whitespace-pre-line break-words text-base leading-relaxed text-muted-foreground">
            {produto.descricao?.trim() || "Peça de crochê feita à mão, com carinho em cada ponto."}
          </p>

          {preenchidos.length > 0 && (
            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              {preenchidos.map(({ chave, rotulo, icone: Icone }) => (
                <div key={chave} className="rounded-2xl bg-secondary p-4">
                  <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary">
                    <Icone className="size-4" /> {rotulo}
                  </dt>
                  <dd className="mt-1 text-sm text-secondary-foreground">{(produto[chave] ?? "").trim()}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <BotaoCarrinho id={produto.id} size="lg" />
            <Button asChild variant="whatsapp" size="lg">
              <a href={linkWhatsApp(mensagem)} target="_blank" rel="noreferrer">
                <MessageCircle /> Pedir pelo WhatsApp
              </a>
            </Button>
            <Button asChild variant="instagram" size="lg">
              <a href={LINK_INSTAGRAM} target="_blank" rel="noreferrer">
                <Instagram /> Pedir pelo Instagram
              </a>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Quer outra cor, tamanho ou detalhe? Fale com a gente: fazemos a peça do seu jeitinho.
          </p>
        </div>
      </div>

      {outras.length > 0 && (
        <section className="mt-16 border-t border-dashed border-border pt-10">
          <h2 className="font-display text-2xl text-foreground">
            Outras <span className="font-script text-primary">peças</span>
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outras.map((p) => (
              <li key={p.id}>
                <Link
                  to="/produto/$slug"
                  params={{ slug: slugDeProduto(p.nome) }}
                  className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border transition-colors hover:ring-primary"
                >
                  <img src={p.imagem} alt="" className="size-16 rounded-xl object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-card-foreground">{p.nome}</span>
                    <span className="block text-sm font-bold text-primary">{formatarPreco(p.preco)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
