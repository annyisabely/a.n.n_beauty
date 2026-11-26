import { auth } from '../auth.js';
import { database } from '../database.js';

export default function trackingPage() {
  const user = auth.getUser();
  
  // Read order ID from URL query parameters (e.g. #/tracking?id=ANN-123456)
  const hashQuery = window.location.hash.split('?')[1] || '';
  const urlParams = new URLSearchParams(hashQuery);
  const urlOrderId = urlParams.get('id') || '';

  // Get orders: fetch from SQLite database and merge/fallback to client localStorage
  let allOrders = [];
  try {
    allOrders = database.getOrders();
  } catch (e) {
    console.error('Error loading orders from SQLite:', e);
  }

  // Also read from localStorage to ensure we have the absolute latest user orders
  const localOrdersStr = localStorage.getItem('ann_orders') || '[]';
  const localOrders = JSON.parse(localOrdersStr);

  // Merge SQLite orders and localStorage orders, preferring SQLite if ID matches
  const mergedOrders = [...localOrders];
  allOrders.forEach(dbOrder => {
    // If order has JSON strings, parse them
    let parsedItems = [];
    let parsedAddress = {};
    try {
      parsedItems = typeof dbOrder.items === 'string' ? JSON.parse(dbOrder.items) : dbOrder.items;
      parsedAddress = typeof dbOrder.address === 'string' ? JSON.parse(dbOrder.address) : dbOrder.address;
    } catch (err) {
      console.warn('Failed to parse items or address for order', dbOrder.id, err);
    }

    const cleanedOrder = {
      ...dbOrder,
      items: parsedItems,
      address: parsedAddress
    };

    const existingIdx = mergedOrders.findIndex(o => o.id === dbOrder.id);
    if (existingIdx > -1) {
      mergedOrders[existingIdx] = cleanedOrder;
    } else {
      mergedOrders.push(cleanedOrder);
    }
  });

  // Filter orders belonging to current client
  const clientEmail = user ? user.email.toLowerCase() : 'anonimo';
  const clientOrders = mergedOrders.filter(o => 
    o.clientId === clientEmail || 
    (o.email && o.email.toLowerCase() === clientEmail) ||
    o.clientId === 'anonimo'
  );

  if (clientOrders.length === 0) {
    return `
    <main class="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-10 py-20 text-center">
      <div class="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <span class="material-symbols-outlined text-4xl text-purple-300">receipt_long</span>
      </div>
      <h1 class="font-display text-3xl text-on-background mb-4">Nenhum Pedido Encontrado</h1>
      <p class="text-sm text-on-surface-variant max-w-sm mx-auto mb-8 opacity-75">Você ainda não realizou nenhuma compra ou não há registros de pedidos nesta conta.</p>
      <a href="#/home" class="bg-primary text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-all">
        Voltar à Loja
      </a>
    </main>`;
  }

  // Find the selected/active order
  let activeOrder = null;
  let relatedSubOrders = [];

  if (urlOrderId) {
    // If order ID is exact or prefix (e.g. parent ID was ANN-123456 and sub-orders are ANN-123456-GLW)
    relatedSubOrders = clientOrders.filter(o => o.id.startsWith(urlOrderId));
    if (relatedSubOrders.length > 0) {
      // Default to the first sub-order
      activeOrder = relatedSubOrders[0];
    } else {
      activeOrder = clientOrders.find(o => o.id === urlOrderId);
    }
  }

  // Fallback to most recent order if not found or no ID in URL
  if (!activeOrder) {
    activeOrder = clientOrders[0];
    relatedSubOrders = clientOrders.filter(o => o.id.substring(0, 10) === activeOrder.id.substring(0, 10));
  }

  // Render tracking steps based on status
  const currentStatus = activeOrder.status ? activeOrder.status.toUpperCase() : 'PENDENTE';
  
  // Status check helper
  const isStepDone = (stepName) => {
    const statuses = ['PAGAMENTO CONFIRMADO', 'PREPARANDO', 'EM PREPARAÇÃO', 'ENVIADO', 'SAIU PARA ENTREGA', 'ENTREGUE'];
    const activeIdx = statuses.indexOf(currentStatus);
    
    if (stepName === 'PAGAMENTO') {
      return activeIdx >= 0; // step 0 is payment confirmed
    }
    if (stepName === 'PREPARACAO') {
      return activeIdx >= 1; // step 1/2 is preparing or further
    }
    if (stepName === 'ENVIADO') {
      return activeIdx >= 3; // step 3 is shipped or further
    }
    if (stepName === 'ENTREGA') {
      return activeIdx >= 4; // step 4 is out for delivery or further
    }
    if (stepName === 'ENTREGUE') {
      return activeIdx >= 5; // step 5 is delivered
    }
    return false;
  };

  // Render list of items
  const items = activeOrder.items || [];
  const itemsHTML = items.map(item => {
    const imgSrc = item.img && item.img.startsWith('http') ? item.img : 'https://lh3.googleusercontent.com/aida-public/' + (item.img || '');
    return `
    <div class="flex gap-4 items-center p-4 bg-white/70 rounded-3xl border border-purple-100/50 hover:shadow-sm transition-all duration-300">
      <div class="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-purple-50 to-pink-50 p-2 border border-purple-100/40">
        <img alt="${item.name}" class="w-full h-full object-contain mix-blend-multiply" src="${imgSrc}"/>
      </div>
      <div class="flex-grow min-w-0">
        <h3 class="font-bold text-sm text-on-background truncate leading-tight">${item.name}</h3>
        <p class="text-[10px] text-on-surface-variant font-medium mt-1 uppercase tracking-wider">${activeOrder.storeName || 'Loja Parceira'}</p>
        <div class="flex justify-between items-center mt-2.5">
          <span class="text-xs text-primary font-bold">${item.price}</span>
          <span class="text-[10px] bg-purple-50 text-primary border border-purple-100 font-bold px-2 py-0.5 rounded-md">Qtd: ${item.quantity}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  // Delivery Address parsing
  const addr = activeOrder.address || {};
  const addressString = addr.rua ? `${addr.rua}, Nº ${addr.numero} ${addr.complemento ? ' - ' + addr.complemento : ''}<br>${addr.bairro} - ${addr.cidade}<br>CEP: ${addr.cep}` : 'Endereço não disponível';

  return `
  <main class="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-10 py-12 relative">
    <div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary/10 opacity-20 blur-[120px] pointer-events-none z-0"></div>
    
    <div class="text-center mb-10 relative z-10">
      <h1 class="font-display text-3xl md:text-4xl text-primary font-bold mb-3">Acompanhe seu Pedido</h1>
      <p class="font-body-lg text-on-surface-variant">Pedido principal <span class="font-label-md text-on-surface ml-1 px-4 py-1.5 bg-primary/5 text-primary rounded-full border border-primary/10 shadow-sm font-bold uppercase tracking-widest">#${activeOrder.id.split('-')[0]}</span></p>
    </div>

    <!-- Múltiplos Vendedores Tab Selector -->
    ${relatedSubOrders.length > 1 ? `
    <div class="mb-10 p-5 bg-white/70 backdrop-blur-md rounded-3xl border border-primary/10 shadow-sm max-w-3xl mx-auto z-10 relative">
      <div class="flex items-center gap-2 mb-3">
        <span class="material-symbols-outlined text-primary text-[20px]" style="font-variation-settings: 'FILL' 1">storefront</span>
        <span class="text-xs font-bold text-on-surface">Este pedido contém produtos de ${relatedSubOrders.length} lojas parceiras:</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${relatedSubOrders.map(subOrder => {
          const isSelected = subOrder.id === activeOrder.id;
          return `
          <button onclick="window.checkoutSwitchSubOrder('${subOrder.id}')" 
            class="flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left ${isSelected ? 'border-primary bg-primary-container/20 shadow-sm' : 'border-purple-100/50 bg-white hover:border-primary/20'}">
            <div class="min-w-0">
              <span class="text-xs font-bold text-on-surface block truncate">${subOrder.storeName}</span>
              <span class="text-[10px] text-primary font-bold uppercase tracking-wider block mt-0.5">${subOrder.status}</span>
            </div>
            <span class="material-symbols-outlined text-[18px] text-primary">
              ${isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
          </button>`;
        }).join('')}
      </div>
    </div>
    ` : ''}

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 max-w-6xl mx-auto">
      
      <!-- Detalhes do Sub-Pedido -->
      <div class="lg:col-span-5 bg-white/40 backdrop-blur-xl rounded-[40px] p-8 border border-primary/5 shadow-md flex flex-col gap-6 self-start">
        <div class="border-b border-primary/10 pb-4 flex items-center justify-between">
          <div>
            <h2 class="font-display text-xl text-on-background font-bold">Resumo da Entrega</h2>
            <span class="text-[10px] font-bold text-primary uppercase tracking-widest mt-1 block">${activeOrder.storeName}</span>
          </div>
          <button onclick="window.openSellerChatModal('${activeOrder.storeId || 'ann_official'}', '${(activeOrder.storeName || 'Loja Parceira').replace(/'/g, "\\'")}', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100', { type: 'order', orderId: '${activeOrder.id || 'PED-2026'}', storeName: '${(activeOrder.storeName || 'Loja Parceira').replace(/'/g, "\\'")}' })" class="px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary hover:text-white text-primary text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs" title="Falar com o vendedor sobre esta entrega">
            <span class="material-symbols-outlined text-[15px]">chat</span>
            <span class="hidden sm:inline">Falar com Vendedor</span>
          </button>
        </div>

        <div class="flex flex-col gap-3">
          ${itemsHTML}
        </div>

        <!-- Endereço de Entrega -->
        <div class="p-5 bg-white/70 rounded-3xl border border-purple-100/40 space-y-2 mt-2">
          <h4 class="text-xs font-bold text-on-surface flex items-center gap-1.5 uppercase tracking-wider">
            <span class="material-symbols-outlined text-[16px] text-primary">location_on</span>
            Endereço de Entrega
          </h4>
          <p class="text-xs text-on-surface-variant leading-relaxed font-medium">
            ${addressString}
          </p>
        </div>

        <!-- Forma de Envio e Pagamento -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-white/70 rounded-3xl border border-purple-100/40">
            <span class="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider mb-1">Método</span>
            <span class="text-xs font-bold text-on-surface block">${activeOrder.paymentMethod || 'PIX'}</span>
          </div>
          <div class="p-4 bg-white/70 rounded-3xl border border-purple-100/40">
            <span class="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider mb-1">Envio</span>
            <span class="text-xs font-bold text-on-surface block truncate" title="Entrega rápida garantida">Expedição Parceira</span>
          </div>
        </div>

        <div class="pt-6 border-t border-primary/10 flex justify-between items-center px-2">
            <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Deste Vendedor</span>
            <span class="font-display text-2xl text-primary font-bold">R$ ${parseFloat(activeOrder.totalValue || 0).toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      <!-- Linha do Tempo Logística -->
      <div class="lg:col-span-7 bg-white/40 backdrop-blur-xl rounded-[40px] p-8 md:p-12 border border-primary/5 shadow-md">
        <h2 class="font-display text-2xl text-on-background font-bold mb-10">Histórico de Rastreamento</h2>
        
        <div class="relative">
          <!-- Linha vertical de progresso -->
          <div class="absolute left-[27px] top-6 bottom-6 w-[4px] bg-slate-200 rounded-full z-0"></div>
          
          <!-- Linha vertical preenchida dependendo do status -->
          <div class="absolute left-[27px] top-6 w-[4px] bg-gradient-to-b from-primary to-purple-500 rounded-full z-0 transition-all duration-1000 shadow-md shadow-primary/20"
            style="height: ${
              isStepDone('ENTREGUE') ? '100%' :
              isStepDone('ENTREGA') ? '75%' :
              isStepDone('ENVIADO') ? '50%' :
              isStepDone('PREPARACAO') ? '25%' : '0%'
            };"
          ></div>
          
          <div class="flex flex-col gap-10 relative z-10">
            
            <!-- Etapa 1: Pagamento Confirmado -->
            <div class="flex items-start gap-6 group transition-all duration-300">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-md ${
                isStepDone('PAGAMENTO') ? 'bg-primary text-white shadow-primary/30 scale-105' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }">
                <span class="material-symbols-outlined text-2xl" style="font-variation-settings:'FILL' 1;">payments</span>
              </div>
              <div class="pt-1">
                <h3 class="text-base font-bold transition-colors ${isStepDone('PAGAMENTO') ? 'text-on-background' : 'text-slate-400'}">Pagamento Confirmado</h3>
                <p class="text-xs text-on-surface-variant font-medium mt-0.5 opacity-70">O pagamento foi aprovado no sistema e o pedido gerado.</p>
                ${isStepDone('PAGAMENTO') ? `<span class="text-[9px] font-bold text-primary bg-primary/5 border border-primary/10 uppercase tracking-widest mt-2 inline-block px-2.5 py-0.5 rounded-full">${activeOrder.date}</span>` : ''}
              </div>
            </div>
            
            <!-- Etapa 2: Preparaçao -->
            <div class="flex items-start gap-6 group transition-all duration-300">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-md ${
                isStepDone('PREPARACAO') ? 'bg-primary text-white shadow-primary/30 scale-105' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }">
                <span class="material-symbols-outlined text-2xl" style="font-variation-settings:'FILL' 1;">inventory</span>
              </div>
              <div class="pt-1">
                <h3 class="text-base font-bold transition-colors ${isStepDone('PREPARACAO') ? 'text-on-background' : 'text-slate-400'}">Preparando o Pedido</h3>
                <p class="text-xs text-on-surface-variant font-medium mt-0.5 opacity-70">O vendedor está separando os produtos e preparando a embalagem.</p>
                ${isStepDone('PREPARACAO') ? `<span class="text-[9px] font-bold text-primary bg-primary/5 border border-primary/10 uppercase tracking-widest mt-2 inline-block px-2.5 py-0.5 rounded-full">Atualizado</span>` : ''}
              </div>
            </div>
            
            <!-- Etapa 3: Enviado -->
            <div class="flex items-start gap-6 group transition-all duration-300">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-md ${
                isStepDone('ENVIADO') ? 'bg-primary text-white shadow-primary/30 scale-105' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }">
                <span class="material-symbols-outlined text-2xl" style="font-variation-settings:'FILL' 1;">local_shipping</span>
              </div>
              <div class="pt-1">
                <h3 class="text-base font-bold transition-colors ${isStepDone('ENVIADO') ? 'text-on-background' : 'text-slate-400'}">Pedido Enviado</h3>
                <p class="text-xs text-on-surface-variant font-medium mt-0.5 opacity-70">O pacote foi despachado e está em posse da transportadora.</p>
                ${isStepDone('ENVIADO') ? `<span class="text-[9px] font-bold text-primary bg-primary/5 border border-primary/10 uppercase tracking-widest mt-2 inline-block px-2.5 py-0.5 rounded-full">Em Rota</span>` : ''}
              </div>
            </div>

            <!-- Etapa 4: Saiu para Entrega -->
            <div class="flex items-start gap-6 group transition-all duration-300">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-md ${
                isStepDone('ENTREGA') ? 'bg-primary text-white shadow-primary/30 scale-105' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }">
                <span class="material-symbols-outlined text-2xl" style="font-variation-settings:'FILL' 1;">home_pin</span>
              </div>
              <div class="pt-1">
                <h3 class="text-base font-bold transition-colors ${isStepDone('ENTREGA') ? 'text-on-background' : 'text-slate-400'}">Saiu para Entrega</h3>
                <p class="text-xs text-on-surface-variant font-medium mt-0.5 opacity-70">O entregador está a caminho do seu endereço de entrega.</p>
                ${isStepDone('ENTREGA') ? `<span class="text-[9px] font-bold text-primary bg-primary/5 border border-primary/10 uppercase tracking-widest mt-2 inline-block px-2.5 py-0.5 rounded-full">Hoje</span>` : ''}
              </div>
            </div>
            
            <!-- Etapa 5: Entregue -->
            <div class="flex items-start gap-6 group transition-all duration-300">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-md ${
                isStepDone('ENTREGUE') ? 'bg-emerald-500 text-white shadow-emerald-500/30 scale-105' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }">
                <span class="material-symbols-outlined text-2xl" style="font-variation-settings:'FILL' 1;">verified</span>
              </div>
              <div class="pt-1">
                <h3 class="text-base font-bold transition-colors ${isStepDone('ENTREGUE') ? 'text-emerald-600' : 'text-slate-400'}">Experiência Entregue</h3>
                <p class="text-xs text-on-surface-variant font-medium mt-0.5 opacity-70">O pedido foi entregue no endereço e está pronto para o unboxing sensorial.</p>
                ${isStepDone('ENTREGUE') ? `<span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 uppercase tracking-widest mt-2 inline-block px-2.5 py-0.5 rounded-full">Concluído</span>` : ''}
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </main>`;
}

export function mount() {
  // Allow switching suborders
  window.checkoutSwitchSubOrder = (subOrderId) => {
    window.location.hash = `#/tracking?id=${subOrderId}`;
  };
}
