// ============================================
// GlowAI — Assistente de Beleza Beleza na Web
// ============================================

import { dataManager } from './data_manager.js';

const GLOWAI_STORAGE_KEY = 'glowai_history';
const GLOWAI_SKIN_KEY    = 'glowai_skin_type';
const OPENAI_MODEL       = 'MiniMax M2.5 Free';
// Proxy route — avoids CORS when served via proxy.js
const OPENAI_BASE_URL    = '/api/chat';
// Default key — can be overridden via the 🔑 button in the widget
const DEFAULT_API_KEY    = 'sk-kVRHUqP1ScAAXEYCFWnYblivjFfjqCRaGfNIoYrzt1OvZgo9XtzKSfyigOcyo12a';

// ── Injetar CSS do GlowAI automaticamente (Garante que nunca fique desconfigurado) ──
function injectGlowAIStyles() {
    if (document.getElementById('glowai-injected-styles')) return;

    const style = document.createElement('style');
    style.id = 'glowai-injected-styles';
    style.textContent = `
    /* ============================================
       GlowAI — Widget Styles Auto-Injected
       ============================================ */
    :root {
        --gai-primary:     #8B5FBF;
        --gai-primary-dk:  #6B3FA0;
        --gai-primary-lt:  #E8D8F4;
        --gai-bg:          #FFFFFF;
        --gai-bg2:         #F8F4FB;
        --gai-border:      rgba(139,95,191,0.18);
        --gai-shadow:      0 16px 50px -10px rgba(107,63,160,0.38);
        --gai-radius:      20px;
        --gai-panel-w:     380px;
        --gai-panel-h:     580px;
        --gai-fab-size:    56px;
        --gai-z:           99999;
    }

    /* Container Raiz */
    #glowai-root {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: var(--gai-z);
        font-family: 'Poppins', 'Inter', -apple-system, sans-serif;
        pointer-events: none;
    }

    /* Botão Flutuante (FAB) */
    #glowai-fab {
        pointer-events: auto;
        position: relative;
        width: var(--gai-fab-size);
        height: var(--gai-fab-size);
        border-radius: 50%;
        background: linear-gradient(135deg, #8B5FBF 0%, #6B3FA0 100%);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 24px rgba(107,63,160,0.42), 0 2px 8px rgba(0,0,0,0.08);
        transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
        outline: none;
        user-select: none;
    }
    #glowai-fab:hover {
        transform: scale(1.08) translateY(-2px);
        box-shadow: 0 12px 32px rgba(107,63,160,0.52);
    }
    #glowai-fab:active {
        transform: scale(0.95);
    }
    #glowai-fab.glowai-fab--open {
        background: linear-gradient(135deg, #5A3388, #4A2870);
    }
    #glowai-fab.glowai-fab--open .glowai-fab-icon {
        transform: rotate(90deg);
    }
    .glowai-fab-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.25s ease;
    }

    /* Pulso suave */
    .glowai-fab-pulse {
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        border: 2px solid rgba(139,95,191,0.45);
        animation: gai-pulse 2.5s infinite;
        pointer-events: none;
    }
    @keyframes gai-pulse {
        0%   { transform: scale(1); opacity: 0.8; }
        50%  { transform: scale(1.22); opacity: 0; }
        100% { transform: scale(1.22); opacity: 0; }
    }

    /* Badge de Notificação */
    .glowai-fab-badge {
        position: absolute;
        top: -2px;
        right: -2px;
        background: #8B5FBF;
        color: white;
        font-size: 11px;
        font-weight: 700;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #FFFFFF;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        animation: gai-bounce 2s infinite;
    }
    @keyframes gai-bounce {
        0%,100% { transform: translateY(0); }
        50%     { transform: translateY(-3px); }
    }

    /* Painel do Chat */
    #glowai-panel {
        pointer-events: none;
        position: absolute;
        bottom: calc(var(--gai-fab-size) + 14px);
        right: 0;
        width: var(--gai-panel-w);
        max-width: calc(100vw - 32px);
        height: var(--gai-panel-h);
        max-height: calc(100vh - 120px);
        background: var(--gai-bg);
        border-radius: var(--gai-radius);
        box-shadow: var(--gai-shadow);
        border: 1px solid var(--gai-border);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px) scale(0.95);
        transform-origin: bottom right;
        transition: opacity 0.25s cubic-bezier(0.4,0,0.2,1),
                    transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
                    visibility 0.25s;
        will-change: transform, opacity;
    }
    #glowai-panel.glowai-panel--open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
        pointer-events: auto;
    }

    /* Cabeçalho */
    .glowai-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        background: linear-gradient(135deg, #5A3388 0%, #8B5FBF 60%, #C4A8E0 100%);
        flex-shrink: 0;
        user-select: none;
    }
    .glowai-header-left {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .glowai-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid rgba(255,255,255,0.4);
        flex-shrink: 0;
    }
    .glowai-header-title {
        font-size: 15px;
        font-weight: 700;
        color: #fff;
        letter-spacing: 0.02em;
        font-family: 'Poppins', sans-serif;
    }
    .glowai-header-sub {
        font-size: 11px;
        color: rgba(255,255,255,0.9);
        display: flex;
        align-items: center;
        gap: 5px;
        margin-top: 1px;
    }
    .glowai-online-dot {
        width: 7px;
        height: 7px;
        background: #22c55e;
        border-radius: 50%;
        display: inline-block;
        animation: gai-blink 2s infinite;
        flex-shrink: 0;
    }
    @keyframes gai-blink {
        0%,100% { opacity: 1; }
        50%     { opacity: 0.4; }
    }
    .glowai-header-actions {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .glowai-icon-btn {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: none;
        background: rgba(255,255,255,0.18);
        color: rgba(255,255,255,0.95);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, transform 0.15s;
    }
    .glowai-icon-btn:hover {
        background: rgba(255,255,255,0.32);
        transform: scale(1.05);
    }
    .glowai-icon-btn:active {
        transform: scale(0.92);
    }

    /* Chips Rápidos */
    .glowai-chips {
        display: flex;
        gap: 6px;
        padding: 10px 12px;
        overflow-x: auto;
        flex-shrink: 0;
        background: var(--gai-bg2);
        border-bottom: 1px solid var(--gai-border);
        scrollbar-width: none;
    }
    .glowai-chips::-webkit-scrollbar { display: none; }
    .glowai-chip {
        flex-shrink: 0;
        font-size: 11.5px;
        font-weight: 600;
        color: var(--gai-primary-dk);
        background: #FFFFFF;
        border: 1.5px solid rgba(139,95,191,0.25);
        border-radius: 999px;
        padding: 5px 12px;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
        font-family: 'Inter', sans-serif;
    }
    .glowai-chip:hover {
        background: var(--gai-primary);
        color: white;
        border-color: var(--gai-primary);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(107,63,160,0.25);
    }

    /* Área de Mensagens */
    .glowai-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        scroll-behavior: smooth;
        background: #FFFFFF;
    }
    .glowai-messages::-webkit-scrollbar { width: 5px; }
    .glowai-messages::-webkit-scrollbar-thumb {
        background: rgba(139,95,191,0.22);
        border-radius: 10px;
    }

    /* Linhas de Mensagem */
    .glowai-msg-wrap {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        max-width: 100%;
    }
    .glowai-msg-wrap--user {
        flex-direction: row-reverse;
    }
    .glowai-msg-animate {
        animation: gai-fadein 0.25s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes gai-fadein {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .glowai-msg-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--gai-primary-lt);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-bottom: 2px;
    }

    /* Balões */
    .glowai-bubble {
        max-width: 82%;
        font-size: 13.5px;
        line-height: 1.55;
        padding: 10px 14px;
        border-radius: 16px;
        word-break: break-word;
        font-family: 'Inter', sans-serif;
    }
    .glowai-bubble--ai {
        background: var(--gai-bg2);
        color: #1E1228;
        border-bottom-left-radius: 4px;
        border: 1px solid var(--gai-border);
    }
    .glowai-bubble--user {
        background: linear-gradient(135deg, #8B5FBF, #6B3FA0);
        color: #FFFFFF;
        border-bottom-right-radius: 4px;
        font-weight: 500;
    }

    .glowai-p { margin: 0 0 6px; }
    .glowai-p:last-child { margin: 0; }
    .glowai-ol, .glowai-ul {
        margin: 6px 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .glowai-list-item {
        display: flex;
        gap: 8px;
        align-items: flex-start;
    }
    .glowai-list-num {
        font-size: 11px;
        font-weight: 800;
        color: var(--gai-primary);
        background: var(--gai-primary-lt);
        min-width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 1px;
    }
    .glowai-bullet-item {
        display: flex;
        gap: 6px;
        align-items: flex-start;
    }
    .glowai-bullet-item::before {
        content: '✦';
        color: var(--gai-primary);
        font-size: 9px;
        flex-shrink: 0;
        margin-top: 3px;
    }

    /* Mensagem do Sistema */
    .glowai-system-msg {
        align-self: center;
        background: #E8D8F4;
        border: 1px solid #DDD0E8;
        color: #5C4D6B;
        font-size: 12px;
        border-radius: 999px;
        padding: 6px 14px;
        max-width: 92%;
        text-align: center;
        animation: gai-fadein 0.25s ease;
    }

    /* Digitando... */
    .glowai-typing-bubble {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 12px 16px;
        min-width: 56px;
    }
    .glowai-typing-bubble span {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--gai-primary);
        display: block;
        animation: gai-dot 1.2s infinite;
        opacity: 0.4;
    }
    .glowai-typing-bubble span:nth-child(2) { animation-delay: 0.2s; }
    .glowai-typing-bubble span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes gai-dot {
        0%,80%,100% { transform: scale(0.7); opacity: 0.35; }
        40%          { transform: scale(1.1); opacity: 1; }
    }

    /* API Key Banner */
    .glowai-key-banner {
        padding: 12px 14px;
        background: #F8F4FB;
        border-top: 1px solid var(--gai-border);
        font-size: 12.5px;
        color: #5C4D6B;
        flex-shrink: 0;
    }
    .glowai-key-banner p { margin: 0 0 8px; line-height: 1.4; }
    .glowai-key-row { display: flex; gap: 8px; }
    .glowai-key-row input {
        flex: 1;
        border: 1.5px solid rgba(139,95,191,0.25);
        border-radius: 999px;
        padding: 7px 12px;
        font-size: 12px;
        outline: none;
        font-family: 'Inter', sans-serif;
        color: #1E1228;
        background: #FFFFFF;
        transition: border-color 0.2s;
    }
    .glowai-key-row input:focus { border-color: var(--gai-primary); }
    .glowai-key-row button {
        background: var(--gai-primary);
        color: white;
        border: none;
        border-radius: 999px;
        padding: 7px 16px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        transition: background 0.2s;
    }
    .glowai-key-row button:hover { background: var(--gai-primary-dk); }

    /* Área de Input */
    .glowai-input-wrap {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        padding: 10px 12px;
        border-top: 1px solid var(--gai-border);
        background: #FFFFFF;
        flex-shrink: 0;
    }
    #glowai-input {
        flex: 1;
        border: 1.5px solid rgba(139,95,191,0.25);
        border-radius: 14px;
        padding: 9px 14px;
        font-size: 13px;
        font-family: 'Inter', sans-serif;
        color: #1E1228;
        resize: none;
        outline: none;
        line-height: 1.5;
        transition: border-color 0.2s, box-shadow 0.2s;
        background: #F8F4FB;
        max-height: 120px;
        overflow-y: auto;
    }
    #glowai-input:focus {
        border-color: var(--gai-primary);
        box-shadow: 0 0 0 3px rgba(139,95,191,0.12);
        background: #FFFFFF;
    }
    #glowai-input::placeholder { color: #8B5FBF; opacity: 0.7; }
    #glowai-send {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: linear-gradient(135deg, #8B5FBF, #6B3FA0);
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 4px 14px rgba(107,63,160,0.36);
    }
    #glowai-send:hover {
        transform: scale(1.08);
        box-shadow: 0 6px 20px rgba(107,63,160,0.48);
    }
    #glowai-send:active { transform: scale(0.92); }

    /* Rodapé da Marca */
    .glowai-branding {
        text-align: center;
        font-size: 10px;
        color: #8B5FBF;
        padding: 5px 0 7px;
        letter-spacing: 0.03em;
        background: #FFFFFF;
        flex-shrink: 0;
        user-select: none;
    }

    /* Responsividade Mobile: Painel Otimizado */
    @media (max-width: 640px) {
        #glowai-root {
            bottom: 84px;
            right: 16px;
        }
        #glowai-panel {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100vw;
            max-width: 100vw;
            height: 82vh;
            max-height: 82vh;
            border-radius: 20px 20px 0 0;
            transform-origin: bottom center;
            border-bottom: none;
        }
        #glowai-fab {
            width: 50px;
            height: 50px;
        }
    }
    `;
    document.head.appendChild(style);
}

