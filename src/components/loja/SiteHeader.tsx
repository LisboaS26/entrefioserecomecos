import { Link } from "@tanstack/react-router";

import { useProdutos } from "@/lib/produtos-store";

export function SiteHeader() {
  const produtos = useProdutos();
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Link to="/" className="font-display text-xl leading-tight text-foreground sm:text-2xl">
          Entre Fios <span className="italic text-primary">e Recomeços</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold">
          <Link
            to="/"
            className="rounded-full px-4 py-2 text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "bg-secondary text-secondary-foreground" }}
            activeOptions={{ exact: true }}
          >
            Vitrine
          </Link>
          <Link
            to="/cadastrar"
            className="rounded-full px-4 py-2 text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "bg-secondary text-secondary-foreground" }}
          >
            Cadastrar produto
          </Link>
          <span className="ml-2 hidden rounded-full border border-dashed border-primary/50 px-3 py-1.5 text-xs text-primary sm:inline">
            {produtos.length} produtos cadastrados
          </span>
        </nav>
      </div>
    </header>
  );
}
