"use client"
import { useState } from 'react'
import { Search, Bot, Sparkles } from 'lucide-react'
import { SmartHeaderSearch } from './SmartHeaderSearch'

export function QuickAISearch() {
  const [isExpanded, setIsExpanded] = useState(false)

  if (isExpanded) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-16">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-scale-in">
          <div className="p-4 border-b bg-gradient-to-r from-brand-green to-emerald-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
                  <Bot className="h-4 w-4" />
                  <span className="text-sm font-medium">AI Search</span>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-all"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-6">
            <SmartHeaderSearch />
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Sparkles className="h-4 w-4 text-brand-green" />
                <span>AI-powered natural product search</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsExpanded(true)}
      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-brand-green/10 to-emerald-100/50 rounded-xl hover:from-brand-green/20 hover:to-emerald-100 transition-all duration-200 border border-brand-green/20"
    >
      <Search className="h-4 w-4 text-brand-green" />
      <Bot className="h-3 w-3 text-brand-green animate-pulse" />
    </button>
  )
}
