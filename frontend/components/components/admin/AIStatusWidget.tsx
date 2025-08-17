'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  ExternalLink,
  Zap,
  Target,
  FileText
} from 'lucide-react'
import Link from 'next/link'

interface AIServiceStatus {
  status: 'healthy' | 'unhealthy' | 'loading'
  services: {
    gemini: 'ready' | 'error' | 'loading'
    blip: 'ready' | 'lazy_loaded' | 'error' | 'loading'
    recommendations: 'ready' | 'needs_training' | 'error' | 'loading'
  }
  timestamp?: string
}

interface AIStatusWidgetProps {
  className?: string
  showDetails?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

export default function AIStatusWidget({ 
  className = '',
  showDetails = true,
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}: AIStatusWidgetProps) {
  const [status, setStatus] = useState<AIServiceStatus>({
    status: 'loading',
    services: {
      gemini: 'loading',
      blip: 'loading',
      recommendations: 'loading'
    }
  })
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const fetchStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/health')
      if (response.ok) {
        const data = await response.json()
        setStatus({
          status: 'healthy',
          services: data.services,
          timestamp: data.timestamp
        })
      } else {
        setStatus({
          status: 'unhealthy',
          services: {
            gemini: 'error',
            blip: 'error',
            recommendations: 'error'
          }
        })
      }
      setLastChecked(new Date())
    } catch (error) {
      setStatus({
        status: 'unhealthy',
        services: {
          gemini: 'error',
          blip: 'error',
          recommendations: 'error'
        }
      })
      setLastChecked(new Date())
    }
  }

  useEffect(() => {
    fetchStatus()
    
    if (autoRefresh) {
      const interval = setInterval(fetchStatus, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  const getStatusColor = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'ready': return 'bg-green-500'
      case 'lazy_loaded': return 'bg-yellow-500'
      case 'needs_training': return 'bg-orange-500'
      case 'error': return 'bg-red-500'
      case 'loading': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'ready': return 'Ready'
      case 'lazy_loaded': return 'On Demand'
      case 'needs_training': return 'Needs Training'
      case 'error': return 'Error'
      case 'loading': return 'Loading...'
      default: return 'Unknown'
    }
  }

  const getOverallStatus = () => {
    if (status.status === 'loading') return { color: 'gray', text: 'Checking...' }
    if (status.status === 'unhealthy') return { color: 'red', text: 'Offline' }
    
    const services = Object.values(status.services)
    if (services.some(s => s === 'error')) return { color: 'red', text: 'Issues Detected' }
    if (services.some(s => s === 'needs_training')) return { color: 'orange', text: 'Setup Needed' }
    if (services.every(s => s === 'ready' || s === 'lazy_loaded')) return { color: 'green', text: 'All Systems Go' }
    
    return { color: 'yellow', text: 'Partial' }
  }

  const overallStatus = getOverallStatus()

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Brain className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI System Status</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full bg-${overallStatus.color}-500`}></div>
                <span className="text-sm text-gray-600">{overallStatus.text}</span>
              </div>
            </div>
          </div>
          
          <Link 
            href="/admin/ai-guide"
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
          >
            <span>View Guide</span>
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Service Status */}
      {showDetails && (
        <div className="p-4">
          <div className="grid grid-cols-1 gap-3">
            {/* Gemini AI Service */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Content Generation</p>
                  <p className="text-xs text-gray-500">Google Gemini API</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status.services.gemini)}`}></div>
                <span className="text-xs">{getStatusText(status.services.gemini)}</span>
              </div>
            </div>

            {/* Recommendations Service */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Recommendations</p>
                  <p className="text-xs text-gray-500">ML Engine</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status.services.recommendations)}`}></div>
                <span className="text-xs">{getStatusText(status.services.recommendations)}</span>
              </div>
            </div>

            {/* BLIP Service */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Zap className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Image Analysis</p>
                  <p className="text-xs text-gray-500">BLIP Model</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status.services.blip)}`}></div>
                <span className="text-xs">{getStatusText(status.services.blip)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={fetchStatus}
                disabled={status.status === 'loading'}
                className="flex items-center justify-center space-x-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {status.status === 'loading' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <span>Refresh</span>
              </button>
              
              <Link
                href="/admin/ai-guide?tab=quick-start"
                className="flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Brain className="h-4 w-4" />
                <span>Setup</span>
              </Link>
            </div>
          </div>

          {/* Last Checked */}
          {lastChecked && (
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
