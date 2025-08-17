"use client"

import { useState, useEffect } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield,
  Edit3, 
  Save,
  X,
  ArrowLeft,
  Camera,
  Package,
  CreditCard,
  Heart,
  Settings,
  Bell,
  LogOut,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  address?: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
  }
  preferences?: {
    notifications: boolean
    marketing: boolean
    newsletter: boolean
  }
  joinedAt: string
}

interface UserStats {
  totalOrders: number
  totalSpent: number
  wishlistItems: number
  reviewsGiven: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [userStats, setUserStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    reviewsGiven: 0
  })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile')
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({})
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  useEffect(() => {
    // Check authentication and load profile
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => {
        if (!r.ok) {
          router.push('/login?redirect=/profile')
          return null
        }
        return r.json()
      })
      .then((data) => {
        if (data) {
          const profile: UserProfile = {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            dateOfBirth: data.dateOfBirth || '',
            gender: data.gender || '',
            address: data.address || {
              street: '',
              city: '',
              state: '',
              pincode: '',
              country: 'India'
            },
            preferences: data.preferences || {
              notifications: true,
              marketing: false,
              newsletter: true
            },
            joinedAt: data.createdAt || new Date().toISOString()
          }
          setUser(profile)
          setEditForm(profile)
          
          // Load user stats
          loadUserStats(data.id)
        }
        setLoading(false)
      })
      .catch(() => {
        router.push('/login?redirect=/profile')
        setLoading(false)
      })
  }, [router])

  const loadUserStats = async (userId: string) => {
    try {
      // Load orders to calculate stats
      const ordersResponse = await fetch('/api/orders', { credentials: 'include' })
      if (ordersResponse.ok) {
        const orders = await ordersResponse.json()
        const stats: UserStats = {
          totalOrders: orders.length,
          totalSpent: orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0),
          wishlistItems: 0, // TODO: implement wishlist
          reviewsGiven: 0 // TODO: implement reviews
        }
        setUserStats(stats)
      }
    } catch (error) {
      console.error('Failed to load user stats:', error)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return
    
    setSaving(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editForm)
      })
      
      if (response.ok) {
        const updatedUser = await response.json()
        setUser({ ...user, ...updatedUser })
        setEditing(false)
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }
    
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' })
      return
    }
    
    setSaving(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })
      
      if (response.ok) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setMessage({ type: 'success', text: 'Password changed successfully!' })
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Failed to change password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-brand-green transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                {message.text}
              </div>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow border overflow-hidden sticky top-8">
                {/* Profile Header */}
                <div className="p-6 bg-gradient-to-r from-brand-green to-emerald-600 text-white">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 relative">
                      <User className="w-10 h-10 text-white" />
                      <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Camera className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                    <h2 className="font-bold text-lg">{user.name}</h2>
                    <p className="text-green-100 text-sm">{user.email}</p>
                    <div className="mt-3 px-3 py-1 bg-white/20 rounded-full text-xs">
                      Member since {new Date(user.joinedAt).getFullYear()}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="p-6 border-b">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="font-bold text-lg text-gray-900">{userStats.totalOrders}</div>
                      <div className="text-xs text-gray-600">Orders</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-gray-900">₹{userStats.totalSpent.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Spent</div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="p-4">
                  <nav className="space-y-2">
                    {[
                      { key: 'profile', label: 'Profile Info', icon: User },
                      { key: 'security', label: 'Security', icon: Shield },
                      { key: 'preferences', label: 'Preferences', icon: Settings },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.key
                            ? 'bg-brand-green text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Quick Actions */}
                <div className="p-4 border-t">
                  <div className="space-y-2">
                    <Link href="/orders" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                    <Link href="/wishlist" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow border">
                {/* Tab Content */}
                {activeTab === 'profile' && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold">Profile Information</h2>
                      {!editing ? (
                        <Button 
                          onClick={() => setEditing(true)}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="flex items-center gap-2"
                          >
                            {saving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            Save Changes
                          </Button>
                          <Button 
                            onClick={() => {
                              setEditing(false)
                              setEditForm(user)
                            }}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-900 mb-4">Personal Details</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            value={editing ? editForm.name || '' : user.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent disabled:bg-gray-50"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={editing ? editForm.phone || '' : user.phone || ''}
                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                            disabled={!editing}
                            placeholder="+91 98765 43210"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent disabled:bg-gray-50"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                          <input
                            type="date"
                            value={editing ? editForm.dateOfBirth || '' : user.dateOfBirth || ''}
                            onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent disabled:bg-gray-50"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                          <select
                            value={editing ? editForm.gender || '' : user.gender || ''}
                            onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent disabled:bg-gray-50"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-900 mb-4">Address Information</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                          <textarea
                            value={editing ? editForm.address?.street || '' : user.address?.street || ''}
                            onChange={(e) => setEditForm({
                              ...editForm, 
                              address: {...editForm.address, street: e.target.value}
                            })}
                            disabled={!editing}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent disabled:bg-gray-50"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <input
                              type="text"
                              value={editing ? editForm.address?.city || '' : user.address?.city || ''}
                              onChange={(e) => setEditForm({
                                ...editForm, 
                                address: {...editForm.address, city: e.target.value}
                              })}
                              disabled={!editing}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent disabled:bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                            <input
                              type="text"
                              value={editing ? editForm.address?.state || '' : user.address?.state || ''}
                              onChange={(e) => setEditForm({
                                ...editForm, 
                                address: {...editForm.address, state: e.target.value}
                              })}
                              disabled={!editing}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent disabled:bg-gray-50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                            <input
                              type="text"
                              value={editing ? editForm.address?.pincode || '' : user.address?.pincode || ''}
                              onChange={(e) => setEditForm({
                                ...editForm, 
                                address: {...editForm.address, pincode: e.target.value}
                              })}
                              disabled={!editing}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent disabled:bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                            <input
                              type="text"
                              value={editing ? editForm.address?.country || '' : user.address?.country || ''}
                              onChange={(e) => setEditForm({
                                ...editForm, 
                                address: {...editForm.address, country: e.target.value}
                              })}
                              disabled={!editing}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent disabled:bg-gray-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                    
                    <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                            required
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPasswords.current ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            required
                            minLength={6}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPasswords.new ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                            required
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPasswords.confirm ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Shield className="w-4 h-4" />
                        )}
                        Change Password
                      </Button>
                    </form>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Preferences</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-4">Notifications</h3>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={user.preferences?.notifications || false}
                              onChange={(e) => setUser({
                                ...user,
                                preferences: { ...user.preferences, notifications: e.target.checked }
                              })}
                              className="w-4 h-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"
                            />
                            <span className="ml-3 text-gray-700">Order status notifications</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={user.preferences?.newsletter || false}
                              onChange={(e) => setUser({
                                ...user,
                                preferences: { ...user.preferences, newsletter: e.target.checked }
                              })}
                              className="w-4 h-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"
                            />
                            <span className="ml-3 text-gray-700">Newsletter and updates</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={user.preferences?.marketing || false}
                              onChange={(e) => setUser({
                                ...user,
                                preferences: { ...user.preferences, marketing: e.target.checked }
                              })}
                              className="w-4 h-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"
                            />
                            <span className="ml-3 text-gray-700">Marketing and promotional offers</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
