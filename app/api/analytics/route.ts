import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const db = await getDb()
    const { searchParams } = new URL(req.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    
    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(endDate.getDate() - 30)
    }

    // Get current month dates
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)
    
    const lastMonth = new Date(thisMonth)
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    // Revenue analytics
    const revenueData = await getRevenueAnalytics(db, startDate, endDate, thisMonth, lastMonth)
    
    // Orders analytics
    const ordersData = await getOrdersAnalytics(db, startDate, endDate, thisMonth, lastMonth)
    
    // Customers analytics
    const customersData = await getCustomersAnalytics(db, startDate, endDate, thisMonth, lastMonth)
    
    // Products analytics
    const productsData = await getProductsAnalytics(db)
    
    // Traffic analytics (mock data for now)
    const trafficData = {
      visitors: 12567,
      pageViews: 45890,
      conversionRate: 2.85,
      bounceRate: 42.3
    }

    return NextResponse.json({
      revenue: revenueData,
      orders: ordersData,
      customers: customersData,
      products: productsData,
      traffic: trafficData
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

async function getRevenueAnalytics(db: any, startDate: Date, endDate: Date, thisMonth: Date, lastMonth: Date) {
  const totalRevenue = await db.collection('orders').aggregate([
    { $match: { status: { $in: ['confirmed', 'delivered'] } } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]).toArray()

  const thisMonthRevenue = await db.collection('orders').aggregate([
    { 
      $match: { 
        status: { $in: ['confirmed', 'delivered'] },
        createdAt: { $gte: thisMonth }
      }
    },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]).toArray()

  const lastMonthRevenue = await db.collection('orders').aggregate([
    { 
      $match: { 
        status: { $in: ['confirmed', 'delivered'] },
        createdAt: { $gte: lastMonth, $lt: thisMonth }
      }
    },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]).toArray()

  const total = totalRevenue[0]?.total || 0
  const thisMonth$ = thisMonthRevenue[0]?.total || 0
  const lastMonth$ = lastMonthRevenue[0]?.total || 0
  const growth = lastMonth$ > 0 ? ((thisMonth$ - lastMonth$) / lastMonth$ * 100) : 0

  return {
    total,
    thisMonth: thisMonth$,
    lastMonth: lastMonth$,
    growth: parseFloat(growth.toFixed(1))
  }
}

async function getOrdersAnalytics(db: any, startDate: Date, endDate: Date, thisMonth: Date, lastMonth: Date) {
  const totalOrders = await db.collection('orders').countDocuments()

  const thisMonthOrders = await db.collection('orders').countDocuments({
    createdAt: { $gte: thisMonth }
  })

  const lastMonthOrders = await db.collection('orders').countDocuments({
    createdAt: { $gte: lastMonth, $lt: thisMonth }
  })

  const avgOrderValue = await db.collection('orders').aggregate([
    { $match: { status: { $in: ['confirmed', 'delivered'] } } },
    { $group: { _id: null, avg: { $avg: '$total' } } }
  ]).toArray()

  const growth = lastMonthOrders > 0 ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders * 100) : 0

  return {
    total: totalOrders,
    thisMonth: thisMonthOrders,
    lastMonth: lastMonthOrders,
    growth: parseFloat(growth.toFixed(1)),
    avgOrderValue: avgOrderValue[0]?.avg || 0
  }
}

async function getCustomersAnalytics(db: any, startDate: Date, endDate: Date, thisMonth: Date, lastMonth: Date) {
  const totalCustomers = await db.collection('users').countDocuments()

  const thisMonthCustomers = await db.collection('users').countDocuments({
    createdAt: { $gte: thisMonth }
  })

  const lastMonthCustomers = await db.collection('users').countDocuments({
    createdAt: { $gte: lastMonth, $lt: thisMonth }
  })

  const growth = lastMonthCustomers > 0 ? ((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers * 100) : 0

  // Calculate retention (customers who made multiple orders)
  const retentionData = await db.collection('orders').aggregate([
    { $group: { _id: '$customer.email', orderCount: { $sum: 1 } } },
    { $match: { orderCount: { $gt: 1 } } },
    { $count: 'repeatCustomers' }
  ]).toArray()

  const repeatCustomers = retentionData[0]?.repeatCustomers || 0
  const retention = totalCustomers > 0 ? (repeatCustomers / totalCustomers * 100) : 0

  return {
    total: totalCustomers,
    thisMonth: thisMonthCustomers,
    lastMonth: lastMonthCustomers,
    growth: parseFloat(growth.toFixed(1)),
    retention: parseFloat(retention.toFixed(1))
  }
}

async function getProductsAnalytics(db: any) {
  const totalProducts = await db.collection('products').countDocuments()
  const outOfStock = await db.collection('products').countDocuments({ stock: 0 })

  // Get top selling products
  const topSelling = await db.collection('orders').aggregate([
    { $unwind: '$items' },
    { 
      $group: { 
        _id: '$items.name', 
        sold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
      }
    },
    { $sort: { sold: -1 } },
    { $limit: 5 },
    { 
      $project: { 
        _id: 0, 
        name: '$_id', 
        sold: 1, 
        revenue: 1 
      }
    }
  ]).toArray()

  return {
    total: totalProducts,
    outOfStock,
    topSelling
  }
}
