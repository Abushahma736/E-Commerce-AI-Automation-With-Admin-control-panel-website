"use client"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => Promise<boolean>
  removeItem: (id: string) => void
  updateQty: (id: string, quantity: number) => void
  clear: () => void
}

// Function to check authentication
const checkAuth = async (): Promise<boolean> => {
  try {
    // Check for auth token in cookies
    const authToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1]
    
    if (authToken) {
      const userData = JSON.parse(decodeURIComponent(authToken))
      const thirtyDays = 30 * 24 * 60 * 60 * 1000
      return Date.now() - userData.loginTime <= thirtyDays
    }
    
    // Fallback to session API
    const response = await fetch('/api/auth/session')
    const data = await response.json()
    return data.authenticated
  } catch (error) {
    console.error('Auth check failed:', error)
    return false
  }
}

// Function to redirect to auth page
const redirectToAuth = () => {
  const currentPath = window.location.pathname + window.location.search
  window.location.href = `/auth?redirect=${encodeURIComponent(currentPath)}`
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: async (item, qty = 1) => {
        // Check if user is authenticated before adding to cart
        const isAuthenticated = await checkAuth()
        
        if (!isAuthenticated) {
          // Redirect to auth page with current page as redirect
          redirectToAuth()
          return false
        }
        
        // User is authenticated, add to cart
        const items = get().items
        const existing = items.find((i) => i.id === item.id)
        if (existing) {
          set({ items: items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + qty } : i)) })
        } else {
          set({ items: [...items, { ...item, quantity: qty }] })
        }
        return true
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQty: (id, quantity) => set({ items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)) }),
      clear: () => set({ items: [] })
    }),
    { name: 'esse-cart' }
  )
)


