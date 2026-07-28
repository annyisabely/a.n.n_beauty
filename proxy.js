/**
 * GlowAI Proxy Server + Express API
 * Serves the static A.n.n Beauty app, proxies /api/chat → OpenAI,
 * and provides REST API for the SQLite database.
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const db = require('./server/db');

const app = express();
const PORT = 5500;
const STATIC = __dirname;

app.use(cors());
app.use(express.json());
app.use(express.static(STATIC)); // Serve HTML/JS/CSS files

// ── OpenAI proxy ──────────────────────────────────────────────────────────
app.post('/api/chat', (req, res) => {
    const apiKey = req.body._apiKey || '';
    delete req.body._apiKey; // remove before forwarding

    const payload = JSON.stringify(req.body);

    const options = {
        hostname: 'opencode.ai',
        port: 443,
        path: '/zen/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'Content-Length': Buffer.byteLength(payload),
        }
    };

    const proxyReq = https.request(options, proxyRes => {
        res.status(proxyRes.statusCode);
        res.set(proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', err => {
        res.status(502).json({ error: { message: err.message } });
    });

    proxyReq.write(payload);
    proxyReq.end();
});

// ── Database API (SQLite) ──────────────────────────────────────────────────
const tables = ['users', 'stores', 'products', 'orders', 'reports', 'coupons', 'categories', 'settings'];

// GET all records from a table
app.get('/api/:table', (req, res) => {
    const table = req.params.table;
    if (!tables.includes(table)) return res.status(400).json({ error: 'Invalid table' });

    db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (table === 'settings') {
            const settingsObj = {};
            rows.forEach(r => settingsObj[r.key] = r.value);
            return res.json(settingsObj);
        }
        
        res.json(rows);
    });
});

// POST to overwrite a table (mimics the save... methods from localStorage)
app.post('/api/save/:table', (req, res) => {
    const table = req.params.table;
    if (!tables.includes(table)) return res.status(400).json({ error: 'Invalid table' });

    const data = req.body; 

    if (table === 'settings') {
        db.serialize(() => {
            db.run("DELETE FROM settings", (err) => {
                if (err) return res.status(500).json({ error: err.message });
                const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
                for (const key in data) {
                    stmt.run(key, data[key]);
                }
                stmt.finalize();
                res.json({ success: true });
            });
        });
        return;
    }

    if (!Array.isArray(data)) return res.status(400).json({ error: 'Expected an array' });

    db.serialize(() => {
        db.run(`DELETE FROM ${table}`, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            
            if (data.length === 0) return res.json({ success: true });

            const keys = Object.keys(data[0]);
            const placeholders = keys.map(() => '?').join(',');
            const stmt = db.prepare(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`);
            
            data.forEach(item => {
                const values = keys.map(k => item[k]);
                stmt.run(values);
            });
            stmt.finalize();
            res.json({ success: true });
        });
    });
});

// SPA Fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(STATIC, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n  ✦ GlowAI Proxy + A.n.n Beauty (Express + SQLite)`);
    console.log(`  → http://localhost:${PORT}\n`);
});
