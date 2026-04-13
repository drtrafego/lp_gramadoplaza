import type { Metadata } from "next";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import HomeScrollFx from "@/components/home-scroll-fx";
import {
  INSTAGRAM_URL,
  RESTAURANT,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  whatsappLink,
} from "@/lib/site";
import "./home.css";

export const metadata: Metadata = {
  title: "Restaurante Italiano em Gramado com Rodízio de Massas",
  description:
    "Sequência italiana completa em Gramado com rodízio de 6 massas artesanais, carnes na chapa e drinks autorais. Aberto todos os dias das 18h às 23h no Bairro Belvedere. Reserve pelo WhatsApp.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Gramado Plazza | Restaurante Italiano em Gramado",
    description:
      "Sequência italiana com rodízio de 6 massas artesanais, carnes na chapa e drinks autorais. Aberto todos os dias das 18h às 23h no Bairro Belvedere.",
    url: SITE_URL,
    type: "website",
    images: ["/salao.jpeg"],
  },
};

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const WHATSAPP_URL = whatsappLink(
  "Olá, tudo bem. Gostaria de fazer uma reserva."
);

const restaurantLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${SITE_URL}/#restaurant`,
  name: SITE_NAME,
  legalName: RESTAURANT.legalName,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  telephone: RESTAURANT.phone,
  priceRange: RESTAURANT.priceRange,
  servesCuisine: RESTAURANT.cuisine,
  foundingDate: String(RESTAURANT.foundingYear),
  image: [
    `${SITE_URL}/salao.jpeg`,
    `${SITE_URL}/fachada.jpeg`,
    `${SITE_URL}/rodizio_massas.jpeg`,
  ],
  sameAs: [INSTAGRAM_URL],
  address: {
    "@type": "PostalAddress",
    streetAddress: RESTAURANT.street,
    addressLocality: RESTAURANT.city,
    addressRegion: RESTAURANT.state,
    postalCode: RESTAURANT.postalCode,
    addressCountry: RESTAURANT.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: RESTAURANT.latitude,
    longitude: RESTAURANT.longitude,
  },
  areaServed: RESTAURANT.areaServed.map((name) => ({
    "@type": "City",
    name,
  })),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: RESTAURANT.openingHours.opens,
      closes: RESTAURANT.openingHours.closes,
    },
  ],
  acceptsReservations: "True",
  hasMenu: `${SITE_URL}/cardapio`,
  potentialAction: {
    "@type": "ReserveAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: WHATSAPP_URL,
      inLanguage: "pt-BR",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    result: {
      "@type": "FoodEstablishmentReservation",
      name: `Reserva no ${SITE_NAME}`,
    },
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Início",
      item: `${SITE_URL}/`,
    },
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qual é o horário de funcionamento do Gramado Plazza?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O Gramado Plazza funciona de segunda a domingo, das 18h às 23h.",
      },
    },
    {
      "@type": "Question",
      name: "O que é a sequência italiana do Gramado Plazza?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "É uma experiência em cinco etapas que inclui couvert artesanal, sopa de capeletti, carnes na chapa, rodízio de seis massas artesanais à vontade e sobremesa (Panna Cotta de baunilha com calda de frutas vermelhas).",
      },
    },
    {
      "@type": "Question",
      name: "Quais massas estão no rodízio do Gramado Plazza?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "São seis massas artesanais servidas à vontade: Penne à Carbonara, Penne ao Molho de Queijo, Espaguete ao Pesto, Espaguete Alho e Óleo, Nhoque à Bolonhesa e Tortei ao Sugo.",
      },
    },
    {
      "@type": "Question",
      name: "Como faço uma reserva no Gramado Plazza?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "As reservas são feitas pelo WhatsApp +55 54 99937-6608. Basta enviar uma mensagem informando data, horário e número de pessoas.",
      },
    },
    {
      "@type": "Question",
      name: "Onde fica o Gramado Plazza?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O Gramado Plazza fica na Rua João Petry, 166, Bairro Belvedere, Gramado, RS.",
      },
    },
  ],
};

