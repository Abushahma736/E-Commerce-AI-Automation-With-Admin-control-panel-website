"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { ArrowLeft, Save, Eye, Plus, X, Trash2 } from 'lucide-react'

const categories = [
  'Natural Remedies',
  'Essential Oils', 
  'Organic Living',
  'Ayurveda',
  'Wellness Tips',
  'Skincare',
  'Nutrition'
]

const statusOptions = [
  { value: 'draft', label: 'Draft', description: 'Save as draft to continue editing later' },
  { value: 'published', label: 'Publish', description: 'Make article visible to all users' },
  { value: 'archived', label: 'Archive', description: 'Archive article (not visible to users)' }
]

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

interface EditArticlePageProps {
  params: {
    id: string
  }
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [article, setArticle] = useState<Article | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: categories[0],
    author: '',
    authorBio: '',
    authorImage: '',
    readTime: '',
    publishedAt: '',
    tags: [] as string[],
    featured: false,
    status: 'draft'
  })
  
  const [currentTag, setCurrentTag] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchArticle()
  }, [params.id])

  const fetchArticle = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/articles/${params.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setArticle(data.article)
        setFormData({
          title: data.article.title,
          excerpt: data.article.excerpt,
          content: data.article.content,
          image: data.article.image || '',
          category: data.article.category,
          author: data.article.author,
          authorBio: data.article.authorBio || '',
          authorImage: data.article.authorImage || '',
          readTime: data.article.readTime,
          publishedAt: data.article.publishedAt ? data.article.publishedAt.split('T')[0] : '',
          tags: data.article.tags || [],
          featured: data.article.featured || false,
          status: data.article.status || 'draft'
        })
      } else {
        setError(data.error || 'Failed to fetch article')
      }
    } catch (err) {
      setError('Failed to fetch article')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.author.trim()) newErrors.author = 'Author is required'
    if (!formData.readTime.trim()) newErrors.readTime = 'Read time is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    try {
      const response = await fetch(`/api/articles/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          publishedAt: formData.status === 'published' && !formData.publishedAt 
            ? new Date().toISOString() 
            : formData.publishedAt
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        alert('Article updated successfully!')
        router.push('/admin/articles')
      } else {
        alert(data.error || 'Failed to update article')
      }
    } catch (err) {
      alert('Failed to update article')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/articles/${params.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        alert('Article deleted successfully!')
        router.push('/admin/articles')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete article')
      }
    } catch (err) {
      alert('Failed to delete article')
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

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

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <Container>
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/admin/articles">
              <Button>Back to Articles</Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  if (previewMode) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b bg-gray-50 py-4 mb-8">
          <Container>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setPreviewMode(false)}
                  variant="outline"
                  size="sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Editor
                </Button>
                <div>
                  <h1 className="text-lg font-semibold">Preview Mode</h1>
                  <p className="text-sm text-gray-600">This is how your article will look</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  formData.status === 'published' 
                    ? 'bg-green-100 text-green-800'
                    : formData.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {formData.status}
                </span>
                {formData.featured && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    ⭐ Featured
                  </span>
                )}
              </div>
            </div>
          </Container>
        </div>

        <Container className="max-w-4xl">
          <article className="prose prose-lg max-w-none">
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-green/10 text-brand-green">
                  {formData.category}
                </span>
                <span className="text-sm text-gray-500">{formData.readTime}</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {formData.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {formData.excerpt}
              </p>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{formData.authorImage}</span>
                  <div>
                    <p className="font-medium text-gray-900">{formData.author}</p>
                    <p className="text-sm text-gray-500">
                      {formData.publishedAt && new Date(formData.publishedAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {formData.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="whitespace-pre-wrap leading-relaxed">
              {formData.content}
            </div>
          </article>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/articles">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Articles
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
              <p className="text-gray-600 mt-1">Update and manage your article</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={() => setPreviewMode(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-300"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter article title..."
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent text-lg ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Excerpt *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief description of the article (will be shown in article previews)..."
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none ${
                    errors.excerpt ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.excerpt && (
                  <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
                )}
              </div>

              {/* Content */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Write your article content here... You can use Markdown formatting."
                  rows={20}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none font-mono ${
                    errors.content ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  💡 You can use Markdown syntax for formatting (e.g., **bold**, *italic*, ## headings)
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Article Info */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span>{article && new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Updated:</span>
                    <span>{article && new Date(article.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Article ID:</span>
                    <span className="font-mono text-xs">{params.id}</span>
                  </div>
                </div>
              </div>

              {/* Publish Options */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish Options</h3>
                
                <div className="space-y-4">
                  {statusOptions.map(option => (
                    <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={formData.status === option.value}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                    />
                    <div>
                      <div className="font-medium text-gray-900">Featured Article</div>
                      <div className="text-sm text-gray-500">Show in featured section</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Article Details */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                        errors.category ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Read Time *
                    </label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => handleInputChange('readTime', e.target.value)}
                      placeholder="e.g., 5 min read"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                        errors.readTime ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={formData.publishedAt}
                      onChange={(e) => handleInputChange('publishedAt', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Author Info */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Author Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                        errors.author ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author Bio
                    </label>
                    <textarea
                      value={formData.authorBio}
                      onChange={(e) => handleInputChange('authorBio', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author Emoji
                    </label>
                    <input
                      type="text"
                      value={formData.authorImage}
                      onChange={(e) => handleInputChange('authorImage', e.target.value)}
                      placeholder="👩‍⚕️"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add tag..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      size="sm"
                      disabled={!currentTag.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-green/10 text-brand-green">
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-brand-green hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Save Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 mb-3"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Updating Article...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Update Article
                    </>
                  )}
                </Button>
                
                <Link href={`/blog/${params.id}`} target="_blank">
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4" />
                    View Published Article
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  )
}