// ── Build catalog summary for the system prompt ──────────────────────────────
function buildCatalogSummary() {
    try {
        const products = dataManager.generateProducts(50);
        return products.slice(0, 20).map(p =>
            `• **${p.name}** [${p.code}] (${p.cat}) — R$ ${p.price}${p.badge ? ' (' + p.badge + ')' : ''}: ${p.desc}`
        ).join('\n');
    } catch {
        return '';
    }
}

// ── System Prompt ─────────────────────────────────────────────────────────────
function buildSystemPrompt() {
    const catalog = buildCatalogSummary();
    const offers  = 'Frete grátis em compras acima de R$150 • Parcelamento em até 6x sem juros • Troca em até 30 dias • Brinde exclusivo em compras acima de R$300';

    return `Você é GlowAI, a Consultora de Beleza Digital da Beleza na Web.
Sua missão é transformar a experiência de compra em um ritual de autocuidado, oferecendo consultoria personalizada de alto padrão.

PERSONALIDADE:
- Sofisticada, acolhedora e conhecedora de tendências de beleza.
- Tom empático de "melhor amiga especialista".
- Valorize a individualidade de cada cliente.

CATÁLOGO DE PRODUTOS DISPONÍVEIS:
${catalog}

POLÍTICAS E OFERTAS:
${offers}

DIRETRIZES DE RESPOSTA:
1. IDIOMA: Português do Brasil (PT-BR).
2. CONSULTORIA: Antes de recomendar skincare, pergunte o tipo de pele (Seca, Oleosa, Mista ou Sensível).
3. CURADORIA: Recomende no máximo 3 produtos por vez. Use **negrito** para o nome dos produtos.
4. LINKS/CÓDIGOS: Sempre mencione o código do produto (ex: [ANN-001]).
5. CALL TO ACTION: Termine com uma pergunta gentil ou um convite para ver o produto na loja.
6. ESTILO: Máximo 3 parágrafos curtos. Emojis sutis (✨, 💄, 🧴).`;
}

