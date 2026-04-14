# LP Gramado Plazza

Landing page do restaurante **Gramado Plazza** (italiano em Gramado/RS, Bairro Belvedere). Next.js 16 App Router + TypeScript + Drizzle ORM + Neon Postgres + Vercel.

URL em produção: https://gramadoplazza.com.br

---

## Stack

- **Framework:** Next.js 16.2.3 (App Router, Turbopack)
- **Runtime:** React 19
- **Tipagem:** TypeScript strict
- **Estilo:** CSS com namespace por página (`.gp-home`, `.gp-cardapio`, `.gp-sequencia`) + Tailwind v4 para componentes novos
- **Fontes:** Inter (corpo) + Playfair Display (títulos)
- **Banco:** Neon Postgres via Drizzle ORM (tabela `leads`)
- **Package manager:** pnpm
- **Deploy:** Vercel
- **ISR:** `revalidate = 86400` na home e cardápio (reviews do Google cacheadas 24h)

---

## Rotas

| Rota | Tipo | Propósito |
|---|---|---|
| `/` | Static + ISR 24h | Home: hero, etapas, ambiente, avaliações, formulário de reserva |
| `/cardapio` | Static + ISR 24h | Cardápio completo, mesmo flow de formulário |
| `/sequenciaitaliana` | Static | Página single-pager otimizada para compartilhar no WhatsApp — apresentação da sequência italiana com CTA direto para `wa.me` |
| `/obrigado` | Static | Tela de agradecimento após submit do formulário: countdown 3s + redirect para `wa.me` |
| `/api/contact` | Dynamic | Endpoint que recebe o formulário, salva no Neon, dispara Meta CAPI + GA4 |
| `/api/tracking/ga4` | Dynamic | Endpoint genérico para disparar eventos GA4 server-side |
| `/sitemap.xml` | Static | Sitemap com 3 URLs (home, cardápio, sequência italiana) |
| `/robots.txt` | Static | Bloqueia `/api/` e `/obrigado` |

Redirects 301 configurados em `next.config.ts` para os URLs antigos dos modelos (`/modelo-1-cinematografico`, etc).

---

## Dinâmica de captura de lead

1. Usuário clica em **qualquer botão** "Reservar" ou "WhatsApp" na home ou cardápio
2. Faz scroll suave até a âncora `#formulario` no final da página
3. Preenche **nome + WhatsApp** (máscara automática `(DDD) 00000-0000`, apenas 2 campos, sem email)
4. Submit chama `POST /api/contact` com:
   - Nome, WhatsApp
   - UTMs lidas do localStorage (salvas em visitas anteriores via URL)
   - Cookies `_fbc`, `_fbp`, `_ga` para match quality da Meta/GA4
5. `/api/contact` faz em paralelo:
   - **INSERT** na tabela `leads` do Neon (Drizzle)
   - **Meta CAPI** evento `Lead` com PII hasheada (SHA-256 em nome+telefone+país), mais `fbc`/`fbp`/IP/UA
   - **GA4 Measurement Protocol** evento `generate_lead`
6. Resposta JSON → `router.push('/obrigado')`
7. `/obrigado` mostra tela elegante (gradiente wine, ícone dourado, barra de progresso 3s)
8. Após 3s: `window.location.href = wa.me/5554999376608?text=...`

**Nenhum evento é disparado em `/obrigado`** — evita double counting. Toda conversão vem de `/api/contact`.

Notificação por email foi removida do fluxo a pedido do cliente (arquivo `email-server.ts` deletado).

---

## SEO / GEO

### Metadata
- `title` + `description` + `keywords` em `layout.tsx` e override por página
- OpenGraph + Twitter Cards em todas as páginas indexáveis
- `alternates.canonical` em cada rota
- `robots: noindex` em `/obrigado`

### Structured Data (JSON-LD)
Em `src/app/page.tsx`:
- `Restaurant` / `LocalBusiness` com:
  - Endereço completo (`PostalAddress`)
  - **`geo.GeoCoordinates`** lat/lon `-29.3805933, -50.8715195` (geocodificado via Nominatim)
  - `openingHoursSpecification` (seg-dom 18h-23h)
  - **`areaServed`**: Gramado, Canela, Serra Gaúcha, RS
  - `hasMenu` linkando `/cardapio`
  - `potentialAction: ReserveAction` apontando pro WhatsApp
  - **`sameAs`**: Instagram, Facebook, TripAdvisor
- `BreadcrumbList`
- `FAQPage` com 5 perguntas (horário, conceito, massas, reservas, endereço)

