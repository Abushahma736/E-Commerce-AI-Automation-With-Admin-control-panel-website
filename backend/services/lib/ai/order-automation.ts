import { deepSeekAPI } from './deepseek'
import { aiVoiceAgent } from './voice-agent'
import { aiFraudDetection } from './fraud-detection'

export interface OrderRoutingDecision {
  orderId: string
  selectedWarehouse: string
  routingReason: string
  estimatedDeliveryDate: Date
  shippingCost: number
  confidence: number
}

export interface DeliveryPrediction {
  orderId: string
  estimatedDeliveryDate: Date
  deliveryTimeRange: string
  factors: string[]
  confidence: number
  possibleDelays: string[]
}

export interface OrderProcessingStep {
  id: string
  orderId: string
  step: 'fraud_check' | 'inventory_check' | 'payment_verify' | 'warehouse_routing' | 'packing' | 'shipping' | 'delivery'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'delayed'
  startTime: Date
  completedTime?: Date
  duration?: number
  automationLevel: 'fully_automated' | 'semi_automated' | 'manual'
  notes: string
}

export interface WarehouseInfo {
  id: string
  name: string
  location: string
  capacity: number
  currentStock: { [productId: string]: number }
  operatingHours: string
  shippingPartners: string[]
  avgProcessingTime: number // in hours
  coordinates: { lat: number, lng: number }
}

export interface ShippingPartner {
  id: string
  name: string
  serviceTypes: string[]
  coverageAreas: string[]
  avgDeliveryTime: number
  reliability: number // 0-1
  cost: { base: number, perKm: number }
}

export class AIOrderAutomation {
  private static instance: AIOrderAutomation
  private orderProcessingQueue: Map<string, OrderProcessingStep[]> = new Map()
  private routingDecisions: Map<string, OrderRoutingDecision> = new Map()
  private deliveryPredictions: Map<string, DeliveryPrediction> = new Map()
  private warehouses: WarehouseInfo[] = []
  private shippingPartners: ShippingPartner[] = []
  private processingMetrics: Map<string, any> = new Map()

  static getInstance(): AIOrderAutomation {
    if (!AIOrderAutomation.instance) {
      AIOrderAutomation.instance = new AIOrderAutomation()
    }
    return AIOrderAutomation.instance
  }

  constructor() {
    this.initializeWarehouses()
    this.initializeShippingPartners()
  }

