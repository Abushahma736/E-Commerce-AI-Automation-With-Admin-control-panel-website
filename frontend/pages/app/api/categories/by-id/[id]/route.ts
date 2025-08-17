import { NextResponse } from 'next/server'
import { getAllCategories, saveAllCategories } from '@/lib/fsdb'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params
    
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Missing required fields: name and slug' }, { status: 400 })
    }

    // Try Mongo first
    try {
      const db = await getDb()
      const coll = db.collection('categories')
      
      // Check if slug exists for other categories
      const existing = await coll.findOne({ 
        slug: body.slug, 
        _id: { $ne: new ObjectId(id) } 
      })
      if (existing) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
      }
      
      const updateDoc = {
        name: body.name,
        slug: body.slug,
        description: body.description || '',
        image: body.image || '',
        isActive: body.isActive ?? true,
        updatedAt: new Date().toISOString()
      }
      
      const result = await coll.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateDoc }
      )
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
      
      const updated = await coll.findOne({ _id: new ObjectId(id) })
      return NextResponse.json({ ...updated, _id: updated?._id.toString() })
    } catch (mongoError: any) {
      console.log('Mongo error:', mongoError.message)
      // fall back to FS below
    }

    // Fallback to file system
    const categories = await getAllCategories()
    const index = categories.findIndex((c: any) => c._id === id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    // Check for duplicate slug
    const duplicateIndex = categories.findIndex((c: any) => c.slug === body.slug && c._id !== id)
    if (duplicateIndex !== -1) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    
    categories[index] = {
      ...categories[index],
      name: body.name,
      slug: body.slug,
      description: body.description || '',
      image: body.image || '',
      isActive: body.isActive ?? true,
      updatedAt: new Date().toISOString()
    }
    
    await saveAllCategories(categories)
    return NextResponse.json(categories[index])
  } catch (error: any) {
    console.error('Category update error:', error)
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Try Mongo first
    try {
      const db = await getDb()
      const coll = db.collection('categories')
      
      const result = await coll.deleteOne({ _id: new ObjectId(id) })
      
      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
      
      return NextResponse.json({ success: true, message: 'Category deleted successfully' })
    } catch (mongoError: any) {
      console.log('Mongo error:', mongoError.message)
      // fall back to FS below
    }

    // Fallback to file system
    const categories = await getAllCategories()
    const index = categories.findIndex((c: any) => c._id === id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    categories.splice(index, 1)
    await saveAllCategories(categories)
    return NextResponse.json({ success: true, message: 'Category deleted successfully' })
  } catch (error: any) {
    console.error('Category delete error:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
