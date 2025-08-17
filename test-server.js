const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <html>
      <head><title>ESSE Naturals Test</title></head>
      <body>
        <h1>🎉 Server is Working!</h1>
        <p>ESSE Naturals & Nutrition project server test successful!</p>
        <p>Port: ${process.env.PORT || 8000}</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Test server running at http://127.0.0.1:${PORT}`);
});
