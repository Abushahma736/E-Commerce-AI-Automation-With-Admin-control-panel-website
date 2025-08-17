import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { readJsonFile } from '@/lib/fsdb'

interface Order {
  id: string;
  orderId: string;
  userId: string;
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
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

    // Fetch user's orders
    try {
      const db = await getDb()
      const orders = await db.collection('orders')
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray()
      
      return NextResponse.json(orders.map(order => ({
        id: order._id?.toString() || order.id,
        orderId: order.orderId,
        userId: order.userId,
        items: order.items || [],
        total: order.total || 0,
        paymentMethod: order.paymentMethod || 'unknown',
        paymentStatus: order.paymentStatus || 'pending',
        orderStatus: order.orderStatus || order.status || 'placed',
        shippingAddress: order.shippingAddress || {},
        createdAt: order.createdAt || new Date().toISOString(),
        updatedAt: order.updatedAt || order.createdAt || new Date().toISOString()
      })))
    } catch (mongoError) {
      console.log('MongoDB not available, using JSON fallback')
      
      // Fallback to JSON file
      const orders = await readJsonFile<Order[]>('orders.json', [])
      const userOrders = orders.filter(order => order.userId === userId)
      
      return NextResponse.json(userOrders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// Legacy admin order creation endpoint - keep for backward compatibility
export async function POST(req: NextRequest) {
  try {
    const db = await getDb()
    const orderData = await req.json()

    const order = {
      ...orderData,
      orderNumber: `ORD-${Date.now()}`,
      status: 'pending',
      paymentStatus: 'pending',
      autoConfirmed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('orders').insertOne(order)

    return NextResponse.json({ 
      success: true, 
      orderId: result.insertedId,
      orderNumber: order.orderNumber
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
