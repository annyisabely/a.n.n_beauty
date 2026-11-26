// ============================================
// Beleza na Web — Cart Manager
// ============================================

import { auth } from './auth.js';

const CART_STORAGE_KEY = 'ann_beauty_cart';

// Cupons padrão pré-cadastrados para demonstração
const DEFAULT_COUPONS = [
    { code: 'BELEZA10', value: '10', label: '10% OFF' },
    { code: 'PRIMEIRACOMPRA', value: '15', label: '15% OFF' },
    { code: 'VIP20', value: '20', label: '20% OFF' },
    { code: 'FRETE5', value: '5', label: '5% OFF' },
    { code: 'BEAUTY25', value: '25', label: '25% OFF' },
];

// Garante que os cupons padrão estão no localStorage
function ensureDefaultCoupons() {
    const existing = JSON.parse(localStorage.getItem('ann_coupons') || '[]');
    if (existing.length === 0) {
        localStorage.setItem('ann_coupons', JSON.stringify(DEFAULT_COUPONS));
    }
}
ensureDefaultCoupons();

// Dados simulados de frete por região (2 primeiros dígitos do CEP)
const SHIPPING_DATA = {
    // São Paulo capital (01-09)
    '01': { valor: 12.90, prazo: '2-3 dias úteis', transportadora: 'Correios SEDEX' },
    '02': { valor: 12.90, prazo: '2-3 dias úteis', transportadora: 'Correios SEDEX' },
    '03': { valor: 12.90, prazo: '2-3 dias úteis', transportadora: 'Correios SEDEX' },
    '04': { valor: 12.90, prazo: '2-3 dias úteis', transportadora: 'Correios SEDEX' },
    '05': { valor: 12.90, prazo: '2-3 dias úteis', transportadora: 'Correios SEDEX' },
    '06': { valor: 15.90, prazo: '3-4 dias úteis', transportadora: 'Correios PAC' },
    '07': { valor: 15.90, prazo: '3-4 dias úteis', transportadora: 'Correios PAC' },
    '08': { valor: 15.90, prazo: '3-4 dias úteis', transportadora: 'Correios PAC' },
    '09': { valor: 15.90, prazo: '3-4 dias úteis', transportadora: 'Correios PAC' },
    // Rio de Janeiro (20-26)
    '20': { valor: 18.90, prazo: '3-5 dias úteis', transportadora: 'Jadlog Express' },
    '21': { valor: 18.90, prazo: '3-5 dias úteis', transportadora: 'Jadlog Express' },
    '22': { valor: 18.90, prazo: '3-5 dias úteis', transportadora: 'Jadlog Express' },
    '23': { valor: 19.90, prazo: '4-5 dias úteis', transportadora: 'Jadlog Express' },
    '24': { valor: 19.90, prazo: '4-5 dias úteis', transportadora: 'Jadlog Express' },
    '25': { valor: 21.90, prazo: '4-6 dias úteis', transportadora: 'Correios PAC' },
    '26': { valor: 21.90, prazo: '4-6 dias úteis', transportadora: 'Correios PAC' },
    // Minas Gerais (30-39)
    '30': { valor: 19.90, prazo: '3-5 dias úteis', transportadora: 'Correios SEDEX' },
    '31': { valor: 19.90, prazo: '3-5 dias úteis', transportadora: 'Correios SEDEX' },
    '32': { valor: 21.90, prazo: '4-6 dias úteis', transportadora: 'Correios PAC' },
    '33': { valor: 21.90, prazo: '4-6 dias úteis', transportadora: 'Correios PAC' },
    // Paraná / Sul (80-89)
    '80': { valor: 22.90, prazo: '4-6 dias úteis', transportadora: 'Transportadora Braspress' },
    '81': { valor: 22.90, prazo: '4-6 dias úteis', transportadora: 'Transportadora Braspress' },
    '82': { valor: 22.90, prazo: '4-6 dias úteis', transportadora: 'Transportadora Braspress' },
    '83': { valor: 24.90, prazo: '5-7 dias úteis', transportadora: 'Correios PAC' },
    // Bahia / Nordeste (40-49)
    '40': { valor: 25.90, prazo: '5-8 dias úteis', transportadora: 'Correios SEDEX' },
    '41': { valor: 25.90, prazo: '5-8 dias úteis', transportadora: 'Correios SEDEX' },
    '42': { valor: 27.90, prazo: '6-9 dias úteis', transportadora: 'Correios PAC' },
    '43': { valor: 27.90, prazo: '6-9 dias úteis', transportadora: 'Correios PAC' },
    // Norte (60-69)
    '60': { valor: 32.90, prazo: '7-12 dias úteis', transportadora: 'Correios PAC' },
    '61': { valor: 32.90, prazo: '7-12 dias úteis', transportadora: 'Correios PAC' },
    '62': { valor: 34.90, prazo: '8-13 dias úteis', transportadora: 'Correios PAC' },
    '69': { valor: 39.90, prazo: '10-15 dias úteis', transportadora: 'Correios PAC' },
};

