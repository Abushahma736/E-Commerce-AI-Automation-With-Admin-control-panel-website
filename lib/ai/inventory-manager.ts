import { deepSeekAPI } from './deepseek'
import { Product } from '@/types'

export interface InventoryAlert {
  id: string
  productId: string
  productName: string
  alertLevel: 'low' | 'medium' | 'high' | 'critical'
  currentStock: number
  recommendedReorderQuantity: number
  daysUntilStockout: number
  reasoning: string
  suggestedActions: string[]
  demandForecast: string
  createdAt: Date
  isRead: boolean
}

export interface SalesDataPoint {
  date: string
  quantity: number
  revenue: number
  price: number
}

export interface StockPrediction {
  productId: string
  predictedStockout: Date
  recommendedReorderDate: Date
  recommendedQuantity: number
  confidence: number
  reasoning: string
}

export class AIInventoryManager {
  private static instance: AIInventoryManager
  private alerts: Map<string, InventoryAlert[]> = new Map()
  private salesHistory: Map<string, SalesDataPoint[]> = new Map()
  private predictions: Map<string, StockPrediction> = new Map()

  static getInstance(): AIInventoryManager {
    if (!AIInventoryManager.instance) {
      AIInventoryManager.instance = new AIInventoryManager()
    }
    return AIInventoryManager.instance
  }

  // Track sales data for predictive analytics
  recordSale(productId: string, quantity: number, price: number) {
    const salesData = this.salesHistory.get(productId) || []
    const newSale: SalesDataPoint = {
      date: new Date().toISOString().split('T')[0],
      quantity,
      revenue: quantity * price,
      price
    }
    
    salesData.push(newSale)
    
    // Keep only last 90 days of data
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    
    const recentSales = salesData.filter(sale => 
      new Date(sale.date) >= ninetyDaysAgo
    )
    
    this.salesHistory.set(productId, recentSales)
  }

  // Generate AI-powered stock alerts
  async generateStockAlert(product: Product): Promise<InventoryAlert | null> {
    try {
      const salesData = this.salesHistory.get(product.id.toString()) || []
      const currentStock = product.stock_quantity

      // Skip if no sales history
      if (salesData.length === 0) {
        return null
      }

      const aiAnalysis = await deepSeekAPI.generateInventoryAlert(
        product, 
        currentStock, 
        salesData
      )

      if (!aiAnalysis) {
        return null
      }

      const alert: InventoryAlert = {
        id: `alert_${product.id}_${Date.now()}`,
        productId: product.id.toString(),
        productName: product.name,
        alertLevel: aiAnalysis.alert_level,
        currentStock,
        recommendedReorderQuantity: aiAnalysis.recommended_reorder_quantity,
        daysUntilStockout: aiAnalysis.days_until_stockout,
        reasoning: aiAnalysis.reasoning,
        suggestedActions: aiAnalysis.suggested_actions,
        demandForecast: aiAnalysis.demand_forecast,
        createdAt: new Date(),
        isRead: false
      }

      // Store alert
      const productAlerts = this.alerts.get(product.id.toString()) || []
      productAlerts.push(alert)
      this.alerts.set(product.id.toString(), productAlerts)

      return alert
    } catch (error) {
      console.error('Stock alert generation failed:', error)
      return null
    }
  }

  // Generate inventory alerts with stock levels (for AIChatbot compatibility)
  async generateInventoryAlerts(): Promise<{alerts: Record<string, {stockLevel: string}>}> {
    // Return mock data structure for compatibility
    const mockAlerts: Record<string, {stockLevel: string}> = {
      'product_1': { stockLevel: 'in_stock' },
      'product_2': { stockLevel: 'low_stock' },
      'product_3': { stockLevel: 'out_of_stock' },
      'neem_cleanser': { stockLevel: 'in_stock' },
      'turmeric_serum': { stockLevel: 'in_stock' },
      'coconut_oil': { stockLevel: 'in_stock' },
      'tea_tree_oil': { stockLevel: 'low_stock' },
      'aloe_vera_gel': { stockLevel: 'in_stock' },
    }
    
    return { alerts: mockAlerts }
  }

  // Bulk analyze all products for stock alerts
  async analyzeAllProducts(products: Product[]): Promise<InventoryAlert[]> {
    const alerts: InventoryAlert[] = []
    
    for (const product of products) {
      // Only analyze products with low or concerning stock levels
      if (product.stock_quantity <= 20) {
        const alert = await this.generateStockAlert(product)
        if (alert) {
          alerts.push(alert)
        }
      }
    }

    return alerts
  }

  // Generate predictive restocking recommendations
  async generateRestockingPredictions(products: Product[]): Promise<StockPrediction[]> {
    const predictions: StockPrediction[] = []

    for (const product of products) {
      const salesData = this.salesHistory.get(product.id.toString()) || []
      
      if (salesData.length >= 7) { // Need at least a week of data
        try {
          const analysis = await deepSeekAPI.analyzeSalesPattern(salesData)
          
          if (analysis) {
            const daysUntilStockout = Math.ceil(
              product.stock_quantity / (analysis.average_daily_sales || 1)
            )
            
            const predictedStockoutDate = new Date()
            predictedStockoutDate.setDate(predictedStockoutDate.getDate() + daysUntilStockout)
            
            const reorderDate = new Date(predictedStockoutDate)
            reorderDate.setDate(reorderDate.getDate() - 7) // Reorder 7 days before stockout
            
            const prediction: StockPrediction = {
              productId: product.id.toString(),
              predictedStockout: predictedStockoutDate,
              recommendedReorderDate: reorderDate,
              recommendedQuantity: analysis.demand_forecast_30d,
              confidence: analysis.confidence_level === 'high' ? 0.9 : 
                         analysis.confidence_level === 'medium' ? 0.7 : 0.5,
              reasoning: `Based on ${salesData.length} days of sales data. ${analysis.seasonal_factors}`
            }
            
            predictions.push(prediction)
            this.predictions.set(product.id.toString(), prediction)
          }
        } catch (error) {
          console.error(`Prediction failed for product ${product.id}:`, error)
        }
      }
    }

    return predictions
  }

