import nodemailer from 'nodemailer'

export interface LeadEmailPayload {
  leadId: number | string
  name: string
  email: string
  whatsapp: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  created_at?: string | Date
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT ?? 587),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

function buildHtml(lead: LeadEmailPayload): string {
  const whatsappClean = lead.whatsapp.replace(/\D/g, '')
  const whatsappLink = `https://wa.me/${whatsappClean}`
  const date = (lead.created_at ?? new Date()).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'short',
  })

  const utmRows = [
    ['Fonte (utm_source)', lead.utm_source],
    ['Mídia (utm_medium)', lead.utm_medium],
    ['Campanha', lead.utm_campaign],
    ['Termo', lead.utm_term],
    ['Conteúdo', lead.utm_content],
  ]
    .filter(([, v]) => v)
    .map(([label, value]) => `
      <tr>
        <td style="padding:8px 12px;color:#6b7280;font-size:13px;white-space:nowrap;">${label}</td>
        <td style="padding:8px 12px;color:#f2f2f2;font-size:13px;">${value}</td>
      </tr>`)
    .join('')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr>
          <td style="background:#111111;border-radius:16px 16px 0 0;padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.07);">
            <span style="font-size:1.2rem;font-weight:800;color:#f2f2f2;letter-spacing:-0.02em;">
              Gramado<span style="color:#B22234;"> Plazza</span>
            </span>
            <span style="float:right;font-size:11px;color:#6b7280;font-family:monospace;padding-top:4px;">
              // novo lead · #${lead.leadId}
            </span>
          </td>
        </tr>
        <tr>
          <td style="background:#111111;padding:24px 32px 0;">
            <div style="display:inline-block;background:rgba(178,34,52,0.08);border:1px solid rgba(178,34,52,0.2);border-radius:999px;padding:6px 14px;">
              <span style="font-size:11px;font-family:monospace;color:#B22234;letter-spacing:0.08em;text-transform:uppercase;">
                Lead recebido as ${date}
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#111111;padding:20px 32px 8px;">
            <h1 style="margin:0;font-size:24px;font-weight:800;color:#f2f2f2;line-height:1.2;">
              ${lead.name}
            </h1>
          </td>
        </tr>
        <tr>
          <td style="background:#111111;padding:8px 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:8px 12px;color:#6b7280;font-size:13px;">E-mail</td>
                <td style="padding:8px 12px;"><a href="mailto:${lead.email}" style="color:#B22234;font-size:13px;text-decoration:none;">${lead.email}</a></td>
              </tr>
              <tr style="border-top:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 12px;color:#6b7280;font-size:13px;">WhatsApp</td>
                <td style="padding:8px 12px;"><a href="${whatsappLink}" style="color:#B22234;font-size:13px;text-decoration:none;">${lead.whatsapp}</a></td>
              </tr>
            </table>
          </td>
        </tr>
        ${utmRows ? `
        <tr>
          <td style="background:#111111;padding:0 32px 24px;">
            <p style="margin:0 0 8px;font-size:11px;font-family:monospace;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">// rastreamento</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden;">
              ${utmRows}
            </table>
          </td>
        </tr>` : ''}
        <tr>
          <td style="background:#111111;padding:0 32px 32px;border-radius:0 0 16px 16px;">
            <a href="${whatsappLink}" style="display:block;text-align:center;background:#25D366;color:#fff;font-weight:800;font-size:15px;padding:14px 28px;border-radius:999px;text-decoration:none;">
              Responder no WhatsApp
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 0;text-align:center;">
            <p style="margin:0;font-size:11px;font-family:monospace;color:#374151;">
              Gramado Plazza · Notificacao automatica de lead
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendLeadEmail(payload: LeadEmailPayload): Promise<void> {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS
  const to = process.env.EMAIL_TO

  if (!user || !pass || !to) {
    console.warn('[Email] EMAIL_USER, EMAIL_PASS ou EMAIL_TO ausente — e-mail ignorado.')
    return
  }

  try {
    const transporter = createTransporter()
    const toList = to.split(',').map(e => e.trim()).filter(Boolean)

    await transporter.sendMail({
      from: `"Gramado Plazza Leads" <${user}>`,
      to: toList.join(', '),
      subject: `Novo Lead: ${payload.name}`,
      html: buildHtml(payload),
    })

    console.log('[Email] Notificacao enviada — leadId:', payload.leadId, '— para:', toList)
  } catch (err) {
    console.error('[Email] Falha inesperada (isolada):', err)
  }
}
