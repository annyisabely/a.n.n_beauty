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

  window.handleSignup = (event) => {
    event.preventDefault();
    const nome = document.getElementById('signup-nome').value;
    const email = document.getElementById('signup-email') ? document.getElementById('signup-email').value : '';
    const phone = document.getElementById('signup-phone') ? document.getElementById('signup-phone').value : '';

    if (nome && (email || phone)) {
      auth.login(email || phone);
      showToast('Conta criada com sucesso!', 'success');
      window.location.hash = '#/home';
    } else {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
    }
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
      <div class="w-full max-w-[460px] bg-white/5 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/10">
        <div class="text-center mb-8">
          <h2 class="font-display text-3xl text-primary-fixed mb-2">Criar Conta</h2>
          <p class="text-white/60 text-sm">Junte-se à nossa comunidade exclusiva.</p>
        </div>

        <div class="flex border-b border-white/10 mb-8">
          <button id="signup-email-tab" onclick="window.switchSignupTab('email')" class="flex-1 pb-3 text-sm font-medium text-primary border-b-2 border-primary transition-all">E-mail</button>
          <button id="signup-phone-tab" onclick="window.switchSignupTab('phone')" class="flex-1 pb-3 text-sm font-medium text-white/40 border-b-2 border-transparent transition-all">Telefone</button>
        </div>

        <form class="space-y-4" onsubmit="window.handleSignup(event)">
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
            <input class="w-full pl-12 pr-6 py-4 rounded-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/30" placeholder="Criar senha" type="password" required/>
          </div>

          <button class="w-full py-4 mt-4 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-container hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2" type="submit">
            Cadastrar <span class="material-symbols-outlined text-sm">person_add</span>
          </button>
        </form>

        <div class="relative flex items-center my-8">
          <div class="flex-grow border-t border-white/10"></div>
          <span class="px-4 text-xs text-white/30 uppercase tracking-widest">ou use social</span>
          <div class="flex-grow border-t border-white/10"></div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button class="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <img src="https://www.google.com/favicon.ico" class="w-4 h-4" alt="Google"/>
            <span class="text-xs text-white font-medium">Google</span>
          </button>
          <button class="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#1877F2] hover:bg-[#166fe5] transition-all">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span class="text-xs text-white font-medium">Facebook</span>
          </button>
        </div>

        <p class="mt-8 text-center text-sm text-white/60">
          Já tem uma conta? <a href="#/login" class="text-primary-fixed-dim hover:text-primary underline underline-offset-4">Faça login</a>
        </p>
      </div>
    </div>
  </div>`;
}
