import { auth } from './auth.js';
import { cartManager } from './cart_manager.js';

/**
 * Pages that should NOT render the standard header/footer/bottomnav.
 */
export const FULLSCREEN_PAGES = ['login', 'signup', 'recover', 'checkout', 'admin', 'cart'];

/**
 * Desktop Header (TopAppBar)
 */
export function renderHeader(activePage) {
    const user = auth.getUser();
    
    const navItems = [
        { label: 'Início', hash: '#/home', pages: ['home', 'product'] },
        { label: 'Tutoriais', hash: '#/videos', pages: ['videos', 'tutorial', 'rituals'] },
        { label: 'Sobre', hash: '#/about', pages: ['about'] },
    ];

    const navLinks = navItems.map(item => {
        const isActive = item.pages.includes(activePage);
        const activeClass = isActive
            ? 'text-primary font-bold'
            : 'text-on-surface-variant hover:text-primary';
        return `<a class="${activeClass} transition-all duration-300 active:scale-95 transform" href="${item.hash}">${item.label}</a>`;
    }).join('\n');

    return `
    <header id="desktop-header" class="bg-background/80 backdrop-blur-lg fixed top-0 w-full z-50 border-b border-primary/10 shadow-ethereal hidden md:block">
        <div class="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto w-full">
            <div class="flex items-center gap-8">
                <a href="#/home" class="text-2xl font-display font-semibold tracking-tighter text-on-background antialiased hover:opacity-80 transition-all">Beleza na Web</a>
                <nav class="hidden md:flex gap-6 text-sm">
                    ${navLinks}
                </nav>
            </div>
            <div class="flex items-center gap-2 text-on-background">
                <!-- Search Bar -->
                <div class="relative w-full max-w-md hidden md:block group">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">search</span>
                    <input type="text" id="header-search-input" onkeydown="if(event.key === 'Enter') { window.location.hash='#/search'; setTimeout(() => { const s = document.getElementById('search-input'); if(s) { s.value = this.value; window.handleSearch({target:{value:this.value}}); } }, 100); }" placeholder="Buscar beleza..." class="w-full bg-surface-container-low border-none rounded-full pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all">
                    <button onclick="if(window.startVoiceSearch) window.startVoiceSearch(); else window.location.hash='#/search'" class="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors">
                        <span class="material-symbols-outlined text-[20px]">mic</span>
                    </button>
                </div>
                
                <!-- Notifications with badge -->
                <a href="#/notifications" class="relative hover:opacity-80 transition-all duration-300 active:scale-95 transform flex items-center justify-center p-2 rounded-full hover:bg-primary-container/20" aria-label="Notificações">
                    <span class="material-symbols-outlined">notifications</span>
                    <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border border-white"></span>
                </a>

                <a href="#/cart" class="relative hover:opacity-80 transition-all duration-300 active:scale-95 transform flex items-center justify-center p-2 rounded-full hover:bg-purple-50/50" aria-label="Carrinho">
                    <span class="material-symbols-outlined">shopping_cart</span>
                    <span id="cart-badge" class="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full border border-white ${cartManager.getItemCount() > 0 ? '' : 'hidden'}">${cartManager.getItemCount()}</span>
                </a>

                <div class="h-6 w-[1px] bg-purple-100 mx-2"></div>

                ${user ? `
                    <div class="relative group" id="user-menu-container">
                        <button class="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-primary-container/30 hover:bg-primary-container/50 transition-colors border border-primary/20">
                            <span class="text-xs font-bold text-on-primary-container ml-1 truncate max-w-[80px]">${user.name.split(' ')[0]}</span>
                            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                ${user.name.charAt(0)}
                            </div>
                        </button>
                        <div class="hidden group-hover:block absolute right-0 top-full pt-2 w-64 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-ethereal-hover border border-primary/10 py-3 overflow-hidden">

                                <a href="#/profile" class="flex items-center gap-3 px-5 py-2.5 text-sm text-on-surface hover:bg-primary/10 hover:text-primary transition-all">
                                    <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1">person</span>Meu Perfil
                                </a>
                                ${(user.role === 'admin_master' || user.role === 'admin') ? `
                                <a href="#/admin" class="flex items-center gap-3 px-5 py-2.5 text-sm text-primary font-bold hover:bg-primary/10 transition-all">
                                    <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1">admin_panel_settings</span>Painel Admin Master
                                </a>
                                ` : ((user.role === 'empresa' || user.role === 'seller') ? `
                                <a href="#/store" class="flex items-center gap-3 px-5 py-2.5 text-sm text-primary font-bold hover:bg-primary/10 transition-all">
                                    <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1">storefront</span>Minha Loja
                                </a>
                                ` : `
                                <button onclick="window.openCreateStoreModal()" class="w-full text-left flex items-center gap-3 px-5 py-2.5 text-sm text-primary font-bold hover:bg-primary/10 transition-all">
                                    <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1">storefront</span>Criar Minha Loja
                                </button>
                                `)}
                                <a href="#/favorites" class="flex items-center gap-3 px-5 py-2.5 text-sm text-on-surface hover:bg-primary/10 hover:text-primary transition-all">
                                    <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1">favorite</span>Favoritos
                                </a>
                                <div class="border-t border-primary/5 my-2"></div>
                                <button onclick="window.auth.logout()" class="w-full text-left flex items-center gap-3 px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all font-medium">
                                    <span class="material-symbols-outlined text-[20px]">logout</span>Sair da Conta
                                </button>
                                <div class="border-t border-primary/5 my-2"></div>
                                <a href="#/settings" class="flex items-center gap-3 px-5 py-2.5 text-sm text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all">
                                    <span class="material-symbols-outlined text-[20px]">settings</span>Configurações
                                </a>
                            </div>
                        </div>
                    </div>
                ` : `
                    <a href="#/login" class="bg-primary text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">Entrar</a>
                `}
            </div>
        </div>
    </header>`;
}

