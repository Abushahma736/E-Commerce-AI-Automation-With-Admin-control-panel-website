// DeepSeek API Configuration and Integration
export class DeepSeekAPI {
  private apiKey: string
  private baseURL: string

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || ""
    this.baseURL = "https://api.deepseek.com"
    
    if (!this.apiKey) {
      console.warn('DeepSeek API key not found. Fallback responses will be used.')
    }
  }

  async chat(messages: any[], options: any = {}) {
    // If no API key, return fallback immediately
    if (!this.apiKey) {
      console.log('No DeepSeek API key available, using fallback response')
      return this.getFallbackResponse(messages[messages.length - 1]?.content || '')
    }
    
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 1500,
          top_p: options.top_p || 0.95,
          stream: false,
          ...options
        })
      })

      if (!response.ok) {
        const errorBody = await response.text()
        console.error(`DeepSeek API Error ${response.status}:`, errorBody)
        
        // Handle specific error cases
        if (response.status === 402) {
          console.log('DeepSeek API: Insufficient balance, using fallback responses')
          return this.getFallbackResponse(messages[messages.length - 1]?.content || '')
        }
        
        throw new Error(`DeepSeek API Error: ${response.status} - ${errorBody}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('DeepSeek API Error:', error)
      // Return a fallback response based on user message context
      const lastMessage = messages[messages.length - 1]?.content || ''
      return this.getFallbackResponse(lastMessage)
    }
  }

  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase()
    
    // Check if this is a product recommendation request that expects JSON
    if (lowerMessage.includes('json') && (lowerMessage.includes('recommend') || lowerMessage.includes('suggestions'))) {
      // Return JSON format for product recommendations
      return JSON.stringify({
        "recommendations": [
          {
            "productId": 1,
            "reason": "Perfect for acne-prone skin with natural antibacterial properties",
            "confidence": 0.9,
            "category": "personalized",
            "aiInsight": "Neem is traditionally used in Ayurveda for its purifying properties"
          },
          {
            "productId": 3,
            "reason": "Tea Tree helps reduce inflammation and control breakouts naturally",
            "confidence": 0.85,
            "category": "trending",
            "aiInsight": "Clinical studies show tea tree oil is effective against acne-causing bacteria"
          },
          {
            "productId": 7,
            "reason": "Turmeric provides gentle exfoliation and brightening benefits",
            "confidence": 0.8,
            "category": "complementary",
            "aiInsight": "Rich in antioxidants, turmeric helps heal and prevent acne scars"
          }
        ],
        "insights": "Based on your preferences for natural acne care, these products work synergistically to cleanse, treat, and prevent breakouts using time-tested Ayurvedic ingredients.",
        "personalizedMessage": "Great choice focusing on natural acne solutions! These products are our customers' favorites for clear, healthy skin."
      })
    }
    
    // Product recommendation fallbacks for regular chat
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      if (lowerMessage.includes('acne') || lowerMessage.includes('pimple')) {
        return `For acne-prone skin, I recommend our Neem-based products! 🌿\n\n• **Neem Face Cleanser** (₹450) - Natural antibacterial properties\n• **Tea Tree Serum** (₹650) - Reduces inflammation\n• **Turmeric Face Pack** (₹350) - Gentle exfoliation\n\nAll our products are 100% natural and chemical-free. Would you like to know more about any of these products?`
      }
      
      if (lowerMessage.includes('hair') || lowerMessage.includes('scalp')) {
        return `For healthy hair care, try our natural hair products! 💆‍♀️\n\n• **Coconut Hair Oil** (₹350) - Deep conditioning\n• **Amla Hair Serum** (₹450) - Prevents hair fall\n• **Hibiscus Shampoo** (₹550) - Natural cleansing\n\nOur hair products are enriched with Ayurvedic ingredients. Which hair concern would you like to address?`
      }
      
      if (lowerMessage.includes('dry') || lowerMessage.includes('moistur')) {
        return `For dry skin hydration, here are our top picks! 💧\n\n• **Aloe Vera Gel** (₹300) - Instant hydration\n• **Coconut Body Lotion** (₹450) - Long-lasting moisture\n• **Rose Water Toner** (₹250) - Refreshing and hydrating\n\nAll formulated with natural ingredients for sensitive skin. Need help choosing the right product?`
      }
      
      return `I'd love to help you find the perfect natural products! 🌿\n\nOur specialties include:\n• Skincare (Neem, Turmeric, Aloe Vera)\n• Haircare (Coconut, Amla, Hibiscus)\n• Body Care (Natural oils and lotions)\n• Wellness (Herbal supplements)\n\nWhat specific concerns would you like me to help with?`
    }
    
    // Stock/availability questions
    if (lowerMessage.includes('stock') || lowerMessage.includes('available')) {
      return `Most of our popular products are currently in stock! 📦\n\nFor real-time availability, I recommend:\n• Browsing our catalog for current stock levels\n• Contacting our support team for specific products\n• Subscribing to restock notifications\n\nIs there a particular product you're looking for?`
    }
    
    // Price/budget questions
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
      return `Our products are competitively priced for premium natural quality! 💰\n\n**Price Ranges:**\n• Cleansers & Toners: ₹200-₹500\n• Serums & Treatments: ₹400-₹800\n• Hair Care: ₹300-₹600\n• Body Care: ₹250-₹550\n\nWhat's your budget range? I can suggest the best products within it!`
    }
    
    // General wellness questions
    if (lowerMessage.includes('natural') || lowerMessage.includes('organic') || lowerMessage.includes('ayurvedic')) {
      return `Welcome to ESSE Naturals! 🌱\n\nWe specialize in 100% natural, organic, and Ayurvedic wellness products. Our key ingredients include:\n\n• **Neem** - Antibacterial & anti-inflammatory\n• **Turmeric** - Brightening & healing\n• **Coconut** - Deep moisturizing\n• **Aloe Vera** - Soothing & hydrating\n• **Tea Tree** - Purifying & cleansing\n\nAll products are chemical-free and sustainably sourced. What type of natural solution are you looking for?`
    }
    
    // Default helpful response
    return `Hi there! I'm here to help you with ESSE Naturals products! 🌿\n\nI can assist you with:\n• Product recommendations based on your needs\n• Information about our natural ingredients\n• Stock availability and pricing\n• Skincare and wellness advice\n\nWhat would you like to know about our natural wellness products today?`
  }

  async generateProductDescription(product: any) {
    const messages = [
      {
        role: "system",
        content: `You are an expert e-commerce product description writer specializing in natural wellness products. Create SEO-friendly, compelling product descriptions that convert visitors to buyers. Focus on benefits, natural ingredients, and wellness applications.`
      },
      {
        role: "user",
        content: `Generate a comprehensive product description for: ${product.name}
        
        Product Details:
        - Name: ${product.name}
        - Category: ${product.category || 'Natural Wellness'}
        - Price: ₹${product.price}
        - Current Description: ${product.description || 'No description available'}
        
        Please provide:
        1. SEO-optimized title (50-60 characters)
        2. Meta description (150-160 characters)
        3. Main product description (200-300 words)
        4. Key benefits (5-7 bullet points)
        5. Usage instructions
        6. SEO keywords (comma-separated)
        
        Format as JSON with keys: title, meta_description, description, benefits, usage, keywords`
      }
    ]

    try {
      const response = await this.chat(messages, { temperature: 0.8, max_tokens: 2000 })
      return JSON.parse(response)
    } catch (error) {
      console.error('Product description generation failed:', error)
      return null
    }
  }

  // Alias method for AIChatbot compatibility
  async customerChat(messages: any[]) {
    try {
      const response = await this.chat(messages, { 
        temperature: 0.7, 
        max_tokens: 1000,
        top_p: 0.9 
      })
      return response
    } catch (error) {
      console.error('Customer chat failed:', error)
      return "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team for assistance."
    }
  }

  async chatWithCustomer(conversation: any[], userMessage: string, context: any = {}) {
    const systemPrompt = `You are a knowledgeable AI assistant for ESSE Naturals, a premium natural wellness products e-commerce store. You help customers with:

1. Product recommendations based on health needs
2. Order tracking and support
3. Natural wellness advice
4. Product information and benefits
5. Shopping assistance

Store Context:
- Specializes in essential oils, natural extracts, supplements, and organic products
- Focus on premium quality, organic, and sustainably sourced items
- Price range: ₹200-₹5000
- Fast delivery across India
- 100% natural and chemical-free products

Current Product Catalog: ${JSON.stringify(context.products?.slice(0, 5) || [])}
User Context: ${JSON.stringify(context.user || {})}

Guidelines:
- Be helpful, knowledgeable, and friendly
- Recommend products based on user needs
- Provide accurate information about natural wellness
- If you don't know something, say so and offer to connect with human support
- Always prioritize customer safety and well-being
- Use natural wellness terminology appropriately
- Suggest complementary products when relevant`

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversation,
      { role: "user", content: userMessage }
    ]

    try {
      const response = await this.chat(messages, { 
        temperature: 0.7, 
        max_tokens: 1000,
        top_p: 0.9 
      })
      return response
    } catch (error) {
      console.error('Customer chat failed:', error)
      return "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team for assistance."
    }
  }

  async generateInventoryAlert(product: any, currentStock: number, salesData: any[]) {
    const messages = [
      {
        role: "system",
        content: "You are an inventory management AI that analyzes sales patterns and generates intelligent stock alerts and recommendations."
      },
      {
        role: "user",
        content: `Analyze inventory for: ${product.name}
        
        Current Stock: ${currentStock} units
        Sales Data (last 30 days): ${JSON.stringify(salesData)}
        Product Price: ₹${product.price}
        Category: ${product.category}
        
        Provide analysis in JSON format:
        {
          "alert_level": "low|medium|high|critical",
          "days_until_stockout": number,
          "recommended_reorder_quantity": number,
          "reasoning": "explanation",
          "suggested_actions": ["action1", "action2"],
          "demand_forecast": "analysis of demand trends"
        }`
      }
    ]

    try {
      const response = await this.chat(messages, { temperature: 0.3, max_tokens: 800 })
      return JSON.parse(response)
    } catch (error) {
      console.error('Inventory alert generation failed:', error)
      return null
    }
  }

  async generateSEOContent(product: any, keywords: string[]) {
    const messages = [
      {
        role: "system",
        content: "You are an SEO expert specializing in e-commerce and natural wellness products. Create content that ranks well and converts visitors."
      },
      {
        role: "user",
        content: `Create SEO-optimized content for: ${product.name}
        
        Target Keywords: ${keywords.join(', ')}
        Product Category: ${product.category}
        Current Description: ${product.description}
        
        Generate:
        1. SEO Title (include primary keyword, under 60 chars)
        2. Meta Description (compelling, under 160 chars)
        3. H1 Heading
        4. Product Features (HTML formatted list)
        5. FAQ section (5 relevant questions)
        6. Schema markup suggestions
        
        Format as JSON with proper HTML formatting where needed.`
      }
    ]

    try {
      const response = await this.chat(messages, { temperature: 0.7, max_tokens: 2000 })
      return JSON.parse(response)
    } catch (error) {
      console.error('SEO content generation failed:', error)
      return null
    }
  }

  async analyzeSalesPattern(salesData: any[], timeframe: string = '30d') {
    const messages = [
      {
        role: "system", 
        content: "You are a data analyst specializing in e-commerce sales patterns and predictive analytics for inventory management."
      },
      {
        role: "user",
        content: `Analyze sales pattern for the last ${timeframe}:
        
        Sales Data: ${JSON.stringify(salesData)}
        
        Provide insights in JSON format:
        {
          "trend": "increasing|decreasing|stable|seasonal",
          "average_daily_sales": number,
          "peak_sales_days": ["day1", "day2"],
          "seasonal_factors": "analysis",
          "demand_forecast_7d": number,
          "demand_forecast_30d": number,
          "recommendations": ["rec1", "rec2"],
          "confidence_level": "high|medium|low"
        }`
      }
    ]

    try {
      const response = await this.chat(messages, { temperature: 0.3, max_tokens: 1000 })
      return JSON.parse(response)
    } catch (error) {
      console.error('Sales pattern analysis failed:', error)
      return null
    }
  }
}

// Singleton instance
export const deepSeekAPI = new DeepSeekAPI()
