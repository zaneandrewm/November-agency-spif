// Tiny dependency-free server for the Agency Fam November SPIF board.
// - Serves index.html for page requests.
// - Serves data.json (the standings) with no caching, so a fresh deploy shows up on the next refresh.
// To update the board: edit data.json in the GitHub repo and commit. The app redeploys automatically.
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const files = {
  '/': ['index.html', 'text/html; charset=utf-8', 'no-cache'],
  '/index.html': ['index.html', 'text/html; charset=utf-8', 'no-cache'],
  '/data.json': ['data.json', 'application/json; charset=utf-8', 'no-store'],
};

http
  .createServer((req, res) => {
    const url = req.url.split('?')[0];
    const hit = files[url] || files['/'];
    fs.readFile(path.join(__dirname, hit[0]), (err, body) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Could not load ' + hit[0]);
        return;
      }
      res.writeHead(200, { 'Content-Type': hit[1], 'Cache-Control': hit[2] });
      res.end(body);
    });
  })
  .listen(port, '0.0.0.0', () => console.log('SPIF board listening on ' + port));
