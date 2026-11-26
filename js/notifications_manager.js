// ============================================
// Beleza na Web — Notifications Manager
// ============================================

export const notificationsManager = {
    // Get notifications for a user by email
    getNotifications(email) {
        if (!email) return [];
        return JSON.parse(localStorage.getItem(`ann_notifications_${email}`) || '[]');
    },

    // Save notifications to storage
    saveNotifications(email, notifications) {
        localStorage.setItem(`ann_notifications_${email}`, JSON.stringify(notifications));
        window.dispatchEvent(new CustomEvent('notifications-updated'));
    },

    // Add a notification for a specific user, role, or broadcast
    addNotification(target, notif) {
        const id = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newNotif = {
            id,
            title: notif.title,
            message: notif.message,
            time: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            icon: notif.icon || 'notifications',
            color: notif.color || 'text-primary',
            read: false,
            rateLink: notif.rateLink || false,
            orderId: notif.orderId || null,
            storeId: notif.storeId || null,
            productName: notif.productName || null
        };

        if (target === 'admin') {
            // Broadcast to all admin accounts
            const admins = ['admin@annbeauty.com', 'anny.coradassi@gmail.com', 'annyisabely@gmail.com', 'belezanaweb@gmail.com', 'belezaweb@gmail.com'];
            admins.forEach(email => {
                const list = this.getNotifications(email);
                list.unshift(newNotif);
                this.saveNotifications(email, list);
            });
        } else if (target === 'seller') {
            // Broadcast to default seller account
            const list = this.getNotifications('vendedor@annbeauty.com');
            list.unshift(newNotif);
            this.saveNotifications('vendedor@annbeauty.com', list);
        } else if (target === 'all_clients') {
            // Broadcast to all registered users that are clients
            try {
                const users = JSON.parse(localStorage.getItem('ann_registered_users') || '{}');
                Object.keys(users).forEach(email => {
                    if (users[email].accountType === 'pessoal') {
                        const list = this.getNotifications(email);
                        list.unshift(newNotif);
                        this.saveNotifications(email, list);
                    }
                });
            } catch (err) {
                console.error(err);
            }
        } else {
            // Target is a specific user email
            const list = this.getNotifications(target);
            list.unshift(newNotif);
            this.saveNotifications(target, list);
        }

        // Push Web API native notification if enabled
        if (localStorage.getItem('ann_notifications_enabled') === 'true' && ("Notification" in window) && Notification.permission === "granted") {
            try {
                new Notification(`Beleza na Web: ${newNotif.title}`, {
                    body: newNotif.message,
                    icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuD41q-VUnwu5joHMxbWJsr36dy1zx3rIn2vEK7uzvQTDUffwl0ZH_HI_dTANk1KbB9owXbG4r3zHuZ0HVyYdnrM_iCEs2T28ZeOaR08HylhHFMcLQ7HbG_Sie4x-YY2ALCH46qv813TkJWK1AuLKhbgI70JyZ3h_2uFi-BnVubhKdnicfILcz2wGII7oUz38OzHYvodmNc7KWNeyoqLmi7hoHDJdbzNFetGZrb5-7anzBucsvdu8yAwBxA_KgpzWQXgXaiSjTNilD4W"
                });
            } catch (e) {
                console.warn('Failed to push browser Notification API:', e);
            }
        }
    },

    // Mark notification as read
    markAsRead(email, id) {
        const list = this.getNotifications(email);
        const item = list.find(n => n.id === id);
        if (item) {
            item.read = true;
            this.saveNotifications(email, list);
        }
    },

    // Remove a notification
    removeNotification(email, id) {
        let list = this.getNotifications(email);
        list = list.filter(n => n.id !== id);
        this.saveNotifications(email, list);
    },

    // Seed default notifications for a new user so they have items initially
    seedDefaultClientNotifications(email) {
        const initial = [
            {
                title: 'Cupom de Boas-Vindas!',
                message: 'Use o cupom PRIMEIRACOMPRA para ganhar 15% de desconto no seu primeiro ritual de beleza!',
                icon: 'local_offer',
                color: 'text-purple-500'
            },
            {
                title: 'Seu Favorito está em Promoção!',
                message: 'O Pó Facial Velvet Matte teve redução de preço para R$ 45,90. Aproveite!',
                icon: 'favorite',
                color: 'text-pink-500'
            }
        ];
        initial.forEach(n => this.addNotification(email, n));
    }
};

// Bind to window for global access
window.notificationsManager = notificationsManager;
