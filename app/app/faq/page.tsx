"use client"
import { useState } from 'react'
import { Container } from '@/components/ui/Container'

export const dynamic = 'force-dynamic'

const faqs = [
  { q: 'What are CO₂ extracts?', a: 'High-purity extracts made using supercritical CO₂.' },
  { q: 'Are your products organic?', a: 'Yes, we emphasize certified organic sources.' },
  { q: 'Do you ship worldwide?', a: 'We support global logistics partners.' },
  { q: 'Can I request custom formulations?', a: 'Custom needs are supported—contact us.' },
  { q: 'What is your return policy?', a: '30-day satisfaction policy on consumer products.' },
]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-3xl font-serif">FAQ</h1>
        <div className="mt-6 divide-y rounded-md border bg-white">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button className="w-full text-left px-4 py-3 font-medium" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                {f.q}
              </button>
              {open === i ? <div className="px-4 pb-4 text-sm text-slate-700">{f.a}</div> : null}
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}


