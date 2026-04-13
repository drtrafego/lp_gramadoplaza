export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gramadoplazza.com.br"
).replace(/\/+$/, "");

export const SITE_NAME = "Gramado Plazza";

export const SITE_DESCRIPTION =
  "Restaurante italiano em Gramado especializado em sequência italiana com rodízio de seis massas artesanais, carnes na chapa, drinks autorais e sobremesa. Aberto todos os dias, 18h às 23h.";

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5554999376608";

export const WHATSAPP_DISPLAY = "+55 54 99937-6608";

export const INSTAGRAM_URL = "https://www.instagram.com/gramadoplazza/";

export const RESTAURANT = {
  name: "Gramado Plazza",
  legalName: "Gramado Plazza Restaurante",
  foundingYear: 2020,
  cuisine: ["Italian"],
  priceRange: "$$",
  street: "Rua João Petry, 166",
  neighborhood: "Bairro Belvedere",
  city: "Gramado",
  state: "RS",
  postalCode: "95670-000",
  country: "BR",
  phone: "+5554999376608",
  instagram: INSTAGRAM_URL,
  latitude: -29.3805933,
  longitude: -50.8715195,
  areaServed: ["Gramado", "Canela", "Serra Gaúcha", "Rio Grande do Sul"],
  openingHours: {
    days: "Mo-Su",
    opens: "18:00",
    closes: "23:00",
  },
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
