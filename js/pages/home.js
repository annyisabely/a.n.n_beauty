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
  const featuredProducts = allProducts.slice(0, 5);

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
      if (icon) {
        icon.style.fontVariationSettings = `'FILL' ${isSaved ? 1 : 0}`;
      }
      btn.classList.toggle('text-[#8B5FBF]', isSaved);
      btn.classList.toggle('text-[#B0A2C2]', !isSaved);
    }
    showToast(isSaved ? 'Salvo nos favoritos!' : 'Removido dos favoritos', isSaved ? 'success' : 'info');
  };

  return `
  <main class="flex-grow w-full bg-[#F6F5FB]">
    <!-- Hero Banner Container (Contained with rounded corners) -->
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
      <section class="relative w-full h-[360px] md:h-[420px] lg:h-[450px] rounded-[28px] overflow-hidden shadow-xl shadow-purple-950/15">
        <div id="hero-carousel" class="flex transition-transform duration-700 ease-in-out h-full w-full">
          
          <!-- Slide 1: Skin Spa em Casa (Reference Match) -->
          <div class="min-w-full h-full relative flex items-center bg-[#180E29]">
            <img alt="Skin Ritual Banner" class="absolute inset-0 w-full h-full object-cover object-center" src="img/hero_skin_spa.jpg"/>
            <div class="absolute inset-0 bg-gradient-to-r from-[#170E28]/95 via-[#170E28]/70 md:via-[#170E28]/30 to-transparent z-10"></div>
            
            <!-- Left Content -->
            <div class="relative z-20 p-6 md:p-12 lg:p-16 max-w-xl">
              <span class="inline-block px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#D8C7F0] border border-white/15 font-bold text-[10px] mb-3 tracking-widest uppercase shadow-sm">RITUAIS DE LUXO</span>
              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight leading-[1.12]" style="font-family:'Poppins',sans-serif">
                Skin Spa em <br class="hidden sm:inline"/><span class="text-[#B893EA]">Casa</span>
              </h1>
              <p class="text-xs sm:text-sm text-[#D8CBEA] italic font-light mb-6 leading-relaxed max-w-md">
                A ciência do cuidado encontra a arte do relaxamento.
              </p>
              <a href="#/rituals" class="bg-[#8B5FBF] hover:bg-[#7848AD] text-white px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-lg shadow-purple-950/40 hover:shadow-purple-900/60 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">
                Conhecer Ritual <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>

            <!-- Right Vertical Accent -->
            <div class="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden xl:flex items-center border-l border-white/20 pl-4 py-2 text-right">
              <p class="text-[11px] font-semibold text-white/50 tracking-[0.25em] uppercase leading-relaxed" style="font-family:'Inter',sans-serif">
                CUIDE<br/>DA SUA<br/>MELHOR<br/>VERSÃO
              </p>
            </div>
          </div>

          <!-- Slide 2: Coleção de Maquiagem & Brilho -->
          <div class="min-w-full h-full relative flex items-center bg-[#1E112E]">
            <img alt="Winter Collection" class="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTXHEqLFQPw5zX70ucVslqE5v58aFYT-h2QhAF23WbKG9zCIRlnWUAoHnHSHQWpLE8wAZUvpJrK-tlWh33Uyc67P_oBpaqtqF0rypcAi-40cNEKBGN0Au5x3YkCDyFH6BesNlQEkQG0a5l8TF_-4T194V_PfCxm5e3UMi86_K_kNuwF7ENg1g9U2hHHBYbnKK5qCgYXbnaeeoBWuX1lqW3XyxYMbbyzmS8kgkMPOcJ_QDW6GUTZurpKEUiWof2_7X85evGcoUb5PsF"/>
            <div class="absolute inset-0 bg-gradient-to-r from-[#170E28]/90 via-[#170E28]/50 to-transparent z-10"></div>
            <div class="relative z-20 p-6 md:p-12 lg:p-16 max-w-xl">
              <span class="inline-block px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#D8C7F0] border border-white/15 font-bold text-[10px] mb-3 tracking-widest uppercase">Coleção Inverno 2026</span>
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight" style="font-family:'Poppins',sans-serif">Brilho Eterno</h2>
              <p class="text-xs sm:text-sm text-[#D8CBEA] italic font-light mb-6 leading-relaxed">Cores intensas e formulações luminosas para momentos inesquecíveis.</p>
              <a href="#/search?q=maquiagem" class="bg-[#8B5FBF] hover:bg-[#7848AD] text-white px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-lg transition-all inline-flex items-center gap-2">Ver Novidades <span class="material-symbols-outlined text-[16px]">auto_awesome</span></a>
            </div>
          </div>

          <!-- Slide 3: Beleza, Maquiagem & Skincare -->
          <div class="min-w-full h-full relative flex items-center bg-[#170E28]">
            <img alt="Beauty Hero" class="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqpBtBh47eNEksho9O5MXG_Zj4BSSfrhinKWZrqS8VcaAs35YxBoPqA-DA9GM4U0WWOhrhNgrznvChCdYlOftaKLUlzUTbaDxlIb5sCcVXC9p6Ft3HP_CCU4w9QNiISyiKnz-p556jwlt9gayBnrpcZ6jOlwd9cL0AtmKaqyKSrYsbjn6v7nXq_xrCitRtz75emRzOesU3G4KCrp4njBa0J2UXIEMLe7jX4UrZ7q3Ow5RfICYUls3H2Uqc5kmKakwRPIRGenfqI--j"/>
            <div class="absolute inset-0 bg-gradient-to-r from-[#170E28]/90 via-[#170E28]/50 to-transparent z-10"></div>
            <div class="relative z-20 p-6 md:p-12 lg:p-16 max-w-xl">
              <span class="inline-block px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#D8C7F0] border border-white/15 font-bold text-[10px] mb-3 tracking-widest uppercase">Beleza, Maquiagem & Skincare</span>
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight truncate max-w-full" style="font-family:'Poppins',sans-serif">${welcomeText}</h2>
              <p class="text-xs sm:text-sm text-[#D8CBEA] italic font-light mb-6 leading-relaxed">"Realçando a beleza que já existe em você."</p>
              <a href="#/search" class="bg-[#8B5FBF] hover:bg-[#7848AD] text-white px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-lg transition-all inline-flex items-center gap-2">Explorar Coleção <span class="material-symbols-outlined text-[16px]">arrow_forward</span></a>
            </div>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button onclick="window.moveHeroSlide(-1)" class="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/65 backdrop-blur-md text-white flex items-center justify-center transition-all z-30" aria-label="Slide anterior">
          <span class="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>
        <button onclick="window.moveHeroSlide(1)" class="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/65 backdrop-blur-md text-white flex items-center justify-center transition-all z-30" aria-label="Próximo slide">
          <span class="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>

        <!-- Indicators -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
          <button onclick="window.gotoHeroSlide(0)" id="dot-0" class="w-6 h-2 rounded-full bg-white shadow-sm transition-all duration-300"></button>
          <button onclick="window.gotoHeroSlide(1)" id="dot-1" class="w-2 h-2 rounded-full bg-white/40 shadow-sm transition-all duration-300"></button>
          <button onclick="window.gotoHeroSlide(2)" id="dot-2" class="w-2 h-2 rounded-full bg-white/40 shadow-sm transition-all duration-300"></button>
          <button onclick="window.gotoHeroSlide(0)" id="dot-3" class="w-2 h-2 rounded-full bg-white/40 shadow-sm transition-all duration-300 hidden md:block"></button>
          <button onclick="window.gotoHeroSlide(0)" id="dot-4" class="w-2 h-2 rounded-full bg-white/40 shadow-sm transition-all duration-300 hidden md:block"></button>
        </div>
      </section>
    </div>

    <!-- Main Content Layout (Left: Categories & Products | Right: Tutorial & Promo Cards) -->
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-14">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <!-- Left Column: Categories and Products (spans 9 cols) -->
        <div class="lg:col-span-9 flex flex-col gap-8">

          <!-- Explore Categorias Section -->
          <section>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2.5">
                <span class="w-7 h-[3px] bg-[#8B5FBF] rounded-full inline-block"></span>
                <h2 class="text-lg md:text-xl font-bold text-[#1F1530]" style="font-family:'Poppins',sans-serif">Explore Categorias</h2>
              </div>
              <a href="#/search?q=categorias" class="text-xs font-bold text-[#1F1530] hover:text-[#8B5FBF] flex items-center gap-1 transition-colors">
                Ver Todas <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
              </a>
            </div>

            <!-- 4 Category Cards -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5 md:gap-4">
              
              <!-- Maquiagem -->
              <a href="#/search?q=maquiagem" class="bg-white rounded-2xl p-4 md:p-5 border border-[#EDE8F5] shadow-[0_2px_12px_rgba(139,95,191,0.06)] hover:shadow-[0_8px_24px_rgba(139,95,191,0.12)] transition-all flex flex-col justify-between group h-36">
                <div class="w-10 h-10 rounded-full bg-[#EDE4F7] text-[#8B5FBF] flex items-center justify-center">
                  <span class="material-symbols-outlined text-[20px]">face_3</span>
                </div>
                <div class="flex items-end justify-between">
                  <div>
                    <h3 class="font-bold text-xs md:text-sm text-[#1F1530] group-hover:text-[#8B5FBF] transition-colors" style="font-family:'Poppins',sans-serif">Maquiagem</h3>
                    <p class="text-[9px] uppercase tracking-wider text-[#8F7EAA] font-semibold mt-0.5">ROSTO, OLHOS E LÁBIOS</p>
                  </div>
                  <span class="w-7 h-7 rounded-full bg-[#8B5FBF] group-hover:bg-[#7242A5] text-white flex items-center justify-center transition-all flex-shrink-0 group-hover:scale-105">
                    <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </a>

              <!-- Skincare -->
              <a href="#/search?q=skincare" class="bg-white rounded-2xl p-4 md:p-5 border border-[#EDE8F5] shadow-[0_2px_12px_rgba(139,95,191,0.06)] hover:shadow-[0_8px_24px_rgba(139,95,191,0.12)] transition-all flex flex-col justify-between group h-36">
                <div class="w-10 h-10 rounded-full bg-[#EDE4F7] text-[#8B5FBF] flex items-center justify-center">
                  <span class="material-symbols-outlined text-[20px]">spa</span>
                </div>
                <div class="flex items-end justify-between">
                  <div>
                    <h3 class="font-bold text-xs md:text-sm text-[#1F1530] group-hover:text-[#8B5FBF] transition-colors" style="font-family:'Poppins',sans-serif">Skincare</h3>
                    <p class="text-[9px] uppercase tracking-wider text-[#8F7EAA] font-semibold mt-0.5">TRATAMENTOS CLÍNICOS</p>
                  </div>
                  <span class="w-7 h-7 rounded-full bg-[#8B5FBF] group-hover:bg-[#7242A5] text-white flex items-center justify-center transition-all flex-shrink-0 group-hover:scale-105">
                    <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </a>

              <!-- Corpo -->
              <a href="#/search?q=corpo" class="bg-white rounded-2xl p-4 md:p-5 border border-[#EDE8F5] shadow-[0_2px_12px_rgba(139,95,191,0.06)] hover:shadow-[0_8px_24px_rgba(139,95,191,0.12)] transition-all flex flex-col justify-between group h-36">
                <div class="w-10 h-10 rounded-full bg-[#EDE4F7] text-[#8B5FBF] flex items-center justify-center">
                  <span class="material-symbols-outlined text-[20px]">fitness_center</span>
                </div>
                <div class="flex items-end justify-between">
                  <div>
                    <h3 class="font-bold text-xs md:text-sm text-[#1F1530] group-hover:text-[#8B5FBF] transition-colors" style="font-family:'Poppins',sans-serif">Corpo</h3>
                    <p class="text-[9px] uppercase tracking-wider text-[#8F7EAA] font-semibold mt-0.5">RITUAIS DE BEM-ESTAR</p>
                  </div>
                  <span class="w-7 h-7 rounded-full bg-[#8B5FBF] group-hover:bg-[#7242A5] text-white flex items-center justify-center transition-all flex-shrink-0 group-hover:scale-105">
                    <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </a>

              <!-- Ofertas -->
              <a href="#/search?q=ofertas" class="bg-white rounded-2xl p-4 md:p-5 border border-[#EDE8F5] shadow-[0_2px_12px_rgba(139,95,191,0.06)] hover:shadow-[0_8px_24px_rgba(139,95,191,0.12)] transition-all flex flex-col justify-between group h-36">
                <div class="w-10 h-10 rounded-full bg-[#EDE4F7] text-[#8B5FBF] flex items-center justify-center">
                  <span class="material-symbols-outlined text-[20px]">sell</span>
                </div>
                <div class="flex items-end justify-between">
                  <div>
                    <h3 class="font-bold text-xs md:text-sm text-[#1F1530] group-hover:text-[#8B5FBF] transition-colors" style="font-family:'Poppins',sans-serif">Ofertas</h3>
                    <p class="text-[9px] uppercase tracking-wider text-[#8F7EAA] font-semibold mt-0.5">DESCONTOS CELESTIAIS</p>
                  </div>
                  <span class="w-7 h-7 rounded-full bg-[#8B5FBF] group-hover:bg-[#7242A5] text-white flex items-center justify-center transition-all flex-shrink-0 group-hover:scale-105">
                    <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </a>
            </div>
          </section>

          <!-- Destaques em Beleza Section -->
          <section>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2.5">
                <span class="w-7 h-[3px] bg-[#8B5FBF] rounded-full inline-block"></span>
                <h2 class="text-lg md:text-xl font-bold text-[#1F1530]" style="font-family:'Poppins',sans-serif">Destaques em Beleza</h2>
              </div>
            </div>

            <!-- Product Cards Grid (5 matching reference image) -->
            <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5 md:gap-4" id="product-grid">
              <!-- Rendered via mount() -->
            </div>
          </section>

        </div>

        <!-- Right Column: Tutorial Card & Promo Gift Card (spans 3 cols) -->
        <div class="lg:col-span-3 flex flex-col gap-6">

          <!-- Card 1: Dicas de Beleza (Tutorial Banner) -->
          <div class="bg-[#1C122F] rounded-[24px] overflow-hidden p-5 text-white relative shadow-lg flex flex-col justify-between h-[180px] lg:h-[190px] border border-white/5">
            <div class="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-85" style="background-image: url('img/tutorial_dicas.jpg'); mask-image: linear-gradient(to right, transparent 0%, black 50%); -webkit-mask-image: linear-gradient(to right, transparent 0%, black 50%);"></div>
            <div class="relative z-10 max-w-[145px]">
              <span class="text-[9px] uppercase tracking-widest text-[#BBA6D9] font-bold block mb-1">TUTORIAIS</span>
              <h3 class="text-base lg:text-lg font-bold text-white leading-tight mb-1" style="font-family:'Poppins',sans-serif">Dicas de<br/>Beleza</h3>
              <p class="text-[10px] text-[#C5B8D8] leading-tight line-clamp-2 mb-3">Tutorials, truques e indicações de produtos para você brilhar.</p>
              <a href="#/videos" class="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all w-fit">
                Assistir Agora <span class="material-symbols-outlined text-[13px]">play_circle</span>
              </a>
            </div>
          </div>

          <!-- Card 2: Até 50% de desconto (Special Offer Promo) -->
          <div class="rounded-[24px] overflow-hidden p-5 text-white relative shadow-xl flex flex-col justify-between min-h-[350px] border border-white/5" style="background: linear-gradient(155deg, #2D1B48 0%, #46286E 100%);">
            <div class="relative z-10">
              <span class="text-[9px] uppercase tracking-widest text-[#D4BDE8] font-bold block mb-1.5">OFERTAS ESPECIAIS</span>
              <h3 class="text-xl lg:text-2xl font-extrabold text-white leading-tight mb-2" style="font-family:'Poppins',sans-serif">Até 50%<br/>de desconto</h3>
              <p class="text-xs text-[#C5B8D8] leading-relaxed mb-4 max-w-[180px]">As melhores marcas com preços imperdíveis.</p>
              <a href="#/search?q=ofertas" class="inline-flex items-center gap-1.5 bg-[#EDE0F8] hover:bg-white text-[#46286E] text-xs font-bold px-4 py-2 rounded-full shadow-md transition-all w-fit">
                Ver Ofertas <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>

            <div class="relative flex items-center justify-center my-auto py-2">
              <img src="img/promo_gift.jpg" alt="Oferta Especial Presente" class="w-32 h-32 md:w-36 md:h-36 object-contain rounded-2xl drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-300"/>
            </div>

            <!-- Dots Indicator -->
            <div class="flex items-center justify-center gap-1.5 pt-2">
              <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-white/40"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-white/40"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-white/40"></span>
            </div>
          </div>

        </div>

      </div>

      <!-- Additional Video Feed Section (Retained for full functionality) -->
      <section class="mt-14 pt-8 border-t border-[#EDE8F5]">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2.5">
            <span class="w-7 h-[3px] bg-[#8B5FBF] rounded-full inline-block"></span>
            <h2 class="text-lg md:text-xl font-bold text-[#1F1530]" style="font-family:'Poppins',sans-serif">Tutoriais e Rituais</h2>
          </div>
          <a class="text-xs font-bold text-[#1F1530] hover:text-[#8B5FBF] flex items-center gap-1 transition-colors" href="#/videos">
            Ver Galeria <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
          </a>
        </div>
        <div class="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
          ${homeVideos.map((v, i) => {
            const isSaved = auth.getSavedItems().some(s => s.id === v.id);
            return `
            <div class="min-w-[260px] md:min-w-[300px] bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(139,95,191,0.06)] border border-[#EDE8F5] flex-shrink-0 group cursor-pointer hover:shadow-md transition-shadow relative">
              <div class="relative aspect-video">
                <img src="https://lh3.googleusercontent.com/aida-public/${v.img}" class="w-full h-full object-cover product-image-zoom" alt="${v.title}">
                <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <span class="material-symbols-outlined text-white text-4xl opacity-90 group-hover:scale-110 transition-transform drop-shadow-md" style="font-variation-settings:'FILL' 1;">play_circle</span>
                </div>
                <div class="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded font-medium">${v.time}</div>
              </div>
              <div class="p-3.5 flex justify-between items-start">
                <div>
                  <span class="text-[10px] font-bold text-[#8B5FBF] uppercase tracking-wider mb-0.5 block">${v.cat}</span>
                  <h3 class="text-xs md:text-sm font-semibold text-[#1F1530] line-clamp-1">${v.title}</h3>
                </div>
                <button id="save-v-${i}" onclick="event.stopPropagation(); window.handleSaveHome(${i}, 'video', 'save-v-${i}')" class="text-[#B0A2C2] hover:text-[#8B5FBF] transition-colors p-1" title="Salvar vídeo">
                   <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' ${isSaved ? 1 : 0}">bookmark</span>
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
  const featuredProducts = allProducts.slice(0, 5);
  const grid = document.getElementById('product-grid');
  
  if (grid) {
    grid.innerHTML = featuredProducts.map((p, index) => {
      const isSaved = auth.getSavedItems().some(s => s.id === p.id);
      return `
      <div class="bg-white rounded-2xl p-3 md:p-3.5 border border-[#EDE8F5] shadow-[0_2px_12px_rgba(139,95,191,0.06)] hover:shadow-[0_8px_24px_rgba(139,95,191,0.14)] transition-all duration-300 flex flex-col justify-between group relative">
        <!-- Top bar: Badge and Wishlist Heart -->
        <div class="flex items-center justify-between mb-1 min-h-[22px]">
          <div>
            ${p.badge ? `<span class="${p.badge === 'Mais vendido' ? 'bg-[#2D1A40]' : 'bg-[#8B5FBF]'} text-white text-[9px] font-bold px-2 py-0.5 rounded-full inline-block tracking-wide">${p.badge}</span>` : ''}
          </div>
          <button id="fav-${index}" onclick="event.preventDefault(); event.stopPropagation(); window.handleSaveHome(${index}, 'product', 'fav-${index}')" class="w-7 h-7 rounded-full flex items-center justify-center ${isSaved ? 'text-[#8B5FBF]' : 'text-[#B0A2C2]'} hover:text-[#8B5FBF] transition-all hover:scale-110" title="Favoritar">
            <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' ${isSaved ? 1 : 0}">favorite</span>
          </button>
        </div>

        <!-- Product Image -->
        <a href="#/product?id=${p.id}" class="w-full aspect-square flex items-center justify-center p-2 overflow-hidden my-1 block">
          <img alt="${p.name}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" src="${p.img}"/>
        </a>

        <!-- Details -->
        <div class="flex flex-col flex-grow justify-end pt-2">
          <!-- Category & Rating -->
          <div class="flex items-center justify-between text-[10px] text-[#8F7EAA] mb-1">
            <span class="font-medium">${p.cat}</span>
            <span class="flex items-center gap-0.5 text-amber-500 font-bold text-[10px]">★ <span class="text-[#5C4D6B] font-semibold">${p.rating || '4.8'}</span> <span class="text-[#8F7EAA] font-normal">(${p.reviews || '124'})</span></span>
          </div>

          <!-- Product Title -->
          <a href="#/product?id=${p.id}" class="font-bold text-xs md:text-sm text-[#1F1530] hover:text-[#8B5FBF] transition-colors line-clamp-1 mb-0.5" style="font-family:'Poppins',sans-serif">${p.name}</a>

          <!-- Store / Brand Subtitle -->
          <span class="text-[10px] text-[#8F7EAA] block mb-2">${p.company_name || 'Beleza na Web'}</span>

          <!-- Price & Round Purple Cart Button -->
          <div class="flex items-center justify-between mt-auto pt-1">
            <span class="font-extrabold text-sm md:text-base text-[#1F1530]" style="font-family:'Poppins',sans-serif">${p.price}</span>
            <button onclick="event.preventDefault(); event.stopPropagation(); window.addToCartHome(${index})" class="w-8 h-8 rounded-full bg-[#8B5FBF] hover:bg-[#7343A8] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all" title="Adicionar à sacola">
              <span class="material-symbols-outlined text-[16px]">shopping_cart</span>
            </button>
          </div>
        </div>
      </div>
      `;
    }).join('');
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
                  dot.classList.add('bg-white', 'w-6');
                  dot.classList.remove('bg-white/40', 'w-2');
              } else {
                  dot.classList.remove('bg-white', 'w-6');
                  dot.classList.add('bg-white/40', 'w-2');
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
