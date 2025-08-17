'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Bot, Brain, Eye, Mic, MessageSquare, Sparkles, 
  Activity, Zap, Target, Shield, Settings, BarChart3,
  ArrowRight, Play, Pause, Lock, AlertTriangle
} from 'lucide-react'
import AIStatusWidget from '@/components/AIStatusWidget'
import { useAuth } from '@/lib/use-auth'

interface AIFeature {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  status: 'active' | 'beta' | 'coming-soon'
  color: string
  gradient: string
  requiresAdmin?: boolean
  category: 'user' | 'admin'
}

// User-accessible AI features
const userAIFeatures: AIFeature[] = [
  {
    id: 'chatbot',
    name: 'AI Chatbot',
    description: 'Intelligent customer support with natural language processing',
    icon: MessageSquare,
    href: '#chatbot',
    status: 'active',
    color: 'text-green-600',
    gradient: 'from-green-500 to-teal-600',
    category: 'user'
  },
  {
    id: 'visual-recognition',
    name: 'Visual AI Analysis',
    description: 'Advanced skin analysis and product recommendations using computer vision',
    icon: Eye,
    href: '/ai-vision',
    status: 'beta',
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-pink-600',
    category: 'user'
  },
  {
    id: 'voice-assistant',
    name: 'Voice Assistant',
    description: 'Hands-free shopping experience with voice recognition and synthesis',
    icon: Mic,
    href: '/ai-voice',
    status: 'beta',
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-red-600',
    category: 'user'
  }
]

// Admin-only AI features
const adminAIFeatures: AIFeature[] = [
  {
    id: 'control-center',
    name: 'AI Control Center',
    description: 'Real-time monitoring and control of all AI services with advanced analytics',
    icon: Brain,
    href: '/ai-control',
    status: 'active',
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-purple-600',
    requiresAdmin: true,
    category: 'admin'
  },
  {
    id: 'recommendations',
    name: 'Smart Recommendations',
    description: 'Personalized product suggestions powered by machine learning',
    icon: Target,
    href: '/admin/recommendations',
    status: 'active',
    color: 'text-indigo-600',
    gradient: 'from-indigo-500 to-blue-600',
    requiresAdmin: true,
    category: 'admin'
  },
  {
    id: 'fraud-detection',
    name: 'Fraud Protection',
    description: 'Real-time transaction monitoring and suspicious activity detection',
    icon: Shield,
    href: '/admin/fraud-detection',
    status: 'active',
    color: 'text-red-600',
    gradient: 'from-red-500 to-pink-600',
    requiresAdmin: true,
    category: 'admin'
  },
  {
    id: 'inventory-ai',
    name: 'Inventory AI',
    description: 'Predictive stock management and automated reordering system',
    icon: BarChart3,
    href: '/admin/inventory-ai',
    status: 'active',
    color: 'text-yellow-600',
    gradient: 'from-yellow-500 to-orange-600',
    requiresAdmin: true,
    category: 'admin'
  },
  {
    id: 'marketing-ai',
    name: 'Marketing Automation',
    description: 'AI-powered campaigns, pricing optimization, and customer insights',
    icon: Sparkles,
    href: '/admin/marketing-automation',
    status: 'active',
    color: 'text-pink-600',
    gradient: 'from-pink-500 to-rose-600',
    requiresAdmin: true,
    category: 'admin'
  }
]

