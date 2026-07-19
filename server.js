const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Decode URL to handle spaces and special characters
  const decodedUrl = decodeURIComponent(req.url);
  let filePath = '.' + decodedUrl;
  
  if (filePath === './') {
    filePath = './index.html';
  }

  // Remove query params or hash if present
  filePath = filePath.split('?')[0].split('#')[0];

  // Clean URLs: if the path has no extension, check if file.html exists
  const ext = path.extname(filePath);
  if (!ext) {
    if (fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    }
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Serve 404 page
        fs.readFile('./404.html', (err404, content404) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content404 || '404 Not Found', 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end('Server error: ' + err.code);
      }
    } else {
      const fileExt = path.extname(filePath);
      const contentType = MIME_TYPES[fileExt] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 TGS ChefChoice Dev Server is Running!`);
  console.log(`👉 Open: http://localhost:${PORT}/`);
  console.log(`👉 Pretty URLs (like /about, /menu) are enabled.`);
  console.log(`==================================================\n`);
});