// Valor padrão para CEPs não mapeados
const DEFAULT_SHIPPING = { valor: 28.90, prazo: '5-10 dias úteis', transportadora: 'Correios PAC' };

export const cartManager = {
    getCart() {
        const cart = localStorage.getItem(CART_STORAGE_KEY);
        const parsed = cart ? JSON.parse(cart) : [];
        // Ensure legacy items have a selected property
        return parsed.map(item => ({...item, selected: item.selected !== false}));
    },

    saveCart(cart) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
    },

    addItem(product, quantity = 1) {
        const qty = parseInt(quantity) || 1;
        const cart = this.getCart();
        const existingItem = cart.find(item => item.name === product.name || (product.id && item.id === product.id));

        if (existingItem) {
            existingItem.quantity += qty;
        } else {
            cart.push({
                ...product,
                quantity: qty,
                selected: true,
                company_name: product.company_name || 'Beleza na Web',
                company_id: product.company_id || 'ann_beauty',
                company_photo: product.company_photo || '',
            });
        }

        this.saveCart(cart);
    },

    removeItem(productName) {
        let cart = this.getCart();
        cart = cart.filter(item => item.name !== productName);
        this.saveCart(cart);
    },

    moveToFavorites(productName) {
        const cart = this.getCart();
        const item = cart.find(i => i.name === productName);
        if (item) {
            // Save to favorites using auth system
            const favItem = { ...item };
            delete favItem.quantity;
            delete favItem.selected;
            auth.toggleSaveItem(favItem, 'product');
            // Remove from cart
            this.removeItem(productName);
            return true;
        }
        return false;
    },

    updateQuantity(productName, delta) {
        const cart = this.getCart();
        const item = cart.find(item => item.name === productName);

        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeItem(productName);
                return;
            }
        }

        this.saveCart(cart);
    },

    toggleSelect(productName) {
        const cart = this.getCart();
        const item = cart.find(item => item.name === productName);
        if (item) {
            item.selected = !item.selected;
            this.saveCart(cart);
        }
    },

    toggleSelectAll(checked) {
        const cart = this.getCart();
        cart.forEach(item => item.selected = checked);
        this.saveCart(cart);
    },

    clearCart() {
        this.saveCart([]);
    },

    getSubtotal() {
        const cart = this.getCart();
        return cart.filter(i => i.selected).reduce((sum, item) => {
            const price = parseFloat(item.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
            return sum + (price * item.quantity);
        }, 0);
    },

    getTotal() {
        const cart = this.getCart();
        const subtotal = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
            return sum + (price * item.quantity);
        }, 0);
        
        const discount = this.getDiscount(subtotal);
        return subtotal - discount;
    },

    getSelectedTotal() {
        const cart = this.getCart();
        const subtotal = cart.filter(i => i.selected).reduce((sum, item) => {
            const price = parseFloat(item.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
            return sum + (price * item.quantity);
        }, 0);
        
        const discount = this.getDiscount(subtotal);
        return subtotal - discount;
    },

    getDiscount(subtotal) {
        const coupon = JSON.parse(sessionStorage.getItem('ann_active_coupon') || 'null');
        if (coupon) {
            return subtotal * (parseFloat(coupon.value) / 100);
        }
        return 0;
    },

    getActiveCoupon() {
        return JSON.parse(sessionStorage.getItem('ann_active_coupon') || 'null');
    },

    applyCoupon(code) {
        const coupons = JSON.parse(localStorage.getItem('ann_coupons') || '[]');
        const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
        if (coupon) {
            sessionStorage.setItem('ann_active_coupon', JSON.stringify(coupon));
            return coupon;
        }
        return null;
    },

    clearCoupon() {
        sessionStorage.removeItem('ann_active_coupon');
    },

    calculateShipping(cep) {
        if (!cep || cep.length < 5) return null;
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length < 2) return null;
        const prefix = cleanCep.substring(0, 2);
        return SHIPPING_DATA[prefix] || DEFAULT_SHIPPING;
    },

    getItemCount() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    },

    getSelectedItemCount() {
        const cart = this.getCart();
        return cart.filter(i => i.selected).reduce((sum, item) => sum + item.quantity, 0);
    }
};
