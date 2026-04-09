import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/lib/db'
import { leads } from '@/lib/schema'
import { sendMetaCAPI, sendGA4Lead } from '@/lib/tracking-server'
import { sendLeadEmail } from '@/lib/email-server'

const ContactSchema = z.object({
  name: z.string().min(2, 'Nome muito curto').max(120),
  email: z.string().email('E-mail invalido'),
  whatsapp: z.string().min(10, 'Telefone invalido').max(20),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  external_id: z.string().optional(),
  testEventCode: z.string().optional(),
})

type ContactInput = z.infer<typeof ContactSchema>

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms),
    ),
  ])
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let input: ContactInput
  try {
    const raw = await req.json()
    input = ContactSchema.parse(raw)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: err.flatten().fieldErrors },
        { status: 422 },
      )
    }
    return NextResponse.json(
      { success: false, message: 'Payload invalido' },
      { status: 400 },
    )
  }

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
  const fbLoginId = parseCookie('fb_login_id')
  const gaCookie = parseCookie('_ga')
  const eventSourceUrl =
    req.headers.get('referer') ?? req.headers.get('origin') ?? undefined

  let leadId: number | string
  const savedAt = new Date()

  try {
    const [row] = await withTimeout(
      getDb().insert(leads).values({
        name: input.name,
        email: input.email,
        whatsapp: input.whatsapp,
        utm_source: input.utm_source,
        utm_medium: input.utm_medium,
        utm_campaign: input.utm_campaign,
        utm_term: input.utm_term,
        utm_content: input.utm_content,
        organization_id: process.env.ORGANIZATION_ID!,
        status: 'novo',
        position: 0,
      }).returning({ id: leads.id }),
      5_000,
    )
    leadId = row.id
    console.log('[contact] Lead salvo no banco:', leadId)
  } catch (dbErr) {
    leadId = `backup_timeout_${Date.now()}`
    console.error('[contact] Banco indisponivel — usando ID de fallback:', leadId, dbErr)
  }

  await Promise.allSettled([
    sendMetaCAPI({
      leadId,
      name: input.name,
      email: input.email,
      whatsapp: input.whatsapp,
      ip,
      fbc,
      fbp,
      fbLoginId,
      state: input.state,
      city: input.city,
      externalId: input.external_id,
      userAgent,
      eventSourceUrl,
      testEventCode: input.testEventCode,
    }),
    sendGA4Lead({
      leadId,
      gaCookie,
      ip,
      userAgent,
      eventSourceUrl,
    }),
    sendLeadEmail({
      leadId,
      name: input.name,
      email: input.email,
      whatsapp: input.whatsapp,
      utm_source: input.utm_source,
      utm_medium: input.utm_medium,
      utm_campaign: input.utm_campaign,
      utm_term: input.utm_term,
      utm_content: input.utm_content,
      created_at: savedAt.toISOString(),
    })
  ])

  return NextResponse.json({ success: true, leadId }, { status: 200 })
}
