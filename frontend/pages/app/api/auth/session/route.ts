import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get the NextAuth session
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ 
        authenticated: false, 
        message: 'No active session' 
      }, { status: 401 })
    }

    // Return the session user data
    return NextResponse.json({ 
      authenticated: true, 
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      }
    })

  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json({ 
      authenticated: false,
      error: 'Session validation failed' 
    }, { status: 500 })
  }
}
