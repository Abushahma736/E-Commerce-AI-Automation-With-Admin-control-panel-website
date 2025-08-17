'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Bot, 
  Brain, 
  Settings, 
  Activity, 
  ToggleLeft, 
  ToggleRight,
  MessageSquare,
  Target,
  Eye,
  Mic,
  Shield,
  Database,
  TrendingUp,
  Package,
  Phone,
  Mail,
  Share2,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Monitor,
  Zap,
  BarChart3
} from 'lucide-react'

interface AIFeature {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: 'active' | 'inactive' | 'maintenance'
  autoMode: boolean
  performance: number
  lastActive: Date
  requests: number
  errors: number
  category: 'automation' | 'marketing' | 'security' | 'analytics'
  adminPage?: string
}

export default function AIManagementPage() {
  const [features, setFeatures] = useState<AIFeature[]>([
    {
      id: 'chatbot',
      name: 'AI Chatbot',
      description: 'Intelligent customer support and product recommendations',
      icon: MessageSquare,
      status: 'active',
      autoMode: true,
      performance: 94,
      lastActive: new Date(),
      requests: 1247,
      errors: 3,
      category: 'automation',
      adminPage: '/admin/chatbot-config'
    },
    {
      id: 'recommendations',
      name: 'Smart Recommendations',
      description: 'AI-powered product recommendations based on user behavior',
      icon: Target,
      status: 'active',
      autoMode: true,
      performance: 89,
      lastActive: new Date(),
      requests: 3421,
      errors: 12,
      category: 'marketing',
      adminPage: '/admin/recommendations'
    },
    {
      id: 'visual-recognition',
      name: 'Visual AI Recognition',
      description: 'Automatic product image analysis and categorization',
      icon: Eye,
      status: 'active',
      autoMode: true,
      performance: 91,
      lastActive: new Date(),
      requests: 567,
      errors: 5,
      category: 'automation'
    },
    {
      id: 'voice-assistant',
      name: 'Voice Assistant',
      description: 'AI-powered voice calls for order confirmations',
      icon: Mic,
      status: 'inactive',
      autoMode: false,
      performance: 87,
      lastActive: new Date(Date.now() - 3600000),
      requests: 234,
      errors: 8,
      category: 'automation'
    },
    {
      id: 'fraud-detection',
      name: 'Fraud Detection',
      description: 'Real-time fraud detection and prevention system',
      icon: Shield,
      status: 'active',
      autoMode: true,
      performance: 98,
      lastActive: new Date(),
      requests: 892,
      errors: 1,
      category: 'security',
      adminPage: '/admin/fraud-detection'
    },
    {
      id: 'inventory-ai',
      name: 'Inventory AI',
      description: 'Smart inventory management and stock predictions',
      icon: Database,
      status: 'active',
      autoMode: true,
      performance: 92,
      lastActive: new Date(),
      requests: 445,
      errors: 2,
      category: 'automation',
      adminPage: '/admin/inventory-ai'
    },
    {
      id: 'marketing-automation',
      name: 'Marketing Automation',
      description: 'Automated social media posts and email campaigns',
      icon: TrendingUp,
      status: 'active',
      autoMode: true,
      performance: 85,
      lastActive: new Date(),
      requests: 678,
      errors: 15,
      category: 'marketing',
      adminPage: '/admin/marketing-automation'
    },
    {
      id: 'auto-confirm',
      name: 'Auto Order Confirmation',
      description: 'Automatic order processing and confirmation system',
      icon: Package,
      status: 'active',
      autoMode: true,
      performance: 96,
      lastActive: new Date(),
      requests: 1893,
      errors: 4,
      category: 'automation',
      adminPage: '/admin/auto-confirm'
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [bulkAction, setBulkAction] = useState<string>('')
  const [systemHealth, setSystemHealth] = useState({
    overall: 94,
    cpu: 45,
    memory: 62,
    network: 89
  })

  const toggleFeature = (featureId: string) => {
    setFeatures(prev => 
      prev.map(feature => 
        feature.id === featureId 
          ? { 
              ...feature, 
              status: feature.status === 'active' ? 'inactive' : 'active',
              lastActive: feature.status === 'inactive' ? new Date() : feature.lastActive
            }
          : feature
      )
    )
  }

  const toggleAutoMode = (featureId: string) => {
    setFeatures(prev => 
      prev.map(feature => 
        feature.id === featureId 
          ? { ...feature, autoMode: !feature.autoMode }
          : feature
      )
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      case 'maintenance': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'automation': return Bot
      case 'marketing': return TrendingUp
      case 'security': return Shield
      case 'analytics': return BarChart3
      default: return Settings
    }
  }

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(f => f.category === selectedCategory)

  const activeFeatures = features.filter(f => f.status === 'active').length
  const totalRequests = features.reduce((sum, f) => sum + f.requests, 0)
  const totalErrors = features.reduce((sum, f) => sum + f.errors, 0)
  const avgPerformance = Math.round(features.reduce((sum, f) => sum + f.performance, 0) / features.length)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Management Center</h1>
            <p className="text-lg text-gray-600">Complete control over all AI features and automation</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{activeFeatures}/{features.length} Active</span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh All
          </button>
        </div>
      </div>

      {/* System Health Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{avgPerformance}%</span>
          </div>
          <p className="text-sm text-gray-600">Overall Performance</p>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 rounded-full h-2 transition-all"
              style={{ width: `${avgPerformance}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{totalRequests.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-600">Total AI Requests</p>
          <p className="text-xs text-green-600 mt-1">+12% from yesterday</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{totalErrors}</span>
          </div>
          <p className="text-sm text-gray-600">Total Errors (24h)</p>
          <p className="text-xs text-red-600 mt-1">{((totalErrors / totalRequests) * 100).toFixed(2)}% error rate</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Monitor className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{systemHealth.cpu}%</span>
          </div>
          <p className="text-sm text-gray-600">System CPU Usage</p>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 rounded-full h-2 transition-all"
              style={{ width: `${systemHealth.cpu}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">AI Features Control</h2>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Category:</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Categories</option>
                <option value="automation">Automation</option>
                <option value="marketing">Marketing</option>
                <option value="security">Security</option>
                <option value="analytics">Analytics</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Bulk Action:</label>
              <select 
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Select Action</option>
                <option value="enable-all">Enable All</option>
                <option value="disable-all">Disable All</option>
                <option value="enable-auto">Enable Auto Mode</option>
                <option value="disable-auto">Disable Auto Mode</option>
              </select>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFeatures.map((feature) => {
            const IconComponent = feature.icon
            const CategoryIcon = getCategoryIcon(feature.category)
            
            return (
              <div 
                key={feature.id}
                className={`p-6 rounded-xl border-2 transition-all ${
                  feature.status === 'active' 
                    ? 'border-green-200 bg-green-50/30' 
                    : 'border-gray-200 bg-gray-50/30'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      feature.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${
                        feature.status === 'active' ? 'text-green-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.name}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(feature.status)}`}>
                      <CategoryIcon className="h-3 w-3" />
                      {feature.category}
                    </span>
                  </div>
                </div>

                {/* Feature Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{feature.performance}%</p>
                    <p className="text-xs text-gray-600">Performance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{feature.requests.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Requests</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{feature.errors}</p>
                    <p className="text-xs text-gray-600">Errors</p>
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Performance</span>
                    <span className="text-xs text-gray-600">{feature.performance}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`rounded-full h-2 transition-all ${
                        feature.performance >= 90 ? 'bg-green-500' :
                        feature.performance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${feature.performance}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleFeature(feature.id)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        feature.status === 'active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {feature.status === 'active' ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                      {feature.status === 'active' ? 'Active' : 'Inactive'}
                    </button>

                    <button
                      onClick={() => toggleAutoMode(feature.id)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        feature.autoMode
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Bot className="h-4 w-4" />
                      {feature.autoMode ? 'Auto' : 'Manual'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {feature.adminPage && (
                      <Link
                        href={feature.adminPage}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Configure"
                      >
                        <Settings className="h-4 w-4" />
                      </Link>
                    )}
                    
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View Details"
                    >
                      <Monitor className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Last Active */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    Last active: {feature.lastActive.toLocaleString()}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Management Tools</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/admin/ai-automation"
            className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
          >
            <div className="bg-blue-100 p-3 rounded-lg mb-3 w-fit group-hover:bg-blue-200 transition-colors">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Automation Dashboard</h3>
            <p className="text-sm text-gray-600">View detailed automation analytics and logs</p>
          </Link>

          <Link 
            href="/admin/ai-training"
            className="p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all group"
          >
            <div className="bg-green-100 p-3 rounded-lg mb-3 w-fit group-hover:bg-green-200 transition-colors">
              <Brain className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Model Training</h3>
            <p className="text-sm text-gray-600">Train and optimize AI models with your data</p>
          </Link>

          <Link 
            href="/admin/ai-analytics"
            className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all group"
          >
            <div className="bg-purple-100 p-3 rounded-lg mb-3 w-fit group-hover:bg-purple-200 transition-colors">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Analytics</h3>
            <p className="text-sm text-gray-600">Deep insights into AI performance and ROI</p>
          </Link>

          <Link 
            href="/admin/ai-logs"
            className="p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all group"
          >
            <div className="bg-orange-100 p-3 rounded-lg mb-3 w-fit group-hover:bg-orange-200 transition-colors">
              <Monitor className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">System Logs</h3>
            <p className="text-sm text-gray-600">Monitor AI system logs and debug issues</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
