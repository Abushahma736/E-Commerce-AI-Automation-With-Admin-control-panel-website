import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json()
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ 
        error: 'Missing required fields. Please fill in name, email, subject, and message.' 
      }, { status: 400 })
    }
    
    const db = await getDb()
    const contacts = db.collection('contacts')
    
    const doc = { 
      name, 
      email, 
      phone: phone || '', // Make phone optional
      subject, 
      message, 
      createdAt: new Date() 
    }
    
    const res = await contacts.insertOne(doc)
    const dbName = (process.env.MONGODB_URI ? new URL(process.env.MONGODB_URI).pathname.slice(1) : 'hack') || 'hack'
    
    return NextResponse.json({ 
      ok: true, 
      id: String(res.insertedId), 
      db: dbName,
      message: 'Contact message saved successfully'
    })
  } catch (e: any) {
    console.error('Contact API Error:', e)
    const msg = e?.message ? String(e.message) : 'Server error occurred'
    const code = msg.includes('E11000') ? 409 : 500
    return NextResponse.json({ error: msg }, { status: code })
  }
}

export async function GET() {
  try {
    const db = await getDb()
    const contacts = db.collection('contacts')
    const items = await contacts.find({}).sort({ createdAt: -1 }).limit(50).toArray()
    return NextResponse.json(items.map((d: any) => ({
      id: String(d._id),
      name: d.name,
      email: d.email,
      phone: d.phone || '',
      subject: d.subject || '',
      message: d.message,
      createdAt: d.createdAt
    })))
  } catch (e: any) {
    console.error('Contact GET API Error:', e)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}


