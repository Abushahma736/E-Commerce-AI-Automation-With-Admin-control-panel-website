"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight,
  Tag,
  Gift,
  Truck,
  Shield,
  Heart,
  Share2
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

export default function CartPage() {
  const { items, updateQty, removeItem, clear } = useCartStore()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [user, setUser] = useState<{id: string, name: string, email: string} | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    // Check authentication status via API
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { setUser(data); setLoadingAuth(false) })
      .catch(() => { setUser(null); setLoadingAuth(false) })
  }, [])

  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0)
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0
  const shipping = subtotal > 1000 ? 0 : 99
  const tax = Math.round((subtotal - discount) * 0.18)
  const total = subtotal - discount + shipping + tax

  const handleQuantityChange = (id: string, newQty: number) => {
    if (newQty < 1) return
    updateQty(id, newQty)
  }

  const applyCoupon = () => {
    // Mock coupon validation
    const validCoupons = {
      'SAVE10': 10,
      'WELCOME20': 20,
      'HEALTH15': 15
    }
    
    if (validCoupons[couponCode as keyof typeof validCoupons]) {
      setAppliedCoupon({
        code: couponCode,
        discount: validCoupons[couponCode as keyof typeof validCoupons]
      })
      setCouponCode('')
    } else {
      alert('Invalid coupon code')
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const handleCheckout = () => {
    if (!user) {
      // Redirect to login with return URL
      window.location.href = '/login?redirect=/checkout'
      return
    }
    
    setIsCheckingOut(true)
    // Proceed to checkout
    window.location.href = '/checkout'
  }

  const shareCart = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Cart - HealthSupplements',
        text: `Check out my cart with ${items.length} items!`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Cart link copied to clipboard!')
    }
  }

  return (
    <div className="py-8 bg-gray-50">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-serif">Shopping Cart</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShoppingBag className="w-4 h-4" />
              {items.length} item{items.length !== 1 ? 's' : ''}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow border p-8 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link href="/shop">
                <Button className="inline-flex items-center gap-2">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow border">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Cart Items</h2>
                      <button
                        onClick={() => confirm('Clear all items?') && clear()}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <div key={item.id} className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image 
                              src={item.image} 
                              alt={item.title} 
                              fill 
                              className="object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                            <div className="mt-1 flex items-center gap-4">
                              <span className="text-lg font-semibold text-green-600">
                                ₹{item.price.toLocaleString()}
                              </span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center border rounded px-2 py-1">
                                  {item.quantity}
                                </span>
                                <button 
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="p-1 rounded-full hover:bg-gray-100"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="mt-3 flex items-center gap-4 text-sm">
                              <button className="flex items-center gap-1 text-gray-600 hover:text-red-600">
                                <Heart className="w-4 h-4" />
                                Save for later
                              </button>
                              <button 
                                onClick={() => removeItem(item.id)}
                                className="flex items-center gap-1 text-gray-600 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="bg-white rounded-lg shadow border p-6 mt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Apply Coupon
                  </h3>
                  
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                          <p className="text-sm text-green-600">{appliedCoupon.discount}% discount applied</p>
                        </div>
                      </div>
                      <button 
                        onClick={removeCoupon}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <Button 
                        onClick={applyCoupon} 
                        variant="outline"
                        disabled={!couponCode.trim()}
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Available coupons:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['SAVE10', 'WELCOME20', 'HEALTH15'].map(code => (
                        <button
                          key={code}
                          onClick={() => setCouponCode(code)}
                          className="px-3 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200"
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow border p-6 sticky top-6">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal ({items.length} items)</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        Shipping
                      </span>
                      <span className={shipping === 0 ? 'text-green-600' : ''}>
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Tax (18% GST)</span>
                      <span>₹{tax.toLocaleString()}</span>
                    </div>
                    
                    {subtotal <= 1000 && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-700">
                          Add ₹{(1000 - subtotal).toLocaleString()} more for FREE shipping!
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full mt-6 flex items-center justify-center gap-2"
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  
                  {loadingAuth ? (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Checking login status...
                    </p>
                  ) : !user ? (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Please <Link href="/login?redirect=/checkout" className="text-green-600 hover:underline">login</Link> to continue
                    </p>
                  ) : null}
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4" />
                      <span>Secure checkout with SSL encryption</span>
                    </div>
                    
                    <button 
                      onClick={shareCart}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Cart
                    </button>
                    
                    <Link href="/shop" className="block">
                      <button className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                        Continue Shopping
                      </button>
                    </Link>
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


