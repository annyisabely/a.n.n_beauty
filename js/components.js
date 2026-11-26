import { auth } from './auth.js';
import { cartManager } from './cart_manager.js';

/**
 * Pages that should NOT render the standard header/footer/bottomnav.
 */
export const FULLSCREEN_PAGES = ['login', 'signup', 'recover', 'checkout', 'admin'];

/**
 * Desktop Header (TopAppBar)
 */
export function renderHeader(activePage) {
    const user = auth.getUser();
    
    const navItems = [
        { label: 'Início',     hash: '#/home',   pages: ['home', 'product'] },
        { label: 'Categorias', hash: '#/search?q=categorias', pages: [] },
        { label: 'Ofertas',    hash: '#/search?q=ofertas', pages: [] },
        { label: 'Marcas',     hash: '#/search?q=marcas', pages: [] },
        { label: 'Lojas',      hash: '#/stores',  pages: ['stores', 'store'] },
        { label: 'Tutoriais',  hash: '#/videos', pages: ['videos', 'tutorial', 'rituals'] },
    ];

    const navLinks = navItems.map(item => {
        const isActive = item.pages.includes(activePage);
        return isActive
            ? `<a class="text-white font-semibold text-sm relative transition-all py-1 after:absolute after:bottom-[-18px] after:left-0 after:w-full after:h-[2.5px] after:bg-[#8B5FBF] after:rounded-full" href="${item.hash}">${item.label}</a>`
            : `<a class="text-[#C5B8D8] font-medium text-sm hover:text-white transition-colors duration-200 py-1" href="${item.hash}">${item.label}</a>`;
    }).join('\n');

    const notifCount = (user && window.notificationsManager)
        ? window.notificationsManager.getNotifications(user.email).filter(n => !n.read).length
        : 0;
    const cartCount = cartManager.getItemCount();

    const displayName = user ? (user.name || user.email || 'Usuário') : '';
    const displayInitial = user ? (displayName.charAt(0).toUpperCase() || 'U') : '';
    const truncatedName = displayName.length > 11 ? displayName.slice(0, 9) + '...' : displayName;

    const userMenuHtml = user ? `
        <div class="relative group" id="user-menu-container">
            <button class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#281C3E] hover:bg-[#34244F] border border-[#3E295E] transition-all duration-200 text-white">
                <div class="w-6 h-6 rounded-full bg-[#8B5FBF] text-white flex items-center justify-center text-xs font-bold flex-shrink-0" style="font-family:'Poppins',sans-serif">${displayInitial}</div>
                <span class="text-xs lg:text-sm font-medium text-[#E0D4FC] max-w-[95px] truncate hidden sm:block" style="font-family:'Inter',sans-serif">${truncatedName}</span>
                <span class="material-symbols-outlined text-[#8F7EAA]" style="font-size:16px">keyboard_arrow_down</span>
            </button>
            <!-- Dropdown -->
            <div class="hidden group-hover:block absolute right-0 top-full pt-2 w-60 z-50">
                <div class="bg-[#201435] rounded-2xl shadow-2xl border border-[#3E295E] py-2 overflow-hidden text-white backdrop-blur-xl">
                    <!-- User info -->
                    <div class="px-4 py-3 border-b border-[#3E295E] mb-1">
                        <p class="text-sm font-semibold text-white truncate" style="font-family:'Poppins',sans-serif">${user.name || 'Usuária'}</p>
                        <p class="text-xs text-[#C5B8D8] truncate">${user.email}</p>
                    </div>
                    <a href="#/profile" class="flex items-center gap-3 px-4 py-2.5 text-sm text-[#E0D4FC] hover:bg-white/10 hover:text-white transition-colors">
                        <span class="material-symbols-outlined text-[#C4A8E0]" style="font-size:18px">person</span>
                        Meu Perfil
                    </a>
                    <a href="#/settings" class="flex items-center gap-3 px-4 py-2.5 text-sm text-[#E0D4FC] hover:bg-white/10 hover:text-white transition-colors">
                        <span class="material-symbols-outlined text-[#C4A8E0]" style="font-size:18px">settings</span>
                        Configurações
                    </a>
                    <a href="#/store" class="flex items-center gap-3 px-4 py-2.5 text-sm text-[#C4A8E0] font-semibold hover:bg-white/10 transition-colors">
                        <span class="material-symbols-outlined" style="font-size:18px">storefront</span>
                        Minha Loja
                    </a>
                    ${(user.role === 'admin_master' || user.role === 'admin') ? `
                    <a href="#/admin" class="flex items-center gap-3 px-4 py-2.5 text-sm text-[#C4A8E0] font-semibold hover:bg-white/10 transition-colors">
                        <span class="material-symbols-outlined" style="font-size:18px">admin_panel_settings</span>
                        Painel Admin
                    </a>
                    ` : ''}
                    <div class="h-px bg-[#3E295E] my-1"></div>
                    <button onclick="window.auth.logout()" class="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                        <span class="material-symbols-outlined" style="font-size:18px">logout</span>
                        Sair da Conta
                    </button>
                </div>
            </div>
        </div>
    ` : `
        <a href="#/login" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#8B5FBF] hover:bg-[#7242A5] text-white text-xs font-bold transition-all shadow-md">
            <span class="material-symbols-outlined text-[16px]">account_circle</span>
            <span>Entrar</span>
        </a>
    `;

    return `
    <header id="desktop-header" class="w-full shadow-lg transition-all sticky top-0 z-50" style="background-color: #19102B; border-bottom: 1px solid rgba(139, 95, 191, 0.18);">
        <div class="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-0 max-w-[1400px] mx-auto w-full h-[68px]">

            <!-- Left: Logo + Nav -->
            <div class="flex items-center gap-6 lg:gap-10">
                <a href="#/home" class="group flex items-center gap-3 hover:opacity-95 transition-opacity" style="text-decoration:none">
                    <img src="img/logo.png" alt="Beleza na Web" class="w-10 h-10 rounded-full object-cover border border-[#C4A8E0]/40 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform bg-[#281C3E]">
                    <div class="flex flex-col justify-center leading-none">
                        <span class="font-display text-[17px] lg:text-[18px] font-bold tracking-tight text-white" style="letter-spacing:-0.02em; font-family:'Poppins',sans-serif">
                            Beleza na Web
                        </span>
                        <span class="text-[9.5px] lg:text-[10.5px] font-medium text-[#C5B8D8] tracking-normal mt-1 italic" style="font-family:'Inter',sans-serif">
                            Sua beleza, seu cuidado, em cada clique.
                        </span>
                    </div>
                </a>
                <nav class="hidden md:flex items-center gap-6">
                    ${navLinks}
                </nav>
            </div>

            <!-- Right: Search + Actions -->
            <div class="flex items-center gap-3">

                <!-- Search -->
                <div class="relative hidden md:flex items-center">
                    <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F7EAA] pointer-events-none" style="font-size:18px">search</span>
                    <input
                        type="text"
                        id="header-search-input"
                        onkeydown="if(event.key==='Enter'){window.location.hash='#/search?q='+encodeURIComponent(this.value);setTimeout(()=>{const s=document.getElementById('search-input');if(s){s.value=this.value;window.handleSearch&&window.handleSearch({target:{value:this.value}})}},100)}"
                        placeholder="O que você está procurando?"
                        class="bg-[#281C3E] border border-[#3E295E] rounded-full pl-10 pr-9 py-2 text-xs lg:text-sm w-56 lg:w-64 focus:w-72 transition-all duration-300 focus:border-[#8B5FBF] focus:outline-none focus:ring-1 focus:ring-[#8B5FBF] text-white placeholder-[#8F7EAA]"
                    >
                    <button onclick="if(window.startVoiceSearch)window.startVoiceSearch();else window.location.hash='#/search'" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F7EAA] hover:text-[#C4A8E0] transition-colors" aria-label="Busca por voz">
                        <span class="material-symbols-outlined" style="font-size:17px">mic</span>
                    </button>
                </div>

                <!-- Notifications -->
                <a href="#/notifications" aria-label="Notificações" class="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors text-[#C5B8D8] hover:text-white">
                    <span class="material-symbols-outlined" style="font-size:21px">notifications</span>
                    <span id="notif-badge" class="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-[#8B5FBF] text-white text-[9px] flex items-center justify-center rounded-full border border-[#19102B] font-bold px-1 ${notifCount > 0 ? '' : 'hidden'}">${notifCount}</span>
                </a>

                <!-- Cart -->
                <a href="#/cart" aria-label="Carrinho" class="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors text-[#C5B8D8] hover:text-white">
                    <span class="material-symbols-outlined" style="font-size:21px">shopping_cart</span>
                    <span id="cart-badge" class="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-[#8B5FBF] text-white text-[9px] flex items-center justify-center rounded-full border border-[#19102B] font-bold px-1 ${cartCount > 0 ? '' : 'hidden'}">${cartCount}</span>
                </a>

                <!-- User Menu or Login Button -->
                ${userMenuHtml}
            </div>
        </div>
    </header>`;
}

