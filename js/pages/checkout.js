import { auth } from '../auth.js';
import { cartManager } from '../cart_manager.js';
import { showToast } from '../components.js';

export default function checkoutPage() {
  window.handleOrderConfirmation = async (event) => {
    event.preventDefault();
    const name = event.target.querySelector('input[placeholder="Maria da Silva"]')?.value || 'Cliente';
    const email = document.getElementById('checkout-email').value;
    
    // Address data
    const address = {
        cep: document.getElementById('checkout-cep')?.value,
        rua: document.getElementById('checkout-rua')?.value,
        numero: document.getElementById('checkout-numero')?.value,
        complemento: document.getElementById('checkout-complemento')?.value,
        bairro: document.getElementById('checkout-bairro')?.value,
        cidade: document.getElementById('checkout-cidade')?.value,
    };

    // Payment data
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const paymentDetails = { method: paymentMethod };

    if (paymentMethod === 'cartao') {
        paymentDetails.cardName = document.getElementById('checkout-card-name')?.value;
        paymentDetails.cardNumber = document.getElementById('checkout-card-num')?.value;
        paymentDetails.cardBrand = document.getElementById('checkout-card-brand')?.value;
    } else if (paymentMethod === 'pix') {
        const pixFile = document.getElementById('checkout-pix-receipt')?.files[0];
        if (pixFile) {
            paymentDetails.pixReceipt = pixFile.name;
            // Lê o arquivo como base64
            paymentDetails.pixReceiptData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(pixFile);
            });
        } else {
            paymentDetails.pixReceipt = 'Sem comprovante anexado';
        }
    }

    const cartItems = cartManager.getCart();
    const subtotal = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
        return sum + (price * item.quantity);
    }, 0);
    
    // Benefit calculation
    let discount = cartManager.getDiscount(subtotal);
    let shipping = 15.90; // Standard shipping
    
    if (subtotal >= 100) {
        const benefitChoice = document.querySelector('input[name="benefit-choice"]:checked')?.value || 'frete';
        if (benefitChoice === 'frete') {
            shipping = 0;
        } else if (benefitChoice === 'desconto') {
            discount += subtotal * 0.20; // 20% discount
        }
    } else {
        // Assume default shipping if not over 100
        shipping = 15.90;
    }

    const total = subtotal - discount + shipping;
    const totalStr = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    // Calculate commissions (50% split for partners, Platform gets 100% of its own products + 50% of partners + shipping - discount)
    const commissions = {
        ann_beauty: shipping - discount // start with shipping and minus discount
    };

    cartItems.forEach(item => {
        const price = parseFloat(item.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
        const itemTotal = price * item.quantity;
        const companyId = item.company_id || 'ann_beauty';
        
        if (companyId === 'ann_beauty') {
            commissions['ann_beauty'] += itemTotal;
        } else {
            if (!commissions[companyId]) commissions[companyId] = 0;
            // 50% for the company
            commissions[companyId] += itemTotal * 0.5;
            // 50% for the platform
            commissions['ann_beauty'] += itemTotal * 0.5;
        }
    });

    const orderId = `#ANN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
        id: orderId,
        client: name,
        email: email,
        status: 'PENDENTE',
        value: totalStr,
        date: new Date().toLocaleDateString('pt-BR'),
        items: cartItems,
        address: address,
        payment: paymentDetails,
        commissions: commissions
    };

    const orders = JSON.parse(localStorage.getItem('ann_orders') || '[]');
    orders.unshift(newOrder);
    localStorage.setItem('ann_orders', JSON.stringify(orders));

    // Send purchase notification
    auth.sendNotification('Pedido Confirmado!', `Obrigada pela sua compra na Beleza na Web. Um e-mail de confirmação foi enviado para ${email}.`);
    
    // Redirect to tracking
    window.location.hash = '#/tracking';
    cartManager.clearCart();
    cartManager.clearCoupon();
  };

  window.applyDiscount = () => {
    const code = document.getElementById('coupon-input').value;
    const coupon = cartManager.applyCoupon(code);
    if (coupon) {
        showToast(`Cupom ${code} aplicado: ${coupon.value}% de desconto!`, 'success');
        renderCheckoutTotals();
    } else {
        showToast('Cupom inválido ou expirado.', 'error');
    }
  };

  window.renderCheckoutTotals = () => {
    const subtotal = cartManager.getCart().reduce((sum, item) => {
        const price = parseFloat(item.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
        return sum + (price * item.quantity);
    }, 0);
    let discount = cartManager.getDiscount(subtotal);
    const coupon = JSON.parse(sessionStorage.getItem('ann_active_coupon') || 'null');
    
    let shipping = 15.90;
    let benefitHTML = '';
    
    if (subtotal >= 100) {
        // Exibe opções de benefício
        benefitHTML = `
            <div class="my-4 p-4 bg-primary/10 rounded-xl border border-primary/20">
                <h4 class="font-bold text-primary text-sm mb-2 flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">celebration</span> Parabéns! Escolha seu benefício:</h4>
                <div class="flex flex-col gap-2">
                    <label class="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="benefit-choice" value="frete" class="accent-primary" checked onchange="window.renderCheckoutTotals()">
                        <span>Frete Grátis</span>
                    </label>
                    <label class="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="benefit-choice" value="desconto" class="accent-primary" onchange="window.renderCheckoutTotals()">
                        <span>20% de Desconto Adicional</span>
                    </label>
                </div>
            </div>
        `;
        
        // Verifica qual rádio está marcado (ou assume 'frete' como padrão se renderizando a primeira vez)
        const benefitChoiceNode = document.querySelector('input[name="benefit-choice"]:checked');
        const benefitChoice = benefitChoiceNode ? benefitChoiceNode.value : 'frete';
        
        if (benefitChoice === 'frete') {
            shipping = 0;
        } else if (benefitChoice === 'desconto') {
            discount += subtotal * 0.20;
        }
    }

    const total = subtotal - discount + shipping;

    const container = document.getElementById('checkout-summary');
    if (!container) return;

    container.innerHTML = `
        <h3 class="font-label-md text-label-md text-on-surface mb-4">Resumo do Pedido</h3>
        <div class="flex justify-between font-body-md text-on-surface-variant mb-2"><span>Subtotal</span><span class="text-on-surface">R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
        ${discount > 0 ? `<div class="flex justify-between font-body-md text-green-500 mb-2"><span>Descontos</span><span>- R$ ${discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>` : ''}
        <h3 class="font-bold text-on-surface mb-4">Resumo do Pedido</h3>
        <div class="flex justify-between text-sm text-on-surface-variant mb-2"><span>Subtotal</span><span class="text-on-surface">R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
        ${discount > 0 ? `<div class="flex justify-between text-sm text-secondary mb-2"><span>Descontos</span><span>- R$ ${discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>` : ''}
        <div class="flex justify-between text-sm text-on-surface-variant mb-2"><span>Frete</span><span class="${shipping === 0 ? 'text-secondary font-bold' : 'text-on-surface'}">${shipping === 0 ? 'Grátis' : `R$ ${shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</span></div>
        ${benefitHTML}
        <div class="border-t border-primary/10 pt-4 flex justify-between items-center"><span class="font-bold text-on-surface">Total</span><span class="text-xl font-bold text-primary">R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
    `;
  };

  setTimeout(window.renderCheckoutTotals, 50);
  return `
  <main class="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12 flex items-start justify-center min-h-screen bg-background">
    <div class="w-full max-w-3xl">
      <div class="text-center mb-10">
        <a href="#/home" class="text-3xl font-display font-semibold text-on-background mb-2 tracking-tighter inline-block hover:opacity-80 transition-all">Beleza na Web</a>
        <h2 class="text-xl font-display font-bold text-primary">Finalizar Compra</h2>
        <p class="text-sm text-on-surface-variant opacity-70 mt-2">Sua jornada de beleza está quase completa.</p>
      </div>
      <div class="bg-white/70 backdrop-blur-xl rounded-[40px] shadow-ethereal-hover p-8 md:p-12 border border-primary/5 relative overflow-hidden">
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary-container rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-container rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        
        <form class="relative z-10 flex flex-col gap-10" onsubmit="window.handleOrderConfirmation(event)">

          <!-- Dados Pessoais -->
          <div class="space-y-6">
            <h3 class="text-xs font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2"><span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1">person</span>Dados Pessoais</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="flex flex-col gap-2"><label class="text-xs font-bold text-on-surface ml-1">Nome Completo</label><input class="w-full bg-white border border-primary/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 py-3.5 px-5 text-sm text-on-surface transition-all placeholder:opacity-30 shadow-sm" placeholder="Maria da Silva" type="text" required/></div>
              <div class="flex flex-col gap-2"><label class="text-xs font-bold text-on-surface ml-1">CPF</label><input class="w-full bg-white border border-primary/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 py-3.5 px-5 text-sm text-on-surface transition-all placeholder:opacity-30 shadow-sm" placeholder="000.000.000-00" type="text" required/></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="flex flex-col gap-2"><label class="text-xs font-bold text-on-surface ml-1">Email</label><input id="checkout-email" class="w-full bg-white border border-primary/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 py-3.5 px-5 text-sm text-on-surface transition-all placeholder:opacity-30 shadow-sm" placeholder="maria@email.com" type="email" required/></div>
              <div class="flex flex-col gap-2"><label class="text-xs font-bold text-on-surface ml-1">Telefone</label><input class="w-full bg-white border border-primary/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 py-3.5 px-5 text-sm text-on-surface transition-all placeholder:opacity-30 shadow-sm" placeholder="(11) 99999-0000" type="tel" required/></div>
            </div>
          </div>

          <!-- Endereço -->
          <div class="space-y-6">
            <h3 class="text-xs font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2"><span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1">location_on</span>Endereço de Entrega</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div class="flex flex-col gap-2"><label class="text-xs font-bold text-on-surface ml-1">CEP</label><input id="checkout-cep" class="w-full bg-white border border-primary/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 py-3.5 px-5 text-sm text-on-surface transition-all placeholder:opacity-30 shadow-sm" placeholder="00000-000" type="text" required/></div>
              <div class="flex flex-col gap-2 md:col-span-2"><label class="text-xs font-bold text-on-surface ml-1">Rua</label><input id="checkout-rua" class="w-full bg-white border border-primary/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 py-3.5 px-5 text-sm text-on-surface transition-all placeholder:opacity-30 shadow-sm" placeholder="Rua das Flores" type="text" required/></div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div class="flex flex-col gap-2"><label class="text-xs font-bold text-on-surface ml-1">Número</label><input id="checkout-numero" class="w-full bg-white border border-primary/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 py-3.5 px-5 text-sm text-on-surface transition-all placeholder:opacity-30 shadow-sm" placeholder="123" type="text" required/></div>
              <div class="flex flex-col gap-2"><label class="text-xs font-bold text-on-surface ml-1">Complemento</label><input id="checkout-complemento" class="w-full bg-white border border-primary/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 py-3.5 px-5 text-sm text-on-surface transition-all placeholder:opacity-30 shadow-sm" placeholder="Apt 4B" type="text"/></div>
              <div class="flex flex-col gap-2"><label class="text-xs font-bold text-on-surface ml-1">Bairro</label><input id="checkout-bairro" class="w-full bg-white border border-primary/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 py-3.5 px-5 text-sm text-on-surface transition-all placeholder:opacity-30 shadow-sm" placeholder="Centro" type="text" required/></div>
              <div class="flex flex-col gap-2"><label class="text-xs font-bold text-on-surface ml-1">Cidade/UF</label><input id="checkout-cidade" class="w-full bg-white border border-primary/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 py-3.5 px-5 text-sm text-on-surface transition-all placeholder:opacity-30 shadow-sm" placeholder="São Paulo/SP" type="text" required/></div>
            </div>
          </div>

          <!-- Forma de Pagamento -->
          <div class="space-y-6">
            <h3 class="text-xs font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2"><span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1">payments</span>Forma de Pagamento</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="payment-methods">
              <label class="relative flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-primary bg-primary-container/30 cursor-pointer transition-all hover:shadow-lg">
                <input type="radio" name="payment" value="pix" checked class="absolute top-4 right-4 accent-primary w-4 h-4"/>
                <span class="material-symbols-outlined text-primary text-4xl" style="font-variation-settings: 'FILL' 1">qr_code_2</span>
                <div class="text-center"><span class="text-sm font-bold text-on-surface block">PIX</span><span class="text-[10px] text-on-surface-variant opacity-70">Aprovação imediata</span></div>
              </label>
              <label class="relative flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-primary/5 bg-white cursor-pointer transition-all hover:border-primary/20 hover:shadow-lg">
                <input type="radio" name="payment" value="boleto" class="absolute top-4 right-4 accent-primary w-4 h-4"/>
                <span class="material-symbols-outlined text-on-surface-variant text-4xl">receipt_long</span>
                <div class="text-center"><span class="text-sm font-bold text-on-surface block">Boleto</span><span class="text-[10px] text-on-surface-variant opacity-70">Em até 3 dias</span></div>
              </label>
              <label class="relative flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-primary/5 bg-white cursor-pointer transition-all hover:border-primary/20 hover:shadow-lg">
                <input type="radio" name="payment" value="cartao" class="absolute top-4 right-4 accent-primary w-4 h-4"/>
                <span class="material-symbols-outlined text-on-surface-variant text-4xl">credit_card</span>
                <div class="text-center"><span class="text-sm font-bold text-on-surface block">Cartão</span><span class="text-[10px] text-on-surface-variant opacity-70">Crédito/Débito</span></div>
              </label>
            </div>
            
            <div id="card-fields" class="hidden grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 p-6 bg-primary-container/10 rounded-3xl border border-primary/5">
              <div class="flex flex-col gap-2 md:col-span-2"><label class="text-xs font-bold text-on-surface ml-1">Nome no Cartão</label><input id="checkout-card-name" class="w-full bg-white border border-primary/10 rounded-2xl py-3.5 px-5 text-sm text-on-surface" placeholder="MARIA DA SILVA" type="text"/></div>
              <div class="flex flex-col gap-2 md:col-span-2"><label class="text-xs font-bold text-on-surface ml-1">Número do Cartão</label><input id="checkout-card-num" class="w-full bg-white border border-primary/10 rounded-2xl py-3.5 px-5 text-sm text-on-surface" placeholder="0000 0000 0000 0000" type="text"/></div>
              <div class="flex flex-col gap-2"><label class="text-xs font-bold text-on-surface ml-1">Bandeira</label>
                <select id="checkout-card-brand" class="w-full bg-white border border-primary/10 rounded-2xl py-3.5 px-5 text-sm text-on-surface outline-none">
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Elo">Elo</option>
                  <option value="Amex">American Express</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-2"><label class="text-xs font-bold text-on-surface ml-1">Validade</label><input id="checkout-card-val" class="w-full bg-white border border-primary/10 rounded-2xl py-3.5 px-5 text-sm text-on-surface" placeholder="MM/AA" type="text"/></div>
                <div class="flex flex-col gap-2"><label class="text-xs font-bold text-on-surface ml-1">CVV</label><input id="checkout-card-cvv" class="w-full bg-white border border-primary/10 rounded-2xl py-3.5 px-5 text-sm text-on-surface" placeholder="000" type="text"/></div>
              </div>
            </div>

            <div id="pix-fields" class="grid grid-cols-1 gap-4 mt-6 p-8 bg-primary-container/10 rounded-3xl border border-primary/5 text-center">
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                <span class="material-symbols-outlined text-3xl text-primary">qr_code_scanner</span>
              </div>
              <p class="text-sm text-on-surface"><span class="opacity-60">Chave PIX (Telefone):</span> <br><strong class="text-lg">41996190987</strong></p>
              <div class="flex flex-col items-center gap-3">
                <label class="text-xs font-bold text-primary bg-white px-6 py-3 rounded-full cursor-pointer hover:bg-primary-container transition-all shadow-sm border border-primary/10 flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">upload_file</span>Anexar Comprovante
                    <input id="checkout-pix-receipt" type="file" class="hidden" accept="image/*,.pdf" onchange="document.getElementById('pix-filename').textContent = this.files[0] ? this.files[0].name : ''" />
                </label>
                <span id="pix-filename" class="text-xs text-on-surface-variant font-bold opacity-60"></span>
              </div>
            </div>
          </div>

          <!-- Cupom -->
          <div class="bg-secondary-container/20 rounded-3xl p-6 border border-secondary/5">
            <h3 class="text-xs font-bold text-secondary mb-3 ml-1 uppercase tracking-widest">Resgatar Cupom</h3>
            <div class="flex gap-3">
                <input id="coupon-input" type="text" placeholder="CÓDIGO" class="flex-grow bg-white border border-secondary/10 rounded-2xl px-5 py-3 text-sm focus:border-secondary outline-none uppercase font-bold tracking-[0.2em] shadow-sm">
                <button type="button" onclick="window.applyDiscount()" class="bg-secondary text-white px-8 py-3 rounded-2xl text-xs font-bold hover:opacity-90 transition-all shadow-lg shadow-secondary/10">Aplicar</button>
            </div>
          </div>

          <!-- Resumo -->
          <div id="checkout-summary" class="bg-white/50 rounded-3xl p-8 border border-primary/5 shadow-sm">
            <!-- Rendered by renderCheckoutTotals -->
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4">
            <a class="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 group ml-4" href="#/cart">
                <span class="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                VOLTAR AO CARRINHO
            </a>
            <button class="w-full sm:w-auto bg-primary text-white py-4 px-12 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3" type="submit">
                FINALIZAR PEDIDO 
                <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1">check_circle</span>
            </button>
          </div>
        </form>
      </div>
      <div class="mt-8 flex justify-center items-center gap-8 text-on-surface-variant opacity-40">
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-[20px]">lock</span><span class="text-[10px] font-bold">100% SEGURO</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-[20px]">verified</span><span class="text-[10px] font-bold">CERTIFICADO SSL</span></div>
      </div>
    </div>
  </main>`;
}

