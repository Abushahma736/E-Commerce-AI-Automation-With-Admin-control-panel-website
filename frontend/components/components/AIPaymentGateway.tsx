'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'qrcode'
import { 
  CreditCard, Smartphone, QrCode, Wallet, ArrowRight, 
  Check, X, RefreshCw, Copy, Download, Share2, Timer,
  Shield, Zap, Bot, AlertCircle, CheckCircle2, Clock,
  Phone, Mail, User, Lock, Eye, EyeOff
} from 'lucide-react'

interface PaymentMethod {
  id: string
  type: 'upi' | 'card' | 'netbanking' | 'wallet'
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  processingTime: string
  fees: string
}

interface PaymentDetails {
  amount: number
  currency: string
  orderId: string
  merchantName: string
  customerEmail: string
  customerPhone: string
  items: Array<{ name: string; quantity: number; price: number }>
}

interface AIPaymentGatewayProps {
  paymentDetails: PaymentDetails
  onPaymentSuccess: (transactionId: string, method: string) => void
  onPaymentFailure: (error: string) => void
  onCancel: () => void
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'upi',
    type: 'upi',
    name: 'UPI Payment',
    icon: Smartphone,
    description: 'Pay instantly using your UPI app',
    processingTime: 'Instant',
    fees: 'Free'
  },
  {
    id: 'card',
    type: 'card',
    name: 'Debit/Credit Card',
    icon: CreditCard,
    description: 'Secure payment with your card',
    processingTime: '2-3 mins',
    fees: '2% + GST'
  },
  {
    id: 'netbanking',
    type: 'netbanking',
    name: 'Net Banking',
    icon: Shield,
    description: 'Pay directly from your bank account',
    processingTime: '2-5 mins',
    fees: '₹10 + GST'
  },
  {
    id: 'wallet',
    type: 'wallet',
    name: 'Digital Wallet',
    icon: Wallet,
    description: 'Paytm, PhonePe, Google Pay & more',
    processingTime: 'Instant',
    fees: 'Free'
  }
]

