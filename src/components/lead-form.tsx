'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const

type UtmKey = (typeof UTM_KEYS)[number]
type UtmSet = Partial<Record<UtmKey, string>>

function readUtms(): UtmSet {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const fresh: UtmSet = {}
  for (const key of UTM_KEYS) {
    const v = params.get(key)
    if (v) fresh[key] = v
  }
  if (Object.keys(fresh).length > 0) {
    try {
      localStorage.setItem('_utm_params', JSON.stringify(fresh))
    } catch {}
    return fresh
  }
  try {
    const raw = localStorage.getItem('_utm_params')
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, string | null>
      const restored: UtmSet = {}
      for (const key of UTM_KEYS) {
        if (parsed[key]) restored[key] = parsed[key] as string
      }
      return restored
    }
  } catch {}
  return {}
}

function formatWhatsapp(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export default function LeadForm({ variant = 'home' }: { variant?: 'home' | 'cardapio' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const accent = variant === 'cardapio' ? '#C9A96E' : '#C9A96E'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return

    const cleanWhatsapp = whatsapp.replace(/\D/g, '')
    if (name.trim().length < 2) {
      setError('Digite seu nome completo.')
      return
    }
    if (cleanWhatsapp.length < 10) {
      setError('Digite um WhatsApp válido com DDD.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const utms = readUtms()
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          whatsapp: cleanWhatsapp,
          ...utms,
        }),
      })

      if (!res.ok) {
        throw new Error('http_' + res.status)
      }

      const data = (await res.json()) as { success: boolean; leadId?: string | number }
      const eventID = data.leadId ? String(data.leadId) : `fallback_${Date.now()}`

      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq(
          'track',
          'Lead',
          {
            content_name: 'Lead Gramado Plazza',
            value: 0,
            currency: 'BRL',
          },
          { eventID },
        )
      }

      router.push('/obrigado')
    } catch (err) {
      console.error('[lead-form] falha:', err)
      setError('Algo deu errado. Tente de novo em alguns segundos.')
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-xl flex-col gap-4"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="lead-name"
          className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60"
        >
          Seu nome
        </label>
        <input
          id="lead-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Como podemos te chamar?"
          required
          autoComplete="name"
          className="w-full rounded-none border border-white/15 bg-white/[0.03] px-5 py-4 text-base text-white placeholder:text-white/35 transition-colors focus:border-[#C9A96E] focus:outline-none"
          disabled={submitting}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="lead-whatsapp"
          className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60"
        >
          WhatsApp
        </label>
        <input
          id="lead-whatsapp"
          type="tel"
          inputMode="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))}
          placeholder="(DDD) 00000-0000"
          required
          autoComplete="tel"
          className="w-full rounded-none border border-white/15 bg-white/[0.03] px-5 py-4 text-base text-white placeholder:text-white/35 transition-colors focus:border-[#C9A96E] focus:outline-none"
          disabled={submitting}
        />
      </div>

      {error && (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 inline-flex items-center justify-center gap-3 border border-[#C9A96E] bg-[#C9A96E] px-10 py-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#1A1A1A] transition-all duration-300 hover:bg-transparent hover:text-[#C9A96E] disabled:cursor-not-allowed disabled:opacity-60"
        style={{ borderColor: accent }}
      >
        {submitting ? 'Enviando...' : 'Quero reservar minha mesa'}
      </button>

      <p className="mt-2 text-center text-[11px] text-white/40">
        Ao enviar você será redirecionado para o nosso WhatsApp.
      </p>
    </form>
  )
}
