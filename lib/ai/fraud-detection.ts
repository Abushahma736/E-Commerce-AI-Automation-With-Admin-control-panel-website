import { deepSeekAPI } from './deepseek'

export interface FraudAlert {
  id: string
  type: 'payment' | 'review' | 'account' | 'order' | 'shipping'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  evidence: any
  confidence: number
  timestamp: Date
  status: 'active' | 'investigating' | 'resolved' | 'false_positive'
  relatedEntities: string[]
}

export interface PaymentAnalysis {
  transactionId: string
  riskScore: number
  riskFactors: string[]
  recommendation: 'approve' | 'review' | 'decline'
  confidence: number
}

export interface ReviewAnalysis {
  reviewId: string
  isFake: boolean
  confidence: number
  indicators: string[]
  sentiment: 'positive' | 'negative' | 'neutral'
  authenticity: number
}

export interface UserBehaviorAnalysis {
  userId: string
  riskLevel: 'low' | 'medium' | 'high'
  suspiciousActivities: string[]
  behaviorPatterns: any
  recommendations: string[]
}

export class AIFraudDetection {
  private static instance: AIFraudDetection
  private alerts: FraudAlert[] = []
  private paymentHistory: PaymentAnalysis[] = []
  private reviewAnalytics: ReviewAnalysis[] = []
  private userBehavior: Map<string, UserBehaviorAnalysis> = new Map()
  private blacklistedIPs: Set<string> = new Set()
  private suspiciousPatterns: Map<string, any> = new Map()

  static getInstance(): AIFraudDetection {
    if (!AIFraudDetection.instance) {
      AIFraudDetection.instance = new AIFraudDetection()
    }
    return AIFraudDetection.instance
  }

  // Analyze payment for fraud patterns
  async analyzePaymentFraud(paymentData: any): Promise<PaymentAnalysis> {
    try {
      const messages = [
        {
          role: "system",
          content: `You are an AI fraud detection expert for e-commerce payments in India.
          
          Analyze payment patterns and detect suspicious activities:
          - Unusual payment amounts or frequency
          - Geographic inconsistencies
          - Device/IP anomalies
          - Card testing patterns
          - Velocity checks
          - Known fraud indicators
          
          Consider Indian payment ecosystem:
          - UPI, card, wallet patterns
          - Regional spending habits
          - Festival season spikes
          - Common fraud methods in India`
        },
        {
          role: "user",
          content: `Analyze this payment for fraud risk:
          
          Payment Data:
          ${JSON.stringify(paymentData, null, 2)}
          
          Provide:
          1. Risk score (0-100)
          2. Risk factors identified
          3. Recommendation (approve/review/decline)
          4. Confidence level (0-1)
          5. Specific red flags
          
          Return JSON:
          {
            "riskScore": number,
            "riskFactors": ["factor1", "factor2"],
            "recommendation": "approve|review|decline",
            "confidence": number,
            "redFlags": ["flag1", "flag2"],
            "reasoning": "detailed explanation"
          }`
        }
      ]

      const response = await deepSeekAPI.chat(messages, { 
        temperature: 0.3, 
        max_tokens: 800 
      })

      const analysis = JSON.parse(response)
      
      const paymentAnalysis: PaymentAnalysis = {
        transactionId: paymentData.id || paymentData.transactionId,
        riskScore: analysis.riskScore,
        riskFactors: analysis.riskFactors,
        recommendation: analysis.recommendation,
        confidence: analysis.confidence
      }

      this.paymentHistory.push(paymentAnalysis)

      // Create alert if high risk
      if (analysis.riskScore > 70) {
        await this.createFraudAlert({
          type: 'payment',
          severity: analysis.riskScore > 85 ? 'critical' : 'high',
          description: `High-risk payment detected: ${analysis.reasoning}`,
          evidence: paymentData,
          confidence: analysis.confidence,
          relatedEntities: [paymentData.userId, paymentData.cardHash, paymentData.ip]
        })
      }

      return paymentAnalysis

    } catch (error) {
      console.error('Payment fraud analysis failed:', error)
      return {
        transactionId: paymentData.id || 'unknown',
        riskScore: 50,
        riskFactors: ['Analysis failed'],
        recommendation: 'review',
        confidence: 0.5
      }
    }
  }

