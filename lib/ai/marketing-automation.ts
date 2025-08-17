import { deepSeekAPI } from './deepseek'
import { Product } from '@/types'

export interface SocialMediaPost {
  id: string
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'whatsapp'
  content: string
  imageUrl?: string
  hashtags: string[]
  scheduledTime: Date
  campaign: string
  engagement?: {
    likes: number
    shares: number
    comments: number
  }
}

export interface EmailCampaign {
  id: string
  type: 'promotional' | 'abandoned_cart' | 'welcome' | 'restock' | 'birthday'
  subject: string
  content: string
  targetAudience: string[]
  sendTime: Date
  openRate?: number
  clickRate?: number
}

export interface PricingStrategy {
  productId: string
  originalPrice: number
  suggestedPrice: number
  reason: string
  confidence: number
  competitorAnalysis: {
    avgPrice: number
    minPrice: number
    maxPrice: number
    competitors: string[]
  }
}

export interface MarketingInsights {
  trendingProducts: string[]
  seasonalDemands: { [key: string]: number }
  customerSegments: {
    [segment: string]: {
      preferences: string[]
      avgOrderValue: number
      frequency: string
    }
  }
  recommendedCampaigns: string[]
}

export class AIMarketingManager {
  private static instance: AIMarketingManager
  private socialPosts: Map<string, SocialMediaPost[]> = new Map()
  private emailCampaigns: EmailCampaign[] = []
  private pricingHistory: Map<string, PricingStrategy[]> = new Map()
  private campaigns: Map<string, any> = new Map()

  static getInstance(): AIMarketingManager {
    if (!AIMarketingManager.instance) {
      AIMarketingManager.instance = new AIMarketingManager()
    }
    return AIMarketingManager.instance
  }

  // Generate automatic social media posts for offers/campaigns
  async generateSocialMediaPost(
    campaign: any,
    platform: string = 'instagram',
    context: string = 'offer'
  ): Promise<SocialMediaPost | null> {
    try {
      const messages = [
        {
          role: "system",
          content: `You are a social media marketing expert for ESSE Naturals, a premium natural wellness brand in India.
          
          Create engaging, culturally relevant posts in Hindi/English mix that resonate with Indian audience.
          
          Brand Voice:
          - Natural, organic, wellness-focused
          - Premium yet accessible
          - Family-oriented
          - Ayurvedic heritage
          - Modern lifestyle integration
          
          Platform Guidelines:
          - Instagram: Visual, trendy, influencer-style
          - Facebook: Community-focused, informative
          - Twitter: Concise, trending hashtags
          - LinkedIn: Professional wellness tips
          - WhatsApp: Personal, direct offers`
        },
        {
          role: "user",
          content: `Create a ${platform} post for our ${context} campaign:
          
          Campaign Details:
          ${JSON.stringify(campaign, null, 2)}
          
          Generate:
          1. Engaging caption (mix of Hindi/English)
          2. Relevant hashtags (15-20)
          3. Call-to-action
          4. Best posting time suggestion
          
          Make it viral-worthy and conversion-focused!
          
          Return JSON format:
          {
            "content": "post caption",
            "hashtags": ["array", "of", "hashtags"],
            "bestTime": "ISO datetime string",
            "callToAction": "specific CTA text"
          }`
        }
      ]

      const response = await deepSeekAPI.chat(messages, { 
        temperature: 0.8, 
        max_tokens: 800 
      })

      const postData = JSON.parse(response)
      
      const socialPost: SocialMediaPost = {
        id: `post_${Date.now()}_${platform}`,
        platform: platform as any,
        content: postData.content,
        hashtags: postData.hashtags,
        scheduledTime: new Date(postData.bestTime),
        campaign: campaign.name || 'General'
      }

      // Store the post
      const platformPosts = this.socialPosts.get(platform) || []
      platformPosts.push(socialPost)
      this.socialPosts.set(platform, platformPosts)

      // Simulate posting to actual social media (in real app, integrate APIs)
      await this.simulatePostToSocialMedia(socialPost)

      return socialPost

    } catch (error) {
      console.error('Social media post generation failed:', error)
      return null
    }
  }

  // Auto-post when offers/campaigns are created
  async autoPostForCampaign(campaign: any) {
    const platforms = ['instagram', 'facebook', 'twitter']
    
    const posts = await Promise.all(
      platforms.map(platform => 
        this.generateSocialMediaPost(campaign, platform, 'offer')
      )
    )

    return posts.filter(Boolean)
  }

