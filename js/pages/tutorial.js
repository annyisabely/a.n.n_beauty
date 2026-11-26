export default function tutorialPage() {
  return `
  <main class="max-w-[1280px] mx-auto px-4 md:px-10 py-16 flex flex-col gap-16 bg-background">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <!-- Main Content -->
      <div class="lg:col-span-8 flex flex-col gap-10">
        <div class="relative w-full aspect-video rounded-[48px] overflow-hidden shadow-ethereal-hover bg-white border border-primary/5 group">
          <video id="tutorial-video" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" controls poster="https://lh3.googleusercontent.com/aida-public/AB6AXuBJvWHcVtwfwVsd2d8xMLYDGJSdfs_xQjDQK4v3BAh2cLubVbi5UR-SbhZqM6QPy28aPz1posNZ02tSe00oVWoxUBQPGK5WEX7G8g6Egmrbe_0n2pcLUU5JguQkxvoKKXcP0Gwh00cHZPafDqP36MgQ0rkhrJmwTUMROJ_HP0NH5JEO-WjhWE9RUt5dLyms9bXZ6FOxRluIDKBvHoE9T8luSGPJKr8Bhs8NXx1Tq9tJyfmVBZliJ6fWiVvBu6Kshv9fTSiNGb0Gcpgk">
            <source src="galeria_de_v_deos_a.n.n_beauty/videos/Maquiagem Simples com Bianca_720p_caption.mp4" type="video/mp4">
            Seu navegador não suporta o elemento de vídeo.
          </video>
          <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
        
        <div class="space-y-6">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">RITUAL CINEMATOGRÁFICO</div>
            <h1 class="font-display text-4xl md:text-5xl text-on-background tracking-tighter">Maquiagem Simples com <span class="italic text-primary font-medium">Bianca</span></h1>
            <p class="text-base md:text-lg text-on-surface-variant max-w-3xl leading-relaxed font-medium opacity-80">Aprenda técnicas de maquiagem simples e elegante com a Bianca neste tutorial exclusivo. Descubra como valorizar sua beleza natural com passos fáceis e acessíveis, usando nossa linha clinical-chic.</p>
        </div>
      </div>

      <!-- Summary Sidebar -->
      <div class="lg:col-span-4">
        <div class="bg-white/60 backdrop-blur-xl rounded-[40px] p-10 shadow-ethereal border border-white/50 flex flex-col h-full sticky top-[100px]">
          <h2 class="font-display text-2xl text-on-background mb-10 border-b border-primary/10 pb-6">Roteiro de Beleza</h2>
          <div class="flex flex-col gap-8 relative">
            <div class="absolute left-4 top-2 bottom-2 w-px bg-primary/10"></div>
            
            <div class="flex gap-6 relative z-10 group">
                <div class="w-8 h-8 rounded-full bg-primary text-white flex-shrink-0 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span class="text-[10px] font-black">01</span>
                </div>
                <div class="space-y-1">
                    <span class="text-sm font-bold text-on-background group-hover:text-primary transition-colors">Preparo da Pele</span><br/>
                    <span class="text-[11px] text-on-surface-variant font-medium opacity-80">Aplique a Essência Hidratante pressionando suavemente.</span>
                </div>
            </div>

            <div class="flex gap-6 relative z-10 group">
                <div class="w-8 h-8 rounded-full bg-primary text-white flex-shrink-0 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span class="text-[10px] font-black">02</span>
                </div>
                <div class="space-y-1">
                    <span class="text-sm font-bold text-on-background group-hover:text-primary transition-colors">Base Luminosa</span><br/>
                    <span class="text-[11px] text-on-surface-variant font-medium opacity-80">Misture 2 gotas de Serum Iluminador com sua base.</span>
                </div>
            </div>

            <div class="flex gap-6 relative z-10 group">
                <div class="w-8 h-8 rounded-full bg-primary text-white flex-shrink-0 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span class="text-[10px] font-black">03</span>
                </div>
                <div class="space-y-1">
                    <span class="text-sm font-bold text-on-background group-hover:text-primary transition-colors">Corrigir & Iluminar</span><br/>
                    <span class="text-[11px] text-on-surface-variant font-medium opacity-80">Aplique o corretivo apenas onde for necessário.</span>
                </div>
            </div>

            <div class="flex gap-6 relative z-10 group">
                <div class="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex-shrink-0 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <span class="text-[10px] font-black">04</span>
                </div>
                <div class="space-y-1">
                    <span class="text-sm font-bold text-on-background group-hover:text-secondary transition-colors">Toque Final</span><br/>
                    <span class="text-[11px] text-on-surface-variant font-medium opacity-80">Pó de acabamento apenas na zona T para fixação.</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Section -->
    <section class="mt-8">
      <div class="flex items-center justify-between border-b border-primary/10 pb-6 mb-12">
        <h2 class="font-display text-3xl text-on-background">Kit do Ritual</h2>
        <a class="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:text-secondary transition-colors" href="#/search">Ver Vitrine Completa</a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <a href="#/product" class="group flex flex-col bg-white rounded-[40px] overflow-hidden border border-primary/5 hover:shadow-ethereal-hover transition-all duration-700">
            <div class="aspect-square p-10 bg-primary-container/10 flex items-center justify-center relative">
                <img alt="Product" class="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCePlXk1gZ0QwUza-t16Gu_5O8N43BKTeLClvx_7uJUEW4a88N6cuwgeNxUI3uyQXMO_yGKxXncdr8RXtxjtnpGhWVfUBogQWTzTWunHDT4XLzCtLv546hgkXS5pliimtIA06GHOvFif0kMXGbJzQJt4xFZJ9YGweNp_JgsGJFliXQGvNIjHOwGTJRXceWF3BNG4dHPPg71tioeyJNnKQ6aK_bQgGViLBBcWoha4SqTMORQdxbxlFD9KPidKq0pEZ1jwPVauy192RsJ"/>
            </div>
            <div class="p-8">
                <span class="text-[9px] font-black text-primary uppercase tracking-[0.2em] block mb-2">PREPARO</span>
                <h3 class="font-display text-xl text-on-background mb-6 line-clamp-1">Botanical Essence</h3>
                <div class="mt-auto flex justify-between items-center">
                    <span class="text-xl font-display font-bold text-primary">R$ 248,00</span>
                    <span class="w-10 h-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        <span class="material-symbols-outlined text-[18px]">add</span>
                    </span>
                </div>
            </div>
        </a>
        <a href="#/product" class="group flex flex-col bg-white rounded-[40px] overflow-hidden border border-primary/5 hover:shadow-ethereal-hover transition-all duration-700">
            <div class="aspect-square p-10 bg-secondary/5 flex items-center justify-center relative">
                <img alt="Product" class="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFr3x_rZ0tMI6uZyDAz9yZDqcRfIhKpQiaUFZizzIBIe3l1OklsOMvBbVLtPcrzw-fcWIteouwkaVKp2aJRzyiboEGSy-PA7B41fdoELH2hvglNNhUH0LC5vN-u3yBaCuYkco9Q5WdwvpPc66Xpoa4J2BQ8C3eTvFq04pxZGc05rammvye3Z1_Nprf0LP610PfVniaFFkR2R3fUJTO3UIu23j5UD_cbmHDHMDCjBnAb7FGTeiuJvSYw6WNL5Jrp4ggMtsapCXguYsd"/>
            </div>
            <div class="p-8">
                <span class="text-[9px] font-black text-secondary uppercase tracking-[0.2em] block mb-2">LOOK GLOW</span>
                <h3 class="font-display text-xl text-on-background mb-6 line-clamp-1">Luminous Foundation</h3>
                <div class="mt-auto flex justify-between items-center">
                    <span class="text-xl font-display font-bold text-primary">R$ 365,00</span>
                    <span class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        <span class="material-symbols-outlined text-[18px]">shopping_bag</span>
                    </span>
                </div>
            </div>
        </a>
      </div>
    </section>
  </main>`;
}
