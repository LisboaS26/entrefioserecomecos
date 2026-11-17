// A logo da loja: basta colocar o arquivo em src/assets com o nome começando
// em "logo" (ex.: logo.png.asset.json) que ela aparece no topo e no rodapé.
// O ícone da aba é o arquivo public/favicon.png (gerado a partir da logo).
type PonteiroAsset = { url: string };

const logos = import.meta.glob<PonteiroAsset>("../assets/logo*.asset.json", {
  eager: true,
  import: "default",
});

const logoEntradas = Object.entries(logos).sort(([a], [b]) => a.localeCompare(b));

export const logoUrl = logoEntradas[0]?.[1]?.url;
