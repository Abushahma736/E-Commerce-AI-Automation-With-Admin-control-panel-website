"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Calendar, Clock, Tag, Search, Filter } from 'lucide-react'

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  author: string
  authorBio: string
  authorImage: string
  readTime: string
  publishedAt: string
  tags: string[]
  featured: boolean
  status: string
}

const categories = [
  'All',
  'Natural Remedies',
  'Essential Oils',
  'Organic Living',
  'Ayurveda',
  'Wellness Tips',
  'Skincare',
  'Nutrition'
]

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchArticles = async (page = 1, category = 'All', search = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9'
      })
      
      if (category !== 'All') params.append('category', category)
      if (search) params.append('search', search)
      
      const response = await fetch(`/api/articles?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setArticles(data.articles || [])
        setTotalPages(Math.ceil(data.total / 9))
      } else {
        setError(data.error || 'Failed to fetch articles')
      }
    } catch (err) {
      setError('Failed to fetch articles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles(currentPage, selectedCategory, searchTerm)
  }, [currentPage, selectedCategory, searchTerm])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const featuredArticles = articles.filter(article => article.featured).slice(0, 3)
  const regularArticles = articles.filter(article => !article.featured)

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-green rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-light rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <Container>
          <div className="text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <span className="text-brand-light">💡</span>
              <span className="text-sm font-medium">Wellness Wisdom</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Health & Wellness <span className="text-brand-light">Blog</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-8">
              Expert advice, natural remedies, and wellness tips to help you live a healthier, 
              more natural lifestyle with our organic products.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles, tips, remedies..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        {/* Category Filter */}
        <section className="py-12">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-brand-green text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-brand-green/10 hover:text-brand-green border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Articles Section */}
        {featuredArticles.length > 0 && (
          <section className="pb-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium mb-4">
                ⭐ Featured Articles
              </div>
              <h2 className="text-3xl font-serif font-bold text-brand-navy">
                Editor's Picks
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <article key={article.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-slate-100">
                  <div className="relative h-48 overflow-hidden">
                    <Image 
                      src={article.image} 
                      alt={article.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                        ⭐ Featured
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-brand-green text-white text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-serif text-xl font-semibold text-brand-navy mb-3 group-hover:text-brand-green transition-colors leading-tight">
                      {article.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{article.authorImage}</span>
                        <div>
                          <p className="text-xs font-medium text-brand-navy">{article.author}</p>
                        </div>
                      </div>
                      
                      <Link href={`/blog/${article.id}`}>
                        <Button size="sm" className="group">
                          Read More
                          <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Regular Articles Grid */}
        <section className="pb-16">
          {regularArticles.length > 0 && (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-serif font-bold text-brand-navy">
                  Latest Articles
                </h2>
                <p className="text-gray-600 mt-2">
                  Discover fresh insights and expert tips for natural living
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularArticles.map((article) => (
                  <article key={article.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-slate-100">
                    <div className="relative h-48 overflow-hidden">
                      <Image 
                        src={article.image} 
                        alt={article.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-brand-green text-white text-xs font-medium rounded-full">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-serif text-lg font-semibold text-brand-navy mb-3 group-hover:text-brand-green transition-colors leading-tight">
                        {article.title}
                      </h3>
                      
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{article.authorImage}</span>
                          <div>
                            <p className="text-xs font-medium text-brand-navy">{article.author}</p>
                          </div>
                        </div>
                        
                        <Link href={`/blog/${article.id}`}>
                          <Button variant="outline" size="sm" className="group">
                            Read
                            <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin h-12 w-12 border-4 border-brand-green border-t-transparent rounded-full"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && articles.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Articles Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No articles found matching "${searchTerm}"`
                  : `No articles found in "${selectedCategory}" category`
                }
              </p>
              <Button 
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchTerm('')
                  setCurrentPage(1)
                }}
              >
                View All Articles
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-brand-green text-white'
                          : 'bg-white text-gray-600 hover:bg-brand-green/10 border'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
              
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </section>
      </Container>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white">
        <Container>
          <div className="text-center">
            <h3 className="text-3xl font-serif font-bold mb-4">
              Stay Updated with Our Latest Articles
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get weekly wellness tips, natural remedies, and expert advice delivered to your inbox
            </p>
            
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-light"
              />
              <Button className="bg-brand-green hover:bg-brand-green/90">
                Subscribe
              </Button>
            </div>
            
            <p className="text-sm text-white/70 mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </Container>
      </section>
    </div>
  )
}
