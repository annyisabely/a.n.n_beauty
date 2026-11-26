import { auth } from '../auth.js';
import { showToast } from '../components.js';

export default function settingsPage() {
    const user = auth.getUser();
    if (!user) {
        window.location.hash = '#/login';
        return '';
    }

    // Toggle password visibility helper
    window.togglePasswordVisibility = (inputId, iconId) => {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);
        if (!input || !icon) return;

        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = 'visibility_off';
        } else {
            input.type = 'password';
            icon.textContent = 'visibility';
        }
    };

    // Switch Settings Tab helper
    window.switchSettingsTab = (tabName) => {
        const tabs = ['personal', 'security', 'legal'];
        tabs.forEach(tab => {
            const panel = document.getElementById(`settings-${tab}`);
            const btn = document.getElementById(`tab-btn-${tab}`);
            if (panel) {
                if (tab === tabName) {
                    panel.classList.remove('hidden');
                } else {
                    panel.classList.add('hidden');
                }
            }
            if (btn) {
                if (tab === tabName) {
                    btn.className = 'bg-[#8B5FBF]/15 text-[#8B5FBF] font-bold px-6 py-4 rounded-[20px] flex items-center gap-3.5 transition-all w-full text-left shadow-sm border border-[#8B5FBF]/20';
                    const icon = btn.querySelector('.material-symbols-outlined');
                    if (icon) icon.className = 'material-symbols-outlined text-[20px] text-[#8B5FBF]';
                } else {
                    btn.className = 'hover:bg-white text-[#5C4D6B] font-semibold px-6 py-4 rounded-[20px] flex items-center gap-3.5 transition-all border border-transparent hover:border-[#8B5FBF]/10 hover:shadow-sm w-full text-left';
                    const icon = btn.querySelector('.material-symbols-outlined');
                    if (icon) icon.className = 'material-symbols-outlined text-[20px] opacity-40';
                }
            }
        });
    };

    // Handlers for Personal Data Update
    window.handleUpdatePersonal = (e) => {
        e.preventDefault();
        const currentUser = auth.getUser();
        if (!currentUser) return;

        const nameInput = document.getElementById('setting-name');
        const emailInput = document.getElementById('setting-email');
        const phoneInput = document.getElementById('setting-phone');

        const newName = nameInput ? nameInput.value.trim() : '';
        const newEmail = emailInput ? emailInput.value.trim() : '';
        const newPhone = phoneInput ? phoneInput.value.trim() : '';

        if (!newName) {
            showToast('Por favor, informe seu nome de exibição.', 'warning');
            return;
        }

        if (!newEmail || !newEmail.includes('@')) {
            showToast('Por favor, informe um e-mail válido.', 'warning');
            return;
        }

        const oldEmail = currentUser.email;
        currentUser.name = newName;
        currentUser.email = newEmail;
        currentUser.phone = newPhone;
        localStorage.setItem('ann_beauty_user', JSON.stringify(currentUser));

        // Update in registered users database
        const users = auth.getRegisteredUsers();
        const oldKey = (oldEmail || '').toLowerCase().trim();
        const newKey = newEmail.toLowerCase().trim();

        if (users[oldKey]) {
            const userData = { ...users[oldKey], name: newName, emailOrPhone: newKey };
            delete users[oldKey];
            users[newKey] = userData;
            localStorage.setItem('ann_registered_users', JSON.stringify(users));
        }

        // Force header and UI update
        window.dispatchEvent(new Event('auth-change'));
        showToast('Dados pessoais atualizados com sucesso! ✨', 'success');
    };

    // Handler for Changing Password
    window.handleChangePassword = (e) => {
        e.preventDefault();
        const currPassInput = document.getElementById('setting-curr-password');
        const newPassInput = document.getElementById('setting-new-password');
        const confirmPassInput = document.getElementById('setting-confirm-password');

        const currPass = currPassInput ? currPassInput.value : '';
        const newPass = newPassInput ? newPassInput.value : '';
        const confirmPass = confirmPassInput ? confirmPassInput.value : '';

        // Basic front validation
        if (!newPass || newPass.length < 4) {
            showToast('A nova senha deve conter pelo menos 4 caracteres.', 'warning');
            if (newPassInput) newPassInput.focus();
            return;
        }

        if (newPass !== confirmPass) {
            showToast('A confirmação de senha não confere com a nova senha.', 'error');
            if (confirmPassInput) confirmPassInput.focus();
            return;
        }

        const result = auth.changePassword(currPass, newPass);

        if (result.success) {
            showToast(result.message || 'Senha alterada com sucesso! 🔒✨', 'success');
            // Clear input fields
            if (currPassInput) currPassInput.value = '';
            if (newPassInput) newPassInput.value = '';
            if (confirmPassInput) confirmPassInput.value = '';

            // Reset strength UI
            const strengthBar = document.getElementById('password-strength-bar');
            const strengthText = document.getElementById('password-strength-text');
            const matchNotice = document.getElementById('password-match-notice');
            if (strengthBar) strengthBar.style.width = '0%';
            if (strengthText) strengthText.textContent = '';
            if (matchNotice) matchNotice.textContent = '';
        } else {
            showToast(result.message || 'Erro ao alterar a senha.', 'error');
            if (result.message && result.message.includes('atual') && currPassInput) {
                currPassInput.focus();
            }
        }
    };

    const initialPhoto = user.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
    const accountBadge = user.role === 'admin_master' ? 'Administradora Master' : (user.role === 'empresa' ? 'Conta Comercial' : 'Conta Pessoal');

    return `
    <main class="w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12 md:py-16 bg-background">
        <!-- Header -->
        <header class="mb-10 text-center md:text-left">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.25em] mb-4">
                <span class="material-symbols-outlined text-[14px]">tune</span>
                Controle & Essência
            </div>
            <h1 class="font-display text-3xl md:text-5xl text-[#2D1A40] tracking-tight mb-3">Configurações da <span class="italic text-[#8B5FBF]">Conta</span></h1>
            <p class="text-[#5C4D6B] font-medium opacity-80 max-w-2xl text-sm md:text-base">Gerencie seus dados cadastrais, altere sua senha de segurança e consulte nossas políticas de privacidade.</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Sidebar Navigation -->
            <div class="md:col-span-1 flex flex-col gap-2.5">
                <button id="tab-btn-personal" onclick="window.switchSettingsTab('personal')" class="bg-[#8B5FBF]/15 text-[#8B5FBF] font-bold px-6 py-4 rounded-[20px] flex items-center gap-3.5 transition-all w-full text-left shadow-sm border border-[#8B5FBF]/20">
                    <span class="material-symbols-outlined text-[20px] text-[#8B5FBF]">person</span>
                    <span>Dados Pessoais</span>
                </button>

                <button id="tab-btn-security" onclick="window.switchSettingsTab('security')" class="hover:bg-white text-[#5C4D6B] font-semibold px-6 py-4 rounded-[20px] flex items-center gap-3.5 transition-all border border-transparent hover:border-[#8B5FBF]/10 hover:shadow-sm w-full text-left">
                    <span class="material-symbols-outlined text-[20px] opacity-40">lock</span>
                    <span>Segurança & Senha</span>
                </button>

                <a href="#/favorites" class="group hover:bg-white text-[#5C4D6B] font-semibold px-6 py-4 rounded-[20px] flex items-center gap-3.5 transition-all border border-transparent hover:border-[#8B5FBF]/10 hover:shadow-sm">
                    <span class="material-symbols-outlined text-[20px] opacity-40 group-hover:text-[#8B5FBF] transition-colors">bookmark</span>
                    <span>Itens Salvos</span>
                </a>

                <a href="#/profile" class="group hover:bg-white text-[#5C4D6B] font-semibold px-6 py-4 rounded-[20px] flex items-center gap-3.5 transition-all border border-transparent hover:border-[#8B5FBF]/10 hover:shadow-sm">
                    <span class="material-symbols-outlined text-[20px] opacity-40 group-hover:text-[#8B5FBF] transition-colors">account_circle</span>
                    <span>Ver Perfil</span>
                </a>

                <a href="#/tracking" class="group hover:bg-white text-[#5C4D6B] font-semibold px-6 py-4 rounded-[20px] flex items-center gap-3.5 transition-all border border-transparent hover:border-[#8B5FBF]/10 hover:shadow-sm">
                    <span class="material-symbols-outlined text-[20px] opacity-40 group-hover:text-[#8B5FBF] transition-colors">local_shipping</span>
                    <span>Meus Pedidos</span>
                </a>

                <button id="tab-btn-legal" onclick="window.switchSettingsTab('legal')" class="hover:bg-white text-[#5C4D6B] font-semibold px-6 py-4 rounded-[20px] flex items-center gap-3.5 transition-all border border-transparent hover:border-[#8B5FBF]/10 hover:shadow-sm w-full text-left">
                    <span class="material-symbols-outlined text-[20px] opacity-40">gavel</span>
                    <span>Legal & Termos</span>
                </button>
            </div>

            <!-- Content Area -->
            <div class="md:col-span-3">
                <!-- 1. PERSONAL DATA PANEL -->
                <div id="settings-personal" class="bg-white rounded-[32px] shadow-sm border border-[#DDD0E8]/70 p-6 md:p-10">
                    <div class="flex items-center justify-between pb-6 mb-8 border-b border-[#F0E8F7]">
                        <div class="flex items-center gap-4">
                            <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-[#8B5FBF]/30 shadow-sm shrink-0">
                                <img src="${initialPhoto}" alt="${user.name}" class="w-full h-full object-cover">
                            </div>
                            <div>
                                <h2 class="font-display text-2xl font-bold text-[#2D1A40]">Identidade Digital</h2>
                                <p class="text-xs text-[#7B6A8E] mt-0.5">Atualize como seu perfil é visualizado na plataforma</p>
                            </div>
                        </div>
                        <span class="px-3 py-1 bg-[#8B5FBF]/10 text-[#8B5FBF] text-xs font-bold rounded-full border border-[#8B5FBF]/20">
                            ${accountBadge}
                        </span>
                    </div>

                    <form onsubmit="window.handleUpdatePersonal(event)" class="flex flex-col gap-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="text-[11px] font-bold text-[#5C4D6B] uppercase tracking-wider ml-1">Nome Completo</label>
                                <div class="relative">
                                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-[#9D8AB0]">badge</span>
                                    <input id="setting-name" type="text" value="${user.name || ''}" required class="w-full bg-[#FAF7FD] border border-[#DDD0E8] rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium outline-none focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/20 transition-all text-[#2D1A40]">
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="text-[11px] font-bold text-[#5C4D6B] uppercase tracking-wider ml-1">E-mail Cadastrado</label>
                                <div class="relative">
                                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-[#9D8AB0]">mail</span>
                                    <input id="setting-email" type="email" value="${user.email || ''}" required class="w-full bg-[#FAF7FD] border border-[#DDD0E8] rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium outline-none focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/20 transition-all text-[#2D1A40]">
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="text-[11px] font-bold text-[#5C4D6B] uppercase tracking-wider ml-1">Telefone / WhatsApp</label>
                                <div class="relative">
                                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-[#9D8AB0]">phone</span>
                                    <input id="setting-phone" type="tel" value="${user.phone || ''}" placeholder="(11) 99999-9999" class="w-full bg-[#FAF7FD] border border-[#DDD0E8] rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium outline-none focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/20 transition-all text-[#2D1A40]">
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="text-[11px] font-bold text-[#5C4D6B] uppercase tracking-wider ml-1">Membro Desde</label>
                                <div class="relative">
                                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-[#9D8AB0]">calendar_month</span>
                                    <input type="text" value="${user.joined || '2026'}" disabled class="w-full bg-[#F4EFFB] border border-[#DDD0E8]/50 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium text-[#7B6A8E] cursor-not-allowed">
                                </div>
                            </div>
                        </div>

                        <!-- Card shortcut for password change -->
                        <div class="bg-gradient-to-r from-[#FAF7FD] to-[#F5EEFB] p-5 rounded-2xl border border-[#8B5FBF]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-[#8B5FBF]/15 flex items-center justify-center shrink-0">
                                    <span class="material-symbols-outlined text-[#8B5FBF] text-[20px]">lock</span>
                                </div>
                                <div>
                                    <p class="text-xs font-bold text-[#2D1A40]">Precisa alterar sua senha de acesso?</p>
                                    <p class="text-[11px] text-[#7B6A8E]">Acesse a aba de segurança para definir uma nova senha segura.</p>
                                </div>
                            </div>
                            <button type="button" onclick="window.switchSettingsTab('security')" class="px-4 py-2 bg-[#8B5FBF] hover:bg-[#7747AA] text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0">
                                Alterar Senha
                            </button>
                        </div>

                        <div class="flex justify-end pt-4 border-t border-[#F0E8F7]">
                            <button type="submit" class="bg-[#8B5FBF] hover:bg-[#7747AA] text-white px-8 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-md shadow-[#8B5FBF]/25 hover:shadow-lg transition-all hover:-translate-y-0.5">
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>

                <!-- 2. SECURITY & PASSWORD PANEL -->
                <div id="settings-security" class="hidden bg-white rounded-[32px] shadow-sm border border-[#DDD0E8]/70 p-6 md:p-10">
                    <div class="pb-6 mb-8 border-b border-[#F0E8F7]">
                        <div class="flex items-center gap-3.5 mb-2">
                            <div class="w-12 h-12 rounded-2xl bg-[#8B5FBF]/15 flex items-center justify-center text-[#8B5FBF]">
                                <span class="material-symbols-outlined text-[24px]">lock_reset</span>
                            </div>
                            <div>
                                <h2 class="font-display text-2xl font-bold text-[#2D1A40]">Segurança & Senha</h2>
                                <p class="text-xs text-[#7B6A8E]">Atualize sua credencial de acesso para manter sua conta protegida</p>
                            </div>
                        </div>
                    </div>

                    <!-- Security Tips Banner -->
                    <div class="mb-8 p-4 rounded-2xl bg-[#FAF7FD] border border-[#DDD0E8] flex items-start gap-3.5">
                        <span class="material-symbols-outlined text-[#8B5FBF] text-[22px] shrink-0 mt-0.5">verified_user</span>
                        <div class="text-xs text-[#5C4D6B] leading-relaxed">
                            <strong class="text-[#2D1A40] font-semibold">Dica de Proteção:</strong> Escolha uma senha forte com pelo menos <strong>4 caracteres</strong>, combinando letras, números e símbolos especiais. Nunca compartilhe sua senha com ninguém.
                        </div>
                    </div>

                    <form onsubmit="window.handleChangePassword(event)" class="flex flex-col gap-6">
                        <!-- Current Password -->
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <label class="text-[11px] font-bold text-[#5C4D6B] uppercase tracking-wider ml-1">Senha Atual</label>
                                <a href="#/recover" class="text-xs text-[#8B5FBF] hover:underline font-medium">Esqueceu a senha?</a>
                            </div>
                            <div class="relative">
                                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-[#9D8AB0]">key</span>
                                <input id="setting-curr-password" type="password" placeholder="Digite sua senha atual" class="w-full bg-[#FAF7FD] border border-[#DDD0E8] rounded-2xl pl-11 pr-12 py-3.5 text-sm font-medium outline-none focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/20 transition-all text-[#2D1A40]">
                                <button type="button" onclick="window.togglePasswordVisibility('setting-curr-password', 'eye-curr')" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9D8AB0] hover:text-[#8B5FBF] transition-colors p-1 flex items-center justify-center">
                                    <span id="eye-curr" class="material-symbols-outlined text-[20px]">visibility</span>
                                </button>
                            </div>
                            <p class="text-[11px] text-[#9D8AB0] ml-1">Necessário para confirmar sua identidade ao trocar de senha.</p>
                        </div>

                        <!-- New Password -->
                        <div class="space-y-2">
                            <label class="text-[11px] font-bold text-[#5C4D6B] uppercase tracking-wider ml-1">Nova Senha</label>
                            <div class="relative">
                                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-[#9D8AB0]">lock</span>
                                <input id="setting-new-password" type="password" required placeholder="Digite sua nova senha (mínimo 4 caracteres)" class="w-full bg-[#FAF7FD] border border-[#DDD0E8] rounded-2xl pl-11 pr-12 py-3.5 text-sm font-medium outline-none focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/20 transition-all text-[#2D1A40]">
                                <button type="button" onclick="window.togglePasswordVisibility('setting-new-password', 'eye-new')" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9D8AB0] hover:text-[#8B5FBF] transition-colors p-1 flex items-center justify-center">
                                    <span id="eye-new" class="material-symbols-outlined text-[20px]">visibility</span>
                                </button>
                            </div>

                            <!-- Password strength meter -->
                            <div class="space-y-1.5 pt-1">
                                <div class="flex items-center justify-between text-[11px]">
                                    <span class="text-[#7B6A8E]">Força da senha:</span>
                                    <span id="password-strength-text" class="font-bold text-[#8B5FBF]"></span>
                                </div>
                                <div class="w-full h-1.5 bg-[#EDE4F5] rounded-full overflow-hidden">
                                    <div id="password-strength-bar" class="h-full w-0 transition-all duration-300 rounded-full bg-slate-300"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Confirm New Password -->
                        <div class="space-y-2">
                            <label class="text-[11px] font-bold text-[#5C4D6B] uppercase tracking-wider ml-1">Confirmar Nova Senha</label>
                            <div class="relative">
                                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-[#9D8AB0]">lock_clock</span>
                                <input id="setting-confirm-password" type="password" required placeholder="Repita exatamente a nova senha" class="w-full bg-[#FAF7FD] border border-[#DDD0E8] rounded-2xl pl-11 pr-12 py-3.5 text-sm font-medium outline-none focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/20 transition-all text-[#2D1A40]">
                                <button type="button" onclick="window.togglePasswordVisibility('setting-confirm-password', 'eye-confirm')" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9D8AB0] hover:text-[#8B5FBF] transition-colors p-1 flex items-center justify-center">
                                    <span id="eye-confirm" class="material-symbols-outlined text-[20px]">visibility</span>
                                </button>
                            </div>
                            <div id="password-match-notice" class="text-[11px] font-semibold min-h-[16px] ml-1"></div>
                        </div>

                        <!-- Requirements tags -->
                        <div class="bg-[#FAF7FD] p-4 rounded-2xl border border-[#DDD0E8]/70 flex flex-wrap gap-2 text-xs">
                            <span id="req-len" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DDD0E8] text-[#7B6A8E] text-[11px]">
                                <span class="material-symbols-outlined text-[14px]">remove</span> No mínimo 4 caracteres
                            </span>
                            <span id="req-match" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DDD0E8] text-[#7B6A8E] text-[11px]">
                                <span class="material-symbols-outlined text-[14px]">remove</span> Senhas conferem
                            </span>
                        </div>

                        <div class="flex items-center justify-between pt-4 border-t border-[#F0E8F7]">
                            <button type="button" onclick="window.switchSettingsTab('personal')" class="text-xs font-bold text-[#7B6A8E] hover:text-[#8B5FBF] transition-colors flex items-center gap-1">
                                <span class="material-symbols-outlined text-[16px]">arrow_back</span>
                                Voltar aos Dados Pessoais
                            </button>

                            <button type="submit" class="bg-[#8B5FBF] hover:bg-[#7747AA] text-white px-8 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-md shadow-[#8B5FBF]/25 hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2">
                                <span class="material-symbols-outlined text-[18px]">verified</span>
                                <span>Salvar Nova Senha</span>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- 3. LEGAL & TERMS PANEL -->
                <div id="settings-legal" class="hidden bg-white rounded-[32px] shadow-sm border border-[#DDD0E8]/70 p-6 md:p-10">
                    <h2 class="font-display text-2xl font-bold text-[#2D1A40] mb-8 pb-4 border-b border-[#F0E8F7]">Manifesto, Privacidade & Termos</h2>
                    
                    <div class="grid grid-cols-1 gap-8">
                        <div class="group p-5 rounded-2xl bg-[#FAF7FD] border border-[#DDD0E8]/70 hover:border-[#8B5FBF]/30 transition-all">
                            <h3 class="font-bold text-[#8B5FBF] mb-2.5 flex items-center gap-3">
                                <div class="w-9 h-9 rounded-xl bg-[#8B5FBF]/10 flex items-center justify-center shrink-0">
                                    <span class="material-symbols-outlined text-[20px] text-[#8B5FBF]">description</span>
                                </div>
                                <span class="uppercase text-xs font-black tracking-wider">Termos de Luxo & Uso</span>
                            </h3>
                            <p class="text-xs text-[#5C4D6B] leading-relaxed pl-12 font-medium opacity-90">
                                Ao acessar o ecossistema Beleza na Web, você integra uma comunidade dedicada à excelência cosmética e ao autocuidado consciente. Seus ritos e aquisições são para usufruto individual, respeitando os direitos autorais e a integridade de nossas curadorias e marcas parceiras.
                            </p>
                        </div>

                        <div class="group p-5 rounded-2xl bg-[#FAF7FD] border border-[#DDD0E8]/70 hover:border-[#8B5FBF]/30 transition-all">
                            <h3 class="font-bold text-[#6D4C7D] mb-2.5 flex items-center gap-3">
                                <div class="w-9 h-9 rounded-xl bg-[#6D4C7D]/10 flex items-center justify-center shrink-0">
                                    <span class="material-symbols-outlined text-[20px] text-[#6D4C7D]">shield</span>
                                </div>
                                <span class="uppercase text-xs font-black tracking-wider">Confidencialidade & LGPD</span>
                            </h3>
                            <p class="text-xs text-[#5C4D6B] leading-relaxed pl-12 font-medium opacity-90">
                                Sua privacidade é inegociável. Seus dados cadastrais, histórico de pedidos e credenciais são criptografados e utilizados exclusivamente para personalizar seu ritual de beleza e garantir entregas perfeitas. Não comercializamos suas informações com terceiros em hipótese alguma.
                            </p>
                        </div>

                        <div class="group p-5 rounded-2xl bg-[#FAF7FD] border border-[#DDD0E8]/70 hover:border-[#8B5FBF]/30 transition-all">
                            <h3 class="font-bold text-[#2D1A40] mb-2.5 flex items-center gap-3">
                                <div class="w-9 h-9 rounded-xl bg-[#2D1A40]/10 flex items-center justify-center shrink-0">
                                    <span class="material-symbols-outlined text-[20px] text-[#2D1A40]">assignment_return</span>
                                </div>
                                <span class="uppercase text-xs font-black tracking-wider">Logística de Satisfação & Trocas</span>
                            </h3>
                            <p class="text-xs text-[#5C4D6B] leading-relaxed pl-12 font-medium opacity-90">
                                Produtos que não ressoem com sua expectativa podem ser devolvidos ou trocados em até 7 dias corridos após o recebimento. Garantimos formulações originais, lacradas e certificadas pela ANVISA em todas as lojas credenciadas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    `;
}

