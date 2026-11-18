import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { BotaoGoogle } from "@/components/loja/BotaoGoogle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar na área da loja — Entre Fios e Recomeços" },
      { name: "description", content: "Acesso restrito da loja Entre Fios e Recomeços para cadastrar peças." },
      { property: "og:title", content: "Área da loja — Entre Fios e Recomeços" },
      { property: "og:description", content: "Acesso restrito da loja para cadastrar peças." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Entrar,
});

type Modo = "entrar" | "criar";

function traduzirErro(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar (veja sua caixa de entrada).";
  if (m.includes("already registered")) return "Esse e-mail já tem conta. Use a aba Entrar.";
  if (m.includes("password")) return "A senha precisa ter pelo menos 6 caracteres.";
  return "Não deu certo. Tente de novo em instantes.";
}

function Entrar() {
  const navigate = useNavigate();
  const [modo, setModo] = useState<Modo>("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void navigate({ to: "/cadastrar" });
    });
  }, [navigate]);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setAviso("");
    setEnviando(true);
    try {
      if (modo === "entrar") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
        if (error) throw error;
        await navigate({ to: "/cadastrar" });
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: senha,
          options: { emailRedirectTo: `${window.location.origin}/cadastrar` },
        });
        if (error) throw error;
        setAviso("Conta criada! Abra o e-mail que enviamos e clique no link para confirmar. Depois é só entrar.");
        setModo("entrar");
        setSenha("");
      }
    } catch (err) {
      toast.error(traduzirErro(err instanceof Error ? err.message : ""));
    } finally {
      setEnviando(false);
    }
  }

  async function esqueciSenha() {
    if (!email.trim()) {
      toast.error("Digite seu e-mail primeiro.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    if (error) toast.error(traduzirErro(error.message));
    else setAviso("Enviamos um link para o seu e-mail para criar uma senha nova.");
  }

  async function entrarComGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast.error("Não foi possível entrar com o Google.");
      return;
    }
    if (result.redirected) return;
    await navigate({ to: "/cadastrar" });
  }

  return (
    <div className="mx-auto max-w-md px-5 py-14">
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          <Lock className="size-6" />
        </div>
        <h1 className="mt-4 font-display text-4xl text-foreground">
          Área da <span className="font-script text-primary">loja</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Só quem é da loja consegue cadastrar peças.</p>
      </div>

      <div className="mt-8 rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border sm:p-8">
        <div className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1 text-sm font-semibold" role="tablist">
          {(["entrar", "criar"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={modo === m}
              onClick={() => setModo(m)}
              className={cn(
                "rounded-full py-2 transition-colors",
                modo === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "entrar" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        {aviso && (
          <p role="status" className="mt-5 rounded-2xl bg-accent p-3 text-sm font-semibold text-accent-foreground">
            {aviso}
          </p>
        )}

        <form onSubmit={enviar} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              autoComplete={modo === "entrar" ? "current-password" : "new-password"}
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="h-11"
            />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={enviando}>
            {enviando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar conta"}
          </Button>
          {modo === "entrar" && (
            <button type="button" onClick={esqueciSenha} className="w-full text-center text-sm text-primary hover:underline">
              Esqueci minha senha
            </button>
          )}
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
        </div>
        <BotaoGoogle onClick={entrarComGoogle} />
      </div>
    </div>
  );
}
