import { Link, createFileRoute } from "@tanstack/react-router";
import { Banknote, CreditCard, Instagram, MessageCircle, QrCode, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FORMAS_PAGAMENTO, itensDoCarrinho, limparCarrinho, removerDoCarrinho, totalDoCarrinho, useCarrinho } from "@/lib/carrinho";
import { LINK_INSTAGRAM, linkWhatsApp } from "@/lib/contato";
import { formatarPreco, slugDeProduto } from "@/lib/produtos";
import { useProdutos } from "@/lib/produtos-store";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Meu carrinho — Entre Fios e Recomeços" },
      { name: "description", content: "Veja as bolsas de crochê que você salvou, o total e as formas de pagamento." },
      { property: "og:title", content: "Meu carrinho — Entre Fios e Recomeços" },
      { property: "og:description", content: "Bolsas salvas, total e pagamento em cartão, Pix ou dinheiro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Carrinho,
});

const ICONES = [CreditCard, CreditCard, QrCode, Banknote];

function Carrinho() {
  const itens = itensDoCarrinho(useProdutos(), useCarrinho());
  const total = totalDoCarrinho(itens);
  const mensagem = `Olá! Quero fazer um pedido:\n${itens.map((p) => `- ${p.nome} (${formatarPreco(p.preco)})`).join("\n")}\nTotal: ${formatarPreco(total)}\nComo posso pagar (cartão, Pix ou dinheiro)?`;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="font-display text-4xl text-foreground">Meu <span className="font-script text-primary">carrinho</span></h1>
      {itens.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">
          <ShoppingBag className="mx-auto size-10 text-primary" />
          <p className="mt-3">Seu carrinho está vazio.</p>
          <Button asChild variant="hero" className="mt-5"><Link to="/">Ver as peças</Link></Button>
        </div>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-border rounded-3xl bg-card ring-1 ring-border">
            {itens.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-4">
                <img src={p.imagem} alt={p.nome} className="size-16 shrink-0 rounded-2xl object-cover" />
                <Link to="/produto/$slug" params={{ slug: slugDeProduto(p.nome) }} className="flex-1 font-display text-lg text-card-foreground hover:text-primary">{p.nome}</Link>
                <span className="font-bold text-primary">{formatarPreco(p.preco)}</span>
                <button type="button" aria-label={`Tirar ${p.nome}`} onClick={() => removerDoCarrinho(p.id)} className="rounded-full p-2 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between rounded-3xl bg-secondary p-5">
            <button type="button" onClick={limparCarrinho} className="text-sm text-secondary-foreground/80 underline">Esvaziar</button>
            <p className="text-xl font-bold text-secondary-foreground">Total: <span className="text-primary">{formatarPreco(total)}</span></p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button asChild variant="whatsapp" size="lg"><a href={linkWhatsApp(mensagem)} target="_blank" rel="noreferrer"><MessageCircle /> Finalizar pelo WhatsApp</a></Button>
            <Button asChild variant="instagram" size="lg"><a href={LINK_INSTAGRAM} target="_blank" rel="noreferrer"><Instagram /> Falar no Instagram</a></Button>
          </div>
        </>
      )}
      <section className="mt-10 rounded-3xl bg-card p-6 ring-1 ring-border">
        <h2 className="font-display text-2xl text-card-foreground">Formas de pagamento</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FORMAS_PAGAMENTO.map((f, i) => {
            const Icone = ICONES[i] ?? CreditCard;
            return <li key={f} className="flex flex-col items-center gap-2 rounded-2xl bg-secondary p-4 text-center text-sm font-semibold text-secondary-foreground"><Icone className="size-6 text-primary" />{f}</li>;
          })}
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">O pagamento é combinado direto com a gente pelo WhatsApp ou Instagram.</p>
      </section>
    </div>
  );
}
