export default function tutorialPage() {
  return `
  <main class="max-w-[1280px] mx-auto px-4 md:px-10 py-12 flex flex-col gap-12">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div class="lg:col-span-8 flex flex-col gap-8">
        <div class="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-purple-50 group cursor-pointer border border-purple-100">
          <img alt="Tutorial" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJvWHcVtwfwVsd2d8xMLYDGJSdfs_xQjDQK4v3BAh2cLubVbi5UR-SbhZqM6QPy28aPz1posNZ02tSe00oVWoxUBQPGK5WEX7G8g6Egmrbe_0n2pcLUU5JguQkxvoKKXcP0Gwh00cHZPafDqP36MgQ0rkhrJmwTUMROJ_HP0NH5JEO-WjhWE9RUt5dLyms9bXZ6FOxRluIDKBvHoE9T8luSGPJKr8Bhs8NXx1Tq9tJyfmVBZliJ6fWiVvBu6Kshv9fTSiNGb0Gcpgk"/>
          <div class="absolute inset-0 bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <div class="w-20 h-20 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-primary text-4xl ml-1" style="font-variation-settings:'FILL' 1;">play_arrow</span>
            </div>
          </div>
        </div>
        <h1 class="font-display text-4xl text-on-surface">Rotina Ethereal Glow</h1>
        <p class="font-body-lg text-on-surface-variant max-w-3xl leading-relaxed">Descubra o segredo para o nosso acabamento luminoso exclusivo. Nossa artista líder guia você através dos passos exatos para uma base impecável e que deixa a pele respirar.</p>
      </div>
      <div class="lg:col-span-4">
        <div class="bg-white rounded-3xl p-8 shadow-xl border border-purple-50 flex flex-col h-full">
          <h2 class="font-display text-2xl text-on-surface mb-8 border-b border-purple-50 pb-4">Resumo do Vídeo</h2>
          <div class="flex flex-col gap-6 relative">
            <div class="absolute left-3 top-2 bottom-2 w-px bg-purple-50"></div>
            <div class="flex gap-5 relative z-10">
                <div class="w-7 h-7 rounded-full bg-primary flex-shrink-0 flex items-center justify-center border-2 border-white shadow-md">
                    <span class="font-label-sm text-white text-[10px]">1</span>
                </div>
                <div class="pb-2">
                    <span class="font-display text-lg text-on-surface">Preparo da Pele</span><br/>
                    <span class="font-body-sm text-on-surface-variant">Aplique a Essência Hidratante pressionando suavemente.</span>
                </div>
            </div>
            <div class="flex gap-5 relative z-10">
                <div class="w-7 h-7 rounded-full bg-primary flex-shrink-0 flex items-center justify-center border-2 border-white shadow-md">
                    <span class="font-label-sm text-white text-[10px]">2</span>
                </div>
                <div class="pb-2">
                    <span class="font-display text-lg text-on-surface">Base Luminosa</span><br/>
                    <span class="font-body-sm text-on-surface-variant">Misture 2 gotas de Serum Iluminador com sua base.</span>
                </div>
            </div>
            <div class="flex gap-5 relative z-10">
                <div class="w-7 h-7 rounded-full bg-primary flex-shrink-0 flex items-center justify-center border-2 border-white shadow-md">
                    <span class="font-label-sm text-white text-[10px]">3</span>
                </div>
                <div class="pb-2">
                    <span class="font-display text-lg text-on-surface">Corrigir & Iluminar</span><br/>
                    <span class="font-body-sm text-on-surface-variant">Aplique o corretivo apenas onde for necessário.</span>
                </div>
            </div>
            <div class="flex gap-5 relative z-10">
                <div class="w-7 h-7 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center border-2 border-white shadow-sm">
                    <span class="font-label-sm text-primary text-[10px]">4</span>
                </div>
                <div>
                    <span class="font-display text-lg text-on-surface">Toque Final</span><br/>
                    <span class="font-body-sm text-on-surface-variant">Pó de acabamento apenas na zona T.</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section>
      <div class="flex items-center justify-between border-b border-purple-50 pb-4 mb-8">
        <h2 class="font-display text-2xl text-on-surface">Produtos Utilizados</h2>
        <a class="font-label-md text-primary hover:underline underline-offset-4" href="#/home">Ver tudo</a>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <a href="#/product" class="group flex flex-col bg-white rounded-3xl overflow-hidden border border-purple-50 hover:shadow-2xl transition-all">
            <div class="aspect-square p-8 bg-purple-50/30 flex items-center justify-center relative">
                <img alt="Product" class="w-3/4 h-3/4 object-contain group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCePlXk1gZ0QwUza-t16Gu_5O8N43BKTeLClvx_7uJUEW4a88N6cuwgeNxUI3uyQXMO_yGKxXncdr8RXtxjtnpGhWVfUBogQWTzTWunHDT4XLzCtLv546hgkXS5pliimtIA06GHOvFif0kMXGbJzQJt4xFZJ9YGweNp_JgsGJFliXQGvNIjHOwGTJRXceWF3BNG4dHPPg71tioeyJNnKQ6aK_bQgGViLBBcWoha4SqTMORQdxbxlFD9KPidKq0pEZ1jwPVauy192RsJ"/>
            </div>
            <div class="p-6">
                <span class="font-label-xs text-primary uppercase tracking-[0.2em] font-bold text-[9px] block mb-2">Preparo</span>
                <h3 class="font-display text-lg text-on-surface mb-4">Botanical Hydrating Essence</h3>
                <div class="mt-auto flex justify-between items-center">
                    <span class="font-display text-xl text-on-surface font-bold">R$ 248,00</span>
                    <span class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg group-hover:bg-primary-container transition-colors">
                        <span class="material-symbols-outlined text-sm">add</span>
                    </span>
                </div>
            </div>
        </a>
        <a href="#/product" class="group flex flex-col bg-white rounded-3xl overflow-hidden border border-purple-50 hover:shadow-2xl transition-all">
            <div class="aspect-square p-8 bg-purple-50/30 flex items-center justify-center relative">
                <img alt="Product" class="w-3/4 h-3/4 object-contain group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFr3x_rZ0tMI6uZyDAz9yZDqcRfIhKpQiaUFZizzIBIe3l1OklsOMvBbVLtPcrzw-fcWIteouwkaVKp2aJRzyiboEGSy-PA7B41fdoELH2hvglNNhUH0LC5vN-u3yBaCuYkco9Q5WdwvpPc66Xpoa4J2BQ8C3eTvFq04pxZGc05rammvye3Z1_Nprf0LP610PfVniaFFkR2R3fUJTO3UIu23j5UD_cbmHDHMDCjBnAb7FGTeiuJvSYw6WNL5Jrp4ggMtsapCXguYsd"/>
            </div>
            <div class="p-6">
                <span class="font-label-xs text-primary uppercase tracking-[0.2em] font-bold text-[9px] block mb-2">Base</span>
                <h3 class="font-display text-lg text-on-surface mb-4">Luminous Silk Foundation</h3>
                <div class="mt-auto flex justify-between items-center">
                    <span class="font-display text-xl text-on-surface font-bold">R$ 365,00</span>
                    <span class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg group-hover:bg-primary-container transition-colors">
                        <span class="material-symbols-outlined text-sm">add</span>
                    </span>
                </div>
            </div>
        </a>
      </div>
    </section>
  </main>`;
}
