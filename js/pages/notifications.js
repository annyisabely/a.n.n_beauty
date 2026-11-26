import { auth } from '../auth.js';
import { showToast } from '../components.js';
import { socialManager } from '../social_manager.js';

export default function notificationsPage() {
  const user = auth.getUser();

  if (!user) {
    setTimeout(() => {
      showToast('Por favor, faça login para ver suas notificações.', 'error');
      window.location.hash = '#/login';
    }, 50);
    return `<div class="min-h-screen bg-background flex items-center justify-center p-8"><div class="text-center font-bold text-primary">Redirecionando...</div></div>`;
  }

  // Fetch real notifications from notificationsManager
  const notifications = window.notificationsManager ? window.notificationsManager.getNotifications(user.email) : [];

  // Mark all as read when opening page
  if (window.notificationsManager) {
    notifications.forEach(n => {
      if (!n.read) {
        window.notificationsManager.markAsRead(user.email, n.id);
      }
    });
  }

  // ── Global Handlers for Notification Dismiss and Rating ──
  window.dismissNotification = (id) => {
    if (window.notificationsManager) {
      window.notificationsManager.removeNotification(user.email, id);
      showToast('Notificação removida', 'info');
      window.dispatchEvent(new CustomEvent('auth-change'));
    }
  };

  // Temp state for rating inside notification card
  window.notifRatings = window.notifRatings || {};

  window.setNotifRatingStars = (notifId, rating) => {
    window.notifRatings[notifId] = rating;
    for (let i = 1; i <= 5; i++) {
      const star = document.getElementById(`notif-star-${notifId}-${i}`);
      if (star) {
        if (i <= rating) {
          star.classList.add('text-amber-400');
          star.classList.remove('text-gray-300');
          star.style.fontVariationSettings = "'FILL' 1";
        } else {
          star.classList.remove('text-amber-400');
          star.classList.add('text-gray-300');
          star.style.fontVariationSettings = "'FILL' 0";
        }
      }
    }
  };

  window.submitNotifReview = (notifId, orderId, storeId) => {
    const rating = window.notifRatings[notifId] || 5;
    const commentInput = document.getElementById(`notif-comment-${notifId}`);
    const comment = commentInput ? commentInput.value.trim() : '';

    if (!comment) {
      showToast('Por favor, digite seu comentário antes de enviar.', 'error');
      return;
    }

    // Submit review dynamically via socialManager
    // Glow & Co default product is prod_velvet_matte, Botanica is prod_serum, fallback to prod_velvet_matte
    const productId = storeId === 'store_botanica' ? 'prod_serum' : 'prod_velvet_matte';
    
    if (window.socialManager) {
      const res = window.socialManager.addProductReview(productId, rating, comment);
      
      if (res.success) {
        // Trigger seller notification
        if (window.notificationsManager) {
          window.notificationsManager.addNotification('vendedor@annbeauty.com', {
            title: 'Nova Avaliação de Produto',
            message: `O cliente "${user.name}" avaliou o produto da sua loja com ${rating} estrelas: "${comment}"`,
            icon: 'star',
            color: 'text-amber-500'
          });
        }
        
        showToast('Obrigado! Sua avaliação foi enviada com sucesso.', 'success');
        // Remove this notification since it has been resolved
        if (window.notificationsManager) {
          window.notificationsManager.removeNotification(user.email, notifId);
        }
        window.dispatchEvent(new CustomEvent('auth-change'));
      } else {
        showToast(res.message || 'Erro ao enviar avaliação.', 'error');
      }
    }
  };

  const items = notifications.length > 0 ? notifications.map(n => {
    // Check if this is a rating reminder
    let rateWidgetHTML = '';
    if (n.rateLink) {
      rateWidgetHTML = `
      <div class="mt-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-3">
        <p class="text-[11px] font-bold text-primary uppercase tracking-wider">Avaliar Pedido ${n.orderId || ''}</p>
        
        <!-- Stars rating -->
        <div class="flex items-center gap-1">
          ${[1, 2, 3, 4, 5].map(i => `
            <button type="button" onclick="window.setNotifRatingStars('${n.id}', ${i})" class="focus:outline-none transition-transform hover:scale-125">
              <span id="notif-star-${n.id}-${i}" class="material-symbols-outlined text-[24px] text-amber-400 cursor-pointer" style="font-variation-settings:'FILL' 1">star</span>
            </button>
          `).join('')}
        </div>

        <!-- Comment field -->
        <div class="flex gap-2">
          <input type="text" id="notif-comment-${n.id}" placeholder="Deixe seu comentário sobre a entrega..."
            class="flex-grow bg-white border border-purple-100 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-primary transition-all text-on-surface"
          />
          <button onclick="window.submitNotifReview('${n.id}', '${n.orderId}', '${n.storeId}')" 
            class="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-sm">
            Enviar
          </button>
        </div>
      </div>`;
    }

    return `
    <div id="notif-${n.id}" class="flex gap-4 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-purple-50 hover:border-purple-100 hover:shadow-md transition-all group relative overflow-hidden animate-in fade-in duration-300">
      <div class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-outlined ${n.color || 'text-primary'}">${n.icon || 'notifications'}</span>
      </div>
      <div class="flex-grow pr-8">
        <div class="flex justify-between items-start mb-1 flex-wrap gap-1">
          <h3 class="font-display text-base md:text-lg text-on-surface group-hover:text-primary transition-colors font-bold">${n.title}</h3>
          <span class="text-[10px] uppercase tracking-widest text-[#8F7EAA] font-bold">${n.time}</span>
        </div>
        <p class="font-body-sm text-on-surface-variant leading-relaxed font-medium opacity-90">${n.message}</p>
        ${rateWidgetHTML}
      </div>
      <button onclick="window.dismissNotification('${n.id}')" class="absolute top-4 right-4 text-[#8F7EAA] hover:text-red-500 transition-colors">
        <span class="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>`;
  }).join('') : `
    <div class="py-16 text-center bg-white rounded-3xl border border-purple-50 shadow-sm">
      <span class="material-symbols-outlined text-5xl text-purple-200 mb-2">notifications_off</span>
      <p class="text-sm text-on-surface-variant font-bold opacity-60">Você não tem novas notificações.</p>
    </div>`;

  window.activateNotifications = () => {
    if (!("Notification" in window)) {
      showToast('Seu navegador não suporta notificações.', 'error');
      return;
    }
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("Beleza na Web", {
          body: "Notificações ativadas! Você receberá alertas de ofertas, promoções e atualizações.",
          icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuD41q-VUnwu5joHMxbWJsr36dy1zx3rIn2vEK7uzvQTDUffwl0ZH_HI_dTANk1KbB9owXbG4r3zHuZ0HVyYdnrM_iCEs2T28ZeOaR08HylhHFMcLQ7HbG_Sie4x-YY2ALCH46qv813TkJWK1AuLKhbgI70JyZ3h_2uFi-BnVubhKdnicfILcz2wGII7oUz38OzHYvodmNc7KWNeyoqLmi7hoHDJdbzNFetGZrb5-7anzBucsvdu8yAwBxA_KgpzWQXgXaiSjTNilD4W"
        });
        showToast('Notificações ativadas com sucesso!', 'success');
        localStorage.setItem('ann_notifications_enabled', 'true');
        const btn = document.getElementById('btn-activate-notif');
        if (btn) {
          btn.innerText = 'Notificações Ativadas';
          btn.classList.add('opacity-50', 'pointer-events-none');
        }
      } else {
        showToast('Permissão de notificação negada.', 'error');
      }
    });
  };

  const isNotifEnabled = localStorage.getItem('ann_notifications_enabled') === 'true';

  return `
  <main class="flex-grow w-full max-w-[800px] mx-auto px-4 md:px-10 py-12">
    <header class="mb-10 text-center relative">
      <h1 class="font-display text-4xl text-on-surface font-bold tracking-tight mb-2">Central de Alertas</h1>
      <p class="text-on-surface-variant font-body-md">Acompanhe atualizações sobre pedidos, mensagens e ofertas.</p>
    </header>
    
    <div id="notif-list" class="flex flex-col gap-4">
      ${items}
    </div>

    <div class="mt-12 p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[32px] text-center border border-purple-100">
      <h3 class="font-display text-xl text-primary font-bold mb-2">Fique por dentro!</h3>
      <p class="text-sm text-on-surface-variant mb-6">Ative as notificações no navegador para não perder nenhuma oferta relâmpago.</p>
      <button id="btn-activate-notif" onclick="window.activateNotifications()" class="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:opacity-90 transition-opacity ${isNotifEnabled ? 'opacity-50 pointer-events-none' : ''}">${isNotifEnabled ? 'Notificações Ativadas' : 'Ativar Agora'}</button>
    </div>
  </main>`;
}

export function mount() {
  // Star values preset
  const notifications = window.notificationsManager ? window.notificationsManager.getNotifications(auth.getUser() ? auth.getUser().email : '') : [];
  notifications.forEach(n => {
    if (n.rateLink) {
      window.setNotifRatingStars(n.id, 5);
    }
  });
}
