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
    <main class="w-full max-w-[1280px] mx-auto px-4 md:px-10 py-16 bg-background">
        <header class="mb-16 text-center md:text-left">
            <div class="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-6">Controle & Essência</div>
            <h1 class="font-display text-4xl m:text-5xl text-on-background tracking-tighter mb-4">Configurações da <span class="italic text-primary">Conta</span></h1>
            <p class="text-on-surface-variant font-medium opacity-70 max-w-2xl">Gerencie sua identidade digital, rituais salvos e as diretrizes de privacidade da nossa comunidade.</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
            <!-- Sidebar -->
            <div class="md:col-span-1 flex flex-col gap-3">
                <button onclick="document.getElementById('settings-personal').classList.remove('hidden'); document.getElementById('settings-legal').classList.add('hidden'); this.classList.add('bg-primary/10', 'text-primary'); this.parentElement.querySelectorAll('button, a').forEach(el => { if(el !== this) el.classList.remove('bg-primary/10', 'text-primary') });" class="bg-primary/10 text-primary font-bold px-8 py-5 rounded-[24px] flex items-center gap-4 transition-all w-full text-left shadow-sm border border-primary/5">
                    <span class="material-symbols-outlined text-[20px]">settings</span> Dados Pessoais
                </button>
                <a href="#/favorites" class="group hover:bg-white text-on-surface-variant px-8 py-5 rounded-[24px] flex items-center gap-4 transition-all border border-transparent hover:border-primary/5 hover:shadow-ethereal">
                    <span class="material-symbols-outlined text-[20px] opacity-40 group-hover:text-primary transition-colors">bookmark</span> Itens Salvos
                </a>
                <a href="#/profile" class="group hover:bg-white text-on-surface-variant px-8 py-5 rounded-[24px] flex items-center gap-4 transition-all border border-transparent hover:border-primary/5 hover:shadow-ethereal">
                    <span class="material-symbols-outlined text-[20px] opacity-40 group-hover:text-primary transition-colors">account_circle</span> Ver Perfil
                </a>
                <a href="#/tracking" class="group hover:bg-white text-on-surface-variant px-8 py-5 rounded-[24px] flex items-center gap-4 transition-all border border-transparent hover:border-primary/5 hover:shadow-ethereal">
                    <span class="material-symbols-outlined text-[20px] opacity-40 group-hover:text-primary transition-colors">local_shipping</span> Meus Pedidos
                </a>
                <button onclick="document.getElementById('settings-personal').classList.add('hidden'); document.getElementById('settings-legal').classList.remove('hidden'); this.classList.add('bg-primary/10', 'text-primary'); this.parentElement.querySelectorAll('button, a').forEach(el => { if(el !== this) el.classList.remove('bg-primary/10', 'text-primary') });" class="hover:bg-white text-on-surface-variant px-8 py-5 rounded-[24px] flex items-center gap-4 transition-all border border-transparent hover:border-primary/5 hover:shadow-ethereal w-full text-left">
                    <span class="material-symbols-outlined text-[20px] opacity-40">gavel</span> Legal e Termos
                </button>
            </div>

            <!-- Content Area -->
            <div class="md:col-span-3">
                <!-- Personal Settings Section -->
                <div id="settings-personal" class="bg-white rounded-[40px] shadow-ethereal border border-primary/5 p-10 md:p-12">
                    <h2 class="font-display text-3xl text-on-background mb-10 border-b border-primary/10 pb-6">Identidade Digital</h2>
                    
                    <form onsubmit="window.handleUpdateSettings(event)" class="flex flex-col gap-10">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div class="space-y-3">
                                <label class="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-[0.2em] ml-4">Nome de Exibição</label>
                                <input id="setting-name" type="text" value="${user.name}" required class="w-full bg-primary-container/10 border-none rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-background">
                            </div>
                            
                            <div class="space-y-3">
                                <label class="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-[0.2em] ml-4">Seu E-mail Cosmético</label>
                                <input id="setting-email" type="email" value="${user.email}" required class="w-full bg-primary-container/10 border-none rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-background">
                            </div>
                        </div>

                        <div class="pt-10 border-t border-primary/10">
                            <h2 class="font-display text-3xl text-on-background mb-8">Segurança de Acesso</h2>
                            <div class="space-y-3">
                                <label class="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-[0.2em] ml-4">Nova Senha de Luxo (Opcional)</label>
                                <input id="setting-password" type="password" placeholder="Mantenha em branco para preservar a atual" class="w-full bg-primary-container/10 border-none rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-background">
                            </div>
                        </div>

                        <div class="flex justify-end pt-6">
                            <button type="submit" class="bg-primary text-white px-12 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:shadow-2xl transition-all hover:-translate-y-1">Atualizar Minha Essência</button>
                        </div>
                    </form>
                </div>

                <!-- Legal & Terms Section (Hidden by default) -->
                <div id="settings-legal" class="hidden bg-white rounded-[40px] shadow-ethereal border border-primary/5 p-10 md:p-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <h2 class="font-display text-3xl text-on-background mb-10 border-b border-primary/10 pb-6">Manifesto & Transparência</h2>
                    
                    <div class="grid grid-cols-1 gap-12">
                        <div class="group">
                            <h3 class="font-bold text-primary mb-4 flex items-center gap-3 group-hover:scale-[1.02] transition-transform">
                                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><span class="material-symbols-outlined text-[20px]">description</span></div>
                                <span class="uppercase text-[11px] font-black tracking-widest">Termos de Luxo & Uso</span>
                            </h3>
                            <p class="text-sm text-on-surface-variant leading-relaxed font-medium opacity-80 pl-14">
                                Ao acessar o ecossistema Beleza na Web, você integra uma comunidade dedicada à excelência cosmética. Seus ritos e aquisições são para usufruto individual, respeitando a propriedade intelectual de nossas curadorias.
                            </p>
                        </div>

                        <div class="group">
                            <h3 class="font-bold text-secondary mb-4 flex items-center gap-3 group-hover:scale-[1.02] transition-transform">
                                <div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center"><span class="material-symbols-outlined text-[20px]">lock</span></div>
                                <span class="uppercase text-[11px] font-black tracking-widest">Confidencialidade de Dados</span>
                            </h3>
                            <p class="text-sm text-on-surface-variant leading-relaxed font-medium opacity-80 pl-14">
                                Sua privacidade é nossa prioridade clinical. Seus dados de preferência e biometria social são processados para personalizar sua jornada. Não comercializamos seu brilho para terceiros.
                            </p>
                        </div>

                        <div class="group">
                            <h3 class="font-bold text-on-background mb-4 flex items-center gap-3 group-hover:scale-[1.02] transition-transform">
                                <div class="w-10 h-10 rounded-full bg-primary-container/30 flex items-center justify-center"><span class="material-symbols-outlined text-[20px]">assignment_return</span></div>
                                <span class="uppercase text-[11px] font-black tracking-widest">Logística de Satisfação</span>
                            </h3>
                            <p class="text-sm text-on-surface-variant leading-relaxed font-medium opacity-80 pl-14">
                                Rituais que não ressoam com sua essência podem ser revistos em até 7 ritos solares. Garantimos a integridade de nossas formulações em qualquer etapa da entrega.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    `;
}
