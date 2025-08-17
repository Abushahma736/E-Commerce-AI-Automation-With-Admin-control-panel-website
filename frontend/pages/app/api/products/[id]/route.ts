import { NextResponse } from 'next/server'
import { getAllProducts, saveAllProducts, type Product } from '@/lib/fsdb'
import { getProductByIdFromMongo, getDb } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const fromMongo = await getProductByIdFromMongo(id)
    if (fromMongo) return NextResponse.json(fromMongo)
  } catch (_) {
    // fall back below
  }
  const products = await getAllProducts()
  const product = products.find((p) => p.id === id)
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = (await request.json()) as any
    
    // Try MongoDB first
    try {
      const db = await getDb()
      if (db) {
        const coll = db.collection('products')
        const existing = await coll.findOne({ _id: { $ne: null }, $or: [{ id }, { _id: { $eq: id } }] })
        if (!existing) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        
        // Handle both name and title fields for compatibility with admin panel
        const productTitle = body.title || body.name || existing.title
        const updated = {
          id: existing.id || id,
          title: productTitle,
          price: body.price !== undefined ? Number(body.price) : existing.price,
          onSale: body.onSale !== undefined ? Boolean(body.onSale) : existing.onSale,
          category: body.category ?? existing.category,
          image: body.image ?? existing.image,
          images: Array.isArray(body.images) ? body.images : existing.images,
          popularity: typeof body.popularity === 'number' ? body.popularity : existing.popularity,
          createdAt: existing.createdAt,
          stock: body.stock !== undefined ? Number(body.stock) : existing.stock,
          isActive: body.isActive !== undefined ? Boolean(body.isActive) : existing.isActive,
          description: body.description ?? existing.description,
          updatedAt: new Date().toISOString()
        }
        
        await coll.updateOne(
          { _id: existing._id }, 
          { $set: updated }
        )
        
        return NextResponse.json({ ...updated, _id: existing._id.toString(), name: productTitle })
      }
    } catch (mongoError: any) {
      console.log('MongoDB error, using file system fallback:', mongoError.message)
    }

    const products = await getAllProducts()
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const existing = products[index]
    // Handle both name and title fields for compatibility with admin panel
    const productTitle = body.title || body.name as string || existing.title
    const updated: Product = { 
      id: existing.id, 
      title: productTitle, 
      price: body.price !== undefined ? Number(body.price) : existing.price, 
      onSale: body.onSale !== undefined ? Boolean(body.onSale) : existing.onSale, 
      category: body.category ?? existing.category, 
      image: body.image ?? existing.image, 
      images: Array.isArray(body.images) ? body.images : existing.images, 
      popularity: typeof body.popularity === 'number' ? body.popularity : existing.popularity, 
      createdAt: typeof body.createdAt === 'string' ? body.createdAt : existing.createdAt 
    }
    products[index] = updated
    await saveAllProducts(products)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Try MongoDB first
  try {
    const db = await getDb()
    if (db) {
      const coll = db.collection('products')
      // Try to find by _id first, then by id field
      let result
      try {
        const { ObjectId } = require('mongodb')
        result = await coll.deleteOne({ _id: new ObjectId(id) })
      } catch {
        result = await coll.deleteOne({ id })
      }
      
      if (!result.deletedCount) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true })
    }
  } catch (mongoError: any) {
    console.log('MongoDB error, using file system fallback:', mongoError.message)
  }

  // Fallback to file system
  const products = await getAllProducts()
  const next = products.filter((p) => p.id !== id)
  if (next.length === products.length) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  await saveAllProducts(next)
  return NextResponse.json({ success: true })
}


