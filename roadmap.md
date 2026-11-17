# Roadmap

## Esperando o Paulo mandar
- [ ] Receber fotos + nome + valor das bolsas reais da mãe.
  - Adicionar cada peça na vitrine (foto no CDN, nome, preço, categoria).
  - Tirar as 4 peças de exemplo da vitrine (decisão confirmada: "Tirar as de exemplo").
- [ ] Receber o arquivo da logo e colocar no topo do site (slot já testado e funcionando).
  - Ao colocar a logo de verdade: gerar o ícone da aba a partir dela (copiar para `public/favicon.png`, redimensionado e quadrado) e apontar `src/routes/__root.tsx` para esse arquivo, tirando o `/favicon.ico` padrão.

## Feito
- [x] Site da loja no ar: vitrine, cadastro com validação de preço > 0, busca por nome, botões de WhatsApp e Instagram.
- [x] Logo pronta para entrar: `src/lib/logo.ts` procura `src/assets/logo*.asset.json` e mostra a imagem no topo e como ícone da aba, sem precisar mexer em mais código.
