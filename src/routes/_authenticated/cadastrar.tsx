import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ImagePlus, Lock, LogOut, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fotosProntas } from "@/lib/imagens";
import { formatarPreco, lerPreco, precoValido, type Categoria, type Produto } from "@/lib/produtos";
import { ehDaLoja } from "@/hooks/use-sessao";
import { supabase } from "@/integrations/supabase/client";
import { cadastrarProduto, editarProduto, produtosQuery, removerProduto, useProdutos } from "@/lib/produtos-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/cadastrar")({
  head: () => ({
    meta: [
      { title: "Gerenciar produtos — Entre Fios e Recomeços" },
      { name: "description", content: "Área da loja para cadastrar e editar peças, fotos, preços e descrições." },
      { property: "og:title", content: "Gerenciar produtos — Entre Fios e Recomeços" },
      { property: "og:description", content: "Cadastro e edição das peças de crochê na área exclusiva da loja." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  ssr: false,
  loader: async ({ context }) => ({
    email: context.user.email ?? "",
    daLoja: await ehDaLoja(context.user.id),
  }),
  component: AreaDaLoja,
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
        const lado = 800;
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

async function sair(navegar: () => void) {
  await supabase.auth.signOut();
  navegar();
}

function AreaDaLoja() {
  const { email, daLoja } = Route.useLoaderData();
  const navigate = useNavigate();
  if (!daLoja) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          <Lock className="size-6" />
        </div>
        <h1 className="mt-5 font-display text-3xl text-foreground">Área só da loja</h1>
        <p className="mt-3 text-muted-foreground">
          A conta <strong className="text-foreground">{email}</strong> não tem permissão para cadastrar peças.
        </p>
        <Button variant="hero" className="mt-6" onClick={() => sair(() => navigate({ to: "/" }))}>
          <LogOut /> Sair
        </Button>
      </div>
    );
  }
  return <Cadastrar email={email} />;
}

function Cadastrar({ email }: { email: string }) {
  const produtos = useProdutos();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [salvando, setSalvando] = useState(false);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState<Categoria>("Bolsa");
  const [imagem, setImagem] = useState<string>(fotosProntas[0].url);
  const [erroPreco, setErroPreco] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [material, setMaterial] = useState("");
  const [medidas, setMedidas] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  function limparFormulario() {
    setEditandoId(null);
    setNome("");
    setPreco("");
    setDescricao("");
    setMaterial("");
    setMedidas("");
    setCategoria("Bolsa");
    setImagem(fotosProntas[0].url);
    setErroNome("");
    setErroPreco("");
  }

  function iniciarEdicao(produto: Produto) {
    setEditandoId(produto.id);
    setNome(produto.nome);
    setPreco(String(produto.preco).replace(".", ","));
    setCategoria(produto.categoria);
    setImagem(produto.imagem);
    setDescricao(produto.descricao);
    setMaterial(produto.material ?? "");
    setMedidas(produto.medidas ?? "");
    setErroNome("");
    setErroPreco("");
    document.getElementById("formulario-produto")?.scrollIntoView({ block: "start" });
    document.getElementById("nome")?.focus({ preventScroll: true });
  }

  async function escolherFoto(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    try {
      setImagem(await reduzirFoto(arquivo));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível usar essa foto.");
    }
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const valor = lerPreco(preco);
    const nomeLimpo = nome.trim();
    setErroNome(nomeLimpo ? "" : "Digite o nome do produto.");
    setErroPreco(precoValido(valor) ? "" : "Preço inválido. Digite um valor maior que zero.");
    if (!nomeLimpo || !precoValido(valor)) return;

    setSalvando(true);
    try {
      const produto = {
        nome: nomeLimpo,
        preco: valor,
        categoria,
        imagem,
        descricao: descricao.trim(),
        material: material.trim(),
        medidas: medidas.trim(),
      };
      if (editandoId) await editarProduto(editandoId, produto);
      else await cadastrarProduto(produto);
      await queryClient.invalidateQueries({ queryKey: produtosQuery.queryKey });
      toast.success(editandoId ? "Alterações salvas!" : "Produto cadastrado com sucesso!");
      limparFormulario();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível cadastrar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-2 [&>*]:min-w-0">
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Área da loja</p>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => sair(() => navigate({ to: "/" }))}>
            <LogOut /> Sair
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Conectada como {email}</p>
        <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">{editandoId ? "Editar produto" : "Cadastrar produto"}</h1>

        <form id="formulario-produto" onSubmit={enviar} noValidate className="mt-8 scroll-mt-24 space-y-6">
          <fieldset disabled={salvando} className="min-w-0 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do produto</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Bolsa Margarida" className="h-11" />
            {erroNome && <p className="text-sm font-semibold text-destructive">{erroNome}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do produto</Label>
            <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={4} placeholder="Cor, tamanho, tipo de alça e detalhes da peça" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="material">Material (opcional)</Label>
              <Input id="material" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Ex.: fio de algodão, com forro" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medidas">Medidas (opcional)</Label>
              <Input id="medidas" value={medidas} onChange={(e) => setMedidas(e.target.value)} placeholder="Ex.: 30 x 25 cm, alça 60 cm" className="h-11" />
            </div>
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
                <Button variant="outline"
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
                </Button>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Foto</legend>
            <div className="grid grid-cols-5 gap-2">
              {fotosProntas.map((f) => (
                <Button variant="ghost"
                  key={f.url}
                  type="button"
                  onClick={() => setImagem(f.url)}
                  aria-label={f.rotulo}
                  aria-pressed={imagem === f.url}
                  className={cn(
                    "h-auto aspect-square w-full overflow-hidden rounded-xl p-0 ring-2 transition",
                    imagem === f.url ? "ring-primary" : "ring-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <img src={f.url} alt="" className="h-full w-full object-cover" />
                </Button>
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

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={salvando}>
            {editandoId ? <Save /> : <Plus />} {salvando ? "Salvando..." : editandoId ? "Salvar alterações" : "Cadastrar produto"}
          </Button>
          {editandoId && <Button type="button" variant="outline" className="w-full" onClick={limparFormulario}><X /> Cancelar edição</Button>}
          </fieldset>
        </form>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4 lg:mt-[5.5rem]">
          <h2 className="font-display text-2xl text-foreground">Produtos cadastrados</h2>
          <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">{produtos.length}</span>
        </div>
        <ol className="mt-6 space-y-3">
          {produtos.map((p, i) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border">
              <span className="w-6 text-right text-sm font-bold text-muted-foreground">{i + 1}.</span>
              <img src={p.imagem} alt="" className="size-14 rounded-xl object-cover" />
              <div className="min-w-0 flex-1 basis-24">
                <p className="truncate font-semibold text-card-foreground">{p.nome}</p>
                <p className="text-xs text-muted-foreground">{p.categoria}</p>
              </div>
              <p className="font-bold text-primary">{formatarPreco(p.preco)}</p>
              <Button variant="ghost" size="icon" aria-label={`Editar ${p.nome}`} title={`Editar ${p.nome}`} disabled={salvando} onClick={() => iniciarEdicao(p)}><Pencil /></Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remover ${p.nome}`}
                disabled={salvando}
                onClick={async () => {
                  if (!window.confirm(`Remover "${p.nome}" da vitrine?`)) return;
                  try {
                    await removerProduto(p.id);
                    if (editandoId === p.id) limparFormulario();
                    await queryClient.invalidateQueries({ queryKey: produtosQuery.queryKey });
                    toast(`"${p.nome}" removido.`);
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Não foi possível remover.");
                  }
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
