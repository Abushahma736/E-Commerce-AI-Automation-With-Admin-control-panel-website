const https = require('http');

const testData = {
  title: "Test Article from Script",
  content: "This is a test article created from a Node.js script to verify the API is working correctly.",
  category: "Test Category",
  author: "Test Author",
  status: "draft",
  tags: ["test", "api", "nodejs"]
};

const options = {
  hostname: 'localhost',
  port: 3005,
  path: '/api/articles',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(testData))
  }
};

console.log('🧪 Testing article creation API...');
console.log('📊 Test data:', testData);

const req = https.request(options, (res) => {
  console.log(`📡 Response status: ${res.statusCode}`);
  console.log('📋 Response headers:', res.headers);

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (res.statusCode === 200) {
        console.log('✅ Article created successfully!');
        console.log('🎉 Response:', response);
      } else {
        console.log('❌ Error creating article:');
        console.log('📝 Response:', response);
      }
    } catch (error) {
      console.log('❌ Failed to parse response:', data);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Request failed:', error.message);
});

req.write(JSON.stringify(testData));
req.end();

console.log('📤 Test request sent...');
