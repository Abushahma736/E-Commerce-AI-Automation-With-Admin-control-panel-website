import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const db = await getDb()
    const settings = await db.collection('settings').findOne({ type: 'autoConfirm' })
    
    // Default settings if none exist
    const defaultSettings = {
      type: 'autoConfirm',
      enabled: true,
      maxAmount: 500,
      excludedPaymentMethods: ['cod'],
      requireVerification: false,
      delayMinutes: 5,
      emailNotification: true,
      smsNotification: false,
      excludedCountries: [],
      minOrderCount: 0,
      trustedCustomersOnly: false
    }

    return NextResponse.json(settings || defaultSettings)
  } catch (error) {
    console.error('Error fetching auto-confirm settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const db = await getDb()
    const settings = await req.json()
    
    const updatedSettings = {
      ...settings,
      type: 'autoConfirm',
      updatedAt: new Date()
    }

    const result = await db.collection('settings').updateOne(
      { type: 'autoConfirm' },
      { $set: updatedSettings },
      { upsert: true }
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Auto-confirmation settings updated successfully'
    })
  } catch (error) {
    console.error('Error updating auto-confirm settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}

// Get auto-confirmation statistics
export async function POST(req: NextRequest) {
  try {
    const db = await getDb()
    const { action } = await req.json()

    if (action === 'getStats') {
      const totalOrders = await db.collection('orders').countDocuments()
      const autoConfirmed = await db.collection('orders').countDocuments({ autoConfirmed: true })
      const manualReview = await db.collection('orders').countDocuments({ 
        status: 'pending',
        autoConfirmed: false 
      })
      const rejected = await db.collection('orders').countDocuments({ status: 'cancelled' })
      
      const successRate = totalOrders > 0 ? (autoConfirmed / totalOrders * 100) : 0

      return NextResponse.json({
        totalOrders,
        autoConfirmed,
        manualReview,
        rejected,
        successRate: parseFloat(successRate.toFixed(1))
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error getting auto-confirm stats:', error)
    return NextResponse.json({ error: 'Failed to get statistics' }, { status: 500 })
  }
}
