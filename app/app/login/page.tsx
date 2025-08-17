"use client"
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Shield, CheckCircle, User, Phone, Eye, EyeOff, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const redirectUrl = searchParams.get('redirect') || '/checkout'

  // Set initial mode based on URL parameter
  useEffect(() => {
    const urlMode = searchParams.get('mode')
    if (urlMode === 'signup' || urlMode === 'login') {
      setMode(urlMode)
    }
  }, [searchParams])

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    return /^[6-9]\d{9}$/.test(phone)
  }

  const validateForm = () => {
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        setError('Please enter your full name')
        return false
      }
      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address')
        return false
      }
      if (!validatePhone(formData.phone)) {
        setError('Please enter a valid 10-digit Indian mobile number')
        return false
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return false
      }
    } else {
      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address')
        return false
      }
      if (!formData.password) {
        setError('Please enter your password')
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        // Register new user
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: `+91${formData.phone}`,
            password: formData.password
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed')
        }

        // Auto-login after successful registration
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })

        if (loginResponse.ok) {
          setSuccess(true)
          setTimeout(() => {
            router.push(redirectUrl)
          }, 2000)
        } else {
          throw new Error('Registration successful, but auto-login failed. Please login manually.')
        }

      } else {
        // Login existing user
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Login failed')
        }

        setSuccess(true)
        setTimeout(() => {
          router.push(redirectUrl)
        }, 1500)
      }

    } catch (err: any) {
      setError(err.message || `Failed to ${mode === 'signup' ? 'register' : 'login'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border p-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'signup' ? 'Welcome to ESSE!' : 'Welcome Back!'}
          </h1>
          <p className="text-gray-600 mb-4">
            {mode === 'signup' ? 'Account created successfully' : 'Login successful'}
          </p>
          <div className="flex items-center justify-center gap-2 text-brand-green">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span>Redirecting to checkout...</span>
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-green via-emerald-600 to-teal-700 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <Shield className="h-12 w-12 text-white" />
            <span className="text-3xl font-serif font-bold text-white">ESSE Naturals</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-6 leading-tight">
            Your Gateway to 
            <span className="block text-green-200">Natural Wellness</span>
          </h1>
          
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Join thousands of customers who trust ESSE for premium natural products, 
            essential oils, and wellness solutions.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <span className="text-green-100">100% Organic & Certified Products</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <span className="text-green-100">Fast & Secure Checkout Process</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <span className="text-green-100">Free Delivery on Orders Above ₹999</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-green to-emerald-600 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-green-100">
              {mode === 'signup' 
                ? 'Join the natural wellness community' 
                : 'Sign in to continue your journey'
              }
            </p>
          </div>

          <div className="p-8">
            {/* Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  mode === 'login' 
                    ? 'bg-white text-brand-green shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  mode === 'signup' 
                    ? 'bg-white text-brand-green shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field (Signup only) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Phone Field (Signup only) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="ml-2 text-gray-500 font-medium">+91</span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        if (value.length <= 10) {
                          handleInputChange('phone', value)
                        }
                      }}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full pl-24 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Signup only) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 animate-shake">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {error}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-brand-green to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-brand-green/90 hover:to-emerald-600/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    {mode === 'signup' ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {/* Additional Options */}
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  {mode === 'signup' 
                    ? 'By creating an account, you agree to our Terms of Service and Privacy Policy' 
                    : 'Forgot your password? Contact support'
                  }
                </p>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span>Continue shopping</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                
                <Link 
                  href="/"
                  className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green/80 font-medium transition-colors"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Back to Shopping
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}



