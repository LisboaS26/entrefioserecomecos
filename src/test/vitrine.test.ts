import { describe, expect, it } from "vitest";

import { consultarProduto, precoValido } from "@/lib/produtos";
import { produtosIniciais } from "@/lib/produtos-store";

const preco = (nome: string) => consultarProduto(produtosIniciais, nome)?.preco;

describe("bolsas reais da vitrine", () => {
  it("tem só as 10 bolsas reais, sem as de exemplo", () => {
    expect(produtosIniciais).toHaveLength(10);
    expect(consultarProduto(produtosIniciais, "Bolsa Aurora")).toBeNull();
  });

  it("usa os preços passados pela loja", () => {
    expect(preco("Bolsa Saco Oliva")).toBe(165);
    expect(preco("Bolsa Noite na Mata")).toBe(165);
    expect(preco("Bolsa Rosa Doce")).toBe(150);
    expect(preco("Bolsa Sálvia")).toBe(165);
    expect(preco("Bolsa Esmeralda Dourada")).toBe(150);
    expect(preco("Bolsa Elegância")).toBe(170);
    expect(preco("Bolsa Gala Dourada")).toBe(300);
    expect(preco("Bolsa Girassol")).toBe(165);
    expect(preco("Bolsa Flor de Lótus")).toBe(180);
    expect(preco("Bolsa Pérola")).toBe(130);
  });

  it("todas respeitam a regra de preço maior que zero", () => {
    expect(produtosIniciais.every((p) => precoValido(p.preco))).toBe(true);
  });
});
