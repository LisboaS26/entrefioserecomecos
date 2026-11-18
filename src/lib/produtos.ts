// Regras da loja, traduzidas do código Python original (cadastrarProduto, consultarProduto, listarProdutos).

export type Categoria = "Bolsa" | "Acessório";

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  categoria: Categoria;
  imagem: string;
  descricao: string;
  /** Detalhes opcionais da peça, mostrados na página dela. */
  material?: string;
  medidas?: string;
}

/** Igual ao Python: o preço só é válido se for maior que zero. */
export function precoValido(preco: number): boolean {
  return Number.isFinite(preco) && preco > 0;
}

/** Aceita "89,90", "89.90" ou "R$ 89,90" e devolve o número (NaN se não for número). */
export function lerPreco(texto: string): number {
  let limpo = texto.replace(/R\$/i, "").trim();
  if (limpo.includes(",")) limpo = limpo.replace(/\./g, "").replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(limpo)) return Number.NaN;
  return Number(limpo);
}

function normalizar(nome: string): string {
  return nome.trim().toLocaleLowerCase("pt-BR");
}

/** Consulta pelo nome completo (sem ligar para maiúsculas ou espaços nas pontas). */
export function consultarProduto(produtos: Produto[], nomeBusca: string): Produto | null {
  const alvo = normalizar(nomeBusca);
  if (!alvo) return null;
  let i = 0;
  while (i < produtos.length) {
    const produto = produtos[i];
    if (produto && normalizar(produto.nome) === alvo) return produto;
    i += 1;
  }
  return null;
}

export function formatarPreco(preco: number): string {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Nome da peça vira endereço da página dela: "Flor de Lótus" -> "flor-de-lotus". */
export function slugDeProduto(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Acha a peça pelo endereço (ou pelo id), do mesmo jeito que o Python consultava pelo nome. */
export function buscarProdutoPorSlug(produtos: Produto[], slug: string): Produto | null {
  const alvo = slug.trim().toLocaleLowerCase("pt-BR");
  if (!alvo) return null;
  return produtos.find((p) => slugDeProduto(p.nome) === alvo || p.id === alvo) ?? null;
}
