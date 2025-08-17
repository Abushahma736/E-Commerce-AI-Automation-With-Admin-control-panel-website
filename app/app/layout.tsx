import type { Metadata } from 'next'
import 'regenerator-runtime'
import './globals.css'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SessionProvider } from '@/components/providers/SessionProvider'

export const metadata: Metadata = {
  title: 'ESSE – Naturals & Nutrition',
  description: 'Fresh, pure CO₂ extracts and essential oils. ESSE Naturals & Nutrition.',
  openGraph: {
    title: 'ESSE – Naturals & Nutrition',
    description: 'Fresh, pure CO₂ extracts and essential oils.',
    url: 'https://example.com',
    type: 'website'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-brand-green text-white text-xs">
          <div className="container-base py-2 text-center">Free delivery on orders over ₹499 • New users get 10% off</div>
        </div>
        <SessionProvider>
          <Header />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </SessionProvider>
        <Toaster richColors position="top-right" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ESSE – Naturals & Nutrition',
              url: 'https://example.com'
            })
          }}
        />
      </body>
    </html>
  )
}


