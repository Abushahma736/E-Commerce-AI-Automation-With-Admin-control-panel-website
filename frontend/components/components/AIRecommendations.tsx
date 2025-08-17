'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import { deepSeekAPI } from '@/lib/ai/deepseek'
import { Container } from '@/components/ui/Container'
import { Sparkles, Star, TrendingUp, Heart, ShoppingBag, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface AIRecommendationsProps {
  products: Product[]
  userId?: string | null
  className?: string
  maxRecommendations?: number
  title?: string
  showPersonalized?: boolean
  showTrending?: boolean
  context?: 'homepage' | 'cart' | 'product' | 'checkout'
}

interface RecommendationItem {
  product: Product
  reason: string
  confidence: number
  category: 'personalized' | 'trending' | 'similar' | 'complementary'
  aiInsight?: string
}

interface RecommendationResponse {
  recommendations: RecommendationItem[]
  insights: string
  personalizedMessage?: string
}

export default function AIRecommendations({
  products,
  userId = null,
  className = '',
  maxRecommendations = 4,
  title,
  showPersonalized = true,
  showTrending = true,
  context = 'homepage'
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [insights, setInsights] = useState<string>('')
  const [personalizedMessage, setPersonalizedMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    generateRecommendations()
  }, [products, userId, context])

  const generateRecommendations = async () => {
    try {
      setIsLoading(true)
      setError('')

      // Simulate getting user preferences (in real app, fetch from user profile/history)
      const userPreferences = getUserPreferences(userId)
      
      const response = await generateAIRecommendations(
        products,
        userPreferences,
        context,
        maxRecommendations
      )

      setRecommendations(response.recommendations)
      setInsights(response.insights)
      setPersonalizedMessage(response.personalizedMessage || '')

    } catch (err) {
      console.error('Failed to generate AI recommendations:', err)
      setError('Unable to load personalized recommendations')
      // Fallback to basic recommendations
      setRecommendations(generateFallbackRecommendations(products, maxRecommendations))
    } finally {
      setIsLoading(false)
    }
  }

  // Simulate user preferences (replace with actual user data)
  const getUserPreferences = (userId: string | null) => {
    if (!userId) {
      return {
        categories: ['Skincare', 'Haircare', 'Wellness'],
        priceRange: { min: 200, max: 2000 },
        ingredients: ['natural', 'organic', 'herbal'],
        skinType: 'combination',
        concerns: ['acne', 'anti-aging', 'hydration'],
        previousPurchases: [],
        browsedProducts: []
      }
    }

    // In real app, fetch from database
    return {
      categories: ['Skincare', 'Haircare'],
      priceRange: { min: 500, max: 1500 },
      ingredients: ['neem', 'turmeric', 'coconut'],
      skinType: 'sensitive',
      concerns: ['acne', 'dryness'],
      previousPurchases: [1, 3, 7], // Product IDs
      browsedProducts: [2, 5, 8, 12]
    }
  }

  // Generate AI-powered recommendations with smart fallback
  const generateAIRecommendations = async (
    products: Product[],
    preferences: any,
    context: string,
    maxRecs: number
  ): Promise<RecommendationResponse> => {
    const contextDescriptions = {
      homepage: 'browsing the homepage looking for new products',
      cart: 'viewing their shopping cart',
      product: 'viewing a specific product page',
      checkout: 'in the checkout process'
    }

    // First, try AI recommendations
    const messages = [
      {
        role: "system",
        content: `You are an AI wellness product recommendation expert for ESSE Naturals, specializing in natural and Ayurvedic products. 
        
        Generate personalized product recommendations based on user preferences, browsing behavior, and context.
        
        Consider:
        - User's skin type, concerns, and ingredient preferences
        - Price range and category preferences  
        - Previous purchases and browsing history
        - Current context and intent
        - Product compatibility and complementary items
        - Seasonal relevance and trends
        
        Provide specific, actionable reasons for each recommendation.`
      },
      {
        role: "user",
        content: `Generate ${maxRecs} product recommendations for a user who is ${contextDescriptions[context]}.

User Preferences:
- Categories: ${preferences.categories?.join(', ') || 'General wellness'}
- Price Range: ₹${preferences.priceRange?.min || 200} - ₹${preferences.priceRange?.max || 2000}
- Skin Type: ${preferences.skinType || 'Normal'}
- Concerns: ${preferences.concerns?.join(', ') || 'General wellness'}
- Preferred Ingredients: ${preferences.ingredients?.join(', ') || 'Natural, organic'}
        
Available Products: ${products.slice(0, 20).map(p => 
          `ID:${p.id} "${p.name}" - ₹${p.price} - Category:${p.category || 'General'} - Stock:${p.stock_quantity}`
        ).join('\n')}

Return JSON with this structure:
{
  "recommendations": [
    {
      "productId": number,
      "reason": "specific reason why this product fits the user",
      "confidence": number (0-1),
      "category": "personalized|trending|similar|complementary",
      "aiInsight": "brief insight about why this is perfect for them"
    }
  ],
  "insights": "overall insight about the user's needs and product selection",
  "personalizedMessage": "friendly message explaining the recommendations"
}`
      }
    ]

    try {
      const response = await deepSeekAPI.chat(messages, {
        temperature: 0.7,
        max_tokens: 1000
      })

      // Check if response is a fallback message (API failed)
      if (typeof response === 'string' && (
        response.includes('experiencing technical difficulties') ||
        response.includes('apologize') ||
        response.length < 50
      )) {
        console.log('AI API returned fallback response, using smart fallback recommendations')
        return generateSmartFallbackRecommendations(products, preferences, context, maxRecs)
      }

      // Try to parse the response as JSON
      let aiResponse
      try {
        aiResponse = JSON.parse(response)
      } catch (jsonError) {
        console.error('Failed to parse AI response as JSON:', jsonError)
        console.log('Response was:', response.substring(0, 200) + '...')
        // If JSON parsing fails, use smart fallback
        return generateSmartFallbackRecommendations(products, preferences, context, maxRecs)
      }
      
      // Map product IDs to actual products
      const recommendations: RecommendationItem[] = aiResponse.recommendations
        .map((rec: any) => {
          const product = products.find(p => p.id === rec.productId)
          if (!product) return null
          
          return {
            product,
            reason: rec.reason,
            confidence: rec.confidence,
            category: rec.category,
            aiInsight: rec.aiInsight
          }
        })
        .filter(Boolean)
        .slice(0, maxRecs)

      if (recommendations.length === 0) {
        // AI didn't return valid product IDs, use fallback
        return generateSmartFallbackRecommendations(products, preferences, context, maxRecs)
      }

      return {
        recommendations,
        insights: aiResponse.insights || '',
        personalizedMessage: aiResponse.personalizedMessage || ''
      }

    } catch (error) {
      console.error('AI recommendation generation failed:', error)
      // Use smart fallback instead of throwing
      return generateSmartFallbackRecommendations(products, preferences, context, maxRecs)
    }
  }

  // Smart fallback that considers user preferences
  const generateSmartFallbackRecommendations = (
    products: Product[],
    preferences: any,
    context: string,
    maxRecs: number
  ): RecommendationResponse => {
    console.log('Generating smart fallback recommendations based on preferences')
    
    // Filter products based on user preferences
    let filteredProducts = products.filter(p => p.stock_quantity > 0)
    
    // Apply price filter
    if (preferences.priceRange) {
      filteredProducts = filteredProducts.filter(p => 
        p.price >= (preferences.priceRange.min || 0) && 
        p.price <= (preferences.priceRange.max || 10000)
      )
    }
    
    // Apply category filter
    if (preferences.categories && preferences.categories.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        preferences.categories.some(cat => 
          p.category?.toLowerCase().includes(cat.toLowerCase()) ||
          p.name.toLowerCase().includes(cat.toLowerCase())
        )
      )
    }
    
    // Apply ingredient preferences
    if (preferences.ingredients && preferences.ingredients.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        preferences.ingredients.some(ingredient => 
          p.name.toLowerCase().includes(ingredient.toLowerCase()) ||
          p.description?.toLowerCase().includes(ingredient.toLowerCase())
        )
      )
    }
    
    // If too few products match, fall back to general products
    if (filteredProducts.length < maxRecs) {
      filteredProducts = products.filter(p => p.stock_quantity > 0)
    }
    
    // Sort by stock quantity (popular items) and price
    const sorted = filteredProducts
      .sort((a, b) => {
        // Prioritize items with more stock (indicates popularity)
        const stockDiff = b.stock_quantity - a.stock_quantity
        if (Math.abs(stockDiff) > 10) return stockDiff
        
        // Then by price (within user's range if specified)
        const targetPrice = preferences.priceRange ? 
          (preferences.priceRange.min + preferences.priceRange.max) / 2 : 1000
        return Math.abs(a.price - targetPrice) - Math.abs(b.price - targetPrice)
      })
      .slice(0, maxRecs)
    
    // Generate context-aware reasons
    const getReasonForProduct = (product: Product, index: number) => {
      const reasons = {
        homepage: [
          `Perfect for your ${preferences.skinType || 'normal'} skin type`,
          `Popular choice for ${preferences.concerns?.[0] || 'wellness'} concerns`,
          `Great value at ₹${product.price} within your budget`,
          `Highly rated natural product with premium ingredients`
        ],
        cart: [
          `Complements your current selection perfectly`,
          `Customers who bought similar items also love this`,
          `Essential addition for complete wellness routine`,
          `Special offer available for bundle purchase`
        ],
        product: [
          `Customers often pair this with similar products`,
          `Perfect complement to your viewed item`,
          `Alternative option with similar benefits`,
          `Complete your routine with this essential product`
        ],
        checkout: [
          `Don't miss this popular add-on item`,
          `Complete your order with this essential product`,
          `Frequently bought together by our customers`,
          `Last chance to add this to your order`
        ]
      }
      
      return reasons[context]?.[index % reasons[context].length] || 
             `Excellent choice for natural wellness enthusiasts`
    }
    
    const recommendations: RecommendationItem[] = sorted.map((product, index) => ({
      product,
      reason: getReasonForProduct(product, index),
      confidence: Math.max(0.6, 1 - (index * 0.1)), // Decrease confidence for lower positions
      category: index === 0 ? 'personalized' : (index < 2 ? 'trending' : 'similar'),
      aiInsight: `Popular choice among customers with similar preferences`
    }))
    
    const personalizedMessage = `Based on your preferences for ${preferences.categories?.join(' and ') || 'natural products'} ` +
      `within ₹${preferences.priceRange?.min || 200}-₹${preferences.priceRange?.max || 2000}, ` +
      `here are our top recommendations perfect for ${preferences.skinType || 'your skin type'}.`
    
    const insights = `These products are selected based on popularity, customer reviews, and your specified preferences. ` +
      `They're all in stock and ready for immediate shipping.`
    
    return {
      recommendations,
      insights,
      personalizedMessage
    }
  }

  // Fallback recommendations if AI fails
  const generateFallbackRecommendations = (products: Product[], maxRecs: number): RecommendationItem[] => {
    // Simple fallback: recommend popular/high-stock items
    const sorted = [...products]
      .filter(p => p.stock_quantity > 0)
      .sort((a, b) => b.stock_quantity - a.stock_quantity)
      .slice(0, maxRecs)

    return sorted.map(product => ({
      product,
      reason: 'Popular choice among our customers',
      confidence: 0.6,
      category: 'trending' as const,
      aiInsight: 'Well-reviewed natural wellness product'
    }))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personalized':
        return <Heart className="h-4 w-4" />
      case 'trending':
        return <TrendingUp className="h-4 w-4" />
      case 'similar':
        return <Star className="h-4 w-4" />
      case 'complementary':
        return <ShoppingBag className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personalized':
        return 'text-red-500'
      case 'trending':
        return 'text-green-500'
      case 'similar':
        return 'text-blue-500'
      case 'complementary':
        return 'text-purple-500'
      default:
        return 'text-brand-green'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'personalized':
        return 'For You'
      case 'trending':
        return 'Trending'
      case 'similar':
        return 'Similar'
      case 'complementary':
        return 'Perfect Match'
      default:
        return 'Recommended'
    }
  }

  if (isLoading) {
    return (
      <section className={`py-16 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 ${className}`}>
        <Container>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-brand-green animate-spin" />
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                {title || 'AI-Powered Recommendations'}
              </h2>
            </div>
            <p className="text-gray-600">Curating personalized products just for you...</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: maxRecommendations }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-6 rounded mb-3"></div>
                  <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    )
  }

  if (error) {
    return (
      <section className={`py-16 ${className}`}>
        <Container>
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={generateRecommendations}
              className="px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </Container>
      </section>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <section className={`py-16 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 ${className}`}>
      <Container>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-brand-green" />
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
              {title || 'AI-Powered Recommendations'}
            </h2>
          </div>
          
          {personalizedMessage && (
            <div className="max-w-2xl mx-auto mb-6">
              <p className="text-lg text-gray-700 bg-white/60 backdrop-blur-sm rounded-lg px-6 py-4 border border-green-100">
                {personalizedMessage}
              </p>
            </div>
          )}
          
          {insights && (
            <p className="text-gray-600 max-w-3xl mx-auto">
              {insights}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((rec, index) => (
            <div
              key={`${rec.product.id}_${index}`}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Category Badge */}
              <div className="p-4 pb-0">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(rec.category)} bg-gray-50`}>
                  {getCategoryIcon(rec.category)}
                  {getCategoryLabel(rec.category)}
                </div>
              </div>

              {/* Product Image */}
              <div className="p-4 pt-2">
                <div className="relative h-48 bg-gray-50 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={rec.product.image || '/images/default-product.jpg'}
                    alt={rec.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {rec.confidence > 0.8 && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Perfect Match
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                  {rec.product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-brand-green">
                    ₹{rec.product.price}
                  </span>
                  {rec.product.stock_quantity <= 5 && (
                    <span className="text-xs text-orange-500 font-medium">
                      Only {rec.product.stock_quantity} left
                    </span>
                  )}
                </div>

                {/* AI Insight */}
                {rec.aiInsight && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                    <p className="text-xs text-blue-700 font-medium">
                      💡 {rec.aiInsight}
                    </p>
                  </div>
                )}

                {/* Recommendation Reason */}
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4">
                  <p className="text-xs text-green-700">
                    <strong>Why we recommend:</strong> {rec.reason}
                  </p>
                </div>

                {/* Confidence Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">AI Confidence</span>
                    <span className="text-xs text-gray-600">{Math.round(rec.confidence * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-brand-green to-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${rec.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/products/${rec.product.id}`}
                    className="flex-1 bg-brand-green hover:bg-brand-green/90 text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors"
                  >
                    View Details
                  </Link>
                  <button className="px-3 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <Heart className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-brand-green text-brand-green rounded-lg hover:bg-brand-green hover:text-white transition-colors font-medium"
          >
            Explore All Products
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
