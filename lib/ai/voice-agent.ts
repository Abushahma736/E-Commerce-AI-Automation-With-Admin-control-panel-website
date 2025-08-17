import { deepSeekAPI } from './deepseek'

export interface VoiceCall {
  id: string
  type: 'order_confirmation' | 'customer_support' | 'delivery_update' | 'feedback' | 'marketing'
  phoneNumber: string
  customerName: string
  status: 'pending' | 'calling' | 'connected' | 'completed' | 'failed' | 'busy'
  duration: number // in seconds
  transcript: string
  summary: string
  followUp: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  resolution: boolean
  scheduledTime?: Date
  actualStartTime?: Date
  completedTime?: Date
  metadata: any
}

export interface CallScript {
  id: string
  type: string
  language: 'hindi' | 'english' | 'hinglish'
  greeting: string
  mainContent: string
  questions: string[]
  closingStatement: string
  fallbackResponses: string[]
}

export interface VoiceInsights {
  totalCalls: number
  successRate: number
  avgDuration: number
  commonIssues: string[]
  customerSatisfaction: number
  callsByType: { [key: string]: number }
  peakHours: number[]
}

export class AIVoiceAgent {
  private static instance: AIVoiceAgent
  private calls: VoiceCall[] = []
  private callScripts: Map<string, CallScript> = new Map()
  private activeCallQueue: VoiceCall[] = []
  private callHistory: Map<string, VoiceCall[]> = new Map()
  private voiceSettings = {
    voice: 'female_hindi_professional',
    speed: 1.0,
    pitch: 1.0,
    language: 'hinglish' as 'hindi' | 'english' | 'hinglish'
  }

  static getInstance(): AIVoiceAgent {
    if (!AIVoiceAgent.instance) {
      AIVoiceAgent.instance = new AIVoiceAgent()
    }
    return AIVoiceAgent.instance
  }

  constructor() {
    this.initializeCallScripts()
  }

  // Initialize predefined call scripts
  private initializeCallScripts() {
    const scripts: CallScript[] = [
      {
        id: 'order_confirmation_hinglish',
        type: 'order_confirmation',
        language: 'hinglish',
        greeting: 'Namaste! Main ESSE Naturals ki taraf se bol rahi hun. Kya main {{customerName}} ji se baat kar rahi hun?',
        mainContent: 'Aapka order {{orderNumber}} confirm karna chahti hun. Aapne {{productNames}} order kiya hai ₹{{total}} ka. Delivery address {{address}} hai. Ye sab details correct hai?',
        questions: [
          'Kya delivery address change karna hai?',
          'Payment method confirm karna hai - {{paymentMethod}}',
          'Koi special instructions hai delivery ke liye?'
        ],
        closingStatement: 'Dhanyawad! Aapka order 3-5 din mein deliver ho jayega. Koi problem ho to humein call kariye. Have a great day!',
        fallbackResponses: [
          'Main aapko samajh nahi paai, kya aap phir se bol sakte hain?',
          'Thoda slow boliye please',
          'Kya main aapko customer care se connect kar dun?'
        ]
      },
      {
        id: 'customer_support_hinglish',
        type: 'customer_support',
        language: 'hinglish',
        greeting: 'Namaste! ESSE Naturals customer support mein aapka swagat hai. Main {{agentName}} hun. Aaj main aapki kaise help kar sakti hun?',
        mainContent: 'Main aapki problem sun rahi hun. Kya ye {{issue}} ke baare mein hai? Ya koi aur concern hai?',
        questions: [
          'Aapka order number kya hai?',
          'Ye problem kab se ho rahi hai?',
          'Kya aapne product use kiya hai?',
          'Koi allergic reaction ya side effects hai?'
        ],
        closingStatement: 'Aapki problem solve ho gayi hai. Koi aur help chaahiye? Hum hamesha aapki service mein haazir hain. Dhanyawad!',
        fallbackResponses: [
          'Main aapki problem samajh rahi hun, let me check',
          'Ek minute please, main details dekh rahi hun',
          'Kya main senior executive se connect kar dun?'
        ]
      }
    ]

    scripts.forEach(script => {
      this.callScripts.set(`${script.type}_${script.language}`, script)
    })
  }

  // Schedule a voice call
  async scheduleCall(
    type: VoiceCall['type'],
    phoneNumber: string,
    customerName: string,
    metadata: any = {},
    scheduledTime?: Date
  ): Promise<VoiceCall> {
    const call: VoiceCall = {
      id: `call_${Date.now()}_${type}`,
      type,
      phoneNumber,
      customerName,
      status: 'pending',
      duration: 0,
      transcript: '',
      summary: '',
      followUp: [],
      sentiment: 'neutral',
      resolution: false,
      scheduledTime: scheduledTime || new Date(),
      metadata
    }

    this.calls.push(call)
    
    if (!scheduledTime || scheduledTime <= new Date()) {
      this.activeCallQueue.push(call)
    }

    return call
  }

