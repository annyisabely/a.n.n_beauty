# A.n.n Beauty — Skincare Etéreo & Rituais de Luxo

A.n.n Beauty é uma plataforma de e-commerce de beleza premium, focada em skincare de alta performance com uma estética minimalista e luminosa. O projeto foi desenvolvido como uma Single Page Application (SPA) utilizando tecnologias web modernas para proporcionar uma experiência fluida e imersiva.

## ✨ Características

- **SPA (Single Page Application):** Navegação instantânea sem recarregamento de página.
- **Design System Premium:** Interface elegante com foco em tipografia e micro-interações.
- **Busca por Voz:** Integração com a API de reconhecimento de voz para facilitar a busca de produtos e tutoriais.
- **Rituais de Beleza:** Guias detalhados de uso de produtos e rituais de skincare.
- **Galeria de Vídeos:** Tutoriais e vídeos informativos integrados.
- **Filtros Avançados:** Sistema de busca inteligente por categorias e necessidades de pele.
- **Modo Escuro/Claro:** Suporte nativo para diferentes preferências de iluminação.

## 🚀 Tecnologias Utilizadas

- **HTML5 & CSS3:** Estrutura e estilização base.
- **Tailwind CSS:** Framework utilitário para um design responsivo e customizado.
- **JavaScript (ES6+):** Lógica da aplicação, roteamento dinâmico e carregamento modular (lazy-loading).
- **Google Fonts:** Tipografia selecionada (Noto Serif & Plus Jakarta Sans).
- **Material Symbols:** Ícones modernos e consistentes.

## 📁 Estrutura do Projeto

```text
/
├── css/                # Estilos globais e customizados
├── js/                 # Lógica da aplicação
│   ├── pages/          # Módulos JavaScript para cada página
│   ├── app.js          # Roteador e inicialização da SPA
│   └── components.js   # Componentes reutilizáveis (Header, Footer, etc.)
├── img/                # Ativos de imagem e assets
├── design_system/      # Documentação e recursos do design system
├── index.html          # Ponto de entrada da aplicação
└── [páginas]/          # Diretórios com recursos específicos de cada funcionalidade
```

## 🛠️ Como Executar

Como este é um projeto estático baseado em JavaScript Vanilla, você pode executá-lo facilmente:

1. Clone o repositório ou baixe os arquivos.
2. Abra o arquivo `index.html` em qualquer navegador moderno.
3. **Recomendado:** Utilize uma extensão como "Live Server" no VS Code para uma melhor experiência de desenvolvimento e para garantir que o roteamento baseado em módulos funcione corretamente devido às políticas de segurança do navegador (CORS).

---

Desenvolvido com ❤️ por A.n.n Beauty Team.


para rodar o projeto no navegador use o seguinte comando no terminal: npx http-server -p 8080 -o
