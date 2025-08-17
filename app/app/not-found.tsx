import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <Search className="h-10 w-10 text-slate-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Page Not Found</h2>
          
          <p className="text-slate-600 mb-8 leading-relaxed">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-brand-green hover:bg-brand-green/90 text-white">
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
            </Link>
            
            <button 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
          </div>
          
          <div className="mt-8 text-sm text-slate-500">
            <p>Looking for something specific?</p>
            <div className="mt-2 space-x-4">
              <Link href="/shop" className="text-brand-green hover:text-brand-green/700">
                Browse Products
              </Link>
              <Link href="/contact" className="text-brand-green hover:text-brand-green/700">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}


