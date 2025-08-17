'use client'

import { useState, useEffect } from 'react'
import { aiInventoryManager } from '@/lib/ai/inventory-manager'
import { aiProductManager } from '@/lib/ai/product-manager'
import { aiMarketingManager } from '@/lib/ai/marketing-automation'
import { aiFraudDetection } from '@/lib/ai/fraud-detection'
import { aiVoiceAgent } from '@/lib/ai/voice-agent'
import { aiOrderAutomation } from '@/lib/ai/order-automation'
import { 
  Bot, 
  Package, 
  TrendingUp, 
  Shield, 
  Phone, 
  Truck,
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Users,
  BarChart3,
  Sparkles,
  MessageSquare,
  ShoppingCart,
  Star
} from 'lucide-react'

interface DashboardStats {
  inventory: any
  products: any
  marketing: any
  fraud: any
  voice: any
  orders: any
}

export default function AIAutomationDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [automationStatus, setAutomationStatus] = useState({
    inventory: true,
    fraud: true,
    voice: true,
    marketing: true,
    orders: true
  })

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Simulate some demo data and operations
      await generateDemoActivities()

      const dashboardStats = {
        inventory: aiInventoryManager.getInventoryStats(),
        products: aiProductManager.getEnhancementStats(),
        marketing: {
          social: aiMarketingManager.getSocialMediaAnalytics(),
          email: aiMarketingManager.getEmailAnalytics(),
          pricing: aiMarketingManager.getPricingReport()
        },
        fraud: aiFraudDetection.getFraudStats(),
        voice: aiVoiceAgent.getCallStats(),
        orders: aiOrderAutomation.getProcessingAnalytics()
      }

      setStats(dashboardStats)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate some demo activities for demonstration
  const generateDemoActivities = async () => {
    // Simulate inventory alerts
    await aiInventoryManager.generateInventoryAlerts()
    
    // Simulate some marketing campaigns
    const demoOffers = [
      {
        name: 'Diwali Festival Sale',
        discount: '30% OFF',
        products: ['Neem Face Pack', 'Turmeric Soap'],
        validTill: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'Winter Skincare Special',
        discount: 'Buy 2 Get 1 Free',
        products: ['Coconut Oil', 'Aloe Vera Gel'],
        validTill: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    ]

    for (const offer of demoOffers) {
      await aiMarketingManager.generateSocialMediaPost(offer, 'instagram', 'offer')
    }

    // Simulate voice calls
    await aiVoiceAgent.scheduleCall(
      'order_confirmation',
      '+91-9876543210',
      'Rahul Sharma',
      {
        orderNumber: 'ORD-2024-001',
        orderTotal: 1250,
        products: ['Neem Face Cleanser', 'Turmeric Serum']
      }
    )

    // Process the call queue
    setTimeout(() => {
      aiVoiceAgent.processCallQueue()
    }, 2000)
  }

  const toggleAutomation = (service: keyof typeof automationStatus) => {
    setAutomationStatus(prev => ({
      ...prev,
      [service]: !prev[service]
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Bot className="h-12 w-12 text-brand-green animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Initializing AI Automation</h2>
            <p className="text-gray-600">Loading your comprehensive automation dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-brand-green p-2 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Automation Hub</h1>
                <p className="text-gray-600">Complete E-commerce Automation Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">All Systems Operational</span>
              </div>
              <button 
                onClick={loadDashboardData}
                className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Automation Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {[
            { 
              key: 'inventory' as keyof typeof automationStatus, 
              icon: Package, 
              label: 'Inventory AI', 
              color: 'blue',
              alerts: stats?.inventory?.alerts?.critical || 0
            },
            { 
              key: 'fraud' as keyof typeof automationStatus, 
              icon: Shield, 
              label: 'Fraud Protection', 
              color: 'red',
              alerts: stats?.fraud?.alerts?.total || 0
            },
            { 
              key: 'voice' as keyof typeof automationStatus, 
              icon: Phone, 
              label: 'Voice Agent', 
              color: 'purple',
              alerts: stats?.voice?.pending || 0
            },
            { 
              key: 'marketing' as keyof typeof automationStatus, 
              icon: TrendingUp, 
              label: 'Marketing AI', 
              color: 'green',
              alerts: 0
            },
            { 
              key: 'orders' as keyof typeof automationStatus, 
              icon: Truck, 
              label: 'Order Automation', 
              color: 'orange',
              alerts: 0
            },
            { 
              key: 'products' as keyof typeof automationStatus, 
              icon: Sparkles, 
              label: 'Product AI', 
              color: 'indigo',
              alerts: stats?.products?.pending || 0
            }
          ].map((service) => {
            const IconComponent = service.icon
            const isActive = automationStatus[service.key]
            
            return (
              <div 
                key={service.key}
                className={`bg-white rounded-xl p-4 border-2 transition-all cursor-pointer ${
                  isActive ? 'border-green-200 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleAutomation(service.key)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <IconComponent className={`h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                  </div>
                  <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
                
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{service.label}</h3>
                <p className={`text-xs ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {isActive ? 'Active' : 'Paused'}
                </p>
                
                {service.alerts > 0 && (
                  <div className="mt-2 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                    <span className="text-xs text-orange-600">{service.alerts} alerts</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Inventory Status</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Critical Alerts</span>
                <span className="font-bold text-red-600">{stats?.inventory?.alerts?.critical || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Low Stock Items</span>
                <span className="font-bold text-orange-600">{stats?.inventory?.alerts?.low || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Auto Predictions</span>
                <span className="font-bold text-green-600">{stats?.inventory?.predictions || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Security & Fraud</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fraud Alerts</span>
                <span className="font-bold text-red-600">{stats?.fraud?.alerts?.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Blocked IPs</span>
                <span className="font-bold text-orange-600">{stats?.fraud?.security?.blockedIPs || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Reviews Analyzed</span>
                <span className="font-bold text-blue-600">{stats?.fraud?.reviews?.analyzed || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Phone className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Voice Agent</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Calls</span>
                <span className="font-bold text-blue-600">{stats?.voice?.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-bold text-green-600">{Math.round(stats?.voice?.successRate || 0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending Calls</span>
                <span className="font-bold text-orange-600">{stats?.voice?.pending || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Marketing AI</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Social Posts</span>
                <span className="font-bold text-blue-600">{stats?.marketing?.social?.totalPosts || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email Campaigns</span>
                <span className="font-bold text-purple-600">{stats?.marketing?.email?.totalCampaigns || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Open Rate</span>
                <span className="font-bold text-green-600">{Math.round((stats?.marketing?.email?.avgOpenRate || 0) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'inventory', label: 'Inventory AI', icon: Package },
                { id: 'marketing', label: 'Marketing', icon: TrendingUp },
                { id: 'fraud', label: 'Security', icon: Shield },
                { id: 'voice', label: 'Voice Agent', icon: Phone },
                { id: 'orders', label: 'Order Automation', icon: Truck }
              ].map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-brand-green text-brand-green'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Automation Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-semibold text-gray-900">Fully Automated</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Inventory tracking, fraud detection, and voice calls are running automatically
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <span className="font-semibold text-gray-900">Cost Savings</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        85% reduction in manual work, 40% faster order processing
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-purple-500" />
                        <span className="font-semibold text-gray-900">Customer Satisfaction</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        95% customer satisfaction with AI voice support and fast deliveries
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Recent AI Activities</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Package className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Auto-restock alert generated</p>
                        <p className="text-xs text-gray-600">Neem Face Cleanser - Predicted to run out in 3 days</p>
                      </div>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order confirmation call completed</p>
                        <p className="text-xs text-gray-600">Customer: Rahul Sharma - Order #ORD-2024-001</p>
                      </div>
                      <span className="text-xs text-gray-500">5 min ago</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Social media post generated</p>
                        <p className="text-xs text-gray-600">Diwali Festival Sale campaign - Posted to Instagram</p>
                      </div>
                      <span className="text-xs text-gray-500">12 min ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Inventory Management</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Stock Alerts</h4>
                    <div className="space-y-2">
                      {[
                        { product: 'Neem Face Cleanser', level: 'Critical', stock: 2, color: 'red' },
                        { product: 'Turmeric Glow Serum', level: 'Low', stock: 8, color: 'orange' },
                        { product: 'Coconut Hair Oil', level: 'Medium', stock: 25, color: 'yellow' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{item.product}</p>
                            <p className="text-sm text-gray-600">{item.stock} units remaining</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.color === 'red' ? 'bg-red-100 text-red-800' :
                            item.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">AI Predictions</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium text-blue-900">Seasonal Demand Increase</p>
                        <p className="text-sm text-blue-700">Winter skincare products expected to increase 60% next month</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-900">Optimal Reorder Quantity</p>
                        <p className="text-sm text-green-700">Neem products: Order 150 units for 90-day coverage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add other tab content as needed */}
            {activeTab !== 'overview' && activeTab !== 'inventory' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-lg">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Detailed {activeTab} analytics coming soon</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
