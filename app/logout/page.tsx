'use client'

import { signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { LogOut, Loader2 } from 'lucide-react'

export default function LogoutPage() {
  useEffect(() => {
    // Automatically sign out when page loads
    signOut({ 
      callbackUrl: '/auth',
      redirect: true 
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogOut className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Signing Out</h1>
        <p className="text-gray-600 mb-6">Please wait while we sign you out...</p>
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </div>
    </div>
  )
}