Em `src/app/cardapio/page.tsx`:
- `Menu` schema com todas as seções e pratos
- `BreadcrumbList`

Em `src/app/sequenciaitaliana/page.tsx`:
- `BreadcrumbList`
- `WebPage` linkado ao Restaurant principal via `@id`

### Performance
- Imagens servidas em **AVIF + WebP** automaticamente (`next.config.ts > images.formats`)
- Primeira etapa (couvert) com `priority` + `eager` para otimizar LCP
- Fonts com `display: swap`
- Cache de reviews do Google por 24h (ISR) — zero impacto em TTFB

### sitemap.xml gerado em `src/app/sitemap.ts`
- `/` priority 1.0
- `/cardapio` priority 0.9
- `/sequenciaitaliana` priority 0.8

### `public/llms.txt`
Arquivo estático descrevendo o restaurante para LLMs e agentes AI que respeitam o formato.

---

## Prova social dinâmica (Google Places API)

A home e o cardápio chamam `fetchPlaceReviews()` de `src/lib/google-places.ts` em build/ISR.

Fluxo:
1. `GET https://places.googleapis.com/v1/places/ChIJ7ZeNoeEzGZUR0Oo0GIdOH40` com `X-Goog-Api-Key` e `X-Goog-FieldMask`
2. Retorna `rating`, `userRatingCount`, `googleMapsUri`, e até 5 reviews
3. Filtra reviews com `rating >= 4`
4. Trunca texto em 260 caracteres preservando palavras
5. Renderiza badge `4,5 ★★★★★ 424 AVALIAÇÕES NO GOOGLE` + 3 depoimentos com nome real

**Fallback gracioso:** se `GOOGLE_PLACES_API_KEY` não existir ou a API falhar, cai em reviews fixos do TripAdvisor em `site.ts` (constantes `TESTIMONIALS` e `RATING`). O site nunca quebra.

**Atenção:** o Google proíbe `AggregateRating` de LocalBusiness no schema (self-serving rule). Por isso o rating aparece apenas como prova social visível, **nunca em JSON-LD**.

**Limite conhecido:** Places API retorna no máximo 5 reviews por chamada, ordenadas por "most relevant" (escolha do Google). Em dias ruins pode vir menos de 3 reviews 4+★. Uma evolução planejada é um **pool rotativo de 30 dias** em Postgres (respeitando o TOS §10.5.c que proíbe cache > 30d) — não implementado ainda.

---

## Integração com CRM / Meta / Google

### Neon Postgres
- Tabela `leads` (id, name, email?, whatsapp, organization_id, status, position, utm_*, created_at)
- `email` é nullable no banco e opcional no fluxo
- `organization_id` vem da env `ORGANIZATION_ID`

### Meta CAPI
- `src/lib/tracking-server.ts > sendMetaCAPI`
- Endpoint: `https://graph.facebook.com/v25.0/{pixelId}/events`
- Evento: `Lead`
- PII hasheada em SHA-256: email (se houver), phone, first_name, last_name
- Campos adicionais: `client_ip_address`, `client_user_agent`, `fbc`, `fbp`, `external_id`
- `test_event_code` opcional para QA

### GA4 Measurement Protocol
- `src/lib/tracking-server.ts > sendGA4Event` e `sendGA4Lead`
- Endpoint: `https://www.google-analytics.com/mp/collect`
- `client_id` extraído do cookie `_ga`, fallback `lead_<leadId>`
- Evento: `generate_lead` com `currency: BRL`, `value: 0`, `form_name`, `lead_source`

---

## Variáveis de ambiente

Todas essas estão no `.env.local` (dev) e no Vercel (Production/Preview/Development):

```bash
# Banco
DATABASE_URL=<neon postgres url>
ORGANIZATION_ID=<uuid do organization no CRM>

# Meta Conversions API
NEXT_PUBLIC_FB_PIXEL_ID=<pixel id>
FB_ACCESS_TOKEN=<capi access token>

# Google Analytics 4
GA_MEASUREMENT_ID=G-<id>
GA_API_SECRET=<mp api secret>

# Google Places API (prova social dinâmica)
GOOGLE_PLACES_API_KEY=<places api new key>
```

**O número do WhatsApp está hardcoded em `src/lib/site.ts`** (`WHATSAPP_NUMBER = "5554999376608"`) — NÃO depende mais de env var. Foi confirmado via chamada direta à Google Places API `internationalPhoneNumber: +55 54 99937-6608`.

---

## Convenções

