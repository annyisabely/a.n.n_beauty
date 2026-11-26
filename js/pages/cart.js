import { cartManager } from '../cart_manager.js';
import { showToast } from '../components.js';
import { getProductImage } from '../data_manager.js';

export default function cartPage() {
  const cart = cartManager.getCart();
  const selectedCount = cartManager.getSelectedItemCount();
  const allSelected = cart.length > 0 && cart.every(item => item.selected);
  const subtotal = cartManager.getSubtotal();
  const coupon = cartManager.getActiveCoupon();
  const discount = cartManager.getDiscount(subtotal);
  const shippingData = JSON.parse(sessionStorage.getItem('ann_cart_shipping') || 'null');
  
  // Frete grátis automático acima de R$ 199
  const isFreeShipping = subtotal >= 199;
  const shippingValue = shippingData ? (isFreeShipping ? 0 : shippingData.valor) : 0;
  const totalSavings = discount + (subtotal * 0.15); // Total economizado demonstrativo
  const total = Math.max(0, subtotal - discount + shippingValue);
  const installments = total > 0 ? (total / 6).toFixed(2).replace('.', ',') : '0,00';
  const freeShippingPercent = Math.min(100, (subtotal / 199) * 100);

  // ── Global handlers ──
  window.removeFromCart = (name) => {
    cartManager.removeItem(name);
    showToast('Item removido da sacola', 'info');
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  window.updateQty = (name, delta) => {
    cartManager.updateQuantity(name, delta);
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  window.toggleSelect = (name) => {
    cartManager.toggleSelect(name);
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  window.toggleSelectAll = () => {
    cartManager.toggleSelectAll(!allSelected);
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  window.moveToFavorites = (name) => {
    const result = cartManager.moveToFavorites(name);
    if (result) {
      showToast('Salvo na sua Lista de Desejos ❤️', 'success');
    }
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  window.applyQuickCoupon = (code) => {
    const coupon = cartManager.applyCoupon(code);
    if (coupon) {
      showToast(`🎉 Cupom "${code}" aplicado com sucesso!`, 'success');
      window.dispatchEvent(new CustomEvent('auth-change'));
    }
  };

  function resolveCartImg(item) {
    if (!item.img) return getProductImage(item.name, item.category);
    if (item.img.startsWith('http://') || item.img.startsWith('https://') || item.img.startsWith('img/') || item.img.startsWith('../') || item.img.startsWith('/')) {
      return item.img;
    }
    return 'https://lh3.googleusercontent.com/aida-public/' + item.img;
  }

  // Agrupar itens por loja/vendedor
  const groupedByStore = {};
  cart.forEach(item => {
    const store = item.company_name || 'A.n.n Beauty';
    if (!groupedByStore[store]) groupedByStore[store] = [];
    groupedByStore[store].push(item);
  });

  return `
  <div class="min-h-screen" style="background: linear-gradient(135deg, #F8F4FB 0%, #EDE4F5 50%, #F3EDF8 100%);">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

      <!-- ═══════════════════════════════════════════════ -->
      <!-- HEADER: Título da Página                       -->
      <!-- ═══════════════════════════════════════════════ -->
      <div class="text-center mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-[#2D1A40] flex items-center justify-center gap-3">
          <span class="material-symbols-outlined text-[#8B5FBF] text-3xl sm:text-4xl" style="font-variation-settings: 'FILL' 1;">shopping_bag</span>
          Meu Carrinho
        </h1>
        <p class="text-sm text-[#5C4D6B] mt-1">${cart.length > 0 ? `${cart.length} ${cart.length === 1 ? 'item' : 'itens'} na sua sacola de compras` : 'Sua sacola está vazia'}</p>
      </div>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- ETAPAS DO PEDIDO — Stepper Premium              -->
      <!-- ═══════════════════════════════════════════════ -->
      <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5 sm:p-6 mb-8">
        <div class="flex items-center justify-center gap-0 sm:gap-2 max-w-lg mx-auto">
          <!-- Step 1 (Ativo) -->
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg" style="background: linear-gradient(135deg, #8B5FBF, #6B3FA0);">
              <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">shopping_cart</span>
            </div>
            <span class="font-bold text-xs sm:text-sm text-[#2D1A40] hidden sm:block">Sacola</span>
          </div>
          <div class="flex-1 max-w-[80px] sm:max-w-[100px] h-[3px] rounded-full mx-2" style="background: linear-gradient(90deg, #8B5FBF, #DDD0E8);"></div>
          <!-- Step 2 -->
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E8D8F4] flex items-center justify-center text-[#8B5FBF] font-bold text-sm border-2 border-[#DDD0E8]">
              <span class="material-symbols-outlined text-[18px]">checklist</span>
            </div>
            <span class="font-semibold text-xs sm:text-sm text-[#8E7C9E] hidden sm:block">Confirmar</span>
          </div>
          <div class="flex-1 max-w-[80px] sm:max-w-[100px] h-[3px] rounded-full bg-[#E8D8F4] mx-2"></div>
          <!-- Step 3 -->
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E8D8F4] flex items-center justify-center text-[#8B5FBF] font-bold text-sm border-2 border-[#DDD0E8]">
              <span class="material-symbols-outlined text-[18px]">payments</span>
            </div>
            <span class="font-semibold text-xs sm:text-sm text-[#8E7C9E] hidden sm:block">Pagamento</span>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- BANNER FRETE GRÁTIS                             -->
      <!-- ═══════════════════════════════════════════════ -->
      ${cart.length > 0 ? `
      <div class="rounded-2xl p-4 sm:p-5 mb-8 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden" style="background: linear-gradient(135deg, #2D1A40 0%, #4A2870 50%, #6B3FA0 100%);">
        <div class="absolute inset-0 opacity-10" style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22><circle cx=%2240%22 cy=%2240%22 r=%2220%22 fill=%22none%22 stroke=%22white%22 stroke-width=%220.5%22/></svg>'); background-size: 80px;"></div>
        <div class="flex items-center gap-3 relative z-10">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style="background: linear-gradient(135deg, #F59E0B, #FBBF24);">
            <span class="material-symbols-outlined text-white text-xl sm:text-2xl" style="font-variation-settings: 'FILL' 1;">${isFreeShipping ? 'local_shipping' : 'rocket_launch'}</span>
          </div>
          <div class="text-white">
            <p class="text-xs sm:text-sm font-bold leading-tight">
              ${subtotal >= 199 
                ? '🎉 PARABÉNS! FRETE GRÁTIS PARA TODO O BRASIL!' 
                : `⚡ Falta apenas R$ ${(199 - subtotal).toFixed(2).replace('.', ',')} para FRETE GRÁTIS!`
              }
            </p>
            <p class="text-[11px] text-white/60 mt-0.5">Entrega garantida • Devolução em até 7 dias úteis</p>
          </div>
        </div>
        <div class="w-full sm:w-56 relative z-10">
          <div class="flex justify-between text-[10px] text-white/70 mb-1.5 font-semibold">
            <span>R$ ${subtotal.toFixed(0)}</span>
            <span>R$ 199</span>
          </div>
          <div class="w-full bg-white/20 h-2.5 rounded-full overflow-hidden border border-white/20">
            <div class="h-full rounded-full transition-all duration-700 ease-out relative" style="width: ${freeShippingPercent}%; background: linear-gradient(90deg, #F59E0B, #34D399);">
              ${isFreeShipping ? '<div class="absolute inset-0 animate-pulse bg-white/30 rounded-full"></div>' : ''}
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- ═══════════════════════════════════════════════ -->
      <!-- GRID PRINCIPAL: Itens + Resumo                  -->
      <!-- ═══════════════════════════════════════════════ -->
      <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

        <!-- ─────────────────────────────────────────── -->
        <!-- COLUNA ESQUERDA: Itens do Carrinho           -->
        <!-- ─────────────────────────────────────────── -->
        <div class="w-full lg:w-[62%] flex flex-col gap-5">

          ${cart.length > 0 ? `
          <!-- Barra Selecionar Tudo -->
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3.5 border border-white/60 flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-3 cursor-pointer group" onclick="window.toggleSelectAll()">
              <div class="w-5 h-5 rounded-md border-2 ${allSelected ? 'border-[#8B5FBF] bg-[#8B5FBF]' : 'border-[#DDD0E8] bg-white group-hover:border-[#8B5FBF]'} flex items-center justify-center transition-all">
                ${allSelected ? `<span class="material-symbols-outlined text-white text-[14px] font-bold">check</span>` : ''}
              </div>
              <span class="text-xs font-bold text-[#2D1A40] uppercase tracking-wide">Todos os itens (${selectedCount}/${cart.length})</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-[#5C4D6B]">
              <span class="material-symbols-outlined text-emerald-500 text-[16px]" style="font-variation-settings: 'FILL' 1;">verified_user</span>
              <span class="hidden sm:inline font-medium">Compra Segura</span>
            </div>
          </div>
          ` : ''}

          <!-- Produtos Agrupados por Loja -->
          ${cart.length > 0 ? Object.keys(groupedByStore).map(storeName => {
            const items = groupedByStore[storeName];
            return `
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-white/60 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            
            <!-- Cabeçalho da Loja -->
            <div class="px-5 py-3.5 border-b border-[#F0E6F7] flex items-center justify-between" style="background: linear-gradient(135deg, #F8F4FB, #F3EDF8);">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background: linear-gradient(135deg, #8B5FBF, #6B3FA0);">
                  <span class="material-symbols-outlined text-white text-[14px]" style="font-variation-settings: 'FILL' 1;">storefront</span>
                </div>
                <span class="font-bold text-sm text-[#2D1A40]">${storeName}</span>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white" style="background: linear-gradient(135deg, #8B5FBF, #6B3FA0);">Oficial</span>
              </div>
              <div class="flex items-center gap-3">
                <button onclick="window.openSellerChatModal('ann_official', '${storeName.replace(/'/g, "\\'")}', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100', { type: 'store', storeName: '${storeName.replace(/'/g, "\\'")}' })" class="text-[11px] font-bold text-primary hover:text-primary-dark hover:underline flex items-center gap-1 cursor-pointer" title="Conversar com este vendedor">
                  <span class="material-symbols-outlined text-[15px]">chat</span> Conversar
                </button>
                <span class="text-[11px] text-[#8B5FBF] font-semibold hidden sm:flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">local_shipping</span> Envio Direto
                </span>
              </div>
            </div>

            <!-- Lista de Produtos -->
            <div class="divide-y divide-[#F5EFF9]">
              ${items.map(item => {
                const imgSrc = resolveCartImg(item);
                const escapedName = item.name.replace(/'/g, "\\'");
                const unitPrice = parseFloat(item.price.replace('R$ ', '').replace('.', '').replace(',', '.')) || 0;
                const oldPriceVal = (unitPrice * 1.25).toFixed(2).replace('.', ',');
                const itemTotal = (unitPrice * item.quantity).toFixed(2).replace('.', ',');
                const discountPercent = Math.round((1 - unitPrice / (unitPrice * 1.25)) * 100);

                return `
              <div class="p-4 sm:p-5 flex items-start gap-3 sm:gap-4 transition-all duration-200 hover:bg-[#FDFBFE]">
                
                <!-- Checkbox -->
                <div class="pt-4 flex-shrink-0 cursor-pointer" onclick="window.toggleSelect('${escapedName}')">
                  <div class="w-[22px] h-[22px] rounded-lg border-2 ${item.selected ? 'border-[#8B5FBF] bg-[#8B5FBF] shadow-md shadow-purple-300/40' : 'border-[#D0C4DB] bg-white hover:border-[#8B5FBF]'} flex items-center justify-center transition-all duration-200">
                    ${item.selected ? `<span class="material-symbols-outlined text-white text-[14px] font-bold">check</span>` : ''}
                  </div>
                </div>

                <!-- Imagem do Produto -->
                <a href="#/product?id=${item.id || ''}" class="w-[85px] h-[100px] sm:w-[100px] sm:h-[115px] bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#EDE4F5] flex-shrink-0 flex items-center justify-center relative group shadow-sm">
                  <img src="${imgSrc}" alt="${item.name}" class="w-full h-full object-contain p-1.5 group-hover:scale-110 transition-transform duration-300" onerror="this.src='https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300'"/>
                  <span class="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md text-white" style="background: linear-gradient(135deg, #EF4444, #DC2626);">-${discountPercent}%</span>
                </a>

                <!-- Informações do Produto -->
                <div class="flex-grow min-w-0 flex flex-col justify-between self-stretch py-0.5">
                  <div>
                    <!-- Nome + Botão Remover -->
                    <div class="flex items-start justify-between gap-2 mb-1.5">
                      <a href="#/product?id=${item.id || ''}" class="text-sm sm:text-[15px] font-semibold text-[#2D1A40] hover:text-[#8B5FBF] transition-colors line-clamp-2 leading-snug">
                        ${item.name}
                      </a>
                      <button onclick="window.removeFromCart('${escapedName}')" class="text-[#C4B5D0] hover:text-red-400 transition-colors p-0.5 hover:bg-red-50 rounded-lg flex-shrink-0" title="Remover item">
                        <span class="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>

                    <!-- Tags de variação -->
                    <div class="flex flex-wrap gap-1.5 mb-2.5">
                      <span class="inline-flex items-center gap-1 bg-[#F3EDF8] text-[#5C4D6B] text-[10px] font-medium px-2 py-0.5 rounded-md">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#8B5FBF]/30 flex-shrink-0"></span>
                        Tamanho: Único
                      </span>
                      <span class="inline-flex items-center gap-1 bg-[#F3EDF8] text-[#5C4D6B] text-[10px] font-medium px-2 py-0.5 rounded-md">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#D4A574] flex-shrink-0"></span>
                        Cor: Padrão
                      </span>
                    </div>

                    <!-- Preço -->
                    <div class="flex items-baseline gap-2 flex-wrap">
                      <span class="text-base sm:text-lg font-bold text-[#8B5FBF]">R$ ${itemTotal}</span>
                      <span class="text-[11px] text-[#B0A3BF] line-through">R$ ${oldPriceVal}</span>
                      <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-red-500 to-orange-500 text-white">OFERTA</span>
                    </div>
                  </div>

                  <!-- Rodapé: Wishlist + Quantidade -->
                  <div class="flex items-center justify-between mt-3">
                    <button onclick="window.moveToFavorites('${escapedName}')" class="text-[11px] text-[#8E7C9E] hover:text-[#8B5FBF] flex items-center gap-1 transition-colors group/fav">
                      <span class="material-symbols-outlined text-[16px] group-hover/fav:text-red-400 transition-colors">favorite_border</span>
                      <span class="hidden sm:inline">Salvar para depois</span>
                    </button>

                    <!-- Seletor de Quantidade Premium -->
                    <div class="flex items-center rounded-xl overflow-hidden shadow-sm" style="border: 1.5px solid #E8D8F4;">
                      <button onclick="window.updateQty('${escapedName}', -1)" class="w-8 h-8 flex items-center justify-center text-[#8B5FBF] hover:bg-[#F3EDF8] transition-colors active:scale-90 bg-white">
                        <span class="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span class="w-9 h-8 flex items-center justify-center text-sm font-bold text-[#2D1A40] bg-[#FDFBFE] border-x border-[#E8D8F4]">${item.quantity}</span>
                      <button onclick="window.updateQty('${escapedName}', 1)" class="w-8 h-8 flex items-center justify-center text-[#8B5FBF] hover:bg-[#F3EDF8] transition-colors active:scale-90 bg-white">
                        <span class="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>`;
              }).join('')}
            </div>
          </div>`;
          }).join('') : `
          <!-- ═════ ESTADO VAZIO ═════ -->
          <div class="bg-white rounded-3xl border border-white/60 p-10 sm:p-16 text-center flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
            <div class="absolute inset-0 opacity-5" style="background: radial-gradient(circle at 50% 30%, #8B5FBF 0%, transparent 70%);"></div>
            <div class="relative z-10">
              <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg" style="background: linear-gradient(135deg, #E8D8F4, #F3EDF8);">
                <span class="material-symbols-outlined text-[#8B5FBF] text-5xl sm:text-6xl" style="font-variation-settings: 'FILL' 1;">shopping_bag</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-bold text-[#2D1A40] mb-2">Sua sacola está vazia</h2>
              <p class="text-sm text-[#5C4D6B] mb-8 max-w-md mx-auto leading-relaxed">Descubra nossos produtos incríveis de beleza e skincare. Aproveite ofertas exclusivas e frete grátis!</p>
              <a href="#/search" class="inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5" style="background: linear-gradient(135deg, #8B5FBF, #6B3FA0);">
                <span class="material-symbols-outlined text-[18px]">explore</span>
                Explorar Produtos
              </a>
              <div class="flex items-center justify-center gap-6 mt-8 text-[11px] text-[#8E7C9E]">
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">local_shipping</span> Frete Grátis</span>
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">autorenew</span> Troca Fácil</span>
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">lock</span> 100% Seguro</span>
              </div>
            </div>
          </div>
          `}

          <!-- Continuar Comprando -->
          ${cart.length > 0 ? `
          <a href="#/search" class="flex items-center justify-center gap-2 text-sm text-[#8B5FBF] hover:text-[#6B3FA0] font-semibold py-3 transition-colors group">
            <span class="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Continuar Comprando
          </a>
          ` : ''}

        </div>

        <!-- ─────────────────────────────────────────── -->
        <!-- COLUNA DIREITA: Resumo do Pedido             -->
        <!-- ─────────────────────────────────────────── -->
        ${cart.length > 0 ? `
        <div class="w-full lg:w-[38%] lg:sticky lg:top-6">
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-white/60 shadow-lg overflow-hidden">
            
            <!-- Header do Resumo -->
            <div class="px-6 py-4 border-b border-[#F0E6F7]" style="background: linear-gradient(135deg, #F8F4FB, #FDFBFE);">
              <h2 class="text-base font-bold text-[#2D1A40] flex items-center justify-between">
                <span class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[#8B5FBF] text-[20px]" style="font-variation-settings: 'FILL' 1;">receipt_long</span>
                  Resumo do Pedido
                </span>
                <span class="text-xs font-bold text-white px-2.5 py-1 rounded-full" style="background: linear-gradient(135deg, #8B5FBF, #6B3FA0);">${selectedCount} ${selectedCount === 1 ? 'item' : 'itens'}</span>
              </h2>
            </div>

            <div class="p-5 sm:p-6 space-y-5">
              <!-- ── Valores ── -->
              <div class="space-y-3 text-sm">
                <div class="flex justify-between text-[#5C4D6B]">
                  <span>Subtotal</span>
                  <span class="font-semibold text-[#2D1A40]">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="flex justify-between text-[#5C4D6B]">
                  <span>Frete</span>
                  <span class="font-semibold ${isFreeShipping ? 'text-emerald-600' : 'text-[#8E7C9E]'}">
                    ${isFreeShipping ? 'GRÁTIS' : 'Calculado no checkout'}
                  </span>
                </div>
                ${discount > 0 ? `
                <div class="flex justify-between text-emerald-600">
                  <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">sell</span> Desconto</span>
                  <span class="font-bold">- R$ ${discount.toFixed(2).replace('.', ',')}</span>
                </div>
                ` : ''}
              </div>

              <!-- ── Total ── -->
              <div class="pt-4 border-t-2 border-[#E8D8F4]">
                <div class="flex justify-between items-end mb-1">
                  <div>
                    <span class="text-xs text-[#8E7C9E] uppercase tracking-wider font-semibold">Total</span>
                    <p class="text-[11px] text-[#8E7C9E] mt-0.5">ou até <strong class="text-[#2D1A40]">6x de R$ ${installments}</strong> sem juros</p>
                  </div>
                  <span class="text-2xl sm:text-3xl font-bold text-[#2D1A40]">R$ ${total.toFixed(2).replace('.', ',')}</span>
                </div>
                ${totalSavings > 0 ? `
                <div class="mt-3 py-2 px-3 rounded-xl text-center text-[11px] font-bold border border-emerald-200 text-emerald-700" style="background: linear-gradient(135deg, #ECFDF5, #F0FDF4);">
                  🎉 Você está economizando <strong>R$ ${totalSavings.toFixed(2).replace('.', ',')}</strong> neste pedido!
                </div>
                ` : ''}
              </div>

              <!-- ── Botão FINALIZAR COMPRA ── -->
              <a href="#/checkout" id="cart-checkout-btn" class="w-full py-4 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 text-center uppercase tracking-wider hover:-translate-y-0.5 active:translate-y-0 text-white ${selectedCount === 0 ? 'opacity-50 pointer-events-none' : ''}" style="background: linear-gradient(135deg, #8B5FBF 0%, #6B3FA0 50%, #4A2870 100%);">
                <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">lock</span>
                Finalizar Compra (${selectedCount})
              </a>

              <!-- ── Selos de Garantia ── -->
              <div class="grid grid-cols-2 gap-2 pt-3">
                <div class="flex items-center gap-2 text-[10px] text-[#5C4D6B] bg-[#F8F4FB] rounded-lg p-2 border border-[#F0E6F7]">
                  <span class="material-symbols-outlined text-emerald-500 text-[16px]" style="font-variation-settings: 'FILL' 1;">verified</span>
                  <span>Devolução em 7 dias</span>
                </div>
                <div class="flex items-center gap-2 text-[10px] text-[#5C4D6B] bg-[#F8F4FB] rounded-lg p-2 border border-[#F0E6F7]">
                  <span class="material-symbols-outlined text-[#8B5FBF] text-[16px]" style="font-variation-settings: 'FILL' 1;">lock</span>
                  <span>Pagamento Seguro</span>
                </div>
                <div class="flex items-center gap-2 text-[10px] text-[#5C4D6B] bg-[#F8F4FB] rounded-lg p-2 border border-[#F0E6F7]">
                  <span class="material-symbols-outlined text-amber-500 text-[16px]" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
                  <span>Produtos Originais</span>
                </div>
                <div class="flex items-center gap-2 text-[10px] text-[#5C4D6B] bg-[#F8F4FB] rounded-lg p-2 border border-[#F0E6F7]">
                  <span class="material-symbols-outlined text-blue-500 text-[16px]" style="font-variation-settings: 'FILL' 1;">support_agent</span>
                  <span>Suporte 24h</span>
                </div>
              </div>

              <!-- Métodos de Pagamento -->
              <div class="pt-3 border-t border-[#F0E6F7] text-center">
                <p class="text-[10px] text-[#8E7C9E] font-semibold mb-2 uppercase tracking-wider">Aceitamos</p>
                <div class="flex items-center justify-center gap-3 text-[#8E7C9E]">
                  <span class="text-[10px] font-bold bg-[#F3EDF8] px-2 py-1 rounded">VISA</span>
                  <span class="text-[10px] font-bold bg-[#F3EDF8] px-2 py-1 rounded">MASTER</span>
                  <span class="text-[10px] font-bold bg-[#F3EDF8] px-2 py-1 rounded">PIX</span>
                  <span class="text-[10px] font-bold bg-[#F3EDF8] px-2 py-1 rounded">BOLETO</span>
                  <span class="text-[10px] font-bold bg-[#F3EDF8] px-2 py-1 rounded">ELO</span>
                </div>
              </div>

            </div>
          </div>
        </div>
        ` : ''}

      </div>

    </div>
  </div>`;
}

export function mount() {
  window.calcularFrete = () => {
    const input = document.getElementById('cart-cep-input');
    if (!input || !input.value.trim()) {
      showToast('Por favor, informe o CEP', 'error');
      return;
    }
    const cep = input.value.trim();
    const result = cartManager.calculateShipping(cep);
    if (result) {
      sessionStorage.setItem('ann_cart_shipping', JSON.stringify(result));
      sessionStorage.setItem('ann_cart_cep', cep);
      showToast(`Frete calculado: R$ ${result.valor.toFixed(2).replace('.', ',')} via ${result.transportadora}`, 'success');
      window.dispatchEvent(new CustomEvent('auth-change'));
    }
  };

  window.aplicarCupom = () => {
    const input = document.getElementById('cart-coupon-input');
    if (!input || !input.value.trim()) {
      showToast('Por favor, digite o código do cupom', 'error');
      return;
    }
    const code = input.value.trim().toUpperCase();
    const coupon = cartManager.applyCoupon(code);
    if (coupon) {
      showToast(`🎉 Cupom "${code}" aplicado! ${coupon.value}% de desconto`, 'success');
      window.dispatchEvent(new CustomEvent('auth-change'));
    } else {
      showToast('Cupom inválido. Tente "BELEZA10" ou "PRIMEIRACOMPRA".', 'error');
    }
  };

  window.removeCoupon = () => {
    cartManager.clearCoupon();
    showToast('Cupom removido', 'info');
    window.dispatchEvent(new CustomEvent('auth-change'));
  };
}
