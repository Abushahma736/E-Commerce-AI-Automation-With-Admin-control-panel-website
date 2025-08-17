import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get('sid')?.value

    if (sessionToken) {
      // Try to remove session from MongoDB
      try {
        const db = await getDb()
        await db.collection('sessions').deleteOne({ token: sessionToken })
      } catch (error) {
        console.log('MongoDB not available, session was in-memory only')
      }
    }

    // Create response
    const response = NextResponse.json({ 
      ok: true, 
      message: 'Logged out successfully' 
    })

    // Clear both session cookies
    response.cookies.set('sid', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0 // Expire immediately
    })
    
    response.cookies.set('auth-token', '', {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0 // Expire immediately
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Auth logout endpoint' })
}
