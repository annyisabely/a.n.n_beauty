// ============================================
// Beleza na Web — SPA Router & App Init
// ============================================

import { renderHeader, renderBottomNav, renderFooter, FULLSCREEN_PAGES } from './components.js';
import { initGlowAI } from './glowai.js';
import { auth } from './auth.js';
import './social_manager.js'; // Registers window.socialManager globally

// Lazy-load page modules
const pageModules = {
    home:     () => import('./pages/home.js'),
    search:   () => import('./pages/search.js'),
    login:    () => import('./pages/login.js'),
    signup:   () => import('./pages/signup.js'),
    recover:  () => import('./pages/recover.js'),
    profile:  () => import('./pages/profile.js'),
    product:  () => import('./pages/product.js'),
    cart:     () => import('./pages/cart.js'),
    checkout: () => import('./pages/checkout.js'),
    favorites:() => import('./pages/favorites.js'),
    tracking: () => import('./pages/tracking.js'),
    videos:   () => import('./pages/videos.js'),
    tutorial: () => import('./pages/tutorial.js'),
    rituals:  () => import('./pages/rituals.js'),
    about:    () => import('./pages/about.js'),
    notifications: () => import('./pages/notifications.js'),
    settings: () => import('./pages/settings.js'),
    admin:    () => import('./pages/admin.js'),
    store:    () => import('./pages/store.js'),
};

// Get current page from hash
function getCurrentPage() {
    const hash = window.location.hash || '#/home';
    const cleanHash = hash.replace('#/', '').split('?')[0].split('/')[0] || 'home';
    return pageModules[cleanHash] ? cleanHash : 'home';
}

// Main render function
async function renderPage() {
    const page = getCurrentPage();
    
    // Auth route guard
    const publicPages = ['login', 'signup', 'recover'];
    const isLoggedIn = auth.isLoggedIn();
    if (!isLoggedIn && !publicPages.includes(page)) {
        window.location.hash = '#/login';
        return;
    }
    if (isLoggedIn && publicPages.includes(page)) {
        window.location.hash = '#/home';
        return;
    }

    // Admin route security guard
    if (page === 'admin') {
        const currentUser = auth.getUser();
        if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'admin_master')) {
            window.location.hash = '#/home';
            setTimeout(() => {
                import('./components.js').then(m => m.showToast('Acesso negado. Apenas administradores podem acessar o painel.', 'error'));
            }, 100);
            return;
        }
    }

    const app = document.getElementById('app');
    const isFullscreen = FULLSCREEN_PAGES.includes(page);

    // Fade out
    const content = document.getElementById('page-content');
    if (content) {
        content.classList.add('fade-out');
        await new Promise(r => setTimeout(r, 200));
    }

    // Load page module
    let mod;
    try {
        mod = await pageModules[page]();
    } catch (err) {
        console.error(`Failed to load module for page: ${page}`, err);
        app.innerHTML = `<div class="p-10 text-center"><h2 class="text-2xl font-serif text-error">Erro ao carregar página</h2><p class="text-on-surface-variant mt-2">Por favor, tente recarregar.</p><a href="#/home" class="text-primary underline mt-4 block">Voltar ao início</a></div>`;
        return;
    }

    const pageHTML = mod.default();

    // Build full page
    if (isFullscreen) {
        app.innerHTML = `
            <div id="page-content" class="fade-out">
                ${pageHTML}
            </div>
        `;
        document.body.className = 'min-h-screen antialiased';
    } else {
        app.innerHTML = `
            ${renderHeader(page)}
            ${renderBottomNav(page)}
            <div id="page-content" class="fade-out pt-0 md:pt-[73px] pb-24 md:pb-0">
                ${pageHTML}
            </div>
            ${renderFooter()}
        `;
        document.body.className = 'bg-background text-on-background min-h-screen antialiased';
    }

    // Mount GlowAI widget (re-mount on every navigation)
    initGlowAI();

    // Lifecycle Hook: mount()
    // This allows pages to run their own logic after being added to the DOM
    if (typeof mod.mount === 'function') {
        // Wait for next frame to ensure elements are in DOM
        requestAnimationFrame(() => {
            mod.mount();
        });
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Fade in
    requestAnimationFrame(() => {
        const newContent = document.getElementById('page-content');
        if (newContent) {
            newContent.classList.remove('fade-out');
            newContent.classList.add('fade-in');
        }
    });

    // Update page title
    const titles = {
        home: 'Beleza na Web - Store',
        search: 'Beleza na Web - Search',
        login: 'Beleza na Web - Login',
        signup: 'Beleza na Web - Sign Up',
        recover: 'Beleza na Web - Password Recovery',
        profile: 'User Profile - Beleza na Web',
        product: 'Beleza na Web - Product Detail',
        cart: 'Beleza na Web - Shopping Cart',
        checkout: 'Beleza na Web - Checkout',
        favorites: 'Beleza na Web - Favorites',
        tracking: 'Track Your Order - Beleza na Web',
        videos: 'Beleza na Web - Tutorials',
        tutorial: 'Beleza na Web - Tutorial',
        rituals: 'Beleza na Web - Ritual Guide',
        about: 'About Us - Beleza na Web',
        notifications: 'Notificações - Beleza na Web',
    };
    document.title = titles[page] || 'Beleza na Web';
}