/**
 * Bottom Navigation Bar (Mobile)
 */
export function renderBottomNav(activePage) {
    const items = [
        { label: 'Início',   icon: 'home',        hash: '#/home',    pages: ['home', 'product', 'cart', 'favorites', 'tracking', 'about'] },
        { label: 'Tutoriais',icon: 'play_circle',  hash: '#/videos',  pages: ['videos', 'tutorial', 'rituals'] },
        { label: 'Buscar',   icon: 'search',       hash: '#/search',  pages: ['search'] },
        { label: 'Perfil',   icon: 'person',       hash: '#/profile', pages: ['profile'] },
    ];

    const navItems = items.map(item => {
        const isActive = item.pages.includes(activePage);
        if (isActive) {
            return `
            <a class="flex flex-col items-center justify-center gap-0.5 min-w-[56px] px-3 py-1.5 rounded-2xl bg-[#E8D8F4] text-[#8B5FBF]" href="${item.hash}">
                <span class="material-symbols-outlined" style="font-size:22px;font-variation-settings:'FILL' 1">${item.icon}</span>
                <span style="font-family:'Inter',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase">${item.label}</span>
            </a>`;
        }
        return `
        <a class="flex flex-col items-center justify-center gap-0.5 min-w-[56px] px-3 py-1.5 rounded-2xl text-[#5C4D6B] hover:text-[#8B5FBF] transition-colors" href="${item.hash}">
            <span class="material-symbols-outlined" style="font-size:22px;font-variation-settings:'FILL' 0">${item.icon}</span>
            <span style="font-family:'Inter',sans-serif;font-size:9px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase">${item.label}</span>
        </a>`;
    }).join('\n');

    return `
    <nav id="mobile-bottom-nav" class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-safe pt-3 bg-white border-t border-[#DDD0E8] md:hidden" style="padding-bottom:max(24px,env(safe-area-inset-bottom));box-shadow:0 -1px 16px -4px rgba(109,76,125,0.08)">
        ${navItems}
    </nav>`;
}

