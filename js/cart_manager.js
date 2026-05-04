// ============================================
// A.n.n Beauty — Cart Manager
// ============================================

const CART_STORAGE_KEY = 'ann_beauty_cart';

export const cartManager = {
    getCart() {
        const cart = localStorage.getItem(CART_STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
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
            cart.push({ ...product, quantity: 1 });
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

    clearCart() {
        this.saveCart([]);
    },

    getTotal() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
            return sum + (price * item.quantity);
        }, 0);
    },

    getItemCount() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }
};
