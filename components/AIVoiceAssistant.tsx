'use client'

import 'regenerator-runtime'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { 
  Mic, MicOff, Volume2, VolumeX, Play, Pause, RotateCcw, 
  MessageSquare, User, Bot, Sparkles, ShoppingBag, Search,
  Heart, Star, Package, Truck, Phone, Settings
} from 'lucide-react'

interface VoiceCommand {
  id: string
  timestamp: Date
  userSpeech: string
  aiResponse: string
  intent: string
  confidence: number
  products?: Product[]
  action?: string
}

interface Product {
  id: number
  name: string
  price: number
  category: string
  inStock: boolean
}

interface ConversationState {
  isActive: boolean
  isListening: boolean
  isSpeaking: boolean
  commands: VoiceCommand[]
  currentContext: string
  userPreferences: {
    voice: 'female' | 'male'
    language: string
    speechRate: number
  }
}

export default function AIVoiceAssistant() {
  const [state, setState] = useState<ConversationState>({
    isActive: false,
    isListening: false,
    isSpeaking: false,
    commands: [],
    currentContext: 'general',
    userPreferences: {
      voice: 'female',
      language: 'en-IN',
      speechRate: 1.0
    }
  })

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [audioLevel, setAudioLevel] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  // Sample products data
  const sampleProducts: Product[] = [
    { id: 1, name: 'Neem Face Cleanser', price: 299, category: 'Skincare', inStock: true },
    { id: 2, name: 'Turmeric Serum', price: 599, category: 'Skincare', inStock: true },
    { id: 3, name: 'Coconut Hair Oil', price: 399, category: 'Haircare', inStock: false },
    { id: 4, name: 'Aloe Vera Gel', price: 249, category: 'Skincare', inStock: true },
    { id: 5, name: 'Amla Vitamin C', price: 799, category: 'Wellness', inStock: true }
  ]

  useEffect(() => {
    setIsClient(true)
    synthRef.current = window.speechSynthesis
    initializeAudioContext()

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (transcript && transcript !== currentTranscript) {
      setCurrentTranscript(transcript)
      // Auto-process after 2 seconds of silence
      const timer = setTimeout(() => {
        if (!listening && transcript.length > 0) {
          processVoiceCommand(transcript)
          resetTranscript()
          setCurrentTranscript('')
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [transcript, listening, currentTranscript])

  const initializeAudioContext = async () => {
    try {
      audioContextRef.current = new AudioContext()
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      source.connect(analyserRef.current)
      
      // Monitor audio levels
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      const updateAudioLevel = () => {
        if (analyserRef.current && state.isListening) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          setAudioLevel(average / 255)
          requestAnimationFrame(updateAudioLevel)
        }
      }
      updateAudioLevel()
    } catch (error) {
      console.error('Failed to initialize audio context:', error)
    }
  }

  const startListening = () => {
    if (!browserSupportsSpeechRecognition) {
      speak('Sorry, your browser doesn\'t support speech recognition.')
      return
    }

    SpeechRecognition.startListening({ 
      continuous: true, 
      language: state.userPreferences.language 
    })
    
    setState(prev => ({ ...prev, isListening: true, isActive: true }))
  }

  const stopListening = () => {
    SpeechRecognition.stopListening()
    setState(prev => ({ ...prev, isListening: false }))
    
    if (transcript) {
      processVoiceCommand(transcript)
      resetTranscript()
    }
  }

  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true)
    
    const intent = identifyIntent(command)
    const response = await generateResponse(command, intent)
    
    const newCommand: VoiceCommand = {
      id: Date.now().toString(),
      timestamp: new Date(),
      userSpeech: command,
      aiResponse: response.text,
      intent: intent.type,
      confidence: intent.confidence,
      products: response.products,
      action: response.action
    }

    setState(prev => ({
      ...prev,
      commands: [newCommand, ...prev.commands.slice(0, 9)] // Keep last 10 commands
    }))

    // Speak the response
    speak(response.text)
    
    setIsProcessing(false)
  }

  const identifyIntent = (command: string) => {
    const lowerCommand = command.toLowerCase()
    
    const intents = [
      {
        type: 'product_search',
        keywords: ['show', 'find', 'search', 'looking for', 'need', 'want'],
        confidence: 0
      },
      {
        type: 'add_to_cart',
        keywords: ['add to cart', 'buy', 'purchase', 'order'],
        confidence: 0
      },
      {
        type: 'product_info',
        keywords: ['tell me about', 'what is', 'information', 'details'],
        confidence: 0
      },
      {
        type: 'price_check',
        keywords: ['price', 'cost', 'how much'],
        confidence: 0
      },
      {
        type: 'availability',
        keywords: ['in stock', 'available', 'out of stock'],
        confidence: 0
      },
      {
        type: 'recommendation',
        keywords: ['recommend', 'suggest', 'best for', 'good for'],
        confidence: 0
      },
      {
        type: 'greeting',
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
        confidence: 0
      }
    ]

    // Calculate confidence scores
    intents.forEach(intent => {
      intent.confidence = intent.keywords.reduce((score, keyword) => {
        return lowerCommand.includes(keyword) ? score + 1 : score
      }, 0) / intent.keywords.length
    })

    // Return the intent with highest confidence
    const bestIntent = intents.reduce((prev, current) => 
      current.confidence > prev.confidence ? current : prev
    )

    return bestIntent.confidence > 0 ? bestIntent : { type: 'general', confidence: 0.5 }
  }

  const generateResponse = async (command: string, intent: any) => {
    const lowerCommand = command.toLowerCase()
    
    switch (intent.type) {
      case 'greeting':
        return {
          text: `Hello! I'm your AI shopping assistant. I can help you find products, check prices, and answer questions about our natural wellness products. What can I help you with today?`,
          action: 'greeting'
        }

      case 'product_search':
        const searchProducts = sampleProducts.filter(product => 
          product.name.toLowerCase().includes(extractProductKeywords(lowerCommand)) ||
          product.category.toLowerCase().includes(extractProductKeywords(lowerCommand))
        ).slice(0, 3)
        
        if (searchProducts.length > 0) {
          const productList = searchProducts.map(p => `${p.name} for ₹${p.price}`).join(', ')
          return {
            text: `I found these products for you: ${productList}. Would you like more details about any of these?`,
            products: searchProducts,
            action: 'show_products'
          }
        } else {
          return {
            text: `I couldn't find specific products matching "${command}". Let me show you our popular items instead. We have great skincare, haircare, and wellness products.`,
            products: sampleProducts.slice(0, 3),
            action: 'show_popular'
          }
        }

      case 'price_check':
        const priceProduct = sampleProducts.find(p => 
          lowerCommand.includes(p.name.toLowerCase())
        )
        
        if (priceProduct) {
          return {
            text: `${priceProduct.name} costs ₹${priceProduct.price}. ${priceProduct.inStock ? 'It\'s currently in stock!' : 'Sorry, it\'s currently out of stock.'}`,
            products: [priceProduct],
            action: 'show_price'
          }
        } else {
          return {
            text: `I couldn't identify the specific product. Could you please repeat the product name more clearly?`,
            action: 'clarify_product'
          }
        }

      case 'recommendation':
        const skinType = extractSkinType(lowerCommand)
        const recommendedProducts = getRecommendations(skinType)
        
        return {
          text: `Based on ${skinType || 'your needs'}, I recommend: ${recommendedProducts.map(p => p.name).join(', ')}. These are specially formulated for natural skincare.`,
          products: recommendedProducts,
          action: 'show_recommendations'
        }

      case 'add_to_cart':
        return {
          text: `I'd be happy to add items to your cart! However, I need to connect with the shopping system. Please use the website interface to complete your purchase, or I can guide you through it.`,
          action: 'guide_purchase'
        }

      case 'availability':
        const availableProducts = sampleProducts.filter(p => p.inStock)
        return {
          text: `Currently, we have ${availableProducts.length} products in stock. Popular items include ${availableProducts.slice(0, 3).map(p => p.name).join(', ')}.`,
          products: availableProducts.slice(0, 3),
          action: 'show_availability'
        }

      default:
        return {
          text: `I'm here to help with your natural wellness shopping. You can ask me to find products, check prices, get recommendations, or learn about our items. What would you like to know?`,
          action: 'general_help'
        }
    }
  }

  const speak = (text: string) => {
    if (!synthRef.current) return

    setState(prev => ({ ...prev, isSpeaking: true }))
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = state.userPreferences.speechRate
    utterance.lang = state.userPreferences.language
    
    // Try to use preferred voice
    const voices = synthRef.current.getVoices()
    const preferredVoice = voices.find(voice => 
      voice.lang.includes('en') && 
      voice.name.toLowerCase().includes(state.userPreferences.voice)
    )
    if (preferredVoice) utterance.voice = preferredVoice

    utterance.onend = () => {
      setState(prev => ({ ...prev, isSpeaking: false }))
    }

    synthRef.current.speak(utterance)
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setState(prev => ({ ...prev, isSpeaking: false }))
    }
  }

  const extractProductKeywords = (command: string) => {
    const productKeywords = ['neem', 'turmeric', 'coconut', 'aloe', 'amla', 'face', 'hair', 'skin', 'cleanser', 'serum', 'oil', 'gel']
    return productKeywords.find(keyword => command.includes(keyword)) || ''
  }

  const extractSkinType = (command: string) => {
    const skinTypes = ['dry', 'oily', 'sensitive', 'combination', 'acne', 'aging']
    return skinTypes.find(type => command.includes(type))
  }

  const getRecommendations = (skinType?: string) => {
    if (skinType === 'dry') return [sampleProducts[0], sampleProducts[3]]
    if (skinType === 'oily') return [sampleProducts[0], sampleProducts[1]]
    if (skinType === 'sensitive') return [sampleProducts[3]]
    return sampleProducts.slice(0, 2)
  }

  const clearHistory = () => {
    setState(prev => ({ ...prev, commands: [] }))
  }

  // Show loading state during SSR to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">AI Voice Assistant</h1>
                <p className="text-green-200">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-center">
          <MicOff className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Speech Recognition Not Supported</h2>
          <p className="text-red-200">Your browser doesn't support speech recognition. Please use a modern browser like Chrome or Firefox.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center"
              animate={{ 
                scale: state.isListening ? [1, 1.1, 1] : 1,
                boxShadow: state.isListening ? ['0 0 0 0 rgba(34, 197, 94, 0.7)', '0 0 0 20px rgba(34, 197, 94, 0)', '0 0 0 0 rgba(34, 197, 94, 0)'] : 'none'
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity },
                boxShadow: { duration: 2, repeat: Infinity }
              }}
            >
              <Mic className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-white">AI Voice Assistant</h1>
              <p className="text-green-200">Your personal shopping companion powered by voice AI</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Voice Control Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Mic className="h-6 w-6" />
                Voice Control
              </h2>

              {/* Microphone Button */}
              <div className="text-center mb-6">
                <motion.button
                  onClick={state.isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${
                    state.isListening 
                      ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50' 
                      : 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/50'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {state.isListening ? (
                    <MicOff className="h-10 w-10 text-white" />
                  ) : (
                    <Mic className="h-10 w-10 text-white" />
                  )}
                  
                  {/* Audio level indicator */}
                  {state.isListening && (
                    <motion.div
                      className="absolute inset-0 border-4 border-white/30 rounded-full"
                      animate={{ 
                        scale: 1 + audioLevel * 0.5,
                        opacity: audioLevel 
                      }}
                    />
                  )}
                </motion.button>
                
                <div className="mt-4">
                  <p className="text-white font-medium">
                    {state.isListening ? 'Listening...' : 'Click to start'}
                  </p>
                  <p className="text-green-200 text-sm">
                    {state.isListening ? 'Speak naturally' : 'Voice commands ready'}
                  </p>
                </div>
              </div>

              {/* Current Transcript */}
              {(currentTranscript || isProcessing) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 rounded-xl p-4 mb-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">You said:</span>
                  </div>
                  <p className="text-white">
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          className="w-2 h-2 bg-green-400 rounded-full inline-block"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        Processing...
                      </span>
                    ) : (
                      currentTranscript || 'Listening...'
                    )}
                  </p>
                </motion.div>
              )}

              {/* Voice Settings */}
              <div className="bg-slate-800/30 rounded-xl p-4">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Voice Settings
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-slate-300">Voice Type</label>
                    <select
                      value={state.userPreferences.voice}
                      onChange={(e) => setState(prev => ({
                        ...prev,
                        userPreferences: { 
                          ...prev.userPreferences, 
                          voice: e.target.value as 'female' | 'male' 
                        }
                      }))}
                      className="w-full mt-1 bg-slate-700 text-white rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-300">Speech Rate</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={state.userPreferences.speechRate}
                      onChange={(e) => setState(prev => ({
                        ...prev,
                        userPreferences: { 
                          ...prev.userPreferences, 
                          speechRate: parseFloat(e.target.value)
                        }
                      }))}
                      className="w-full mt-1"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Slow</span>
                      <span>Normal</span>
                      <span>Fast</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => speak("Hello! I'm ready to help you with your shopping.")}
                  disabled={state.isSpeaking}
                  className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Volume2 className="h-4 w-4" />
                  Test Voice
                </button>
                
                {state.isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <VolumeX className="h-4 w-4" />
                    Stop Speaking
                  </button>
                )}
                
                <button
                  onClick={clearHistory}
                  className="w-full bg-slate-500/20 hover:bg-slate-500/30 text-slate-400 px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear History
                </button>
              </div>
            </div>

            {/* Quick Commands */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Commands</h3>
              <div className="space-y-2">
                {[
                  { text: "Show me skincare products", icon: Sparkles },
                  { text: "Find products under ₹500", icon: Search },
                  { text: "What's good for dry skin?", icon: Heart },
                  { text: "Check neem cleanser price", icon: Package },
                  { text: "What's in stock today?", icon: Truck }
                ].map((command, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentTranscript(command.text)
                      processVoiceCommand(command.text)
                    }}
                    className="w-full text-left bg-slate-700/30 hover:bg-slate-700/50 text-slate-200 px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <command.icon className="h-4 w-4" />
                    "{command.text}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conversation History */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  Conversation History
                </h2>
                
                {state.commands.length > 0 && (
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    {state.commands.length} conversation{state.commands.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {state.commands.length === 0 ? (
                  <div className="text-center py-12">
                    <Bot className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Ready to Chat</h3>
                    <p className="text-slate-300 mb-4">
                      Start a voice conversation! I can help you find products, check prices, and get recommendations.
                    </p>
                    <p className="text-sm text-green-300">
                      Try saying: "Show me natural skincare products" or "What's good for sensitive skin?"
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {state.commands.map((command, index) => (
                      <motion.div
                        key={command.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-3"
                      >
                        {/* User Message */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 bg-blue-500/20 rounded-2xl rounded-bl-md p-4">
                            <p className="text-white">{command.userSpeech}</p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-blue-300">
                              <span>Intent: {command.intent}</span>
                              <span>•</span>
                              <span>Confidence: {Math.round(command.confidence * 100)}%</span>
                              <span>•</span>
                              <span>{command.timestamp.toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* AI Response */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 bg-slate-700/50 rounded-2xl rounded-bl-md p-4">
                            <p className="text-white mb-2">{command.aiResponse}</p>
                            
                            {/* Show products if any */}
                            {command.products && command.products.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <h4 className="text-sm font-medium text-slate-300">Relevant Products:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {command.products.map((product) => (
                                    <div
                                      key={product.id}
                                      className="bg-slate-600/50 rounded-lg p-3 flex items-center gap-3"
                                    >
                                      <ShoppingBag className="h-4 w-4 text-green-400" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{product.name}</p>
                                        <div className="flex items-center gap-2 text-xs">
                                          <span className="text-green-400">₹{product.price}</span>
                                          <span className={`px-2 py-0.5 rounded-full ${
                                            product.inStock 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : 'bg-red-500/20 text-red-400'
                                          }`}>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
