'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, Brain, Eye, Mic, MessageSquare, ShoppingCart, Users, TrendingUp,
  Settings, Play, Pause, RefreshCw, AlertTriangle, CheckCircle, Activity,
  Zap, Target, Sparkles, Monitor, Cpu, Database, Network, Shield
} from 'lucide-react'
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
)

interface AIService {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  status: 'active' | 'idle' | 'error' | 'maintenance'
  performance: number
  requests: number
  lastActive: Date
  autoMode: boolean
}

interface AIMetrics {
  totalRequests: number
  successRate: number
  avgResponseTime: number
  activeServices: number
  errorRate: number
  predictions: number
  conversions: number
  revenue: number
}

interface RealTimeData {
  timestamp: Date
  cpuUsage: number
  memoryUsage: number
  requests: number
  errors: number
}

export default function AIControlCenter() {
  const [services, setServices] = useState<AIService[]>([
    {
      id: 'chatbot',
      name: 'AI Chatbot',
      icon: MessageSquare,
      status: 'active',
      performance: 94,
      requests: 1247,
      lastActive: new Date(),
      autoMode: true
    },
    {
      id: 'recommendations',
      name: 'Smart Recommendations',
      icon: Target,
      status: 'active',
      performance: 87,
      requests: 3421,
      lastActive: new Date(),
      autoMode: true
    },
    {
      id: 'vision',
      name: 'Visual AI',
      icon: Eye,
      status: 'active',
      performance: 91,
      requests: 567,
      lastActive: new Date(),
      autoMode: true
    },
    {
      id: 'voice',
      name: 'Voice Assistant',
      icon: Mic,
      status: 'idle',
      performance: 89,
      requests: 234,
      lastActive: new Date(Date.now() - 1800000),
      autoMode: false
    },
    {
      id: 'fraud',
      name: 'Fraud Detection',
      icon: Shield,
      status: 'active',
      performance: 98,
      requests: 892,
      lastActive: new Date(),
      autoMode: true
    },
    {
      id: 'inventory',
      name: 'Inventory AI',
      icon: Database,
      status: 'active',
      performance: 92,
      requests: 445,
      lastActive: new Date(),
      autoMode: true
    }
  ])

  const [metrics, setMetrics] = useState<AIMetrics>({
    totalRequests: 6806,
    successRate: 96.2,
    avgResponseTime: 245,
    activeServices: 5,
    errorRate: 0.8,
    predictions: 12847,
    conversions: 1.8,
    revenue: 247500
  })

  const [realTimeData, setRealTimeData] = useState<RealTimeData[]>([])
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate real-time data updates
  useEffect(() => {
    if (isMonitoring) {
      intervalRef.current = setInterval(() => {
        const newData: RealTimeData = {
          timestamp: new Date(),
          cpuUsage: Math.random() * 100,
          memoryUsage: 40 + Math.random() * 40,
          requests: Math.floor(Math.random() * 50),
          errors: Math.random() > 0.9 ? Math.floor(Math.random() * 3) : 0
        }
        
        setRealTimeData(prev => [...prev.slice(-19), newData])
        
        // Update metrics
        setMetrics(prev => ({
          ...prev,
          totalRequests: prev.totalRequests + newData.requests,
          avgResponseTime: 200 + Math.random() * 100,
          errorRate: Math.max(0.1, prev.errorRate + (Math.random() - 0.5) * 0.2)
        }))
      }, 2000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isMonitoring])

  const toggleService = (serviceId: string) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { 
              ...service, 
              status: service.status === 'active' ? 'idle' : 'active',
              autoMode: !service.autoMode
            }
          : service
      )
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500'
      case 'idle': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      case 'maintenance': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  const performanceChartData = {
    labels: realTimeData.map(d => d.timestamp.toLocaleTimeString().slice(0, 5)),
    datasets: [
      {
        label: 'CPU Usage',
        data: realTimeData.map(d => d.cpuUsage),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      },
      {
        label: 'Memory Usage',
        data: realTimeData.map(d => d.memoryUsage),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  }

  const serviceDistributionData = {
    labels: services.map(s => s.name),
    datasets: [{
      data: services.map(s => s.requests),
      backgroundColor: [
        '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'
      ],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Control Center</h1>
              <p className="text-slate-400">Real-time AI automation monitoring & control</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">All Systems Operational</span>
            </div>
            
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isMonitoring 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              }`}
            >
              {isMonitoring ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Monitoring
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume Monitoring
                </>
              )}
            </button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Requests', value: metrics.totalRequests.toLocaleString(), icon: Activity, color: 'blue' },
            { label: 'Success Rate', value: `${metrics.successRate}%`, icon: CheckCircle, color: 'green' },
            { label: 'Avg Response', value: `${metrics.avgResponseTime}ms`, icon: Cpu, color: 'purple' },
            { label: 'Active Services', value: metrics.activeServices.toString(), icon: Network, color: 'orange' }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`h-8 w-8 text-${metric.color}-400`} />
                <span className="text-2xl font-bold text-white">{metric.value}</span>
              </div>
              <p className="text-slate-400 text-sm">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Services */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">AI Services Status</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-slate-700/50 border rounded-xl p-4 transition-all duration-300 hover:bg-slate-700/70 cursor-pointer ${
                      selectedService === service.id ? 'border-blue-500' : 'border-slate-600'
                    }`}
                    onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <service.icon className={`h-5 w-5 ${getStatusColor(service.status)}`} />
                        <span className="text-white font-medium">{service.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          service.status === 'active' ? 'bg-green-400' : 
                          service.status === 'idle' ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleService(service.id)
                          }}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            service.autoMode 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-slate-600 text-slate-300'
                          }`}
                        >
                          {service.autoMode ? 'AUTO' : 'MANUAL'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{service.requests.toLocaleString()} requests</span>
                      <span className="text-green-400">{service.performance}% efficiency</span>
                    </div>
                    
                    <div className="mt-2 bg-slate-600 rounded-full h-1">
                      <div 
                        className="bg-green-400 rounded-full h-1 transition-all duration-500"
                        style={{ width: `${service.performance}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Performance Charts */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Real-time Performance</h2>
              <div className="h-64">
                <Line 
                  data={performanceChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: { color: '#ffffff' }
                      }
                    },
                    scales: {
                      x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#334155' }
                      },
                      y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#334155' }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Service Distribution */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Request Distribution</h2>
              <div className="h-48">
                <Doughnut 
                  data={serviceDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { 
                          color: '#ffffff',
                          font: { size: 10 }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">AI Activities</h2>
              
              <div className="space-y-3">
                {[
                  { icon: MessageSquare, text: 'Chatbot handled 12 customer queries', time: '2m ago', color: 'blue' },
                  { icon: Target, text: 'Recommended 8 products to customers', time: '5m ago', color: 'green' },
                  { icon: Shield, text: 'Detected and blocked suspicious activity', time: '8m ago', color: 'red' },
                  { icon: Eye, text: 'Visual AI analyzed 23 product images', time: '12m ago', color: 'purple' },
                  { icon: Database, text: 'Inventory AI updated stock levels', time: '15m ago', color: 'orange' }
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors"
                  >
                    <activity.icon className={`h-4 w-4 text-${activity.color}-400 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{activity.text}</p>
                      <p className="text-xs text-slate-400">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              
              <div className="space-y-2">
                {[
                  { icon: RefreshCw, text: 'Refresh All Services', action: () => {} },
                  { icon: Settings, text: 'Configure AI Models', action: () => {} },
                  { icon: Monitor, text: 'View Detailed Logs', action: () => {} },
                  { icon: Sparkles, text: 'Run Optimization', action: () => {} }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-slate-700/50 transition-colors text-slate-300 hover:text-white"
                  >
                    <action.icon className="h-4 w-4" />
                    <span className="text-sm">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
