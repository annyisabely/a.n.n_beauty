// ============================================
// Beleza na Web — Authentication System
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

    // Get all registered users from localStorage
    getRegisteredUsers: () => {
        let users = localStorage.getItem('ann_registered_users');
        if (!users) {
            // Pre-populate with default demo users
            const defaults = {
                'cliente@email.com': {
                    name: 'Cliente A.n.n',
                    emailOrPhone: 'cliente@email.com',
                    password: '123',
                    accountType: 'pessoal',
                    joined: 'junho de 2026'
                },
                'vendedor@email.com': {
                    name: 'Vendedor A.n.n',
                    emailOrPhone: 'vendedor@email.com',
                    password: '123',
                    accountType: 'comercial',
                    joined: 'junho de 2026'
                },
                'anny.coradassi@gmail.com': {
                    name: 'Anny Coradassi',
                    emailOrPhone: 'anny.coradassi@gmail.com',
                    password: 'any1234',
                    accountType: 'pessoal',
                    joined: 'junho de 2026'
                },
                'admin@annbeauty.com': {
                    name: 'Admin Master',
                    emailOrPhone: 'admin@annbeauty.com',
                    password: 'admin',
                    accountType: 'pessoal',
                    joined: 'junho de 2026'
                },
                'annyisabely@gmail.com': {
                    name: 'Anny Isabely',
                    emailOrPhone: 'annyisabely@gmail.com',
                    password: 'admin',
                    accountType: 'pessoal',
                    joined: 'junho de 2026'
                },
                // Acesso administrativo exclusivo — NÃO público
                'belezanaweb@gmail.com': {
                    name: 'Beleza na Web Admin',
                    emailOrPhone: 'belezanaweb@gmail.com',
                    password: 'beleza2026',
                    accountType: 'pessoal',
                    joined: 'julho de 2026'
                }
            };
            localStorage.setItem('ann_registered_users', JSON.stringify(defaults));
            return defaults;
        }
        return JSON.parse(users);
    },

    // Register a new user
    register: (name, emailOrPhone, password, accountType = 'pessoal') => {
        const users = auth.getRegisteredUsers();
        const key = emailOrPhone.toLowerCase().trim();
        
        if (users[key]) {
            return { success: false, message: 'Este e-mail ou telefone já está cadastrado.' };
        }
        
        users[key] = {
            name: name,
            emailOrPhone: key,
            password: password,
            accountType: accountType,
            joined: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
        };
        
        localStorage.setItem('ann_registered_users', JSON.stringify(users));
        
        auth.login(name, emailOrPhone, password, accountType);
        return { success: true };
    },

    // Validate credentials
    validateCredentials: (emailOrPhone, password) => {
        const users = auth.getRegisteredUsers();
        const key = emailOrPhone.toLowerCase().trim();
        let user = users[key];
        
        // Acesso Administrativo Exclusivo — Beleza na Web
        if (key === 'belezanaweb@gmail.com') {
            if (password === 'beleza2026') {
                return {
                    success: true,
                    user: {
                        name: 'Beleza na Web Admin',
                        emailOrPhone: 'belezanaweb@gmail.com',
                        password: 'beleza2026',
                        accountType: 'pessoal',
                        role: 'admin_master'
                    }
                };
            } else {
                return { success: false, message: 'Senha incorreta.' };
            }
        }

        // Special case for Anny Coradassi Admin Master
        if (key === 'anny.coradassi@gmail.com') {
            const cleanPass = password.toLowerCase().trim();
            if (cleanPass === 'anny 1234' || cleanPass === 'anny1234' || cleanPass === 'any1234' || cleanPass === 'admin') {
                return {
                    success: true,
                    user: {
                        name: 'Anny Coradassi',
                        emailOrPhone: 'anny.coradassi@gmail.com',
                        password: password,
                        accountType: 'pessoal',
                        role: 'admin_master'
                    }
                };
            }
        }

        if (!user) {
            return { success: false, message: 'Usuária não cadastrada. Por favor, crie uma conta.' };
        }
        
        if (user.password !== password && user.password.toLowerCase().trim() !== password.toLowerCase().trim()) {
            return { success: false, message: 'Senha incorreta.' };
        }
        
        return { success: true, user: user };
    },

    // Login with name and email/phone
    login: (name, emailOrPhone, password, accountType = 'pessoal') => {
        const email = emailOrPhone.includes('@') ? emailOrPhone : 'usuario@email.com';
        
        // Ensure user is in the registry (e.g., if social login or first time)
        const users = auth.getRegisteredUsers();
        const key = emailOrPhone.toLowerCase().trim();
        if (!users[key]) {
            users[key] = {
                name: name,
                emailOrPhone: key,
                password: password || '',
                accountType: accountType,
                joined: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
            };
            localStorage.setItem('ann_registered_users', JSON.stringify(users));
        }

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

        // Lista de e-mails com acesso admin_master (privado — não público)
        const ADMIN_EMAILS = [
            'anny.coradassi@gmail.com',
            'annyisabely@gmail.com',
            'admin@annbeauty.com',
            'belezanaweb@gmail.com',  // Acesso exclusivo Anny, Nicoly e Nívea
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
        auth.sendNotification('Beleza na Web', `Bem-vinda, ${user.name.split(' ')[0]}! Seu ritual de beleza te espera.`);

        // Force header update
        window.dispatchEvent(new Event('auth-change'));
        return user;
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

    // Login recovering existing role from the database (for Google OAuth)
    // This prevents overwriting a user's saved role (e.g., 'comercial') with 'pessoal'
    loginWithExistingRole: (name, email) => {
        const users = auth.getRegisteredUsers();
        const key = email.toLowerCase().trim();
        const existingUser = users[key];

        // If user exists in registry, use their saved accountType
        const accountType = existingUser ? existingUser.accountType : 'pessoal';

        auth.login(name, email, '', accountType);
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
    },

    // Create or open store for existing user
    createStore: (storeData) => {
        const user = auth.getUser();
        if (!user) return { success: false, message: 'Usuário não autenticado.' };

        user.role = 'empresa';
        user.company_name = storeData.name;
        user.company_id = storeData.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        user.company_phone = storeData.phone || user.phone || '';
        user.company_address = storeData.address || '';
        user.company_description = storeData.description || '';
        if (storeData.photo) {
            user.photo = storeData.photo;
            user.company_photo = storeData.photo;
        }

        // Save user back to localStorage
        localStorage.setItem('ann_beauty_user', JSON.stringify(user));

        // Update profile cache
        const emailKey = user.email || 'usuario@email.com';
        const savedProfileStr = localStorage.getItem(`ann_profile_${emailKey}`);
        const savedProfile = savedProfileStr ? JSON.parse(savedProfileStr) : {};
        savedProfile.role = 'empresa';
        savedProfile.company_name = user.company_name;
        savedProfile.company_id = user.company_id;
        savedProfile.company_phone = user.company_phone;
        savedProfile.company_address = user.company_address;
        savedProfile.company_description = user.company_description;
        if (storeData.photo) savedProfile.photo = storeData.photo;
        localStorage.setItem(`ann_profile_${emailKey}`, JSON.stringify(savedProfile));

        if (storeData.photo) {
            localStorage.setItem('ann_profile_photo', storeData.photo);
        }

        // Update registered users registry
        const users = auth.getRegisteredUsers();
        const key = (user.email || user.phone || emailKey).toLowerCase().trim();
        if (users[key]) {
            users[key].accountType = 'comercial';
            users[key].company_name = user.company_name;
            users[key].company_phone = user.company_phone;
            users[key].company_address = user.company_address;
            users[key].company_description = user.company_description;
            localStorage.setItem('ann_registered_users', JSON.stringify(users));
        }

        // Notify app header / listeners
        window.dispatchEvent(new Event('auth-change'));
        return { success: true, user };
    }
};