  // Analyze reviews for fake/spam content
  async analyzeFakeReviews(reviewData: any): Promise<ReviewAnalysis> {
    try {
      const messages = [
        {
          role: "system",
          content: `You are an AI expert in detecting fake reviews and spam content for e-commerce.
          
          Identify fake reviews using:
          - Language patterns and authenticity
          - Review velocity and timing
          - Sentiment manipulation
          - Generic vs specific feedback
          - User account patterns
          - Rating distribution anomalies
          
          Focus on Indian context:
          - Local language usage patterns
          - Regional product preferences
          - Authentic customer expressions
          - Common fake review tactics in India`
        },
        {
          role: "user",
          content: `Analyze this review for authenticity:
          
          Review Data:
          ${JSON.stringify(reviewData, null, 2)}
          
          Determine:
          1. Is this review fake? (true/false)
          2. Confidence level (0-1)
          3. Fake review indicators
          4. Sentiment analysis
          5. Authenticity score (0-1)
          
          Return JSON:
          {
            "isFake": boolean,
            "confidence": number,
            "indicators": ["indicator1", "indicator2"],
            "sentiment": "positive|negative|neutral",
            "authenticity": number,
            "reasoning": "detailed explanation"
          }`
        }
      ]

      const response = await deepSeekAPI.chat(messages, { 
        temperature: 0.4, 
        max_tokens: 600 
      })

      const analysis = JSON.parse(response)
      
      const reviewAnalysis: ReviewAnalysis = {
        reviewId: reviewData.id,
        isFake: analysis.isFake,
        confidence: analysis.confidence,
        indicators: analysis.indicators,
        sentiment: analysis.sentiment,
        authenticity: analysis.authenticity
      }

      this.reviewAnalytics.push(reviewAnalysis)

      // Create alert if fake review detected
      if (analysis.isFake && analysis.confidence > 0.7) {
        await this.createFraudAlert({
          type: 'review',
          severity: analysis.confidence > 0.85 ? 'high' : 'medium',
          description: `Fake review detected: ${analysis.reasoning}`,
          evidence: reviewData,
          confidence: analysis.confidence,
          relatedEntities: [reviewData.userId, reviewData.productId]
        })
      }

      return reviewAnalysis

    } catch (error) {
      console.error('Review analysis failed:', error)
      return {
        reviewId: reviewData.id,
        isFake: false,
        confidence: 0.5,
        indicators: ['Analysis failed'],
        sentiment: 'neutral',
        authenticity: 0.5
      }
    }
  }

  // Analyze user behavior patterns
  async analyzeUserBehavior(userData: any, activityData: any[]): Promise<UserBehaviorAnalysis> {
    try {
      const messages = [
        {
          role: "system",
          content: `You are an AI behavioral analyst for e-commerce security.
          
          Analyze user behavior patterns to detect:
          - Account takeover attempts
          - Bot/automated activity
          - Suspicious browsing patterns
          - Unusual purchase behavior
          - Multiple account creation
          - Return fraud patterns
          
          Consider normal vs abnormal patterns for Indian e-commerce users.`
        },
        {
          role: "user",
          content: `Analyze this user's behavior:
          
          User Data:
          ${JSON.stringify(userData, null, 2)}
          
          Activity History:
          ${JSON.stringify(activityData.slice(0, 50), null, 2)}
          
          Evaluate:
          1. Risk level (low/medium/high)
          2. Suspicious activities
          3. Behavior patterns
          4. Security recommendations
          
          Return JSON:
          {
            "riskLevel": "low|medium|high",
            "suspiciousActivities": ["activity1", "activity2"],
            "behaviorPatterns": {
              "loginFrequency": "normal|unusual",
              "purchasePattern": "normal|suspicious",
              "browsingBehavior": "human|bot-like"
            },
            "recommendations": ["action1", "action2"],
            "reasoning": "detailed analysis"
          }`
        }
      ]

      const response = await deepSeekAPI.chat(messages, { 
        temperature: 0.4, 
        max_tokens: 800 
      })

      const analysis = JSON.parse(response)
      
      const behaviorAnalysis: UserBehaviorAnalysis = {
        userId: userData.id,
        riskLevel: analysis.riskLevel,
        suspiciousActivities: analysis.suspiciousActivities,
        behaviorPatterns: analysis.behaviorPatterns,
        recommendations: analysis.recommendations
      }

      this.userBehavior.set(userData.id, behaviorAnalysis)

      // Create alert for high-risk users
      if (analysis.riskLevel === 'high') {
        await this.createFraudAlert({
          type: 'account',
          severity: 'high',
          description: `High-risk user behavior detected: ${analysis.reasoning}`,
          evidence: { userData, activitySample: activityData.slice(0, 10) },
          confidence: 0.8,
          relatedEntities: [userData.id, userData.email, userData.ip]
        })
      }

      return behaviorAnalysis

    } catch (error) {
      console.error('User behavior analysis failed:', error)
      return {
        userId: userData.id,
        riskLevel: 'medium',
        suspiciousActivities: ['Analysis failed'],
        behaviorPatterns: {},
        recommendations: ['Manual review required']
      }
    }
  }

