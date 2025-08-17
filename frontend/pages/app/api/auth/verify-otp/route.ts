import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { verifyOTPViaTwilio } from '@/lib/twilio'

// Fallback in-memory storage for development/bypass mode
const otpStorage = new Map<string, { otp: string; timestamp: number }>()

export async function POST(request: NextRequest) {
  try {
    const { mobile, otp } = await request.json()

    if (!mobile || !otp) {
      return NextResponse.json({ error: 'Mobile number and OTP are required' }, { status: 400 })
    }

    // Check if OTP bypass is enabled
    const skipOTP = process.env.SKIP_OTP_GENERATION === 'true'
    
    if (skipOTP) {
      console.log(`🔓 OTP verification skipped for ${mobile} (SKIP_OTP_GENERATION=true)`)
      // Skip all OTP validation when bypass is enabled - any OTP will work
    } else {
      // Try Twilio verification first
      try {
        const twilioResult = await verifyOTPViaTwilio(mobile, otp)
        
        if (twilioResult.success) {
          if (!twilioResult.valid) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
          }
          // Twilio verification successful, proceed to user creation
        } else {
          console.warn('Twilio verification failed, trying fallback:', twilioResult.error)
          
          // Fallback to local OTP verification
          const storedOtpData = otpStorage.get(mobile)
          
          if (!storedOtpData) {
            return NextResponse.json({ error: 'OTP expired or not found' }, { status: 400 })
          }

          // Check if OTP is expired (5 minutes)
          const fiveMinutes = 5 * 60 * 1000
          if (Date.now() - storedOtpData.timestamp > fiveMinutes) {
            otpStorage.delete(mobile)
            return NextResponse.json({ error: 'OTP expired' }, { status: 400 })
          }

          // Verify OTP
          if (storedOtpData.otp !== otp) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
          }
          
          // Remove from local storage
          otpStorage.delete(mobile)
        }
      } catch (error) {
        console.error('Twilio verification error, trying fallback:', error)
        
        // Fallback to local OTP verification
        const storedOtpData = otpStorage.get(mobile)
        
        if (!storedOtpData) {
          return NextResponse.json({ error: 'OTP expired or not found' }, { status: 400 })
        }

        // Check if OTP is expired (5 minutes)
        const fiveMinutes = 5 * 60 * 1000
        if (Date.now() - storedOtpData.timestamp > fiveMinutes) {
          otpStorage.delete(mobile)
          return NextResponse.json({ error: 'OTP expired' }, { status: 400 })
        }

        // Verify OTP
        if (storedOtpData.otp !== otp) {
          return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
        }
        
        // Remove from local storage
        otpStorage.delete(mobile)
      }
    }

    // OTP verified successfully, now handle user creation/login
    let user = null
    try {
      const db = await getDb()
      const usersCollection = db.collection('users')
      
      user = await usersCollection.findOne({ mobile })
      
      if (!user) {
        // Create new user
        const newUser = {
          mobile,
          name: '', // Can be updated later in profile
          email: '',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        const result = await usersCollection.insertOne(newUser)
        user = { ...newUser, _id: result.insertedId.toString() }
      } else {
        // Update last login
        await usersCollection.updateOne(
          { mobile },
          { $set: { updatedAt: new Date().toISOString() } }
        )
        user._id = user._id.toString()
      }
    } catch (mongoError) {
      console.log('MongoDB error, using fallback:', mongoError)
      // Fallback user object
      user = {
        _id: Date.now().toString(),
        mobile,
        name: '',
        email: '',
        isActive: true
      }
    }

    // Create response with authentication cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        mobile: user.mobile,
        name: user.name || '',
        email: user.email || ''
      }
    })

    // Set authentication cookie
    response.cookies.set('auth-token', JSON.stringify({
      id: user._id,
      mobile: user.mobile,
      name: user.name || '',
      email: user.email || '',
      loginTime: Date.now()
    }), {
      httpOnly: false, // Allow client-side access for now
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    })

    return response

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
