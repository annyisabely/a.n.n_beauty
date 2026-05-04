export default function trackingPage() {
  return `
  <main class="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-10 py-12 relative">
    <div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary/10 opacity-20 blur-[120px] pointer-events-none z-0"></div>
    <div class="text-center mb-12 relative z-10">
      <h1 class="font-display text-4xl text-primary mb-3">Acompanhe seu Ritual</h1>
      <p class="font-body-lg text-on-surface-variant">Pedido <span class="font-label-md text-on-surface ml-1 px-4 py-1.5 bg-purple-50 rounded-full border border-purple-100 shadow-sm">#ANB-849201</span></p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
      <div class="lg:col-span-5 bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-purple-50 shadow-xl flex flex-col gap-6">
        <h2 class="font-display text-2xl text-on-surface border-b border-purple-50 pb-4">Sua Escolha Luminosa</h2>
        <div class="flex gap-4 items-center p-4 bg-purple-50/50 rounded-xl border border-purple-100">
          <div class="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-white shadow-sm">
            <img alt="Serum" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-nZbQxAEQakkIEXySpx5bHYjFw8eAb0Bl9o3OX3nXdr3RLcyX8F17enZsgWd4znKk8f7lbhykqJ_ahRLY0PcuVUUoCd3jaRZ1U6WqZqJFiwdoMi62PUqeuzfSXYeZRSmPFc198A9v9-fvKkgsbGguoBzyppIkDP__9mtXQbBDfl0mbZFNPOtpkf4IInS4E5DQ9NKHnh38HWItD3oCoy0PN7np0D9lcobgJEvmuEvjowwQrDVC2tYwbo8qB2qUQwCRuf7_Kpsu_n6q"/>
          </div>
          <div>
            <h3 class="font-display text-lg text-on-surface">Ethereal Glow Serum</h3>
            <p class="font-body-sm text-on-surface-variant">30ml</p>
            <p class="font-display text-primary mt-2 font-bold">R$ 185,00 <span class="font-body-sm text-on-surface-variant ml-2 font-normal">Qtd: 1</span></p>
          </div>
        </div>
        <div class="mt-auto pt-6 border-t border-purple-100 flex justify-between items-center">
            <span class="font-body-md text-on-surface-variant">Total Pago</span>
            <span class="font-display text-2xl text-primary font-bold">R$ 185,00</span>
        </div>
      </div>
      <div class="lg:col-span-7 bg-white/60 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-purple-50 shadow-xl">
        <h2 class="font-display text-2xl text-on-surface mb-8">Status da Entrega</h2>
        <div class="relative">
          <div class="absolute left-[27px] top-6 bottom-6 w-[2px] bg-purple-50 z-0"></div>
          <div class="absolute left-[27px] top-6 h-[55%] w-[2px] bg-primary z-0"></div>
          <div class="flex flex-col gap-10 relative z-10">
            <div class="flex items-start gap-6">
                <div class="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    <span class="material-symbols-outlined text-white" style="font-variation-settings:'FILL' 1;">inventory_2</span>
                </div>
                <div class="pt-1">
                    <h3 class="font-display text-lg text-on-surface">Pedido Confirmado</h3>
                    <p class="font-body-sm text-on-surface-variant">Recebemos sua seleção com carinho.</p>
                    <p class="font-label-sm text-outline mt-2 uppercase tracking-widest text-[10px]">24 Out, 09:41</p>
                </div>
            </div>
            <div class="flex items-start gap-6">
                <div class="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    <span class="material-symbols-outlined text-white" style="font-variation-settings:'FILL' 1;">storefront</span>
                </div>
                <div class="pt-1">
                    <h3 class="font-display text-lg text-on-surface">Em Preparação</h3>
                    <p class="font-body-sm text-on-surface-variant">Embalando seu ritual de luxo.</p>
                    <p class="font-label-sm text-outline mt-2 uppercase tracking-widest text-[10px]">25 Out, 14:15</p>
                </div>
            </div>
            <div class="flex items-start gap-6">
                <div class="w-14 h-14 rounded-full bg-white border-2 border-primary flex items-center justify-center shrink-0 shadow-xl ring-4 ring-primary/10">
                    <span class="material-symbols-outlined text-primary" style="font-variation-settings:'FILL' 1;">local_shipping</span>
                </div>
                <div class="pt-1">
                    <h3 class="font-display text-lg text-primary">A caminho de você</h3>
                    <p class="font-body-sm text-on-surface-variant">Sua encomenda está em rota de entrega.</p>
                    <div class="mt-4 bg-purple-50 rounded-xl p-4 border border-purple-100">
                        <p class="font-label-xs text-primary font-bold mb-1 uppercase tracking-widest">Localização Atual</p>
                        <p class="font-body-sm text-on-surface-variant flex items-center gap-2">
                            <span class="material-symbols-outlined text-[18px] text-primary">location_on</span>
                            Centro de Distribuição, São Paulo - SP
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex items-start gap-6 opacity-40">
                <div class="w-14 h-14 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-outline">check_circle</span>
                </div>
                <div class="pt-1">
                    <h3 class="font-display text-lg text-on-surface-variant">Entregue</h3>
                    <p class="font-body-sm text-outline">Pronto para o seu unboxing sensorial.</p>
                    <p class="font-label-sm text-outline mt-2 uppercase tracking-widest text-[10px]">Previsão: 28 Out</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>`;
}
