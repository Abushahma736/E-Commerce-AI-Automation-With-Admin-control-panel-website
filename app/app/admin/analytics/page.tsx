'use client'

import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Eye } from 'lucide-react'

interface AnalyticsData {
  revenue: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  orders: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
    avgOrderValue: number
  }
  customers: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
    retention: number
  }
  products: {
    total: number
    outOfStock: number
    topSelling: Array<{
      name: string
      sold: number
      revenue: number
    }>
  }
  traffic: {
    visitors: number
    pageViews: number
    conversionRate: number
    bounceRate: number
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData: AnalyticsData = {
      revenue: {
        total: 125450.75,
        thisMonth: 28950.50,
        lastMonth: 24680.25,
        growth: 17.3
      },
      orders: {
        total: 1234,
        thisMonth: 287,
        lastMonth: 245,
        growth: 17.1,
        avgOrderValue: 101.75
      },
      customers: {
        total: 789,
        thisMonth: 156,
        lastMonth: 134,
        growth: 16.4,
        retention: 78.5
      },
      products: {
        total: 456,
        outOfStock: 23,
        topSelling: [
          { name: 'Vitamin D3', sold: 234, revenue: 5850.00 },
          { name: 'Omega-3', sold: 189, revenue: 6804.00 },
          { name: 'Protein Powder', sold: 145, revenue: 6670.00 },
          { name: 'Multivitamin', sold: 132, revenue: 3960.00 },
          { name: 'Calcium', sold: 98, revenue: 2450.00 }
        ]
      },
      traffic: {
        visitors: 12567,
        pageViews: 45890,
        conversionRate: 2.85,
        bounceRate: 42.3
      }
    }

    setTimeout(() => {
      setData(mockData)
      setLoading(false)
    }, 1000)
  }, [timeRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Track your business performance and metrics</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.revenue.total)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4 flex items-center">
            {data.revenue.growth > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${data.revenue.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(data.revenue.growth)}
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            This month: {formatCurrency(data.revenue.thisMonth)}
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{data.orders.total.toLocaleString()}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-4 flex items-center">
            {data.orders.growth > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${data.orders.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(data.orders.growth)}
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            AOV: {formatCurrency(data.orders.avgOrderValue)}
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{data.customers.total.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
          <div className="mt-4 flex items-center">
            {data.customers.growth > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${data.customers.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(data.customers.growth)}
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Retention: {data.customers.retention}%
          </div>
        </div>

        {/* Products */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{data.products.total.toLocaleString()}</p>
            </div>
            <Package className="h-8 w-8 text-orange-600" />
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-red-600">{data.products.outOfStock} out of stock</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {((data.products.total - data.products.outOfStock) / data.products.total * 100).toFixed(1)}% in stock
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Trend Chart Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Sales chart would go here</p>
              <p className="text-sm text-gray-400">Integration with charting library needed</p>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Traffic</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Visitors</span>
              <span className="font-semibold">{data.traffic.visitors.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Page Views</span>
              <span className="font-semibold">{data.traffic.pageViews.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="font-semibold text-green-600">{data.traffic.conversionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bounce Rate</span>
              <span className="font-semibold text-red-600">{data.traffic.bounceRate}%</span>
            </div>
          </div>
          
          {/* Visual representation */}
          <div className="mt-6 h-32 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Eye className="h-8 w-8 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Traffic visualization</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {data.products.topSelling.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sold} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-6">
            {/* Revenue Growth */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Revenue Growth</span>
                <span className="text-sm font-medium">{formatPercent(data.revenue.growth)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(Math.max(data.revenue.growth, 0), 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Order Growth */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Order Growth</span>
                <span className="text-sm font-medium">{formatPercent(data.orders.growth)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(Math.max(data.orders.growth, 0), 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Customer Growth */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Customer Growth</span>
                <span className="text-sm font-medium">{formatPercent(data.customers.growth)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(Math.max(data.customers.growth, 0), 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Customer Retention */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Customer Retention</span>
                <span className="text-sm font-medium">{data.customers.retention}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full" 
                  style={{ width: `${data.customers.retention}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Comparison</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Revenue</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>This Month</span>
                <span className="font-medium">{formatCurrency(data.revenue.thisMonth)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Last Month</span>
                <span>{formatCurrency(data.revenue.lastMonth)}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Orders</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>This Month</span>
                <span className="font-medium">{data.orders.thisMonth}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Last Month</span>
                <span>{data.orders.lastMonth}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">New Customers</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>This Month</span>
                <span className="font-medium">{data.customers.thisMonth}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Last Month</span>
                <span>{data.customers.lastMonth}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
