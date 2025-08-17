"use client"
import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function TestAuth() {
  const { data: session, status } = useSession()
  const [sessionData, setSessionData] = useState<any>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)

  useEffect(() => {
    // Test manual session fetch
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        console.log('Manual session fetch result:', data)
        setSessionData(data)
      })
      .catch(err => {
        console.error('Manual session fetch error:', err)
        setSessionError(err.message)
      })
  }, [])

  console.log('NextAuth session status:', status)
  console.log('NextAuth session data:', session)

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">NextAuth Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NextAuth useSession Hook */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">useSession Hook</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-sm ${
              status === 'authenticated' ? 'bg-green-100 text-green-800' :
              status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>{status}</span></p>
            
            {session && (
              <div>
                <p><strong>User ID:</strong> {session.user?.id || 'N/A'}</p>
                <p><strong>Name:</strong> {session.user?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {session.user?.email || 'N/A'}</p>
              </div>
            )}
            
            <div className="mt-4 space-x-2">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Manual Session Fetch */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Manual Session Fetch</h2>
          
          {sessionError && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-red-700 text-sm">Error: {sessionError}</p>
            </div>
          )}
          
          {sessionData && (
            <div>
              <p><strong>Response:</strong></p>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(sessionData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Test Login Form */}
      <div className="bg-white p-6 rounded-lg shadow border mt-6">
        <h2 className="text-lg font-semibold mb-4">Test Fallback Login</h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Test with fallback user credentials:</p>
          <div className="text-sm bg-blue-50 p-3 rounded">
            <p><strong>Email:</strong> demo@example.com</p>
            <p><strong>Password:</strong> demo123</p>
          </div>
          <button
            onClick={async () => {
              const result = await signIn('credentials', {
                email: 'demo@example.com',
                password: 'demo123',
                redirect: false
              })
              console.log('Test login result:', result)
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Login with Demo User
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-50 p-6 rounded-lg mt-6">
        <h2 className="text-lg font-semibold mb-4">Debug Information</h2>
        <div className="text-sm space-y-1">
          <p><strong>Current URL:</strong> {window.location.href}</p>
          <p><strong>NextAuth URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}</p>
          <p><strong>Session Strategy:</strong> JWT</p>
        </div>
      </div>
    </div>
  )
}
