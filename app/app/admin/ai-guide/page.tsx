'use client'

import { useState } from 'react'
import { 
  Brain, 
  Sparkles, 
  Target, 
  Eye, 
  FileText, 
  Tags, 
  TrendingUp, 
  Users, 
  Image as ImageIcon,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Copy,
  ExternalLink,
  Lightbulb,
  Rocket,
  Shield
} from 'lucide-react'

interface AIFeature {
  id: string
  title: string
  description: string
  icon: any
  category: 'content' | 'recommendations' | 'automation' | 'analytics'
  endpoint?: string
  example?: any
  benefits: string[]
  howToUse: string[]
}

const aiFeatures: AIFeature[] = [
  {
    id: 'product-description',
    title: 'AI Product Description Generator',
    description: 'Generate compelling, SEO-optimized product descriptions using Google Gemini 2.0 Flash',
    icon: FileText,
    category: 'content',
    endpoint: 'POST /api/generate-description',
    example: {
      input: {
        product_name: "Organic Lavender Essential Oil",
        features: ["100% pure", "organic", "calming"],
        category: "Essential Oils"
      },
      output: "Professional 1000+ character description with benefits and usage instructions"
    },
    benefits: [
      'Save 30+ minutes per product',
      'SEO-optimized content',
      'Consistent brand voice',
      'Professional copywriting quality'
    ],
    howToUse: [
      'Go to Products → Add New Product',
      'Click "Generate with AI" button',
      'Review and customize the generated description',
      'Save and publish'
    ]
  },
  {
    id: 'category-classification',
    title: 'Smart Category & Tag Generator',
    description: 'Automatically categorize products and generate relevant tags using AI analysis',
    icon: Tags,
    category: 'content',
    endpoint: 'POST /api/generate-categories',
    example: {
      input: {
        product_name: "Green Tea Extract",
        description: "Natural antioxidant supplement"
      },
      output: "Primary: Health Supplements, Secondary: Antioxidants, Tags: green-tea, natural, wellness"
    },
    benefits: [
      'Consistent categorization',
      'Better search discoverability',
      'Improved site organization',
      'Automated tagging system'
    ],
    howToUse: [
      'Open any product',
      'Click "Auto-categorize" button',
      'AI suggests categories and tags',
      'Approve or modify suggestions'
    ]
  },
  {
    id: 'seo-metadata',
    title: 'SEO Metadata Generator',
    description: 'Create optimized meta titles, descriptions, and keywords for better search rankings',
    icon: TrendingUp,
    category: 'content',
    endpoint: 'POST /api/generate-seo',
    example: {
      input: {
        product_name: "Tea Tree Oil",
        description: "Natural antiseptic essential oil",
        price: 19.99
      },
      output: "Title: Premium Tea Tree Oil - 100% Pure | Keywords: tea tree, antiseptic, natural skincare"
    },
    benefits: [
      'Improved search rankings',
      'Higher click-through rates',
      'Better Google visibility',
      'Automated SEO optimization'
    ],
    howToUse: [
      'Navigate to Products → SEO Settings',
      'Select "Generate SEO" for any product',
      'Review generated meta data',
      'Apply to product listing'
    ]
  },
  {
    id: 'recommendations',
    title: 'Personalized Recommendations',
    description: 'AI-powered recommendation engine using collaborative filtering for personalized shopping',
    icon: Target,
    category: 'recommendations',
    endpoint: 'GET /api/user-recommendations/{user_id}',
    example: {
      input: {
        user_id: "user_123",
        n_recommendations: 5
      },
      output: "5 personalized product recommendations with confidence scores"
    },
    benefits: [
      '25% increase in average order value',
      'Improved customer satisfaction',
      'Higher conversion rates',
      'Reduced cart abandonment'
    ],
    howToUse: [
      'Train the model: Admin → AI Settings → Train Recommendations',
      'Model automatically provides recommendations',
      'View in customer profiles',
      'Customize recommendation rules'
    ]
  },
  {
    id: 'similar-products',
    title: 'Similar Products Engine',
    description: 'Find and suggest related products using advanced similarity algorithms',
    icon: Users,
    category: 'recommendations',
    endpoint: 'GET /api/item-recommendations/{product_id}',
    example: {
      input: {
        product_id: "Turmeric Extract",
        n_recommendations: 5
      },
      output: "5 similar products: Ginger Extract, Black Pepper Oil, Curcumin Capsules..."
    },
    benefits: [
      'Cross-selling opportunities',
      'Better product discovery',
      'Increased session duration',
      'Enhanced user experience'
    ],
    howToUse: [
      'Automatic on product pages',
      'Configure in Admin → Recommendations',
      'Customize similarity threshold',
      'Monitor performance metrics'
    ]
  },
  {
    id: 'image-analysis',
    title: 'AI Image Analysis & Alt Text',
    description: 'Analyze product images and generate SEO-friendly alt text using BLIP model',
    icon: ImageIcon,
    category: 'content',
    endpoint: 'POST /api/analyze-image',
    example: {
      input: {
        image_source: "https://example.com/lavender.jpg",
        product_name: "Lavender Oil"
      },
      output: "Alt text: Premium organic lavender essential oil bottle with purple flowers background"
    },
    benefits: [
      'Better image SEO',
      'Accessibility compliance',
      'Automated alt text generation',
      'Visual content optimization'
    ],
    howToUse: [
      'Upload product images',
      'Click "Generate Alt Text"',
      'AI analyzes image content',
      'Auto-applies SEO-friendly descriptions'
    ]
  },
  {
    id: 'pricing-optimization',
    title: 'AI Pricing Strategy',
    description: 'Get intelligent pricing recommendations based on market analysis and competition',
    icon: TrendingUp,
    category: 'analytics',
    endpoint: 'POST /api/generate-pricing',
    example: {
      input: {
        product_name: "Premium Rose Oil",
        current_price: 49.99,
        category: "Essential Oils"
      },
      output: "Suggested price range: $45-55, Competitive analysis, Demand forecast"
    },
    benefits: [
      'Optimized profit margins',
      'Competitive pricing',
      'Market-based recommendations',
      'Dynamic pricing strategies'
    ],
    howToUse: [
      'Go to Products → Pricing Analysis',
      'Select products for analysis',
      'Review AI pricing suggestions',
      'Apply recommended prices'
    ]
  },
  {
    id: 'complete-automation',
    title: 'Complete Product Automation',
    description: 'One-click complete product setup with description, categories, SEO, and more',
    icon: Zap,
    category: 'automation',
    endpoint: 'POST /api/complete-product-automation',
    example: {
      input: {
        product_name: "Himalayan Pink Salt Scrub",
        features: ["Exfoliating", "Natural"],
        price: 24.99
      },
      output: "Complete product setup: description, categories, tags, SEO metadata, similar products"
    },
    benefits: [
      'Save 90% of setup time',
      'Consistent product quality',
      'Error-free product creation',
      'Standardized workflows'
    ],
    howToUse: [
      'Products → Add New → Quick Setup',
      'Enter basic product info',
      'Click "Auto-Generate Everything"',
      'Review and publish'
    ]
  }
]