  // Real-time order fraud detection
  async analyzeOrderFraud(orderData: any): Promise<any> {
    try {
      // Quick fraud checks
      const riskFactors = []
      let riskScore = 0

      // Check order velocity
      const recentOrders = await this.getRecentOrdersByUser(orderData.userId)
      if (recentOrders.length > 10) { // More than 10 orders in short time
        riskFactors.push('High order velocity')
        riskScore += 25
      }

      // Check shipping vs billing address mismatch
      if (orderData.shippingAddress.country !== orderData.billingAddress.country) {
        riskFactors.push('International shipping mismatch')
        riskScore += 30
      }

      // Check IP geolocation vs address
      if (orderData.ipCountry && orderData.ipCountry !== orderData.billingAddress.country) {
        riskFactors.push('IP-Address geolocation mismatch')
        riskScore += 20
      }

      // Check order amount patterns
      if (orderData.total > 10000 && orderData.userOrderHistory < 3) {
        riskFactors.push('High value order from new customer')
        riskScore += 25
      }

      // AI-enhanced analysis for complex patterns
      if (riskScore > 30) {
        const messages = [
          {
            role: "system",
            content: "Analyze this order for fraud patterns considering the identified risk factors."
          },
          {
            role: "user",
            content: `Order: ${JSON.stringify(orderData)}
            Risk Factors: ${riskFactors.join(', ')}
            Current Risk Score: ${riskScore}`
          }
        ]

        const aiResponse = await deepSeekAPI.chat(messages, { temperature: 0.3 })
        const aiAnalysis = JSON.parse(aiResponse)
        
        riskScore = Math.min(riskScore + (aiAnalysis.additionalRisk || 0), 100)
        riskFactors.push(...(aiAnalysis.additionalFactors || []))
      }

      const analysis = {
        orderId: orderData.id,
        riskScore,
        riskFactors,
        recommendation: riskScore > 70 ? 'decline' : riskScore > 40 ? 'review' : 'approve',
        confidence: riskScore > 50 ? 0.8 : 0.6
      }

      // Create alert for suspicious orders
      if (riskScore > 60) {
        await this.createFraudAlert({
          type: 'order',
          severity: riskScore > 80 ? 'critical' : 'high',
          description: `Suspicious order detected: ${riskFactors.join(', ')}`,
          evidence: orderData,
          confidence: analysis.confidence,
          relatedEntities: [orderData.userId, orderData.ip]
        })
      }

      return analysis

    } catch (error) {
      console.error('Order fraud analysis failed:', error)
      return {
        orderId: orderData.id,
        riskScore: 50,
        riskFactors: ['Analysis error'],
        recommendation: 'review',
        confidence: 0.5
      }
    }
  }

  // Create fraud alert
  private async createFraudAlert(alertData: Partial<FraudAlert>) {
    const alert: FraudAlert = {
      id: `alert_${Date.now()}_${alertData.type}`,
      type: alertData.type || 'payment',
      severity: alertData.severity || 'medium',
      description: alertData.description || 'Suspicious activity detected',
      evidence: alertData.evidence || {},
      confidence: alertData.confidence || 0.5,
      timestamp: new Date(),
      status: 'active',
      relatedEntities: alertData.relatedEntities || []
    }

    this.alerts.push(alert)
    
    // Notify administrators for critical alerts
    if (alert.severity === 'critical') {
      await this.notifyAdministrators(alert)
    }

    return alert
  }

  // Auto-block suspicious IPs
  async blockSuspiciousIP(ip: string, reason: string) {
    this.blacklistedIPs.add(ip)
    
    await this.createFraudAlert({
      type: 'account',
      severity: 'high',
      description: `IP ${ip} blocked for suspicious activity: ${reason}`,
      evidence: { ip, reason },
      confidence: 0.9,
      relatedEntities: [ip]
    })

    console.log(`🚫 IP ${ip} blocked: ${reason}`)
  }

  // Check if IP is blacklisted
  isIPBlacklisted(ip: string): boolean {
    return this.blacklistedIPs.has(ip)
  }

