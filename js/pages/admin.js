import { showToast } from '../components.js';
import { dataManager, productImages } from '../data_manager.js';
import { auth } from '../auth.js';

export default function adminPage() {
    return `
    <div class="min-h-screen bg-surface-container-lowest p-6 md:p-10">
        <div id="admin-dashboard" class="max-w-6xl mx-auto hidden">
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
                <div class="flex items-center gap-6">
                    <div>
                        <h1 class="font-serif text-3xl text-on-surface" id="admin-title">Dashboard</h1>
                        <p class="text-on-surface-variant text-sm" id="admin-welcome-msg"></p>
                    </div>
                    <nav class="hidden lg:flex gap-4 ml-8 border-l border-outline-variant/30 pl-8" id="admin-nav">
                        <button onclick="window.switchAdminTab('overview')" class="text-xs font-bold uppercase tracking-widest text-primary transition-all">Geral</button>
                        <button onclick="window.switchAdminTab('products')" class="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all">Produtos</button>
                        <button id="nav-users" onclick="window.switchAdminTab('users')" class="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all">Usuários</button>
                    </nav>
                </div>
                <div class="flex gap-3">
                    <a href="#/home" class="bg-surface-container text-on-surface px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-surface-container-high transition-all">
                        <span class="material-symbols-outlined text-[18px]">home</span> Loja
                    </a>
                </div>
            </header>

            <!-- Overview Tab -->
            <div id="tab-overview" class="admin-tab-content animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div class="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                        <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest" id="label-revenue">Faturamento</span>
                        <h3 class="text-2xl font-bold text-primary mt-1" id="stat-revenue">R$ 0,00</h3>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                        <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Vendas Concluídas</span>
                        <h3 class="text-2xl font-bold text-secondary mt-1" id="stat-sales">0</h3>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                        <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Seus Produtos</span>
                        <h3 class="text-2xl font-bold text-tertiary mt-1" id="stat-products">0</h3>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                        <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest" id="label-pending">Pedidos Pendentes</span>
                        <h3 class="text-2xl font-bold text-amber-500 mt-1" id="stat-pending">0</h3>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
                        <h2 class="text-xl font-bold text-on-surface mb-6">Pedidos Recentes</h2>
                        <div id="admin-recent-orders" class="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                            <!-- Rows -->
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
                        <h2 class="text-xl font-bold text-on-surface mb-6">Desempenho</h2>
                        <div class="flex items-end justify-between h-40 gap-1 mt-10">
                            <div class="w-full bg-primary/20 rounded-t h-[40%] hover:bg-primary/40 transition-colors"></div>
                            <div class="w-full bg-primary/20 rounded-t h-[65%] hover:bg-primary/40 transition-colors"></div>
                            <div class="w-full bg-primary/20 rounded-t h-[45%] hover:bg-primary/40 transition-colors"></div>
                            <div class="w-full bg-primary/20 rounded-t h-[80%] hover:bg-primary/40 transition-colors"></div>
                            <div class="w-full bg-primary rounded-t h-[95%] shadow-[0_0_15px_rgba(84,64,140,0.3)] hover:bg-primary-container transition-colors"></div>
                            <div class="w-full bg-primary/20 rounded-t h-[70%] hover:bg-primary/40 transition-colors"></div>
                            <div class="w-full bg-primary/20 rounded-t h-[30%] hover:bg-primary/40 transition-colors"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Products Tab -->
            <div id="tab-products" class="admin-tab-content hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <h2 class="text-2xl font-bold text-on-surface">Seu Estoque</h2>
                        <button onclick="window.openProductModal()" class="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-transform shadow-lg shadow-primary/20">+ Novo Produto</button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="text-left border-b border-outline-variant/20">
                                    <th class="pb-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Produto</th>
                                    <th class="pb-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Código</th>
                                    <th class="pb-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Preço</th>
                                    <th class="pb-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                                    <th class="pb-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody id="admin-full-product-list">
                                <!-- Products -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Users Tab -->
            <div id="tab-users" class="admin-tab-content hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
                    <h2 class="text-2xl font-bold text-on-surface mb-6">Usuários da Plataforma</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="admin-user-list">
                        <!-- Users -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Product Modal -->
    <div id="product-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] hidden items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in duration-200">
            <h2 class="text-xl font-bold text-on-surface mb-6" id="modal-title">Novo Produto</h2>
            <form id="product-form" class="space-y-4">
                <input type="hidden" id="prod-id" value="">
                <div>
                    <label class="block text-xs font-bold text-on-surface-variant uppercase mb-1">Nome do Produto</label>
                    <input type="text" id="prod-name" required class="w-full bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/30 outline-none focus:border-primary">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-on-surface-variant uppercase mb-1">Preço</label>
                        <input type="text" id="prod-price" required placeholder="R$ 0,00" class="w-full bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/30 outline-none focus:border-primary">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-on-surface-variant uppercase mb-1">Categoria</label>
                        <select id="prod-cat" required class="w-full bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/30 outline-none focus:border-primary">
                            <option value="Maquiagem">Maquiagem</option>
                            <option value="Skincare">Skincare</option>
                            <option value="Cabelo">Cabelo</option>
                            <option value="Corpo">Corpo e Banho</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-on-surface-variant uppercase mb-1">Descrição</label>
                    <textarea id="prod-desc" required rows="3" class="w-full bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/30 outline-none focus:border-primary"></textarea>
                </div>
                <div class="flex gap-3 justify-end pt-4 mt-6 border-t border-outline-variant/20">
                    <button type="button" onclick="document.getElementById('product-modal').classList.add('hidden')" class="px-5 py-2 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container transition-colors">Cancelar</button>
                    <button type="submit" class="bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-primary-container transition-colors">Salvar Produto</button>
                </div>
            </form>
        </div>
    </div>
    `;
}

