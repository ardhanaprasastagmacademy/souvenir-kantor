const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const reqUrl = req.url.split('?')[0];
  let safePath = decodeURIComponent(reqUrl).replace(/^(\.\.[\/\\])+/, '').replace(/^[\\\/]+/, '');
  let filePath = path.join(__dirname, safePath === '' ? 'index.html' : safePath);

  // Jika folder, cari index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Jika tanpa ekstensi dan file .html ada
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    const notFoundPath = path.join(__dirname, '404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    if (fs.existsSync(notFoundPath)) {
      res.end(fs.readFileSync(notFoundPath));
    } else {
      res.end('<h1>404 Not Found</h1>');
    }
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff'
  });

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(` KENES SOUVENIR KANTOR — Web Server Aktif`);
    console.log(`======================================================`);
    console.log(` > Website Publik: http://localhost:${PORT}`);
    console.log(` > Katalog Produk: http://localhost:${PORT}/produk.html`);
    console.log(` > Panel Admin:    http://localhost:${PORT}/admin/login.html`);
    console.log(`   (Default Login: admin@kenessouvenir.com / admin123)`);
    console.log(`======================================================\n`);
  });
}

module.exports = server;