/**
 * Bottom Navigation Bar (Mobile)
 */
export function renderBottomNav(activePage) {
    const items = [
        { label: 'Home', icon: 'home', hash: '#/home', pages: ['home', 'product', 'cart', 'favorites', 'tracking', 'about'] },
        { label: 'Learn', icon: 'play_circle', hash: '#/videos', pages: ['videos', 'tutorial', 'rituals'] },
        { label: 'Search', icon: 'search', hash: '#/search', pages: ['search'] },
        { label: 'Profile', icon: 'person', hash: '#/profile', pages: ['profile'] },
    ];

    const navItems = items.map(item => {
        const isActive = item.pages.includes(activePage);
        if (isActive) {
            return `
            <a class="flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-2xl px-4 py-1 translate-y-[-2px] transition-transform" href="${item.hash}">
                <span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 1;">${item.icon}</span>
                <span class="font-serif text-[10px] uppercase tracking-tighter font-bold">${item.label}</span>
            </a>`;
        }
        return `
        <a class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 hover:text-purple-500 transition-colors" href="${item.hash}">
            <span class="material-symbols-outlined mb-1">${item.icon}</span>
            <span class="font-serif text-[10px] uppercase tracking-tighter">${item.label}</span>
        </a>`;
    }).join('\n');

    return `
    <nav id="mobile-bottom-nav" class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-background/90 backdrop-blur-xl border-t border-primary/10 shadow-ethereal md:hidden">
        ${navItems}
    </nav>`;
}

/**
 * Footer — with social media, support channels, and slogan
 */
