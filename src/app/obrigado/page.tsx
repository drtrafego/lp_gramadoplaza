import type { Metadata } from "next"
import { Suspense } from "react"
import { Playfair_Display } from "next/font/google"
import ObrigadoClient from "./obrigado-client"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Obrigado — redirecionando para WhatsApp",
  description: "Estamos te conectando com o WhatsApp do Gramado Plazza.",
  robots: { index: false, follow: false },
}

export default function ObrigadoPage() {
  return (
    <main
      className={`${playfair.variable} relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16`}
      style={{
        background:
          "radial-gradient(ellipse at top, #2a1013 0%, #0A0A0A 60%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(201,169,110,0.08) 0%, transparent 55%)",
        }}
      />
      <Suspense fallback={null}>
        <ObrigadoClient />
      </Suspense>
    </main>
  )
}