// ── localStorage helpers ──────────────────────────────────────────────────────
function loadHistory() {
    try {
        const raw = localStorage.getItem(GLOWAI_STORAGE_KEY);
        if (!raw) return [];
        let history = JSON.parse(raw) || [];
        // Migra automaticamente qualquer mensagem antiga que ainda exiba "GlowAI" ou "A.n.n Beauty"
        let changed = false;
        history = history.map(item => {
            if (item && typeof item.content === 'string') {
                if (item.content.includes('GlowAI') || item.content.includes('A.n.n Beauty') || item.content.includes('A.n.n')) {
                    changed = true;
                    item.content = item.content
                        .replace(/Sou a GlowAI, sua consultora de beleza da A\.n\.n Beauty/gi, 'Sou a consultora virtual da **Beleza na Web**')
                        .replace(/GlowAI/gi, 'Beleza na Web')
                        .replace(/A\.n\.n\s*Beauty/gi, 'Beleza na Web')
                        .replace(/A\.n\.n/gi, 'Beleza na Web');
                }
            }
            return item;
        });
        if (changed) {
            saveHistory(history);
        }
        return history;
    }
    catch { return []; }
}
function saveHistory(history) {
    const trimmed = history.slice(-40);
    localStorage.setItem(GLOWAI_STORAGE_KEY, JSON.stringify(trimmed));
}
function clearHistory() {
    localStorage.removeItem(GLOWAI_STORAGE_KEY);
    localStorage.removeItem(GLOWAI_SKIN_KEY);
}

