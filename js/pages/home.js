import { auth } from '../auth.js';
import { cartManager } from '../cart_manager.js';
import { showToast } from '../components.js';
import { dataManager } from '../data_manager.js';

// Get data from manager (global scope for page logic)
const allProducts = dataManager.generateProducts(100);
const homeVideos = dataManager.generateVideos(100).slice(0, 5); // Just 5 for preview
const featuredProducts = allProducts.slice(0, 8); // Just 8 for preview

export default function homePage() {
  const user = auth.getUser();
  const welcomeText = user ? `Olá, ${user.name.split(' ')[0]}!` : 'A.n.n Beauty';

  window.addToCartHome = (index) => {
    const product = featuredProducts[index];
    cartManager.addItem(product);
    showToast(`${product.name} adicionado ao carrinho!`, 'success');
  };

  return `
  <main class="flex-grow max-w-[1280px] mx-auto px-4 md:px-10 w-full pt-6">
    <!-- Hero Carousel Section -->
    <section class="relative w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden shadow-lg shadow-primary/5 mb-10">
      <div id="hero-carousel" class="flex transition-transform duration-700 ease-in-out h-full w-full">
        <!-- Slide 1 -->
        <div class="min-w-full h-full relative flex items-center bg-surface-container-low">
          <img alt="Beauty Hero" class="absolute inset-0 w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqpBtBh47eNEksho9O5MXG_Zj4BSSfrhinKWZrqS8VcaAs35YxBoPqA-DA9GM4U0WWOhrhNgrznvChCdYlOftaKLUlzUTbaDxlIb5sCcVXC9p6Ft3HP_CCU4w9QNiISyiKnz-p556jwlt9gayBnrpcZ6jOlwd9cL0AtmKaqyKSrYsbjn6v7nXq_xrCitRtz75emRzOesU3G4KCrp4njBa0J2UXIEMLe7jX4UrZ7q3Ow5RfICYUls3H2Uqc5kmKakwRPIRGenfqI--j"/>
          <div class="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent z-0"></div>
          <div class="relative z-10 p-8 md:p-16 max-w-xl">
            <span class="inline-block px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm text-primary font-label-sm text-label-sm mb-4 tracking-widest uppercase shadow-sm">Beleza, Maquiagem & Skincare</span>
            <h1 class="font-display-lg text-display-lg text-on-surface mb-3">${welcomeText}</h1>
            <p class="font-body-lg text-body-lg text-on-surface-variant mb-2 italic">"Realçando a beleza que já existe em você."</p>
            <p class="font-headline-xl text-headline-xl text-primary font-bold mb-6">Até 85% OFF</p>
            <a href="#/search" class="bg-primary text-on-primary px-8 py-4 rounded-full font-label-md text-label-md shadow-[0_4px_16px_rgba(84,64,140,0.3)] hover:shadow-[0_8px_24px_rgba(84,64,140,0.4)] hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">Explorar Coleção <span class="material-symbols-outlined text-[18px]">arrow_forward</span></a>
          </div>
                <!-- Slide 2 -->
        <div class="min-w-full h-full relative flex items-center bg-secondary-container">
          <img alt="Winter Collection" class="absolute inset-0 w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTXHEqLFQPw5zX70ucVslqE5v58aFYT-h2QhAF23WbKG9zCIRlnWUAoHnHSHQWpLE8wAZUvpJrK-tlWh33Uyc67P_oBpaqtqF0rypcAi-40cNEKBGN0Au5x3YkCDyFH6BesNlQEkQG0a5l8TF_-4T194V_PfCxm5e3UMi86_K_kNuwF7ENg1g9U2hHHBYbnKK5qCgYXbnaeeoBWuX1lqW3XyxYMbbyzmS8kgkMPOcJ_QDW6GUTZurpKEUiWof2_7X85evGcoUb5PsF"/>
          <div class="absolute inset-0 bg-gradient-to-l from-white via-white/40 to-transparent z-0"></div>
          <div class="relative z-10 p-8 md:p-16 max-w-xl text-right ml-auto">
            <span class="inline-block px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm text-secondary font-label-sm text-label-sm mb-4 tracking-widest uppercase shadow-sm">Coleção Inverno 2026</span>
            <h1 class="font-display-lg text-display-lg text-on-surface mb-3 text-secondary">Brilho Eterno</h1>
            <p class="font-body-lg text-body-lg text-on-surface-variant mb-2 italic">Cores intensas para momentos inesquecíveis.</p>
            <p class="font-headline-xl text-headline-xl text-secondary font-bold mb-6">Novos Lançamentos</p>
            <a href="#/search" class="bg-secondary text-white px-8 py-4 rounded-full font-label-md text-label-md shadow-[0_4px_16px_rgba(200,100,150,0.3)] hover:shadow-[0_8px_24px_rgba(200,100,150,0.4)] hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">Ver Novidades <span class="material-symbols-outlined text-[18px]">auto_awesome</span></a>
          </div>
        </div>
        <!-- Slide 3 -->
        <div class="min-w-full h-full relative flex items-center bg-purple-50">
          <img alt="Skin Ritual" class="absolute inset-0 w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsb0X9za5E14wyiYdZ7-b-qjww8m01AdekvJ1iHfEl4iD6UPWK20u9sShLmVu_U-ZY3ocqbytdMZZa5R-ScTHvXbWHtpwsu-gUkuxExrc8jwOGiHgMbWJzET4fhk5nHXCutGh0txsY-mYiCcjStm-nFXSFyb7jpW7gkFDXUgBf7tV7f_axlA680zf_MmvJjpzprCwU-00uruyInoEDmt5vQN_eb08epGxxtc8sLbNYUHS9rzikWJejX0i_DZDHGZMKJHiSRL_fIOrS"/>
          <div class="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent z-0"></div>
          <div class="relative z-10 p-8 md:p-16 max-w-xl">
            <span class="inline-block px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm text-primary font-label-sm text-label-sm mb-4 tracking-widest uppercase shadow-sm">Rituais de Luxo</span>
            <h1 class="font-display-lg text-display-lg text-on-surface mb-3">Skin Spa em Casa</h1>
            <p class="font-body-lg text-body-lg text-on-surface-variant mb-2 italic">A ciência do cuidado encontra a arte do relaxamento.</p>
            <p class="font-headline-xl text-headline-xl text-primary font-bold mb-6">Kit SPA Completo</p>
            <a href="#/rituals" class="bg-primary text-white px-8 py-4 rounded-full font-label-md text-label-md shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">Conhecer Ritual <span class="material-symbols-outlined text-[18px]">spa</span></a>
          </div>
        </div>
        <!-- Slide 4 -->
        <div class="min-w-full h-full relative flex items-center bg-amber-50">
          <img alt="Golden Glow" class="absolute inset-0 w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoSml9a2Sq7qZoOQdUD8cBxSOMeKA3_ODlbLSV57E-PeV_dYTi6Xar8d-ZbqCdVDRnxuQFzdoC4tg_Hhl7AcTowJgqQx9qAf6xLa67tm8fyFN0eZzneKLN3XNy8VGEK2ZMqoeKtSL1ds3kE6Ty8ZQCsLYqIcin7flYpMzyP2k12BBYPOCuBCBc26GQdRvvywwgGkT4KP1T6tobWWqTSwAn0nQXwRMkmo7QkaFvs_K4FcXATcKyxWSH9ZSF-dwSo6Vc_IPCNfqdnCF5"/>
          <div class="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-0"></div>
          <div class="relative z-10 p-8 md:p-16 max-w-xl text-center mx-auto">
            <span class="inline-block px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm text-amber-600 font-label-sm text-label-sm mb-4 tracking-widest uppercase shadow-sm">Lançamento Exclusivo</span>
            <h1 class="font-display-lg text-display-lg text-on-surface mb-3">Glow Radiante</h1>
            <p class="font-body-lg text-body-lg text-on-surface-variant mb-2 italic">O segredo para uma iluminação celestial.</p>
            <p class="font-headline-xl text-headline-xl text-amber-600 font-bold mb-6">Compre & Ganhe Brinde</p>
            <a href="#/search" class="bg-amber-500 text-white px-8 py-4 rounded-full font-label-md text-label-md shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">Quero Meu Glow <span class="material-symbols-outlined text-[18px]">shimmer</span></a>
          </div>
        </div>
        <!-- Slide 5 -->
        <div class="min-w-full h-full relative flex items-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
          <img alt="Clinical Beauty" class="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfWZeYH0RfUox3HFNX-ZuvCiQhPcXY6GFg0aGybVs1Fs_SVFneI_D8qAuRRGQwQRrOjM2fHVNAau_wjxCoO8X_Gdu3whd8QMkWzJNvLHnVPr0ta-eHqN96IQcg22YKTrNzNp-na9A_2WHuZNw33NX_Cdldo9RKv9S4FNHSuYUaV9URstXl9ieuB1yiJDWT3kgUIPJ60uRm0fJofzQ9N-OJ4y2GbkymIz_MtT3QuZrQgb_DRILOV8xRTcv52M_BlrSLhlnFEP2ltVfy"/>
          <div class="relative z-10 p-8 md:p-16 max-w-2xl">
            <span class="inline-block px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm text-blue-500 font-label-sm text-label-sm mb-4 tracking-widest uppercase shadow-sm">Ciência & Beleza</span>
            <h1 class="font-display-lg text-display-lg text-on-surface mb-3">Fórmulas Clínicas</h1>
            <p class="font-body-lg text-body-lg text-on-surface-variant mb-2 italic">Resultados reais com tecnologia de ponta.</p>
            <p class="font-headline-xl text-headline-xl text-blue-500 font-bold mb-6">Fale com Especialista</p>
            <a href="#/search" class="bg-blue-600 text-white px-8 py-4 rounded-full font-label-md text-label-md shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">Ver Resultados <span class="material-symbols-outlined text-[18px]">biotech</span></a>
          </div>
        </div>
      </div>
      <!-- Navigation Arrows -->
      <button onclick="window.moveHeroSlide(-1)" class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all z-30">
        <span class="material-symbols-outlined">chevron_left</span>
      </button>
      <button onclick="window.moveHeroSlide(1)" class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all z-30">
        <span class="material-symbols-outlined">chevron_right</span>
      </button>

      <!-- Indicators -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        <button onclick="window.gotoHeroSlide(0)" id="dot-0" class="w-8 h-2.5 rounded-full bg-white shadow-sm border border-primary/20 transition-all duration-300"></button>
        <button onclick="window.gotoHeroSlide(1)" id="dot-1" class="w-3 h-2.5 rounded-full bg-white/40 shadow-sm border border-primary/10 transition-all duration-300"></button>
        <button onclick="window.gotoHeroSlide(2)" id="dot-2" class="w-3 h-2.5 rounded-full bg-white/40 shadow-sm border border-primary/10 transition-all duration-300"></button>
        <button onclick="window.gotoHeroSlide(3)" id="dot-3" class="w-3 h-2.5 rounded-full bg-white/40 shadow-sm border border-primary/10 transition-all duration-300"></button>
        <button onclick="window.gotoHeroSlide(4)" id="dot-4" class="w-3 h-2.5 rounded-full bg-white/40 shadow-sm border border-primary/10 transition-all duration-300"></button>
      </div>
    </section>

    <!-- Category Navigation -->
    <section class="mb-10">
      <h2 class="font-headline-md text-headline-md text-on-surface mb-6">Categorias</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="#/search" class="group relative rounded-xl overflow-hidden h-36 flex items-end p-4 bg-gradient-to-br from-pink-100 to-pink-50 border border-pink-200/50 hover:shadow-[0_8px_30px_rgba(109,88,166,0.1)] transition-all duration-300">
          <span class="absolute top-4 right-4 material-symbols-outlined text-pink-300 text-4xl group-hover:scale-110 transition-transform" style="font-variation-settings:'FILL' 1;">palette</span>
          <div><h3 class="font-label-md text-label-md text-on-surface">Maquiagem</h3><p class="font-body-sm text-body-sm text-on-surface-variant">Rosto, Olhos e Lábios</p></div>
        </a>
        <a href="#/search" class="group relative rounded-xl overflow-hidden h-36 flex items-end p-4 bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200/50 hover:shadow-[0_8px_30px_rgba(109,88,166,0.1)] transition-all duration-300">
          <span class="absolute top-4 right-4 material-symbols-outlined text-purple-300 text-4xl group-hover:scale-110 transition-transform" style="font-variation-settings:'FILL' 1;">spa</span>
          <div><h3 class="font-label-md text-label-md text-on-surface">Skincare</h3><p class="font-body-sm text-body-sm text-on-surface-variant">Tratamentos Clínicos</p></div>
        </a>
        <a href="#/search" class="group relative rounded-xl overflow-hidden h-36 flex items-end p-4 bg-gradient-to-br from-violet-100 to-violet-50 border border-violet-200/50 hover:shadow-[0_8px_30px_rgba(109,88,166,0.1)] transition-all duration-300">
          <span class="absolute top-4 right-4 material-symbols-outlined text-violet-300 text-4xl group-hover:scale-110 transition-transform" style="font-variation-settings:'FILL' 1;">clean_hands</span>
          <div><h3 class="font-label-md text-label-md text-on-surface">Corpo & Banho</h3><p class="font-body-sm text-body-sm text-on-surface-variant">Rituais de Bem-estar</p></div>
        </a>
        <a href="#/search" class="group relative rounded-xl overflow-hidden h-36 flex items-end p-4 bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200/50 hover:shadow-[0_8px_30px_rgba(109,88,166,0.1)] transition-all duration-300">
          <span class="absolute top-4 right-4 material-symbols-outlined text-amber-400 text-4xl group-hover:scale-110 transition-transform" style="font-variation-settings:'FILL' 1;">local_offer</span>
          <div><h3 class="font-label-md text-label-md text-on-surface">Ofertas</h3><p class="font-body-sm text-body-sm text-on-surface-variant">Descontos Exclusivos</p></div>
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
              <button id="save-v-${i}" onclick="event.stopPropagation(); window.handleSaveHome(homeVideos[${i}], 'video', 'save-v-${i}')" class="text-outline hover:text-primary transition-colors">
                 <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' ${isSaved ? 1 : 0}">bookmark</span>
              </button>
            </div>
          </div>
        `}).join('')}
      </div>
    </section>
  </main>`;
}

setTimeout(() => {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = featuredProducts.map((p, index) => {
    const isSaved = auth.getSavedItems().some(s => s.id === p.id);
    return `
    <div class="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(109,88,166,0.05)] border border-outline-variant/30 flex flex-col hover:shadow-[0_20px_50px_rgba(109,88,166,0.15)] transition-all duration-500 relative">
      <div class="relative aspect-[4/5] bg-surface-bright overflow-hidden flex items-center justify-center p-4">
        ${p.badge ? `<span class="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full font-label-xs text-[10px] z-10 shadow-lg">${p.badge}</span>` : ''}
        <img alt="${p.name}" class="w-full h-full object-contain product-image-zoom" src="https://lh3.googleusercontent.com/aida-public/${p.img}"/>
        
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
                    <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">chat_bubble</span> 12 Comentários</span>
                    <button id="save-p-${index}" onclick="event.stopPropagation(); window.handleSaveHome(featuredProducts[${index}], 'product', 'save-p-${index}')" class="flex items-center gap-1 hover:text-white transition-colors">
                       <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' ${isSaved ? 1 : 0}">bookmark</span> Salvar
                    </button>
                 </div>
                 <button onclick="window.addToCartHome(${index})" class="w-full bg-white text-primary py-3 rounded-full font-bold text-xs hover:bg-primary-fixed transition-colors shadow-xl">Adicionar à Sacola</button>
              </div>
        </div>
      </div>
      
      <div class="p-4 flex flex-col flex-grow bg-white">
        <h3 class="font-body-md text-sm font-bold text-on-surface line-clamp-1 mb-1">${p.name}</h3>
        <div class="flex items-center justify-between mt-auto">
          <span class="font-display text-lg text-primary font-bold">${p.price}</span>
        </div>
      </div>
    </div>`}).join('');
}, 50);

window.handleSaveHome = (item, type, btnId) => {
    const isSaved = auth.toggleSaveItem(item, type);
    const btn = document.getElementById(btnId);
    if (btn) {
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.style.fontVariationSettings = `'FILL' ${isSaved ? 1 : 0}`;
      btn.classList.toggle('text-amber-500', isSaved);
      btn.classList.toggle('text-outline', !isSaved);
    }
    showToast(isSaved ? 'Salvo nos favoritos!' : 'Removido dos favoritos', isSaved ? 'success' : 'info');
};

// Hero Carousel Logic
setTimeout(() => {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;
    
    let currentSlide = 0;
    const totalSlides = 5;
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
}, 100);
