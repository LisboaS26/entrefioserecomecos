import { createFileRoute } from "@tanstack/react-router";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fotosProntas } from "@/lib/imagens";
import { formatarPreco, lerPreco, precoValido, type Categoria } from "@/lib/produtos";
import { cadastrarProduto, removerProduto, useProdutos } from "@/lib/produtos-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cadastrar")({
  head: () => ({
    meta: [
      { title: "Cadastrar produto — Entre Fios e Recomeços" },
      { name: "description", content: "Cadastre novas bolsas e acessórios de crochê na vitrine da loja." },
      { property: "og:title", content: "Cadastrar produto — Entre Fios e Recomeços" },
      { property: "og:description", content: "Adicione peças novas na vitrine da loja de crochê." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Cadastrar,
});

/** Diminui a foto para caber no navegador sem pesar. */
function reduzirFoto(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error("Não foi possível ler a foto."));
    leitor.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
      img.onload = () => {
        const lado = 600;
        const escala = Math.min(1, lado / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = String(leitor.result);
    };
    leitor.readAsDataURL(arquivo);
  });
}

function Cadastrar() {
  const produtos = useProdutos();
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState<Categoria>("Bolsa");
  const [imagem, setImagem] = useState<string>(fotosProntas[0].url);
  const [erroPreco, setErroPreco] = useState("");
  const [erroNome, setErroNome] = useState("");

  async function escolherFoto(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    try {
      setImagem(await reduzirFoto(arquivo));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível usar essa foto.");
    }
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    const valor = lerPreco(preco);
    const nomeLimpo = nome.trim();
    setErroNome(nomeLimpo ? "" : "Digite o nome do produto.");
    setErroPreco(precoValido(valor) ? "" : "Preço inválido. Digite um valor maior que zero.");
    if (!nomeLimpo || !precoValido(valor)) return;

    cadastrarProduto({ nome: nomeLimpo, preco: valor, categoria, imagem });
    toast.success("Produto cadastrado com sucesso!");
    setNome("");
    setPreco("");
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1fr_1fr]">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Área da loja</p>
        <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">Cadastrar produto</h1>

        <form onSubmit={enviar} noValidate className="mt-8 space-y-6 rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border sm:p-8">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do produto</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Bolsa Margarida" className="h-11" />
            {erroNome && <p className="text-sm font-semibold text-destructive">{erroNome}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco">Preço do produto (maior que zero)</Label>
            <Input id="preco" inputMode="decimal" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="Ex.: 129,90" className="h-11" />
            {erroPreco && <p className="text-sm font-semibold text-destructive">{erroPreco}</p>}
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Categoria</legend>
            <div className="flex gap-2">
              {(["Bolsa", "Acessório"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategoria(c)}
                  aria-pressed={categoria === c}
                  className={cn(
                    "rounded-full border px-5 py-2 text-sm font-semibold transition-colors",
                    categoria === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Foto</legend>
            <div className="grid grid-cols-5 gap-2">
              {fotosProntas.map((f) => (
                <button
                  key={f.url}
                  type="button"
                  onClick={() => setImagem(f.url)}
                  aria-label={f.rotulo}
                  aria-pressed={imagem === f.url}
                  className={cn(
                    "aspect-square overflow-hidden rounded-xl ring-2 transition",
                    imagem === f.url ? "ring-primary" : "ring-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <img src={f.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary">
                <ImagePlus className="size-5" />
                Enviar
                <input type="file" accept="image/*" className="sr-only" onChange={escolherFoto} />
              </label>
            </div>
            {!fotosProntas.some((f) => f.url === imagem) && (
              <img src={imagem} alt="Foto enviada" className="h-28 w-28 rounded-xl object-cover ring-2 ring-primary" />
            )}
          </fieldset>

          <Button type="submit" variant="hero" size="lg" className="w-full">
            <Plus /> Cadastrar produto
          </Button>
        </form>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4 lg:mt-[5.5rem]">
          <h2 className="font-display text-2xl text-foreground">Produtos cadastrados</h2>
          <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">{produtos.length}</span>
        </div>
        <ol className="mt-6 space-y-3">
          {produtos.map((p, i) => (
            <li key={p.id} className="flex items-center gap-4 rounded-2xl bg-card p-3 ring-1 ring-border">
              <span className="w-6 text-right text-sm font-bold text-muted-foreground">{i + 1}.</span>
              <img src={p.imagem} alt="" className="size-14 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-card-foreground">{p.nome}</p>
                <p className="text-xs text-muted-foreground">{p.categoria}</p>
              </div>
              <p className="font-bold text-primary">{formatarPreco(p.preco)}</p>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remover ${p.nome}`}
                onClick={() => {
                  removerProduto(p.id);
                  toast(`"${p.nome}" removido.`);
                }}
              >
                <Trash2 />
              </Button>
            </li>
          ))}
          {produtos.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
              Nenhum produto cadastrado ainda.
            </li>
          )}
        </ol>
      </section>
    </div>
  );
}
