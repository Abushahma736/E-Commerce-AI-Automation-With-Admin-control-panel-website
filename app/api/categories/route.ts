import { NextResponse } from 'next/server'
import { getAllCategories, saveAllCategories, type Category } from '@/lib/fsdb'
import { getAllCategoriesFromMongo } from '@/lib/mongodb'
import { getDb } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    // Try MongoDB first
    const db = await getDb()
    if (db) {
      const coll = db.collection('categories')
      const docs = await coll.find({}).toArray()
      const categories = docs.map((d: any) => ({
        ...d,
        _id: d._id.toString(),
        isActive: d.isActive !== undefined ? d.isActive : true,
        productCount: d.productCount || 0,
        updatedAt: d.updatedAt || d.createdAt || new Date().toISOString()
      }))
      return NextResponse.json(categories)
    }
  } catch (mongoError: any) {
    console.log('MongoDB error, using fallback:', mongoError.message)
  }
  
  // Fallback to file system
  const fallback = await getAllCategories()
  const formatted = fallback.map((c: any) => ({
    ...c,
    _id: c.slug,
    isActive: true,
    productCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))
  return NextResponse.json(formatted)
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Category>
    if (!body || !body.slug || !body.name) {
      return NextResponse.json({ error: 'Missing required fields: name and slug' }, { status: 400 })
    }
    
    // Try Mongo first
    try {
      const db = await getDb()
      const coll = db.collection('categories')
      const existing = await coll.findOne({ slug: body.slug })
      if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
      
      const doc = { 
        _id: undefined, // Let MongoDB generate
        slug: body.slug, 
        name: body.name, 
        description: body.description || '',
        image: body.image || '',
        isActive: body.isActive ?? true,
        productCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const result = await coll.insertOne(doc)
      const created = { ...doc, _id: result.insertedId.toString() }
      return NextResponse.json(created, { status: 201 })
    } catch (mongoError: any) {
      console.log('Mongo error:', mongoError.message)
      // fall back to FS below
    }

    // Fallback to file system
    const categories = await getAllCategories()
    if (categories.some((c) => c.slug === body.slug)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    
    const newCategory = { 
      _id: Date.now().toString(),
      slug: body.slug, 
      name: body.name, 
      description: body.description || '',
      image: body.image || '',
      isActive: body.isActive ?? true,
      productCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    categories.push(newCategory as any)
    await saveAllCategories(categories)
    return NextResponse.json(newCategory, { status: 201 })
  } catch (error: any) {
    console.error('Category creation error:', error)
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}


