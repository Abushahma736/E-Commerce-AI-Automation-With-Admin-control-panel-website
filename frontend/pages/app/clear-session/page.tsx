'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RefreshCw, LogOut, Shield, CheckCircle } from 'lucide-react'

export default function ClearSessionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isClearing, setIsClearing] = useState(false)
  const [sessionCleared, setSessionCleared] = useState(false)

  const clearSession = async () => {
    setIsClearing(true)
    try {
      // Clear NextAuth session
      await signOut({ redirect: false })
      
      // Clear browser storage
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
        
        // Clear cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
        })
      }
      
      setSessionCleared(true)
      setTimeout(() => {
        router.push('/auth')
      }, 2000)
      
    } catch (error) {
      console.error('Error clearing session:', error)
    } finally {
      setIsClearing(false)
    }
  }

  const adminCredentials = [
    { email: 'admin@esse.com', password: 'admin123', name: 'Primary ESSE Admin' },
    { email: 'admin@example.com', password: 'admin123', name: 'Secondary Admin' },
    { email: 'superadmin@esse.com', password: 'super123', name: 'Super Admin' }
  ]

  if (sessionCleared) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Cleared!</h1>
          <p className="text-gray-600 mb-4">Redirecting to login page...</p>
          <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <RefreshCw className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Clear Session & Fix Login</h1>
            <p className="text-gray-600">If you're having admin login issues, clear your session and try again</p>
          </div>

          {/* Current Session Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Current Session Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  status === 'authenticated' ? 'bg-green-100 text-green-700' :
                  status === 'loading' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {status}
                </span>
              </div>
              {session?.user && (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {session.user.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Role:</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      session.user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {session.user.role || 'undefined'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Admin Credentials */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">👑 Admin Login Credentials</h2>
            <div className="space-y-4">
              {adminCredentials.map((cred, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="text-sm">
                    <div className="font-medium text-purple-700 mb-2">{cred.name}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <div className="font-mono text-sm bg-gray-100 p-1 rounded mt-1">{cred.email}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Password:</span>
                        <div className="font-mono text-sm bg-gray-100 p-1 rounded mt-1">{cred.password}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={clearSession}
              disabled={isClearing}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isClearing ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Clearing Session...
                </>
              ) : (
                <>
                  <LogOut className="h-5 w-5" />
                  Clear Session & Logout
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-4">
              <a
                href="/auth"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-center"
              >
                Go to Login
              </a>
              <a
                href="/debug-auth"
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-center"
              >
                Debug Auth
              </a>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">🔧 How to Fix Admin Login:</h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Click "Clear Session & Logout" above</li>
              <li>Wait for redirect to login page</li>
              <li>Use any admin credentials shown above</li>
              <li>After login, try accessing /admin again</li>
              <li>Check browser console for debug logs</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
