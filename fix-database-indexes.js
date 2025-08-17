const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/hack';

async function fixDatabaseIndexes() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db('hack');
    const articlesCollection = db.collection('articles');
    
    console.log('📊 Checking existing indexes...');
    const indexes = await articlesCollection.indexes();
    console.log('Current indexes:', indexes.map(i => ({ name: i.name, key: i.key })));
    
    // Try to drop the problematic id_1 index if it exists
    const idIndex = indexes.find(index => index.name === 'id_1');
    if (idIndex) {
      console.log('🗑️ Dropping problematic id_1 index...');
      try {
        await articlesCollection.dropIndex('id_1');
        console.log('✅ Successfully dropped id_1 index');
      } catch (error) {
        console.log('⚠️ Failed to drop id_1 index:', error.message);
      }
    } else {
      console.log('ℹ️ No id_1 index found');
    }
    
    // Check for any documents with null id fields and clean them up
    console.log('🧹 Cleaning up documents with null id fields...');
    const documentsWithNullId = await articlesCollection.find({ id: null }).toArray();
    console.log(`Found ${documentsWithNullId.length} documents with null id field`);
    
    if (documentsWithNullId.length > 0) {
      console.log('🗑️ Removing id field from documents...');
      await articlesCollection.updateMany({ id: null }, { $unset: { id: "" } });
      console.log('✅ Cleaned up documents with null id field');
    }
    
    // Check current state
    console.log('📊 Final check - current indexes:');
    const finalIndexes = await articlesCollection.indexes();
    console.log(finalIndexes.map(i => ({ name: i.name, key: i.key })));
    
    console.log('✅ Database cleanup completed!');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

fixDatabaseIndexes();
