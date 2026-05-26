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
    auth.sendNotification('Pedido Confirmado!', `Obrigada pela sua compra na A.n.n Beauty. Um e-mail de confirmação foi enviado para ${email}.`);
    
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
        <div class="flex justify-between font-body-md text-on-surface-variant mb-2"><span>Frete</span><span class="${shipping === 0 ? 'text-green-500 font-bold' : 'text-on-surface'}">${shipping === 0 ? 'Grátis' : `R$ ${shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</span></div>
        ${benefitHTML}
        <div class="border-t border-outline-variant/30 pt-4 flex justify-between items-center"><span class="font-headline-md text-on-surface">Total</span><span class="font-headline-md text-primary">R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
    `;
  };

  setTimeout(window.renderCheckoutTotals, 50);
  return `
  <main class="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12 flex items-start justify-center min-h-screen bg-background">
    <div class="w-full max-w-3xl">
      <div class="text-center mb-10">
        <a href="#/home" class="font-display-lg text-display-lg text-primary-container mb-3 tracking-widest italic inline-block hover:opacity-80 transition-opacity">A.n.n Beauty</a>
        <h2 class="font-headline-md text-headline-md text-on-surface-variant">Finalizar Compra</h2>
        <p class="font-body-md text-body-md text-outline mt-2">Preencha seus dados para concluir o pedido.</p>
      </div>
      <div class="glass-panel ambient-shadow rounded-xl p-6 md:p-10 border border-surface-variant/50 relative overflow-hidden">
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
        <form class="relative z-10 flex flex-col gap-8" onsubmit="window.handleOrderConfirmation(event)">

          <!-- Dados Pessoais -->
          <div class="space-y-4">
            <h3 class="font-label-md text-label-md text-primary uppercase tracking-widest border-b border-surface-variant pb-2 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">person</span>Dados Pessoais</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-on-surface-variant">Nome Completo</label><input class="w-full bg-surface-container-low border border-surface-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container py-3 px-4 font-body-md text-on-surface transition-colors" placeholder="Maria da Silva" type="text" required/></div>
              <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-on-surface-variant">CPF</label><input class="w-full bg-surface-container-low border border-surface-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container py-3 px-4 font-body-md text-on-surface transition-colors" placeholder="000.000.000-00" type="text" required/></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-on-surface-variant">Email</label><input id="checkout-email" class="w-full bg-surface-container-low border border-surface-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container py-3 px-4 font-body-md text-on-surface transition-colors" placeholder="maria@email.com" type="email" required/></div>
              <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-on-surface-variant">Telefone</label><input class="w-full bg-surface-container-low border border-surface-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container py-3 px-4 font-body-md text-on-surface transition-colors" placeholder="(11) 99999-0000" type="tel" required/></div>
            </div>
          </div>
          ... (rest of the form content)

          <!-- Endereço -->
          <div class="space-y-4">
            <h3 class="font-label-md text-label-md text-primary uppercase tracking-widest border-b border-surface-variant pb-2 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">location_on</span>Endereço de Entrega</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-on-surface-variant">CEP</label><input id="checkout-cep" class="w-full bg-surface-container-low border border-surface-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container py-3 px-4 font-body-md text-on-surface transition-colors" placeholder="00000-000" type="text" required/></div>
              <div class="flex flex-col gap-1.5 md:col-span-2"><label class="font-label-md text-label-md text-on-surface-variant">Rua</label><input id="checkout-rua" class="w-full bg-surface-container-low border border-surface-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container py-3 px-4 font-body-md text-on-surface transition-colors" placeholder="Rua das Flores" type="text" required/></div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-on-surface-variant">Número</label><input id="checkout-numero" class="w-full bg-surface-container-low border border-surface-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container py-3 px-4 font-body-md text-on-surface transition-colors" placeholder="123" type="text" required/></div>
              <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-on-surface-variant">Complemento</label><input id="checkout-complemento" class="w-full bg-surface-container-low border border-surface-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container py-3 px-4 font-body-md text-on-surface transition-colors" placeholder="Apt 4B" type="text"/></div>
              <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-on-surface-variant">Bairro</label><input id="checkout-bairro" class="w-full bg-surface-container-low border border-surface-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container py-3 px-4 font-body-md text-on-surface transition-colors" placeholder="Centro" type="text" required/></div>
              <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-on-surface-variant">Cidade/UF</label><input id="checkout-cidade" class="w-full bg-surface-container-low border border-surface-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container py-3 px-4 font-body-md text-on-surface transition-colors" placeholder="São Paulo/SP" type="text" required/></div>
            </div>
          </div>

          <!-- Forma de Pagamento -->
          <div class="space-y-4">
            <h3 class="font-label-md text-label-md text-primary uppercase tracking-widest border-b border-surface-variant pb-2 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">payments</span>Forma de Pagamento</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3" id="payment-methods">
              <label class="relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-primary bg-primary-fixed/20 cursor-pointer transition-all hover:shadow-md">
                <input type="radio" name="payment" value="pix" checked class="absolute top-3 right-3 accent-primary w-4 h-4"/>
                <span class="material-symbols-outlined text-primary text-3xl">qr_code_2</span>
                <div class="text-center"><span class="font-label-md text-label-md text-on-surface block">PIX</span><span class="font-body-sm text-body-sm text-on-surface-variant">Aprovação instantânea</span></div>
              </label>
              <label class="relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-outline-variant bg-surface-container-lowest cursor-pointer transition-all hover:border-primary hover:shadow-md">
                <input type="radio" name="payment" value="boleto" class="absolute top-3 right-3 accent-primary w-4 h-4"/>
                <span class="material-symbols-outlined text-on-surface-variant text-3xl">receipt_long</span>
                <div class="text-center"><span class="font-label-md text-label-md text-on-surface block">Boleto</span><span class="font-body-sm text-body-sm text-on-surface-variant">Até 3 dias úteis</span></div>
              </label>
              <label class="relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-outline-variant bg-surface-container-lowest cursor-pointer transition-all hover:border-primary hover:shadow-md">
                <input type="radio" name="payment" value="cartao" class="absolute top-3 right-3 accent-primary w-4 h-4"/>
                <span class="material-symbols-outlined text-on-surface-variant text-3xl">credit_card</span>
                <div class="text-center"><span class="font-label-md text-label-md text-on-surface block">Cartão</span><span class="font-body-sm text-body-sm text-on-surface-variant">Crédito ou Débito</span></div>
              </label>
            </div>
            <!-- Card fields (shown when cartão selected) -->
            <div id="card-fields" class="hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant/30">
              <div class="flex flex-col gap-1.5 md:col-span-2"><label class="font-label-md text-label-md text-on-surface-variant">Nome Impresso no Cartão</label><input id="checkout-card-name" class="w-full bg-surface-container-lowest border border-surface-variant rounded-lg py-3 px-4 font-body-md text-on-surface" placeholder="MARIA DA SILVA" type="text"/></div>
              <div class="flex flex-col gap-1.5 md:col-span-2"><label class="font-label-md text-label-md text-on-surface-variant">Número do Cartão</label><input id="checkout-card-num" class="w-full bg-surface-container-lowest border border-surface-variant rounded-lg py-3 px-4 font-body-md text-on-surface" placeholder="0000 0000 0000 0000" type="text"/></div>
              <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-on-surface-variant">Bandeira</label>
                <select id="checkout-card-brand" class="w-full bg-surface-container-lowest border border-surface-variant rounded-lg py-3 px-4 font-body-md text-on-surface">
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Elo">Elo</option>
                  <option value="Amex">American Express</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-on-surface-variant">Validade</label><input id="checkout-card-val" class="w-full bg-surface-container-lowest border border-surface-variant rounded-lg py-3 px-4 font-body-md text-on-surface" placeholder="MM/AA" type="text"/></div>
                <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-on-surface-variant">CVV</label><input id="checkout-card-cvv" class="w-full bg-surface-container-lowest border border-surface-variant rounded-lg py-3 px-4 font-body-md text-on-surface" placeholder="000" type="text"/></div>
              </div>
            </div>

            <!-- PIX fields (shown when pix selected) -->
            <div id="pix-fields" class="grid grid-cols-1 gap-4 mt-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 text-center">
              <span class="material-symbols-outlined text-4xl text-primary mb-2">qr_code_scanner</span>
              <p class="font-body-md text-on-surface-variant mb-2">Chave PIX (Telefone): <strong>(41) 99619-0987</strong></p>
              <div class="flex flex-col items-center gap-2">
                <label class="font-label-md text-label-md text-primary bg-primary/10 px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors inline-flex items-center">
                    <span class="material-symbols-outlined text-[18px] mr-2">upload_file</span>Anexar Comprovante
                    <input id="checkout-pix-receipt" type="file" class="hidden" accept="image/*,.pdf" onchange="document.getElementById('pix-filename').textContent = this.files[0] ? this.files[0].name : ''" />
                </label>
                <span id="pix-filename" class="text-xs text-on-surface-variant font-bold"></span>
              </div>
            </div>
          </div>

          <!-- Cupom -->
          <div class="bg-primary/5 rounded-xl p-6 border border-primary/20">
            <h3 class="font-label-md text-label-md text-primary mb-3">Possui um cupom?</h3>
            <div class="flex gap-2">
                <input id="coupon-input" type="text" placeholder="Código do cupom" class="flex-grow bg-white border border-primary/20 rounded-lg px-4 py-2 text-sm focus:border-primary outline-none uppercase font-bold tracking-widest">
                <button type="button" onclick="window.applyDiscount()" class="bg-primary text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-primary-container transition-all">Aplicar</button>
            </div>
          </div>

          <!-- Resumo -->
          <div id="checkout-summary" class="bg-surface-container-low rounded-xl p-6 border border-outline-variant/30">
            <!-- Rendered by renderCheckoutTotals -->
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
            <a class="font-label-md text-label-md text-outline hover:text-primary transition-colors flex items-center gap-2 group" href="#/cart"><span class="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>Voltar ao Carrinho</a>
            <button class="w-full sm:w-auto bg-primary text-on-primary py-3.5 px-10 rounded-lg font-label-md shadow-[0_4px_16px_rgba(84,64,140,0.25)] hover:shadow-[0_8px_24px_rgba(84,64,140,0.35)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2" type="submit">Confirmar Pedido <span class="material-symbols-outlined text-[18px]">check_circle</span></button>
          </div>
        </form>
      </div>
      <div class="mt-4 flex justify-center items-center gap-6 text-outline">
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-[20px]">lock</span><span class="font-body-sm text-body-sm">Pagamento Seguro</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-[20px]">verified</span><span class="font-body-sm text-body-sm">Dados Criptografados</span></div>
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
