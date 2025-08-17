import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get('sid')?.value

    if (!sessionToken) {
      return NextResponse.json(null, { status: 401 })
    }

    // Try to get session from MongoDB
    try {
      const db = await getDb()
      const session = await db.collection('sessions').findOne({
        token: sessionToken,
        expiresAt: { $gt: new Date() } // Check if session is not expired
      })

      if (!session) {
        return NextResponse.json(null, { status: 401 })
      }

      // Return user data from session
      return NextResponse.json({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role
      })

    } catch (mongoError) {
      console.log('MongoDB not available, session might be in-memory only')
      return NextResponse.json(null, { status: 401 })
    }

  } catch (error) {
    console.error('Get user profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
