'use client'

import { useAuth } from '@/lib/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AlertTriangle, Lock, Loader2 } from 'lucide-react'

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { user, isAdmin, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Debug logging for admin access
  useEffect(() => {
    console.log('🛡️ AdminGuard Debug:', {
      isLoading,
      isAuthenticated,
      isAdmin,
      userRole: user?.role,
      userEmail: user?.email
    })
  }, [isLoading, isAuthenticated, isAdmin, user])

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log('🛡️ AdminGuard: Redirecting to login - not authenticated')
      router.push('/auth?next=/admin')
      return
    }

    // Redirect to home if authenticated but not admin
    if (!isLoading && isAuthenticated && !isAdmin) {
      console.log('🛡️ AdminGuard: Access denied - user role:', user?.role)
      router.push('/?error=unauthorized')
      return
    }

    if (!isLoading && isAuthenticated && isAdmin) {
      console.log('✅ AdminGuard: Admin access granted for:', user?.email)
    }
  }, [isLoading, isAuthenticated, isAdmin, router, user])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized message
  if (!isAuthenticated || !isAdmin) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You need administrator privileges to access this area.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Go to Home
            </button>
            <button
              onClick={() => router.push('/auth')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Login as Admin
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render children if admin
  return <>{children}</>
}

// Helper component for inline admin checks
export function AdminOnly({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  const { isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-4 rounded" />
  }

  if (!isAdmin) {
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}
