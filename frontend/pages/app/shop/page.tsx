'use client'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { ProductGrid } from '@/components/product/ProductGrid'
import { JioMartStyleShop } from '@/components/shop/JioMartStyleShop'
import { getAllProducts } from '@/lib/fsdb'
import { getAllCategories } from '@/lib/fsdb'
import { getAllProductsFromMongo, getAllCategoriesFromMongo } from '@/lib/mongodb'
import { useEffect, useState } from 'react'

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsMongo, categoriesMongo] = await Promise.all([
          fetch('/api/products').then(r => r.json()).catch(() => []),
          fetch('/api/categories').then(r => r.json()).catch(() => [])
        ])
        setProducts(productsMongo || [])
        setCategories(categoriesMongo || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-brand-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  return <JioMartStyleShop products={products} categories={categories} />
}


