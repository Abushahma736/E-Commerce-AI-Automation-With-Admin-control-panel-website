import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()
    const userId = session.user.id || session.user.email

    // Default stats if MongoDB is not available
    const defaultStats = {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      wishlistItems: 0,
      addressesCount: 0,
      paymentMethodsCount: 0
    }

    if (!db) {
      return NextResponse.json(defaultStats)
    }

    try {
      // Get orders statistics
      const ordersCollection = db.collection('orders')
      const totalOrders = await ordersCollection.countDocuments({ userId })
      const pendingOrders = await ordersCollection.countDocuments({ 
        userId, 
        status: { $in: ['pending', 'processing', 'shipped'] }
      })
      const completedOrders = await ordersCollection.countDocuments({ 
        userId, 
        status: 'completed'
      })

      // Get wishlist items count
      const wishlistCollection = db.collection('wishlist')
      const wishlistDoc = await wishlistCollection.findOne({ userId })
      const wishlistItems = wishlistDoc?.items?.length || 0

      // Get addresses count
      const addressesCollection = db.collection('addresses')
      const addressesDoc = await addressesCollection.findOne({ userId })
      const addressesCount = addressesDoc?.items?.length || 0

      // Get payment methods count
      const paymentMethodsCollection = db.collection('payment_methods')
      const paymentMethodsDoc = await paymentMethodsCollection.findOne({ userId })
      const paymentMethodsCount = paymentMethodsDoc?.items?.length || 0

      // Get recent activity
      const recentOrders = await ordersCollection
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray()

      const stats = {
        totalOrders,
        pendingOrders,
        completedOrders,
        wishlistItems,
        addressesCount,
        paymentMethodsCount,
        recentActivity: {
          recentOrders: recentOrders.map(order => ({
            id: order._id.toString(),
            status: order.status,
            total: order.total,
            createdAt: order.createdAt
          }))
        }
      }

      return NextResponse.json(stats)

    } catch (error) {
      console.error('Error fetching user stats from MongoDB:', error)
      // Return default stats if there's an error with MongoDB queries
      return NextResponse.json(defaultStats)
    }

  } catch (error) {
    console.error('User stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
