import { auth } from '../auth.js';
import { cartManager } from '../cart_manager.js';
import { showToast } from '../components.js';
import { dataManager, storesData } from '../data_manager.js';
import { socialManager } from '../social_manager.js';

export default function storePage() {
  const user = auth.getUser();
  
  // Read store ID from URL hash: #/store?id=nycoly
  const hashQuery = window.location.hash.split('?')[1] || '';
  const urlParams = new URLSearchParams(hashQuery);
  const storeIdParam = urlParams.get('id') || 'ann_beauty';
  
  // Load the store data from catalog, fallback to ann_beauty
  const storeInfo = storesData[storeIdParam] || storesData['ann_beauty'];

  const storeId = storeInfo.id;
  const storeName = storeInfo.name;
  const storePhoto = storeInfo.photo;
  const storeCover = storeInfo.cover;
  const storeDesc = storeInfo.desc;
  const storePhone = storeInfo.phone;
  const storeAddress = storeInfo.address;

  const isFollowing = socialManager.isFollowingStore(storeId);
  const followersCount = (storeInfo.followersBase || 1000) + (socialManager.isFollowingStore(storeId) ? 1 : 0);

  // Filter products belonging to this store
  const allProducts = dataManager.generateProducts(100);
  const products = allProducts.filter(p => p.company_id === storeId).slice(0, 12);

  window.handleToggleFollowStorePage = () => {
    const res = socialManager.toggleFollowStore(storeId, storeName);
    showToast(res.message, res.success ? (res.isFollowing ? 'success' : 'info') : 'error');
    
    const btn = document.getElementById('store-page-follow-btn');
    const countEl = document.getElementById('store-page-followers-count');
    if (btn) {
      const active = socialManager.isFollowingStore(storeId);
      btn.className = active
        ? 'px-6 py-2.5 rounded-full bg-primary/10 text-primary border border-primary/30 font-bold text-xs flex items-center gap-2 transition-all'
        : 'px-6 py-2.5 rounded-full bg-primary text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all';
      btn.innerHTML = active
        ? `<span class="material-symbols-outlined text-[18px]">check</span> Seguindo`
        : `<span class="material-symbols-outlined text-[18px]">add</span> Seguir Loja`;
    }
    if (countEl) {
      countEl.innerText = `${socialManager.getStoreFollowersCount(storeId)} Seguidores`;
    }
  };

  window.addToCartFromStore = (index) => {
    const p = products[index];
    if (p) {
      cartManager.addItem(p);
      showToast(`${p.name} adicionado ao carrinho!`, 'success');
    }
  };

  return `
  <main class="flex-grow max-w-[1280px] mx-auto px-4 md:px-10 w-full pt-4 pb-20 bg-background">
    <!-- Store Cover Banner -->
    <div class="relative w-full h-[240px] md:h-[320px] rounded-[36px] overflow-hidden shadow-xl border border-primary/10 mb-16">
      <img src="${storeCover}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      
      <div class="absolute bottom-6 right-6 flex gap-3 z-10">
        <!-- Seguir Loja Button -->
        <button id="store-page-follow-btn" onclick="window.handleToggleFollowStorePage()" class="${isFollowing ? 'px-6 py-2.5 rounded-full bg-primary/10 text-primary border border-primary/30 font-bold text-xs flex items-center gap-2 transition-all' : 'px-6 py-2.5 rounded-full bg-primary text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all'}">
          ${isFollowing ? `<span class="material-symbols-outlined text-[18px]">check</span> Seguindo` : `<span class="material-symbols-outlined text-[18px]">add</span> Seguir Loja`}
        </button>

        <!-- Chat com Vendedor Button -->
        <button onclick="window.openSellerChatModal('${storeId}', '${storeName}', '${storePhoto}')" class="px-6 py-2.5 rounded-full bg-white/90 backdrop-blur-md text-on-surface font-bold text-xs hover:bg-white flex items-center gap-2 shadow-md transition-all">
          <span class="material-symbols-outlined text-secondary text-[18px]">chat</span> Conversar com Vendedor
        </button>
      </div>
    </div>

    <!-- Store Profile Header -->
    <div class="relative -mt-28 px-6 md:px-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 z-20">
      <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
        <!-- Logo / Photo -->
        <div class="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white shadow-2xl bg-white overflow-hidden relative">
          <img src="${storePhoto}" class="w-full h-full object-cover">
          <span class="absolute bottom-2 right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs shadow-md" title="Loja Oficial Verificada">✓</span>
        </div>

        <div>
          <div class="flex items-center gap-2 mb-1">
            <h1 class="text-3xl font-serif font-bold text-on-surface tracking-tight">${storeName}</h1>
            <span class="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Loja Oficial</span>
          </div>

          <p class="text-xs text-on-surface-variant max-w-xl mb-3 leading-relaxed font-medium opacity-90">${storeDesc}</p>

          <!-- Metrics Row -->
          <div class="flex flex-wrap items-center gap-4 md:gap-6 text-xs text-on-surface font-semibold mt-2">
            <div class="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1">star</span>
              <span class="font-bold text-on-surface text-sm">${storeInfo.rating}</span>
              <span class="text-outline text-[10px]">(${storeInfo.reviews} avaliações)</span>
            </div>
            <div id="store-page-followers-count" class="bg-purple-50 text-purple-700 px-3.5 py-1.5 rounded-full border border-purple-100 font-bold">
              ${followersCount} Seguidores
            </div>
            <div class="bg-primary/5 text-primary px-3.5 py-1.5 rounded-full border border-primary/10 font-bold">
              📦 ${storeInfo.products} Produtos Cadastrados
            </div>
            <div class="text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 text-[11px]">
              <span class="material-symbols-outlined text-[16px]">verified</span> ${storeInfo.delivery} Entregas no prazo
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Store Navigation Tabs -->
    <div class="border-b border-primary/10 mb-8 flex gap-8 text-sm font-bold text-outline">
      <button class="pb-3 border-b-2 border-primary text-primary flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">grid_view</span> Produtos em Destaque (${products.length})
      </button>
      <button class="pb-3 hover:text-primary transition-colors flex items-center gap-2 opacity-70">
        <span class="material-symbols-outlined text-[18px]">info</span> Sobre a Loja
      </button>
      <button class="pb-3 hover:text-primary transition-colors flex items-center gap-2 opacity-70">
        <span class="material-symbols-outlined text-[18px]">reviews</span> Avaliações (340)
      </button>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      ${products.map((p, index) => `
        <div class="group bg-surface-bright rounded-3xl overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col hover:shadow-xl transition-all duration-300 relative">
          <div class="relative aspect-square bg-transparent overflow-hidden">
            <span class="absolute top-3 left-3 bg-secondary/10 text-secondary font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider z-10 shadow-sm">Vendedor Oficial</span>
            <a href="#/product" class="block w-full h-full">
              <img src="${p.img.startsWith('http') ? p.img : 'https://lh3.googleusercontent.com/aida-public/' + p.img}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500">
            </a>
          </div>

          <div class="p-4 flex flex-col flex-grow">
            <a href="#/product" class="text-xs font-bold text-on-surface line-clamp-1 hover:text-primary transition-colors mb-1">${p.name}</a>
            <div class="flex items-center gap-1 text-amber-400 mb-3">
              <span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1">star</span>
              <span class="text-[10px] font-bold text-on-surface">4.9</span>
            </div>

            <div class="mt-auto flex items-center justify-between pt-2 border-t border-primary/5">
              <span class="font-display font-bold text-primary text-base">${p.price}</span>
              <button onclick="window.addToCartFromStore(${index})" class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md">
                <span class="material-symbols-outlined text-[16px]">add_shopping_cart</span>
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </main>`;
}
