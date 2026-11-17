import { Instagram, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LINK_INSTAGRAM, linkWhatsApp } from "@/lib/contato";
import { formatarPreco, type Produto } from "@/lib/produtos";

export function ProdutoCard({ produto, numero }: { produto: Produto; numero: number }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={produto.imagem}
          alt={produto.nome}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground">
          {numero}.
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          {produto.categoria}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-border pb-3">
          <h3 className="font-display text-xl text-card-foreground">{produto.nome}</h3>
          <p className="shrink-0 font-bold text-primary">{formatarPreco(produto.preco)}</p>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2">
          <Button asChild variant="whatsapp" size="sm">
            <a
              href={linkWhatsApp(`Olá! Tenho interesse na peça "${produto.nome}" (${formatarPreco(produto.preco)}).`)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle /> WhatsApp
            </a>
          </Button>
          <Button asChild variant="instagram" size="sm">
            <a href={LINK_INSTAGRAM} target="_blank" rel="noreferrer">
              <Instagram /> Instagram
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
