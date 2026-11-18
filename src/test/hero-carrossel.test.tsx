import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeroCarrossel } from "@/components/loja/HeroCarrossel";
import type { Produto } from "@/lib/produtos";

let seq = 0;
function bolsa(nome: string): Produto {
  seq += 1;
  return {
    id: `p${seq}`,
    nome,
    preco: 150,
    categoria: "Bolsa",
    imagem: `/fotos/${nome}.jpg`,
    descricao: "",
  };
}

describe("Foto do topo que troca sozinha", () => {
  it("não mostra nada quando a loja ainda não tem peças", () => {
    const { container } = render(<HeroCarrossel produtos={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("esconde os pontinhos e o botão de pausar quando só tem uma peça", () => {
    render(<HeroCarrossel produtos={[bolsa("Bolsa Única")]} />);

    expect(screen.getByRole("img", { name: /Bolsa Única/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Mostrar/ })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /troca automática das fotos/ }),
    ).not.toBeInTheDocument();
  });

  it("mostra um pontinho por peça quando há mais de uma", () => {
    render(<HeroCarrossel produtos={[bolsa("Bolsa A"), bolsa("Bolsa B"), bolsa("Bolsa C")]} />);

    expect(screen.getAllByRole("button", { name: /^Mostrar/ })).toHaveLength(3);
    expect(
      screen.getByRole("button", { name: "Pausar a troca automática das fotos" }),
    ).toBeInTheDocument();
  });
});
