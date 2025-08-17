import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hack'

let clientPromise: Promise<MongoClient> | null = null

// Safe MongoDB connection - returns null if MongoDB is not available
async function getClient(): Promise<MongoClient | null> {
  try {
    // Always try to connect, even if MONGODB_URI is not explicitly set in env
    if (!clientPromise) {
      console.log('🔌 Connecting to MongoDB at:', uri)
      const client = new MongoClient(uri, {
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000
      })
      clientPromise = client.connect()
    }
    const client = await clientPromise
    console.log('✅ MongoDB connected successfully')
    return client
  } catch (error: any) {
    console.log('⚠️ MongoDB connection failed, falling back to local files:', error.message)
    clientPromise = null // Reset client promise on failure
    return null
  }
}

export async function getDb(): Promise<Db | null> {
  try {
    const client = await getClient()
    if (!client) return null
    
    const url = new URL(uri)
    const dbName = url.pathname && url.pathname !== '/' ? url.pathname.slice(1) : 'hack'
    console.log('📊 Using database:', dbName)
    return client.db(dbName)
  } catch (error: any) {
    console.log('⚠️ Database connection failed:', error.message)
    return null
  }
}

// Product and Category helpers
export type DbProduct = {
  _id?: any
  id?: string
  title: string
  price: number
  onSale?: boolean
  category: string
  image: string
  images?: string[]
  popularity?: number
  createdAt?: string
}

export type DbCategory = {
  _id?: any
  slug: string
  name: string
  type: string
  image?: string
}

export async function getAllProductsFromMongo(): Promise<DbProduct[]> {
  try {
    const db = await getDb()
    if (!db) return []
    
    const docs = await db.collection<DbProduct>('products').find({}).toArray()
    return docs.map((d) => {
      const { _id, ...rest } = d as any
      return {
        ...rest,
        id: d.id || (_id ? String(_id) : undefined)
      }
    })
  } catch (error) {
    console.log('⚠️ Failed to fetch products from MongoDB:', error.message)
    return []
  }
}

export async function getProductByIdFromMongo(id: string): Promise<DbProduct | null> {
  try {
    const db = await getDb()
    if (!db) return null
    
    const doc = await db.collection<DbProduct>('products').findOne({ id })
    if (!doc) return null
    const { _id, ...rest } = doc as any
    return { ...rest, id: doc.id || (_id ? String(_id) : undefined) }
  } catch (error) {
    console.log('⚠️ Failed to fetch product from MongoDB:', error.message)
    return null
  }
}

export async function getAllCategoriesFromMongo(): Promise<DbCategory[]> {
  try {
    const db = await getDb()
    if (!db) return []
    
    const docs = await db.collection<DbCategory>('categories').find({}).toArray()
    return docs.map((d) => {
      const { _id, ...rest } = d as any
      return rest
    })
  } catch (error) {
    console.log('⚠️ Failed to fetch categories from MongoDB:', error.message)
    return []
  }
}



