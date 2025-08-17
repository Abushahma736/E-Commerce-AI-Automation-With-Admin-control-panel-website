'use client'

import { useEffect } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Something went wrong!
          </h1>
          
          <p className="text-slate-600 mb-8 leading-relaxed">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={reset}
              className="w-full bg-brand-green hover:bg-brand-green/90 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
            
            <Link href="/">
              <Button 
                variant="outline"
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
            </Link>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
                Error Details (Development)
              </summary>
              <pre className="mt-2 p-3 bg-slate-100 rounded text-xs text-slate-700 overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>
      </Container>
    </div>
  )
}
