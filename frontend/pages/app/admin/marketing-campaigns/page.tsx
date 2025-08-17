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

export default function MarketingCampaignsPage() {
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

  // Mock data for demo
  useEffect(() => {
    loadCampaigns()
  }, [])

  async function loadCampaigns() {
    setLoading(true)
    // Mock campaign data
    const mockCampaigns: Campaign[] = [
      {
        _id: '1',
        name: 'Welcome Series - New Customers',
        type: 'email',
        status: 'active',
        targetAudience: 'New Customers',
        products: ['Essential Oils', 'Wellness Kit'],
        emailSubject: '🌿 Welcome to Your Wellness Journey!',
        emailContent: 'Dear valued customer, welcome to our natural wellness community...',
        metrics: {
          sent: 1250,
          opened: 875,
          clicked: 234,
          converted: 89
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: '2',
        name: 'Spring Collection Launch',
        type: 'social',
        status: 'draft',
        targetAudience: 'Natural Beauty Enthusiasts',
        products: ['Skincare', 'Aromatherapy'],
        socialContent: '🌺 Spring into wellness with our new collection! Fresh arrivals that will transform your routine. #SpringWellness #NaturalBeauty',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: '3',
        name: 'Google Ads - Turmeric Products',
        type: 'ads',
        status: 'active',
        targetAudience: 'Health-conscious consumers',
        products: ['Turmeric Supplements', 'Turmeric Face Mask'],
        adCopy: {
          headline: 'Pure Turmeric - Ancient Wisdom, Modern Benefits',
          description: 'Discover the healing power of organic turmeric with our premium supplements and skincare products.',
          cta: 'Shop Turmeric Collection'
        },
        metrics: {
          sent: 15000,
          opened: 3200,
          clicked: 640,
          converted: 128
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    
    setCampaigns(mockCampaigns)
    setLoading(false)
  }

  function resetForm() {
    setForm({
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
    setEditingId(null)
    setShowForm(false)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    
    if (!form.name || !form.targetAudience) {
      setError('Please fill all required fields')
      return
    }

    // In real app, save to database
    const newCampaign: Campaign = {
      _id: Date.now().toString(),
      ...form as Campaign,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editingId) {
      setCampaigns(campaigns.map(c => c._id === editingId ? newCampaign : c))
    } else {
      setCampaigns([newCampaign, ...campaigns])
    }
    
    resetForm()
  }

  async function remove(id: string) {
    if (!confirm('Are you sure you want to delete this campaign?')) return
    setCampaigns(campaigns.filter(c => c._id !== id))
  }

  function startEdit(campaign: Campaign) {
    setEditingId(campaign._id)
    setForm({ ...campaign })
    setShowForm(true)
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active'
    setCampaigns(campaigns.map(c => 
      c._id === id ? { ...c, status: newStatus as any } : c
    ))
  }

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || c.type === typeFilter
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const handleAIContentGenerated = (type: string, content: any) => {
    if (type === 'emailSubject' && content.recommended) {
      setForm({ ...form, emailSubject: content.recommended })
    } else if (type === 'emailContent' && content.content) {
      setForm({ ...form, emailContent: content.content })
    } else if (type === 'socialPost' && content.post) {
      setForm({ ...form, socialContent: content.post })
    } else if (type === 'adCopy') {
      setForm({ ...form, adCopy: content })
    } else if (type === 'segments' && content.recommended_segment) {
      setForm({ ...form, targetAudience: content.recommended_segment.name })
    } else if (type === 'optimize') {
      alert(`Campaign Optimization Suggestions:\n\n${content.recommendations.slice(0, 3).join('\n\n')}\n\nPredicted Improvement: ${content.predicted_improvement}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Campaigns</h1>
          <p className="mt-2 text-lg text-gray-600">Create and manage AI-powered marketing campaigns</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-indigo-600">{campaigns.length}</div>
          <div className="text-sm text-gray-600">Total Campaigns</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">
            {campaigns.filter(c => c.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active Campaigns</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">
            {campaigns.reduce((acc, c) => acc + (c.metrics?.sent || 0), 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Messages Sent</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-purple-600">
            {campaigns.reduce((acc, c) => acc + (c.metrics?.converted || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Conversions</div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Edit Campaign' : 'Create New Campaign'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <form onSubmit={submit} className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter campaign name"
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Type *
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.type || 'email'}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                >
                  <option value="email">Email Campaign</option>
                  <option value="social">Social Media</option>
                  <option value="ads">Advertisement</option>
                  <option value="automation">Automation Flow</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., New Customers, Beauty Enthusiasts"
                value={form.targetAudience || ''}
                onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
              />
            </div>

            {form.type === 'email' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter email subject"
                    value={form.emailSubject || ''}
                    onChange={(e) => setForm({ ...form, emailSubject: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Content
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter email content"
                    value={form.emailContent || ''}
                    onChange={(e) => setForm({ ...form, emailContent: e.target.value })}
                  />
                </div>
              </>
            )}

            {form.type === 'social' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Media Content
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter social media post content"
                  value={form.socialContent || ''}
                  onChange={(e) => setForm({ ...form, socialContent: e.target.value })}
                />
              </div>
            )}

            {form.type === 'ads' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Headline
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter ad headline"
                    value={form.adCopy?.headline || ''}
                    onChange={(e) => setForm({ 
                      ...form, 
                      adCopy: { ...form.adCopy!, headline: e.target.value }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter ad description"
                    value={form.adCopy?.description || ''}
                    onChange={(e) => setForm({ 
                      ...form, 
                      adCopy: { ...form.adCopy!, description: e.target.value }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Call-to-Action
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Shop Now, Learn More"
                    value={form.adCopy?.cta || ''}
                    onChange={(e) => setForm({ 
                      ...form, 
                      adCopy: { ...form.adCopy!, cta: e.target.value }
                    })}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update Campaign' : 'Create Campaign'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Marketing Assistant */}
      {showForm && (
        <div className="mb-6">
          <AIMarketingAssistant 
            campaignData={{
              name: form.name,
              type: form.type,
              targetAudience: form.targetAudience,
              products: form.products,
              tone: 'friendly'
            }}
            onContentGenerated={handleAIContentGenerated}
          />
        </div>
      )}

      {/* AI Guide Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg shadow border border-indigo-100 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <Brain className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-indigo-800">AI-Powered Marketing Campaigns</h3>
              <p className="text-sm text-indigo-600">Generate emails, social posts, ads, and optimize campaigns with AI</p>
            </div>
          </div>
          <a 
            href="/admin/ai-guide" 
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm flex items-center hover:bg-indigo-700 transition-colors"
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            View AI Guide
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search campaigns..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="social">Social</option>
            <option value="ads">Ads</option>
            <option value="automation">Automation</option>
          </select>
          
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                          {campaign.type === 'email' && <Mail className="h-5 w-5 text-indigo-600" />}
                          {campaign.type === 'social' && <Users className="h-5 w-5 text-indigo-600" />}
                          {campaign.type === 'ads' && <Target className="h-5 w-5 text-indigo-600" />}
                          {campaign.type === 'automation' && <TrendingUp className="h-5 w-5 text-indigo-600" />}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-sm text-gray-500">{campaign.targetAudience}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 capitalize">
                      {campaign.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.metrics ? (
                      <div className="space-y-1">
                        <div>Sent: {campaign.metrics.sent.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          Opens: {campaign.metrics.opened} | Clicks: {campaign.metrics.clicked}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">No metrics</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleStatus(campaign._id, campaign.status)}
                        className={`${
                          campaign.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => startEdit(campaign)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(campaign._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No campaigns found</p>
          </div>
        )}
      </div>
    </div>
  )
}
