import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import type { Categoria, Produto } from "./produtos";

/** Lista pública das peças da vitrine (qualquer visitante pode ver). */
export const listarProdutos = createServerFn({ method: "GET" }).handler(async (): Promise<Produto[]> => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const supabasePublico = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const { data, error } = await supabasePublico
    .from("produtos")
    .select("id, nome, preco, categoria, imagem, descricao")
    .order("created_at", { ascending: true });
  if (error) throw new Error("Não foi possível carregar as peças.");
  return data.map((p) => ({
    id: p.id,
    nome: p.nome,
    preco: Number(p.preco),
    categoria: p.categoria as Categoria,
    imagem: p.imagem,
    descricao: p.descricao,
  }));
});
