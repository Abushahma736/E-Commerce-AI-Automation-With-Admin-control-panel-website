'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Package, TrendingUp, AlertCircle, CheckCircle, Clock, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { aiInventoryManager } from '@/lib/ai/inventory-manager'
import { getAllProducts } from '@/lib/fsdb'

export default function InventoryAIPage() {
  const [inventoryData, setInventoryData] = useState<any>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInventoryData()
  }, [])

  const loadInventoryData = async () => {
    try {
      // Load products and generate inventory data
      const products = await getAllProducts()
      
      // Generate demo sales data for AI analysis
      aiInventoryManager.generateDemoSalesData(products)
      
      // Generate alerts and predictions
      const alerts = await aiInventoryManager.analyzeAllProducts(products.slice(0, 20))
      const predictions = await aiInventoryManager.generateRestockingPredictions(products.slice(0, 15))
      const dashboard = aiInventoryManager.generateInventoryDashboard()
      const stats = aiInventoryManager.getInventoryStats()
      
      setInventoryData(dashboard)
      setAlerts(alerts)
      setPredictions(predictions)
      setStats(stats)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load inventory data:', error)
      setLoading(false)
    }
  }

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getStockIcon = (level: string) => {
    switch (level) {
      case 'critical': return AlertCircle
      case 'high': return Clock
      case 'medium': return TrendingUp
      default: return CheckCircle
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading inventory AI data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory AI Management</h1>
            <p className="text-gray-600">Predictive stock management and automated reordering</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: 'Total Alerts',
            value: inventoryData?.summary?.totalAlerts || 0,
            icon: AlertCircle,
            color: 'text-red-600 bg-red-50'
          },
          {
            title: 'Low Stock Items',
            value: stats?.lowStockItems || 0,
            icon: Clock,
            color: 'text-yellow-600 bg-yellow-50'
          },
          {
            title: 'Restock Needed',
            value: inventoryData?.summary?.upcomingRestocks || 0,
            icon: Truck,
            color: 'text-blue-600 bg-blue-50'
          },
          {
            title: 'Products Tracked',
            value: stats?.totalProducts || 0,
            icon: Package,
            color: 'text-green-600 bg-green-50'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stock Alerts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Inventory Alerts</h2>
            
            <div className="space-y-4">
              {alerts.length > 0 ? alerts.slice(0, 10).map((alert, index) => {
                const Icon = getStockIcon(alert.alertLevel)
                return (
                  <div key={index} className={`p-4 rounded-lg border ${getAlertColor(alert.alertLevel)}`}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{alert.productName}</h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium uppercase">
                            {alert.alertLevel}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3 text-sm">
                          <div>
                            <span className="text-gray-500">Current Stock:</span>
                            <span className="font-medium ml-2">{alert.currentStock}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Days Left:</span>
                            <span className="font-medium ml-2">{alert.daysUntilStockout}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Reorder Qty:</span>
                            <span className="font-medium ml-2">{alert.recommendedReorderQuantity}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm mb-2">{alert.reasoning}</p>
                        
                        {alert.suggestedActions && alert.suggestedActions.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {alert.suggestedActions.map((action: string, actionIndex: number) => (
                              <span key={actionIndex} className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs">
                                {action}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              }) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>All inventory levels are healthy</p>
                  <p className="text-sm">No immediate action required</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Predictions & Actions */}
        <div className="space-y-6">
          {/* Restock Predictions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Restock Predictions</h3>
            
            <div className="space-y-4">
              {predictions.slice(0, 5).map((prediction, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm truncate">Product {prediction.productId}</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(prediction.confidence * 100)}% confident
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    Reorder by: {new Date(prediction.recommendedReorderDate).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-600">
                    Quantity: {prediction.recommendedQuantity} units
                  </div>
                </div>
              ))}
              
              {predictions.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Building prediction models...</p>
                </div>
              )}
            </div>
          </div>

          {/* Alert Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Summary</h3>
            
            <div className="space-y-3">
              {inventoryData?.summary?.alertsByLevel && Object.entries(inventoryData.summary.alertsByLevel).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      level === 'critical' ? 'bg-red-500' :
                      level === 'high' ? 'bg-orange-500' :
                      level === 'medium' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                    <span className="text-sm font-medium capitalize">{level}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{count as number}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="font-medium text-blue-900">Generate Purchase Orders</div>
                <div className="text-sm text-blue-600">Auto-create orders for low stock</div>
              </button>
              
              <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="font-medium text-green-900">Update Stock Levels</div>
                <div className="text-sm text-green-600">Bulk update inventory counts</div>
              </button>
              
              <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <div className="font-medium text-purple-900">Export Inventory Report</div>
                <div className="text-sm text-purple-600">Download detailed analysis</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent AI Activity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {stats?.recentActivity?.newAlertsToday || 0}
            </div>
            <div className="text-sm text-gray-600">New Alerts Today</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {predictions.length}
            </div>
            <div className="text-sm text-gray-600">Active Predictions</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {stats?.recentActivity?.totalSalesTracked || 0}
            </div>
            <div className="text-sm text-gray-600">Sales Data Points</div>
          </div>
        </div>
      </div>
    </div>
  )
}
