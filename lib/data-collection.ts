/**
 * Data Collection Service for E-commerce AI Features
 * Client-side utility to track user interactions and send data to AI automation server
 */

interface TrackingConfig {
  apiBaseUrl?: string
  enabled?: boolean
  debug?: boolean
}

interface UserInteraction {
  user_id: string
  product_id: string
  interaction_type: 'view' | 'click' | 'add_to_cart' | 'purchase' | 'rating' | 'search'
  interaction_value?: number
  session_id?: string
  metadata?: Record<string, any>
}

interface ProductView {
  product_id: string
  user_id?: string
  view_duration?: number
  referrer?: string
  user_agent?: string
}

interface Purchase {
  user_id: string
  product_id: string
  quantity?: number
  price: number
  order_id?: string
}

interface ProductRating {
  user_id: string
  product_id: string
  rating: number
  review_text?: string
}

interface SearchQuery {
  query: string
  user_id?: string
  results_count?: number
  clicked_results?: string[]
}

export class DataCollectionService {
  private config: TrackingConfig
  private apiUrl: string
  private sessionId: string
  private userId?: string
  private viewStartTime?: number
  private pendingQueue: any[] = []

  constructor(config: TrackingConfig = {}) {
    this.config = {
      apiBaseUrl: 'http://127.0.0.1:5000',
      enabled: true,
      debug: false,
      ...config
    }
    
    this.apiUrl = this.config.apiBaseUrl || 'http://127.0.0.1:5000'
    this.sessionId = this.generateSessionId()
    
    // Initialize user ID from session storage or generate new one
    this.initializeUserId()
    
    // Start processing queue
    this.processQueue()
  }

  /**
   * Initialize user ID from localStorage or create new anonymous ID
   */
  private initializeUserId() {
    if (typeof window !== 'undefined') {
      // Try to get user ID from localStorage or session
      this.userId = localStorage.getItem('user_id') || 
                    sessionStorage.getItem('user_id') || 
                    this.generateUserId()
      
      // Store anonymous user ID
      if (!localStorage.getItem('user_id')) {
        localStorage.setItem('user_id', this.userId)
      }
    }
  }

  /**
   * Set authenticated user ID
   */
  setUserId(userId: string) {
    this.userId = userId
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_id', userId)
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Generate anonymous user ID
   */
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Log debug information
   */
  private log(...args: any[]) {
    if (this.config.debug) {
      console.log('[DataCollection]', ...args)
    }
  }

  /**
   * Send data to API endpoint
   */
  private async sendToAPI(endpoint: string, data: any): Promise<boolean> {
    if (!this.config.enabled) {
      this.log('Tracking disabled, skipping:', endpoint, data)
      return false
    }

    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      
      if (result.success) {
        this.log('Successfully tracked:', endpoint, data)
        return true
      } else {
        this.log('Tracking failed:', result.error || 'Unknown error')
        return false
      }
    } catch (error) {
      this.log('Network error:', error)
      // Add to queue for retry
      this.pendingQueue.push({ endpoint, data, timestamp: Date.now() })
      return false
    }
  }

  /**
   * Process pending queue (retry failed requests)
   */
  private async processQueue() {
    if (typeof window === 'undefined') return

    setInterval(async () => {
      if (this.pendingQueue.length === 0) return

      this.log(`Processing ${this.pendingQueue.length} pending items`)
      
      for (let i = this.pendingQueue.length - 1; i >= 0; i--) {
        const item = this.pendingQueue[i]
        
        // Remove items older than 1 hour
        if (Date.now() - item.timestamp > 3600000) {
          this.pendingQueue.splice(i, 1)
          continue
        }

        const success = await this.sendToAPI(item.endpoint, item.data)
        if (success) {
          this.pendingQueue.splice(i, 1)
        }
      }
    }, 30000) // Process every 30 seconds
  }

  /**
   * Track user interaction with product
   */
  async trackInteraction(interaction: Omit<UserInteraction, 'user_id' | 'session_id'>): Promise<boolean> {
    if (!this.userId) return false

    return await this.sendToAPI('/api/track-interaction', {
      ...interaction,
      user_id: this.userId,
      session_id: this.sessionId
    })
  }

  /**
   * Track product page view
   */
  async trackProductView(view: Omit<ProductView, 'user_id' | 'user_agent'>): Promise<boolean> {
    const viewData: ProductView = {
      ...view,
      user_id: this.userId,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    }

    return await this.sendToAPI('/api/track-view', viewData)
  }

