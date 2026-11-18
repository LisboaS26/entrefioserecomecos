import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({ update: vi.fn(), eq: vi.fn(), select: vi.fn(), from: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: db.from } }));
vi.mock("@/lib/produtos.functions", () => ({ listarProdutos: vi.fn() }));

import { editarProduto } from "@/lib/produtos-store";

const produto = { nome: "Bolsa Girassol", preco: 165, categoria: "Bolsa" as const, imagem: "foto.jpg", descricao: "Marrom com flor amarela." };

describe("edição de produtos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    db.from.mockReturnValue(db);
    db.update.mockReturnValue(db);
    db.eq.mockReturnValue(db);
  });

  it("salva descrição, nome, preço, categoria e foto apenas na peça selecionada", async () => {
    db.select.mockResolvedValue({ data: [{ id: "girassol" }], error: null });
    await editarProduto("girassol", produto);
    expect(db.from).toHaveBeenCalledWith("produtos");
    expect(db.update).toHaveBeenCalledWith(produto);
    expect(db.eq).toHaveBeenCalledWith("id", "girassol");
  });

  it("não informa sucesso quando o banco recusa a edição de quem não é da loja", async () => {
    db.select.mockResolvedValue({ data: [], error: null });
    await expect(editarProduto("girassol", produto)).rejects.toThrow("Não foi possível salvar");
  });
});