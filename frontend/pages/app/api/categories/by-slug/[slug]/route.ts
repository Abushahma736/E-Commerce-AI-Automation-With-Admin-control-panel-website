import { NextResponse } from 'next/server'
import { getAllCategories, saveAllCategories, type Category } from '@/lib/fsdb'
import { getDb } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categories = await getAllCategories()
  const category = categories.find((c) => c.slug === slug)
  if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(category)
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const body = (await request.json()) as Partial<Category>
    try {
      const db = await getDb()
      const coll = db.collection<Category>('categories')
      const existing = await coll.findOne({ slug })
      if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      const next: Category = {
        slug: existing.slug,
        name: body.name ?? existing.name,
        type: body.type ?? existing.type,
        image: body.image ?? existing.image
      }
      await coll.updateOne({ slug }, { $set: next })
      return NextResponse.json(next)
    } catch (_) {}

    const categories = await getAllCategories()
    const index = categories.findIndex((c) => c.slug === slug)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const existing = categories[index]
    const next: Category = { slug: existing.slug, name: body.name ?? existing.name, type: body.type ?? existing.type, image: body.image ?? existing.image }
    categories[index] = next
    await saveAllCategories(categories)
    return NextResponse.json(next)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const db = await getDb()
    const coll = db.collection<Category>('categories')
    const res = await coll.deleteOne({ slug })
    if (!res.deletedCount) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (_) {}

  const categories = await getAllCategories()
  const next = categories.filter((c) => c.slug !== slug)
  if (next.length === categories.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await saveAllCategories(next)
  return NextResponse.json({ ok: true })
}

