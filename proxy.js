/**
 * GlowAI Proxy Server + Express API
 * Serves the static A.n.n Beauty app, proxies /api/chat → OpenAI,
 * provides REST API for the SQLite database, and handles secure Authentication
 * with Real Email sending (Nodemailer / SMTP).
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const https = require('https');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('./server/db');

const app = express();
const PORT = process.env.PORT || 5500;
const STATIC = __dirname;

app.use(cors());
app.use(express.json());
app.use(express.static(STATIC)); // Serve HTML/JS/CSS files

// ── Serviço de Envio Real de E-mail (Nodemailer) ───────────────────────────
let cachedTestAccount = null;

async function getEmailTransporter() {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
        return {
            transporter: nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                secure: process.env.SMTP_SECURE === 'true',
                auth: { user: smtpUser, pass: smtpPass }
            }),
            from: process.env.SMTP_FROM || `"Beleza na Web" <${smtpUser}>`,
            isTest: false
        };
    }

    // Fallback de teste real (Ethereal Email - entrega e gera URL pública de inspeção)
    if (!cachedTestAccount) {
        cachedTestAccount = await nodemailer.createTestAccount();
        console.log('  [Nodemailer] Conta SMTP de testes inicializada:', cachedTestAccount.user);
    }
    return {
        transporter: nodemailer.createTransport({
            host: cachedTestAccount.smtp.host,
            port: cachedTestAccount.smtp.port,
            secure: cachedTestAccount.smtp.secure,
            auth: { user: cachedTestAccount.user, pass: cachedTestAccount.pass }
        }),
        from: '"Beleza na Web" <nao-responda@annbeauty.com>',
        isTest: true
    };
}

async function sendVerificationEmail(toEmail, code) {
    const { transporter, from, isTest } = await getEmailTransporter();

    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F6F5FB; margin: 0; padding: 24px 10px; color: #1E1228; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 28px; padding: 36px 30px; border: 1px solid #DDD0E8; box-shadow: 0 10px 30px rgba(139,95,191,0.08); }
        .header { text-align: center; margin-bottom: 24px; }
        .logo { font-size: 22px; font-weight: 700; color: #8B5FBF; letter-spacing: -0.02em; }
        .title { font-size: 24px; font-weight: 700; color: #2D1A40; margin: 12px 0 8px; }
        .desc { font-size: 14px; color: #5C4D6B; line-height: 1.6; }
        .code-box { background: #FAF7FD; border: 2px dashed #8B5FBF; border-radius: 20px; padding: 22px; text-align: center; margin: 26px 0; }
        .code { font-family: monospace; font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #8B5FBF; }
        .code-caption { font-size: 11px; color: #8F7EAA; margin-top: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
        .expiry { font-size: 13px; color: #5C4D6B; text-align: center; margin-bottom: 24px; }
        .warning { font-size: 11px; color: #8F7EAA; line-height: 1.6; border-top: 1px solid #F0E8F7; padding-top: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo">✦ Beleza na Web ✦</div>
          <h1 class="title">Recuperação de Senha</h1>
          <p class="desc">Olá! Recebemos uma solicitação para redefinir a senha da sua conta <strong>${toEmail}</strong>.</p>
        </div>

        <div class="code-box">
          <div class="code">${code}</div>
          <div class="code-caption">Código de Verificação Temporário</div>
        </div>

        <p class="expiry">⏱️ Este código é válido por <strong>10 minutos</strong>. Nunca o compartilhe com ninguém.</p>

        <div class="warning">
          Se você não solicitou a redefinição de senha, ignore este e-mail com segurança. Sua conta continua protegida.
          <br><br>
          © 2026 Beleza na Web — Skincare Etéreo & Rituais de Luxo.
        </div>
      </div>
    </body>
    </html>
    `;

    const info = await transporter.sendMail({
        from: from,
        to: toEmail,
        subject: `${code} é seu código de recuperação — Beleza na Web`,
        text: `Seu código de verificação para redefinir a senha na Beleza na Web é: ${code}. Válido por 10 minutos.`,
        html: html
    });

    console.log(`\n  ✦ [E-MAIL REAL ENVIADO]`);
    console.log(`    Destinatário: ${toEmail}`);
    console.log(`    Código:       ${code}`);
    console.log(`    Message ID:   ${info.messageId}`);

    let previewUrl = null;
    if (isTest) {
        previewUrl = nodemailer.getTestMessageUrl(info);
        console.log(`    Visualizar E-mail Real no Ethereal: ${previewUrl}\n`);
    }

    return { success: true, messageId: info.messageId, previewUrl };
}

// ── Endpoints de Autenticação Segura ─────────────────────────────────────────

// Cadastro Seguro com Hash
app.post('/api/auth/register', (req, res) => {
    const { name, email, password, accountType } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Nome, e-mail e senha são obrigatórios.' });
    }
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail.includes('@') || password.length < 4) {
        return res.status(400).json({ success: false, message: 'E-mail inválido ou senha menor que 4 caracteres.' });
    }

    db.get('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (row) {
            return res.status(409).json({ success: false, message: 'Este e-mail já está cadastrado.' });
        }

        const id = 'usr_' + Date.now();
        const role = accountType === 'comercial' ? 'seller' : 'client';
        const status = 'active';
        const joined = new Date().toLocaleDateString('pt-BR');
        const hashedPassword = db.hashPassword(password);

        db.run('INSERT INTO users (id, name, email, role, status, joined, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, name, cleanEmail, role, status, joined, hashedPassword],
            (insertErr) => {
                if (insertErr) return res.status(500).json({ success: false, message: insertErr.message });
                res.status(201).json({
                    success: true,
                    user: { id, name, email: cleanEmail, role, status, joined, accountType: accountType || 'pessoal' }
                });
            }
        );
    });
});

// Login Seguro com Validação de Hash
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios.' });
    }
    const cleanEmail = email.toLowerCase().trim();

    db.get('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail], (err, user) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!user) {
            return res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
        }

        if (user.status === 'suspended') {
            return res.status(403).json({ success: false, message: 'Sua conta está suspensa. Entre em contato com o suporte.' });
        }

        const valid = db.verifyPassword(password, user.password);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
        }

        // Automatic security upgrade: se era senha em texto plano legado, atualiza para scrypt
        if (!user.password || !user.password.includes(':')) {
            const secureHash = db.hashPassword(password);
            db.run('UPDATE users SET password = ? WHERE id = ?', [secureHash, user.id]);
        }

        delete user.password;
        res.json({ success: true, user });
    });
});

// Solicitar Código Real de Recuperação por E-mail
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'Informe um e-mail válido.' });
    }
    const cleanEmail = email.toLowerCase().trim();
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const fifteenMinAgo = now - 15 * 60 * 1000;

    // Rate Limiting: máx 3 solicitações por e-mail nos últimos 15 min
    db.get('SELECT COUNT(*) as count FROM auth_rate_limits WHERE email = ? AND action = ? AND created_at > ?',
        [cleanEmail, 'forgot-password', fifteenMinAgo],
        async (rateErr, rateRow) => {
            if (rateRow && rateRow.count >= 3) {
                return res.status(429).json({
                    success: false,
                    message: 'Muitas tentativas para este e-mail. Por segurança, aguarde 15 minutos antes de solicitar novamente.'
                });
            }

            // Registrar tentativa de rate limit
            db.run('INSERT INTO auth_rate_limits (ip, email, action, created_at) VALUES (?, ?, ?, ?)',
                [clientIp, cleanEmail, 'forgot-password', now]);

            // Verificar se o usuário existe no banco de dados (ou criar conta automaticamente se for primeiro acesso)
            db.get('SELECT id, name, email FROM users WHERE LOWER(email) = ?', [cleanEmail], async (err, user) => {
                if (err) return res.status(500).json({ success: false, message: 'Erro ao processar solicitação.' });

                const proceedWithSending = () => {
                    // Invalida códigos anteriores ainda não usados para este e-mail
                    db.run('UPDATE password_resets SET used = 1 WHERE email = ?', [cleanEmail], async (upErr) => {
                        // Gera código criptograficamente seguro de 6 dígitos aleatório e temporário
                        const code = crypto.randomInt(100000, 1000000).toString();
                        const expiresAt = now + 10 * 60 * 1000; // Validade estrita de 10 minutos

                        db.run('INSERT INTO password_resets (email, code, expires_at, attempts, used, created_at) VALUES (?, ?, ?, 0, 0, ?)',
                            [cleanEmail, code, expiresAt, now],
                            async (insErr) => {
                                if (insErr) return res.status(500).json({ success: false, message: 'Erro ao registrar código.' });

                                try {
                                    const emailResult = await sendVerificationEmail(cleanEmail, code);
                                    res.json({
                                        success: true,
                                        message: 'Código de verificação enviado com sucesso para seu e-mail! Verifique sua caixa de entrada e spam.',
                                        previewUrl: emailResult.previewUrl || null
                                    });
                                } catch (mailErr) {
                                    console.error('Erro ao enviar e-mail via Nodemailer:', mailErr);
                                    res.status(500).json({
                                        success: false,
                                        message: 'Não foi possível enviar o e-mail no momento. Verifique sua conexão e tente novamente.'
                                    });
                                }
                            }
                        );
                    });
                };

                if (!user) {
                    const newId = 'usr_' + Date.now();
                    const newName = cleanEmail.split('@')[0];
                    const joined = new Date().toLocaleDateString('pt-BR');
                    db.run('INSERT INTO users (id, name, email, role, status, joined, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        [newId, newName, cleanEmail, 'client', 'active', joined, ''],
                        (createErr) => {
                            if (createErr) console.warn('Aviso ao registrar usuário prévio:', createErr.message);
                            proceedWithSending();
                        }
                    );
                } else {
                    proceedWithSending();
                }
            });
        }
    );
});

// Validar Código de Verificação
app.post('/api/auth/verify-code', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
        return res.status(400).json({ success: false, message: 'E-mail e código são obrigatórios.' });
    }
    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.toString().trim();
    const now = Date.now();

    db.get('SELECT * FROM password_resets WHERE email = ? AND used = 0 ORDER BY id DESC LIMIT 1', [cleanEmail], (err, record) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!record) {
            return res.status(400).json({ success: false, message: 'Nenhum código ativo encontrado para este e-mail. Solicite um novo código.' });
        }

        if (now > record.expires_at) {
            return res.status(400).json({ success: false, message: 'O código expirou. Solicite um novo código de verificação.' });
        }

        if (record.attempts >= 5) {
            db.run('UPDATE password_resets SET used = 1 WHERE id = ?', [record.id]);
            return res.status(400).json({ success: false, message: 'Limite de tentativas excedido para este código. Solicite um novo.' });
        }

        if (record.code !== cleanCode) {
            db.run('UPDATE password_resets SET attempts = attempts + 1 WHERE id = ?', [record.id]);
            return res.status(400).json({ success: false, message: 'Código de verificação incorreto.' });
        }

        res.json({ success: true, message: 'Código verificado com sucesso!' });
    });
});

// Redefinir Senha
app.post('/api/auth/reset-password', (req, res) => {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
        return res.status(400).json({ success: false, message: 'E-mail, código e nova senha são obrigatórios.' });
    }
    if (newPassword.trim().length < 4) {
        return res.status(400).json({ success: false, message: 'A nova senha deve ter no mínimo 4 caracteres.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.toString().trim();
    const now = Date.now();

    db.get('SELECT * FROM password_resets WHERE email = ? AND used = 0 ORDER BY id DESC LIMIT 1', [cleanEmail], (err, record) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!record || record.code !== cleanCode) {
            return res.status(400).json({ success: false, message: 'Código inválido ou já utilizado.' });
        }

        if (now > record.expires_at) {
            return res.status(400).json({ success: false, message: 'O código expirou. Solicite um novo código.' });
        }

        // Marcar código como utilizado para impedir reutilização
        db.run('UPDATE password_resets SET used = 1 WHERE id = ?', [record.id], (upErr) => {
            const hashedPassword = db.hashPassword(newPassword.trim());

            // Atualiza senha no banco de dados SQLite com hash seguro
            db.run('UPDATE users SET password = ? WHERE LOWER(email) = ?', [hashedPassword, cleanEmail], function (userUpErr) {
                if (userUpErr) return res.status(500).json({ success: false, message: userUpErr.message });
                
                res.json({
                    success: true,
                    message: 'Senha alterada com sucesso! Você já pode entrar com a nova senha.'
                });
            });
        });
    });
});


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
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(STATIC, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n  ✦ GlowAI Proxy + A.n.n Beauty (Express + SQLite)`);
    console.log(`  → http://localhost:${PORT}\n`);
});
