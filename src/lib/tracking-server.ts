export interface CAPIPayload {
  leadId: number | string
  name: string
  email?: string
  whatsapp: string
  ip?: string
  userAgent?: string
  fbc?: string
  fbp?: string
  fbLoginId?: string
  eventSourceUrl?: string
  city?: string
  state?: string
  externalId?: string
  testEventCode?: string
}

export interface GA4Payload {
  leadId: number | string
  gaCookie?: string
  ip?: string
  userAgent?: string
  eventSourceUrl?: string
}

async function hashData(raw: string): Promise<string> {
  const { createHash } = await import('crypto')
  return createHash('sha256').update(raw.trim().toLowerCase()).digest('hex')
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

function lastName(fullName: string): string | undefined {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length > 1) return parts.slice(1).join(' ')
  return undefined
}

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

function normalizeState(state: string): string | undefined {
  const s = state.trim()
  if (/^[A-Za-z]{2}$/.test(s)) return s.toLowerCase()
  const map: Record<string, string> = {
    'acre': 'ac', 'alagoas': 'al', 'amapá': 'ap', 'amapa': 'ap',
    'amazonas': 'am', 'bahia': 'ba', 'ceará': 'ce', 'ceara': 'ce',
    'distrito federal': 'df', 'espírito santo': 'es', 'espirito santo': 'es',
    'goiás': 'go', 'goias': 'go', 'maranhão': 'ma', 'maranhao': 'ma',
    'mato grosso do sul': 'ms', 'mato grosso': 'mt',
    'minas gerais': 'mg', 'pará': 'pa', 'para': 'pa',
    'paraíba': 'pb', 'paraiba': 'pb', 'paraná': 'pr', 'parana': 'pr',
    'pernambuco': 'pe', 'piauí': 'pi', 'piaui': 'pi',
    'rio de janeiro': 'rj', 'rio grande do norte': 'rn',
    'rio grande do sul': 'rs', 'rondônia': 'ro', 'rondonia': 'ro',
    'roraima': 'rr', 'santa catarina': 'sc', 'são paulo': 'sp', 'sao paulo': 'sp',
    'sergipe': 'se', 'tocantins': 'to',
  }
  return map[s.toLowerCase()]
}

function extractGaClientId(gaCookie: string): string {
  const parts = gaCookie.split('.')
  if (parts.length >= 4) return `${parts[2]}.${parts[3]}`
  return gaCookie
}

export async function sendMetaCAPI(payload: CAPIPayload): Promise<void> {
  const pixelId = process.env.FB_PIXEL_ID || process.env.NEXT_PUBLIC_FB_PIXEL_ID
  const accessToken = process.env.FB_ACCESS_TOKEN

  if (!pixelId || !accessToken) {
    console.warn('[CAPI] FB_PIXEL_ID ou FB_ACCESS_TOKEN ausente — evento ignorado.')
    return
  }

  try {
    const { leadId, name, email, whatsapp, ip, userAgent, fbc, fbp, eventSourceUrl } = payload

    const [hashedEmail, hashedPhone, hashedFirstName, hashedLastName, hashedCity, hashedState, hashedCountry] =
      await Promise.all([
        email ? hashData(email) : Promise.resolve(undefined),
        hashData(cleanPhone(whatsapp)),
        hashData(firstName(name)),
        lastName(name) ? hashData(lastName(name)!) : Promise.resolve(undefined),
        payload.city ? hashData(payload.city) : Promise.resolve(undefined),
        payload.state ? (normalizeState(payload.state) ? hashData(normalizeState(payload.state)!) : Promise.resolve(undefined)) : Promise.resolve(undefined),
        hashData('br'),
      ])

    const externalId = payload.externalId || String(leadId)

    const body = {
      data: [
        {
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          event_id: String(leadId),
          action_source: 'website',
          event_source_url: eventSourceUrl ?? undefined,
          user_data: {
            ...(hashedEmail && { em: [hashedEmail] }),
            ph: [hashedPhone],
            fn: [hashedFirstName],
            ...(hashedLastName && { ln: [hashedLastName] }),
            ...(hashedCity && { ct: [hashedCity] }),
            ...(hashedState && { st: [hashedState] }),
            country: [hashedCountry],
            ...(ip && { client_ip_address: ip }),
            ...(userAgent && { client_user_agent: userAgent }),
            ...(fbc && { fbc }),
            ...(fbp && { fbp }),
            ...(payload.fbLoginId && { fb_login_id: payload.fbLoginId }),
            external_id: externalId,
          },
          custom_data: {
            content_name: 'Lead Gramado Plazza',
            value: 0,
            currency: 'BRL',
          },
        },
      ],
      ...(payload.testEventCode && { test_event_code: payload.testEventCode }),
    }

    const url = `https://graph.facebook.com/v25.0/${pixelId}/events?access_token=${accessToken}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[CAPI] Erro na resposta da Meta:', response.status, error)
      return
    }

    const result = await response.json()
    console.log('[CAPI] Evento enviado com sucesso:', {
      leadId,
      eventsReceived: result.events_received,
      fbtrace: result.fbtrace_id,
    })
  } catch (err) {
    console.error('[CAPI] Falha inesperada (isolada):', err)
  }
}

export async function sendGA4Event(
  clientId: string,
  eventName: string,
  params: Record<string, unknown> = {}
): Promise<void> {
  const measurementId = process.env.GA_MEASUREMENT_ID
  const apiSecret = process.env.GA_API_SECRET

  if (!measurementId || !apiSecret) {
    console.warn(`[GA4] Measurement ID ou API Secret ausente — evento '${eventName}' ignorado.`)
    return
  }

  try {
    const body = {
      client_id: clientId,
      events: [
        {
          name: eventName,
          params: {
            engagement_time_msec: 1,
            ...params,
          },
        },
      ],
    }

    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (response.status !== 204 && !response.ok) {
      console.error(`[GA4] Erro na resposta GA4 (${eventName}):`, response.status)
      return
    }

    console.log(`[GA4] Evento '${eventName}' enviado com sucesso. ClientId: ${clientId}`)
  } catch (err) {
    console.error(`[GA4] Falha inesperada ao enviar '${eventName}':`, err)
  }
}

export async function sendGA4Lead(payload: GA4Payload): Promise<void> {
  const { leadId, gaCookie } = payload
  const clientId = gaCookie ? extractGaClientId(gaCookie) : `lead_${String(leadId)}`

  return sendGA4Event(clientId, 'generate_lead', {
    currency: 'BRL',
    value: 0,
    lead_source: 'landing_page',
    form_name: 'Lead Gramado Plazza',
  })
}
