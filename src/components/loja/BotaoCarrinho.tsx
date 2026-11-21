import { Check, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { adicionarAoCarrinho, removerDoCarrinho, useCarrinho } from "@/lib/carrinho";

export function BotaoCarrinho({ id, size = "sm", className }: { id: string; size?: "sm" | "lg"; className?: string }) {
  const noCarrinho = useCarrinho().includes(id);
  return (
    <Button
      type="button"
      size={size}
      variant={noCarrinho ? "secondary" : "default"}
      className={`rounded-full ${className ?? ""}`}
      onClick={() => (noCarrinho ? removerDoCarrinho(id) : adicionarAoCarrinho(id))}
    >
      {noCarrinho ? <><Check /> No carrinho (tirar)</> : <><ShoppingBag /> Adicionar ao carrinho</>}
    </Button>
  );
}
