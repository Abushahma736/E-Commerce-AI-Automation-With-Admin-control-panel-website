const { MongoClient } = require('mongodb')

const uri = 'mongodb://localhost:27017/hack'

async function testConnection() {
  try {
    console.log('🔄 Connecting to MongoDB...')
    const client = new MongoClient(uri)
    await client.connect()
    
    console.log('✅ Connected successfully to MongoDB!')
    
    const db = client.db('hack')
    
    // Test products collection
    const products = await db.collection('products').find({}).toArray()
    console.log(`📦 Found ${products.length} products`)
    
    // Test categories collection
    const categories = await db.collection('categories').find({}).toArray()
    console.log(`📂 Found ${categories.length} categories`)
    
    await client.close()
    console.log('🎉 MongoDB connection test completed!')
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
  }
}

testConnection()
