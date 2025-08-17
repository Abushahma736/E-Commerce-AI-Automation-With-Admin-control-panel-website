import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  total: number
  itemCount: number
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItem: (id: string) => CartItem | undefined
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      
      addItem: (item) => {
        const currentItems = get().items
        const existingItem = currentItems.find(i => i.id === item.id)
        
        let newItems: CartItem[]
        
        if (existingItem) {
          // Update quantity if item exists
          newItems = currentItems.map(i => 
            i.id === item.id 
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
          )
        } else {
          // Add new item
          newItems = [...currentItems, { ...item, quantity: item.quantity || 1 }]
        }
        
        const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
        
        set({ items: newItems, total, itemCount })
      },
      
      removeItem: (id) => {
        const currentItems = get().items
        const newItems = currentItems.filter(item => item.id !== id)
        
        const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
        
        set({ items: newItems, total, itemCount })
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        const currentItems = get().items
        const newItems = currentItems.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
        
        const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
        
        set({ items: newItems, total, itemCount })
      },
      
      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 })
      },
      
      getItem: (id) => {
        return get().items.find(item => item.id === id)
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items,
        total: state.total,
        itemCount: state.itemCount
      }),
    }
  )
)
