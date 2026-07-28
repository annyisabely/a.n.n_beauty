import { auth } from '../auth.js';
import { showToast } from '../components.js';

export default function loginPage() {
  window.switchAuthTab = (type) => {
    const emailSection = document.getElementById('email-section');
    const phoneSection = document.getElementById('phone-section');
    const emailTab = document.getElementById('email-tab');
    const phoneTab = document.getElementById('phone-tab');

    if (type === 'email') {
      emailSection.classList.remove('hidden');
      phoneSection.classList.add('hidden');
      emailTab.classList.add('text-primary', 'border-primary');
      emailTab.classList.remove('text-on-primary-fixed-variant', 'border-transparent');
      phoneTab.classList.remove('text-primary', 'border-primary');
      phoneTab.classList.add('text-on-primary-fixed-variant', 'border-transparent');
    } else {
      emailSection.classList.add('hidden');
      phoneSection.classList.remove('hidden');
      phoneTab.classList.add('text-primary', 'border-primary');
      phoneTab.classList.remove('text-on-primary-fixed-variant', 'border-transparent');
      emailTab.classList.remove('text-primary', 'border-primary');
      emailTab.classList.add('text-on-primary-fixed-variant', 'border-transparent');
    }
  };

  window.sendSMSCode = () => {
    const phone = document.getElementById('phone').value;
    if (phone && phone.length > 8) {
      showToast(`Código enviado para o número ${phone}`, 'success');
    } else {
      showToast('Por favor, insira um número válido.', 'error');
    }
  };

  window.quickLogin = (email, password) => {
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('password');
    if (emailInput) emailInput.value = email;
    if (passInput) passInput.value = password;

    const res = auth.validateCredentials(email, password);
    if (res.success) {
      const user = res.user;
      auth.login(user.name, user.emailOrPhone, user.password, user.accountType);
      showToast(`Bem-vinda, ${user.name.split(' ')[0]}!`, 'success');
      if (user.role === 'admin' || user.role === 'admin_master') {
        window.location.hash = '#/admin';
      } else {
        window.location.hash = '#/home';
      }
    } else {
      showToast(res.message || 'Erro ao realizar login.', 'error');
    }
  };

  let googleTokenClient = null;

  window.handleSocialLogin = (provider) => {
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
                auth.loginWithExistingRole(data.name, data.email);
                showToast(`Bem-vinda, ${data.given_name || data.name}!`, 'success');
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

    showToast(`Conectando ao ${provider}...`, 'info');
    
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center';
    overlay.innerHTML = `
      <div class="bg-[#121212] p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-white font-medium">Autenticando com ${provider}...</p>
      </div>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
      auth.login(`Usuária ${provider}`, `user_${provider.toLowerCase()}@example.com`, '', 'pessoal');
      overlay.remove();
      showToast(`Bem-vinda! Login via ${provider} realizado.`, 'success');
      window.location.hash = '#/home';
    }, 2000);
  };

  window.handleLogin = (event) => {
    event.preventDefault();
    const isEmail = !document.getElementById('email-section').classList.contains('hidden');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password') ? document.getElementById('password').value : '';
    const phone = document.getElementById('phone').value.trim();

    const loginId = isEmail ? email : phone;

    if (isEmail) {
      if (!email || !password) {
        showToast('Por favor, preencha e-mail e senha.', 'error');
        return;
      }
    } else {
      if (!phone || !password) {
        showToast('Por favor, preencha telefone e senha.', 'error');
        return;
      }
    }

    const res = auth.validateCredentials(loginId, password);
    if (!res.success) {
      showToast(res.message, 'error');
      return;
    }

    const user = res.user;
    const loggedInUser = auth.login(user.name, user.emailOrPhone, user.password, user.accountType) || auth.getUser();
    
    showToast(`Bem-vinda, ${loggedInUser.name.split(' ')[0]}!`, 'success');
    if (loggedInUser && (loggedInUser.role === 'admin' || loggedInUser.role === 'admin_master')) {
      window.location.hash = '#/admin';
    } else {
      window.location.hash = '#/home';
    }
  };

  return `
  <div class="flex w-full min-h-screen">
    <!-- Imagem apenas no lado esquerdo -->
    <div class="hidden lg:block lg:w-1/2 relative overflow-hidden">
      <img alt="Beleza na Web" class="absolute inset-0 w-full h-full object-cover" src="img/banner_login.png"/>
    </div>

    <!-- Formulário no lado direito -->
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-[#f5efe8] px-4 sm:px-8 py-10 min-h-screen">
      <div class="w-full max-w-[420px] bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-[28px] shadow-2xl border border-primary/10 max-h-[95vh] overflow-y-auto subtle-scroll">
        
        <div id="login-step-1" class="transition-all duration-500">
          <div class="text-center mb-6">
            <h1 class="font-display text-3xl text-primary mb-1">Login</h1>
            <p class="text-on-surface-variant text-xs">Bem-vinda de volta ao seu ritual de luxo.</p>
          </div>

          <form class="space-y-4" onsubmit="window.handleLogin(event)">
            <!-- Tabs -->
            <div class="flex border-b border-primary/10 mb-4">
              <button type="button" id="email-tab" onclick="window.switchAuthTab('email')" class="flex-1 pb-2 text-xs font-bold text-primary border-b-2 border-primary transition-all">E-mail</button>
              <button type="button" id="phone-tab" onclick="window.switchAuthTab('phone')" class="flex-1 pb-2 text-xs font-bold text-on-surface-variant border-b-2 border-transparent transition-all">Telefone</button>
            </div>

            <!-- Email Section -->
            <div id="email-section" class="space-y-3">
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined text-lg">mail</span>
                <input class="w-full pl-12 pr-6 py-3 rounded-full bg-primary-container/30 border border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-on-background placeholder:text-primary/40 font-medium text-xs" id="email" placeholder="seu@email.com" type="email"/>
              </div>
            </div>

            <!-- Phone Section -->
            <div id="phone-section" class="hidden space-y-3">
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined text-lg">call</span>
                <input class="w-full pl-12 pr-6 py-3 rounded-full bg-primary-container/30 border border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-on-background placeholder:text-primary/40 font-medium text-xs" id="phone" placeholder="(00) 00000-0000" type="tel"/>
              </div>
            </div>

            <!-- Shared Password Section -->
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined text-lg">lock</span>
              <input class="w-full pl-12 pr-6 py-3 rounded-full bg-primary-container/30 border border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-on-background placeholder:text-primary/40 font-medium text-xs" id="password" placeholder="••••••••" type="password"/>
            </div>

            <div class="flex items-center justify-between px-2 text-xs">
              <label class="flex items-center space-x-2 cursor-pointer text-on-surface-variant hover:text-on-surface transition-colors">
                <input class="w-4 h-4 rounded border-primary/30 bg-white text-primary focus:ring-primary" type="checkbox"/>
                <span class="font-medium text-[11px]">Lembrar senha</span>
              </label>
              <a class="text-primary font-bold hover:underline text-[11px]" href="#/recover">Esqueceu a senha?</a>
            </div>

            <div class="pt-2">
              <button class="w-full py-3.5 rounded-full bg-primary text-white font-bold text-xs shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2" type="submit">
                Entrar Manualmente <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </form>

          <div class="relative flex items-center my-6">
            <div class="flex-grow border-t border-primary/10"></div>
            <span class="px-4 text-[10px] text-primary/40 font-bold uppercase tracking-widest">ou rede social</span>
            <div class="flex-grow border-t border-primary/10"></div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button onclick="window.handleSocialLogin('Google')" class="flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-white border border-primary/20 hover:bg-primary-container/20 hover:border-primary/50 transition-all group shadow-sm">
              <svg class="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="text-xs text-on-background font-bold">Google</span>
            </button>
            <button onclick="window.handleSocialLogin('Facebook')" class="flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-[#1877F2] hover:bg-[#166fe5] shadow-md transition-all group">
              <svg class="w-4 h-4 text-white transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span class="text-xs text-white font-bold">Facebook</span>
            </button>
          </div>

          <div class="mt-6 text-center">
            <p class="text-on-surface-variant text-xs font-medium">Não tem uma conta? <a class="text-primary hover:underline font-bold" href="#/signup">Crie uma agora</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