// Payment method toggle logic
setTimeout(() => {
  const radios = document.querySelectorAll('input[name="payment"]');
  const cardFields = document.getElementById('card-fields');
  const pixFields = document.getElementById('pix-fields');
  const labels = document.querySelectorAll('#payment-methods label');
  if (!radios.length) return;

  radios.forEach(r => r.addEventListener('change', () => {
    labels.forEach(l => {
      l.classList.remove('border-primary', 'bg-primary-fixed/20');
      l.classList.add('border-outline-variant', 'bg-surface-container-lowest');
    });
    const active = r.closest('label');
    active.classList.remove('border-outline-variant', 'bg-surface-container-lowest');
    active.classList.add('border-primary', 'bg-primary-fixed/20');
    
    // Toggle Card Fields
    if (r.value === 'cartao') {
        if(cardFields) { cardFields.classList.remove('hidden'); cardFields.classList.add('grid'); }
    } else {
        if(cardFields) { cardFields.classList.add('hidden'); cardFields.classList.remove('grid'); }
    }
    
    // Toggle PIX fields
    if (r.value === 'pix') {
        if(pixFields) { pixFields.classList.remove('hidden'); pixFields.classList.add('grid'); }
    } else {
        if(pixFields) { pixFields.classList.add('hidden'); pixFields.classList.remove('grid'); }
    }
  }));
}, 100);
