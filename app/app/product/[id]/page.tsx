import { getAllProducts } from '@/lib/fsdb'
import { getProductByIdFromMongo } from '@/lib/mongodb'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ProductDetailClient } from '@/components/product/ProductDetailClient'

type Props = { params: Promise<{ id: string }> }

export const dynamic = 'force-dynamic'

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const fromMongo = await getProductByIdFromMongo(id).catch(() => null)
  const products = fromMongo ? [] : await getAllProducts()
  const product = fromMongo ?? products.find((p) => p.id === id)
  if (!product) return notFound()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            image: product.image,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'INR',
              price: product.price,
              availability: 'https://schema.org/InStock'
            }
          })
        }}
      />
      <Suspense>
        <ProductDetailClient id={product.id || id} title={product.title} price={product.price} image={product.image} onSale={product.onSale} />
      </Suspense>
    </>
  )
}

