import { cartManager } from '../cart_manager.js';
import { showToast } from '../components.js';
import { dataManager } from '../data_manager.js';
import { auth } from '../auth.js';

export default function searchPage() {
  const searchProducts = dataManager.generateProducts(100);
  
  window.handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    const filtered = searchProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.desc.toLowerCase().includes(query)
    );
    renderSearchResults(filtered);
  };

// startVoiceSearch moved to app.js for global access

  window.addToCartSearch = (index) => {
    const product = searchProducts[index];
    cartManager.addItem(product);
    showToast(`${product.name} adicionado ao carrinho!`, 'success');
  };

  function renderSearchResults(products) {
    const grid = document.getElementById('search-grid');
    if (!grid) return;
    
    if (products.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-12 text-center text-outline text-white/50">Nenhum produto encontrado para sua busca.</div>`;
        return;
    }

    grid.innerHTML = products.map((p, index) => {
      const isSaved = auth.getSavedItems().some(s => s.id === p.id && s.contentType === 'product');
      return `
      <div class="group flex flex-col bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(109,88,166,0.05)] hover:shadow-[0_20px_50px_rgba(109,88,166,0.2)] transition-all border border-white/10 hover:border-primary/50 relative">
        <div class="aspect-square bg-white/5 overflow-hidden relative flex items-center justify-center p-4">
          <img alt="${p.name}" class="w-full h-full object-contain product-image-zoom" src="https://lh3.googleusercontent.com/aida-public/${p.img}"/>
          ${p.badge ? `<span class="absolute top-3 left-3 bg-primary text-white font-label-sm text-[10px] px-3 py-1 rounded-full shadow-lg z-10">${p.badge}</span>` : ''}
          
          <!-- Hover Overlay Details -->
          <div class="absolute inset-0 bg-primary/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col p-6 text-white translate-y-4 group-hover:translate-y-0 z-20">
            <div class="flex items-center gap-1 text-amber-300 mb-2">
              <span class="material-symbols-outlined text-xs" style="font-variation-settings:'FILL' 1">star</span>
              <span class="material-symbols-outlined text-xs" style="font-variation-settings:'FILL' 1">star</span>
              <span class="material-symbols-outlined text-xs" style="font-variation-settings:'FILL' 1">star</span>
              <span class="material-symbols-outlined text-xs" style="font-variation-settings:'FILL' 1">star</span>
              <span class="material-symbols-outlined text-xs" style="font-variation-settings:'FILL' 1">star_half</span>
            </div>
            <p class="text-[11px] text-white/90 line-clamp-4 mb-4 leading-relaxed">${p.desc}</p>
            <div class="mt-auto space-y-3">
               <button id="save-s-${index}" onclick="event.stopPropagation(); window.handleSaveSearch(searchProducts[${index}], 'save-s-${index}')" class="w-full flex items-center justify-center gap-2 py-2 border border-white/30 rounded-full text-[9px] uppercase font-bold hover:bg-white/10 transition-colors">
                  <span class="material-symbols-outlined text-xs" style="font-variation-settings: 'FILL' ${isSaved ? 1 : 0}">bookmark</span> ${isSaved ? 'Salvo' : 'Salvar'}
               </button>
               <button onclick="window.addToCartSearch(${index})" class="w-full bg-white text-primary py-2.5 rounded-full font-bold text-[10px] hover:bg-primary-fixed transition-colors">Comprar Agora</button>
            </div>
          </div>
        </div>
        <div class="p-4 bg-white/5">
          <div class="flex justify-between items-start mb-1">
            <h3 class="font-body-md text-sm font-bold text-white line-clamp-1">${p.name}</h3>
            <span class="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-widest font-bold">${p.code}</span>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="font-label-md text-primary-fixed-dim font-bold">${p.price}</span>
              ${p.oldPrice ? `<span class="text-[10px] text-white/30 line-through">${p.oldPrice}</span>` : ''}
            </div>
            <span class="material-symbols-outlined text-white/30 text-lg self-end">favorite</span>
          </div>
        </div>
      </div>`}).join('');
  }

  // Initial render
  setTimeout(() => renderSearchResults(searchProducts), 50);

  return `
  <main class="max-w-[1280px] mx-auto px-4 md:px-10 py-6 flex flex-col gap-12">
    <section class="flex flex-col gap-3 items-center text-center max-w-2xl mx-auto w-full pt-8">
      <h2 class="font-display text-4xl text-primary-fixed">Seu Ritual de Beleza</h2>
      <p class="font-body-md text-body-md text-white/60 mb-6">Explore nossa linha de maquiagem premium e skincare clínico.</p>
      
      <div class="relative w-full shadow-2xl shadow-primary/10 rounded-full bg-white/5 border border-white/10 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
        <div class="flex items-center px-6 py-4">
          <span class="material-symbols-outlined text-primary-fixed-dim mr-3">search</span>
          <input id="search-input" oninput="window.handleSearch(event)" class="w-full bg-transparent border-none focus:ring-0 font-body-lg text-white placeholder:text-white/30" placeholder="Buscar por batons, séruns, bases..." type="text"/>
          <button id="mic-btn" onclick="window.startVoiceSearch()" class="text-primary-fixed-dim hover:text-primary ml-2 transition-colors"><span class="material-symbols-outlined">mic</span></button>
        </div>
      </div>
      
      <div class="flex flex-wrap gap-2 justify-center mt-4">
        <button onclick="document.getElementById('search-input').value='Batom Matte'; window.handleSearch({target:{value:'Batom Matte'}})" class="px-4 py-1.5 rounded-full bg-white/5 text-primary-fixed-dim border border-white/10 font-label-sm text-label-sm hover:bg-primary/20 transition-colors">Batom Matte</button>
        <button onclick="document.getElementById('search-input').value='Sérum Glow'; window.handleSearch({target:{value:'Sérum Glow'}})" class="px-4 py-1.5 rounded-full bg-white/5 text-primary-fixed-dim border border-white/10 font-label-sm text-label-sm hover:bg-primary/20 transition-colors">Sérum Glow</button>
        <button onclick="document.getElementById('search-input').value='Pele Oleosa'; window.handleSearch({target:{value:'Pele Oleosa'}})" class="px-4 py-1.5 rounded-full bg-white/5 text-primary-fixed-dim border border-white/10 font-label-sm text-label-sm hover:bg-primary/20 transition-colors">Pele Oleosa</button>
      </div>
    </section>

    <section class="flex flex-col gap-6">
      <div class="flex justify-between items-end border-b border-white/10 pb-2">
        <h3 class="font-display text-2xl text-white">Catálogo de Beleza</h3>
        <span class="font-label-sm text-label-sm text-white/40 italic">Filtros Inteligentes</span>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6" id="search-grid">
        <!-- Grid will be populated by renderSearchResults -->
      </div>
      <div class="flex justify-center mt-8">
        <a href="#/home" class="px-8 py-3 border border-primary/50 text-primary-fixed font-label-md text-label-md rounded-full hover:bg-primary hover:text-white transition-all">Ver Lançamentos</a>
      </div>
    </section>

    <section class="flex flex-col gap-6 mt-8">
      <div class="flex justify-between items-end border-b border-white/10 pb-2">
        <h3 class="font-display text-2xl text-white">Tutoriais e Rituais</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="#/tutorial" class="group relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer aspect-video border border-white/10">
          <img alt="Tutorial" class="w-full h-full object-cover product-image-zoom opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtWOSKckDEZJK6xwvM2u7sMOI1jH_kXM43iFoaUVPTaWE4kbKtQgX1R5fIR_9AM3XVvp4U5ZgDj191cOFk0Im8b50TgS1MkN5hzInG4PTb0YTreGJGbtebmF6fgKznrsgnw5Kg8A13MV9nlIrazeDAesZqHGZEtEYEJVDXNhZ1VWWe_dZufxLv0mdRuZnhjWnbn_FShSjXvUa9wLB_bF2QpwKnHXrCuZ2BqwNj7Mr4qnR36L_DlfFVQRlnPCm8KFOOOXCto3Wle3Up"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-8">
            <div class="flex flex-col gap-2">
              <span class="bg-primary text-white font-label-sm text-label-sm px-3 py-1 rounded-full w-fit shadow-lg shadow-primary/30">Maquiagem</span>
              <h4 class="font-display text-2xl text-white">Contorno e Iluminação</h4>
            </div>
          </div>
        </a>
        <a href="#/tutorial" class="group relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer aspect-video border border-white/10">
          <img alt="Tutorial" class="w-full h-full object-cover product-image-zoom opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMIsmJ-AadvSze3EqTlRffxMHD3ZJS-gEOhGK5XRbq88_AZPwFH7aZBh9P2bECMeId6B8RAUxJz7Hv76FYG6QbzhZyrL65ipUryA_JiojsbOqb65DiTeb8orIUvmLWBNsUcdSNXfJErVceduA8jAic_SL3wk-alEmNleweWxoJLayiDGEEoPt-XwnSX2hIH682CGK8yUtHi3wxhQPwPPVyS17r1Tp0zUmjpQJgGSOpfr1Z6hU1lZeUk2hBDGs-m7JVZR5TIfmLVtfT"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-8">
            <div class="flex flex-col gap-2">
              <span class="bg-primary/80 text-white font-label-sm text-label-sm px-3 py-1 rounded-full w-fit shadow-lg shadow-primary/30">Skincare</span>
              <h4 class="font-display text-2xl text-white">O Segredo da Pele de Vidro</h4>
            </div>
          </div>
        </a>
      </div>
    </section>
  </main>`;
}

