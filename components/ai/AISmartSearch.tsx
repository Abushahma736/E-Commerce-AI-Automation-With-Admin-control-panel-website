'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Sparkles, TrendingUp, Clock, X } from 'lucide-react'
import { Product } from '@/types'

interface SearchResult {
  product: Product
  score: number
  matchType: 'name' | 'description' | 'category' | 'semantic'
  reason: string
}

interface SearchSuggestion {
  text: string
  type: 'trending' | 'recent' | 'category' | 'auto-complete'
  count?: number
}

interface AISmartSearchProps {
  products: Product[]
  onResultSelect?: (product: Product) => void
  onSearch?: (query: string, results: SearchResult[]) => void
  placeholder?: string
}

// Simulated trending searches and categories
const TRENDING_SEARCHES = [
  { text: 'turmeric extract', type: 'trending' as const, count: 1234 },
  { text: 'essential oils', type: 'trending' as const, count: 987 },
  { text: 'organic supplements', type: 'trending' as const, count: 756 },
  { text: 'natural skincare', type: 'trending' as const, count: 543 },
  { text: 'immunity booster', type: 'trending' as const, count: 432 }
]

const CATEGORY_SUGGESTIONS = [
  { text: 'Essential Oils', type: 'category' as const },
  { text: 'Dietary Supplements', type: 'category' as const },
  { text: 'Natural Skincare', type: 'category' as const },
  { text: 'Herbal Remedies', type: 'category' as const },
  { text: 'Organic Products', type: 'category' as const }
]

// Simple semantic similarity using keyword matching and synonyms
const SEMANTIC_MAP = {
  'immunity': ['immune', 'defense', 'protection', 'health', 'wellness'],
  'skin': ['skincare', 'beauty', 'face', 'dermal', 'cosmetic'],
  'energy': ['boost', 'vitality', 'stamina', 'power', 'strength'],
  'pain': ['relief', 'ache', 'sore', 'inflammation', 'comfort'],
  'sleep': ['rest', 'relaxation', 'calm', 'peaceful', 'tranquil'],
  'digestive': ['stomach', 'gut', 'digestion', 'intestinal', 'gastric'],
  'natural': ['organic', 'pure', 'herbal', 'plant-based', 'chemical-free']
}

