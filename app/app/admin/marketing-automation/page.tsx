"use client"
import { useEffect, useState } from 'react'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Eye, 
  Copy, 
  BarChart3, 
  Mail, 
  Users, 
  Target,
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  Brain,
  Sparkles
} from 'lucide-react'
import AIMarketingAssistant from '@/components/admin/AIMarketingAssistant'

type Campaign = {
  _id: string
  name: string
  type: 'email' | 'social' | 'ads' | 'automation'
  status: 'draft' | 'active' | 'paused' | 'completed'
  targetAudience: string
  products: string[]
  emailSubject?: string
  emailContent?: string
  socialContent?: string
  adCopy?: {
    headline: string
    description: string
    cta: string
  }
  schedule?: {
    startDate: string
    endDate?: string
    frequency?: string
  }
  metrics?: {
    sent: number
    opened: number
    clicked: number
    converted: number
  }
  createdAt: string
  updatedAt: string
}

export default function MarketingAutomationPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Campaign>>({
    name: '',
    type: 'email',
    status: 'draft',
    targetAudience: '',
    products: [],
    emailSubject: '',
    emailContent: '',
    socialContent: '',
    adCopy: {
      headline: '',
      description: '',
      cta: ''
    }
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadMarketingData()
  }, [])

  const loadMarketingData = async () => {
    try {
      // Load products for marketing analysis
      const products = await getAllProducts()
      
      // Generate demo marketing campaigns
      const demoOffer = {
        name: 'Festival Special Offer',
        discount: 25,
        products: products.slice(0, 5),
        targetAudience: 'premium customers'
      }
      
      // Generate social media posts
      const socialPost = await aiMarketingManager.generateSocialMediaPost(demoOffer, 'instagram', 'offer')
      
      // Generate email campaign
      const demoCustomers = [
        { email: 'customer1@example.com', name: 'Priya Sharma' },
        { email: 'customer2@example.com', name: 'Rajesh Kumar' }
      ]
      const emailCampaign = await aiMarketingManager.generateEmailCampaign('promotional', demoCustomers, demoOffer)
      
      // Generate pricing recommendations
      const pricingStrategies = await aiMarketingManager.generateDynamicPricing(products.slice(0, 10))
      
      // Generate marketing insights
      const mockSalesData = products.slice(0, 10).map(product => ({
        productId: product.id,
        sales: Math.floor(Math.random() * 100) + 10,
        revenue: product.price * (Math.floor(Math.random() * 50) + 5)
      }))
      
      const mockCustomerData = Array.from({length: 20}, (_, i) => ({
        id: i + 1,
        segment: ['premium', 'regular', 'budget'][Math.floor(Math.random() * 3)],
        avgOrderValue: Math.floor(Math.random() * 2000) + 500,
        frequency: ['weekly', 'monthly', 'quarterly'][Math.floor(Math.random() * 3)]
      }))
      
      const insights = await aiMarketingManager.generateMarketingInsights(mockSalesData, mockCustomerData)
      
      // Get analytics data
      const socialAnalytics = aiMarketingManager.getSocialMediaAnalytics()
      const emailAnalytics = aiMarketingManager.getEmailAnalytics()
      const pricingReport = aiMarketingManager.getPricingReport()
      
      setMarketingData({
        insights,
        pricingStrategies,
        socialAnalytics,
        emailAnalytics,
        pricingReport
      })
      
      setSocialPosts(socialPost ? [socialPost] : [])
      setEmailCampaigns(emailCampaign ? [emailCampaign] : [])
      setCampaigns([demoOffer])
      setLoading(false)
    } catch (error) {
      console.error('Failed to load marketing data:', error)
      setLoading(false)
    }
  }

  const generateNewCampaign = async () => {
    const products = await getAllProducts()
    const newCampaign = {
      name: `Flash Sale ${Date.now()}`,
      discount: Math.floor(Math.random() * 30) + 10,
      products: products.slice(0, 3),
      targetAudience: 'all customers'
    }
    
    const posts = await aiMarketingManager.autoPostForCampaign(newCampaign)
    setCampaigns(prev => [newCampaign, ...prev])
    setSocialPosts(prev => [...(posts.filter(Boolean)), ...prev])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading marketing automation data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Marketing Automation</h1>
              <p className="text-gray-600">Automated campaigns, pricing, and customer insights</p>
            </div>
          </div>
          
          <button 
            onClick={generateNewCampaign}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Zap className="h-5 w-5" />
            Generate Campaign
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: 'Active Campaigns',
            value: campaigns.length,
            icon: Sparkles,
            color: 'text-pink-600 bg-pink-50'
          },
          {
            title: 'Social Posts',
            value: marketingData?.socialAnalytics?.totalPosts || 0,
            icon: Share2,
            color: 'text-blue-600 bg-blue-50'
          },
          {
            title: 'Email Campaigns',
            value: marketingData?.emailAnalytics?.totalCampaigns || 0,
            icon: Mail,
            color: 'text-green-600 bg-green-50'
          },
          {
            title: 'Revenue Impact',
            value: `₹${Math.floor(marketingData?.pricingReport?.potentialRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'text-yellow-600 bg-yellow-50'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Campaigns */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Marketing Campaigns</h2>
            
            <div className="space-y-4">
              {campaigns.slice(0, 5).map((campaign, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                      {campaign.discount}% OFF
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-gray-500">Products:</span>
                      <span className="font-medium ml-2">{campaign.products?.length || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Target:</span>
                      <span className="font-medium ml-2 capitalize">{campaign.targetAudience}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="font-medium ml-2 text-green-600">Active</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs transition-colors">
                      View Analytics
                    </button>
                    <button className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs transition-colors">
                      Edit Campaign
                    </button>
                  </div>
                </div>
              ))}
              
              {campaigns.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No campaigns created yet</p>
                  <p className="text-sm">Click "Generate Campaign" to create your first AI campaign</p>
                </div>
              )}
            </div>
          </div>

          {/* Social Media Posts */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">AI-Generated Social Posts</h2>
            
            <div className="space-y-4">
              {socialPosts.slice(0, 3).map((post, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900 capitalize">{post.platform}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(post.scheduledTime).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3 line-clamp-3">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.hashtags?.slice(0, 5).map((tag: string, tagIndex: number) => (
                      <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {post.engagement && (
                    <div className="flex gap-4 text-xs text-gray-600">
                      <span>❤️ {post.engagement.likes}</span>
                      <span>📤 {post.engagement.shares}</span>
                      <span>💬 {post.engagement.comments}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Marketing Insights */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Open Rate</span>
                <span className="font-medium">
                  {Math.round((marketingData?.emailAnalytics?.avgOpenRate || 0) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Click Rate</span>
                <span className="font-medium">
                  {Math.round((marketingData?.emailAnalytics?.avgClickRate || 0) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Social Engagement</span>
                <span className="font-medium">
                  {marketingData?.socialAnalytics?.avgEngagement || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Price Optimizations</span>
                <span className="font-medium">
                  {marketingData?.pricingReport?.totalOptimizations || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Trending Products */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Products</h3>
            
            <div className="space-y-3">
              {marketingData?.insights?.trendingProducts?.slice(0, 5).map((product: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium truncate">{product}</span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              )) || (
                <div className="text-center py-4 text-gray-500 text-sm">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Analyzing product trends...</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
            
            <div className="space-y-3">
              {marketingData?.insights?.customerSegments && Object.entries(marketingData.insights.customerSegments).map(([segment, data]: [string, any]) => (
                <div key={segment} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{segment}</span>
                    <Users className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>AOV: ₹{data.avgOrderValue}</div>
                    <div>Frequency: {data.frequency}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full p-3 text-left bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors">
                <div className="font-medium text-pink-900">Create Email Campaign</div>
                <div className="text-sm text-pink-600">Send personalized offers</div>
              </button>
              
              <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="font-medium text-blue-900">Schedule Social Posts</div>
                <div className="text-sm text-blue-600">Auto-post to all platforms</div>
              </button>
              
              <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="font-medium text-green-900">Optimize Pricing</div>
                <div className="text-sm text-green-600">AI-powered price recommendations</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Marketing Insights */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Marketing Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketingData?.insights?.recommendedCampaigns?.slice(0, 6).map((recommendation: string, index: number) => (
            <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
            </div>
          )) || (
            <div className="col-span-3 text-center py-8 text-gray-500">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Analyzing market data to generate recommendations...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
