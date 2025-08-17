import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()
    
    if (!db) {
      return NextResponse.json({
        success: false,
        error: 'MongoDB connection failed'
      }, { status: 503 })
    }

    const userId = session.user.id || session.user.email

    // Initialize collections if they don't exist
    const collections = ['users', 'orders', 'addresses', 'payment_methods', 'wishlist', 'notifications']
    
    for (const collectionName of collections) {
      const collection = db.collection(collectionName)
      
      // Create indexes for better performance
      if (collectionName === 'users') {
        await collection.createIndex({ email: 1 }, { unique: true })
        await collection.createIndex({ id: 1 })
      } else if (collectionName === 'orders') {
        await collection.createIndex({ userId: 1 })
        await collection.createIndex({ status: 1 })
        await collection.createIndex({ createdAt: -1 })
      } else {
        await collection.createIndex({ userId: 1 })
      }
    }

    // Update or create user document
    const userCollection = db.collection('users')
    const userDoc = {
      id: userId,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      lastLogin: new Date(),
      updatedAt: new Date()
    }

    await userCollection.updateOne(
      { $or: [{ id: userId }, { email: session.user.email }] },
      { $set: userDoc, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    )

    // Initialize empty collections for user if they don't have data
    const defaultCollections = [
      { name: 'addresses', data: [] },
      { name: 'payment_methods', data: [] },
      { name: 'wishlist', data: [] },
      { name: 'notifications', data: [] }
    ]

    for (const { name, data } of defaultCollections) {
      const collection = db.collection(name)
      const existingData = await collection.findOne({ userId })
      
      if (!existingData) {
        await collection.insertOne({
          userId,
          items: data,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    // Get updated stats
    const stats = await db.stats()
    const collectionsInfo = await db.listCollections().toArray()
    
    return NextResponse.json({
      success: true,
      message: 'Database synchronized successfully',
      collections: collectionsInfo.map(c => c.name),
      stats: {
        collections: stats.collections || 0,
        objects: stats.objects || 0,
        dataSize: stats.dataSize || 0
      },
      lastSync: new Date().toLocaleString()
    })

  } catch (error) {
    console.error('Database sync failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
