'use client'

import { useState, useEffect } from 'react'
import { Bot, CheckCircle, AlertCircle, Activity, Zap } from 'lucide-react'
import Link from 'next/link'

interface AISystemStatus {
  system: string
  status: 'online' | 'offline' | 'warning'
  lastActivity: string
  tasksCompleted: number
}

export default function AIStatusWidget() {
  const [aiSystems, setAiSystems] = useState<AISystemStatus[]>([
    {
      system: 'Inventory AI',
      status: 'online',
      lastActivity: 'Stock alert generated',
      tasksCompleted: 47
    },
    {
      system: 'Voice Agent',
      status: 'online', 
      lastActivity: 'Order confirmation call',
      tasksCompleted: 12
    },
    {
      system: 'Fraud Detection',
      status: 'online',
      lastActivity: 'Payment analyzed',
      tasksCompleted: 156
    },
    {
      system: 'Marketing AI',
      status: 'online',
      lastActivity: 'Social post created',
      tasksCompleted: 8
    }
  ])

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show widget after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000)
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setAiSystems(prev => prev.map(system => ({
        ...system,
        tasksCompleted: system.tasksCompleted + Math.floor(Math.random() * 3),
        lastActivity: getRandomActivity(system.system)
      })))
    }, 10000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  const getRandomActivity = (system: string) => {
    const activities = {
      'Inventory AI': [
        'Stock alert generated',
        'Restock prediction made',
        'Low stock warning sent',
        'Inventory analysis completed'
      ],
      'Voice Agent': [
        'Order confirmation call',
        'Customer support call',
        'Delivery update call',
        'Feedback call completed'
      ],
      'Fraud Detection': [
        'Payment analyzed',
        'Order risk assessed',
        'Review authenticity checked',
        'User behavior analyzed'
      ],
      'Marketing AI': [
        'Social post created',
        'Email campaign sent',
        'Price optimization done',
        'Campaign performance analyzed'
      ]
    }

    const systemActivities = activities[system as keyof typeof activities] || ['Task completed']
    return systemActivities[Math.floor(Math.random() * systemActivities.length)]
  }

  const totalTasks = aiSystems.reduce((sum, system) => sum + system.tasksCompleted, 0)
  const onlineSystems = aiSystems.filter(s => s.status === 'online').length

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-6 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm z-50 animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-brand-green to-emerald-600 p-2 rounded-lg">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Systems Status</h3>
          <p className="text-xs text-gray-500">Real-time automation monitoring</p>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-600">{onlineSystems}/4</div>
          <div className="text-xs text-green-700">Systems Online</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-600">{totalTasks}</div>
          <div className="text-xs text-blue-700">Tasks Completed</div>
        </div>
      </div>

      {/* System Status */}
      <div className="space-y-2 mb-4">
        {aiSystems.map((system, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                system.status === 'online' ? 'bg-green-500' : 
                system.status === 'warning' ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}></div>
              <div>
                <div className="text-sm font-medium text-gray-900">{system.system}</div>
                <div className="text-xs text-gray-500">{system.lastActivity}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-700">{system.tasksCompleted}</div>
              <div className="text-xs text-gray-500">tasks</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Link 
          href="/ai-dashboard" 
          className="flex-1 bg-brand-green text-white px-3 py-2 rounded-lg text-sm font-medium text-center hover:bg-brand-green/90 transition-colors"
        >
          Full Dashboard
        </Link>
        <button 
          onClick={() => setIsVisible(false)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Hide
        </button>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-1 mt-3 justify-center">
        <Activity className="h-3 w-3 text-green-500 animate-pulse" />
        <span className="text-xs text-green-600 font-medium">LIVE</span>
      </div>
    </div>
  )
}
