'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const NUMERO = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5554999999999'
const UTM_KEY = '_utm_params'

interface UtmParams {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
}

function getUtms(): UtmParams {
  const params = new URLSearchParams(window.location.search)
  const fromUrl: UtmParams = {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    utm_term: params.get('utm_term'),
  }

  const hasUtms = Object.values(fromUrl).some(v => v !== null)
  if (hasUtms) {
    localStorage.setItem(UTM_KEY, JSON.stringify(fromUrl))
    return fromUrl
  }

  const stored = localStorage.getItem(UTM_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as UtmParams
    } catch {
      // localStorage corrompido, ignora
    }
  }

  return { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null }
}

function sanitize(val: string): string {
  return val.replace(/[\[\]|]/g, '').trim()
}

function updateLinks() {
  const utms = getUtms()
  const s  = sanitize(utms.utm_source   ?? 'direto')
  const c  = sanitize(utms.utm_campaign ?? 'none')
  const m  = sanitize(utms.utm_medium   ?? 'none')
  const ct = sanitize(utms.utm_content  ?? 'none')
  const t  = sanitize(utms.utm_term     ?? 'none')

  const msg = `Olá, tudo bem. Gostaria de fazer uma reserva. [src=${s}|cmp=${c}|med=${m}|ctt=${ct}|trm=${t}]`
  const link = `https://wa.me/${NUMERO}?text=${encodeURIComponent(msg)}`

  document.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me"], a[href*="api.whatsapp.com"]').forEach(el => {
    el.href = link
  })
}

export function WhatsappTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const id = setTimeout(updateLinks, 0)
    return () => clearTimeout(id)
  }, [pathname])

  return null
}