// ── Markdown-lite renderer ────────────────────────────────────────────────────
function renderMarkdown(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/^(\d+)[.)]\s+(.+)$/gm, '<li class="glowai-list-item"><span class="glowai-list-num">$1</span>$2</li>')
        .replace(/^[•\-]\s+(.+)$/gm, '<li class="glowai-bullet-item">$1</li>')
        .replace(/(<li class="glowai-list-item">[\s\S]*?<\/li>)+/g, m => `<ol class="glowai-ol">${m}</ol>`)
        .replace(/(<li class="glowai-bullet-item">[\s\S]*?<\/li>)+/g, m => `<ul class="glowai-ul">${m}</ul>`)
        .replace(/\n\n/g, '</p><p class="glowai-p">')
        .replace(/\n/g, '<br>');
}

// ── Consultora de Beleza Offline (Inteligência Rica Local) ───────────────────
function offlineReply(userMsg) {
    const raw = userMsg || '';
    const msg = raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 1. Pele Oleosa / Acne / Cravos / Espinhas
    if (msg.includes('oleos') || msg.includes('acne') || msg.includes('espinha') || msg.includes('cravo') || msg.includes('poro')) {
        return `Para controlar o brilho e a oleosidade, o segredo é equilíbrio:\n\n• **Limpeza com Gel Suave**: remove a oleosidade sem ressecar\n• **Sérum de Niacinamida ou Ácido Salicílico**: desobstrui poros e uniformiza\n• **Hidratante em Gel**: textura leve e toque seco\n• **Protetor Solar Oil-Free**: proteção sem pesar\n\n✨ Dica Beleza na Web: Nunca deixe de hidratar a pele oleosa, senão ocorre efeito rebote!\n\nQuer ver os produtos ideais para pele oleosa no catálogo? 💜`;
    }

    // 2. Pele Seca / Ressecamento / Descamação
    if (msg.includes('pele seca') || msg.includes('ressecad') || msg.includes('repuxa') || msg.includes('descama')) {
        return `Para pele seca, o foco é hidratação profunda e restauração da barreira:\n\n• **Loção de Limpeza Cremosa**: higieniza preservando a hidratação natural\n• **Sérum de Ácido Hialurônico**: retém a água nas camadas da pele\n• **Creme Hidratante Nutritivo**: rico em ceramidas e óleos vegetais\n\n✨ Dica Beleza na Web: Aplique o hidratante logo após o banho com a pele ainda úmida!\n\nPosso te indicar opções nutritivas do nosso catálogo? 🧴`;
    }

    // 3. Pele Mista / Zona T
    if (msg.includes('pele mista') || msg.includes('zona t')) {
        return `A pele mista precisa de cuidado sob medida:\n\n• **Zona T (testa, nariz e queixo)**: precisa de controle de oleosidade e poros\n• **Bochechas**: necessitam de hidratação mais confortável\n• **Hidratante Fluido**: equilíbrio perfeito para todo o rosto\n\n✨ Dica Beleza na Web: A técnica de skincare multizona permite usar produtos específicos onde você mais precisa!\n\nQuer sugestões de hidratantes leves para pele mista? ✨`;
    }

    // 4. Pele Sensível / Vermelhidão / Rosácea
    if (msg.includes('sensivel') || msg.includes('sensibilidade') || msg.includes('vermelhid') || msg.includes('alergia') || msg.includes('rosacea')) {
        return `Para pele sensível, a regra de ouro é suavidade e fórmulas minimalistas:\n\n• **Produtos sem fragrância e sem álcool etílico**\n• **Ativos calmantes**: Centella Asiática, Camomila e Pantenol\n• **Filtro Solar Físico/Mineral**: menor risco de irritação\n\n✨ Dica Beleza na Web: Sempre faça um teste no antebraço antes de aplicar novos produtos no rosto!\n\nQuer que eu selecione fórmulas hipoalergênicas para você? 🌿`;
    }

    // 5. Skincare e Rotinas Gerais
    if (msg.includes('skincare') || msg.includes('rotina') || msg.includes('ritual') || msg.includes('passo a passo') || msg.includes('ordem')) {
        return `Aqui está a ordem ideal para sua rotina diária de skincare! ✨\n\n**De Manhã:**\n1. Limpeza suave\n2. Sérum de tratamento (ex: Vitamina C ou Hialurônico)\n3. Hidratante facial\n4. Protetor Solar (essencial!)\n\n**À Noite:**\n1. Demaquilante ou limpeza dupla\n2. Gel ou espuma de limpeza\n3. Tratamento noturno (ex: Retinol ou Ácidos)\n4. Hidratação reparadora\n\nQual é o seu tipo de pele para eu personalizar para você? 💜`;
    }

    // 6. Anti-idade / Rugas / Retinol / Colágeno / Manchas
    if (msg.includes('ruga') || msg.includes('anti-idade') || msg.includes('retinol') || msg.includes('colageno') || msg.includes('mancha') || msg.includes('linhas finas') || msg.includes('vitamina c')) {
        return `Para firmeza, luminosidade e uniformização do tom da pele:\n\n• **Vitamina C Pura**: poderoso antioxidante para iluminar e combater manchas\n• **Ácido Hialurônico**: preenchimento e hidratação das linhas finas\n• **Retinol Noturno**: acelera a renovação celular e estimula colágeno\n• **Proteção Solar Diária**: previne 80% do envelhecimento precoce\n\n✨ Dica Beleza na Web: Comece o retinol 2 a 3 vezes por semana para a pele se acostumar!\n\nQuer ver nossos séruns rejuvenescedores da loja? 🌟`;
    }

    // 7. Protetor Solar / Proteção Solar
    if (msg.includes('protetor') || msg.includes('fps') || msg.includes('solar') || msg.includes('filtro')) {
        return `O protetor solar é o cosmético mais importante da sua vida! ☀️\n\n• Use no mínimo **FPS 30** no dia a dia e **FPS 50+** para exposição direta\n• Quantidade correta: a regra dos **3 dedos** para rosto e pescoço\n• Reaplique a cada 2 a 3 horas se estiver ao ar livre\n\n✨ Dica Beleza na Web: Se usa maquiagem, use pó compacto com FPS para reaplicar facilmente!\n\nTemos protetores com toque seco e acabamento matte. Quer dar uma olhada? 🧴`;
    }

    // 8. Maquiagem / Delineado / Batom / Base / Corretivo / Olhos
    if (msg.includes('maquiagem') || msg.includes('make') || msg.includes('delinead') || msg.includes('batom') || msg.includes('base') || msg.includes('corretivo') || msg.includes('rimel') || msg.includes('sombra') || msg.includes('blush')) {
        if (msg.includes('delinead') || msg.includes('gatinho')) {
            return `O delineado gatinho perfeito exige técnica simples! ✨\n\n1. Olhe reto no espelho com os olhos relaxados\n2. Faça um traço partindo do canto externo em direção ao final da sobrancelha\n3. Do topo desse traço, puxe uma linha até o meio da pálpebra formando um triângulo\n4. Preencha o interior com carinho!\n\n✨ Dica Beleza na Web: Delineador em caneta com ponta ultrafina é o mais fácil de manusear!\n\nQuer ver nossas canetas delineadoras na loja? 💄`;
        }
        return `Amo falar de maquiagem! 💄\n\n**Segredos para uma make impecável e duradoura:**\n\n• **Pele preparada**: hidratante + primer garantem acabamento profissional\n• **Base no tom certo**: teste na mandíbula para conferir a cor exata\n• **Corretivo pontual**: aplique só onde precisa para um visual natural\n• **Fixador de make**: bruma fixadora no final garante durabilidade de até 16h\n\nProcura algum produto específico como batom, base ou sombras? 🌟`;
    }

    // 9. Cabelo / Cuidados Capilares / Cronograma
    if (msg.includes('cabelo') || msg.includes('shampoo') || msg.includes('condicionador') || msg.includes('mascara') || msg.includes('frizz') || msg.includes('capilar')) {
        return `O cronograma capilar devolve vida e movimento aos fios! 💜\n\n• **Hidratação**: repõe água (babosa, d-pantenol, glicerina)\n• **Nutrição**: repõe lipídios e combate o frizz (óleos vegetais, manteigas)\n• **Reconstrução**: repõe massa e proteínas (queratina, aminoácidos)\n\n✨ Dica Beleza na Web: Use sempre protetor térmico antes de secador ou prancha!\n\nQual é a necessidade principal do seu cabelo hoje (seco, com frizz, tingido)? 🧴`;
    }

    // 10. Perfumes e Fragrâncias
    if (msg.includes('perfume') || msg.includes('fragrancia') || msg.includes('cheiro') || msg.includes('colonia')) {
        return `Fragrâncias são a nossa assinatura invisível! ✨\n\n• **Florais**: românticos, delicados e femininos\n• **Orientais / Baunilha**: envolventes, doces e marcantes\n• **Cítricos / Frescos**: perfeitos para o dia a dia e clima quente\n• **Amadeirados**: elegantes, sofisticados e com alta fixação\n\n✨ Dica Beleza na Web: Aplique nos pontos de pulsação (pulsos, pescoço e atrás das orelhas) sem esfregar!\n\nQuer conhecer nossas fragrâncias em destaque? 🌸`;
    }

    // 11. Promoções, Cupons, Frete e Ofertas
    if (msg.includes('promocao') || msg.includes('promo') || msg.includes('desconto') || msg.includes('cupom') || msg.includes('frete') || msg.includes('oferta') || msg.includes('preco')) {
        return `Temos vantagens exclusivas ativas hoje para você! 🎁\n\n• **Frete Grátis**: em todas as compras acima de R$150\n• **Parcelamento**: até 6x sem juros no cartão\n• **Troca Descomplicada**: até 30 dias para trocas\n• **Brinde Exclusivo**: em pedidos a partir de R$300\n\n💜 Use o cupom **BELEZA10** para garantir 10% de desconto na sua compra!\n\nPosso te ajudar a escolher algo incrível para aproveitar o cupom? ✨`;
    }

    // 11.1 Horário de Funcionamento / Atendimento
    if (msg.includes('horario') || msg.includes('funcionamento') || msg.includes('atendimento') || msg.includes('aberto') || msg.includes('abre') || msg.includes('fecha') || msg.includes('sabado') || msg.includes('domingo')) {
        return `Nosso horário de atendimento é:\n\n• **Segunda a Quarta**: 09:30 às 18:00\n• **Quinta e Sexta**: 09:30 às 18:30\n• **Sábados**: 09:30 às 17:00\n• **Domingos**: Fechado (a loja online funciona 24h para você fazer seus pedidos!)\n\n✨ Posso te ajudar a encontrar algum produto ou tirar dúvidas agora? 💜`;
    }

    // 12. Recomendações de Produtos
    if (msg.includes('recomen') || msg.includes('indica') || msg.includes('melhor') || msg.includes('sugere') || msg.includes('produto') || msg.includes('catalogo')) {
        let sample = '';
        try {
            const list = dataManager.generateProducts(20);
            sample = list.slice(0, 3).map(p => `• **${p.name}** [${p.code}] — R$ ${p.price}\n  ${p.desc}`).join('\n\n');
        } catch {
            sample = `• **Sérum Facial Ácido Hialurônico** [ANN-001] — R$ 89,90\n• **Base Fluida Acabamento Natural** [ANN-004] — R$ 74,90\n• **Batom Matte Hidratante Alta Pigmentação** [ANN-007] — R$ 42,90`;
        }
        return `Aqui estão alguns dos favoritos mais amados da nossa loja: 🌟\n\n${sample}\n\n💜 Todos com frete grátis acima de R$150 e parcelamento em 6x sem juros!\n\nQual categoria você gostaria de explorar mais? 🛍️`;
    }

    // 13. Saudações
    if (msg.includes('oi') || msg.includes('ola') || msg.includes('bom dia') || msg.includes('boa tarde') || msg.includes('boa noite') || msg.includes('hey') || msg.includes('eai') || msg.includes('tudo bem')) {
        return `Olá, maravilhosa! 💜 Que alegria te ter por aqui!\n\nSou a consultora virtual da **Beleza na Web**. Estou aqui para:\n\n• 🧴 Montar sua rotina de skincare perfeita\n• 💄 Dar dicas profissionais de maquiagem\n• 🛍️ Recomendar os melhores produtos para você\n• 🎁 Te contar sobre cupons e mimos exclusivos\n\nO que você gostaria de explorar hoje? ✨`;
    }

    // 14. Agradecimentos
    if (msg.includes('obrigad') || msg.includes('valeu') || msg.includes('brigad') || msg.includes('amei') || msg.includes('adorei')) {
        return `De nada, meu amor! 💜 Foi um prazer enorme cuidar de você!\n\nEstou sempre por aqui quando quiser dicas, tutoriais ou novas recomendações. Lembre-se: cuidar de você é o seu ritual diário mais importante! ✨\n\nBoas compras e brilhe muito! 🌟`;
    }

    // 15. Fallback Padrão Inteligente
    return `Adorei sua pergunta! 💜\n\nComo sua consultora da **Beleza na Web**, posso te orientar em:\n\n• 🧴 **Skincare Personalizado**: tipos de pele, ordem dos produtos e ativos\n• 💄 **Maquiagem**: tutoriais, técnicas de aplicação e cores\n• 💇 **Cuidados Capilares**: cronograma, brilho e controle de frizz\n• 🛍️ **Curadoria de Produtos**: sugestões diretas do nosso catálogo com preços\n• 🎁 **Promoções**: cupons ativos e vantagens de frete\n\nMe conta: o que você gostaria de ver agora? ✨`;
}

