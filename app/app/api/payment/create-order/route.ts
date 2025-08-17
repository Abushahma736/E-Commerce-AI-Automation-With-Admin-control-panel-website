import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { readJsonFile, writeJsonFile } from '@/lib/fsdb'

// Optional Razorpay integration
let razorpay: any = null
try {
  const Razorpay = require('razorpay')
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
} catch (error) {
  console.log('Razorpay not available, using fallback payment system')
}

interface OrderItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  orderId: string
  userId: string
  items: OrderItem[]
  total: number
  paymentMethod: string
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    landmark?: string
  }
  orderStatus: 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
  razorpayOrderId?: string
}

export async function POST(request: NextRequest) {
  try {
    // Check if this is a legacy Razorpay request or new comprehensive order
    const body = await request.json()
    
    // Legacy Razorpay order creation
    if (body.amount && !body.items) {
      if (!razorpay) {
        return NextResponse.json({ error: 'Razorpay not configured' }, { status: 500 })
      }
      
      const { amount, currency = 'INR' } = body
      
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { error: 'Amount is required and must be greater than 0' },
          { status: 400 }
        )
      }
      
      const options = {
        amount: Math.round(amount * 100), // amount in paise
        currency,
        receipt: `order_${Date.now()}`,
        payment_capture: 1,
      }
      
      const order = await razorpay.orders.create(options)
      
      return NextResponse.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      })
    }
    
    // New comprehensive order creation
    const { items, total, paymentMethod, shippingAddress, userId } = body

    // Validate required fields
    if (!items || !total || !paymentMethod || !shippingAddress || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate order ID
    const orderId = `ESSE${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    let razorpayOrderId = undefined

    // Create Razorpay order for online payments
    if (paymentMethod !== 'cod' && razorpay) {
      try {
        const razorpayOptions = {
          amount: Math.round(total * 100), // amount in paise
          currency: 'INR',
          receipt: orderId,
          payment_capture: 1,
        }
        
        const razorpayOrder = await razorpay.orders.create(razorpayOptions)
        razorpayOrderId = razorpayOrder.id
      } catch (razorpayError) {
        console.log('Razorpay order creation failed, proceeding without it')
      }
    }

    // Create order object
    const order: Order = {
      id: crypto.randomUUID(),
      orderId,
      userId,
      items,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      shippingAddress,
      orderStatus: 'placed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      razorpayOrderId
    }

    // Try to save to MongoDB first, fallback to JSON file
    try {
      const db = await getDb()
      await db.collection('orders').insertOne(order)
    } catch (mongoError) {
      console.log('MongoDB not available, saving to JSON file')
      try {
        const existingOrders = await readJsonFile<Order[]>('orders.json', [])
        existingOrders.push(order)
        await writeJsonFile('orders.json', existingOrders)
      } catch (fileError) {
        console.error('Failed to save order:', fileError)
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
      }
    }

    // Return order details
    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      id: order.id,
      total: order.total,
      paymentMethod: order.paymentMethod,
      status: order.orderStatus,
      razorpayOrderId,
      message: 'Order created successfully'
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