- **Fontes únicas de verdade:** `src/lib/site.ts` para nome, WhatsApp, endereço, constantes de reviews, links sociais
- **CSS scoped:** cada página (home, cardápio, sequência) tem seu próprio CSS com prefixo de namespace para evitar conflitos
- **Nunca usar emoji em código ou texto** (regra do projeto)
- **Nunca usar travessões ou meia-risca** nos textos gerados (regra da agência)
- **Sempre português brasileiro**
- **Imagens em `public/`** com nomes snake_case minúsculos (`rodizio_massas.jpeg`, `carnes_chapa.jpeg`, etc)

---

## Arquivos importantes

```
src/
├── app/
│   ├── layout.tsx              # Root layout + GTM raw script no <head>
│   ├── page.tsx                # Home (async, ISR 24h, fetchPlaceReviews)
│   ├── home.css                # CSS scoped .gp-home
│   ├── cardapio/
│   │   ├── page.tsx            # Cardápio completo (async, ISR 24h)
│   │   └── cardapio.css
│   ├── sequenciaitaliana/
│   │   ├── page.tsx            # Single-page para compartilhar no WhatsApp
│   │   └── sequencia.css
│   ├── obrigado/
│   │   ├── page.tsx            # Server wrapper + metadata noindex
│   │   └── obrigado-client.tsx # Countdown + redirect
│   ├── api/
│   │   ├── contact/route.ts    # Endpoint do formulário
│   │   └── tracking/ga4/route.ts
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── lead-form.tsx           # Formulário nome + WhatsApp
│   └── home-scroll-fx.tsx
├── lib/
│   ├── site.ts                 # Constantes do restaurante, WhatsApp, testimonials, rating
│   ├── schema.ts               # Drizzle schema (tabela leads)
│   ├── db.ts                   # Drizzle client
│   ├── google-places.ts        # Fetcher da Places API com fallback
│   └── tracking-server.ts      # Meta CAPI + GA4 MP
public/
├── *.jpeg / *.mp4              # Fotos e vídeos do restaurante
└── llms.txt
```

---

## Scripts

```bash
pnpm dev     # dev server com turbopack
pnpm build   # build de produção
pnpm start   # serve o build local
```

---

## Histórico de decisões importantes

| Data | Commit | Decisão |
|---|---|---|
| 2026-04-10 | 54c4fb9 | Primeiro release com 3 modelos visuais e backend completo |
| 2026-04-10 | 098aa47 | SEO/GEO fase 1: portar modelos para React, sitemap, schema, imagens otimizadas |
| 2026-04-10 | c0595ac | Redirects 301 dos URLs antigos dos modelos |
| 2026-04-13 | c1f0103 | GTM injetado inline no `<head>` via `dangerouslySetInnerHTML` (afterInteractive do `next/script` não aparecia no SSR) |
| 2026-04-13 | e0b751a | Primeira versão da `/obrigado` com disparo de Lead por `/api/tracking/lead` |
| 2026-04-14 | 760b1a1 | SEO/GEO fase 2: geo coordinates, areaServed, LCP priority, AVIF |
| 2026-04-14 | 0370587 | `sameAs` no Restaurant schema com Facebook e TripAdvisor |
| 2026-04-14 | 5e8e0a8 | Prova social dinâmica via Google Places API com ISR 24h |
| 2026-04-14 | 0fa6e24 | Redução de ~30% nos espaços verticais de / e /cardapio |
| 2026-04-14 | edf5757 | Número do WhatsApp confirmado via Google Places API: `+55 54 99937-6608` |
| 2026-04-14 | b91842c | Mudança de dinâmica: formulário (nome + WhatsApp) antes do `/obrigado`. `whatsapp-tracker.tsx` e `/api/tracking/lead` deletados como código morto |
| 2026-04-14 | ca174a8 | Remoção da notificação por email (`email-server.ts` deletado) |
| 2026-04-14 | 193ea79 | Nova página `/sequenciaitaliana` para compartilhar no WhatsApp |
| 2026-04-14 | 84b2cbd | Foto da panna cotta atualizada (mesmo path) |
| 2026-04-14 | 9eff8cd | Removido tile de salada da galeria (prato fora do cardápio) |

---

## Próximos passos planejados (não implementados)

- **Pool rotativo de reviews em Postgres** respeitando TOS de 30 dias do Google Places API, para proteger contra dias em que a API retorna só reviews negativas
- **Cron diário Vercel** para alimentar o pool (`/api/cron/google-reviews`)
- **Briefing de SEO local off-page** para o squad `/social` e `/analista` (GBP ativo, coleta de reviews reais, citations)
