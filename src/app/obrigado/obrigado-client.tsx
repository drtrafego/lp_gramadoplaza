'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { WHATSAPP_NUMBER } from '@/lib/site'

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

const DEFAULT_MESSAGE =
  'Olá, acabei de preencher o formulário no site. Gostaria de fazer uma reserva.'
const REDIRECT_DELAY_MS = 3000
const WA_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

export default function ObrigadoClient() {
  const [seconds, setSeconds] = useState(3)
  const params = useSearchParams()
  const leadId = params.get('id') ?? undefined
  const firedRef = useRef(false)

  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true

    setTimeout(() => {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'generate_lead',
        currency: 'BRL',
        value: 0,
        lead_id: leadId,
      })
    }, 100)
  }, [leadId])

  useEffect(() => {
    const countdown = window.setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    const redirect = window.setTimeout(() => {
      window.location.href = WA_URL
    }, REDIRECT_DELAY_MS)

    return () => {
      window.clearInterval(countdown)
      window.clearTimeout(redirect)
    }
  }, [])

  return (
    <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center">
      <div
        className="mb-8 flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          background: 'linear-gradient(135deg, #C9A96E 0%, #E8D5A8 100%)',
          boxShadow: '0 10px 40px rgba(201,169,110,0.35)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1
        style={{ fontFamily: 'var(--font-playfair), serif' }}
        className="mb-4 text-4xl font-bold tracking-tight text-[#FFF8F0] md:text-5xl"
      >
        Obrigado!
      </h1>

      <p className="mb-2 text-lg text-[#FFF8F0]/85 md:text-xl">
        Estamos te conectando com o nosso WhatsApp.
      </p>
      <p className="mb-10 text-sm text-[#FFF8F0]/60">
        Redirecionando em <span className="font-semibold text-[#C9A96E]">{seconds}</span>{' '}
        {seconds === 1 ? 'segundo' : 'segundos'}…
      </p>

      <div className="h-[2px] w-full max-w-xs overflow-hidden rounded-full bg-[#FFF8F0]/10">
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #C9A96E, #E8D5A8)',
            animation: 'gp-progress 3s linear forwards',
          }}
        />
      </div>

      <p className="mt-10 text-xs text-[#FFF8F0]/45">
        Se não for redirecionado automaticamente,{' '}
        <a
          href={WA_URL}
          className="underline decoration-[#C9A96E]/60 underline-offset-4 transition hover:text-[#C9A96E]"
        >
          clique aqui
        </a>
        .
      </p>

      <style jsx>{`
        @keyframes gp-progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
