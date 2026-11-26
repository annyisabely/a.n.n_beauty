import { auth } from '../auth.js';
import { showToast } from '../components.js';
import { database } from '../database.js';

export default function adminPage() {
  const user = auth.getUser();

  // STRICT ACCESS SECURITY GUARD:
  // Only users with role === 'admin' or 'admin_master' can view this page.
  // Clients and Sellers get immediate access denial & redirect to home.
  if (!user || (user.role !== 'admin' && user.role !== 'admin_master')) {
    setTimeout(() => {
      showToast('Acesso negado. Apenas administradores podem acessar o painel.', 'error');
      window.location.hash = '#/home';
    }, 50);
    return `<div class="min-h-screen bg-background flex items-center justify-center p-8"><div class="text-center font-bold text-red-600">Redirecionando... Acesso negado.</div></div>`;
  }

  // Fetch all database entities
  const users = database.getUsers();
  const stores = database.getStores();
  const products = database.getProducts();
  const orders = database.getOrders();
  const reports = database.getReports();
  const coupons = database.getCoupons();
  const categories = database.getCategories();
  const settings = database.getSettings();

  // Dashboard Stat Calculations
  const totalUsers = users.length;
  const totalSellers = users.filter(u => u.role === 'seller' || u.role === 'empresa').length;
  const totalStores = stores.length;
  const totalProducts = products.length;
  const pendingProductsCount = products.filter(p => p.status === 'pending').length;
  const ordersTodayCount = orders.length;
  const totalSoldValue = orders.reduce((sum, o) => sum + (o.totalValue || 0), 0);
  const platformCommissionValue = orders.reduce((sum, o) => sum + (o.commissionValue || (o.totalValue * 0.15)), 0);
  const newRegistrationsCount = users.filter(u => u.joined && u.joined.includes('2026')).length;

  return `
  <div class="min-h-screen bg-[#F8F9FD] flex font-sans antialiased text-slate-800">
    
    <!-- FIX SIDEBAR (Menu Lateral Fixo) -->
    <aside class="w-64 bg-[#000000] text-white flex flex-col fixed inset-y-0 left-0 z-50 shadow-2xl transition-all">
      <!-- Brand Logo Header -->
      <div class="p-6 border-b border-white/10 flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B5FBF] to-purple-400 flex items-center justify-center font-bold text-white shadow-lg shadow-[#8B5FBF]/40">
          <span class="material-symbols-outlined text-xl">admin_panel_settings</span>
        </div>
        <div>
          <h2 class="font-bold text-sm tracking-tight text-white">Beleza na Web</h2>
          <span class="text-[10px] text-purple-300 font-bold tracking-widest uppercase">Admin Master</span>
        </div>
      </div>

      <!-- Navigation List (13 Items) -->
      <nav class="flex-grow p-4 space-y-1 overflow-y-auto subtle-scroll text-xs font-semibold">
        <button onclick="window.switchAdminSection('dashboard')" id="side-dashboard" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#8B5FBF] text-white font-bold shadow-lg shadow-[#8B5FBF]/30 transition-all">
          <span class="material-symbols-outlined text-lg">space_dashboard</span> 🏠 Dashboard
        </button>
        <button onclick="window.switchAdminSection('users')" id="side-users" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/10 hover:text-white transition-all">
          <span class="material-symbols-outlined text-lg">group</span> 👥 Usuários
        </button>
        <button onclick="window.switchAdminSection('stores')" id="side-stores" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/10 hover:text-white transition-all">
          <span class="material-symbols-outlined text-lg">storefront</span> 🏪 Lojas
        </button>
        <button onclick="window.switchAdminSection('products')" id="side-products" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/10 hover:text-white transition-all">
          <span class="material-symbols-outlined text-lg">inventory_2</span> 📦 Produtos
        </button>
        <button onclick="window.switchAdminSection('orders')" id="side-orders" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/10 hover:text-white transition-all">
          <span class="material-symbols-outlined text-lg">shopping_cart</span> 🛒 Pedidos
        </button>
        <button onclick="window.switchAdminSection('financial')" id="side-financial" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/10 hover:text-white transition-all">
          <span class="material-symbols-outlined text-lg">payments</span> 💳 Financeiro
        </button>
        <button onclick="window.switchAdminSection('reviews')" id="side-reviews" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/10 hover:text-white transition-all">
          <span class="material-symbols-outlined text-lg">star</span> ⭐ Avaliações
        </button>
        <button onclick="window.switchAdminSection('reports')" id="side-reports" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/10 hover:text-white transition-all">
          <span class="material-symbols-outlined text-lg">flag</span> 📨 Denúncias
        </button>
        <button onclick="window.switchAdminSection('coupons')" id="side-coupons" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/10 hover:text-white transition-all">
          <span class="material-symbols-outlined text-lg">local_offer</span> 🎟 Cupons
        </button>
        <button onclick="window.switchAdminSection('categories')" id="side-categories" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/10 hover:text-white transition-all">
          <span class="material-symbols-outlined text-lg">category</span> 📂 Categorias
        </button>
        <button onclick="window.switchAdminSection('reports_analytics')" id="side-reports_analytics" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/10 hover:text-white transition-all">
          <span class="material-symbols-outlined text-lg">analytics</span> 📊 Relatórios
        </button>
        <button onclick="window.switchAdminSection('settings')" id="side-settings" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/10 hover:text-white transition-all">
          <span class="material-symbols-outlined text-lg">settings</span> ⚙ Configurações
        </button>
        <button onclick="window.auth.logout(); window.location.hash='#/login';" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all mt-4">
          <span class="material-symbols-outlined text-lg">logout</span> 🚪 Sair
        </button>
      </nav>
    </aside>

    <!-- MAIN CONTENT WRAPPER -->
    <div class="flex-grow pl-64 flex flex-col min-h-screen">
      <!-- TOP BAR -->
      <header class="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-40 flex items-center justify-between shadow-sm">
        <!-- Global Search Bar -->
        <div class="relative w-full max-w-md">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">search</span>
          <input type="text" id="admin-global-search" oninput="window.handleAdminGlobalSearch(this.value)" placeholder="Pesquisar usuários, lojas, produtos, pedidos..." class="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium outline-none focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/20 transition-all">
        </div>

        <!-- Right User Actions -->
        <div class="flex items-center gap-4">
          <button onclick="showToast('Sem novas notificações administrativas', 'info')" class="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
            <span class="material-symbols-outlined text-xl">notifications</span>
            <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div class="h-6 w-[1px] bg-slate-200"></div>

          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#8B5FBF] text-white flex items-center justify-center font-bold text-xs shadow-md">
              ${user.name.charAt(0)}
            </div>
            <div class="hidden sm:block">
              <p class="text-xs font-bold text-slate-800 leading-tight">${user.name}</p>
              <p class="text-[10px] text-[#8B5FBF] font-bold">Administrador Geral</p>
            </div>
          </div>
        </div>
      </header>

      <!-- PAGE CONTENT AREA -->
      <main class="p-8 flex-grow">
        
        <!-- SECTION 1: DASHBOARD -->
        <div id="admin-sec-dashboard" class="admin-sec space-y-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Visão Geral do Marketplace</h1>
              <p class="text-xs text-slate-500">Métricas em tempo real sobre usuários, lojistas e volume de vendas</p>
            </div>
            <span class="px-4 py-1.5 rounded-full bg-[#8B5FBF]/10 text-[#8B5FBF] font-bold text-xs border border-[#8B5FBF]/20">Beleza na Web Live System</span>
          </div>

          <!-- 9 METRIC CARDS -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold uppercase text-slate-400">Total de Usuários</p>
                <h3 class="text-3xl font-extrabold text-slate-900 mt-1">${totalUsers}</h3>
                <span class="text-[10px] text-emerald-600 font-bold">Clientes e lojistas ativos</span>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-purple-50 text-[#8B5FBF] flex items-center justify-center"><span class="material-symbols-outlined text-2xl">group</span></div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold uppercase text-slate-400">Total de Vendedores</p>
                <h3 class="text-3xl font-extrabold text-slate-900 mt-1">${totalSellers}</h3>
                <span class="text-[10px] text-emerald-600 font-bold">Vendedores verificados</span>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><span class="material-symbols-outlined text-2xl">badge</span></div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold uppercase text-slate-400">Total de Lojas</p>
                <h3 class="text-3xl font-extrabold text-slate-900 mt-1">${totalStores}</h3>
                <span class="text-[10px] text-purple-600 font-bold">Lojas parceiras cadastradas</span>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-purple-50 text-[#8B5FBF] flex items-center justify-center"><span class="material-symbols-outlined text-2xl">storefront</span></div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold uppercase text-slate-400">Total de Produtos</p>
                <h3 class="text-3xl font-extrabold text-slate-900 mt-1">${totalProducts}</h3>
                <span class="text-[10px] text-slate-500 font-medium">Cadastrados no catálogo</span>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center"><span class="material-symbols-outlined text-2xl">inventory_2</span></div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold uppercase text-slate-400">Pedidos do Dia</p>
                <h3 class="text-3xl font-extrabold text-slate-900 mt-1">${ordersTodayCount}</h3>
                <span class="text-[10px] text-emerald-600 font-bold">Realizados hoje</span>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><span class="material-symbols-outlined text-2xl">shopping_cart</span></div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold uppercase text-slate-400">Valor Total Vendido</p>
                <h3 class="text-3xl font-extrabold text-[#8B5FBF] mt-1">R$ ${totalSoldValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                <span class="text-[10px] text-emerald-600 font-bold">GMV Bruto da plataforma</span>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-purple-50 text-[#8B5FBF] flex items-center justify-center"><span class="material-symbols-outlined text-2xl">payments</span></div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold uppercase text-slate-400">Comissão da Plataforma</p>
                <h3 class="text-3xl font-extrabold text-emerald-600 mt-1">R$ ${platformCommissionValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                <span class="text-[10px] text-slate-500 font-medium">Receita líquida (15%)</span>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><span class="material-symbols-outlined text-2xl">account_balance</span></div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold uppercase text-slate-400">Novos Cadastros</p>
                <h3 class="text-3xl font-extrabold text-slate-900 mt-1">${newRegistrationsCount}</h3>
                <span class="text-[10px] text-purple-600 font-bold">Em 2026</span>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-purple-50 text-[#8B5FBF] flex items-center justify-center"><span class="material-symbols-outlined text-2xl">person_add</span></div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold uppercase text-slate-400">Aguardando Aprovação</p>
                <h3 class="text-3xl font-extrabold text-amber-500 mt-1">${pendingProductsCount}</h3>
                <span class="text-[10px] text-amber-600 font-bold">Produtos pendentes</span>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center"><span class="material-symbols-outlined text-2xl">hourglass_empty</span></div>
            </div>
          </div>

          <!-- 4 CHARTS -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Chart 1: Vendas por Dia -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 class="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span class="material-symbols-outlined text-[#8B5FBF]">show_chart</span> Vendas por Dia (Últimos 7 dias)
              </h3>
              <p class="text-[10px] text-slate-400 mb-6">Volume financeiro acumulado em compras</p>
              
              <div class="flex items-end justify-between h-48 gap-3 px-4 pt-4 border-b border-slate-100">
                <div class="w-full flex flex-col items-center gap-2">
                  <div class="w-full bg-purple-200 rounded-t-lg h-[40%] hover:bg-[#8B5FBF] transition-all"></div>
                  <span class="text-[9px] text-slate-400 font-bold">Seg</span>
                </div>
                <div class="w-full flex flex-col items-center gap-2">
                  <div class="w-full bg-purple-200 rounded-t-lg h-[65%] hover:bg-[#8B5FBF] transition-all"></div>
                  <span class="text-[9px] text-slate-400 font-bold">Ter</span>
                </div>
                <div class="w-full flex flex-col items-center gap-2">
                  <div class="w-full bg-purple-200 rounded-t-lg h-[50%] hover:bg-[#8B5FBF] transition-all"></div>
                  <span class="text-[9px] text-slate-400 font-bold">Qua</span>
                </div>
                <div class="w-full flex flex-col items-center gap-2">
                  <div class="w-full bg-purple-300 rounded-t-lg h-[80%] hover:bg-[#8B5FBF] transition-all"></div>
                  <span class="text-[9px] text-slate-400 font-bold">Qui</span>
                </div>
                <div class="w-full flex flex-col items-center gap-2">
                  <div class="w-full bg-[#8B5FBF] rounded-t-lg h-[95%] shadow-lg shadow-[#8B5FBF]/30"></div>
                  <span class="text-[9px] text-[#8B5FBF] font-bold">Sex</span>
                </div>
                <div class="w-full flex flex-col items-center gap-2">
                  <div class="w-full bg-purple-200 rounded-t-lg h-[70%] hover:bg-[#8B5FBF] transition-all"></div>
                  <span class="text-[9px] text-slate-400 font-bold">Sáb</span>
                </div>
                <div class="w-full flex flex-col items-center gap-2">
                  <div class="w-full bg-purple-200 rounded-t-lg h-[55%] hover:bg-[#8B5FBF] transition-all"></div>
                  <span class="text-[9px] text-slate-400 font-bold">Dom</span>
                </div>
              </div>
            </div>

            <!-- Chart 2: Novos Usuários -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 class="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span class="material-symbols-outlined text-blue-600">person_add</span> Novos Usuários por Mês
              </h3>
              <p class="text-[10px] text-slate-400 mb-6">Taxa de crescimento da base de clientes</p>

              <div class="flex items-end justify-between h-48 gap-3 px-4 pt-4 border-b border-slate-100">
                <div class="w-full flex flex-col items-center gap-2"><div class="w-full bg-blue-100 rounded-t-lg h-[30%] hover:bg-blue-600 transition-all"></div><span class="text-[9px] text-slate-400 font-bold">Jan</span></div>
                <div class="w-full flex flex-col items-center gap-2"><div class="w-full bg-blue-100 rounded-t-lg h-[45%] hover:bg-blue-600 transition-all"></div><span class="text-[9px] text-slate-400 font-bold">Fev</span></div>
                <div class="w-full flex flex-col items-center gap-2"><div class="w-full bg-blue-100 rounded-t-lg h-[60%] hover:bg-blue-600 transition-all"></div><span class="text-[9px] text-slate-400 font-bold">Mar</span></div>
                <div class="w-full flex flex-col items-center gap-2"><div class="w-full bg-blue-100 rounded-t-lg h-[75%] hover:bg-blue-600 transition-all"></div><span class="text-[9px] text-slate-400 font-bold">Abr</span></div>
                <div class="w-full flex flex-col items-center gap-2"><div class="w-full bg-blue-600 rounded-t-lg h-[90%] shadow-lg"></div><span class="text-[9px] text-blue-600 font-bold">Mai</span></div>
                <div class="w-full flex flex-col items-center gap-2"><div class="w-full bg-blue-200 rounded-t-lg h-[85%] hover:bg-blue-600 transition-all"></div><span class="text-[9px] text-slate-400 font-bold">Jun</span></div>
              </div>
            </div>

            <!-- Chart 3: Produtos Mais Vendidos -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 class="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-amber-500">local_fire_department</span> Produtos Mais Vendidos
              </h3>

              <div class="space-y-4 text-xs font-semibold">
                <div>
                  <div class="flex justify-between mb-1"><span>Pó Facial Velvet Matte</span><span class="font-bold text-[#8B5FBF]">184 unidades</span></div>
                  <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden"><div class="bg-[#8B5FBF] h-full rounded-full" style="width: 85%"></div></div>
                </div>
                <div>
                  <div class="flex justify-between mb-1"><span>Sérum Glow Etéreo Iluminador</span><span class="font-bold text-[#8B5FBF]">142 unidades</span></div>
                  <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden"><div class="bg-purple-400 h-full rounded-full" style="width: 70%"></div></div>
                </div>
                <div>
                  <div class="flex justify-between mb-1"><span>Batom Líquido Satin Rose</span><span class="font-bold text-[#8B5FBF]">96 unidades</span></div>
                  <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden"><div class="bg-purple-300 h-full rounded-full" style="width: 50%"></div></div>
                </div>
              </div>
            </div>

            <!-- Chart 4: Categorias Mais Acessadas -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 class="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-emerald-600">category</span> Categorias Mais Acessadas
              </h3>

              <div class="space-y-4 text-xs font-semibold">
                <div>
                  <div class="flex justify-between mb-1"><span>Maquiagem</span><span class="font-bold text-emerald-600">45% dos acessos</span></div>
                  <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden"><div class="bg-emerald-500 h-full rounded-full" style="width: 45%"></div></div>
                </div>
                <div>
                  <div class="flex justify-between mb-1"><span>Skincare & Rituais</span><span class="font-bold text-emerald-600">35% dos acessos</span></div>
                  <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden"><div class="bg-emerald-400 h-full rounded-full" style="width: 35%"></div></div>
                </div>
                <div>
                  <div class="flex justify-between mb-1"><span>Cabelo & Corpo</span><span class="font-bold text-emerald-600">20% dos acessos</span></div>
                  <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden"><div class="bg-emerald-300 h-full rounded-full" style="width: 20%"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 2: USUÁRIOS -->
        <div id="admin-sec-users" class="admin-sec hidden space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 class="text-2xl font-bold text-slate-900">Gestão de Usuários</h1>
              <p class="text-xs text-slate-500">Pesquise, edite permissões, suspenda ou promova usuários</p>
            </div>
            <button onclick="window.handleAdminCreateUser()" class="px-5 py-2.5 rounded-full bg-[#8B5FBF] text-white font-bold text-xs shadow-md hover:scale-105 transition-all">
              + Cadastrar Usuário
            </button>
          </div>

          <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs font-medium border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                    <th class="pb-3">Usuário</th>
                    <th class="pb-3">E-mail</th>
                    <th class="pb-3">Cargo</th>
                    <th class="pb-3">Status</th>
                    <th class="pb-3">Data Cadastro</th>
                    <th class="pb-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100" id="admin-users-table-body">
                  ${users.map(u => `
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="py-3 font-bold text-slate-900 flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-[#8B5FBF]/10 text-[#8B5FBF] font-bold flex items-center justify-center">${u.name.charAt(0)}</div>
                        ${u.name}
                      </td>
                      <td class="py-3 text-slate-600">${u.email}</td>
                      <td class="py-3">
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : (u.role === 'seller' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700')}">
                          ${u.role === 'admin' ? 'Administrador' : (u.role === 'seller' ? 'Vendedor' : 'Cliente')}
                        </span>
                      </td>
                      <td class="py-3">
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}">
                          ${u.status === 'active' ? 'Ativo' : 'Suspenso'}
                        </span>
                      </td>
                      <td class="py-3 text-slate-500">${u.joined || '01/01/2026'}</td>
                      <td class="py-3 text-right space-x-1">
                        <button onclick="window.handleAdminToggleRole('${u.id}')" title="Tornar / Remover Admin" class="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50"><span class="material-symbols-outlined text-base">admin_panel_settings</span></button>
                        <button onclick="window.handleAdminToggleSuspendUser('${u.id}')" title="Suspender / Ativar" class="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"><span class="material-symbols-outlined text-base">block</span></button>
                        <button onclick="window.handleAdminDeleteUser('${u.id}')" title="Excluir Usuário" class="p-1.5 rounded-lg text-red-600 hover:bg-red-50"><span class="material-symbols-outlined text-base">delete</span></button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- SECTION 3: LOJAS -->
        <div id="admin-sec-stores" class="admin-sec hidden space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-slate-900">Gestão de Lojas Parceiras</h1>
              <p class="text-xs text-slate-500">Aprove novas solicitações, edite detalhes ou modere lojas</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${stores.map(s => `
              <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div class="flex items-center gap-3">
                  <img src="${s.logo}" class="w-12 h-12 rounded-full object-cover border-2 border-slate-200">
                  <div>
                    <h3 class="font-bold text-sm text-slate-900">${s.name}</h3>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${s.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
                      ${s.status === 'approved' ? 'Aprovada' : 'Aguardando Aprovação'}
                    </span>
                  </div>
                </div>

                <div class="text-xs text-slate-600 space-y-1">
                  <p>👥 <strong>${s.followersCount}</strong> seguidores</p>
                  <p>📦 <strong>${s.productsCount}</strong> produtos no catálogo</p>
                  <p>★ <strong>${s.rating}</strong> média de avaliação</p>
                </div>

                <div class="flex gap-2 pt-2 border-t border-slate-100">
                  ${s.status === 'pending' ? `
                    <button onclick="window.handleAdminApproveStore('${s.id}')" class="flex-grow py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors">Aprovar Loja</button>
                  ` : `
                    <button onclick="window.handleAdminToggleStoreStatus('${s.id}')" class="flex-grow py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors">Suspender</button>
                  `}
                  <a href="#/store" class="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors">Ver Loja</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- SECTION 4: PRODUTOS -->
        <div id="admin-sec-products" class="admin-sec hidden space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-slate-900">Moderação de Produtos</h1>
              <p class="text-xs text-slate-500">Aprove novos itens cadastrados pelos lojistas e destaque lançamentos</p>
            </div>
          </div>

          <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs font-medium border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                    <th class="pb-3">Produto</th>
                    <th class="pb-3">Categoria</th>
                    <th class="pb-3">Preço</th>
                    <th class="pb-3">Status</th>
                    <th class="pb-3">Destaque</th>
                    <th class="pb-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${products.map(p => `
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="py-3 font-bold text-slate-900 flex items-center gap-3">
                        <img src="${p.img}" class="w-9 h-9 rounded-xl object-contain bg-slate-100 p-1">
                        ${p.name}
                      </td>
                      <td class="py-3 text-slate-600">${p.cat}</td>
                      <td class="py-3 font-bold text-[#8B5FBF]">${p.price}</td>
                      <td class="py-3">
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
                          ${p.status === 'approved' ? 'Aprovado' : 'Pendente'}
                        </span>
                      </td>
                      <td class="py-3">
                        <button onclick="window.handleAdminToggleFeaturedProduct('${p.id}')" class="text-amber-500 font-bold flex items-center gap-1">
                          <span class="material-symbols-outlined text-base" style="font-variation-settings:'FILL' ${p.isFeatured ? 1 : 0}">star</span>
                          ${p.isFeatured ? 'Destacado' : 'Normal'}
                        </button>
                      </td>
                      <td class="py-3 text-right space-x-1">
                        ${p.status === 'pending' ? `<button onclick="window.handleAdminApproveProduct('${p.id}')" class="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px]">Aprovar</button>` : ''}
                        <button onclick="window.handleAdminDeleteProduct('${p.id}')" class="p-1.5 rounded-lg text-red-600 hover:bg-red-50"><span class="material-symbols-outlined text-base">delete</span></button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- SECTION 5: PEDIDOS -->
        <div id="admin-sec-orders" class="admin-sec hidden space-y-6">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Todos os Pedidos do Marketplace</h1>
            <p class="text-xs text-slate-500">Monitoramento global de pagamentos e envios</p>
          </div>

          <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs font-medium border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                    <th class="pb-3">Código</th>
                    <th class="pb-3">Cliente</th>
                    <th class="pb-3">Vendedor / Loja</th>
                    <th class="pb-3">Valor Total</th>
                    <th class="pb-3">Pagamento</th>
                    <th class="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${orders.map(o => `
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="py-3 font-bold text-[#8B5FBF]">${o.id}</td>
                      <td class="py-3 text-slate-900 font-bold">${o.clientName}</td>
                      <td class="py-3 text-slate-600">${o.storeName}</td>
                      <td class="py-3 font-bold text-slate-900">R$ ${parseFloat(o.totalValue || 0).toFixed(2)}</td>
                      <td class="py-3 text-slate-600">${o.paymentMethod}</td>
                      <td class="py-3">
                        <select onchange="window.handleAdminUpdateOrderStatus('${o.id}', this.value)" class="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-[11px] font-bold text-slate-700 outline-none">
                          <option value="PAGAMENTO CONFIRMADO" ${o.status === 'PAGAMENTO CONFIRMADO' ? 'selected' : ''}>Pagamento Confirmado</option>
                          <option value="EM PREPARAÇÃO" ${o.status === 'EM PREPARAÇÃO' || o.status === 'PREPARANDO' || o.status === 'EM SEPARAÇÃO' || o.status === 'EM CURADORIA' ? 'selected' : ''}>Em Preparação</option>
                          <option value="ENVIADO" ${o.status === 'ENVIADO' ? 'selected' : ''}>Enviado</option>
                          <option value="SAIU PARA ENTREGA" ${o.status === 'SAIU PARA ENTREGA' ? 'selected' : ''}>Saiu para Entrega</option>
                          <option value="ENTREGUE" ${o.status === 'ENTREGUE' ? 'selected' : ''}>Entregue</option>
                        </select>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- SECTION 6: FINANCEIRO -->
        <div id="admin-sec-financial" class="admin-sec hidden space-y-6">
          <h1 class="text-2xl font-bold text-slate-900">Balanço Financeiro da Plataforma</h1>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span class="text-xs font-bold text-slate-400 uppercase">Receita Bruta Acumulada</span>
              <h3 class="text-3xl font-extrabold text-[#8B5FBF]">R$ ${totalSoldValue.toFixed(2)}</h3>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span class="text-xs font-bold text-slate-400 uppercase">Comissão Líquida Recebida</span>
              <h3 class="text-3xl font-extrabold text-emerald-600">R$ ${platformCommissionValue.toFixed(2)}</h3>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span class="text-xs font-bold text-slate-400 uppercase">Repasse a Vendedores</span>
              <h3 class="text-3xl font-extrabold text-blue-600">R$ ${(totalSoldValue - platformCommissionValue).toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <!-- SECTION 7: AVALIAÇÕES -->
        <div id="admin-sec-reviews" class="admin-sec hidden space-y-6">
          <h1 class="text-2xl font-bold text-slate-900">Moderação de Avaliações</h1>
          <p class="text-xs text-slate-500">Supervisão de depoimentos e notas dos clientes</p>

          <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
              <div>
                <p class="font-bold text-xs text-slate-900">Camila Rodriguez ★★★★★</p>
                <p class="text-xs text-slate-600 italic">"Produto de qualidade incrível e entrega super rápida!"</p>
              </div>
              <button onclick="showToast('Avaliação mantida', 'success')" class="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Aprovada</button>
            </div>
          </div>
        </div>

        <!-- SECTION 8: DENÚNCIAS -->
        <div id="admin-sec-reports" class="admin-sec hidden space-y-6">
          <h1 class="text-2xl font-bold text-slate-900">Denúncias de Usuários</h1>

          <div class="space-y-4">
            ${reports.map(r => `
              <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span class="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase">${r.targetType}</span>
                  <h3 class="font-bold text-sm text-slate-900 mt-1">${r.targetName}</h3>
                  <p class="text-xs text-slate-600 mt-1"><strong>Motivo:</strong> ${r.reason}</p>
                  <span class="text-[10px] text-slate-400 block mt-1">Denunciado por ${r.reporterName} • ${r.date}</span>
                </div>

                <div class="flex flex-wrap gap-2">
                  <button onclick="window.handleAdminResolveReport('${r.id}')" class="px-4 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700">Resolver</button>
                  <button onclick="window.handleAdminIgnoreReport('${r.id}')" class="px-4 py-2 rounded-full bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300">Ignorar</button>
                  <button onclick="window.handleAdminSuspendFromReport('${r.id}')" class="px-4 py-2 rounded-full bg-amber-500 text-white font-bold text-xs hover:bg-amber-600">Suspender Usuário</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- SECTION 9: CUPONS -->
        <div id="admin-sec-coupons" class="admin-sec hidden space-y-6">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-slate-900">Gerenciador Master de Cupons</h1>
            <button onclick="window.handleAdminCreateCoupon()" class="px-5 py-2.5 rounded-full bg-[#8B5FBF] text-white font-bold text-xs shadow-md">+ Criar Cupom</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${coupons.map(c => `
              <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span class="font-bold text-[#8B5FBF] text-sm block">${c.code}</span>
                  <span class="text-xs text-slate-600 font-bold">${c.discountPercent}% OFF</span>
                  <span class="text-[10px] text-slate-400 block mt-1">Usado ${c.usageCount} vezes</span>
                </div>
                <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Ativo</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- SECTION 10: CATEGORIAS -->
        <div id="admin-sec-categories" class="admin-sec hidden space-y-6">
          <h1 class="text-2xl font-bold text-slate-900">Categorias do Marketplace</h1>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            ${categories.map(cat => `
              <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-purple-50 text-[#8B5FBF] flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined text-xl">${cat.icon}</span>
                </div>
                <div>
                  <h3 class="font-bold text-xs text-slate-900">${cat.name}</h3>
                  <span class="text-[10px] text-slate-400 font-medium">${cat.productCount} produtos</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- SECTION 11: RELATÓRIOS -->
        <div id="admin-sec-reports_analytics" class="admin-sec hidden space-y-6">
          <h1 class="text-2xl font-bold text-slate-900">Relatórios Estratégicos Exportáveis</h1>

          <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <p class="text-xs text-slate-600">Gere relatórios em formato CSV/PDF sobre faturamento, curva de vendas e reputação de vendedores.</p>
            <button onclick="showToast('Relatório de vendas exportado com sucesso!', 'success')" class="px-6 py-3 rounded-full bg-[#8B5FBF] text-white font-bold text-xs shadow-md">
              📥 Exportar Relatório de Vendas (2026)
            </button>
          </div>
        </div>

        <!-- SECTION 12: CONFIGURAÇÕES -->
        <div id="admin-sec-settings" class="admin-sec hidden space-y-6">
          <h1 class="text-2xl font-bold text-slate-900">Configurações Gerais do Marketplace</h1>

          <form onsubmit="window.handleAdminSaveSettings(event)" class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 max-w-3xl">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Nome da Plataforma</label>
              <input type="text" id="cfg-platform-name" value="${settings.platformName || 'Beleza na Web Marketplace'}" class="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium outline-none focus:border-[#8B5FBF]">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Taxa de Comissão (%)</label>
                <input type="number" step="0.5" id="cfg-commission" value="${settings.commissionRate || 15.0}" class="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium outline-none focus:border-[#8B5FBF]">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Regra de Frete</label>
                <input type="text" id="cfg-shipping" value="${settings.shippingFee || 'R$ 12,90'}" class="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium outline-none focus:border-[#8B5FBF]">
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Políticas & Termos de Uso</label>
              <textarea id="cfg-terms" rows="3" class="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium outline-none focus:border-[#8B5FBF]">${settings.termsOfUse || ''}</textarea>
            </div>

            <button type="submit" class="px-8 py-3.5 rounded-full bg-[#8B5FBF] text-white font-bold text-xs shadow-lg hover:scale-105 transition-all">
              💾 Salvar Configurações Master
            </button>
          </form>
        </div>

      </main>
    </div>
  </div>`;
}

export function mount() {
  const user = auth.getUser();
  if (!user || (user.role !== 'admin' && user.role !== 'admin_master')) return;

  window.switchAdminSection = (secId) => {
    document.querySelectorAll('.admin-sec').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById(`admin-sec-${secId}`);
    if (target) target.classList.remove('hidden');

    // Update active sidebar button
    document.querySelectorAll('aside nav button').forEach(btn => {
      btn.className = 'w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/10 hover:text-white transition-all text-xs font-semibold';
    });
    const activeBtn = document.getElementById(`side-${secId}`);
    if (activeBtn) {
      activeBtn.className = 'w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#8B5FBF] text-white font-bold shadow-lg shadow-[#8B5FBF]/30 transition-all text-xs';
    }
  };

  window.handleAdminToggleRole = (userId) => {
    const users = database.getUsers();
    const u = users.find(x => x.id === userId);
    if (u) {
      const newRole = (u.role === 'admin' || u.role === 'admin_master') ? 'client' : 'admin';
      u.role = newRole;
      database.saveUsers(users);

      const emailLower = (u.email || '').toLowerCase().trim();

      // Salva na lista dinâmica de administradores
      try {
        const storedAdmins = JSON.parse(localStorage.getItem('ann_admin_emails') || '[]');
        if (newRole === 'admin') {
          if (!storedAdmins.includes(emailLower)) storedAdmins.push(emailLower);
        } else {
          const idx = storedAdmins.indexOf(emailLower);
          if (idx !== -1) storedAdmins.splice(idx, 1);
        }
        localStorage.setItem('ann_admin_emails', JSON.stringify(storedAdmins));
      } catch (_) {}

      // Atualiza registro de usuários
      try {
        const regUsers = auth.getRegisteredUsers();
        if (regUsers[emailLower]) {
          regUsers[emailLower].role = newRole;
          regUsers[emailLower].accountType = newRole === 'admin' ? 'pessoal' : (newRole === 'seller' ? 'comercial' : 'pessoal');
          localStorage.setItem('ann_registered_users', JSON.stringify(regUsers));
        }
      } catch (_) {}

      // Atualiza perfil salvo
      try {
        const savedProfile = localStorage.getItem(`ann_profile_${emailLower}`);
        const prof = savedProfile ? JSON.parse(savedProfile) : {};
        prof.role = newRole;
        localStorage.setItem(`ann_profile_${emailLower}`, JSON.stringify(prof));
      } catch (_) {}

      // Se for o usuário conectado, atualiza a sessão imediatamente
      const currentUser = auth.getUser();
      if (currentUser && currentUser.email.toLowerCase().trim() === emailLower) {
        currentUser.role = newRole;
        localStorage.setItem('ann_beauty_user', JSON.stringify(currentUser));
        window.dispatchEvent(new Event('auth-change'));
      }

      showToast(`Permissão de ${u.name} atualizada para ${newRole === 'admin' ? 'Administrador' : 'Cliente'}!`, 'success');
      setTimeout(() => location.reload(), 400);
    }
  };

  window.handleAdminToggleSuspendUser = (userId) => {
    const users = database.getUsers();
    const u = users.find(x => x.id === userId);
    if (u) {
      u.status = u.status === 'active' ? 'suspended' : 'active';
      database.saveUsers(users);
      showToast(`Status de ${u.name} alterado para ${u.status}!`, 'info');
      setTimeout(() => location.reload(), 500);
    }
  };

  window.handleAdminDeleteUser = (userId) => {
    if (confirm('Tem certeza que deseja excluir este usuário permanentemente?')) {
      const users = database.getUsers().filter(x => x.id !== userId);
      database.saveUsers(users);
      showToast('Usuário excluído', 'success');
      setTimeout(() => location.reload(), 500);
    }
  };

  window.handleAdminApproveStore = (storeId) => {
    const stores = database.getStores();
    const s = stores.find(x => x.id === storeId);
    if (s) {
      s.status = 'approved';
      database.saveStores(stores);
      showToast(`Loja ${s.name} aprovada com sucesso!`, 'success');
      setTimeout(() => location.reload(), 500);
    }
  };

  window.handleAdminToggleStoreStatus = (storeId) => {
    const stores = database.getStores();
    const s = stores.find(x => x.id === storeId);
    if (s) {
      s.status = s.status === 'approved' ? 'suspended' : 'approved';
      database.saveStores(stores);
      showToast(`Status da loja ${s.name} alterado para ${s.status}!`, 'info');
      setTimeout(() => location.reload(), 500);
    }
  };

  window.handleAdminApproveProduct = (productId) => {
    const products = database.getProducts();
    const p = products.find(x => x.id === productId);
    if (p) {
      p.status = 'approved';
      database.saveProducts(products);
      showToast(`Produto ${p.name} aprovado!`, 'success');
      setTimeout(() => location.reload(), 500);
    }
  };

  window.handleAdminToggleFeaturedProduct = (productId) => {
    const products = database.getProducts();
    const p = products.find(x => x.id === productId);
    if (p) {
      p.isFeatured = !p.isFeatured;
      database.saveProducts(products);
      showToast(`Destaque do produto ${p.name} atualizado!`, 'success');
      setTimeout(() => location.reload(), 500);
    }
  };

  window.handleAdminDeleteProduct = (productId) => {
    if (confirm('Remover produto do marketplace?')) {
      const products = database.getProducts().filter(x => x.id !== productId);
      database.saveProducts(products);
      showToast('Produto removido', 'success');
      setTimeout(() => location.reload(), 500);
    }
  };

  window.handleAdminResolveReport = (reportId) => {
    const reports = database.getReports();
    const r = reports.find(x => x.id === reportId);
    if (r) {
      r.status = 'resolved';
      database.saveReports(reports);
      showToast('Denúncia marcada como resolvida!', 'success');
      setTimeout(() => location.reload(), 500);
    }
  };

  window.handleAdminIgnoreReport = (reportId) => {
    const reports = database.getReports().filter(x => x.id !== reportId);
    database.saveReports(reports);
    showToast('Denúncia ignorada', 'info');
    setTimeout(() => location.reload(), 500);
  };

  window.handleAdminCreateCoupon = () => {
    const code = prompt('Digite o código do novo cupom master:');
    if (code) {
      const coupons = database.getCoupons();
      coupons.push({ id: 'cup_' + Date.now(), code: code.toUpperCase(), discountPercent: 15, validUntil: '31/12/2026', usageCount: 0, status: 'active' });
      database.saveCoupons(coupons);
      showToast(`Cupom ${code.toUpperCase()} criado!`, 'success');
      setTimeout(() => location.reload(), 500);
    }
  };

  window.handleAdminSaveSettings = (e) => {
    e.preventDefault();
    const name = document.getElementById('cfg-platform-name').value;
    const comm = parseFloat(document.getElementById('cfg-commission').value);
    const ship = document.getElementById('cfg-shipping').value;
    const terms = document.getElementById('cfg-terms').value;

    const cfg = database.getSettings();
    cfg.platformName = name;
    cfg.commissionRate = comm;
    cfg.shippingFee = ship;
    cfg.termsOfUse = terms;

    database.saveSettings(cfg);
    showToast('Configurações master salvas com sucesso!', 'success');
  };

  window.handleAdminUpdateOrderStatus = (orderId, newStatus) => {
    try {
      const allDbOrders = database.getOrders();
      const orderIdx = allDbOrders.findIndex(o => o.id === orderId);
      
      if (orderIdx > -1) {
        allDbOrders[orderIdx].status = newStatus;
        database.saveOrders(allDbOrders);

        // Also update local storage if client tracks it
        const localOrders = JSON.parse(localStorage.getItem('ann_orders') || '[]');
        const localOrderIdx = localOrders.findIndex(o => o.id === orderId);
        if (localOrderIdx > -1) {
          localOrders[localOrderIdx].status = newStatus;
          localStorage.setItem('ann_orders', JSON.stringify(localOrders));
        }

        showToast(`Pedido ${orderId} atualizado para "${newStatus}"!`, 'success');
        setTimeout(() => location.reload(), 500);
      } else {
        showToast('Pedido não encontrado.', 'error');
      }
    } catch (e) {
      showToast('Erro ao atualizar status do pedido.', 'error');
      console.error(e);
    }
  };
}
