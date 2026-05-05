export default function notificationsPage() {
  window.dismissNotification = (id) => {
    const el = document.getElementById(`notif-${id}`);
    if (el) {
      el.classList.add('opacity-0', 'scale-95');
      setTimeout(() => {
        el.remove();
        if (document.querySelectorAll('[id^="notif-"]').length === 0) {
          document.getElementById('notif-list').innerHTML = `
            <div class="py-12 text-center text-on-surface-variant italic">
              Você não tem novas notificações.
            </div>`;
        }
      }, 300);
    }
  };

  const notifications = [
    { id: 1, title: 'Pedido Confirmado', message: 'Seu pedido #ANN1234 foi confirmado e está em preparação.', time: '2 horas atrás', icon: 'check_circle', color: 'text-green-500' },
    { id: 2, title: 'Oferta Exclusiva', message: 'Ganhe 20% de desconto na sua próxima compra com o cupom BEAUTY20.', time: '5 horas atrás', icon: 'local_offer', color: 'text-purple-500' },
    { id: 3, title: 'Lembrete de Ritual', message: 'Hora da sua rotina de cuidados noturnos. Que tal usar seu Luminous Serum?', time: 'Ontem', icon: 'bedtime', color: 'text-blue-500' },
  ];

  const items = notifications.map(n => `
    <div id="notif-${n.id}" class="flex gap-4 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-purple-50 hover:border-purple-100 hover:shadow-md transition-all group relative overflow-hidden">
      <div class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-outlined ${n.color}">${n.icon}</span>
      </div>
      <div class="flex-grow pr-8">
        <div class="flex justify-between items-start mb-1">
          <h3 class="font-display text-lg text-on-surface group-hover:text-primary transition-colors">${n.title}</h3>
          <span class="text-[10px] uppercase tracking-widest text-outline">${n.time}</span>
        </div>
        <p class="font-body-sm text-on-surface-variant leading-relaxed">${n.message}</p>
      </div>
      <button onclick="window.dismissNotification(${n.id})" class="absolute top-4 right-4 text-outline hover:text-red-500 transition-colors">
        <span class="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  `).join('');

  window.activateNotifications = () => {
    if (!("Notification" in window)) {
      window.showToast('Seu navegador não suporta notificações.', 'error');
      return;
    }
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("A.n.n Beauty", {
          body: "Notificações ativadas! Você receberá alertas de ofertas, promoções e atualizações.",
          icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuD41q-VUnwu5joHMxbWJsr36dy1zx3rIn2vEK7uzvQTDUffwl0ZH_HI_dTANk1KbB9owXbG4r3zHuZ0HVyYdnrM_iCEs2T28ZeOaR08HylhHFMcLQ7HbG_Sie4x-YY2ALCH46qv813TkJWK1AuLKhbgI70JyZ3h_2uFi-BnVubhKdnicfILcz2wGII7oUz38OzHYvodmNc7KWNeyoqLmi7hoHDJdbzNFetGZrb5-7anzBucsvdu8yAwBxA_KgpzWQXgXaiSjTNilD4W"
        });
        window.showToast('Notificações ativadas com sucesso!', 'success');
        localStorage.setItem('ann_notifications_enabled', 'true');
        const btn = document.getElementById('btn-activate-notif');
        if (btn) {
          btn.innerText = 'Notificações Ativadas';
          btn.classList.add('opacity-50', 'pointer-events-none');
        }
      } else {
        window.showToast('Permissão de notificação negada.', 'error');
      }
    });
  };

  const isNotifEnabled = localStorage.getItem('ann_notifications_enabled') === 'true';

  return `
  <main class="flex-grow w-full max-w-[800px] mx-auto px-4 md:px-10 py-12">
    <header class="mb-10 text-center relative">
      <h1 class="font-display text-4xl text-on-surface mb-2">Notificações</h1>
      <p class="text-on-surface-variant font-body-md">Acompanhe seus pedidos e novidades exclusivas.</p>
    </header>
    
    <div id="notif-list" class="flex flex-col gap-4">
      ${items}
    </div>

    <div class="mt-12 p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl text-center border border-purple-100">
      <h3 class="font-display text-xl text-primary mb-2">Fique por dentro!</h3>
      <p class="text-sm text-on-surface-variant mb-6">Ative as notificações no navegador para não perder nenhuma oferta relâmpago.</p>
      <button id="btn-activate-notif" onclick="window.activateNotifications()" class="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:opacity-90 transition-opacity ${isNotifEnabled ? 'opacity-50 pointer-events-none' : ''}">${isNotifEnabled ? 'Notificações Ativadas' : 'Ativar Agora'}</button>
    </div>
  </main>`;
}
