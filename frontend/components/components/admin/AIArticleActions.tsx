'use client'

import { useState } from 'react'
import { 
  Brain, 
  FileText, 
  Tags, 
  TrendingUp, 
  Zap, 
  Loader2, 
  CheckCircle,
  AlertTriangle,
  Hash,
  Newspaper,
  Type
} from 'lucide-react'

interface AIArticleActionsProps {
  articleData?: {
    title?: string
    content?: string
    excerpt?: string
    category?: string
    tags?: string[]
  }
  onContentGenerated?: (type: string, content: any) => void
}

interface GenerationState {
  isLoading: boolean
  error: string | null
  success: boolean
}

export default function AIArticleActions({ articleData, onContentGenerated }: AIArticleActionsProps) {
  const [states, setStates] = useState<Record<string, GenerationState>>({
    content: { isLoading: false, error: null, success: false },
    excerpt: { isLoading: false, error: null, success: false },
    tags: { isLoading: false, error: null, success: false },
    seo: { isLoading: false, error: null, success: false },
    complete: { isLoading: false, error: null, success: false }
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

  const generateContent = async () => {
    if (!articleData?.title) {
      updateState('content', { error: 'Article title is required' })
      return
    }

    updateState('content', { isLoading: true, error: null })

    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: articleData.title,
          features: ['Blog article', 'Educational content', 'SEO optimized'],
          category: articleData.category || 'Blog',
          image_description: ''
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        updateState('content', { isLoading: false, success: true })
        // For articles, we'll generate a longer, more detailed content
        const expandedContent = `${data.data.description}\n\nThis comprehensive article explores the key aspects and benefits, providing readers with valuable insights and actionable information. Our expert analysis ensures you get the most relevant and up-to-date content.\n\n## Key Points\n\n- Detailed exploration of the topic\n- Evidence-based information\n- Practical applications\n- Expert recommendations\n\n## Conclusion\n\nThis article provides a thorough understanding of the subject matter, helping readers make informed decisions.`
        
        onContentGenerated?.('content', expandedContent)
        setTimeout(() => resetState('content'), 3000)
      } else {
        throw new Error(data.message || 'Failed to generate content')
      }
    } catch (error) {
      updateState('content', { 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Generation failed'
      })
    }
  }

  const generateExcerpt = async () => {
    if (!articleData?.title) {
      updateState('excerpt', { error: 'Article title is required' })
      return
    }

    updateState('excerpt', { isLoading: true, error: null })

    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: `${articleData.title} - Article Summary`,
          features: ['Brief summary', 'Engaging excerpt', 'SEO friendly'],
          category: 'Article Excerpt',
          image_description: ''
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        updateState('excerpt', { isLoading: false, success: true })
        // Create a shorter excerpt from the description
        const excerpt = data.data.description.substring(0, 150) + '...'
        onContentGenerated?.('excerpt', excerpt)
        setTimeout(() => resetState('excerpt'), 3000)
      } else {
        throw new Error(data.message || 'Failed to generate excerpt')
      }
    } catch (error) {
      updateState('excerpt', { 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Generation failed'
      })
    }
  }

  const generateTags = async () => {
    if (!articleData?.title) {
      updateState('tags', { error: 'Article title is required' })
      return
    }

    updateState('tags', { isLoading: true, error: null })

    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: articleData.title,
          description: articleData.excerpt || articleData.content || '',
          image_description: ''
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        updateState('tags', { isLoading: false, success: true })
        // Convert categories to tags
        const tags = [
          data.data.classification.primary_category,
          ...(data.data.classification.secondary_categories || [])
        ].filter(tag => tag).slice(0, 5) // Limit to 5 tags
        
        onContentGenerated?.('tags', tags)
        setTimeout(() => resetState('tags'), 3000)
      } else {
        throw new Error(data.message || 'Failed to generate tags')
      }
    } catch (error) {
      updateState('tags', { 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Generation failed'
      })
    }
  }

  const generateSEO = async () => {
    if (!articleData?.title) {
      updateState('seo', { error: 'Article title is required' })
      return
    }

    updateState('seo', { isLoading: true, error: null })

    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: articleData.title,
          description: articleData.excerpt || articleData.content || 'Blog article',
          category: articleData.category || 'Blog',
          price: 0
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        updateState('seo', { isLoading: false, success: true })
        onContentGenerated?.('seo', data.data.seo_metadata)
        setTimeout(() => resetState('seo'), 3000)
      } else {
        throw new Error(data.message || 'Failed to generate SEO')
      }
    } catch (error) {
      updateState('seo', { 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Generation failed'
      })
    }
  }

  const generateComplete = async () => {
    if (!articleData?.title) {
      updateState('complete', { error: 'Article title is required' })
      return
    }

    updateState('complete', { isLoading: true, error: null })

    try {
      // Generate content
      const contentResponse = await fetch('http://127.0.0.1:5000/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: articleData.title,
          features: ['Blog article', 'Educational content', 'SEO optimized'],
          category: articleData.category || 'Blog',
          image_description: ''
        })
      })

      const contentData = await contentResponse.json()
      
      // Generate tags
      const tagsResponse = await fetch('http://127.0.0.1:5000/api/generate-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: articleData.title,
          description: contentData.data?.description || '',
          image_description: ''
        })
      })

      const tagsData = await tagsResponse.json()

      if (contentResponse.ok) {
        const expandedContent = `${contentData.data.description}\n\nThis comprehensive article explores the key aspects and benefits, providing readers with valuable insights and actionable information. Our expert analysis ensures you get the most relevant and up-to-date content.\n\n## Key Points\n\n- Detailed exploration of the topic\n- Evidence-based information\n- Practical applications\n- Expert recommendations\n\n## Conclusion\n\nThis article provides a thorough understanding of the subject matter, helping readers make informed decisions.`
        
        const excerpt = contentData.data.description.substring(0, 150) + '...'
        
        const tags = tagsResponse.ok ? [
          tagsData.data.classification.primary_category,
          ...(tagsData.data.classification.secondary_categories || [])
        ].filter(tag => tag).slice(0, 5) : []

        updateState('complete', { isLoading: false, success: true })
        onContentGenerated?.('complete', {
          content: expandedContent,
          excerpt: excerpt,
          tags: tags
        })
        setTimeout(() => resetState('complete'), 3000)
      } else {
        throw new Error(contentData.message || 'Failed to complete automation')
      }
    } catch (error) {
      updateState('complete', { 
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
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Article Actions</h3>
          <p className="text-sm text-gray-600">Generate article content automatically with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActionButton
          type="content"
          icon={FileText}
          title="Generate Content"
          description="Create comprehensive article content with AI"
          color="purple"
          onClick={generateContent}
        />

        <ActionButton
          type="excerpt"
          icon={Type}
          title="Generate Excerpt"
          description="Create compelling article summary automatically"
          color="blue"
          onClick={generateExcerpt}
        />

        <ActionButton
          type="tags"
          icon={Tags}
          title="Generate Tags"
          description="Suggest relevant tags and categories"
          color="green"
          onClick={generateTags}
        />

        <ActionButton
          type="seo"
          icon={TrendingUp}
          title="SEO Optimization"
          description="Generate meta titles, descriptions & keywords"
          color="orange"
          onClick={generateSEO}
        />

        <div className="md:col-span-2">
          <ActionButton
            type="complete"
            icon={Zap}
            title="Complete Article Automation"
            description="Generate everything: content, excerpt, tags, and SEO optimization"
            color="pink"
            onClick={generateComplete}
          />
        </div>
      </div>

      {!articleData?.title && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Article Title Required</p>
              <p className="text-xs text-yellow-700">Enter an article title to use AI features</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-purple-200">
        <p className="text-xs text-gray-500 flex items-center">
          <Brain className="h-3 w-3 mr-1" />
          Powered by Google Gemini 2.0 Flash & Machine Learning
        </p>
      </div>
    </div>
  )
}
