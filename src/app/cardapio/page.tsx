import type { Metadata } from "next";
import Image from "next/image";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import CardapioScrollFx from "@/components/cardapio-scroll-fx";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { fetchPlaceReviews } from "@/lib/google-places";
import LeadForm from "@/components/lead-form";
import GoogleWordmark from "@/components/google-wordmark";

export const revalidate = 86400;
import "./cardapio.css";

export const metadata: Metadata = {
  title: "Cardápio | Sequência Italiana com Rodízio de Massas em Gramado",
  description:
    "Veja o cardápio completo do Gramado Plazza: couvert artesanal, sopa de capeletti, carnes na chapa, rodízio de 6 massas artesanais, panna cotta e drinks autorais. Aberto todos os dias 18h às 23h.",
  alternates: { canonical: "/cardapio" },
  openGraph: {
    title: `Cardápio ${SITE_NAME} | Sequência Italiana com Rodízio de Massas`,
    description:
      "Cinco etapas: couvert, sopa de capeletti, carnes na chapa, rodízio de 6 massas artesanais à vontade e Panna Cotta. Drinks autorais inclusos.",
    url: `${SITE_URL}/cardapio`,
    type: "website",
    images: ["/rodizio_massas.jpeg"],
  },
};

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const menuLd = {
  "@context": "https://schema.org",
  "@type": "Menu",
  "@id": `${SITE_URL}/cardapio#menu`,
  name: `Cardápio ${SITE_NAME}`,
  description:
    "Sequência italiana em cinco etapas com rodízio de seis massas artesanais, carnes na chapa, couvert, sopa de capeletti e sobremesa.",
  inLanguage: "pt-BR",
  url: `${SITE_URL}/cardapio`,
  hasMenuSection: [
    {
      "@type": "MenuSection",
      name: "Etapa 1 — Couvert",
      hasMenuItem: [
        {
          "@type": "MenuItem",
          name: "Couvert Artesanal",
          description:
            "Pão caseiro, salame, queijo, cebolinha cristal, azeitona, pepino e ovo de codorna.",
        },
      ],
    },
    {
      "@type": "MenuSection",
      name: "Etapa 2 — Entrada Quente",
      hasMenuItem: [
        {
          "@type": "MenuItem",
          name: "Sopa de Capeletti",
          description:
            "Tradicional sopa de capeletti servida quente, no ponto exato.",
          suitableForDiet: "https://schema.org/LowFatDiet",
        },
      ],
    },
    {
      "@type": "MenuSection",
      name: "Etapa 3 — Carnes na Chapa",
      hasMenuItem: [
        {
          "@type": "MenuItem",
          name: "Entrecôt grelhado",
          description:
            "Entrecôt grelhado no ponto, acompanhado de polenta frita crocante e queijo grelhado.",
        },
        {
          "@type": "MenuItem",
          name: "Filé de frango grelhado",
          description:
            "Filé de frango grelhado no ponto, acompanhado de polenta frita crocante e queijo grelhado.",
        },
      ],
    },
    {
      "@type": "MenuSection",
      name: "Etapa 4 — Rodízio de Massas Artesanais",
      description:
        "Seis massas artesanais servidas à vontade, direto da cozinha para a mesa.",
      hasMenuItem: [
        {
          "@type": "MenuItem",
          name: "Penne à Carbonara",
          description:
            "Penne com molho cremoso de ovos, queijo pecorino e bacon.",
        },
        {
          "@type": "MenuItem",
          name: "Penne ao Molho de Queijo",
          description: "Penne com molho cremoso de queijos.",
        },
        {
          "@type": "MenuItem",
          name: "Espaguete ao Pesto",
          description: "Espaguete com molho pesto de manjericão.",
        },
        {
          "@type": "MenuItem",
          name: "Espaguete Alho e Óleo",
          description: "Espaguete com alho dourado, azeite e salsinha.",
        },
        {
          "@type": "MenuItem",
          name: "Nhoque à Bolonhesa",
          description: "Nhoque artesanal de batata ao molho bolonhesa.",
        },
        {
          "@type": "MenuItem",
          name: "Tortei ao Sugo",
          description:
            "Tortei artesanal de abóbora ao molho sugo de tomate.",
        },
      ],
    },
    {
      "@type": "MenuSection",
      name: "Etapa 5 — Sobremesa",
      hasMenuItem: [
        {
          "@type": "MenuItem",
          name: "Panna Cotta de baunilha",
          description:
            "Panna Cotta de baunilha com calda de frutas vermelhas.",
        },
      ],
    },
    {
      "@type": "MenuSection",
      name: "Bar — Drinks Autorais",
      description:
        "Carta com variedade de drinks autorais assinados pelo bar do Gramado Plazza.",
    },
  ],
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
    {
      "@type": "ListItem",
      position: 2,
      name: "Cardápio",
      item: `${SITE_URL}/cardapio`,
    },
  ],
};

