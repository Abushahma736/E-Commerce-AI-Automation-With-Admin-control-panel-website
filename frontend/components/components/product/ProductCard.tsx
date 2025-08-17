"use client"
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { QuickViewModal } from './QuickViewModal'
import { useCartStore } from '@/store/cart'

export type Product = {
  id: string
  title: string
  price: number
  onSale?: boolean
  category: string
  image: string
}

export function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((s) => s.addItem)
  const [open, setOpen] = useState(false)
  return (
    <div className="group rounded-lg border bg-white overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.id}`} className="relative h-48 block">
        <Image src={product.image} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        {product.onSale ? <Badge className="absolute left-2 top-2">Sale!</Badge> : null}
      </Link>
      <div className="p-4 space-y-2">
        <Link href={`/product/${product.id}`} className="font-medium hover:text-brand-green block">{product.title}</Link>
        <div className="flex items-baseline gap-2">
          {product.onSale ? (
            <>
              <span className="text-slate-400 line-through">₹{(product.price + 100).toFixed(0)}</span>
              <span className="font-semibold text-brand-green">₹{product.price.toFixed(0)}</span>
            </>
          ) : (
            <span className="font-semibold text-brand-green">₹{product.price.toFixed(0)}</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => add({ id: product.id, title: product.title, price: product.price, image: product.image })}>Add to Cart</Button>
          <button className="border rounded px-3 py-2" onClick={() => setOpen(true)}>Quick View</button>
        </div>
      </div>
      <QuickViewModal id={product.id} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}


