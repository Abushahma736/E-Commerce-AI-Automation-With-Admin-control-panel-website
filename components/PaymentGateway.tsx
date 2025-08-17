"use client"

import { useState, useEffect } from 'react'
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet,
  CheckCircle,
  AlertCircle,
  Loader,
  Shield,
  Lock
} from 'lucide-react'

interface PaymentMethod {
  id: string
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod'
  name: string
  icon: React.ReactNode
  description: string
  enabled: boolean
}

interface Address {
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  phone: string
}

interface PaymentGatewayProps {
  amount: number
  orderId: string
  customerEmail: string
  customerPhone: string
  billingAddress: Address
  onPaymentSuccess: (paymentData: any) => void
  onPaymentError: (error: string) => void
  onCancel: () => void
}

export default function PaymentGateway({
  amount,
  orderId,
  customerEmail,
  customerPhone,
  billingAddress,
  onPaymentSuccess,
  onPaymentError,
  onCancel
}: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [processing, setProcessing] = useState(false)
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })
  const [upiId, setUpiId] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [selectedWallet, setSelectedWallet] = useState('')

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      type: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, MasterCard, RuPay, Amex',
      enabled: true
    },
    {
      id: 'upi',
      type: 'upi',
      name: 'UPI',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Pay using UPI ID or QR Code',
      enabled: true
    },
    {
      id: 'netbanking',
      type: 'netbanking',
      name: 'Net Banking',
      icon: <Building2 className="w-6 h-6" />,
      description: 'All major banks supported',
      enabled: true
    },
    {
      id: 'wallet',
      type: 'wallet',
      name: 'Wallets',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Paytm, PhonePe, Google Pay',
      enabled: true
    },
    {
      id: 'cod',
      type: 'cod',
      name: 'Cash on Delivery',
      icon: <CheckCircle className="w-6 h-6" />,
      description: 'Pay when you receive',
      enabled: true
    }
  ]

  const popularBanks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
    'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank',
    'Bank of India', 'Central Bank of India', 'Indian Bank', 'IDBI Bank'
  ]

  const walletOptions = [
    { id: 'paytm', name: 'Paytm' },
    { id: 'phonepe', name: 'PhonePe' },
    { id: 'googlepay', name: 'Google Pay' },
    { id: 'amazonpay', name: 'Amazon Pay' },
    { id: 'mobikwik', name: 'MobiKwik' },
    { id: 'freecharge', name: 'FreeCharge' }
  ]

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

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const validateCard = () => {
    const errors = []
    if (!cardData.number || cardData.number.replace(/\s/g, '').length < 13) {
      errors.push('Please enter a valid card number')
    }
    if (!cardData.name.trim()) {
      errors.push('Please enter cardholder name')
    }
    if (!cardData.expiry || cardData.expiry.length < 5) {
      errors.push('Please enter valid expiry date')
    }
    if (!cardData.cvv || cardData.cvv.length < 3) {
      errors.push('Please enter valid CVV')
    }
    return errors
  }

  const validateUPI = () => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/
    if (!upiId || !upiRegex.test(upiId)) {
      return ['Please enter a valid UPI ID']
    }
    return []
  }

  const processPayment = async () => {
    try {
      setProcessing(true)
      
      let validationErrors: string[] = []
      
      switch (selectedMethod) {
        case 'card':
          validationErrors = validateCard()
          break
        case 'upi':
          validationErrors = validateUPI()
          break
        case 'netbanking':
          if (!selectedBank) {
            validationErrors.push('Please select a bank')
          }
          break
        case 'wallet':
          if (!selectedWallet) {
            validationErrors.push('Please select a wallet')
          }
          break
      }
      
      if (validationErrors.length > 0) {
        onPaymentError(validationErrors.join(', '))
        setProcessing(false)
        return
      }
      
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simulate payment gateway integration
      const paymentData = {
        paymentId: `pay_${Date.now()}`,
        orderId: orderId,
        amount: amount,
        method: selectedMethod,
        status: 'success',
        transactionId: `txn_${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...(selectedMethod === 'card' && {
          cardDetails: {
            last4: cardData.number.replace(/\s/g, '').slice(-4),
            brand: getCardBrand(cardData.number)
          }
        }),
        ...(selectedMethod === 'upi' && { upiId: upiId }),
        ...(selectedMethod === 'netbanking' && { bank: selectedBank }),
        ...(selectedMethod === 'wallet' && { wallet: selectedWallet })
      }
      
      onPaymentSuccess(paymentData)
      
    } catch (error) {
      onPaymentError('Payment processing failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const getCardBrand = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '')
    if (number.startsWith('4')) return 'Visa'
    if (number.startsWith('5')) return 'MasterCard'
    if (number.startsWith('6')) return 'RuPay'
    if (number.startsWith('3')) return 'Amex'
    return 'Unknown'
  }

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                value={cardData.number}
                onChange={(e) => setCardData(prev => ({ 
                  ...prev, 
                  number: formatCardNumber(e.target.value) 
                }))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => setCardData(prev => ({ 
                  ...prev, 
                  name: e.target.value.toUpperCase() 
                }))}
                placeholder="JOHN DOE"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  value={cardData.expiry}
                  onChange={(e) => setCardData(prev => ({ 
                    ...prev, 
                    expiry: formatExpiry(e.target.value) 
                  }))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  value={cardData.cvv}
                  onChange={(e) => setCardData(prev => ({ 
                    ...prev, 
                    cvv: e.target.value.replace(/\D/g, '') 
                  }))}
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )

      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID *
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="your-upi@paytm"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your UPI ID (e.g., mobile@paytm, name@gpay)
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">UPI Apps Supported</span>
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <p>â€¢ Google Pay, PhonePe, Paytm</p>
                <p>â€¢ BHIM, Amazon Pay, WhatsApp Pay</p>
                <p>â€¢ Bank UPI apps and more</p>
              </div>
            </div>
          </div>
        )

      case 'netbanking':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Bank *
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Choose your bank</option>
                {popularBanks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Secure Banking</span>
              </div>
              <p className="text-xs text-green-700">
                You'll be redirected to your bank's secure login page to complete the payment.
              </p>
            </div>
          </div>
        )

      case 'wallet':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Wallet *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {walletOptions.map(wallet => (
                  <button
                    key={wallet.id}
                    type="button"
                    onClick={() => setSelectedWallet(wallet.id)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      selectedWallet === wallet.id
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Wallet className="w-6 h-6 mx-auto mb-1" />
                    <div className="text-sm font-medium">{wallet.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'cod':
        return (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Cash on Delivery</span>
            </div>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>â€¢ Pay â‚¹{amount.toLocaleString()} when your order is delivered</p>
              <p>â€¢ Additional â‚¹40 handling charges may apply</p>
              <p>â€¢ Please keep exact change ready</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Complete Payment</h2>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            Secure Payment
          </div>
        </div>
        <div className="mt-2 text-2xl font-bold text-green-600">
          â‚¹{amount.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">Order ID: {orderId}</div>
      </div>

      <div className="p-6">
        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Choose Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                disabled={!method.enabled}
                className={`w-full p-4 border rounded-lg text-left transition-colors ${
                  selectedMethod === method.id
                    ? 'border-green-500 bg-green-50'
                    : method.enabled
                    ? 'border-gray-200 hover:border-gray-300'
                    : 'border-gray-100 bg-gray-50 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${
                    selectedMethod === method.id ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {method.icon}
                  </div>
                  <div>
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        {selectedMethod && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Payment Details</h3>
            {renderPaymentForm()}
          </div>
        )}

        {/* Billing Address */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Billing Address</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            <p className="font-medium">{billingAddress.name}</p>
            <p>{billingAddress.addressLine1}</p>
            {billingAddress.addressLine2 && <p>{billingAddress.addressLine2}</p>}
            <p>{billingAddress.city}, {billingAddress.state} - {billingAddress.pincode}</p>
            <p>{billingAddress.phone}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={processPayment}
            disabled={!selectedMethod || processing}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay â‚¹${amount.toLocaleString()}`
            )}
          </button>
        </div>

        {/* Security Info */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Shield className="w-3 h-3" />
            <span>Your payment information is encrypted and secure</span>
          </div>
          <p>Powered by Razorpay â€¢ PCI DSS Certified</p>
        </div>
      </div>
    </div>
  )
}

