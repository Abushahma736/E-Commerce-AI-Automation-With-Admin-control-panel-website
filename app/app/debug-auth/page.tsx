'use client'

import { useSession } from 'next-auth/react'
import { useAuth } from '@/lib/use-auth'
import { useState, useEffect } from 'react'
import { Shield, User, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'

export default function AuthDebugPage() {
  const { data: session, status } = useSession()
  const { user, isAdmin, isAuthenticated, isLoading } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    const info = {
      timestamp: new Date().toISOString(),
      nextAuthSession: {
        status,
        user: session?.user,
        expires: session?.expires
      },
      useAuthHook: {
        user,
        isAuthenticated,
        isAdmin,
        isLoading
      },
      rawSessionData: session
    }
    setDebugInfo(info)
    console.log('🔍 Auth Debug Info:', info)
  }, [session, status, user, isAuthenticated, isAdmin, isLoading])

  const adminCredentials = [
    { email: 'admin@esse.com', password: 'admin123' },
    { email: 'admin@example.com', password: 'admin123' },
    { email: 'superadmin@esse.com', password: 'super123' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication Debug</h1>
            <p className="text-gray-600">Check your current authentication status and role</p>
          </div>

          {/* Current Status */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Current Session Status
              </h2>
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
                <div className="flex justify-between">
                  <span className="font-medium">Authenticated:</span>
                  <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                    {isAuthenticated ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Is Admin:</span>
                  <span className={isAdmin ? 'text-green-600' : 'text-red-600'}>
                    {isAdmin ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">User Role:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {user?.role || 'undefined'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                User Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {user?.email || 'Not logged in'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {user?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">User ID:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {user?.id || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Test Credentials */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">👑 Admin Test Credentials</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {adminCredentials.map((cred, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="text-sm">
                    <div className="font-medium text-purple-700">Admin {index + 1}</div>
                    <div className="mt-2 space-y-1">
                      <div className="text-gray-600">Email:</div>
                      <div className="font-mono text-sm bg-gray-100 p-1 rounded">{cred.email}</div>
                      <div className="text-gray-600 mt-2">Password:</div>
                      <div className="font-mono text-sm bg-gray-100 p-1 rounded">{cred.password}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Debug Information */}
          {debugInfo && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Raw Debug Information
              </h2>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-auto max-h-96">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <a
              href="/auth"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Go to Login
            </a>
            <a
              href="/admin"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Try Admin Panel
            </a>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
