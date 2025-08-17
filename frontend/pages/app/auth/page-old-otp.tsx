"use client"
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import { Mail, Lock, ArrowRight, Shield, CheckCircle, User, Phone, Eye, EyeOff } from 'lucide-react'

interface OTPInputProps {
  length: number
  onComplete: (otp: string) => void
  value: string
  onChange: (otp: string) => void
}

function OTPInput({ length, onComplete, value, onChange }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''))

  useEffect(() => {
    if (value === '') {
      setOtp(Array(length).fill(''))
    }
  }, [value, length])

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = val
    setOtp(newOtp)
    
    const otpString = newOtp.join('')
    onChange(otpString)
    
    if (val && index < length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
    
    if (otpString.length === length) {
      onComplete(otpString)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  return (
    <div className="flex gap-3 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-colors"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  )
}

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [googleLoading, setGoogleLoading] = useState(false)

  const redirectUrl = searchParams.get('redirect') || '/account'

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const validateMobile = (phone: string): boolean => {
    const indianMobileRegex = /^[6-9]\d{9}$/
    return indianMobileRegex.test(phone)
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError(null)
    
    try {
      const result = await signIn('google', {
        callbackUrl: redirectUrl,
        redirect: false
      })
      
      if (result?.error) {
        setError('Google sign-in failed. Please try again.')
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (err) {
      setError('Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const sendOTP = async () => {
    if (!validateMobile(mobile)) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: `+91${mobile}` })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }

      // Show different messages based on OTP method
      if (data.bypassed) {
        setError(`⚠️ OTP Bypassed: Use ${data.devOtp} to login`)
      } else if (data.fallback) {
        setError(`📱 SMS failed, using fallback mode. OTP: ${data.devOtp}`)
      } else if (data.twilioSid) {
        // Real SMS sent via Twilio
        console.log(`📱 SMS sent via Twilio (SID: ${data.twilioSid})`)
      }

      setStep('otp')
      setCountdown(30)
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // First verify OTP
      const verifyResponse = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mobile: `+91${mobile}`, 
          otp,
          username: username.trim()
        })
      })

      const verifyData = await verifyResponse.json()

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Invalid OTP')
      }

      // Now sign in with NextAuth
      const result = await signIn('credentials', {
        mobile: `+91${mobile}`,
        username: username.trim(),
        otp,
        loginType: 'otp',
        callbackUrl: redirectUrl,
        redirect: false
      })

      if (result?.error) {
        throw new Error('Authentication failed')
      }

      setStep('success')
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(redirectUrl)
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = async () => {
    setResendLoading(true)
    setOtp('')
    setError(null)

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: `+91${mobile}` })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP')
      }

      setCountdown(30)
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h1>
          <p className="text-gray-600 mb-4">Welcome to ESSE Naturals</p>
          <div className="animate-spin h-6 w-6 border-2 border-brand-green border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-green to-emerald-600 p-6 text-white text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">Secure Login</h1>
          <p className="text-green-100 text-sm mt-1">Enter your mobile number to continue</p>
        </div>

        <div className="p-6">
          {step === 'phone' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      setError(null)
                    }}
                    placeholder="Enter your username"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-colors text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-gray-500">+91</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      if (value.length <= 10) {
                        setMobile(value)
                        setError(null)
                      }
                    }}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-20 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-colors text-lg"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  We'll send you a 6-digit OTP for verification
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={sendOTP}
                disabled={loading || mobile.length !== 10 || !username.trim()}
                className="w-full bg-brand-green text-white py-3 rounded-lg font-medium hover:bg-brand-green/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
              >
                {googleLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter OTP</h2>
                <p className="text-gray-600 text-sm">
                  We've sent a 6-digit code to
                  <br />
                  <span className="font-medium text-brand-green">+91 {mobile}</span>
                </p>
              </div>

              <div className="space-y-4">
                <OTPInput
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  onComplete={(otpValue) => setOtp(otpValue)}
                />

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 text-center">
                    {error}
                  </div>
                )}

                <button
                  onClick={verifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-brand-green text-white py-3 rounded-lg font-medium hover:bg-brand-green/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    'Verify OTP'
                  )}
                </button>

                <div className="text-center">
                  <button
                    onClick={() => setStep('phone')}
                    className="text-sm text-gray-600 hover:text-brand-green transition-colors"
                  >
                    Change mobile number
                  </button>
                </div>

                <div className="text-center pt-4 border-t">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend OTP in {countdown}s
                    </p>
                  ) : (
                    <button
                      onClick={resendOTP}
                      disabled={resendLoading}
                      className="text-sm text-brand-green hover:text-brand-green/80 font-medium flex items-center gap-2 mx-auto disabled:opacity-50"
                    >
                      {resendLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
