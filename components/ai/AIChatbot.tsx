'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  message: string
  timestamp: Date
  actions?: ChatAction[]
}

interface ChatAction {
  label: string
  action: string
  data?: any
}

interface AIChatbotProps {
  userId?: string
  onAction?: (action: string, data?: any) => void
}

// Simulated AI responses for e-commerce
const AI_RESPONSES = {
  greeting: [
    "Hello! I'm your AI shopping assistant. How can I help you find the perfect natural products today?",
    "Hi there! I'm here to help you discover amazing natural wellness products. What are you looking for?",
    "Welcome! I can help you with product recommendations, order status, and any questions about our natural products."
  ],
  
  product_inquiry: [
    "I'd be happy to help you find the right product! Can you tell me more about what you're looking for?",
    "Let me help you discover some great options. What type of natural product are you interested in?",
    "I can recommend products based on your needs. Are you looking for skincare, wellness, or dietary supplements?"
  ],
  
  order_status: [
    "I can help you check your order status. Could you please provide your order number?",
    "Let me look up your recent orders. What's your order number or email address?",
    "I'll help you track your order. Please share your order details."
  ],
  
  recommendations: [
    "Based on your preferences, I have some great recommendations for you!",
    "Here are some products I think you'll love based on your shopping history:",
    "Let me suggest some popular items that match your interests:"
  ],
  
  pricing: [
    "I can help you find products within your budget. What price range are you considering?",
    "Let me show you our current offers and deals that might interest you!",
    "I can find great value products for you. What's your budget?"
  ]
}

// Simple intent classification
function classifyIntent(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'greeting'
  }
  if (lowerMessage.includes('order') && (lowerMessage.includes('status') || lowerMessage.includes('track'))) {
    return 'order_status'
  }
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('help me find')) {
    return 'recommendations'
  }
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('cheap') || lowerMessage.includes('budget')) {
    return 'pricing'
  }
  if (lowerMessage.includes('product') || lowerMessage.includes('item')) {
    return 'product_inquiry'
  }
  
  return 'general'
}

// Generate AI response
function generateAIResponse(message: string, chatHistory: ChatMessage[]): { message: string, actions?: ChatAction[] } {
  const intent = classifyIntent(message)
  const responses = AI_RESPONSES[intent as keyof typeof AI_RESPONSES] || [
    "I understand you're asking about that. Let me help you with more specific information.",
    "That's a great question! Can you provide more details so I can assist you better?",
    "I'm here to help! Could you rephrase that or be more specific about what you need?"
  ]
  
  const response = responses[Math.floor(Math.random() * responses.length)]
  let actions: ChatAction[] = []
  
  // Add contextual actions based on intent
  switch (intent) {
    case 'greeting':
      actions = [
        { label: '🛍️ Browse Products', action: 'browse_products' },
        { label: '🔍 Get Recommendations', action: 'get_recommendations' },
        { label: '📦 Check Order Status', action: 'check_order' }
      ]
      break
    case 'recommendations':
      actions = [
        { label: '🌿 Essential Oils', action: 'show_category', data: { category: 'essential-oils' } },
        { label: '💊 Supplements', action: 'show_category', data: { category: 'supplements' } },
        { label: '🧴 Skincare', action: 'show_category', data: { category: 'skincare' } },
        { label: '🔥 Trending Items', action: 'show_trending' }
      ]
      break
    case 'product_inquiry':
      actions = [
        { label: '🔍 Search Products', action: 'search_products' },
        { label: '🏷️ Browse Categories', action: 'browse_categories' },
        { label: '⭐ Popular Items', action: 'show_popular' }
      ]
      break
    case 'pricing':
      actions = [
        { label: '💰 Under ₹500', action: 'filter_price', data: { max: 500 } },
        { label: '💎 ₹500-₹1500', action: 'filter_price', data: { min: 500, max: 1500 } },
        { label: '🏆 Premium (₹1500+)', action: 'filter_price', data: { min: 1500 } },
        { label: '🎉 Current Deals', action: 'show_deals' }
      ]
      break
  }
  
  return { message: response, actions }
}

export function AIChatbot({ userId, onAction }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        message: "Hi! I'm your AI shopping assistant for natural wellness products. I can help you find products, check orders, or answer any questions. How can I help you today?",
        timestamp: new Date(),
        actions: [
          { label: '🛍️ Browse Products', action: 'browse_products' },
          { label: '🔍 Get Recommendations', action: 'get_recommendations' },
          { label: '📞 Contact Support', action: 'contact_support' }
        ]
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, messages)
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: aiResponse.message,
        timestamp: new Date(),
        actions: aiResponse.actions
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // 1-2 second delay
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const handleActionClick = (action: string, data?: any) => {
    // Add user message showing the action taken
    const actionMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: `🤖 Action: ${action.replace('_', ' ').toUpperCase()}`,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, actionMessage])

    // Call the external action handler
    if (onAction) {
      onAction(action, data)
    }

    // Generate contextual response based on action
    let response = "I've processed your request. Is there anything else I can help you with?"
    
    switch (action) {
      case 'browse_products':
        response = "Great! I've opened our product catalog for you. You can browse by category or use the search feature to find specific items."
        break
      case 'get_recommendations':
        response = "I'm analyzing your preferences to provide personalized recommendations. Check out the suggested products below!"
        break
      case 'show_category':
        response = `Perfect! I've filtered products in the ${data?.category} category. These are some of our most popular items in this section.`
        break
      case 'show_trending':
        response = "Here are the hottest products right now! These items are flying off our shelves."
        break
      case 'check_order':
        response = "I can help you track your order. Please provide your order number or email address."
        break
    }

    // Add bot response after a short delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'bot',
        message: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    }, 500)
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full shadow-lg bg-brand-green hover:bg-brand-green/90 text-white transition-all duration-300 hover:scale-105"
          size="lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[90vw] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-40 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-green to-brand-green/90 text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">AI Shopping Assistant</h3>
              <p className="text-sm text-white/90">Online • Ready to help</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-300">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'bot' && (
                  <div className="w-8 h-8 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-brand-green" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-brand-green text-white ml-auto'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  
                  {/* Action Buttons */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleActionClick(action.action, action.data)}
                          className="text-xs bg-white/20 hover:bg-white/30 text-slate-700 px-3 py-1 rounded-full border border-slate-300 hover:border-brand-green transition-colors"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-brand-green/10 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-brand-green" />
                </div>
                <div className="bg-slate-100 rounded-2xl px-4 py-2 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                  <span className="text-sm text-slate-600">AI is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-brand-green hover:bg-brand-green/90 disabled:opacity-50 disabled:cursor-not-allowed p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              AI Assistant • Powered by Natural Wellness AI
            </p>
          </div>
        </div>
      )}
    </>
  )
}
