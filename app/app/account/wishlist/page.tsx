"use client"
import { useEffect, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Heart, ShoppingCart, Trash2, Star, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/cartStore'

interface WishlistItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  inStock: boolean
  addedAt: string
}

export default function WishlistPage() {
  const [user, setUser] = useState<any>(null)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const { addItem } = useCartStore()

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      if (raw) {
        setUser(JSON.parse(raw))
        // Load wishlist from localStorage
        const wishlistRaw = localStorage.getItem('wishlist')
        if (wishlistRaw) {
          setWishlistItems(JSON.parse(wishlistRaw))
        }
      }
    } catch {}
  }, [])

  const removeFromWishlist = (itemId: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== itemId)
    setWishlistItems(updatedWishlist)
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
    setMessage('Item removed from wishlist!')
    setTimeout(() => setMessage(null), 3000)
  }

  const addToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    })
    setMessage('Item added to cart!')
    setTimeout(() => setMessage(null), 3000)
  }

  const moveToCart = (item: WishlistItem) => {
    addToCart(item)
    removeFromWishlist(item.id)
    setMessage('Item moved to cart!')
    setTimeout(() => setMessage(null), 3000)
  }

  const clearWishlist = () => {
    setWishlistItems([])
    localStorage.removeItem('wishlist')
    setMessage('Wishlist cleared!')
    setTimeout(() => setMessage(null), 3000)
  }

  if (!user) {
    return (
      <div className="py-8 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <Link href="/account">
              <Button>Go to Login</Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="py-8 bg-gray-50">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link href="/account" className="text-brand-green hover:text-brand-navy">
              ← Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow border">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-brand-green" />
                <div>
                  <h1 className="text-3xl font-bold text-brand-navy">My Wishlist</h1>
                  <p className="text-gray-600">{wishlistItems.length} item(s) saved</p>
                </div>
              </div>
              
              {wishlistItems.length > 0 && (
                <Button 
                  onClick={clearWishlist}
                  variant="outline"
                  className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Message */}
            {message && (
              <div className="p-4 border-b bg-green-50 text-green-700 border-green-200">
                {message}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {wishlistItems.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                  <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your wishlist is empty</h2>
                  <p className="text-gray-500 mb-6">
                    Start adding products to your wishlist by clicking the heart icon on product pages
                  </p>
                  <Link href="/shop">
                    <Button className="bg-brand-green hover:bg-brand-green/90">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">Out of Stock</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg text-brand-navy hover:text-brand-green">
                              <Link href={`/product/${item.id}`}>
                                {item.name}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                            
                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">({item.rating}.0)</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xl font-bold text-brand-green">
                                ₹{item.price.toLocaleString()}
                              </span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <>
                                  <span className="text-sm text-gray-500 line-through">
                                    ₹{item.originalPrice.toLocaleString()}
                                  </span>
                                  <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                                    {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                                  </span>
                                </>
                              )}
                            </div>

                            <p className="text-sm text-gray-500">
                              Added on {new Date(item.addedAt).toLocaleDateString()}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2 ml-4">
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove from wishlist"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                            <Link href={`/product/${item.id}`}>
                              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                <Eye className="w-5 h-5" />
                              </button>
                            </Link>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-4">
                          <Button
                            onClick={() => moveToCart(item)}
                            disabled={!item.inStock}
                            className="flex items-center gap-2 bg-brand-green hover:bg-brand-green/90"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {item.inStock ? 'Move to Cart' : 'Out of Stock'}
                          </Button>
                          
                          {item.inStock && (
                            <Button
                              onClick={() => addToCart(item)}
                              variant="outline"
                              className="flex items-center gap-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {wishlistItems.length > 0 && (
              <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
                <p className="text-gray-600">
                  {wishlistItems.filter(item => item.inStock).length} of {wishlistItems.length} items available
                </p>
                <div className="flex gap-3">
                  <Link href="/shop">
                    <Button variant="outline">
                      Continue Shopping
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      wishlistItems.filter(item => item.inStock).forEach(item => addToCart(item))
                      const inStockItems = wishlistItems.filter(item => item.inStock)
                      inStockItems.forEach(item => removeFromWishlist(item.id))
                    }}
                    className="bg-brand-green hover:bg-brand-green/90"
                  >
                    Add All to Cart ({wishlistItems.filter(item => item.inStock).length})
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
