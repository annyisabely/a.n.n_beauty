const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const initDB = () => {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            role TEXT,
            status TEXT,
            joined TEXT
        )`);

        // Stores Table
        db.run(`CREATE TABLE IF NOT EXISTS stores (
            id TEXT PRIMARY KEY,
            name TEXT,
            logo TEXT,
            banner TEXT,
            sellerId TEXT,
            followersCount INTEGER,
            productsCount INTEGER,
            rating REAL,
            status TEXT
        )`);

        // Products Table
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            storeId TEXT,
            name TEXT,
            price TEXT,
            oldPrice TEXT,
            cat TEXT,
            desc TEXT,
            img TEXT,
            status TEXT,
            isFeatured INTEGER,
            salesCount INTEGER
        )`);

        // Orders Table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            clientId TEXT,
            clientName TEXT,
            storeName TEXT,
            totalValue REAL,
            commissionValue REAL,
            paymentMethod TEXT,
            status TEXT,
            date TEXT
        )`);

        // Reports Table
        db.run(`CREATE TABLE IF NOT EXISTS reports (
            id TEXT PRIMARY KEY,
            reporterName TEXT,
            targetType TEXT,
            targetId TEXT,
            targetName TEXT,
            reason TEXT,
            status TEXT,
            date TEXT
        )`);

        // Coupons Table
        db.run(`CREATE TABLE IF NOT EXISTS coupons (
            id TEXT PRIMARY KEY,
            code TEXT,
            discountPercent INTEGER,
            validUntil TEXT,
            usageCount INTEGER,
            status TEXT
        )`);

        // Categories Table
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT,
            icon TEXT,
            productCount INTEGER
        )`);

        // Settings Table
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )`);

        // Seed Users if empty
        db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
            if (row && row.count === 0) {
                const stmt = db.prepare("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)");
                const initialUsers = [
                    { id: 'usr_admin_anny', name: 'Anny Coradassi', email: 'anny.coradassi@gmail.com', role: 'admin', status: 'active', joined: '01/01/2026' },
                    { id: 'usr_admin', name: 'Admin Master', email: 'admin@annbeauty.com', role: 'admin', status: 'active', joined: '01/01/2026' },
                    { id: 'usr_seller_1', name: 'Glow & Co. Vendedor', email: 'vendedor@annbeauty.com', role: 'seller', status: 'active', joined: '10/01/2026' },
                    { id: 'usr_client_1', name: 'Mariana Lima', email: 'cliente@annbeauty.com', role: 'client', status: 'active', joined: '15/02/2026' },
                    { id: 'usr_client_2', name: 'Carla Amorim', email: 'carla@gmail.com', role: 'client', status: 'active', joined: '20/02/2026' },
                    { id: 'usr_client_3', name: 'Juliana Costa', email: 'ju@gmail.com', role: 'client', status: 'suspended', joined: '01/03/2026' }
                ];
                initialUsers.forEach(u => stmt.run(u.id, u.name, u.email, u.role, u.status, u.joined));
                stmt.finalize();
            }
        });

        // Seed Stores if empty
        db.get("SELECT COUNT(*) AS count FROM stores", (err, row) => {
            if (row && row.count === 0) {
                const stmt = db.prepare("INSERT INTO stores VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                const initialStores = [
                    { id: 'store_glow_co', name: 'Glow & Co. Official', logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100', banner: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200', sellerId: 'usr_seller_1', followersCount: 1240, productsCount: 350, rating: 4.9, status: 'approved' },
                    { id: 'store_botanica', name: 'Botanica Luxe Skincare', logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=100', banner: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200', sellerId: 'usr_seller_2', followersCount: 890, productsCount: 120, rating: 4.8, status: 'approved' },
                    { id: 'store_velvet', name: 'Velvet Beauty Lab', logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', banner: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200', sellerId: 'usr_seller_3', followersCount: 410, productsCount: 45, rating: 4.7, status: 'pending' }
                ];
                initialStores.forEach(s => stmt.run(s.id, s.name, s.logo, s.banner, s.sellerId, s.followersCount, s.productsCount, s.rating, s.status));
                stmt.finalize();
            }
        });

        // Seed Products if empty
        db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
            if (row && row.count === 0) {
                const stmt = db.prepare("INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                const initialProducts = [
                    { id: 'prod_velvet', storeId: 'store_glow_co', name: 'Pó Facial Velvet Matte', price: 'R$ 45,90', oldPrice: 'R$ 59,90', cat: 'Maquiagem', desc: 'Textura ultra-fina para acabamento aveludado e fosco duradouro.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD18GXwV-Fkc6wDo7J4wrXsDQej-dEfgu5VImTb9uItwdNW88u_1yCxDVF9on8jlVNCPo-eKZEl9aNMrTISfydrBo8SR077DCvYnLcSDxEAalZqqw8TZ3jpvZRULCa0zP9BNNQ-i470VZ5EDn7JHQ2btfru-a-pTCf15BaEHzY9QZpQAus_V57bsYk-VpSr7PEucVXEHnd0d4RBqKFQaBZaW1EDR4bo-Ej6RqvwLps8AyPi3RQMWfHu9arWD8Wneoh9RG_l1BG98xQC', status: 'approved', isFeatured: 1, salesCount: 184 },
                    { id: 'prod_serum', storeId: 'store_botanica', name: 'Sérum Glow Etéreo Iluminador', price: 'R$ 89,00', oldPrice: 'R$ 110,00', cat: 'Skincare', desc: 'Formulação de alta performance enriquecida com ácido hialurônico.', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', status: 'approved', isFeatured: 1, salesCount: 142 },
                    { id: 'prod_batom', storeId: 'store_glow_co', name: 'Batom Líquido Satin Rose', price: 'R$ 38,00', oldPrice: 'R$ 49,90', cat: 'Maquiagem', desc: 'Pigmentação intensa com hidratação de manteiga de karité.', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500', status: 'approved', isFeatured: 0, salesCount: 96 },
                    { id: 'prod_mascara', storeId: 'store_velvet', name: 'Máscara Capilar Nutritiva Spa', price: 'R$ 64,50', oldPrice: 'R$ 79,00', cat: 'Cabelo', desc: 'Tratamento intensivo de restauração para fios sedosos.', img: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500', status: 'pending', isFeatured: 0, salesCount: 12 }
                ];
                initialProducts.forEach(p => stmt.run(p.id, p.storeId, p.name, p.price, p.oldPrice, p.cat, p.desc, p.img, p.status, p.isFeatured, p.salesCount));
                stmt.finalize();
            }
        });

        // Seed Orders if empty
        db.get("SELECT COUNT(*) AS count FROM orders", (err, row) => {
            if (row && row.count === 0) {
                const stmt = db.prepare("INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                const initialOrders = [
                    { id: 'ORD-9842', clientId: 'usr_client_1', clientName: 'Mariana Lima', storeName: 'Glow & Co. Official', totalValue: 45.90, commissionValue: 6.88, paymentMethod: 'PIX', status: 'ENTREGUE', date: 'Hoje às 10:14' },
                    { id: 'ORD-9841', clientId: 'usr_client_2', clientName: 'Carla Amorim', storeName: 'Botanica Luxe Skincare', totalValue: 89.00, commissionValue: 13.35, paymentMethod: 'Cartão de Crédito', status: 'EM SEPARAÇÃO', date: 'Ontem às 18:30' },
                    { id: 'ORD-9840', clientId: 'usr_client_3', clientName: 'Juliana Costa', storeName: 'Glow & Co. Official', totalValue: 127.00, commissionValue: 19.05, paymentMethod: 'Boleto', status: 'PENDENTE', date: 'Há 2 dias' }
                ];
                initialOrders.forEach(o => stmt.run(o.id, o.clientId, o.clientName, o.storeName, o.totalValue, o.commissionValue, o.paymentMethod, o.status, o.date));
                stmt.finalize();
            }
        });

        // Seed Reports if empty
        db.get("SELECT COUNT(*) AS count FROM reports", (err, row) => {
            if (row && row.count === 0) {
                const stmt = db.prepare("INSERT INTO reports VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                const initialReports = [
                    { id: 'rep_1', reporterName: 'Mariana Lima', targetType: 'produto', targetId: 'prod_mascara', targetName: 'Máscara Capilar Nutritiva Spa', reason: 'Descrição divergente do conteúdo da embalagem', status: 'pending', date: 'Há 1 dia' },
                    { id: 'rep_2', reporterName: 'Carla Amorim', targetType: 'usuario', targetId: 'usr_client_3', targetName: 'Juliana Costa', reason: 'Comentários inadequados na avaliação do produto', status: 'pending', date: 'Há 3 dias' }
                ];
                initialReports.forEach(r => stmt.run(r.id, r.reporterName, r.targetType, r.targetId, r.targetName, r.reason, r.status, r.date));
                stmt.finalize();
            }
        });

        // Seed Coupons if empty
        db.get("SELECT COUNT(*) AS count FROM coupons", (err, row) => {
            if (row && row.count === 0) {
                const stmt = db.prepare("INSERT INTO coupons VALUES (?, ?, ?, ?, ?, ?)");
                const initialCoupons = [
                    { id: 'cup_1', code: 'ANNBEAUTY10', discountPercent: 10, validUntil: '31/12/2026', usageCount: 420, status: 'active' },
                    { id: 'cup_2', code: 'GLOW20', discountPercent: 20, validUntil: '30/11/2026', usageCount: 180, status: 'active' }
                ];
                initialCoupons.forEach(c => stmt.run(c.id, c.code, c.discountPercent, c.validUntil, c.usageCount, c.status));
                stmt.finalize();
            }
        });

        // Seed Categories if empty
        db.get("SELECT COUNT(*) AS count FROM categories", (err, row) => {
            if (row && row.count === 0) {
                const stmt = db.prepare("INSERT INTO categories VALUES (?, ?, ?, ?)");
                const initialCategories = [
                    { id: 'cat_1', name: 'Maquiagem', icon: 'palette', productCount: 140 },
                    { id: 'cat_2', name: 'Skincare', icon: 'spa', productCount: 110 },
                    { id: 'cat_3', name: 'Cabelo', icon: 'content_cut', productCount: 65 },
                    { id: 'cat_4', name: 'Corpo e Banho', icon: 'clean_hands', productCount: 35 }
                ];
                initialCategories.forEach(c => stmt.run(c.id, c.name, c.icon, c.productCount));
                stmt.finalize();
            }
        });

        // Seed Settings if empty
        db.get("SELECT COUNT(*) AS count FROM settings", (err, row) => {
            if (row && row.count === 0) {
                const stmt = db.prepare("INSERT INTO settings VALUES (?, ?)");
                const initialSettings = {
                    platformName: 'A.n.n Beauty Marketplace',
                    logoUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100',
                    mainBannerUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200',
                    commissionRate: '15.0', // 15%
                    shippingFee: 'R$ 12,90 (Grátis acima de R$ 150)',
                    paymentMethods: 'Cartão de Crédito, PIX, Boleto Bancário',
                    termsOfUse: 'Políticas do marketplace A.n.n Beauty para proteção ao consumidor e curadoria de cosméticos.'
                };
                Object.keys(initialSettings).forEach(key => {
                    stmt.run(key, initialSettings[key]);
                });
                stmt.finalize();
            }
        });
    });
};

initDB();

module.exports = db;
