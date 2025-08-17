"use client"
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { 
  User, 
  MapPin, 
  Package, 
  CreditCard, 
  Settings, 
  Bell,
  ChevronRight,
  Shield,
  Heart,
  LogOut,
  Loader2,
  Database,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Activity
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface UserStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  wishlistItems: number
  addressesCount: number
  paymentMethodsCount: number
}

interface ConnectionStatus {
  mongodb: boolean
  database: string
  collections: string[]
  lastSync: string
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [userStats, setUserStats] = useState<UserStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    wishlistItems: 0,
    addressesCount: 0,
    paymentMethodsCount: 0
  })
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    mongodb: false,
    database: 'hack',
    collections: [],
    lastSync: 'Never'
  })
  const [syncLoading, setSyncLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth?redirect=/account')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchUserStats()
      checkDatabaseConnection()
    }
  }, [session])

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const stats = await response.json()
        setUserStats(stats)
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
    }
  }

  const checkDatabaseConnection = async () => {
    try {
      const response = await fetch('/api/database/status')
      if (response.ok) {
        const status = await response.json()
        setConnectionStatus(status)
      }
    } catch (error) {
      console.error('Failed to check database connection:', error)
    }
  }

  const syncWithDatabase = async () => {
    setSyncLoading(true)
    try {
      const response = await fetch('/api/database/sync', { method: 'POST' })
      if (response.ok) {
        await fetchUserStats()
        await checkDatabaseConnection()
      }
    } catch (error) {
      console.error('Failed to sync with database:', error)
    } finally {
      setSyncLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    await signOut({
      callbackUrl: '/'
    })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading your account...</span>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to auth page
  }

  return (
    <div className="py-8 bg-gray-50">
      <Container>
        <div className="max-w-7xl mx-auto">
          {/* Database Connection Status */}
          <div className="mb-6">
            <div className={`p-4 rounded-lg border ${
              connectionStatus.mongodb 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className={`w-5 h-5 ${
                    connectionStatus.mongodb ? 'text-green-600' : 'text-yellow-600'
                  }`} />
                  <div>
                    <h3 className={`font-medium ${
                      connectionStatus.mongodb ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      MongoDB Connection: {connectionStatus.mongodb ? 'Connected' : 'Disconnected'}
                    </h3>
                    <p className={`text-sm ${
                      connectionStatus.mongodb ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                      Database: {connectionStatus.database} | Collections: {connectionStatus.collections.length} | Last sync: {connectionStatus.lastSync}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={syncWithDatabase}
                  disabled={syncLoading}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {syncLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Sync
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="bg-white rounded-lg shadow border p-6 sticky top-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">
                      {session.user?.name || 'User'}
                    </h2>
                    <p className="text-sm text-gray-600 truncate">
                      {session.user?.email || 'No email'}
                    </p>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {connectionStatus.mongodb ? 'MongoDB Active' : 'Local Mode'}
                    </span>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  {[ 
                    { href: '/account', label: 'Dashboard', icon: Settings, active: true },
                    { href: '/account/orders', label: 'My Orders', icon: Package, count: userStats.totalOrders },
                    { href: '/account/profile', label: 'My Profile', icon: User },
                    { href: '/account/addresses', label: 'My Addresses', icon: MapPin, count: userStats.addressesCount },
                    { href: '/account/payment-methods', label: 'Payment Methods', icon: CreditCard, count: userStats.paymentMethodsCount },
                    { href: '/account/wishlist', label: 'Wishlist', icon: Heart, count: userStats.wishlistItems },
                    { href: '/account/notifications', label: 'Notifications', icon: Bell },
                    { href: '/account/security', label: 'Security', icon: Shield },
                  ].map((item, index) => (
                    <Link key={index} href={item.href}>
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                        item.active 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'hover:bg-green-50 text-gray-700 hover:text-green-700'
                      }`}>
                        <item.icon className="w-5 h-5" />
                        <span className="flex-1">{item.label}</span>
                        {item.count !== undefined && item.count > 0 && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                            {item.count}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </div>
                    </Link>
                  ))}
                </nav>
                
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <LogOut className="w-5 h-5" />
                    )}
                    {loading ? 'Signing out...' : 'Logout'}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              {/* Welcome Section */}
              <div className="bg-white rounded-lg shadow border p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Welcome back, {session.user?.name}!
                </h2>
                
                {/* Enhanced Account Information */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Complete Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-800 mb-2">Personal Details</h4>
                      <p><span className="font-medium">Full Name:</span> {session.user?.name || 'Not provided'}</p>
                      <p><span className="font-medium">Email Address:</span> {session.user?.email || 'Not provided'}</p>
                      <p><span className="font-medium">User ID:</span> <code className="bg-blue-100 px-1 rounded text-xs">{session.user?.id || 'N/A'}</code></p>
                      <p><span className="font-medium">Account Type:</span> {session.user?.id === '3' ? 'Admin User' : 'Standard User'}</p>
                      <p><span className="font-medium">Login Status:</span> <span className="text-green-600 font-semibold">✓ Active Session</span></p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-800 mb-2">System Information</h4>
                      <p><span className="font-medium">Authentication:</span> Email + Password</p>
                      <p><span className="font-medium">Database:</span> {connectionStatus.database} <span className={`px-2 py-1 rounded-full text-xs ${
                        connectionStatus.mongodb ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{connectionStatus.mongodb ? 'Connected' : 'Local Mode'}</span></p>
                      <p><span className="font-medium">Collections:</span> {connectionStatus.collections.length > 0 ? connectionStatus.collections.join(', ') : 'None detected'}</p>
                      <p><span className="font-medium">Last Sync:</span> {connectionStatus.lastSync}</p>
                      <p><span className="font-medium">Session Started:</span> {new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>
                  
                  {/* Account Permissions */}
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Account Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">✓ View Products</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">✓ Place Orders</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">✓ Manage Profile</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">✓ Access Dashboard</span>
                      {session.user?.id === '3' && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">✓ Admin Access</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Package className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-semibold">{userStats.totalOrders}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                    <div className="text-2xl font-semibold">{userStats.pendingOrders}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-semibold">{userStats.completedOrders}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Heart className="w-6 h-6 mx-auto mb-2 text-red-600" />
                    <div className="text-2xl font-semibold">{userStats.wishlistItems}</div>
                    <div className="text-sm text-gray-600">Wishlist</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  From your account dashboard, you can view your recent orders, manage your shipping and billing addresses, 
                  and edit your password and account details. All data is synchronized with your MongoDB database.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow border p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[ 
                    { 
                      href: '/account/orders', 
                      label: 'My Orders', 
                      icon: Package, 
                      description: 'View and track your orders',
                      count: userStats.totalOrders
                    },
                    { 
                      href: '/account/profile', 
                      label: 'My Profile', 
                      icon: User,
                      description: 'Update your personal information'
                    },
                    { 
                      href: '/account/addresses', 
                      label: 'My Addresses', 
                      icon: MapPin,
                      description: 'Manage shipping addresses',
                      count: userStats.addressesCount
                    },
                    { 
                      href: '/account/payment-methods', 
                      label: 'Payment Methods', 
                      icon: CreditCard,
                      description: 'Manage payment options',
                      count: userStats.paymentMethodsCount
                    },
                    { 
                      href: '/account/wishlist', 
                      label: 'Wishlist', 
                      icon: Heart,
                      description: 'View saved items',
                      count: userStats.wishlistItems
                    },
                    { 
                      href: '/account/security', 
                      label: 'Security', 
                      icon: Shield,
                      description: 'Security and privacy settings'
                    },
                  ].map((item, index) => (
                    <Link key={index} href={item.href}>
                      <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-all border hover:border-green-200 group">
                        <div className="flex items-start justify-between mb-2">
                          <item.icon className="w-8 h-8 text-green-600 group-hover:text-green-700" />
                          {item.count !== undefined && item.count > 0 && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                              {item.count}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold mb-1 group-hover:text-green-700">{item.label}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
