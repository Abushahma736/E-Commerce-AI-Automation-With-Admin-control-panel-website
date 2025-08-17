const { MongoClient } = require('mongodb');

// MongoDB connection string
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hack';

async function checkDatabase() {
    let client;
    try {
        console.log('🔄 Connecting to MongoDB...');
        client = new MongoClient(uri);
        await client.connect();
        
        const db = client.db('hack');
        
        // List all collections
        console.log('📋 Checking existing collections...');
        const collections = await db.listCollections().toArray();
        
        if (collections.length === 0) {
            console.log('❌ No collections found in database');
        } else {
            console.log(`✅ Found ${collections.length} collections:`);
            collections.forEach(col => {
                console.log(`  - ${col.name}`);
            });
        }
        
        // Check document counts for each collection
        console.log('\n📊 Document counts:');
        for (const col of collections) {
            try {
                const count = await db.collection(col.name).countDocuments();
                console.log(`  - ${col.name}: ${count} documents`);
            } catch (err) {
                console.log(`  - ${col.name}: Error counting documents`);
            }
        }
        
        // Sample documents from each collection
        console.log('\n🔍 Sample documents:');
        for (const col of collections) {
            try {
                const sample = await db.collection(col.name).findOne();
                if (sample) {
                    console.log(`  - ${col.name} sample:`, JSON.stringify(sample, null, 2));
                } else {
                    console.log(`  - ${col.name}: No documents found`);
                }
            } catch (err) {
                console.log(`  - ${col.name}: Error fetching sample`);
            }
        }
        
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
    } finally {
        if (client) {
            await client.close();
            console.log('\n✅ Connection closed');
        }
    }
}

checkDatabase();