// ── Chamada de API com Fallback Seguro e Inquebrável ────────────────────────
async function callOpenAI(messages, apiKey) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(OPENAI_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                _apiKey: apiKey || DEFAULT_API_KEY,
                model: OPENAI_MODEL,
                messages,
                max_tokens: 600,
                temperature: 0.75
            })
        });
        clearTimeout(timeoutId);

        // Se a resposta for HTML (ex: Netlify fallback para index.html), não é o endpoint de API
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            throw new Error('Endpoint offline');
        }

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error?.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        if (data?.choices?.[0]?.message?.content) {
            return data.choices[0].message.content.trim();
        }
        throw new Error('Formato inválido');
    } catch (err) {
        // Delay natural para parecer digitação humana e inteligente
        await new Promise(r => setTimeout(r, 650));
        const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
        return offlineReply(lastUserMsg ? lastUserMsg.content : '');
    }
}

// ── Widget GlowAI ─────────────────────────────────────────────────────────────
class GlowAIWidget {
    constructor() {
        this.history    = loadHistory();
        this.isOpen     = false;
        this.isTyping   = false;
        this.greetSent  = false;
        this.apiKey     = localStorage.getItem('glowai_apikey') || DEFAULT_API_KEY;
        this._inject();
        this._bindEvents();

        if (this.history.length === 0) {
            setTimeout(() => this._sendGreeting(), 500);
        } else {
            this._renderHistory();
        }
    }

