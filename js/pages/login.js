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
                auth.login(data.name, data.email, '', 'pessoal');
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

    // Fallback for Facebook
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

  // Keep credentials in memory between steps
  window.loginData = {};

  window.handleLoginStep1 = (event) => {
    event.preventDefault();
    const isEmail = !document.getElementById('email-section').classList.contains('hidden');
    const name = document.getElementById('login-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password') ? document.getElementById('password').value : '';
    const phone = document.getElementById('phone').value;

    if (!name) {
      showToast('Por favor, insira seu nome.', 'error');
      return;
    }

    if (isEmail) {
      if (!email || !password) {
        showToast('Por favor, preencha e-mail e senha.', 'error');
        return;
      }
      window.loginData = { name, loginId: email, password, isEmail: true };
    } else {
      if (!phone) {
        showToast('Por favor, insira seu telefone.', 'error');
        return;
      }
      window.loginData = { name, loginId: phone, password: '', isEmail: false };
    }

    // Show step 2 to choose account type
    document.getElementById('login-step-1').classList.add('hidden');
    document.getElementById('login-step-2').classList.remove('hidden');
    document.getElementById('login-step-2').classList.add('animate-in', 'fade-in', 'slide-in-from-right-4', 'duration-500');
  };

  window.handleLoginStep2 = (accountType) => {
    const data = window.loginData;
    if (data.isEmail) {
      auth.login(data.name, data.loginId, data.password, accountType);
    } else {
      auth.login(data.name, data.loginId, '', accountType);
    }
    
    showToast(`Bem-vinda, ${data.name.split(' ')[0]}!`, 'success');
    window.location.hash = '#/home';
  };

  return `
  <div class="flex w-full min-h-screen">
    <div class="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden">
      <img alt="Beauty imagery" class="absolute inset-0 w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqpBtBh47eNEksho9O5MXG_Zj4BSSfrhinKWZrqS8VcaAs35YxBoPqA-DA9GM4U0WWOhrhNgrznvChCdYlOftaKLUlzUTbaDxlIb5sCcVXC9p6Ft3HP_CCU4w9QNiISyiKnz-p556jwlt9gayBnrpcZ6jOlwd9cL0AtmKaqyKSrYsbjn6v7nXq_xrCitRtz75emRzOesU3G4KCrp4njBa0J2UXIEMLe7jX4UrZ7q3Ow5RfICYUls3H2Uqc5kmKakwRPIRGenfqI--j"/>
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
      <div class="relative z-10 flex flex-col justify-end p-10 h-full w-full">
        <h1 class="font-display text-5xl text-white drop-shadow-lg mb-2">A.n.n Beauty</h1>
        <p class="font-display text-xl text-primary-fixed-dim italic opacity-90 drop-shadow-sm">"A.n.n beauty não vende apenas 'maquiagem', mas sim autoestima."</p>
      </div>
    </div>
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-[#121212] px-4 sm:px-12 md:px-10 py-12">
      <div class="w-full max-w-[440px] bg-white/5 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative">
        
        <!-- STEP 1: LOGIN FIELDS -->
        <div id="login-step-1" class="transition-all duration-500">
          <div class="text-center mb-8">
            <h1 class="font-display text-3xl text-primary-fixed mb-2">Login</h1>
            <p class="text-white/50 text-sm">Bem-vinda de volta ao seu ritual de luxo.</p>
          </div>

          <form class="space-y-6" onsubmit="window.handleLoginStep1(event)">
            <!-- Tabs -->
            <div class="flex border-b border-white/10 mb-8">
              <button type="button" id="email-tab" onclick="window.switchAuthTab('email')" class="flex-1 pb-3 text-sm font-medium text-primary border-b-2 border-primary transition-all">E-mail</button>
              <button type="button" id="phone-tab" onclick="window.switchAuthTab('phone')" class="flex-1 pb-3 text-sm font-medium text-on-primary-fixed-variant border-b-2 border-transparent transition-all">Telefone</button>
            </div>

            <!-- Name Section -->
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-fixed-dim material-symbols-outlined">person</span>
              <input class="w-full pl-12 pr-6 py-4 rounded-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/30" id="login-name" placeholder="Seu Nome Completo" type="text" required/>
            </div>

            <!-- Email Section -->
            <div id="email-section" class="space-y-4">
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-fixed-dim material-symbols-outlined">mail</span>
                <input class="w-full pl-12 pr-6 py-4 rounded-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/30" id="email" placeholder="seu@email.com" type="email"/>
              </div>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-fixed-dim material-symbols-outlined">lock</span>
                <input class="w-full pl-12 pr-6 py-4 rounded-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/30" id="password" placeholder="••••••••" type="password"/>
              </div>
            </div>

            <!-- Phone Section -->
            <div id="phone-section" class="hidden space-y-4">
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-fixed-dim material-symbols-outlined">call</span>
                <input class="w-full pl-12 pr-6 py-4 rounded-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/30" id="phone" placeholder="(00) 00000-0000" type="tel"/>
              </div>
              <button type="button" onclick="window.sendSMSCode()" class="w-full text-xs text-primary-fixed-dim text-right hover:underline">Enviar código SMS</button>
            </div>

            <div class="flex items-center justify-between px-2 pt-2 text-xs">
              <label class="flex items-center space-x-2 cursor-pointer text-white/50 hover:text-white transition-colors">
                <input class="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary" type="checkbox"/>
                <span>Lembrar senha</span>
              </label>
              <a class="text-primary-fixed-dim hover:text-primary underline-offset-4 hover:underline" href="#/recover">Esqueceu a senha?</a>
            </div>

            <div class="pt-4">
              <button class="w-full py-4 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-container hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2" type="submit">
                Continuar <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </form>

          <div class="relative flex items-center my-8">
            <div class="flex-grow border-t border-white/10"></div>
            <span class="px-4 text-xs text-white/30 uppercase tracking-widest">ou use social</span>
            <div class="flex-grow border-t border-white/10"></div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button onclick="window.handleSocialLogin('Google')" class="flex items-center justify-center gap-3 py-3.5 px-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all group">
              <svg class="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="text-sm text-white font-medium">Google</span>
            </button>
            <button onclick="window.handleSocialLogin('Facebook')" class="flex items-center justify-center gap-3 py-3.5 px-4 rounded-full bg-[#1877F2] hover:bg-[#166fe5] shadow-lg shadow-blue-500/20 transition-all group">
              <svg class="w-5 h-5 text-white transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span class="text-sm text-white font-medium">Facebook</span>
            </button>
          </div>

          <div class="mt-8 text-center">
            <p class="text-white/50 text-sm">Não tem uma conta? <a class="text-primary-fixed-dim hover:text-primary font-medium underline underline-offset-4" href="#/signup">Crie uma agora</a></p>
          </div>
        </div>

        <!-- STEP 2: ACCOUNT TYPE -->
        <div id="login-step-2" class="hidden transition-all duration-500 absolute inset-0 bg-[#121212] flex flex-col justify-center items-center text-center z-20 px-8">
          <button type="button" onclick="document.getElementById('login-step-2').classList.add('hidden'); document.getElementById('login-step-1').classList.remove('hidden');" class="absolute top-6 left-6 text-white/50 hover:text-white flex items-center gap-1 text-sm"><span class="material-symbols-outlined text-lg">arrow_back</span> Voltar</button>
          
          <h2 class="font-display text-2xl text-primary-fixed mb-2 mt-8">Quase lá!</h2>
          <p class="text-white/70 text-sm mb-8">Como você deseja usar a plataforma?</p>

          <div class="flex flex-col gap-4 w-full max-w-[320px]">
            <button type="button" onclick="window.handleLoginStep2('pessoal')" class="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10 transition-all text-left group">
              <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-primary">shopping_bag</span>
              </div>
              <div class="flex flex-col">
                <span class="text-base font-bold text-white">Comprador</span>
                <span class="text-xs text-white/50">Quero comprar produtos</span>
              </div>
            </button>

            <button type="button" onclick="window.handleLoginStep2('comercial')" class="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10 transition-all text-left group">
              <div class="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-secondary">storefront</span>
              </div>
              <div class="flex flex-col">
                <span class="text-base font-bold text-white">Empresa</span>
                <span class="text-xs text-white/50">Quero vender produtos</span>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>`;
}
