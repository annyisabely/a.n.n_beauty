export default function recoverPage() {
  return `
  <main class="flex flex-col md:flex-row w-full min-h-screen">
    <div class="hidden md:flex md:w-1/2 lg:w-[55%] relative overflow-hidden bg-primary items-center justify-center">
      <img alt="Skincare" class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2cChqBTVCbwZ6gGYgCU-5Tb42DxiWZuZAa_p7gur5STpTOW6lp0zaTi9SFpS6hYc29tzEwmXDt4kn_fS56mq2OPQNUsFyzQMPf8YteKi2KOfeWXRalTBtkvwjoN38wqYBpkLuX6f8LptOYzTbX3EJ8bFil0Y9NGElEUyhiwVSioiHaFH7EXIq_HRO7gGBeqHN9EdYH2fQ48GQeP43m1_MHomxBq_1VlflTZJOy3bEJe-JgktNlsxuAilr_T6uhOYMEThI__kJl-uG"/>
      <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-black/40 backdrop-blur-[1px]"></div>
      <div class="absolute top-12 left-12 z-10">
        <span class="font-display text-4xl text-white drop-shadow-2xl tracking-tighter">Beleza na Web</span>
      </div>
    </div>
    <div class="w-full md:w-1/2 lg:w-[45%] flex items-center justify-center p-8 lg:p-16 bg-white relative z-10 shadow-2xl">
      <div class="md:hidden absolute top-10 left-10">
        <span class="font-display text-2xl text-primary tracking-tighter">Beleza na Web</span>
      </div>
      <div class="w-full max-w-md flex flex-col pt-16 md:pt-0">
        <div class="flex flex-col gap-3 mb-12">
          <h1 class="font-display text-4xl text-on-surface">Esqueceu sua senha?</h1>
          <p class="font-body-md text-on-surface-variant leading-relaxed">Não se preocupe, vamos ajudar você a recuperar o acesso ao seu ritual de beleza.</p>
        </div>
        <form class="flex flex-col gap-8" onsubmit="event.preventDefault(); showToast('Um código foi enviado para seu e-mail', 'success'); setTimeout(() => window.location.hash='#/login', 2000);">
          <div class="flex flex-col gap-2">
            <label class="font-label-md text-on-surface-variant ml-4 font-bold uppercase tracking-widest text-[10px]">E-mail de Cadastro</label>
            <input class="w-full bg-purple-50/50 border border-purple-100 rounded-full px-8 py-5 font-body-md text-on-surface placeholder:text-outline/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm" placeholder="ex: aparecida@gmail.com" type="email" required/>
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-label-md text-on-surface-variant ml-4 font-bold uppercase tracking-widest text-[10px]">Código de Verificação</label>
            <input class="w-full bg-purple-50/50 border border-purple-100 rounded-full px-8 py-5 font-body-md text-on-surface placeholder:text-outline/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm" placeholder="Enviado por e-mail ou SMS" type="text"/>
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-label-md text-on-surface-variant ml-4 font-bold uppercase tracking-widest text-[10px]">Nova Senha</label>
            <input class="w-full bg-purple-50/50 border border-purple-100 rounded-full px-8 py-5 font-body-md text-on-surface placeholder:text-outline/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm" placeholder="No mínimo 8 caracteres" type="password" required/>
          </div>
          <button class="w-full mt-6 bg-primary text-white rounded-full px-10 py-5 font-bold shadow-xl hover:bg-primary-container transition-all flex items-center justify-center gap-3 active:scale-[0.98]" type="submit">
            <span>Recuperar Acesso</span>
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </form>
        <div class="mt-12 text-center">
            <a class="inline-flex items-center gap-3 font-bold text-sm text-on-surface-variant hover:text-primary transition-colors" href="#/login">
                <span class="material-symbols-outlined text-[18px]">arrow_back</span>
                Voltar para o Login
            </a>
        </div>
      </div>
    </div>
  </main>`;
}
