import { auth } from '../auth.js';
import { cartManager } from '../cart_manager.js';
import { showToast } from '../components.js';
import { dataManager } from '../data_manager.js';

export default function homePage() {
  const user = auth.getUser();
  const welcomeText = user ? `Olá, ${user.name.split(' ')[0]}!` : 'Beleza na Web';

  // Get data from manager
  const allProducts = dataManager.generateProducts(100);
  const homeVideos = dataManager.generateVideos(100).slice(0, 5);
  const featuredProducts = allProducts.slice(0, 8);

  window.addToCartHome = (index) => {
    const product = featuredProducts[index];
    cartManager.addItem(product);
    showToast(`${product.name} adicionado ao carrinho!`, 'success');
  };

  window.showCommentsModal = () => {
    const mockUsers = [
        { name: 'Maria Silva', email: 'Há 2 horas', photo: '' },
        { name: 'Ana Paula', email: 'Há 5 horas', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80' },
        { name: 'Juliana Costa', email: 'Ontem', photo: '' }
    ];
    import('../components.js').then(m => m.renderUserListModal('Comentários Recentes', mockUsers));
  };

  window.handleSaveHome = (index, type, btnId) => {
    let item;
    if (type === 'product') {
        item = featuredProducts[index];
    } else if (type === 'video') {
        item = homeVideos[index];
    }
    
    if (!item) return;

    const isSaved = auth.toggleSaveItem(item, type);
    const btn = document.getElementById(btnId);
    if (btn) {
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.style.fontVariationSettings = `'FILL' ${isSaved ? 1 : 0}`;
      if (btn.classList.contains('bg-white/90')) {
          // Quick save button styling (heart)
          btn.classList.toggle('text-red-500', isSaved);
          btn.classList.toggle('text-outline', !isSaved);
      } else {
          // Hover overlay button styling (bookmark)
          btn.classList.toggle('text-amber-500', isSaved);
          btn.classList.toggle('text-white/70', !isSaved);
      }
    }
    showToast(isSaved ? 'Salvo nos favoritos!' : 'Removido dos favoritos', isSaved ? 'success' : 'info');
  };  return `
  <main class="flex-grow w-full bg-background">
    <!-- Hero Carousel Section - Full Width -->
    <section class="relative w-full h-[480px] md:h-[580px] overflow-hidden shadow-2xl shadow-primary/10 mb-10 ambient-shadow">
      <div id="hero-carousel" class="flex transition-transform duration-700 ease-in-out h-full w-full">
        <!-- Slides are rendered here -->
        <div class="min-w-full h-full relative flex items-center bg-primary-container/20">
          <img alt="Beauty Hero" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqpBtBh47eNEksho9O5MXG_Zj4BSSfrhinKWZrqS8VcaAs35YxBoPqA-DA9GM4U0WWOhrhNgrznvChCdYlOftaKLUlzUTbaDxlIb5sCcVXC9p6Ft3HP_CCU4w9QNiISyiKnz-p556jwlt9gayBnrpcZ6jOlwd9cL0AtmKaqyKSrYsbjn6v7nXq_xrCitRtz75emRzOesU3G4KCrp4njBa0J2UXIEMLe7jX4UrZ7q3Ow5RfICYUls3H2Uqc5kmKakwRPIRGenfqI--j"/>
          <div class="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent z-0"></div>
          <div class="relative z-10 p-8 md:p-16 max-w-xl">
            <span class="inline-block px-4 py-1.5 rounded-full bg-primary/10 backdrop-blur-sm text-primary font-bold text-[10px] mb-4 tracking-widest uppercase shadow-sm border border-primary/20">Beleza, Maquiagem & Skincare</span>
            <h1 class="font-display-lg text-display-lg text-on-background mb-3 truncate max-w-full block" title="${welcomeText}">${welcomeText}</h1>
            <p class="font-body-lg text-body-lg text-on-surface-variant mb-2 italic">"Realçando a beleza que já existe em você."</p>
            <p class="font-headline-xl text-headline-xl text-primary font-bold mb-6">Até 85% OFF</p>
            <a href="#/search" class="bg-primary text-white px-8 py-4 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">Explorar Coleção <span class="material-symbols-outlined text-[18px]">arrow_forward</span></a>
          </div>
        </div>
        <div class="min-w-full h-full relative flex items-center bg-secondary-container/20">
          <img alt="Winter Collection" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTXHEqLFQPw5zX70ucVslqE5v58aFYT-h2QhAF23WbKG9zCIRlnWUAoHnHSHQWpLE8wAZUvpJrK-tlWh33Uyc67P_oBpaqtqF0rypcAi-40cNEKBGN0Au5x3YkCDyFH6BesNlQEkQG0a5l8TF_-4T194V_PfCxm5e3UMi86_K_kNuwF7ENg1g9U2hHHBYbnKK5qCgYXbnaeeoBWuX1lqW3XyxYMbbyzmS8kgkMPOcJ_QDW6GUTZurpKEUiWof2_7X85evGcoUb5PsF"/>
          <div class="absolute inset-0 bg-gradient-to-l from-white/90 via-white/40 to-transparent z-0"></div>
          <div class="relative z-10 p-8 md:p-16 max-w-xl text-right ml-auto">
            <span class="inline-block px-4 py-1.5 rounded-full bg-secondary/10 backdrop-blur-sm text-secondary font-bold text-[10px] mb-4 tracking-widest uppercase shadow-sm border border-secondary/20">Coleção Inverno 2026</span>
            <h1 class="font-display-lg text-display-lg text-on-background mb-3">Brilho Eterno</h1>
            <p class="font-body-lg text-body-lg text-on-surface-variant mb-2 italic">Cores intensas para momentos inesquecíveis.</p>
            <p class="font-headline-xl text-headline-xl text-secondary font-bold mb-6">Novos Lançamentos</p>
            <a href="#/search" class="bg-secondary text-white px-8 py-4 rounded-full font-bold text-sm shadow-lg shadow-secondary/20 hover:shadow-secondary/40 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">Ver Novidades <span class="material-symbols-outlined text-[18px]">auto_awesome</span></a>
          </div>
        </div>
        <div class="min-w-full h-full relative flex items-center bg-primary-container/10">
          <img alt="Skin Ritual" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsb0X9za5E14wyiYdZ7-b-qjww8m01AdekvJ1iHfEl4iD6UPWK20u9sShLmVu_U-ZY3ocqbytdMZZa5R-ScTHvXbWHtpwsu-gUkuxExrc8jwOGiHgMbWJzET4fhk5nHXCutGh0txsY-mYiCcjStm-nFXSFyb7jpW7gkFDXUgBf7tV7f_axlA680zf_MmvJjpzprCwU-00uruyInoEDmt5vQN_eb08epGxxtc8sLbNYUHS9rzikWJejX0i_DZDHGZMKJHiSRL_fIOrS"/>
          <div class="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent z-0"></div>
          <div class="relative z-10 p-8 md:p-16 max-w-xl">
            <span class="inline-block px-4 py-1.5 rounded-full bg-primary/10 backdrop-blur-sm text-primary font-bold text-[10px] mb-4 tracking-widest uppercase shadow-sm border border-primary/20">Rituais de Luxo</span>
            <h1 class="font-display-lg text-display-lg text-on-background mb-3">Skin Spa em Casa</h1>
            <p class="font-body-lg text-body-lg text-on-surface-variant mb-2 italic">A ciência do cuidado encontra a arte do relaxamento.</p>
            <p class="font-headline-xl text-headline-xl text-primary font-bold mb-6">Kit SPA Completo</p>
            <a href="#/rituals" class="bg-primary text-white px-8 py-4 rounded-full font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">Conhecer Ritual <span class="material-symbols-outlined text-[18px]">spa</span></a>
          </div>
        </div>
      </div>
      <!-- Navigation Arrows -->
      <button onclick="window.moveHeroSlide(-1)" class="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-primary hover:bg-white transition-all z-30 shadow-sm">
        <span class="material-symbols-outlined font-bold">chevron_left</span>
      </button>
      <button onclick="window.moveHeroSlide(1)" class="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-primary hover:bg-white transition-all z-30 shadow-sm">
        <span class="material-symbols-outlined font-bold">chevron_right</span>
      </button>

      <!-- Indicators -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        <button onclick="window.gotoHeroSlide(0)" id="dot-0" class="w-8 h-2.5 rounded-full bg-white shadow-sm border border-primary/10 transition-all duration-300"></button>
        <button onclick="window.gotoHeroSlide(1)" id="dot-1" class="w-3 h-2.5 rounded-full bg-white/40 shadow-sm border border-primary/10 transition-all duration-300"></button>
        <button onclick="window.gotoHeroSlide(2)" id="dot-2" class="w-3 h-2.5 rounded-full bg-white/40 shadow-sm border border-primary/10 transition-all duration-300"></button>
      </div>
    </section>

    <div class="max-w-[1280px] mx-auto px-4 md:px-10 w-full">
    <section class="mb-10">
      <h2 class="font-headline-md text-headline-md text-on-background mb-6">Explore Categorias</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="#/search" class="group relative rounded-3xl overflow-hidden h-40 flex items-end p-6 bg-secondary-container/30 border border-secondary/10 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-500">
          <span class="absolute top-4 right-4 material-symbols-outlined text-secondary/40 text-5xl group-hover:scale-125 transition-transform" style="font-variation-settings:'FILL' 1;">palette</span>
          <div><h3 class="font-bold text-on-background">Maquiagem</h3><p class="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Rosto, Olhos e Lábios</p></div>
        </a>
        <a href="#/search" class="group relative rounded-3xl overflow-hidden h-40 flex items-end p-6 bg-primary-container/30 border border-primary/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
          <span class="absolute top-4 right-4 material-symbols-outlined text-primary/40 text-5xl group-hover:scale-125 transition-transform" style="font-variation-settings:'FILL' 1;">spa</span>
          <div><h3 class="font-bold text-on-background">Skincare</h3><p class="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Tratamentos Clínicos</p></div>
        </a>
        <a href="#/search" class="group relative rounded-3xl overflow-hidden h-40 flex items-end p-6 bg-violet-100/40 border border-violet-200/50 hover:shadow-xl transition-all duration-500">
          <span class="absolute top-4 right-4 material-symbols-outlined text-violet-300 text-5xl group-hover:scale-125 transition-transform" style="font-variation-settings:'FILL' 1;">clean_hands</span>
          <div><h3 class="font-bold text-on-background">Corpo</h3><p class="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Rituais de Bem-estar</p></div>
        </a>
        <a href="#/search" class="group relative rounded-3xl overflow-hidden h-40 flex items-end p-6 bg-amber-100/40 border border-amber-200/50 hover:shadow-xl transition-all duration-500">
          <span class="absolute top-4 right-4 material-symbols-outlined text-amber-400/40 text-5xl group-hover:scale-125 transition-transform" style="font-variation-settings:'FILL' 1;">local_offer</span>
          <div><h3 class="font-bold text-on-background">Ofertas</h3><p class="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Descontos Celestiais</p></div>
        </a>
      </div>
    </section>

    <!-- Product Grid Section -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-headline-md text-headline-md text-on-surface">Destaques em Beleza</h2>
        <a class="font-label-md text-label-md text-primary hover:underline" href="#/search">Ver Todos</a>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="product-grid"></div>
    </section>

    <!-- Video Feed Section -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-headline-md text-headline-md text-on-surface">Tutoriais e Rituais</h2>
        <a class="font-label-md text-label-md text-primary hover:underline" href="#/videos">Ver Galeria</a>
      </div>
      <div class="flex overflow-x-auto gap-6 pb-6 no-scrollbar">
        ${homeVideos.map((v, i) => {
          const isSaved = auth.getSavedItems().some(s => s.id === v.id);
          return `
          <div class="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 flex-shrink-0 group cursor-pointer hover:shadow-md transition-shadow relative">
            <div class="relative aspect-video">
              <img src="https://lh3.googleusercontent.com/aida-public/${v.img}" class="w-full h-full object-cover product-image-zoom" alt="${v.title}">
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="material-symbols-outlined text-white text-5xl opacity-80 group-hover:opacity-100 drop-shadow-lg" style="font-variation-settings:'FILL' 1;">play_circle</span>
              </div>
              <div class="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded">${v.time}</div>
            </div>
            <div class="p-4 flex justify-between items-start">
              <div>
                <span class="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 block">${v.cat}</span>
                <h3 class="text-sm font-semibold text-on-surface line-clamp-1">${v.title}</h3>
              </div>
              <button id="save-v-${i}" onclick="event.stopPropagation(); window.handleSaveHome(${i}, 'video', 'save-v-${i}')" class="text-outline hover:text-primary transition-colors">
                 <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' ${isSaved ? 1 : 0}">bookmark</span>
              </button>
            </div>
          </div>
        `}).join('')}
      </div>
    </section>
    </div>
  </main>`;
}

export function mount() {
  const allProducts = dataManager.generateProducts(100);
  const featuredProducts = allProducts.slice(0, 8);
  const grid = document.getElementById('product-grid');
  
  if (grid) {
    grid.innerHTML = featuredProducts.map((p, index) => {
      const isSaved = auth.getSavedItems().some(s => s.id === p.id);
      return `
      <div class="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(109,88,166,0.05)] border border-outline-variant/30 flex flex-col hover:shadow-[0_20px_50px_rgba(109,88,166,0.15)] transition-all duration-500 relative">
        <div class="relative aspect-[4/5] bg-transparent overflow-hidden flex items-center justify-center">
          ${p.badge ? `<span class="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full font-label-xs text-[10px] z-10 shadow-lg">${p.badge}</span>` : ''}
          <button id="save-quick-${index}" onclick="event.stopPropagation(); window.handleSaveHome(${index}, 'product', 'save-quick-${index}')" class="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm hover:scale-110 transition-transform z-10 ${isSaved ? 'text-red-500' : 'text-outline'}">
             <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' ${isSaved ? 1 : 0}">favorite</span>
          </button>
          <img alt="${p.name}" class="w-full h-full object-cover product-image-zoom" src="${p.img.startsWith('http') ? p.img : 'https://lh3.googleusercontent.com/aida-public/' + p.img}"/>
          
          <!-- Hover Overlay Details -->
          <div class="absolute inset-0 bg-primary/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col p-6 text-white translate-y-4 group-hover:translate-y-0">
            <div class="flex items-center gap-1 text-amber-400 mb-2">
              <span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' 1">star</span>
              <span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' 1">star</span>
              <span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' 1">star</span>
              <span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' 1">star</span>
              <span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' 1">star_half</span>
              <span class="text-[10px] text-white/80 ml-1">(124 avaliações)</span>
            </div>
            <p class="text-xs text-white/90 line-clamp-4 mb-4 leading-relaxed">${p.desc}</p>
                <div class="mt-auto space-y-3">
                   <div class="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/70">
                      <button onclick="event.stopPropagation(); window.showCommentsModal()" class="flex items-center gap-1 hover:text-white transition-colors">
                         <span class="material-symbols-outlined text-sm">chat_bubble</span> 12 Comentários
                      </button>
                   </div>
                   <button onclick="window.addToCartHome(${index})" class="w-full bg-white text-primary py-3 rounded-full font-bold text-xs hover:bg-primary-fixed transition-colors shadow-xl">Adicionar à Sacola</button>
                </div>
          </div>
        </div>
        
        <div class="p-4 flex flex-col flex-grow bg-surface-bright">
          <div class="flex justify-between items-start mb-1">
              <h3 class="font-body-md text-sm font-bold text-on-surface line-clamp-1">${p.name}</h3>
              <span class="text-[8px] bg-primary/5 text-primary/40 px-1.5 py-0.5 rounded uppercase tracking-widest font-bold">${p.code}</span>
          </div>
          <div class="flex items-center justify-between text-[10px] text-on-surface-variant mb-2">
            <a href="#/store?id=${p.company_id}" onclick="event.stopPropagation()" class="flex items-center gap-1 font-semibold truncate hover:text-primary transition-colors"><span class="material-symbols-outlined text-[12px] text-primary">storefront</span> ${p.company_name || 'Beleza na Web'}</a>
            <button onclick="event.stopPropagation(); window.openSellerChatModal('${p.company_id || 'ann_official'}', '${p.company_name || 'Beleza na Web Official'}', '${p.company_photo || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100'}')" class="text-secondary hover:text-primary transition-colors flex items-center gap-0.5 font-bold" title="Conversar com o Vendedor">
              <span class="material-symbols-outlined text-[14px]">chat</span> Chat
            </button>
          </div>
          <div class="flex items-center justify-between mt-auto">
            <div class="flex flex-col">
              <span class="font-display text-lg text-primary font-bold">${p.price}</span>
              ${p.oldPrice ? `<span class="text-[10px] text-on-surface-variant/50 line-through">${p.oldPrice}</span>` : ''}
            </div>
          </div>
        </div>
      </div>`}).join('');
  }

  // Hero Carousel Logic
  const carousel = document.getElementById('hero-carousel');
  if (carousel) {
      let currentSlide = 0;
      const totalSlides = 3;
      let autoPlayInterval;

      const updateSlider = (index) => {
          currentSlide = index;
          carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
          
          // Update dots
          document.querySelectorAll('[id^="dot-"]').forEach((dot, idx) => {
              if (idx === currentSlide) {
                  dot.classList.add('bg-white', 'w-8');
                  dot.classList.remove('bg-white/40', 'w-3');
              } else {
                  dot.classList.remove('bg-white', 'w-8');
                  dot.classList.add('bg-white/40', 'w-3');
              }
          });
      };

      window.moveHeroSlide = (dir) => {
          clearInterval(autoPlayInterval);
          let next = (currentSlide + dir + totalSlides) % totalSlides;
          updateSlider(next);
          startAutoPlay();
      };

      window.gotoHeroSlide = (index) => {
          clearInterval(autoPlayInterval);
          updateSlider(index);
          startAutoPlay();
      };

      const startAutoPlay = () => {
          autoPlayInterval = setInterval(() => {
              let next = (currentSlide + 1) % totalSlides;
              updateSlider(next);
          }, 6000);
      };

      startAutoPlay();
  }
}