const etapas = [
  {
    numero: "Etapa 01",
    titulo: "O Couvert",
    img: "/couvert.jpeg",
    alt: "Couvert artesanal com pão caseiro, salame, queijo, azeitona e ovo de codorna",
    descricao:
      "Seleção artesanal de pão caseiro, salame, queijo, cebolinha cristal, azeitona, pepino e ovo de codorna.",
  },
  {
    numero: "Etapa 02",
    titulo: "Sopa de Capeletti",
    img: "/sopa_capeletti.jpeg",
    alt: "Sopa de capeletti servida quente",
    descricao:
      "Servida quente, no ponto exato. Aquece o corpo e prepara o paladar para o que está por vir.",
  },
  {
    numero: "Etapa 03",
    titulo: "Carnes na Chapa",
    img: "/carnes_chapa.jpeg",
    alt: "Entrecôt e filé de frango na chapa com polenta frita e queijo grelhado",
    descricao:
      "Entrecôt e filé de frango grelhados no ponto, com polenta frita crocante e queijo grelhado.",
  },
  {
    numero: "Etapa 04",
    titulo: "Rodízio de Massas",
    img: "/rodizio_massas.jpeg",
    alt: "Rodízio de massas artesanais do Gramado Plazza",
    descricao:
      "Seis massas artesanais servidas à vontade, direto da cozinha para a sua mesa:",
    massas: [
      "Penne Carbonara",
      "Penne ao Queijo",
      "Espaguete Pesto",
      "Alho e Óleo",
      "Nhoque Bolonhesa",
      "Tortei Sugo",
    ],
  },
  {
    numero: "Etapa 05",
    titulo: "Sobremesa",
    img: "/panna_cota.jpeg",
    alt: "Panna Cotta de baunilha com calda de frutas vermelhas",
    descricao:
      "Panna Cotta de baunilha com calda de frutas vermelhas. O encerramento perfeito de uma noite memorável.",
  },
];

