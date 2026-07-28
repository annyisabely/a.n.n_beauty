import { auth } from '../auth.js';
import { socialManager } from '../social_manager.js';

export default function profilePage() {
  const user = auth.getUser() || { name: 'Usuária A.n.n', email: '' };
  const savedBio = localStorage.getItem('ann_profile_bio') || '"Entusiasta de beleza etérea | Minimalista em skincare ✨"';
  const savedPhoto = localStorage.getItem('ann_profile_photo') || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC77ZoIlcWkWMv6PoHvkxSm9AoIAod0TJnJZWF2MeQxi2AruIoztM2Esx1b7bu7WxXGBGql9gTS2qlzljZWZAgMwk3SP1E-X-LjEVwToyizyz0TQShvF0SJnfPxI85iPPDiyG4Hcj8ZowqeUsmVL7FgblL1dmjET0-akwNh34c4Wg5a6Miix5O7Dh_wwJUW2CLFx_SwKVGVqV0yXrLrcEmYdC9FimpquKe5z8CwL80QMWe0xc3-uZYa93ToeCwEUhDkvbtB7Ccw8obU';
  const followers = parseInt(localStorage.getItem('ann_followers')) || 12450;
  const posts = JSON.parse(localStorage.getItem(`ann_posts_${user.email}`) || '[]');
  let savedItems = auth.getSavedItems();

  window.switchProfileTab = (tab) => {
    const postBtn = document.getElementById('tab-posts-btn');
    const savedBtn = document.getElementById('tab-saved-btn');
    const grid = document.getElementById('profile-grid-container');
    
    if (tab === 'posts') {
        postBtn.classList.add('text-primary', 'border-primary');
        postBtn.classList.remove('text-on-surface-variant');
        savedBtn.classList.add('text-on-surface-variant');
        renderPostsGrid(posts, 'posts');
    } else {
        savedBtn.classList.add('text-primary', 'border-primary');
        savedBtn.classList.remove('text-on-surface-variant');
        postBtn.classList.remove('text-primary', 'border-primary');
        postBtn.classList.add('text-on-surface-variant');
        renderPostsGrid(auth.getSavedItems(), 'saved');
    }
  };

  window.toggleSavePost = (postId) => {
    // Determine the source of the post
    let item = posts.find(p => p.id == postId) || auth.getSavedItems().find(p => p.id == postId);
    if (!item) return;

    const isSaved = auth.toggleSaveItem(item, item.type || 'photo');
    showToast(isSaved ? 'Salvo com sucesso!' : 'Removido dos salvos', isSaved ? 'success' : 'info');
    
    // If we're on the saved tab, refresh the grid
    if (document.getElementById('tab-saved-btn').classList.contains('text-primary')) {
        renderPostsGrid(auth.getSavedItems(), 'saved');
    }
  };

  function renderPostsGrid(items, type) {
    const grid = document.getElementById('profile-grid-container');
    if (items.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full py-24 text-center flex flex-col items-center gap-6">
             <div class="w-24 h-24 bg-primary-container/30 rounded-full flex items-center justify-center text-primary/40">
                <span class="material-symbols-outlined text-5xl">${type === 'posts' ? 'add_a_photo' : 'bookmark_border'}</span>
             </div>
             <div class="space-y-1">
                <p class="text-on-surface font-bold text-base">${type === 'posts' ? 'Sua galeria está em branco' : 'Nenhuma inspiração salva'}</p>
                <p class="text-on-surface-variant opacity-60 text-xs">${type === 'posts' ? 'Compartilhe seu primeiro ritual de beleza com o mundo.' : 'Seus produtos e tutoriais favoritos aparecerão aqui.'}</p>
             </div>
          </div>
        `;
        return;
    }
    
    grid.innerHTML = items.map(item => {
      const interactions = socialManager.getInteractions(item.id);
      const rating = socialManager.getRating(item.id);
      
      const isProduct = item.contentType === 'product' || item.price;
      const isVideo = item.contentType === 'video' || item.type === 'video';
      const imageUrl = isProduct ? (item.img.startsWith('http') ? item.img : `https://lh3.googleusercontent.com/aida-public/${item.img}`) : item.data;

      return `
      <div onclick="${isProduct ? `window.location.hash = '#/search'` : `window.viewPostDetail(${item.id})`}" class="aspect-square rounded-[32px] overflow-hidden bg-primary-container/10 group cursor-pointer relative shadow-ethereal hover:shadow-ethereal-hover transition-all duration-700 border border-primary/5">
        ${isVideo ? `
          <video class="w-full h-full object-cover" ${type === 'posts' ? 'muted loop onmouseover="this.play()" onmouseout="this.pause()"' : 'controls'}>
            <source src="${item.data || imageUrl}">
          </video>
        ` : `
          <img alt="Item" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src="${imageUrl}"/>
        `}
        <div class="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-4 text-center backdrop-blur-[2px]">
           ${isProduct ? `
             <div class="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p class="font-display font-bold text-sm mb-1">${item.name}</p>
                <p class="text-[10px] font-black tracking-widest opacity-90">${item.price}</p>
             </div>
           ` : `
             <div class="flex gap-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
               <span class="text-white font-black flex items-center gap-2 text-xs"><span class="material-symbols-outlined text-[20px] text-secondary" style="font-variation-settings: 'FILL' 1">favorite</span> ${interactions.likes.length}</span>
               <span class="text-white font-black flex items-center gap-2 text-xs"><span class="material-symbols-outlined text-[20px] text-secondary-container" style="font-variation-settings: 'FILL' 1">grade</span> ${rating}</span>
             </div>
           `}
        </div>
        ${isProduct ? `<div class="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-primary p-2 rounded-full shadow-sm"><span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1">shopping_bag</span></div>` : ''}
      </div>
    `;}).join('');
  }

  window.toggleProfileEdit = () => {
    const isEditing = document.getElementById('edit-fields').classList.contains('hidden');
    document.getElementById('edit-fields').classList.toggle('hidden');
    document.getElementById('profile-info').classList.toggle('hidden');
  };

  window.saveDirectProfile = () => {
    const newBio = document.getElementById('edit-bio').value;
    localStorage.setItem('ann_profile_bio', newBio);
    
    // Persist to user-specific storage
    if (user.email) {
      const profile = { bio: newBio, photo: localStorage.getItem('ann_profile_photo') };
      localStorage.setItem(`ann_profile_${user.email}`, JSON.stringify(profile));
      
      // Update session
      user.bio = newBio;
      localStorage.setItem('ann_beauty_user', JSON.stringify(user));
    }
    
    window.location.reload();
  };

  window.handleProfilePhotoUpload = (input) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        localStorage.setItem('ann_profile_photo', e.target.result);
        document.getElementById('profile-avatar').src = e.target.result;
        
        // Persist to user-specific storage
        if (user.email) {
            const profile = { bio: localStorage.getItem('ann_profile_bio'), photo: e.target.result };
            localStorage.setItem(`ann_profile_${user.email}`, JSON.stringify(profile));
            
            // Update session
            user.photo = e.target.result;
            localStorage.setItem('ann_beauty_user', JSON.stringify(user));
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  let growthInterval = null;

  window.viewPostDetail = (postId) => {
    const post = posts.find(p => p.id == postId);
    if (!post) return;

    if (growthInterval) clearInterval(growthInterval);

    const updateUI = () => {
        const interactions = socialManager.getInteractions(postId);
        const rating = socialManager.getRating(postId);
        const isLiked = interactions.likes.some(u => u.email === user.email);
        const isStarred = interactions.stars.some(u => u.email === user.email);

        const modal = document.getElementById('post-detail-modal');
        const content = document.getElementById('detail-modal-content');
        
        content.innerHTML = `
          <div class="flex flex-col md:flex-row h-full max-h-[90vh]">
            <div class="md:w-3/5 bg-black flex items-center justify-center">
              ${post.type === 'video' ? `
                <video class="w-full h-full object-contain" controls autoplay loop>
                  <source src="${post.data}">
                </video>
              ` : `
                <img class="w-full h-full object-contain" src="${post.data}"/>
              `}
            </div>
            <div class="md:w-2/5 bg-white p-6 flex flex-col h-full overflow-y-auto">
              <div class="flex items-center gap-3 mb-6 pb-6 border-b border-purple-50">
                <img class="w-10 h-10 rounded-full object-cover" src="${savedPhoto}"/>
                <div>
                  <p class="font-bold text-sm text-on-surface">${user.name}</p>
                  <p class="text-[10px] text-outline">${post.date}</p>
                </div>
              </div>
              
              <div class="mb-6">
                <p class="text-sm text-on-surface leading-relaxed">${post.caption}</p>
              </div>

              <div class="flex items-center gap-6 mb-6">
                <button onclick="window.toggleLikePost(${post.id})" class="flex items-center gap-1.5 transition-all active:scale-90 ${isLiked ? 'text-red-500' : 'text-outline'}">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' ${isLiked ? 1 : 0}">favorite</span>
                    <span id="like-count-${post.id}" class="font-bold hover:underline cursor-pointer" onclick="event.stopPropagation(); window.renderUserListModal('Curtidas', socialManager.getInteractions(${post.id}).likes)">${interactions.likes.length}</span>
                </button>
                <button onclick="window.toggleStarPost(${post.id})" class="flex items-center gap-1.5 transition-all active:scale-90 ${isStarred ? 'text-amber-500' : 'text-outline'}">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' ${isStarred ? 1 : 0}">star</span>
                    <span id="rating-${post.id}" class="font-bold hover:underline cursor-pointer" onclick="event.stopPropagation(); window.renderUserListModal('Estrelas', socialManager.getInteractions(${post.id}).stars)">${rating}</span>
                </button>
                <button onclick="window.toggleSavePost(${post.id}); this.querySelector('.material-symbols-outlined').style.fontVariationSettings = \`'FILL' \${auth.getSavedItems().some(s => s.id == post.id) ? 1 : 0}\`" class="ml-auto ${auth.getSavedItems().some(s => s.id == post.id) ? 'text-amber-500' : 'text-outline'}">
                    <span class="material-symbols-outlined text-[24px]" style="font-variation-settings: 'FILL' ${auth.getSavedItems().some(s => s.id == post.id) ? 1 : 0}">bookmark</span>
                </button>
              </div>

              <div class="flex-grow">
                <h4 class="font-bold text-xs uppercase tracking-widest text-outline mb-4">Comentários (${interactions.comments.length})</h4>
                <div id="comments-container-${post.id}" class="space-y-4">
                  ${interactions.comments.map((c, idx) => `
                    <div class="flex gap-2 group/comment">
                      <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">${c.user.charAt(0)}</div>
                      <div class="flex-grow">
                        <p class="text-[11px] font-bold">${c.user}</p>
                        <p class="text-xs text-on-surface-variant">${c.text}</p>
                        <p class="text-[8px] text-outline mt-0.5">${c.date || ''}</p>
                      </div>
                      <button onclick="window.handleDeleteComment(${post.id}, ${idx})" class="opacity-0 group-hover/comment:opacity-100 text-outline hover:text-red-500 transition-all">
                        <span class="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="mt-6 pt-6 border-t border-purple-50">
                <form onsubmit="window.handleComment(event, ${post.id})" class="flex gap-2">
                  <input id="comment-input-${post.id}" type="text" placeholder="Escreva um comentário..." class="flex-grow bg-surface-container-low border border-surface-variant rounded-full px-4 py-2 text-xs outline-none focus:border-primary">
                  <button type="submit" class="bg-primary text-white p-2 rounded-full"><span class="material-symbols-outlined text-[18px]">send</span></button>
                </form>
              </div>
            </div>
          </div>
        `;
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    };

    updateUI();
    growthInterval = socialManager.runBackgroundTasks(postId, user, updateUI);
  };

  window.handleComment = (event, postId) => {
    event.preventDefault();
    const input = document.getElementById(`comment-input-${postId}`);
    const text = input.value.trim();
    if (!text) return;

    socialManager.addComment(postId, user, text);
    input.value = '';
    
    // Refresh modal UI
    window.viewPostDetail(postId);
    
    // Trigger automated response
    socialManager.handleUserCommentResponse(postId, text, () => {
        // Callback to refresh UI after bot responds
        if (document.getElementById('post-detail-modal').style.display !== 'none') {
            window.viewPostDetail(postId);
        }
    });

    if (text.toUpperCase() === 'OK') {
        showToast('Mensagens automáticas desativadas.', 'info');
    }
  };

  window.handleDeleteComment = (postId, commentIndex) => {
    if (confirm('Deseja excluir este comentário?')) {
        socialManager.deleteComment(postId, commentIndex);
        window.viewPostDetail(postId); // Refresh modal
    }
  };

  window.toggleLikePost = (postId) => {
    const interactions = socialManager.toggleLike(postId, user);
    if (!interactions) return;
    
    // Update UI in modal
    const countEl = document.getElementById(`like-count-${postId}`);
    if (countEl) countEl.innerText = interactions.likes.length;
    
    // Toggle button color
    const btn = event.currentTarget;
    const isLiked = interactions.likes.some(u => u.email === user.email);
    btn.classList.toggle('text-red-500', isLiked);
    btn.classList.toggle('text-outline', !isLiked);
    btn.querySelector('.material-symbols-outlined').style.fontVariationSettings = `'FILL' ${isLiked ? 1 : 0}`;
  };

  window.toggleStarPost = (postId) => {
    const interactions = socialManager.toggleStar(postId, user);
    if (!interactions) return;
    
    // Update UI (label is the rating)
    const ratingEl = document.getElementById(`rating-${postId}`);
    if (ratingEl) ratingEl.innerText = socialManager.getRating(postId);
    
    // Toggle button color
    const btn = event.currentTarget;
    const isStarred = interactions.stars.some(u => u.email === user.email);
    btn.classList.toggle('text-amber-500', isStarred);
    btn.classList.toggle('text-outline', !isStarred);
    btn.querySelector('.material-symbols-outlined').style.fontVariationSettings = `'FILL' ${isStarred ? 1 : 0}`;
  };

  window.toggleDetailModal = () => {
    if (growthInterval) clearInterval(growthInterval);
    document.getElementById('post-detail-modal').classList.toggle('hidden');
    document.getElementById('post-detail-modal').classList.toggle('flex');
  };

  window.togglePostModal = () => {
    document.getElementById('post-modal').classList.toggle('hidden');
    document.getElementById('post-modal').classList.toggle('flex');
  };

  window.handleProfilePost = (event) => {
    event.preventDefault();
    const type = document.getElementById('modal-post-type').value;
    const fileInput = document.getElementById('modal-post-file');
    const caption = document.getElementById('modal-post-caption').value;

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPost = {
          id: Date.now(),
          type: type,
          data: e.target.result,
          caption: caption,
          date: new Date().toLocaleDateString()
        };
        
        // Initialize mock social proof
        socialManager.initMockInteractions(newPost.id);

        // Save to user-specific posts array
        const userPosts = JSON.parse(localStorage.getItem(`ann_posts_${user.email}`) || '[]');
        userPosts.unshift(newPost);
        localStorage.setItem(`ann_posts_${user.email}`, JSON.stringify(userPosts));

        // Mass Like Boost: Add 25 likes to ALL photos whenever a new one is posted
        userPosts.forEach(p => {
            for (let i = 0; i < 25; i++) {
                const randomId = Math.floor(Math.random() * 100000);
                socialManager.toggleLike(p.id, { 
                    name: `Seguidora ${randomId}`, 
                    email: `bot_boost_${randomId}_${p.id}@ann.com` 
                });
            }
        });
        
        // Follower Growth Mechanic: 5 to 10 new followers per post
        const followerGain = Math.floor(Math.random() * 6) + 5; // 5 to 10
        user.followers = (user.followers || 0) + followerGain;
        user.postsCount = (user.postsCount || 0) + 1;
        
        // Save to specific user profile
        const profile = JSON.parse(localStorage.getItem(`ann_profile_${user.email}`) || '{}');
        profile.followers = user.followers;
        profile.postsCount = user.postsCount;
        localStorage.setItem(`ann_profile_${user.email}`, JSON.stringify(profile));
        
        // Update session
        localStorage.setItem('ann_beauty_user', JSON.stringify(user));
        
        showToast(`Publicado! Você ganhou ${followerGain} novos seguidores! ✨`, 'success');
        
        setTimeout(() => window.location.reload(), 1500);
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  };

  return `
  <main class="flex-grow max-w-[1280px] mx-auto px-4 md:px-10 py-16 w-full bg-background">
    <section class="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
      <div class="relative mb-10 group">
        <div class="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div class="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-ethereal transition-transform duration-700 group-hover:scale-105">
          <img alt="Avatar" id="profile-avatar" class="w-full h-full object-cover" src="${savedPhoto}"/>
        </div>
        <label class="absolute bottom-2 right-2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all active:scale-95 border-4 border-white cursor-pointer z-10">
          <span class="material-symbols-outlined text-[22px]">photo_camera</span>
          <input type="file" class="hidden" accept="image/*" onchange="window.handleProfilePhotoUpload(this)">
        </label>
      </div>
      
      <div id="profile-info" class="space-y-4">
        <h1 class="font-display text-4xl m:text-5xl text-on-background tracking-tighter">${user.name}</h1>
        <p class="text-base text-on-surface-variant font-medium opacity-80 max-w-lg mx-auto italic">"${savedBio.replace(/"/g, '')}"</p>
        <div class="flex items-center justify-center gap-3 pt-2">
            <button onclick="window.toggleProfileEdit()" class="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-secondary transition-colors border border-primary/20 px-4 py-2 rounded-full">Personalizar Perfil</button>
            ${(user.role === 'admin_master' || user.role === 'empresa') ? `
            <a href="#/admin" class="text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-white hover:bg-primary/90 transition-all px-5 py-2.5 rounded-full shadow-md flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1">storefront</span> Minha Loja
            </a>
            ` : `
            <button onclick="window.openCreateStoreModal()" class="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-primary to-secondary text-white hover:brightness-110 transition-all px-5 py-2.5 rounded-full shadow-md flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1">storefront</span> Criar Minha Loja
            </button>
            `}
        </div>
      </div>

      <div id="edit-fields" class="hidden w-full max-w-lg space-y-6 mt-6 p-8 bg-white rounded-[32px] shadow-ethereal border border-primary/5">
        <div class="space-y-2 text-left">
            <label class="text-[10px] font-bold text-on-surface opacity-40 uppercase tracking-widest ml-4">Sua Bio</label>
            <textarea id="edit-bio" class="w-full bg-primary-container/20 border-none rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" rows="3">${savedBio}</textarea>
        </div>
        <div class="flex gap-4">
            <button onclick="window.saveDirectProfile()" class="flex-grow bg-primary text-white py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">Salvar Alterações</button>
            <button onclick="window.toggleProfileEdit()" class="px-8 border border-primary/20 text-on-surface-variant py-3 rounded-2xl text-xs font-bold">Cancelar</button>
        </div>
      </div>
      
      <div class="grid grid-cols-3 gap-8 md:gap-16 mt-12 bg-white px-12 py-8 rounded-[32px] shadow-ethereal border border-primary/5">
        <div class="text-center group cursor-pointer">
            <span class="font-display text-3xl text-primary block group-hover:scale-110 transition-transform">${posts.length}</span>
            <span class="text-[9px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">Publicações</span>
        </div>
        <div class="text-center group cursor-pointer">
            <span class="font-display text-3xl text-primary block group-hover:scale-110 transition-transform">${user.followers > 999 ? (user.followers / 1000).toFixed(1) + 'k' : user.followers}</span>
            <span class="text-[9px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">Seguidores</span>
        </div>
        <div class="text-center group cursor-pointer">
            <span class="font-display text-3xl text-primary block group-hover:scale-110 transition-transform">${user.following || 0}</span>
            <span class="text-[9px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">Seguindo</span>
        </div>
      </div>
    </section>

    <section class="mt-8">
      <div class="flex justify-center gap-12 mb-12 border-b border-primary/10">
        <button id="tab-posts-btn" onclick="window.switchProfileTab('posts')" class="px-8 py-6 font-bold text-xs uppercase tracking-[0.2em] text-primary border-b-2 border-primary transition-all">Minha Jornada</button>
        <button id="tab-saved-btn" onclick="window.switchProfileTab('saved')" class="px-8 py-6 font-bold text-xs uppercase tracking-[0.2em] text-on-surface-variant opacity-40 hover:opacity-100 border-b-2 border-transparent transition-all">Desejos & Salvos</button>
      </div>
      
      <div id="profile-grid-container" class="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
         ${posts.length === 0 ? `
          <div class="col-span-full py-20 text-center flex flex-col items-center gap-4">
             <div class="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary/30">
                <span class="material-symbols-outlined text-4xl">add_a_photo</span>
             </div>
             <p class="text-on-surface-variant/50 text-sm font-medium">Nenhuma publicação ainda.<br>Comece a compartilhar sua beleza!</p>
          </div>
        ` : posts.map(post => {
            const interactions = socialManager.getInteractions(post.id);
            return `
          <div onclick="window.viewPostDetail(${post.id})" class="aspect-square rounded-[32px] overflow-hidden bg-white group cursor-pointer relative shadow-ethereal hover:shadow-ethereal-hover transition-all duration-500 border border-primary/5">
            ${post.type === 'video' ? `
              <video class="w-full h-full object-cover" muted loop onmouseover="this.play()" onmouseout="this.pause()">
                <source src="${post.data}">
              </video>
            ` : `
              <img alt="Post" class="w-full h-full object-cover product-image-zoom" src="${post.data}"/>
            `}
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-6 text-center">
               <div class="flex gap-4">
                 <span class="text-white font-bold flex items-center gap-1 text-xs"><span class="material-symbols-outlined text-sm text-red-400" style="font-variation-settings: 'FILL' 1">favorite</span> ${interactions.likes.length}</span>
                 <span class="text-white font-bold flex items-center gap-1 text-xs"><span class="material-symbols-outlined text-sm text-amber-400" style="font-variation-settings: 'FILL' 1">star</span> ${interactions.stars.length}</span>
               </div>
            </div>
          </div>
        `;}).join('')}
      </div>
    </section>

    <div class="mt-20 flex justify-center">
        <a href="#/tracking" class="group flex items-center gap-4 bg-white border border-primary/10 px-10 py-5 rounded-full shadow-ethereal hover:shadow-ethereal-hover transition-all">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
            <div class="text-left">
                <p class="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">Logística de Beleza</p>
                <p class="text-sm font-bold text-on-background">RASTREAR MEUS PEDIDOS</p>
            </div>
        </a>
    </div>
  </main>

  <!-- Post Detail Modal -->
    <button onclick="window.toggleDetailModal()" class="absolute top-6 right-6 text-white/50 hover:text-white z-[120]">
      <span class="material-symbols-outlined text-4xl">close</span>
    </button>
    <div id="detail-modal-content" class="bg-white w-full max-w-6xl h-full md:h-auto md:rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
      <!-- Content injected via JS -->
    </div>
  </div>

  <!-- Floating Post Button -->
  <button onclick="window.togglePostModal()" class="fixed bottom-24 md:bottom-12 left-8 w-16 h-16 bg-gradient-to-br from-primary to-primary-container text-white rounded-[24px] flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 hover:-rotate-12 active:scale-95 transition-all z-50 group border border-white/20">
    <span class="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-500">add</span>
    <div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-on-background text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Novo Ritual</div>
  </button>

  <!-- Post Modal -->
  <div id="post-modal" class="hidden fixed inset-0 bg-primary/20 backdrop-blur-xl z-[100] items-center justify-center p-6">
    <div class="bg-white rounded-[48px] w-full max-w-md p-10 md:p-12 shadow-ethereal-hover animate-in zoom-in duration-300 border border-primary/10 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary-container"></div>
      
      <div class="flex justify-between items-center mb-10">
        <div class="space-y-1">
            <h3 class="font-display text-3xl text-on-background tracking-tighter">Manifestar <span class="italic text-primary">Beleza</span></h3>
            <p class="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-[0.2em]">Crie uma nova publicação</p>
        </div>
        <button onclick="window.togglePostModal()" class="w-10 h-10 rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center group">
          <span class="material-symbols-outlined group-hover:rotate-90 transition-transform">close</span>
        </button>
      </div>

      <form onsubmit="window.handleProfilePost(event)" class="space-y-8">
        <div class="space-y-3">
          <label class="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-[0.2em] ml-4">Categorização do Ritual</label>
          <div class="relative">
            <select id="modal-post-type" class="w-full bg-primary-container/10 border-none rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer text-on-background">
              <option value="photo">Foto (Look do dia)</option>
              <option value="video">Vídeo (Ritual/Tutorial)</option>
            </select>
            <span class="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-primary opacity-40 pointer-events-none">expand_more</span>
          </div>
        </div>

        <div class="space-y-3">
          <label class="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-[0.2em] ml-4">Manifesto / Legenda</label>
          <textarea id="modal-post-caption" class="w-full bg-primary-container/10 border-none rounded-[24px] px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-on-background" rows="3" placeholder="Escreva algo sobre este momento..."></textarea>
        </div>

        <div class="relative group">
          <input id="modal-post-file" type="file" accept="image/*,video/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required>
          <div class="border-2 border-dashed border-primary/10 rounded-[32px] p-12 text-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all flex flex-col items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-3xl">add_a_photo</span>
            </div>
            <div>
                <p class="text-xs font-bold text-on-background">Carregar Essência Visual</p>
                <p class="text-[10px] text-on-surface-variant opacity-50 mt-1 uppercase tracking-widest">Clique ou arraste seu arquivo</p>
            </div>
          </div>
        </div>

        <button type="submit" class="w-full bg-gradient-to-r from-primary to-primary-container text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-[0.98]">
          Publicar Agora
        </button>
      </form>
    </div>
  </div>`;
}

import { showToast } from '../components.js';
