"use client"
import { useEffect, useState } from 'react'
import { Search, Plus, Edit, Trash2, Tag, Upload, X, Save, AlertCircle, Image as ImageIcon, Brain, Sparkles } from 'lucide-react'
import AICategoryActions from '@/components/admin/AICategoryActions'

type Category = {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  productCount?: number
  createdAt: string
  updatedAt: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Category>>({ 
    name: '', 
    slug: '', 
    description: '', 
    image: '', 
    isActive: true 
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)

  // Generate slug from name
  function generateSlug(name: string) {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/categories', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load categories')
      setCategories(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function resetForm() {
    setForm({ 
      name: '', 
      slug: '', 
      description: '', 
      image: '', 
      isActive: true 
    })
    setEditingId(null)
    setShowForm(false)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    
    if (!form.name) {
      setError('Please enter category name')
      return
    }
    
    // Auto-generate slug if not provided
    if (!form.slug) {
      form.slug = generateSlug(form.name)
    }
    
    if (editingId) {
      const res = await fetch(`/api/categories/by-id/${editingId}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(form) 
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data?.error || 'Update failed'); return }
    } else {
      const res = await fetch('/api/categories', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(form) 
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data?.error || 'Create failed'); return }
    }
    await load()
    resetForm()
  }

  async function remove(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return
    
    setError(null)
    const res = await fetch(`/api/categories/by-id/${id}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) { setError(data?.error || 'Delete failed'); return }
    await load()
  }

  function startEdit(c: Category) {
    setEditingId(c._id)
    setForm({ ...c })
    setShowForm(true)
  }

  const filteredCategories = categories.filter(c => {
    return (c.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
           (c.slug?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="mt-2 text-lg text-gray-600">Organize your products with categories</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
          <div className="text-sm text-gray-600">Total Categories</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">
            {categories.filter(c => c.isActive).length}
          </div>
          <div className="text-sm text-gray-600">Active Categories</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-purple-600">
            {categories.filter(c => c.productCount && c.productCount > 0).length}
          </div>
          <div className="text-sm text-gray-600">With Products</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-orange-600">
            {categories.filter(c => c.image).length}
          </div>
          <div className="text-sm text-gray-600">With Images</div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <form onSubmit={submit} className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                  value={form.name ?? ''}
                  onChange={(e) => {
                    const name = e.target.value
                    setForm({ 
                      ...form, 
                      name,
                      slug: generateSlug(name)
                    })
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Auto-generated from name"
                  value={form.slug ?? ''}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">URL-friendly version of the name</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category description"
                value={form.description ?? ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer" onClick={() => document.getElementById('category-image-input')?.click()}>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 mb-2">Click to upload category image</p>
                  <input
                    id="category-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setUploading(true)
                      setError(null)
                      try {
                        const fd = new FormData()
                        fd.append('file', file)
                        const res = await fetch('/api/images/upload', { method: 'POST', body: fd })
                        const data = await res.json()
                        if (!res.ok) throw new Error(data?.error || 'Upload failed')
                        setForm({ ...form, image: data.path })
                      } catch (err: any) {
                        setError(err.message)
                      } finally {
                        setUploading(false)
                      }
                    }}
                  />
                  {uploading && (
                    <p className="text-sm text-blue-600 mt-2">Uploading...</p>
                  )}
                  {form.image && !uploading && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600 mb-2">Image uploaded successfully!</p>
                      <img src={form.image} alt="Preview" className="w-20 h-20 object-cover rounded" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={Boolean(form.isActive)}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Active Category</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : (editingId ? 'Update Category' : 'Add Category')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Quick Actions */}
      {showForm && (
        <div className="mb-6">
          <AICategoryActions 
            categoryData={{
              name: form.name, 
              description: form.description,
              slug: form.slug
            }}
            onContentGenerated={(type, content) => {
              if (type === 'description') {
                setForm({ ...form, description: content })
              } else if (type === 'slug') {
                setForm({ ...form, slug: content })
              } else if (type === 'seo') {
                console.log("SEO metadata generated:", content)
                alert(`SEO metadata generated:\nTitle: ${content.title}\nDescription: ${content.description}\nKeywords: ${content.keywords.join(', ')}`)
              } else if (type === 'complete') {
                setForm({
                  ...form,
                  description: content.description,
                  slug: content.slug
                })
              }
            }}
          />
        </div>
      )}

      {/* AI Guide Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg shadow border border-green-100 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Brain className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">AI-Powered Category Management</h3>
              <p className="text-sm text-green-600">Use AI to generate descriptions, slugs, and optimize SEO for categories</p>
            </div>
          </div>
          <a 
            href="/admin/ai-guide" 
            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm flex items-center hover:bg-green-700 transition-colors"
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            View AI Guide
          </a>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <div key={category._id} className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              {category.image ? (
                <img src={category.image} alt={category.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {category.description || 'No description available'}
              </p>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Slug: {category.slug}</span>
                <span>{category.productCount || 0} products</span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(category)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => remove(category._id)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No categories found</p>
        </div>
      )}
    </div>
  )
}


