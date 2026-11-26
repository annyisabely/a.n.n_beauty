// ============================================
// Beleza na Web — Marketplace Database System
// Resilient Offline-First Architecture (SQLite API + localStorage fallback)
// ============================================

const API_BASE = 'http://localhost:5500/api';

const DEFAULT_USERS = [
    { id: 'usr_admin_anny', name: 'Anny Coradassi', email: 'anny.coradassi@gmail.com', role: 'admin_master', status: 'active', joined: '01/01/2026' },
    { id: 'usr_admin', name: 'Admin Master', email: 'admin@annbeauty.com', role: 'admin_master', status: 'active', joined: '01/01/2026' },
    { id: 'usr_seller_1', name: 'Glow & Co. Vendedor', email: 'vendedor@annbeauty.com', role: 'seller', status: 'active', joined: '10/01/2026' },
    { id: 'usr_client_1', name: 'Mariana Lima', email: 'cliente@annbeauty.com', role: 'client', status: 'active', joined: '15/02/2026' },
    { id: 'usr_client_2', name: 'Carla Amorim', email: 'carla@gmail.com', role: 'client', status: 'active', joined: '20/02/2026' },
    { id: 'usr_client_3', name: 'Juliana Costa', email: 'ju@gmail.com', role: 'client', status: 'suspended', joined: '01/03/2026' },
    { id: 'usr_elvertoni', name: 'Elvertoni', email: 'elvertoni@gmail.com', role: 'admin', status: 'active', joined: '01/11/2026' }
];

const DEFAULT_STORES = [
    { id: 'ann_beauty', name: 'Beleza na Web Official', logo: 'img/logo.png', banner: 'img/hero_skin_spa.jpg', sellerId: 'usr_admin_anny', followersCount: 1420, productsCount: 350, rating: 4.9, status: 'approved' },
    { id: 'store_glow_co', name: 'Glow & Co. Official', logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100', banner: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200', sellerId: 'usr_seller_1', followersCount: 1240, productsCount: 350, rating: 4.9, status: 'approved' },
    { id: 'store_botanica', name: 'Botanica Luxe Skincare', logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=100', banner: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200', sellerId: 'usr_seller_2', followersCount: 890, productsCount: 120, rating: 4.8, status: 'approved' },
    { id: 'store_velvet', name: 'Velvet Beauty Lab', logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', banner: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200', sellerId: 'usr_seller_3', followersCount: 410, productsCount: 45, rating: 4.7, status: 'approved' }
];

