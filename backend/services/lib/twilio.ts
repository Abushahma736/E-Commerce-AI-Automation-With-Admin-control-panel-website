import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID

if (!accountSid || !authToken || !verifySid) {
  console.error('Missing Twilio credentials in environment variables')
}

const client = twilio(accountSid, authToken)

export interface TwilioSendOTPResult {
  success: boolean
  error?: string
  sid?: string
}

export interface TwilioVerifyOTPResult {
  success: boolean
  error?: string
  valid?: boolean
}

export async function sendOTPViaTwilio(phoneNumber: string): Promise<TwilioSendOTPResult> {
  try {
    if (!client || !verifySid) {
      return {
        success: false,
        error: 'Twilio not configured properly'
      }
    }

    const verification = await client.verify.v2
      .services(verifySid)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms'
      })

    console.log(`📱 Twilio OTP sent to ${phoneNumber}, SID: ${verification.sid}`)

    return {
      success: true,
      sid: verification.sid
    }
  } catch (error: any) {
    console.error('Twilio send OTP error:', error)
    return {
      success: false,
      error: error.message || 'Failed to send OTP via Twilio'
    }
  }
}

export async function verifyOTPViaTwilio(phoneNumber: string, code: string): Promise<TwilioVerifyOTPResult> {
  try {
    if (!client || !verifySid) {
      return {
        success: false,
        error: 'Twilio not configured properly'
      }
    }

    const verificationCheck = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({
        to: phoneNumber,
        code: code
      })

    console.log(`🔍 Twilio OTP verification for ${phoneNumber}: ${verificationCheck.status}`)

    return {
      success: true,
      valid: verificationCheck.status === 'approved'
    }
  } catch (error: any) {
    console.error('Twilio verify OTP error:', error)
    return {
      success: false,
      error: error.message || 'Failed to verify OTP via Twilio'
    }
  }
}