export function renderFooter() {
    return `
    <footer class="bg-surface-container w-full mt-12 border-t border-primary/5 pb-24 md:pb-0">
        <div class="max-w-7xl mx-auto px-8 md:px-12 py-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                <!-- Brand -->
                <div class="md:col-span-1">
                    <a href="#/home" class="text-xl font-bold text-purple-900 dark:text-purple-100 font-serif block mb-3">Beleza na Web</a>
                    <p class="font-serif text-sm text-purple-700 dark:text-purple-300 italic leading-relaxed">"Não vendemos apenas maquiagem, mas sim autoestima."</p>
                    <!-- Social Icons -->
                    <div class="flex gap-3 mt-5">
                        <a href="https://www.instagram.com/a.n.n_beauty_?igsh=c2J0emJ0Y3RrZzR0" target="_blank" class="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center hover:bg-purple-200 transition-colors" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                        <a href="https://wa.me/5541996190987" target="_blank" class="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-200 transition-colors" aria-label="WhatsApp"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
                    </div>
                </div>
                <!-- Navigation -->
                <div>
                    <h4 class="font-label-md text-label-md text-on-surface mb-4 uppercase tracking-widest">Navegação</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a class="text-slate-500 hover:text-purple-600 transition-colors" href="#/home">Loja</a></li>
                        <li><a class="text-slate-500 hover:text-purple-600 transition-colors" href="#/videos">Tutoriais</a></li>
                        <li><a class="text-slate-500 hover:text-purple-600 transition-colors" href="#/rituals">Guia de Rituais</a></li>
                        <li><a class="text-slate-500 hover:text-purple-600 transition-colors" href="#/about">Sobre Nós</a></li>
                    </ul>
                </div>
                <!-- Atendimento -->
                <div>
                    <h4 class="font-label-md text-label-md text-on-surface mb-4 uppercase tracking-widest">Atendimento</h4>
                    <ul class="space-y-2 text-sm">
                        <li class="flex items-center gap-2 text-slate-500"><span class="material-symbols-outlined text-[16px]">mail</span>contato@annbeauty.com.br</li>
                        <li class="flex items-center gap-2 text-slate-500"><span class="material-symbols-outlined text-[16px]">chat</span>WhatsApp: (41) 99619-0987</li>
                        <li class="flex items-center gap-2 text-slate-500"><span class="material-symbols-outlined text-[16px]">photo_camera</span>Instagram: @a.n.n_beauty_</li>
                        <li class="flex items-center gap-2 text-slate-500"><span class="material-symbols-outlined text-[16px]">schedule</span>Seg-Sex: 9h às 18h</li>
                    </ul>
                </div>
                <!-- Legal -->
                <div>
                    <h4 class="font-label-md text-label-md text-on-surface mb-4 uppercase tracking-widest">Legal</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a class="text-slate-500 hover:text-purple-600 transition-colors" href="#/settings">Política de Privacidade</a></li>
                        <li><a class="text-slate-500 hover:text-purple-600 transition-colors" href="#/settings">Termos de Uso</a></li>
                        <li><a class="text-slate-500 hover:text-purple-600 transition-colors" href="#/settings">Trocas e Devoluções</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-slate-200 dark:border-slate-800 pt-6 text-center">
                <p class="font-serif text-sm text-slate-500">© 2026 Beleza na Web. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
    `;
}

/**
 * Shows a temporary notification toast
 */
