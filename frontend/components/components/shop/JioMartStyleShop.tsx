'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { MapPin, Filter, Grid3x3, List, Search, ShoppingCart, Heart, Star, ChevronRight, Package, Truck, Clock, MapPin as LocationIcon } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import { cn } from '@/lib/cn'

interface Product {
  id: string
  title: string
  price: number
  onSale?: boolean
  category: string
  image: string
  description?: string
  rating?: number
  reviews?: number
  inStock?: boolean
  delivery?: string
}

interface Category {
  slug: string
  name: string
  type: string
  image?: string
  productCount?: number
}

interface JioMartStyleShopProps {
  products: Product[]
  categories: Category[]
}

export function JioMartStyleShop({ products, categories }: JioMartStyleShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [sortBy, setSortBy] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [userLocation, setUserLocation] = useState('Select Location')
  const itemsPerPage = 12

  const addToCart = useCartStore(s => s.addItem)

  // Location picker
  const locations = [
    'Mumbai, Maharashtra', 
    'Delhi, NCR', 
    'Bangalore, Karnataka',
    'Pune, Maharashtra',
    'Hyderabad, Telangana',
    'Chennai, Tamil Nadu',
    'Kolkata, West Bengal'
  ]

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Type filter (B2B/B2C)
    if (selectedType) {
      const categoryTypes = categories.filter(cat => cat.type === selectedType).map(cat => cat.slug)
      filtered = filtered.filter(product => categoryTypes.includes(product.category))
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Sort
    if (sortBy === 'price-asc') {
      filtered = filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      filtered = filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'name') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title))
    }

    return filtered
  }, [products, selectedCategory, selectedType, priceRange, sortBy, searchQuery, categories])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Get unique categories with product counts
  const categoryStats = useMemo(() => {
    const stats = categories.map(category => ({
      ...category,
      count: products.filter(p => p.category === category.slug).length
    }))
    return stats.filter(cat => cat.count > 0)
  }, [products, categories])

  const b2bCategories = categoryStats.filter(cat => cat.type === 'B2B')
  const b2cCategories = categoryStats.filter(cat => cat.type === 'B2C')

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Location & Delivery Header */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="container-base py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-green" />
                <span className="text-sm text-gray-600">Deliver to</span>
                <select 
                  value={userLocation} 
                  onChange={(e) => setUserLocation(e.target.value)}
                  className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none cursor-pointer"
                >
                  <option>Select Location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Truck className="h-4 w-4" />
                <span>Free Delivery on ₹199+</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Express: 2-4 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-base py-6">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar Filters */}
          <div className={cn(
            "lg:col-span-1 mb-8 lg:mb-0",
            showFilters ? "block" : "hidden lg:block"
          )}>
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button 
                  onClick={() => {
                    setSelectedCategory('')
                    setSelectedType('')
                    setPriceRange([0, 2000])
                    setSortBy('')
                    setSearchQuery('')
                  }}
                  className="text-sm text-brand-green hover:text-brand-green/80"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
                
                {/* Business Solutions */}
                {b2bCategories.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">B2B</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Business</span>
                    </div>
                    <div className="space-y-2 ml-8">
                      {b2bCategories.map((category) => (
                        <label key={category.slug} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="category"
                            value={category.slug}
                            checked={selectedCategory === category.slug}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-4 h-4 text-brand-green border-gray-300 focus:ring-brand-green"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-brand-green flex-1">
                            {category.name}
                          </span>
                          <span className="text-xs text-gray-400">({category.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Retail Products */}
                {b2cCategories.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-brand-green rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">B2C</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Retail</span>
                    </div>
                    <div className="space-y-2 ml-8">
                      {b2cCategories.map((category) => (
                        <label key={category.slug} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="category"
                            value={category.slug}
                            checked={selectedCategory === category.slug}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-4 h-4 text-brand-green border-gray-300 focus:ring-brand-green"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-brand-green flex-1">
                            {category.name}
                          </span>
                          <span className="text-xs text-gray-400">({category.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>₹0</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green" />
                    <span className="text-sm text-gray-600">In Stock Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green" />
                    <span className="text-sm text-gray-600">On Sale</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green" />
                    <span className="text-sm text-gray-600">Express Delivery</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Top Bar */}
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg font-medium"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </button>
                  <span className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  >
                    <option value="">Sort by</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                  
                  {/* View Mode */}
                  <div className="hidden sm:flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "p-2 rounded-l-lg transition-colors",
                        viewMode === 'grid' ? "bg-brand-green text-white" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "p-2 rounded-r-lg transition-colors",
                        viewMode === 'list' ? "bg-brand-green text-white" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={cn(
              "grid gap-4 mb-8",
              viewMode === 'grid' 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            )}>
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "px-4 py-2 text-sm border rounded-lg",
                        currentPage === page 
                          ? "bg-brand-green text-white border-brand-green" 
                          : "border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      {page}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
  onAddToCart: () => void
}

function ProductCard({ product, viewMode, onAddToCart }: ProductCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <img 
              src={product.image} 
              alt={product.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn(
                        "h-4 w-4",
                        i < (product.rating || 4) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      )} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews || 23})</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-brand-green">₹{product.price}</div>
                {product.onSale && <div className="text-sm text-gray-500 line-through">₹{Math.floor(product.price * 1.2)}</div>}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600">✓ In Stock • Express Delivery</span>
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
                <button 
                  onClick={onAddToCart}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow group">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-48 object-cover rounded-t-xl group-hover:scale-105 transition-transform"
        />
        {product.onSale && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            SALE
          </div>
        )}
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-600" />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
        
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={cn(
              "h-4 w-4",
              i < (product.rating || 4) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            )} />
          ))}
          <span className="text-sm text-gray-600 ml-1">({product.reviews || 23})</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-lg font-bold text-brand-green">₹{product.price}</div>
            {product.onSale && <div className="text-sm text-gray-500 line-through">₹{Math.floor(product.price * 1.2)}</div>}
          </div>
          <span className="text-xs text-green-600">Express</span>
        </div>
        
        <button 
          onClick={onAddToCart}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition-colors font-medium"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  )
}
