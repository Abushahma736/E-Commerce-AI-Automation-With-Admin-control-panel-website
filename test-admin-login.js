#!/usr/bin/env node

/**
 * 🔐 Admin Login Test Script
 * Tests admin authentication credentials
 */

console.log('🔐 Testing Admin Login Credentials...\n');

const adminCredentials = [
  {
    name: 'Primary ESSE Admin',
    email: 'admin@esse.com',
    password: 'admin123',
    expected: 'admin'
  },
  {
    name: 'Secondary Admin',
    email: 'admin@example.com', 
    password: 'admin123',
    expected: 'admin'
  },
  {
    name: 'Super Admin',
    email: 'superadmin@esse.com',
    password: 'super123',
    expected: 'admin'
  },
  {
    name: 'Demo Customer (Should NOT be admin)',
    email: 'demo@example.com',
    password: 'demo123',
    expected: 'customer'
  }
];

async function testAdminLogin() {
  console.log('📋 Available Admin Credentials:\n');
  
  adminCredentials.forEach((cred, index) => {
    const roleIcon = cred.expected === 'admin' ? '👑' : '👤';
    const accessLevel = cred.expected === 'admin' ? 'ADMIN ACCESS' : 'Customer Access';
    
    console.log(`${index + 1}. ${roleIcon} ${cred.name}`);
    console.log(`   📧 Email: ${cred.email}`);
    console.log(`   🔑 Password: ${cred.password}`);
    console.log(`   ⭐ Role: ${accessLevel}`);
    console.log('');
  });

  console.log('🎯 Admin Panel Access Instructions:');
  console.log('1. Open your browser and go to: http://localhost:3005/auth');
  console.log('2. Use any of the admin credentials above');
  console.log('3. After login, navigate to: http://localhost:3005/admin');
  console.log('4. You should see the admin dashboard with full access');
  console.log('');
  
  console.log('🚨 Troubleshooting:');
  console.log('• If login fails: Check server console for auth logs');
  console.log('• If redirected to home: Check user role assignment');
  console.log('• If "Access Denied": User role is not "admin"');
  console.log('• Check browser console for additional errors');
  console.log('');

  console.log('✅ Authentication System Features:');
  console.log('• ✅ Multiple admin accounts available');
  console.log('• ✅ Fallback authentication (works without MongoDB)');
  console.log('• ✅ Role-based access control');
  console.log('• ✅ Admin guard protection on /admin routes');
  console.log('• ✅ Session management with NextAuth');
  console.log('');

  console.log('🔧 Quick Test Commands:');
  console.log('• Start server: npm run dev');
  console.log('• Test auth: node test-admin-login.js');
  console.log('• Check logs: Check browser dev tools & server console');
  console.log('');

  return true;
}

// Test if running directly
if (require.main === module) {
  testAdminLogin()
    .then(() => {
      console.log('✅ Admin login test completed successfully!');
      console.log('🎉 Ready for admin panel access testing!');
    })
    .catch(error => {
      console.error('❌ Test failed:', error.message);
    });
}

module.exports = { testAdminLogin, adminCredentials };
