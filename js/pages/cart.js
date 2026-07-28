import { cartManager } from '../cart_manager.js';

export default function cartPage() {
  const cart = cartManager.getCart();
  const selectedTotal = cartManager.getSelectedTotal();
  const selectedCount = cartManager.getSelectedItemCount();
  const allSelected = cart.length > 0 && cart.every(item => item.selected);
  
  // Get bonus toggle state from session storage
  const bonusActive = sessionStorage.getItem('ann_bonus_active') === 'true';

  window.removeFromCart = (name) => {
    cartManager.removeItem(name);
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

  window.toggleBonus = () => {
    sessionStorage.setItem('ann_bonus_active', (!bonusActive).toString());
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  const cartItemsHTML = cart.length > 0 ? cart.map(item => `
    <div class="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-xl relative shadow-sm border border-purple-50">
      <!-- Checkbox -->
      <div class="flex-shrink-0 cursor-pointer p-2 -m-2" onclick="window.toggleSelect('${item.name}')">
        <div class="w-5 h-5 rounded-full border-2 ${item.selected ? 'border-primary bg-primary' : 'border-outline-variant bg-transparent'} flex items-center justify-center transition-colors">
            ${item.selected ? `<span class="material-symbols-outlined text-white text-[14px] font-bold">check</span>` : ''}
        </div>
      </div>

      <!-- Image -->
      <div class="w-24 h-24 flex-shrink-0 bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center p-1">
        <img alt="${item.name}" class="w-full h-full object-contain mix-blend-multiply" src="${item.img.startsWith('http') ? item.img : 'https://lh3.googleusercontent.com/aida-public/' + item.img}"/>
      </div>

      <!-- Info -->
      <div class="flex-grow min-w-0">
        <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-1 min-w-0">
                <span class="bg-primary-container text-on-primary-container text-[10px] font-bold px-1.5 py-0.5 rounded border border-primary/20 flex-shrink-0">5.5</span>
                <h3 class="text-sm font-medium text-on-surface truncate">${item.name}</h3>
            </div>
            <button onclick="window.removeFromCart('${item.name}')" class="text-outline hover:text-red-500 transition-colors flex-shrink-0">
                <span class="material-symbols-outlined text-[20px]">delete</span>
            </button>
        </div>
        
        <div class="flex items-center gap-1 text-xs text-on-surface-variant mb-1">
            <span>BR16</span>
            <span class="material-symbols-outlined text-[14px]">expand_more</span>
        </div>

        <p class="text-[10px] text-outline mb-2">34 comprado(s) ontem</p>

        <div class="flex items-end justify-between">
            <div>
                <div class="flex items-center gap-1">
                    <span class="text-primary font-bold">R$ ${item.price.replace('R$ ', '')}</span>
                    <span class="material-symbols-outlined text-primary text-[14px]">confirmation_number</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-[10px] text-outline line-through">R$ 89,90</span>
                    <span class="text-[10px] text-primary bg-primary/10 px-1 rounded">-60%</span>
                </div>
            </div>

            <!-- Qty -->
            <div class="flex items-center bg-surface-container-low rounded-md border border-outline-variant">
                <button onclick="window.updateQty('${item.name}', -1)" class="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant rounded-l-md transition-colors">
                    <span class="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span class="w-6 text-center text-xs text-on-surface font-medium">${item.quantity}</span>
                <button onclick="window.updateQty('${item.name}', 1)" class="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant rounded-r-md transition-colors">
                    <span class="material-symbols-outlined text-[16px]">add</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  `).join('') : `
    <div class="text-center py-20 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant shadow-sm">
      <span class="material-symbols-outlined text-6xl text-outline mb-4">shopping_cart_off</span>
      <h3 class="text-xl text-on-surface mb-2 font-serif">Seu carrinho está vazio</h3>
      <a href="#/home" class="text-primary font-bold hover:underline">Começar a comprar</a>
    </div>
  `;

  return `
  <div class="min-h-screen bg-background text-on-background font-sans flex flex-col">
    <!-- Header -->
    <header class="p-4 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-20 border-b border-primary/10">
        <div class="flex items-center gap-3">
            <a href="#/home" class="material-symbols-outlined text-primary hover:scale-110 transition-transform">arrow_back_ios</a>
            <div>
                <h1 class="text-lg font-bold text-primary font-display">Carrinho (${cartManager.getItemCount()})</h1>
                <div class="flex items-center gap-1 text-[10px] text-on-surface-variant">
                    <span class="material-symbols-outlined text-[12px]">location_on</span>
                    <span>Salvador, Bahia, Brasil ></span>
                </div>
            </div>
        </div>
        <button class="text-sm font-bold text-primary hover:text-on-primary-container transition-colors">Editar</button>
    </header>

    <!-- Main Content -->
    <main class="flex-grow p-4 flex flex-col gap-4 pb-40 max-w-2xl mx-auto w-full">
        <!-- Oferta Relâmpago Banner -->
        ${cart.length > 0 ? `
        <div class="flex items-center justify-between bg-gradient-to-r from-primary to-secondary p-2 rounded-2xl shadow-lg shadow-primary/10 border border-white/20">
            <div class="flex items-center gap-2">
                <span class="bg-white text-primary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Oferta Relâmpago</span>
                <span class="material-symbols-outlined text-white text-[16px]" style="font-variation-settings: 'FILL' 1">bolt</span>
                <span class="text-[10px] text-white font-bold tracking-wider">EXPIRA EM 12:54:51</span>
            </div>
        </div>
        ` : ''}

        <div class="flex flex-col gap-3">
            ${cartItemsHTML}
        </div>

        <!-- Bonus Toggle -->
        <div class="flex items-center justify-between bg-white p-4 rounded-[28px] mt-4 shadow-ethereal border border-primary/5 cursor-pointer" onclick="window.toggleBonus()">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center">
                    <span class="material-symbols-outlined text-secondary text-[20px]" style="font-variation-settings: 'FILL' 1">card_giftcard</span>
                </div>
                <div>
                    <p class="text-xs text-on-surface font-bold">Resgate bônus em itens</p>
                    <p class="text-[10px] text-on-surface-variant opacity-70">Aproveite descontos exclusivos</p>
                </div>
            </div>
            <div class="w-12 h-6 ${bonusActive ? 'bg-primary' : 'bg-surface-container-highest'} rounded-full relative p-1 transition-colors">
                <div class="w-4 h-4 bg-white rounded-full shadow-sm absolute ${bonusActive ? 'right-1' : 'left-1'} transition-all"></div>
            </div>
        </div>
    </main>

    <!-- Footer Bar -->
    <footer class="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-primary/10 p-4 pb-10 z-30 shadow-ethereal">
        <div class="max-w-2xl mx-auto w-full flex items-center justify-between mb-4">
            <div class="flex items-center gap-2 cursor-pointer" onclick="window.toggleSelectAll()">
                <div class="w-5 h-5 rounded-full border-2 ${allSelected ? 'border-primary bg-primary' : 'border-outline-variant bg-transparent'} flex items-center justify-center transition-all">
                    ${allSelected ? `<span class="material-symbols-outlined text-white text-[14px] font-bold">check</span>` : ''}
                </div>
                <span class="text-xs text-on-surface-variant font-bold">Tudo</span>
            </div>
            <div class="text-right flex flex-col items-end">
                <div class="flex items-center gap-1">
                    <span class="text-lg font-bold text-primary">R$ ${selectedTotal.toFixed(2).replace('.', ',')}</span>
                    <span class="material-symbols-outlined text-outline text-[14px]">expand_less</span>
                </div>
                <p class="text-[10px] text-on-surface-variant opacity-70 font-medium">Taxa de envio: R$ 0,80</p>
                ${bonusActive ? `<p class="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold inline-block mt-1">Bônus Ativado!</p>` : `<p class="text-[10px] text-secondary bg-secondary/10 px-2 py-0.5 rounded-full font-bold inline-block mt-1">R$ 76,76 OFF</p>`}
            </div>
            <a href="#/checkout" class="bg-primary hover:bg-on-primary-container transition-all text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 ${selectedCount === 0 ? 'opacity-50 pointer-events-none' : 'hover:-translate-y-0.5'}">
                Finalizar (${selectedCount})
            </a>
        </div>
    </footer>
  </div>`;
}


