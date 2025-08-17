"use client"
import { useEffect, useState, useRef } from 'react'
import { Search, Sparkles, TrendingUp, Clock, Package, Bot, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/cn'

type SearchResult = {
  id: string
  title: string
  price: number
  image: string
  category: string
  description?: string
  inStock: boolean
  isPopular?: boolean
}

type CategorySuggestion = {
  name: string
  slug: string
  type: 'B2B' | 'B2C'
  icon: string
}

const POPULAR_SEARCHES = [
  "Neem face wash",
  "Organic turmeric",
  "Coconut oil",
  "Essential oils",
  "Ayurvedic products"
]

const CATEGORY_SUGGESTIONS: CategorySuggestion[] = [
  { name: "Skincare", slug: "skincare", type: "B2C", icon: "✨" },
  { name: "Hair Care", slug: "haircare", type: "B2C", icon: "💇" },
  { name: "Wellness", slug: "wellness", type: "B2C", icon: "🌿" },
  { name: "Essential Oils", slug: "essential-oils", type: "B2B", icon: "🧴" },
  { name: "Natural Extracts", slug: "extracts", type: "B2B", icon: "🌱" },
  { name: "Supplements", slug: "supplements", type: "B2C", icon: "💊" }
]

export function SmartHeaderSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Save search to recent searches
  const saveSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // Clear recent searches
  const clearRecents = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  // AI-powered search with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!query.trim()) {
        setResults([])
        setAiSuggestion('')
        return
      }

      setIsLoading(true)
      performAISearch(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  const performAISearch = async (searchQuery: string) => {
    try {
      // Simulate AI-powered search with better results
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&ai=true`, {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const data = await response.json()
        setResults(data.items || [])
        setAiSuggestion(data.aiSuggestion || '')
      } else {
        // Fallback with mock AI-enhanced results
        const mockResults = generateMockResults(searchQuery)
        setResults(mockResults)
        generateAISuggestion(searchQuery)
      }
    } catch (error) {
      // Fallback to mock results
      const mockResults = generateMockResults(searchQuery)
      setResults(mockResults)
      generateAISuggestion(searchQuery)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockResults = (searchQuery: string): SearchResult[] => {
    const mockProducts = [
      {
        id: '1',
        title: 'Neem Face Cleanser - Natural Antibacterial',
        price: 450,
        image: '/images/neem-cleanser.jpg',
        category: 'Skincare',
        description: 'Pure neem extract for acne-prone skin',
        inStock: true,
        isPopular: true
      },
      {
        id: '2',
        title: 'Organic Turmeric Face Pack',
        price: 320,
        image: '/images/turmeric-pack.jpg',
        category: 'Skincare',
        description: 'Brightening and anti-inflammatory',
        inStock: true
      },
      {
        id: '3',
        title: 'Coconut Hair Oil - Cold Pressed',
        price: 280,
        image: '/images/coconut-oil.jpg',
        category: 'Hair Care',
        description: 'Nourishing oil for healthy hair',
        inStock: true
      },
      {
        id: '4',
        title: 'Tea Tree Essential Oil',
        price: 650,
        image: '/images/tea-tree.jpg',
        category: 'Essential Oils',
        description: 'Pure therapeutic grade oil',
        inStock: false
      }
    ]

    return mockProducts.filter(product => 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6)
  }

  const generateAISuggestion = (searchQuery: string) => {
    const suggestions = [
      `Based on "${searchQuery}", you might also like our organic skincare collection`,
      `For "${searchQuery}", consider our Ayurvedic wellness products`,
      `Customers searching for "${searchQuery}" often buy our natural hair care bundle`,
      `Try our premium "${searchQuery}" products with free delivery`
    ]
    
    setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)])
  }

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  const handleSearch = (searchQuery: string) => {
    saveSearch(searchQuery)
    setQuery(searchQuery)
    setIsOpen(false)
    // Navigate to search results page
    window.location.href = `/shop?q=${encodeURIComponent(searchQuery)}`
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      handleSearch(query.trim())
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      {/* Search Input */}
      <form onSubmit={handleInputSubmit} className="relative">
        <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/20 shadow-sm hover:shadow-md transition-all duration-200">
          <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search natural products, ingredients..."
            className="w-full outline-none text-sm placeholder:text-gray-400 bg-transparent"
          />
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-brand-green" />
            <span className="text-xs text-gray-400 hidden sm:block">Ctrl+K</span>
          </div>
        </div>

        {/* Enhanced Dropdown */}
        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-slide-up z-50 max-h-[80vh] overflow-y-auto">
            
            {/* AI Suggestion Banner */}
            {aiSuggestion && !isLoading && (
              <div className="bg-gradient-to-r from-brand-green/10 to-emerald-50 p-3 border-b">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-brand-green flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <span className="font-medium text-brand-green">AI Suggestion:</span> {aiSuggestion}
                  </div>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-green border-t-transparent"></div>
                  <span className="text-sm">AI is searching...</span>
                </div>
              </div>
            ) : query.trim() ? (
              <>
                {/* Search Results */}
                {results.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-3 border-b bg-gray-50">
                      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Search Results</h4>
                    </div>
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          saveSearch(query)
                          setIsOpen(false)
                        }}
                      >
                        <div className="relative">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          {product.isPopular && (
                            <div className="absolute -top-1 -right-1">
                              <TrendingUp className="h-3 w-3 text-orange-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium text-sm text-gray-900 truncate">{product.title}</h5>
                            {!product.inStock && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Out of Stock</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{product.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-brand-green">₹{product.price}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{product.category}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <div className="p-3 border-t bg-gray-50">
                      <button
                        onClick={() => handleSearch(query)}
                        className="w-full text-center text-sm text-brand-green hover:text-brand-green/80 font-medium py-2 rounded-lg hover:bg-white transition-colors"
                      >
                        View all results for "{query}"
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-4">No products found for "{query}"</p>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400">Try searching for:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {POPULAR_SEARCHES.slice(0, 3).map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => {
                              setQuery(suggestion)
                              handleSearch(suggestion)
                            }}
                            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-3">
                {/* Quick Categories */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Browse Categories</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORY_SUGGESTIONS.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          <div className="text-xs text-gray-500">{category.type}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Popular Searches */}
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-2">
                    <TrendingUp className="h-3 w-3 text-gray-500" />
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Popular Searches</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleSearch(search)}
                        className="text-xs bg-brand-green/10 hover:bg-brand-green/20 text-brand-green px-3 py-1.5 rounded-full transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Recent</h4>
                      </div>
                      <button
                        onClick={clearRecents}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(search)}
                          className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-700 flex-1 truncate">{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
