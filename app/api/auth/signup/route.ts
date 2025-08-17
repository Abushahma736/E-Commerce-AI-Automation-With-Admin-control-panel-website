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

async function getAllUsers(): Promise<User[]> {
  try {
    // Try MongoDB first
    const db = await getDb()
    const users = db.collection('users')
    const mongoUsers = await users.find({}).toArray()
    
    if (mongoUsers.length > 0) {
      return mongoUsers.map(user => ({
        id: String(user._id),
        name: user.name,
        email: user.email,
        password: '',
        passwordHash: user.passwordHash,
        role: (user.role as 'admin' | 'customer') || 'customer',
        createdAt: user.createdAt || new Date().toISOString()
      }))
    }
  } catch (error) {
    console.log('MongoDB not available, using JSON fallback')
  }
  
  // Fallback to JSON file
  try {
    return await readJsonFile<User[]>('users.json', [])
  } catch (error) {
    console.error('Error reading users file:', error)
    return []
  }
}

async function saveUser(user: User): Promise<boolean> {
  try {
    // Try MongoDB first
    const db = await getDb()
    const users = db.collection('users')
    await users.insertOne({
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      createdAt: user.createdAt
    })
    return true
  } catch (error) {
    console.log('MongoDB not available, saving to JSON file')
  }
  
  // Fallback to JSON file
  try {
    const allUsers = await getAllUsers()
    allUsers.push(user)
    await writeJsonFile('users.json', allUsers)
    return true
  } catch (error) {
    console.error('Error saving user:', error)
    return false
  }
}

async function userExists(email: string): Promise<boolean> {
  try {
    // Try MongoDB first
    const db = await getDb()
    const users = db.collection('users')
    const existingUser = await users.findOne({ email: email.toLowerCase() })
    if (existingUser) return true
  } catch (error) {
    console.log('MongoDB not available, checking JSON file')
  }
  
  // Fallback to JSON file
  try {
    const allUsers = await getAllUsers()
    return allUsers.some(user => user.email.toLowerCase() === email.toLowerCase())
  } catch (error) {
    console.error('Error checking user existence:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password, role = 'customer' } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 })
    }

    // Check if user already exists
    if (await userExists(email)) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: '', // Don't store plain text
      passwordHash,
      role: role === 'admin' ? 'admin' : 'customer',
      createdAt: new Date().toISOString()
    }

    // Save user
    const saved = await saveUser(newUser)
    if (!saved) {
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 })
    }

    // Return success response (don't include password info)
    return NextResponse.json({
      ok: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Auth signup endpoint' })
}
