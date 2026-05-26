// ============================================
// GlowAI — Assistente de Beleza A.n.n Beauty
// ============================================

import { dataManager } from './data_manager.js';

const GLOWAI_STORAGE_KEY = 'glowai_history';
const GLOWAI_SKIN_KEY    = 'glowai_skin_type';
const OPENAI_MODEL       = 'MiniMax M2.5 Free';
// Proxy route — avoids CORS when served via proxy.js
const OPENAI_BASE_URL    = '/api/chat';
// Default key — can be overridden via the 🔑 button in the widget
const DEFAULT_API_KEY    = 'sk-kVRHUqP1ScAAXEYCFWnYblivjFfjqCRaGfNIoYrzt1OvZgo9XtzKSfyigOcyo12a';

// ── Build catalog summary for the system prompt ──────────────────────────────
function buildCatalogSummary() {
    const products = dataManager.generateProducts(50);
    return products.slice(0, 20).map(p =>
        `• ${p.name} [${p.code}] (${p.cat}) — ${p.price}${p.badge ? ' (' + p.badge + ')' : ''}: ${p.desc}`
    ).join('\n');
}

// ── System Prompt ─────────────────────────────────────────────────────────────
function buildSystemPrompt() {
    const catalog = buildCatalogSummary();
    const offers  = 'Frete grátis em compras acima de R$150 • Parcelamento em até 6x sem juros • Troca em até 30 dias • Brinde exclusivo em compras acima de R$300';

    return `Você é GlowAI, a Consultora de Beleza Digital de Elite da A.n.n Beauty.
Sua missão é transformar a experiência de compra em um ritual de autocuidado, oferecendo consultoria personalizada de alto padrão.

PERSONALIDADE:
- Sofisticada, acolhedora e extremamente conhecedora de tendências de beleza.
- Use um tom de "melhor amiga especialista" — empático, mas com autoridade técnica.
- Valorize a individualidade de cada cliente.

CATÁLOGO DE PRODUTOS DISPONÍVEIS:
${catalog}

POLÍTICAS E OFERTAS:
${offers}

DIRETRIZES DE RESPOSTA:
1. IDIOMA: Português do Brasil (PT-BR).
2. CONSULTORIA: Antes de recomendar skincare, SEMPRE pergunte o tipo de pele (Seca, Oleosa, Mista ou Sensível).
3. CURADORIA: Recomende no máximo 3 produtos por vez. Use **negrito** para o nome dos produtos.
4. LINKS/CÓDIGOS: Sempre mencione o código do produto (ex: [ANN-001]) para facilitar a busca.
5. CONTEXTO: Relacione os produtos com os benefícios reais e o estilo de vida da cliente.
6. CALL TO ACTION: Termine com uma pergunta que estimule a conversa ou um convite para ver o produto na loja.
7. LIMITAÇÕES: Se o produto não estiver no catálogo acima, sugira o mais próximo ou diga que pode verificar com a curadoria.
8. ESTILO: Máximo 3 parágrafos. Use listas (•) para benefícios. Emojis sutis (✨, 💄, 🧴).`;
}


// ── localStorage helpers ──────────────────────────────────────────────────────
function loadHistory() {
    try { return JSON.parse(localStorage.getItem(GLOWAI_STORAGE_KEY)) || []; }
    catch { return []; }
}
function saveHistory(history) {
    // Keep last 40 messages to avoid quota issues
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
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Numbered list items
        .replace(/^(\d+)[.)]\s+(.+)$/gm, '<li class="glowai-list-item"><span class="glowai-list-num">$1</span>$2</li>')
        // Bullet list
        .replace(/^[•\-]\s+(.+)$/gm, '<li class="glowai-bullet-item">$1</li>')
        // Wrap consecutive <li> in <ol>/<ul>
        .replace(/(<li class="glowai-list-item">[\s\S]*?<\/li>)+/g, m => `<ol class="glowai-ol">${m}</ol>`)
        .replace(/(<li class="glowai-bullet-item">[\s\S]*?<\/li>)+/g, m => `<ul class="glowai-ul">${m}</ul>`)
        // Line breaks
        .replace(/\n\n/g, '</p><p class="glowai-p">')
        .replace(/\n/g, '<br>');
}

