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
      <div class="bg-[#000000] p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
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

  window.toggleLoginPasswordVisibility = () => {
    const input = document.getElementById('password');
    const icon = document.getElementById('eye-login-pass');
    if (!input || !icon) return;
    if (input.type === 'password') {
      input.type = 'text';
      icon.textContent = 'visibility_off';
    } else {
      input.type = 'password';
      icon.textContent = 'visibility';
    }
  };

  window.handleLogin = async (event) => {
    event.preventDefault();
    const email = document.getElementById('email')?.value.trim() || '';
    const password = document.getElementById('password')?.value || '';
    const rememberMe = document.getElementById('remember-me')?.checked;

    if (!email || !password) {
      showToast('Por favor, preencha e-mail e senha.', 'error');
      return;
    }

    // Salvar ou remover "Lembrar de mim"
    if (rememberMe) {
      localStorage.setItem('ann_remembered_email', email);
      localStorage.setItem('ann_remember_me', 'true');
    } else {
      localStorage.removeItem('ann_remembered_email');
      localStorage.removeItem('ann_remember_me');
    }

    // 1. Tentar autenticação no backend
    let backendSuccess = false;
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();

      if (resp.ok && data.success) {
        backendSuccess = true;
        const loggedUser = auth.login(data.user.name, data.user.email, password, data.user.accountType || 'pessoal') || auth.getUser();
        showToast(`Bem-vinda, ${loggedUser.name.split(' ')[0]}!`, 'success');
        if (loggedUser && (loggedUser.role === 'admin' || loggedUser.role === 'admin_master')) {
          window.location.hash = '#/admin';
        } else {
          window.location.hash = '#/home';
        }
        return;
      }
    } catch (e) {
      console.warn('Backend login fetch fallback:', e);
    }

    // 2. Fallback resiliente com armazenamento local
    const res = auth.validateCredentials(email, password);
    if (!res.success) {
      showToast(res.message || 'E-mail ou senha incorretos.', 'error');
      return;
    }

    const user = res.user;
    const loggedInUser = auth.login(user.name, user.emailOrPhone, user.password, user.accountType) || auth.getUser();
    
    // Tenta sincronizar com o backend em segundo plano
    try {
      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, email: user.emailOrPhone, password: password, accountType: user.accountType || 'pessoal' })
      }).catch(() => {});
    } catch (_) {}

    showToast(`Bem-vinda, ${loggedInUser.name.split(' ')[0]}!`, 'success');
    if (loggedInUser && (loggedInUser.role === 'admin' || loggedInUser.role === 'admin_master')) {
      window.location.hash = '#/admin';
    } else {
      window.location.hash = '#/home';
    }
  };

  return `
  <div class="flex w-full min-h-screen">
    <!-- Lado Esquerdo: Imagem -->
    <div class="hidden lg:block lg:w-1/2 relative overflow-hidden bg-surface-dim">
      <img alt="Beleza na Web" class="absolute inset-0 w-full h-full object-cover opacity-90" src="img/banner_login.png"/>
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>

    <!-- Lado Direito: Formulário -->
    <div class="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-10 min-h-screen bg-background relative overflow-hidden">
      
      <div class="w-full max-w-[420px] bg-surface p-8 sm:p-10 rounded-[24px] max-h-[95vh] overflow-y-auto subtle-scroll relative z-10 shadow-sm border border-outline-variant">
        
        <div id="login-step-1" class="transition-all duration-500">
          <div class="text-center mb-8">
            <img src="img/logo.png" alt="Beleza na Web" class="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-primary/20 shadow-md">
            <h2 class="font-display text-xl font-bold tracking-tight text-primary mb-0.5">BELEZA NA WEB</h2>
            <p class="text-xs text-[#8B5FBF] font-medium italic mb-5">Sua beleza, seu cuidado, em cada clique.</p>
            <h1 class="font-display text-3xl font-bold text-on-background mb-2">Bem-vinda de volta!</h1>
            <p class="font-body text-sm text-on-surface-variant">Entre na sua conta para continuar sua experiência.</p>
          </div>

          <form class="space-y-4" onsubmit="window.handleLogin(event)">
            <!-- Tabs (Preservando funcionalidade, mas escondido visualmente se não pedido, ou deixar elegante) -->
            <div class="flex border-b border-outline-variant mb-6 hidden">
              <button type="button" id="email-tab" class="flex-1 pb-3 text-xs font-bold transition-all text-primary border-b-2 border-primary">E-mail</button>
            </div>

            <!-- Email Section -->
            <div id="email-section" class="space-y-4">
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">mail</span>
                <input class="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none transition-all font-medium text-sm bg-surface border border-outline-variant text-on-background focus:border-primary focus:ring-1 focus:ring-primary" id="email" placeholder="E-mail" type="email"/>
              </div>
            </div>

            <!-- Password Section -->
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">lock</span>
              <input class="w-full pl-11 pr-11 py-3.5 rounded-xl outline-none transition-all font-medium text-sm bg-surface border border-outline-variant text-on-background focus:border-primary focus:ring-1 focus:ring-primary" id="password" placeholder="Senha" type="password" required/>
              <button type="button" onclick="window.toggleLoginPasswordVisibility()" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-1 flex items-center justify-center transition-colors cursor-pointer" title="Visualizar ou ocultar senha">
                <span id="eye-login-pass" class="material-symbols-outlined text-[19px]">visibility</span>
              </button>
            </div>

            <div class="flex items-center justify-between px-1 py-2 font-body">
              <label class="flex items-center space-x-2 cursor-pointer text-on-surface-variant hover:text-primary transition-colors">
                <input id="remember-me" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer" type="checkbox"/>
                <span class="text-xs font-medium">Lembrar de mim</span>
              </label>
              <a href="#/recover" class="text-xs font-semibold text-primary hover:underline">Esqueceu sua senha?</a>
            </div>

            <div class="pt-4">
              <button type="submit" class="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all bg-primary text-white font-display text-sm font-bold hover:bg-primary-dark cursor-pointer shadow-sm">
                Entrar
              </button>
            </div>
          </form>

          <div class="mt-8 text-center border-t border-outline-variant pt-6">
            <p class="font-body text-sm text-on-surface-variant font-medium">
              Ainda não tem uma conta? 
              <a href="#/signup" class="text-primary font-bold hover:underline">Criar conta</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

// Executado automaticamente após o HTML ser inserido no DOM
export function mount() {
  document.getElementById('glowai-root')?.remove();

  // Restaurar dados salvos do "Lembrar de mim"
  const savedEmail = localStorage.getItem('ann_remembered_email');
  const rememberMe = localStorage.getItem('ann_remember_me') === 'true';
  const emailInput = document.getElementById('email');
  const rememberCb = document.getElementById('remember-me');

  if (savedEmail && emailInput) {
    emailInput.value = savedEmail;
  }
  if (rememberCb) {
    rememberCb.checked = rememberMe;
  }
}
