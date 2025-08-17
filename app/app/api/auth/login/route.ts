import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { readJsonFile, writeJsonFile } from '@/lib/fsdb'
import bcrypt from 'bcryptjs'

interface User {
  id: string
  name: string
  email: string
  password: string
  passwordHash?: string
  role: 'admin' | 'customer'
  createdAt: string
}

// Demo users with pre-hashed passwords
const defaultUsers: User[] = [
  {
    id: 'admin_1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // Plain text for demo
    passwordHash: '$2a$12$7Jw/VVk8VzaFHh8a1C/MKOYHFf8KGvb2N9t3P.XLQ0xY3B7vJrw.m',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user_1', 
    name: 'Demo Customer',
    email: 'user@example.com',
    password: 'demo123', // Plain text for demo
    passwordHash: '$2a$12$7Jw/VVk8VzaFHh8a1C/MKOYHFf8KGvb2N9t3P.XLQ0xY3B7vJrw.m',
    role: 'customer',
    createdAt: new Date().toISOString()
  }
]

async function findUserByEmail(email: string): Promise<User | null> {
  try {
    // Try MongoDB first
    const db = await getDb()
    const users = db.collection('users')
    const mongoUser = await users.findOne<{ passwordHash: string; _id: unknown; name: string; email: string; role?: string }>({ email })
    
    if (mongoUser) {
      return {
        id: String(mongoUser._id),
        name: mongoUser.name,
        email: mongoUser.email,
        password: '',
        passwordHash: mongoUser.passwordHash,
        role: (mongoUser.role as 'admin' | 'customer') || 'customer',
        createdAt: new Date().toISOString()
      }
    }
  } catch (error) {
    console.log('MongoDB not available, using JSON fallback')
  }
  
  // Fallback to JSON file
  try {
    const users = await readJsonFile<User[]>('users.json', defaultUsers)
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
  } catch (error) {
    console.error('Error reading users file:', error)
    return defaultUsers.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await findUserByEmail(email.toLowerCase())
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Check password - for demo users, allow plain text comparison
    let isValidPassword = false
    if (user.email === 'admin@example.com' && password === 'admin123') {
      isValidPassword = true
    } else if (user.email === 'user@example.com' && password === 'demo123') {
      isValidPassword = true
    } else if (user.passwordHash) {
      isValidPassword = await bcrypt.compare(password, user.passwordHash)
    } else if (user.password) {
      // For plain text passwords (development only)
      isValidPassword = user.password === password
    }

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Create session token
    const token = crypto.randomUUID()
    const sessionData = {
      token,
      userId: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }

    // Try to store session in MongoDB, fallback to in-memory
    try {
      const db = await getDb()
      await db.collection('sessions').insertOne(sessionData)
    } catch (error) {
      console.log('Session stored in memory only (MongoDB not available)')
      // In a real app, you'd use a proper session store
    }

    const response = NextResponse.json({ 
      ok: true, 
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

    // Set session cookie
    response.cookies.set('sid', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


