'use client'

import Link from 'next/link'
import { Shield, Settings, BarChart3, Users, Package, Tag, FileText, CheckCircle, MessageCircle, Bot } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">ESSE Naturals & Nutrition Management</p>
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">Direct Access Mode</span>
                  </div>
                </div>
              </div>
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 underline">View Site</Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center gap-1 overflow-x-auto py-2">
              <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/admin/products" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <Package className="h-4 w-4" />
                Products
              </Link>
              <Link href="/admin/categories" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <Tag className="h-4 w-4" />
                Categories
              </Link>
              <Link href="/admin/orders" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <CheckCircle className="h-4 w-4" />
                Orders
              </Link>
              <Link href="/admin/users" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <Users className="h-4 w-4" />
                Users
              </Link>
              <Link href="/admin/articles" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <FileText className="h-4 w-4" />
                Articles
              </Link>
              <Link href="/admin/analytics" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
              <Link href="/admin/contacts" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <MessageCircle className="h-4 w-4" />
                Contacts
              </Link>
              <Link href="/ai-dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 font-medium transition-colors ml-2">
                <Bot className="h-4 w-4" />
                🤖 AI Hub
              </Link>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto p-6">
          {children}
        </div>
      </div>
  )
}



