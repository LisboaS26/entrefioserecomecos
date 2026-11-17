import acessorios from "@/assets/acessorios.jpg.asset.json";
import bolsaRedonda from "@/assets/bolsa-redonda.jpg.asset.json";
import bolsaVerde from "@/assets/bolsa-verde.jpg.asset.json";
import heroBolsa from "@/assets/hero-bolsa.jpg.asset.json";

export const imagemHero = heroBolsa.url;

export const fotosProntas = [
  { url: heroBolsa.url, rotulo: "Bolsa terracota" },
  { url: bolsaVerde.url, rotulo: "Bolsa verde" },
  { url: bolsaRedonda.url, rotulo: "Bolsa redonda" },
  { url: acessorios.url, rotulo: "Acessórios" },
] as const;