export default function AIDashboardPage() {
  const { user, isAdmin, isAuthenticated, isLoading } = useAuth()
  
  // Determine which features to show based on user role
  const availableFeatures = isAdmin 
    ? [...userAIFeatures, ...adminAIFeatures] 
    : userAIFeatures

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </span>
        )
      case 'beta':
        return (
          <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
            Beta
          </span>
        )
      case 'coming-soon':
        return (
          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            Coming Soon
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">AI Automation Hub</h1>
                  <p className="text-gray-600">Comprehensive AI-powered e-commerce automation</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <Activity className="h-4 w-4" />
                <span className="text-sm font-medium">{availableFeatures.length}/{userAIFeatures.length + adminAIFeatures.length} Services Active</span>
              </div>
              
              {/* Show Control Center button only for admins */}
              {isAdmin && (
                <Link href="/ai-control">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Control Center
                  </button>
                </Link>
              )}
              
              {/* Show user info and role badge */}
              {user && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name || user.email?.split('@')[0]}
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    isAdmin 
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {isAdmin ? '👑 Admin' : '👤 User'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'AI Requests Today', value: '12.4K', change: '+18%', icon: Activity, color: 'text-blue-600' },
            { label: 'Automation Rate', value: '94.2%', change: '+5.1%', icon: Zap, color: 'text-green-600' },
            { label: 'Response Time', value: '145ms', change: '-23ms', icon: Target, color: 'text-purple-600' },
            { label: 'Cost Savings', value: '₹45.2K', change: '+12%', icon: BarChart3, color: 'text-orange-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* User AI Services */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">User AI Features</h2>
              <p className="text-sm text-gray-600 mt-1">AI tools available to all customers</p>
            </div>
            <div className="text-sm text-gray-600">
              {userAIFeatures.filter(f => f.status === 'active').length} of {userAIFeatures.length} active
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userAIFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <Link href={feature.href}>
                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      {getStatusBadge(feature.status)}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-blue-600 font-medium group-hover:text-blue-700">
                      <span>Launch Service</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Admin-Only AI Services */}
        {isAdmin && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-red-600" />
                  Admin-Only AI Tools
                </h2>
                <p className="text-sm text-gray-600 mt-1">Advanced AI management tools for administrators</p>
              </div>
              <div className="text-sm text-gray-600">
                {adminAIFeatures.filter(f => f.status === 'active').length} of {adminAIFeatures.length} active
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminAIFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (userAIFeatures.length + index) * 0.05 }}
                  className="group"
                >
                  <Link href={feature.href}>
                    <div className="bg-white rounded-xl border-2 border-red-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-red-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center relative`}>
                          <feature.icon className="h-6 w-6 text-white" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <Lock className="h-2 w-2 text-white" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            Admin Only
                          </span>
                          {getStatusBadge(feature.status)}
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        {feature.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      
                      <div className="flex items-center text-sm text-red-600 font-medium group-hover:text-red-700">
                        <span>Manage Tool</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Non-Admin Message */}
        {!isAdmin && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Lock className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Admin Tools Available</h3>
                  <p className="text-sm text-gray-600">
                    Advanced AI management tools like fraud detection, inventory AI, and marketing automation are available for administrators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
            <div className="space-y-4">
              {[
                { service: 'AI Chatbot', requests: '3.2K', success: '98.5%', avgTime: '1.2s' },
                { service: 'Visual Recognition', requests: '1.8K', success: '94.1%', avgTime: '2.8s' },
                { service: 'Voice Assistant', requests: '945', success: '92.3%', avgTime: '1.8s' },
                { service: 'Recommendations', requests: '5.1K', success: '99.2%', avgTime: '0.3s' }
              ].map((perf, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">{perf.service}</div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{perf.requests} requests</span>
                    <span className="text-green-600">{perf.success} success</span>
                    <span>{perf.avgTime} avg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent AI Activity</h3>
            <div className="space-y-3">
              {[
                { type: 'success', message: 'Visual AI analyzed 23 customer photos', time: '2m ago' },
                { type: 'info', message: 'Chatbot handled 145 customer queries', time: '5m ago' },
                { type: 'warning', message: 'Voice service response time increased', time: '8m ago' },
                { type: 'success', message: 'Fraud detection blocked 3 suspicious transactions', time: '12m ago' },
                { type: 'info', message: 'Inventory AI updated stock levels for 89 products', time: '15m ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