export function AISmartSearch({ products, onResultSelect, onSearch, placeholder = "Search for natural wellness products..." }: AISmartSearchProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showResults, setShowResults] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Generate suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      // Show trending and recent searches when no query
      const trending = TRENDING_SEARCHES.slice(0, 3)
      const recent = recentSearches.slice(0, 3).map(text => ({ text, type: 'recent' as const }))
      const categories = CATEGORY_SUGGESTIONS.slice(0, 2)
      setSuggestions([...trending, ...recent, ...categories])
      return
    }

    const lowerQuery = query.toLowerCase()
    const autoComplete: SearchSuggestion[] = []

    // Auto-complete from product names
    const uniqueWords = new Set<string>()
    products.forEach(product => {
      const words = product.name.toLowerCase().split(' ')
      words.forEach(word => {
        if (word.length > 2 && word.startsWith(lowerQuery)) {
          uniqueWords.add(word)
        }
      })
    })

    Array.from(uniqueWords).slice(0, 3).forEach(word => {
      autoComplete.push({ text: word, type: 'auto-complete' })
    })

    // Trending searches that match query
    const matchingTrending = TRENDING_SEARCHES.filter(search =>
      search.text.toLowerCase().includes(lowerQuery)
    ).slice(0, 2)

    setSuggestions([...autoComplete, ...matchingTrending])
  }, [query, products, recentSearches])

  // Semantic search function
  const findSemanticMatches = (searchQuery: string, product: Product): number => {
    const queryWords = searchQuery.toLowerCase().split(' ')
    const productText = (product.name + ' ' + (product.description || '')).toLowerCase()
    
    let semanticScore = 0
    
    queryWords.forEach(word => {
      // Direct match
      if (productText.includes(word)) {
        semanticScore += 1
      }
      
      // Semantic match
      Object.entries(SEMANTIC_MAP).forEach(([concept, synonyms]) => {
        if (word === concept || synonyms.includes(word)) {
          synonyms.forEach(synonym => {
            if (productText.includes(synonym)) {
              semanticScore += 0.5
            }
          })
        }
      })
    })
    
    return semanticScore
  }

  // Advanced search function
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const searchResults: SearchResult[] = []
    const lowerQuery = searchQuery.toLowerCase()

    products.forEach(product => {
      let score = 0
      let matchType: SearchResult['matchType'] = 'name'
      let reason = ''

      // Exact name match (highest priority)
      if (product.name.toLowerCase().includes(lowerQuery)) {
        score += 10
        matchType = 'name'
        reason = 'Matches product name'
      }

      // Description match
      if (product.description?.toLowerCase().includes(lowerQuery)) {
        score += 5
        matchType = 'description'
        reason = reason ? reason + ' and description' : 'Matches product description'
      }

      // Category match
      if (product.category_id?.toLowerCase().includes(lowerQuery)) {
        score += 3
        matchType = 'category'
        reason = reason ? reason + ' and category' : 'Matches category'
      }

      // Semantic matching
      const semanticScore = findSemanticMatches(lowerQuery, product)
      if (semanticScore > 0) {
        score += semanticScore
        matchType = 'semantic'
        reason = reason ? reason + ' and related terms' : 'Matches related concepts'
      }

      // Fuzzy matching for typos (simplified)
      const queryWords = lowerQuery.split(' ')
      const productWords = product.name.toLowerCase().split(' ')
      
      queryWords.forEach(qWord => {
        productWords.forEach(pWord => {
          if (qWord.length > 2 && pWord.length > 2) {
            // Simple edit distance approximation
            const similarity = calculateSimilarity(qWord, pWord)
            if (similarity > 0.7) {
              score += 2
              reason = reason ? reason + ' (similar spelling)' : 'Similar spelling match'
            }
          }
        })
      })

      // Boost popular/low stock items
      if (product.stock_quantity < 10) {
        score += 1
        reason += ' • Limited stock'
      }

      if (score > 0) {
        searchResults.push({
          product,
          score,
          matchType,
          reason
        })
      }
    })

    // Sort by score and limit results
    const sortedResults = searchResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    setResults(sortedResults)
    setIsSearching(false)

    // Save to recent searches
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      const newRecent = [searchQuery, ...recentSearches.slice(0, 4)]
      setRecentSearches(newRecent)
      localStorage.setItem('recent-searches', JSON.stringify(newRecent))
    }

    // Call external handler
    if (onSearch) {
      onSearch(searchQuery, sortedResults)
    }
  }

  // Simple string similarity calculation
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const distance = levenshteinDistance(longer, shorter)
    return (longer.length - distance) / longer.length
  }

  // Levenshtein distance calculation
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + substitutionCost
        )
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setShowResults(true)
    setSelectedIndex(-1)
  }

  const handleSearch = () => {
    performSearch(query)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleResultSelect(results[selectedIndex].product)
      } else {
        handleSearch()
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Escape') {
      setShowResults(false)
      searchInputRef.current?.blur()
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    performSearch(suggestion.text)
    setShowResults(false)
  }

  const handleResultSelect = (product: Product) => {
    if (onResultSelect) {
      onResultSelect(product)
    }
    setShowResults(false)
    setQuery('')
  }

  const clearQuery = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
    searchInputRef.current?.focus()
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => (
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </span>
      ) : part
    ))
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowResults(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 text-lg border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent bg-white shadow-sm"
          />
          {query && (
            <button
              onClick={clearQuery}
              className="absolute right-12 p-1 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
          <div className="absolute right-4">
            <Sparkles className="h-5 w-5 text-brand-green" />
          </div>
        </div>
        
        {/* AI Indicator */}
        <div className="absolute -top-2 left-8 px-2 py-1 bg-gradient-to-r from-brand-green to-brand-green/80 text-white text-xs rounded-full">
          AI Smart Search
        </div>
      </div>

      {/* Search Results & Suggestions */}
      {showResults && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-96 overflow-hidden z-50"
        >
          {query.trim() === '' ? (
            /* Suggestions when no query */
            <div className="p-6">
              <div className="space-y-4">
                {/* Trending Searches */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-brand-green" />
                    Trending Searches
                  </h4>
                  <div className="space-y-2">
                    {suggestions.filter(s => s.type === 'trending').map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span className="text-slate-700">{suggestion.text}</span>
                        <span className="text-xs text-slate-400">{suggestion.count} searches</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      Recent Searches
                    </h4>
                    <div className="space-y-2">
                      {recentSearches.slice(0, 3).map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick({ text: search, type: 'recent' })}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Browse Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_SUGGESTIONS.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(category)}
                        className="px-3 py-1 bg-slate-100 hover:bg-brand-green hover:text-white rounded-full text-sm transition-colors"
                      >
                        {category.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Search Results */
            <div className="max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center gap-3 text-slate-600">
                    <Sparkles className="h-5 w-5 animate-pulse text-brand-green" />
                    <span>AI is searching...</span>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-sm text-slate-600 border-b border-slate-100">
                    {results.length} results found
                  </div>
                  {results.map((result, index) => (
                    <button
                      key={result.product.id}
                      onClick={() => handleResultSelect(result.product)}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 ${
                        selectedIndex === index ? 'bg-brand-green/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden">
                          {result.product.image && (
                            <img 
                              src={result.product.image} 
                              alt={result.product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-slate-900 truncate">
                            {highlightMatch(result.product.name, query)}
                          </h5>
                          <p className="text-sm text-slate-600 truncate">
                            ₹{result.product.price}
                          </p>
                          <p className="text-xs text-brand-green mt-1">
                            {result.reason}
                          </p>
                        </div>
                        <div className="text-xs text-slate-400">
                          {Math.round(result.score * 10)}% match
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500">
                  <Search className="h-8 w-8 mx-auto mb-3 text-slate-300" />
                  <p>No products found for "{query}"</p>
                  <p className="text-sm mt-1">Try different keywords or browse categories</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Backdrop to close results */}
      {showResults && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  )
}