  // Generate personalized email campaigns
  async generateEmailCampaign(
    type: string,
    targetCustomers: any[],
    context: any = {}
  ): Promise<EmailCampaign | null> {
    try {
      const messages = [
        {
          role: "system",
          content: `You are an email marketing expert for ESSE Naturals specializing in natural wellness products.
          
          Create compelling, personalized email campaigns that drive conversions.
          
          Email Types:
          - promotional: New offers, discounts, product launches
          - abandoned_cart: Recover lost sales with incentives
          - welcome: New customer onboarding
          - restock: Notify when wished products are back
          - birthday: Special birthday offers
          
          Indian Context:
          - Festival seasons (Diwali, Holi, etc.)
          - Regional preferences
          - Family wellness focus
          - Price sensitivity
          - Trust and authenticity`
        },
        {
          role: "user",
          content: `Create a ${type} email campaign:
          
          Target Audience: ${targetCustomers.length} customers
          Context: ${JSON.stringify(context)}
          
          Generate:
          1. Compelling subject line (A/B test variants)
          2. Email content (HTML-friendly)
          3. Call-to-action
          4. Send time optimization
          5. Personalization tags
          
          Focus on conversion and brand loyalty.
          
          Return JSON:
          {
            "subject": "main subject line",
            "subjectVariants": ["alt1", "alt2"],
            "content": "email HTML content",
            "cta": "call to action text",
            "sendTime": "ISO datetime",
            "personalizationTags": ["{{name}}", "{{product}}"]
          }`
        }
      ]

      const response = await deepSeekAPI.chat(messages, { 
        temperature: 0.7, 
        max_tokens: 1200 
      })

      const emailData = JSON.parse(response)
      
      const campaign: EmailCampaign = {
        id: `email_${Date.now()}_${type}`,
        type: type as any,
        subject: emailData.subject,
        content: emailData.content,
        targetAudience: targetCustomers.map(c => c.email),
        sendTime: new Date(emailData.sendTime)
      }

      this.emailCampaigns.push(campaign)

      // Simulate sending emails
      await this.simulateSendEmailCampaign(campaign)

      return campaign

    } catch (error) {
      console.error('Email campaign generation failed:', error)
      return null
    }
  }

  // AI Dynamic Pricing based on competitor analysis and demand
  async generateDynamicPricing(
    products: Product[],
    marketData: any = {}
  ): Promise<PricingStrategy[]> {
    try {
      const messages = [
        {
          role: "system",
          content: `You are a pricing strategy AI expert for e-commerce natural products in India.
          
          Consider:
          - Competitor pricing analysis
          - Demand patterns and seasonality
          - Customer price sensitivity
          - Brand positioning (premium natural)
          - Inventory levels
          - Market trends
          - Indian consumer behavior
          
          Pricing Rules:
          - Never go below cost price
          - Maintain premium brand image
          - Consider festival seasons
          - Regional pricing variations
          - Bulk discount opportunities`
        },
        {
          role: "user",
          content: `Analyze and suggest optimal pricing for these products:
          
          Products: ${products.slice(0, 10).map(p => ({
            id: p.id,
            name: p.name,
            currentPrice: p.price,
            category: p.category,
            stock: p.stock_quantity
          }))}
          
          Market Context: ${JSON.stringify(marketData)}
          
          For each product, provide:
          1. Suggested price with reasoning
          2. Confidence level (0-1)
          3. Competitor analysis
          4. Demand prediction
          
          Return JSON array:
          [
            {
              "productId": "id",
              "suggestedPrice": number,
              "reason": "detailed reasoning",
              "confidence": number,
              "competitorAnalysis": {
                "avgPrice": number,
                "minPrice": number, 
                "maxPrice": number,
                "competitors": ["names"]
              }
            }
          ]`
        }
      ]

      const response = await deepSeekAPI.chat(messages, { 
        temperature: 0.5, 
        max_tokens: 1500 
      })

      const pricingData = JSON.parse(response)
      
      const strategies: PricingStrategy[] = pricingData.map((data: any) => ({
        productId: data.productId,
        originalPrice: products.find(p => p.id.toString() === data.productId)?.price || 0,
        suggestedPrice: data.suggestedPrice,
        reason: data.reason,
        confidence: data.confidence,
        competitorAnalysis: data.competitorAnalysis
      }))

      // Store pricing history
      strategies.forEach(strategy => {
        const history = this.pricingHistory.get(strategy.productId) || []
        history.push(strategy)
        this.pricingHistory.set(strategy.productId, history)
      })

      return strategies

    } catch (error) {
      console.error('Dynamic pricing generation failed:', error)
      return []
    }
  }

  // Generate marketing insights and recommendations
  async generateMarketingInsights(
    salesData: any[],
    customerData: any[]
  ): Promise<MarketingInsights> {
    try {
      const messages = [
        {
          role: "system",
          content: `You are a marketing analytics AI for natural wellness e-commerce.
          
          Analyze data to provide actionable insights:
          - Product trends and seasonality
          - Customer segmentation
          - Campaign opportunities
          - Market gaps
          - Growth strategies
          
          Focus on Indian market dynamics and wellness industry trends.`
        },
        {
          role: "user",
          content: `Analyze this data and provide marketing insights:
          
          Sales Data: ${JSON.stringify(salesData.slice(0, 20))}
          Customer Data: ${JSON.stringify(customerData.slice(0, 20))}
          
          Provide insights on:
          1. Trending products
          2. Seasonal demands
          3. Customer segments
          4. Recommended campaigns
          5. Growth opportunities
          
          Return JSON:
          {
            "trendingProducts": ["product names"],
            "seasonalDemands": {"season": demand_score},
            "customerSegments": {
              "segment_name": {
                "preferences": ["prefs"],
                "avgOrderValue": number,
                "frequency": "monthly/weekly"
              }
            },
            "recommendedCampaigns": ["campaign ideas"]
          }`
        }
      ]

      const response = await deepSeekAPI.chat(messages, { 
        temperature: 0.6, 
        max_tokens: 1000 
      })

      return JSON.parse(response) as MarketingInsights

    } catch (error) {
      console.error('Marketing insights generation failed:', error)
      return {
        trendingProducts: [],
        seasonalDemands: {},
        customerSegments: {},
        recommendedCampaigns: []
      }
    }
  }

