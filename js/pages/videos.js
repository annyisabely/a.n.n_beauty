import { dataManager } from '../data_manager.js';

export default function videosPage() {
  const vids = dataManager.generateVideos(100);
  const cards = vids.map(v => `
    <div class="group flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(109,88,166,0.05)] hover:shadow-[0_8px_30px_rgb(109,88,166,0.1)] transition-all duration-300 cursor-pointer">
      <div class="relative aspect-[4/3] overflow-hidden bg-surface-container-low">
        <img alt="${v.title}" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/${v.img}"/>
        <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
        <button class="absolute inset-0 m-auto w-12 h-12 flex items-center justify-center bg-white/30 backdrop-blur-md rounded-full text-white shadow-lg border border-white/20 group-hover:scale-110 transition-transform"><span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">play_arrow</span></button>
        <div class="absolute bottom-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-white font-label-sm text-label-sm">${v.time}</div>
      </div>
      <div class="p-4 flex flex-col flex-grow">
        <span class="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm w-fit mb-2">${v.cat}</span>
        <h3 class="font-headline-md text-headline-md text-on-surface mb-1">${v.title}</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">${v.desc || 'Assista a este tutorial exclusivo para dominar as técnicas de beleza A.n.n.'}</p>
      </div>
    </div>`).join('');

  return `
  <main class="max-w-[1280px] mx-auto px-4 md:px-10 py-12">
    <div class="mb-12 text-center md:text-left">
      <h1 class="font-display-lg text-display-lg text-primary-container mb-2">Rituais de Beleza</h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Descubra tutoriais guiados para elevar sua rotina diária de cuidados e maquiagem.</p>
    </div>
    <div class="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
      <button class="px-4 py-2 rounded-full bg-primary text-white font-label-md text-label-md shadow-sm">Todos</button>
      <button class="px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md hover:bg-primary-fixed hover:text-primary transition-colors border border-outline-variant/30">Skincare</button>
      <button class="px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md hover:bg-primary-fixed hover:text-primary transition-colors border border-outline-variant/30">Maquiagem</button>
      <button class="px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md hover:bg-primary-fixed hover:text-primary transition-colors border border-outline-variant/30">Rituais</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>
  </main>`;
}

