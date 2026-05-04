import { cartManager } from '../cart_manager.js';
import { showToast } from '../components.js';

export default function cartPage() {
  const cart = cartManager.getCart();
  const total = cartManager.getTotal();

  window.removeFromCart = (name) => {
    cartManager.removeItem(name);
    // Re-render the page by triggering a hash change or a custom event
    window.dispatchEvent(new CustomEvent('auth-change')); 
  };

  window.updateQty = (name, delta) => {
    cartManager.updateQuantity(name, delta);
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  const cartItemsHTML = cart.length > 0 ? cart.map(item => `
    <div class="flex flex-col sm:flex-row bg-surface-container-lowest rounded-xl ambient-shadow p-6 gap-6 relative group overflow-hidden border border-purple-50">
      <div class="absolute inset-0 bg-gradient-to-r from-primary-fixed/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <div class="w-full sm:w-32 h-32 flex-shrink-0 bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center">
        <img alt="${item.name}" class="w-full h-full object-cover mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/${item.img}"/>
      </div>
      <div class="flex-grow flex flex-col justify-between">
        <div class="flex justify-between items-start">
            <div>
                <h3 class="font-headline-md text-headline-md text-on-surface">${item.name}</h3>
                <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">${item.desc}</p>
            </div>
            <button onclick="window.removeFromCart('${item.name}')" class="text-outline hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="flex justify-between items-end mt-6">
            <div class="flex items-center bg-surface-container-low rounded-full border border-outline-variant p-1">
                <button onclick="window.updateQty('${item.name}', -1)" class="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-variant rounded-full"><span class="material-symbols-outlined text-[18px]">remove</span></button>
                <span class="w-10 text-center font-label-md text-label-md text-on-surface">${item.quantity}</span>
                <button onclick="window.updateQty('${item.name}', 1)" class="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-variant rounded-full"><span class="material-symbols-outlined text-[18px]">add</span></button>
            </div>
            <span class="font-label-md text-[20px] font-semibold text-primary">${item.price}</span>
        </div>
      </div>
    </div>
  `).join('') : `
    <div class="text-center py-20 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant">
      <span class="material-symbols-outlined text-6xl text-outline-variant mb-4">shopping_cart_off</span>
      <h3 class="font-headline-md text-on-surface mb-2">Seu carrinho está vazio</h3>
      <p class="text-on-surface-variant mb-8">Que tal explorar nossos produtos e encontrar algo especial?</p>
      <a href="#/search" class="bg-primary text-white px-8 py-3 rounded-full font-label-md inline-block">Começar a Comprar</a>
    </div>
  `;

  return `
  <main class="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12">
    <header class="mb-12">
        <h1 class="font-headline-xl text-headline-xl text-primary mb-2">Seu Carrinho</h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant">Revise suas seleções antes de finalizar a compra.</p>
    </header>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-8 flex flex-col gap-6">
        ${cartItemsHTML}
      </div>
      
      <div class="lg:col-span-4 mt-8 lg:mt-0">
        <div class="bg-surface-container-lowest rounded-xl ambient-shadow p-8 sticky top-[100px] border border-purple-50">
          <h2 class="font-headline-md text-headline-md text-on-surface mb-6 border-b border-surface-variant pb-4">Resumo do Pedido</h2>
          <div class="flex flex-col gap-4 mb-6">
            <div class="flex justify-between font-body-md text-on-surface-variant"><span>Subtotal</span><span class="text-on-surface font-semibold">R$ ${total.toFixed(2).replace('.', ',')}</span></div>
            <div class="flex justify-between font-body-md text-on-surface-variant"><span>Frete</span><span class="text-green-600 font-semibold">${total > 150 ? 'Grátis' : 'R$ 15,00'}</span></div>
          </div>
          <div class="border-t border-surface-variant pt-6 mb-8">
              <div class="flex justify-between items-center"><span class="font-headline-md text-on-surface">Total</span><span class="font-headline-md text-primary">R$ ${(total + (total > 150 ? 0 : 15)).toFixed(2).replace('.', ',')}</span></div>
          </div>
          <a href="#/checkout" class="w-full bg-primary hover:bg-primary-container text-white font-label-md text-label-md py-4 rounded-full shadow-lg shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2 group ${cart.length === 0 ? 'pointer-events-none opacity-50' : ''}">
              Finalizar Compra <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>
          <div class="mt-6 flex items-start gap-3 bg-purple-50 p-4 rounded-lg">
              <span class="material-symbols-outlined text-primary text-[20px] mt-0.5">local_shipping</span>
              <p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Ganhe frete grátis em todas as compras acima de R$ 150.</p>
          </div>
        </div>
      </div>
    </div>
  </main>`;
}

