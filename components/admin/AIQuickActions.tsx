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
  Copy
} from 'lucide-react'

interface AIQuickActionsProps {
  productData?: {
    name?: string
    features?: string[]
    category?: string
    price?: number
    description?: string
  }
  onContentGenerated?: (type: string, content: any) => void
}

interface GenerationState {
  isLoading: boolean
  error: string | null
  success: boolean
}

export default function AIQuickActions({ productData, onContentGenerated }: AIQuickActionsProps) {
  const [states, setStates] = useState<Record<string, GenerationState>>({
    description: { isLoading: false, error: null, success: false },
    categories: { isLoading: false, error: null, success: false },
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

  const generateDescription = async () => {
    if (!productData?.name) {
      updateState('description', { error: 'Product name is required' })
      return
    }

    updateState('description', { isLoading: true, error: null })

    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: productData.name,
          features: productData.features || [],
          category: productData.category || 'General',
          image_description: ''
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        updateState('description', { isLoading: false, success: true })
        onContentGenerated?.('description', data.data.description)
        setTimeout(() => resetState('description'), 3000)
      } else {
        throw new Error(data.message || 'Failed to generate description')
      }
    } catch (error) {
      updateState('description', { 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Generation failed'
      })
    }
  }

  const generateCategories = async () => {
    if (!productData?.name) {
      updateState('categories', { error: 'Product name is required' })
      return
    }

    updateState('categories', { isLoading: true, error: null })

    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: productData.name,
          description: productData.description || '',
          image_description: ''
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        updateState('categories', { isLoading: false, success: true })
        onContentGenerated?.('categories', data.data.classification)
        setTimeout(() => resetState('categories'), 3000)
      } else {
        throw new Error(data.message || 'Failed to generate categories')
      }
    } catch (error) {
      updateState('categories', { 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Generation failed'
      })
    }
  }

  const generateSEO = async () => {
    if (!productData?.name) {
      updateState('seo', { error: 'Product name is required' })
      return
    }

    updateState('seo', { isLoading: true, error: null })

    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: productData.name,
          description: productData.description || '',
          category: productData.category || '',
          price: productData.price || 0
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
    if (!productData?.name) {
      updateState('complete', { error: 'Product name is required' })
      return
    }

    updateState('complete', { isLoading: true, error: null })

    try {
      const response = await fetch('http://127.0.0.1:5000/api/complete-product-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: productData.name,
          features: productData.features || [],
          category: productData.category || '',
          price: productData.price || 0
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        updateState('complete', { isLoading: false, success: true })
        onContentGenerated?.('complete', data.data)
        setTimeout(() => resetState('complete'), 3000)
      } else {
        throw new Error(data.message || 'Failed to complete automation')
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
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Quick Actions</h3>
          <p className="text-sm text-gray-600">Generate content automatically with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActionButton
          type="description"
          icon={FileText}
          title="Generate Description"
          description="Create compelling product description with AI"
          color="blue"
          onClick={generateDescription}
        />

        <ActionButton
          type="categories"
          icon={Tags}
          title="Auto-Categorize"
          description="Suggest categories and tags automatically"
          color="green"
          onClick={generateCategories}
        />

        <ActionButton
          type="seo"
          icon={TrendingUp}
          title="SEO Optimization"
          description="Generate meta titles, descriptions & keywords"
          color="orange"
          onClick={generateSEO}
        />

        <ActionButton
          type="complete"
          icon={Zap}
          title="Complete Automation"
          description="Generate everything: description, SEO, categories"
          color="purple"
          onClick={generateComplete}
        />
      </div>

      {!productData?.name && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Product Name Required</p>
              <p className="text-xs text-yellow-700">Enter a product name to use AI features</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-blue-200">
        <p className="text-xs text-gray-500 flex items-center">
          <Brain className="h-3 w-3 mr-1" />
          Powered by Google Gemini 2.0 Flash & Machine Learning
        </p>
      </div>
    </div>
  )
}
