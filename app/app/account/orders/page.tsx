"use client"
import { useEffect, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Package, Truck, CheckCircle, Clock, AlertCircle, Eye, Download } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  total: number
  shippingAddress: string
  trackingNumber?: string
  estimatedDelivery?: string
}

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ESS001',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'shipped',
      items: [
        {
          id: '1',
          name: 'Organic Turmeric Extract',
          price: 599,
          quantity: 2,
          image: '/images/hero.jpg'
        },
        {
          id: '2',
          name: 'Essential Oil Set',
          price: 1299,
          quantity: 1,
          image: '/images/hero.jpg'
        }
      ],
      total: 2497,
      shippingAddress: '123 Green Street, Mumbai, Maharashtra - 400001',
      trackingNumber: 'TRK123456789',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      orderNumber: 'ESS002',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'delivered',
      items: [
        {
          id: '3',
          name: 'Clove Oil Premium',
          price: 349,
          quantity: 3,
          image: '/images/hero.jpg'
        }
      ],
      total: 1047,
      shippingAddress: '123 Green Street, Mumbai, Maharashtra - 400001',
      trackingNumber: 'TRK987654321'
    },
    {
      id: '3',
      orderNumber: 'ESS003',
      date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      items: [
        {
          id: '4',
          name: 'DiaFit Wellness Pack',
          price: 899,
          quantity: 1,
          image: '/images/hero.jpg'
        }
      ],
      total: 899,
      shippingAddress: '123 Green Street, Mumbai, Maharashtra - 400001'
    }
  ])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      if (raw) {
        setUser(JSON.parse(raw))
        // Load orders from localStorage
        const ordersRaw = localStorage.getItem('orders')
        if (ordersRaw) {
          setOrders(JSON.parse(ordersRaw))
        }
      }
    } catch {}
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'processing':
        return <Package className="w-5 h-5 text-blue-600" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-600" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200'
      case 'processing':
        return 'text-blue-700 bg-blue-50 border-blue-200'
      case 'shipped':
        return 'text-purple-700 bg-purple-50 border-purple-200'
      case 'delivered':
        return 'text-green-700 bg-green-50 border-green-200'
      case 'cancelled':
        return 'text-red-700 bg-red-50 border-red-200'
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  const downloadInvoice = (orderId: string) => {
    setMessage('Invoice download started!')
    setTimeout(() => setMessage(null), 3000)
  }

  const cancelOrder = (orderId: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: 'cancelled' as const } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    setMessage('Order cancelled successfully!')
    setTimeout(() => setMessage(null), 3000)
  }

  const reorder = (order: Order) => {
    // Add items to cart
    setMessage('Items added to cart!')
    setTimeout(() => setMessage(null), 3000)
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link href="/account" className="text-brand-green hover:text-brand-navy">
              ← Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow border">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-brand-green" />
                <div>
                  <h1 className="text-3xl font-bold text-brand-navy">My Orders</h1>
                  <p className="text-gray-600">{orders.length} order(s) placed</p>
                </div>
              </div>
              
              <Link href="/shop">
                <Button className="bg-brand-green hover:bg-brand-green/90">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Message */}
            {message && (
              <div className="p-4 border-b bg-green-50 text-green-700 border-green-200">
                {message}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                  <h2 className="text-2xl font-semibold text-gray-600 mb-4">No orders yet</h2>
                  <p className="text-gray-500 mb-6">
                    When you place your first order, it will appear here
                  </p>
                  <Link href="/shop">
                    <Button className="bg-brand-green hover:bg-brand-green/90">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Orders List */}
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        {/* Order Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <div>
                                <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                                <p className="text-sm text-gray-600">
                                  Placed on {new Date(order.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                            </Button>
                            <Button
                              onClick={() => downloadInvoice(order.id)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Invoice
                            </Button>
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="grid gap-4 md:grid-cols-3 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Total Amount</p>
                            <p className="text-lg font-semibold text-brand-green">₹{order.total.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Items</p>
                            <p className="text-gray-600">{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</p>
                          </div>
                          {order.trackingNumber && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">Tracking Number</p>
                              <p className="text-gray-600 font-mono">{order.trackingNumber}</p>
                            </div>
                          )}
                        </div>

                        {order.estimatedDelivery && order.status === 'shipped' && (
                          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <p className="text-sm text-purple-700">
                              <strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {/* Order Details (Expandable) */}
                        {selectedOrder?.id === order.id && (
                          <div className="mt-6 pt-6 border-t">
                            <h4 className="font-semibold mb-4">Order Items</h4>
                            <div className="space-y-4">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                  <div className="relative w-16 h-16 flex-shrink-0">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      className="object-cover rounded-lg"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-medium">{item.name}</h5>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">₹{item.price} each</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-6 pt-4 border-t">
                              <h4 className="font-semibold mb-2">Shipping Address</h4>
                              <p className="text-gray-600">{order.shippingAddress}</p>
                            </div>

                            {/* Order Actions */}
                            <div className="mt-6 flex flex-wrap gap-3">
                              {order.status === 'pending' && (
                                <Button
                                  onClick={() => cancelOrder(order.id)}
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  Cancel Order
                                </Button>
                              )}
                              {order.status === 'delivered' && (
                                <>
                                  <Button
                                    onClick={() => reorder(order)}
                                    className="bg-brand-green hover:bg-brand-green/90"
                                  >
                                    Reorder
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                                  >
                                    Write Review
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                  >
                                    Request Return
                                  </Button>
                                </>
                              )}
                              {order.status === 'shipped' && (
                                <Button
                                  variant="outline"
                                  className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                                >
                                  Track Package
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Order Statistics */}
                  <div className="mt-8 pt-8 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {[
                        { 
                          label: 'Total Orders', 
                          value: orders.length.toString(),
                          color: 'text-blue-600 bg-blue-50'
                        },
                        { 
                          label: 'Completed Orders', 
                          value: orders.filter(o => o.status === 'delivered').length.toString(),
                          color: 'text-green-600 bg-green-50'
                        },
                        { 
                          label: 'Total Spent', 
                          value: `₹${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}`,
                          color: 'text-purple-600 bg-purple-50'
                        },
                        { 
                          label: 'Active Orders', 
                          value: orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length.toString(),
                          color: 'text-orange-600 bg-orange-50'
                        }
                      ].map((stat, index) => (
                        <div key={index} className={`text-center p-4 rounded-lg ${stat.color}`}>
                          <div className="text-2xl font-bold mb-1">{stat.value}</div>
                          <div className="text-sm font-medium">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