/**
 * Footer — with social media, support channels, and slogan
 */
export function renderFooter() {
    return `
    <footer class="w-full mt-16 border-t border-[#DDD0E8] pb-24 md:pb-0" style="background:#FFFFFF">
        <div class="max-w-7xl mx-auto px-8 md:px-12 pt-12 pb-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

                <!-- Brand -->
                <div class="md:col-span-1">
                    <a href="#/home" class="inline-block mb-1.5 flex items-center gap-2" style="font-family:'Poppins',sans-serif;font-size:20px;font-weight:700;color:#8B5FBF;letter-spacing:-0.02em">
                        <img src="img/logo.png" alt="Catálogo Beleza na Web" class="w-8 h-8 rounded-full object-cover shadow-sm border border-[#C4A8E0]/30">
                        Beleza na Web
                    </a>
                    <p style="font-family:'Inter',sans-serif;font-size:12px;color:#8B5FBF;font-weight:600;font-style:italic;line-height:1.4;margin-bottom:8px">Sua beleza, seu cuidado, em cada clique.</p>
                    <p style="font-family:'Inter',sans-serif;font-size:13px;color:#5C4D6B;font-style:italic;line-height:1.7;margin-bottom:16px">&ldquo;Não vendemos apenas maquiagem,<br>mas sim autoestima.&rdquo;</p>
                    <div class="flex gap-2.5">
                        <a href="https://www.instagram.com/a.n.n_beauty_?igsh=c2J0emJ0Y3RrZzR0" target="_blank" class="w-8 h-8 rounded-full flex items-center justify-center border border-[#DDD0E8] bg-white hover:bg-[#E8D8F4] hover:border-[#C4A8E0] transition-all" style="color:#8B5FBF" aria-label="Instagram">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </a>
                        <a href="https://wa.me/5541996190987" target="_blank" class="w-8 h-8 rounded-full flex items-center justify-center border border-[#DDD0E8] bg-white hover:bg-green-50 hover:border-green-300 transition-all" style="color:#22c55e" aria-label="WhatsApp">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </a>
                    </div>
                </div>

                <!-- Navigation -->
                <div>
                    <h4 style="font-family:'Poppins',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#2D1A40;margin-bottom:16px">Navegação</h4>
                    <ul class="space-y-2.5">
                        <li><a style="font-family:'Inter',sans-serif;font-size:13px;color:#5C4D6B" class="hover:text-[#8B5FBF] transition-colors" href="#/home">Loja</a></li>
                        <li><a style="font-family:'Inter',sans-serif;font-size:13px;color:#5C4D6B" class="hover:text-[#8B5FBF] transition-colors" href="#/videos">Tutoriais</a></li>
                        <li><a style="font-family:'Inter',sans-serif;font-size:13px;color:#5C4D6B" class="hover:text-[#8B5FBF] transition-colors" href="#/rituals">Guia de Rituais</a></li>
                        <li><a style="font-family:'Inter',sans-serif;font-size:13px;color:#5C4D6B" class="hover:text-[#8B5FBF] transition-colors" href="#/about">Sobre Nós</a></li>
                    </ul>
                </div>

                <!-- Atendimento -->
                <div>
                    <h4 style="font-family:'Poppins',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#2D1A40;margin-bottom:16px">Atendimento</h4>
                    <ul class="space-y-2.5">
                        <li class="flex items-center gap-2" style="font-family:'Inter',sans-serif;font-size:13px;color:#5C4D6B">
                            <span class="material-symbols-outlined" style="font-size:15px;color:#8B5FBF">mail</span>contato@annbeauty.com.br
                        </li>
                        <li class="flex items-center gap-2" style="font-family:'Inter',sans-serif;font-size:13px;color:#5C4D6B">
                            <span class="material-symbols-outlined" style="font-size:15px;color:#8B5FBF">chat</span>(41) 99619-0987
                        </li>
                        <li class="flex items-center gap-2" style="font-family:'Inter',sans-serif;font-size:13px;color:#5C4D6B">
                            <span class="material-symbols-outlined" style="font-size:15px;color:#8B5FBF">photo_camera</span>@a.n.n_beauty_
                        </li>
                        <li class="flex items-start gap-2" style="font-family:'Inter',sans-serif;font-size:12px;color:#5C4D6B">
                            <span class="material-symbols-outlined shrink-0 mt-0.5" style="font-size:15px;color:#8B5FBF">schedule</span>
                            <div class="leading-tight">
                                <span class="block">Seg a Qua: 09:30 às 18:00</span>
                                <span class="block">Qui e Sex: 09:30 às 18:30</span>
                                <span class="block">Sábados: 09:30 às 17:00</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <!-- Legal -->
                <div>
                    <h4 style="font-family:'Poppins',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#2D1A40;margin-bottom:16px">Legal</h4>
                    <ul class="space-y-2.5">
                        <li><a style="font-family:'Inter',sans-serif;font-size:13px;color:#5C4D6B" class="hover:text-[#8B5FBF] transition-colors" href="#/settings?tab=legal">Política de Privacidade</a></li>
                        <li><a style="font-family:'Inter',sans-serif;font-size:13px;color:#5C4D6B" class="hover:text-[#8B5FBF] transition-colors" href="#/settings?tab=legal">Termos de Uso</a></li>
                        <li><a style="font-family:'Inter',sans-serif;font-size:13px;color:#5C4D6B" class="hover:text-[#8B5FBF] transition-colors" href="#/settings?tab=legal">Trocas e Devoluções</a></li>
                    </ul>
                </div>
            </div>

            <!-- Bottom bar -->
            <div class="border-t border-[#DDD0E8] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
                <p style="font-family:'Inter',sans-serif;font-size:12px;color:#5C4D6B">© 2026 Beleza na Web. Todos os direitos reservados.</p>
                <p style="font-family:'Inter',sans-serif;font-size:12px;color:#9B6DC2">Feito com ✦ para mulheres que se amam</p>
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
                        <input type="text" id="store-name-input" required value="${existingName}" oninput="window.handleStoreNameInput(this.value)" placeholder="Ex: Glow & Rituals Skincare" class="w-full bg-surface-container-low pl-12 pr-4 py-3 rounded-2xl border border-outline-variant/30 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium">
                    </div>
                </div>

                <!-- Preview e Foto / Logo Baseada no Nome -->
                <div class="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 flex items-center gap-3">
                    <img id="store-photo-preview" src="${existingPhoto || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300'}" class="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shrink-0 shadow-xs" onerror="this.src='https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300'">
                    <div class="flex-grow min-w-0">
                        <p class="text-[11px] font-bold text-primary flex items-center gap-1">
                            <span class="material-symbols-outlined text-[14px]">auto_awesome</span> Imagem da loja selecionada pelo nome
                        </p>
                        <p class="text-[10px] text-outline">Definida automaticamente com base no nome digitado.</p>
                    </div>
                </div>

                <!-- Foto / Logo -->
                <div>
                    <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Foto ou Logo da Loja (URL)</label>
                    <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-[20px]">image</span>
                        <input type="url" id="store-photo-input" value="${existingPhoto}" oninput="const p = document.getElementById('store-photo-preview'); if(p) p.src = this.value;" placeholder="Preenchida automaticamente ou cole uma URL..." class="w-full bg-surface-container-low pl-12 pr-4 py-3 rounded-2xl border border-outline-variant/30 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
                    </div>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="text-[10px] text-outline font-medium">Sugestões:</span>
                        <button type="button" onclick="document.getElementById('store-photo-input').value='https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300'; document.getElementById('store-photo-preview').src='https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300';" class="w-7 h-7 rounded-full overflow-hidden border border-primary/20 hover:scale-110 transition-transform cursor-pointer"><img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300" class="w-full h-full object-cover"></button>
                        <button type="button" onclick="document.getElementById('store-photo-input').value='https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300'; document.getElementById('store-photo-preview').src='https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300';" class="w-7 h-7 rounded-full overflow-hidden border border-primary/20 hover:scale-110 transition-transform cursor-pointer"><img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300" class="w-full h-full object-cover"></button>
                        <button type="button" onclick="document.getElementById('store-photo-input').value='https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300'; document.getElementById('store-photo-preview').src='https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300';" class="w-7 h-7 rounded-full overflow-hidden border border-primary/20 hover:scale-110 transition-transform cursor-pointer"><img src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300" class="w-full h-full object-cover"></button>
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

window.handleStoreNameInput = (storeName) => {
    const photoInput = document.getElementById('store-photo-input');
    const preview = document.getElementById('store-photo-preview');
    if (!storeName || !storeName.trim()) return;
    
    const norm = storeName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let detected = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300';
    if (norm.includes('glow') || norm.includes('skin') || norm.includes('pele') || norm.includes('facial')) {
        detected = 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300';
    } else if (norm.includes('make') || norm.includes('maquiagem') || norm.includes('batom') || norm.includes('glam') || norm.includes('beauty')) {
        detected = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300';
    } else if (norm.includes('rose') || norm.includes('rosé') || norm.includes('lux') || norm.includes('paris') || norm.includes('lab')) {
        detected = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300';
    } else if (norm.includes('perfume') || norm.includes('fragranc') || norm.includes('aroma') || norm.includes('essenc')) {
        detected = 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=300';
    } else if (norm.includes('cabelo') || norm.includes('hair') || norm.includes('fios')) {
        detected = 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=300';
    } else if (norm.includes('unha') || norm.includes('nail') || norm.includes('esmalte')) {
        detected = 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300';
    }
    
    if (photoInput && (!photoInput.value || photoInput.dataset.autoFilled === 'true' || photoInput.value.includes('photo-1522337360788-8b13dee7a37e'))) {
        photoInput.value = detected;
        photoInput.dataset.autoFilled = 'true';
    }
    if (preview) {
        preview.src = detected;
    }
};

window.handleCreateStoreSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('store-name-input').value.trim();
    let photo = document.getElementById('store-photo-input').value.trim();
    if (!photo) {
        const norm = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        photo = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300';
        if (norm.includes('glow') || norm.includes('skin') || norm.includes('pele')) photo = 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300';
        else if (norm.includes('make') || norm.includes('maquiagem')) photo = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300';
        else if (norm.includes('perfume')) photo = 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=300';
        else if (norm.includes('cabelo')) photo = 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=300';
        else if (norm.includes('unha')) photo = 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300';
    }
    const description = document.getElementById('store-desc-input').value;
    const phone = document.getElementById('store-phone-input').value;
    const address = document.getElementById('store-address-input').value;

    const res = auth.createStore({ name, photo, description, phone, address });
    if (res.success) {
        document.getElementById('create-store-modal').classList.add('hidden');
        
        // Trigger notifications for Admin
        if (window.notificationsManager) {
            window.notificationsManager.addNotification('admin', {
                title: 'Nova Solicitação de Criar Loja',
                message: `O lojista "${name}" solicitou a criação de uma loja oficial no marketplace.`,
                icon: 'storefront',
                color: 'text-blue-500'
            });
            window.notificationsManager.addNotification('admin', {
                title: 'Produto Aguardando Aprovação',
                message: `A nova loja "${name}" cadastrou produtos de demonstração que aguardam moderação e aprovação para o catálogo.`,
                icon: 'pending_actions',
                color: 'text-amber-500'
            });
        }

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
window.closeSellerChatModal = () => {
    const modal = document.getElementById('seller-chat-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    if (window._sellerChatEscHandler) {
        window.removeEventListener('keydown', window._sellerChatEscHandler);
        window._sellerChatEscHandler = null;
    }
};

window.openSellerChatModal = (sellerId = 'ann_official', sellerName = 'Beleza na Web Official', sellerPhoto = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100', context = null) => {
    window._activeSellerChatContext = context;
    window._activeSellerId = sellerId;
    window._activeSellerName = sellerName;
    window._activeSellerPhoto = sellerPhoto;

    let modal = document.getElementById('seller-chat-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'seller-chat-modal';
        document.body.appendChild(modal);
    }

    const renderMessages = () => {
        const msgs = window.socialManager ? window.socialManager.getSellerChatMessages(sellerId, context, sellerName) : [];
        return msgs.map(m => {
            if (m.sender === 'user') {
                return `
                <div class="flex justify-end mb-3">
                    <div class="bg-primary text-white text-xs font-medium px-4 py-2.5 rounded-2xl rounded-tr-none max-w-[82%] shadow-sm">
                        <p class="leading-relaxed whitespace-pre-wrap">${m.text}</p>
                        <span class="text-[9px] text-white/70 block text-right mt-1">${m.time}</span>
                    </div>
                </div>`;
            } else {
                return `
                <div class="flex items-start gap-2 mb-3">
                    <img src="${sellerPhoto}" onerror="this.src='img/nycoly_profile.png'" class="w-8 h-8 rounded-full object-cover border border-primary/20 mt-1 shrink-0">
                    <div class="bg-surface-container-low text-on-surface text-xs font-medium px-4 py-2.5 rounded-2xl rounded-tl-none max-w-[82%] border border-outline-variant/30 shadow-sm">
                        <p class="font-bold text-[10px] text-primary mb-0.5 flex items-center gap-1">
                            ${sellerName}
                            <span class="material-symbols-outlined text-[12px] text-emerald-600" style="font-variation-settings:'FILL' 1;">verified</span>
                        </p>
                        <p class="leading-relaxed whitespace-pre-wrap text-slate-800">${m.text}</p>
                        <span class="text-[9px] text-outline block mt-1">${m.time}</span>
                    </div>
                </div>`;
            }
        }).join('');
    };

    // Context Banner HTML
    let contextBannerHTML = '';
    if (context && context.type === 'product' && context.productName) {
        contextBannerHTML = `
        <div class="bg-purple-50/95 border-b border-purple-100 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 shadow-xs">
            <div class="flex items-center gap-2.5 min-w-0">
                <img src="${context.productImg || 'img/serum_facial_1791458880967.jpg'}" onerror="this.src='img/serum_facial_1791458880967.jpg'" class="w-10 h-10 rounded-xl object-contain bg-white border border-purple-200 shrink-0 p-0.5 shadow-2xs">
                <div class="min-w-0">
                    <span class="text-[9px] uppercase tracking-wider text-primary font-bold block flex items-center gap-1">
                        <span class="material-symbols-outlined text-[13px]">shopping_bag</span>
                        Dúvida sobre este produto:
                    </span>
                    <p class="text-xs font-bold text-[#2D1A40] truncate leading-tight">${context.productName}</p>
                    <p class="text-[11px] font-semibold text-primary">${context.productPrice || ''}</p>
                </div>
            </div>
            <span class="text-[10px] bg-white border border-purple-200 text-purple-700 font-bold px-2.5 py-1 rounded-full shrink-0 shadow-xs hidden sm:inline-block">
                Contexto Ativo
            </span>
        </div>`;
    } else if (context && context.type === 'order' && context.orderId) {
        contextBannerHTML = `
        <div class="bg-purple-50/95 border-b border-purple-100 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 shadow-xs">
            <div class="flex items-center gap-2 min-w-0">
                <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-[18px]">local_shipping</span>
                </div>
                <div class="min-w-0">
                    <span class="text-[9px] uppercase tracking-wider text-primary font-bold block">Suporte ao Pedido #${context.orderId}</span>
                    <p class="text-xs font-bold text-[#2D1A40] truncate leading-tight">${sellerName}</p>
                </div>
            </div>
            <span class="text-[10px] bg-purple-100 text-primary font-bold px-2.5 py-0.5 rounded-full shrink-0">
                Logística
            </span>
        </div>`;
    } else {
        contextBannerHTML = `
        <div class="bg-purple-50/95 border-b border-purple-100 px-4 py-2 flex items-center justify-between gap-3 shrink-0 shadow-xs">
            <div class="flex items-center gap-2 min-w-0">
                <span class="material-symbols-outlined text-primary text-[18px]">storefront</span>
                <div class="min-w-0">
                    <span class="text-[9px] uppercase tracking-wider text-primary font-bold block">Canal Oficial da Loja</span>
                    <p class="text-xs font-bold text-[#2D1A40] truncate leading-tight">${sellerName}</p>
                </div>
            </div>
            <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full shrink-0">
                Online Agora
            </span>
        </div>`;
    }

    // Quick Action Suggestion Chips
    const getQuickChips = () => {
        if (context && context.type === 'product') {
            return [
                { text: 'Tem a pronta entrega?', icon: 'inventory_2' },
                { text: 'Qual o prazo e frete?', icon: 'local_shipping' },
                { text: 'O produto é vegano?', icon: 'eco' },
                { text: 'Tem cupom de desconto?', icon: 'sell' },
                { text: 'Como usar na rotina?', icon: 'sparkles' }
            ];
        } else if (context && context.type === 'order') {
            return [
                { text: 'Quando meu pedido chega?', icon: 'local_shipping' },
                { text: 'Qual o código de rastreio?', icon: 'qr_code' },
                { text: 'Preciso alterar o endereço', icon: 'edit_location' }
            ];
        } else {
            return [
                { text: 'Como funciona o frete?', icon: 'local_shipping' },
                { text: 'Tem cupom para 1ª compra?', icon: 'sell' },
                { text: 'Quais os mais vendidos?', icon: 'star' },
                { text: 'Como funciona a garantia?', icon: 'verified' }
            ];
        }
    };

    modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[350] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200';
    
    // Backdrop click to close
    modal.onclick = (e) => {
        if (e.target === modal) {
            window.closeSellerChatModal();
        }
    };

    modal.innerHTML = `
        <div class="bg-white rounded-[28px] sm:rounded-[32px] max-w-lg w-full shadow-2xl border border-primary/20 overflow-hidden flex flex-col h-[560px] max-h-[92vh] animate-in zoom-in-95 duration-200 relative" onclick="event.stopPropagation()">
            
            <!-- Header with High-Contrast, Obvious Close Button -->
            <div class="bg-gradient-to-r from-primary to-secondary px-4 sm:px-5 py-3.5 sm:py-4 text-white flex items-center justify-between shadow-md relative z-10 shrink-0">
                <div class="flex items-center gap-3 min-w-0 mr-2">
                    <div class="relative shrink-0">
                        <img src="${sellerPhoto}" onerror="this.src='img/nycoly_profile.png'" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-white/80 shadow-sm">
                        <span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white shadow-xs"></span>
                    </div>
                    <div class="min-w-0">
                        <h3 class="font-bold text-sm sm:text-base leading-tight truncate text-white">${sellerName}</h3>
                        <span class="text-[11px] text-white/90 flex items-center gap-1 mt-0.5">
                            <span class="material-symbols-outlined text-[13px] text-emerald-300" style="font-variation-settings:'FILL' 1;">verified</span>
                            Vendedor Verificado • Online agora
                        </span>
                    </div>
                </div>

                <!-- Botão de Sair / Fechar (X) Destacado -->
                <button 
                    type="button" 
                    id="btn-close-seller-chat"
                    onclick="window.closeSellerChatModal()" 
                    class="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-primary transition-all duration-200 cursor-pointer shadow-md text-xs font-bold border border-white/40 shrink-0"
                    title="Fechar conversa (Esc)"
                    aria-label="Fechar conversa">
                    <span class="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform">close</span>
                    <span>Sair</span>
                </button>
            </div>

            <!-- Context Banner -->
            ${contextBannerHTML}

            <!-- Messages Body -->
            <div id="seller-chat-body" class="flex-grow p-4 overflow-y-auto subtle-scroll bg-surface-bright/50 flex flex-col">
                <div id="seller-chat-messages-container">
                    ${renderMessages()}
                </div>
                
                <!-- Typing Indicator Bubble (hidden by default) -->
                <div id="seller-typing-indicator" class="hidden items-center gap-2 mb-3 mt-1">
                    <img src="${sellerPhoto}" onerror="this.src='img/nycoly_profile.png'" class="w-7 h-7 rounded-full object-cover border border-primary/20 shrink-0">
                    <div class="bg-surface-container-low text-on-surface text-xs px-3.5 py-2 rounded-2xl rounded-tl-none border border-outline-variant/30 flex items-center gap-2 shadow-xs">
                        <span class="text-[11px] text-primary font-semibold">${sellerName} está digitando</span>
                        <span class="inline-flex gap-1 items-center">
                            <span class="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce"></span>
                            <span class="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span class="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Quick Action Suggestion Chips -->
            <div class="px-3 pt-2 pb-1.5 bg-white flex items-center gap-1.5 overflow-x-auto subtle-scroll border-t border-purple-100/60 shrink-0">
                <span class="text-[10px] text-[#5C4D6B] font-bold shrink-0 hidden sm:inline-flex items-center gap-1 mr-0.5">
                    <span class="material-symbols-outlined text-[13px] text-primary">tips_and_updates</span> Perguntas rápidas:
                </span>
                ${getQuickChips().map(chip => `
                    <button 
                        type="button" 
                        onclick="window.handleSendSellerQuickQuestion('${chip.text.replace(/'/g, "\\'")}')" 
                        class="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-primary hover:text-white text-primary border border-purple-200/80 text-[11px] font-medium whitespace-nowrap transition-all duration-150 cursor-pointer shadow-2xs flex items-center gap-1">
                        <span class="material-symbols-outlined text-[12px]">${chip.icon}</span>
                        ${chip.text}
                    </button>
                `).join('')}
            </div>

            <!-- Input Area -->
            <form onsubmit="window.handleSendSellerMessage(event, '${sellerId}', '${sellerName}')" class="p-3 bg-white border-t border-primary/10 flex items-center gap-2 shrink-0">
                <input 
                    type="text" 
                    id="seller-chat-input" 
                    placeholder="Digite sua dúvida sobre ${context && context.productName ? 'este produto' : 'a loja'}..." 
                    required 
                    autocomplete="off" 
                    class="flex-grow bg-surface-container-low px-4 py-2.5 rounded-full text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/30 text-on-surface">
                <button 
                    type="submit" 
                    class="w-10 h-10 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
                    title="Enviar mensagem">
                    <span class="material-symbols-outlined text-[18px]">send</span>
                </button>
            </form>
        </div>
    `;

    modal.classList.remove('hidden');
    const body = document.getElementById('seller-chat-body');
    if (body) body.scrollTop = body.scrollHeight;

    const input = document.getElementById('seller-chat-input');
    if (input) setTimeout(() => input.focus(), 150);

    // Escape Key listener
    if (window._sellerChatEscHandler) {
        window.removeEventListener('keydown', window._sellerChatEscHandler);
    }
    window._sellerChatEscHandler = (e) => {
        if (e.key === 'Escape') {
            window.closeSellerChatModal();
        }
    };
    window.addEventListener('keydown', window._sellerChatEscHandler);
};

// Quick Question helper
window.handleSendSellerQuickQuestion = (questionText) => {
    const input = document.getElementById('seller-chat-input');
    if (input) {
        input.value = questionText;
        const form = input.closest('form');
        if (form) {
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    }
};

window.handleSendSellerMessage = (e, sellerId, sellerName) => {
    e.preventDefault();
    const input = document.getElementById('seller-chat-input');
    if (!input || !input.value.trim()) return;

    const val = input.value.trim();
    input.value = '';
    
    const context = window._activeSellerChatContext || null;
    const user = auth.getUser();

    if (window.socialManager) {
        // Send user message and trigger contextual reply
        window.socialManager.sendSellerMessage(sellerId, val, sellerName, context);
        
        // Notify Seller of New Client Message
        if (window.notificationsManager) {
            const prodHint = (context && context.productName) ? ` sobre "${context.productName}"` : '';
            window.notificationsManager.addNotification('vendedor@annbeauty.com', {
                title: 'Nova Mensagem de Cliente',
                message: `O cliente ${user ? user.name : 'Cliente'} enviou uma mensagem no chat da sua loja${prodHint}: "${val}"`,
                icon: 'chat_bubble',
                color: 'text-blue-500'
            });
        }

        // Immediately update UI with user's message
        const container = document.getElementById('seller-chat-messages-container');
        if (container) {
            const msgs = window.socialManager.getSellerChatMessages(sellerId, context, sellerName);
            const sellerPhoto = window._activeSellerPhoto || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100';
            container.innerHTML = msgs.map(m => {
                if (m.sender === 'user') {
                    return `
                    <div class="flex justify-end mb-3">
                        <div class="bg-primary text-white text-xs font-medium px-4 py-2.5 rounded-2xl rounded-tr-none max-w-[82%] shadow-sm">
                            <p class="leading-relaxed whitespace-pre-wrap">${m.text}</p>
                            <span class="text-[9px] text-white/70 block text-right mt-1">${m.time}</span>
                        </div>
                    </div>`;
                } else {
                    return `
                    <div class="flex items-start gap-2 mb-3">
                        <img src="${sellerPhoto}" onerror="this.src='img/nycoly_profile.png'" class="w-8 h-8 rounded-full object-cover border border-primary/20 mt-1 shrink-0">
                        <div class="bg-surface-container-low text-on-surface text-xs font-medium px-4 py-2.5 rounded-2xl rounded-tl-none max-w-[82%] border border-outline-variant/30 shadow-sm">
                            <p class="font-bold text-[10px] text-primary mb-0.5 flex items-center gap-1">
                                ${sellerName}
                                <span class="material-symbols-outlined text-[12px] text-emerald-600" style="font-variation-settings:'FILL' 1;">verified</span>
                            </p>
                            <p class="leading-relaxed whitespace-pre-wrap text-slate-800">${m.text}</p>
                            <span class="text-[9px] text-outline block mt-1">${m.time}</span>
                        </div>
                    </div>`;
                }
            }).join('');
            
            const body = document.getElementById('seller-chat-body');
            if (body) body.scrollTop = body.scrollHeight;
        }
    }
};

// Global Listeners for Seller Chat Events
window.addEventListener('seller-typing-start', (e) => {
    const indicator = document.getElementById('seller-typing-indicator');
    if (indicator) {
        indicator.classList.remove('hidden');
        indicator.classList.add('flex');
        const body = document.getElementById('seller-chat-body');
        if (body) body.scrollTop = body.scrollHeight;
    }
});

window.addEventListener('seller-typing-stop', (e) => {
    const indicator = document.getElementById('seller-typing-indicator');
    if (indicator) {
        indicator.classList.add('hidden');
        indicator.classList.remove('flex');
    }
});

window.addEventListener('seller-chat-updated', (e) => {
    const sellerId = window._activeSellerId;
    const sellerName = window._activeSellerName || 'Consultor de Beleza';
    const sellerPhoto = window._activeSellerPhoto || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100';
    const context = window._activeSellerChatContext || null;
    
    const container = document.getElementById('seller-chat-messages-container');
    if (container && window.socialManager && sellerId) {
        const msgs = window.socialManager.getSellerChatMessages(sellerId, context, sellerName);
        container.innerHTML = msgs.map(m => {
            if (m.sender === 'user') {
                return `
                <div class="flex justify-end mb-3">
                    <div class="bg-primary text-white text-xs font-medium px-4 py-2.5 rounded-2xl rounded-tr-none max-w-[82%] shadow-sm">
                        <p class="leading-relaxed whitespace-pre-wrap">${m.text}</p>
                        <span class="text-[9px] text-white/70 block text-right mt-1">${m.time}</span>
                    </div>
                </div>`;
            } else {
                return `
                <div class="flex items-start gap-2 mb-3">
                    <img src="${sellerPhoto}" onerror="this.src='img/nycoly_profile.png'" class="w-8 h-8 rounded-full object-cover border border-primary/20 mt-1 shrink-0">
                    <div class="bg-surface-container-low text-on-surface text-xs font-medium px-4 py-2.5 rounded-2xl rounded-tl-none max-w-[82%] border border-outline-variant/30 shadow-sm">
                        <p class="font-bold text-[10px] text-primary mb-0.5 flex items-center gap-1">
                            ${sellerName}
                            <span class="material-symbols-outlined text-[12px] text-emerald-600" style="font-variation-settings:'FILL' 1;">verified</span>
                        </p>
                        <p class="leading-relaxed whitespace-pre-wrap text-slate-800">${m.text}</p>
                        <span class="text-[9px] text-outline block mt-1">${m.time}</span>
                    </div>
                </div>`;
            }
        }).join('');
        const body = document.getElementById('seller-chat-body');
        if (body) body.scrollTop = body.scrollHeight;
    }
});

// Listen for notifications updates to update badge count in header
window.addEventListener('notifications-updated', () => {
    const badge = document.getElementById('notif-badge');
    if (badge) {
        const user = auth.getUser();
        if (user && window.notificationsManager) {
            const count = window.notificationsManager.getNotifications(user.email).filter(n => !n.read).length;
            badge.innerText = count;
            if (count > 0) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        } else {
            badge.classList.add('hidden');
        }
    }
});
