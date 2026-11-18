import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({
    meta: [
      { title: "Nova senha — Entre Fios e Recomeços" },
      { name: "description", content: "Crie uma senha nova para a área da loja Entre Fios e Recomeços." },
      { property: "og:title", content: "Nova senha — Entre Fios e Recomeços" },
      { property: "og:description", content: "Crie uma senha nova para a área da loja." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RedefinirSenha,
});

function RedefinirSenha() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (senha.length < 6) {
      toast.error("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    setEnviando(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setEnviando(false);
    if (error) {
      toast.error("O link expirou ou já foi usado. Peça um novo na tela de entrar.");
      return;
    }
    toast.success("Senha nova salva!");
    await navigate({ to: "/cadastrar" });
  }

  return (
    <div className="mx-auto max-w-md px-5 py-14">
      <h1 className="text-center font-display text-4xl text-foreground">Nova senha</h1>
      <form onSubmit={salvar} className="mt-8 space-y-4 rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border sm:p-8">
        <div className="space-y-2">
          <Label htmlFor="nova-senha">Digite a senha nova</Label>
          <Input id="nova-senha" type="password" autoComplete="new-password" value={senha} onChange={(e) => setSenha(e.target.value)} className="h-11" />
        </div>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={enviando}>
          Salvar senha
        </Button>
      </form>
    </div>
  );
}
