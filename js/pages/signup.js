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
                // Ao criar conta pelo Google, o usuário é cadastrado como cliente (pessoal)
                auth.login(data.name, data.email, '', 'pessoal');
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
    const nome = document.getElementById('signup-nome').value;
    const isEmail = !document.getElementById('email-reg').classList.contains('hidden');
    const email = document.getElementById('signup-email') ? document.getElementById('signup-email').value : '';
    const phone = document.getElementById('signup-phone') ? document.getElementById('signup-phone').value : '';
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

    if (isEmail) {
      if (!email) {
        showToast('Por favor, insira seu e-mail.', 'error');
        return;
      }
      window.signupData = { name: nome, loginId: email, password, isEmail: true, accountType };
    } else {
      if (!phone) {
        showToast('Por favor, insira seu telefone.', 'error');
        return;
      }
      window.signupData = { name: nome, loginId: phone, password, isEmail: false, accountType };
    }

    // Criar conta direto sem precisar de step 2
    auth.login(nome, window.signupData.loginId, password, accountType);
    showToast(`Conta criada com sucesso, ${nome.split(' ')[0]}!`, 'success');
    window.location.hash = '#/home';
  };

  return `
  <div class="flex w-full min-h-screen">
    <div class="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden">
      <img alt="Beauty imagery" class="absolute inset-0 w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQIrHNpD7xvPiQ4rJfvmtLWju0jcJD3LsqS7AW-RQBlNmMQ35BqepgdiZXIHb0lr7mhVP0NZ_ykCXjFDNIx8kQ0W6K1ovzh9KCUvXJfLFAyjT7c_9NoWxMBI8YH9M_EJ9g5BXdM97RTDCXqAZNx6PpduSLKp_qKbhT34m5Qmjhnu9_jwlRTbdDtYiuCKAqFGryI9pI31UOTzZujusotpCpq2683xr2cMEBxvQsVQA57oHIjCVUjyXiBH_-vy7QNzgYAWC88vPT8dOP"/>
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
      <div class="relative z-10 flex flex-col justify-end p-10 h-full w-full">
        <h1 class="font-display text-5xl text-white drop-shadow-lg mb-2">A.n.n Beauty</h1>
        <p class="font-display text-xl text-primary-fixed-dim italic opacity-90 drop-shadow-sm">"A.n.n beauty não vende apenas 'maquiagem', mas sim autoestima."</p>
      </div>
    </div>
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-[#121212] px-6 sm:px-12 py-12">
      <div class="w-full max-w-[460px] bg-white/5 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative">
        
        <!-- STEP 1: SIGNUP FIELDS -->
        <div id="signup-step-1" class="transition-all duration-500">
          <div class="text-center mb-8">
            <h2 class="font-display text-3xl text-primary-fixed mb-2">Criar Conta</h2>
            <p class="text-white/60 text-sm">Junte-se à nossa comunidade exclusiva.</p>
          </div>

          <div class="flex border-b border-white/10 mb-8">
            <button id="signup-email-tab" onclick="window.switchSignupTab('email')" class="flex-1 pb-3 text-sm font-medium text-primary border-b-2 border-primary transition-all">E-mail</button>
            <button id="signup-phone-tab" onclick="window.switchSignupTab('phone')" class="flex-1 pb-3 text-sm font-medium text-white/40 border-b-2 border-transparent transition-all">Telefone</button>
          </div>

          <form class="space-y-4" onsubmit="window.handleSignupStep1(event)">
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-fixed-dim material-symbols-outlined">person</span>
              <input class="w-full pl-12 pr-6 py-4 rounded-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/30" id="signup-nome" placeholder="Nome completo" type="text" required/>
            </div>

            <div id="email-reg" class="space-y-4">
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-fixed-dim material-symbols-outlined">mail</span>
                <input class="w-full pl-12 pr-6 py-4 rounded-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/30" id="signup-email" placeholder="seu@email.com" type="email"/>
              </div>
            </div>

            <div id="phone-reg" class="hidden space-y-4">
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-fixed-dim material-symbols-outlined">call</span>
                <input class="w-full pl-12 pr-6 py-4 rounded-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/30" id="signup-phone" placeholder="(00) 00000-0000" type="tel"/>
              </div>
            </div>

            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-fixed-dim material-symbols-outlined">lock</span>
              <input id="signup-password" class="w-full pl-12 pr-6 py-4 rounded-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/30" placeholder="Criar senha" type="password" required/>
            </div>

            <!-- Tipo de Conta -->
            <div class="pt-2">
              <p class="text-white/50 text-xs uppercase tracking-widest mb-3 text-center">Você é:</p>
              <div class="grid grid-cols-2 gap-3">
                <label class="relative cursor-pointer">
                  <input type="radio" name="signup-account-type" value="pessoal" checked class="sr-only peer"/>
                  <div class="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/10 bg-white/5 peer-checked:border-primary peer-checked:bg-primary/10 transition-all hover:bg-white/10">
                    <span class="material-symbols-outlined text-primary text-2xl">shopping_bag</span>
                    <span class="text-sm font-bold text-white">Sou Cliente</span>
                    <span class="text-[10px] text-white/40 text-center">Quero comprar produtos</span>
                  </div>
                </label>
                <label class="relative cursor-pointer">
                  <input type="radio" name="signup-account-type" value="comercial" class="sr-only peer"/>
                  <div class="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/10 bg-white/5 peer-checked:border-secondary peer-checked:bg-secondary/10 transition-all hover:bg-white/10">
                    <span class="material-symbols-outlined text-secondary text-2xl">storefront</span>
                    <span class="text-sm font-bold text-white">Sou Vendedor</span>
                    <span class="text-[10px] text-white/40 text-center">Quero vender produtos</span>
                  </div>
                </label>
              </div>
            </div>

            <button class="w-full py-4 mt-2 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-container hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2" type="submit">
              Criar Conta <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>

          <div class="relative flex items-center my-8">
            <div class="flex-grow border-t border-white/10"></div>
            <span class="px-4 text-xs text-white/30 uppercase tracking-widest">ou use social</span>
            <div class="flex-grow border-t border-white/10"></div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button onclick="window.handleSocialSignup('Google')" class="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <img src="https://www.google.com/favicon.ico" class="w-4 h-4" alt="Google"/>
              <span class="text-xs text-white font-medium">Google</span>
            </button>
            <button onclick="window.handleSocialSignup('Facebook')" class="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#1877F2] hover:bg-[#166fe5] transition-all">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span class="text-xs text-white font-medium">Facebook</span>
            </button>
          </div>

          <p class="mt-8 text-center text-sm text-white/60">
            Já tem uma conta? <a href="#/login" class="text-primary-fixed-dim hover:text-primary underline underline-offset-4">Faça login</a>
          </p>
        </div>

      </div>
    </div>
  </div>`;
}
