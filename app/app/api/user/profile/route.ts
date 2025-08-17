import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { readJsonFile, writeJsonFile } from '@/lib/fsdb'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  address?: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
  }
  preferences?: {
    notifications: boolean
    marketing: boolean
    newsletter: boolean
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get session token from cookie to identify user
    const sessionToken = request.cookies.get('sid')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user ID from session
    let userId: string | null = null
    try {
      const db = await getDb()
      const session = await db.collection('sessions').findOne({
        token: sessionToken,
        expiresAt: { $gt: new Date() }
      })
      
      if (session) {
        userId = session.userId
      } else {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
      }
    } catch (mongoError) {
      console.log('MongoDB not available for session check')
      return NextResponse.json({ error: 'Session validation failed' }, { status: 500 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const profileData = await request.json()
    
    // Validate profile data
    const updateData: Partial<UserProfile> = {}
    
    if (profileData.name) updateData.name = profileData.name
    if (profileData.phone) updateData.phone = profileData.phone
    if (profileData.dateOfBirth) updateData.dateOfBirth = profileData.dateOfBirth
    if (profileData.gender) updateData.gender = profileData.gender
    if (profileData.address) updateData.address = profileData.address
    if (profileData.preferences) updateData.preferences = profileData.preferences

    // Try to update in MongoDB first
    try {
      const db = await getDb()
      const result = await db.collection('users').updateOne(
        { _id: userId },
        { 
          $set: {
            ...updateData,
            updatedAt: new Date().toISOString()
          }
        }
      )

      if (result.modifiedCount > 0) {
        return NextResponse.json({ 
          success: true, 
          message: 'Profile updated successfully',
          ...updateData 
        })
      } else {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      
    } catch (mongoError) {
      console.log('MongoDB not available, using JSON fallback')
      
      // Fallback to JSON file
      try {
        const users = await readJsonFile<any[]>('users.json', [])
        const userIndex = users.findIndex(u => u.id === userId)
        
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updateData, updatedAt: new Date().toISOString() }
          await writeJsonFile('users.json', users)
          
          return NextResponse.json({ 
            success: true, 
            message: 'Profile updated successfully',
            ...updateData 
          })
        } else {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        
      } catch (fileError) {
        console.error('Failed to update user profile:', fileError)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
      }
    }

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
