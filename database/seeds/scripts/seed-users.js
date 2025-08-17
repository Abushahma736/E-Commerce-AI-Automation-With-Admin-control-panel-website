const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hack';

async function seedUsers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Clear existing users (optional - comment out if you want to keep existing users)
    // await usersCollection.deleteMany({});
    // console.log('🗑️ Cleared existing users');
    
    // Create demo users
    const demoUsers = [
      {
        name: 'Demo User',
        email: 'demo@example.com',
        phone: '+919876543210',
        password: await bcrypt.hash('demo123', 12),
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Test User', 
        email: 'test@example.com',
        phone: '+919876543211',
        password: await bcrypt.hash('test123', 12),
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin User',
        email: 'admin@hack.com',
        phone: '+919876543212',
        password: await bcrypt.hash('admin123', 12),
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Hack User',
        email: 'user@hack.com',
        phone: '+919876543213',
        password: await bcrypt.hash('hack123', 12),
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Check and insert users
    for (const user of demoUsers) {
      const existingUser = await usersCollection.findOne({ email: user.email });
      if (!existingUser) {
        await usersCollection.insertOne(user);
        console.log(`✅ Created user: ${user.email}`);
      } else {
        console.log(`⚠️  User already exists: ${user.email}`);
      }
    }
    
    console.log('\n🎉 User seeding completed!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('Email: demo@example.com | Password: demo123');
    console.log('Email: test@example.com | Password: test123');
    console.log('Email: admin@hack.com | Password: admin123');
    console.log('Email: user@hack.com | Password: hack123');
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the seeding
seedUsers().catch(console.error);
