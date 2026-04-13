import { NextRequest, NextResponse } from 'next/server'
import { sendMetaCAPILeadClick, sendGA4Event } from '@/lib/tracking-server'

function extractGaClientId(gaCookie: string): string {
  const parts = gaCookie.split('.')
  if (parts.length >= 4) return `${parts[2]}.${parts[3]}`
  return gaCookie
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_content?: string
    utm_term?: string
    testEventCode?: string
  }

  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const leadId = `wa_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

  const xForwardedFor = req.headers.get('x-forwarded-for')
  const ip = xForwardedFor
    ? xForwardedFor.split(',')[0].trim()
    : (req.headers.get('x-real-ip') ?? undefined)
  const userAgent = req.headers.get('user-agent') ?? undefined

  const cookieHeader = req.headers.get('cookie') ?? ''
  const parseCookie = (name: string): string | undefined => {
    const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : undefined
  }

  const fbc = parseCookie('_fbc')
  const fbp = parseCookie('_fbp')
  const gaCookie = parseCookie('_ga')
  const eventSourceUrl =
    req.headers.get('referer') ?? req.headers.get('origin') ?? undefined

  const clientId = gaCookie ? extractGaClientId(gaCookie) : leadId

  await Promise.allSettled([
    sendMetaCAPILeadClick({
      leadId,
      ip,
      userAgent,
      fbc,
      fbp,
      eventSourceUrl,
      testEventCode: body.testEventCode,
    }),
    sendGA4Event(clientId, 'generate_lead', {
      currency: 'BRL',
      value: 0,
      lead_source: 'whatsapp_click',
      form_name: 'Lead WhatsApp Gramado Plazza',
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      utm_content: body.utm_content,
      utm_term: body.utm_term,
    }),
  ])

  return NextResponse.json({ success: true, leadId }, { status: 200 })
}
