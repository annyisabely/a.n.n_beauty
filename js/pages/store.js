import { auth } from '../auth.js';
import { cartManager } from '../cart_manager.js';
import { showToast } from '../components.js';
import { dataManager, storesData, getProductImage } from '../data_manager.js';
import { socialManager } from '../social_manager.js';
import { database } from '../database.js';

export default function storePage() {
  const user = auth.getUser();
  
  // Read store ID from URL hash: #/store?id=...
  const hashQuery = window.location.hash.split('?')[1] || '';
  const urlParams = new URLSearchParams(hashQuery);
  const storeIdParam = urlParams.get('id');
  
  // ── Store Data Management & Owner Resolution ──
  // User's custom store stored in localStorage
  let userCustomStore = null;
  try {
    userCustomStore = JSON.parse(localStorage.getItem(`ann_store_${user?.email || 'default'}`));
  } catch (e) {}

  // Determine if viewing as OWNER or VISITOR
  // If no ?id param is provided (user clicked "Minha Loja") OR ?id matches user's store/email/id
  const isOwner = user && (
    !storeIdParam || 
    storeIdParam === 'my_store' || 
    storeIdParam === user.email || 
    storeIdParam === user.id ||
    storeIdParam === (user.company_id || 'ann_beauty') ||
    (user.role === 'admin_master' && (!storeIdParam || storeIdParam === 'ann_beauty')) ||
    (userCustomStore && userCustomStore.id === storeIdParam)
  );

  // Default base store details
  const defaultStore = {
    id: user?.email ? `store_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}` : 'ann_beauty',
    name: user?.company_name || 'Beleza na Web',
    badge: 'LOJA OFICIAL',
    tagline: 'Realce sua beleza, expresse quem você é. ✨',
    bannerText: 'Produtos selecionados com amor para você brilhar todos os dias.',
    desc: user?.company_description || 'Cuidados com a pele, maquiagem e acessórios para realçar sua beleza natural todos os dias.',
    photo: user?.company_photo || user?.photo || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300',
    cover: user?.company_banner || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200',
    phone: user?.company_phone || '(11) 99999-0001',
    address: user?.company_address || 'Av. Paulista, 1000 — Bela Vista, São Paulo/SP',
    rating: '4,9',
    reviews: 340,
    productsCount: 350,
    delivery: '99,4%',
    followersBase: 1240,
  };

  // Resolve Store Object
  let storeInfo;
  if (isOwner) {
    storeInfo = userCustomStore || defaultStore;
  } else {
    // Visitor viewing another store
    const baseCatalogStore = storesData[storeIdParam] || storesData['ann_beauty'];
    storeInfo = {
      ...baseCatalogStore,
      badge: 'LOJA OFICIAL',
      bannerText: 'Produtos selecionados com amor para você brilhar todos os dias.',
      productsCount: baseCatalogStore.products || 120,
      rating: (baseCatalogStore.rating || '4.9').replace('.', ','),
      delivery: (baseCatalogStore.delivery || '99.4%').replace('.', ',')
    };
  }

  const storeId = storeInfo.id || storeIdParam || 'ann_beauty';
  const storeName = storeInfo.name || 'Beleza na Web';
  const storePhoto = storeInfo.photo || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300';
  const storeDesc = storeInfo.desc || 'Cuidados com a pele, maquiagem e acessórios para realçar sua beleza natural todos os dias.';

  const isFollowing = socialManager.isFollowingStore(storeId);
  const followersCount = (storeInfo.followersBase || 1240) + (isFollowing ? 1 : 0);

  // ── Products for this Store ──
  // Check if store has custom products stored locally
  let customProducts = [];
  try {
    customProducts = JSON.parse(localStorage.getItem(`ann_store_products_${storeId}`)) || [];
  } catch (e) {}

  // Base featured showcase products matching the user's reference mockup
  const defaultShowcaseProducts = [
    {
      id: `${storeId}_p1`,
      name: 'Sérum Hidratante Facial',
      price: 'R$ 47,90',
      oldPrice: 'R$ 59,90',
      discount: '-20%',
      rating: '4,8',
      reviewsCount: 120,
      stock: 45,
      category: 'Skincare',
      desc: 'Sérum com ácido hialurônico de tripla ação para hidratação profunda e pele luminosa.',
      img: 'img/serum_facial_1791458880967.jpg',
      company_id: storeId,
      company_name: storeName
    },
    {
      id: `${storeId}_p2`,
      name: 'Creme Hidratante',
      price: 'R$ 42,40',
      oldPrice: 'R$ 49,90',
      discount: '-15%',
      rating: '4,9',
      reviewsCount: 98,
      stock: 32,
      category: 'Skincare',
      desc: 'Textura aveludada com manteiga de karité e ceramidas para restauração da barreira cutânea.',
      img: 'img/creme_hidratante_1791458893023.jpg',
      company_id: storeId,
      company_name: storeName
    },
    {
      id: `${storeId}_p3`,
      name: 'Paleta de Sombras Rosé',
      price: 'R$ 80,90',
      oldPrice: 'R$ 89,90',
      discount: '-10%',
      rating: '4,7',
      reviewsCount: 76,
      stock: 18,
      category: 'Maquiagem',
      desc: '12 tons ultranaturais em acabamentos matte e cintilante com alta pigmentação.',
      img: 'img/paleta_sombras_1791458911527.jpg',
      company_id: storeId,
      company_name: storeName
    },
    {
      id: `${storeId}_p4`,
      name: 'Batom Matte Aveludado',
      price: 'R$ 32,90',
      oldPrice: 'R$ 39,90',
      discount: '-18%',
      rating: '4,8',
      reviewsCount: 154,
      stock: 60,
      category: 'Maquiagem',
      desc: 'Longa duração de até 16 horas sem ressecar os lábios com óleo de rosa mosqueta.',
      img: 'img/batom_matte_1791458925028.jpg',
      company_id: storeId,
      company_name: storeName
    },
    {
      id: `${storeId}_p5`,
      name: 'Kit de Pincéis Premium',
      price: 'R$ 114,30',
      oldPrice: 'R$ 129,90',
      discount: '-12%',
      rating: '4,9',
      reviewsCount: 85,
      stock: 14,
      category: 'Acessórios',
      desc: 'Cerdas veganas ultramacias com acabamento em ouro rosé para aplicação impecável.',
      img: 'img/kit_pinceis_1791458940916.jpg',
      company_id: storeId,
      company_name: storeName
    }
  ];

  // Combine custom products with defaults
  const storeProducts = [...customProducts, ...defaultShowcaseProducts];

  // Read active filter tab
  const activeSubTab = sessionStorage.getItem('ann_store_subtab') || 'featured';

  // ── Global Handlers for Owner & Visitor Actions ──
  window.handleToggleFollowStore = () => {
    const res = socialManager.toggleFollowStore(storeId, storeName);
    showToast(res.message, res.success ? (res.isFollowing ? 'success' : 'info') : 'error');
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  window.handleAddToCartStore = (productId) => {
    const p = storeProducts.find(item => item.id === productId);
    if (p) {
      cartManager.addItem(p);
      showToast(`${p.name} adicionado ao carrinho!`, 'success');
      window.dispatchEvent(new CustomEvent('auth-change'));
    }
  };

  window.switchStoreSubTab = (tabName) => {
    sessionStorage.setItem('ann_store_subtab', tabName);
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  // ── Modals Trigger Functions ──
  window.openEditStoreModal = () => {
    const modal = document.getElementById('edit-store-modal');
    if (modal) modal.classList.remove('hidden');
  };

  window.closeEditStoreModal = () => {
    const modal = document.getElementById('edit-store-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.saveStoreInfo = (e) => {
    e.preventDefault();
    const newName = document.getElementById('edit-store-name').value.trim();
    const newDesc = document.getElementById('edit-store-desc').value.trim();
    const newTagline = document.getElementById('edit-store-tagline').value.trim();
    const newPhoto = document.getElementById('edit-store-photo').value.trim();
    const newPhone = document.getElementById('edit-store-phone').value.trim();
    const newAddress = document.getElementById('edit-store-address').value.trim();

    const updated = {
      ...storeInfo,
      name: newName || storeInfo.name,
      desc: newDesc || storeInfo.desc,
      tagline: newTagline || storeInfo.tagline,
      photo: newPhoto || storeInfo.photo,
      phone: newPhone || storeInfo.phone,
      address: newAddress || storeInfo.address,
    };

    localStorage.setItem(`ann_store_${user?.email || 'default'}`, JSON.stringify(updated));
    
    // Also update auth user profile if appropriate
    if (user) {
      user.company_name = updated.name;
      user.company_description = updated.desc;
      user.company_photo = updated.photo;
      user.company_phone = updated.phone;
      user.company_address = updated.address;
      localStorage.setItem('ann_beauty_user', JSON.stringify(user));
    }

    showToast('Loja atualizada com sucesso!', 'success');
    window.closeEditStoreModal();
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  window.openAddProductModal = () => {
    const modal = document.getElementById('add-product-modal');
    if (modal) {
      modal.classList.remove('hidden');
      const nameInput = document.getElementById('prod-name');
      const imgInput = document.getElementById('prod-img');
      const previewImg = document.getElementById('prod-img-preview');
      if (nameInput) {
        nameInput.value = '';
        setTimeout(() => nameInput.focus(), 100);
      }
      if (imgInput) {
        imgInput.value = '';
        imgInput.dataset.autoFilled = 'true';
      }
      if (previewImg) {
        previewImg.src = 'img/serum_facial_1791458880967.jpg';
      }
      const badge = document.getElementById('prod-img-detected-badge');
      if (badge) {
        badge.innerHTML = `<span class="material-symbols-outlined text-[15px] text-[#8B5FBF]">auto_awesome</span> Imagem baseada no nome escrito`;
        badge.className = 'text-[11px] font-bold text-[#8B5FBF] flex items-center gap-1 mb-0.5';
      }
    }
  };

  window.closeAddProductModal = () => {
    const modal = document.getElementById('add-product-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.handleProdNameInput = (nameVal) => {
    const cat = document.getElementById('prod-category')?.value || 'Skincare';
    const detectedImg = getProductImage(nameVal, cat);
    const previewImg = document.getElementById('prod-img-preview');
    const imgInput = document.getElementById('prod-img');
    const badge = document.getElementById('prod-img-detected-badge');
    
    if (detectedImg) {
      if (previewImg) {
        previewImg.src = detectedImg;
      }
      if (imgInput && (!imgInput.value || imgInput.dataset.autoFilled === 'true' || imgInput.value.includes('photo-1556228720-195a672e8a03'))) {
        imgInput.value = detectedImg;
        imgInput.dataset.autoFilled = 'true';
      }
      if (badge) {
        badge.innerHTML = `<span class="material-symbols-outlined text-[15px] text-emerald-600">auto_awesome</span> Imagem definida com base no nome!`;
        badge.className = 'text-[11px] font-bold text-emerald-700 flex items-center gap-1 mb-0.5';
      }
    }
  };

  window.handleProdCategoryChange = (catVal) => {
    const nameVal = document.getElementById('prod-name')?.value || '';
    window.handleProdNameInput(nameVal);
  };

  window.handleEditProdNameInput = (nameVal) => {
    const cat = document.getElementById('edit-p-category')?.value || 'Skincare';
    const detectedImg = getProductImage(nameVal, cat);
    const previewImg = document.getElementById('edit-p-img-preview');
    const imgInput = document.getElementById('edit-p-img');
    if (detectedImg) {
      if (previewImg) previewImg.src = detectedImg;
      if (imgInput && (!imgInput.value || imgInput.dataset.autoFilled === 'true' || imgInput.value.includes('photo-1556228720-195a672e8a03'))) {
        imgInput.value = detectedImg;
        imgInput.dataset.autoFilled = 'true';
      }
    }
  };

  window.handleSelectSuggestedImg = (imgUrl, targetInputId, targetPreviewId) => {
    const input = document.getElementById(targetInputId);
    const preview = document.getElementById(targetPreviewId);
    if (input) {
      input.value = imgUrl;
      input.dataset.autoFilled = 'true';
    }
    if (preview) {
      preview.src = imgUrl;
    }
    showToast('Imagem selecionada! ✨', 'success');
  };

  window.saveNewProduct = (e) => {
    e.preventDefault();
    const name = document.getElementById('prod-name').value.trim();
    const priceNum = document.getElementById('prod-price').value.trim();
    const oldPriceNum = document.getElementById('prod-old-price').value.trim();
    const category = document.getElementById('prod-category').value;
    const stock = parseInt(document.getElementById('prod-stock').value) || 10;
    
    // Auto-detect image based on product name
    let img = document.getElementById('prod-img').value.trim();
    if (!img || img === 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500') {
      img = getProductImage(name, category);
    }
    const desc = document.getElementById('prod-desc').value.trim();

    const newProd = {
      id: `${storeId}_custom_${Date.now()}`,
      name,
      price: `R$ ${parseFloat(priceNum).toFixed(2).replace('.', ',')}`,
      oldPrice: oldPriceNum ? `R$ ${parseFloat(oldPriceNum).toFixed(2).replace('.', ',')}` : '',
      discount: oldPriceNum && parseFloat(oldPriceNum) > parseFloat(priceNum) ? `-${Math.round((1 - parseFloat(priceNum) / parseFloat(oldPriceNum)) * 100)}%` : '',
      rating: '5,0',
      reviewsCount: 1,
      stock,
      category,
      desc,
      img,
      company_id: storeId,
      company_name: storeName
    };

    const currentCustom = JSON.parse(localStorage.getItem(`ann_store_products_${storeId}`)) || [];
    currentCustom.unshift(newProd);
    localStorage.setItem(`ann_store_products_${storeId}`, JSON.stringify(currentCustom));

    showToast(`Produto "${name}" cadastrado com sucesso!`, 'success');
    window.closeAddProductModal();
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  window.openEditProductModal = (productId) => {
    const p = storeProducts.find(item => item.id === productId);
    if (!p) return;

    document.getElementById('edit-p-id').value = p.id;
    document.getElementById('edit-p-name').value = p.name;
    document.getElementById('edit-p-price').value = p.price.replace('R$', '').trim().replace(',', '.');
    document.getElementById('edit-p-old-price').value = p.oldPrice ? p.oldPrice.replace('R$', '').trim().replace(',', '.') : '';
    document.getElementById('edit-p-stock').value = p.stock || 20;
    document.getElementById('edit-p-category').value = p.category || 'Skincare';
    document.getElementById('edit-p-desc').value = p.desc || '';
    
    const detectedImg = p.img || getProductImage(p.name, p.category);
    document.getElementById('edit-p-img').value = detectedImg;
    const previewImg = document.getElementById('edit-p-img-preview');
    if (previewImg) previewImg.src = detectedImg;

    const modal = document.getElementById('edit-product-modal');
    if (modal) modal.classList.remove('hidden');
  };

  window.closeEditProductModal = () => {
    const modal = document.getElementById('edit-product-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.updateProductSubmit = (e) => {
    e.preventDefault();
    const pid = document.getElementById('edit-p-id').value;
    const name = document.getElementById('edit-p-name').value.trim();
    const priceNum = document.getElementById('edit-p-price').value.trim();
    const oldPriceNum = document.getElementById('edit-p-old-price').value.trim();
    const stock = parseInt(document.getElementById('edit-p-stock').value) || 10;
    const category = document.getElementById('edit-p-category').value;
    const desc = document.getElementById('edit-p-desc').value.trim();
    
    let img = document.getElementById('edit-p-img').value.trim();
    if (!img || img.includes('photo-1556228720-195a672e8a03')) {
      img = getProductImage(name, category);
    }

    let currentCustom = JSON.parse(localStorage.getItem(`ann_store_products_${storeId}`)) || [];
    const idx = currentCustom.findIndex(item => item.id === pid);

    const updatedData = {
      name,
      price: `R$ ${parseFloat(priceNum).toFixed(2).replace('.', ',')}`,
      oldPrice: oldPriceNum ? `R$ ${parseFloat(oldPriceNum).toFixed(2).replace('.', ',')}` : '',
      discount: oldPriceNum && parseFloat(oldPriceNum) > parseFloat(priceNum) ? `-${Math.round((1 - parseFloat(priceNum) / parseFloat(oldPriceNum)) * 100)}%` : '',
      stock,
      category,
      desc,
      img
    };

    if (idx > -1) {
      currentCustom[idx] = { ...currentCustom[idx], ...updatedData };
    } else {
      // It was a default item being edited for the first time
      const orig = storeProducts.find(item => item.id === pid);
      if (orig) {
        currentCustom.unshift({ ...orig, ...updatedData });
      }
    }

    localStorage.setItem(`ann_store_products_${storeId}`, JSON.stringify(currentCustom));
    showToast('Produto atualizado com sucesso!', 'success');
    window.closeEditProductModal();
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  window.deleteProduct = (productId) => {
    if (!confirm('Tem certeza que deseja excluir este produto da sua loja?')) return;
    let currentCustom = JSON.parse(localStorage.getItem(`ann_store_products_${storeId}`)) || [];
    currentCustom = currentCustom.filter(p => p.id !== productId);
    localStorage.setItem(`ann_store_products_${storeId}`, JSON.stringify(currentCustom));
    showToast('Produto removido da loja.', 'info');
    window.closeEditProductModal();
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  // Quick Action Modal helpers
  window.openStoreOrdersModal = () => {
    showToast('Painel de pedidos aberto.', 'info');
    window.switchStoreSubTab('orders');
  };

  window.openStoreReviewsModal = () => {
    window.switchStoreSubTab('reviews');
  };

  window.openStoreStatsModal = () => {
    window.switchStoreSubTab('stats');
  };

  window.openStoreSettingsModal = () => {
    window.openEditStoreModal();
  };

  // ── Render Products View ──
  const renderProductCards = () => {
    return storeProducts.map(p => {
      const isSaved = auth.getSavedItems().some(s => s.id === p.id && s.contentType === 'product');
      return `
      <div class="bg-white rounded-[24px] border border-[#DDD0E8] p-3 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative group" style="box-shadow: 0 4px 20px -4px rgba(109, 76, 125, 0.06);">
        
        <!-- Image Area — clicável para ver o produto -->
        <a href="#/product?id=${p.id}" class="relative w-full aspect-square rounded-[20px] overflow-hidden mb-3 bg-[#FFFFFF] flex items-center justify-center block cursor-pointer">
          ${p.discount ? `
            <span class="absolute top-3 left-3 bg-[#8B5FBF] text-white font-bold text-[10px] px-2.5 py-1 rounded-full z-10 shadow-sm" style="font-family:'Inter',sans-serif">
              ${p.discount}
            </span>
          ` : ''}
          
          <img src="${p.img}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </a>

        <!-- Product Details -->
        <div class="flex flex-col flex-grow px-1">
          <!-- Nome clicável -->
          <a href="#/product?id=${p.id}" class="text-xs sm:text-[13px] font-semibold text-[#2D1A40] line-clamp-1 mb-1 hover:text-[#8B5FBF] transition-colors cursor-pointer" style="font-family:'Poppins',sans-serif" title="${p.name}">
            ${p.name}
          </a>

          <!-- Rating -->
          <div class="flex items-center gap-1 text-amber-400 mb-2">
            <span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1">star</span>
            <span class="text-[11px] font-bold text-[#2D1A40]">${p.rating}</span>
            <span class="text-[10px] text-[#5C4D6B]">(${p.reviewsCount})</span>
          </div>

          <!-- Price & Actions -->
          <div class="mt-auto pt-2 border-t border-[#FFFFFF] flex items-center justify-between">
            <div>
              ${p.oldPrice ? `<span class="text-[10px] text-[#5C4D6B] line-through block leading-none mb-0.5">${p.oldPrice}</span>` : ''}
              <span class="text-xs sm:text-sm font-bold text-[#C4A8E0]" style="font-family:'Poppins',sans-serif">${p.price}</span>
            </div>

            <!-- Action Buttons based on OWNER vs VISITOR -->
            <div class="flex items-center gap-1.5">
              <!-- Favorite -->
              <button onclick="event.stopPropagation(); auth.toggleSaveItem({id:'${p.id}', name:'${p.name}', price:'${p.price}', img:'${p.img}'}, 'product'); window.dispatchEvent(new CustomEvent('auth-change'));" class="w-7 h-7 rounded-full border border-[#DDD0E8] flex items-center justify-center text-[#5C4D6B] hover:text-[#C4A8E0] hover:border-[#C4A8E0] transition-colors">
                <span class="material-symbols-outlined text-[15px]" style="font-variation-settings:'FILL' ${isSaved ? 1 : 0}">favorite</span>
              </button>

              ${isOwner ? `
                <!-- EDIT PRODUCT BUTTON (OWNER) -->
                <button onclick="event.stopPropagation(); window.openEditProductModal('${p.id}')" class="px-3 py-1 rounded-full border border-[#8B5FBF] text-[#8B5FBF] hover:bg-[#8B5FBF] hover:text-white transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer">
                  <span class="material-symbols-outlined text-[13px]">edit</span> Editar
                </button>
              ` : `
                <!-- ADD TO CART BUTTON (VISITOR) -->
                <button onclick="event.stopPropagation(); window.handleAddToCartStore('${p.id}')" class="px-3 py-1 rounded-full bg-[#8B5FBF] hover:bg-[#6B3FA0] text-white transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-sm">
                  <span class="material-symbols-outlined text-[13px]">add_shopping_cart</span> Adicionar
                </button>
              `}
            </div>
          </div>
        </div>

      </div>`;
    }).join('');
  };

  return `
  <main class="flex-grow max-w-[1280px] mx-auto px-4 md:px-10 w-full pt-6 pb-24 bg-[#FFFFFF]/40">
    
    <!-- ══════════════════════════════════════════════════
         1. HERO COVER BANNER (Matching Mockup)
    ══════════════════════════════════════════════════ -->
    <div class="relative w-full rounded-[36px] overflow-hidden shadow-lg border border-[#DDD0E8] mb-8 bg-white min-h-[220px] md:min-h-[260px] flex items-center">
      
      <!-- Split Banner Graphic -->
      <div class="absolute inset-0 flex flex-col md:flex-row">
        <!-- Left Banner Image (Cosmetics & Flowers) -->
        <div class="w-full md:w-1/2 h-full relative overflow-hidden">
          <img src="${storeInfo.cover || 'img/hero_skin_spa.jpg'}" alt="Cover" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='img/hero_skin_spa.jpg';">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/40 to-[#FFFFFF]"></div>
        </div>
        
        <!-- Right Banner Text Area -->
        <div class="w-full md:w-1/2 h-full bg-[#FFFFFF] flex flex-col justify-center px-6 md:px-12 py-8 text-center md:text-right">
          <div class="inline-flex items-center gap-1 text-[#C4A8E0] md:ml-auto justify-center mb-1">
            <span class="text-sm font-semibold italic">Realce sua beleza,</span>
            <span class="text-sm">✦</span>
          </div>
          <h2 class="font-serif italic text-2xl md:text-3xl font-bold text-[#8B5FBF] mb-2" style="font-family:'Poppins',serif">
            expresse quem você é.
          </h2>
          <p class="text-xs md:text-sm text-[#5C4D6B] font-medium max-w-md md:ml-auto leading-relaxed">
            ${storeInfo.bannerText || 'Produtos selecionados com amor para você brilhar todos os dias.'}
          </p>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════
         2. STORE PROFILE HEADER (Logo, Stats & Action Buttons)
    ══════════════════════════════════════════════════ -->
    <div class="bg-white rounded-[32px] p-6 sm:p-8 border border-[#DDD0E8] shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
      
      <!-- Left: Logo & Details -->
      <div class="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
        
        <!-- Circular Logo -->
        <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#FFFFFF] shadow-md bg-white overflow-hidden shrink-0 flex items-center justify-center relative p-1">
          <img src="${storePhoto}" alt="${storeName}" class="w-full h-full object-cover rounded-full" onerror="this.onerror=null;this.src='img/logo.png';">
        </div>

        <!-- Store Meta -->
        <div>
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
            <h1 class="text-2xl sm:text-3xl font-bold text-[#2D1A40] tracking-tight" style="font-family:'Poppins',sans-serif">
              ${storeName}
            </h1>
            <span class="bg-[#FFFFFF] text-[#C4A8E0] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#DDD0E8]">
              ${storeInfo.badge || 'LOJA OFICIAL'}
            </span>
          </div>

          <p class="text-xs text-[#5C4D6B] max-w-xl mb-3 leading-relaxed">
            ${storeDesc}
          </p>

          <!-- Badges / Metrics Row -->
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-5 text-xs font-semibold text-[#2D1A40]">
            <div class="flex items-center gap-1 text-amber-500">
              <span class="material-symbols-outlined text-[16px]" style="font-variation-settings:'FILL' 1">star</span>
              <span>${storeInfo.rating || '4,9'}</span>
              <span class="text-[#5C4D6B] text-[11px]">(${storeInfo.reviews || 340} avaliações)</span>
            </div>

            <div class="flex items-center gap-1 text-[#5C4D6B]">
              <span class="material-symbols-outlined text-[16px] text-[#C4A8E0]">favorite</span>
              <span>${followersCount} Seguidores</span>
            </div>

            <div class="flex items-center gap-1 text-[#5C4D6B]">
              <span class="material-symbols-outlined text-[16px] text-[#8B5FBF]">inventory_2</span>
              <span>${storeProducts.length} Produtos</span>
            </div>

            <div class="flex items-center gap-1 text-emerald-600">
              <span class="material-symbols-outlined text-[16px]">verified</span>
              <span>${storeInfo.delivery || '99,4%'} Entregas no prazo</span>
            </div>

            <div class="flex items-center gap-1 text-[#8B5FBF]">
              <span class="material-symbols-outlined text-[16px]">schedule</span>
              <span class="font-bold">Seg a Qua 09:30-18:00 • Qui e Sex 09:30-18:30 • Sáb 09:30-17:00</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Action Buttons (OWNER vs VISITOR) -->
      <div class="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#FFFFFF]">
        ${isOwner ? `
          <!-- OWNER BUTTONS -->
          <button onclick="window.openEditStoreModal()" class="px-5 py-2.5 rounded-full border border-[#8B5FBF] text-[#8B5FBF] hover:bg-[#8B5FBF]/5 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">settings</span> Editar Loja
          </button>

          <button onclick="window.openAddProductModal()" class="px-5 py-2.5 rounded-full bg-[#8B5FBF] hover:bg-[#6B3FA0] text-white shadow-md shadow-[#8B5FBF]/30 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">add</span> Adicionar Produto
          </button>
        ` : `
          <!-- VISITOR BUTTONS -->
          <button onclick="window.handleToggleFollowStore()" class="${isFollowing ? 'px-6 py-2.5 rounded-full bg-[#FFFFFF] text-[#8B5FBF] border border-[#8B5FBF]/30 font-bold text-xs flex items-center gap-2' : 'px-6 py-2.5 rounded-full bg-[#8B5FBF] text-white font-bold text-xs flex items-center gap-2 shadow-md'} transition-all cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">${isFollowing ? 'check' : 'add'}</span> ${isFollowing ? 'Seguindo' : 'Seguir Loja'}
          </button>

          <button onclick="window.openSellerChatModal('${storeId}', '${storeName}', '${storePhoto}', { type: 'store', storeId: '${storeId}', storeName: '${storeName.replace(/'/g, "\\'")}' })" class="px-5 py-2.5 rounded-full bg-white border border-[#DDD0E8] text-[#2D1A40] hover:bg-[#FFFFFF] font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm">
            <span class="material-symbols-outlined text-[16px] text-[#8B5FBF]">chat</span> Conversar com Vendedor
          </button>
        `}
      </div>

    </div>

    <!-- ══════════════════════════════════════════════════
         3. "GERENCIE SUA LOJA" BAR (ONLY VISIBLE TO OWNER)
    ══════════════════════════════════════════════════ -->
    ${isOwner ? `
    <section class="bg-white rounded-[32px] p-6 sm:p-7 border border-[#DDD0E8] shadow-sm mb-8 animate-in fade-in duration-300">
      <h2 class="text-sm font-bold text-[#2D1A40] mb-4" style="font-family:'Poppins',sans-serif">
        Gerencie sua loja
      </h2>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <!-- 1. Produtos -->
        <button onclick="window.switchStoreSubTab('featured')" class="p-4 rounded-[20px] bg-[#F8F4FB] hover:bg-[#FFFFFF] border border-[#DDD0E8]/60 flex flex-col items-start text-left transition-all group cursor-pointer">
          <div class="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#8B5FBF] shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-[18px]">shopping_bag</span>
          </div>
          <span class="text-xs font-bold text-[#2D1A40] mb-0.5">Produtos</span>
          <span class="text-[10px] text-[#5C4D6B]">Ver e editar produtos</span>
        </button>

        <!-- 2. Pedidos -->
        <button onclick="window.openStoreOrdersModal()" class="p-4 rounded-[20px] bg-[#F8F4FB] hover:bg-[#FFFFFF] border border-[#DDD0E8]/60 flex flex-col items-start text-left transition-all group cursor-pointer">
          <div class="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#8B5FBF] shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-[18px]">receipt_long</span>
          </div>
          <span class="text-xs font-bold text-[#2D1A40] mb-0.5">Pedidos</span>
          <span class="text-[10px] text-[#5C4D6B]">Gerenciar pedidos</span>
        </button>

        <!-- 3. Avaliações -->
        <button onclick="window.openStoreReviewsModal()" class="p-4 rounded-[20px] bg-[#F8F4FB] hover:bg-[#FFFFFF] border border-[#DDD0E8]/60 flex flex-col items-start text-left transition-all group cursor-pointer">
          <div class="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#8B5FBF] shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-[18px]">star</span>
          </div>
          <span class="text-xs font-bold text-[#2D1A40] mb-0.5">Avaliações</span>
          <span class="text-[10px] text-[#5C4D6B]">Ver avaliações da loja</span>
        </button>

        <!-- 4. Estatísticas -->
        <button onclick="window.openStoreStatsModal()" class="p-4 rounded-[20px] bg-[#F8F4FB] hover:bg-[#FFFFFF] border border-[#DDD0E8]/60 flex flex-col items-start text-left transition-all group cursor-pointer">
          <div class="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#8B5FBF] shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-[18px]">bar_chart</span>
          </div>
          <span class="text-xs font-bold text-[#2D1A40] mb-0.5">Estatísticas</span>
          <span class="text-[10px] text-[#5C4D6B]">Acompanhe suas vendas</span>
        </button>

        <!-- 5. Seguidores -->
        <button onclick="window.openStoreReviewsModal()" class="p-4 rounded-[20px] bg-[#F8F4FB] hover:bg-[#FFFFFF] border border-[#DDD0E8]/60 flex flex-col items-start text-left transition-all group cursor-pointer">
          <div class="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#8B5FBF] shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-[18px]">group</span>
          </div>
          <span class="text-xs font-bold text-[#2D1A40] mb-0.5">Seguidores</span>
          <span class="text-[10px] text-[#5C4D6B]">Ver seus seguidores</span>
        </button>

        <!-- 6. Configurações -->
        <button onclick="window.openStoreSettingsModal()" class="p-4 rounded-[20px] bg-[#F8F4FB] hover:bg-[#FFFFFF] border border-[#DDD0E8]/60 flex flex-col items-start text-left transition-all group cursor-pointer">
          <div class="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#8B5FBF] shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-[18px]">settings</span>
          </div>
          <span class="text-xs font-bold text-[#2D1A40] mb-0.5">Configurações</span>
          <span class="text-[10px] text-[#5C4D6B]">Configurar sua loja</span>
        </button>

      </div>
    </section>
    ` : ''}

    <!-- ══════════════════════════════════════════════════
         4. STORE TABS & FILTER BAR
    ══════════════════════════════════════════════════ -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#DDD0E8] pb-4 mb-6">
      
      <!-- Sub-tabs -->
      <div class="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold">
        <button onclick="window.switchStoreSubTab('featured')" class="pb-1 transition-all ${activeSubTab === 'featured' ? 'text-[#8B5FBF] font-bold border-b-2 border-[#8B5FBF]' : 'text-[#5C4D6B] hover:text-[#8B5FBF]'}">
          Produtos em Destaque
        </button>
        <button onclick="window.switchStoreSubTab('all')" class="pb-1 transition-all ${activeSubTab === 'all' ? 'text-[#8B5FBF] font-bold border-b-2 border-[#8B5FBF]' : 'text-[#5C4D6B] hover:text-[#8B5FBF]'}">
          Todos os Produtos
        </button>
        <button onclick="window.switchStoreSubTab('releases')" class="pb-1 transition-all ${activeSubTab === 'releases' ? 'text-[#8B5FBF] font-bold border-b-2 border-[#8B5FBF]' : 'text-[#5C4D6B] hover:text-[#8B5FBF]'}">
          Lançamentos
        </button>
        <button onclick="window.switchStoreSubTab('bestsellers')" class="pb-1 transition-all ${activeSubTab === 'bestsellers' ? 'text-[#8B5FBF] font-bold border-b-2 border-[#8B5FBF]' : 'text-[#5C4D6B] hover:text-[#8B5FBF]'}">
          Mais Vendidos
        </button>
        <button onclick="window.switchStoreSubTab('about')" class="pb-1 transition-all ${activeSubTab === 'about' ? 'text-[#8B5FBF] font-bold border-b-2 border-[#8B5FBF]' : 'text-[#5C4D6B] hover:text-[#8B5FBF]'}">
          Sobre a Loja
        </button>
      </div>

      <!-- Filter Dropdown -->
      <div class="flex items-center gap-2 text-xs text-[#5C4D6B] ml-auto">
        <select class="bg-white border border-[#DDD0E8] rounded-full px-3 py-1.5 text-xs text-[#2D1A40] font-medium outline-none focus:border-[#8B5FBF]">
          <option>Mais recentes</option>
          <option>Menor preço</option>
          <option>Maior preço</option>
          <option>Mais populares</option>
        </select>
      </div>

    </div>

    <!-- ══════════════════════════════════════════════════
         5. TAB CONTENT
    ══════════════════════════════════════════════════ -->
    ${activeSubTab === 'about' ? `
      <!-- About Section -->
      <div class="bg-white rounded-[32px] p-8 border border-[#DDD0E8] shadow-sm max-w-3xl space-y-6">
        <div>
          <h3 class="text-lg font-bold text-[#2D1A40] mb-2" style="font-family:'Poppins',sans-serif">Nossa História & Essência</h3>
          <p class="text-xs sm:text-sm text-[#5C4D6B] leading-relaxed">${storeDesc}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#FFFFFF]">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-[#8B5FBF] text-2xl">call</span>
            <div>
              <span class="text-[10px] text-[#5C4D6B] uppercase font-bold block">Telefone de Contato</span>
              <span class="text-xs font-bold text-[#2D1A40]">${storeInfo.phone || '(11) 99999-0001'}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-[#8B5FBF] text-2xl">location_on</span>
            <div>
              <span class="text-[10px] text-[#5C4D6B] uppercase font-bold block">Localização / Sede</span>
              <span class="text-xs font-bold text-[#2D1A40]">${storeInfo.address || 'São Paulo - SP'}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-[#8B5FBF] text-2xl">schedule</span>
            <div>
              <span class="text-[10px] text-[#5C4D6B] uppercase font-bold block">Horário de Funcionamento</span>
              <span class="text-[11px] font-bold text-[#2D1A40] block">Seg a Qua: 09:30 às 18:00</span>
              <span class="text-[11px] font-bold text-[#2D1A40] block">Qui e Sex: 09:30 às 18:30</span>
              <span class="text-[11px] font-bold text-[#2D1A40] block">Sábados: 09:30 às 17:00</span>
            </div>
          </div>
        </div>
      </div>
    ` : activeSubTab === 'orders' && isOwner ? `
      <!-- Orders Section for Owner -->
      <div class="space-y-4 max-w-4xl">
        <h3 class="text-base font-bold text-[#2D1A40]">Pedidos da Sua Loja</h3>
        <div class="bg-white p-6 rounded-[28px] border border-[#DDD0E8] shadow-sm text-center py-12">
          <span class="material-symbols-outlined text-4xl text-[#C4A8E0] mb-2">inventory_2</span>
          <p class="text-xs font-bold text-[#2D1A40]">Todos os seus pedidos estão em dia!</p>
          <p class="text-[11px] text-[#5C4D6B] mt-1">Novos pedidos feitos por clientes aparecerão listados aqui para despacho imediato.</p>
        </div>
      </div>
    ` : activeSubTab === 'stats' && isOwner ? `
      <!-- Stats View for Owner -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
        <div class="bg-white p-6 rounded-[28px] border border-[#DDD0E8] shadow-sm">
          <span class="text-[11px] text-[#5C4D6B] font-bold uppercase block mb-1">Faturamento Mensal</span>
          <span class="text-2xl font-bold text-[#8B5FBF]" style="font-family:'Poppins',sans-serif">R$ 4.890,00</span>
          <span class="text-[10px] text-emerald-600 font-bold block mt-1">↑ +18% este mês</span>
        </div>
        <div class="bg-white p-6 rounded-[28px] border border-[#DDD0E8] shadow-sm">
          <span class="text-[11px] text-[#5C4D6B] font-bold uppercase block mb-1">Visitas na Loja</span>
          <span class="text-2xl font-bold text-[#2D1A40]" style="font-family:'Poppins',sans-serif">1.420</span>
          <span class="text-[10px] text-emerald-600 font-bold block mt-1">↑ +320 novas clientes</span>
        </div>
        <div class="bg-white p-6 rounded-[28px] border border-[#DDD0E8] shadow-sm">
          <span class="text-[11px] text-[#5C4D6B] font-bold uppercase block mb-1">Avaliação Geral</span>
          <span class="text-2xl font-bold text-amber-500" style="font-family:'Poppins',sans-serif">★ 4.9</span>
          <span class="text-[10px] text-[#5C4D6B] font-bold block mt-1">Baseado em 340 reviews</span>
        </div>
      </div>
    ` : `
      <!-- Products Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        ${renderProductCards()}
      </div>
    `}

    <!-- ══════════════════════════════════════════════════
         MODAL 1: EDIT STORE (OWNER)
    ══════════════════════════════════════════════════ -->
    <div id="edit-store-modal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div class="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DDD0E8] relative max-h-[90vh] overflow-y-auto subtle-scroll animate-in zoom-in-95 duration-200">
        <button onclick="window.closeEditStoreModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F8F4FB] text-[#5C4D6B] hover:text-[#2D1A40] flex items-center justify-center">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>

        <h2 class="text-xl font-bold text-[#8B5FBF] mb-1" style="font-family:'Poppins',sans-serif">Editar Informações da Loja</h2>
        <p class="text-xs text-[#5C4D6B] mb-5">Personalize nome, identidade visual e dados de atendimento.</p>

        <form onsubmit="window.saveStoreInfo(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#2D1A40] mb-1">Nome da Loja</label>
            <input type="text" id="edit-store-name" value="${storeName}" required class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs sm:text-sm outline-none focus:border-[#8B5FBF]">
          </div>

          <div>
            <label class="block text-xs font-bold text-[#2D1A40] mb-1">Frase de Destaque (Tagline)</label>
            <input type="text" id="edit-store-tagline" value="${storeInfo.tagline || ''}" class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs sm:text-sm outline-none focus:border-[#8B5FBF]">
          </div>

          <div>
            <label class="block text-xs font-bold text-[#2D1A40] mb-1">Descrição da Loja</label>
            <textarea id="edit-store-desc" rows="3" class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs sm:text-sm outline-none focus:border-[#8B5FBF]">${storeDesc}</textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#2D1A40] mb-1">URL da Logo / Foto</label>
            <input type="url" id="edit-store-photo" value="${storePhoto}" class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs outline-none focus:border-[#8B5FBF]">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-[#2D1A40] mb-1">Telefone / WhatsApp</label>
              <input type="text" id="edit-store-phone" value="${storeInfo.phone || ''}" class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs outline-none focus:border-[#8B5FBF]">
            </div>
            <div>
              <label class="block text-xs font-bold text-[#2D1A40] mb-1">Endereço da Sede</label>
              <input type="text" id="edit-store-address" value="${storeInfo.address || ''}" class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs outline-none focus:border-[#8B5FBF]">
            </div>
          </div>

          <div class="pt-4 flex gap-3">
            <button type="submit" class="flex-1 py-3.5 rounded-full bg-[#8B5FBF] hover:bg-[#6B3FA0] text-white font-bold text-xs shadow-md">Salvar Alterações</button>
            <button type="button" onclick="window.closeEditStoreModal()" class="px-5 py-3.5 rounded-full border border-[#DDD0E8] text-[#5C4D6B] font-bold text-xs hover:bg-[#F8F4FB]">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════
         MODAL 2: ADD PRODUCT (OWNER)
    ══════════════════════════════════════════════════ -->
    <div id="add-product-modal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div class="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DDD0E8] relative max-h-[90vh] overflow-y-auto subtle-scroll animate-in zoom-in-95 duration-200">
        <button onclick="window.closeAddProductModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F8F4FB] text-[#5C4D6B] hover:text-[#2D1A40] flex items-center justify-center">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>

        <h2 class="text-xl font-bold text-[#8B5FBF] mb-1" style="font-family:'Poppins',sans-serif">Adicionar Novo Produto</h2>
        <p class="text-xs text-[#5C4D6B] mb-5">Publique um cosmético ou acessório para vender na sua loja.</p>

        <form onsubmit="window.saveNewProduct(event)" class="space-y-3.5">
          <div>
            <label class="block text-xs font-bold text-[#2D1A40] mb-1">Nome do Produto *</label>
            <input 
              type="text" 
              id="prod-name" 
              placeholder="Ex: Batom Matte, Sérum Facial, Base Fluida, Paleta de Sombras..." 
              required 
              autocomplete="off"
              oninput="window.handleProdNameInput(this.value)"
              class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs sm:text-sm outline-none focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/20 transition-all font-medium">
          </div>

          <!-- Preview da Imagem Selecionada com Base no Nome -->
          <div class="p-3.5 bg-gradient-to-r from-purple-50/80 to-pink-50/50 rounded-2xl border border-purple-100 flex items-center gap-3.5 shadow-2xs">
            <div class="w-16 h-16 rounded-xl bg-white border border-[#DDD0E8] overflow-hidden flex items-center justify-center shrink-0 shadow-xs relative">
              <img id="prod-img-preview" src="img/serum_facial_1791458880967.jpg" alt="Preview da Imagem" class="w-full h-full object-contain p-1" onerror="this.src='img/serum_facial_1791458880967.jpg'">
            </div>
            <div class="flex-grow min-w-0">
              <div id="prod-img-detected-badge" class="text-[11px] font-bold text-[#8B5FBF] flex items-center gap-1 mb-0.5">
                <span class="material-symbols-outlined text-[15px] text-[#8B5FBF]">auto_awesome</span> Imagem baseada no nome escrito
              </div>
              <p class="text-[11px] text-[#5C4D6B] leading-tight">Ao digitar o nome do produto, a imagem correspondente é definida automaticamente.</p>
              <div class="flex flex-wrap gap-1 mt-1.5">
                <button type="button" onclick="window.handleSelectSuggestedImg('img/batom_matte_1791458925028.jpg', 'prod-img', 'prod-img-preview')" class="text-[10px] px-2 py-0.5 rounded-full bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 font-medium transition-colors cursor-pointer">💄 Batom</button>
                <button type="button" onclick="window.handleSelectSuggestedImg('img/serum_facial_1791458880967.jpg', 'prod-img', 'prod-img-preview')" class="text-[10px] px-2 py-0.5 rounded-full bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 font-medium transition-colors cursor-pointer">✨ Sérum</button>
                <button type="button" onclick="window.handleSelectSuggestedImg('img/base_fluida_1791458954927.jpg', 'prod-img', 'prod-img-preview')" class="text-[10px] px-2 py-0.5 rounded-full bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 font-medium transition-colors cursor-pointer">🧴 Base</button>
                <button type="button" onclick="window.handleSelectSuggestedImg('img/paleta_sombras_1791458911527.jpg', 'prod-img', 'prod-img-preview')" class="text-[10px] px-2 py-0.5 rounded-full bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 font-medium transition-colors cursor-pointer">🎨 Paleta</button>
                <button type="button" onclick="window.handleSelectSuggestedImg('img/kit_pinceis_1791458940916.jpg', 'prod-img', 'prod-img-preview')" class="text-[10px] px-2 py-0.5 rounded-full bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 font-medium transition-colors cursor-pointer">🖌️ Pincéis</button>
                <button type="button" onclick="window.handleSelectSuggestedImg('img/hidratante_corporal.jpg', 'prod-img', 'prod-img-preview')" class="text-[10px] px-2 py-0.5 rounded-full bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 font-medium transition-colors cursor-pointer">🌸 Hidratante</button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-[#2D1A40] mb-1">Preço Atual (R$) *</label>
              <input type="number" step="0.01" id="prod-price" placeholder="49.90" required class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs outline-none focus:border-[#8B5FBF]">
            </div>
            <div>
              <label class="block text-xs font-bold text-[#2D1A40] mb-1">Preço Antigo (Opcional)</label>
              <input type="number" step="0.01" id="prod-old-price" placeholder="69.90" class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs outline-none focus:border-[#8B5FBF]">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-[#2D1A40] mb-1">Categoria *</label>
              <select id="prod-category" onchange="window.handleProdCategoryChange(this.value)" class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs outline-none focus:border-[#8B5FBF]">
                <option value="Skincare">Skincare</option>
                <option value="Maquiagem">Maquiagem</option>
                <option value="Corpo & Banho">Corpo & Banho</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Perfumaria">Perfumaria</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-[#2D1A40] mb-1">Estoque Inicial</label>
              <input type="number" id="prod-stock" value="25" class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs outline-none focus:border-[#8B5FBF]">
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold text-[#2D1A40]">URL da Imagem do Produto</label>
              <span class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Automático</span>
            </div>
            <input type="url" id="prod-img" placeholder="Preenchida automaticamente pelo nome..." class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs outline-none focus:border-[#8B5FBF]">
          </div>

          <div>
            <label class="block text-xs font-bold text-[#2D1A40] mb-1">Descrição</label>
            <textarea id="prod-desc" rows="2" placeholder="Descreva os benefícios, fórmula e modo de uso..." class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs outline-none focus:border-[#8B5FBF]"></textarea>
          </div>

          <div class="pt-3 flex gap-3">
            <button type="submit" class="flex-1 py-3.5 rounded-full bg-[#8B5FBF] hover:bg-[#6B3FA0] text-white font-bold text-xs shadow-md">Publicar Produto</button>
            <button type="button" onclick="window.closeAddProductModal()" class="px-5 py-3.5 rounded-full border border-[#DDD0E8] text-[#5C4D6B] font-bold text-xs hover:bg-[#F8F4FB]">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════
         MODAL 3: EDIT EXISTING PRODUCT (OWNER)
    ══════════════════════════════════════════════════ -->
    <div id="edit-product-modal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div class="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DDD0E8] relative max-h-[90vh] overflow-y-auto subtle-scroll animate-in zoom-in-95 duration-200">
        <button onclick="window.closeEditProductModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F8F4FB] text-[#5C4D6B] hover:text-[#2D1A40] flex items-center justify-center">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>

        <h2 class="text-xl font-bold text-[#8B5FBF] mb-1" style="font-family:'Poppins',sans-serif">Editar Produto</h2>
        <p class="text-xs text-[#5C4D6B] mb-5">Altere preços, estoque, informações ou remova o produto.</p>

        <form onsubmit="window.updateProductSubmit(event)" class="space-y-3.5">
          <input type="hidden" id="edit-p-id">
          
          <div>
            <label class="block text-xs font-bold text-[#2D1A40] mb-1">Nome do Produto</label>
            <input 
              type="text" 
              id="edit-p-name" 
              required 
              autocomplete="off"
              oninput="window.handleEditProdNameInput(this.value)"
              class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs sm:text-sm outline-none focus:border-[#8B5FBF]">
          </div>

          <!-- Preview da Imagem no Editar com Base no Nome -->
          <div class="p-3 bg-[#F8F4FB] rounded-2xl border border-[#DDD0E8] flex items-center gap-3">
            <div class="w-14 h-14 rounded-xl bg-white border border-[#DDD0E8] overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
              <img id="edit-p-img-preview" src="img/serum_facial_1791458880967.jpg" alt="Preview da Imagem" class="w-full h-full object-contain p-1" onerror="this.src='img/serum_facial_1791458880967.jpg'">
            </div>
            <div class="flex-grow min-w-0">
              <p class="text-[11px] font-bold text-[#8B5FBF] flex items-center gap-1 mb-0.5">
                <span class="material-symbols-outlined text-[14px]">auto_awesome</span> Atualização da imagem com base no nome
              </p>
              <button type="button" onclick="const n = document.getElementById('edit-p-name').value; const c = document.getElementById('edit-p-category').value; const img = window.getProductImage(n, c); document.getElementById('edit-p-img').value = img; document.getElementById('edit-p-img-preview').src = img; showToast('Imagem atualizada com base no nome!', 'success');" class="text-[10px] text-primary hover:underline font-bold cursor-pointer">
                Aplicar imagem correspondente ao nome agora
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-[#2D1A40] mb-1">Preço Atual (R$)</label>
              <input type="number" step="0.01" id="edit-p-price" required class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs outline-none focus:border-[#8B5FBF]">
            </div>
            <div>
              <label class="block text-xs font-bold text-[#2D1A40] mb-1">Preço Antigo (R$)</label>
              <input type="number" step="0.01" id="edit-p-old-price" class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs outline-none focus:border-[#8B5FBF]">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-[#2D1A40] mb-1">Categoria</label>
              <select id="edit-p-category" class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs outline-none focus:border-[#8B5FBF]">
                <option value="Skincare">Skincare</option>
                <option value="Maquiagem">Maquiagem</option>
                <option value="Corpo & Banho">Corpo & Banho</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Perfumaria">Perfumaria</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-[#2D1A40] mb-1">Estoque</label>
              <input type="number" id="edit-p-stock" class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs outline-none focus:border-[#8B5FBF]">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#2D1A40] mb-1">URL da Imagem</label>
            <input type="url" id="edit-p-img" class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs outline-none focus:border-[#8B5FBF]">
          </div>

          <div>
            <label class="block text-xs font-bold text-[#2D1A40] mb-1">Descrição</label>
            <textarea id="edit-p-desc" rows="2" class="w-full bg-[#F8F4FB] px-4 py-3 rounded-2xl border border-[#DDD0E8] text-xs outline-none focus:border-[#8B5FBF]"></textarea>
          </div>

          <div class="pt-3 flex items-center justify-between gap-3">
            <button type="button" onclick="window.deleteProduct(document.getElementById('edit-p-id').value)" class="px-4 py-3.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs flex items-center gap-1">
              <span class="material-symbols-outlined text-[15px]">delete</span> Excluir
            </button>
            <div class="flex gap-2">
              <button type="button" onclick="window.closeEditProductModal()" class="px-4 py-3.5 rounded-full border border-[#DDD0E8] text-[#5C4D6B] font-bold text-xs hover:bg-[#F8F4FB]">Cancelar</button>
              <button type="submit" class="px-5 py-3.5 rounded-full bg-[#8B5FBF] hover:bg-[#6B3FA0] text-white font-bold text-xs shadow-md">Salvar</button>
            </div>
          </div>
        </form>
      </div>
    </div>

  </main>`;
}

export function mount() {}
