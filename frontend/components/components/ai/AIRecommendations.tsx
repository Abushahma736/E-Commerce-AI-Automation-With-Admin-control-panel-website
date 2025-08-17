'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Container } from '@/components/ui/Container'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Sparkles, TrendingUp, Heart, Clock, ArrowRight } from 'lucide-react'
import { Product } from '@/types'
import { getPersonalizedRecommendations, getSimilarProducts, getTrendingProducts, trackUserActivity, AIRecommendation } from '@/lib/ai/recommendations'

interface AIRecommendationsProps {
  products: Product[]
  userId?: string
  currentProduct?: Product
  className?: string
}

type RecommendationType = 'personalized' | 'trending' | 'similar'

export function AIRecommendations({ products, userId, currentProduct, className = '' }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [recommendationType, setRecommendationType] = useState<RecommendationType>('personalized')
  const [error, setError] = useState<string | null>(null)

  // Load recommendations
  useEffect(() => {
    loadRecommendations()
  }, [products, userId, currentProduct, recommendationType])

  const loadRecommendations = async () => {
    if (products.length === 0) return

    setLoading(true)
    setError(null)

    try {
      let recs: AIRecommendation[] = []

      switch (recommendationType) {
        case 'personalized':
          if (userId) {
            recs = await getPersonalizedRecommendations(userId, products, { limit: 8 })
          } else {
            // Fallback to trending for non-logged users
            recs = await getTrendingProducts(products, undefined, 8)
          }
          break
        
        case 'similar':
          if (currentProduct) {
            recs = await getSimilarProducts(currentProduct, products, 8)
          } else {
            recs = await getTrendingProducts(products, undefined, 8)
          }
          break
        
        case 'trending':
          recs = await getTrendingProducts(products, undefined, 8)
          break
      }

      setRecommendations(recs)
    } catch (err) {
      console.error('Error loading recommendations:', err)
      setError('Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  const handleProductView = (product: Product) => {
    // Track user interaction for future recommendations
    if (userId) {
      trackUserActivity(userId, 'view', product.id.toString(), {
        source: 'ai_recommendations',
        type: recommendationType
      })
    }
  }

  const getRecommendationTitle = () => {
    switch (recommendationType) {
      case 'personalized':
        return userId ? 'Recommended For You' : 'Popular Products'
      case 'similar':
        return currentProduct ? `Similar to ${currentProduct.name}` : 'You Might Also Like'
      case 'trending':
        return 'Trending Now'
      default:
        return 'Recommendations'
    }
  }

  const getRecommendationSubtitle = () => {
    switch (recommendationType) {
      case 'personalized':
        return userId 
          ? 'AI-curated products based on your preferences and shopping history'
          : 'Discover our most popular natural wellness products'
      case 'similar':
        return 'Products with similar features and benefits'
      case 'trending':
        return 'Hot products that customers are buying right now'
      default:
        return 'Discover amazing natural products'
    }
  }

  const getRecommendationIcon = () => {
    switch (recommendationType) {
      case 'personalized':
        return <Heart className="h-4 w-4" />
      case 'similar':
        return <Sparkles className="h-4 w-4" />
      case 'trending':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <section className={`py-20 bg-gradient-to-b from-white to-slate-50 ${className}`}>
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 animate-pulse" />
              AI is analyzing...
            </div>
            <SectionTitle 
              title="Loading Recommendations" 
              subtitle="Our AI is finding the perfect products for you" 
            />
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="w-full h-48 bg-slate-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    )
  }

  if (error) {
    return (
      <section className={`py-20 bg-gradient-to-b from-white to-slate-50 ${className}`}>
        <Container>
          <div className="text-center">
            <div className="text-slate-500 mb-4">
              <Sparkles className="h-12 w-12 mx-auto mb-4" />
              <p>{error}</p>
            </div>
            <Button onClick={loadRecommendations} variant="outline">
              Try Again
            </Button>
          </div>
        </Container>
      </section>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <section className={`py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-40 h-40 bg-brand-green/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-brand-light/20 rounded-full blur-3xl"></div>
      </div>

      <Container>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium mb-4">
            {getRecommendationIcon()}
            AI Powered
          </div>
          <SectionTitle 
            title={getRecommendationTitle()}
            subtitle={getRecommendationSubtitle()}
          />
        </div>

        {/* Recommendation Type Toggles */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-white rounded-full p-2 shadow-lg border border-slate-200">
            <button
              onClick={() => setRecommendationType('personalized')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                recommendationType === 'personalized'
                  ? 'bg-brand-green text-white shadow-sm'
                  : 'text-slate-600 hover:text-brand-green'
              }`}
            >
              <Heart className="h-4 w-4 inline mr-2" />
              {userId ? 'For You' : 'Popular'}
            </button>
            <button
              onClick={() => setRecommendationType('trending')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                recommendationType === 'trending'
                  ? 'bg-brand-green text-white shadow-sm'
                  : 'text-slate-600 hover:text-brand-green'
              }`}
            >
              <TrendingUp className="h-4 w-4 inline mr-2" />
              Trending
            </button>
            {currentProduct && (
              <button
                onClick={() => setRecommendationType('similar')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  recommendationType === 'similar'
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'text-slate-600 hover:text-brand-green'
                }`}
              >
                <Sparkles className="h-4 w-4 inline mr-2" />
                Similar
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Product Grid with AI Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {recommendations.map((rec, index) => (
            <div 
              key={rec.product.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-slate-100 relative"
              onClick={() => handleProductView(rec.product)}
            >
              {/* AI Confidence Badge */}
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-gradient-to-r from-brand-green to-brand-green/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {Math.round(rec.confidence * 100)}% match
                </div>
              </div>

              {/* Product Image */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                {rec.product.image ? (
                  <img 
                    src={rec.product.image}
                    alt={rec.product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <span className="text-slate-500 text-4xl">🌿</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-serif text-lg font-semibold text-brand-navy mb-2 group-hover:text-brand-green transition-colors line-clamp-2">
                  {rec.product.name}
                </h3>
                
                <p className="text-2xl font-bold text-brand-green mb-3">
                  ₹{rec.product.price}
                </p>

                {/* AI Reason */}
                <div className="bg-brand-green/5 border border-brand-green/10 rounded-lg p-3 mb-4">
                  <p className="text-xs text-brand-green font-medium flex items-start gap-2">
                    <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{rec.reason}</span>
                  </p>
                </div>

                {/* Stock Status */}
                {rec.product.stock_quantity < 10 && (
                  <div className="flex items-center gap-1 text-xs text-red-600 mb-3">
                    <Clock className="h-3 w-3" />
                    Only {rec.product.stock_quantity} left in stock
                  </div>
                )}

                {/* Action Button */}
                <Button 
                  className="w-full group-hover:bg-brand-green group-hover:text-white transition-colors"
                  variant={index < 2 ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle add to cart or view product
                  }}
                >
                  View Product
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Hover Effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* AI Insights Panel */}
        <div className="bg-gradient-to-r from-brand-green/5 to-brand-light/5 rounded-2xl p-8 border border-brand-green/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-green to-brand-green/80 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-brand-navy">AI Recommendation Engine</h3>
                <p className="text-sm text-slate-600">Powered by advanced machine learning</p>
              </div>
            </div>
            
            <p className="text-slate-600 max-w-2xl mx-auto mb-6">
              Our AI analyzes your preferences, browsing history, and product similarities to suggest 
              the most relevant natural wellness products for your needs.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                <span>Real-time trend analysis</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                <span>Semantic product matching</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