    _inject() {
        injectGlowAIStyles();

        // Remove duplicata prévia se houver
        document.getElementById('glowai-root')?.remove();

        const root = document.createElement('div');
        root.id = 'glowai-root';
        root.innerHTML = `
        <!-- Botão Flutuante (FAB) -->
        <button id="glowai-fab" aria-label="Abrir Beleza na Web" title="Beleza na Web — Consultora de Beleza">
            <span class="glowai-fab-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
            </span>
            <span class="glowai-fab-pulse"></span>
            <span class="glowai-fab-badge" id="glowai-badge">1</span>
        </button>

        <!-- Painel de Chat -->
        <div id="glowai-panel" aria-hidden="true" role="dialog" aria-label="Beleza na Web Assistente de Beleza">
            <!-- Header -->
            <div class="glowai-header">
                <div class="glowai-header-left">
                    <div class="glowai-avatar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.477 2 2 6.177 2 11.3c0 2.7 1.18 5.13 3.08 6.83L4 22l4.27-1.4A10.12 10.12 0 0 0 12 21.6c5.523 0 10-4.177 10-9.3S17.523 2 12 2Z" fill="white"/>
                        </svg>
                    </div>
                    <div>
                        <div class="glowai-header-title">Beleza na Web</div>
                        <div class="glowai-header-sub" id="glowai-status">
                            <span class="glowai-online-dot"></span> Online agora
                        </div>
                    </div>
                </div>
                <div class="glowai-header-actions">
                    <button class="glowai-icon-btn" id="glowai-clear-btn" title="Limpar conversa">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                    </button>
                    <button class="glowai-icon-btn" id="glowai-key-btn" title="Configurar API Key (opcional)">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5 18 10"/>
                        </svg>
                    </button>
                    <button class="glowai-icon-btn" id="glowai-close" aria-label="Fechar">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                            <path d="M18 6 6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Chips Rápidos -->
            <div class="glowai-chips" id="glowai-chips">
                <button class="glowai-chip" data-msg="Quero recomendação de skincare 🌿">Skincare 🌿</button>
                <button class="glowai-chip" data-msg="Quero dicas de maquiagem 💄">Maquiagem 💄</button>
                <button class="glowai-chip" data-msg="Tem promoções hoje? 🎁">Promoções 🎁</button>
                <button class="glowai-chip" data-msg="Como fazer delineado gatinho? ✨">Delineado ✨</button>
                <button class="glowai-chip" data-msg="Qual protetor solar ideal? 🧴">Protetor Solar 🧴</button>
            </div>

            <!-- Mensagens -->
            <div class="glowai-messages" id="glowai-messages"></div>

            <!-- Banner Opcional de API Key -->
            <div class="glowai-key-banner" id="glowai-key-banner" style="display:none">
                <p>🔑 <strong>API Key (Opcional):</strong> Insira uma chave OpenAI se desejar usar conexão externa direta:</p>
                <div class="glowai-key-row">
                    <input type="password" id="glowai-key-input" placeholder="sk-..." autocomplete="off" spellcheck="false">
                    <button id="glowai-key-save">Salvar</button>
                </div>
            </div>

            <!-- Input -->
            <div class="glowai-input-wrap">
                <textarea
                    id="glowai-input"
                    placeholder="Pergunte sobre beleza, skincare, produtos..."
                    rows="1"
                    aria-label="Mensagem para Beleza na Web"
                    maxlength="500"
                ></textarea>
                <button id="glowai-send" aria-label="Enviar mensagem">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                </button>
            </div>
            <div class="glowai-branding">Powered by <strong>Beleza na Web</strong> ✦</div>
        </div>`;

        document.body.appendChild(root);
        this.panel    = document.getElementById('glowai-panel');
        this.msgBox   = document.getElementById('glowai-messages');
        this.input    = document.getElementById('glowai-input');
        this.sendBtn  = document.getElementById('glowai-send');
        this.fab      = document.getElementById('glowai-fab');
    }