export function mount() {
    const user = auth.getUser();
    
    // Redirect if not authorized
    if (!user || (user.role !== 'admin_master' && user.role !== 'empresa')) {
        window.location.hash = '#/login';
        return;
    }

    const dashboard = document.getElementById('admin-dashboard');
    dashboard.classList.remove('hidden');

    // UI Adjustments based on role
    const title = document.getElementById('admin-title');
    const welcome = document.getElementById('admin-welcome-msg');
    const navUsers = document.getElementById('nav-users');

    if (user.role === 'empresa') {
        title.textContent = 'Meu Negócio';
        welcome.textContent = `Gestor(a): ${user.company_name || user.name}`;
        if (navUsers) navUsers.classList.add('hidden'); // Hide users tab for companies
    } else {
        title.textContent = 'Painel Master';
        welcome.textContent = `A.n.n Beauty Global`;
    }

    window.switchAdminTab = (tabId) => {
        document.querySelectorAll('.admin-tab-content').forEach(tab => tab.classList.add('hidden'));
        document.getElementById(`tab-${tabId}`).classList.remove('hidden');
        
        // Update nav styles
        document.querySelectorAll('#admin-nav button').forEach(btn => {
            btn.classList.remove('text-primary');
            btn.classList.add('text-on-surface-variant');
        });
        const activeBtn = Array.from(document.querySelectorAll('#admin-nav button')).find(b => b.outerHTML.includes(`'${tabId}'`));
        if (activeBtn) {
            activeBtn.classList.add('text-primary');
            activeBtn.classList.remove('text-on-surface-variant');
        }
    };

    // Product Modal Logic
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');

    window.openProductModal = (productId = null) => {
        const idField = document.getElementById('prod-id');
        const nameField = document.getElementById('prod-name');
        const priceField = document.getElementById('prod-price');
        const catField = document.getElementById('prod-cat');
        const descField = document.getElementById('prod-desc');
        const modalTitle = document.getElementById('modal-title');

        if (productId) {
            modalTitle.textContent = 'Editar Produto';
            const all = dataManager.generateProducts();
            const product = all.find(p => p.id === productId);
            if (product) {
                idField.value = product.id;
                nameField.value = product.name;
                priceField.value = product.price;
                catField.value = product.cat;
                descField.value = product.desc;
            }
        } else {
            modalTitle.textContent = 'Novo Produto';
            form.reset();
            idField.value = '';
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    };

    window.deleteProduct = (productId) => {
        if (confirm('Tem certeza que deseja remover este produto?')) {
            dataManager.deleteProduct(productId);
            showToast('Produto removido', 'success');
            renderData();
        }
    };

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const id = document.getElementById('prod-id').value;
            const newProduct = {
                name: document.getElementById('prod-name').value,
                price: document.getElementById('prod-price').value,
                cat: document.getElementById('prod-cat').value,
                desc: document.getElementById('prod-desc').value,
                company_id: user.role === 'empresa' ? user.company_id : 'ann_beauty',
                company_name: user.role === 'empresa' ? (user.company_name || user.name) : 'A.n.n Beauty',
                img: productImages[Math.floor(Math.random() * productImages.length)]
            };

            if (id) {
                dataManager.editProduct(id, newProduct);
                showToast('Produto atualizado', 'success');
            } else {
                dataManager.addProduct(newProduct);
                showToast('Produto adicionado', 'success');
            }

            modal.classList.add('hidden');
            renderData();
        });
    }

    const renderData = () => {
        // Load products
        const allProducts = dataManager.generateProducts(40);
        let myProducts = allProducts;
        
        if (user.role === 'empresa') {
            myProducts = allProducts.filter(p => p.company_id === user.company_id);
        }

        document.getElementById('stat-products').textContent = myProducts.length;

        const productList = document.getElementById('admin-full-product-list');
        if (productList) {
            productList.innerHTML = myProducts.map(p => `
                <tr class="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                    <td class="py-4 flex items-center gap-3">
                        <img src="https://lh3.googleusercontent.com/aida-public/${p.img}" class="w-10 h-10 rounded-lg object-cover border border-outline-variant/20">
                        <span class="text-sm font-semibold">${p.name}</span>
                    </td>
                    <td class="py-4 text-xs font-mono text-on-surface-variant">${p.code}</td>
                    <td class="py-4 text-sm font-bold text-primary">${p.price}</td>
                    <td class="py-4"><span class="px-2 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold border border-green-200">DISPONÍVEL</span></td>
                    <td class="py-4 text-right">
                        ${p.id.startsWith('custom-') ? `
                        <button onclick="window.openProductModal('${p.id}')" class="p-2 text-outline hover:text-primary transition-colors rounded-lg"><span class="material-symbols-outlined text-[20px]">edit</span></button>
                        <button onclick="window.deleteProduct('${p.id}')" class="p-2 text-outline hover:text-red-500 transition-colors rounded-lg"><span class="material-symbols-outlined text-[20px]">delete</span></button>
                        ` : `
                        <span class="text-[10px] text-outline italic mr-2">Sistema</span>
                        `}
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="5" class="py-4 text-center text-outline text-sm">Nenhum produto encontrado no seu estoque.</td></tr>';
        }

        // Load orders
        const allOrders = JSON.parse(localStorage.getItem('ann_orders') || '[]');
        let myOrders = allOrders;
        let myRevenue = 0;
        let mySalesCount = 0;
        let myPending = 0;

        if (user.role === 'empresa') {
            // Filter orders that have at least one item from this company
            myOrders = allOrders.filter(order => order.items.some(item => item.company_id === user.company_id));
        }

        // Calculate stats
        myOrders.forEach(order => {
            mySalesCount++;
            if (order.status === 'PENDENTE') myPending++;
            
            // Calculate revenue using the commissions object if available
            if (order.commissions) {
                if (user.role === 'admin_master') {
                    // Master admin sees Platform profit
                    myRevenue += (order.commissions['ann_beauty'] || 0);
                } else if (user.role === 'empresa') {
                    // Company sees their own profit
                    myRevenue += (order.commissions[user.company_id] || 0);
                }
            } else {
                // Fallback for old orders
                const val = parseFloat(order.value.replace('R$ ', '').replace('.', '').replace(',', '.'));
                myRevenue += (user.role === 'admin_master' ? val * 0.3 : val * 0.7); // Dummy fallback
            }
        });

        document.getElementById('stat-revenue').textContent = `R$ ${myRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        document.getElementById('stat-sales').textContent = mySalesCount;
        document.getElementById('stat-pending').textContent = myPending;

        if (user.role === 'admin_master') {
            document.getElementById('label-revenue').textContent = 'Lucro da Plataforma';
        } else {
            document.getElementById('label-revenue').textContent = 'Seu Faturamento';
        }

        const recentOrdersContainer = document.getElementById('admin-recent-orders');
        if (recentOrdersContainer) {
            recentOrdersContainer.innerHTML = myOrders.length > 0 ? myOrders.map(order => {
                let displayValue = order.value;
                if (order.commissions) {
                     const myShare = user.role === 'admin_master' ? order.commissions['ann_beauty'] : order.commissions[user.company_id];
                     if (myShare !== undefined) {
                         displayValue = `R$ ${myShare.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                     }
                }

                return `
                <div class="p-4 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl border border-outline-variant/30 flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-bold text-on-surface">${order.client}</p>
                            <p class="text-[10px] text-on-surface-variant tracking-wider uppercase">${order.id} • ${order.date}</p>
                        </div>
                        <span class="px-3 py-1 rounded-full ${order.status === 'PENDENTE' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-green-50 text-green-600 border-green-200'} border text-[10px] font-bold tracking-widest">${order.status}</span>
                    </div>
                    <div class="flex justify-between items-end mt-2 pt-2 border-t border-outline-variant/20">
                        <div class="w-full">
                            <div class="flex justify-between items-center mb-1">
                                <p class="text-[10px] text-outline uppercase tracking-widest">Sua Parte</p>
                                <p class="text-sm font-bold text-primary">${displayValue}</p>
                            </div>
                            ${order.payment ? `<p class="text-[10px] text-on-surface-variant flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">payments</span> ${order.payment.method.toUpperCase()} ${order.payment.method === 'cartao' ? `(${order.payment.cardBrand})` : ''}</p>` : ''}
                        </div>
                    </div>
                </div>
            `}).join('') : '<p class="text-sm text-outline p-4 text-center">Nenhum pedido recente.</p>';
        }

        if (user.role === 'admin_master') {
            const userList = document.getElementById('admin-user-list');
            if (userList) {
                userList.innerHTML = [1,2,3].map(i => `
                    <div class="p-4 bg-surface-container-low hover:shadow-md transition-shadow rounded-xl border border-outline-variant/30 flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">U${i}</div>
                        <div>
                            <p class="text-sm font-bold text-on-surface">Cliente Premium #${i}</p>
                            <p class="text-xs text-outline">cliente${i}@email.com</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    };

    renderData();
}
