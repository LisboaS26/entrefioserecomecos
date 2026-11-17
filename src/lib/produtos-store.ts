import { useSyncExternalStore } from "react";

import { fotosProntas } from "./imagens";
import type { Produto } from "./produtos";

const CHAVE = "entre-fios-produtos";

const [terracota, verde, redonda, acessorios] = fotosProntas;

export const produtosIniciais: Produto[] = [
  { id: "1", nome: "Bolsa Aurora", preco: 189.9, categoria: "Bolsa", imagem: terracota.url },
  { id: "2", nome: "Bolsa Sálvia", preco: 159.9, categoria: "Bolsa", imagem: verde.url },
  { id: "3", nome: "Bolsa Lua", preco: 139.9, categoria: "Bolsa", imagem: redonda.url },
  { id: "4", nome: "Kit Porta-moedas e Xuxinhas", preco: 59.9, categoria: "Acessório", imagem: acessorios.url },
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
