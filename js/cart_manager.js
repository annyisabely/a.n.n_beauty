// ============================================
// Beleza na Web — Cart Manager
// ============================================

const CART_STORAGE_KEY = 'ann_beauty_cart';

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

    addItem(product) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.name === product.name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1, selected: true });
        }

        this.saveCart(cart);
    },

    removeItem(productName) {
        let cart = this.getCart();
        cart = cart.filter(item => item.name !== productName);
        this.saveCart(cart);
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

    getTotal() {
        // Keeps total of ALL items for backward compatibility if needed
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

    getItemCount() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    },

    getSelectedItemCount() {
        const cart = this.getCart();
        return cart.filter(i => i.selected).reduce((sum, item) => sum + item.quantity, 0);
    }
};
