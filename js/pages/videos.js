import { dataManager } from '../data_manager.js';

export default function videosPage() {
  const vids = dataManager.generateVideos(100);

  function buildVideoCard(v) {
    return `
    <div onclick="window.openVideoModal(${v.id || 0}, '${(v.title || '').replace(/'/g, "\\'")}', '${(v.cat || '').replace(/'/g, "\\'")}', '${(v.time || '').replace(/'/g, "\\'")}', '${(v.desc || '').replace(/'/g, "\\'")}', '${(v.img || '').replace(/'/g, "\\'")}')" 
         class="group flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(109,88,166,0.05)] hover:shadow-[0_8px_30px_rgb(109,88,166,0.1)] transition-all duration-300 cursor-pointer">
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
    </div>`;
  }

  // ── Video modal open ──
  window.openVideoModal = (id, title, cat, time, desc, img) => {
    const modal = document.getElementById('video-modal');
    if (!modal) return;
    const content = document.getElementById('video-modal-content');
    content.innerHTML = `
      <div class="relative w-full aspect-video bg-black rounded-t-2xl overflow-hidden flex items-center justify-center">
        <img src="https://lh3.googleusercontent.com/aida-public/${img}" alt="${title}" class="w-full h-full object-cover opacity-70"/>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-4xl ml-1" style="font-variation-settings:'FILL' 1;">play_arrow</span>
          </div>
        </div>
        <div class="absolute top-4 right-4">
          <span class="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-bold">${time}</span>
        </div>
      </div>
      <div class="p-6">
        <span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3 inline-block">${cat}</span>
        <h3 class="text-xl font-bold text-on-surface mb-2" style="font-family:'Poppins',sans-serif">${title}</h3>
        <p class="text-sm text-on-surface-variant leading-relaxed mb-4">${desc || 'Assista a este tutorial exclusivo para dominar as técnicas de beleza A.n.n.'}</p>
        <div class="flex gap-3">
          <button onclick="window.closeVideoModal()" class="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">play_arrow</span> Assistir Tutorial
          </button>
          <button onclick="window.closeVideoModal()" class="px-5 py-2.5 rounded-xl bg-surface-container-low text-on-surface-variant text-sm font-bold hover:bg-surface-dim transition-colors">
            Fechar
          </button>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeVideoModal = () => {
    const modal = document.getElementById('video-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  // ── Filter logic ──
  function initVideoFilters() {
    const filterBtns = document.querySelectorAll('.video-cat-filter');
    const grid = document.getElementById('videos-grid');
    let activeCat = 'all';

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        activeCat = btn.dataset.cat;

        // Update button styles
        filterBtns.forEach(b => {
          b.classList.toggle('bg-primary', b === btn);
          b.classList.toggle('text-white', b === btn);
          b.classList.toggle('shadow-sm', b === btn);
          b.classList.toggle('bg-surface-container-low', b !== btn);
          b.classList.toggle('text-on-surface-variant', b !== btn);
        });

        // Filter videos
        const filtered = activeCat === 'all'
          ? vids
          : vids.filter(v => (v.cat || '').toLowerCase().includes(activeCat));

        grid.innerHTML = filtered.length > 0
          ? filtered.map(v => buildVideoCard(v)).join('')
          : `<div class="col-span-full py-16 text-center">
               <span class="material-symbols-outlined text-5xl text-primary/30 mb-3 block">video_library</span>
               <p class="text-on-surface-variant text-sm">Nenhum vídeo encontrado nesta categoria.</p>
             </div>`;
      });
    });
  }

  setTimeout(() => initVideoFilters(), 50);

  return `
  <main class="max-w-[1280px] mx-auto px-4 md:px-10 py-12">
    <div class="mb-12 text-center md:text-left">
      <h1 class="font-display-lg text-display-lg text-primary-container mb-2">Rituais de Beleza</h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Descubra tutoriais guiados para elevar sua rotina diária de cuidados e maquiagem.</p>
    </div>
    <div class="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
      <button data-cat="all" class="video-cat-filter px-4 py-2 rounded-full bg-primary text-white font-label-md text-label-md shadow-sm transition-colors">Todos</button>
      <button data-cat="skincare" class="video-cat-filter px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md hover:bg-primary-fixed hover:text-primary transition-colors border border-outline-variant/30">Skincare</button>
      <button data-cat="maquiagem" class="video-cat-filter px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md hover:bg-primary-fixed hover:text-primary transition-colors border border-outline-variant/30">Maquiagem</button>
      <button data-cat="rituais" class="video-cat-filter px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md hover:bg-primary-fixed hover:text-primary transition-colors border border-outline-variant/30">Rituais</button>
    </div>

    <!-- Vídeo em destaque: IA -->
    <div class="mb-10">
      <h2 class="font-display text-2xl text-on-surface mb-4 flex items-center gap-2">
        <span class="material-symbols-outlined text-primary" style="font-variation-settings:'FILL' 1;">star</span>
        Em Destaque — Feito com IA
      </h2>
      <a href="#/tutorial" class="group block bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(109,88,166,0.1)] hover:shadow-[0_8px_30px_rgb(109,88,166,0.2)] transition-all duration-300 cursor-pointer border border-primary/20">
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div class="relative aspect-video overflow-hidden bg-black">
            <video class="w-full h-full object-cover" muted loop playsinline onmouseenter="this.play()" onmouseleave="this.pause();this.currentTime=0;" poster="https://lh3.googleusercontent.com/aida-public/AB6AXuBJvWHcVtwfwVsd2d8xMLYDGJSdfs_xQjDQK4v3BAh2cLubVbi5UR-SbhZqM6QPy28aPz1posNZ02tSe00oVWoxUBQPGK5WEX7G8g6Egmrbe_0n2pcLUU5JguQkxvoKKXcP0Gwh00cHZPafDqP36MgQ0rkhrJmwTUMROJ_HP0NH5JEO-WjhWE9RUt5dLyms9bXZ6FOxRluIDKBvHoE9T8luSGPJKr8Bhs8NXx1Tq9tJyfmVBZliJ6fWiVvBu6Kshv9fTSiNGb0Gcpgk">
              <source src="galeria_de_v_deos_a.n.n_beauty/videos/Maquiagem Simples com Bianca_720p_caption.mp4" type="video/mp4">
            </video>
            <div class="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
              <span class="material-symbols-outlined text-sm">auto_awesome</span> IA
            </div>
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-white/50 transition-all">
                <span class="material-symbols-outlined text-white text-3xl ml-1" style="font-variation-settings:'FILL' 1;">play_arrow</span>
              </div>
            </div>
          </div>
          <div class="p-6 md:p-8 flex flex-col justify-center">
            <span class="px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm w-fit mb-3 flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">auto_awesome</span> Tutorial com IA
            </span>
            <h3 class="font-display text-2xl text-on-surface mb-2">Maquiagem Simples com Bianca</h3>
            <p class="font-body-md text-on-surface-variant mb-4">Aprenda técnicas de maquiagem simples e elegante com a Bianca neste tutorial exclusivo gerado com Inteligência Artificial.</p>
            <span class="text-primary font-label-md flex items-center gap-1 group-hover:gap-2 transition-all">
              Assistir agora <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </div>
        </div>
      </a>
    </div>

    <div id="videos-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${vids.map(v => buildVideoCard(v)).join('')}
    </div>
  </main>

  <!-- Video Modal -->
  <div id="video-modal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] items-center justify-center p-4">
    <div class="bg-surface-container-lowest w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative">
      <button onclick="window.closeVideoModal()" class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center transition-colors">
        <span class="material-symbols-outlined text-lg">close</span>
      </button>
      <div id="video-modal-content">
        <!-- Injected by JS -->
      </div>
    </div>
  </div>`;
}