  // Get all alerts for a specific product
  getProductAlerts(productId: string): InventoryAlert[] {
    return this.alerts.get(productId) || []
  }

  // Get all unread alerts
  getUnreadAlerts(): InventoryAlert[] {
    const allAlerts: InventoryAlert[] = []
    
    this.alerts.forEach(productAlerts => {
      const unread = productAlerts.filter(alert => !alert.isRead)
      allAlerts.push(...unread)
    })
    
    return allAlerts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  // Mark alert as read
  markAlertAsRead(alertId: string) {
    this.alerts.forEach(productAlerts => {
      const alert = productAlerts.find(a => a.id === alertId)
      if (alert) {
        alert.isRead = true
      }
    })
  }

  // Get critical alerts that need immediate attention
  getCriticalAlerts(): InventoryAlert[] {
    return this.getUnreadAlerts().filter(alert => 
      alert.alertLevel === 'critical' || alert.daysUntilStockout <= 3
    )
  }

  // Get restocking recommendations for products that need reordering soon
  getUpcomingRestockingNeeds(days: number = 14): StockPrediction[] {
    const upcoming: StockPrediction[] = []
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() + days)

    this.predictions.forEach(prediction => {
      if (prediction.recommendedReorderDate <= cutoffDate) {
        upcoming.push(prediction)
      }
    })

    return upcoming.sort((a, b) => 
      a.recommendedReorderDate.getTime() - b.recommendedReorderDate.getTime()
    )
  }

  // Generate inventory dashboard data
  generateInventoryDashboard(): any {
    const allAlerts = this.getUnreadAlerts()
    const criticalAlerts = this.getCriticalAlerts()
    const upcomingRestocks = this.getUpcomingRestockingNeeds()

    return {
      summary: {
        totalAlerts: allAlerts.length,
        criticalAlerts: criticalAlerts.length,
        upcomingRestocks: upcomingRestocks.length,
        alertsByLevel: {
          critical: allAlerts.filter(a => a.alertLevel === 'critical').length,
          high: allAlerts.filter(a => a.alertLevel === 'high').length,
          medium: allAlerts.filter(a => a.alertLevel === 'medium').length,
          low: allAlerts.filter(a => a.alertLevel === 'low').length
        }
      },
      criticalAlerts: criticalAlerts.slice(0, 10),
      upcomingRestocks: upcomingRestocks.slice(0, 10),
      recentAlerts: allAlerts.slice(0, 20)
    }
  }

  // Simulate sales data for demo purposes
  generateDemoSalesData(products: Product[]) {
    products.forEach(product => {
      const salesData: SalesDataPoint[] = []
      
      // Generate 30 days of sample sales data
      for (let i = 30; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        
        // Simulate realistic sales patterns
        const baseQuantity = Math.max(1, Math.floor(product.stock_quantity / 50))
        const randomVariation = Math.random() * 2 // 0-2x multiplier
        const weekendBoost = date.getDay() === 0 || date.getDay() === 6 ? 1.5 : 1
        
        const quantity = Math.floor(baseQuantity * randomVariation * weekendBoost)
        
        if (quantity > 0) {
          salesData.push({
            date: date.toISOString().split('T')[0],
            quantity,
            revenue: quantity * product.price,
            price: product.price
          })
        }
      }
      
      this.salesHistory.set(product.id.toString(), salesData)
    })
  }

  // Get inventory statistics for dashboard
  getInventoryStats() {
    const allAlerts = this.getUnreadAlerts()
    const criticalAlerts = this.getCriticalAlerts()
    const upcomingRestocks = this.getUpcomingRestockingNeeds()
    
    return {
      totalProducts: this.salesHistory.size,
      totalAlerts: allAlerts.length,
      criticalAlerts: criticalAlerts.length,
      lowStockItems: allAlerts.filter(a => a.alertLevel === 'low' || a.alertLevel === 'medium').length,
      outOfStockItems: allAlerts.filter(a => a.alertLevel === 'critical' && a.currentStock === 0).length,
      upcomingRestocks: upcomingRestocks.length,
      alertsByLevel: {
        critical: allAlerts.filter(a => a.alertLevel === 'critical').length,
        high: allAlerts.filter(a => a.alertLevel === 'high').length,
        medium: allAlerts.filter(a => a.alertLevel === 'medium').length,
        low: allAlerts.filter(a => a.alertLevel === 'low').length
      },
      recentActivity: {
        newAlertsToday: allAlerts.filter(a => {
          const today = new Date().toDateString()
          return a.createdAt.toDateString() === today
        }).length,
        resolvedAlertsToday: 0, // Could track this separately
        totalSalesTracked: Array.from(this.salesHistory.values()).reduce((total, sales) => total + sales.length, 0)
      }
    }
  }

  // Clear all data (for testing/reset)
  clearAllData() {
    this.alerts.clear()
    this.salesHistory.clear()
    this.predictions.clear()
  }
}

// Singleton instance
export const aiInventoryManager = AIInventoryManager.getInstance()
