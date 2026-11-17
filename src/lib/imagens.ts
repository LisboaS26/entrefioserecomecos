import elegancia from "@/assets/bolsa-elegancia.jpg.asset.json";
import esmeraldaDourada from "@/assets/bolsa-esmeralda-dourada.jpg.asset.json";
import florDeLotus from "@/assets/bolsa-flor-de-lotus.jpg.asset.json";
import galaDourada from "@/assets/bolsa-gala-dourada.jpg.asset.json";
import girassol from "@/assets/bolsa-girassol.jpg.asset.json";
import noiteNaMata from "@/assets/bolsa-noite-na-mata.jpg.asset.json";
import perola from "@/assets/bolsa-perola.jpg.asset.json";
import rosaDoce from "@/assets/bolsa-rosa-doce.jpg.asset.json";
import sacoOliva from "@/assets/bolsa-saco-oliva.jpg.asset.json";
import salvia from "@/assets/bolsa-salvia.jpg.asset.json";

// Fotos reais das bolsas da loja.
export const fotos = {
  sacoOliva: sacoOliva.url,
  noiteNaMata: noiteNaMata.url,
  rosaDoce: rosaDoce.url,
  salvia: salvia.url,
  esmeraldaDourada: esmeraldaDourada.url,
  elegancia: elegancia.url,
  galaDourada: galaDourada.url,
  girassol: girassol.url,
  florDeLotus: florDeLotus.url,
  perola: perola.url,
} as const;

export const imagemHero = fotos.florDeLotus;

/** Fotos que dá para escolher na hora de cadastrar uma peça. */
export const fotosProntas = [
  { url: fotos.sacoOliva, rotulo: "Bolsa verde saco" },
  { url: fotos.noiteNaMata, rotulo: "Bolsa preta com verde" },
  { url: fotos.rosaDoce, rotulo: "Bolsa rosa" },
  { url: fotos.salvia, rotulo: "Bolsa verde" },
  { url: fotos.esmeraldaDourada, rotulo: "Bolsa verde com dourado" },
  { url: fotos.elegancia, rotulo: "Bolsa preta com duas alças" },
  { url: fotos.galaDourada, rotulo: "Bolsa preta com dourado" },
  { url: fotos.girassol, rotulo: "Bolsa marrom com girassol" },
  { url: fotos.florDeLotus, rotulo: "Bolsa hexagonal" },
  { url: fotos.perola, rotulo: "Bolsa branca" },
] as const;
