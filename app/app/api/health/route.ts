import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Test MongoDB connection
    const db = await getDb()
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(col => col.name)
    
    // Test contacts collection specifically
    let contactsCount = 0
    try {
      const contacts = db.collection('contacts')
      contactsCount = await contacts.countDocuments()
    } catch (e) {
      console.error('Error accessing contacts collection:', e)
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      mongodb: {
        connected: true,
        database: db.databaseName,
        collections: collectionNames,
        contactsCount: contactsCount
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
      }
    })
  } catch (error: any) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      mongodb: {
        connected: false,
        error: error.message
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
      }
    }, { status: 500 })
  }
}


