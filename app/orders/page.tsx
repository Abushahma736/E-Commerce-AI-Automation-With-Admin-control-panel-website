"use client"

import { useState, useEffect } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Package, 
  Truck,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  ArrowLeft,
  Eye,
  Download
} from 'lucide-react'

interface Order {
  id: string
  orderId: string
  total: number
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  createdAt: string
  items: Array<{
    id: string
    title: string
    price: number
    quantity: number
    image: string
  }>
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{id: string, name: string, email: string} | null>(null)

  useEffect(() => {
    // Check authentication
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        setUser(data)
        if (!data) {
          window.location.href = '/login?redirect=/orders'
          return
        }
        // Fetch orders for the user
        return fetch('/api/orders', { credentials: 'include' })
      })
      .then((r) => r?.ok ? r.json() : [])
      .then((data) => {
        setOrders(data || [])
        setLoading(false)
      })
      .catch(() => {
        setOrders([])
        setLoading(false)
      })
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'shipped': return 'text-blue-600 bg-blue-100'
      case 'processing': return 'text-yellow-600 bg-yellow-100'
      case 'placed': case 'confirmed': return 'text-orange-600 bg-orange-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'processing': case 'placed': case 'confirmed': return <Package className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-brand-green transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">No orders yet</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't placed any orders with us yet.</p>
              <Link href="/shop">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow border overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">Order #{order.orderId}</p>
                          <p className="text-sm text-gray-600">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {order.paymentMethod.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-sm font-medium text-brand-green">₹{item.price.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Delivery Address
                      </h4>
                      <div className="text-sm text-gray-700">
                        <p className="font-medium">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                        <p className="flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3" />
                          {order.shippingAddress.phone}
                        </p>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Invoice
                      </Button>
                      {(order.orderStatus === 'placed' || order.orderStatus === 'confirmed') && (
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
