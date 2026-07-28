import { cartManager } from '../cart_manager.js';
import { showToast } from '../components.js';
import { socialManager } from '../social_manager.js';

export default function productPage() {
  const productId = 'prod_velvet_matte';
  const storeId = 'store_glow_co';
  const storeName = 'Glow & Co. Official';
  const storePhoto = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100';

  const product = {
    id: productId,
    name: 'Pó Facial Velvet Matte',
    desc: 'Ultra-fine milled texture for a seamless blend',
    price: 'R$ 45,90',
    img: 'AB6AXuD18GXwV-Fkc6wDo7J4wrXsDQej-dEfgu5VImTb9uItwdNW88u_1yCxDVF9on8jlVNCPo-eKZEl9aNMrTISfydrBo8SR077DCvYnLcSDxEAalZqqw8TZ3jpvZRULCa0zP9BNNQ-i470VZ5EDn7JHQ2btfru-a-pTCf15BaEHzY9QZpQAus_V57bsYk-VpSr7PEucVXEHnd0d4RBqKFQaBZaW1EDR4bo-Ej6RqvwLps8AyPi3RQMWfHu9arWD8Wneoh9RG_l1BG98xQC'
  };

  window.addToCartProduct = () => {
    cartManager.addItem(product);
    showToast(`${product.name} adicionado ao carrinho!`, 'success');
  };

  window.handleToggleFollowProductStore = () => {
    const res = socialManager.toggleFollowStore(storeId, storeName);
    showToast(res.message, res.success ? (res.isFollowing ? 'success' : 'info') : 'error');
    
    // Update button UI dynamically
    const btn = document.getElementById('follow-store-btn');
    const countEl = document.getElementById('store-followers-count');
    if (btn) {
      const isFollowing = socialManager.isFollowingStore(storeId);
      btn.className = isFollowing
        ? 'px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/30 font-bold text-xs flex items-center gap-1.5 transition-all'
        : 'px-4 py-2 rounded-full bg-primary text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all';
      btn.innerHTML = isFollowing
        ? `<span class="material-symbols-outlined text-[16px]">check</span> Seguindo`
        : `<span class="material-symbols-outlined text-[16px]">add</span> Seguir Loja`;
    }
    if (countEl) {
      countEl.innerText = `${socialManager.getStoreFollowersCount(storeId)} seguidores`;
    }
  };

  window.selectedRating = 5;
  window.setRatingStars = (num) => {
    window.selectedRating = num;
    for (let i = 1; i <= 5; i++) {
      const star = document.getElementById(`star-${i}`);
      if (star) {
        if (i <= num) {
          star.classList.add('text-amber-400');
          star.classList.remove('text-gray-300');
          star.style.fontVariationSettings = "'FILL' 1";
        } else {
          star.classList.remove('text-amber-400');
          star.classList.add('text-gray-300');
          star.style.fontVariationSettings = "'FILL' 0";
        }
      }
    }
  };

  window.handleSubmitProductReview = (e) => {
    e.preventDefault();
    const commentInput = document.getElementById('product-review-comment');
    const comment = commentInput ? commentInput.value : '';

    const res = socialManager.addProductReview(productId, window.selectedRating, comment);
    if (res.success) {
      showToast(res.message, 'success');
      if (commentInput) commentInput.value = '';
      
      // Refresh reviews section
      const reviewsContainer = document.getElementById('product-reviews-list');
      const statsContainer = document.getElementById('product-rating-stats');
      if (reviewsContainer) reviewsContainer.innerHTML = renderReviewsList();
      if (statsContainer) statsContainer.innerHTML = renderRatingStats();
    } else {
      showToast(res.message, 'error');
    }
  };

  const renderRatingStats = () => {
    const stats = socialManager.getProductAverageRating(productId);
    const fullStars = Math.floor(stats.average);
    const starIcons = Array.from({ length: 5 }, (_, i) => 
      `<span class="material-symbols-outlined text-[20px] ${i < fullStars ? 'text-amber-400' : 'text-gray-300'}" style="font-variation-settings:'FILL' ${i < fullStars ? 1 : 0}">star</span>`
    ).join('');

    return `
      <div class="flex items-center gap-4">
        <div class="text-4xl font-display font-bold text-on-surface">${stats.average}</div>
        <div>
          <div class="flex items-center gap-0.5 mb-1">${starIcons}</div>
          <div class="text-xs text-on-surface-variant font-medium opacity-80">${stats.count} avaliações de clientes</div>
        </div>
      </div>
    `;
  };

  const renderReviewsList = () => {
    const reviews = socialManager.getProductReviews(productId);
    if (!reviews || reviews.length === 0) {
      return `<p class="text-xs text-on-surface-variant italic py-4">Seja a primeira pessoa a avaliar este produto!</p>`;
    }

    return reviews.map(r => {
      const stars = Array.from({ length: 5 }, (_, i) => 
        `<span class="material-symbols-outlined text-[16px] ${i < r.rating ? 'text-amber-400' : 'text-gray-300'}" style="font-variation-settings:'FILL' ${i < r.rating ? 1 : 0}">star</span>`
      ).join('');

      return `
        <div class="p-5 bg-white/80 rounded-2xl border border-primary/5 shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center overflow-hidden border border-primary/20">
                ${r.userPhoto ? `<img src="${r.userPhoto}" class="w-full h-full object-cover">` : r.userName.charAt(0)}
              </div>
              <div>
                <p class="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  ${r.userName}
                  ${r.verifiedPurchase ? `<span class="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold">Compra Verificada</span>` : ''}
                </p>
                <div class="flex items-center gap-0.5">${stars}</div>
              </div>
            </div>
            <span class="text-[10px] text-outline opacity-70">${r.date}</span>
          </div>
          <p class="text-xs text-on-surface-variant leading-relaxed font-medium pl-1">${r.comment}</p>
        </div>
      `;
    }).join('');
  };

  const isFollowing = socialManager.isFollowingStore(storeId);
  const followersCount = socialManager.getStoreFollowersCount(storeId);

  return `
  <main class="flex-grow pt-12 px-4 md:px-10 pb-20 max-w-[1280px] mx-auto w-full flex flex-col items-center justify-center bg-background gap-12">
    <!-- Top Grid: Product Image & Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl">
      <!-- Product Image Section -->
      <div class="bg-white rounded-[48px] p-12 shadow-ethereal-hover flex flex-col items-center justify-center relative group overflow-hidden border border-primary/5">
        <div class="absolute -top-24 -left-24 w-64 h-64 bg-primary-container rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none transition-transform group-hover:scale-110"></div>
        
        <div class="absolute top-8 right-8 z-10 flex flex-col gap-4">
          <button onclick="showToast('Adicionado aos favoritos', 'success')" class="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-ethereal hover:scale-110 transition-all duration-300">
            <span class="material-symbols-outlined text-[24px]">favorite</span>
          </button>
          <a href="#/cart" class="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20 hover:scale-110 transition-all duration-300">
            <span class="material-symbols-outlined text-[24px]">shopping_cart</span>
          </a>
        </div>

        <img alt="${product.name}" class="w-full max-w-[380px] h-auto object-contain mix-blend-multiply transform group-hover:scale-105 transition-transform duration-1000 ease-out mb-8" src="${product.img.startsWith('http') ? product.img : 'https://lh3.googleusercontent.com/aida-public/' + product.img}"/>
        
        <div class="text-center mt-6">
          <div class="inline-block px-5 py-2 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm">LANÇAMENTO</div>
          <h1 class="font-display text-3xl md:text-4xl text-on-background tracking-tighter mb-4">${product.name}</h1>
          <div class="text-3xl font-display font-bold text-primary">${product.price}</div>
        </div>
      </div>

      <!-- Details Section -->
      <div class="bg-white/60 backdrop-blur-xl rounded-[48px] p-10 md:p-14 shadow-ethereal border border-white/50 flex flex-col">
        
        <!-- VENDEDOR & SEGUIR LOJA CARD -->
        <div class="bg-white/90 rounded-3xl p-4 border border-primary/10 shadow-sm flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <div class="relative">
              <img src="${storePhoto}" class="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shadow-sm">
              <span class="absolute -bottom-1 -right-1 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">✓</span>
            </div>
            <div>
              <h3 class="text-xs font-bold text-on-surface leading-tight">${storeName}</h3>
              <p id="store-followers-count" class="text-[10px] text-outline font-medium">${followersCount} seguidores</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Seguir Loja Button -->
            <button id="follow-store-btn" onclick="window.handleToggleFollowProductStore()" class="${isFollowing ? 'px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/30 font-bold text-xs flex items-center gap-1.5 transition-all' : 'px-4 py-2 rounded-full bg-primary text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all'}">
              ${isFollowing ? `<span class="material-symbols-outlined text-[16px]">check</span> Seguindo` : `<span class="material-symbols-outlined text-[16px]">add</span> Seguir Loja`}
            </button>

            <!-- Conversar com Vendedor Button -->
            <button onclick="window.openSellerChatModal('${storeId}', '${storeName}', '${storePhoto}')" title="Conversar com Vendedor" class="w-9 h-9 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary flex items-center justify-center transition-all hover:scale-105">
              <span class="material-symbols-outlined text-[20px]">chat</span>
            </button>
          </div>
        </div>

        <div class="mb-8">
            <h2 class="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1">auto_awesome</span>
                A ESSÊNCIA DO PRODUTO
            </h2>
            <p class="text-base text-on-surface-variant leading-relaxed font-medium opacity-80">
                Experimente o toque etéreo do nosso pó velvet matte. Projetado para proporcionar um acabamento impecável e duradouro, mantendo uma sensação leve e natural na pele. Uma joia em seu ritual diário.
            </p>
        </div>

        <div class="flex-grow">
          <h3 class="text-[10px] font-bold text-on-surface opacity-40 uppercase tracking-widest mb-6">Benefícios Reais</h3>
          <ul class="space-y-4 mb-8">
            <li class="flex items-center gap-4 text-sm font-bold text-on-surface">
                <div class="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1;">check</span>
                </div>
                Textura ultra-fina para uma mistura perfeita
            </li>
            <li class="flex items-center gap-4 text-sm font-bold text-on-surface">
                <div class="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1;">check</span>
                </div>
                Controla o brilho sem ressecar a pele
            </li>
            <li class="flex items-center gap-4 text-sm font-bold text-on-surface">
                <div class="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1;">check</span>
                </div>
                Fórmula Vegana & High-Performance
            </li>
          </ul>
        </div>

        <div class="mt-4 pt-8 border-t border-primary/10 flex flex-col sm:flex-row gap-5">
          <div class="flex items-center justify-between bg-primary-container/20 rounded-2xl px-6 py-4 min-w-[140px]">
             <button class="text-primary hover:scale-125 transition-transform"><span class="material-symbols-outlined text-[20px]">remove</span></button>
             <span class="text-base font-bold text-on-primary-container px-4">1</span>
             <button class="text-primary hover:scale-125 transition-transform"><span class="material-symbols-outlined text-[20px]">add</span></button>
          </div>
          <button onclick="window.addToCartProduct()" class="flex-grow bg-primary hover:shadow-2xl shadow-primary/20 text-white rounded-2xl py-4 px-8 font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 active:scale-95">
            CONQUISTAR AGORA 
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings:'FILL' 1;">expand_circle_right</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Avaliações do Produto (Product Reviews & Ratings) -->
    <div class="w-full max-w-6xl bg-white/70 backdrop-blur-xl rounded-[40px] p-8 md:p-12 shadow-ethereal border border-primary/10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-primary/10">
        <div>
          <h2 class="text-2xl font-serif font-bold text-on-surface tracking-tight mb-2">Avaliações do Produto</h2>
          <p class="text-xs text-on-surface-variant opacity-80">Opiniões sinceras de quem vivenciou o ritual de beleza</p>
        </div>
        
        <div id="product-rating-stats">
          ${renderRatingStats()}
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
        <!-- Form to Add Review -->
        <div class="bg-white p-6 rounded-3xl border border-primary/10 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">edit_note</span> Avaliar este produto
          </h3>

          <form onsubmit="window.handleSubmitProductReview(event)" class="space-y-4">
            <div>
              <label class="block text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Sua nota (1 a 5 estrelas)</label>
              <div class="flex items-center gap-1">
                ${[1, 2, 3, 4, 5].map(i => `
                  <button type="button" onclick="window.setRatingStars(${i})" class="focus:outline-none transition-transform hover:scale-125">
                    <span id="star-${i}" class="material-symbols-outlined text-[28px] text-amber-400 cursor-pointer" style="font-variation-settings:'FILL' 1">star</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Seu comentário</label>
              <textarea id="product-review-comment" rows="3" placeholder="O que você achou da fixação, textura e resultado?" class="w-full bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/30 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"></textarea>
            </div>

            <button type="submit" class="w-full py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-[16px]">rate_review</span> Enviar Avaliação
            </button>
          </form>
        </div>

        <!-- List of Product Reviews -->
        <div class="lg:col-span-2 space-y-4 max-h-[480px] overflow-y-auto subtle-scroll pr-1" id="product-reviews-list">
          ${renderReviewsList()}
        </div>
      </div>
    </div>
  </main>`;
}
