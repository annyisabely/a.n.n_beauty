export default function favoritesPage() {
  const favs = [
    {name:'Luminous Night Serum',desc:'Reparação noturna restauradora',price:'R$ 128,00',badge:'Últimas unidades',img:'AB6AXuC4GA_67aY1N7hA37Z_u0SZTtDvmQgZXuI0IKCpWWDwQsAXhjglwF-D42Qcs01tgkoSC6D8xlCvN6yA6-ejFb0LHExM4IcIsLX0_bZ6lkpq9KEObhgQAXww5vLvCIpjlTFlXD3OqgpVeAy6WcSXOuAV6cNn4ZJ4JPqWocLYuSTtSctBBEG7ex1kpvMBJyL1aooq9sSovS72j_rwf67cdFVy9q5RzAgu6OdprTZWdSZy0q1ZXhfcK6PpCO3fqzA9G_f4Gan5cOJUesao'},
    {name:'Ethereal Hydration Cream',desc:'Barreira de hidratação profunda',price:'R$ 85,00',img:'AB6AXuDH73IxZc-wW9MebvJPSiKSaysCLwGfJ_uVChy9knx7JdBtqj0aMGb5CAsdcPwqPCVgVLSK-4N-V9HvC7pfy7S7p5CnpqvHBtAcVdaLPL68NzuSwyPbn62GlQvIOoooz9_LtxZu1HzBiCITyvYdd6W8PtDkIVJsbW7jXLwHh_LnkCIN5MC8xBH1a62XTH4_CKCc2tZX9KwA8sEBCmC8dvnnu87WI9zwOY3_nPTA7hzkoSxgN2EL4OBgiTONdoHbGsUYNIk4qyTpN6H-'},
    {name:'Velvet Matte Lip Color',desc:'Tom: Dusk Rose',price:'R$ 42,00',badge:'Bestseller',img:'AB6AXuCmGynp0tWFLudcUkNPCCNyCdh-6xgbI5v1HlfT8vTijKv7-ycl_F7x-t_5ERsdDHB2cxB3rB5mnL_uriv5me7i8YaFKrsCzeGprrFAJA1chrXqw9sCjfejNeVfPcpXxtWpPTOLdgEnClOtYNBe3uxCZPhHUnVcESDS5lzlOW8DH3O2kUWYkiCScH0RlVMUXGhMOYLLu05gimWPpPVheqszRzq8jhe6RzvR7VqbO-WX5AJZeBZTFwvGr4S4-o5HuDFORM68VKHU58ff'},
  ];
  const cards = favs.map(p => `
    <article class="bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 border border-purple-50 flex flex-col">
      <div class="relative aspect-[4/5] bg-purple-50 overflow-hidden p-2">
        <img alt="${p.name}" class="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/${p.img}"/>
        <button class="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full text-red-500 shadow-sm"><span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">favorite</span></button>
        ${p.badge?`<span class="absolute bottom-4 left-4 bg-primary text-white font-label-sm text-label-sm px-3 py-1 rounded-full shadow-md">${p.badge}</span>`:''}
      </div>
      <div class="p-6 flex flex-col flex-grow">
        <h3 class="font-display text-xl text-on-surface mb-1">${p.name}</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant mb-4">${p.desc}</p>
        <div class="mt-auto flex items-end justify-between">
          <span class="font-display text-xl text-primary font-bold">${p.price}</span>
          <a href="#/cart" class="text-primary font-label-md flex items-center gap-2 hover:opacity-70 transition-opacity">
            Adicionar <span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
          </a>
        </div>
      </div>
    </article>`).join('');

  return `
  <main class="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12">
    <header class="mb-12 text-center md:text-left">
      <h1 class="font-display text-5xl text-on-surface mb-3">Sua Coleção</h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl italic">"Uma seleção curada das suas formulações mais desejadas."</p>
    </header>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">${cards}</div>
  </main>`;
}