export function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[100] transition-all duration-500 transform translate-y-[-20px] opacity-0 flex items-center gap-2 border backdrop-blur-md`;
    
    if (type === 'success') {
        toast.classList.add('bg-primary-container/90', 'border-primary/20', 'text-on-primary-container');
        toast.innerHTML = `<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1">check_circle</span> ${message}`;
    } else if (type === 'info') {
        toast.classList.add('bg-secondary-container/90', 'border-secondary/20', 'text-on-secondary-container');
        toast.innerHTML = `<span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1">info</span> ${message}`;
    } else {
        toast.classList.add('bg-red-50/90', 'border-red-200', 'text-red-800');
        toast.innerHTML = `<span class="material-symbols-outlined text-red-600" style="font-variation-settings: 'FILL' 1">error</span> ${message}`;
    }

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-y-[-20px]', 'opacity-0');
    }, 10);

    // Animate out
    setTimeout(() => {
        toast.classList.add('translate-y-[-20px]', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/**
 * Renders a list of users in a modal (used for Likes/Stars)
 */
export function renderUserListModal(title, users) {
    let modal = document.getElementById('user-list-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'user-list-modal';
        modal.className = 'hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] items-center justify-center p-4';
        document.body.appendChild(modal);
    }

    const userItems = users.length > 0 ? users.map(user => `
        <div class="flex items-center gap-4 p-3 hover:bg-purple-50 rounded-xl transition-colors">
            <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold overflow-hidden shadow-sm">
                ${user.photo ? `<img src="${user.photo}" class="w-full h-full object-cover">` : user.name.charAt(0)}
            </div>
            <div class="flex-grow">
                <p class="text-sm font-bold text-on-surface">${user.name}</p>
                <p class="text-[10px] text-outline">${user.email}</p>
            </div>
            <button class="px-4 py-1.5 rounded-full border border-primary text-primary text-[10px] font-bold hover:bg-primary hover:text-white transition-all">Seguir</button>
        </div>
    `).join('') : `
        <div class="py-10 text-center text-outline text-sm">Nenhuma interação encontrada ainda.</div>
    `;

    modal.innerHTML = `
        <div class="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in duration-300">
            <div class="flex justify-between items-center mb-6">
                <h3 class="font-display text-xl text-on-surface">${title}</h3>
                <button onclick="document.getElementById('user-list-modal').classList.add('hidden')" class="text-outline hover:text-on-surface transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="max-h-[400px] overflow-y-auto space-y-1 no-scrollbar">
                ${userItems}
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Attach to window for global access
window.renderUserListModal = renderUserListModal;
window.auth = auth;

// Listen for cart updates
window.addEventListener('cart-updated', () => {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const count = cartManager.getItemCount();
        badge.innerText = count;
        if (count > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
});

/**
 * Open Modal to Create/Register Store ("Abra sua Loja")
 */
window.openCreateStoreModal = () => {
    let modal = document.getElementById('create-store-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'create-store-modal';
        document.body.appendChild(modal);
    }
    
    const user = auth.getUser();
    if (!user) {
        window.location.hash = '#/login';
        return;
    }

    const existingName = user ? (user.company_name || `${user.name} Shop`) : '';
    const existingPhone = user ? (user.company_phone || user.phone || '') : '';
    const existingAddress = user ? (user.company_address || '') : '';
    const existingDesc = user ? (user.company_description || '') : '';
    const existingPhoto = user ? (user.company_photo || user.photo || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300') : 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300';

    modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200';
    modal.innerHTML = `
        <div class="bg-white/95 backdrop-blur-2xl rounded-[36px] max-w-lg w-full p-8 shadow-2xl border border-primary/20 animate-in zoom-in-95 duration-300 relative overflow-hidden max-h-[90vh] overflow-y-auto subtle-scroll">
            <button onclick="document.getElementById('create-store-modal').classList.add('hidden')" class="absolute top-6 right-6 w-9 h-9 rounded-full bg-primary/5 hover:bg-primary/10 text-primary flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                    <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1">storefront</span>
                </div>
                <div>
                    <h2 class="text-2xl font-serif font-bold text-on-surface tracking-tight">Abra sua Loja</h2>
                    <p class="text-xs text-on-surface-variant opacity-80">Comece a vender seus produtos e rituais de beleza</p>
                </div>
            </div>

            <form id="create-store-form" onsubmit="window.handleCreateStoreSubmit(event)" class="space-y-4">
                <!-- Nome da Loja -->
                <div>
                    <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Nome da Loja *</label>
                    <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-[20px]">store</span>
                        <input type="text" id="store-name-input" required value="${existingName}" placeholder="Ex: Glow & Rituals Skincare" class="w-full bg-surface-container-low pl-12 pr-4 py-3 rounded-2xl border border-outline-variant/30 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
                    </div>
                </div>

                <!-- Foto / Logo -->
                <div>
                    <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Foto ou Logo da Loja (URL)</label>
                    <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-[20px]">image</span>
                        <input type="url" id="store-photo-input" value="${existingPhoto}" placeholder="https://..." class="w-full bg-surface-container-low pl-12 pr-4 py-3 rounded-2xl border border-outline-variant/30 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
                    </div>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="text-[10px] text-outline font-medium">Sugestões:</span>
                        <button type="button" onclick="document.getElementById('store-photo-input').value='https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300'" class="w-7 h-7 rounded-full overflow-hidden border border-primary/20 hover:scale-110 transition-transform"><img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300" class="w-full h-full object-cover"></button>
                        <button type="button" onclick="document.getElementById('store-photo-input').value='https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300'" class="w-7 h-7 rounded-full overflow-hidden border border-primary/20 hover:scale-110 transition-transform"><img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300" class="w-full h-full object-cover"></button>
                        <button type="button" onclick="document.getElementById('store-photo-input').value='https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300'" class="w-7 h-7 rounded-full overflow-hidden border border-primary/20 hover:scale-110 transition-transform"><img src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300" class="w-full h-full object-cover"></button>
                    </div>
                </div>

                <!-- Descrição -->
                <div>
                    <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Descrição da Loja</label>
                    <textarea id="store-desc-input" rows="2" placeholder="Conte brevemente sobre o seu espaço, essência e produtos..." class="w-full bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">${existingDesc}</textarea>
                </div>

                <!-- Telefone -->
                <div>
                    <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Telefone / WhatsApp *</label>
                    <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-[20px]">call</span>
                        <input type="tel" id="store-phone-input" required value="${existingPhone}" placeholder="(00) 90000-0000" class="w-full bg-surface-container-low pl-12 pr-4 py-3 rounded-2xl border border-outline-variant/30 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
                    </div>
                </div>

                <!-- Endereço -->
                <div>
                    <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Endereço da Sede/Loja *</label>
                    <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-[20px]">location_on</span>
                        <input type="text" id="store-address-input" required value="${existingAddress}" placeholder="Av. Paulista, 1000, Centro - São Paulo/SP" class="w-full bg-surface-container-low pl-12 pr-4 py-3 rounded-2xl border border-outline-variant/30 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
                    </div>
                </div>

                <div class="flex gap-3 pt-4 border-t border-primary/10">
                    <button type="button" onclick="document.getElementById('create-store-modal').classList.add('hidden')" class="w-1/3 py-3 rounded-full font-bold text-on-surface-variant text-sm hover:bg-surface-container transition-colors">Cancelar</button>
                    <button type="submit" class="w-2/3 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-sm">storefront</span> Criar Loja
                    </button>
                </div>
            </form>
        </div>
    `;
    modal.classList.remove('hidden');
};

window.handleCreateStoreSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('store-name-input').value;
    const photo = document.getElementById('store-photo-input').value;
    const description = document.getElementById('store-desc-input').value;
    const phone = document.getElementById('store-phone-input').value;
    const address = document.getElementById('store-address-input').value;

    const res = auth.createStore({ name, photo, description, phone, address });
    if (res.success) {
        document.getElementById('create-store-modal').classList.add('hidden');
        showToast('🎉 Loja criada com sucesso! Redirecionando para o seu Painel...', 'success');
        setTimeout(() => {
            window.location.hash = '#/admin';
        }, 600);
    } else {
        showToast(res.message || 'Erro ao criar loja.', 'error');
    }
};

/**
 * Open Seller Direct Chat Modal ("Conversar com Vendedor")
 */
window.openSellerChatModal = (sellerId = 'ann_official', sellerName = 'Beleza na Web Official', sellerPhoto = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100') => {
    let modal = document.getElementById('seller-chat-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'seller-chat-modal';
        document.body.appendChild(modal);
    }

    const renderMessages = () => {
        const msgs = window.socialManager ? window.socialManager.getSellerChatMessages(sellerId) : [];
        return msgs.map(m => {
            if (m.sender === 'user') {
                return `
                <div class="flex justify-end mb-3">
                    <div class="bg-primary text-white text-xs font-medium px-4 py-2.5 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                        <p>${m.text}</p>
                        <span class="text-[9px] text-white/70 block text-right mt-1">${m.time}</span>
                    </div>
                </div>`;
            } else {
                return `
                <div class="flex items-start gap-2 mb-3">
                    <img src="${sellerPhoto}" class="w-7 h-7 rounded-full object-cover border border-primary/20 mt-1">
                    <div class="bg-surface-container-low text-on-surface text-xs font-medium px-4 py-2.5 rounded-2xl rounded-tl-none max-w-[80%] border border-outline-variant/30 shadow-sm">
                        <p class="font-bold text-[10px] text-primary mb-0.5">${sellerName}</p>
                        <p>${m.text}</p>
                        <span class="text-[9px] text-outline block mt-1">${m.time}</span>
                    </div>
                </div>`;
            }
        }).join('');
    };

    modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-md z-[350] flex items-center justify-center p-4 animate-in fade-in duration-200';
    modal.innerHTML = `
        <div class="bg-white rounded-[32px] max-w-md w-full shadow-2xl border border-primary/20 overflow-hidden flex flex-col h-[520px] animate-in zoom-in-95 duration-200">
            <!-- Header -->
            <div class="bg-gradient-to-r from-primary to-secondary p-4 text-white flex items-center justify-between shadow-md">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <img src="${sellerPhoto}" class="w-10 h-10 rounded-full object-cover border-2 border-white/80 shadow-sm">
                        <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                    </div>
                    <div>
                        <h3 class="font-bold text-sm leading-tight">${sellerName}</h3>
                        <span class="text-[10px] text-white/80 flex items-center gap-1">
                            <span class="material-symbols-outlined text-[12px]">verified</span> Vendedor Verificado
                        </span>
                    </div>
                </div>
                <button onclick="document.getElementById('seller-chat-modal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
            </div>

            <!-- Messages Body -->
            <div id="seller-chat-body" class="flex-grow p-4 overflow-y-auto subtle-scroll bg-surface-bright/50">
                ${renderMessages()}
            </div>

            <!-- Input Area -->
            <form onsubmit="window.handleSendSellerMessage(event, '${sellerId}', '${sellerName}')" class="p-3 bg-white border-t border-primary/10 flex items-center gap-2">
                <input type="text" id="seller-chat-input" placeholder="Digite sua mensagem ao vendedor..." required autocomplete="off" class="flex-grow bg-surface-container-low px-4 py-2.5 rounded-full text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/30">
                <button type="submit" class="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md">
                    <span class="material-symbols-outlined text-[18px]">send</span>
                </button>
            </form>
        </div>
    `;

    modal.classList.remove('hidden');
    const body = document.getElementById('seller-chat-body');
    if (body) body.scrollTop = body.scrollHeight;

    // Listen to updates
    window.addEventListener('seller-chat-updated', (e) => {
        if (e.detail && e.detail.sellerId === sellerId) {
            const chatBody = document.getElementById('seller-chat-body');
            if (chatBody) {
                chatBody.innerHTML = renderMessages();
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        }
    });
};

window.handleSendSellerMessage = (e, sellerId, sellerName) => {
    e.preventDefault();
    const input = document.getElementById('seller-chat-input');
    if (!input || !input.value.trim()) return;

    const val = input.value;
    input.value = '';
    
    if (window.socialManager) {
        window.socialManager.sendSellerMessage(sellerId, val, sellerName);
        const chatBody = document.getElementById('seller-chat-body');
        if (chatBody) {
            chatBody.innerHTML = window.socialManager.getSellerChatMessages(sellerId).map(m => {
                if (m.sender === 'user') {
                    return `
                    <div class="flex justify-end mb-3">
                        <div class="bg-primary text-white text-xs font-medium px-4 py-2.5 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                            <p>${m.text}</p>
                            <span class="text-[9px] text-white/70 block text-right mt-1">${m.time}</span>
                        </div>
                    </div>`;
                } else {
                    return `
                    <div class="flex items-start gap-2 mb-3">
                        <div class="w-7 h-7 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center mt-1">S</div>
                        <div class="bg-surface-container-low text-on-surface text-xs font-medium px-4 py-2.5 rounded-2xl rounded-tl-none max-w-[80%] border border-outline-variant/30 shadow-sm">
                            <p class="font-bold text-[10px] text-primary mb-0.5">${sellerName}</p>
                            <p>${m.text}</p>
                            <span class="text-[9px] text-outline block mt-1">${m.time}</span>
                        </div>
                    </div>`;
                }
            }).join('');
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }
};
