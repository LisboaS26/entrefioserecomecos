import { useSyncExternalStore } from "react";

import type { Produto } from "./produtos";

// Carrinho salvo no próprio navegador do cliente (cada bolsa pronta é peça única).
const CHAVE = "entrefios-carrinho";
const ouvintes = new Set<() => void>();
let cache: string[] | null = null;
const VAZIO: string[] = [];

function ler(): string[] {
  if (cache) return cache;
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE) ?? "[]");
    cache = Array.isArray(bruto) ? bruto.filter((x): x is string => typeof x === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function salvar(ids: string[]) {
  cache = ids;
  localStorage.setItem(CHAVE, JSON.stringify(ids));
  ouvintes.forEach((f) => f());
}

export function useCarrinho(): string[] {
  return useSyncExternalStore(
    (f) => {
      ouvintes.add(f);
      return () => ouvintes.delete(f);
    },
    ler,
    () => VAZIO,
  );
}

export function adicionarAoCarrinho(id: string) {
  const ids = ler();
  if (!ids.includes(id)) salvar([...ids, id]);
}

export function removerDoCarrinho(id: string) {
  salvar(ler().filter((x) => x !== id));
}

export function limparCarrinho() {
  salvar([]);
}

/** Peças do carrinho que ainda existem na loja. */
export function itensDoCarrinho(produtos: Produto[], ids: string[]): Produto[] {
  return ids.map((id) => produtos.find((p) => p.id === id)).filter((p): p is Produto => !!p);
}

export function totalDoCarrinho(itens: Produto[]): number {
  return Math.round(itens.reduce((s, p) => s + p.preco, 0) * 100) / 100;
}

export const FORMAS_PAGAMENTO = ["Cartão de crédito", "Cartão de débito", "Pix", "Dinheiro"] as const;
