import { useSyncExternalStore } from "react";

import { fotos } from "./imagens";
import type { Produto } from "./produtos";

// v2: troca as peças de exemplo pelas bolsas reais (quem já abriu o site antes vê as novas).
const CHAVE = "entre-fios-produtos-v2";

export const produtosIniciais: Produto[] = [
  { id: "1", nome: "Bolsa Saco Oliva", preco: 165, categoria: "Bolsa", imagem: fotos.sacoOliva },
  { id: "2", nome: "Bolsa Noite na Mata", preco: 165, categoria: "Bolsa", imagem: fotos.noiteNaMata },
  { id: "3", nome: "Bolsa Rosa Doce", preco: 150, categoria: "Bolsa", imagem: fotos.rosaDoce },
  { id: "4", nome: "Bolsa Sálvia", preco: 165, categoria: "Bolsa", imagem: fotos.salvia },
  { id: "5", nome: "Bolsa Esmeralda Dourada", preco: 150, categoria: "Bolsa", imagem: fotos.esmeraldaDourada },
  { id: "6", nome: "Bolsa Elegância", preco: 170, categoria: "Bolsa", imagem: fotos.elegancia },
  { id: "7", nome: "Bolsa Gala Dourada", preco: 300, categoria: "Bolsa", imagem: fotos.galaDourada },
  { id: "8", nome: "Bolsa Girassol", preco: 165, categoria: "Bolsa", imagem: fotos.girassol },
  { id: "9", nome: "Bolsa Flor de Lótus", preco: 180, categoria: "Bolsa", imagem: fotos.florDeLotus },
  { id: "10", nome: "Bolsa Pérola", preco: 130, categoria: "Bolsa", imagem: fotos.perola },
];

let produtos: Produto[] = produtosIniciais;
let carregado = false;
const ouvintes = new Set<() => void>();

function carregar() {
  if (carregado || typeof window === "undefined") return;
  carregado = true;
  try {
    const salvo = window.localStorage.getItem(CHAVE);
    if (salvo) produtos = JSON.parse(salvo) as Produto[];
  } catch {
    produtos = produtosIniciais;
  }
}

function salvar(novos: Produto[]) {
  produtos = novos;
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(novos));
  } catch {
    // armazenamento cheio: mantém só na memória
  }
  ouvintes.forEach((o) => o());
}

function inscrever(ouvinte: () => void) {
  carregar();
  ouvintes.add(ouvinte);
  ouvinte();
  return () => ouvintes.delete(ouvinte);
}

export function useProdutos(): Produto[] {
  return useSyncExternalStore(
    inscrever,
    () => produtos,
    () => produtosIniciais,
  );
}

export function cadastrarProduto(produto: Omit<Produto, "id">) {
  carregar();
  salvar([...produtos, { ...produto, id: crypto.randomUUID() }]);
}

export function removerProduto(id: string) {
  carregar();
  salvar(produtos.filter((p) => p.id !== id));
}