  // Initialize sample warehouses
  private initializeWarehouses() {
    this.warehouses = [
      {
        id: 'wh_mumbai',
        name: 'Mumbai Central Warehouse',
        location: 'Mumbai, Maharashtra',
        capacity: 10000,
        currentStock: {},
        operatingHours: '9:00 AM - 6:00 PM',
        shippingPartners: ['bluedart', 'delhivery', 'fedex'],
        avgProcessingTime: 4,
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      {
        id: 'wh_delhi',
        name: 'Delhi North Warehouse',
        location: 'New Delhi, Delhi',
        capacity: 8000,
        currentStock: {},
        operatingHours: '8:00 AM - 7:00 PM',
        shippingPartners: ['bluedart', 'fedex', 'dtdc'],
        avgProcessingTime: 3,
        coordinates: { lat: 28.7041, lng: 77.1025 }
      },
      {
        id: 'wh_bangalore',
        name: 'Bangalore Tech Warehouse',
        location: 'Bangalore, Karnataka',
        capacity: 6000,
        currentStock: {},
        operatingHours: '9:30 AM - 6:30 PM',
        shippingPartners: ['delhivery', 'bluedart', 'ecom'],
        avgProcessingTime: 5,
        coordinates: { lat: 12.9716, lng: 77.5946 }
      }
    ]
  }

  // Initialize shipping partners
  private initializeShippingPartners() {
    this.shippingPartners = [
      {
        id: 'bluedart',
        name: 'Blue Dart Express',
        serviceTypes: ['standard', 'express', 'same_day'],
        coverageAreas: ['pan_india', 'international'],
        avgDeliveryTime: 2,
        reliability: 0.92,
        cost: { base: 50, perKm: 0.8 }
      },
      {
        id: 'delhivery',
        name: 'Delhivery',
        serviceTypes: ['standard', 'express'],
        coverageAreas: ['pan_india', 'tier2_cities'],
        avgDeliveryTime: 3,
        reliability: 0.88,
        cost: { base: 40, perKm: 0.6 }
      },
      {
        id: 'fedex',
        name: 'FedEx India',
        serviceTypes: ['express', 'premium'],
        coverageAreas: ['metro_cities', 'international'],
        avgDeliveryTime: 1,
        reliability: 0.95,
        cost: { base: 80, perKm: 1.2 }
      }
    ]
  }

  // Process new order with full automation
  async processNewOrder(orderData: any): Promise<void> {
    console.log(`🚀 Starting AI automation for order: ${orderData.id}`)

    const orderId = orderData.id.toString()
    const processingSteps: OrderProcessingStep[] = []

    try {
      // Step 1: Fraud Detection
      const fraudStep = await this.createProcessingStep(orderId, 'fraud_check')
      processingSteps.push(fraudStep)

      const fraudAnalysis = await aiFraudDetection.analyzeOrderFraud(orderData)
      
      if (fraudAnalysis.recommendation === 'decline') {
        fraudStep.status = 'failed'
        fraudStep.notes = `Order declined due to fraud risk: ${fraudAnalysis.riskFactors.join(', ')}`
        await this.notifyFraudAlert(orderData, fraudAnalysis)
        return
      }

      fraudStep.status = 'completed'
      fraudStep.notes = `Fraud check passed - Risk score: ${fraudAnalysis.riskScore}`

      // Step 2: Inventory Check
      const inventoryStep = await this.createProcessingStep(orderId, 'inventory_check')
      processingSteps.push(inventoryStep)

      const inventoryCheck = await this.checkInventoryAvailability(orderData)
      
      if (!inventoryCheck.available) {
        inventoryStep.status = 'failed'
        inventoryStep.notes = `Insufficient inventory: ${inventoryCheck.issues.join(', ')}`
        await this.handleInventoryShortage(orderData, inventoryCheck)
        return
      }

      inventoryStep.status = 'completed'
      inventoryStep.notes = 'All items available in inventory'

      // Step 3: Payment Verification
      const paymentStep = await this.createProcessingStep(orderId, 'payment_verify')
      processingSteps.push(paymentStep)

      const paymentVerified = await this.verifyPayment(orderData)
      
      if (!paymentVerified.success) {
        paymentStep.status = 'failed'
        paymentStep.notes = `Payment verification failed: ${paymentVerified.reason}`
        await this.handlePaymentFailure(orderData, paymentVerified)
        return
      }

      paymentStep.status = 'completed'
      paymentStep.notes = 'Payment verified successfully'

      // Step 4: Smart Warehouse Routing
      const routingStep = await this.createProcessingStep(orderId, 'warehouse_routing')
      processingSteps.push(routingStep)

      const routingDecision = await this.optimizeWarehouseRouting(orderData)
      this.routingDecisions.set(orderId, routingDecision)

      routingStep.status = 'completed'
      routingStep.notes = `Routed to ${routingDecision.selectedWarehouse}: ${routingDecision.routingReason}`

      // Step 5: Delivery Prediction
      const deliveryPrediction = await this.predictDeliveryTime(orderData, routingDecision)
      this.deliveryPredictions.set(orderId, deliveryPrediction)

      // Step 6: Auto-confirmation call
      await aiVoiceAgent.autoCallOrderConfirmation({
        id: orderData.id,
        customerPhone: orderData.customerPhone,
        customerName: orderData.customerName,
        total: orderData.total,
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        expectedDelivery: deliveryPrediction.estimatedDeliveryDate
      })

      // Step 7: Initialize packing process
      const packingStep = await this.createProcessingStep(orderId, 'packing')
      processingSteps.push(packingStep)
      
      await this.initializePackingProcess(orderData, routingDecision)
      packingStep.status = 'completed'
      packingStep.notes = 'Packing instructions sent to warehouse'

      // Store all processing steps
      this.orderProcessingQueue.set(orderId, processingSteps)

      console.log(`✅ Order ${orderId} processed successfully through AI automation`)

    } catch (error) {
      console.error(`❌ Order processing failed for ${orderId}:`, error)
      
      // Mark current step as failed
      if (processingSteps.length > 0) {
        const lastStep = processingSteps[processingSteps.length - 1]
        lastStep.status = 'failed'
        lastStep.notes = `Processing error: ${error.message}`
      }
    }
  }

  // Smart warehouse routing using AI
  async optimizeWarehouseRouting(orderData: any): Promise<OrderRoutingDecision> {
    try {
      const messages = [
        {
          role: "system",
          content: `You are an AI logistics expert for optimizing warehouse routing in India.
          
          Consider factors:
          - Distance from customer location
          - Inventory availability at each warehouse
          - Warehouse processing capacity and speed
          - Shipping partner availability
          - Cost optimization
          - Delivery time preferences
          - Regional logistics expertise
          
          Choose the best warehouse for optimal delivery.`
        },
        {
          role: "user",
          content: `Optimize warehouse routing for this order:
          
          Order Details:
          ${JSON.stringify(orderData, null, 2)}
          
          Available Warehouses:
          ${JSON.stringify(this.warehouses, null, 2)}
          
          Shipping Partners:
          ${JSON.stringify(this.shippingPartners, null, 2)}
          
          Select the optimal warehouse and provide reasoning.
          
          Return JSON:
          {
            "selectedWarehouse": "warehouse_id",
            "routingReason": "detailed reasoning",
            "estimatedDeliveryDays": number,
            "shippingCost": number,
            "confidence": number (0-1)
          }`
        }
      ]

      const response = await deepSeekAPI.chat(messages, { 
        temperature: 0.4, 
        max_tokens: 800 
      })

      const decision = JSON.parse(response)
      
      const estimatedDeliveryDate = new Date()
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + decision.estimatedDeliveryDays)

      return {
        orderId: orderData.id.toString(),
        selectedWarehouse: decision.selectedWarehouse,
        routingReason: decision.routingReason,
        estimatedDeliveryDate,
        shippingCost: decision.shippingCost,
        confidence: decision.confidence
      }

    } catch (error) {
      console.error('Warehouse routing optimization failed:', error)
      
      // Fallback to nearest warehouse
      const fallbackWarehouse = this.warehouses[0]
      const estimatedDeliveryDate = new Date()
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3)

      return {
        orderId: orderData.id.toString(),
        selectedWarehouse: fallbackWarehouse.id,
        routingReason: 'Fallback routing - AI optimization failed',
        estimatedDeliveryDate,
        shippingCost: 75,
        confidence: 0.6
      }
    }
  }

  // Predict accurate delivery time
  async predictDeliveryTime(orderData: any, routingDecision: OrderRoutingDecision): Promise<DeliveryPrediction> {
    try {
      const selectedWarehouse = this.warehouses.find(w => w.id === routingDecision.selectedWarehouse)
      
      const messages = [
        {
          role: "system",
          content: `You are an AI delivery prediction expert for Indian e-commerce logistics.
          
          Consider factors:
          - Geographic distance and connectivity
          - Warehouse processing time
          - Shipping partner reliability
          - Weather conditions
          - Traffic and route conditions
          - Festival seasons and holidays
          - Regional logistics challenges
          
          Provide accurate delivery predictions with possible delays.`
        },
        {
          role: "user",
          content: `Predict delivery time for:
          
          Order: ${JSON.stringify(orderData)}
          Selected Warehouse: ${JSON.stringify(selectedWarehouse)}
          Routing Decision: ${JSON.stringify(routingDecision)}
          
          Current Date: ${new Date().toISOString()}
          
          Provide:
          1. Estimated delivery date
          2. Delivery time range
          3. Factors affecting delivery
          4. Possible delays
          5. Confidence level
          
          Return JSON:
          {
            "estimatedDeliveryDate": "ISO date string",
            "deliveryTimeRange": "3-5 business days",
            "factors": ["factor1", "factor2"],
            "possibleDelays": ["delay1", "delay2"],
            "confidence": number (0-1)
          }`
        }
      ]

      const response = await deepSeekAPI.chat(messages, { 
        temperature: 0.3, 
        max_tokens: 600 
      })

      const prediction = JSON.parse(response)

      return {
        orderId: orderData.id.toString(),
        estimatedDeliveryDate: new Date(prediction.estimatedDeliveryDate),
        deliveryTimeRange: prediction.deliveryTimeRange,
        factors: prediction.factors,
        confidence: prediction.confidence,
        possibleDelays: prediction.possibleDelays
      }

    } catch (error) {
      console.error('Delivery prediction failed:', error)
      
      // Fallback prediction
      const estimatedDate = new Date()
      estimatedDate.setDate(estimatedDate.getDate() + 4)

      return {
        orderId: orderData.id.toString(),
        estimatedDeliveryDate: estimatedDate,
        deliveryTimeRange: '3-5 business days',
        factors: ['Standard delivery estimation'],
        confidence: 0.7,
        possibleDelays: ['Weather delays', 'Traffic congestion']
      }
    }
  }

  // Check inventory availability
  private async checkInventoryAvailability(orderData: any) {
    const issues = []
    let available = true

    for (const item of orderData.items || []) {
      if (item.quantity > item.stock_available) {
        available = false
        issues.push(`${item.name}: Required ${item.quantity}, Available ${item.stock_available}`)
      }
    }

    return { available, issues }
  }

  // Verify payment
  private async verifyPayment(orderData: any) {
    // Simulate payment verification
    const paymentMethods = ['upi', 'card', 'netbanking', 'wallet', 'cod']
    
    if (!paymentMethods.includes(orderData.paymentMethod)) {
      return { success: false, reason: 'Invalid payment method' }
    }

    if (orderData.paymentStatus !== 'completed' && orderData.paymentMethod !== 'cod') {
      return { success: false, reason: 'Payment not completed' }
    }

    return { success: true, reason: 'Payment verified' }
  }

  // Create processing step
  private async createProcessingStep(orderId: string, step: OrderProcessingStep['step']): Promise<OrderProcessingStep> {
    return {
      id: `step_${Date.now()}_${step}`,
      orderId,
      step,
      status: 'processing',
      startTime: new Date(),
      automationLevel: 'fully_automated',
      notes: `${step} in progress...`
    }
  }

  // Initialize packing process
  private async initializePackingProcess(orderData: any, routingDecision: OrderRoutingDecision) {
    console.log(`📦 Initializing packing at ${routingDecision.selectedWarehouse} for order ${orderData.id}`)
    
    // In real implementation, this would integrate with warehouse management systems
    // Send packing instructions, generate packing slips, etc.
  }

  // Handle inventory shortage
  private async handleInventoryShortage(orderData: any, inventoryCheck: any) {
    console.log(`⚠️ Inventory shortage for order ${orderData.id}:`, inventoryCheck.issues)
    
    // Auto-notify customer about delays
    // Schedule restock notifications
    // Suggest alternative products
  }

  // Handle payment failure
  private async handlePaymentFailure(orderData: any, paymentIssue: any) {
    console.log(`💳 Payment failure for order ${orderData.id}:`, paymentIssue.reason)
    
    // Send payment retry notification
    // Schedule follow-up calls
    // Provide alternative payment options
  }

  // Notify fraud alerts
  private async notifyFraudAlert(orderData: any, fraudAnalysis: any) {
    console.log(`🚨 Fraud alert for order ${orderData.id}:`, fraudAnalysis.riskFactors)
    
    // Notify security team
    // Block suspicious IPs
    // Add to review queue
  }

  // Get order processing status
  getOrderProcessingStatus(orderId: string) {
    const steps = this.orderProcessingQueue.get(orderId) || []
    const routingDecision = this.routingDecisions.get(orderId)
    const deliveryPrediction = this.deliveryPredictions.get(orderId)

    return {
      orderId,
      steps: steps.map(step => ({
        step: step.step,
        status: step.status,
        duration: step.duration,
        notes: step.notes
      })),
      routing: routingDecision,
      delivery: deliveryPrediction,
      overallStatus: this.calculateOverallStatus(steps),
      completionPercentage: this.calculateCompletionPercentage(steps)
    }
  }

  // Calculate overall processing status
  private calculateOverallStatus(steps: OrderProcessingStep[]): string {
    if (steps.some(s => s.status === 'failed')) return 'failed'
    if (steps.every(s => s.status === 'completed')) return 'completed'
    if (steps.some(s => s.status === 'processing')) return 'processing'
    if (steps.some(s => s.status === 'delayed')) return 'delayed'
    return 'pending'
  }

  // Calculate completion percentage
  private calculateCompletionPercentage(steps: OrderProcessingStep[]): number {
    if (steps.length === 0) return 0
    const completedSteps = steps.filter(s => s.status === 'completed').length
    return Math.round((completedSteps / steps.length) * 100)
  }

  // Get processing analytics
  getProcessingAnalytics() {
    const allSteps: OrderProcessingStep[] = []
    this.orderProcessingQueue.forEach(steps => allSteps.push(...steps))

    const totalOrders = this.orderProcessingQueue.size
    const completedOrders = Array.from(this.orderProcessingQueue.values())
      .filter(steps => steps.every(s => s.status === 'completed')).length

    const avgProcessingTime = allSteps
      .filter(s => s.duration)
      .reduce((sum, s) => sum + (s.duration || 0), 0) / allSteps.length || 0

    const automationRate = allSteps
      .filter(s => s.automationLevel === 'fully_automated').length / allSteps.length || 0

    return {
      totalOrders,
      completedOrders,
      processingRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
      avgProcessingTime: Math.round(avgProcessingTime),
      automationRate: Math.round(automationRate * 100),
      warehouseUtilization: this.getWarehouseUtilization(),
      topRoutes: this.getTopRoutes()
    }
  }

  // Get warehouse utilization
  private getWarehouseUtilization() {
    const utilization: { [warehouseId: string]: number } = {}
    
    this.routingDecisions.forEach(decision => {
      utilization[decision.selectedWarehouse] = (utilization[decision.selectedWarehouse] || 0) + 1
    })

    return Object.entries(utilization)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([warehouse, count]) => ({ warehouse, orders: count }))
  }

  // Get top routing patterns
  private getTopRoutes() {
    const routes: { [route: string]: number } = {}
    
    this.routingDecisions.forEach(decision => {
      const route = decision.selectedWarehouse
      routes[route] = (routes[route] || 0) + 1
    })

    return Object.entries(routes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([route, count]) => ({ route, count }))
  }

  // Clear all data (for testing)
  clearAllData() {
    this.orderProcessingQueue.clear()
    this.routingDecisions.clear()
    this.deliveryPredictions.clear()
    this.processingMetrics.clear()
  }
}

// Singleton instance
export const aiOrderAutomation = AIOrderAutomation.getInstance()
