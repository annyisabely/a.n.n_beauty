export default function trackingPage() {
  const currentDate = new Date();
  
  // Helper to format date like "22 Jun"
  const formatDate = (date) => {
      const parts = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).split(' ');
      // Handle different formats on different browsers/os (some use 'de', some add dots)
      let month = parts.length > 1 ? parts[parts.length - 1] : parts[0];
      month = month.replace('.', '');
      return `${date.getDate().toString().padStart(2, '0')} ${month.charAt(0).toUpperCase() + month.slice(1)}`;
  };

  const dateConfirmed = new Date(currentDate);
  dateConfirmed.setDate(currentDate.getDate() - 2);

  const datePrep = new Date(currentDate);
  datePrep.setDate(currentDate.getDate() - 1);
  
  const dateDelivery = new Date(currentDate);
  dateDelivery.setDate(currentDate.getDate() + 3);

  const orderNum = Math.floor(Math.random() * 900000) + 100000;

  return `
  <main class="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-10 py-12 relative">
    <div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary/10 opacity-20 blur-[120px] pointer-events-none z-0"></div>
    <div class="text-center mb-12 relative z-10">
      <h1 class="font-display text-4xl text-primary mb-3">Acompanhe seu Ritual</h1>
      <p class="font-body-lg text-on-surface-variant">Pedido <span class="font-label-md text-on-surface ml-1 px-4 py-1.5 bg-primary/5 text-primary rounded-full border border-primary/10 shadow-sm font-bold uppercase tracking-widest">#ANB-${orderNum}</span></p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
      <div class="lg:col-span-5 bg-white/40 backdrop-blur-xl rounded-[48px] p-10 md:p-12 border border-primary/5 shadow-ethereal flex flex-col gap-8">
        <h2 class="font-display text-2xl text-on-background border-b border-primary/10 pb-6">Detalhes do Ritual</h2>
        <div class="flex gap-6 items-center p-6 bg-primary-container/10 rounded-[32px] border border-primary/5 group hover:shadow-ethereal-hover transition-all duration-500">
          <div class="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-white shadow-sm p-4">
            <img alt="Serum" class="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-nZbQxAEQakkIEXySpx5bHYjFw8eAb0Bl9o3OX3nXdr3RLcyX8F17enZsgWd4znKk8f7lbhykqJ_ahRLY0PcuVUUoCd3jaRZ1U6WqZqJFiwdoMi62PUqeuzfSXYeZRSmPFc198A9v9-fvKkgsbGguoBzyppIkDP__9mtXQbBDfl0mbZFNPOtpkf4IInS4E5DQ9NKHnh38HWItD3oCoy0PN7np0D9lcobgJEvmuEvjowwQrDVC2tYwbo8qB2qUQwCRuf7_Kpsu_n6q"/>
          </div>
          <div class="space-y-1">
            <h3 class="font-display text-xl text-on-background">Ethereal Glow Serum</h3>
            <p class="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">30ml • Frasco de Vidro</p>
            <p class="font-display text-primary mt-3 font-bold text-lg">R$ 185,00 <span class="text-[10px] text-on-surface-variant ml-2 font-black opacity-30 uppercase tracking-widest">QTD: 1</span></p>
          </div>
        </div>
        <div class="mt-auto pt-8 border-t border-primary/10 flex justify-between items-center px-4">
            <span class="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Valor de Investimento</span>
            <span class="font-display text-3xl text-primary font-bold">R$ 185,00</span>
        </div>
      </div>
      <div class="lg:col-span-7 bg-white/40 backdrop-blur-xl rounded-[48px] p-10 md:p-14 border border-primary/5 shadow-ethereal">
        <h2 class="font-display text-3xl text-on-background mb-12">Logística de <span class="italic text-primary font-medium">Belo Prazer</span></h2>
        <div class="relative">
          <div class="absolute left-[31px] top-6 bottom-6 w-[4px] bg-primary/5 rounded-full z-0"></div>
          <div class="absolute left-[31px] top-6 h-[60%] w-[4px] bg-gradient-to-b from-primary to-secondary rounded-full z-0 shadow-lg shadow-primary/20"></div>
          
          <div class="flex flex-col gap-12 relative z-10">
            <div class="flex items-start gap-8 group">
                <div class="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                    <span class="material-symbols-outlined text-white text-3xl" style="font-variation-settings:'FILL' 1;">inventory_2</span>
                </div>
                <div class="pt-1">
                    <h3 class="font-display text-xl text-on-background group-hover:text-primary transition-colors">Manifesto Confirmado</h3>
                    <p class="text-sm text-on-surface-variant font-medium opacity-70">Sua seleção foi processada em nosso ecossistema.</p>
                    <p class="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mt-3 bg-primary/5 inline-block px-3 py-1 rounded-full">${formatDate(dateConfirmed)} • 09:41</p>
                </div>
            </div>
            
            <div class="flex items-start gap-8 group">
                <div class="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                    <span class="material-symbols-outlined text-white text-3xl" style="font-variation-settings:'FILL' 1;">auto_fix_high</span>
                </div>
                <div class="pt-1">
                    <h3 class="font-display text-xl text-on-background group-hover:text-primary transition-colors">Em Curadoria</h3>
                    <p class="text-sm text-on-surface-variant font-medium opacity-70">O ritual de embalagem sensorial está em curso.</p>
                    <p class="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mt-3 bg-primary/5 inline-block px-3 py-1 rounded-full">${formatDate(datePrep)} • 14:15</p>
                </div>
            </div>
            
            <div class="flex items-start gap-8 group">
                <div class="w-16 h-16 rounded-3xl bg-white border-2 border-primary flex items-center justify-center shrink-0 shadow-ethereal-hover ring-8 ring-primary/5 group-hover:scale-110 transition-all duration-500">
                    <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings:'FILL' 1;">local_shipping</span>
                </div>
                <div class="pt-1">
                    <h3 class="font-display text-xl text-primary font-bold">Expedição a Caminho</h3>
                    <p class="text-sm text-on-surface-variant font-medium opacity-80">Sua essência está em rota de encontro com você.</p>
                    
                    <div class="mt-6 bg-white/40 backdrop-blur-xl rounded-[28px] p-6 border border-primary/10 shadow-sm relative overflow-hidden group/card hover:shadow-ethereal transition-all duration-500">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <p class="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-3">Geolocalização Clinical</p>
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse shrink-0">
                                <span class="material-symbols-outlined text-[20px]">location_on</span>
                            </div>
                            <div>
                                <span class="text-sm font-bold text-on-background block">Curitiba, PR</span>
                                <span class="text-xs text-on-surface-variant font-medium mt-0.5 opacity-80">Rota principal de expedição</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex items-start gap-8 opacity-30 grayscale group">
                <div class="w-16 h-16 rounded-3xl bg-primary-container/20 flex items-center justify-center shrink-0 border border-primary/10">
                    <span class="material-symbols-outlined text-primary/40 text-3xl">verified</span>
                </div>
                <div class="pt-1">
                    <h3 class="font-display text-xl text-on-background">Experiência Entregue</h3>
                    <p class="text-sm text-on-surface-variant font-medium">Prepare seu ritual para o unboxing sensorial.</p>
                    <p class="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mt-3 border border-primary/10 inline-block px-3 py-1 rounded-full italic">Previsão: ${formatDate(dateDelivery)}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>`;
}
