import { cartManager } from '../cart_manager.js';
import { showToast } from '../components.js';
import { socialManager } from '../social_manager.js';
import { database } from '../database.js';
import { auth } from '../auth.js';
import { dataManager, storesData, getProductImage } from '../data_manager.js';

export default function productPage() {
  // Read product ID from URL query param: #/product?id=...
  const hashQuery = window.location.hash.split('?')[1] || '';
  const urlParams = new URLSearchParams(hashQuery);
  const productIdParam = urlParams.get('id') || 'prod_velvet_matte';

  // ── Helper to resolve product from multiple sources ──
  function resolveProduct(id) {
    // 1. Check Store Showcase Templates (_p1 to _p6)
    const showcaseMap = {
      p1: {
        name: 'Sérum Hidratante Facial',
        price: 'R$ 47,90',
        oldPrice: 'R$ 59,90',
        category: 'Skincare',
        desc: 'Sérum com ácido hialurônico de tripla ação para hidratação profunda e pele luminosa.',
        img: 'img/serum_facial_1791458880967.jpg'
      },
      p2: {
        name: 'Creme Hidratante',
        price: 'R$ 42,40',
        oldPrice: 'R$ 49,90',
        category: 'Skincare',
        desc: 'Textura aveludada com manteiga de karité e ceramidas para restauração da barreira cutânea.',
        img: 'img/creme_hidratante_1791458893023.jpg'
      },
      p3: {
        name: 'Paleta de Sombras Rosé',
        price: 'R$ 80,90',
        oldPrice: 'R$ 89,90',
        category: 'Maquiagem',
        desc: '12 tons ultranaturais em acabamentos matte e cintilante com alta pigmentação e fixação prolongada.',
        img: 'img/paleta_sombras_1791458911527.jpg'
      },
      p4: {
        name: 'Batom Matte Aveludado',
        price: 'R$ 32,90',
        oldPrice: 'R$ 39,90',
        category: 'Maquiagem',
        desc: 'Longa duração de até 16 horas sem ressecar os lábios, enriquecido com óleo de rosa mosqueta.',
        img: 'img/batom_matte_1791458925028.jpg'
      },
      p5: {
        name: 'Kit de Pincéis Premium',
        price: 'R$ 114,30',
        oldPrice: 'R$ 129,90',
        category: 'Acessórios',
        desc: 'Cerdas veganas ultramacias com acabamento em ouro rosé para aplicação impecável de pós, sombras e bases.',
        img: 'img/kit_pinceis_1791458940916.jpg'
      },
      p6: {
        name: 'Base Fluida Glow',
        price: 'R$ 68,90',
        oldPrice: 'R$ 79,90',
        category: 'Maquiagem',
        desc: 'Cobertura média construível com acabamento radiante e toque seco que dura o dia todo.',
        img: 'img/base_fluida_1791458954927.jpg'
      }
    };

    // Check if ID matches pattern like `nycoly_p3` or `store_p3`
    const showcaseMatch = id.match(/_?(p[1-6])$/i);
    if (showcaseMatch && showcaseMap[showcaseMatch[1].toLowerCase()]) {
      const template = showcaseMap[showcaseMatch[1].toLowerCase()];
      // Extract store ID prefix (e.g. 'nycoly' from 'nycoly_p3')
      const storePrefix = id.replace(/_?(p[1-6])$/i, '').replace(/^_/, '');
      return {
        id: id,
        name: template.name,
        price: template.price,
        oldPrice: template.oldPrice,
        category: template.category,
        desc: template.desc,
        img: template.img,
        company_id: storePrefix || 'ann_beauty'
      };
    }

    // 2. Check Custom Products from LocalStorage
    try {
      const customs = dataManager.getCustomProducts();
      const foundCustom = customs.find(p => p.id === id);
      if (foundCustom) return foundCustom;
    } catch (e) {}

    // 3. Check All Store Custom Products
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ann_store_products_')) {
          const prods = JSON.parse(localStorage.getItem(key)) || [];
          const found = prods.find(p => p.id === id);
          if (found) return found;
        }
      }
    } catch (e) {}

    // 4. Check Generated Catalog Products
    try {
      const catalog = dataManager.generateProducts(200);
      const foundCatalog = catalog.find(p => p.id === id);
      if (foundCatalog) return foundCatalog;
    } catch (e) {}

    // 5. Check SQLite Database Products
    try {
      const dbProds = database.getProducts();
      const foundDb = dbProds.find(p => p.id === id);
      if (foundDb) return foundDb;
    } catch (e) {}

    // 6. Fallback based on ID keyword heuristics
    const idLower = id.toLowerCase();
    if (idLower.includes('paleta') || idLower.includes('sombra')) {
      return {
        id,
        name: 'Paleta de Sombras Rosé',
        price: 'R$ 80,90',
        category: 'Maquiagem',
        desc: '12 tons ultranaturais em acabamentos matte e cintilante com alta pigmentação.',
        img: 'img/paleta_sombras_1791458911527.jpg',
        company_id: 'nycoly'
      };
    } else if (idLower.includes('batom')) {
      return {
        id,
        name: 'Batom Matte Aveludado',
        price: 'R$ 32,90',
        category: 'Maquiagem',
        desc: 'Longa duração de até 16 horas sem ressecar os lábios.',
        img: 'img/batom_matte_1791458925028.jpg',
        company_id: 'nycoly'
      };
    } else if (idLower.includes('serum')) {
      return {
        id,
        name: 'Sérum Hidratante Facial',
        price: 'R$ 47,90',
        category: 'Skincare',
        desc: 'Sérum com ácido hialurônico de tripla ação para hidratação profunda.',
        img: 'img/serum_facial_1791458880967.jpg',
        company_id: 'glow_co'
      };
    } else if (idLower.includes('pincel') || idLower.includes('pinceis')) {
      return {
        id,
        name: 'Kit de Pincéis Premium',
        price: 'R$ 114,30',
        category: 'Acessórios',
        desc: 'Cerdas veganas ultramacias para aplicação impecável de maquiagem.',
        img: 'img/kit_pinceis_1791458940916.jpg',
        company_id: 'lumina'
      };
    } else if (idLower.includes('base')) {
      return {
        id,
        name: 'Base Fluida Glow',
        price: 'R$ 68,90',
        category: 'Maquiagem',
        desc: 'Cobertura média construível com acabamento radiante e toque seco.',
        img: 'img/base_fluida_1791458954927.jpg',
        company_id: 'ann_beauty'
      };
    }

    // Default Fallback
    return {
      id: id || 'prod_velvet_matte',
      name: 'Pó Facial Velvet Matte',
      desc: 'Projetado para proporcionar um acabamento impecável e duradouro, mantendo uma sensação leve e natural na pele. Controla o brilho sem ressecar.',
      price: 'R$ 45,90',
      category: 'Maquiagem',
      img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80',
      company_id: 'glow_co'
    };
  }

  const rawProduct = resolveProduct(productIdParam);
  
  // Format Image URL properly
  let productImage = rawProduct.img || getProductImage(rawProduct.name, rawProduct.category);
  if (!productImage.startsWith('http') && !productImage.startsWith('img/') && !productImage.startsWith('../') && !productImage.startsWith('/')) {
    productImage = 'https://lh3.googleusercontent.com/aida-public/' + productImage;
  }

  const product = {
    id: rawProduct.id,
    name: rawProduct.name || 'Produto de Beleza',
    desc: rawProduct.desc || 'Produto de alta performance com formulação exclusiva para realçar sua beleza natural.',
    price: rawProduct.price || 'R$ 49,90',
    oldPrice: rawProduct.oldPrice || null,
    category: rawProduct.category || rawProduct.cat || 'Beleza',
    img: productImage,
    company_id: rawProduct.company_id || 'ann_beauty'
  };

  // ── Store Resolution ──
  const storeKey = product.company_id || 'ann_beauty';
  const resolvedStore = storesData[storeKey] || {
    id: storeKey,
    name: rawProduct.company_name || 'Beleza na Web Official',
    photo: rawProduct.company_photo || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100',
    followersBase: 1240
  };

  const storeId = resolvedStore.id || storeKey;
  const storeName = resolvedStore.name || 'Beleza na Web';
  const storePhoto = resolvedStore.photo || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100';

  let quantity = 1;

  window.addToCartProduct = () => {
    cartManager.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      desc: product.desc,
      company_id: storeId,
      company_name: storeName
    }, quantity);
    showToast(`✅ ${product.name} adicionado ao carrinho!`, 'success');
  };

  window.buyNowProduct = () => {
    cartManager.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      desc: product.desc,
      company_id: storeId,
      company_name: storeName
    }, quantity);
    window.location.hash = '#/checkout';
  };

  window.handleToggleProductFavorite = () => {
    const isSavedNow = auth.toggleSaveItem(product, 'product');
    const favBtn = document.getElementById('product-fav-btn');
    if (favBtn) {
      favBtn.classList.toggle('text-red-500', isSavedNow);
      favBtn.classList.toggle('text-on-surface-variant', !isSavedNow);
      const icon = favBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.style.fontVariationSettings = `'FILL' ${isSavedNow ? 1 : 0}`;
    }
    showToast(isSavedNow ? 'Produto salvo nos favoritos! ❤️' : 'Removido dos favoritos', isSavedNow ? 'success' : 'info');
  };

  window.updateProductQty = (delta) => {
    quantity = Math.max(1, quantity + delta);
    const qtyEl = document.getElementById('product-qty-display');
    if (qtyEl) qtyEl.innerText = quantity;
  };

  window.reportProduct = (id, name) => {
    const reason = prompt('Qual o motivo da denúncia para este produto?');
    if (reason) {
      const reports = database.getReports();
      const reportId = `rep_${Date.now()}`;
      const currentUser = auth.getUser();
      reports.push({
        id: reportId,
        reporterName: currentUser ? currentUser.name : 'Cliente',
        targetType: 'produto',
        targetId: id,
        targetName: name,
        reason: reason,
        status: 'pending',
        date: 'Hoje'
      });
      database.saveReports(reports);

      if (window.notificationsManager) {
        window.notificationsManager.addNotification('admin', {
          title: 'Produto Denunciado',
          message: `O produto "${name}" foi denunciado por: "${reason}". Verifique a denúncia no painel.`,
          icon: 'flag',
          color: 'text-red-500'
        });
      }
      showToast('Denúncia enviada com sucesso para análise.', 'success');
    }
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

    const res = socialManager.addProductReview(product.id, window.selectedRating, comment);
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
    const stats = socialManager.getProductAverageRating(product.id);
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
    const reviews = socialManager.getProductReviews(product.id);
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

  const isSavedInitial = auth.getSavedItems().some(s => s.id === product.id);
  const galleryImages = [
    product.img,
    'img/serum_facial_1791458880967.jpg',
    'img/creme_hidratante_1791458893023.jpg',
    'img/paleta_sombras_1791458911527.jpg'
  ];

  return `
  <main class="max-w-[1280px] mx-auto px-6 md:px-10 py-12 bg-background flex flex-col gap-16">
    
    <!-- Top Grid: Product Image & Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      
      <!-- Galeria de Imagens (Esquerda) -->
      <div class="flex flex-col gap-4">
        <div class="aspect-square bg-white border border-[#DDD0E8] rounded-3xl overflow-hidden relative group shadow-sm flex items-center justify-center p-8">
          
          <!-- Botões flutuantes -->
          <div class="absolute top-6 right-6 z-10 flex flex-col gap-3">
            <button id="product-fav-btn" onclick="window.handleToggleProductFavorite()" title="Favoritar Produto" class="w-12 h-12 bg-white/90 border border-outline-variant rounded-full flex items-center justify-center ${isSavedInitial ? 'text-red-500' : 'text-on-surface-variant'} hover:text-primary hover:bg-surface transition-all shadow-sm">
              <span class="material-symbols-outlined text-[22px]" style="font-variation-settings:'FILL' ${isSavedInitial ? 1 : 0}">favorite</span>
            </button>
            <button onclick="window.reportProduct('${product.id}', '${product.name}')" title="Denunciar Produto" class="w-12 h-12 bg-white/90 border border-outline-variant rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/5 transition-all shadow-sm">
              <span class="material-symbols-outlined text-[22px]">flag</span>
            </button>
          </div>

          <img alt="${product.name}" id="main-product-img" class="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700" src="${product.img}"/>
        </div>
        
        <!-- Thumbnails -->
        <div class="grid grid-cols-4 gap-4">
          ${galleryImages.map((gImg, gIdx) => `
          <button onclick="document.getElementById('main-product-img').src='${gImg}'; document.querySelectorAll('.gallery-thumb-btn').forEach(b => b.classList.replace('border-primary', 'border-[#DDD0E8]')); this.classList.replace('border-[#DDD0E8]', 'border-primary')" class="gallery-thumb-btn aspect-square bg-white border-2 ${gIdx === 0 ? 'border-primary' : 'border-[#DDD0E8]'} rounded-xl overflow-hidden shadow-sm p-1.5 hover:opacity-100 transition-all">
            <img class="w-full h-full object-contain" src="${gImg}" onerror="this.src='${product.img}'" />
          </button>
          `).join('')}
        </div>
      </div>

      <!-- Detalhes do Produto (Direita) -->
      <div class="flex flex-col">
        <div class="mb-2">
          <span class="inline-block px-3 py-1 bg-primary text-white rounded-md text-[10px] font-bold uppercase tracking-widest">${product.category}</span>
        </div>
        
        <h1 class="font-display text-3xl md:text-4xl font-bold text-on-background mb-4">${product.name}</h1>
        
        <div class="flex items-center gap-4 mb-6">
          <div id="product-rating-stats-mini" class="flex items-center gap-1 cursor-pointer hover:underline" onclick="document.getElementById('reviews-section').scrollIntoView({behavior: 'smooth'})">
             ${Array.from({ length: 5 }, (_, i) => `<span class="material-symbols-outlined text-[16px] text-yellow-400" style="font-variation-settings:'FILL' 1">star</span>`).join('')}
             <span class="text-sm font-bold ml-1 text-on-background">5.0</span>
             <span class="text-xs text-on-surface-variant ml-1">(Ver avaliações)</span>
          </div>
        </div>

        <div class="flex items-baseline gap-3 mb-8">
          <span class="font-display text-4xl font-bold text-primary">${product.price}</span>
          ${product.oldPrice ? `<span class="text-lg text-[#5C4D6B] line-through font-medium">${product.oldPrice}</span>` : ''}
        </div>

        <!-- Descrição -->
        <div class="mb-8 bg-white/60 p-6 rounded-2xl border border-[#DDD0E8]">
          <h3 class="font-body text-sm font-bold text-on-background mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[18px]">description</span> Descrição do Produto
          </h3>
          <p class="text-sm text-on-surface-variant leading-relaxed">
            ${product.desc}
          </p>
        </div>

        <!-- Ações -->
        <div class="flex flex-col sm:flex-row gap-3 mb-10 pt-4 border-t border-[#DDD0E8]">
          <div class="flex items-center justify-between bg-white border border-[#DDD0E8] rounded-2xl px-4 py-3 min-w-[110px]">
             <button onclick="window.updateProductQty(-1)" class="text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">remove</span></button>
             <span id="product-qty-display" class="text-sm font-bold text-on-background">1</span>
             <button onclick="window.updateProductQty(1)" class="text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">add</span></button>
          </div>
          <button onclick="window.addToCartProduct()" class="flex-1 bg-white border-2 border-primary text-primary hover:bg-primary/5 rounded-2xl py-3.5 px-6 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm">
            <span class="material-symbols-outlined text-[18px]">shopping_cart</span>
            Adicionar à Sacola
          </button>
          <button onclick="window.buyNowProduct()" class="flex-1 bg-primary hover:bg-primary-dark text-white rounded-2xl py-3.5 px-6 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-[18px]">flash_on</span>
            Comprar Agora
          </button>
        </div>

        <!-- Loja/Vendedor -->
        <div class="bg-white rounded-2xl p-6 border border-[#DDD0E8] flex items-center justify-between shadow-sm">
          <div class="flex items-center gap-4">
            <a href="#/store?id=${storeId}">
              <img src="${storePhoto}" class="w-14 h-14 rounded-full object-cover border border-[#DDD0E8] hover:opacity-85 transition-opacity">
            </a>
            <div>
              <p class="text-xs text-on-surface-variant">Vendido por</p>
              <a href="#/store?id=${storeId}" class="font-bold text-on-background hover:text-primary transition-colors">${storeName}</a>
              <p id="store-followers-count" class="text-xs text-on-surface-variant">${followersCount} seguidores</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button id="follow-store-btn" onclick="window.handleToggleFollowProductStore()" class="${isFollowing ? 'px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold text-xs transition-colors' : 'px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary-dark transition-colors'}">
              ${isFollowing ? 'Seguindo' : 'Seguir Loja'}
            </button>
            <button onclick="window.openSellerChatModal('${storeId}', '${storeName}', '${storePhoto}', { type: 'product', productId: '${product.id}', productName: '${product.name.replace(/'/g, "\\'")}', productPrice: '${product.price}', productImg: '${product.img}', productCategory: '${product.category}' })" class="px-3.5 py-2 rounded-xl bg-[#E8D8F4] hover:bg-primary hover:text-white text-primary flex items-center gap-1.5 font-bold text-xs transition-colors cursor-pointer shadow-xs" title="Conversar com o Vendedor sobre este produto">
              <span class="material-symbols-outlined text-[18px]">chat</span>
              <span class="hidden sm:inline">Conversar com Vendedor</span>
              <span class="sm:hidden">Chat</span>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Seção de Avaliações -->
    <div id="reviews-section" class="border-t border-[#DDD0E8] pt-16">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 class="font-display text-2xl font-bold text-on-background mb-2">Avaliações do Produto</h2>
          <p class="text-sm text-on-surface-variant">Opiniões de quem já comprou</p>
        </div>
        <div id="product-rating-stats">
          ${renderRatingStats()}
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- List of Reviews -->
        <div class="lg:col-span-2 space-y-6" id="product-reviews-list">
          ${renderReviewsList()}
        </div>

        <!-- Form to Add Review -->
        <div class="bg-white p-8 rounded-3xl border border-[#DDD0E8] shadow-sm h-fit">
          <h3 class="font-display text-lg font-bold text-on-background mb-6">Deixe sua avaliação</h3>

          <form onsubmit="window.handleSubmitProductReview(event)" class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-on-background mb-2">Nota</label>
              <div class="flex items-center gap-1">
                ${[1, 2, 3, 4, 5].map(i => `
                  <button type="button" onclick="window.setRatingStars(${i})" class="focus:outline-none">
                    <span id="star-${i}" class="material-symbols-outlined text-[32px] text-amber-400 hover:scale-110 transition-transform" style="font-variation-settings:'FILL' 1">star</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-on-background mb-2">Comentário</label>
              <textarea id="product-review-comment" rows="4" placeholder="O que você achou do produto?" class="w-full bg-background border border-[#DDD0E8] rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors resize-none"></textarea>
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-[18px]">send</span> Enviar Avaliação
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>`;
}
