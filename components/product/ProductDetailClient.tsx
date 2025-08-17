"use client"
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cart'
import { useState } from 'react'
import { Container } from '@/components/ui/Container'

export function ProductDetailClient({ id, title, price, image, onSale }: { id: string; title: string; price: number; image: string; onSale?: boolean }) {
  const add = useCartStore((s) => s.addItem)
  const [qty, setQty] = useState<number>(1)

  return (
    <div className="py-8">
      <Container>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative h-80 bg-white rounded-md overflow-hidden">
            <Image src={image} alt={title} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-serif">{title}</h1>
            <p className="mt-2 text-slate-600">Short description placeholder for the product detailing purity and extraction.</p>
            <div className="mt-4 flex items-baseline gap-2">
              {onSale ? (
                <>
                  <span className="text-slate-400 line-through">₹{(price + 100).toFixed(0)}</span>
                  <span className="text-2xl font-semibold text-brand-green">₹{price.toFixed(0)}</span>
                </>
              ) : (
                <span className="text-2xl font-semibold text-brand-green">₹{price.toFixed(0)}</span>
              )}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <label className="text-sm" htmlFor="qty">Quantity</label>
              <input id="qty" aria-label="Quantity" type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-20 border rounded px-3 py-2" />
              <Button onClick={() => add({ id, title, price, image }, qty)}>Add to Cart</Button>
            </div>
            <div className="mt-8">
              <div className="border-b flex gap-6 text-sm">
                <span className="pb-2 border-b-2 border-brand-green">Description</span>
                <span>Specifications</span>
                <span>Certificates</span>
              </div>
              <div className="mt-4 text-sm text-slate-700">
                Detailed description placeholder. Organic, CO₂ extracted, and quality guaranteed.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}


