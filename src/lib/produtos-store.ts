import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { listarProdutos } from "./produtos.functions";
import type { Produto } from "./produtos";

export const produtosQuery = queryOptions({
  queryKey: ["produtos"],
  queryFn: () => listarProdutos(),
});

export function useProdutos(): Produto[] {
  return useSuspenseQuery(produtosQuery).data;
}

/** Só funciona para quem é da loja: o banco recusa qualquer outra pessoa. */
export async function cadastrarProduto(produto: Omit<Produto, "id">) {
  const { error } = await supabase.from("produtos").insert(produto);
  if (error) throw new Error("Não foi possível cadastrar. Confira se você entrou com a conta da loja.");
}

export async function removerProduto(id: string) {
  const { data, error } = await supabase.from("produtos").delete().eq("id", id).select("id");
  if (error || !data?.length) throw new Error("Não foi possível remover essa peça.");
}

export async function editarProduto(id: string, produto: Omit<Produto, "id">) {
  const { data, error } = await supabase.from("produtos").update(produto).eq("id", id).select("id");
  if (error || !data?.length) throw new Error("Não foi possível salvar as alterações. Confira a conta da loja.");
}
