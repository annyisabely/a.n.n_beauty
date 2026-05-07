export default function aboutPage() {
  return `
  <main class="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12 flex flex-col gap-24">
    <section class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      <div class="md:col-span-6 relative rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[600px] border border-purple-50">
        <img alt="História da marca" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5uubQ87ze-UVPcOeqgw8V9zytPKuyAkWsvtbNQQbnIufU1fBspFtXWgOVL92KfJdQ5UQMMtTUN8CXgMbQxs7IX1ZVMXwQDTCWmkaEY_P9VTj0WOLPrsqdLb_3AkG-C4GLgj8rffxc1nL8hqI5GRLBPvvRnrc4Z-pn3e-A7PmzOIZsMa0FfFJlqxYNbN_hHY6Ex1Q5gdwW4w_PF5ZlUUYuCG2_owB8ML3_3ugLsXgu0ehPUIyaUZUVtOwRJO5lJTlHY476G9ZhdMMC"/>
        <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
      </div>
      <div class="md:col-span-5 md:col-start-8 flex flex-col gap-8 pt-8 md:pt-0">
        <span class="font-label-sm text-primary tracking-[0.3em] uppercase font-bold text-[10px]">A Gênese</span>
        <h1 class="font-display text-5xl text-on-surface leading-tight">Onde a Ciência se Harmoniza com o <span class="text-primary italic">Cuidado Sensorial.</span></h1>
        <p class="font-body-lg text-on-surface-variant leading-relaxed">Nascida do desejo de aliar a precisão da eficácia clínica à sofisticação de uma experiência de bem-estar exclusiva e personalizada.</p>
        <p class="font-body-md text-outline leading-relaxed italic">"Selecionamos criteriosamente ativos de alta performance, fundindo-os a bases botânicas suavizantes para conceber fórmulas que preservam a integridade e o equilíbrio da barreira cutânea."</p>
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white rounded-3xl p-12 shadow-xl border border-purple-50 relative overflow-hidden group">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div class="mb-8 h-16 w-16 rounded-2xl bg-purple-50 flex items-center justify-center text-primary shadow-sm">
            <span class="material-symbols-outlined text-[32px]" style="font-variation-settings:'FILL' 1;">spa</span>
        </div>
        <h2 class="font-display text-3xl text-on-surface mb-6 relative z-10">Nossa Missão</h2>
        <p class="font-body-md text-on-surface-variant relative z-10 leading-relaxed text-lg">Formular cuidados com a pele intransigentes que honram a complexidade da pele humana. Buscamos capacitar indivíduos através de produtos que oferecem integridade científica e luxo diário.</p>
      </div>
      <div class="bg-primary rounded-3xl p-12 shadow-xl relative overflow-hidden group">
        <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div class="mb-8 h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-sm">
            <span class="material-symbols-outlined text-[32px]" style="font-variation-settings:'FILL' 1;">visibility</span>
        </div>
        <h2 class="font-display text-3xl text-white mb-6 relative z-10">Nossa Visão</h2>
        <p class="font-body-md text-white/80 relative z-10 leading-relaxed text-lg">Redefinir a beleza de luxo como um espaço inclusivo onde o bem-estar holístico e o avanço dermatológico clínico coexistem perfeitamente.</p>
      </div>
    </section>

    <section class="flex flex-col gap-16 items-center py-12">
      <div class="text-center max-w-2xl">
        <span class="font-label-md text-secondary tracking-[0.2em] uppercase font-bold text-[11px]">O Coletivo</span>
        <h2 class="font-display text-5xl text-on-surface mt-4">Mentes por trás</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
        <div class="flex flex-col items-center text-center group">
          <div class="w-56 h-56 rounded-full overflow-hidden mb-8 shadow-2xl border-4 border-white transition-all group-hover:scale-105">
            <img alt="Anny" class="w-full h-full object-cover" src="img/anny.png"/>
          </div>
          <h3 class="font-display text-2xl text-on-surface mb-1">Anny Isabely Coradassi</h3>
          <p class="font-label-md text-primary mb-4 font-bold uppercase tracking-widest text-[10px]">Estudante</p>
          <p class="font-body-sm text-on-surface-variant px-6 italic">16 anos.</p>
        </div>
        <div class="flex flex-col items-center text-center group mt-0 md:mt-16">
          <div class="w-56 h-56 rounded-full overflow-hidden mb-8 shadow-2xl border-4 border-white transition-all group-hover:scale-105">
            <img alt="Nívea" class="w-full h-full object-cover" src="img/nivea.png"/>
          </div>
          <h3 class="font-display text-2xl text-on-surface mb-1">Nívea Caroline Matos</h3>
          <p class="font-label-md text-primary mb-4 font-bold uppercase tracking-widest text-[10px]">Estudante</p>
          <p class="font-body-sm text-on-surface-variant px-6 italic">17 anos.</p>
        </div>
        <div class="flex flex-col items-center text-center group">
          <div class="w-56 h-56 rounded-full overflow-hidden mb-8 shadow-2xl border-4 border-white transition-all group-hover:scale-105">
            <img alt="Nicoly" class="w-full h-full object-cover" src="img/nicoly.png"/>
          </div>
          <h3 class="font-display text-2xl text-on-surface mb-1">Nicoly Holtz</h3>
          <p class="font-label-md text-primary mb-4 font-bold uppercase tracking-widest text-[10px]">Estudante</p>
          <p class="font-body-sm text-on-surface-variant px-6 italic">16 anos.</p>
        </div>
      </div>
    </section>
  </main>`;
}
