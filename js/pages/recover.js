import { showToast } from '../components.js';
import { auth } from '../auth.js';

export default function recoverPage() {

  let countdownTimer = null;

  // Toggle password visibility helper
  window.toggleRecoverPasswordVisibility = (inputId, iconId) => {
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

  // Envio REAL de código de verificação via Nodemailer / Backend
  window.handleSendVerificationCode = async () => {
    const emailInput = document.getElementById('recover-email');
    const email = (emailInput?.value || '').trim().toLowerCase();

    if (!email || !email.includes('@')) {
      showToast('Por favor, digite um e-mail válido para receber o código.', 'error');
      if (emailInput) emailInput.focus();
      return;
    }

    const sendBtn = document.getElementById('btn-send-code');
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.innerHTML = '<span class="material-symbols-outlined text-[15px] animate-spin">refresh</span> Enviando...';
    }

    try {
      const resp = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await resp.json();

      if (!resp.ok && !data.success) {
        showToast(data.message || 'Erro ao enviar e-mail de recuperação.', 'error');
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">send</span><span>Enviar Código</span>';
        }
        return;
      }

      // Feedback visual e exibição do banner informativo
      const banner = document.getElementById('code-sent-banner');
      const emailDisplay = document.getElementById('banner-email-text');
      const etherealBox = document.getElementById('banner-ethereal-link');

      if (banner && emailDisplay) {
        emailDisplay.textContent = email;
        banner.classList.remove('hidden');

        if (data.previewUrl && etherealBox) {
          etherealBox.href = data.previewUrl;
          etherealBox.classList.remove('hidden');
        } else if (etherealBox) {
          etherealBox.classList.add('hidden');
        }
      }

      showToast(data.message || 'Código de verificação enviado com sucesso para seu e-mail! 📩', 'success');

      // Cooldown de 60 segundos para evitar abusos
      let secondsLeft = 60;
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = `<span class="material-symbols-outlined text-[15px]">timer</span> Reenviar (${secondsLeft}s)`;
        sendBtn.className = 'absolute right-2 px-3 py-1.5 rounded-full bg-slate-200 text-slate-500 font-bold text-xs cursor-not-allowed flex items-center gap-1';

        if (countdownTimer) clearInterval(countdownTimer);
        countdownTimer = setInterval(() => {
          secondsLeft--;
          if (secondsLeft <= 0) {
            clearInterval(countdownTimer);
            sendBtn.disabled = false;
            sendBtn.innerHTML = `<span class="material-symbols-outlined text-[15px]">send</span> Reenviar Código`;
            sendBtn.className = 'absolute right-2 px-3.5 py-1.5 rounded-full bg-[#8B5FBF] hover:bg-[#7242A5] text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1 cursor-pointer';
          } else {
            sendBtn.innerHTML = `<span class="material-symbols-outlined text-[15px]">timer</span> Reenviar (${secondsLeft}s)`;
          }
        }, 1000);
      }

      // Foco imediato no campo do código
      const codeInput = document.getElementById('recover-code');
      if (codeInput) {
        setTimeout(() => codeInput.focus(), 300);
      }

    } catch (err) {
      console.error('Send verification code error:', err);
      showToast('Erro ao comunicar com o servidor. Verifique se o servidor está ativo.', 'error');
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">send</span><span>Enviar Código</span>';
      }
    }
  };

  // Submit Password Recovery Form — Validação no backend com hash seguro
  window.handlePasswordRecovery = async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('recover-email');
    const codeInput = document.getElementById('recover-code');
    const passInput = document.getElementById('recover-password');
    const passConfirmInput = document.getElementById('recover-password-confirm');

    const email = (emailInput?.value || '').trim().toLowerCase();
    const code = (codeInput?.value || '').trim();
    const newPassword = (passInput?.value || '').trim();
    const confirmPassword = (passConfirmInput?.value || '').trim();

    if (!email || !email.includes('@')) {
      showToast('Informe seu e-mail de cadastro.', 'error');
      if (emailInput) emailInput.focus();
      return;
    }

    if (!code || code.length !== 6) {
      showToast('Digite o código de 6 dígitos recebido por e-mail.', 'error');
      if (codeInput) codeInput.focus();
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      showToast('A nova senha precisa ter pelo menos 4 caracteres.', 'error');
      if (passInput) passInput.focus();
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('A confirmação da senha não confere com a nova senha.', 'error');
      if (passConfirmInput) passConfirmInput.focus();
      return;
    }

    const submitBtn = document.getElementById('btn-submit-recovery');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Processando...';
    }

    try {
      const resp = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });
      const data = await resp.json();

      if (!resp.ok || !data.success) {
        showToast(data.message || 'Código de verificação incorreto ou expirado.', 'error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">verified</span><span>Recuperar Acesso</span>';
        }
        return;
      }

      // Sincroniza com localStorage para consistência imediata
      const users = auth.getRegisteredUsers();
      if (users[email]) {
        users[email].password = newPassword;
      } else {
        users[email] = {
          name: email.split('@')[0],
          emailOrPhone: email,
          password: newPassword,
          accountType: 'pessoal',
          joined: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
        };
      }
      localStorage.setItem('ann_registered_users', JSON.stringify(users));

      const activeUser = auth.getUser();
      if (activeUser && (activeUser.email || '').toLowerCase() === email) {
        activeUser.password = newPassword;
        localStorage.setItem('ann_beauty_user', JSON.stringify(activeUser));
        window.dispatchEvent(new Event('auth-change'));
      }

      showToast('Senha alterada com sucesso! Redirecionando para o login... ✨🔒', 'success');
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 1500);

    } catch (err) {
      console.error('Reset password error:', err);
      showToast('Erro ao redefinir a senha. Verifique sua conexão e tente novamente.', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">verified</span><span>Recuperar Acesso</span>';
      }
    }
  };

  return `
  <main class="flex flex-col md:flex-row w-full min-h-screen">
    <!-- Left Side: Visual Ethereal Imagery -->
    <div class="hidden md:flex md:w-1/2 lg:w-[50%] relative overflow-hidden bg-[#2D1A40] items-center justify-center">
      <img alt="Skincare" class="absolute inset-0 w-full h-full object-cover opacity-75 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2cChqBTVCbwZ6gGYgCU-5Tb42DxiWZuZAa_p7gur5STpTOW6lp0zaTi9SFpS6hYc29tzEwmXDt4kn_fS56mq2OPQNUsFyzQMPf8YteKi2KOfeWXRalTBtkvwjoN38wqYBpkLuX6f8LptOYzTbX3EJ8bFil0Y9NGElEUyhiwVSioiHaFH7EXIq_HRO7gGBeqHN9EdYH2fQ48GQeP43m1_MHomxBq_1VlflTZJOy3bEJe-JgktNlsxuAilr_T6uhOYMEThI__kJl-uG"/>
      <div class="absolute inset-0 bg-gradient-to-br from-[#1E112E]/90 via-[#2D1A40]/70 to-[#8B5FBF]/40 backdrop-blur-[1px]"></div>
      
      <!-- Brand & Catchphrase -->
      <div class="absolute top-12 left-12 z-10 flex items-center gap-3">
        <img src="img/logo.png" alt="Beleza na Web" class="w-11 h-11 rounded-full object-cover border border-[#C4A8E0]/40 shadow-md">
        <div class="flex flex-col leading-none">
          <span class="font-display text-2xl font-bold text-white tracking-tight">Beleza na Web</span>
          <span class="text-xs text-[#D4BDE8] font-medium italic mt-1">Sua beleza, seu cuidado, em cada clique.</span>
        </div>
      </div>

      <div class="relative z-10 p-12 max-w-lg text-white">
        <span class="inline-block px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#D4BDE8] border border-white/20 text-[10px] font-bold uppercase tracking-widest mb-4">SEGURANÇA & PRIVACIDADE</span>
        <h2 class="font-display text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">Seu Ritual de Beleza Protegido.</h2>
        <p class="text-sm text-[#D4BDE8] leading-relaxed opacity-90">Recupere o acesso à sua conta de forma rápida e segura. Enviamos um código de verificação temporário e seguro para o seu e-mail cadastrado.</p>
      </div>
    </div>

    <!-- Right Side: Form Container -->
    <div class="w-full md:w-1/2 lg:w-[50%] flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-[#FAF7FC] relative z-10">
      
      <!-- Mobile Logo -->
      <div class="md:hidden absolute top-6 left-6 flex items-center gap-2">
        <span class="font-display text-xl font-bold text-[#8B5FBF]">Beleza na Web</span>
      </div>

      <div class="w-full max-w-[460px] bg-white rounded-[32px] p-8 sm:p-10 shadow-xl border border-[#DDD0E8]/70 flex flex-col pt-12 md:pt-10">
        
        <!-- Header -->
        <div class="flex flex-col gap-2 mb-8 text-center md:text-left">
          <div class="w-12 h-12 rounded-2xl bg-[#8B5FBF]/15 flex items-center justify-center text-[#8B5FBF] mb-2 mx-auto md:mx-0">
            <span class="material-symbols-outlined text-[26px]">lock_reset</span>
          </div>
          <h1 class="font-display text-3xl font-extrabold text-[#2D1A40] tracking-tight">Esqueceu sua senha?</h1>
          <p class="text-xs sm:text-sm text-[#5C4D6B] font-medium leading-relaxed">Não se preocupe, vamos ajudar você a recuperar o acesso ao seu ritual de beleza.</p>
        </div>

        <form class="flex flex-col gap-5" onsubmit="window.handlePasswordRecovery(event)">
          
          <!-- Field 1: E-mail de Cadastro com botão integrado para enviar código -->
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <label class="text-[11px] font-bold text-[#5C4D6B] uppercase tracking-wider ml-1">E-mail de Cadastro</label>
              <span class="text-[10px] text-[#8B5FBF] font-semibold">Gmail, Outlook, etc.</span>
            </div>
            
            <div class="relative flex items-center">
              <span class="absolute left-4 text-[#9D8AB0] material-symbols-outlined text-[19px]">mail</span>
              <input 
                id="recover-email" 
                class="w-full bg-[#FAF7FD] border border-[#DDD0E8] rounded-2xl pl-11 pr-36 py-3.5 text-xs sm:text-sm font-medium text-[#2D1A40] placeholder:text-[#A89FA9] outline-none focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/20 transition-all shadow-2xs" 
                placeholder="seu.email@gmail.com" 
                type="email" 
                required
              />
              <button 
                type="button" 
                id="btn-send-code" 
                onclick="window.handleSendVerificationCode()" 
                class="absolute right-2 px-3.5 py-2 rounded-xl bg-[#8B5FBF] hover:bg-[#7242A5] text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
                title="Clique para enviar o código de verificação para o seu e-mail"
              >
                <span class="material-symbols-outlined text-[16px]">send</span>
                <span>Enviar Código</span>
              </button>
            </div>
          </div>

          <!-- Code Sent Notification Banner -->
          <div id="code-sent-banner" class="hidden p-4 rounded-2xl bg-gradient-to-br from-[#F5EEFB] to-[#FAF7FD] border border-[#8B5FBF]/30 flex flex-col gap-2.5 animate-in fade-in duration-300">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-xs font-bold text-[#8B5FBF]">
                <span class="material-symbols-outlined text-[18px]">mark_email_read</span>
                <span>Código enviado por e-mail!</span>
              </div>
              <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" class="text-[11px] font-bold text-[#8B5FBF] hover:underline inline-flex items-center gap-0.5 bg-white px-2 py-0.5 rounded-lg border border-[#8B5FBF]/20 shadow-2xs">
                <span>Abrir Gmail</span>
                <span class="material-symbols-outlined text-[12px]">open_in_new</span>
              </a>
            </div>
            <p class="text-xs text-[#5C4D6B] leading-snug">
              Enviamos um código de segurança de 6 dígitos para <strong id="banner-email-text" class="text-[#2D1A40]">seu e-mail</strong>. Verifique sua caixa de entrada e spam.
            </p>
            <a id="banner-ethereal-link" href="#" target="_blank" rel="noopener noreferrer" class="hidden text-xs font-bold text-[#8B5FBF] hover:text-[#7242A5] bg-white px-3 py-2 rounded-xl border border-purple-200 shadow-2xs inline-flex items-center justify-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">visibility</span>
              <span>Visualizar e-mail de teste no Ethereal ↗</span>
            </a>
          </div>

          <!-- Field 2: Código de Verificação -->
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <label class="text-[11px] font-bold text-[#5C4D6B] uppercase tracking-wider ml-1">Código de Verificação</label>
              <span class="text-[10px] text-[#9D8AB0]">6 dígitos recebidos por e-mail</span>
            </div>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#9D8AB0] material-symbols-outlined text-[19px]">pin</span>
              <input 
                id="recover-code" 
                class="w-full bg-[#FAF7FD] border border-[#DDD0E8] rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm font-mono tracking-widest text-[#2D1A40] placeholder:text-[#A89FA9] outline-none focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/20 transition-all shadow-2xs font-semibold" 
                placeholder="Ex: 482910" 
                type="text" 
                maxlength="6"
                required
              />
            </div>
          </div>

          <!-- Field 3: Nova Senha -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-[#5C4D6B] uppercase tracking-wider ml-1">Nova Senha</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#9D8AB0] material-symbols-outlined text-[19px]">lock</span>
              <input 
                id="recover-password" 
                class="w-full bg-[#FAF7FD] border border-[#DDD0E8] rounded-2xl pl-11 pr-11 py-3.5 text-xs sm:text-sm font-medium text-[#2D1A40] placeholder:text-[#A89FA9] outline-none focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/20 transition-all shadow-2xs" 
                placeholder="No mínimo 4 caracteres" 
                type="password" 
                required
              />
              <button 
                type="button" 
                onclick="window.toggleRecoverPasswordVisibility('recover-password', 'eye-recover-pass')" 
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9D8AB0] hover:text-[#8B5FBF] p-1 flex items-center justify-center transition-colors cursor-pointer"
                title="Visualizar ou ocultar senha"
              >
                <span id="eye-recover-pass" class="material-symbols-outlined text-[19px]">visibility</span>
              </button>
            </div>
          </div>

          <!-- Field 4: Confirmar Nova Senha -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-[#5C4D6B] uppercase tracking-wider ml-1">Confirmar Nova Senha</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#9D8AB0] material-symbols-outlined text-[19px]">lock_clock</span>
              <input 
                id="recover-password-confirm" 
                class="w-full bg-[#FAF7FD] border border-[#DDD0E8] rounded-2xl pl-11 pr-11 py-3.5 text-xs sm:text-sm font-medium text-[#2D1A40] placeholder:text-[#A89FA9] outline-none focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/20 transition-all shadow-2xs" 
                placeholder="Repita a nova senha" 
                type="password" 
                required
              />
              <button 
                type="button" 
                onclick="window.toggleRecoverPasswordVisibility('recover-password-confirm', 'eye-recover-confirm')" 
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9D8AB0] hover:text-[#8B5FBF] p-1 flex items-center justify-center transition-colors cursor-pointer"
                title="Visualizar ou ocultar confirmação de senha"
              >
                <span id="eye-recover-confirm" class="material-symbols-outlined text-[19px]">visibility</span>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            id="btn-submit-recovery"
            class="w-full mt-3 bg-[#8B5FBF] hover:bg-[#7242A5] text-white rounded-2xl py-4 font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#8B5FBF]/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Recuperar Acesso</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        <!-- Back to Login Link -->
        <div class="mt-8 text-center pt-5 border-t border-[#F0E8F7]">
          <a class="inline-flex items-center gap-2 font-bold text-xs text-[#5C4D6B] hover:text-[#8B5FBF] transition-colors" href="#/login">
            <span class="material-symbols-outlined text-[16px]">arrow_back</span>
            Voltar para o Login
          </a>
        </div>

      </div>
    </div>
  </main>`;
}
