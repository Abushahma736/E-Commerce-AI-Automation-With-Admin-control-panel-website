"use client"
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Mail, Lock, ArrowRight, Shield, CheckCircle, User, Phone, Eye, EyeOff } from 'lucide-react'

export default function AuthPage() {
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
  const redirectUrl = searchParams.get('redirect') || '/'

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    return /^[6-9]\d{9}$/.test(phone)
  }

  const validateForm = () => {
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        setError('Please enter your name')
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
          throw new Error(data.error || 'Failed to register')
        }

        // Automatically sign in after successful registration
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        })

        console.log('Registration login result:', result)

        if (result?.error) {
          throw new Error('Registration successful, but login failed. Please try logging in.')
        }

        if (result?.ok) {
          setSuccess(true)
          // Use router.push for better NextAuth integration
          setTimeout(() => {
            router.push(redirectUrl)
          }, 1500)
        } else {
          throw new Error('Login failed after registration')
        }

      } else {
        // Login existing user
        console.log('Attempting login with:', formData.email)
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        })

        console.log('Login result:', result)

        if (result?.error) {
          console.error('Login error:', result.error)
          // Handle specific NextAuth errors with more helpful messages
          if (result.error === 'CredentialsSignin') {
            throw new Error('Invalid email or password. Please check your credentials and try again.')
          } else if (result.error === 'CallbackRouteError') {
            throw new Error('Authentication error occurred. Please try again.')
          } else if (result.error === 'Configuration') {
            throw new Error('Authentication service error. Please try again later.')
          } else if (result.error === 'AccessDenied') {
            throw new Error('Access denied. Please contact support if this continues.')
          } else if (result.error === 'Verification') {
            throw new Error('Verification failed. Please check your credentials.')
          } else {
            throw new Error(`Login failed: ${result.error}. Please try again.`)
          }
        }

        if (result?.ok) {
          setSuccess(true)
          // Use router.push for better NextAuth integration
          setTimeout(() => {
            router.push(redirectUrl)
          }, 1500)
        } else {
          throw new Error('Login failed - please try again')
        }
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
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'signup' ? 'Registration' : 'Login'} Successful!
          </h1>
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
          <h1 className="text-xl font-bold">
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-green-100 text-sm mt-1">
            {mode === 'signup' 
              ? 'Join ESSE Naturals today' 
              : 'Sign in to your account'
            }
          </p>
        </div>

        <div className="p-6">
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'login' 
                  ? 'bg-white text-brand-green shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'signup' 
                  ? 'bg-white text-brand-green shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-colors"
                />
              </div>
            </div>

            {/* Phone Field (Signup only) */}
            {mode === 'signup' && (
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
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      if (value.length <= 10) {
                        handleInputChange('phone', value)
                      }
                    }}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-20 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green text-white py-3 rounded-lg font-medium hover:bg-brand-green/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  {mode === 'signup' ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>


            {/* Demo Credentials for Testing */}
            {mode === 'login' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-xs font-medium text-blue-800 mb-2">Demo Credentials for Testing:</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>Email: <code className="bg-white px-1 rounded">demo@example.com</code> | Password: <code className="bg-white px-1 rounded">demo123</code></div>
                  <div>Email: <code className="bg-white px-1 rounded">user@example.com</code> | Password: <code className="bg-white px-1 rounded">user123</code></div>
                  <div>Admin: <code className="bg-white px-1 rounded">admin@example.com</code> | Password: <code className="bg-white px-1 rounded">admin123</code></div>
                </div>
              </div>
            )}

            {/* Note about authentication */}
            <div className="text-center text-sm text-gray-500 mt-4">
              {mode === 'signup' 
                ? 'By creating an account, you agree to our Terms of Service and Privacy Policy' 
                : 'Don\'t have an account? Click Sign Up above'
              }
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
