import { NextRequest, NextResponse } from 'next/server'
import { sendOTPViaTwilio } from '@/lib/twilio'

// Fallback in-memory storage for development/bypass mode
const otpStorage = new Map<string, { otp: string; timestamp: number }>()

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json()

    if (!mobile) {
      return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 })
    }

    // Validate Indian mobile number format
    const indianMobileRegex = /^\+91[6-9]\d{9}$/
    if (!indianMobileRegex.test(mobile)) {
      return NextResponse.json({ error: 'Invalid mobile number format' }, { status: 400 })
    }

    // Check if OTP is disabled via environment variable
    const skipOTP = process.env.SKIP_OTP_GENERATION === 'true'
    
    if (skipOTP) {
      // Bypass mode - use fixed OTP
      console.log(`🔓 OTP generation skipped for ${mobile} (SKIP_OTP_GENERATION=true)`)
      
      const otp = '123456' // Fixed OTP when bypassed
      otpStorage.set(mobile, {
        otp,
        timestamp: Date.now()
      })
      
      return NextResponse.json({ 
        success: true, 
        message: 'OTP bypassed - using default OTP',
        devOtp: '123456',
        bypassed: true
      })
    }

    // Real Twilio SMS OTP
    try {
      const twilioResult = await sendOTPViaTwilio(mobile)
      
      if (twilioResult.success) {
        // Twilio handles OTP generation and storage internally
        // No need to store OTP locally when using Twilio
        cleanupExpiredOTPs()
        
        return NextResponse.json({ 
          success: true, 
          message: 'OTP sent successfully via SMS',
          twilioSid: twilioResult.sid
        })
      } else {
        // Fallback to local OTP if Twilio fails
        console.warn('Twilio failed, falling back to local OTP:', twilioResult.error)
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        otpStorage.set(mobile, {
          otp,
          timestamp: Date.now()
        })
        
        console.log(`🔐 Fallback OTP for ${mobile}: ${otp}`)
        cleanupExpiredOTPs()
        
        return NextResponse.json({ 
          success: true, 
          message: 'OTP sent (fallback mode)',
          devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
          fallback: true
        })
      }
    } catch (error) {
      console.error('Error with Twilio, using fallback:', error)
      
      // Fallback to local OTP generation
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      otpStorage.set(mobile, {
        otp,
        timestamp: Date.now()
      })
      
      console.log(`🔐 Fallback OTP for ${mobile}: ${otp}`)
      cleanupExpiredOTPs()
      
      return NextResponse.json({ 
        success: true, 
        message: 'OTP sent (fallback mode)',
        devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
        fallback: true
      })
    }

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}

function cleanupExpiredOTPs() {
  const now = Date.now()
  const fiveMinutes = 5 * 60 * 1000

  for (const [mobile, data] of otpStorage.entries()) {
    if (now - data.timestamp > fiveMinutes) {
      otpStorage.delete(mobile)
    }
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
