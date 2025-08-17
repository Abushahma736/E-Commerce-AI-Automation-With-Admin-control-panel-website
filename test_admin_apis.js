#!/usr/bin/env node
/**
 * Admin Panel API Test Script
 * Tests products and categories CRUD operations
 */

const API_BASE = 'http://localhost:3005'

// Test colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
}

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset)
}

async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }
  
  const response = await fetch(url, { ...defaultOptions, ...options })
  const data = await response.json()
  
  return {
    status: response.status,
    ok: response.ok,
    data
  }
}

async function testProductAPIs() {
  log('\n🔍 Testing Products APIs...', 'blue')
  
  try {
    // Test GET products
    log('1. Testing GET /api/products...', 'yellow')
    const getResponse = await makeRequest('/api/products')
    if (getResponse.ok) {
      log(`✅ GET products successful - Found ${getResponse.data.length} products`, 'green')
    } else {
      log('❌ GET products failed: ' + JSON.stringify(getResponse.data), 'red')
    }
    
    // Test POST product (create)
    log('2. Testing POST /api/products...', 'yellow')
    const testProduct = {
      name: 'Test Product Admin Panel',
      title: 'Test Product Admin Panel',
      price: 99.99,
      stock: 10,
      onSale: false,
      category: 'test',
      image: '/images/test.jpg',
      isActive: true,
      description: 'This is a test product for admin panel'
    }
    
    const postResponse = await makeRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify(testProduct)
    })
    
    if (postResponse.ok) {
      log('✅ POST product successful - Created: ' + postResponse.data.title, 'green')
      
      // Test PUT product (update)
      if (postResponse.data._id) {
        log('3. Testing PUT /api/products/{id}...', 'yellow')
        const updateData = {
          name: 'Updated Test Product',
          price: 149.99,
          stock: 15
        }
        
        const putResponse = await makeRequest(`/api/products/${postResponse.data._id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        })
        
        if (putResponse.ok) {
          log('✅ PUT product successful - Updated: ' + putResponse.data.name, 'green')
        } else {
          log('❌ PUT product failed: ' + JSON.stringify(putResponse.data), 'red')
        }
        
        // Test DELETE product
        log('4. Testing DELETE /api/products/{id}...', 'yellow')
        const deleteResponse = await makeRequest(`/api/products/${postResponse.data._id}`, {
          method: 'DELETE'
        })
        
        if (deleteResponse.ok) {
          log('✅ DELETE product successful', 'green')
        } else {
          log('❌ DELETE product failed: ' + JSON.stringify(deleteResponse.data), 'red')
        }
      }
    } else {
      log('❌ POST product failed: ' + JSON.stringify(postResponse.data), 'red')
    }
    
  } catch (error) {
    log('❌ Product API test failed: ' + error.message, 'red')
  }
}

async function testCategoryAPIs() {
  log('\n🏷️ Testing Categories APIs...', 'blue')
  
  try {
    // Test GET categories
    log('1. Testing GET /api/categories...', 'yellow')
    const getResponse = await makeRequest('/api/categories')
    if (getResponse.ok) {
      log(`✅ GET categories successful - Found ${getResponse.data.length} categories`, 'green')
    } else {
      log('❌ GET categories failed: ' + JSON.stringify(getResponse.data), 'red')
    }
    
    // Test POST category (create)
    log('2. Testing POST /api/categories...', 'yellow')
    const testCategory = {
      name: 'Test Category Admin',
      slug: 'test-category-admin',
      description: 'This is a test category for admin panel',
      image: '/images/test-category.jpg',
      isActive: true
    }
    
    const postResponse = await makeRequest('/api/categories', {
      method: 'POST',
      body: JSON.stringify(testCategory)
    })
    
    if (postResponse.ok) {
      log('✅ POST category successful - Created: ' + postResponse.data.name, 'green')
      
      // Test PUT category (update)
      if (postResponse.data._id) {
        log('3. Testing PUT /api/categories/by-id/{id}...', 'yellow')
        const updateData = {
          name: 'Updated Test Category',
          description: 'Updated description for test category'
        }
        
        const putResponse = await makeRequest(`/api/categories/by-id/${postResponse.data._id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        })
        
        if (putResponse.ok) {
          log('✅ PUT category successful - Updated: ' + putResponse.data.name, 'green')
        } else {
          log('❌ PUT category failed: ' + JSON.stringify(putResponse.data), 'red')
        }
        
        // Test DELETE category
        log('4. Testing DELETE /api/categories/by-id/{id}...', 'yellow')
        const deleteResponse = await makeRequest(`/api/categories/by-id/${postResponse.data._id}`, {
          method: 'DELETE'
        })
        
        if (deleteResponse.ok) {
          log('✅ DELETE category successful', 'green')
        } else {
          log('❌ DELETE category failed: ' + JSON.stringify(deleteResponse.data), 'red')
        }
      }
    } else {
      log('❌ POST category failed: ' + JSON.stringify(postResponse.data), 'red')
    }
    
  } catch (error) {
    log('❌ Category API test failed: ' + error.message, 'red')
  }
}

async function main() {
  log('🚀 Starting Admin Panel API Tests...', 'bright')
  log('Server: ' + API_BASE, 'blue')
  
  // Wait a bit for server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  await testProductAPIs()
  await testCategoryAPIs()
  
  log('\n✨ API Tests Completed!', 'bright')
  log('\nAdmin panel should now work properly with both MongoDB and file system fallback.', 'green')
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch(`${API_BASE}/api/products`)
    if (response.ok) {
      return true
    }
  } catch (error) {
    return false
  }
  return false
}

checkServer().then(isRunning => {
  if (isRunning) {
    main().catch(console.error)
  } else {
    log('❌ Server is not running at ' + API_BASE, 'red')
    log('Please start the Next.js development server first:', 'yellow')
    log('npm run dev', 'blue')
  }
})
