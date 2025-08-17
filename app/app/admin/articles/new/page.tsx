"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { ArrowLeft, Save, Eye, Upload, Plus, X, Brain, Sparkles } from 'lucide-react'
import AIArticleActions from '@/components/admin/AIArticleActions'

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

export default function NewArticlePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: categories[0],
    author: 'Dr. Priya Sharma',
    authorBio: 'Ayurvedic practitioner and wellness expert with over 10 years of experience in natural healing.',
    authorImage: '👩‍⚕️',
    readTime: '5 min read',
    publishedAt: new Date().toISOString().split('T')[0],
    tags: [] as string[],
    featured: false,
    status: 'draft'
  })
  
  const [currentTag, setCurrentTag] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

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

    setLoading(true)
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          publishedAt: formData.status === 'published' ? new Date().toISOString() : formData.publishedAt
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        alert('Article created successfully!')
        router.push('/admin/articles')
      } else {
        alert(data.error || 'Failed to create article')
      }
    } catch (err) {
      alert('Failed to create article')
    } finally {
      setLoading(false)
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
                {formData.title || 'Article Title'}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {formData.excerpt || 'Article excerpt will appear here...'}
              </p>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{formData.authorImage}</span>
                  <div>
                    <p className="font-medium text-gray-900">{formData.author}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(formData.publishedAt).toLocaleDateString('en-IN', {
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
              {formData.content || 'Article content will appear here...'}
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
              <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
              <p className="text-gray-600 mt-1">Write and publish a new blog article</p>
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

              {/* AI Article Actions */}
              <div>
                <AIArticleActions 
                  articleData={{
                    title: formData.title, 
                    content: formData.content,
                    excerpt: formData.excerpt,
                    category: formData.category,
                    tags: formData.tags
                  }}
                  onContentGenerated={(type, content) => {
                    if (type === 'content') {
                      handleInputChange('content', content)
                    } else if (type === 'excerpt') {
                      handleInputChange('excerpt', content)
                    } else if (type === 'tags') {
                      handleInputChange('tags', content)
                    } else if (type === 'seo') {
                      console.log("SEO metadata generated:", content)
                      alert(`SEO metadata generated:\nTitle: ${content.title}\nDescription: ${content.description}\nKeywords: ${content.keywords.join(', ')}`)
                    } else if (type === 'complete') {
                      handleInputChange('content', content.content)
                      handleInputChange('excerpt', content.excerpt)
                      handleInputChange('tags', content.tags)
                    }
                  }}
                />
              </div>

              {/* AI Guide Banner */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg shadow border border-purple-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Brain className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-purple-800">AI-Powered Article Creation</h3>
                      <p className="text-sm text-purple-600">Use AI to generate content, excerpts, tags, and optimize SEO</p>
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Creating Article...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Article
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  )
}
