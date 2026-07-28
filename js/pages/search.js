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
        p.desc.toLowerCase().includes(query) ||
        p.cat.toLowerCase().includes(query)
    );
    renderSearchResults(filtered);
  };

// startVoiceSearch moved to app.js for global access

  window.addToCartSearch = (index) => {
    const product = searchProducts[index];
    cartManager.addItem(product);
    showToast(`${product.name} adicionado ao carrinho!`, 'success');
  };

  window.handleSaveSearch = (index, btnId) => {
    const item = searchProducts[index];
    if (!item) return;

    const isSaved = auth.toggleSaveItem(item, 'product');
    const btn = document.getElementById(btnId);
    if (btn) {
      if (btn.classList.contains('bg-white/90')) {
          // Quick save button styling (heart)
          btn.classList.toggle('text-red-500', isSaved);
          btn.classList.toggle('text-outline', !isSaved);
          const icon = btn.querySelector('.material-symbols-outlined');
          if (icon) icon.style.fontVariationSettings = `'FILL' ${isSaved ? 1 : 0}`;
      } else {
          // Hover overlay button styling (bookmark)
          btn.innerHTML = `<span class="material-symbols-outlined text-xs" style="font-variation-settings: 'FILL' ${isSaved ? 1 : 0}">bookmark</span> ${isSaved ? 'Salvo' : 'Salvar'}`;
      }
    }
    showToast(isSaved ? 'Salvo nos favoritos!' : 'Removido dos favoritos', isSaved ? 'success' : 'info');
  };

  function renderSearchResults(products) {
    const grid = document.getElementById('search-grid');
    if (!grid) return;
    
    if (products.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-16 text-center text-on-surface-variant opacity-60 font-medium">Nenhum tesouro de beleza encontrado para sua busca.</div>`;
        return;
    }

    grid.innerHTML = products.map((p, index) => {
      const isSaved = auth.getSavedItems().some(s => s.id === p.id && s.contentType === 'product');
      return `
      <div class="group flex flex-col bg-surface-bright rounded-[32px] overflow-hidden shadow-ethereal hover:shadow-ethereal-hover transition-all duration-500 border border-primary/5 relative">
        <div class="aspect-square bg-transparent overflow-hidden relative flex items-center justify-center">
          <img alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="${p.img.startsWith('http') ? p.img : 'https://lh3.googleusercontent.com/aida-public/' + p.img}"/>
          ${p.badge ? `<span class="absolute top-4 left-4 bg-secondary text-white font-bold text-[9px] px-3 py-1 rounded-full shadow-lg z-10 uppercase tracking-widest">${p.badge}</span>` : ''}
          <button id="save-s-quick-${index}" onclick="event.stopPropagation(); window.handleSaveSearch(${index}, 'save-s-quick-${index}')" class="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-sm hover:scale-110 transition-transform z-10 ${isSaved ? 'text-secondary' : 'text-on-surface-variant'}">
             <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' ${isSaved ? 1 : 0}">favorite</span>
          </button>
          
          <!-- Hover Overlay Details -->
          <div class="absolute inset-0 bg-primary/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col p-8 text-white translate-y-8 group-hover:translate-y-0 z-20">
            <div class="flex items-center gap-1 text-secondary-container mb-3">
              <span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1">star</span>
              <span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1">star</span>
              <span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1">star</span>
              <span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1">star</span>
              <span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1">star_half</span>
            </div>
            <p class="text-xs text-white/90 line-clamp-4 mb-6 leading-relaxed font-medium">${p.desc}</p>
            <div class="mt-auto space-y-3">
               <button onclick="window.addToCartSearch(${index})" class="w-full bg-white text-primary py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:shadow-xl transition-all">ADICIONAR AO RITUAL</button>
            </div>
          </div>
        </div>
        <div class="p-5 flex flex-col flex-grow">
          <div class="flex justify-between items-start mb-1">
            <h3 class="font-display text-sm font-bold text-on-surface line-clamp-1">${p.name}</h3>
            <span class="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter font-black">${p.code}</span>
          </div>
          <a href="#/store?id=${p.company_id}" onclick="event.stopPropagation()" class="text-[10px] text-primary font-semibold flex items-center gap-1 mb-2 hover:underline">
            <span class="material-symbols-outlined text-[12px]">storefront</span> ${p.company_name}
          </a>
          <p class="text-[10px] text-on-surface-variant opacity-70 line-clamp-2 mb-3 leading-relaxed">${p.desc}</p>
          <div class="mt-auto flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-lg font-bold text-primary">${p.price}</span>
              ${p.oldPrice ? `<span class="text-[10px] text-on-surface-variant line-through opacity-40">${p.oldPrice}</span>` : ''}
            </div>
            <button onclick="window.addToCartSearch(${index})" class="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                <span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            </button>
          </div>
        </div>
      </div>`}).join('');
  }

  // Initial render
  setTimeout(() => renderSearchResults(searchProducts), 50);

  return `
  <main class="max-w-[1280px] mx-auto px-4 md:px-10 py-6 flex flex-col gap-12">
    <section class="flex flex-col gap-4 items-center text-center max-w-3xl mx-auto w-full pt-12 pb-8">
      <h2 class="font-display text-4xl md:text-5xl text-on-background tracking-tighter">Encontre sua <span class="text-primary italic">Essência</span></h2>
      <p class="text-sm md:text-base text-on-surface-variant opacity-70 mb-8 max-w-xl mx-auto leading-relaxed">Combine tecnologia clínica com o glamour das passarelas em produtos feitos para sua pele única.</p>
      
      <div class="relative w-full max-w-2xl group">
        <div class="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-20 blur-lg group-focus-within:opacity-40 transition-all duration-500"></div>
        <div class="relative flex items-center bg-white px-6 py-5 rounded-full shadow-ethereal border border-primary/5 focus-within:border-primary/20 transition-all">
          <span class="material-symbols-outlined text-primary/40 mr-4 scale-125">search</span>
          <input id="search-input" oninput="window.handleSearch(event)" class="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant placeholder:opacity-40 font-medium" placeholder="O que seu ritual de hoje precisa?" type="text"/>
          <button id="mic-btn" onclick="window.startVoiceSearch()" class="text-primary hover:scale-110 ml-2 transition-all p-2 rounded-full hover:bg-primary/10"><span class="material-symbols-outlined scale-110">mic</span></button>
        </div>
      </div>
      
      <div class="flex flex-wrap gap-3 justify-center mt-6">
        <button onclick="document.getElementById('search-input').value='Batom'; window.handleSearch({target:{value:'Batom'}})" class="px-5 py-2 rounded-full bg-white text-on-surface-variant border border-primary/5 text-xs font-bold hover:bg-primary hover:text-white hover:shadow-lg transition-all">#Batom</button>
        <button onclick="document.getElementById('search-input').value='Sérum'; window.handleSearch({target:{value:'Sérum'}})" class="px-5 py-2 rounded-full bg-white text-on-surface-variant border border-primary/5 text-xs font-bold hover:bg-primary hover:text-white hover:shadow-lg transition-all">#Skincare</button>
        <button onclick="document.getElementById('search-input').value='Base'; window.handleSearch({target:{value:'Base'}})" class="px-5 py-2 rounded-full bg-white text-on-surface-variant border border-primary/5 text-xs font-bold hover:bg-primary hover:text-white hover:shadow-lg transition-all">#BaseGlow</button>
      </div>
    </section>

    <section class="flex flex-col gap-8">
      <div class="flex justify-between items-end border-b border-primary/10 pb-4">
        <h3 class="font-display text-2xl text-on-background">Curadoria de Beleza</h3>
        <span class="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Resultados filtrados</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8" id="search-grid">
        <!-- Grid populated by JS -->
      </div>
    </section>

    <section class="flex flex-col gap-8 mt-12 bg-primary-container/20 rounded-[48px] p-10 md:p-16 border border-primary/5">
      <div class="text-center md:text-left">
        <h3 class="font-display text-3xl text-on-background mb-4">Aprenda com Especialistas</h3>
        <p class="text-on-surface-variant opacity-70 mb-8 max-w-2xl">Assista aos nossos rituais cinematográficos e descubra como extrair o máximo de cada produto.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <a href="#/tutorial" class="group relative rounded-[40px] overflow-hidden shadow-ethereal cursor-pointer aspect-video border border-primary/10">
          <img alt="Tutorial" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtWOSKckDEZJK6xwvM2u7sMOI1jH_kXM43iFoaUVPTaWE4kbKtQgX1R5fIR_9AM3XVvp4U5ZgDj191cOFk0Im8b50TgS1MkN5hzInG4PTb0YTreGJGbtebmF6fgKznrsgnw5Kg8A13MV9nlIrazeDAesZqHGZEtEYEJVDXNhZ1VWWe_dZufxLv0mdRuZnhjWnbn_FShSjXvUa9wLB_bF2QpwKnHXrCuZ2BqwNj7Mr4qnR36L_DlfFVQRlnPCm8KFOOOXCto3Wle3Up"/>
          <div class="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-10">
            <div class="flex flex-col gap-3">
              <span class="bg-white/90 backdrop-blur-md text-primary font-bold text-[10px] px-4 py-1.5 rounded-full w-fit shadow-lg uppercase tracking-widest">Masterclass</span>
              <h4 class="font-display text-2xl text-white">Contorno Escultural</h4>
            </div>
          </div>
        </a>
        <a href="#/tutorial" class="group relative rounded-[40px] overflow-hidden shadow-ethereal cursor-pointer aspect-video border border-primary/10">
          <img alt="Tutorial" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMIsmJ-AadvSze3EqTlRffxMHD3ZJS-gEOhGK5XRbq88_AZPwFH7aZBh9P2bECMeId6B8RAUxJz7Hv76FYG6QbzhZyrL65ipUryA_JiojsbOqb65DiTeb8orIUvmLWBNsUcdSNXfJErVceduA8jAic_SL3wk-alEmNleweWxoJLayiDGEEoPt-XwnSX2hIH682CGK8yUtHi3wxhQPwPPVyS17r1Tp0zUmjpQJgGSOpfr1Z6hU1lZeUk2hBDGs-m7JVZR5TIfmLVtfT"/>
          <div class="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent flex items-end p-10">
            <div class="flex flex-col gap-3">
              <span class="bg-white/90 backdrop-blur-md text-secondary font-bold text-[10px] px-4 py-1.5 rounded-full w-fit shadow-lg uppercase tracking-widest">Botânica Clínica</span>
              <h4 class="font-display text-2xl text-white">O Ritual da Pele Radiante</h4>
            </div>
          </div>
        </a>
      </div>
    </section>
  </main>`;
}

