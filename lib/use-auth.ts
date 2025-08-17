'use client'

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

export interface AuthUser {
  id: string
  name?: string | null
  email?: string | null
  role?: string
}

export interface UseAuthReturn {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isCustomer: boolean
  hasRole: (role: string) => boolean
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession()

  const authData = useMemo(() => {
    const isLoading = status === 'loading'
    const isAuthenticated = status === 'authenticated' && !!session?.user
    const user = session?.user || null
    const userRole = user?.role || 'customer'
    
    // Debug logging for auth state changes
    console.log('🔍 useAuth state:', {
      status,
      isLoading,
      isAuthenticated,
      userEmail: user?.email,
      userRole,
      isAdmin: userRole === 'admin'
    })
    
    return {
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        role: userRole
      } : null,
      isLoading,
      isAuthenticated,
      isAdmin: userRole === 'admin',
      isCustomer: userRole === 'customer',
      hasRole: (role: string) => userRole === role
    }
  }, [session, status])

  return authData
}

// Utility function to check if user is admin (for server-side usage)
export function isUserAdmin(user: any): boolean {
  return user?.role === 'admin'
}

// Utility function to check if user has specific role
export function userHasRole(user: any, role: string): boolean {
  return user?.role === role
}
