import { notFound } from 'next/navigation'
import { getAllCategories, getAllProducts } from '@/lib/fsdb'
import { getAllCategoriesFromMongo, getAllProductsFromMongo } from '@/lib/mongodb'
import { Container } from '@/components/ui/Container'
import { ProductGrid } from '@/components/product/ProductGrid'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const [categoriesMongo, productsMongo] = await Promise.all([
    getAllCategoriesFromMongo().catch(() => []),
    getAllProductsFromMongo().catch(() => []),
  ])
  const categories = categoriesMongo.length ? categoriesMongo : await getAllCategories()
  const products = productsMongo.length ? (productsMongo as any) : await getAllProducts()
  const category = categories.find((c) => c.slug === slug)
  if (!category) return notFound()

  const filtered = products.filter((p: any) => p.category === category.slug)

  return (
    <div className="py-8">
      <Container>
        <nav className="text-sm text-slate-600">Home / Shop / <span className="text-slate-900">{category.name}</span></nav>
        <div className="mt-4 flex items-center justify-between">
          <div className="font-serif text-2xl">{category.name}</div>
          <div className="flex items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <a key={c.slug} href={`/category/${c.slug}`} className={`text-xs px-2 py-1 rounded-full border ${c.slug === category.slug ? 'bg-brand-green text-white border-brand-green' : 'hover:bg-slate-50'}`}>{c.name}</a>
              ))}
            </div>
            <select className="border rounded-md px-2 py-1 text-sm">
              <option>Default sorting</option>
            </select>
          </div>
        </div>
        <ProductGrid products={filtered} />
      </Container>
    </div>
  )
}