  /**
   * Start tracking view duration for a product
   */
  startViewTracking(productId: string) {
    this.viewStartTime = Date.now()
    this.log('Started view tracking for product:', productId)
  }

  /**
   * End view tracking and send duration
   */
  async endViewTracking(productId: string): Promise<boolean> {
    if (!this.viewStartTime) return false

    const duration = Math.round((Date.now() - this.viewStartTime) / 1000)
    this.viewStartTime = undefined

    return await this.trackProductView({
      product_id: productId,
      view_duration: duration,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined
    })
  }

  /**
   * Track product purchase
   */
  async trackPurchase(purchase: Omit<Purchase, 'user_id'>): Promise<boolean> {
    if (!this.userId) return false

    return await this.sendToAPI('/api/track-purchase', {
      ...purchase,
      user_id: this.userId
    })
  }

  /**
   * Track product rating
   */
  async trackRating(rating: Omit<ProductRating, 'user_id'>): Promise<boolean> {
    if (!this.userId) return false

    if (rating.rating < 1 || rating.rating > 5) {
      this.log('Invalid rating value:', rating.rating)
      return false
    }

    return await this.sendToAPI('/api/track-rating', {
      ...rating,
      user_id: this.userId
    })
  }

  /**
   * Track search query
   */
  async trackSearch(search: Omit<SearchQuery, 'user_id'>): Promise<boolean> {
    return await this.sendToAPI('/api/track-search', {
      ...search,
      user_id: this.userId
    })
  }

  /**
   * Track product click (convenience method)
   */
  async trackProductClick(productId: string, metadata?: Record<string, any>): Promise<boolean> {
    return await this.trackInteraction({
      product_id: productId,
      interaction_type: 'click',
      metadata
    })
  }

  /**
   * Track add to cart
   */
  async trackAddToCart(productId: string, price?: number): Promise<boolean> {
    return await this.trackInteraction({
      product_id: productId,
      interaction_type: 'add_to_cart',
      interaction_value: price
    })
  }

  /**
   * Get user interaction history
   */
  async getUserHistory(daysBack: number = 30): Promise<any[]> {
    if (!this.userId) return []

    try {
      const response = await fetch(`${this.apiUrl}/api/data/user-history/${this.userId}?days_back=${daysBack}`)
      const result = await response.json()
      
      if (result.success) {
        return result.data.interactions || []
      }
      return []
    } catch (error) {
      this.log('Error fetching user history:', error)
      return []
    }
  }

  /**
   * Get data collection statistics
   */
  async getCollectionStats(): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/api/data/collection-stats`)
      const result = await response.json()
      
      if (result.success) {
        return result.data
      }
      return null
    } catch (error) {
      this.log('Error fetching collection stats:', error)
      return null
    }
  }

  /**
   * Enable/disable tracking
   */
  setEnabled(enabled: boolean) {
    this.config.enabled = enabled
    this.log('Tracking', enabled ? 'enabled' : 'disabled')
  }

  /**
   * Get current configuration
   */
  getConfig(): TrackingConfig {
    return { ...this.config }
  }

  /**
   * Get current session info
   */
  getSessionInfo() {
    return {
      userId: this.userId,
      sessionId: this.sessionId,
      queueLength: this.pendingQueue.length
    }
  }
}

// Create singleton instance
let dataCollectionInstance: DataCollectionService | null = null

/**
 * Get or create DataCollectionService instance
 */
export function getDataCollectionService(config?: TrackingConfig): DataCollectionService {
  if (!dataCollectionInstance) {
    dataCollectionInstance = new DataCollectionService(config)
  }
  return dataCollectionInstance
}

/**
 * Hook for React components to easily use data collection
 */
export function useDataCollection(config?: TrackingConfig) {
  const service = getDataCollectionService(config)
  
  return {
    trackView: service.trackProductView.bind(service),
    trackClick: service.trackProductClick.bind(service),
    trackPurchase: service.trackPurchase.bind(service),
    trackRating: service.trackRating.bind(service),
    trackSearch: service.trackSearch.bind(service),
    trackAddToCart: service.trackAddToCart.bind(service),
    startViewTracking: service.startViewTracking.bind(service),
    endViewTracking: service.endViewTracking.bind(service),
    setUserId: service.setUserId.bind(service),
    getSessionInfo: service.getSessionInfo.bind(service),
    getUserHistory: service.getUserHistory.bind(service)
  }
}