const marqueeItems = [
  "Couvert Artesanal",
  "Sopa de Capeletti",
  "Carnes na Chapa",
  "Rodízio de Massas",
  "Panna Cotta",
  "Drinks Autorais",
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
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.67-1.228A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.204 0-4.244-.7-5.912-1.892l-.42-.306-2.777.731.742-2.71-.336-.434A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

export default async function CardapioPage() {
  const reviews = await fetchPlaceReviews();
  return (
    <main className={`gp-cardapio ${dmSans.variable} ${dmSerif.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <CardapioScrollFx />

      <section className="hero">
        <div className="hero-bg">
          <video autoPlay muted loop playsInline src="/video_restaurante.mp4" />
        </div>
        <div className="hero-content">
          <h1>
            Cardápio de uma sequência italiana completa em{" "}
            <span className="highlight">Gramado</span>
          </h1>
          <div className="hero-sub">
            <p>
              Couvert, sopa de capeletti, carnes na chapa, rodízio de seis
              massas artesanais, sobremesa e drinks autorais. Tudo servido em
              uma noite só.
            </p>
            <a href="#formulario" className="btn-reserve">
              Reserve pelo WhatsApp
              <span className="arrow" />
            </a>
          </div>
        </div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={`${item}-${i}`}>
              {item}
              <span className="dot"> • </span>
            </span>
          ))}
        </div>
      </div>

      <section className="contexto">
        <div className="contexto-left">
          <div className="big-text">GP</div>
          <h2 className="reveal-left">
            Gramado merece um jantar italiano à altura
          </h2>
        </div>
        <div className="contexto-right">
          <p className="reveal-right">
            O cardápio do Gramado Plazza foi desenhado como uma jornada. Cinco
            etapas que se encadeiam do couvert à sobremesa, pensadas para
            revelar o melhor da cozinha italiana artesanal da Serra Gaúcha.
          </p>
          <p className="reveal-right delay-1">
            Massas feitas na casa, carnes no ponto exato, drinks autorais e um
            ambiente que transforma o jantar em uma experiência completa. É a
            noite que você vai lembrar da sua passagem por Gramado.
          </p>
        </div>
      </section>

      <section className="sequencia" id="sequencia">
        <div className="sequencia-header">
          <div className="tag reveal">A Sequência</div>
          <h2 className="reveal delay-1">
            Cinco etapas. Uma experiência inesquecível.
          </h2>
        </div>
        <div className="cards-scroll">
          {etapas.map((etapa) => (
            <article key={etapa.numero} className="etapa-card">
              <div className="etapa-card-img">
                <Image
                  src={etapa.img}
                  alt={etapa.alt}
                  fill
                  sizes="380px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="etapa-card-body">
                <div className="etapa-card-num">{etapa.numero}</div>
                <h3>{etapa.titulo}</h3>
                <p>{etapa.descricao}</p>
                {etapa.massas && (
                  <div className="massas-tags">
                    {etapa.massas.map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ambiente" id="ambiente">
        <div className="ambiente-grid">
          <div className="amb-img amb-img-wide reveal-scale delay-1">
            <Image
              src="/salao.jpeg"
              alt="Panorâmica do salão do Gramado Plazza"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="amb-img reveal-scale delay-2">
            <Image
              src="/mesa_posta.jpeg"
              alt="Mesa posta com taças e talheres"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="amb-img reveal-scale delay-3">
            <Image
              src="/fachada.jpeg"
              alt="Fachada do Gramado Plazza no Bairro Belvedere"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="amb-img reveal-scale delay-4">
            <Image
              src="/drink.jpeg"
              alt="Drink autoral do bar do Gramado Plazza"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="amb-img reveal-scale delay-5">
            <video
              autoPlay
              muted
              loop
              playsInline
              src="/video_pasos_servindo.mp4"
            />
          </div>
        </div>
        <div className="ambiente-text">
          <h2 className="reveal">Um cenário que você vai querer eternizar</h2>
          <p className="reveal delay-1">
            Iluminação intimista. Tons de vermelho e madeira. É o tipo de lugar
            onde o jantar vira experiência, a foto vira memória e a noite vira
            história.
          </p>
          <address className="endereco reveal delay-2">
            Rua João Petry, 166. Bairro Belvedere, Gramado
          </address>
        </div>
      </section>

      <section className="prova-social">
        <div className="section-header">
          <div className="tag reveal">Avaliações</div>
          <h2 className="reveal delay-1">Quem já viveu não esquece</h2>
          <div className="rating-badge reveal delay-2">
            <div className="rating-value">
              {reviews.rating.toFixed(1).replace(".", ",")}
            </div>
            <div className="rating-stars" aria-hidden="true">★★★★★</div>
            <div className="rating-source">
              {reviews.source === "Google" ? (
                <>
                  <GoogleWordmark size={36} />
                  <span className="rating-count">
                    {reviews.count} avaliações
                  </span>
                </>
              ) : (
                <span className="rating-count">
                  {reviews.count} avaliações no {reviews.source}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="reviews-row">
          {reviews.testimonials.map((t, i) => (
            <div key={t.name} className={`review reveal delay-${i + 1}`}>
              <div className="quote">&ldquo;</div>
              <p>{t.text}</p>
              <div className="author">
                <div className="author-avatar" />
                <div className="author-name">{t.name}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="reviews-footer">
          <a
            href={reviews.mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="reviews-cta reveal delay-4"
          >
            Ver todas as avaliações no Google
          </a>
        </div>
      </section>

      <section className="cta-final" id="reserva">
        <div className="cta-final-content">
          <h2 className="reveal">
            Sua mesa está <em>esperando</em>
          </h2>
          <p className="reveal delay-1">
            Não deixe o melhor jantar italiano de Gramado de fora do seu
            roteiro. Preencha e fale com a gente pelo WhatsApp.
          </p>
          <a href="#formulario" className="btn-cta-big reveal delay-2">
            <WhatsAppIcon />
            Reservar minha mesa
          </a>
        </div>
      </section>

      <section className="formulario-lead" id="formulario">
        <div className="section-header">
          <div className="tag reveal">Reserva</div>
          <h2 className="reveal delay-1">Garanta sua mesa no Gramado Plazza</h2>
          <p className="form-desc reveal delay-2">
            Deixe seu nome e WhatsApp. Vamos te redirecionar para o nosso chat
            pra confirmar data, horário e número de pessoas.
          </p>
        </div>
        <div className="reveal delay-3">
          <LeadForm variant="cardapio" />
        </div>
      </section>

      <footer className="footer">
        <p>Gramado Plazza © 2026</p>
        <div className="footer-social">
          <a
            href="https://www.instagram.com/gramadoplazza/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a href="#formulario">WhatsApp</a>
        </div>
      </footer>
    </main>
  );
}
