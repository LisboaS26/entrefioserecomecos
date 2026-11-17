// Regras da loja, traduzidas do código Python original (cadastrarProduto, consultarProduto, listarProdutos).

export type Categoria = "Bolsa" | "Acessório";

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  categoria: Categoria;
  imagem: string;
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
