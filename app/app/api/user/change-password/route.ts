import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { readJsonFile, writeJsonFile } from '@/lib/fsdb'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
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

    const { currentPassword, newPassword } = await request.json()
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long' }, { status: 400 })
    }

    // Try to find and update user in MongoDB first
    try {
      const db = await getDb()
      const user = await db.collection('users').findOne({ _id: userId })
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Verify current password
      let isCurrentPasswordValid = false
      
      // Handle demo users with plain text passwords
      if (user.email === 'admin@example.com' && currentPassword === 'admin123') {
        isCurrentPasswordValid = true
      } else if (user.email === 'user@example.com' && currentPassword === 'demo123') {
        isCurrentPasswordValid = true
      } else if (user.passwordHash) {
        isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash)
      } else if (user.password) {
        // For plain text passwords (development only)
        isCurrentPasswordValid = user.password === currentPassword
      }

      if (!isCurrentPasswordValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }

      // Hash new password
      const saltRounds = 12
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)

      // Update password
      const result = await db.collection('users').updateOne(
        { _id: userId },
        { 
          $set: {
            passwordHash: newPasswordHash,
            password: '', // Clear plain text password if it exists
            updatedAt: new Date().toISOString()
          }
        }
      )

      if (result.modifiedCount > 0) {
        return NextResponse.json({ 
          success: true, 
          message: 'Password changed successfully' 
        })
      } else {
        return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
      }
      
    } catch (mongoError) {
      console.log('MongoDB not available, using JSON fallback')
      
      // Fallback to JSON file
      try {
        const users = await readJsonFile<any[]>('users.json', [])
        const userIndex = users.findIndex(u => u.id === userId)
        
        if (userIndex === -1) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const user = users[userIndex]

        // Verify current password
        let isCurrentPasswordValid = false
        
        if (user.email === 'admin@example.com' && currentPassword === 'admin123') {
          isCurrentPasswordValid = true
        } else if (user.email === 'user@example.com' && currentPassword === 'demo123') {
          isCurrentPasswordValid = true
        } else if (user.passwordHash) {
          isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash)
        } else if (user.password) {
          isCurrentPasswordValid = user.password === currentPassword
        }

        if (!isCurrentPasswordValid) {
          return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
        }

        // Hash new password
        const saltRounds = 12
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)

        // Update user
        users[userIndex] = { 
          ...users[userIndex], 
          passwordHash: newPasswordHash,
          password: '', // Clear plain text password
          updatedAt: new Date().toISOString() 
        }
        
        await writeJsonFile('users.json', users)
        
        return NextResponse.json({ 
          success: true, 
          message: 'Password changed successfully' 
        })
        
      } catch (fileError) {
        console.error('Failed to change password:', fileError)
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
      }
    }

  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
