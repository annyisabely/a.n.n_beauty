// ============================================
// A.n.n Beauty — SPA Router & App Init
// ============================================

import { renderHeader, renderBottomNav, renderFooter, FULLSCREEN_PAGES } from './components.js';

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
    admin:    () => import('./pages/admin.js'),
};

// Get current page from hash
function getCurrentPage() {
    const hash = window.location.hash || '#/home';
    const page = hash.replace('#/', '') || 'home';
    return pageModules[page] ? page : 'home';
}

// Main render function
async function renderPage() {
    const page = getCurrentPage();
    const app = document.getElementById('app');
    const isFullscreen = FULLSCREEN_PAGES.includes(page);

    // Fade out
    const content = document.getElementById('page-content');
    if (content) {
        content.classList.add('fade-out');
        await new Promise(r => setTimeout(r, 200));
    }

    // Load page module
    const mod = await pageModules[page]();
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
        home: 'A.n.n Beauty - Store',
        search: 'A.n.n Beauty - Search',
        login: 'A.n.n Beauty - Login',
        signup: 'A.n.n Beauty - Sign Up',
        recover: 'A.n.n Beauty - Password Recovery',
        profile: 'User Profile - A.n.n Beauty',
        product: 'A.n.n Beauty - Product Detail',
        cart: 'A.n.n Beauty - Shopping Cart',
        checkout: 'A.n.n Beauty - Checkout',
        favorites: 'A.n.n Beauty - Favorites',
        tracking: 'Track Your Order - A.n.n Beauty',
        videos: 'A.n.n Beauty - Tutorials',
        tutorial: 'A.n.n Beauty - Tutorial',
        rituals: 'A.n.n Beauty - Ritual Guide',
        about: 'About Us - A.n.n Beauty',
        notifications: 'Notificações - A.n.n Beauty',
    };
    document.title = titles[page] || 'A.n.n Beauty';
}

// Listen for hash changes
window.addEventListener('hashchange', renderPage);

// Listen for auth changes to update header/footer
window.addEventListener('auth-change', renderPage);

// Initial render
window.addEventListener('DOMContentLoaded', () => {
    if (!window.location.hash) {
        window.location.hash = '#/home';
    } else {
        renderPage();
    }
});
