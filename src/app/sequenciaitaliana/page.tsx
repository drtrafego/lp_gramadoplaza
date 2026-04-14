import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import {
  RESTAURANT,
  SITE_NAME,
  SITE_URL,
  WHATSAPP_NUMBER,
} from "@/lib/site";
import "./sequencia.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const WA_MESSAGE =
  "Olá, vi a página da sequência italiana e gostaria de fazer uma reserva.";
const WA_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WA_MESSAGE,
)}`;

export const metadata: Metadata = {
  title: "Sequência Italiana com Rodízio de 6 Massas",
  description:
    "A experiência completa do Gramado Plazza: couvert artesanal, sopa de capeletti, carnes na chapa, rodízio de seis massas à vontade e sobremesa. Aberto todos os dias, das 18h às 23h, no Bairro Belvedere em Gramado.",
  alternates: { canonical: "/sequenciaitaliana" },
  openGraph: {
    title: "Sequência Italiana — Gramado Plazza",
    description:
      "Couvert, sopa de capeletti, carnes na chapa, rodízio de 6 massas artesanais à vontade e sobremesa. Uma noite completa no coração de Gramado.",
    url: `${SITE_URL}/sequenciaitaliana`,
    type: "article",
    images: [
      {
        url: "/rodizio_massas.jpeg",
        width: 1200,
        height: 630,
        alt: "Rodízio de massas artesanais do Gramado Plazza",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sequência Italiana — Gramado Plazza",
    description:
      "Couvert, sopa de capeletti, carnes na chapa, rodízio de 6 massas artesanais à vontade e sobremesa.",
    images: ["/rodizio_massas.jpeg"],
  },
};

const etapas = [
  {
    num: "01",
    title: "O Couvert",
    image: "/couvert.jpeg",
    alt: "Couvert artesanal com pão caseiro, salame, queijo e ovo de codorna",
    desc: "Sua noite começa com pão caseiro, salame, queijo, cebolinha cristal, azeitona, pepino e ovo de codorna. Uma recepção à mesa que já diz tudo sobre o que vem pela frente.",
  },
  {
    num: "02",
    title: "Sopa de Capeletti",
    image: "/sopa_capeletti.jpeg",
    alt: "Sopa de capeletti quente",
    desc: "Servida quente, no ponto exato. A tradicional sopa de capeletti que aquece o corpo e prepara o paladar para o que está por vir.",
  },
  {
    num: "03",
    title: "Carnes na Chapa",
    image: "/carnes_chapa.jpeg",
    alt: "Entrecôt e frango na chapa acompanhados de polenta frita",
    desc: "Entrecôt e filé de frango grelhados no ponto certo, polenta frita crocante e queijo grelhado. O equilíbrio perfeito entre sabor e textura antes do grande momento.",
  },
  {
    num: "04",
    title: "Rodízio de 6 Massas",
    image: "/rodizio_massas.jpeg",
    alt: "Rodízio de massas artesanais servido na mesa",
    desc: "O coração da sequência. Seis massas artesanais servidas à vontade, direto da cozinha pra sua mesa.",
  },
  {
    num: "05",
    title: "Sobremesa",
    image: "/panna_cota.jpeg",
    alt: "Panna cotta com calda de frutas vermelhas",
    desc: "Panna cotta de baunilha com calda de frutas vermelhas. O encerramento perfeito pra uma noite memorável.",
  },
];

const massas = [
  "Penne à Carbonara",
  "Penne ao Molho de Queijo",
  "Espaguete ao Pesto",
  "Espaguete Alho e Óleo",
  "Nhoque à Bolonhesa",
  "Tortei ao Sugo",
];

function WhatsAppIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

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
    {
      "@type": "ListItem",
      position: 2,
      name: "Sequência Italiana",
      item: `${SITE_URL}/sequenciaitaliana`,
    },
  ],
};

const webPageLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Sequência Italiana — Gramado Plazza",
  description:
    "Conceito da sequência italiana do Gramado Plazza com as cinco etapas, o rodízio de seis massas artesanais e informações de reserva.",
  url: `${SITE_URL}/sequenciaitaliana`,
  isPartOf: {
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  },
  about: {
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
  },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${SITE_URL}/rodizio_massas.jpeg`,
  },
};

export default function SequenciaItalianaPage() {
  return (
    <main className={`gp-sequencia ${playfair.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />

      <section className="hero">
        <div className="hero-bg">
          <Image
            src="/rodizio_massas.jpeg"
            alt="Rodízio de massas do Gramado Plazza"
            fill
            sizes="100vw"
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="eyebrow">Gramado · Serra Gaúcha</div>
          <h1>
            A Sequência <em>Italiana</em>
          </h1>
          <p className="sub">
            Cinco etapas. Seis massas artesanais à vontade. Uma noite inteira
            no coração de Gramado.
          </p>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa"
          >
            <WhatsAppIcon />
            Reservar pelo WhatsApp
          </a>
        </div>
      </section>

      <section className="conceito">
        <div className="container">
          <div className="tag">O conceito</div>
          <h2>Tudo o que você precisa em uma noite só</h2>
          <p>
            A sequência italiana é uma experiência completa em cinco etapas,
            servida à mesa, sem pressa. Você começa leve, passa pelas carnes e
            chega ao ponto alto com o rodízio de massas artesanais. No final,
            uma sobremesa delicada pra fechar a noite.
          </p>
        </div>
      </section>

      <section className="etapas">
        <div className="etapas-header">
          <div className="tag">As etapas</div>
          <h2>Cinco tempos, um ritmo só</h2>
        </div>
        <div className="etapas-list">
          {etapas.map((etapa, i) => (
            <article
              key={etapa.num}
              className={`etapa${i % 2 === 1 ? " etapa-reverse" : ""}`}
            >
              <div className="etapa-img">
                <Image
                  src={etapa.image}
                  alt={etapa.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
                <span className="etapa-num">{etapa.num}</span>
              </div>
              <div className="etapa-content">
                <h3 className="etapa-title">{etapa.title}</h3>
                <p className="etapa-desc">{etapa.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="massas">
        <div className="container">
          <div className="tag">Rodízio</div>
          <h2>As seis massas</h2>
          <p className="quanto">Todas servidas à vontade</p>
          <ul className="massas-list">
            {massas.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="info">
        <div className="container">
          <div className="tag">Pra vir</div>
          <h2>Informações práticas</h2>
          <div className="info-grid">
            <div className="info-item">
              <div className="label">Horário</div>
              <div className="value">
                Segunda a Domingo
                <br />
                18h às 23h
              </div>
            </div>
            <div className="info-item">
              <div className="label">Endereço</div>
              <div className="value">
                {RESTAURANT.street}
                <br />
                {RESTAURANT.neighborhood}, {RESTAURANT.city}/{RESTAURANT.state}
              </div>
            </div>
            <div className="info-item">
              <div className="label">Reservas</div>
              <div className="value">
                Exclusivamente
                <br />
                pelo WhatsApp
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>
            Pronto pra viver essa <em>experiência</em>?
          </h2>
          <p>
            Chame a gente pelo WhatsApp agora e garanta sua mesa pra próxima
            noite em Gramado.
          </p>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa btn-wa-lg"
          >
            <WhatsAppIcon />
            Reservar pelo WhatsApp
          </a>
        </div>
      </section>

      <footer className="footer">
        <p>
          <Link href="/">Gramado Plazza</Link> © {new Date().getFullYear()} ·
          Restaurante italiano em Gramado
        </p>
      </footer>
    </main>
  );
}
