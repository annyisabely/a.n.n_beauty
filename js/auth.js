// ============================================
// A.n.n Beauty — Authentication System
// ============================================

/**
 * Simulates authentication using localStorage
 */
export const auth = {
    // Check if user is logged in
    isLoggedIn: () => {
        return localStorage.getItem('ann_beauty_user') !== null;
    },

    // Get current user data
    getUser: () => {
        const userData = localStorage.getItem('ann_beauty_user');
        return userData ? JSON.parse(userData) : null;
    },

    // Login with name and email/phone
    login: (name, emailOrPhone, password, accountType = 'pessoal') => {
        const email = emailOrPhone.includes('@') ? emailOrPhone : 'usuario@email.com';
        
        // Load existing profile for this email if it exists
        const savedProfile = localStorage.getItem(`ann_profile_${email}`);
        const profileData = savedProfile ? JSON.parse(savedProfile) : {
            bio: '"Entusiasta de beleza etérea | Minimalista em skincare ✨"',
            photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC77ZoIlcWkWMv6PoHvkxSm9AoIAod0TJnJZWF2MeQxi2AruIoztM2Esx1b7bu7WxXGBGql9gTS2qlzljZWZAgMwk3SP1E-X-LjEVwToyizyz0TQShvF0SJnfPxI85iPPDiyG4Hcj8ZowqeUsmVL7FgblL1dmjET0-akwNh34c4Wg5a6Miix5O7Dh_wwJUW2CLFx_SwKVGVqV0yXrLrcEmYdC9FimpquKe5z8CwL80QMWe0xc3-uZYa93ToeCwEUhDkvbtB7Ccw8obU',
            followers: 0,
            following: 0,
            postsCount: 0
        };

        let role = profileData.role;
        let company_id = profileData.company_id;
        let company_name = profileData.company_name;

        // Lista de e-mails com acesso admin_master (adicione qualquer e-mail aqui)
        const ADMIN_EMAILS = [
            'annyisabely@gmail.com',
            'admin@annbeauty.com',
        ];

        // Lógica de cargos
        if (ADMIN_EMAILS.includes(email.toLowerCase())) {
            role = 'admin_master';
        } else if (!role || (role === 'user' && accountType === 'comercial')) {
            // Set or upgrade role based on accountType
            if (accountType === 'comercial') {
                role = 'empresa';
                company_id = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_');
                company_name = name;
            } else {
                role = 'user';
            }
        }


        const user = {
            name: name || 'Usuária A.n.n',
            email: email,
            phone: !emailOrPhone.includes('@') ? emailOrPhone : '',
            role: role,
            company_id: company_id,
            company_name: company_name,
            joined: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
            bio: profileData.bio,
            photo: profileData.photo,
            followers: profileData.followers,
            following: profileData.following,
            postsCount: profileData.postsCount
        };
        
        localStorage.setItem('ann_beauty_user', JSON.stringify(user));
        
        // Save back to specific key to persist these stats and roles
        localStorage.setItem(`ann_profile_${email}`, JSON.stringify({
            bio: user.bio,
            photo: user.photo,
            followers: user.followers,
            following: user.following,
            postsCount: user.postsCount,
            role: user.role,
            company_id: user.company_id,
            company_name: user.company_name
        }));
        
        // Also ensure these are in current "global" keys for backward compatibility with existing components
        localStorage.setItem('ann_profile_bio', user.bio);
        localStorage.setItem('ann_profile_photo', user.photo);
        
        // Send a browser notification if permitted
        auth.sendNotification('A.n.n Beauty', `Bem-vinda, ${user.name.split(' ')[0]}! Seu ritual de beleza te espera.`);

        // Force header update
        window.dispatchEvent(new Event('auth-change'));
    },

    // Helper to send browser notifications
    sendNotification: (title, message) => {
        if (!("Notification" in window)) return;

        if (Notification.permission === "granted") {
            new Notification(title, { body: message, icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXu BoSml9a2Sq7qZoOQdUD8cBxSOMeKA3_ODlbLSV57E-PeV_dYTi6Xar8d-ZbqCdVDRnxuQFzdoC4tg_Hhl7AcTowJgqQx9qAf6xLa67tm8fyFN0eZzneKLN3XNy8VGEK2ZMqoeKtSL1ds3kE6Ty8ZQCsLYqIcin7flYpMzyP2k12BBYPOCuBCBc26GQdRvvywwgGkT4KP1T6tobWWqTSwAn0nQXwRMkmo7QkaFvs_K4FcXATcKyxWSH9ZSF-dwSo6Vc_IPCNfqdnCF5' });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(title, { body: message });
                }
            });
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('ann_beauty_user');
        window.dispatchEvent(new Event('auth-change'));
        window.location.hash = '#/login';
    },

    // Unified saving system
    toggleSaveItem: (item, type) => {
        const user = auth.getUser();
        if (!user) {
            window.location.hash = '#/login';
            return;
        }

        const storageKey = `ann_saved_items_${user.email}`;
        let saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // Check if already saved
        const index = saved.findIndex(s => s.id === item.id && s.contentType === type);
        
        if (index > -1) {
            saved.splice(index, 1);
            localStorage.setItem(storageKey, JSON.stringify(saved));
            return false; // Removed
        } else {
            saved.push({ ...item, contentType: type });
            localStorage.setItem(storageKey, JSON.stringify(saved));
            return true; // Added
        }
    },

    getSavedItems: () => {
        const user = auth.getUser();
        if (!user) return [];
        return JSON.parse(localStorage.getItem(`ann_saved_items_${user.email}`) || '[]');
    }
};