// Listen for hash changes — re-render even when only query params change
let _lastFullHash = '';
window.addEventListener('hashchange', () => {
    const newHash = window.location.hash;
    if (newHash !== _lastFullHash) {
        _lastFullHash = newHash;
        renderPage();
    }
});

// Listen for auth changes to update header/footer
window.addEventListener('auth-change', renderPage);

// Global Voice Search Logic
window.startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        import('./components.js').then(m => m.showToast('Seu navegador não suporta busca por voz.', 'error'));
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        import('./components.js').then(m => m.showToast('Ouvindo...', 'info'));
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        import('./components.js').then(m => m.showToast(`Você disse: "${transcript}"`, 'success'));

        // Se pediu tutorial/vídeo de maquiagem/delineador
        if (transcript.includes('vídeo') || transcript.includes('video') || transcript.includes('tutorial')) {
            if (transcript.includes('maquiagem') || transcript.includes('delineador')) {
                window.location.hash = '#/tutorial';
                return;
            }
        }
        
        // Se for só produto/maquiagem
        if (transcript.includes('maquiagem') || transcript.includes('delineador')) {
            window.location.hash = '#/search';
            setTimeout(() => {
                const searchInput = document.getElementById('search-input');
                const headerSearchInput = document.getElementById('header-search-input');
                if (searchInput) searchInput.value = transcript;
                if (headerSearchInput) headerSearchInput.value = transcript;
                if (window.handleSearch) window.handleSearch({ target: { value: transcript } });
            }, 300);
            return;
        }

        // Para qualquer outra coisa, também ir para a busca
        window.location.hash = '#/search';
        setTimeout(() => {
            const searchInput = document.getElementById('search-input');
            const headerSearchInput = document.getElementById('header-search-input');
            if (searchInput) searchInput.value = transcript;
            if (headerSearchInput) headerSearchInput.value = transcript;
            if (window.handleSearch) window.handleSearch({ target: { value: transcript } });
        }, 300);
    };

    recognition.onerror = () => {
        import('./components.js').then(m => m.showToast('Erro ao capturar voz. Tente novamente.', 'error'));
    };

    recognition.start();
};

// Initial render
window.addEventListener('DOMContentLoaded', () => {
    if (!window.location.hash) {
        window.location.hash = '#/home';
    } else {
        renderPage();
    }
    
    // Notification interval - optimized to avoid spam
    setInterval(() => {
        const lastNotif = localStorage.getItem('ann_last_notification_time') || 0;
        const now = Date.now();
        // Only show every 5 minutes max
        if (now - lastNotif < 300000) return;

        if (localStorage.getItem('ann_notifications_enabled') === 'true' && ("Notification" in window) && Notification.permission === "granted") {
            new Notification("Beleza na Web - Novidade", {
                body: "Temos uma nova oferta exclusiva esperando por você na loja!",
                icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuD41q-VUnwu5joHMxbWJsr36dy1zx3rIn2vEK7uzvQTDUffwl0ZH_HI_dTANk1KbB9owXbG4r3zHuZ0HVyYdnrM_iCEs2T28ZeOaR08HylhHFMcLQ7HbG_Sie4x-YY2ALCH46qv813TkJWK1AuLKhbgI70JyZ3h_2uFi-BnVubhKdnicfILcz2wGII7oUz38OzHYvodmNc7KWNeyoqLmi7hoHDJdbzNFetGZrb5-7anzBucsvdu8yAwBxA_KgpzWQXgXaiSjTNilD4W"
            });
            localStorage.setItem('ann_last_notification_time', now);
        }
    }, 60000);
});

