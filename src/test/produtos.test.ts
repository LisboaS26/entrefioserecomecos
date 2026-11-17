import { describe, expect, it } from "vitest";

import { consultarProduto, lerPreco, precoValido, type Produto } from "@/lib/produtos";

const lista: Produto[] = [
  { id: "1", nome: "Bolsa Aurora", preco: 189.9, categoria: "Bolsa", imagem: "" },
  { id: "2", nome: "Xuxinha", preco: 15, categoria: "Acessório", imagem: "" },
];

describe("regras do cadastro", () => {
  it("só aceita preço maior que zero", () => {
    expect(precoValido(0)).toBe(false);
    expect(precoValido(-5)).toBe(false);
    expect(precoValido(Number.NaN)).toBe(false);
    expect(precoValido(0.01)).toBe(true);
  });

  it("lê preço escrito com vírgula", () => {
    expect(lerPreco("129,90")).toBe(129.9);
    expect(lerPreco("R$ 1.250,00")).toBe(1250);
    expect(lerPreco("abc")).toBeNaN();
  });
});

describe("consultar produto", () => {
  it("encontra pelo nome, sem ligar para maiúsculas", () => {
    expect(consultarProduto(lista, "bolsa aurora")?.preco).toBe(189.9);
  });

  it("retorna nada quando o produto não existe", () => {
    expect(consultarProduto(lista, "Chapéu")).toBeNull();
  });
});
