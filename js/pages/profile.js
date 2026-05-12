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
          <div class="col-span-full py-20 text-center flex flex-col items-center gap-4">
             <div class="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-primary/30">
                <span class="material-symbols-outlined text-4xl">${type === 'posts' ? 'add_a_photo' : 'bookmark_border'}</span>
             </div>
             <p class="text-outline text-sm">${type === 'posts' ? 'Você ainda não tem publicações.<br>Clique no "+" para começar sua jornada!' : 'Você ainda não salvou nenhuma publicação.'}</p>
          </div>
        `;
        return;
    }
    
    grid.innerHTML = items.map(item => {
      const interactions = socialManager.getInteractions(item.id);
      const rating = socialManager.getRating(item.id);
      
      // Handle different types of content in the grid
      const isProduct = item.contentType === 'product' || item.price;
      const isVideo = item.contentType === 'video' || item.type === 'video';
      const imageUrl = isProduct ? (item.img.startsWith('http') ? item.img : `https://lh3.googleusercontent.com/aida-public/${item.img}`) : item.data;

      return `
      <div onclick="${isProduct ? `window.location.hash = '#/search'` : `window.viewPostDetail(${item.id})`}" class="aspect-square rounded-2xl overflow-hidden bg-purple-50 group cursor-pointer relative shadow-sm hover:shadow-xl transition-all duration-500">
        ${isVideo ? `
          <video class="w-full h-full object-cover" ${type === 'posts' ? 'muted loop onmouseover="this.play()" onmouseout="this.pause()"' : 'controls'}>
            <source src="${item.data || imageUrl}">
          </video>
        ` : `
          <img alt="Item" class="w-full h-full object-cover product-image-zoom" src="${imageUrl}"/>
        `}
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
           ${isProduct ? `
             <div class="text-white">
                <p class="font-bold text-xs mb-1">${item.name}</p>
                <p class="text-[10px] opacity-80">${item.price}</p>
             </div>
           ` : `
             <div class="flex gap-4">
               <span class="text-white font-bold flex items-center gap-1 text-xs"><span class="material-symbols-outlined text-sm text-red-400" style="font-variation-settings: 'FILL' 1">favorite</span> ${interactions.likes.length}</span>
               <span class="text-white font-bold flex items-center gap-1 text-xs"><span class="material-symbols-outlined text-sm text-amber-400" style="font-variation-settings: 'FILL' 1">grade</span> ${rating}</span>
             </div>
           `}
        </div>
        ${isProduct ? `<div class="absolute top-2 right-2 bg-primary text-white p-1 rounded-full"><span class="material-symbols-outlined text-[14px]">shopping_bag</span></div>` : ''}
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
  <main class="flex-grow max-w-[1280px] mx-auto px-4 md:px-10 py-12 w-full">
    <section class="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
      <div class="relative mb-8 group">
        <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-50 shadow-2xl transition-transform duration-500 group-hover:scale-105">
          <img alt="Avatar" id="profile-avatar" class="w-full h-full object-cover" src="${savedPhoto}"/>
        </div>
        <label class="absolute bottom-1 right-1 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-container transition-all active:scale-90 border-2 border-white cursor-pointer">
          <span class="material-symbols-outlined text-[20px]">photo_camera</span>
          <input type="file" class="hidden" accept="image/*" onchange="window.handleProfilePhotoUpload(this)">
        </label>
      </div>
      
      <div id="profile-info">
        <h1 class="font-display text-4xl text-on-surface mb-2">${user.name}</h1>
        <p class="font-body-md text-on-surface-variant mb-8 italic">${savedBio}</p>
        <button onclick="window.toggleProfileEdit()" class="text-xs text-primary hover:underline mb-4">Editar Bio</button>
      </div>

      <div id="edit-fields" class="hidden w-full max-w-md space-y-4 mb-8">
        <textarea id="edit-bio" class="w-full bg-surface-container-low border border-surface-variant rounded-2xl px-6 py-4 text-sm outline-none focus:border-primary" rows="3">${savedBio}</textarea>
        <div class="flex gap-4 justify-center">
            <button onclick="window.saveDirectProfile()" class="bg-primary text-white px-8 py-2 rounded-full text-sm font-bold">Salvar</button>
            <button onclick="window.toggleProfileEdit()" class="border border-outline text-outline px-8 py-2 rounded-full text-sm">Cancelar</button>
        </div>
      </div>
      
      <div class="flex gap-12 mb-10">
        <div class="text-center"><span class="font-display text-2xl text-primary block">${posts.length}</span><span class="font-label-xs text-outline uppercase tracking-tighter">Publicações</span></div>
        <div class="text-center"><span class="font-display text-2xl text-primary block">${user.followers > 999 ? (user.followers / 1000).toFixed(1) + 'k' : user.followers}</span><span class="font-label-xs text-outline uppercase tracking-tighter">Seguidores</span></div>
        <div class="text-center"><span class="font-display text-2xl text-primary block">${user.following || 0}</span><span class="font-label-xs text-outline uppercase tracking-tighter">Seguindo</span></div>
      </div>
      
      <div class="flex gap-4">
        <a href="#/tracking" class="px-8 py-3 border-2 border-primary text-primary font-label-md rounded-full hover:bg-purple-50 transition-all flex items-center gap-2">
          Rastrear Pedidos <span class="material-symbols-outlined text-sm">local_shipping</span>
        </a>
      </div>
    </section>

    <section>
      <div class="flex justify-center gap-8 mb-10 border-b border-purple-50">
        <button id="tab-posts-btn" onclick="window.switchProfileTab('posts')" class="px-8 py-4 font-label-md text-primary border-b-2 border-primary transition-all">Postagens</button>
        <button id="tab-saved-btn" onclick="window.switchProfileTab('saved')" class="px-8 py-4 font-label-md text-on-surface-variant hover:text-primary transition-colors border-b-2 border-transparent transition-all">Salvos</button>
      </div>
      
      <div id="profile-grid-container" class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        ${posts.length === 0 ? `
          <div class="col-span-full py-20 text-center flex flex-col items-center gap-4">
             <div class="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-primary/30">
                <span class="material-symbols-outlined text-4xl">add_a_photo</span>
             </div>
             <p class="text-outline text-sm">Você ainda não tem publicações.<br>Clique no "+" para começar sua jornada!</p>
          </div>
        ` : posts.map(post => {
            const interactions = socialManager.getInteractions(post.id);
            return `
          <div onclick="window.viewPostDetail(${post.id})" class="aspect-square rounded-2xl overflow-hidden bg-purple-50 group cursor-pointer relative shadow-sm hover:shadow-xl transition-all duration-500">
            ${post.type === 'video' ? `
              <video class="w-full h-full object-cover" muted loop onmouseover="this.play()" onmouseout="this.pause()">
                <source src="${post.data}">
              </video>
            ` : `
              <img alt="Post" class="w-full h-full object-cover product-image-zoom" src="${post.data}"/>
            `}
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
               <div class="flex gap-4">
                 <span class="text-white font-bold flex items-center gap-1 text-xs"><span class="material-symbols-outlined text-sm text-red-400" style="font-variation-settings: 'FILL' 1">favorite</span> ${interactions.likes.length}</span>
                 <span class="text-white font-bold flex items-center gap-1 text-xs"><span class="material-symbols-outlined text-sm text-amber-400" style="font-variation-settings: 'FILL' 1">star</span> ${interactions.stars.length}</span>
               </div>
            </div>
          </div>
        `;}).join('')}
      </div>
    </section>
    </section>
  </main>

  <!-- Post Detail Modal -->
  <div id="post-detail-modal" class="hidden fixed inset-0 bg-black/90 backdrop-blur-md z-[110] items-center justify-center p-0 md:p-10">
    <button onclick="window.toggleDetailModal()" class="absolute top-6 right-6 text-white/50 hover:text-white z-[120]">
      <span class="material-symbols-outlined text-4xl">close</span>
    </button>
    <div id="detail-modal-content" class="bg-white w-full max-w-6xl h-full md:h-auto md:rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
      <!-- Content injected via JS -->
    </div>
  </div>

  <!-- Floating Post Button -->
  <button onclick="window.togglePostModal()" class="fixed bottom-24 md:bottom-10 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50">
    <span class="material-symbols-outlined text-3xl">add</span>
  </button>

  <!-- Post Modal -->
  <div id="post-modal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-300">
      <div class="flex justify-between items-center mb-6">
        <h3 class="font-display text-2xl text-on-surface">Nova Publicação</h3>
        <button onclick="window.togglePostModal()" class="text-outline hover:text-on-surface transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form onsubmit="window.handleProfilePost(event)" class="space-y-6">
        <div class="space-y-2">
          <label class="text-[10px] text-outline uppercase tracking-widest font-bold ml-2">O que você quer postar?</label>
          <select id="modal-post-type" class="w-full bg-surface-container-low border border-surface-variant rounded-full px-6 py-3 text-sm outline-none focus:border-primary">
            <option value="photo">Foto (Look do dia)</option>
            <option value="video">Vídeo (Ritual/Tutorial)</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] text-outline uppercase tracking-widest font-bold ml-2">Legenda</label>
          <textarea id="modal-post-caption" class="w-full bg-surface-container-low border border-surface-variant rounded-2xl px-6 py-3 text-sm outline-none focus:border-primary" rows="3" placeholder="Escreva algo sobre este momento..."></textarea>
        </div>

        <div class="relative group">
          <input id="modal-post-file" type="file" accept="image/*,video/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required>
          <div class="border-2 border-dashed border-purple-100 rounded-2xl p-10 text-center group-hover:border-primary transition-colors">
            <span class="material-symbols-outlined text-4xl text-purple-200 mb-2">upload_file</span>
            <p class="text-outline text-xs">Clique para selecionar do aparelho</p>
          </div>
        </div>

        <button type="submit" class="w-full bg-primary text-white py-4 rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all">
          Publicar Agora
        </button>
      </form>
    </div>
  </div>`;
}

import { showToast } from '../components.js';
