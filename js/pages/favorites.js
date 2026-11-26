import { auth } from '../auth.js';
import { cartManager } from '../cart_manager.js';
import { showToast } from '../components.js';

export default function favoritesPage() {
  const savedItems = auth.getSavedItems();

  window.removeFromFavorites = (id) => {
    const item = savedItems.find(i => i.id === id);
    if (item) {
        auth.toggleSaveItem(item, item.contentType);
        showToast('Removido dos favoritos', 'info');
        // Rerender page
        if(window.location.hash === '#/favorites') {
           const hash = window.location.hash;
           window.location.hash = '';
           setTimeout(() => window.location.hash = hash, 10);
        }
    }
  };

  window.addFavoriteToCart = (index) => {
    const product = savedItems[index];
    cartManager.addItem(product);
    showToast(`✅ ${product.name} adicionado ao carrinho com sucesso!`, 'success');
  };

  const cards = savedItems.length > 0 ? savedItems.map((p, index) => {
    const isVideo = p.contentType === 'video';
    const name = isVideo ? p.title : p.name;
    const desc = isVideo ? p.cat : p.desc;
    const price = isVideo ? p.time : p.price;
    const imgUrl = p.img.startsWith('http') ? p.img : 'https://lh3.googleusercontent.com/aida-public/' + p.img;

    return `
    <article class="bg-white rounded-[40px] overflow-hidden group shadow-ethereal hover:shadow-ethereal-hover transition-all duration-700 border border-primary/5 flex flex-col">
      <div class="relative aspect-[4/5] bg-primary-container/10 overflow-hidden p-4">
        <img alt="${name}" class="w-full h-full object-cover rounded-[32px] group-hover:scale-110 transition-transform duration-1000" src="${imgUrl}"/>
        <button onclick="window.removeFromFavorites('${p.id}')" class="absolute top-6 right-6 bg-white/95 backdrop-blur-md p-3 rounded-full text-secondary shadow-lg hover:scale-110 transition-transform z-10">
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings:'FILL' 1;">favorite</span>
        </button>
        ${p.badge?`<span class="absolute bottom-6 left-6 bg-[#8B5FBF] text-white font-bold text-[9px] px-4 py-1.5 rounded-full shadow-lg z-10 uppercase tracking-widest">${p.badge}</span>`:''}
        ${isVideo?`<span class="absolute inset-0 flex items-center justify-center p-4"><div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform"><span class="material-symbols-outlined text-white text-4xl" style="font-variation-settings:'FILL' 1;">play_arrow</span></div></span>`:''}
      </div>
      <div class="p-8 flex flex-col flex-grow">
        <h3 class="font-display text-2xl text-on-background mb-2 line-clamp-1">${name}</h3>
        <p class="text-xs text-on-surface-variant font-medium opacity-60 mb-8 line-clamp-2 leading-relaxed">${desc}</p>
        <div class="mt-auto flex items-center justify-between">
          <span class="text-xl font-display font-bold text-primary">${price}</span>
          ${!isVideo ? `
          <button onclick="window.addFavoriteToCart(${index})" class="bg-primary/5 text-primary p-3 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm">
            <span class="material-symbols-outlined text-[22px]">add_shopping_cart</span>
          </button>` : `
          <a href="#/tutorial" class="bg-primary/10 text-primary p-3 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm">
            <span class="material-symbols-outlined text-[22px]">play_circle</span>
          </a>
          `}
        </div>
      </div>
    </article>`
  }).join('') : `
    <div class="col-span-full py-32 text-center flex flex-col items-center max-w-md mx-auto">
        <div class="w-24 h-24 bg-primary-container/20 rounded-full flex items-center justify-center text-primary/30 mb-8">
            <span class="material-symbols-outlined text-5xl" style="font-variation-settings:'FILL' 1;">favorite</span>
        </div>
        <h3 class="text-3xl font-display text-on-background mb-4 tracking-tighter">Sua Galeria de Desejos</h3>
        <p class="text-on-surface-variant font-medium opacity-70 mb-10 leading-relaxed italic">"Ainda não há tesouros salvos. Explore nossa curadoria e guarde o que fizer seu coração vibrar."</p>
        <a href="#/search" class="w-full bg-primary text-white py-4 rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-2xl transition-all">Explorar Coleção</a>
    </div>
  `;

  return `
  <main class="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-16 bg-background">
    <header class="mb-16 text-center md:text-left">
      <div class="inline-block px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-6 shadow-sm border border-secondary/5 text-center mx-auto md:mx-0">Vibrações de Luxo</div>
      <h1 class="font-display text-4xl m:text-5xl text-on-background tracking-tighter mb-4">Itens <span class="italic text-primary">Desejados</span></h1>
      <p class="text-base text-on-surface-variant font-medium max-w-2xl opacity-70">Uma curadoria pessoal das suas formulações, rituais e cores que definem a sua essência Beleza na Web.</p>
    </header>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">${cards}</div>
  </main>`;
}
