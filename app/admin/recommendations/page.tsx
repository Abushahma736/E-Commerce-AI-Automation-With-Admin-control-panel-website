'use client'

import { useState, useEffect } from 'react'
import { Target, Brain, Users, TrendingUp, Star, Eye, ShoppingCart, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { aiRecommendations, getPersonalizedRecommendations, getTrendingProducts, getSimilarProducts } from '@/lib/ai/recommendations'
import { getAllProducts } from '@/lib/fsdb'

export default function SmartRecommendationsPage() {
  const [recommendationData, setRecommendationData] = useState<any>(null)
  const [trendingProducts, setTrendingProducts] = useState<any[]>([])
  const [personalizedRecs, setPersonalizedRecs] = useState<any[]>([])
  const [similarProducts, setSimilarProducts] = useState<any[]>([])
  const [userInsights, setUserInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecommendationData()
  }, [])

  const loadRecommendationData = async () => {
    try {
      const products = await getAllProducts()
      
      // Generate demo user activity data
      const demoUsers = ['user1', 'user2', 'user3', 'user4', 'user5']
      
      demoUsers.forEach(userId => {
        // Simulate user behavior tracking
        products.slice(0, 10).forEach(product => {
          if (Math.random() > 0.7) {
            aiRecommendations.trackUserBehavior(userId, 'view', product.id.toString(), {
              timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
              category: product.category_id
            })
          }
          if (Math.random() > 0.9) {
            aiRecommendations.trackUserBehavior(userId, 'purchase', product.id.toString(), {
              timestamp: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
              value: product.price
            })
          }
        })
        
        // Simulate search behavior
        const searchTerms = ['organic', 'natural', 'vitamin', 'oil', 'supplement']
        searchTerms.forEach(term => {
          if (Math.random() > 0.8) {
            aiRecommendations.trackUserBehavior(userId, 'search', term)
          }
        })
      })

      // Get trending products
      const trending = await getTrendingProducts(products, 7 * 24 * 60 * 60 * 1000, 10)
      
      // Get personalized recommendations for demo user
      const personalized = await getPersonalizedRecommendations('user1', products, { limit: 8 })
      
      // Get similar products for first product
      const similar = products.length > 0 ? await getSimilarProducts(products[0], products, 6) : []
      
      // Get user insights for demo users
      const insights = demoUsers.map(userId => ({
        userId,
        insights: aiRecommendations.getUserInsights(userId)
      })).filter(item => item.insights)

      setTrendingProducts(trending)
      setPersonalizedRecs(personalized)
      setSimilarProducts(similar)
      setUserInsights(insights)
      
      setRecommendationData({
        totalProducts: products.length,
        totalUsers: demoUsers.length,
        avgRecommendations: Math.floor((trending.length + personalized.length + similar.length) / 3),
        engagementRate: Math.random() * 0.3 + 0.15 // 15-45%
      })
      
      setLoading(false)
    } catch (error) {
      console.error('Failed to load recommendation data:', error)
      setLoading(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-600 bg-green-50'
    if (confidence > 0.6) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getScoreColor = (score: number) => {
    if (score > 0.7) return 'bg-green-500'
    if (score > 0.4) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading recommendation engine...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Smart Recommendations AI</h1>
            <p className="text-gray-600">Personalized product recommendations and customer insights</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: 'Products Analyzed',
            value: recommendationData?.totalProducts || 0,
            icon: Brain,
            color: 'text-purple-600 bg-purple-50'
          },
          {
            title: 'Active Users',
            value: recommendationData?.totalUsers || 0,
            icon: Users,
            color: 'text-blue-600 bg-blue-50'
          },
          {
            title: 'Avg Recommendations',
            value: recommendationData?.avgRecommendations || 0,
            icon: Target,
            color: 'text-green-600 bg-green-50'
          },
          {
            title: 'Engagement Rate',
            value: `${Math.round((recommendationData?.engagementRate || 0) * 100)}%`,
            icon: TrendingUp,
            color: 'text-orange-600 bg-orange-50'
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
        {/* Trending Products */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Trending Products</h2>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingProducts.slice(0, 6).map((item, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        ₹{item.product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className={`w-3 h-3 rounded-full ${getScoreColor(item.score)}`}></div>
                      <span className="text-xs text-gray-500">
                        {Math.round(item.score * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3">{item.reason}</p>
                  
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                    <span>Confidence: {Math.round(item.confidence * 100)}%</span>
                  </div>
                </div>
              ))}
              
              {trendingProducts.length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Building trending product analysis...</p>
                </div>
              )}
            </div>
          </div>

          {/* Personalized Recommendations */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Personalized Recommendations (Demo User)</h2>
              <Heart className="h-5 w-5 text-pink-500" />
            </div>
            
            <div className="space-y-4">
              {personalizedRecs.slice(0, 5).map((item, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{item.score.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <span className="font-medium ml-2">₹{item.product.price}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Stock:</span>
                      <span className="font-medium ml-2">{item.product.stock_quantity}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">{item.reason}</p>
                  
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                    <span>Match: {Math.round(item.confidence * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Insights & Analytics */}
        <div className="space-y-6">
          {/* User Behavior Insights */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Insights</h3>
            
            <div className="space-y-4">
              {userInsights.slice(0, 3).map((user, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{user.userId}</span>
                    <Users className="h-4 w-4 text-gray-500" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Views: {user.insights.totalViews}</div>
                    <div>Purchases: {user.insights.totalPurchases}</div>
                    <div>Searches: {user.insights.totalSearches}</div>
                    <div>AOV: ₹{Math.round(user.insights.averageOrderValue || 0)}</div>
                  </div>
                  
                  {user.insights.favoriteCategories.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">Favorite Categories:</div>
                      <div className="flex flex-wrap gap-1">
                        {user.insights.favoriteCategories.slice(0, 2).map((cat: string, catIndex: number) => (
                          <span key={catIndex} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Similar Products */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Products Analysis</h3>
            
            <div className="space-y-3">
              {similarProducts.slice(0, 4).map((item, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm truncate">{item.product.name}</span>
                    <div className={`w-3 h-3 rounded-full ${getScoreColor(item.score)}`}></div>
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-2">
                    Similarity: {Math.round(item.score * 100)}%
                  </div>
                  
                  <p className="text-xs text-gray-600">{item.reason}</p>
                </div>
              ))}
              
              {similarProducts.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Processing similarity analysis...</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommendation Metrics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Click-through Rate</span>
                <span className="font-medium">18.5%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="font-medium">7.2%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Recommendations/User</span>
                <span className="font-medium">{recommendationData?.avgRecommendations || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Model Accuracy</span>
                <span className="font-medium">89.3%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full p-3 text-left bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                <div className="font-medium text-indigo-900">Retrain Model</div>
                <div className="text-sm text-indigo-600">Update recommendation algorithms</div>
              </button>
              
              <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="font-medium text-green-900">A/B Test Recommendations</div>
                <div className="text-sm text-green-600">Compare algorithm performance</div>
              </button>
              
              <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <div className="font-medium text-purple-900">Export Analytics</div>
                <div className="text-sm text-purple-600">Download detailed reports</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Performance */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Algorithm Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {trendingProducts.length}
            </div>
            <div className="text-sm text-gray-600">Trending Detected</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {personalizedRecs.length}
            </div>
            <div className="text-sm text-gray-600">Personalized Recs</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {similarProducts.length}
            </div>
            <div className="text-sm text-gray-600">Similar Products</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {userInsights.length}
            </div>
            <div className="text-sm text-gray-600">User Profiles</div>
          </div>
        </div>
      </div>
    </div>
  )
}