const DEFAULT_PRODUCTS = [
    { id: 'prod_velvet', storeId: 'store_glow_co', name: 'Pó Facial Velvet Matte', price: 'R$ 45,90', oldPrice: 'R$ 59,90', cat: 'Maquiagem', desc: 'Textura ultra-fina para acabamento aveludado e fosco duradouro.', img: 'img/paleta_sombras_1791458911527.jpg', status: 'approved', isFeatured: 1, salesCount: 184 },
    { id: 'prod_serum', storeId: 'store_botanica', name: 'Sérum Glow Etéreo Iluminador', price: 'R$ 89,00', oldPrice: 'R$ 110,00', cat: 'Skincare', desc: 'Formulação de alta performance enriquecida com ácido hialurônico.', img: 'img/serum_facial_1791458880967.jpg', status: 'approved', isFeatured: 1, salesCount: 142 },
    { id: 'prod_batom', storeId: 'store_glow_co', name: 'Batom Líquido Satin Rose', price: 'R$ 38,00', oldPrice: 'R$ 49,90', cat: 'Maquiagem', desc: 'Pigmentação intensa com hidratação de manteiga de karité.', img: 'img/batom_matte_1791458925028.jpg', status: 'approved', isFeatured: 0, salesCount: 96 },
    { id: 'prod_mascara', storeId: 'store_velvet', name: 'Máscara Capilar Nutritiva Spa', price: 'R$ 64,50', oldPrice: 'R$ 79,00', cat: 'Cabelo', desc: 'Tratamento intensivo de restauração para fios sedosos.', img: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500', status: 'approved', isFeatured: 1, salesCount: 88 }
];

const DEFAULT_ORDERS = [
    { id: 'ANN-984201-GLW', clientId: 'cliente@annbeauty.com', clientName: 'Mariana Lima', storeName: 'Glow & Co. Official', totalValue: 45.90, commissionValue: 6.88, paymentMethod: 'PIX (Instantâneo)', status: 'ENTREGUE', date: 'Hoje às 10:14', items: JSON.stringify([{ id: 'prod_velvet', name: 'Pó Facial Velvet Matte', price: 'R$ 45,90', quantity: 1, img: 'img/paleta_sombras_1791458911527.jpg' }]), address: JSON.stringify({ cep: '01310-100', rua: 'Av. Paulista', numero: '1000', bairro: 'Bela Vista', cidade: 'São Paulo/SP' }) },
    { id: 'ANN-984102-BOT', clientId: 'carla@gmail.com', clientName: 'Carla Amorim', storeName: 'Botanica Luxe Skincare', totalValue: 89.00, commissionValue: 13.35, paymentMethod: 'Cartão de Crédito', status: 'SAIU PARA ENTREGA', date: 'Ontem às 18:30', items: JSON.stringify([{ id: 'prod_serum', name: 'Sérum Glow Etéreo Iluminador', price: 'R$ 89,00', quantity: 1, img: 'img/serum_facial_1791458880967.jpg' }]), address: JSON.stringify({ cep: '20040-002', rua: 'Rua do Catete', numero: '200', bairro: 'Flamengo', cidade: 'Rio de Janeiro/RJ' }) },
    { id: 'ANN-984003-GLW', clientId: 'ju@gmail.com', clientName: 'Juliana Costa', storeName: 'Glow & Co. Official', totalValue: 127.00, commissionValue: 19.05, paymentMethod: 'PIX (Instantâneo)', status: 'PREPARANDO', date: 'Há 2 dias', items: JSON.stringify([{ id: 'prod_batom', name: 'Batom Líquido Satin Rose', price: 'R$ 38,00', quantity: 2, img: 'img/batom_matte_1791458925028.jpg' }]), address: JSON.stringify({ cep: '80010-000', rua: 'Rua XV de Novembro', numero: '500', bairro: 'Centro', cidade: 'Curitiba/PR' }) }
];

const DEFAULT_REPORTS = [
    { id: 'rep_1', reporterName: 'Mariana Lima', targetType: 'produto', targetId: 'prod_mascara', targetName: 'Máscara Capilar Nutritiva Spa', reason: 'Dúvida na especificação do rótulo', status: 'pending', date: 'Há 1 dia' },
    { id: 'rep_2', reporterName: 'Carla Amorim', targetType: 'usuario', targetId: 'usr_client_3', targetName: 'Juliana Costa', reason: 'Comentário fora das diretrizes', status: 'resolved', date: 'Há 3 dias' }
];

const DEFAULT_COUPONS = [
    { id: 'cup_1', code: 'ANNBEAUTY10', discountPercent: 10, validUntil: '31/12/2026', usageCount: 420, status: 'active' },
    { id: 'cup_2', code: 'GLOW20', discountPercent: 20, validUntil: '30/11/2026', usageCount: 180, status: 'active' },
    { id: 'cup_3', code: 'BELEZA10', discountPercent: 10, validUntil: '31/12/2026', usageCount: 520, status: 'active' },
    { id: 'cup_4', code: 'PRIMEIRACOMPRA', discountPercent: 15, validUntil: '31/12/2026', usageCount: 890, status: 'active' }
];

const DEFAULT_CATEGORIES = [
    { id: 'cat_1', name: 'Maquiagem', icon: 'palette', productCount: 140 },
    { id: 'cat_2', name: 'Skincare', icon: 'spa', productCount: 110 },
    { id: 'cat_3', name: 'Cabelo', icon: 'content_cut', productCount: 65 },
    { id: 'cat_4', name: 'Corpo & Banho', icon: 'clean_hands', productCount: 45 },
    { id: 'cat_5', name: 'Perfumes', icon: 'local_florist', productCount: 30 },
    { id: 'cat_6', name: 'Unhas', icon: 'brush', productCount: 25 }
];

const DEFAULT_SETTINGS = {
    platformName: 'Beleza na Web Marketplace',
    logoUrl: 'img/logo.png',
    mainBannerUrl: 'img/hero_skin_spa.jpg',
    commissionRate: 15.0,
    shippingFee: 'R$ 12,90 (Grátis acima de R$ 199)',
    paymentMethods: 'Cartão de Crédito, PIX, Boleto Bancário',
    termsOfUse: 'Políticas do marketplace Beleza na Web para curadoria de cosméticos e proteção ao consumidor.'
};

// Helper: safe localStorage access
const getLocal = (key, fallback) => {
    try {
        const val = localStorage.getItem(`ann_db_${key}`);
        if (val) return JSON.parse(val);
    } catch (e) {}
    // Seed initial
    setLocal(key, fallback);
    return fallback;
};

const setLocal = (key, data) => {
    try {
        localStorage.setItem(`ann_db_${key}`, JSON.stringify(data));
    } catch (e) {}
};

// Background async sync with server if reachable
const syncWithServer = (table, data) => {
    try {
        fetch(`${API_BASE}/save/${table}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(() => {});
    } catch (e) {}
};

export const database = {
    init: () => {
        // Ensure all collections exist in localStorage
        getLocal('users', DEFAULT_USERS);
        getLocal('stores', DEFAULT_STORES);
        getLocal('products', DEFAULT_PRODUCTS);
        getLocal('orders', DEFAULT_ORDERS);
        getLocal('reports', DEFAULT_REPORTS);
        getLocal('coupons', DEFAULT_COUPONS);
        getLocal('categories', DEFAULT_CATEGORIES);
        getLocal('settings', DEFAULT_SETTINGS);

        // Try to pull fresh server records if backend is running
        try {
            fetch(`${API_BASE}/orders`).then(r => r.ok ? r.json() : null).then(orders => {
                if (orders && Array.isArray(orders) && orders.length > 0) {
                    setLocal('orders', orders);
                }
            }).catch(() => {});
        } catch (e) {}
    },

    getUsers: () => getLocal('users', DEFAULT_USERS),
    saveUsers: (users) => {
        setLocal('users', users);
        syncWithServer('users', users);
        return { success: true };
    },

    getStores: () => getLocal('stores', DEFAULT_STORES),
    saveStores: (stores) => {
        setLocal('stores', stores);
        syncWithServer('stores', stores);
        return { success: true };
    },

    getProducts: () => getLocal('products', DEFAULT_PRODUCTS),
    saveProducts: (products) => {
        setLocal('products', products);
        syncWithServer('products', products);
        return { success: true };
    },

    getOrders: () => {
        const orders = getLocal('orders', DEFAULT_ORDERS);
        // Also check localStorage client orders to ensure any just-placed order is immediately present
        try {
            const clientOrders = JSON.parse(localStorage.getItem('ann_orders') || '[]');
            clientOrders.forEach(co => {
                const exists = orders.some(o => o.id === co.id);
                if (!exists) {
                    orders.unshift({
                        ...co,
                        items: typeof co.items === 'object' ? JSON.stringify(co.items) : co.items,
                        address: typeof co.address === 'object' ? JSON.stringify(co.address) : co.address
                    });
                }
            });
        } catch (e) {}
        return orders;
    },
    saveOrders: (orders) => {
        setLocal('orders', orders);
        syncWithServer('orders', orders);
        return { success: true };
    },

    getReports: () => getLocal('reports', DEFAULT_REPORTS),
    saveReports: (reports) => {
        setLocal('reports', reports);
        syncWithServer('reports', reports);
        return { success: true };
    },

    getCoupons: () => getLocal('coupons', DEFAULT_COUPONS),
    saveCoupons: (coupons) => {
        setLocal('coupons', coupons);
        syncWithServer('coupons', coupons);
        return { success: true };
    },

    getCategories: () => getLocal('categories', DEFAULT_CATEGORIES),
    saveCategories: (categories) => {
        setLocal('categories', categories);
        syncWithServer('categories', categories);
        return { success: true };
    },

    getSettings: () => getLocal('settings', DEFAULT_SETTINGS),
    saveSettings: (settings) => {
        setLocal('settings', settings);
        syncWithServer('settings', settings);
        return { success: true };
    }
};

// Initialize database
database.init();
window.database = database;

