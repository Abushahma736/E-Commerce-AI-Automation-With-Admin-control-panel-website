'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Mail,
  Send,
  Users,
  TrendingUp,
  Calendar,
  BarChart3,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  FileText,
  Target,
  Zap,
  Settings,
  UserPlus,
  UserMinus,
  Download,
  Upload,
  Copy
} from 'lucide-react'

interface EmailCampaign {
  id: string
  name: string
  subject: string
  content: string
  status: 'draft' | 'scheduled' | 'sent' | 'sending'
  type: 'newsletter' | 'promotional' | 'welcome' | 'followup' | 'abandoned_cart'
  recipients: number
  sent: number
  opened: number
  clicked: number
  bounced: number
  unsubscribed: number
  scheduledTime?: Date
  sentTime?: Date
  createdAt: Date
  template: string
  tags: string[]
}

interface EmailTemplate {
  id: string
  name: string
  category: 'welcome' | 'newsletter' | 'promotional' | 'transactional'
  previewText: string
  isActive: boolean
  usageCount: number
  createdAt: Date
}

interface Subscriber {
  id: string
  email: string
  firstName: string
  lastName: string
  status: 'subscribed' | 'unsubscribed' | 'bounced'
  subscribedAt: Date
  lastActivity?: Date
  segments: string[]
  tags: string[]
  source: 'website' | 'manual' | 'import' | 'api'
}

