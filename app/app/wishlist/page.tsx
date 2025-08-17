"use client"

import { useState, useEffect } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Heart,
  ArrowLeft,
  ShoppingCart,
  Trash2,
  Package,
  Star,
  Plus,
  Minus
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'

interface WishlistItem {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  inStock: boolean
  addedAt: string
}

export default function WishlistPage() {
  const router = useRouter()
  const { addItem } = useCartStore()
  const [user, setUser] = useState<{id: string, name: string, email: string} | null>(null)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => {
        if (!r.ok) {
          router.push('/login?redirect=/wishlist')
          return null
        }
        return r.json()
      })
      .then((data) => {
        if (data) {
          setUser(data)
          // Load wishlist items (for now, we'll use mock data)
          loadWishlist()
        }
        setLoading(false)
      })
      .catch(() => {
        router.push('/login?redirect=/wishlist')
        setLoading(false)
      })
  }, [router])

  const loadWishlist = () => {
    // Mock wishlist data - in a real app, this would come from the API
    const mockWishlist: WishlistItem[] = [
      {
        id: "1",
        title: "Organic Turmeric Powder",
        price: 299,
        originalPrice: 399,
        image: "https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?w=300&h=300&fit=crop&crop=center",
        rating: 4.5,
        reviews: 128,
        inStock: true,
        addedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: "2", 
        title: "Pure Coconut Oil",
        price: 450,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop&crop=center",
        rating: 4.8,
        reviews: 95,
        inStock: true,
        addedAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      },
      {
        id: "3",
        title: "Himalayan Pink Salt", 
        price: 199,
        originalPrice: 249,
        image: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=300&h=300&fit=crop&crop=center",
        rating: 4.3,
        reviews: 67,
        inStock: false,
        addedAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
      }
    ]
    setWishlistItems(mockWishlist)
  }

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(items => items.filter(item => item.id !== itemId))
  }

  const addToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1
    })
    // Optional: remove from wishlist after adding to cart
    // removeFromWishlist(item.id)
  }

  const moveAllToCart = () => {
    wishlistItems.filter(item => item.inStock).forEach(item => {
      addToCart(item)
    })
    setWishlistItems(items => items.filter(item => !item.inStock))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/profile" className="flex items-center gap-2 text-gray-600 hover:text-brand-green transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Profile
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
              <Heart className="w-4 h-4 text-red-500" />
              {wishlistItems.length} items saved
            </div>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8">Save your favorite products to buy them later.</p>
              <Link href="/shop">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Action Bar */}
              <div className="bg-white rounded-xl shadow border p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {wishlistItems.filter(item => item.inStock).length} items available • {wishlistItems.filter(item => !item.inStock).length} out of stock
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setWishlistItems([])}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Clear All
                    </Button>
                    <Button 
                      size="sm"
                      onClick={moveAllToCart}
                      disabled={wishlistItems.filter(item => item.inStock).length === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Move All to Cart
                    </Button>
                  </div>
                </div>
              </div>

              {/* Wishlist Items */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow border overflow-hidden group hover:shadow-lg transition-all duration-300">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                          <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                      </button>
                      {item.originalPrice && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex">
                          {[1,2,3,4,5].map((star) => (
                            <Star 
                              key={star}
                              className={`w-3 h-3 ${star <= item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">({item.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-bold text-brand-green">₹{item.price.toLocaleString()}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                        )}
                      </div>

                      {/* Added Date */}
                      <div className="text-xs text-gray-500 mb-4">
                        Added {new Date(item.addedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => addToCart(item)}
                          disabled={!item.inStock}
                          className="flex-1 text-sm"
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add to Cart
                        </Button>
                        <Button
                          onClick={() => removeFromWishlist(item.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="text-center py-8">
                <Link href="/shop">
                  <Button variant="outline" className="inline-flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
