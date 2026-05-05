export default function ritualsPage() {
  return `
  <main class="min-h-screen flex flex-col items-center">
    <section class="w-full max-w-[1280px] mx-auto px-4 md:px-10 py-16 flex flex-col items-center text-center">
      <div class="inline-flex items-center gap-2 bg-purple-50 text-primary px-5 py-2.5 rounded-full mb-8 border border-purple-100 shadow-sm transition-all hover:scale-105">
        <span class="material-symbols-outlined text-sm">auto_awesome</span>
        <span class="font-label-sm uppercase tracking-[0.2em] text-[10px] font-bold">Seleção Inteligente</span>
      </div>
      <h1 class="font-display text-5xl md:text-6xl text-on-surface mb-6 max-w-3xl leading-tight">Rituais Etéreos, <br/><span class="text-primary italic">Curados para Você.</span></h1>
      <p class="font-body-lg text-on-surface-variant max-w-2xl mb-12">Nosso algoritmo combina eficácia científica com seus objetivos estéticos únicos para criar a jornada perfeita.</p>
    </section>

    <section class="w-full max-w-[1280px] mx-auto px-4 md:px-10 mb-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
        <a href="#/tutorial" class="md:col-span-8 bg-white rounded-3xl shadow-xl overflow-hidden group relative min-h-[450px] flex flex-col justify-end p-10 border border-purple-50">
          <img alt="Eyeliner tutorial" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 z-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ_xTYrJATpZojIBROSRuNTxUnWG4SGSxYMqxgJaxEm5s9DDI7g32bhnkaNwGDaMR5Ne_h_MYXh8q3t3eke3u2YB3q3WbVAwNQ2HHdASQIgewxRuO4rFN7vaf5RmvlzKTSk4vqsJnNCsKPQrpwzwrpXlA7TxhuNYSHZNlH06ZLj_4lJuJj02F_LvEacpJm-VJOZTS1Ir0hhvdzah_HlyGeMJCips9S8fobKhkDVs68g4MqINsjJcY1TfS55qZlDmJnrsPl9WA3RsPO"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
          <div class="relative z-20 max-w-md">
            <div class="flex gap-2 mb-4">
                <span class="px-4 py-1.5 bg-white/20 text-white font-label-xs rounded-full backdrop-blur-md border border-white/30">Iniciante</span>
                <span class="px-4 py-1.5 bg-white/20 text-white font-label-xs rounded-full backdrop-blur-md border border-white/30">5 Min</span>
            </div>
            <h2 class="font-display text-3xl text-white mb-3">Delineado para Iniciantes</h2>
            <p class="font-body-md text-white/80 mb-8 leading-relaxed">Domine o traço perfeito com nosso guia passo a passo detalhado.</p>
            <span class="inline-flex items-center gap-3 bg-white text-primary px-10 py-4 rounded-full font-bold shadow-2xl transition-all group-hover:bg-primary group-hover:text-white">
                <span class="material-symbols-outlined">play_arrow</span> Começar Ritual
            </span>
          </div>
        </a>

        <a href="#/tutorial" class="md:col-span-4 bg-white rounded-3xl shadow-xl overflow-hidden group relative min-h-[450px] flex flex-col justify-end p-10 border border-purple-50">
          <img alt="Glass Skin" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 z-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9b_mZ9hJu25J7mXoz5PvCqagmQFTuvlL3TjCbE-rEuEQrCDhz8P9UiH9QhsxqxPBGFdZyHZnIXv9v1AwL8tf5XFOFBIUGgIKpfMuErJLoJf9CAhHBsAxVn9pDJKkmyYLq0ReG-_fV_b0UZLjPM95FnTWFR1Vtt9p4RMHHGM9c2NxO7DTNDeBTgSAcD6jN6vdWTNMu7WgCBrvHHYC_kXZ48R21NqlpyvLZE_YoV7uy3kVvGelY6CjxrQHqod_CaaJSHEzEA6nhvBo-"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
          <div class="relative z-20">
            <span class="inline-block px-4 py-1.5 bg-white/20 text-white font-label-xs rounded-full backdrop-blur-md border border-white/30 mb-4">Intermediário</span>
            <h3 class="font-display text-2xl text-white mb-2">Preparo Glass Skin</h3>
            <p class="font-body-sm text-white/80 mb-4">A técnica definitiva de camadas de hidratação intensa.</p>
          </div>
        </a>

        <div class="md:col-span-4 bg-gradient-to-br from-primary/10 to-purple-50 rounded-3xl shadow-xl p-10 flex flex-col justify-center border border-purple-100">
          <div class="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6">
            <span class="material-symbols-outlined text-primary text-3xl">tune</span>
          </div>
          <h3 class="font-display text-2xl text-on-surface mb-3">Refine seu Feed</h3>
          <p class="font-body-sm text-on-surface-variant mb-8 leading-relaxed">Ajuste seu perfil de beleza para ver tutoriais que combinam com seu tipo de pele.</p>
          <button onclick="window.location.hash='#/profile'" class="w-full border-2 border-primary text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all">Atualizar Perfil</button>
        </div>

        <a href="#/tutorial" class="md:col-span-8 bg-white rounded-3xl shadow-xl overflow-hidden group relative min-h-[300px] flex flex-col justify-end p-10 border border-purple-50">
          <img alt="Soft Sculpting" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 z-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdsTmkpeAtGLLGk5AYbrH2gA7KNanIf2SUfG7pFkir5OaUBbUbEBOWx1iqBlxPuUvMKM8VABwKbGZrkWId5KNFRoNFL3YuoRu86yb4p7lmvn6SGa1eZEu3vVKy9bq11QQ9wYMG4OfpkEXbSRdVzyPdefHjHhsIi_b95pJCL_h7KzbQHDtCdDO2Dp6QDiirntKVHo3HdeF1eNWeGxQjlfkLke-80ax7yCICKyksaWFr0lfXLe0Q5vXTVAltblDDty7t2w7CsIsAFV5Y"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
          <div class="relative z-20">
            <span class="inline-block px-4 py-1.5 bg-white/20 text-white font-label-xs rounded-full backdrop-blur-md border border-white/30 mb-4">Avançado</span>
            <h3 class="font-display text-2xl text-white mb-2">Ritual Soft Sculpting</h3>
            <p class="font-body-sm text-white/80">Defina suas feições com luz e sombra natural.</p>
          </div>
        </a>
      </div>
    </section>
  </main>`;
}
