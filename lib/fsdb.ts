import { promises as fs } from 'fs'
import path from 'path'

export type Product = {
  id: string
  title: string
  price: number
  onSale: boolean
  category: string
  image: string
  images?: string[]
  popularity?: number
  createdAt?: string
}

export type Category = {
  slug: string
  name: string
  type: string
  image?: string
}

const dataDir = path.join(process.cwd(), 'data')

async function ensureFile(filePath: string, defaultContents: string): Promise<void> {
  try {
    await fs.access(filePath)
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, defaultContents, 'utf-8')
  }
}

export async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  const filePath = path.join(dataDir, fileName)
  await ensureFile(filePath, JSON.stringify(fallback, null, 2))
  const raw = await fs.readFile(filePath, 'utf-8')
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export async function writeJsonFile<T>(fileName: string, data: T): Promise<void> {
  const filePath = path.join(dataDir, fileName)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export async function getAllProducts(): Promise<Product[]> {
  return readJsonFile<Product[]>('products.json', [])
}

export async function saveAllProducts(products: Product[]): Promise<void> {
  await writeJsonFile('products.json', products)
}

export async function getAllCategories(): Promise<Category[]> {
  return readJsonFile<Category[]>('categories.json', [])
}

export async function saveAllCategories(categories: Category[]): Promise<void> {
  await writeJsonFile('categories.json', categories)
}