export default function AIPaymentGateway({
  paymentDetails,
  onPaymentSuccess,
  onPaymentFailure,
  onCancel
}: AIPaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('upi')
  const [paymentStep, setPaymentStep] = useState<'method' | 'details' | 'processing' | 'success' | 'failed'>('method')
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [countdown, setCountdown] = useState(300) // 5 minutes
  const [aiInsights, setAiInsights] = useState<string>('')
  const [fraudCheck, setFraudCheck] = useState<'checking' | 'passed' | 'flagged'>('checking')
  const [showCardDetails, setShowCardDetails] = useState(false)
  
  // Form states
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [upiId, setUpiId] = useState('')
  const [showCvv, setShowCvv] = useState(false)
  
  const qrRef = useRef<HTMLCanvasElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // AI-powered fraud detection simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate AI fraud analysis
      const riskScore = Math.random()
      if (riskScore > 0.95) {
        setFraudCheck('flagged')
        setAiInsights('⚠️ Unusual payment pattern detected. Additional verification may be required.')
      } else {
        setFraudCheck('passed')
        setAiInsights('✅ Transaction appears secure. AI fraud detection passed all checks.')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Generate UPI QR Code
  useEffect(() => {
    if (selectedMethod === 'upi' && paymentStep === 'details') {
      generateUpiQR()
      startCountdown()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [selectedMethod, paymentStep])

  const generateUpiQR = async () => {
    const { amount, orderId, merchantName } = paymentDetails
    
    // UPI Payment URL format
    const upiUrl = `upi://pay?pa=9334042952@ybl&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Payment for Order ${orderId}`)}`
    
    try {
      const qrDataUrl = await QRCode.toDataURL(upiUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#059669',
          light: '#FFFFFF'
        }
      })
      setQrCodeUrl(qrDataUrl)
    } catch (error) {
      console.error('QR Code generation error:', error)
    }
  }

  const startCountdown = () => {
    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          handlePaymentTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handlePaymentTimeout = () => {
    onPaymentFailure('Payment timeout. Please try again.')
  }

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    setPaymentStep('details')
  }

  const handlePaymentProcess = async () => {
    setPaymentStep('processing')
    
    // Simulate payment processing with AI optimization
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Simulate payment success (90% success rate)
    if (Math.random() > 0.1) {
      const transactionId = `TXN${Date.now()}`
      setPaymentStep('success')
      setTimeout(() => {
        onPaymentSuccess(transactionId, selectedMethod)
      }, 2000)
    } else {
      setPaymentStep('failed')
      setTimeout(() => {
        onPaymentFailure('Payment failed. Please try again.')
      }, 2000)
    }
  }

  const copyUpiId = () => {
    navigator.clipboard.writeText('9334042952@ybl')
    // Show success toast (you can implement your toast system)
    alert('UPI ID copied to clipboard!')
  }

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a')
      link.download = `payment-qr-${paymentDetails.orderId}.png`
      link.href = qrCodeUrl
      link.click()
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4)
    }
    setExpiryDate(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-3xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI-Powered Payment</h1>
                <p className="text-gray-600">Secure, fast, and intelligent</p>
              </div>
            </div>
            
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* AI Insights */}
          {fraudCheck !== 'checking' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-lg border ${
                fraudCheck === 'passed' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-orange-50 border-orange-200 text-orange-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span className="text-sm font-medium">AI Security Analysis</span>
              </div>
              <p className="text-sm mt-1">{aiInsights}</p>
            </motion.div>
          )}
        </div>

        <div className="bg-white border-x border-gray-200">
          {/* Payment Summary */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              {paymentDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total Amount</span>
                <span className="text-xl text-green-600">₹{paymentDetails.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <AnimatePresence mode="wait">
            {paymentStep === 'method' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h2>
                
                {fraudCheck === 'checking' && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium">AI is analyzing transaction security...</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <motion.button
                      key={method.id}
                      onClick={() => handleMethodSelect(method.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedMethod === method.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <method.icon className={`h-6 w-6 mt-1 ${
                          selectedMethod === method.id ? 'text-green-600' : 'text-gray-600'
                        }`} />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                          <div className="flex justify-between text-xs">
                            <span className="text-green-600 font-medium">{method.processingTime}</span>
                            <span className="text-gray-500">{method.fees}</span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Payment Details */}
            {paymentStep === 'details' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                {selectedMethod === 'upi' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">UPI Payment</h2>
                      <div className="flex items-center justify-center gap-2 text-red-600 mb-4">
                        <Timer className="h-4 w-4" />
                        <span className="font-mono text-lg">{formatTime(countdown)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* QR Code */}
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 mb-4">Scan QR Code</h3>
                        {qrCodeUrl && (
                          <div className="relative inline-block">
                            <img 
                              src={qrCodeUrl} 
                              alt="Payment QR Code" 
                              className="w-64 h-64 border-2 border-gray-200 rounded-xl shadow-lg"
                            />
                            <div className="absolute -bottom-2 -right-2 flex gap-2">
                              <button
                                onClick={downloadQR}
                                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                title="Download QR"
                              >
                                <Download className="h-4 w-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => navigator.share?.({ url: qrCodeUrl })}
                                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                title="Share QR"
                              >
                                <Share2 className="h-4 w-4 text-gray-600" />
                              </button>
                            </div>
                          </div>
                        )}
                        <p className="text-sm text-gray-600 mt-4">
                          Use any UPI app to scan and pay
                        </p>
                      </div>

                      {/* Manual UPI */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Or Pay Manually</h3>
                        
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <label className="text-sm font-medium text-gray-700">UPI ID</label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="flex-1 p-2 bg-white border rounded-lg font-mono text-sm">
                                9334042952@ybl
                              </code>
                              <button
                                onClick={copyUpiId}
                                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                title="Copy UPI ID"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Enter your UPI ID</label>
                              <input
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="yourname@paytm"
                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </div>

                            <button
                              onClick={handlePaymentProcess}
                              disabled={!upiId.includes('@')}
                              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                              <Zap className="h-4 w-4" />
                              Pay ₹{paymentDetails.amount}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'card' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Card Payment</h2>
                    
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="1234 5678 9012 3456"
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                            <input
                              type="text"
                              value={expiryDate}
                              onChange={handleExpiryChange}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">CVV</label>
                            <div className="relative">
                              <input
                                type={showCvv ? 'text' : 'password'}
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                placeholder="123"
                                className="w-full mt-1 p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => setShowCvv(!showCvv)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">Cardholder Name</label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="JOHN DOE"
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
                          />
                        </div>

                        <button
                          onClick={handlePaymentProcess}
                          disabled={!cardNumber || !expiryDate || !cvv || !cardName}
                          className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <Lock className="h-4 w-4" />
                          Secure Pay ₹{paymentDetails.amount}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setPaymentStep('method')}
                  className="mt-4 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                  ← Choose different method
                </button>
              </motion.div>
            )}

            {/* Processing */}
            {paymentStep === 'processing' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="h-8 w-8 text-white animate-spin" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
                <p className="text-gray-600 mb-4">AI is securely processing your transaction...</p>
                
                <div className="space-y-2 text-sm text-left bg-gray-50 rounded-lg p-4 max-w-sm mx-auto">
                  {[
                    'Validating payment details',
                    'Running fraud detection',
                    'Connecting to bank',
                    'Confirming transaction'
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>{step}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Success */}
            {paymentStep === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600">Your order has been confirmed and will be processed shortly.</p>
              </motion.div>
            )}

            {/* Failed */}
            {paymentStep === 'failed' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center"
              >
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h2>
                <p className="text-gray-600 mb-4">Something went wrong with your payment. Please try again.</p>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setPaymentStep('method')}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={onCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-3xl border border-gray-200 border-t-0 p-4">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>256-bit SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <Bot className="h-4 w-4" />
              <span>AI-Powered Security</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>PCI DSS Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
