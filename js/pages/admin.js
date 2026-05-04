import { showToast } from '../components.js';

export default function adminPage() {
    const isAdmin = sessionStorage.getItem('ann_admin_logged') === 'true';

    window.handleAdminLogin = (event) => {
        event.preventDefault();
        const email = document.getElementById('admin-email').value;
        const pass = document.getElementById('admin-pass').value;

        if (email === 'annyisabely@gmail.com' && pass === 'a.n.n123456789') {
            sessionStorage.setItem('ann_admin_logged', 'true');
            showToast('Acesso administrativo concedido.', 'success');
            window.location.reload();
        } else {
            showToast('Credenciais inválidas.', 'error');
        }
    };

    window.adminLogout = () => {
        sessionStorage.removeItem('ann_admin_logged');
        window.location.hash = '#/home';
    };

    window.switchAdminTab = (tab) => {
        const sections = ['dashboard-section', 'users-section', 'content-section'];
        sections.forEach(s => document.getElementById(s).classList.add('hidden'));
        document.getElementById(`${tab}-section`).classList.remove('hidden');
    };

    window.saveUserProfile = (id) => {
        const name = document.getElementById(`user-name-${id}`).value;
        const bio = document.getElementById(`user-bio-${id}`).value;
        const fileInput = document.getElementById(`user-photo-file-${id}`);
        
        localStorage.setItem('ann_profile_bio', bio);
        
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                localStorage.setItem('ann_profile_photo', e.target.result);
                showToast(`Perfil e Foto atualizados!`, 'success');
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            showToast(`Perfil atualizado!`, 'success');
        }
    };

    window.postContent = (event) => {
        event.preventDefault();
        const type = document.getElementById('post-type').value;
        const fileInput = document.getElementById('post-file');
        const caption = document.getElementById('post-caption').value;

        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newPost = {
                    id: Date.now(),
                    type: type,
                    data: e.target.result,
                    caption: caption,
                    date: new Date().toLocaleDateString()
                };
                const posts = JSON.parse(localStorage.getItem('ann_posts') || '[]');
                posts.unshift(newPost);
                localStorage.setItem('ann_posts', JSON.stringify(posts));
                showToast(`${type === 'video' ? 'Vídeo' : 'Foto'} publicado com sucesso!`, 'success');
                document.getElementById('post-form').reset();
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    };

    // Follower Simulation Logic (Visual only for dashboard)
    if (!window.followerInterval) {
        window.followerCount = parseInt(localStorage.getItem('ann_followers')) || 12450;
        window.followerInterval = setInterval(() => {
            const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
            window.followerCount += change;
            localStorage.setItem('ann_followers', window.followerCount);
            const counter = document.getElementById('follower-counter');
            if (counter) counter.innerText = window.followerCount.toLocaleString();
        }, 180000); // 3 minutes
    }

    if (!isAdmin) {
        // ... (Login view remains same)
        return `
        <div class="min-h-screen bg-black flex items-center justify-center p-6">
            <div class="w-full max-w-md bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl">
                <div class="text-center mb-10">
                    <span class="material-symbols-outlined text-primary text-5xl mb-4">lock</span>
                    <h2 class="font-display text-3xl text-white">Painel Administrativo</h2>
                    <p class="text-white/40 text-sm mt-2">Área restrita para gestão da plataforma.</p>
                </div>
                <form onsubmit="window.handleAdminLogin(event)" class="space-y-6">
                    <div class="space-y-2">
                        <label class="text-xs text-white/50 uppercase tracking-widest ml-4">E-mail</label>
                        <input id="admin-email" type="email" class="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition-all" placeholder="annyisabely@gmail.com" required>
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs text-white/50 uppercase tracking-widest ml-4">Senha</label>
                        <input id="admin-pass" type="password" class="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition-all" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="w-full py-4 rounded-full bg-primary text-white font-bold hover:bg-primary-container transition-all shadow-lg shadow-primary/20 mt-4">
                        Entrar no Painel
                    </button>
                </form>
                <div class="mt-8 text-center">
                    <a href="#/home" class="text-xs text-white/30 hover:text-white transition-colors">Voltar para a Loja</a>
                </div>
            </div>
        </div>
        `;
    }

    // Admin Dashboard View
    return `
    <div class="min-h-screen bg-[#0a0a0a] text-white">
        <header class="bg-white/5 backdrop-blur-md border-b border-white/10 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
            <div class="flex items-center gap-8">
                <span class="font-display text-2xl text-primary">A.n.n Admin</span>
                <nav class="hidden md:flex gap-6 text-xs uppercase tracking-widest font-bold">
                    <button onclick="window.switchAdminTab('dashboard')" class="hover:text-primary transition-colors">Dashboard</button>
                    <button onclick="window.switchAdminTab('users')" class="hover:text-primary transition-colors">Usuários</button>
                    <button onclick="window.switchAdminTab('content')" class="hover:text-primary transition-colors">Postagens</button>
                </nav>
            </div>
            <button onclick="window.adminLogout()" class="flex items-center gap-2 text-sm text-white/50 hover:text-red-400 transition-colors">
                <span class="material-symbols-outlined text-[18px]">logout</span> Sair
            </button>
        </header>

        <main class="max-w-7xl mx-auto px-8 py-12">
            <!-- DASHBOARD SECTION -->
            <div id="dashboard-section">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div class="bg-white/5 p-6 rounded-3xl border border-white/10">
                        <p class="text-white/40 text-[10px] uppercase tracking-widest mb-2">Seguidores Ativos</p>
                        <h3 id="follower-counter" class="text-3xl font-display text-primary">${(window.followerCount || 12450).toLocaleString()}</h3>
                        <p class="text-white/20 text-[10px] mt-1 italic">Atualiza a cada 3 min</p>
                    </div>
                    <div class="bg-white/5 p-6 rounded-3xl border border-white/10">
                        <p class="text-white/40 text-[10px] uppercase tracking-widest mb-2">Vendas Totais</p>
                        <h3 class="text-3xl font-display text-white">R$ 14.520</h3>
                    </div>
                    <div class="bg-white/5 p-6 rounded-3xl border border-white/10">
                        <p class="text-white/40 text-[10px] uppercase tracking-widest mb-2">Novos Pedidos</p>
                        <h3 class="text-3xl font-display text-white">24</h3>
                    </div>
                    <div class="bg-white/5 p-6 rounded-3xl border border-white/10">
                        <p class="text-white/40 text-[10px] uppercase tracking-widest mb-2">Engajamento</p>
                        <h3 class="text-3xl font-display text-green-400">88%</h3>
                    </div>
                </div>

                <div class="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
                    <div class="px-8 py-6 border-b border-white/10"><h4 class="font-display text-xl">Pedidos Recentes</h4></div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead><tr class="text-white/30 text-[10px] uppercase tracking-widest"><th class="px-8 py-4">Pedido</th><th class="px-8 py-4">Cliente</th><th class="px-8 py-4">Status</th><th class="px-8 py-4 text-right">Valor</th></tr></thead>
                            <tbody class="divide-y divide-white/5">
                                <tr><td class="px-8 py-6 text-sm font-medium">#ANN-1042</td><td class="px-8 py-6 text-sm">Mariana Costa</td><td class="px-8 py-6"><span class="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded-full font-bold">PAGO</span></td><td class="px-8 py-6 text-right font-bold text-sm">R$ 290,00</td></tr>
                                <tr><td class="px-8 py-6 text-sm font-medium">#ANN-1041</td><td class="px-8 py-6 text-sm">Juliana Alves</td><td class="px-8 py-6"><span class="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] rounded-full font-bold">PENDENTE</span></td><td class="px-8 py-6 text-right font-bold text-sm">R$ 185,00</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- USERS SECTION -->
            <div id="users-section" class="hidden">
                <div class="bg-white/5 rounded-3xl border border-white/10 p-8">
                    <h4 class="font-display text-2xl mb-8">Gestão de Usuários</h4>
                    <div class="grid grid-cols-1 gap-6">
                        <div class="flex flex-col gap-6 p-8 bg-white/5 rounded-3xl border border-white/5">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30">
                                        <img src="${localStorage.getItem('ann_profile_photo') || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC77ZoIlcWkWMv6PoHvkxSm9AoIAod0TJnJZWF2MeQxi2AruIoztM2Esx1b7bu7WxXGBGql9gTS2qlzljZWZAgMwk3SP1E-X-LjEVwToyizyz0TQShvF0SJnfPxI85iPPDiyG4Hcj8ZowqeUsmVL7FgblL1dmjET0-akwNh34c4Wg5a6Miix5O7Dh_wwJUW2CLFx_SwKVGVqV0yXrLrcEmYdC9FimpquKe5z8CwL80QMWe0xc3-uZYa93ToeCwEUhDkvbtB7Ccw8obU'}" class="w-full h-full object-cover">
                                    </div>
                                    <div><p class="text-white font-medium">Aparecida Oliveira</p><p class="text-white/40 text-xs">aparecida@email.com</p></div>
                                </div>
                                <span class="px-3 py-1 bg-primary/10 text-primary text-[10px] rounded-full font-bold uppercase tracking-widest">Usuária Principal</span>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <label class="text-[10px] text-white/40 uppercase tracking-widest ml-2">Nome de Exibição</label>
                                    <input id="user-name-1" type="text" class="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm outline-none focus:border-primary" value="Aparecida Oliveira">
                                </div>
                                <div class="space-y-2">
                                    <label class="text-[10px] text-white/40 uppercase tracking-widest ml-2">Foto de Perfil (Upload)</label>
                                    <input id="user-photo-file-1" type="file" accept="image/*" class="w-full bg-white/5 border border-white/10 rounded-full px-6 py-2 text-sm outline-none focus:border-primary file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary-container">
                                </div>
                                <div class="space-y-2 md:col-span-2">
                                    <label class="text-[10px] text-white/40 uppercase tracking-widest ml-2">Biografia / Status</label>
                                    <textarea id="user-bio-1" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm outline-none focus:border-primary" rows="2">${localStorage.getItem('ann_profile_bio') || '"Entusiasta de beleza etérea | Minimalista em skincare ✨"'}</textarea>
                                </div>
                            </div>
                            
                            <div class="flex justify-end">
                                <button onclick="window.saveUserProfile(1)" class="bg-primary hover:bg-primary-container px-10 py-3 rounded-full text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">Salvar Alterações</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CONTENT SECTION -->
            <div id="content-section" class="hidden">
                <div class="max-w-2xl bg-white/5 rounded-3xl border border-white/10 p-8 mx-auto">
                    <h4 class="font-display text-2xl mb-8">Postar Conteúdo</h4>
                    <form id="post-form" onsubmit="window.postContent(event)" class="space-y-6">
                        <div class="space-y-2">
                            <label class="text-xs text-white/50 uppercase tracking-widest">Tipo de Mídia</label>
                            <select id="post-type" class="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white outline-none focus:border-primary">
                                <option value="photo">Foto (Look)</option>
                                <option value="video">Vídeo (Ritual)</option>
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label class="text-xs text-white/50 uppercase tracking-widest">Legenda</label>
                            <textarea id="post-caption" class="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-primary" rows="4" placeholder="Descreva este ritual de beleza..."></textarea>
                        </div>
                        <div class="relative group">
                            <input id="post-file" type="file" accept="image/*,video/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                            <div class="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center group-hover:border-primary transition-colors bg-white/2">
                                <span class="material-symbols-outlined text-4xl text-white/20 mb-2">add_a_photo</span>
                                <p class="text-white/40 text-sm">Clique para selecionar foto ou vídeo do seu aparelho</p>
                            </div>
                        </div>
                        <button type="submit" class="w-full py-4 rounded-full bg-primary text-white font-bold hover:bg-primary-container transition-all">Publicar Agora</button>
                    </form>
                </div>
            </div>
        </main>
    </div>`;
}
