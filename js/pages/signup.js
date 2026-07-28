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
      <div class="bg-[#121212] p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
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

  window.signupData = {};

  window.handleSignupStep1 = (event) => {
    event.preventDefault();
    const nome = document.getElementById('signup-nome').value.trim();
    const isEmail = !document.getElementById('email-reg').classList.contains('hidden');
    const email = document.getElementById('signup-email') ? document.getElementById('signup-email').value.trim() : '';
    const phone = document.getElementById('signup-phone') ? document.getElementById('signup-phone').value.trim() : '';
    const password = document.getElementById('signup-password').value;

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
    if (!password) {
      showToast('Por favor, crie uma senha.', 'error');
      return;
    }

    let loginId = '';
    if (isEmail) {
      if (!email) {
        showToast('Por favor, insira seu e-mail.', 'error');
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

    // Criar conta usando o registro unificado
    const res = auth.register(nome, loginId, password, accountType);
    if (!res.success) {
      showToast(res.message, 'error');
      return;
    }

    showToast(`Conta criada com sucesso, ${nome.split(' ')[0]}!`, 'success');
    window.location.hash = '#/home';
  };

  return `
  <div class="flex w-full min-h-screen bg-background">
    <div class="hidden lg:flex lg:w-1/2 relative bg-primary-container overflow-hidden">
      <img alt="Beauty imagery" class="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-soft-light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQIrHNpD7xvPiQ4rJfvmtLWju0jcJD3LsqS7AW-RQBlNmMQ35BqepgdiZXIHb0lr7mhVP0NZ_ykCXjFDNIx8kQ0W6K1ovzh9KCUvXJfLFAyjT7c_9NoWxMBI8YH9M_EJ9g5BXdM97RTDCXqAZNx6PpduSLKp_qKbhT34m5Qmjhnu9_jwlRTbdDtYiuCKAqFGryI9pI31UOTzZujusotpCpq2683xr2cMEBxvQsVQA57oHIjCVUjyXiBH_-vy7QNzgYAWC88vPT8dOP"/>
      <div class="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent"></div>
      <div class="relative z-10 flex flex-col justify-end p-10 h-full w-full">
        <h1 class="font-display text-5xl text-on-primary-container drop-shadow-sm mb-2">Beleza na Web</h1>
        <p class="font-display text-xl text-primary italic opacity-90 drop-shadow-sm">"Beleza na Web não vende apenas 'maquiagem', mas sim autoestima."</p>
      </div>
    </div>
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-background px-4 sm:px-8 py-6 sm:py-10 min-h-screen">
      <div class="w-full max-w-[480px] bg-white/85 backdrop-blur-xl p-6 sm:p-8 rounded-[36px] shadow-2xl border border-primary/15 relative ambient-shadow my-auto max-h-[95vh] overflow-y-auto subtle-scroll">
        
        <!-- STEP 1: SIGNUP FIELDS -->
        <div id="signup-step-1" class="transition-all duration-500">
          <div class="text-center mb-5">
            <h2 class="font-display text-2xl sm:text-3xl text-primary mb-1">Criar Conta</h2>
            <p class="text-on-surface-variant text-xs sm:text-sm">Junte-se à nossa comunidade exclusiva.</p>
          </div>

          <div class="flex border-b border-primary/10 mb-5">
            <button id="signup-email-tab" onclick="window.switchSignupTab('email')" class="flex-1 pb-2.5 text-xs sm:text-sm font-bold text-primary border-b-2 border-primary transition-all">E-mail</button>
            <button id="signup-phone-tab" onclick="window.switchSignupTab('phone')" class="flex-1 pb-2.5 text-xs sm:text-sm font-bold text-on-surface-variant border-b-2 border-transparent transition-all">Telefone</button>
          </div>

          <form class="space-y-3" onsubmit="window.handleSignupStep1(event)">
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined text-[20px]">person</span>
              <input class="w-full pl-11 pr-5 py-3 rounded-full bg-primary-container/30 border border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-on-background placeholder:text-primary/40 font-medium text-xs sm:text-sm" id="signup-nome" placeholder="Nome completo" type="text" required/>
            </div>

            <div id="email-reg" class="space-y-3">
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined text-[20px]">mail</span>
                <input class="w-full pl-11 pr-5 py-3 rounded-full bg-primary-container/30 border border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-on-background placeholder:text-primary/40 font-medium text-xs sm:text-sm" id="signup-email" placeholder="seu@email.com" type="email"/>
              </div>
            </div>

            <div id="phone-reg" class="hidden space-y-3">
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined text-[20px]">call</span>
                <input class="w-full pl-11 pr-5 py-3 rounded-full bg-primary-container/30 border border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-on-background placeholder:text-primary/40 font-medium text-xs sm:text-sm" id="signup-phone" placeholder="(00) 00000-0000" type="tel"/>
              </div>
            </div>

            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined text-[20px]">lock</span>
              <input id="signup-password" class="w-full pl-11 pr-5 py-3 rounded-full bg-primary-container/30 border border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-on-background placeholder:text-primary/40 font-medium text-xs sm:text-sm" placeholder="Criar senha" type="password" required/>
            </div>



            <button class="w-full py-3.5 mt-2 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2" type="submit">
              Criar Conta <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>

          <div class="relative flex items-center my-5">
            <div class="flex-grow border-t border-primary/10"></div>
            <span class="px-3 text-[9px] text-primary/40 font-bold uppercase tracking-widest">ou use social</span>
            <div class="flex-grow border-t border-primary/10"></div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button onclick="window.handleSocialSignup('Google')" class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-white border border-primary/20 hover:bg-primary-container/20 transition-all shadow-sm group">
              <img src="https://www.google.com/favicon.ico" class="w-4 h-4 group-hover:scale-110 transition-transform" alt="Google"/>
              <span class="text-xs text-on-background font-bold">Google</span>
            </button>
            <button onclick="window.handleSocialSignup('Facebook')" class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-[#1877F2] hover:bg-[#166fe5] shadow-lg shadow-blue-500/20 transition-all group">
              <svg class="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span class="text-xs text-white font-bold">Facebook</span>
            </button>
          </div>

          <p class="mt-5 text-center text-xs sm:text-sm text-on-surface-variant font-medium">
            Já tem uma conta? <a href="#/login" class="text-primary hover:text-on-primary-container font-bold underline underline-offset-4">Faça login</a>
          </p>
        </div>
      </div>
    </div>
  </div>`;
}
