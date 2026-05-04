import { auth } from '../auth.js';
import { showToast } from '../components.js';

export default function loginPage() {
  // Global functions for this page
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

    window.handleSocialLogin = (provider) => {
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
        auth.login(`Usuária ${provider}`, `user_${provider.toLowerCase()}@example.com`);
        overlay.remove();
        showToast(`Bem-vinda! Login via ${provider} realizado.`, 'success');
        window.location.hash = '#/home';
      }, 2000);
    };

    window.handleLogin = (event) => {
      event.preventDefault();
      const isEmail = !document.getElementById('email-section').classList.contains('hidden');
      const name = document.getElementById('login-name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;

      if (!name) {
        showToast('Por favor, insira seu nome.', 'error');
        return;
      }

      if (isEmail && email) {
        auth.login(name, email);
        showToast(`Bem-vinda, ${name.split(' ')[0]}!`, 'success');
        window.location.hash = '#/home';
      } else if (!isEmail && phone) {
        auth.login(name, phone);
        showToast('Acesso via SMS confirmado.', 'success');
        window.location.hash = '#/home';
      }
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
      <div class="w-full max-w-[440px] bg-white/5 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/10">
        <div class="text-center mb-8">
          <h1 class="font-display text-3xl text-primary-fixed mb-2">Login</h1>
          <p class="text-white/50 text-sm">Bem-vinda de volta ao seu ritual de luxo.</p>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-white/10 mb-8">
          <button id="email-tab" onclick="window.switchAuthTab('email')" class="flex-1 pb-3 text-sm font-medium text-primary border-b-2 border-primary transition-all">E-mail</button>
          <button id="phone-tab" onclick="window.switchAuthTab('phone')" class="flex-1 pb-3 text-sm font-medium text-on-primary-fixed-variant border-b-2 border-transparent transition-all">Telefone</button>
        </div>

        <form class="space-y-6" onsubmit="window.handleLogin(event)">
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
              Entrar <span class="material-symbols-outlined text-sm">arrow_forward</span>
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
    </div>
  </div>`;
}
