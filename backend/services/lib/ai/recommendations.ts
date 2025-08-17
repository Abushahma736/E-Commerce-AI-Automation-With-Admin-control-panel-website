import { Product } from '@/types'

export interface RecommendationConfig {
  userId?: string
  productId?: string
  category?: string
  priceRange?: [number, number]
  limit?: number
}

export interface AIRecommendation {
  product: Product
  score: number
  reason: string
  confidence: number
}

// Simulated AI recommendation engine
export class AIRecommendationEngine {
  private static instance: AIRecommendationEngine
  private userBehavior: Map<string, any> = new Map()
  private productVectors: Map<string, number[]> = new Map()

  static getInstance(): AIRecommendationEngine {
    if (!AIRecommendationEngine.instance) {
      AIRecommendationEngine.instance = new AIRecommendationEngine()
    }
    return AIRecommendationEngine.instance
  }

  // Track user behavior for personalization
  trackUserBehavior(userId: string, action: string, productId: string, metadata?: any) {
    const userHistory = this.userBehavior.get(userId) || {
      views: [],
      purchases: [],
      searches: [],
      preferences: {}
    }

    switch (action) {
      case 'view':
        userHistory.views.push({ productId, timestamp: Date.now(), ...metadata })
        break
      case 'purchase':
        userHistory.purchases.push({ productId, timestamp: Date.now(), ...metadata })
        break
      case 'search':
        userHistory.searches.push({ query: productId, timestamp: Date.now(), ...metadata })
        break
    }

    // Keep only recent history (last 100 actions)
    Object.keys(userHistory).forEach(key => {
      if (Array.isArray(userHistory[key]) && userHistory[key].length > 100) {
        userHistory[key] = userHistory[key].slice(-100)
      }
    })

    this.userBehavior.set(userId, userHistory)
  }

  // Generate product embeddings (simplified)
  private generateProductVector(product: Product): number[] {
    const features = [
      product.price / 1000, // Normalized price
      product.category_id ? parseInt(product.category_id) / 10 : 0, // Category encoding
      product.name.length / 50, // Name length feature
      product.description?.length / 1000 || 0, // Description length
      product.stock_quantity / 100, // Stock level
      Math.random() * 0.1, // Random noise for diversity
    ]
    return features
  }

