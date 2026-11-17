import { Instagram, MessageCircle } from "lucide-react";

import { INSTAGRAM_USUARIO, LINK_INSTAGRAM, linkWhatsApp } from "@/lib/contato";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-foreground text-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-3xl">Entre Fios e Recomeços</p>
          <p className="mt-2 max-w-sm text-sm opacity-75">
            Bolsas e acessórios de crochê feitos à mão, ponto por ponto.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a href={linkWhatsApp("Olá! Vim pelo site da Entre Fios e Recomeços.")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:underline">
            <MessageCircle className="size-4" /> WhatsApp
          </a>
          <a href={LINK_INSTAGRAM} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:underline">
            <Instagram className="size-4" /> @{INSTAGRAM_USUARIO}
          </a>
        </div>
      </div>
    </footer>
  );
}
