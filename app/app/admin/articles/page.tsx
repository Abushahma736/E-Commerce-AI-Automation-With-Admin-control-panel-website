"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Plus, Edit, Trash2, Eye, Calendar, Clock, Tag, Search, Filter, MoreVertical, Brain, Sparkles } from 'lucide-react'

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
  status: 'published' | 'draft' | 'archived'
  createdAt: string
  updatedAt: string
}

const categories = [
  'Natural Remedies',
  'Essential Oils', 
  'Organic Living',
  'Ayurveda',
  'Wellness Tips',
  'Skincare',
  'Nutrition'
]

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedStatus !== 'all') params.append('status', selectedStatus)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      
      const response = await fetch(`/api/articles?${params}&limit=50`)
      const data = await response.json()
      
      if (response.ok) {
        setArticles(data.articles || [])
      } else {
        setError(data.error || 'Failed to fetch articles')
      }
    } catch (err) {
      setError('Failed to fetch articles')
    } finally {
      setLoading(false)
    }
  }

  const deleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setArticles(articles.filter(a => a.id !== id))
        alert('Article deleted successfully')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete article')
      }
    } catch (err) {
      alert('Failed to delete article')
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !featured })
      })
      
      if (response.ok) {
        setArticles(articles.map(a => 
          a.id === id ? { ...a, featured: !featured } : a
        ))
        alert(`Article ${!featured ? 'featured' : 'unfeatured'} successfully`)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update article')
      }
    } catch (err) {
      alert('Failed to update article')
    }
  }

  const changeStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        setArticles(articles.map(a => 
          a.id === id ? { ...a, status: status as any } : a
        ))
        alert(`Article ${status} successfully`)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update article')
      }
    } catch (err) {
      alert('Failed to update article')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <Container>
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin h-12 w-12 border-4 border-brand-green border-t-transparent rounded-full"></div>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Articles Management</h1>
            <p className="text-gray-600 mt-1">Manage blog articles and content</p>
          </div>
          <Link href="/admin/articles/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Article
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="min-w-[150px]">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="min-w-[180px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <Button 
              onClick={fetchArticles}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Apply
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Articles', 
              value: articles.length, 
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              icon: '📄'
            },
            { 
              label: 'Published', 
              value: articles.filter(a => a.status === 'published').length, 
              color: 'text-green-600',
              bg: 'bg-green-50',
              icon: '✅'
            },
            { 
              label: 'Drafts', 
              value: articles.filter(a => a.status === 'draft').length, 
              color: 'text-yellow-600',
              bg: 'bg-yellow-50',
              icon: '📝'
            },
            { 
              label: 'Featured', 
              value: articles.filter(a => a.featured).length, 
              color: 'text-purple-600',
              bg: 'bg-purple-50',
              icon: '⭐'
            }
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-lg p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Guide Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg shadow border border-purple-100 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-purple-800">AI-Powered Article Management</h3>
                <p className="text-sm text-purple-600">Use AI to generate content, excerpts, tags, and optimize SEO for articles</p>
              </div>
            </div>
            <a 
              href="/admin/ai-guide" 
              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm flex items-center hover:bg-purple-700 transition-colors"
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              View AI Guide
            </a>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all' 
                  ? 'No articles match your current filters' 
                  : 'Get started by creating your first article'
                }
              </p>
              <Link href="/admin/articles/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Article
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-12 bg-gradient-to-br from-brand-green/20 to-brand-light/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">{article.authorImage || '📄'}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              {article.featured && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  ⭐ Featured
                                </span>
                              )}
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {article.readTime}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-green/10 text-brand-green">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.status === 'published' 
                            ? 'bg-green-100 text-green-800'
                            : article.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{article.authorImage}</span>
                          <div className="text-sm text-gray-900">{article.author}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(article.publishedAt || article.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/blog/${article.id}`} target="_blank">
                            <Button size="sm" variant="outline" className="p-2">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/articles/edit/${article.id}`}>
                            <Button size="sm" variant="outline" className="p-2">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          
                          <div className="relative">
                            <button
                              onClick={() => {
                                const dropdown = document.getElementById(`dropdown-${article.id}`)
                                if (dropdown) {
                                  dropdown.classList.toggle('hidden')
                                }
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            <div 
                              id={`dropdown-${article.id}`} 
                              className="hidden absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                            >
                              <button
                                onClick={() => toggleFeatured(article.id, article.featured)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                {article.featured ? 'Remove from Featured' : 'Mark as Featured'}
                              </button>
                              <button
                                onClick={() => changeStatus(article.id, article.status === 'published' ? 'draft' : 'published')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                {article.status === 'published' ? 'Move to Draft' : 'Publish'}
                              </button>
                              <button
                                onClick={() => changeStatus(article.id, 'archived')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Archive
                              </button>
                              <hr className="my-1" />
                              <button
                                onClick={() => deleteArticle(article.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 inline mr-2" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={fetchArticles}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}
      </Container>
    </div>
  )
}
