// Contatos da loja.
export const WHATSAPP_NUMERO = "5511944719032";
export const INSTAGRAM_USUARIO = "entrefioserecomecos";

export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

export const LINK_INSTAGRAM = `https://instagram.com/${INSTAGRAM_USUARIO}`;
