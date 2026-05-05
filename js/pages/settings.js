import { auth } from '../auth.js';
import { showToast } from '../components.js';

export default function settingsPage() {
    const user = auth.getUser();
    if (!user) {
        window.location.hash = '#/login';
        return '';
    }

    // Handlers for the form
    window.handleUpdateSettings = (e) => {
        e.preventDefault();
        const name = document.getElementById('setting-name').value;
        const email = document.getElementById('setting-email').value;
        const password = document.getElementById('setting-password').value;

        // Since it's a mock backend, we'll just update localStorage directly
        user.name = name;
        user.email = email;
        localStorage.setItem('ann_beauty_user', JSON.stringify(user));
        
        // Simulating password change
        if (password.trim() !== '') {
             showToast('Senha atualizada com sucesso!', 'success');
        }

        showToast('Dados atualizados com sucesso!', 'success');
        
        // Force header update
        window.dispatchEvent(new Event('auth-change'));
        
        // Clear password field
        document.getElementById('setting-password').value = '';
    };

    return `
    <main class="w-full max-w-4xl mx-auto px-4 md:px-10 py-12">
        <header class="mb-10 text-center md:text-left">
            <h1 class="font-display text-4xl text-on-surface mb-2">Configurações da Conta</h1>
            <p class="text-on-surface-variant font-body-md">Gerencie seus dados pessoais, senha e preferências de privacidade.</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Sidebar -->
            <div class="md:col-span-1 flex flex-col gap-2">
                <a href="#/settings" class="bg-primary/10 text-primary font-bold px-6 py-4 rounded-xl flex items-center gap-3">
                    <span class="material-symbols-outlined">settings</span> Dados Pessoais
                </a>
                <a href="#/favorites" class="hover:bg-purple-50 text-slate-600 px-6 py-4 rounded-xl flex items-center gap-3 transition-colors">
                    <span class="material-symbols-outlined">bookmark</span> Seus Itens Salvos
                </a>
                <a href="#/profile" class="hover:bg-purple-50 text-slate-600 px-6 py-4 rounded-xl flex items-center gap-3 transition-colors">
                    <span class="material-symbols-outlined">account_circle</span> Visualizar Perfil
                </a>
                <a href="#/tracking" class="hover:bg-purple-50 text-slate-600 px-6 py-4 rounded-xl flex items-center gap-3 transition-colors">
                    <span class="material-symbols-outlined">local_shipping</span> Seus Pedidos
                </a>
            </div>

            <!-- Form Area -->
            <div class="md:col-span-2 bg-white rounded-3xl shadow-xl border border-purple-50 p-8">
                <h2 class="font-display text-2xl text-on-surface mb-6 border-b border-purple-50 pb-4">Informações Básicas</h2>
                
                <form onsubmit="window.handleUpdateSettings(event)" class="flex flex-col gap-6">
                    <div>
                        <label class="block text-sm font-bold text-slate-600 mb-2">Nome Completo</label>
                        <input id="setting-name" type="text" value="${user.name}" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-bold text-slate-600 mb-2">E-mail</label>
                        <input id="setting-email" type="email" value="${user.email}" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700">
                    </div>

                    <div class="pt-4 mt-2 border-t border-purple-50">
                        <h2 class="font-display text-2xl text-on-surface mb-6">Segurança</h2>
                        <label class="block text-sm font-bold text-slate-600 mb-2">Nova Senha (deixe em branco para não alterar)</label>
                        <input id="setting-password" type="password" placeholder="********" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700">
                    </div>

                    <div class="flex justify-end pt-4">
                        <button type="submit" class="bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg">Salvar Alterações</button>
                    </div>
                </form>
            </div>
        </div>
    </main>
    `;
}
