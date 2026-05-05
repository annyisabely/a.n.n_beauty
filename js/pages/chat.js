export default function chatPage() {
    window.handleChatMessage = (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        const chatBox = document.getElementById('chat-box');
        
        // Add User Message
        chatBox.innerHTML += `
            <div class="flex justify-end mb-4 animate-in fade-in slide-in-from-right-2">
                <div class="bg-primary text-white px-4 py-3 rounded-2xl rounded-tr-none max-w-[85%] text-sm shadow-md">
                    ${text}
                </div>
            </div>
        `;
        
        input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        // Bot typing effect
        const typingId = 'typing-' + Date.now();
        chatBox.innerHTML += `
            <div id="${typingId}" class="flex justify-start mb-4 animate-in fade-in">
                <div class="bg-surface-container-low text-on-surface px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm italic opacity-70 shadow-sm border border-purple-50">
                    Digitando...
                </div>
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;

        // Bot Response (Simulated Delay)
        setTimeout(() => {
            const typingEl = document.getElementById(typingId);
            if(typingEl) typingEl.remove();

            let response = "Desculpe, não entendi completamente. Posso te ajudar com **Dicas de Maquiagem**, **Rastreio de Pedidos** ou **Recomendações de Skincare**?";
            
            const lowerText = text.toLowerCase();
            if (lowerText.includes('pedido') || lowerText.includes('rastrear')) {
                response = "Claro! Para rastrear seu pedido, você pode acessar a seção **'Rastrear Pedidos'** diretamente no seu perfil. Quer que eu te redirecione para lá? (Responda 'sim' para ir agora).";
            } else if (lowerText.includes('sim') && (chatBox.innerHTML.includes('Rastrear Pedidos') || chatBox.innerHTML.includes('redirecione'))) {
                window.location.hash = '#/tracking';
                return; // Stop here if redirecting
            } else if (lowerText.includes('maquiagem') || lowerText.includes('produto') || lowerText.includes('comprar')) {
                response = "Nossa loja está repleta de opções incríveis de maquiagem! ✨ Você pode usar a busca inteligente (o ícone de microfone no topo) para encontrar o produto ideal rapidamente.";
            } else if (lowerText.includes('oi') || lowerText.includes('olá') || lowerText.includes('ola') || lowerText.includes('bom dia') || lowerText.includes('boa tarde')) {
                response = "Olá! Como posso deixar o seu dia mais lindo hoje? 💖";
            } else if (lowerText.includes('skincare') || lowerText.includes('pele')) {
                response = "Adoramos cuidar da pele! Temos uma seção inteira de rituais e tutoriais. Dê uma olhada no menu 'Guia de Rituais' para descobrir a rotina perfeita para o seu tipo de pele.";
            }

            chatBox.innerHTML += `
                <div class="flex justify-start mb-4 animate-in fade-in slide-in-from-left-2">
                    <div class="bg-purple-50 text-purple-900 px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm border border-purple-200 shadow-sm leading-relaxed">
                        ${response}
                    </div>
                </div>
            `;
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1200);
    };

    // On mount scroll
    setTimeout(() => {
        const box = document.getElementById('chat-box');
        if(box) box.scrollTop = box.scrollHeight;
    }, 50);

    return `
    <main class="flex-grow w-full max-w-[800px] mx-auto px-4 md:px-10 py-6 md:py-12 flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
        <header class="mb-4 flex items-center justify-between border-b border-purple-100 pb-4 bg-white/50 backdrop-blur-md rounded-2xl px-4 shadow-sm">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-md">
                    <span class="material-symbols-outlined text-[24px]">smart_toy</span>
                </div>
                <div>
                    <h1 class="font-display text-2xl text-on-surface">Assistente A.n.n</h1>
                    <p class="text-xs text-green-500 font-bold flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online agora
                    </p>
                </div>
            </div>
            <a href="#/profile" class="text-outline hover:text-primary transition-colors bg-purple-50 p-2 rounded-full">
                <span class="material-symbols-outlined text-[24px]">close</span>
            </a>
        </header>
        
        <div id="chat-box" class="flex-grow overflow-y-auto bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-50 flex flex-col shadow-inner mb-4">
            <div class="flex justify-start mb-4">
                <div class="bg-purple-50 text-purple-900 px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm border border-purple-200 shadow-sm leading-relaxed">
                    Olá! Eu sou a assistente inteligente da A.n.n Beauty ✨ Como posso deixar seu dia mais bonito hoje?
                </div>
            </div>
        </div>

        <form onsubmit="window.handleChatMessage(event)" class="flex gap-3">
            <input id="chat-input" type="text" placeholder="Escreva sua mensagem aqui..." class="flex-grow bg-white border border-purple-100 rounded-full px-6 py-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-lg" autocomplete="off" required>
            <button type="submit" class="bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg flex-shrink-0 active:scale-95">
                <span class="material-symbols-outlined">send</span>
            </button>
        </form>
    </main>`;
}
