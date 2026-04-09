export default function Home() {
  const modelos = [
    {
      id: 1,
      nome: "Cinematográfico",
      descricao:
        "Tema escuro total, vídeo fullscreen no hero, tipografia serifada elegante. Tons de vinho e dourado. Sensação de luxo e cinema.",
      cor: "#C9A96E",
      corBg: "rgba(201,169,110,0.08)",
      corBorder: "rgba(201,169,110,0.2)",
      href: "/modelo-1-cinematografico.html",
      tags: ["Vídeo Hero", "Parallax", "Tema Escuro", "Scroll Reveal"],
    },
    {
      id: 2,
      nome: "Galeria Imersiva",
      descricao:
        "Fundo claro e acolhedor, split layout no hero, timeline central para as etapas, galeria masonry. Aconchego sofisticado.",
      cor: "#8B2635",
      corBg: "rgba(139,38,53,0.08)",
      corBorder: "rgba(139,38,53,0.2)",
      href: "/modelo-2-galeria-imersiva.html",
      tags: ["Fundo Claro", "Timeline", "Masonry", "Cards Scroll"],
    },
    {
      id: 3,
      nome: "Scroll Storytelling",
      descricao:
        "Tema escuro, tipografia bold gigante, marquee animado com o menu, cards horizontais. Moderno e impactante.",
      cor: "#B22234",
      corBg: "rgba(178,34,52,0.08)",
      corBorder: "rgba(178,34,52,0.2)",
      href: "/modelo-3-scroll-storytelling.html",
      tags: ["Marquee", "Bold Type", "Drag Scroll", "Parallax"],
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <p className="text-xs tracking-[4px] uppercase text-red-500 mb-4">
          Seleção de Modelos
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Gramado{" "}
          <span className="text-red-500 font-normal italic">Plazza</span>
        </h1>
        <p className="text-zinc-500 text-base leading-relaxed max-w-xl">
          3 propostas visuais para o site do restaurante. Clique em cada modelo
          para visualizar com animações e interações. Escolha 2 favoritos.
        </p>
      </div>

      {/* Modelos */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="flex flex-col gap-6">
          {modelos.map((m) => (
            <a
              key={m.id}
              href={m.href}
              className="group block rounded-xl border transition-all duration-500 hover:-translate-y-1"
              style={{
                background: m.corBg,
                borderColor: m.corBorder,
              }}
            >
              <div className="p-8 md:p-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span
                      className="text-xs font-semibold tracking-[3px] uppercase"
                      style={{ color: m.cor }}
                    >
                      Modelo {m.id}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold mt-1 text-white group-hover:text-zinc-200 transition-colors">
                      {m.nome}
                    </h2>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full border flex items-center justify-center opacity-40 group-hover:opacity-100 transition-all group-hover:translate-x-1"
                    style={{ borderColor: m.cor, color: m.cor }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-lg">
                  {m.descricao}
                </p>
                <div className="flex flex-wrap gap-2">
                  {m.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium tracking-[1px] uppercase px-3 py-1 rounded-full border"
                      style={{
                        borderColor: m.corBorder,
                        color: m.cor,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Guia */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <a
          href="/guia-imagens-cliente.html"
          className="block rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-700 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs tracking-[3px] uppercase text-zinc-500">
                Para o cliente
              </span>
              <h3 className="text-lg font-semibold mt-1">
                Guia de Imagens e Vídeos
              </h3>
              <p className="text-zinc-500 text-sm mt-1">
                Lista completa do material necessário para montar o site
              </p>
            </div>
            <div className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </div>
          </div>
        </a>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center">
        <p className="text-[11px] text-zinc-600 tracking-wider">
          Gramado Plazza &copy; 2026 &middot; Desenvolvido por DR.TRAFEGO
        </p>
      </footer>
    </main>
  );
}