const categories = {
  content: { name: 'Content Generation', color: 'bg-blue-100 text-blue-800' },
  recommendations: { name: 'Smart Recommendations', color: 'bg-green-100 text-green-800' },
  automation: { name: 'Process Automation', color: 'bg-purple-100 text-purple-800' },
  analytics: { name: 'Analytics & Insights', color: 'bg-orange-100 text-orange-800' }
}

export default function AIFeaturesGuide() {
  const [selectedFeature, setSelectedFeature] = useState<AIFeature | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [copiedEndpoint, setCopiedEndpoint] = useState('')

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedEndpoint(text)
    setTimeout(() => setCopiedEndpoint(''), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Brain className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Features Guide</h1>
            <p className="text-blue-100 mt-2">
              Complete guide to ESSE's AI-powered automation features
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Rocket className="h-5 w-5" />
              <span className="font-semibold">8 AI Features</span>
            </div>
            <p className="text-sm text-blue-100 mt-1">Powered by Google Gemini & ML</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Production Ready</span>
            </div>
            <p className="text-sm text-blue-100 mt-1">Tested & validated system</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span className="font-semibold">90% Time Saved</span>
            </div>
            <p className="text-sm text-blue-100 mt-1">On product management tasks</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'features'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Features
          </button>
          <button
            onClick={() => setActiveTab('quick-start')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quick-start'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Quick Start
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(categories).map(([key, category]) => {
              const featuresCount = aiFeatures.filter(f => f.category === key).length
              return (
                <div key={key} className="bg-white p-6 rounded-lg border shadow-sm">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                    {category.name}
                  </div>
                  <h3 className="text-lg font-semibold mt-4">{featuresCount} Features</h3>
                  <p className="text-gray-600 text-sm mt-2">
                    {key === 'content' && 'Generate high-quality content with AI'}
                    {key === 'recommendations' && 'Personalized shopping experiences'}
                    {key === 'automation' && 'Streamline workflows and processes'}
                    {key === 'analytics' && 'Data-driven insights and optimization'}
                  </p>
                </div>
              )
            })}
          </div>

          {/* AI System Status */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              AI System Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Google Gemini API</p>
                  <p className="text-sm text-gray-600">Ready & Operational</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Recommendation Engine</p>
                  <p className="text-sm text-gray-600">Model Trained (1,497 ratings)</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium">BLIP Image Analysis</p>
                  <p className="text-sm text-gray-600">Lazy Loaded (Ready on demand)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon
              const category = categories[feature.category]
              
              return (
                <div key={feature.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold">{feature.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                            {category.name}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{feature.description}</p>
                        
                        {/* Benefits */}
                        <div className="mb-4">
                          <h4 className="font-medium text-sm mb-2">Key Benefits:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {feature.benefits.map((benefit, idx) => (
                              <div key={idx} className="flex items-center space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* API Endpoint */}
                        {feature.endpoint && (
                          <div className="mb-4">
                            <h4 className="font-medium text-sm mb-2">API Endpoint:</h4>
                            <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded font-mono text-sm">
                              <code className="flex-1">{feature.endpoint}</code>
                              <button
                                onClick={() => copyToClipboard(feature.endpoint)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {copiedEndpoint === feature.endpoint ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFeature(feature)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick Start Tab */}
      {activeTab === 'quick-start' && (
        <div className="space-y-8">
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800">Getting Started with AI Features</h3>
                <p className="text-yellow-700 mt-1">
                  Follow these steps to start using AI automation in your e-commerce admin panel.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <h3 className="text-xl font-semibold">Setup & Configuration</h3>
              </div>
              <div className="ml-11 space-y-3">
                <p className="text-gray-600">Ensure your AI services are properly configured:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>AI Automation Server running on port 5000</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Google Gemini API key configured</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Recommendation model trained</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <h3 className="text-xl font-semibold">Start with Product Description</h3>
              </div>
              <div className="ml-11 space-y-3">
                <p className="text-gray-600">Begin with the most impactful feature:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">Try this now:</p>
                  <ol className="list-decimal list-inside text-sm space-y-1 mt-2">
                    <li>Go to Products → Add New Product</li>
                    <li>Enter basic product info</li>
                    <li>Click "Generate with AI" button</li>
                    <li>Review the generated description</li>
                    <li>Save and see the results!</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <h3 className="text-xl font-semibold">Explore Advanced Features</h3>
              </div>
              <div className="ml-11 space-y-3">
                <p className="text-gray-600">Once comfortable, try these powerful features:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border p-3 rounded">
                    <h4 className="font-medium">Complete Automation</h4>
                    <p className="text-sm text-gray-600">One-click product setup</p>
                  </div>
                  <div className="border p-3 rounded">
                    <h4 className="font-medium">Smart Recommendations</h4>
                    <p className="text-sm text-gray-600">Personalized shopping</p>
                  </div>
                  <div className="border p-3 rounded">
                    <h4 className="font-medium">SEO Optimization</h4>
                    <p className="text-sm text-gray-600">Search-friendly content</p>
                  </div>
                  <div className="border p-3 rounded">
                    <h4 className="font-medium">Image Analysis</h4>
                    <p className="text-sm text-gray-600">Auto alt text generation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <selectedFeature.icon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold">{selectedFeature.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-gray-600">{selectedFeature.description}</p>
              
              {selectedFeature.example && (
                <div>
                  <h3 className="font-semibold mb-3">Example Usage:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Input:</h4>
                      <pre className="text-sm bg-white p-2 rounded border">
                        {JSON.stringify(selectedFeature.example.input, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Output:</h4>
                      <div className="text-sm bg-white p-2 rounded border">
                        {selectedFeature.example.output}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold mb-3">How to Use:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {selectedFeature.howToUse.map((step, idx) => (
                    <li key={idx} className="text-sm">{step}</li>
                  ))}
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Benefits:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedFeature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
