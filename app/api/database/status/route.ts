import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const db = await getDb()
    
    if (!db) {
      return NextResponse.json({
        mongodb: false,
        database: 'hack',
        collections: [],
        lastSync: 'Never',
        error: 'MongoDB connection failed'
      })
    }

    // Get collections list
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)

    // Get database stats
    const stats = await db.stats()
    
    return NextResponse.json({
      mongodb: true,
      database: db.databaseName,
      collections: collectionNames,
      lastSync: new Date().toLocaleString(),
      stats: {
        collections: stats.collections || 0,
        objects: stats.objects || 0,
        dataSize: stats.dataSize || 0,
        storageSize: stats.storageSize || 0
      }
    })
  } catch (error) {
    console.error('Database status check failed:', error)
    return NextResponse.json({
      mongodb: false,
      database: 'hack',
      collections: [],
      lastSync: 'Never',
      error: error.message
    }, { status: 500 })
  }
}
