/**
 * GlowAI Proxy Server
 * Serves the static A.n.n Beauty app AND proxies /api/chat → OpenAI
 * Run: node proxy.js
 */
const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');

const PORT    = 5500;
const STATIC  = __dirname;

// MIME types
const MIME = {
    '.html': 'text/html',
    '.js':   'application/javascript',
    '.css':  'text/css',
    '.json': 'application/json',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.webp': 'image/webp',
    '.woff2':'font/woff2',
};

function setCORS(res) {
    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

const server = http.createServer((req, res) => {
    setCORS(res);

    // Pre-flight
    if (req.method === 'OPTIONS') {
        res.writeHead(204); res.end(); return;
    }

    // ── OpenAI proxy ──────────────────────────────────────────────────────────
    if (req.url === '/api/chat' && req.method === 'POST') {
        let body = '';
        req.on('data', d => body += d);
        req.on('end', () => {
            let parsed;
            try { parsed = JSON.parse(body); } catch {
                res.writeHead(400); res.end('Bad JSON'); return;
            }

            const apiKey = parsed._apiKey || '';
            delete parsed._apiKey;          // remove before forwarding

            const payload = JSON.stringify(parsed);

            const options = {
                hostname: 'opencode.ai',
                port: 443,
                path: '/zen/v1/chat/completions',
                method: 'POST',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Length': Buffer.byteLength(payload),
                }
            };

            const proxyReq = https.request(options, proxyRes => {
                res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
                proxyRes.pipe(res);
            });

            proxyReq.on('error', err => {
                res.writeHead(502);
                res.end(JSON.stringify({ error: { message: err.message } }));
            });

            proxyReq.write(payload);
            proxyReq.end();
        });
        return;
    }

    // ── Static file server ────────────────────────────────────────────────────
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/' || urlPath.startsWith('/#')) urlPath = '/index.html';

    const filePath = path.join(STATIC, urlPath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            // SPA fallback
            fs.readFile(path.join(STATIC, 'index.html'), (e2, d2) => {
                if (e2) { res.writeHead(404); res.end('Not found'); return; }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(d2);
            });
            return;
        }
        const ext  = path.extname(filePath);
        const mime = MIME[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`\n  ✦ GlowAI Proxy + A.n.n Beauty`);
    console.log(`  → http://localhost:${PORT}\n`);
});
