import { cartManager } from '../cart_manager.js';
import { showToast } from '../components.js';

export default function productPage() {
  const product = {
    name: 'Pó Facial Velvet Matte',
    desc: 'Ultra-fine milled texture for a seamless blend',
    price: 'R$ 45,90',
    img: 'AB6AXuD18GXwV-Fkc6wDo7J4wrXsDQej-dEfgu5VImTb9uItwdNW88u_1yCxDVF9on8jlVNCPo-eKZEl9aNMrTISfydrBo8SR077DCvYnLcSDxEAalZqqw8TZ3jpvZRULCa0zP9BNNQ-i470VZ5EDn7JHQ2btfru-a-pTCf15BaEHzY9QZpQAus_V57bsYk-VpSr7PEucVXEHnd0d4RBqKFQaBZaW1EDR4bo-Ej6RqvwLps8AyPi3RQMWfHu9arWD8Wneoh9RG_l1BG98xQC'
  };

  window.addToCartProduct = () => {
    cartManager.addItem(product);
    showToast(`${product.name} adicionado ao carrinho!`, 'success');
  };

  return `
  <main class="flex-grow pt-6 px-4 md:px-10 pb-12 max-w-[1280px] mx-auto w-full flex items-center justify-center">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
      <div class="bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(109,88,166,0.08)] flex flex-col items-center justify-center relative group">
        <div class="absolute top-6 right-6 z-10 flex flex-col gap-4">
          <button onclick="showToast('Adicionado aos favoritos', 'success')" class="w-12 h-12 bg-surface-container-lowest/80 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-[0_4px_12px_rgba(109,88,166,0.1)] hover:bg-primary-fixed hover:text-primary-container transition-colors duration-300"><span class="material-symbols-outlined">favorite</span></button>
          <a href="#/cart" class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-[0_4px_12px_rgba(84,64,140,0.3)] hover:bg-primary-container transition-colors duration-300"><span class="material-symbols-outlined">shopping_cart</span></a>
        </div>
        <img alt="${product.name}" class="w-full max-w-[300px] h-auto object-contain transform group-hover:scale-105 transition-transform duration-700 ease-out mb-8" src="https://lh3.googleusercontent.com/aida-public/${product.img}"/>
        <div class="text-center mt-auto">
          <div class="inline-block px-4 py-1.5 bg-primary-fixed/50 text-primary-container rounded-full font-label-sm text-label-sm mb-4">Bestseller</div>
          <h1 class="font-headline-md text-headline-md text-on-surface mb-2">${product.name}</h1>
          <div class="font-display-lg text-display-lg text-primary">${product.price}</div>
        </div>
      </div>
      <div class="bg-surface-container-lowest/90 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgba(109,88,166,0.05)] border border-white/50 flex flex-col">
        <h2 class="font-headline-md text-headline-md text-primary-container mb-6 pb-4 border-b border-outline-variant/30">Descrição do Produto</h2>
        <div class="flex-grow">
          <p class="font-body-md text-body-md text-on-surface-variant mb-6">Experimente o toque etéreo do nosso pó velvet matte. Projetado para proporcionar um acabamento impecável e duradouro, mantendo uma sensação leve e natural na pele.</p>
          <ul class="space-y-4 mb-8">
            <li class="flex items-start gap-3"><span class="material-symbols-outlined text-secondary mt-0.5 text-[20px]" style="font-variation-settings:'FILL' 1;">check_circle</span><span class="font-body-md text-on-surface">Textura ultra-fina para uma mistura perfeita</span></li>
            <li class="flex items-start gap-3"><span class="material-symbols-outlined text-secondary mt-0.5 text-[20px]" style="font-variation-settings:'FILL' 1;">check_circle</span><span class="font-body-md text-on-surface">Controla o brilho sem ressecar a pele</span></li>
            <li class="flex items-start gap-3"><span class="material-symbols-outlined text-secondary mt-0.5 text-[20px]" style="font-variation-settings:'FILL' 1;">check_circle</span><span class="font-body-md text-on-surface">Infundido com partículas difusoras de luz</span></li>
            <li class="flex items-start gap-3"><span class="material-symbols-outlined text-secondary mt-0.5 text-[20px]" style="font-variation-settings:'FILL' 1;">check_circle</span><span class="font-body-md text-on-surface">Fórmula Vegana e Livre de Crueldade</span></li>
          </ul>
        </div>
        <div class="mt-auto pt-8 border-t border-outline-variant/30 flex gap-4">
          <div class="flex items-center justify-between border border-outline-variant rounded-lg px-4 py-2 bg-surface">
            <button class="text-on-surface-variant hover:text-primary"><span class="material-symbols-outlined">remove</span></button>
            <span class="font-label-md text-label-md px-4">1</span>
            <button class="text-on-surface-variant hover:text-primary"><span class="material-symbols-outlined">add</span></button>
          </div>
          <button onclick="window.addToCartProduct()" class="flex-grow bg-primary hover:bg-primary-container text-on-primary rounded-lg py-3 px-6 font-label-md text-label-md shadow-[0_4px_12px_rgba(84,64,140,0.2)] transition-all duration-300 flex items-center justify-center gap-2">Adicionar ao Carrinho <span class="material-symbols-outlined text-[18px]">arrow_forward</span></button>
        </div>
      </div>
    </div>
  </main>`;
}

