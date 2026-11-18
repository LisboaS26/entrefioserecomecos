import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

/** Confere no banco se a conta é da loja (administradora). */
export async function ehDaLoja(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return Boolean(data);
}

type Sessao = { carregando: boolean; email: string | null; daLoja: boolean };

export function useSessao(): Sessao {
  const [sessao, setSessao] = useState<Sessao>({ carregando: true, email: null, daLoja: false });

  useEffect(() => {
    let ativo = true;
    async function atualizar(user: { id: string; email?: string | null } | null) {
      if (!user) {
        if (ativo) setSessao({ carregando: false, email: null, daLoja: false });
        return;
      }
      const daLoja = await ehDaLoja(user.id);
      if (ativo) setSessao({ carregando: false, email: user.email ?? null, daLoja });
    }
    void supabase.auth.getUser().then(({ data }) => atualizar(data.user));
    const { data } = supabase.auth.onAuthStateChange((evento, s) => {
      if (evento !== "SIGNED_IN" && evento !== "SIGNED_OUT" && evento !== "USER_UPDATED") return;
      setTimeout(() => void atualizar(s?.user ?? null), 0);
    });
    return () => {
      ativo = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return sessao;
}
