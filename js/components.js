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
        { label: 'Shop', hash: '#/home', pages: ['home', 'product'] },
        { label: 'Tutorials', hash: '#/videos', pages: ['videos', 'tutorial', 'rituals'] },
        { label: 'About Us', hash: '#/about', pages: ['about'] },
        { label: 'Favorites', hash: '#/favorites', pages: ['favorites'] },
        { label: 'Track Order', hash: '#/tracking', pages: ['tracking'] },
    ];

    const navLinks = navItems.map(item => {
        const isActive = item.pages.includes(activePage);
        const activeClass = isActive
            ? 'text-purple-800 dark:text-purple-300 border-b-2 border-purple-600 pb-1'
            : 'text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300';
        return `<a class="${activeClass} hover:opacity-80 transition-all duration-300 active:scale-95 transform" href="${item.hash}">${item.label}</a>`;
    }).join('\n');

    return `
    <header id="desktop-header" class="bg-white/80 backdrop-blur-lg dark:bg-slate-950/80 fixed top-0 w-full z-50 border-b border-purple-100/30 dark:border-purple-900/20 shadow-[0_4px_30px_rgba(109,88,166,0.05)] hidden md:block">
        <div class="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto w-full">
            <div class="flex items-center gap-8">
                <a href="#/home" class="text-2xl font-semibold tracking-tighter text-purple-900 dark:text-purple-200 font-serif antialiased hover:opacity-80 transition-opacity">A.n.n Beauty</a>
                <nav class="hidden md:flex gap-6 text-sm font-medium">
                    ${navLinks}
                </nav>
            </div>
            <div class="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                <!-- Search Bar -->
                <div class="relative w-full max-w-md hidden md:block group">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">search</span>
                    <input type="text" id="header-search-input" placeholder="Buscar beleza..." class="w-full bg-surface-container-low border-none rounded-full pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all">
                    <button onclick="if(window.startVoiceSearch) window.startVoiceSearch(); else window.location.hash='#/search'" class="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors">
                        <span class="material-symbols-outlined text-[20px]">mic</span>
                    </button>
                </div>
                
                <!-- Notifications with badge -->
                <a href="#/notifications" class="relative hover:opacity-80 transition-all duration-300 active:scale-95 transform flex items-center justify-center p-2 rounded-full hover:bg-purple-50/50" aria-label="Notificações">
                    <span class="material-symbols-outlined">notifications</span>
                    <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </a>

                <a href="#/cart" class="relative hover:opacity-80 transition-all duration-300 active:scale-95 transform flex items-center justify-center p-2 rounded-full hover:bg-purple-50/50" aria-label="Carrinho">
                    <span class="material-symbols-outlined">shopping_cart</span>
                    <span id="cart-badge" class="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full border border-white ${cartManager.getItemCount() > 0 ? '' : 'hidden'}">${cartManager.getItemCount()}</span>
                </a>

                <div class="h-6 w-[1px] bg-purple-100 mx-2"></div>

                ${user ? `
                    <div class="relative group" id="user-menu-container">
                        <button class="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-100">
                            <span class="text-xs font-bold text-purple-900 ml-1 truncate max-w-[80px]">${user.name.split(' ')[0]}</span>
                            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                ${user.name.charAt(0)}
                            </div>
                        </button>
                        <div class="hidden group-hover:block absolute right-0 top-full pt-2 w-56 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <div class="bg-white rounded-xl shadow-[0_10px_40px_rgba(109,88,166,0.15)] border border-purple-100/30 py-2 overflow-hidden">
                                <a href="#/profile" class="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                                    <span class="material-symbols-outlined text-[20px]">person</span>Meu Perfil
                                </a>
                                <a href="#/favorites" class="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                                    <span class="material-symbols-outlined text-[20px]">favorite</span>Favoritos
                                </a>
                                <div class="border-t border-purple-100/30 my-1"></div>
                                <button onclick="window.auth.logout()" class="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                    <span class="material-symbols-outlined text-[20px]">logout</span>Sair da Conta
                                </button>
                                <div class="border-t border-purple-100/30 my-1"></div>
                                <a href="#/settings" class="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                                    <span class="material-symbols-outlined text-[20px]">settings</span>Configurações
                                </a>
                            </div>
                        </div>
                    </div>
                ` : `
                    <a href="#/login" class="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">Entrar</a>
                `}
            </div>
        </div>
    </header>`;
}

/**
 * Shows a temporary notification toast
 */
export function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[100] transition-all duration-500 transform translate-y-[-20px] opacity-0 flex items-center gap-2 border backdrop-blur-md`;
    
    if (type === 'success') {
        toast.classList.add('bg-green-50/90', 'border-green-200', 'text-green-800');
        toast.innerHTML = `<span class="material-symbols-outlined text-green-600">check_circle</span> ${message}`;
    } else {
        toast.classList.add('bg-red-50/90', 'border-red-200', 'text-red-800');
        toast.innerHTML = `<span class="material-symbols-outlined text-red-600">error</span> ${message}`;
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
    // Check if modal container exists, if not create one
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

// Attach auth to window for onclick handlers
window.auth = auth;

/**
 * Mobile Bottom Navigation Bar
 */
export function renderBottomNav(activePage) {
    const items = [
        { label: 'Home', icon: 'home', hash: '#/home', pages: ['home', 'product', 'cart', 'favorites', 'tracking', 'about'] },
        { label: 'Learn', icon: 'play_circle', hash: '#/videos', pages: ['videos', 'tutorial', 'rituals'] },
        { label: 'Search', icon: 'search', hash: '#/search', pages: ['search'] },
        { label: 'Profile', icon: 'person_2', hash: '#/profile', pages: ['profile'] },
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
    <nav id="mobile-bottom-nav" class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-t border-purple-50 dark:border-purple-900/20 shadow-[0_-4px_20px_rgba(109,88,166,0.05)] md:hidden">
        ${navItems}
    </nav>`;
}

/**
 * Footer — with social media, support channels, and slogan
 */
export function renderFooter() {
    return `
    <footer class="bg-slate-50 dark:bg-slate-950 w-full mt-12 border-t border-slate-200 dark:border-slate-800 pb-24 md:pb-0">
        <div class="max-w-7xl mx-auto px-8 md:px-12 py-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                <!-- Brand -->
                <div class="md:col-span-1">
                    <a href="#/home" class="text-xl font-bold text-purple-900 dark:text-purple-100 font-serif block mb-3">A.n.n Beauty</a>
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
                <p class="font-serif text-sm text-slate-500">© 2026 A.n.n Beauty. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
    
    <!-- Admin Floating Button -->
    <a href="#/admin" class="fixed bottom-24 md:bottom-6 left-6 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/30 hover:text-primary hover:bg-white/20 hover:border-primary/50 transition-all z-[40] shadow-xl group" title="Acesso Administrativo">
        <span class="material-symbols-outlined text-[18px]">lock</span>
        <span class="absolute left-full ml-3 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Admin Panel</span>
    </a>
    `;
}
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
