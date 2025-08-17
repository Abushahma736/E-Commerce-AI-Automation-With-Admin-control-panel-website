#!/usr/bin/env node
/**
 * Authentication System Test Script
 * Tests user registration and login functionality
 */

const API_BASE = 'http://localhost:3005'

// Test colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
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
  
  let data
  try {
    data = await response.json()
  } catch {
    data = { error: 'Invalid JSON response' }
  }
  
  return {
    status: response.status,
    ok: response.ok,
    data
  }
}

async function testUserRegistration() {
  log('\n👤 Testing User Registration...', 'blue')
  
  const testUsers = [
    {
      name: 'John Doe',
      email: 'john.doe@testuser.com',
      phone: '9876543210',
      password: 'testpass123'
    },
    {
      name: 'Jane Smith', 
      email: 'jane.smith@testuser.com',
      phone: '8765432109',
      password: 'janepass456'
    }
  ]
  
  const registeredUsers = []
  
  for (const user of testUsers) {
    log(`\n1. Testing registration for: ${user.email}`, 'yellow')
    
    try {
      const response = await makeRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(user)
      })
      
      if (response.ok) {
        log(`✅ Registration successful for: ${user.email}`, 'green')
        registeredUsers.push(user)
      } else if (response.status === 409) {
        log(`⚠️  User already exists: ${user.email} (This is OK for testing)`, 'yellow')
        registeredUsers.push(user) // Still add to test login
      } else {
        log(`❌ Registration failed for ${user.email}: ${response.data.error}`, 'red')
      }
    } catch (error) {
      log(`❌ Registration error for ${user.email}: ${error.message}`, 'red')
    }
  }
  
  return registeredUsers
}

async function testUserLogin(users) {
  log('\n🔐 Testing User Login...', 'blue')
  
  const loginSuccesses = []
  
  for (const user of users) {
    log(`\n2. Testing login for: ${user.email}`, 'yellow')
    
    try {
      // Test NextAuth credentials endpoint
      const response = await makeRequest('/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: user.email,
          password: user.password,
          redirect: 'false',
          json: 'true'
        })
      })
      
      log(`Login response for ${user.email}:`, 'magenta')
      log(`Status: ${response.status}, OK: ${response.ok}`, 'magenta')
      log(`Data: ${JSON.stringify(response.data, null, 2)}`, 'magenta')
      
      if (response.ok) {
        log(`✅ Login successful for: ${user.email}`, 'green')
        loginSuccesses.push(user)
      } else {
        log(`❌ Login failed for ${user.email}:`, 'red')
        log(`  Status: ${response.status}`, 'red')
        log(`  Error: ${JSON.stringify(response.data)}`, 'red')
      }
    } catch (error) {
      log(`❌ Login error for ${user.email}: ${error.message}`, 'red')
    }
  }
  
  return loginSuccesses
}

async function testDemoUsers() {
  log('\n🎭 Testing Demo Users...', 'blue')
  
  const demoUsers = [
    { email: 'demo@example.com', password: 'demo123' },
    { email: 'test@example.com', password: 'test123' },
    { email: 'admin@hack.com', password: 'admin123' }
  ]
  
  for (const user of demoUsers) {
    log(`\n3. Testing demo login for: ${user.email}`, 'yellow')
    
    try {
      const response = await makeRequest('/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: user.email,
          password: user.password,
          redirect: 'false',
          json: 'true'
        })
      })
      
      if (response.ok) {
        log(`✅ Demo login successful for: ${user.email}`, 'green')
      } else {
        log(`❌ Demo login failed for ${user.email}: ${JSON.stringify(response.data)}`, 'red')
      }
    } catch (error) {
      log(`❌ Demo login error for ${user.email}: ${error.message}`, 'red')
    }
  }
}

async function checkDatabaseUsers() {
  log('\n🗄️  Checking Database Users...', 'blue')
  
  try {
    // This would require a direct MongoDB connection
    // For now, we'll just log what we expect to see
    log('📊 Expected users in database:', 'yellow')
    log('  - Demo users (if MongoDB unavailable)', 'yellow')
    log('  - Registered test users (if MongoDB available)', 'yellow')
    log('  - Users should have hashed passwords', 'yellow')
    log('  - Users should have createdAt timestamps', 'yellow')
    
    // You could add a custom API endpoint to list users (admin only)
    // For security, we won't do that in this test
    
  } catch (error) {
    log(`❌ Database check error: ${error.message}`, 'red')
  }
}

async function testAuthFlow() {
  log('\n🔄 Testing Complete Auth Flow...', 'blue')
  
  const testUser = {
    name: 'Auth Flow Test',
    email: `authtest${Date.now()}@example.com`,
    phone: '7777777777',
    password: 'flowtest123'
  }
  
  try {
    // Step 1: Register
    log('\n4a. Testing complete flow - Registration...', 'yellow')
    const registerResponse = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(testUser)
    })
    
    if (!registerResponse.ok && registerResponse.status !== 409) {
      throw new Error(`Registration failed: ${registerResponse.data.error}`)
    }
    
    log(`✅ Registration: ${registerResponse.ok ? 'Success' : 'User exists'}`, 'green')
    
    // Step 2: Login immediately
    log('4b. Testing immediate login after registration...', 'yellow')
    const loginResponse = await makeRequest('/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: testUser.email,
        password: testUser.password,
        redirect: 'false',
        json: 'true'
      })
    })
    
    if (loginResponse.ok) {
      log('✅ Immediate login after registration successful!', 'green')
    } else {
      log(`❌ Immediate login failed: ${JSON.stringify(loginResponse.data)}`, 'red')
    }
    
  } catch (error) {
    log(`❌ Auth flow test error: ${error.message}`, 'red')
  }
}

async function main() {
  log('🚀 Starting Authentication System Tests...', 'bright')
  log('Server: ' + API_BASE, 'blue')
  
  try {
    // Test registration
    const registeredUsers = await testUserRegistration()
    
    // Test login for registered users
    await testUserLogin(registeredUsers)
    
    // Test demo users
    await testDemoUsers()
    
    // Check database state
    await checkDatabaseUsers()
    
    // Test complete auth flow
    await testAuthFlow()
    
    log('\n✨ Authentication Tests Completed!', 'bright')
    log('\n📝 Summary:', 'blue')
    log('- User registration should work', 'green')
    log('- Registered users should be able to login', 'green')
    log('- Demo users should still work as fallback', 'green')
    log('- Passwords should be properly hashed in database', 'green')
    log('- NextAuth integration should handle sessions correctly', 'green')
    
    log('\n🎯 Next Steps:', 'yellow')
    log('1. Try logging in through the web interface', 'yellow')
    log('2. Check that sessions persist correctly', 'yellow')
    log('3. Verify user data appears in MongoDB', 'yellow')
    
  } catch (error) {
    log(`❌ Test suite failed: ${error.message}`, 'red')
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch(`${API_BASE}/api/health`)
    return response.ok
  } catch (error) {
    return false
  }
}

checkServer().then(async (isRunning) => {
  if (isRunning) {
    await main()
  } else {
    log('❌ Server is not running at ' + API_BASE, 'red')
    log('Please start the Next.js development server first:', 'yellow')
    log('npm run dev', 'blue')
    
    // Try to test anyway in case health endpoint doesn't exist
    log('\n🔄 Attempting tests anyway...', 'yellow')
    try {
      await main()
    } catch (error) {
      log(`❌ Tests failed - server may not be running: ${error.message}`, 'red')
    }
  }
})
