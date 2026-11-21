import { describe, expect, it } from "vitest";
import { FORMAS_PAGAMENTO, itensDoCarrinho, totalDoCarrinho } from "@/lib/carrinho";
import type { Produto } from "@/lib/produtos";

const p = (id: string, preco: number): Produto => ({ id, nome: id, preco, categoria: "Bolsa", imagem: "", descricao: "" });

describe("carrinho", () => {
  it("soma o total das bolsas", () => {
    expect(totalDoCarrinho([p("a", 165), p("b", 300), p("c", 130)])).toBe(595);
  });
  it("ignora peças que saíram da loja", () => {
    expect(itensDoCarrinho([p("a", 165)], ["a", "x"]).map((i) => i.id)).toEqual(["a"]);
  });
  it("aceita crédito, débito, pix e dinheiro", () => {
    expect([...FORMAS_PAGAMENTO]).toEqual(["Cartão de crédito", "Cartão de débito", "Pix", "Dinheiro"]);
  });
});
