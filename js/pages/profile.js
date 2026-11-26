import { auth } from '../auth.js';
import { showToast } from '../components.js';
import { database } from '../database.js';

export default function profilePage() {
  const user = auth.getUser() || { name: 'Usuária', email: '' };
  const savedPhoto = localStorage.getItem('ann_profile_photo') || user.photo || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC77ZoIlcWkWMv6PoHvkxSm9AoIAod0TJnJZWF2MeQxi2AruIoztM2Esx1b7bu7WxXGBGql9gTS2qlzljZWZAgMwk3SP1E-X-LjEVwToyizyz0TQShvF0SJnfPxI85iPPDiyG4Hcj8ZowqeUsmVL7FgblL1dmjET0-akwNh34c4Wg5a6Miix5O7Dh_wwJUW2CLFx_SwKVGVqV0yXrLrcEmYdC9FimpquKe5z8CwL80QMWe0xc3-uZYa93ToeCwEUhDkvbtB7Ccw8obU';

  // ── Load saved addresses ──
  const getAddresses = () => JSON.parse(localStorage.getItem(`ann_addresses_${user.email}`) || '[]');
  const saveAddresses = (addrs) => localStorage.setItem(`ann_addresses_${user.email}`, JSON.stringify(addrs));

  // ── Load orders for this user ──
  const getUserOrders = () => {
    const allOrders = database.getOrders();
    const localOrders = JSON.parse(localStorage.getItem('ann_orders') || '[]');
    // Merge: dedupe by id
    const map = new Map();
    [...allOrders, ...localOrders].forEach(o => {
      if (o.clientId === user.email || o.clientName === user.name) {
        map.set(o.id, o);
      }
    });
    return Array.from(map.values()).sort((a, b) => {
      // Most recent first
      const dateA = a.date || '';
      const dateB = b.date || '';
      return dateB.localeCompare(dateA);
    });
  };

  // ═════════════════════════════════════════════════════
  //  GLOBAL FUNCTIONS
  // ═════════════════════════════════════════════════════

  // ── Tab switching ──
  window.switchProfileTab = (tab) => {
    const tabs = ['data', 'orders', 'addresses', 'favorites'];
    tabs.forEach(t => {
      const btn = document.getElementById(`ptab-${t}`);
      const panel = document.getElementById(`ppanel-${t}`);
      if (btn) {
        btn.classList.toggle('bg-[#8B5FBF]', t === tab);
        btn.classList.toggle('text-white', t === tab);
        btn.classList.toggle('border-[#8B5FBF]', t === tab);
        btn.classList.toggle('bg-white', t !== tab);
        btn.classList.toggle('text-[#5C4D6B]', t !== tab);
        btn.classList.toggle('border-[#DDD0E8]', t !== tab);
      }
      if (panel) {
        panel.classList.toggle('hidden', t !== tab);
      }
    });
  };

  // ── Profile edit ──
  window.toggleProfileEdit = () => {
    const form = document.getElementById('profile-edit-form');
    const info = document.getElementById('profile-display-info');
    if (form && info) {
      form.classList.toggle('hidden');
      info.classList.toggle('hidden');
    }
  };

  window.saveDirectProfile = () => {
    const newName = document.getElementById('edit-name')?.value?.trim() || user.name;
    const newPhone = document.getElementById('edit-phone')?.value?.trim() || '';
    const newBirth = document.getElementById('edit-birth')?.value?.trim() || '';

    user.name = newName;
    user.phone = newPhone;
    user.birthdate = newBirth;
    localStorage.setItem('ann_beauty_user', JSON.stringify(user));

    // Update registry
    const users = auth.getRegisteredUsers();
    const key = (user.email || '').toLowerCase().trim();
    if (users[key]) {
      users[key].name = newName;
      users[key].phone = newPhone;
      users[key].birthdate = newBirth;
      localStorage.setItem('ann_registered_users', JSON.stringify(users));
    }

    showToast('Dados atualizados com sucesso! ✨', 'success');
    setTimeout(() => window.location.reload(), 800);
  };

  window.handleProfilePhotoUpload = (input) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        localStorage.setItem('ann_profile_photo', e.target.result);
        const avatar = document.getElementById('profile-avatar');
        if (avatar) avatar.src = e.target.result;
        user.photo = e.target.result;
        localStorage.setItem('ann_beauty_user', JSON.stringify(user));
        showToast('Foto atualizada! 📸', 'success');
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  // ── Logout ──
  window.profileLogout = () => {
    auth.logout();
  };

  // ── Address management ──
  window.addNewAddress = () => {
    const modal = document.getElementById('address-modal');
    if (modal) {
      document.getElementById('addr-modal-title').textContent = 'Novo Endereço';
      document.getElementById('addr-id').value = '';
      document.getElementById('addr-label').value = '';
      document.getElementById('addr-cep').value = '';
      document.getElementById('addr-street').value = '';
      document.getElementById('addr-number').value = '';
      document.getElementById('addr-complement').value = '';
      document.getElementById('addr-neighborhood').value = '';
      document.getElementById('addr-city').value = '';
      document.getElementById('addr-state').value = '';
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  };

  window.editAddress = (id) => {
    const addrs = getAddresses();
    const addr = addrs.find(a => a.id === id);
    if (!addr) return;
    const modal = document.getElementById('address-modal');
    if (modal) {
      document.getElementById('addr-modal-title').textContent = 'Editar Endereço';
      document.getElementById('addr-id').value = addr.id;
      document.getElementById('addr-label').value = addr.label || '';
      document.getElementById('addr-cep').value = addr.cep || '';
      document.getElementById('addr-street').value = addr.street || '';
      document.getElementById('addr-number').value = addr.number || '';
      document.getElementById('addr-complement').value = addr.complement || '';
      document.getElementById('addr-neighborhood').value = addr.neighborhood || '';
      document.getElementById('addr-city').value = addr.city || '';
      document.getElementById('addr-state').value = addr.state || '';
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  };

  window.closeAddressModal = () => {
    const modal = document.getElementById('address-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  window.saveAddress = (e) => {
    e.preventDefault();
    const id = document.getElementById('addr-id').value;
    const addrData = {
      id: id || Date.now().toString(),
      label: document.getElementById('addr-label').value.trim() || 'Casa',
      cep: document.getElementById('addr-cep').value.trim(),
      street: document.getElementById('addr-street').value.trim(),
      number: document.getElementById('addr-number').value.trim(),
      complement: document.getElementById('addr-complement').value.trim(),
      neighborhood: document.getElementById('addr-neighborhood').value.trim(),
      city: document.getElementById('addr-city').value.trim(),
      state: document.getElementById('addr-state').value.trim(),
    };

    const addrs = getAddresses();
    const idx = addrs.findIndex(a => a.id === addrData.id);
    if (idx > -1) {
      addrs[idx] = addrData;
    } else {
      addrs.push(addrData);
    }
    saveAddresses(addrs);
    showToast('Endereço salvo com sucesso! 📍', 'success');
    window.closeAddressModal();
    renderAddressCards();
  };

  window.deleteAddress = (id) => {
    if (!confirm('Deseja excluir este endereço?')) return;
    const addrs = getAddresses().filter(a => a.id !== id);
    saveAddresses(addrs);
    showToast('Endereço removido.', 'info');
    renderAddressCards();
  };

  // ── Remove favorite ──
  window.removeFavorite = (itemId) => {
    const saved = auth.getSavedItems();
    const item = saved.find(s => s.id == itemId);
    if (item) {
      auth.toggleSaveItem(item, item.contentType || 'product');
      showToast('Removido dos favoritos', 'info');
      renderFavoritesGrid();
    }
  };

  // ═════════════════════════════════════════════════════
  //  RENDER HELPERS (called after DOM is built)
  // ═════════════════════════════════════════════════════

  function renderAddressCards() {
    const container = document.getElementById('addresses-list');
    if (!container) return;
    const addrs = getAddresses();

    if (addrs.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center">
          <span class="material-symbols-outlined text-5xl text-[#C4A8E0] mb-3 block">location_on</span>
          <p class="text-[#5C4D6B] text-sm">Nenhum endereço cadastrado ainda.</p>
          <button onclick="window.addNewAddress()" class="mt-4 px-6 py-2.5 rounded-full bg-[#8B5FBF] text-white text-sm font-bold hover:bg-[#7A4FAF] transition-colors">
            Adicionar Endereço
          </button>
        </div>`;
      return;
    }

    container.innerHTML = addrs.map((a, i) => `
      <div class="bg-white rounded-2xl border border-[#DDD0E8] p-5 hover:border-[#C4A8E0] transition-all relative group">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#8B5FBF] text-lg">${a.label === 'Trabalho' ? 'business' : 'home'}</span>
            <span class="font-bold text-sm text-[#2D1A40]">${a.label}</span>
            ${i === 0 ? '<span class="text-[9px] bg-[#8B5FBF] text-white px-2 py-0.5 rounded-full font-bold">PRINCIPAL</span>' : ''}
          </div>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onclick="window.editAddress('${a.id}')" class="w-8 h-8 rounded-full hover:bg-[#F8F4FB] flex items-center justify-center text-[#5C4D6B] hover:text-[#8B5FBF] transition-colors">
              <span class="material-symbols-outlined text-base">edit</span>
            </button>
            <button onclick="window.deleteAddress('${a.id}')" class="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-[#5C4D6B] hover:text-red-500 transition-colors">
              <span class="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
        </div>
        <p class="text-sm text-[#5C4D6B] leading-relaxed">${a.street}, ${a.number}${a.complement ? ' - ' + a.complement : ''}</p>
        <p class="text-sm text-[#5C4D6B]">${a.neighborhood} — ${a.city}/${a.state}</p>
        <p class="text-xs text-[#9D8AB0] mt-1">CEP: ${a.cep}</p>
      </div>
    `).join('');
  }

  function renderFavoritesGrid() {
    const container = document.getElementById('favorites-list');
    if (!container) return;
    const saved = auth.getSavedItems();

    if (saved.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center">
          <span class="material-symbols-outlined text-5xl text-[#C4A8E0] mb-3 block">favorite</span>
          <p class="text-[#5C4D6B] text-sm">Sua lista de desejos está vazia.</p>
          <a href="#/home" class="mt-4 inline-block px-6 py-2.5 rounded-full bg-[#8B5FBF] text-white text-sm font-bold hover:bg-[#7A4FAF] transition-colors">
            Explorar Produtos
          </a>
        </div>`;
      return;
    }

    container.innerHTML = saved.map(item => {
      const imgSrc = item.img ? (item.img.startsWith('http') ? item.img : `https://lh3.googleusercontent.com/aida-public/${item.img}`) : '';
      return `
      <div class="bg-white rounded-2xl border border-[#DDD0E8] overflow-hidden hover:border-[#C4A8E0] hover:shadow-lg transition-all group relative">
        <a href="#/product?id=${item.id}" class="block">
          <div class="aspect-square bg-[#F8F4FB] relative overflow-hidden">
            <img alt="${item.name || 'Produto'}" src="${imgSrc}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
          </div>
          <div class="p-4">
            <p class="font-bold text-sm text-[#2D1A40] line-clamp-1 mb-1">${item.name || 'Produto'}</p>
            <p class="text-xs text-[#9D8AB0] mb-2">${item.company_name || item.brand || 'Beleza na Web'}</p>
            ${item.price ? `<p class="font-bold text-sm text-[#8B5FBF]">${item.price}</p>` : ''}
          </div>
        </a>
        <button onclick="event.stopPropagation(); window.removeFavorite(${item.id})" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-white transition-all" title="Remover">
          <span class="material-symbols-outlined text-lg" style="font-variation-settings:'FILL' 1">favorite</span>
        </button>
      </div>`;
    }).join('');
  }

  function renderOrders() {
    const container = document.getElementById('orders-list');
    if (!container) return;
    const orders = getUserOrders();

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="py-12 text-center">
          <span class="material-symbols-outlined text-5xl text-[#C4A8E0] mb-3 block">shopping_bag</span>
          <p class="text-[#5C4D6B] text-sm mb-1">Você ainda não fez nenhum pedido.</p>
          <p class="text-xs text-[#9D8AB0] mb-4">Quando fizer sua primeira compra, ela aparecerá aqui.</p>
          <a href="#/home" class="inline-block px-6 py-2.5 rounded-full bg-[#8B5FBF] text-white text-sm font-bold hover:bg-[#7A4FAF] transition-colors">
            Começar a Comprar
          </a>
        </div>`;
      return;
    }

    container.innerHTML = orders.map(order => {
      let items = [];
      try {
        items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
      } catch (e) { items = []; }

      let address = {};
      try {
        address = typeof order.address === 'string' ? JSON.parse(order.address) : (order.address || {});
      } catch (e) { address = {}; }

      const statusMap = {
        'PAGAMENTO CONFIRMADO': { color: 'bg-green-100 text-green-700', icon: 'check_circle' },
        'EM PREPARAÇÃO': { color: 'bg-yellow-100 text-yellow-700', icon: 'inventory_2' },
        'ENVIADO': { color: 'bg-blue-100 text-blue-700', icon: 'local_shipping' },
        'ENTREGUE': { color: 'bg-emerald-100 text-emerald-700', icon: 'package_2' },
        'CANCELADO': { color: 'bg-red-100 text-red-700', icon: 'cancel' },
      };
      const st = statusMap[order.status] || statusMap['PAGAMENTO CONFIRMADO'];

      const totalVal = typeof order.totalValue === 'number'
        ? `R$ ${order.totalValue.toFixed(2).replace('.', ',')}`
        : (order.totalValue || 'R$ 0,00');

      return `
      <div class="bg-white rounded-2xl border border-[#DDD0E8] overflow-hidden hover:border-[#C4A8E0] transition-all">
        <!-- Order header -->
        <div class="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#F0E8F7]">
          <div>
            <p class="font-bold text-sm text-[#2D1A40]">Pedido <span class="text-[#8B5FBF]">${order.id}</span></p>
            <p class="text-xs text-[#9D8AB0]">${order.date || 'Data não informada'}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${st.color}">
              <span class="material-symbols-outlined text-sm">${st.icon}</span>
              ${order.status}
            </span>
          </div>
        </div>

        <!-- Order items -->
        <div class="px-5 py-4">
          ${Array.isArray(items) && items.length > 0 ? `
            <div class="flex flex-wrap gap-3 mb-3">
              ${items.slice(0, 4).map(it => {
                const itImg = it.img ? (it.img.startsWith('http') ? it.img : `https://lh3.googleusercontent.com/aida-public/${it.img}`) : '';
                return `
                <div class="flex items-center gap-3 bg-[#F8F4FB] rounded-xl p-2 pr-4">
                  ${itImg ? `<img src="${itImg}" class="w-10 h-10 rounded-lg object-cover" alt="${it.name || 'Item'}"/>` : ''}
                  <div>
                    <p class="text-xs font-bold text-[#2D1A40] line-clamp-1">${it.name || 'Produto'}</p>
                    <p class="text-[10px] text-[#9D8AB0]">Qtd: ${it.quantity || 1}</p>
                  </div>
                </div>`;
              }).join('')}
              ${items.length > 4 ? `<span class="text-xs text-[#9D8AB0] self-center">+${items.length - 4} itens</span>` : ''}
            </div>
          ` : '<p class="text-xs text-[#9D8AB0] mb-3">Itens do pedido</p>'}

          <div class="flex items-center justify-between pt-3 border-t border-[#F0E8F7]">
            <div class="flex items-center gap-4 text-xs text-[#5C4D6B]">
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">payments</span> ${order.paymentMethod || 'PIX'}</span>
              ${order.storeName ? `<span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">storefront</span> ${order.storeName}</span>` : ''}
            </div>
            <div class="flex items-center gap-3">
              <span class="font-bold text-sm text-[#2D1A40]">${totalVal}</span>
              <a href="#/tracking?id=${order.id}" class="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#F8F4FB] text-[#8B5FBF] text-xs font-bold hover:bg-[#8B5FBF] hover:text-white transition-all">
                <span class="material-symbols-outlined text-sm">local_shipping</span>
                Rastrear
              </a>
            </div>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  // ── Post-render init ──
  setTimeout(() => {
    renderOrders();
    renderAddressCards();
    renderFavoritesGrid();
    // Activate first tab
    window.switchProfileTab('data');
  }, 50);

  // ═════════════════════════════════════════════════════
  //  HTML TEMPLATE
  // ═════════════════════════════════════════════════════

  const orders = getUserOrders();
  const addresses = getAddresses();
  const savedItems = auth.getSavedItems();

  return `
  <main class="max-w-[1280px] mx-auto px-4 md:px-10 py-8 md:py-12">

    <!-- ═══ PAGE HEADER ═══ -->
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-[#2D1A40] mb-1" style="font-family:'Poppins',sans-serif">Minha Conta</h1>
      <p class="text-sm text-[#9D8AB0]">Gerencie seus dados, pedidos, endereços e favoritos</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">

      <!-- ═══ SIDEBAR ═══ -->
      <aside class="w-full lg:w-80 shrink-0 flex flex-col gap-5">

        <!-- User Card -->
        <div class="bg-white rounded-2xl border border-[#DDD0E8] p-6 text-center relative" style="box-shadow: 0 4px 20px -4px rgba(109, 76, 125, 0.06);">
          <label class="relative w-24 h-24 mx-auto block mb-4 cursor-pointer group">
            <img id="profile-avatar" alt="Avatar" class="w-24 h-24 rounded-full object-cover border-4 border-[#F0E8F7] shadow-sm group-hover:opacity-80 transition-opacity" src="${savedPhoto}"/>
            <div class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="material-symbols-outlined text-white text-xl">photo_camera</span>
            </div>
            <input type="file" class="hidden" accept="image/*" onchange="window.handleProfilePhotoUpload(this)">
          </label>
          <h2 class="text-lg font-bold text-[#2D1A40] mb-0.5" style="font-family:'Poppins',sans-serif">${user.name}</h2>
          <p class="text-xs text-[#9D8AB0] mb-1">${user.email}</p>
          <p class="text-[10px] text-[#C4A8E0]">Cliente desde ${user.joined || 'outubro de 2026'}</p>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-white rounded-xl border border-[#DDD0E8] p-3 text-center" style="box-shadow: 0 4px 20px -4px rgba(109, 76, 125, 0.04);">
            <span class="text-xl font-bold text-[#8B5FBF] block">${orders.length}</span>
            <span class="text-[10px] text-[#9D8AB0]">Pedidos</span>
          </div>
          <div class="bg-white rounded-xl border border-[#DDD0E8] p-3 text-center" style="box-shadow: 0 4px 20px -4px rgba(109, 76, 125, 0.04);">
            <span class="text-xl font-bold text-[#8B5FBF] block">${savedItems.length}</span>
            <span class="text-[10px] text-[#9D8AB0]">Favoritos</span>
          </div>
          <div class="bg-white rounded-xl border border-[#DDD0E8] p-3 text-center" style="box-shadow: 0 4px 20px -4px rgba(109, 76, 125, 0.04);">
            <span class="text-xl font-bold text-[#8B5FBF] block">${addresses.length}</span>
            <span class="text-[10px] text-[#9D8AB0]">Endereços</span>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="bg-white rounded-2xl border border-[#DDD0E8] overflow-hidden" style="box-shadow: 0 4px 20px -4px rgba(109, 76, 125, 0.06);">
          <button onclick="window.switchProfileTab('data')" id="ptab-data"
            class="flex items-center gap-3 w-full px-5 py-3.5 text-left text-sm font-bold border-b border-[#F0E8F7] transition-colors bg-[#8B5FBF] text-white border-[#8B5FBF]">
            <span class="material-symbols-outlined text-lg">person</span>
            Meus Dados
          </button>
          <button onclick="window.switchProfileTab('orders')" id="ptab-orders"
            class="flex items-center gap-3 w-full px-5 py-3.5 text-left text-sm font-bold border-b border-[#F0E8F7] transition-colors bg-white text-[#5C4D6B] border-[#DDD0E8] hover:bg-[#F8F4FB]">
            <span class="material-symbols-outlined text-lg">shopping_bag</span>
            Meus Pedidos
            ${orders.length > 0 ? `<span class="ml-auto text-[10px] bg-[#8B5FBF] text-white px-2 py-0.5 rounded-full">${orders.length}</span>` : ''}
          </button>
          <button onclick="window.switchProfileTab('addresses')" id="ptab-addresses"
            class="flex items-center gap-3 w-full px-5 py-3.5 text-left text-sm font-bold border-b border-[#F0E8F7] transition-colors bg-white text-[#5C4D6B] border-[#DDD0E8] hover:bg-[#F8F4FB]">
            <span class="material-symbols-outlined text-lg">location_on</span>
            Endereços
          </button>
          <button onclick="window.switchProfileTab('favorites')" id="ptab-favorites"
            class="flex items-center gap-3 w-full px-5 py-3.5 text-left text-sm font-bold border-b border-[#F0E8F7] transition-colors bg-white text-[#5C4D6B] border-[#DDD0E8] hover:bg-[#F8F4FB]">
            <span class="material-symbols-outlined text-lg">favorite</span>
            Lista de Desejos
            ${savedItems.length > 0 ? `<span class="ml-auto text-[10px] bg-[#8B5FBF] text-white px-2 py-0.5 rounded-full">${savedItems.length}</span>` : ''}
          </button>
          <button onclick="window.profileLogout()"
            class="flex items-center gap-3 w-full px-5 py-3.5 text-left text-sm font-bold text-red-400 hover:bg-red-50 transition-colors">
            <span class="material-symbols-outlined text-lg">logout</span>
            Sair da Conta
          </button>
        </nav>
      </aside>

      <!-- ═══ MAIN CONTENT ═══ -->
      <section class="flex-1 min-w-0">

        <!-- ── TAB: Meus Dados ── -->
        <div id="ppanel-data">
          <div class="bg-white rounded-2xl border border-[#DDD0E8] overflow-hidden" style="box-shadow: 0 4px 20px -4px rgba(109, 76, 125, 0.06);">
            <div class="px-6 py-4 border-b border-[#F0E8F7] flex items-center justify-between">
              <h3 class="text-lg font-bold text-[#2D1A40]" style="font-family:'Poppins',sans-serif">Dados Pessoais</h3>
              <button onclick="window.toggleProfileEdit()" class="text-xs font-bold text-[#8B5FBF] hover:underline flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">edit</span> Editar
              </button>
            </div>

            <!-- Display mode -->
            <div id="profile-display-info" class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1 block">Nome Completo</label>
                  <p class="text-sm font-semibold text-[#2D1A40]">${user.name}</p>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1 block">E-mail</label>
                  <p class="text-sm text-[#5C4D6B]">${user.email}</p>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1 block">Telefone</label>
                  <p class="text-sm text-[#5C4D6B]">${user.phone || 'Não informado'}</p>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1 block">Data de Nascimento</label>
                  <p class="text-sm text-[#5C4D6B]">${user.birthdate || 'Não informada'}</p>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1 block">Tipo de Conta</label>
                  <p class="text-sm text-[#5C4D6B] capitalize">${user.role === 'empresa' ? 'Conta Comercial' : user.role === 'admin_master' ? 'Administrador' : 'Conta Pessoal'}</p>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1 block">Membro Desde</label>
                  <p class="text-sm text-[#5C4D6B] capitalize">${user.joined || 'outubro de 2026'}</p>
                </div>
              </div>
            </div>

            <!-- Edit mode -->
            <div id="profile-edit-form" class="p-6 hidden">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1.5 block">Nome Completo</label>
                  <input id="edit-name" type="text" value="${user.name}" class="w-full bg-[#F8F4FB] border border-[#DDD0E8] rounded-xl px-4 py-3 text-sm text-[#2D1A40] outline-none focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/10 transition-all"/>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1.5 block">E-mail</label>
                  <input type="email" value="${user.email}" disabled class="w-full bg-[#F0E8F7] border border-[#DDD0E8] rounded-xl px-4 py-3 text-sm text-[#9D8AB0] outline-none cursor-not-allowed"/>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1.5 block">Telefone</label>
                  <input id="edit-phone" type="tel" value="${user.phone || ''}" placeholder="(00) 00000-0000" class="w-full bg-[#F8F4FB] border border-[#DDD0E8] rounded-xl px-4 py-3 text-sm text-[#2D1A40] outline-none focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/10 transition-all"/>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1.5 block">Data de Nascimento</label>
                  <input id="edit-birth" type="date" value="${user.birthdate || ''}" class="w-full bg-[#F8F4FB] border border-[#DDD0E8] rounded-xl px-4 py-3 text-sm text-[#2D1A40] outline-none focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/10 transition-all"/>
                </div>
              </div>
              <div class="flex gap-3 mt-6">
                <button onclick="window.saveDirectProfile()" class="px-6 py-2.5 rounded-xl bg-[#8B5FBF] text-white text-sm font-bold hover:bg-[#7A4FAF] transition-colors">
                  Salvar Alterações
                </button>
                <button onclick="window.toggleProfileEdit()" class="px-6 py-2.5 rounded-xl bg-[#F8F4FB] text-[#5C4D6B] text-sm font-bold hover:bg-[#DDD0E8] transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          </div>

          <!-- Security card -->
          <div class="bg-white rounded-2xl border border-[#DDD0E8] mt-5 overflow-hidden" style="box-shadow: 0 4px 20px -4px rgba(109, 76, 125, 0.06);">
            <div class="px-6 py-4 border-b border-[#F0E8F7]">
              <h3 class="text-lg font-bold text-[#2D1A40]" style="font-family:'Poppins',sans-serif">Segurança</h3>
            </div>
            <div class="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p class="text-sm font-semibold text-[#2D1A40] mb-1">Senha</p>
                <p class="text-xs text-[#9D8AB0]">Última alteração: nunca</p>
              </div>
              <a href="#/settings?tab=security" class="px-5 py-2.5 rounded-xl border border-[#DDD0E8] text-sm font-bold text-[#5C4D6B] hover:border-[#8B5FBF] hover:text-[#8B5FBF] transition-colors">
                Alterar Senha
              </a>
            </div>
          </div>
        </div>

        <!-- ── TAB: Meus Pedidos ── -->
        <div id="ppanel-orders" class="hidden">
          <div class="bg-white rounded-2xl border border-[#DDD0E8] overflow-hidden" style="box-shadow: 0 4px 20px -4px rgba(109, 76, 125, 0.06);">
            <div class="px-6 py-4 border-b border-[#F0E8F7]">
              <h3 class="text-lg font-bold text-[#2D1A40]" style="font-family:'Poppins',sans-serif">Meus Pedidos</h3>
            </div>
            <div id="orders-list" class="p-5 flex flex-col gap-4">
              <!-- Rendered by JS -->
            </div>
          </div>
        </div>

        <!-- ── TAB: Endereços ── -->
        <div id="ppanel-addresses" class="hidden">
          <div class="bg-white rounded-2xl border border-[#DDD0E8] overflow-hidden" style="box-shadow: 0 4px 20px -4px rgba(109, 76, 125, 0.06);">
            <div class="px-6 py-4 border-b border-[#F0E8F7] flex items-center justify-between">
              <h3 class="text-lg font-bold text-[#2D1A40]" style="font-family:'Poppins',sans-serif">Meus Endereços</h3>
              <button onclick="window.addNewAddress()" class="px-4 py-2 rounded-full bg-[#8B5FBF] text-white text-xs font-bold hover:bg-[#7A4FAF] transition-colors flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">add</span> Novo
              </button>
            </div>
            <div id="addresses-list" class="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Rendered by JS -->
            </div>
          </div>
        </div>

        <!-- ── TAB: Favoritos ── -->
        <div id="ppanel-favorites" class="hidden">
          <div class="bg-white rounded-2xl border border-[#DDD0E8] overflow-hidden" style="box-shadow: 0 4px 20px -4px rgba(109, 76, 125, 0.06);">
            <div class="px-6 py-4 border-b border-[#F0E8F7]">
              <h3 class="text-lg font-bold text-[#2D1A40]" style="font-family:'Poppins',sans-serif">Lista de Desejos</h3>
            </div>
            <div id="favorites-list" class="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <!-- Rendered by JS -->
            </div>
          </div>
        </div>

      </section>
    </div>
  </main>

  <!-- ═══ ADDRESS MODAL ═══ -->
  <div id="address-modal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] items-center justify-center p-4">
    <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
      <div class="px-6 py-4 border-b border-[#F0E8F7] flex items-center justify-between">
        <h3 id="addr-modal-title" class="text-lg font-bold text-[#2D1A40]" style="font-family:'Poppins',sans-serif">Novo Endereço</h3>
        <button onclick="window.closeAddressModal()" class="w-8 h-8 rounded-full hover:bg-[#F8F4FB] flex items-center justify-center text-[#5C4D6B] transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <form onsubmit="window.saveAddress(event)" class="p-6">
        <input type="hidden" id="addr-id"/>
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1 block">Apelido</label>
            <input id="addr-label" type="text" placeholder="Ex: Casa, Trabalho" class="w-full bg-[#F8F4FB] border border-[#DDD0E8] rounded-xl px-4 py-3 text-sm text-[#2D1A40] outline-none focus:border-[#8B5FBF] transition-all" required/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1 block">CEP</label>
            <input id="addr-cep" type="text" placeholder="00000-000" maxlength="9" class="w-full bg-[#F8F4FB] border border-[#DDD0E8] rounded-xl px-4 py-3 text-sm text-[#2D1A40] outline-none focus:border-[#8B5FBF] transition-all" required/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1 block">Estado</label>
            <input id="addr-state" type="text" placeholder="PR" maxlength="2" class="w-full bg-[#F8F4FB] border border-[#DDD0E8] rounded-xl px-4 py-3 text-sm text-[#2D1A40] outline-none focus:border-[#8B5FBF] transition-all" required/>
          </div>
          <div class="col-span-2">
            <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1 block">Rua</label>
            <input id="addr-street" type="text" placeholder="Nome da rua" class="w-full bg-[#F8F4FB] border border-[#DDD0E8] rounded-xl px-4 py-3 text-sm text-[#2D1A40] outline-none focus:border-[#8B5FBF] transition-all" required/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1 block">Número</label>
            <input id="addr-number" type="text" placeholder="123" class="w-full bg-[#F8F4FB] border border-[#DDD0E8] rounded-xl px-4 py-3 text-sm text-[#2D1A40] outline-none focus:border-[#8B5FBF] transition-all" required/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1 block">Complemento</label>
            <input id="addr-complement" type="text" placeholder="Apto, Bloco..." class="w-full bg-[#F8F4FB] border border-[#DDD0E8] rounded-xl px-4 py-3 text-sm text-[#2D1A40] outline-none focus:border-[#8B5FBF] transition-all"/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1 block">Bairro</label>
            <input id="addr-neighborhood" type="text" placeholder="Bairro" class="w-full bg-[#F8F4FB] border border-[#DDD0E8] rounded-xl px-4 py-3 text-sm text-[#2D1A40] outline-none focus:border-[#8B5FBF] transition-all" required/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-[#9D8AB0] uppercase tracking-widest mb-1 block">Cidade</label>
            <input id="addr-city" type="text" placeholder="Cidade" class="w-full bg-[#F8F4FB] border border-[#DDD0E8] rounded-xl px-4 py-3 text-sm text-[#2D1A40] outline-none focus:border-[#8B5FBF] transition-all" required/>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button type="submit" class="flex-1 px-6 py-3 rounded-xl bg-[#8B5FBF] text-white text-sm font-bold hover:bg-[#7A4FAF] transition-colors">
            Salvar Endereço
          </button>
          <button type="button" onclick="window.closeAddressModal()" class="px-6 py-3 rounded-xl bg-[#F8F4FB] text-[#5C4D6B] text-sm font-bold hover:bg-[#DDD0E8] transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
  `;
}