  // Get recent orders by user (simulated)
  private async getRecentOrdersByUser(userId: string, hours: number = 24): Promise<any[]> {
    // In real implementation, query database
    // For now, return simulated data
    return []
  }

  // Notify administrators about critical alerts
  private async notifyAdministrators(alert: FraudAlert) {
    console.log(`🚨 CRITICAL FRAUD ALERT: ${alert.description}`)
    
    // In real implementation:
    // - Send email/SMS to admins
    // - Push notification to admin dashboard
    // - Integrate with Slack/Teams
    // - Log to security system
  }

  // Generate fraud detection report
  generateFraudReport() {
    const activeAlerts = this.alerts.filter(a => a.status === 'active')
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical')
    const highRiskPayments = this.paymentHistory.filter(p => p.riskScore > 70)
    const fakeReviews = this.reviewAnalytics.filter(r => r.isFake && r.confidence > 0.7)
    const highRiskUsers = Array.from(this.userBehavior.values()).filter(u => u.riskLevel === 'high')

    return {
      summary: {
        totalAlerts: this.alerts.length,
        activeAlerts: activeAlerts.length,
        criticalAlerts: criticalAlerts.length,
        blockedIPs: this.blacklistedIPs.size
      },
      riskMetrics: {
        highRiskPayments: highRiskPayments.length,
        avgPaymentRisk: this.paymentHistory.reduce((sum, p) => sum + p.riskScore, 0) / this.paymentHistory.length || 0,
        fakeReviewsDetected: fakeReviews.length,
        highRiskUsers: highRiskUsers.length
      },
      recentAlerts: activeAlerts.slice(-10),
      recommendations: this.generateSecurityRecommendations()
    }
  }

  // Generate security recommendations
  private generateSecurityRecommendations(): string[] {
    const recommendations = []
    
    const criticalAlerts = this.alerts.filter(a => a.severity === 'critical' && a.status === 'active')
    if (criticalAlerts.length > 5) {
      recommendations.push('Implement additional payment verification steps')
      recommendations.push('Review and update fraud detection rules')
    }

    const highRiskPayments = this.paymentHistory.filter(p => p.riskScore > 70)
    if (highRiskPayments.length > 10) {
      recommendations.push('Enable manual review for payments above risk threshold')
      recommendations.push('Implement device fingerprinting')
    }

    if (this.blacklistedIPs.size > 50) {
      recommendations.push('Review IP blocking policies')
      recommendations.push('Implement geographic restrictions for high-risk regions')
    }

    return recommendations.length > 0 ? recommendations : [
      'Fraud detection system is operating normally',
      'Continue monitoring for unusual patterns'
    ]
  }

  // Get fraud statistics
  getFraudStats() {
    return {
      alerts: {
        total: this.alerts.length,
        byType: {
          payment: this.alerts.filter(a => a.type === 'payment').length,
          review: this.alerts.filter(a => a.type === 'review').length,
          account: this.alerts.filter(a => a.type === 'account').length,
          order: this.alerts.filter(a => a.type === 'order').length
        },
        bySeverity: {
          low: this.alerts.filter(a => a.severity === 'low').length,
          medium: this.alerts.filter(a => a.severity === 'medium').length,
          high: this.alerts.filter(a => a.severity === 'high').length,
          critical: this.alerts.filter(a => a.severity === 'critical').length
        }
      },
      payments: {
        analyzed: this.paymentHistory.length,
        highRisk: this.paymentHistory.filter(p => p.riskScore > 70).length,
        declined: this.paymentHistory.filter(p => p.recommendation === 'decline').length
      },
      reviews: {
        analyzed: this.reviewAnalytics.length,
        fakeDetected: this.reviewAnalytics.filter(r => r.isFake).length,
        avgAuthenticity: this.reviewAnalytics.reduce((sum, r) => sum + r.authenticity, 0) / this.reviewAnalytics.length || 0
      },
      security: {
        blockedIPs: this.blacklistedIPs.size,
        highRiskUsers: Array.from(this.userBehavior.values()).filter(u => u.riskLevel === 'high').length
      }
    }
  }

  // Clear all data (for testing)
  clearAllData() {
    this.alerts.length = 0
    this.paymentHistory.length = 0
    this.reviewAnalytics.length = 0
    this.userBehavior.clear()
    this.blacklistedIPs.clear()
    this.suspiciousPatterns.clear()
  }
}

// Singleton instance
export const aiFraudDetection = AIFraudDetection.getInstance()
