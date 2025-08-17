'use client'

import { useState } from 'react'
import { 
  Brain, 
  Mail, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Zap, 
  Loader2, 
  CheckCircle,
  AlertTriangle,
  Users,
  Megaphone,
  BarChart3,
  Copy,
  Sparkles,
  Hash
} from 'lucide-react'

interface AIMarketingAssistantProps {
  campaignData?: {
    name?: string
    type?: string
    targetAudience?: string
    products?: string[]
    tone?: string
  }
  onContentGenerated?: (type: string, content: any) => void
}

interface GenerationState {
  isLoading: boolean
  error: string | null
  success: boolean
}

export default function AIMarketingAssistant({ campaignData, onContentGenerated }: AIMarketingAssistantProps) {
  const [states, setStates] = useState<Record<string, GenerationState>>({
    emailSubject: { isLoading: false, error: null, success: false },
    emailContent: { isLoading: false, error: null, success: false },
    socialPost: { isLoading: false, error: null, success: false },
    adCopy: { isLoading: false, error: null, success: false },
    segments: { isLoading: false, error: null, success: false },
    optimize: { isLoading: false, error: null, success: false }
  })

  const updateState = (type: string, updates: Partial<GenerationState>) => {
    setStates(prev => ({
      ...prev,
      [type]: { ...prev[type], ...updates }
    }))
  }

  const resetState = (type: string) => {
    setStates(prev => ({
      ...prev,
      [type]: { isLoading: false, error: null, success: false }
    }))
  }

  const generateEmailSubject = async () => {
    if (!campaignData?.name && !campaignData?.type) {
      updateState('emailSubject', { error: 'Campaign name or type is required' })
      return
    }

    updateState('emailSubject', { isLoading: true, error: null })

    try {
      const response = await fetch('http://127.0.0.1:5001/api/marketing/generate-email-subject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_type: campaignData?.type || 'promotional',
          target_audience: campaignData?.targetAudience || 'general',
          product_focus: campaignData?.products?.join(', ') || '',
          tone: campaignData?.tone || 'friendly'
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        updateState('emailSubject', { isLoading: false, success: true })
        onContentGenerated?.('emailSubject', data.data)
        setTimeout(() => resetState('emailSubject'), 3000)
      } else {
        throw new Error(data.error || 'Failed to generate email subjects')
      }
    } catch (error) {
      updateState('emailSubject', { 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Generation failed'
      })
    }
  }

  const generateEmailContent = async () => {
    if (!campaignData?.name && !campaignData?.type) {
      updateState('emailContent', { error: 'Campaign name or type is required' })
      return
    }

    updateState('emailContent', { isLoading: true, error: null })

    try {
      const response = await fetch('http://127.0.0.1:5001/api/marketing/generate-email-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_type: campaignData?.type || 'promotional',
          target_audience: campaignData?.targetAudience || 'general',
          products: campaignData?.products || [],
          tone: campaignData?.tone || 'friendly'
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        updateState('emailContent', { isLoading: false, success: true })
        onContentGenerated?.('emailContent', data.data)
        setTimeout(() => resetState('emailContent'), 3000)
      } else {
        throw new Error(data.error || 'Failed to generate email content')
      }
    } catch (error) {
      updateState('emailContent', { 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Generation failed'
      })
    }
  }

  const generateSocialPost = async () => {
    if (!campaignData?.name && !campaignData?.products?.length) {
      updateState('socialPost', { error: 'Campaign name or products required' })
      return
    }

    updateState('socialPost', { isLoading: true, error: null })

    try {
      const response = await fetch('http://127.0.0.1:5001/api/marketing/generate-social-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'instagram',
          product: campaignData?.products?.[0] || campaignData?.name || '',
          occasion: campaignData?.type || 'general'
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        updateState('socialPost', { isLoading: false, success: true })
        onContentGenerated?.('socialPost', data.data)
        setTimeout(() => resetState('socialPost'), 3000)
      } else {
        throw new Error(data.error || 'Failed to generate social post')
      }
    } catch (error) {
      updateState('socialPost', { 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Generation failed'
      })
    }
  }

  const generateAdCopy = async () => {
    if (!campaignData?.name && !campaignData?.type) {
      updateState('adCopy', { error: 'Campaign name or type is required' })
      return
    }

    updateState('adCopy', { isLoading: true, error: null })

    try {
      const response = await fetch('http://127.0.0.1:5001/api/marketing/generate-ad-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'google',
          objective: 'conversions',
          target_audience: campaignData?.targetAudience || 'general'
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        updateState('adCopy', { isLoading: false, success: true })
        onContentGenerated?.('adCopy', data.data)
        setTimeout(() => resetState('adCopy'), 3000)
      } else {
        throw new Error(data.error || 'Failed to generate ad copy')
      }
    } catch (error) {
      updateState('adCopy', { 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Generation failed'
      })
    }
  }

  const analyzeSegments = async () => {
    updateState('segments', { isLoading: true, error: null })

    try {
      const response = await fetch('http://127.0.0.1:5001/api/marketing/analyze-segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          criteria: {
            campaign_type: campaignData?.type,
            target_audience: campaignData?.targetAudience
          }
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        updateState('segments', { isLoading: false, success: true })
        onContentGenerated?.('segments', data.data)
        setTimeout(() => resetState('segments'), 3000)
      } else {
        throw new Error(data.error || 'Failed to analyze segments')
      }
    } catch (error) {
      updateState('segments', { 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Generation failed'
      })
    }
  }

  const optimizeCampaign = async () => {
    if (!campaignData?.name && !campaignData?.type) {
      updateState('optimize', { error: 'Campaign data is required' })
      return
    }

    updateState('optimize', { isLoading: true, error: null })

    try {
      const response = await fetch('http://127.0.0.1:5001/api/marketing/optimize-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_data: campaignData
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        updateState('optimize', { isLoading: false, success: true })
        onContentGenerated?.('optimize', data.data)
        setTimeout(() => resetState('optimize'), 3000)
      } else {
        throw new Error(data.error || 'Failed to optimize campaign')
      }
    } catch (error) {
      updateState('optimize', { 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Generation failed'
      })
    }
  }

  const ActionButton = ({ 
    type, 
    icon: Icon, 
    title, 
    description, 
    color,
    onClick 
  }: {
    type: string
    icon: any
    title: string
    description: string
    color: string
    onClick: () => void
  }) => {
    const state = states[type]
    
    return (
      <button
        onClick={onClick}
        disabled={state.isLoading}
        className={`relative p-4 rounded-lg border-2 transition-all text-left w-full ${
          state.success 
            ? 'border-green-200 bg-green-50' 
            : state.error 
            ? 'border-red-200 bg-red-50'
            : `border-${color}-200 bg-${color}-50 hover:border-${color}-300 hover:bg-${color}-100`
        } ${state.isLoading ? 'opacity-75' : ''}`}
      >
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${
            state.success 
              ? 'bg-green-100' 
              : state.error 
              ? 'bg-red-100'
              : `bg-${color}-100`
          }`}>
            {state.isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
            ) : state.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : state.error ? (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            ) : (
              <Icon className={`h-5 w-5 text-${color}-600`} />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
            <p className="text-xs text-gray-600 mt-1">{description}</p>
            
            {state.error && (
              <p className="text-xs text-red-600 mt-2">{state.error}</p>
            )}
            
            {state.success && (
              <p className="text-xs text-green-600 mt-2">✓ Generated successfully!</p>
            )}
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border-2 border-indigo-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-full">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Marketing Assistant</h3>
          <p className="text-sm text-gray-600">Generate marketing content and optimize campaigns with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ActionButton
          type="emailSubject"
          icon={Mail}
          title="Email Subject Lines"
          description="Generate compelling email subject lines that boost open rates"
          color="blue"
          onClick={generateEmailSubject}
        />

        <ActionButton
          type="emailContent"
          icon={MessageSquare}
          title="Email Content"
          description="Create engaging email content tailored to your audience"
          color="green"
          onClick={generateEmailContent}
        />

        <ActionButton
          type="socialPost"
          icon={Hash}
          title="Social Media Posts"
          description="Generate social media content with optimal hashtags"
          color="pink"
          onClick={generateSocialPost}
        />

        <ActionButton
          type="adCopy"
          icon={Megaphone}
          title="Ad Copy"
          description="Create high-converting advertisement copy and headlines"
          color="orange"
          onClick={generateAdCopy}
        />

        <ActionButton
          type="segments"
          icon={Users}
          title="Customer Segments"
          description="Analyze and suggest optimal customer targeting segments"
          color="teal"
          onClick={analyzeSegments}
        />

        <ActionButton
          type="optimize"
          icon={TrendingUp}
          title="Campaign Optimization"
          description="Get AI-powered insights to improve campaign performance"
          color="purple"
          onClick={optimizeCampaign}
        />
      </div>

      {!campaignData?.name && !campaignData?.type && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Campaign Data Required</p>
              <p className="text-xs text-yellow-700">Enter campaign information to unlock AI-powered marketing features</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-indigo-200">
        <p className="text-xs text-gray-500 flex items-center">
          <Brain className="h-3 w-3 mr-1" />
          Powered by Google Gemini 2.0 Flash & Advanced Marketing AI
        </p>
      </div>
    </div>
  )
}
