import { auth } from '../auth.js';
import { showToast } from '../components.js';

export default function signupPage() {
  window.switchSignupTab = (type) => {
    const emailReg = document.getElementById('email-reg');
    const phoneReg = document.getElementById('phone-reg');
    const emailTab = document.getElementById('signup-email-tab');
    const phoneTab = document.getElementById('signup-phone-tab');

    if (type === 'email') {
      emailReg.classList.remove('hidden');
      phoneReg.classList.add('hidden');
      emailTab.classList.add('text-primary', 'border-primary');
      emailTab.classList.remove('text-white/40', 'border-transparent');
      phoneTab.classList.remove('text-primary', 'border-primary');
      phoneTab.classList.add('text-white/40', 'border-transparent');
    } else {
      emailReg.classList.add('hidden');
      phoneReg.classList.remove('hidden');
      phoneTab.classList.add('text-primary', 'border-primary');
      phoneTab.classList.remove('text-white/40', 'border-transparent');
      emailTab.classList.remove('text-primary', 'border-primary');
      emailTab.classList.add('text-white/40', 'border-transparent');
    }
  };

  let googleTokenClient = null;

  window.handleSocialSignup = (provider) => {
    if (provider === 'Google') {
      if (typeof google === 'undefined') {
        showToast('Google Services ainda estão carregando. Tente novamente.', 'info');
        return;
      }
      if (!googleTokenClient) {
        googleTokenClient = google.accounts.oauth2.initTokenClient({
          client_id: '309142671074-ncgamrc6cdffnsd13bqnk0s81k01lkhn.apps.googleusercontent.com',
          scope: 'email profile',
          prompt: 'select_account',
          callback: (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              showToast('Conectando ao Google...', 'info');
              fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              })
              .then(res => res.json())
              .then(data => {
                // Ler o tipo de conta selecionado nos radio buttons
                const accountTypeRadios = document.getElementsByName('signup-account-type');
                let accountType = 'pessoal';
                for (const radio of accountTypeRadios) {
                  if (radio.checked) { accountType = radio.value; break; }
                }

                // Usar register() para evitar duplicatas e persistir o tipo de conta
                const regResult = auth.register(data.name, data.email, '', accountType);
                if (!regResult.success) {
                  // Já existe conta — fazer login recuperando a role existente
                  auth.loginWithExistingRole(data.name, data.email);
                }
                showToast(`Conta criada com sucesso, ${data.given_name || data.name}!`, 'success');
                window.location.hash = '#/home';
              })
              .catch(err => showToast('Erro ao obter perfil do Google', 'error'));
            }
          },
        });
      }
      googleTokenClient.requestAccessToken({prompt: 'select_account'});
      return;
    }

    // Fallback for Facebook
    showToast(`Conectando ao ${provider}...`, 'info');
    
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center';
    overlay.innerHTML = `
      <div class="bg-[#000000] p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-white font-medium">Autenticando com ${provider}...</p>
      </div>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
      auth.login(`Usuária ${provider}`, `user_${provider.toLowerCase()}@example.com`, '', 'pessoal');
      overlay.remove();
      showToast(`Bem-vinda! Conta criada via ${provider}.`, 'success');
      window.location.hash = '#/home';
    }, 2000);
  };

  window.toggleSignupPasswordVisibility = (inputId, iconId) => {
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

  window.signupData = {};

  window.handleSignupStep1 = async (event) => {
    event.preventDefault();
    const nome = document.getElementById('signup-nome').value.trim();
    const isEmail = !document.getElementById('email-reg').classList.contains('hidden');
    const email = document.getElementById('signup-email') ? document.getElementById('signup-email').value.trim() : '';
    const phone = document.getElementById('signup-phone') ? document.getElementById('signup-phone').value.trim() : '';
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-password-confirm').value;

    // Ler tipo de conta selecionado pelos radio buttons
    const accountTypeRadios = document.getElementsByName('signup-account-type');
    let accountType = 'pessoal';
    for (const radio of accountTypeRadios) {
      if (radio.checked) { accountType = radio.value; break; }
    }

    if (!nome) {
      showToast('Por favor, insira seu nome.', 'error');
      return;
    }
    if (!password || password.length < 4) {
      showToast('A senha deve ter no mínimo 4 caracteres.', 'error');
      return;
    }
    if (password !== passwordConfirm) {
      showToast('A confirmação de senha não confere com a senha.', 'error');
      return;
    }

    let loginId = '';
    if (isEmail) {
      if (!email || !email.includes('@')) {
        showToast('Por favor, insira um e-mail válido.', 'error');
        return;
      }
      loginId = email;
    } else {
      if (!phone) {
        showToast('Por favor, insira seu telefone.', 'error');
        return;
      }
      loginId = phone;
    }

    // 1. Tentar cadastro no backend SQLite com hash seguro
    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome, email: loginId, password, accountType })
      });
      const data = await resp.json();
      if (!resp.ok && data.message) {
        showToast(data.message, 'error');
        return;
      }
    } catch (e) {
      console.warn('Backend register error, proceeding with local sync:', e);
    }

    // 2. Registro no sistema unificado de autenticação local
    const res = auth.register(nome, loginId, password, accountType);
    if (!res.success) {
      showToast(res.message, 'error');
      return;
    }

    // Trigger Notifications
    if (window.notificationsManager) {
      // 1. Notify Admins
      window.notificationsManager.addNotification('admin', {
        title: 'Novo Usuário Cadastrado',
        message: `O usuário "${nome}" (${loginId}) realizou o cadastro na plataforma como "${accountType === 'pessoal' ? 'Cliente' : 'Vendedor'}".`,
        icon: 'person_add',
        color: 'text-indigo-500'
      });

      // 2. Seed welcome notifications for client
      if (accountType === 'pessoal') {
        window.notificationsManager.seedDefaultClientNotifications(loginId);
      }
    }

    showToast(`Conta criada com sucesso, ${nome.split(' ')[0]}!`, 'success');
    window.location.hash = '#/home';
  };

  return `
  <div class="flex w-full min-h-screen">
    <!-- Lado Esquerdo: Imagem -->
    <div class="hidden lg:block lg:w-1/2 relative overflow-hidden bg-surface-dim">
      <img alt="Beleza na Web" class="absolute inset-0 w-full h-full object-cover opacity-90" src="img/banner_login.png"/>
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>

    <!-- Lado Direito: Formulário -->
    <div class="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-8 min-h-screen bg-background relative overflow-hidden">
      
      <div class="w-full max-w-[430px] bg-surface p-8 sm:p-10 rounded-[24px] max-h-[95vh] overflow-y-auto subtle-scroll relative z-10 shadow-sm border border-outline-variant">
        
        <div id="signup-step-1" class="transition-all duration-500">
          <div class="text-center mb-6">
            <img src="img/logo.png" alt="Beleza na Web" class="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-primary/20 shadow-md">
            <h2 class="font-display text-xl font-bold tracking-tight text-primary mb-0.5">BELEZA NA WEB</h2>
            <p class="text-xs text-[#8B5FBF] font-medium italic mb-5">Sua beleza, seu cuidado, em cada clique.</p>
            <h1 class="font-display text-3xl font-bold text-on-background mb-2">Criar sua conta</h1>
            <p class="font-body text-sm text-on-surface-variant">Junte-se ao nosso universo de beleza e bem-estar.</p>
          </div>

          <form class="space-y-4" onsubmit="window.handleSignupStep1(event)">
            
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">person</span>
              <input class="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none transition-all font-medium text-sm bg-surface border border-outline-variant text-on-background focus:border-primary focus:ring-1 focus:ring-primary" id="signup-nome" placeholder="Nome completo" type="text" required/>
            </div>

            <!-- Email Reg -->
            <div id="email-reg" class="space-y-4">
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">mail</span>
                <input class="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none transition-all font-medium text-sm bg-surface border border-outline-variant text-on-background focus:border-primary focus:ring-1 focus:ring-primary" id="signup-email" placeholder="E-mail" type="email" required/>
              </div>
            </div>

            <!-- Password -->
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">lock</span>
              <input id="signup-password" class="w-full pl-11 pr-11 py-3.5 rounded-xl outline-none transition-all font-medium text-sm bg-surface border border-outline-variant text-on-background focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Senha" type="password" required/>
              <button type="button" onclick="window.toggleSignupPasswordVisibility('signup-password', 'eye-signup-pass')" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-1 flex items-center justify-center transition-colors cursor-pointer" title="Visualizar ou ocultar senha">
                <span id="eye-signup-pass" class="material-symbols-outlined text-[19px]">visibility</span>
              </button>
            </div>

            <!-- Confirm Password -->
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">lock</span>
              <input id="signup-password-confirm" class="w-full pl-11 pr-11 py-3.5 rounded-xl outline-none transition-all font-medium text-sm bg-surface border border-outline-variant text-on-background focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Confirmar senha" type="password" required/>
              <button type="button" onclick="window.toggleSignupPasswordVisibility('signup-password-confirm', 'eye-signup-confirm')" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-1 flex items-center justify-center transition-colors cursor-pointer" title="Visualizar ou ocultar confirmação de senha">
                <span id="eye-signup-confirm" class="material-symbols-outlined text-[19px]">visibility</span>
              </button>
            </div>

            <div class="flex items-center px-1 py-2 font-body">
              <label class="flex items-center space-x-2 cursor-pointer text-on-surface-variant hover:text-primary transition-colors">
                <input class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" required/>
                <span class="text-xs font-medium">Aceito os termos de uso</span>
              </label>
            </div>

            <div class="pt-2">
              <button type="submit" class="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all bg-primary text-white font-display text-sm font-bold hover:bg-primary-dark cursor-pointer shadow-sm">
                Criar conta
              </button>
            </div>
          </form>

          <div class="mt-8 text-center border-t border-outline-variant pt-6">
            <p class="font-body text-sm text-on-surface-variant font-medium">
              Já tem uma conta? 
              <a href="#/login" class="text-primary font-bold hover:underline">Fazer login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

export function mount() {
  document.getElementById('glowai-root')?.remove();
}
