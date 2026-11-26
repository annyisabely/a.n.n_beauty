import { storesData } from '../data_manager.js';

export default function storesPage() {
    const stores = Object.values(storesData);

    // ── Filter/search logic (runs after DOM is ready) ──
    function initStoreFilters() {
        const searchInput = document.getElementById('stores-search-input');
        const filterBtns = document.querySelectorAll('.store-cat-filter');
        const grid = document.getElementById('stores-grid');
        let activeCategory = 'all';

        function renderFiltered() {
            const query = (searchInput?.value || '').toLowerCase().trim();
            const filtered = stores.filter(store => {
                const matchCat = activeCategory === 'all' ||
                    (store.category || '').toLowerCase() === activeCategory ||
                    (store.tagline || '').toLowerCase().includes(activeCategory) ||
                    (store.desc || '').toLowerCase().includes(activeCategory);
                const matchSearch = !query ||
                    store.name.toLowerCase().includes(query) ||
                    (store.tagline || '').toLowerCase().includes(query) ||
                    (store.desc || '').toLowerCase().includes(query);
                return matchCat && matchSearch;
            });

            if (filtered.length === 0) {
                grid.innerHTML = `
                    <div class="col-span-full py-16 text-center">
                        <span class="material-symbols-outlined text-5xl text-[#C4A8E0] mb-3 block">search_off</span>
                        <p class="text-[#5C4D6B] text-sm">Nenhuma loja encontrada.</p>
                    </div>`;
                return;
            }

            grid.innerHTML = filtered.map(store => buildStoreCard(store)).join('');
        }

        // Search input
        if (searchInput) {
            searchInput.addEventListener('input', renderFiltered);
        }

        // Category filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                activeCategory = btn.dataset.cat;
                // Update active button styles
                filterBtns.forEach(b => {
                    b.classList.toggle('bg-[#8B5FBF]', b === btn);
                    b.classList.toggle('text-white', b === btn);
                    b.classList.toggle('bg-[#F8F4FB]', b !== btn);
                    b.classList.toggle('text-[#5C4D6B]', b !== btn);
                });
                renderFiltered();
            });
        });
    }

    function buildStoreCard(store) {
        return `
            <div class="bg-white rounded-[24px] border border-[#DDD0E8] p-4 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative group" style="box-shadow: 0 4px 20px -4px rgba(109, 76, 125, 0.06);">
                <a href="#/store?id=${store.id}" class="relative w-full h-32 rounded-[20px] overflow-hidden mb-8 bg-[#F8F4FB] flex items-center justify-center block cursor-pointer">
                    <img src="${store.cover}" alt="${store.name} Cover" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.onerror=null;this.src='img/hero_skin_spa.jpg';">
                    
                    <!-- Store Logo overlay -->
                    <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-white shadow-md bg-white overflow-hidden flex items-center justify-center">
                        <img src="${store.photo}" alt="${store.name} Logo" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='img/logo.png';">
                    </div>
                </a>

                <div class="flex flex-col flex-grow px-2 text-center mt-2">
                    <a href="#/store?id=${store.id}" class="text-base font-bold text-[#2D1A40] mb-1 hover:text-[#8B5FBF] transition-colors cursor-pointer" style="font-family:'Poppins',sans-serif">
                        ${store.name}
                    </a>
                    
                    <p class="text-[11px] text-[#5C4D6B] mb-2.5 line-clamp-2 leading-relaxed">
                        ${store.tagline || store.desc}
                    </p>

                    <!-- Horário de Atendimento -->
                    <div class="bg-[#F8F4FB] rounded-xl py-1.5 px-2 text-[10px] text-[#5C4D6B] font-medium mb-3 flex items-center justify-center gap-1">
                        <span class="material-symbols-outlined text-[13px] text-[#8B5FBF]">schedule</span>
                        <span class="truncate">Seg-Sex 09:30-18:00/18:30 • Sáb 09:30-17:00</span>
                    </div>

                    <!-- Metrics -->
                    <div class="flex items-center justify-center gap-3 text-[10px] font-bold text-[#5C4D6B] mb-4">
                        <div class="flex items-center gap-1 text-amber-500">
                            <span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1">star</span>
                            <span>${store.rating}</span>
                        </div>
                        <span>•</span>
                        <div class="flex items-center gap-1">
                            <span>${store.products} Produtos</span>
                        </div>
                    </div>

                    <!-- Action -->
                    <div class="mt-auto">
                        <a href="#/store?id=${store.id}" class="inline-flex items-center justify-center w-full py-2.5 rounded-full border border-[#8B5FBF] text-[#8B5FBF] hover:bg-[#8B5FBF] hover:text-white transition-all text-xs font-bold gap-2 cursor-pointer">
                            Visitar Loja
                        </a>
                    </div>
                </div>
            </div>`;
    }

    // Run filters after DOM is ready
    setTimeout(() => initStoreFilters(), 50);

    return `
    <main class="flex-grow max-w-[1280px] mx-auto px-4 md:px-10 w-full pt-8 pb-24">
        
        <!-- Header Section -->
        <div class="mb-10 text-center max-w-2xl mx-auto">
            <h1 class="text-3xl md:text-4xl font-bold text-[#8B5FBF] mb-4" style="font-family:'Poppins',serif">
                Lojas Oficiais
            </h1>
            <p class="text-sm md:text-base text-[#5C4D6B] leading-relaxed">
                Descubra as melhores marcas e revendedores independentes. Produtos selecionados para você realçar sua beleza com qualidade e segurança.
            </p>
        </div>

        <!-- Filter/Search Bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-full border border-[#DDD0E8] shadow-sm">
            <div class="relative w-full sm:w-96">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5C4D6B] text-[20px]">search</span>
                <input id="stores-search-input" type="text" placeholder="Buscar loja..." class="w-full bg-[#F8F4FB] pl-12 pr-4 py-2.5 rounded-full border-none text-sm outline-none focus:ring-2 focus:ring-[#C4A8E0]/30 transition-all text-[#2D1A40]">
            </div>
            
            <div class="flex items-center gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar">
                <button data-cat="all" class="store-cat-filter px-5 py-2 rounded-full bg-[#8B5FBF] text-white text-xs font-bold whitespace-nowrap transition-colors">Todas</button>
                <button data-cat="skincare" class="store-cat-filter px-5 py-2 rounded-full bg-[#F8F4FB] text-[#5C4D6B] hover:bg-[#DDD0E8] text-xs font-bold whitespace-nowrap transition-colors">Skincare</button>
                <button data-cat="maquiagem" class="store-cat-filter px-5 py-2 rounded-full bg-[#F8F4FB] text-[#5C4D6B] hover:bg-[#DDD0E8] text-xs font-bold whitespace-nowrap transition-colors">Maquiagem</button>
                <button data-cat="cabelo" class="store-cat-filter px-5 py-2 rounded-full bg-[#F8F4FB] text-[#5C4D6B] hover:bg-[#DDD0E8] text-xs font-bold whitespace-nowrap transition-colors">Cabelo</button>
            </div>
        </div>

        <!-- Stores Grid -->
        <div id="stores-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            ${stores.map(store => buildStoreCard(store)).join('')}
        </div>

        <!-- Call to Action (Abra sua loja) -->
        <!-- Open Store CTA removed -->

    </main>
    `;
}
