import { NextResponse } from "next/server"
import { getAllProducts, saveAllProducts, type Product } from "@/lib/fsdb"
import { getAllProductsFromMongo, getDb } from "@/lib/mongodb"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    // Try MongoDB first
    const db = await getDb()
    if (db) {
      const coll = db.collection('products')
      const docs = await coll.find({}).toArray()
      const products = docs.map((d: any) => ({
        ...d,
        _id: d._id.toString(),
        name: d.title || d.name, // Admin panel expects 'name' field
        title: d.title || d.name,
        stock: d.stock || 0,
        isActive: d.isActive !== undefined ? d.isActive : true,
        description: d.description || '',
        updatedAt: d.updatedAt || d.createdAt || new Date().toISOString()
      }))
      return NextResponse.json(products)
    }
  } catch (mongoError: any) {
    console.log('MongoDB error, using fallback:', mongoError.message)
  }
  
  // Fallback to file system
  const fallback = await getAllProducts()
  const formatted = fallback.map((p: any) => ({
    ...p,
    _id: p.id,
    name: p.title,
    stock: 0,
    isActive: true,
    description: '',
    updatedAt: p.createdAt || new Date().toISOString()
  }))
  return NextResponse.json(formatted)
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Product>
    // Handle both name and title fields for compatibility with admin panel
    const productTitle = body.title || (body as any).name as string
    if (!body || !productTitle || body.price === undefined || !body.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    const id = body.id && body.id.trim().length > 0 ? body.id : `p${Date.now()}`
    const nowIso = new Date().toISOString()
    
    const newProduct = { 
      id, 
      title: productTitle, 
      price: Number(body.price), 
      onSale: Boolean(body.onSale), 
      category: body.category, 
      image: body.image || '', 
      images: Array.isArray(body.images) ? body.images : undefined, 
      popularity: typeof body.popularity === "number" ? body.popularity : undefined, 
      createdAt: typeof body.createdAt === "string" ? body.createdAt : nowIso,
      stock: typeof (body as any).stock === "number" ? Number((body as any).stock) : 0,
      isActive: typeof (body as any).isActive === "boolean" ? (body as any).isActive : true,
      description: (body as any).description || ''
    }
    
    // Try MongoDB first
    try {
      const db = await getDb()
      if (db) {
        const coll = db.collection('products')
        const existing = await coll.findOne({ id })
        if (existing) {
          return NextResponse.json({ error: "Product ID already exists" }, { status: 409 })
        }
        
        const result = await coll.insertOne(newProduct)
        return NextResponse.json({ ...newProduct, _id: result.insertedId.toString() }, { status: 201 })
      }
    } catch (mongoError: any) {
      console.log('Mongo error, falling back to file system:', mongoError.message)
    }
    
    // Fallback to file system
    const products = await getAllProducts()
    if (products.some((p) => p.id === id)) {
      return NextResponse.json({ error: "Product ID already exists" }, { status: 409 })
    }
    
    products.push(newProduct as Product)
    await saveAllProducts(products)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
