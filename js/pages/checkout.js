import { auth } from '../auth.js';
import { cartManager } from '../cart_manager.js';
import { showToast } from '../components.js';
import { database } from '../database.js';
import { getProductImage } from '../data_manager.js';

export default function checkoutPage() {
  const user = auth.getUser();
  const cartItems = cartManager.getCart();

  // If cart is empty, redirect back
  if (cartItems.length === 0) {
    setTimeout(() => {
      showToast('Seu carrinho está vazio.', 'error');
      window.location.hash = '#/cart';
    }, 50);
    return `<div class="min-h-screen bg-background flex items-center justify-center p-8"><div class="text-center font-bold text-primary">Carrinho vazio. Redirecionando...</div></div>`;
  }

  // Group items by company/vendor
  const groupedItems = {};
  cartItems.forEach(item => {
    const compId = item.company_id || 'ann_beauty';
    if (!groupedItems[compId]) {
      groupedItems[compId] = {
        company_name: item.company_name || 'Beleza na Web',
        items: [],
        subtotal: 0
      };
    }
    groupedItems[compId].items.push(item);
    const price = parseFloat(item.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
    groupedItems[compId].subtotal += (price * item.quantity);
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return sum + (price * item.quantity);
  }, 0);

  const discount = cartManager.getDiscount(subtotal);
  const activeCoupon = cartManager.getActiveCoupon();

  // Load calculated shipping from session or auto free shipping above R$ 199
  const isFreeShipping = subtotal >= 199;
  const storedShipping = JSON.parse(sessionStorage.getItem('ann_cart_shipping') || (isFreeShipping ? '{"transportadora":"Entrega Express Premium","valor":0,"prazo":"2 a 5 dias úteis"}' : 'null'));
  const storedCep = sessionStorage.getItem('ann_cart_cep') || '';

  // Retrieve Saved Checkout Data for Auto-fill
  let savedData = {};
  try {
    savedData = JSON.parse(localStorage.getItem('ann_saved_checkout_data') || '{}');
  } catch (e) {}

  const initialName = savedData.name || user?.name || '';
  const initialEmail = savedData.email || user?.email || '';
  const initialCpf = savedData.cpf || user?.cpf || '';
  const initialPhone = savedData.phone || user?.phone || '';
  const initialCep = savedData.cep || storedCep || '';
  const initialRua = savedData.rua || '';
  const initialNumero = savedData.numero || '';
  const initialComplemento = savedData.complemento || '';
  const initialBairro = savedData.bairro || '';
  const initialCidade = savedData.cidade || '';
  const hasSavedData = Boolean(savedData.name || savedData.cep);

  function resolveImg(item) {
    if (!item.img) return getProductImage(item.name, item.category);
    if (item.img.startsWith('http://') || item.img.startsWith('https://') || item.img.startsWith('img/') || item.img.startsWith('../') || item.img.startsWith('/')) {
      return item.img;
    }
    return 'https://lh3.googleusercontent.com/aida-public/' + item.img;
  }

  window.checkoutCalcularFrete = async () => {
    const input = document.getElementById('checkout-cep');
    if (!input || !input.value.trim()) {
      showToast('Por favor, informe o CEP', 'error');
      return;
    }
    const rawCep = input.value.trim().replace(/\D/g, '');
    if (rawCep.length !== 8) {
      showToast('CEP inválido. Digite 8 números.', 'error');
      return;
    }

    try {
      const resp = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const data = await resp.json();
      if (!data.erro) {
        if (data.logradouro && document.getElementById('checkout-rua')) document.getElementById('checkout-rua').value = data.logradouro;
        if (data.bairro && document.getElementById('checkout-bairro')) document.getElementById('checkout-bairro').value = data.bairro;
        if (data.localidade && document.getElementById('checkout-cidade')) document.getElementById('checkout-cidade').value = `${data.localidade}/${data.uf}`;
        showToast(`📍 Endereço preenchido: ${data.logradouro}`, 'success');
      }
    } catch (e) {}

    const result = cartManager.calculateShipping(rawCep);
    if (result) {
      sessionStorage.setItem('ann_cart_shipping', JSON.stringify(result));
      sessionStorage.setItem('ann_cart_cep', rawCep);
      showToast(`Frete calculado: R$ ${result.valor.toFixed(2).replace('.', ',')} (${result.transportadora})`, 'success');
      window.dispatchEvent(new CustomEvent('auth-change'));
    }
  };

  window.clearSavedCheckoutData = () => {
    localStorage.removeItem('ann_saved_checkout_data');
    showToast('Dados salvos limpos.', 'info');
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  window.handleOrderConfirmation = async (event) => {
    event.preventDefault();
    const name = document.getElementById('checkout-name')?.value || user?.name || 'Cliente';
    const email = document.getElementById('checkout-email')?.value || user?.email || 'cliente@email.com';
    const cpf = document.getElementById('checkout-cpf')?.value || '';
    const phone = document.getElementById('checkout-phone')?.value || '';
    
    const address = {
        cep: document.getElementById('checkout-cep')?.value || '',
        rua: document.getElementById('checkout-rua')?.value || '',
        numero: document.getElementById('checkout-numero')?.value || '',
        complemento: document.getElementById('checkout-complemento')?.value || '',
        bairro: document.getElementById('checkout-bairro')?.value || '',
        cidade: document.getElementById('checkout-cidade')?.value || '',
    };

    const saveAutoChecked = document.getElementById('checkout-save-auto')?.checked;
    if (saveAutoChecked) {
      localStorage.setItem('ann_saved_checkout_data', JSON.stringify({
        name, email, cpf, phone, ...address, saveAuto: true, updatedAt: new Date().toISOString()
      }));
    }

    const paymentMethodEl = document.querySelector('input[name="payment"]:checked');
    const paymentMethod = paymentMethodEl ? paymentMethodEl.value : 'pix';
    
    let paymentMethodLabel = 'PIX (Instantâneo)';
    if (paymentMethod === 'cartao_credito') paymentMethodLabel = 'Cartão de Crédito';
    else if (paymentMethod === 'cartao_debito') paymentMethodLabel = 'Cartão de Débito';
    else if (paymentMethod === 'boleto') paymentMethodLabel = 'Boleto Bancário';

    const shippingVal = storedShipping ? (isFreeShipping ? 0 : storedShipping.valor) : 0;
    const finalTotal = subtotal - discount + shippingVal;

    const keys = Object.keys(groupedItems);
    const baseOrderId = `ANN-${Math.floor(100000 + Math.random() * 900000)}`;
    const createdOrderIds = [];

    const allDbOrders = database.getOrders();

    keys.forEach((compId, index) => {
      const vendorData = groupedItems[compId];
      const vendorSubtotal = vendorData.subtotal;
      const ratio = vendorSubtotal / subtotal;
      const vendorDiscount = discount * ratio;
      const vendorShipping = shippingVal / keys.length;
      const vendorTotal = vendorSubtotal - vendorDiscount + vendorShipping;

      const suffix = compId.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'W');
      const subOrderId = `${baseOrderId}-${suffix}`;

      const newSubOrder = {
        id: subOrderId,
        clientId: user ? user.email : 'anonimo',
        clientName: name,
        storeName: vendorData.company_name,
        totalValue: vendorTotal,
        commissionValue: vendorTotal * 0.15,
        paymentMethod: paymentMethodLabel,
        status: 'PAGAMENTO CONFIRMADO',
        date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        items: JSON.stringify(vendorData.items),
        address: JSON.stringify(address)
      };

      allDbOrders.unshift(newSubOrder);
      createdOrderIds.push(subOrderId);
    });

    database.saveOrders(allDbOrders);

    const localOrders = JSON.parse(localStorage.getItem('ann_orders') || '[]');
    createdOrderIds.forEach(id => {
      const dbOrderObj = allDbOrders.find(o => o.id === id);
      if (dbOrderObj) {
        localOrders.unshift({
          ...dbOrderObj,
          items: JSON.parse(dbOrderObj.items),
          address: JSON.parse(dbOrderObj.address)
        });
      }
    });
    localStorage.setItem('ann_orders', JSON.stringify(localOrders));

    auth.sendNotification('Pedido Confirmado!', `Seu pedido foi confirmado com sucesso. Acompanhe a entrega em tempo real.`);

    cartManager.clearCart();
    cartManager.clearCoupon();
    sessionStorage.removeItem('ann_cart_shipping');

    showToast('🎉 Pedido realizado com sucesso!', 'success');
    setTimeout(() => {
      window.location.hash = `#/tracking?id=${baseOrderId}`;
    }, 800);
  };

  const currentShippingCost = storedShipping ? (isFreeShipping ? 0 : storedShipping.valor) : 0;
  const paymentVal = Math.max(0, subtotal - discount + currentShippingCost);
  const installments = paymentVal > 0 ? (paymentVal / 6).toFixed(2).replace('.', ',') : '0,00';

  return `
  <div class="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 py-6 w-full font-sans">
    
    <!-- ── ETAPAS DO PEDIDO ── -->
    <div class="flex items-center justify-center gap-2 sm:gap-6 mb-8 text-xs font-semibold select-none border-b border-[#DDD0E8] pb-5">
      <div class="flex items-center gap-2 text-emerald-700">
        <span class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">✓</span>
        <span class="hidden sm:inline">Sacola</span>
      </div>
      <span class="w-8 sm:w-16 h-[2px] bg-emerald-600"></span>
      <div class="flex items-center gap-2 text-[#8B5FBF]">
        <span class="w-6 h-6 rounded-full bg-[#8B5FBF] text-white flex items-center justify-center text-xs font-bold shadow-sm">2</span>
        <span class="font-bold">Confirmar Pedido</span>
      </div>
      <span class="w-8 sm:w-16 h-[2px] bg-[#DDD0E8]"></span>
      <div class="flex items-center gap-2 text-[#8E7C9E]">
        <span class="w-6 h-6 rounded-full bg-[#E8D8F4] text-[#5C4D6B] flex items-center justify-center text-xs font-bold">3</span>
        <span class="hidden sm:inline">Concluído</span>
      </div>
    </div>

    <!-- ── AUTO-FILL BANNER ── -->
    ${hasSavedData ? `
    <div class="bg-gradient-to-r from-[#E8D8F4] to-white p-4 rounded-2xl border border-[#DDD0E8] flex items-center justify-between gap-4 mb-6 shadow-sm">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-[#8B5FBF] text-2xl">bolt</span>
        <div>
          <span class="font-bold text-[#2D1A40] text-xs sm:text-sm block">1-Click Checkout: Seus dados foram preenchidos automaticamente</span>
          <span class="text-[11px] text-[#5C4D6B]">Endereço e dados fiscais prontos para envio.</span>
        </div>
      </div>
      <button type="button" onclick="window.clearSavedCheckoutData()" class="text-xs text-[#8B5FBF] font-bold hover:underline whitespace-nowrap">
        Alterar
      </button>
    </div>
    ` : ''}

    <form onsubmit="window.handleOrderConfirmation(event)" class="flex flex-col lg:flex-row gap-8 items-start">
      
      <!-- Coluna Esquerda: Endereço + Pagamento + Itens -->
      <div class="w-full lg:w-2/3 flex flex-col gap-6">

        <!-- 1. Card de Endereço -->
        <div class="bg-white rounded-3xl border border-[#DDD0E8] p-6 shadow-sm">
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-[#F0E6F7]">
            <h2 class="text-xs sm:text-sm font-bold text-[#2D1A40] uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[#8B5FBF] text-[20px]">location_on</span>
              1. Endereço de Entrega
            </h2>
            <span class="bg-[#E8D8F4] text-[#8B5FBF] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Endereço Padrão</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="flex flex-col gap-1">
              <label class="text-[11px] font-bold text-[#2D1A40]">Nome Completo *</label>
              <input id="checkout-name" class="w-full bg-[#F3EDF8] border border-[#DDD0E8] rounded-xl focus:border-[#8B5FBF] focus:bg-white py-2.5 px-3.5 text-xs text-[#2D1A40] outline-none transition-all font-medium" placeholder="Ex: Maria da Silva" type="text" value="${initialName}" required/>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] font-bold text-[#2D1A40]">CPF (Para Nota Fiscal) *</label>
              <input id="checkout-cpf" class="w-full bg-[#F3EDF8] border border-[#DDD0E8] rounded-xl focus:border-[#8B5FBF] focus:bg-white py-2.5 px-3.5 text-xs text-[#2D1A40] outline-none transition-all font-mono" placeholder="000.000.000-00" type="text" value="${initialCpf}" oninput="this.value=this.value.replace(/\\D/g,'').replace(/(\\d{3})(\\d)/,'$1.$2').replace(/(\\d{3})(\\d)/,'$1.$2').replace(/(\\d{3})(\\d{1,2})$/,'$1-$2').substring(0,14)" required/>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] font-bold text-[#2D1A40]">E-mail *</label>
              <input id="checkout-email" class="w-full bg-[#F3EDF8] border border-[#DDD0E8] rounded-xl focus:border-[#8B5FBF] focus:bg-white py-2.5 px-3.5 text-xs text-[#2D1A40] outline-none transition-all font-medium" placeholder="Ex: maria@email.com" type="email" value="${initialEmail}" required/>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] font-bold text-[#2D1A40]">Celular / WhatsApp *</label>
              <input id="checkout-phone" class="w-full bg-[#F3EDF8] border border-[#DDD0E8] rounded-xl focus:border-[#8B5FBF] focus:bg-white py-2.5 px-3.5 text-xs text-[#2D1A40] outline-none transition-all font-mono" placeholder="(00) 90000-0000" type="tel" value="${initialPhone}" oninput="this.value=this.value.replace(/\\D/g,'').replace(/(\\d{2})(\\d)/,'($1) $2').replace(/(\\d{5})(\\d)/,'$1-$2').substring(0,15)" required/>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="flex flex-col gap-1">
              <label class="text-[11px] font-bold text-[#2D1A40]">CEP *</label>
              <div class="flex gap-2">
                <input id="checkout-cep" class="w-full bg-[#F3EDF8] border border-[#DDD0E8] rounded-xl focus:border-[#8B5FBF] focus:bg-white py-2.5 px-3.5 text-xs text-[#2D1A40] outline-none transition-all font-mono" placeholder="00000-000" type="text" value="${initialCep}" oninput="this.value=this.value.replace(/\\D/g,'').replace(/(\\d{5})(\\d)/,'$1-$2').substring(0,9)" required/>
                <button type="button" onclick="window.checkoutCalcularFrete()" class="px-3.5 py-2 bg-[#8B5FBF] hover:bg-[#6B3FA0] text-white font-bold text-xs rounded-xl transition-all">Buscar</button>
              </div>
            </div>
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-[11px] font-bold text-[#2D1A40]">Rua / Logradouro *</label>
              <input id="checkout-rua" class="w-full bg-[#F3EDF8] border border-[#DDD0E8] rounded-xl focus:border-[#8B5FBF] focus:bg-white py-2.5 px-3.5 text-xs text-[#2D1A40] outline-none transition-all font-medium" placeholder="Ex: Rua das Flores" type="text" value="${initialRua}" required/>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div class="flex flex-col gap-1">
              <label class="text-[11px] font-bold text-[#2D1A40]">Número *</label>
              <input id="checkout-numero" class="w-full bg-[#F3EDF8] border border-[#DDD0E8] rounded-xl focus:border-[#8B5FBF] focus:bg-white py-2.5 px-3.5 text-xs text-[#2D1A40] outline-none transition-all" placeholder="123" type="text" value="${initialNumero}" required/>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] font-bold text-[#2D1A40]">Complemento</label>
              <input id="checkout-complemento" class="w-full bg-[#F3EDF8] border border-[#DDD0E8] rounded-xl focus:border-[#8B5FBF] focus:bg-white py-2.5 px-3.5 text-xs text-[#2D1A40] outline-none transition-all" placeholder="Apto 4B" type="text" value="${initialComplemento}"/>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] font-bold text-[#2D1A40]">Bairro *</label>
              <input id="checkout-bairro" class="w-full bg-[#F3EDF8] border border-[#DDD0E8] rounded-xl focus:border-[#8B5FBF] focus:bg-white py-2.5 px-3.5 text-xs text-[#2D1A40] outline-none transition-all" placeholder="Centro" type="text" value="${initialBairro}" required/>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] font-bold text-[#2D1A40]">Cidade / UF *</label>
              <input id="checkout-cidade" class="w-full bg-[#F3EDF8] border border-[#DDD0E8] rounded-xl focus:border-[#8B5FBF] focus:bg-white py-2.5 px-3.5 text-xs text-[#2D1A40] outline-none transition-all" placeholder="São Paulo/SP" type="text" value="${initialCidade}" required/>
            </div>
          </div>

          <!-- Auto-Salvar Dados -->
          <div class="flex items-center gap-2.5 pt-2">
            <input type="checkbox" id="checkout-save-auto" checked class="w-4 h-4 accent-[#8B5FBF] rounded cursor-pointer" />
            <label for="checkout-save-auto" class="text-xs text-[#5C4D6B] cursor-pointer select-none">
              <strong class="text-[#2D1A40]">Salvar como meu endereço padrão</strong> para compras futuras com 1 clique.
            </label>
          </div>
        </div>

        <!-- 2. Método de Pagamento -->
        <div class="bg-white rounded-3xl border border-[#DDD0E8] p-6 shadow-sm">
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-[#F0E6F7]">
            <h2 class="text-xs sm:text-sm font-bold text-[#2D1A40] uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[#8B5FBF] text-[20px]">payments</span>
              2. Método de Pagamento
            </h2>
            <span class="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">lock</span> 100% Criptografado
            </span>
          </div>

          <!-- Métodos de Pagamento Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5" id="payment-methods-grid">
            
            <!-- PIX -->
            <label class="relative flex items-center gap-3 p-4 rounded-2xl border-2 border-[#8B5FBF] bg-[#E8D8F4]/25 cursor-pointer transition-all">
              <input type="radio" name="payment" value="pix" checked class="accent-[#8B5FBF] w-4 h-4" onchange="window.checkoutTogglePaymentFields('pix')"/>
              <div class="flex-grow">
                <span class="text-xs font-bold text-[#2D1A40] block">PIX</span>
                <span class="text-[10px] text-emerald-700 font-bold block">Aprovação Instantânea</span>
              </div>
              <span class="material-symbols-outlined text-[#8B5FBF] text-2xl">qr_code</span>
            </label>

            <!-- Cartão de Crédito -->
            <label class="relative flex items-center gap-3 p-4 rounded-2xl border-2 border-[#DDD0E8] bg-white cursor-pointer transition-all hover:border-[#8B5FBF]">
              <input type="radio" name="payment" value="cartao_credito" class="accent-[#8B5FBF] w-4 h-4" onchange="window.checkoutTogglePaymentFields('cartao_credito')"/>
              <div class="flex-grow">
                <span class="text-xs font-bold text-[#2D1A40] block">Cartão de Crédito</span>
                <span class="text-[10px] text-[#5C4D6B] block">Até 6x Sem Juros</span>
              </div>
              <span class="material-symbols-outlined text-[#5C4D6B] text-2xl">credit_card</span>
            </label>

            <!-- Boleto -->
            <label class="relative flex items-center gap-3 p-4 rounded-2xl border-2 border-[#DDD0E8] bg-white cursor-pointer transition-all hover:border-[#8B5FBF]">
              <input type="radio" name="payment" value="boleto" class="accent-[#8B5FBF] w-4 h-4" onchange="window.checkoutTogglePaymentFields('boleto')"/>
              <div class="flex-grow">
                <span class="text-xs font-bold text-[#2D1A40] block">Boleto Bancário</span>
                <span class="text-[10px] text-[#5C4D6B] block">Vencimento em 3 dias</span>
              </div>
              <span class="material-symbols-outlined text-[#5C4D6B] text-2xl">barcode_scanner</span>
            </label>
          </div>

          <!-- Campos Dinâmicos -->
          <div id="fields-pix" class="payment-fields p-5 bg-[#F8F4FB] rounded-2xl border border-[#DDD0E8] text-center">
            <span class="material-symbols-outlined text-3xl text-[#8B5FBF] mb-2">qr_code_scanner</span>
            <p class="text-xs text-[#2D1A40] font-bold">Código Pix Copia e Cola gerado na confirmação</p>
            <p class="text-[11px] text-[#5C4D6B] mb-3">Abra o app do seu banco e pague com segurança.</p>
            <div class="bg-white rounded-xl p-3 border border-[#DDD0E8] font-mono text-[11px] select-all text-[#2D1A40]">
              00020101021226830014br.gov.bcb.pix2561api.annbeauty.com.br/pix/qr/ann-pay-41996190987-98425204000053039865802BR5915Beleza_na_Web6009Sao_Paulo62070503***6304AD3C
            </div>
          </div>

          <div id="fields-cartao_credito" class="payment-fields hidden grid grid-cols-1 md:grid-cols-2 gap-3.5 p-5 bg-[#F8F4FB] rounded-2xl border border-[#DDD0E8]">
            <div class="md:col-span-2">
              <label class="text-[11px] font-bold text-[#2D1A40] block mb-1">Nome no Cartão</label>
              <input class="w-full bg-white border border-[#DDD0E8] rounded-xl py-2 px-3 text-xs outline-none focus:border-[#8B5FBF]" placeholder="MARIA DA SILVA" type="text" />
            </div>
            <div class="md:col-span-2">
              <label class="text-[11px] font-bold text-[#2D1A40] block mb-1">Número do Cartão</label>
              <input class="w-full bg-white border border-[#DDD0E8] rounded-xl py-2 px-3 text-xs outline-none focus:border-[#8B5FBF] font-mono" placeholder="0000 0000 0000 0000" type="text" oninput="this.value=this.value.replace(/\\D/g,'').replace(/(\\d{4})(?=\\d)/g,'$1 ').substring(0,19)"/>
            </div>
            <div>
              <label class="text-[11px] font-bold text-[#2D1A40] block mb-1">Validade (MM/AA)</label>
              <input class="w-full bg-white border border-[#DDD0E8] rounded-xl py-2 px-3 text-xs outline-none focus:border-[#8B5FBF] font-mono" placeholder="MM/AA" type="text" maxlength="5" oninput="this.value=this.value.replace(/\\D/g,'').replace(/(\\d{2})(\\d)/,'$1/$2').substring(0,5)"/>
            </div>
            <div>
              <label class="text-[11px] font-bold text-[#2D1A40] block mb-1">CVV</label>
              <input class="w-full bg-white border border-[#DDD0E8] rounded-xl py-2 px-3 text-xs outline-none focus:border-[#8B5FBF] font-mono" placeholder="000" type="password" maxlength="4"/>
            </div>
          </div>

          <div id="fields-boleto" class="payment-fields hidden p-5 bg-[#F8F4FB] rounded-2xl border border-[#DDD0E8] text-center">
            <span class="material-symbols-outlined text-3xl text-[#8B5FBF] mb-2">receipt</span>
            <p class="text-xs text-[#2D1A40] font-bold">Boleto Bancário</p>
            <p class="text-[11px] text-[#5C4D6B] mb-2">Linha digitável disponível após clicar em Fazer Pedido.</p>
          </div>
        </div>

        <!-- 3. Vitrine dos Itens do Pedido -->
        <div class="bg-white rounded-3xl border border-[#DDD0E8] p-6 shadow-sm">
          <div class="flex items-center justify-between pb-3 mb-4 border-b border-[#F0E6F7]">
            <h2 class="text-xs sm:text-sm font-bold text-[#2D1A40] uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-[#8B5FBF] text-[20px]">shopping_bag</span>
              3. Itens do Pedido (${cartItems.length})
            </h2>
            <a href="#/cart" class="text-xs font-bold text-[#8B5FBF] hover:underline">Editar Sacola</a>
          </div>

          <div class="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            ${cartItems.map(item => {
              const imgSrc = resolveImg(item);
              return `
              <div class="w-20 sm:w-24 flex-shrink-0 bg-[#F8F4FB] rounded-2xl p-2 border border-[#DDD0E8] flex flex-col items-center text-center">
                <img src="${imgSrc}" alt="${item.name}" class="w-14 h-14 object-contain mb-1">
                <span class="text-[10px] font-bold text-[#2D1A40] line-clamp-1 w-full">${item.name}</span>
                <span class="text-[9px] text-[#5C4D6B]">Qtd: ${item.quantity}</span>
                <span class="text-[10px] font-bold text-[#8B5FBF] mt-0.5">${item.price}</span>
              </div>`;
            }).join('')}
          </div>
        </div>

      </div>

      <!-- Coluna Direita: Resumo do Pedido -->
      <div class="w-full lg:w-1/3 sticky top-6">
        <div class="bg-white rounded-3xl border border-[#DDD0E8] p-6 shadow-md">
          
          <h2 class="text-xs sm:text-sm font-bold text-[#2D1A40] uppercase tracking-wider mb-4 pb-3 border-b border-[#DDD0E8]">
            Detalhes do Pagamento
          </h2>

          <div class="space-y-3 text-xs text-[#5C4D6B]">
            <div class="flex justify-between">
              <span>Subtotal dos Produtos</span>
              <span class="text-[#2D1A40] font-bold">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
            </div>

            ${discount > 0 ? `
            <div class="flex justify-between text-emerald-700 font-bold">
              <span>Cupom (${activeCoupon ? activeCoupon.code : 'Desconto'})</span>
              <span>- R$ ${discount.toFixed(2).replace('.', ',')}</span>
            </div>
            ` : ''}

            <div class="flex justify-between">
              <span>Garantia de Envio Seguro</span>
              <span class="text-emerald-700 font-bold">GRÁTIS</span>
            </div>

            <div class="flex justify-between">
              <span>Frete de Envio</span>
              <span class="font-bold ${isFreeShipping ? 'text-emerald-700' : 'text-[#2D1A40]'}">
                ${isFreeShipping ? 'GRÁTIS' : (storedShipping ? `R$ ${storedShipping.valor.toFixed(2).replace('.', ',')}` : 'R$ 15,00')}
              </span>
            </div>

            <!-- Total -->
            <div class="pt-4 border-t-2 border-[#DDD0E8] mt-4">
              <div class="flex justify-between items-baseline mb-1">
                <span class="text-sm font-bold text-[#2D1A40]">Total a Pagar</span>
                <span class="text-2xl font-bold text-[#8B5FBF]">R$ ${paymentVal.toFixed(2).replace('.', ',')}</span>
              </div>
              <p class="text-[11px] text-right text-[#5C4D6B]">em até <strong class="text-[#2D1A40]">6x de R$ ${installments}</strong> sem juros</p>
            </div>

            <!-- Botão FAZER PEDIDO -->
            <button type="submit" class="w-full bg-[#8B5FBF] hover:bg-[#6B3FA0] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-purple-900/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider hover:-translate-y-0.5 active:translate-y-0 mt-4">
              <span class="material-symbols-outlined text-[18px]">lock</span> FAZER PEDIDO 🔒
            </button>

            <!-- Selos -->
            <div class="pt-4 border-t border-[#DDD0E8] space-y-2 text-[10px] text-[#5C4D6B] text-center">
              <p>Ao clicar em "Fazer Pedido", você concorda com os Termos de Venda e Política de Privacidade.</p>
              <div class="flex items-center justify-center gap-3 pt-1 text-emerald-700 font-bold">
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">shield</span> Compra Protegida</span>
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">verified</span> Devolução Fácil</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </form>

  </div>`;
}

export function mount() {
  window.checkoutTogglePaymentFields = (method) => {
    document.querySelectorAll('.payment-fields').forEach(el => el.classList.add('hidden'));
    const selected = document.getElementById(`fields-${method}`);
    if (selected) selected.classList.remove('hidden');

    const labels = document.querySelectorAll('#payment-methods-grid label');
    labels.forEach(l => {
      l.classList.remove('border-[#8B5FBF]', 'bg-[#E8D8F4]/25');
      l.classList.add('border-[#DDD0E8]', 'bg-white');
    });
    
    const activeRadio = document.querySelector(`input[value="${method}"]`);
    if (activeRadio) {
      const activeLabel = activeRadio.closest('label');
      if (activeLabel) {
        activeLabel.classList.remove('border-[#DDD0E8]', 'bg-white');
        activeLabel.classList.add('border-[#8B5FBF]', 'bg-[#E8D8F4]/25');
      }
    }
  };

  const cepInput = document.getElementById('checkout-cep');
  if (cepInput) {
    cepInput.addEventListener('input', (e) => {
      const clean = e.target.value.replace(/\D/g, '');
      if (clean.length === 8) {
        window.checkoutCalcularFrete();
      }
    });
  }
}