  // Process call queue
  async processCallQueue() {
    while (this.activeCallQueue.length > 0) {
      const call = this.activeCallQueue.shift()!
      
      try {
        await this.makeCall(call)
      } catch (error) {
        console.error(`Call failed: ${call.id}`, error)
        call.status = 'failed'
      }
      
      // Add delay between calls
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  // Make an individual call
  private async makeCall(call: VoiceCall): Promise<void> {
    console.log(`📞 Initiating call to ${call.phoneNumber} for ${call.type}`)
    
    call.status = 'calling'
    call.actualStartTime = new Date()

    // Simulate call connection (in real implementation, use voice API)
    const connected = await this.simulateCallConnection(call.phoneNumber)
    
    if (!connected) {
      call.status = 'failed'
      return
    }

    call.status = 'connected'
    
    // Generate call script using AI
    const script = await this.generateCallScript(call)
    
    // Simulate call conversation
    const callResult = await this.simulateCallConversation(call, script)
    
    call.transcript = callResult.transcript
    call.summary = callResult.summary
    call.followUp = callResult.followUp
    call.sentiment = callResult.sentiment
    call.resolution = callResult.resolution
    call.duration = callResult.duration
    call.completedTime = new Date()
    call.status = 'completed'

    // Store call history
    const customerHistory = this.callHistory.get(call.phoneNumber) || []
    customerHistory.push(call)
    this.callHistory.set(call.phoneNumber, customerHistory)

    console.log(`✅ Call completed: ${call.id} (${call.duration}s, ${call.sentiment})`)
  }

  // Generate dynamic call script using AI
  private async generateCallScript(call: VoiceCall): Promise<string> {
    try {
      const baseScript = this.callScripts.get(`${call.type}_${this.voiceSettings.language}`)
      
      if (!baseScript) {
        throw new Error(`No script found for ${call.type}_${this.voiceSettings.language}`)
      }

      const messages = [
        {
          role: "system",
          content: `You are a professional voice agent script generator for ESSE Naturals.
          
          Create natural, friendly call scripts in Hinglish (Hindi + English mix) that:
          - Sound conversational and warm
          - Are culturally appropriate for Indian customers
          - Handle the specific call type effectively
          - Include proper greetings and closings
          - Allow for customer responses
          
          Keep it concise but comprehensive.`
        },
        {
          role: "user",
          content: `Generate a call script for:
          
          Call Type: ${call.type}
          Customer: ${call.customerName}
          Phone: ${call.phoneNumber}
          Context: ${JSON.stringify(call.metadata)}
          
          Base Script Template:
          ${JSON.stringify(baseScript, null, 2)}
          
          Personalize and enhance this script with specific details.
          Return just the final script text, ready to speak.`
        }
      ]

      const response = await deepSeekAPI.chat(messages, { 
        temperature: 0.7, 
        max_tokens: 600 
      })

      return response.trim()

    } catch (error) {
      console.error('Script generation failed:', error)
      // Return default script
      const baseScript = this.callScripts.get(`${call.type}_hinglish`)
      return baseScript?.greeting + ' ' + baseScript?.mainContent || 'Hello, this is ESSE Naturals calling.'
    }
  }

  // Simulate call conversation (replace with real voice API)
  private async simulateCallConversation(call: VoiceCall, script: string) {
    // Simulate conversation duration
    const duration = Math.floor(Math.random() * 180) + 60 // 1-4 minutes
    
    // Generate AI response based on call type
    const messages = [
      {
        role: "system",
        content: `Simulate a customer conversation for this voice call scenario.
        
        Generate realistic customer responses and call outcomes.
        Consider Indian customer behavior and communication patterns.`
      },
      {
        role: "user",
        content: `Simulate conversation for:
        
        Call Type: ${call.type}
        Script: ${script}
        Duration: ${duration} seconds
        Customer: ${call.customerName}
        
        Generate:
        1. Full conversation transcript
        2. Call summary
        3. Follow-up actions needed
        4. Customer sentiment
        5. Whether issue was resolved
        
        Return JSON:
        {
          "transcript": "full conversation",
          "summary": "brief summary",
          "followUp": ["action1", "action2"],
          "sentiment": "positive|neutral|negative",
          "resolution": boolean,
          "duration": ${duration}
        }`
      }
    ]

    try {
      const response = await deepSeekAPI.chat(messages, { 
        temperature: 0.8, 
        max_tokens: 1000 
      })

      return JSON.parse(response)

    } catch (error) {
      console.error('Conversation simulation failed:', error)
      
      // Return default result
      return {
        transcript: `Agent: ${script}\nCustomer: Okay, thank you for calling.\nAgent: Thank you, have a great day!`,
        summary: `${call.type} call completed successfully`,
        followUp: [],
        sentiment: 'neutral',
        resolution: true,
        duration
      }
    }
  }

  // Simulate call connection
  private async simulateCallConnection(phoneNumber: string): Promise<boolean> {
    // Simulate connection success/failure rates
    const connectionRate = 0.85 // 85% success rate
    
    await new Promise(resolve => setTimeout(resolve, 3000)) // Ring time
    
    return Math.random() < connectionRate
  }

  // Auto-call for order confirmations
  async autoCallOrderConfirmation(orderData: any) {
    if (!orderData.customerPhone || !orderData.customerName) {
      console.log('Insufficient customer data for order confirmation call')
      return null
    }

    return await this.scheduleCall(
      'order_confirmation',
      orderData.customerPhone,
      orderData.customerName,
      {
        orderNumber: orderData.id,
        orderTotal: orderData.total,
        products: orderData.items,
        deliveryAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        expectedDelivery: orderData.expectedDelivery
      }
    )
  }

  // Auto-call for delivery updates
  async autoCallDeliveryUpdate(orderData: any, status: string) {
    return await this.scheduleCall(
      'delivery_update',
      orderData.customerPhone,
      orderData.customerName,
      {
        orderNumber: orderData.id,
        status,
        trackingNumber: orderData.trackingNumber,
        expectedDelivery: orderData.expectedDelivery
      }
    )
  }

  // Handle customer support callback
  async scheduleCustomerSupportCall(customerData: any, issue: string) {
    return await this.scheduleCall(
      'customer_support',
      customerData.phone,
      customerData.name,
      {
        customerId: customerData.id,
        issue,
        priority: 'high',
        previousOrders: customerData.orderHistory
      }
    )
  }

  // Get call analytics
  getCallInsights(): VoiceInsights {
    const completedCalls = this.calls.filter(c => c.status === 'completed')
    const totalCalls = this.calls.length
    
    const successRate = totalCalls > 0 ? completedCalls.length / totalCalls : 0
    const avgDuration = completedCalls.length > 0 ? 
      completedCalls.reduce((sum, c) => sum + c.duration, 0) / completedCalls.length : 0

    // Analyze common issues from call summaries
    const commonIssues = this.extractCommonIssues(completedCalls)
    
    // Calculate customer satisfaction based on sentiment
    const positiveCalls = completedCalls.filter(c => c.sentiment === 'positive').length
    const customerSatisfaction = completedCalls.length > 0 ? 
      positiveCalls / completedCalls.length : 0

    // Calls by type
    const callsByType: { [key: string]: number } = {}
    this.calls.forEach(call => {
      callsByType[call.type] = (callsByType[call.type] || 0) + 1
    })

    // Peak hours analysis
    const peakHours = this.analyzePeakHours(completedCalls)

    return {
      totalCalls,
      successRate,
      avgDuration,
      commonIssues,
      customerSatisfaction,
      callsByType,
      peakHours
    }
  }

  // Extract common issues from call summaries
  private extractCommonIssues(calls: VoiceCall[]): string[] {
    const issues: { [key: string]: number } = {}
    
    calls.forEach(call => {
      // Simple keyword extraction (in real implementation, use NLP)
      const keywords = ['delivery', 'payment', 'product quality', 'refund', 'exchange', 'allergic reaction']
      
      keywords.forEach(keyword => {
        if (call.summary.toLowerCase().includes(keyword)) {
          issues[keyword] = (issues[keyword] || 0) + 1
        }
      })
    })

    return Object.entries(issues)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([issue]) => issue)
  }

  // Analyze peak calling hours
  private analyzePeakHours(calls: VoiceCall[]): number[] {
    const hourCounts: { [hour: number]: number } = {}
    
    calls.forEach(call => {
      if (call.actualStartTime) {
        const hour = call.actualStartTime.getHours()
        hourCounts[hour] = (hourCounts[hour] || 0) + 1
      }
    })

    return Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour))
  }

  // Get call history for a customer
  getCustomerCallHistory(phoneNumber: string): VoiceCall[] {
    return this.callHistory.get(phoneNumber) || []
  }

  // Update voice settings
  updateVoiceSettings(settings: Partial<typeof this.voiceSettings>) {
    this.voiceSettings = { ...this.voiceSettings, ...settings }
  }

  // Get pending calls count
  getPendingCallsCount(): number {
    return this.calls.filter(c => c.status === 'pending').length
  }

  // Get call statistics
  getCallStats() {
    const totalCalls = this.calls.length
    const completedCalls = this.calls.filter(c => c.status === 'completed').length
    const failedCalls = this.calls.filter(c => c.status === 'failed').length
    const pendingCalls = this.calls.filter(c => c.status === 'pending').length

    return {
      total: totalCalls,
      completed: completedCalls,
      failed: failedCalls,
      pending: pendingCalls,
      successRate: totalCalls > 0 ? (completedCalls / totalCalls) * 100 : 0,
      queueSize: this.activeCallQueue.length
    }
  }

  // Clear all data (for testing)
  clearAllData() {
    this.calls.length = 0
    this.activeCallQueue.length = 0
    this.callHistory.clear()
  }
}

// Singleton instance
export const aiVoiceAgent = AIVoiceAgent.getInstance()
