import { Suspense } from 'react'
import Link from 'next/link'
import { ShoppingCart, Package, Users, BarChart3, Settings, MessageCircle, CheckCircle, Brain, Sparkles, Mail, TrendingUp, Share2, Instagram } from 'lucide-react'
import AIStatusWidget from '@/components/admin/AIStatusWidget'

export default function AdminHome() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Products</p>
              <p className="text-2xl font-bold text-gray-900">456</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">789</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Auto Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">98%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Products Management */}
        <Link href="/admin/products" className="group">
          <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <Package className="h-10 w-10 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">Products</h3>
                <p className="text-sm text-gray-600">Manage your product inventory</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">Create, edit, and organize products</div>
          </div>
        </Link>

        {/* Categories Management */}
        <Link href="/admin/categories" className="group">
          <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <BarChart3 className="h-10 w-10 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">Categories</h3>
                <p className="text-sm text-gray-600">Organize product categories</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">Create and manage categories</div>
          </div>
        </Link>

        {/* Orders Management */}
        <Link href="/admin/orders" className="group">
          <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <ShoppingCart className="h-10 w-10 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">Orders</h3>
                <p className="text-sm text-gray-600">Track and manage orders</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">View, update, and fulfill orders</div>
          </div>
        </Link>

        {/* Users Management */}
        <Link href="/admin/users" className="group">
          <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <Users className="h-10 w-10 text-indigo-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">Users</h3>
                <p className="text-sm text-gray-600">Manage user accounts</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">View and manage customer accounts</div>
          </div>
        </Link>

        {/* Analytics */}
        <Link href="/admin/analytics" className="group">
          <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <BarChart3 className="h-10 w-10 text-orange-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600">Analytics</h3>
                <p className="text-sm text-gray-600">Sales and performance metrics</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">Track sales, traffic, and trends</div>
          </div>
        </Link>

        {/* Auto Confirm Settings */}
        <Link href="/admin/auto-confirm" className="group">
          <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600">Auto Confirm</h3>
                <p className="text-sm text-gray-600">Automated order processing</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">Configure automatic order confirmation</div>
          </div>
        </Link>

        {/* AI Management Center - NEW */}
        <Link href="/admin/ai-management" className="group">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow border-2 border-blue-200 hover:shadow-lg transition-all hover:border-blue-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 flex items-center">
                  AI Management Center 
                  <Sparkles className="h-4 w-4 ml-2 text-yellow-500" />
                </h3>
                <p className="text-sm text-gray-600">Complete AI control dashboard</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">Control all 8 AI features from one place</div>
            <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
              🎛️ Full Control
            </div>
          </div>
        </Link>

        {/* AI Features Guide */}
        <Link href="/admin/ai-guide" className="group">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg shadow border-2 border-green-200 hover:shadow-lg transition-all hover:border-green-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-full">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 flex items-center">
                  AI Features Guide
                </h3>
                <p className="text-sm text-gray-600">Complete AI automation guide</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">Learn how to use 8 powerful AI features</div>
            <div className="mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
              📚 Documentation
            </div>
          </div>
        </Link>

        {/* Marketing Management */}
        <Link href="/admin/email-marketing" className="group">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg shadow border-2 border-orange-200 hover:shadow-lg transition-all hover:border-orange-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 flex items-center">
                  Email Marketing
                  <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
                </h3>
                <p className="text-sm text-gray-600">Complete email marketing system</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">Create, track & manage email campaigns</div>
            <div className="mt-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full inline-block">
              📧 Email Campaigns & Analytics
            </div>
          </div>
        </Link>

        {/* Social Media Marketing */}
        <Link href="/admin/social-media" className="group">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg shadow border-2 border-pink-200 hover:shadow-lg transition-all hover:border-pink-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-full">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 flex items-center">
                  Social Media Marketing
                  <Instagram className="h-4 w-4 ml-2 text-pink-500" />
                </h3>
                <p className="text-sm text-gray-600">Multi-platform social campaigns</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">Manage posts, campaigns & social analytics</div>
            <div className="mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
              📱 Social Posts & Campaigns
            </div>
          </div>
        </Link>
      </div>

      {/* Bottom Section - AI Status and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Status Widget */}
        <div className="lg:col-span-1">
          <AIStatusWidget className="h-full" />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Order #1234 automatically confirmed</p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Package className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New product "Vitamin D3" added</p>
                <p className="text-sm text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New customer registered</p>
                <p className="text-sm text-gray-500">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}