const massas = [
  "Penne à Carbonara",
  "Penne ao Molho de Queijo",
  "Espaguete ao Pesto",
  "Espaguete Alho e Óleo",
  "Nhoque à Bolonhesa",
  "Tortei ao Sugo",
];

const etapas = [
  {
    numero: "01",
    titulo: "O Couvert",
    img: "/couvert.jpeg",
    alt: "Couvert artesanal com pão caseiro, salame, queijo, azeitona e ovo de codorna",
    descricao:
      "Sua noite começa com uma seleção artesanal de pão caseiro, salame, queijo, cebolinha cristal, azeitona, pepino e ovo de codorna. Uma recepção à mesa que já diz tudo sobre o que vem pela frente.",
  },
  {
    numero: "02",
    titulo: "Sopa de Capeletti",
    img: "/sopa_capeletti.jpeg",
    alt: "Sopa de capeletti servida quente",
    descricao:
      "Servida quente, no ponto exato. A tradicional sopa de capeletti que aquece o corpo e prepara o paladar para o que está por vir.",
  },
  {
    numero: "03",
    titulo: "Carnes na Chapa",
    img: "/carnes_chapa.jpeg",
    alt: "Entrecot e frango na chapa com polenta e queijo grelhado",
    descricao:
      "Entrecôt e filé de frango grelhados no ponto, acompanhados de polenta frita crocante e queijo grelhado. O equilíbrio perfeito entre sabor e textura antes do grande momento da noite.",
  },
  {
    numero: "04",
    titulo: "Rodízio de Massas à Vontade",
    img: "/rodizio_massas.jpeg",
    alt: "Rodízio de massas artesanais servido à mesa",
    descricao:
      "Aqui o Gramado Plazza brilha. Seis massas artesanais servidas à vontade, direto da cozinha para a sua mesa:",
    massas,
  },
  {
    numero: "05",
    titulo: "Sobremesa",
    img: "/panna_cota.jpeg",
    alt: "Panna Cotta com calda de frutas vermelhas",
    descricao:
      "O encerramento perfeito: Panna Cotta de baunilha com calda de frutas vermelhas. Cremosa, delicada e feita para ser o ponto final de uma noite memorável.",
  },
];

function WhatsAppIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className={`gp-home ${playfair.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <HomeScrollFx />

      <section className="hero">
        <div className="hero-bg parallax-bg">
          <video autoPlay muted loop playsInline src="/video_restaurante.mp4" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">Gramado, Serra Gaúcha</div>
          <h1>
            A experiência gastronômica que vai marcar sua passagem por{" "}
            <em>Gramado</em>
          </h1>
          <p>
            Sequência italiana completa com rodízio de massas artesanais, carnes
            na chapa, drinks autorais e sobremesa. Em um ambiente onde cada
            detalhe foi pensado para encantar.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <WhatsAppIcon />
            Fale conosco pelo WhatsApp
          </a>
        </div>
        <div className="scroll-indicator">
          <span>Explore</span>
          <div className="line" />
        </div>
      </section>

      <section className="contexto">
        <div className="container">
          <div className="eyebrow reveal">Uma noite inesquecível</div>
          <h2 className="reveal delay-1">Gramado merece um jantar à altura</h2>
          <div className="contexto-text reveal delay-2">
            <p>
              Você planejou cada detalhe da viagem. Escolheu a hospedagem,
              montou o roteiro, separou os melhores looks. Falta o jantar que
              vai transformar uma noite comum na melhor lembrança da sua viagem.
            </p>
            <p>
              O Gramado Plazza é onde gastronomia italiana e elegância se
              encontram. Uma sequência completa, do couvert à sobremesa,
              servida em um dos ambientes mais sofisticados da Serra Gaúcha.
            </p>
          </div>
        </div>
      </section>

      <div className="divider reveal" />

      <section className="sequencia">
        <div className="container">
          <div className="eyebrow reveal">A Sequência</div>
          <h2 className="reveal delay-1">
            Cinco etapas. Uma experiência inesquecível.
          </h2>

          {etapas.map((etapa, i) => (
            <div
              key={etapa.numero}
              className={`etapa reveal${i % 2 === 1 ? " etapa-reverse" : ""}`}
            >
              <div
                className={`etapa-img ${i % 2 === 1 ? "reveal-right" : "reveal-left"}`}
              >
                <Image
                  src={etapa.img}
                  alt={etapa.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
              <div
                className={`etapa-content ${i % 2 === 1 ? "reveal-left" : "reveal-right"}`}
              >
                <div className="etapa-number">{etapa.numero}</div>
                <h3 className="etapa-title">{etapa.titulo}</h3>
                <p className="etapa-desc">{etapa.descricao}</p>
                {etapa.massas && (
                  <ul className="massas-list">
                    {etapa.massas.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ambiente">
        <div className="container">
          <div className="ambiente-gallery">
            <div className="img-tile img-tile-wide reveal-scale delay-1">
              <Image
                src="/salao.jpeg"
                alt="Vista panorâmica do salão do Gramado Plazza"
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="img-tile reveal-scale delay-2">
              <Image
                src="/mesa_posta.jpeg"
                alt="Mesa posta com taças e talheres no Gramado Plazza"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="img-tile reveal-scale delay-3">
              <Image
                src="/fachada.jpeg"
                alt="Fachada do restaurante Gramado Plazza no Bairro Belvedere"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="img-tile reveal-scale delay-4">
              <Image
                src="/drink.jpeg"
                alt="Drink autoral do bar do Gramado Plazza"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="img-tile reveal-scale delay-5">
              <Image
                src="/salada.jpg"
                alt="Salada fresca servida no Gramado Plazza"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="eyebrow reveal">O Ambiente</div>
          <h2 className="reveal delay-1">
            Um cenário que você vai querer eternizar
          </h2>
          <p className="reveal delay-2">
            Iluminação intimista. Tons de vermelho e madeira. Cada detalhe do
            Gramado Plazza foi pensado para criar uma atmosfera de elegância e
            aconchego. É o tipo de lugar onde o jantar vira experiência, a foto
            vira memória e a noite vira história.
          </p>
          <address className="endereco reveal delay-3">
            Rua João Petry, 166. Bairro Belvedere, Gramado
          </address>
        </div>
      </section>

      <section className="prova-social">
        <div className="container">
          <div className="eyebrow reveal">Avaliações</div>
          <h2 className="reveal delay-1">
            Quem já viveu essa experiência não esquece
          </h2>
          <div className="depoimentos">
            <div className="depoimento reveal delay-1">
              <div className="depoimento-stars">★★★★★</div>
              <p>
                &ldquo;Ambiente lindo, atendimento impecável e a sequência de
                massas é simplesmente perfeita. Virou parada obrigatória toda
                vez que venho para Gramado.&rdquo;
              </p>
              <div className="depoimento-author">Cliente verificado</div>
            </div>
            <div className="depoimento reveal delay-2">
              <div className="depoimento-stars">★★★★★</div>
              <p>
                &ldquo;Melhor italiano da serra. Os drinks autorais são um
                show à parte e a panna cotta fechou a noite com chave de
                ouro.&rdquo;
              </p>
              <div className="depoimento-author">Cliente verificado</div>
            </div>
            <div className="depoimento reveal delay-3">
              <div className="depoimento-stars">★★★★★</div>
              <p>
                &ldquo;Experiência que vale cada centavo. Atendimento atencioso
                do início ao fim e uma comida que realmente transporta para a
                Itália.&rdquo;
              </p>
              <div className="depoimento-author">Cliente verificado</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-final" id="reserva">
        <div className="container">
          <h2 className="reveal">Sua mesa está esperando</h2>
          <p className="reveal delay-1">
            Não deixe o melhor jantar italiano de Gramado de fora do seu
            roteiro. Fale com a gente pelo WhatsApp e garanta seu horário.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary reveal delay-2"
          >
            <WhatsAppIcon />
            Fale conosco e reserve sua noite
          </a>
        </div>
      </section>

      <footer className="footer">
        <p>Gramado Plazza © 2026. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