// ── API call ──────────────────────────────────────────────────────────────────
async function callOpenAI(messages, apiKey) {
    const res = await fetch(OPENAI_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // _apiKey is stripped by the proxy before forwarding to OpenAI
        body: JSON.stringify({
            _apiKey: apiKey,
            model: OPENAI_MODEL,
            messages,
            max_tokens: 600,
            temperature: 0.75
        })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.choices[0].message.content.trim();
}

// ── GlowAI Widget ─────────────────────────────────────────────────────────────
class GlowAIWidget {
    constructor() {
        this.history    = loadHistory();
        this.isOpen     = false;
        this.isTyping   = false;
        this.greetSent  = false;
        // Use stored key, or fall back to built-in default
        this.apiKey     = localStorage.getItem('glowai_apikey') || DEFAULT_API_KEY;
        this._inject();
        this._bindEvents();
        // Auto-greet if fresh session
        if (this.history.length === 0) {
            setTimeout(() => this._sendGreeting(), 600);
        } else {
            this._renderHistory();
        }
    }

    // ── DOM injection ──────────────────────────────────────────────────────────
    _inject() {
        // Remove existing if re-mounted
        document.getElementById('glowai-root')?.remove();

        const root = document.createElement('div');
        root.id = 'glowai-root';
        root.innerHTML = `
        <!-- Floating Button -->
        <button id="glowai-fab" aria-label="Abrir GlowAI" title="GlowAI — Consultora de Beleza">
            <span class="glowai-fab-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.477 2 2 6.177 2 11.3c0 2.7 1.18 5.13 3.08 6.83L4 22l4.27-1.4A10.12 10.12 0 0 0 12 21.6c5.523 0 10-4.177 10-9.3S17.523 2 12 2Z" fill="white"/>
                    <path d="M8 11h8M8 14.5h5" stroke="#7c3aed" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
            </span>
            <span class="glowai-fab-pulse"></span>
            <span class="glowai-fab-badge" id="glowai-badge">✦</span>
        </button>

        <!-- Chat Panel -->
        <div id="glowai-panel" aria-hidden="true" role="dialog" aria-label="GlowAI Assistente de Beleza">
            <!-- Header -->
            <div class="glowai-header">
                <div class="glowai-header-left">
                    <div class="glowai-avatar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.477 2 2 6.177 2 11.3c0 2.7 1.18 5.13 3.08 6.83L4 22l4.27-1.4A10.12 10.12 0 0 0 12 21.6c5.523 0 10-4.177 10-9.3S17.523 2 12 2Z" fill="white"/>
                        </svg>
                    </div>
                    <div>
                        <div class="glowai-header-title">GlowAI</div>
                        <div class="glowai-header-sub" id="glowai-status">
                            <span class="glowai-online-dot"></span> Online agora
                        </div>
                    </div>
                </div>
                <div class="glowai-header-actions">
                    <button class="glowai-icon-btn" id="glowai-clear-btn" title="Limpar conversa">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                    </button>
                    <button class="glowai-icon-btn" id="glowai-key-btn" title="Configurar API Key">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5 18 10"/>
                        </svg>
                    </button>
                    <button class="glowai-icon-btn glowai-close-btn" id="glowai-close" aria-label="Fechar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                            <path d="M18 6 6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Quick chips -->
            <div class="glowai-chips" id="glowai-chips">
                <button class="glowai-chip" data-msg="Quero recomendação de skincare 🌿">Skincare</button>
                <button class="glowai-chip" data-msg="Quero dicas de maquiagem 💄">Maquiagem</button>
                <button class="glowai-chip" data-msg="Tem promoções hoje? 🎁">Promoções</button>
                <button class="glowai-chip" data-msg="Como fazer delineado gatinho?">Tutorial</button>
            </div>

            <!-- Messages -->
            <div class="glowai-messages" id="glowai-messages"></div>

            <!-- API Key Banner -->
            <div class="glowai-key-banner" id="glowai-key-banner" style="display:none">
                <p>🔑 Insira sua <strong>OpenAI API Key</strong> para ativar o GlowAI:</p>
                <div class="glowai-key-row">
                    <input type="password" id="glowai-key-input" placeholder="sk-..." autocomplete="off" spellcheck="false">
                    <button id="glowai-key-save">Salvar</button>
                </div>
            </div>

            <!-- Input -->
            <div class="glowai-input-wrap">
                <textarea
                    id="glowai-input"
                    placeholder="Pergunte sobre beleza, produtos, tutoriais..."
                    rows="1"
                    aria-label="Mensagem para GlowAI"
                    maxlength="500"
                ></textarea>
                <button id="glowai-send" aria-label="Enviar mensagem">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                </button>
            </div>
            <div class="glowai-branding">Powered by <strong>GlowAI</strong> × A.n.n Beauty ✦</div>
        </div>`;

        document.body.appendChild(root);
        this.panel    = document.getElementById('glowai-panel');
        this.msgBox   = document.getElementById('glowai-messages');
        this.input    = document.getElementById('glowai-input');
        this.sendBtn  = document.getElementById('glowai-send');
        this.fab      = document.getElementById('glowai-fab');
    }

    // ── Event bindings ─────────────────────────────────────────────────────────
    _bindEvents() {
        // FAB toggle
        this.fab.addEventListener('click', () => this.toggle());

        // Close
        document.getElementById('glowai-close').addEventListener('click', () => this.close());

        // Send
        this.sendBtn.addEventListener('click', () => this._handleSend());
        this.input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._handleSend(); }
        });

        // Auto-resize textarea
        this.input.addEventListener('input', () => {
            this.input.style.height = 'auto';
            this.input.style.height = Math.min(this.input.scrollHeight, 120) + 'px';
        });

        // Quick chips
        document.getElementById('glowai-chips').addEventListener('click', e => {
            const chip = e.target.closest('[data-msg]');
            if (chip) { this.input.value = chip.dataset.msg; this._handleSend(); }
        });

        // Clear history
        document.getElementById('glowai-clear-btn').addEventListener('click', () => {
            if (confirm('Limpar toda a conversa?')) {
                clearHistory();
                this.history = [];
                this.greetSent = false;
                this.msgBox.innerHTML = '';
                setTimeout(() => this._sendGreeting(), 300);
            }
        });

        // API Key button
        document.getElementById('glowai-key-btn').addEventListener('click', () => {
            const banner = document.getElementById('glowai-key-banner');
            banner.style.display = banner.style.display === 'none' ? 'block' : 'none';
            if (banner.style.display === 'block') {
                document.getElementById('glowai-key-input').value = this.apiKey;
                document.getElementById('glowai-key-input').focus();
            }
        });

        // Save API Key
        document.getElementById('glowai-key-save').addEventListener('click', () => {
            const val = document.getElementById('glowai-key-input').value.trim();
            if (val) {
                this.apiKey = val;
                localStorage.setItem('glowai_apikey', val);
                document.getElementById('glowai-key-banner').style.display = 'none';
                this._showSystemMsg('✅ API Key salva! Agora pode conversar comigo 💜');
            }
        });

        // Click outside to close on mobile
        document.addEventListener('click', e => {
            if (this.isOpen && !this.panel.contains(e.target) && !this.fab.contains(e.target)) {
                if (window.innerWidth < 640) this.close();
            }
        });
    }

    // ── Open / Close / Toggle ─────────────────────────────────────────────────
    open() {
        this.isOpen = true;
        this.panel.classList.add('glowai-panel--open');
        this.fab.classList.add('glowai-fab--open');
        this.panel.setAttribute('aria-hidden', 'false');
        document.getElementById('glowai-badge').style.display = 'none';
        setTimeout(() => this.input.focus(), 350);
        this._scrollToBottom();
    }
    close() {
        this.isOpen = false;
        this.panel.classList.remove('glowai-panel--open');
        this.fab.classList.remove('glowai-fab--open');
        this.panel.setAttribute('aria-hidden', 'true');
    }
    toggle() { this.isOpen ? this.close() : this.open(); }

    // ── Greeting ──────────────────────────────────────────────────────────────
    async _sendGreeting() {
        if (this.greetSent) return;
        this.greetSent = true;
        const greet = `Olá! 💜 Sou a GlowAI, sua consultora de beleza da A.n.n Beauty. Posso te ajudar a encontrar o produto perfeito, ensinar tutoriais ou tirar dúvidas sobre skincare. Por onde quer começar?`;
        this._appendMessage('assistant', greet);
        this.history.push({ role: 'assistant', content: greet });
        saveHistory(this.history);
    }

    // ── Handle send ───────────────────────────────────────────────────────────
    async _handleSend() {
        const text = this.input.value.trim();
        if (!text || this.isTyping) return;

        // Check API key
        if (!this.apiKey) {
            document.getElementById('glowai-key-banner').style.display = 'block';
            document.getElementById('glowai-key-input').focus();
            this._showSystemMsg('⚠️ Configure sua API Key para conversar comigo!');
            return;
        }

        // Clear + append user msg
        this.input.value = '';
        this.input.style.height = 'auto';
        this._appendMessage('user', text);

        // Add to history
        this.history.push({ role: 'user', content: text });

        // Show typing
        this._showTyping();
        this.isTyping = true;
        this._setStatus('Digitando...');

        try {
            const messages = [
                { role: 'system', content: buildSystemPrompt() },
                ...this.history.slice(-18)  // keep context window lean
            ];
            const reply = await callOpenAI(messages, this.apiKey);
            this._removeTyping();
            this._appendMessage('assistant', reply);
            this.history.push({ role: 'assistant', content: reply });
            saveHistory(this.history);
        } catch (err) {
            this._removeTyping();
            const errMsg = err.message?.includes('401')
                ? '🔑 API Key inválida. Clique no ícone de chave para corrigir.'
                : err.message?.includes('429')
                ? '⏳ Muitas requisições. Aguarde um momento e tente novamente.'
                : `❌ Erro: ${err.message || 'Não foi possível conectar.'}`;
            this._showSystemMsg(errMsg);
        } finally {
            this.isTyping = false;
            this._setStatus('<span class="glowai-online-dot"></span> Online agora');
        }
    }

    // ── Render history ────────────────────────────────────────────────────────
    _renderHistory() {
        this.msgBox.innerHTML = '';
        this.history.forEach(m => this._appendMessage(m.role, m.content, false));
        this._scrollToBottom();
    }

    // ── Append message bubble ─────────────────────────────────────────────────
    _appendMessage(role, content, animate = true) {
        const wrap = document.createElement('div');
        wrap.className = `glowai-msg-wrap glowai-msg-wrap--${role}${animate ? ' glowai-msg-animate' : ''}`;

        if (role === 'assistant') {
            wrap.innerHTML = `
            <div class="glowai-msg-avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.477 2 2 6.177 2 11.3c0 2.7 1.18 5.13 3.08 6.83L4 22l4.27-1.4A10.12 10.12 0 0 0 12 21.6c5.523 0 10-4.177 10-9.3S17.523 2 12 2Z" fill="#7c3aed"/>
                </svg>
            </div>
            <div class="glowai-bubble glowai-bubble--ai">
                <p class="glowai-p">${renderMarkdown(content)}</p>
            </div>`;
        } else {
            wrap.innerHTML = `<div class="glowai-bubble glowai-bubble--user">${this._escapeHtml(content)}</div>`;
        }

        this.msgBox.appendChild(wrap);
        if (animate) this._scrollToBottom();
    }

    // ── System message (error / info) ─────────────────────────────────────────
    _showSystemMsg(text) {
        const div = document.createElement('div');
        div.className = 'glowai-system-msg';
        div.textContent = text;
        this.msgBox.appendChild(div);
        this._scrollToBottom();
    }

    // ── Typing indicator ──────────────────────────────────────────────────────
    _showTyping() {
        const div = document.createElement('div');
        div.id = 'glowai-typing';
        div.className = 'glowai-msg-wrap glowai-msg-wrap--assistant glowai-msg-animate';
        div.innerHTML = `
        <div class="glowai-msg-avatar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.477 2 2 6.177 2 11.3c0 2.7 1.18 5.13 3.08 6.83L4 22l4.27-1.4A10.12 10.12 0 0 0 12 21.6c5.523 0 10-4.177 10-9.3S17.523 2 12 2Z" fill="#7c3aed"/>
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

    // ── Helpers ───────────────────────────────────────────────────────────────
    _scrollToBottom() {
        requestAnimationFrame(() => {
            this.msgBox.scrollTop = this.msgBox.scrollHeight;
        });
    }
    _setStatus(html) {
        document.getElementById('glowai-status').innerHTML = html;
    }
    _escapeHtml(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
}

// ── Init & mount ──────────────────────────────────────────────────────────────
let glowAIInstance = null;

export function initGlowAI() {
    // Destroy previous if exists (SPA re-mount)
    document.getElementById('glowai-root')?.remove();
    glowAIInstance = new GlowAIWidget();
    window._glowAI = glowAIInstance;
}
