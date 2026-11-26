import { cartManager } from '../cart_manager.js';
import { showToast } from '../components.js';
import { dataManager } from '../data_manager.js';
import { auth } from '../auth.js';

export default function searchPage() {
  const allCatalogProducts = dataManager.generateProducts(120);

  // Parse query from URL: #/search?q=...
  const hashQuery = window.location.hash.split('?')[1] || '';
  const urlParams = new URLSearchParams(hashQuery);
  const initialQuery = urlParams.get('q') ? decodeURIComponent(urlParams.get('q')).trim() : '';

  let currentQuery = initialQuery;
  let selectedCategories = [];
  let selectedBrands = [];
  let minPrice = null;
  let maxPrice = null;
  let currentSort = 'relevance';
  let filteredProducts = [...allCatalogProducts];

  // Helper: parse price to number
  function parsePrice(priceStr) {
    if (!priceStr) return 0;
    return parseFloat(priceStr.replace('R$ ', '').replace('.', '').replace(',', '.')) || 0;
  }

  // Master Filter & Sort function
  function applyAllFilters() {
    let result = [...allCatalogProducts];
    const q = currentQuery.toLowerCase().trim();

    // 1. Text Query Filter
    if (q) {
      if (q === 'ofertas') {
        result = result.filter(p => p.oldPrice || p.badge === 'Oferta' || p.badge === 'Bestseller' || p.badge === 'Mais vendido');
      } else if (q === 'categorias') {
        // Keep all, sorted by category
        result.sort((a, b) => (a.cat || '').localeCompare(b.cat || ''));
      } else if (q === 'marcas') {
        // Keep all, sorted by brand
        result.sort((a, b) => (a.company_name || '').localeCompare(b.company_name || ''));
      } else {
        result = result.filter(p => 
          (p.name && p.name.toLowerCase().includes(q)) || 
          (p.desc && p.desc.toLowerCase().includes(q)) ||
          (p.cat && p.cat.toLowerCase().includes(q)) ||
          (p.company_name && p.company_name.toLowerCase().includes(q))
        );
      }
    }

    // 2. Category Checkboxes
    if (selectedCategories.length > 0) {
      result = result.filter(p => {
        const cat = (p.cat || '').toLowerCase();
        return selectedCategories.some(c => cat.includes(c.toLowerCase()));
      });
    }

    // 3. Brand Checkboxes
    if (selectedBrands.length > 0) {
      result = result.filter(p => {
        const brand = (p.company_name || '').toLowerCase();
        return selectedBrands.some(b => brand.includes(b.toLowerCase()));
      });
    }

    // 4. Price Range
    if (minPrice !== null && !isNaN(minPrice)) {
      result = result.filter(p => parsePrice(p.price) >= minPrice);
    }
    if (maxPrice !== null && !isNaN(maxPrice)) {
      result = result.filter(p => parsePrice(p.price) <= maxPrice);
    }

    // 5. Sorting
    if (currentSort === 'price_asc') {
      result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (currentSort === 'price_desc') {
      result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (currentSort === 'newest') {
      result.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    }

    filteredProducts = result;
    renderSearchResults(filteredProducts);

    // Update count display
    const countEl = document.getElementById('search-count');
    if (countEl) countEl.innerText = `${filteredProducts.length} produtos encontrados`;
  }

  window.handleSearchInput = (event) => {
    currentQuery = event.target.value;
    applyAllFilters();
  };

  window.handleSortChange = (event) => {
    currentSort = event.target.value;
    applyAllFilters();
  };

  window.handleCategoryFilterChange = () => {
    const checkboxes = document.querySelectorAll('.cat-filter-checkbox:checked');
    selectedCategories = Array.from(checkboxes).map(cb => cb.value);
    applyAllFilters();
  };

  window.handleBrandFilterChange = () => {
    const checkboxes = document.querySelectorAll('.brand-filter-checkbox:checked');
    selectedBrands = Array.from(checkboxes).map(cb => cb.value);
    applyAllFilters();
  };

  window.applyPriceFilter = () => {
    const minEl = document.getElementById('price-min');
    const maxEl = document.getElementById('price-max');
    minPrice = minEl && minEl.value ? parseFloat(minEl.value) : null;
    maxPrice = maxEl && maxEl.value ? parseFloat(maxEl.value) : null;
    applyAllFilters();
    showToast('Filtro de preço aplicado', 'info');
  };

  window.clearAllFilters = () => {
    currentQuery = '';
    selectedCategories = [];
    selectedBrands = [];
    minPrice = null;
    maxPrice = null;
    currentSort = 'relevance';

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    const minEl = document.getElementById('price-min');
    const maxEl = document.getElementById('price-max');
    if (minEl) minEl.value = '';
    if (maxEl) maxEl.value = '';

    const sortEl = document.getElementById('search-sort-select');
    if (sortEl) sortEl.value = 'relevance';

    document.querySelectorAll('.cat-filter-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.brand-filter-checkbox').forEach(cb => cb.checked = false);

    applyAllFilters();
    showToast('Filtros limpos', 'info');
  };

  window.addToCartSearch = (productId) => {
    const product = allCatalogProducts.find(p => p.id === productId);
    if (product) {
      cartManager.addItem(product);
      showToast(`${product.name} adicionado ao carrinho!`, 'success');
    }
  };

  window.handleSaveSearch = (productId, btnId) => {
    const item = allCatalogProducts.find(p => p.id === productId);
    if (!item) return;

    const isSaved = auth.toggleSaveItem(item, 'product');
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.classList.toggle('text-red-500', isSaved);
      btn.classList.toggle('text-on-surface-variant', !isSaved);
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.style.fontVariationSettings = `'FILL' ${isSaved ? 1 : 0}`;
    }
    showToast(isSaved ? 'Salvo nos favoritos!' : 'Removido dos favoritos', isSaved ? 'success' : 'info');
  };

  function renderSearchResults(products) {
    const grid = document.getElementById('search-grid');
    if (!grid) return;
    
    if (products.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-20 text-center flex flex-col items-center">
          <div class="w-16 h-16 rounded-full bg-purple-50 text-purple-400 flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-3xl">search_off</span>
          </div>
          <h3 class="font-bold text-lg text-on-background mb-1">Nenhum produto encontrado</h3>
          <p class="text-xs text-on-surface-variant max-w-sm mb-6">Tente buscar por outros termos como "sérum", "batom", "hidratante" ou limpe os filtros aplicados.</p>
          <button onclick="window.clearAllFilters()" class="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-dark transition-colors">
            Limpar Todos os Filtros
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map((p) => {
      const isSaved = auth.getSavedItems().some(s => s.id === p.id && s.contentType === 'product');
      const imgSrc = p.img.startsWith('http') ? p.img : (p.img.startsWith('img/') ? p.img : 'https://lh3.googleusercontent.com/aida-public/' + p.img);
      const badgeHtml = p.badge ? `<span class="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10 shadow-sm">${p.badge}</span>` : '';

      return `
      <div class="group flex flex-col bg-white rounded-2xl border border-[#DDD0E8] overflow-hidden hover:shadow-lg hover:border-primary transition-all relative">
        ${badgeHtml}
        
        <button
          id="save-s-quick-${p.id}"
          onclick="event.preventDefault(); event.stopPropagation(); window.handleSaveSearch('${p.id}', 'save-s-quick-${p.id}')"
          class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 border border-outline-variant flex items-center justify-center hover:bg-surface-dim transition-colors ${isSaved ? 'text-red-500' : 'text-on-surface-variant'}"
          aria-label="Favoritar"
        >
          <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' ${isSaved ? 1 : 0}">favorite</span>
        </button>

        <a href="#/product?id=${p.id}" class="relative aspect-square overflow-hidden bg-[#FAF7FC] cursor-pointer block p-4 flex items-center justify-center">
          <img alt="${p.name}" src="${imgSrc}" class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" onerror="this.src='img/serum_facial_1791458880967.jpg'"/>
        </a>

        <div class="p-4 flex flex-col flex-1">
          <div class="flex items-center justify-between text-[11px] mb-1">
            <span class="text-xs font-semibold text-primary uppercase tracking-wider">${p.cat || 'Beleza'}</span>
            <div class="flex items-center gap-0.5 text-amber-500 font-bold">
              <span>★</span>
              <span class="text-on-background">${p.rating || '4.8'}</span>
            </div>
          </div>
          
          <a href="#/product?id=${p.id}" class="font-display text-sm font-bold text-on-background line-clamp-2 hover:text-primary transition-colors cursor-pointer mb-1 text-left">${p.name}</a>
          <span class="font-body text-[11px] text-[#5C4D6B] mb-3 block">${p.company_name || 'Beleza na Web'}</span>
          
          <div class="mt-auto pt-3 flex items-center justify-between border-t border-[#F0E6F7]">
            <div class="flex flex-col">
              ${p.oldPrice ? `<span class="text-on-surface-variant text-[11px] line-through opacity-70">${p.oldPrice}</span>` : ''}
              <span class="font-display text-base font-bold text-primary">${p.price}</span>
            </div>
            <button 
              onclick="event.preventDefault(); event.stopPropagation(); window.addToCartSearch('${p.id}')"
              class="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all shadow-sm hover:scale-105 active:scale-95"
              title="Adicionar ao carrinho"
            >
              <span class="material-symbols-outlined text-[18px]">shopping_cart</span>
            </button>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  // Initial trigger after DOM loads
  setTimeout(() => applyAllFilters(), 50);

  return `
  <main class="max-w-[1280px] mx-auto px-4 md:px-10 py-8">
    
    <!-- HEADER BUSCA -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h1 class="font-display text-3xl font-bold text-on-background">Catálogo & Busca</h1>
          <p id="search-count" class="text-xs text-on-surface-variant font-medium mt-1">Carregando produtos...</p>
        </div>
        <button onclick="window.clearAllFilters()" class="text-xs font-bold text-primary hover:underline flex items-center gap-1 w-fit">
          <span class="material-symbols-outlined text-sm">refresh</span> Limpar todos os filtros
        </button>
      </div>

      <div class="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[#DDD0E8] shadow-sm">
        
        <!-- Search bar -->
        <div class="relative w-full md:w-1/2">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">search</span>
          <input id="search-input" value="${initialQuery}" oninput="window.handleSearchInput(event)" class="w-full pl-11 pr-10 py-3 rounded-xl bg-[#FAF7FC] border border-[#DDD0E8] text-on-background focus:border-primary outline-none transition-colors text-sm" placeholder="Buscar produtos, marcas ou categorias..." type="text"/>
          <button onclick="if(window.startVoiceSearch) window.startVoiceSearch()" class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors" title="Busca por voz">
            <span class="material-symbols-outlined text-[18px]">mic</span>
          </button>
        </div>

        <!-- Sorting -->
        <div class="flex items-center gap-3 w-full md:w-auto">
          <label class="font-body text-xs font-bold text-on-surface-variant whitespace-nowrap">Ordenar por:</label>
          <select id="search-sort-select" onchange="window.handleSortChange(event)" class="px-4 py-2.5 rounded-xl bg-[#FAF7FC] border border-[#DDD0E8] text-on-background text-xs font-medium focus:border-primary outline-none cursor-pointer">
            <option value="relevance">Relevância</option>
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
            <option value="newest">Lançamentos / Destaques</option>
          </select>
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      
      <!-- FILTROS LATERAIS -->
      <aside class="w-full lg:w-64 shrink-0 space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-[#DDD0E8] shadow-sm space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-[#F0E6F7]">
            <h2 class="font-display text-base font-bold text-on-background">Filtros</h2>
            <span class="material-symbols-outlined text-primary text-[18px]">tune</span>
          </div>
          
          <!-- Categoria -->
          <div>
            <h3 class="font-body text-xs font-bold text-on-background uppercase tracking-wider mb-3">Categoria</h3>
            <div class="space-y-2">
              ${['Skincare', 'Maquiagem', 'Cabelo', 'Perfumes', 'Corpo & Banho', 'Unhas'].map(c => `
                <label class="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" value="${c}" onchange="window.handleCategoryFilterChange()" class="cat-filter-checkbox w-4 h-4 rounded border-[#DDD0E8] text-primary focus:ring-primary cursor-pointer"/>
                  <span class="font-body text-xs text-on-surface-variant group-hover:text-primary transition-colors">${c}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Marca / Loja Parceira -->
          <div class="pt-4 border-t border-[#F0E6F7]">
            <h3 class="font-body text-xs font-bold text-on-background uppercase tracking-wider mb-3">Lojas & Marcas</h3>
            <div class="space-y-2">
              ${['Beleza na Web', 'Glow & Co.', 'Botanica Luxe', 'Rosé Lab', 'Lumina Studio', 'Cabelo House', 'Perfume House', 'Unhas Studio'].map(b => `
                <label class="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" value="${b}" onchange="window.handleBrandFilterChange()" class="brand-filter-checkbox w-4 h-4 rounded border-[#DDD0E8] text-primary focus:ring-primary cursor-pointer"/>
                  <span class="font-body text-xs text-on-surface-variant group-hover:text-primary transition-colors">${b}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Preço -->
          <div class="pt-4 border-t border-[#F0E6F7]">
            <h3 class="font-body text-xs font-bold text-on-background uppercase tracking-wider mb-3">Faixa de Preço (R$)</h3>
            <div class="flex items-center gap-2 mb-3">
              <input type="number" id="price-min" placeholder="Mín" min="0" class="w-full px-3 py-2 rounded-xl bg-[#FAF7FC] border border-[#DDD0E8] text-xs focus:border-primary outline-none text-center"/>
              <span class="text-on-surface-variant text-xs">-</span>
              <input type="number" id="price-max" placeholder="Máx" min="0" class="w-full px-3 py-2 rounded-xl bg-[#FAF7FC] border border-[#DDD0E8] text-xs focus:border-primary outline-none text-center"/>
            </div>
            <button onclick="window.applyPriceFilter()" class="w-full py-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition-colors shadow-sm">
              Filtrar Preço
            </button>
          </div>

        </div>
      </aside>

      <!-- GRID PRODUTOS -->
      <section class="flex-1">
        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" id="search-grid">
          <!-- Populated by JS -->
        </div>
      </section>

    </div>
  </main>`;
}