export default function EmailMarketingManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'subscribers' | 'templates' | 'analytics' | 'settings'>('overview')
  
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    {
      id: '1',
      name: 'Winter Wellness Newsletter',
      subject: 'Stay Healthy This Winter with Natural Products 🌿',
      content: 'Winter is here! Discover our collection of natural wellness products...',
      status: 'sent',
      type: 'newsletter',
      recipients: 5420,
      sent: 5420,
      opened: 2184,
      clicked: 328,
      bounced: 12,
      unsubscribed: 3,
      sentTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      template: 'Newsletter Template',
      tags: ['winter', 'wellness', 'newsletter']
    },
    {
      id: '2',
      name: 'Diwali Special Offer',
      subject: 'Exclusive 30% OFF on All Ayurvedic Products! 🪔',
      content: 'Celebrate Diwali with our special offers on natural products...',
      status: 'scheduled',
      type: 'promotional',
      recipients: 3200,
      sent: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
      scheduledTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      template: 'Promotional Template',
      tags: ['diwali', 'offer', 'promotional']
    }
  ])

  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    {
      id: '1',
      email: 'customer1@example.com',
      firstName: 'Rahul',
      lastName: 'Sharma',
      status: 'subscribed',
      subscribedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      segments: ['premium_customers', 'skincare_interested'],
      tags: ['active', 'high_value'],
      source: 'website'
    },
    {
      id: '2',
      email: 'priya.patel@example.com',
      firstName: 'Priya',
      lastName: 'Patel',
      status: 'subscribed',
      subscribedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      segments: ['new_subscribers'],
      tags: ['recent'],
      source: 'website'
    }
  ])

  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Welcome Series Email 1',
      category: 'welcome',
      previewText: 'Welcome to ESSE Naturals! Start your natural wellness journey...',
      isActive: true,
      usageCount: 245,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Monthly Newsletter',
      category: 'newsletter',
      previewText: 'Latest natural wellness tips and product updates...',
      isActive: true,
      usageCount: 12,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    }
  ])

  // Calculate metrics
  const totalSubscribers = subscribers.length
  const totalCampaigns = campaigns.length
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0)
  const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0)
  const totalClicked = campaigns.reduce((sum, c) => sum + c.clicked, 0)
  const avgOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0'
  const avgClickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : '0'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'sending': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'subscribed': return 'bg-green-100 text-green-800'
      case 'unsubscribed': return 'bg-red-100 text-red-800'
      case 'bounced': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'newsletter': return 'bg-blue-100 text-blue-800'
      case 'promotional': return 'bg-purple-100 text-purple-800'
      case 'welcome': return 'bg-green-100 text-green-800'
      case 'followup': return 'bg-orange-100 text-orange-800'
      case 'abandoned_cart': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Email Marketing</h1>
            <p className="text-lg text-gray-600">Create, manage and track email campaigns</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Campaign
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Subscribers
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'campaigns', label: 'Campaigns', icon: Send },
            { id: 'subscribers', label: 'Subscribers', icon: Users },
            { id: 'templates', label: 'Templates', icon: FileText },
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
                    ? 'border-blue-500 text-blue-600'
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
                <span className="text-2xl font-bold text-gray-900">{totalSubscribers.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600">Total Subscribers</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Send className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{totalSent.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600">Emails Sent</p>
              <p className="text-xs text-green-600 mt-1">+8% from last month</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{avgOpenRate}%</span>
              </div>
              <p className="text-sm text-gray-600">Avg Open Rate</p>
              <p className="text-xs text-green-600 mt-1">+2.3% from last month</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{avgClickRate}%</span>
              </div>
              <p className="text-sm text-gray-600">Avg Click Rate</p>
              <p className="text-xs text-green-600 mt-1">+1.5% from last month</p>
            </div>
          </div>

          {/* Recent Campaigns */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Campaigns</h2>
              <Link href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All Campaigns
              </Link>
            </div>
            
            <div className="space-y-4">
              {campaigns.slice(0, 3).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(campaign.type)}`}>
                        {campaign.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{campaign.subject}</p>
                    
                    {campaign.status === 'sent' && (
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Recipients: {campaign.recipients.toLocaleString()}</span>
                        <span>Opened: {((campaign.opened / campaign.sent) * 100).toFixed(1)}%</span>
                        <span>Clicked: {((campaign.clicked / campaign.sent) * 100).toFixed(1)}%</span>
                      </div>
                    )}
                    
                    {campaign.status === 'scheduled' && campaign.scheduledTime && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        Scheduled for {campaign.scheduledTime.toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subscriber Growth */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscriber Growth</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-medium text-green-600">+24 subscribers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-medium text-green-600">+156 subscribers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unsubscribed</span>
                  <span className="font-medium text-red-600">-8 this month</span>
                </div>
              </div>
            </div>

            {/* Top Templates */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Templates</h3>
              <div className="space-y-3">
                {templates.slice(0, 3).map((template) => (
                  <div key={template.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900">{template.name}</span>
                      <p className="text-sm text-gray-600 capitalize">{template.category}</p>
                    </div>
                    <span className="text-sm text-gray-600">{template.usageCount} uses</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Email Campaigns</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-64"
                  />
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="sent">Sent</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Campaign
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(campaign.type)}`}>
                          {campaign.type}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium mb-2">{campaign.subject}</p>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{campaign.content}</p>
                      
                      {campaign.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {campaign.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {campaign.status === 'sent' && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{campaign.recipients.toLocaleString()}</div>
                        <div className="text-gray-600">Recipients</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">{campaign.opened.toLocaleString()}</div>
                        <div className="text-gray-600">Opened ({((campaign.opened / campaign.sent) * 100).toFixed(1)}%)</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-blue-600">{campaign.clicked.toLocaleString()}</div>
                        <div className="text-gray-600">Clicked ({((campaign.clicked / campaign.sent) * 100).toFixed(1)}%)</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-orange-600">{campaign.bounced}</div>
                        <div className="text-gray-600">Bounced</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-red-600">{campaign.unsubscribed}</div>
                        <div className="text-gray-600">Unsubscribed</div>
                      </div>
                    </div>
                  )}
                  
                  {campaign.status === 'scheduled' && campaign.scheduledTime && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      Scheduled for {campaign.scheduledTime.toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Email Subscribers</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search subscribers..."
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-64"
                  />
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="all">All Status</option>
                  <option value="subscribed">Subscribed</option>
                  <option value="unsubscribed">Unsubscribed</option>
                  <option value="bounced">Bounced</option>
                </select>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Import
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Subscriber
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Subscriber</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Subscribed</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Last Activity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Segments</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {subscriber.firstName} {subscriber.lastName}
                          </div>
                          <div className="text-sm text-gray-600">{subscriber.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(subscriber.status)}`}>
                          {subscriber.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {subscriber.subscribedAt.toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {subscriber.lastActivity ? subscriber.lastActivity.toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {subscriber.segments.slice(0, 2).map((segment, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {segment}
                            </span>
                          ))}
                          {subscriber.segments.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{subscriber.segments.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <UserMinus className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Email Templates</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Template
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      template.category === 'welcome' ? 'bg-green-100 text-green-800' :
                      template.category === 'newsletter' ? 'bg-blue-100 text-blue-800' :
                      template.category === 'promotional' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {template.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{template.previewText}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Used {template.usageCount} times</span>
                    <span>{template.createdAt.toLocaleDateString()}</span>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Email Analytics</h2>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4" />
              <p>Advanced email analytics coming soon...</p>
              <p className="text-sm">Track open rates, click-through rates, conversions, and subscriber behavior</p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Email Marketing Settings</h2>
            <div className="text-center py-12 text-gray-500">
              <Settings className="h-12 w-12 mx-auto mb-4" />
              <p>Email service configuration</p>
              <p className="text-sm">Configure SMTP settings, sender information, and automation rules</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