  // Auto-create campaigns based on events
  async autoCreateCampaign(event: any) {
    const campaignTypes = {
      'low_stock': 'flash_sale',
      'new_product': 'launch_campaign', 
      'festival': 'seasonal_offer',
      'competitor_price_drop': 'price_match',
      'high_cart_abandonment': 'recovery_campaign'
    }

    const campaignType = campaignTypes[event.type as keyof typeof campaignTypes] || 'general'
    
    // Generate campaign content
    const campaign = await this.generateCampaignContent(campaignType, event)
    
    if (campaign) {
      // Auto-post to social media
      await this.autoPostForCampaign(campaign)
      
      // Send email campaign
      await this.generateEmailCampaign('promotional', event.targetCustomers || [], campaign)
    }

    return campaign
  }

  // Generate campaign content
  private async generateCampaignContent(type: string, event: any) {
    try {
      const messages = [
        {
          role: "system",
          content: `Create a marketing campaign for ESSE Naturals based on the event trigger.`
        },
        {
          role: "user",
          content: `Create a ${type} campaign for: ${JSON.stringify(event)}`
        }
      ]

      const response = await deepSeekAPI.chat(messages)
      return JSON.parse(response)

    } catch (error) {
      console.error('Campaign content generation failed:', error)
      return null
    }
  }

  // Simulate social media posting (replace with real APIs)
  private async simulatePostToSocialMedia(post: SocialMediaPost) {
    console.log(`📱 Posted to ${post.platform}:`, post.content.slice(0, 100) + '...')
    
    // Simulate engagement after some time
    setTimeout(() => {
      post.engagement = {
        likes: Math.floor(Math.random() * 100) + 10,
        shares: Math.floor(Math.random() * 20) + 2,
        comments: Math.floor(Math.random() * 15) + 1
      }
    }, 5000)
  }

  // Simulate email sending (replace with real email service)
  private async simulateSendEmailCampaign(campaign: EmailCampaign) {
    console.log(`📧 Email campaign "${campaign.subject}" sent to ${campaign.targetAudience.length} recipients`)
    
    // Simulate open/click rates
    setTimeout(() => {
      campaign.openRate = Math.random() * 0.3 + 0.15 // 15-45%
      campaign.clickRate = Math.random() * 0.1 + 0.02 // 2-12%
    }, 10000)
  }

  // Get social media analytics
  getSocialMediaAnalytics() {
    const allPosts: SocialMediaPost[] = []
    this.socialPosts.forEach(posts => allPosts.push(...posts))

    return {
      totalPosts: allPosts.length,
      platforms: Array.from(this.socialPosts.keys()),
      totalEngagement: allPosts.reduce((sum, post) => 
        sum + (post.engagement?.likes || 0) + (post.engagement?.shares || 0), 0
      ),
      avgEngagement: allPosts.length > 0 ? 
        allPosts.reduce((sum, post) => sum + (post.engagement?.likes || 0), 0) / allPosts.length : 0,
      recentPosts: allPosts.slice(-10)
    }
  }

  // Get email campaign analytics
  getEmailAnalytics() {
    return {
      totalCampaigns: this.emailCampaigns.length,
      avgOpenRate: this.emailCampaigns.reduce((sum, c) => sum + (c.openRate || 0), 0) / this.emailCampaigns.length,
      avgClickRate: this.emailCampaigns.reduce((sum, c) => sum + (c.clickRate || 0), 0) / this.emailCampaigns.length,
      recentCampaigns: this.emailCampaigns.slice(-5)
    }
  }

  // Get pricing optimization report
  getPricingReport() {
    const allStrategies: PricingStrategy[] = []
    this.pricingHistory.forEach(strategies => allStrategies.push(...strategies))

    const avgConfidence = allStrategies.reduce((sum, s) => sum + s.confidence, 0) / allStrategies.length
    const priceIncreases = allStrategies.filter(s => s.suggestedPrice > s.originalPrice).length
    const priceDecreases = allStrategies.filter(s => s.suggestedPrice < s.originalPrice).length

    return {
      totalOptimizations: allStrategies.length,
      avgConfidence: avgConfidence || 0,
      priceIncreases,
      priceDecreases,
      potentialRevenue: allStrategies.reduce((sum, s) => 
        sum + (s.suggestedPrice - s.originalPrice), 0
      )
    }
  }

  // Clear all data (for testing)
  clearAllData() {
    this.socialPosts.clear()
    this.emailCampaigns.length = 0
    this.pricingHistory.clear()
    this.campaigns.clear()
  }
}

// Singleton instance
export const aiMarketingManager = AIMarketingManager.getInstance()
