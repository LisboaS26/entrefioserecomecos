import { Link } from "@tanstack/react-router";
import { Heart, Instagram, Lock, MessageCircle } from "lucide-react";

import { INSTAGRAM_USUARIO, LINK_INSTAGRAM, linkWhatsApp } from "@/lib/contato";
import { logoUrl } from "@/lib/logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-foreground text-background">
      <div className="fio-arco-iris h-1.5" aria-hidden="true" />
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {logoUrl ? <img src={logoUrl} alt="" className="size-20 rounded-full" /> : null}
          <div>
            <p className="font-display text-3xl">Entre Fios e Recomeços</p>
            <p className="mt-1 font-script text-xl opacity-85">tecendo novos caminhos, ponto a ponto.</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a href={linkWhatsApp("Olá! Vim pelo site da Entre Fios e Recomeços.")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:underline">
            <MessageCircle className="size-4" /> WhatsApp
          </a>
          <a href={LINK_INSTAGRAM} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:underline">
            <Instagram className="size-4" /> @{INSTAGRAM_USUARIO}
          </a>
          <p className="mt-2 inline-flex items-center gap-1 text-xs opacity-70">
            Feito à mão com <Heart className="size-3 fill-current" />
          </p>
          <Link to="/cadastrar" className="inline-flex items-center gap-1 text-xs opacity-60 hover:underline hover:opacity-100">
            <Lock className="size-3" /> Área da loja
          </Link>
        </div>
      </div>
    </footer>
  );
}
