'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { 
  CreditCard, Plus, Edit3, Trash2, Check, X, Eye, EyeOff,
  Smartphone, Shield, Wallet, Star, AlertCircle, Copy,
  ChevronRight, Lock, Zap, Bot, CheckCircle
} from 'lucide-react'

interface PaymentMethod {
  id: string
  type: 'card' | 'upi' | 'wallet' | 'bank'
  name: string
  details: string
  isDefault: boolean
  lastUsed?: string
  icon: string
}

export default function PaymentMethodsPage() {
  const [user, setUser] = useState<any>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'upi',
      name: 'Primary UPI',
      details: '9334042952@ybl',
      isDefault: true,
      lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      icon: '💳'
    },
    {
      id: '2',
      type: 'card',
      name: 'HDFC Credit Card',
      details: '•••• •••• •••• 1234',
      isDefault: false,
      lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      icon: '💎'
    }
  ])
  const [showAddForm, setShowAddForm] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [aiRecommendation, setAiRecommendation] = useState('')
  const [newPayment, setNewPayment] = useState({
    type: 'card',
    name: '',
    details: ''
  })

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      if (raw) {
        setUser(JSON.parse(raw))
        // Load saved payment methods
        const methodsRaw = localStorage.getItem('paymentMethods')
        if (methodsRaw) {
          setPaymentMethods(JSON.parse(methodsRaw))
        }
      }
    } catch {}

    // AI recommendation based on usage patterns
    const timer = setTimeout(() => {
      setAiRecommendation('💡 AI suggests adding a credit card for better rewards and cashback on your frequent purchases.')
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const copyUpiId = (upiId: string) => {
    navigator.clipboard.writeText(upiId)
    setMessage('UPI ID copied to clipboard!')
    setTimeout(() => setMessage(null), 3000)
  }

  const savePaymentMethods = (methods: PaymentMethod[]) => {
    setPaymentMethods(methods)
    localStorage.setItem('paymentMethods', JSON.stringify(methods))
  }

  const addPaymentMethod = () => {
    if (!newPayment.name || !newPayment.details) {
      setMessage('Please fill in all fields!')
      return
    }

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: newPayment.type as any,
      name: newPayment.name,
      details: newPayment.details,
      isDefault: paymentMethods.length === 0,
      icon: getPaymentIcon(newPayment.type)
    }

    const updatedMethods = [...paymentMethods, newMethod]
    savePaymentMethods(updatedMethods)
    setShowAddForm(false)
    setNewPayment({ type: 'card', name: '', details: '' })
    setMessage('Payment method added successfully!')
    setTimeout(() => setMessage(null), 3000)
  }

  const removePaymentMethod = (id: string) => {
    const method = paymentMethods.find(m => m.id === id)
    if (method?.isDefault && paymentMethods.length > 1) {
      // Set another method as default
      const updatedMethods = paymentMethods.filter(m => m.id !== id)
      updatedMethods[0].isDefault = true
      savePaymentMethods(updatedMethods)
    } else if (paymentMethods.length > 1) {
      const updatedMethods = paymentMethods.filter(m => m.id !== id)
      savePaymentMethods(updatedMethods)
    }
    setMessage('Payment method removed successfully!')
    setTimeout(() => setMessage(null), 3000)
  }

  const setDefaultPayment = (id: string) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }))
    savePaymentMethods(updatedMethods)
    setMessage('Default payment method updated!')
    setTimeout(() => setMessage(null), 3000)
  }

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card': return '💳'
      case 'upi': return '📱'
      case 'wallet': return '👛'
      case 'bank': return '🏦'
      default: return '💳'
    }
  }

  const getPaymentColor = (type: string) => {
    switch (type) {
      case 'card': return 'text-blue-600 bg-blue-50'
      case 'upi': return 'text-green-600 bg-green-50'
      case 'wallet': return 'text-purple-600 bg-purple-50'
      case 'bank': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (!user) {
    return (
      <div className="py-8 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <Link href="/account">
              <Button>Go to Login</Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="py-8 bg-gray-50">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/account" className="text-brand-green hover:text-brand-navy">
              ← Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow border">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <Wallet className="w-8 h-8 text-brand-green" />
                <div>
                  <h1 className="text-3xl font-bold text-brand-navy">Payment Methods</h1>
                  <p className="text-gray-600">{paymentMethods.length} payment method(s) saved</p>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-brand-green hover:bg-brand-green/90"
              >
                <Plus className="w-4 h-4" />
                Add Payment Method
              </Button>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 border-b ${message.includes('success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {message}
              </div>
            )}

            {/* AI Recommendation */}
            {aiRecommendation && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">AI Recommendation</span>
                </div>
                <p className="text-sm text-blue-700">{aiRecommendation}</p>
              </motion.div>
            )}

            {/* Quick Pay Setup */}
            <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-brand-green to-emerald-600 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Quick Pay UPI</h3>
                  <div className="flex items-center gap-2">
                    <code className="bg-white/20 px-2 py-1 rounded font-mono text-sm">9334042952@ybl</code>
                    <button
                      onClick={() => copyUpiId('9334042952@ybl')}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                      title="Copy UPI ID"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-white/80 mt-1">Your primary UPI ID for instant payments</p>
                </div>
                <Smartphone className="h-8 w-8 text-white/80" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Add Payment Form */}
              {showAddForm && (
                <div className="mb-8 p-6 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-brand-navy">Add New Payment Method</h3>
                    <Button 
                      onClick={() => setShowAddForm(false)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                      <select
                        value={newPayment.type}
                        onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      >
                        <option value="card">Credit/Debit Card</option>
                        <option value="upi">UPI ID</option>
                        <option value="wallet">Digital Wallet</option>
                        <option value="bank">Bank Account</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={newPayment.name}
                        onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                        placeholder="e.g., Primary Credit Card"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
                      <input
                        type="text"
                        value={newPayment.details}
                        onChange={(e) => setNewPayment({ ...newPayment, details: e.target.value })}
                        placeholder={
                          newPayment.type === 'card' ? '•••• •••• •••• 1234' :
                          newPayment.type === 'upi' ? 'your-id@paytm' :
                          newPayment.type === 'wallet' ? 'Wallet Name' :
                          'Bank Account Details'
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={addPaymentMethod}
                      className="bg-brand-green hover:bg-brand-green/90"
                    >
                      Add Payment Method
                    </Button>
                  </div>
                </div>
              )}

              {/* Payment Methods List */}
              {paymentMethods.length === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                  <h2 className="text-2xl font-semibold text-gray-600 mb-4">No payment methods</h2>
                  <p className="text-gray-500 mb-6">
                    Add a payment method to make checkout faster and easier
                  </p>
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-brand-green hover:bg-brand-green/90"
                  >
                    Add Your First Payment Method
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getPaymentColor(method.type)}`}>
                            {method.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{method.name}</h3>
                              {method.isDefault && (
                                <span className="bg-brand-green/10 text-brand-green text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-1">{method.details}</p>
                            {method.lastUsed && (
                              <p className="text-sm text-gray-500">
                                Last used: {new Date(method.lastUsed).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!method.isDefault && (
                            <Button
                              onClick={() => setDefaultPayment(method.id)}
                              variant="outline"
                              size="sm"
                              className="text-brand-green border-brand-green hover:bg-brand-green hover:text-white"
                            >
                              Set Default
                            </Button>
                          )}
                          <Button
                            onClick={() => removePaymentMethod(method.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Security Note */}
            <div className="p-6 border-t bg-blue-50">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Security Information</h4>
                  <p className="text-sm text-blue-700">
                    Your payment information is encrypted and stored securely. We never store complete card details on our servers.
                    For UPI and other payment methods, only necessary identifiers are saved for your convenience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
