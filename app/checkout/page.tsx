"use client"

import { useState, useEffect } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cart'
import { 
  ArrowLeft, 
  Package, 
  CreditCard,
  Smartphone,
  QrCode,
  Building2,
  Wallet,
  CheckCircle,
  Shield,
  Timer,
  Copy,
  ExternalLink,
  User,
  MapPin,
  Phone,
  Mail,
  Truck,
  Star,
  Gift,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CheckoutPage() {
  const { items, clear } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<{id: string, name: string, email: string} | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'cod' | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success' | 'failed'>('select')
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  })
  
  useEffect(() => {
    setMounted(true)
    
    // Check authentication
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        setUser(data)
        if (data) {
          setShippingAddress(prev => ({
            ...prev,
            fullName: data.name,
          }))
        }
        setLoadingAuth(false)
      })
      .catch(() => {
        setUser(null)
        setLoadingAuth(false)
      })
  }, [])
  
  if (!mounted || loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    window.location.href = '/login?redirect=/checkout'
    return null
  }

  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0)
  const shipping = subtotal > 1000 ? 0 : 99
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + tax
  
  const generateQRCode = (paymentMethod: string, amount: number) => {
    const upiId = '9334042952@ybl'
    const merchantName = 'ESSE Naturals'
    const orderId = `ESSE${Date.now()}`
    
    // UPI payment URL format
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Payment for Order ${orderId}`)}`
    
    // Generate QR code (simplified - in production, use a QR code library)
    const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`
    setQrCode(qrData)
    return orderId
  }
  
  const handlePayment = async (method: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod') => {
    setSelectedPayment(method)
    setPaymentStep('processing')
    
    const orderId = generateQRCode(method, total)
    
    // Create order
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total,
          paymentMethod: method,
          shippingAddress,
          userId: user.id
        })
      })
      
      const order = await response.json()
      setOrderDetails(order)
      
      if (method === 'cod') {
        // COD orders are automatically confirmed
        setTimeout(() => {
          setPaymentStep('success')
          clear()
        }, 2000)
      }
      
    } catch (error) {
      console.error('Order creation failed:', error)
      setPaymentStep('failed')
    }
  }
  
  const confirmPayment = () => {
    setPaymentStep('success')
    clear()
    // In real implementation, verify payment with backend
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before checkout.</p>
          <Link href="/shop">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }
  
  // Success page
  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            {selectedPayment === 'cod' 
              ? 'Your order has been placed successfully. You can pay when the order is delivered.'
              : 'Thank you for your payment. Your order is being processed.'
            }
          </p>
          {orderDetails && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono font-semibold text-lg">{orderDetails.orderId}</p>
            </div>
          )}
          <div className="space-y-3">
            <Link href="/orders">
              <Button className="w-full">Track Order</Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <Container>
          <div className="flex items-center gap-4 py-4">
            <Link href="/cart" className="flex items-center gap-2 text-gray-600 hover:text-brand-green transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Cart
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
            <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-600" />
              SSL Secured
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="max-w-6xl mx-auto py-8">
          {paymentStep === 'processing' ? (
            // Payment Processing Screen
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                {selectedPayment === 'upi' && qrCode ? (
                  <>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <QrCode className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Scan QR to Pay</h2>
                    <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 mb-6">
                      <Image src={qrCode} alt="QR Code" width={200} height={200} className="mx-auto" />
                      <p className="text-sm text-gray-600 mt-4">Scan with any UPI app</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
                      <p className="text-lg font-semibold text-gray-900">₹{total.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Pay to: 9334042952@ybl</p>
                    </div>
                    <div className="flex gap-3 mb-6">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                        <Copy className="w-4 h-4" />
                        Copy UPI ID
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        Open UPI App
                      </button>
                    </div>
                    <Button onClick={confirmPayment} className="w-full mb-4">
                      I have made the payment
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Timer className="w-4 h-4" />
                      <span>Payment expires in 15:00</span>
                    </div>
                  </>
                ) : selectedPayment === 'cod' ? (
                  <>
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Truck className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing COD Order</h2>
                    <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Confirming your cash on delivery order...</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h2>
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting to payment gateway...</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            // Main Checkout Form
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column - Shipping & Order Summary */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow border p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Delivery Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <textarea
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                      <input
                        type="text"
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
                      <input
                        type="text"
                        value={shippingAddress.landmark}
                        onChange={(e) => setShippingAddress({...shippingAddress, landmark: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow border p-6">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm font-medium text-brand-green">₹{item.price.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Methods */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow border p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
                  
                  {/* Price Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal ({items.length} items)</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? 'text-green-600' : ''}>
                          {shipping === 0 ? 'FREE' : `₹${shipping}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (18% GST)</span>
                        <span>₹{tax.toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span className="text-brand-green">₹{total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-3">
                    {/* UPI Payment */}
                    <button
                      onClick={() => handlePayment('upi')}
                      className="w-full p-4 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">UPI Payment</h3>
                          <p className="text-sm text-gray-600">Pay with QR code • Instant</p>
                          <p className="text-xs text-green-600 font-medium">Recommended</p>
                        </div>
                        <QrCode className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                      </div>
                    </button>

                    {/* Card Payment */}
                    <button
                      onClick={() => handlePayment('card')}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">Credit/Debit Card</h3>
                          <p className="text-sm text-gray-600">Visa, Mastercard, RuPay</p>
                        </div>
                        <Shield className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                      </div>
                    </button>

                    {/* Net Banking */}
                    <button
                      onClick={() => handlePayment('netbanking')}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">Net Banking</h3>
                          <p className="text-sm text-gray-600">All major banks</p>
                        </div>
                      </div>
                    </button>

                    {/* Wallets */}
                    <button
                      onClick={() => handlePayment('wallet')}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                          <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">Digital Wallets</h3>
                          <p className="text-sm text-gray-600">Paytm, PhonePe, GPay</p>
                        </div>
                      </div>
                    </button>

                    {/* Cash on Delivery */}
                    <button
                      onClick={() => handlePayment('cod')}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center">
                          <Truck className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
                          <p className="text-sm text-gray-600">Pay when delivered</p>
                          <p className="text-xs text-amber-600 font-medium">+₹50 handling charges</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium">100% Secure Payments</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">Your payment information is encrypted and secure</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
