'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageSquare,
  Calendar,
  BarChart3,
  Users,
  Heart,
  Share2,
  Eye,
  TrendingUp,
  Plus,
  Edit3,
  Trash2,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Video,
  FileText,
  Settings,
  Target,
  Zap
} from 'lucide-react'

interface SocialPost {
  id: string
  content: string
  platform: 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'linkedin'
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduledTime?: Date
  publishedTime?: Date
  mediaType: 'text' | 'image' | 'video' | 'carousel'
  mediaUrl?: string
  engagement: {
    likes: number
    comments: number
    shares: number
    views: number
  }
  hashtags: string[]
  targetAudience?: string
}

interface Campaign {
  id: string
  name: string
  description: string
  platforms: string[]
  status: 'active' | 'paused' | 'completed' | 'draft'
  startDate: Date
  endDate: Date
  budget: number
  spent: number
  posts: number
  reach: number
  engagement: number
  conversions: number
}

export default function SocialMediaManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'campaigns' | 'analytics' | 'settings'>('overview')
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: '1',
      content: 'New Neem Face Cleanser - 100% Natural! 🌿 Perfect for acne-prone skin. Get yours today! #naturalcare #skincare #neem',
      platform: 'instagram',
      status: 'published',
      publishedTime: new Date(Date.now() - 3600000),
      mediaType: 'image',
      mediaUrl: '/images/products/neem-cleanser.jpg',
      engagement: { likes: 245, comments: 23, shares: 12, views: 1250 },
      hashtags: ['#naturalcare', '#skincare', '#neem', '#organic'],
      targetAudience: 'Women 25-35'
    },
    {
      id: '2',
      content: 'Special Diwali Offer! 🪔 Get 30% OFF on all Ayurvedic products. Use code DIWALI30. Limited time offer!',
      platform: 'facebook',
      status: 'scheduled',
      scheduledTime: new Date(Date.now() + 7200000),
      mediaType: 'image',
      engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
      hashtags: ['#diwali', '#ayurveda', '#offer', '#discount'],
      targetAudience: 'All customers'
    }
  ])

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Winter Skincare Campaign',
      description: 'Promote winter skincare products across all platforms',
      platforms: ['instagram', 'facebook', 'twitter'],
      status: 'active',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
      budget: 25000,
      spent: 8500,
      posts: 12,
      reach: 45000,
      engagement: 3.2,
      conversions: 156
    },
    {
      id: '2',
      name: 'Festival Special',
      description: 'Diwali and festive season marketing campaign',
      platforms: ['instagram', 'facebook', 'youtube'],
      status: 'active',
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      budget: 40000,
      spent: 12000,
      posts: 8,
      reach: 28000,
      engagement: 4.5,
      conversions: 89
    }
  ])

  const [platformStats, setPlatformStats] = useState({
    facebook: { followers: 12500, posts: 45, engagement: 3.8 },
    instagram: { followers: 8900, posts: 67, engagement: 5.2 },
    twitter: { followers: 3400, posts: 123, engagement: 2.1 },
    youtube: { followers: 2100, posts: 12, engagement: 6.8 },
    linkedin: { followers: 1800, posts: 23, engagement: 4.2 }
  })

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-5 w-5 text-blue-600" />
      case 'instagram': return <Instagram className="h-5 w-5 text-pink-600" />
      case 'twitter': return <Twitter className="h-5 w-5 text-blue-400" />
      case 'youtube': return <Youtube className="h-5 w-5 text-red-600" />
      case 'linkedin': return <MessageSquare className="h-5 w-5 text-blue-700" />
      default: return <MessageSquare className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalReach = campaigns.reduce((sum, c) => sum + c.reach, 0)
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-3 rounded-xl">
            <Share2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Social Media Marketing</h1>
            <p className="text-lg text-gray-600">Manage all your social media campaigns and content</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Post
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Target className="h-4 w-4" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'posts', label: 'Posts', icon: FileText },
            { id: 'campaigns', label: 'Campaigns', icon: Target },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-600'
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{totalReach.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600">Total Reach</p>
              <p className="text-xs text-green-600 mt-1">+15% from last month</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{totalConversions}</span>
              </div>
              <p className="text-sm text-gray-600">Conversions</p>
              <p className="text-xs text-green-600 mt-1">+23% from last month</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">4.2%</span>
              </div>
              <p className="text-sm text-gray-600">Avg Engagement</p>
              <p className="text-xs text-green-600 mt-1">+0.8% from last month</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-xs text-gray-600 mt-1">₹{(totalBudget - totalSpent).toLocaleString()} remaining</p>
            </div>
          </div>

          {/* Platform Overview */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(platformStats).map(([platform, stats]) => (
                <div key={platform} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    {getPlatformIcon(platform)}
                    <span className="font-medium capitalize">{platform}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Followers</span>
                      <span className="font-medium">{stats.followers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Posts</span>
                      <span className="font-medium">{stats.posts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Engagement</span>
                      <span className="font-medium text-green-600">{stats.engagement}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
              <Link href="#" className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                View All Posts
              </Link>
            </div>
            
            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <div key={post.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    {getPlatformIcon(post.platform)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                      <span className="text-sm text-gray-500 capitalize">{post.platform}</span>
                    </div>
                    
                    <p className="text-gray-900 mb-2 line-clamp-2">{post.content}</p>
                    
                    {post.status === 'published' && (
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.engagement.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {post.engagement.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          {post.engagement.shares}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.engagement.views}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          {/* Posts Filter and Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">All Posts</h2>
              <div className="flex items-center gap-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="all">All Platforms</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="youtube">YouTube</option>
                </select>
                
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft</option>
                </select>
                
                <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Post
                </button>
              </div>
            </div>
            
            {/* Posts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(post.platform)}
                      <span className="font-medium capitalize">{post.platform}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-900 mb-4">{post.content}</p>
                  
                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.hashtags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {post.status === 'scheduled' && post.scheduledTime && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Clock className="h-4 w-4" />
                      Scheduled for {post.scheduledTime.toLocaleString()}
                    </div>
                  )}
                  
                  {post.status === 'published' && (
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{post.engagement.likes}</div>
                        <div className="text-gray-600">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{post.engagement.comments}</div>
                        <div className="text-gray-600">Comments</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{post.engagement.shares}</div>
                        <div className="text-gray-600">Shares</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{post.engagement.views}</div>
                        <div className="text-gray-600">Views</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Marketing Campaigns</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Campaign
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{campaign.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {campaign.platforms.map((platform) => (
                      <div key={platform} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                        {getPlatformIcon(platform)}
                        <span className="text-xs capitalize">{platform}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget</span>
                      <span className="font-medium">₹{campaign.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spent</span>
                      <span className="font-medium text-orange-600">₹{campaign.spent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Reach</span>
                      <span className="font-medium">{campaign.reach.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Conversions</span>
                      <span className="font-medium text-green-600">{campaign.conversions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Engagement Rate</span>
                      <span className="font-medium">{campaign.engagement}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{campaign.startDate.toLocaleDateString()} - {campaign.endDate.toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Social Media Analytics</h2>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4" />
              <p>Advanced analytics coming soon...</p>
              <p className="text-sm">Track engagement, reach, conversions and ROI across all platforms</p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Social Media Settings</h2>
            <div className="text-center py-12 text-gray-500">
              <Settings className="h-12 w-12 mx-auto mb-4" />
              <p>Platform integrations and settings</p>
              <p className="text-sm">Configure API keys, posting schedules, and automation rules</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
