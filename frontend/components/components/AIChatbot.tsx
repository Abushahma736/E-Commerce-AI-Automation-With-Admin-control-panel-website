'use client'

import { useState, useEffect, useRef } from 'react'
import { deepSeekAPI } from '../lib/ai/deepseek'
import { aiInventoryManager } from '../lib/ai/inventory-manager'
import { MessageCircle, X, Send, Bot, User, Sparkles, Package, ShoppingCart, Heart, ExternalLink } from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
  productRecommendations?: ProductRecommendation[]
  isTyping?: boolean
}

interface ProductRecommendation {
  id: number
  name: string
  price: number
  image?: string
  reason: string
  category?: string
}

interface ChatSession {
  id: string
  messages: ChatMessage[]
  userContext: UserContext
  createdAt: Date
  lastActivity: Date
}

interface UserContext {
  skinType?: string
  concerns?: string[]
  priceRange?: { min: number, max: number }
  categories?: string[]
  previousQuestions?: string[]
  currentIntent?: 'product_search' | 'support' | 'general' | 'order_help'
}

interface AIChatbotProps {
  userId?: string
  onAction?: (action: string, data: any) => void
}

export default function AIChatbot({ userId, onAction }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [session, setSession] = useState<ChatSession | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize chat session
  useEffect(() => {
    initializeChatSession()
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const initializeChatSession = () => {
    const welcomeMessage: ChatMessage = {
      id: `welcome_${Date.now()}`,
      role: 'assistant',
      content: `Hi! I'm your AI wellness assistant from ESSE Naturals. 🌿 

I can help you:
• Find the perfect natural products for your needs
• Get product recommendations based on your skin type
• Answer questions about our wellness products
• Check product availability and stock
• Provide skincare and wellness tips

What can I help you with today?`,
      timestamp: new Date(),
      suggestions: [
        "Recommend products for acne-prone skin",
        "Show me organic skincare options",
        "What's good for dry hair?",
        "Check neem product availability",
        "Best sellers under ₹1000"
      ]
    }

    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      messages: [welcomeMessage],
      userContext: {
        previousQuestions: [],
        currentIntent: 'general'
      },
      createdAt: new Date(),
      lastActivity: new Date()
    }

    setSession(newSession)
    setMessages([welcomeMessage])
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (content: string = inputValue.trim()) => {
    if (!content || isLoading) return

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Show typing indicator
    const typingMessage: ChatMessage = {
      id: `typing_${Date.now()}`,
      role: 'assistant',
      content: 'Thinking...',
      timestamp: new Date(),
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      const response = await generateAIResponse(content, [...messages, userMessage])
      
      // Remove typing indicator and add real response
      setMessages(prev => prev.filter(m => !m.isTyping).concat([response]))
      
      // Update session
      if (session) {
        const updatedSession = {
          ...session,
          messages: [...session.messages, userMessage, response],
          lastActivity: new Date(),
          userContext: {
            ...session.userContext,
            previousQuestions: [...(session.userContext.previousQuestions || []), content]
          }
        }
        setSession(updatedSession)
      }

    } catch (error) {
      console.error('Chat error:', error)
      
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment, or feel free to browse our products directly!",
        timestamp: new Date(),
        suggestions: [
          "Browse all products",
          "Contact customer support",
          "Try asking again"
        ]
      }
      
      setMessages(prev => prev.filter(m => !m.isTyping).concat([errorMessage]))
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = async (userMessage: string, conversationHistory: ChatMessage[]): Promise<ChatMessage> => {
    // Get current inventory data for context
    const inventoryAlerts = await aiInventoryManager.generateInventoryAlerts()
    const stockedProducts = Object.keys(inventoryAlerts.alerts).filter(id => 
      inventoryAlerts.alerts[id].stockLevel !== 'out_of_stock'
    )

    // Build conversation context
    const recentMessages = conversationHistory.slice(-6).map(m => ({
      role: m.role,
      content: m.content
    }))

    const systemPrompt = `You are an AI customer support assistant for ESSE Naturals, a premium natural wellness and Ayurvedic products company in India.

CAPABILITIES:
- Product recommendations based on skin type, concerns, ingredients
- Stock availability and product information
- Natural wellness and skincare advice
- Order assistance and general support
- Ingredient information and benefits

PRODUCT CONTEXT:
- We specialize in natural, organic, and Ayurvedic products
- Categories: Skincare, Haircare, Body Care, Wellness
- Key ingredients: Neem, Turmeric, Coconut, Aloe Vera, Tea Tree, etc.
- Price range: ₹200-₹2500
- Currently stocked products: ${stockedProducts.slice(0, 10).join(', ')}

PERSONALITY:
- Friendly, knowledgeable, and helpful
- Use natural wellness expertise
- Ask clarifying questions when needed
- Provide specific product recommendations
- Include relevant emojis naturally

RESPONSE FORMAT:
- Be conversational and helpful
- Suggest specific products when relevant
- Offer follow-up questions or suggestions
- Keep responses focused and actionable
- Use bullet points for lists when appropriate

Current user query: "${userMessage}"`

    try {
      const response = await deepSeekAPI.customerChat([
        { role: "system", content: systemPrompt },
        ...recentMessages,
        { role: "user", content: userMessage }
      ])

      // Analyze intent and extract recommendations
      const { content, suggestions, recommendations } = await processAIResponse(response, userMessage)

      return {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content,
        timestamp: new Date(),
        suggestions,
        productRecommendations: recommendations
      }

    } catch (error) {
      throw error
    }
  }

  const processAIResponse = async (aiResponse: string, userQuery: string) => {
    let content = aiResponse
    let suggestions: string[] = []
    let recommendations: ProductRecommendation[] = []

    // Extract suggestions (look for questions or follow-ups in response)
    const suggestionPatterns = [
      /Would you like to know about (.*?)\?/g,
      /I can also help you with (.*?)$/gm,
      /You might also want to (.*?)$/gm
    ]

    suggestionPatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        suggestions.push(...matches.slice(0, 3))
      }
    })

    // Add contextual suggestions based on user query
    if (userQuery.toLowerCase().includes('acne')) {
      suggestions.push(
        "Show me neem-based products",
        "What ingredients fight acne?",
        "Gentle cleansers for sensitive skin"
      )
    } else if (userQuery.toLowerCase().includes('dry')) {
      suggestions.push(
        "Hydrating moisturizers",
        "Natural oils for dry skin",
        "Winter skincare routine"
      )
    } else if (userQuery.toLowerCase().includes('hair')) {
      suggestions.push(
        "Natural hair oils",
        "Coconut-based hair products",
        "Hair growth treatments"
      )
    }

    // Generic helpful suggestions
    if (suggestions.length < 3) {
      suggestions.push(
        "Browse bestsellers",
        "Find products in my budget",
        "Check what's new",
        "Get skincare routine advice"
      )
    }

    // Generate product recommendations if query seems product-focused
    if (shouldGenerateRecommendations(userQuery)) {
      recommendations = await generateProductRecommendations(userQuery, aiResponse)
    }

    return {
      content,
      suggestions: suggestions.slice(0, 4),
      recommendations
    }
  }

  const shouldGenerateRecommendations = (query: string): boolean => {
    const productKeywords = [
      'recommend', 'suggest', 'find', 'show', 'best', 'good for',
      'acne', 'dry', 'oily', 'sensitive', 'hair', 'skin',
      'moisturizer', 'cleanser', 'serum', 'oil', 'cream',
      'under', 'budget', 'price', 'cheap', 'affordable'
    ]

    return productKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    )
  }

  const generateProductRecommendations = async (query: string, aiResponse: string): Promise<ProductRecommendation[]> => {
    // This would typically fetch from your product database
    // For now, return sample recommendations
    const sampleRecommendations: ProductRecommendation[] = [
      {
        id: 1,
        name: "Neem Face Cleanser",
        price: 450,
        image: "/images/neem-cleanser.jpg",
        reason: "Perfect for acne-prone skin with natural antibacterial properties",
        category: "Skincare"
      },
      {
        id: 2,
        name: "Turmeric Glow Serum",
        price: 650,
        image: "/images/turmeric-serum.jpg", 
        reason: "Brightens skin naturally and reduces inflammation",
        category: "Skincare"
      },
      {
        id: 3,
        name: "Coconut Hair Oil",
        price: 350,
        image: "/images/coconut-oil.jpg",
        reason: "Deep conditioning treatment for dry, damaged hair",
        category: "Haircare"
      }
    ]

    // Filter based on query context
    if (query.toLowerCase().includes('acne')) {
      return sampleRecommendations.filter(p => p.name.includes('Neem') || p.name.includes('Tea Tree'))
    }
    if (query.toLowerCase().includes('hair')) {
      return sampleRecommendations.filter(p => p.category === 'Haircare')
    }

    return sampleRecommendations.slice(0, 2)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    handleSendMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setUnreadCount(0)
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-brand-green hover:bg-brand-green/90 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {unreadCount}
            </div>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-brand-green text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">ESSE Naturals AI</h3>
                <p className="text-xs text-green-100">Wellness Assistant</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-brand-green text-white'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.isTyping ? (
                      <div className="flex items-center gap-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                    )}

                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Suggestions */}
            {!isLoading && messages.length > 0 && messages[messages.length - 1]?.suggestions && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {messages[messages.length - 1].suggestions!.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full hover:bg-brand-green/20 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Recommendations */}
            {!isLoading && messages.length > 0 && messages[messages.length - 1]?.productRecommendations && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Recommended for you:
                </p>
                <div className="space-y-2">
                  {messages[messages.length - 1].productRecommendations!.map((product) => (
                    <div
                      key={product.id}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900">{product.name}</h4>
                          <p className="text-xs text-gray-600">{product.reason}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-bold text-brand-green">₹{product.price}</span>
                            <div className="flex gap-1">
                              <button className="text-xs bg-white border border-green-200 px-2 py-1 rounded hover:bg-green-50 transition-colors">
                                View
                              </button>
                              <button className="text-xs bg-brand-green text-white px-2 py-1 rounded hover:bg-brand-green/90 transition-colors">
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about products, get recommendations..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="bg-brand-green text-white p-2 rounded-full hover:bg-brand-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
