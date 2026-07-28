// ============================================
// Beleza na Web — Marketplace Database System
// ============================================

const API_BASE = 'http://localhost:5500/api';

const fetchSync = (url) => {
    try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, false); // false = synchronous
        xhr.send(null);
        if (xhr.status === 200) {
            return JSON.parse(xhr.responseText);
        }
    } catch (e) {
        console.error('Error fetching sync:', e);
    }
    return null;
};

const postSync = (url, data) => {
    try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, false); // false = synchronous
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
        if (xhr.status === 200) {
            return JSON.parse(xhr.responseText);
        }
    } catch (e) {
        console.error('Error posting sync:', e);
    }
    return null;
};

export const database = {
    // Initializer to seed database (Now handled by the SQLite backend automatically)
    init: () => {
        console.log('Database connected via SQLite API');
    },

    // CRUD Helper Methods backed by SQLite
    getUsers: () => fetchSync(`${API_BASE}/users`) || [],
    saveUsers: (users) => postSync(`${API_BASE}/save/users`, users),

    getStores: () => fetchSync(`${API_BASE}/stores`) || [],
    saveStores: (stores) => postSync(`${API_BASE}/save/stores`, stores),

    getProducts: () => fetchSync(`${API_BASE}/products`) || [],
    saveProducts: (products) => postSync(`${API_BASE}/save/products`, products),

    getOrders: () => fetchSync(`${API_BASE}/orders`) || [],
    saveOrders: (orders) => postSync(`${API_BASE}/save/orders`, orders),

    getReports: () => fetchSync(`${API_BASE}/reports`) || [],
    saveReports: (reports) => postSync(`${API_BASE}/save/reports`, reports),

    getCoupons: () => fetchSync(`${API_BASE}/coupons`) || [],
    saveCoupons: (coupons) => postSync(`${API_BASE}/save/coupons`, coupons),

    getCategories: () => fetchSync(`${API_BASE}/categories`) || [],
    saveCategories: (categories) => postSync(`${API_BASE}/save/categories`, categories),

    getSettings: () => fetchSync(`${API_BASE}/settings`) || {},
    saveSettings: (settings) => postSync(`${API_BASE}/save/settings`, settings)
};

// Initialize database on import
database.init();
window.database = database;
