"use client"
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'

type Product = {
  id: string
  title: string
  price: number
  onSale?: boolean
  image: string
  images?: string[]
}

export function QuickViewModal({ id, open, onClose }: { id: string; open: boolean; onClose: () => void }) {
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (!open) return
    fetch(`/api/products/${id}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((p) => setProduct(p))
      .catch(() => setProduct(null))
  }, [id, open])

  if (!open) return null

  const images = product?.images && product.images.length > 0 ? product.images : product?.image ? [product.image] : []

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 animate-fade-in" onClick={onClose}>
      <div className="bg-white w-[92vw] max-w-3xl rounded-md overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="grid md:grid-cols-2">
          <div className="relative h-72 md:h-96">
            {images[0] ? <Image src={images[0]} alt={product?.title || ''} fill className="object-cover" /> : null}
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold">{product?.title}</h3>
            <div className="mt-2 text-brand-green text-lg">₹{product?.price?.toFixed(0)}</div>
            <p className="mt-3 text-sm text-slate-600">High-level details and short description preview.</p>
            <div className="mt-4 flex gap-2">
              <Button onClick={onClose}>View Details</Button>
              <button className="px-3 py-2 border rounded" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


