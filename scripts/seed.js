/* eslint-disable no-console */
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hack'
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const url = new URL(uri)
    const dbName = url.pathname && url.pathname !== '/' ? url.pathname.slice(1) : 'hack'
    const db = client.db(dbName)

    // Indexes
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true })
    await db.collection('products').createIndex({ id: 1 }, { unique: true })

    const categories = [
      { slug: 'spices', name: 'Spices', type: 'B2C', image: '/images/pepper.jpg' },
      { slug: 'oils', name: 'Essential Oils', type: 'B2B', image: '/images/essential.jpg' },
      { slug: 'seeds', name: 'Seeds', type: 'B2C', image: '/images/Paddy_Seed.webp' },
      { slug: 'vegetables', name: 'Vegetables', type: 'B2C', image: '/images/Lettuce.jpg' }
    ]

    const now = new Date().toISOString()
    const products = [
      { id: 'p1', title: 'Turmeric Extract', price: 299, onSale: true, category: 'spices', image: '/images/turmeric.jpg', createdAt: now },
      { id: 'p2', title: 'Clove Oil', price: 499, onSale: false, category: 'oils', image: '/images/clove.jpg', createdAt: now },
      { id: 'p3', title: 'Black Pepper', price: 199, onSale: false, category: 'spices', image: '/images/pepper.jpg', createdAt: now },
      { id: 'p4', title: 'Mushroom Pack', price: 149, onSale: true, category: 'vegetables', image: '/images/Mushroom.jpg', createdAt: now },
      { id: 'p5', title: 'Capsicum Fresh', price: 99, onSale: false, category: 'vegetables', image: '/images/Capsicum.jpg', createdAt: now },
      { id: 'p6', title: 'Paddy Seeds', price: 399, onSale: false, category: 'seeds', image: '/images/Paddy_Seed.webp', createdAt: now }
    ]

    // Upsert categories
    for (const c of categories) {
      await db.collection('categories').updateOne({ slug: c.slug }, { $set: c }, { upsert: true })
    }

    // Upsert products
    for (const p of products) {
      await db.collection('products').updateOne({ id: p.id }, { $set: p }, { upsert: true })
    }

    const catCount = await db.collection('categories').countDocuments()
    const prodCount = await db.collection('products').countDocuments()

    // Admin user
    const adminEmail = 'admin@example.com'
    const adminPass = 'admin123'
    const passwordHash = await bcrypt.hash(adminPass, 10)
    await db.collection('users').updateOne(
      { email: adminEmail },
      { $setOnInsert: { name: 'Admin', email: adminEmail, passwordHash, createdAt: new Date() } },
      { upsert: true }
    )

    console.log(`Seed complete. categories=${catCount}, products=${prodCount}, db=${db.databaseName}`)
    console.log(`Admin login -> email: ${adminEmail}, password: ${adminPass}`)
  } catch (err) {
    console.error('Seed failed:', err.message)
    process.exitCode = 1
  } finally {
    await client.close()
  }
}

run()


