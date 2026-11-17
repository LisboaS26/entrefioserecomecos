// A logo da loja: basta colocar o arquivo em src/assets com o nome começando
// em "logo" (ex.: logo.png.asset.json) que ela aparece no topo do site e como
// ícone da aba do navegador.
type PonteiroAsset = { url: string };

const logos = import.meta.glob<PonteiroAsset>("../assets/logo*.asset.json", {
  eager: true,
  import: "default",
});

const logoEntradas = Object.entries(logos).sort(([a], [b]) => a.localeCompare(b));

export const logoUrl = logoEntradas[0]?.[1]?.url;
