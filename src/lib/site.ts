export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gramadoplazza.com.br"
).replace(/\/+$/, "");

export const SITE_NAME = "Gramado Plazza";

export const SITE_DESCRIPTION =
  "Restaurante italiano em Gramado especializado em sequência italiana com rodízio de seis massas artesanais, carnes na chapa, drinks autorais e sobremesa. Aberto todos os dias, 18h às 23h.";

export const WHATSAPP_NUMBER = "555499376608";

export const WHATSAPP_DISPLAY = "+55 54 9937-6608";

export const INSTAGRAM_URL = "https://www.instagram.com/gramadoplazza/";
export const FACEBOOK_URL = "https://www.facebook.com/gramadoplazza/";
export const TRIPADVISOR_URL =
  "https://www.tripadvisor.com/Restaurant_Review-g303536-d28512426-Reviews-Gramado_Plazza-Gramado_State_of_Rio_Grande_do_Sul.html";
export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=Gramado+Plazza+Restaurante+Gramado+RS";

export const RATING = {
  value: 4.2,
  count: 22,
  source: "TripAdvisor",
  url: TRIPADVISOR_URL,
} as const;

export interface Testimonial {
  name: string;
  text: string;
  source: string;
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    name: "Enéias T.",
    text: "Experiência em família impecável. A sequência italiana é surpreendente, os pratos são deliciosos e o atendimento é muito atencioso do começo ao fim.",
    source: "TripAdvisor",
  },
  {
    name: "Madu",
    text: "Comida maravilhosa, cheia de sabor, em um ambiente muito aconchegante e com atendimento excelente das garçonetes. Virou parada obrigatória em Gramado.",
    source: "TripAdvisor",
  },
  {
    name: "Alilson Müller",
    text: "Serviço e recepção de excelente qualidade. Pratos muito bem apresentados e com sabor à altura. Vale cada minuto da noite.",
    source: "TripAdvisor",
  },
] as const;

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
  phone: "+555499376608",
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
