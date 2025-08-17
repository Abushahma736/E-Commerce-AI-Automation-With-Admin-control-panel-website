import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Only enable in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Debug endpoint only available in development' }, { status: 403 })
    }

    const db = await getDb()
    if (!db) {
      return NextResponse.json({ 
        message: 'MongoDB not available',
        fallbackUsers: [
          'demo@example.com',
          'test@example.com', 
          'admin@hack.com'
        ]
      })
    }

    const usersCollection = db.collection('users')
    const users = await usersCollection.find({}).toArray()

    const safeUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      hasPassword: !!user.password,
      hasPasswordHash: !!user.passwordHash,
      passwordType: user.password ? (user.password.startsWith('$2') ? 'hashed' : 'plain') : 'none',
      passwordHashType: user.passwordHash ? (user.passwordHash.startsWith('$2') ? 'hashed' : 'plain') : 'none',
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }))

    return NextResponse.json({
      message: 'Users found in database',
      count: safeUsers.length,
      users: safeUsers
    })

  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch user data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
