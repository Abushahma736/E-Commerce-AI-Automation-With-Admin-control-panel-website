// Test authentication flow
fetch('http://localhost:3005/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    phone: '+919876543210',
    password: 'test123'
  })
})
.then(res => res.json())
.then(data => console.log('Registration:', data))
.catch(err => console.error('Registration error:', err))
