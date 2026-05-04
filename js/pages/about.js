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
        <h1 class="font-display text-5xl text-on-surface leading-tight">Onde a Ciência Encontra o <span class="text-primary italic">Ritual Sensorial.</span></h1>
        <p class="font-body-lg text-on-surface-variant leading-relaxed">Nascida do desejo de unir a eficácia clínica com a elegância indulgente de um ritual de spa pessoal.</p>
        <p class="font-body-md text-outline leading-relaxed italic">"Selecionamos meticulosamente ativos de alta qualidade e os misturamos com bases botânicas calmantes para criar formulações que respeitam a barreira natural da pele."</p>
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
        <h2 class="font-display text-5xl text-on-surface mt-4">Mentes por trás do Ritual</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
        <div class="flex flex-col items-center text-center group">
          <div class="w-56 h-56 rounded-full overflow-hidden mb-8 shadow-2xl border-4 border-white transition-all group-hover:scale-105">
            <img alt="Fundadora" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD41q-VUnwu5joHMxbWJsr36dy1zx3rIn2vEK7uzvQTDUffwl0ZH_HI_dTANk1KbB9owXbG4r3zHuZ0HVyYdnrM_iCEs2T28ZeOaR08HylhHFMcLQ7HbG_Sie4x-YY2ALCH46qv813TkJWK1AuLKhbgI70JyZ3h_2uFi-BnVubhKdnicfILcz2wGII7oUz38OzHYvodmNc7KWNeyoqLmi7hoHDJdbzNFetGZrb5-7anzBucsvdu8yAwBxA_KgpzWQXgXaiSjTNilD4W"/>
          </div>
          <h3 class="font-display text-2xl text-on-surface mb-1">Dra. Amelia Vance</h3>
          <p class="font-label-md text-primary mb-4 font-bold uppercase tracking-widest text-[10px]">Formuladora Chefe</p>
          <p class="font-body-sm text-on-surface-variant px-6 italic">Mais de 15 anos em pesquisa dermatológica avançada.</p>
        </div>
        <div class="flex flex-col items-center text-center group mt-0 md:mt-16">
          <div class="w-56 h-56 rounded-full overflow-hidden mb-8 shadow-2xl border-4 border-white transition-all group-hover:scale-105">
            <img alt="Fundadora" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO6xTtoKDc0JC3ncQ5G6gPU5i7dh8zRhbuu-bYcmZkzkdgWEPVycowLmVELlrI_KpYIFmTapyFNEGQkUMHHJoBCnsIhg_GkMmiKrC7sCTyycWB7wdv1cRMaGo1ARPYa6pybiGQwZpIeShTMD8Cn8ESkA2uvPK6P-oBrVvKFoS5zUfvmBH0h6-JClb0d4lNUDluOYr5JI5c3PmgJl1N71o0yOWm1qMSsvU3LxAxFltJXUUSAIJLLVZ_2syzZvT4Me-Et4HkOpuIXinZ"/>
          </div>
          <h3 class="font-display text-2xl text-on-surface mb-1">Nina Reyes</h3>
          <p class="font-label-md text-primary mb-4 font-bold uppercase tracking-widest text-[10px]">Diretora Criativa</p>
          <p class="font-body-sm text-on-surface-variant px-6 italic">Traduz fundamentos clínicos em experiências luminosas.</p>
        </div>
        <div class="flex flex-col items-center text-center group">
          <div class="w-56 h-56 rounded-full overflow-hidden mb-8 shadow-2xl border-4 border-white transition-all group-hover:scale-105">
            <img alt="Fundadora" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeZyE00MRj_3vSbZ_vGNhXJ83aTkRnJ87wHSRJB82ICvA7HPYB002uwxlbAAeCbHYC4je203gIzdRB813EsoJYOvP8sexE4q30PPKYRntlcIXwDAMoQmz5TAB6IGDDkLL3IR8TIJkg1l3Zq31Yt8-8HJPeltIGWXTw4E1XwDVDIUdHaAvMPtIf0u9ZgfhDE1uolFfq9CJZrvEwpTWwDg-PSwubOx5vNhO0yUykpIIW1Abmk9u-xqPVxdFYq7QlHpGajAkdr5xtSaRv"/>
          </div>
          <h3 class="font-display text-2xl text-on-surface mb-1">Natalie Chen</h3>
          <p class="font-label-md text-primary mb-4 font-bold uppercase tracking-widest text-[10px]">Líder de Operações</p>
          <p class="font-body-sm text-on-surface-variant px-6 italic">Foco em fornecimento ético e embalagens sustentáveis.</p>
        </div>
      </div>
    </section>
  </main>`;
}
