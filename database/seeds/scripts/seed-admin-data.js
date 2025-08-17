const { MongoClient } = require('mongodb')

// MongoDB connection URI - Update this with your actual connection string
const MONGODB_URI = 'mongodb://localhost:27017/esse-naturals-nutrition'

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db()
    
    // Clear existing collections
    console.log('Clearing existing collections...')
    await db.collection('products').deleteMany({})
    await db.collection('categories').deleteMany({})
    await db.collection('contacts').deleteMany({})
    await db.collection('orders').deleteMany({})
    await db.collection('users').deleteMany({})
    await db.collection('settings').deleteMany({})
    
    // Seed Categories
    console.log('Seeding categories...')
    const categories = [
      {
        name: 'Vitamins & Minerals',
        slug: 'vitamins-minerals',
        description: 'Essential vitamins and minerals for daily health support',
        image: '/images/categories/vitamins.jpg',
        isActive: true,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Protein & Supplements',
        slug: 'protein-supplements',
        description: 'High-quality protein powders and fitness supplements',
        image: '/images/categories/protein.jpg',
        isActive: true,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Herbal & Natural',
        slug: 'herbal-natural',
        description: 'Natural herbal products and organic supplements',
        image: '/images/categories/herbal.jpg',
        isActive: true,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Weight Management',
        slug: 'weight-management',
        description: 'Products for healthy weight management and metabolism',
        image: '/images/categories/weight.jpg',
        isActive: true,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sports Nutrition',
        slug: 'sports-nutrition',
        description: 'Performance supplements for athletes and fitness enthusiasts',
        image: '/images/categories/sports.jpg',
        isActive: true,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    const categoryResult = await db.collection('categories').insertMany(categories)
    console.log(`Inserted ${categoryResult.insertedCount} categories`)
    
    // Seed Products
    console.log('Seeding products...')
    const products = [
      {
        name: 'Vitamin D3 2000 IU',
        description: 'High-potency Vitamin D3 for bone health and immune support. Essential for calcium absorption and overall wellness.',
        price: 899,
        stock: 150,
        onSale: true,
        category: 'vitamins-minerals',
        image: '/images/products/vitamin-d3.jpg',
        images: ['/images/products/vitamin-d3-1.jpg', '/images/products/vitamin-d3-2.jpg'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Omega-3 Fish Oil',
        description: 'Premium quality fish oil with EPA and DHA for heart and brain health. Molecularly distilled for purity.',
        price: 1299,
        stock: 80,
        onSale: false,
        category: 'vitamins-minerals',
        image: '/images/products/omega-3.jpg',
        images: ['/images/products/omega-3-1.jpg'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Whey Protein Isolate',
        description: 'Fast-absorbing whey protein isolate with 25g protein per serving. Perfect for post-workout recovery.',
        price: 2499,
        stock: 45,
        onSale: true,
        category: 'protein-supplements',
        image: '/images/products/whey-protein.jpg',
        images: ['/images/products/whey-protein-1.jpg', '/images/products/whey-protein-2.jpg'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Multivitamin Complex',
        description: 'Complete daily multivitamin with 25+ essential vitamins and minerals for optimal health support.',
        price: 1599,
        stock: 120,
        onSale: false,
        category: 'vitamins-minerals',
        image: '/images/products/multivitamin.jpg',
        images: ['/images/products/multivitamin-1.jpg'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ashwagandha Extract',
        description: 'Premium ashwagandha root extract for stress relief and adaptogenic support. 600mg per capsule.',
        price: 1199,
        stock: 90,
        onSale: false,
        category: 'herbal-natural',
        image: '/images/products/ashwagandha.jpg',
        images: ['/images/products/ashwagandha-1.jpg'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Green Coffee Bean Extract',
        description: 'Natural weight management support with chlorogenic acid. Helps boost metabolism and energy.',
        price: 999,
        stock: 60,
        onSale: true,
        category: 'weight-management',
        image: '/images/products/green-coffee.jpg',
        images: ['/images/products/green-coffee-1.jpg'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'BCAA Energy Powder',
        description: 'Branched-chain amino acids with natural caffeine for energy and muscle recovery during workouts.',
        price: 1899,
        stock: 35,
        onSale: false,
        category: 'sports-nutrition',
        image: '/images/products/bcaa.jpg',
        images: ['/images/products/bcaa-1.jpg', '/images/products/bcaa-2.jpg'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Calcium + Magnesium',
        description: 'Essential mineral combination for bone health, muscle function, and nervous system support.',
        price: 799,
        stock: 8,
        onSale: false,
        category: 'vitamins-minerals',
        image: '/images/products/calcium-mag.jpg',
        images: ['/images/products/calcium-mag-1.jpg'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    const productResult = await db.collection('products').insertMany(products)
    console.log(`Inserted ${productResult.insertedCount} products`)
    
    // Update category product counts
    console.log('Updating category product counts...')
    for (const category of categories) {
      const count = products.filter(p => p.category === category.slug).length
      await db.collection('categories').updateOne(
        { slug: category.slug },
        { $set: { productCount: count } }
      )
    }
    
    // Seed Users
    console.log('Seeding users...')
    const users = [
      {
        name: 'Admin User',
        email: 'admin@essentials.com',
        phone: '+91 9876543210',
        address: {
          street: 'Admin Building, Tech Park',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        status: 'active',
        isVerified: true,
        isTrusted: true,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+91 9123456789',
        address: {
          street: '123 MG Road',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India'
        },
        status: 'active',
        isVerified: true,
        isTrusted: true,
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 9876543210',
        address: {
          street: '456 Park Street',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India'
        },
        status: 'active',
        isVerified: false,
        isTrusted: false,
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        phone: '+91 9988776655',
        address: {
          street: '789 SG Highway',
          city: 'Ahmedabad',
          state: 'Gujarat',
          zipCode: '380001',
          country: 'India'
        },
        status: 'active',
        isVerified: true,
        isTrusted: true,
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    const userResult = await db.collection('users').insertMany(users)
    console.log(`Inserted ${userResult.insertedCount} users`)
    
    // Seed Orders
    console.log('Seeding orders...')
    const orders = [
      {
        orderNumber: `ORD-${Date.now() - 86400000}`,
        customer: {
          name: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          phone: '+91 9123456789',
          isVerified: true
        },
        items: [
          { productId: productResult.insertedIds[0].toString(), name: 'Vitamin D3 2000 IU', quantity: 2, price: 899 },
          { productId: productResult.insertedIds[1].toString(), name: 'Omega-3 Fish Oil', quantity: 1, price: 1299 }
        ],
        total: 3097,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        autoConfirmed: true,
        confirmedAt: new Date(Date.now() - 82800000),
        shippingAddress: {
          street: '123 MG Road',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India'
        },
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 82800000)
      },
      {
        orderNumber: `ORD-${Date.now() - 43200000}`,
        customer: {
          name: 'Priya Sharma',
          email: 'priya@example.com',
          phone: '+91 9876543210',
          isVerified: false
        },
        items: [
          { productId: productResult.insertedIds[2].toString(), name: 'Whey Protein Isolate', quantity: 1, price: 2499 }
        ],
        total: 2499,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'upi',
        autoConfirmed: false,
        shippingAddress: {
          street: '456 Park Street',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India'
        },
        createdAt: new Date(Date.now() - 43200000),
        updatedAt: new Date(Date.now() - 43200000)
      },
      {
        orderNumber: `ORD-${Date.now() - 21600000}`,
        customer: {
          name: 'Amit Patel',
          email: 'amit@example.com',
          phone: '+91 9988776655',
          isVerified: true
        },
        items: [
          { productId: productResult.insertedIds[3].toString(), name: 'Multivitamin Complex', quantity: 1, price: 1599 },
          { productId: productResult.insertedIds[4].toString(), name: 'Ashwagandha Extract', quantity: 1, price: 1199 }
        ],
        total: 2798,
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: 'netbanking',
        autoConfirmed: true,
        confirmedAt: new Date(Date.now() - 18000000),
        shippingAddress: {
          street: '789 SG Highway',
          city: 'Ahmedabad',
          state: 'Gujarat',
          zipCode: '380001',
          country: 'India'
        },
        createdAt: new Date(Date.now() - 21600000),
        updatedAt: new Date(Date.now() - 18000000)
      }
    ]
    
    const orderResult = await db.collection('orders').insertMany(orders)
    console.log(`Inserted ${orderResult.insertedCount} orders`)
    
    // Seed Contacts
    console.log('Seeding contacts...')
    const contacts = [
      {
        name: 'Ravi Singh',
        email: 'ravi@example.com',
        phone: '+91 9445566778',
        message: 'Hi, I would like to know more about your Vitamin D3 supplements. Are they suitable for vegetarians? Also, what is the recommended dosage for adults?',
        status: 'new',
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 7200000)
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@example.com',
        phone: '+91 9334455667',
        message: 'I received my order yesterday but the whey protein container seems to be damaged during shipping. Can you please help me with a replacement?',
        status: 'replied',
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 86400000)
      },
      {
        name: 'Vikash Gupta',
        email: 'vikash@example.com',
        phone: '+91 9556677889',
        message: 'Do you have any offers or discounts for bulk purchases? I am interested in ordering multiple bottles of your multivitamin complex for my family.',
        status: 'new',
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000)
      },
      {
        name: 'Kavya Nair',
        email: 'kavya@example.com',
        phone: '+91 9667788990',
        message: 'I have been using your ashwagandha extract for a month now and I am very satisfied with the results. Keep up the good work! Do you have any other stress-relief products?',
        status: 'archived',
        createdAt: new Date(Date.now() - 259200000),
        updatedAt: new Date(Date.now() - 172800000)
      },
      {
        name: 'Manoj Yadav',
        email: 'manoj@example.com',
        phone: '+91 9778899001',
        message: 'What is your return policy? I ordered the wrong product by mistake and would like to exchange it for a different one.',
        status: 'replied',
        createdAt: new Date(Date.now() - 432000000),
        updatedAt: new Date(Date.now() - 345600000)
      }
    ]
    
    const contactResult = await db.collection('contacts').insertMany(contacts)
    console.log(`Inserted ${contactResult.insertedCount} contacts`)
    
    // Seed Settings
    console.log('Seeding settings...')
    const settings = [
      {
        type: 'autoConfirm',
        enabled: true,
        maxAmount: 5000,
        excludedPaymentMethods: ['cod'],
        requireVerification: false,
        delayMinutes: 5,
        emailNotification: true,
        smsNotification: false,
        excludedCountries: [],
        minOrderCount: 0,
        trustedCustomersOnly: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    const settingsResult = await db.collection('settings').insertMany(settings)
    console.log(`Inserted ${settingsResult.insertedCount} settings`)
    
    console.log('\\n✅ Database seeding completed successfully!')
    console.log('\\n📊 Summary:')
    console.log(`   Categories: ${categoryResult.insertedCount}`)
    console.log(`   Products: ${productResult.insertedCount}`)
    console.log(`   Users: ${userResult.insertedCount}`)
    console.log(`   Orders: ${orderResult.insertedCount}`)
    console.log(`   Contacts: ${contactResult.insertedCount}`)
    console.log(`   Settings: ${settingsResult.insertedCount}`)
    console.log('\\n🚀 Your admin panel is now ready with sample data!')
    
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await client.close()
  }
}

// Run the seeder
seedDatabase().catch(console.error)