    _bindEvents() {
        this.fab.addEventListener('click', () => this.toggle());
        document.getElementById('glowai-close').addEventListener('click', () => this.close());

        this.sendBtn.addEventListener('click', () => this._handleSend());
        this.input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this._handleSend();
            }
        });

        this.input.addEventListener('input', () => {
            this.input.style.height = 'auto';
            this.input.style.height = Math.min(this.input.scrollHeight, 120) + 'px';
        });

        document.getElementById('glowai-chips').addEventListener('click', e => {
            const chip = e.target.closest('[data-msg]');
            if (chip) {
                this.input.value = chip.dataset.msg;
                this._handleSend();
            }
        });

        document.getElementById('glowai-clear-btn').addEventListener('click', () => {
            if (confirm('Deseja limpar todo o histórico com a Beleza na Web?')) {
                clearHistory();
                this.history = [];
                this.greetSent = false;
                this.msgBox.innerHTML = '';
                setTimeout(() => this._sendGreeting(), 300);
            }
        });

        document.getElementById('glowai-key-btn').addEventListener('click', () => {
            const banner = document.getElementById('glowai-key-banner');
            banner.style.display = banner.style.display === 'none' ? 'block' : 'none';
            if (banner.style.display === 'block') {
                document.getElementById('glowai-key-input').value = this.apiKey;
                document.getElementById('glowai-key-input').focus();
            }
        });

        document.getElementById('glowai-key-save').addEventListener('click', () => {
            const val = document.getElementById('glowai-key-input').value.trim();
            if (val) {
                this.apiKey = val;
                localStorage.setItem('glowai_apikey', val);
                document.getElementById('glowai-key-banner').style.display = 'none';
                this._showSystemMsg('✅ Chave configurada com sucesso! 💜');
            }
        });

        // Fechar ao clicar fora em mobile
        document.addEventListener('click', e => {
            if (this.isOpen && !this.panel.contains(e.target) && !this.fab.contains(e.target)) {
                if (window.innerWidth < 640) this.close();
            }
        });
    }

    open() {
        this.isOpen = true;
        this.panel.classList.add('glowai-panel--open');
        this.fab.classList.add('glowai-fab--open');
        const badge = document.getElementById('glowai-badge');
        if (badge) badge.style.display = 'none';
        setTimeout(() => this.input.focus(), 300);
        this._scrollToBottom();
    }

    close() {
        this.isOpen = false;
        this.panel.classList.remove('glowai-panel--open');
        this.fab.classList.remove('glowai-fab--open');
        this.panel.setAttribute('aria-hidden', 'true');
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    async _sendGreeting() {
        if (this.greetSent) return;
        this.greetSent = true;
        const greet = `Olá! 💜 Sou a consultora virtual da **Beleza na Web**.\n\nPosso te ajudar a encontrar o produto perfeito, indicar rotinas de skincare, ensinar tutoriais de make e tirar dúvidas.\n\nPor onde quer começar hoje? ✨`;
        this._appendMessage('assistant', greet);
        this.history.push({ role: 'assistant', content: greet });
        saveHistory(this.history);
    }

    async _handleSend() {
        const text = this.input.value.trim();
        if (!text || this.isTyping) return;

        this.input.value = '';
        this.input.style.height = 'auto';
        this._appendMessage('user', text);

        this.history.push({ role: 'user', content: text });

        this._showTyping();
        this.isTyping = true;
        this._setStatus('Consultando Beleza na Web...');

        try {
            const messages = [
                { role: 'system', content: buildSystemPrompt() },
                ...this.history.slice(-18)
            ];
            const reply = await callOpenAI(messages, this.apiKey);
            this._removeTyping();
            this._appendMessage('assistant', reply);
            this.history.push({ role: 'assistant', content: reply });
            saveHistory(this.history);
        } catch (err) {
            this._removeTyping();
            const fallback = offlineReply(text);
            this._appendMessage('assistant', fallback);
            this.history.push({ role: 'assistant', content: fallback });
            saveHistory(this.history);
        } finally {
            this.isTyping = false;
            this._setStatus('<span class="glowai-online-dot"></span> Online agora');
        }
    }

    _renderHistory() {
        this.msgBox.innerHTML = '';
        this.history.forEach(m => this._appendMessage(m.role, m.content, false));
        this._scrollToBottom();
    }

    _appendMessage(role, content, animate = true) {
        const wrap = document.createElement('div');
        wrap.className = `glowai-msg-wrap glowai-msg-wrap--${role}${animate ? ' glowai-msg-animate' : ''}`;

        if (role === 'assistant') {
            const cleanContent = typeof content === 'string'
                ? content
                    .replace(/Sou a GlowAI, sua consultora de beleza da A\.n\.n Beauty/gi, 'Sou a consultora virtual da **Beleza na Web**')
                    .replace(/GlowAI/gi, 'Beleza na Web')
                    .replace(/A\.n\.n\s*Beauty/gi, 'Beleza na Web')
                    .replace(/A\.n\.n/gi, 'Beleza na Web')
                : content;
            wrap.innerHTML = `
            <div class="glowai-msg-avatar">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.477 2 2 6.177 2 11.3c0 2.7 1.18 5.13 3.08 6.83L4 22l4.27-1.4A10.12 10.12 0 0 0 12 21.6c5.523 0 10-4.177 10-9.3S17.523 2 12 2Z" fill="#8B5FBF"/>
                </svg>
            </div>
            <div class="glowai-bubble glowai-bubble--ai">
                <p class="glowai-p">${renderMarkdown(cleanContent)}</p>
            </div>`;
        } else {
            wrap.innerHTML = `<div class="glowai-bubble glowai-bubble--user">${this._escapeHtml(content)}</div>`;
        }

        this.msgBox.appendChild(wrap);
        if (animate) this._scrollToBottom();
    }

    _showSystemMsg(text) {
        const div = document.createElement('div');
        div.className = 'glowai-system-msg';
        div.textContent = text;
        this.msgBox.appendChild(div);
        this._scrollToBottom();
    }

    _showTyping() {
        const div = document.createElement('div');
        div.id = 'glowai-typing';
        div.className = 'glowai-msg-wrap glowai-msg-wrap--assistant glowai-msg-animate';
        div.innerHTML = `
        <div class="glowai-msg-avatar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.477 2 2 6.177 2 11.3c0 2.7 1.18 5.13 3.08 6.83L4 22l4.27-1.4A10.12 10.12 0 0 0 12 21.6c5.523 0 10-4.177 10-9.3S17.523 2 12 2Z" fill="#8B5FBF"/>
            </svg>
        </div>
        <div class="glowai-bubble glowai-bubble--ai glowai-typing-bubble">
            <span></span><span></span><span></span>
        </div>`;
        this.msgBox.appendChild(div);
        this._scrollToBottom();
    }

    _removeTyping() {
        document.getElementById('glowai-typing')?.remove();
    }

    _scrollToBottom() {
        requestAnimationFrame(() => {
            this.msgBox.scrollTop = this.msgBox.scrollHeight;
        });
    }

    _setStatus(html) {
        const el = document.getElementById('glowai-status');
        if (el) el.innerHTML = html;
    }

    _escapeHtml(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
}

// ── Inicializador Singleton (Garante persistência perfeita sem destruir o chat ao navegar) ──
let glowAIInstance = null;

export function initGlowAI() {
    // Se o elemento já estiver no DOM e a instância viva, não recria
    if (glowAIInstance && document.getElementById('glowai-root')) {
        return glowAIInstance;
    }

    // Se o elemento sumiu do DOM, limpa e reinstancia
    document.getElementById('glowai-root')?.remove();
    glowAIInstance = new GlowAIWidget();
    window._glowAI = glowAIInstance;
    return glowAIInstance;
}
