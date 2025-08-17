import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json()

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
    }

    // Connect to MongoDB
    const db = await getDb()
    if (!db) {
      console.log('⚠️ MongoDB not available, returning demo success')
      return NextResponse.json({
        success: true,
        message: 'User registered successfully (demo mode)',
        userId: `demo_user_${Date.now()}`
      })
    }

    try {
      const usersCollection = db.collection('users')
      
      // Check if user already exists
      const existingUser = await usersCollection.findOne({ 
        email: email.toLowerCase() 
      })
      
      if (existingUser) {
        return NextResponse.json({ 
          error: 'User with this email already exists' 
        }, { status: 409 })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create new user
      const newUser = {
        name: name.trim(),
        email: email.toLowerCase(),
        phone: phone.trim(),
        password: hashedPassword, // NextAuth will look for this field
        passwordHash: hashedPassword, // Some systems use this field
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'customer', // Use 'customer' instead of 'user' for consistency
        isActive: true
      }

      const result = await usersCollection.insertOne(newUser)
      
      console.log('✅ User registered successfully:', email)
      return NextResponse.json({
        success: true,
        message: 'User registered successfully',
        userId: result.insertedId.toString()
      })

    } catch (dbError) {
      console.error('❌ Database error during registration:', dbError)
      return NextResponse.json({ 
        error: 'Failed to save user to database' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
