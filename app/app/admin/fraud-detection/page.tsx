'use client'

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye, CreditCard, User, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { aiFraudDetection } from '@/lib/ai/fraud-detection'

export default function FraudDetectionPage() {
  const [fraudData, setFraudData] = useState<any>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFraudData()
  }, [])

  const loadFraudData = async () => {
    try {
      // Generate some demo fraud data
      const report = aiFraudDetection.generateFraudReport()
      const stats = aiFraudDetection.getFraudStats()
      
      setFraudData(report)
      setStats(stats)
      setAlerts(report.recentAlerts || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to load fraud data:', error)
      setLoading(false)
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'payment': return CreditCard
      case 'review': return Eye
      case 'account': return User
      default: return Shield
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading fraud detection data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Fraud Detection</h1>
            <p className="text-gray-600">Real-time transaction monitoring and threat analysis</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: 'Total Alerts',
            value: fraudData?.summary?.totalAlerts || 0,
            icon: AlertTriangle,
            color: 'text-red-600 bg-red-50'
          },
          {
            title: 'Active Threats',
            value: fraudData?.summary?.activeAlerts || 0,
            icon: XCircle,
            color: 'text-orange-600 bg-orange-50'
          },
          {
            title: 'Blocked IPs',
            value: fraudData?.summary?.blockedIPs || 0,
            icon: Shield,
            color: 'text-blue-600 bg-blue-50'
          },
          {
            title: 'Success Rate',
            value: '94.2%',
            icon: CheckCircle,
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
        {/* Recent Alerts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Security Alerts</h2>
            
            <div className="space-y-4">
              {alerts.length > 0 ? alerts.slice(0, 10).map((alert, index) => {
                const Icon = getAlertIcon(alert.type)
                return (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{alert.type.toUpperCase()} Alert</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                      <div className="text-xs text-gray-500">
                        Confidence: {Math.round(alert.confidence * 100)}%
                        {alert.timestamp && ` • ${new Date(alert.timestamp).toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                )
              }) : (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No security alerts detected</p>
                  <p className="text-sm">System is operating normally</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Overview */}
        <div className="space-y-6">
          {/* Threat Analysis */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Threat Analysis</h3>
            
            <div className="space-y-4">
              {stats?.alerts?.byType && Object.entries(stats.alerts.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium capitalize">{type}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{count as number}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
            
            <div className="space-y-3">
              {fraudData?.recommendations?.slice(0, 5).map((recommendation: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">{recommendation}</p>
                </div>
              )) || (
                <p className="text-sm text-gray-500">System is operating optimally</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="font-medium text-blue-900">Review Flagged Transactions</div>
                <div className="text-sm text-blue-600">Check pending reviews</div>
              </button>
              
              <button className="w-full p-3 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                <div className="font-medium text-red-900">Block Suspicious IPs</div>
                <div className="text-sm text-red-600">Manage IP blacklist</div>
              </button>
              
              <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="font-medium text-green-900">Export Security Report</div>
                <div className="text-sm text-green-600">Download detailed analysis</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detection Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {stats?.payments?.analyzed || 0}
            </div>
            <div className="text-sm text-gray-600">Transactions Analyzed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {stats?.payments?.declined || 0}
            </div>
            <div className="text-sm text-gray-600">Transactions Blocked</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {Math.round(((stats?.payments?.analyzed || 1) - (stats?.payments?.declined || 0)) / (stats?.payments?.analyzed || 1) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Approval Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}
