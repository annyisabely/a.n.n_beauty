/**
 * Social Manager for Beleza na Web
 * Handles likes, stars, comments and automated growth mechanics
 */
export const socialManager = {
    /**
     * Get interactions for a specific post
     */
    getInteractions: (postId) => {
        const data = localStorage.getItem(`ann_interactions_${postId}`);
        if (!data) {
            return { likes: [], stars: [], comments: [] };
        }
        const interactions = JSON.parse(data);
        if (!interactions.comments) interactions.comments = [];
        return interactions;
    },

    /**
     * Toggle like for a post
     */
    toggleLike: (postId, user) => {
        if (!user) return null;
        const interactions = socialManager.getInteractions(postId);
        const index = interactions.likes.findIndex(u => u.email === user.email);
        
        if (index > -1) {
            interactions.likes.splice(index, 1);
        } else {
            interactions.likes.push({
                name: user.name,
                email: user.email,
                photo: user.photo || ''
            });
        }
        
        localStorage.setItem(`ann_interactions_${postId}`, JSON.stringify(interactions));
        return interactions;
    },

    /**
     * Toggle star (favorite) for a post
     */
    toggleStar: (postId, user) => {
        if (!user) return null;
        const interactions = socialManager.getInteractions(postId);
        const index = interactions.stars.findIndex(u => u.email === user.email);
        
        if (index > -1) {
            interactions.stars.splice(index, 1);
        } else {
            interactions.stars.push({
                name: user.name,
                email: user.email,
                photo: user.photo || ''
            });
        }
        
        localStorage.setItem(`ann_interactions_${postId}`, JSON.stringify(interactions));
        return interactions;
    },

    /**
     * Add a comment to a post
     */
    addComment: (postId, user, text) => {
        if (!user || !text) return null;
        const interactions = socialManager.getInteractions(postId);
        
        interactions.comments.push({
            user: user.name,
            text: text,
            date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        });
        
        localStorage.setItem(`ann_interactions_${postId}`, JSON.stringify(interactions));
        
        // Stop automatic messages if user says "OK"
        if (text.trim().toUpperCase() === 'OK') {
            localStorage.setItem(`ann_stop_auto_msg_${postId}`, 'true');
        }
        
        return interactions;
    },

    /**
     * Delete a comment from a post
     */
    deleteComment: (postId, commentIndex) => {
        const interactions = socialManager.getInteractions(postId);
        if (interactions.comments && interactions.comments[commentIndex]) {
            interactions.comments.splice(commentIndex, 1);
            localStorage.setItem(`ann_interactions_${postId}`, JSON.stringify(interactions));
        }
        return interactions;
    },

    /**
     * Get rating/stars for a post (max 5.9)
     */
    getRating: (postId) => {
        const rating = localStorage.getItem(`ann_rating_${postId}`);
        return rating ? parseFloat(rating) : 4.5;
    },

    /**
     * Initialize mock interactions for a new post
     */
    initMockInteractions: (postId) => {
        const mockUsers = [
            { name: 'Mariana Lima', email: 'mari@email.com' },
            { name: 'Carla Amorim', email: 'carla@email.com' },
            { name: 'Bruna Silva', email: 'bruna@email.com' },
            { name: 'Alice Martins', email: 'alice@email.com' },
            { name: 'Juliana Costa', email: 'ju@email.com' }
        ];
        
        const numLikes = Math.floor(Math.random() * 5) + 3;
        const numStars = Math.floor(Math.random() * 3) + 1;
        
        const likes = [...mockUsers].sort(() => 0.5 - Math.random()).slice(0, numLikes);
        const stars = [...mockUsers].sort(() => 0.5 - Math.random()).slice(0, numStars);
        
        const interactions = { likes, stars, comments: [
            { user: 'Mariana Lima', text: 'Arrasou no ritual! ✨', date: 'Agora' },
            { user: 'Carla Amorim', text: 'Qual produto você usou?', date: '1 min atrás' }
        ] };
        
        localStorage.setItem(`ann_interactions_${postId}`, JSON.stringify(interactions));
        localStorage.setItem(`ann_rating_${postId}`, (Math.random() * (5.5 - 4.5) + 4.5).toFixed(1));
        
        // Set initial timestamps for growth (slightly in the past so they trigger sooner for the user)
        localStorage.setItem(`ann_last_like_update_${postId}`, Date.now() - 240000); // 1 min left
        localStorage.setItem(`ann_last_rating_update_${postId}`, Date.now() - 60000);  // 1 min left
        localStorage.setItem(`ann_last_auto_comment_${postId}`, Date.now() - 30000);  // 1 min left
        
        return interactions;
    },

    /**
     * Automated growth and comments logic
     */
    runBackgroundTasks: (postId, user, onUpdate) => {
        if (!postId || !user) return;

        // Interval for checking growth (every 1 second for high frequency responsiveness)
        const intervalId = setInterval(() => {
            let changed = false;
            const now = Date.now();

            // 1. Growth for likes (every 5 mins)
            const lastLikeUpdate = parseInt(localStorage.getItem(`ann_last_like_update_${postId}`) || now);
            if (now - lastLikeUpdate >= 300000) { // 5 mins
                const mockNames = ['Helena', 'Sophia', 'Isabella', 'Manuela', 'Laura'];
                const name = mockNames[Math.floor(Math.random() * mockNames.length)];
                socialManager.toggleLike(postId, { name: name, email: `bot_${now}@ann.com` });
                localStorage.setItem(`ann_last_like_update_${postId}`, now);
                changed = true;
            }

            // 2. Growth for stars/rating (every 2 mins, max 5.9)
            const lastRatingUpdate = parseInt(localStorage.getItem(`ann_last_rating_update_${postId}`) || now);
            if (now - lastRatingUpdate >= 120000) { // 2 mins
                let currentRating = socialManager.getRating(postId);
                if (currentRating < 5.9) {
                    currentRating = Math.min(5.9, currentRating + 0.1);
                    localStorage.setItem(`ann_rating_${postId}`, currentRating.toFixed(1));
                    changed = true;
                }
                localStorage.setItem(`ann_last_rating_update_${postId}`, now);
            }

            // 3. Automated comments (every 2 seconds as requested)
            const lastAutoComment = parseInt(localStorage.getItem(`ann_last_auto_comment_${postId}`) || now);
            if (now - lastAutoComment >= 2000 && localStorage.getItem(`ann_stop_auto_msg_${postId}`) !== 'true') {
                const autoMsgs = ["Incrível! ✨", "Amei esse look!", "Poderia dizer os produtos?", "Pele radiante!", "Dica de ouro! 💖", "Você está maravilhosa!", "Que maquiagem perfeita!", "Gente, que pele é essa? 😍", "Arrasou demais!"];
                const msg = autoMsgs[Math.floor(Math.random() * autoMsgs.length)];
                
                const mockNames = ['Helena Martins', 'Sophia Castro', 'Isabella Rocha', 'Manuela Lima', 'Laura Silva', 'Alice Souza', 'Giovanna Oliveira', 'Beatriz Costa', 'Valentina Pereira', 'Maria Júlia'];
                const name = mockNames[Math.floor(Math.random() * mockNames.length)];
                
                socialManager.addComment(postId, { name: name }, msg);
                localStorage.setItem(`ann_last_auto_comment_${postId}`, now);
                changed = true;
            }

            if (changed && onUpdate) onUpdate();
        }, 10000);

        return intervalId;
    },

    /**
     * Responds to user comments based on keywords
     */
    handleUserCommentResponse: (postId, userText, onUpdate) => {
        if (localStorage.getItem(`ann_stop_auto_msg_${postId}`) === 'true') return;

        const text = userText.toLowerCase();
        let response = "";

        if (text.includes('maquiagem') || text.includes('batom') || text.includes('base') || text.includes('delineado') || text.includes('make')) {
            response = "Amamos que você gostou da maquiagem! Os tons ficaram perfeitos em você ✨";
        } else if (text.includes('skincare') || text.includes('pele') || text.includes('hidratante') || text.includes('serum') || text.includes('ritual')) {
            response = "O segredo de uma pele radiante é a constância! Continue assim 🧴✨";
        } else if (text.includes('linda') || text.includes('maravilhosa') || text.includes('amei') || text.includes('perfeita') || text.includes('top')) {
            response = "Você que é maravilhosa! Obrigado por compartilhar esse momento conosco 💖";
        } else if (text.includes('valor') || text.includes('preço') || text.includes('quanto') || text.includes('cust')) {
            response = "Você pode conferir todos os valores na nossa aba 'Shop'! Temos ofertas incríveis hoje 🛍️";
        } else if (text.includes('tutorial') || text.includes('aprender') || text.includes('como faz')) {
            response = "Temos tutoriais detalhados na nossa aba 'Learn'! Corre lá pra ver 🎥✨";
        } else {
            response = "Que comentário incrível! Continue arrasando nos seus rituais de beleza ✨";
        }

        // Add the bot response after a short delay to simulate typing
        setTimeout(() => {
            const mockUsers = [
                'Helena Martins', 'Sophia Castro', 'Isabella Rocha', 'Manuela Lima', 
                'Laura Silva', 'Alice Souza', 'Giovanna Oliveira', 'Beatriz Costa', 
                'Valentina Pereira', 'Maria Júlia'
            ];
            const randomName = mockUsers[Math.floor(Math.random() * mockUsers.length)];
            
            socialManager.addComment(postId, { name: randomName }, response);
            if (onUpdate) onUpdate();
        }, 2000);
    },

    // ==========================================
    // 1. SEGUIR LOJAS (FOLLOW STORES)
    // ==========================================
    getFollowedStores: () => {
        const user = window.auth ? window.auth.getUser() : null;
        const key = user ? `ann_followed_stores_${user.email}` : 'ann_followed_stores_guest';
        return JSON.parse(localStorage.getItem(key) || '[]');
    },

    isFollowingStore: (storeId) => {
        const followed = socialManager.getFollowedStores();
        return followed.includes(storeId);
    },

    toggleFollowStore: (storeId, storeName = 'Loja Parceira') => {
        const user = window.auth ? window.auth.getUser() : null;
        if (!user) {
            window.location.hash = '#/login';
            return { success: false, isFollowing: false, message: 'Faça login para seguir esta loja.' };
        }

        const followed = socialManager.getFollowedStores();
        const index = followed.indexOf(storeId);
        let isFollowing = false;

        if (index > -1) {
            followed.splice(index, 1);
            isFollowing = false;
        } else {
            followed.push(storeId);
            isFollowing = true;
        }

        const key = `ann_followed_stores_${user.email}`;
        localStorage.setItem(key, JSON.stringify(followed));

        // Notify listeners
        window.dispatchEvent(new CustomEvent('store-follow-changed', { detail: { storeId, isFollowing } }));

        return { 
            success: true, 
            isFollowing, 
            message: isFollowing ? `Você começou a seguir ${storeName}! ✨` : `Você deixou de seguir ${storeName}.` 
        };
    },

    getStoreFollowersCount: (storeId) => {
        const base = parseInt(localStorage.getItem(`ann_store_followers_base_${storeId}`) || '1240');
        const isFollowing = socialManager.isFollowingStore(storeId);
        return base + (isFollowing ? 1 : 0);
    },

    // ==========================================
    // 2. AVALIAR PRODUTOS (PRODUCT REVIEWS & RATINGS)
    // ==========================================
    getProductReviews: (productId) => {
        const data = localStorage.getItem(`ann_product_reviews_${productId}`);
        if (data) return JSON.parse(data);

        // Initial mock reviews
        const initialReviews = [
            {
                id: 'rev_1',
                userName: 'Camila Rodriguez',
                userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
                rating: 5,
                comment: 'Produto simplesmente maravilhoso! A textura é levíssima e fixa super bem o dia todo.',
                date: 'Há 2 dias',
                verifiedPurchase: true
            },
            {
                id: 'rev_2',
                userName: 'Beatriz Fonseca',
                userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
                rating: 5,
                comment: 'Entregou antes do prazo e a embalagem é pura elegância. Com certeza comprarei novamente!',
                date: 'Há 1 semana',
                verifiedPurchase: true
            },
            {
                id: 'rev_3',
                userName: 'Juliana Paes',
                userPhoto: '',
                rating: 4,
                comment: 'Gostei muito do acabamento matte, deixa a pele bem natural sem craquelar.',
                date: 'Há 2 semanas',
                verifiedPurchase: true
            }
        ];
        localStorage.setItem(`ann_product_reviews_${productId}`, JSON.stringify(initialReviews));
        return initialReviews;
    },

    addProductReview: (productId, rating, comment) => {
        const user = window.auth ? window.auth.getUser() : null;
        if (!user) return { success: false, message: 'Faça login para publicar sua avaliação.' };
        if (!rating || rating < 1) return { success: false, message: 'Por favor, selecione uma nota de 1 a 5 estrelas.' };

        const reviews = socialManager.getProductReviews(productId);
        const newReview = {
            id: 'rev_' + Date.now(),
            userName: user.name,
            userPhoto: user.photo || '',
            rating: parseInt(rating),
            comment: comment ? comment.trim() : 'Produto excelente!',
            date: 'Agora',
            verifiedPurchase: true
        };

        reviews.unshift(newReview);
        localStorage.setItem(`ann_product_reviews_${productId}`, JSON.stringify(reviews));

        window.dispatchEvent(new CustomEvent('product-review-added', { detail: { productId, review: newReview } }));
        return { success: true, reviews, message: 'Sua avaliação foi enviada com sucesso! ✨' };
    },

    getProductAverageRating: (productId) => {
        const reviews = socialManager.getProductReviews(productId);
        if (!reviews || reviews.length === 0) return { average: 4.9, count: 12 };
        const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        const avg = (total / reviews.length).toFixed(1);
        return { average: parseFloat(avg), count: reviews.length };
    },

    // ==========================================
    // 3. CONVERSAR COM VENDEDOR (CHAT WITH SELLER)
    // ==========================================
    getSellerChatMessages: (sellerId) => {
        const user = window.auth ? window.auth.getUser() : null;
        const key = user ? `ann_seller_chat_${sellerId}_${user.email}` : `ann_seller_chat_${sellerId}_guest`;
        const data = localStorage.getItem(key);
        if (data) return JSON.parse(data);

        // Initial welcome message from seller
        const initial = [
            {
                sender: 'seller',
                text: 'Olá! ✨ Seja muito bem-vinda(o) à nossa loja. Como posso te ajudar com os produtos de beleza hoje?',
                time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            }
        ];
        localStorage.setItem(key, JSON.stringify(initial));
        return initial;
    },

    sendSellerMessage: (sellerId, text, sellerName = 'Consultor de Beleza') => {
        const user = window.auth ? window.auth.getUser() : null;
        if (!text || !text.trim()) return null;

        const key = user ? `ann_seller_chat_${sellerId}_${user.email}` : `ann_seller_chat_${sellerId}_guest`;
        const messages = socialManager.getSellerChatMessages(sellerId);

        const userMsg = {
            sender: 'user',
            text: text.trim(),
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        messages.push(userMsg);
        localStorage.setItem(key, JSON.stringify(messages));

        // Generate automated seller response
        setTimeout(() => {
            const lower = text.toLowerCase();
            let reply = "";
            if (lower.includes('frete') || lower.includes('entrega') || lower.includes('envio')) {
                reply = "Realizamos envios para todo o Brasil com código de rastreio! Pedidos acima de R$ 150 ganham Frete Grátis 🚚✨";
            } else if (lower.includes('desconto') || lower.includes('cupom') || lower.includes('promo')) {
                reply = "Você pode usar o cupom GLOW10 para garantir 10% OFF na sua primeira compra! 💖";
            } else if (lower.includes('ingrediente') || lower.includes('vegano') || lower.includes('pele')) {
                reply = "Todos os nossos produtos são 100% veganos, dermatologicamente testados e livres de parabenos! 🌿";
            } else if (lower.includes('estoque') || lower.includes('disponivel') || lower.includes('tem')) {
                reply = "Sim! Temos estoque disponível a pronta entrega com envio imediato. 📦";
            } else {
                reply = `Obrigado por nos chamar! O consultor da ${sellerName} irá responder sua dúvida em detalhes logo em seguida. Como mais posso te auxiliar? ✨`;
            }

            messages.push({
                sender: 'seller',
                text: reply,
                time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            });
            localStorage.setItem(key, JSON.stringify(messages));
            window.dispatchEvent(new CustomEvent('seller-chat-updated', { detail: { sellerId } }));
        }, 1200);

        return messages;
    }
};

window.socialManager = socialManager;