  // Calculate similarity between products
  private calculateSimilarity(vector1: number[], vector2: number[]): number {
    if (vector1.length !== vector2.length) return 0
    
    let dotProduct = 0
    let norm1 = 0
    let norm2 = 0
    
    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i]
      norm1 += vector1[i] ** 2
      norm2 += vector2[i] ** 2
    }
    
    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2)
    return magnitude === 0 ? 0 : dotProduct / magnitude
  }

  // Generate personalized recommendations
  async getPersonalizedRecommendations(
    userId: string, 
    products: Product[], 
    config: RecommendationConfig = {}
  ): Promise<AIRecommendation[]> {
    const { limit = 10 } = config
    const userHistory = this.userBehavior.get(userId)
    const recommendations: AIRecommendation[] = []

    // Generate product vectors
    products.forEach(product => {
      this.productVectors.set(product.id.toString(), this.generateProductVector(product))
    })

    for (const product of products) {
      let score = 0
      let reasons: string[] = []
      let confidence = 0.5

      // Collaborative filtering based on user history
      if (userHistory) {
        // Recently viewed products similarity
        const recentViews = userHistory.views.slice(-10)
        for (const view of recentViews) {
          const viewedProduct = products.find(p => p.id.toString() === view.productId)
          if (viewedProduct && viewedProduct.id !== product.id) {
            const similarity = this.calculateSimilarity(
              this.productVectors.get(product.id.toString()) || [],
              this.productVectors.get(viewedProduct.id.toString()) || []
            )
            score += similarity * 0.3
            if (similarity > 0.7) {
              reasons.push(`Similar to ${viewedProduct.name} you viewed`)
              confidence += 0.1
            }
          }
        }

        // Purchase history influence
        if (userHistory.purchases.length > 0) {
          const purchaseCategories = userHistory.purchases.map(p => {
            const purchasedProduct = products.find(pr => pr.id.toString() === p.productId)
            return purchasedProduct?.category_id
          }).filter(Boolean)

          if (purchaseCategories.includes(product.category_id)) {
            score += 0.4
            reasons.push('From your favorite category')
            confidence += 0.15
          }
        }

        // Search history matching
        const recentSearches = userHistory.searches.slice(-5)
        for (const search of recentSearches) {
          if (product.name.toLowerCase().includes(search.query.toLowerCase()) ||
              product.description?.toLowerCase().includes(search.query.toLowerCase())) {
            score += 0.5
            reasons.push(`Matches your search for "${search.query}"`)
            confidence += 0.2
          }
        }
      }

      // Content-based recommendations
      if (config.category && product.category_id === config.category) {
        score += 0.3
        reasons.push('In your selected category')
      }

      if (config.priceRange) {
        const [minPrice, maxPrice] = config.priceRange
        if (product.price >= minPrice && product.price <= maxPrice) {
          score += 0.2
          reasons.push('In your price range')
        }
      }

      // Popularity boost (based on stock turnover - simplified)
      if (product.stock_quantity > 0 && product.stock_quantity < 10) {
        score += 0.1
        reasons.push('Popular item - limited stock')
        confidence += 0.05
      }

      // Quality indicators
      if (product.name.toLowerCase().includes('organic') || 
          product.name.toLowerCase().includes('premium')) {
        score += 0.15
        reasons.push('Premium quality product')
      }

      // Ensure minimum score and valid reasons
      if (score > 0.1 && reasons.length > 0) {
        recommendations.push({
          product,
          score: Math.min(score, 1), // Cap at 1.0
          reason: reasons.join(' • '),
          confidence: Math.min(confidence, 1) // Cap at 1.0
        })
      }
    }

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  // Get similar products based on a specific product
  async getSimilarProducts(
    targetProduct: Product,
    allProducts: Product[],
    limit: number = 6
  ): Promise<AIRecommendation[]> {
    const targetVector = this.generateProductVector(targetProduct)
    const similarities: AIRecommendation[] = []

    for (const product of allProducts) {
      if (product.id === targetProduct.id) continue

      const productVector = this.generateProductVector(product)
      const similarity = this.calculateSimilarity(targetVector, productVector)

      let reasons: string[] = []
      let confidence = similarity

      // Category similarity
      if (product.category_id === targetProduct.category_id) {
        reasons.push('Same category')
        confidence += 0.1
      }

      // Price similarity
      const priceDiff = Math.abs(product.price - targetProduct.price) / targetProduct.price
      if (priceDiff < 0.3) {
        reasons.push('Similar price range')
        confidence += 0.1
      }

      // Name/description similarity (basic keyword matching)
      const targetKeywords = targetProduct.name.toLowerCase().split(' ')
      const productKeywords = product.name.toLowerCase().split(' ')
      const commonKeywords = targetKeywords.filter(word => 
        productKeywords.includes(word) && word.length > 3
      )
      
      if (commonKeywords.length > 0) {
        reasons.push('Similar features')
        confidence += commonKeywords.length * 0.05
      }

      if (similarity > 0.1 && reasons.length > 0) {
        similarities.push({
          product,
          score: similarity,
          reason: reasons.join(' • '),
          confidence: Math.min(confidence, 1)
        })
      }
    }

    return similarities
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit)
  }

  // Get trending products (simplified trending algorithm)
  async getTrendingProducts(
    products: Product[],
    timeWindow: number = 7 * 24 * 60 * 60 * 1000, // 7 days
    limit: number = 10
  ): Promise<AIRecommendation[]> {
    const trending: AIRecommendation[] = []

    for (const product of products) {
      let trendScore = 0
      let reasons: string[] = []

      // Simulated metrics (in real app, these would come from analytics)
      const viewCount = Math.floor(Math.random() * 1000) + 100
      const purchaseCount = Math.floor(Math.random() * 50) + 10
      const conversionRate = purchaseCount / viewCount

      // Stock movement (lower stock = higher demand)
      if (product.stock_quantity < 20) {
        trendScore += 0.3
        reasons.push('High demand')
      }

      // Conversion rate
      if (conversionRate > 0.1) {
        trendScore += 0.4
        reasons.push('High conversion rate')
      }

      // Recent activity boost
      trendScore += Math.random() * 0.3

      // Category trends (some categories are trending)
      const trendingCategories = ['essential-oils', 'supplements', 'organic-products']
      if (trendingCategories.some(cat => product.category_id?.includes(cat))) {
        trendScore += 0.2
        reasons.push('Trending category')
      }

      if (trendScore > 0.2) {
        trending.push({
          product,
          score: trendScore,
          reason: reasons.join(' • '),
          confidence: Math.min(trendScore, 1)
        })
      }
    }

    return trending
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  // Clear user data (GDPR compliance)
  clearUserData(userId: string) {
    this.userBehavior.delete(userId)
  }

  // Get user insights
  getUserInsights(userId: string) {
    const userHistory = this.userBehavior.get(userId)
    if (!userHistory) return null

    return {
      totalViews: userHistory.views.length,
      totalPurchases: userHistory.purchases.length,
      totalSearches: userHistory.searches.length,
      favoriteCategories: this.getMostCommonCategories(userHistory),
      averageOrderValue: this.calculateAverageOrderValue(userHistory),
      lastActivity: Math.max(
        ...[...userHistory.views, ...userHistory.purchases, ...userHistory.searches]
          .map(item => item.timestamp)
      )
    }
  }

  private getMostCommonCategories(userHistory: any): string[] {
    const categoryCount: Record<string, number> = {}
    
    userHistory.views.forEach((view: any) => {
      // This would need to be enhanced with actual product category lookup
      const category = view.category || 'unknown'
      categoryCount[category] = (categoryCount[category] || 0) + 1
    })

    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)
  }

  private calculateAverageOrderValue(userHistory: any): number {
    if (userHistory.purchases.length === 0) return 0
    
    const totalValue = userHistory.purchases.reduce((sum: number, purchase: any) => {
      return sum + (purchase.value || 0)
    }, 0)
    
    return totalValue / userHistory.purchases.length
  }
}

// Helper functions for easy access
export const aiRecommendations = AIRecommendationEngine.getInstance()

export async function getPersonalizedRecommendations(
  userId: string,
  products: Product[],
  config?: RecommendationConfig
) {
  return aiRecommendations.getPersonalizedRecommendations(userId, products, config)
}

export async function getSimilarProducts(
  product: Product,
  allProducts: Product[],
  limit?: number
) {
  return aiRecommendations.getSimilarProducts(product, allProducts, limit)
}

export async function getTrendingProducts(
  products: Product[],
  timeWindow?: number,
  limit?: number
) {
  return aiRecommendations.getTrendingProducts(products, timeWindow, limit)
}

export function trackUserActivity(userId: string, action: string, productId: string, metadata?: any) {
  aiRecommendations.trackUserBehavior(userId, action, productId, metadata)
}