// Lifecycle hook called automatically by app.js when the page mounts
export function mount() {
    const hash = window.location.hash || '';

    // Check if query param tab=security or tab=legal was passed
    if (hash.includes('tab=security') || hash.includes('tab=senha')) {
        if (window.switchSettingsTab) {
            window.switchSettingsTab('security');
        }
    } else if (hash.includes('tab=legal') || hash.includes('tab=termos')) {
        if (window.switchSettingsTab) {
            window.switchSettingsTab('legal');
        }
    } else {
        if (window.switchSettingsTab) {
            window.switchSettingsTab('personal');
        }
    }

    // Attach real-time password strength and match feedback
    const newPassInput = document.getElementById('setting-new-password');
    const confirmPassInput = document.getElementById('setting-confirm-password');
    const strengthBar = document.getElementById('password-strength-bar');
    const strengthText = document.getElementById('password-strength-text');
    const matchNotice = document.getElementById('password-match-notice');
    const reqLen = document.getElementById('req-len');
    const reqMatch = document.getElementById('req-match');

    function updateFeedback() {
        const pass = newPassInput ? newPassInput.value : '';
        const confirm = confirmPassInput ? confirmPassInput.value : '';

        // Length requirement tag
        if (reqLen) {
            if (pass.length >= 4) {
                reqLen.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold';
                reqLen.innerHTML = '<span class="material-symbols-outlined text-[14px]">check</span> No mínimo 4 caracteres';
            } else {
                reqLen.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DDD0E8] text-[#7B6A8E] text-[11px]';
                reqLen.innerHTML = '<span class="material-symbols-outlined text-[14px]">remove</span> No mínimo 4 caracteres';
            }
        }

        // Strength calculation
        if (strengthBar && strengthText) {
            if (pass.length === 0) {
                strengthBar.style.width = '0%';
                strengthBar.className = 'h-full w-0 transition-all duration-300 rounded-full bg-slate-300';
                strengthText.textContent = '';
            } else if (pass.length < 4) {
                strengthBar.style.width = '25%';
                strengthBar.className = 'h-full transition-all duration-300 rounded-full bg-red-500';
                strengthText.textContent = 'Muito curta (mín. 4)';
                strengthText.className = 'font-bold text-red-500';
            } else {
                let score = 1;
                if (pass.length >= 6) score++;
                if (/[0-9]/.test(pass) && /[a-zA-Z]/.test(pass)) score++;
                if (/[^A-Za-z0-9]/.test(pass) || pass.length >= 10) score++;

                if (score === 1) {
                    strengthBar.style.width = '40%';
                    strengthBar.className = 'h-full transition-all duration-300 rounded-full bg-red-400';
                    strengthText.textContent = 'Fraca';
                    strengthText.className = 'font-bold text-red-500';
                } else if (score === 2) {
                    strengthBar.style.width = '70%';
                    strengthBar.className = 'h-full transition-all duration-300 rounded-full bg-amber-400';
                    strengthText.textContent = 'Média';
                    strengthText.className = 'font-bold text-amber-600';
                } else {
                    strengthBar.style.width = '100%';
                    strengthBar.className = 'h-full transition-all duration-300 rounded-full bg-emerald-500';
                    strengthText.textContent = 'Forte ✨';
                    strengthText.className = 'font-bold text-emerald-600';
                }
            }
        }

        // Match feedback
        if (matchNotice && reqMatch) {
            if (!confirm) {
                matchNotice.textContent = '';
                reqMatch.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DDD0E8] text-[#7B6A8E] text-[11px]';
                reqMatch.innerHTML = '<span class="material-symbols-outlined text-[14px]">remove</span> Senhas conferem';
            } else if (pass === confirm) {
                matchNotice.textContent = '✓ As senhas coincidem perfeitamente!';
                matchNotice.className = 'text-[11px] font-semibold text-emerald-600 min-h-[16px] ml-1';
                reqMatch.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold';
                reqMatch.innerHTML = '<span class="material-symbols-outlined text-[14px]">check</span> Senhas conferem';
            } else {
                matchNotice.textContent = '✕ As senhas não conferem.';
                matchNotice.className = 'text-[11px] font-semibold text-red-500 min-h-[16px] ml-1';
                reqMatch.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold';
                reqMatch.innerHTML = '<span class="material-symbols-outlined text-[14px]">close</span> Senhas diferentes';
            }
        }
    }

    if (newPassInput) newPassInput.addEventListener('input', updateFeedback);
    if (confirmPassInput) confirmPassInput.addEventListener('input', updateFeedback);
}
