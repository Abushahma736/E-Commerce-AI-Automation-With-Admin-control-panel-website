import { NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/fsdb'

export const dynamic = 'force-dynamic'

function toNumber(value: string | null, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const q = (url.searchParams.get('q') || '').toLowerCase().trim()
  const category = url.searchParams.get('category') || ''
  const minPrice = toNumber(url.searchParams.get('minPrice'), 0)
  const maxPrice = toNumber(url.searchParams.get('maxPrice'), Number.MAX_SAFE_INTEGER)
  const sort = url.searchParams.get('sort') || ''
  const page = Math.max(1, toNumber(url.searchParams.get('page'), 1))
  const pageSize = Math.min(50, Math.max(1, toNumber(url.searchParams.get('pageSize'), 12)))

  let products = await getAllProducts()

  if (q) {
    products = products.filter((p) => p.title.toLowerCase().includes(q))
  }
  if (category) {
    products = products.filter((p) => p.category === category)
  }
  products = products.filter((p) => p.price >= minPrice && p.price <= maxPrice)

  switch (sort) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      products.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      products.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      break
    case 'popular':
      products.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      break
    default:
      break
  }

  const total = products.length
  const start = (page - 1) * pageSize
  const items = products.slice(start, start + pageSize)
  const hasMore = start + pageSize < total

  return NextResponse.json({ items, total, page, pageSize, hasMore })
}


