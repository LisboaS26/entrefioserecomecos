import { Link } from "@tanstack/react-router";

import { logoUrl } from "@/lib/logo";
import { useProdutos } from "@/lib/produtos-store";

export function SiteHeader() {
  const produtos = useProdutos();
  return (
    <header className="sticky top-0 z-20 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
        <Link to="/" className="flex items-center gap-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo Entre Fios e Recomeços"
              className="size-14 rounded-full object-contain shadow-soft sm:size-16"
            />
          ) : null}
          <span className="flex flex-col leading-tight">
            <span className="font-display text-xl text-foreground sm:text-2xl">
              Entre Fios <span className="font-script text-primary">e Recomeços</span>
            </span>
            <span className="hidden text-xs font-semibold tracking-wide text-muted-foreground sm:block">
              artesanato feito à mão
            </span>
          </span>
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
          <span className="ml-1 rounded-full border border-dashed border-primary/50 px-3 py-1.5 text-xs text-primary">
            {produtos.length}<span className="hidden sm:inline"> produtos cadastrados</span>
          </span>
        </nav>
      </div>
      <div className="fio-arco-iris h-1" aria-hidden="true" />
    </header>
  );
}
