/**
 * Data Manager for Beleza na Web
 * Generates and manages the large catalog of products and videos.
 */

// Fictional store catalog — each store has its own profile data
export const storesData = {
    ann_beauty: {
        id: 'ann_beauty',
        name: 'Beleza na Web',
        tagline: 'A beleza que realça o que já existe em você.',
        desc: 'Somos especialistas em cuidados com a pele e maquiagem de alta performance. Nossa missão é empoderar cada pessoa com produtos que celebram a beleza natural.',
        category: 'skincare',
        photo: 'img/logo.png',
        cover: 'img/hero_skin_spa.jpg',
        phone: '(11) 99999-0001',
        address: 'Av. Paulista, 1000 — Bela Vista, São Paulo/SP',
        hours: 'Seg a Qua: 09:30 às 18:00 | Qui e Sex: 09:30 às 18:30 | Sábados: 09:30 às 17:00',
        rating: '4.9',
        reviews: 340,
        products: 350,
        delivery: '99.4%',
        followersBase: 1240,
    },
    nycoly: {
        id: 'nycoly',
        name: 'Nycoly',
        tagline: 'Glamour e cor para cada momento.',
        desc: 'A Nycoly nasceu da paixão por cores vibrantes e maquiagem de impacto. Cada produto é formulado para mulheres que não têm medo de se expressar.',
        category: 'maquiagem',
        photo: 'img/nycoly_profile.png',
        cover: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
        phone: '(21) 98888-0002',
        address: 'Rua do Catete, 200 — Flamengo, Rio de Janeiro/RJ',
        hours: 'Seg a Qua: 09:30 às 18:00 | Qui e Sex: 09:30 às 18:30 | Sábados: 09:30 às 17:00',
        rating: '4.7',
        reviews: 218,
        products: 210,
        delivery: '97.1%',
        followersBase: 870,
    },
    glow_co: {
        id: 'glow_co',
        name: 'Glow & Co.',
        tagline: 'Formulações botânicas para uma pele radiante.',
        desc: 'Especialistas em séruns e cremes com ingredientes naturais de alta concentração. Ciência e natureza unidos em cada gotinha.',
        category: 'skincare',
        photo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
        cover: 'https://images.unsplash.com/photo-1608248597359-009110757271?w=1200&q=80',
        phone: '(41) 97777-0003',
        address: 'Rua XV de Novembro, 500 — Centro, Curitiba/PR',
        hours: 'Seg a Qua: 09:30 às 18:00 | Qui e Sex: 09:30 às 18:30 | Sábados: 09:30 às 17:00',
        rating: '4.8',
        reviews: 512,
        products: 180,
        delivery: '98.7%',
        followersBase: 1580,
    },
    rose_lab: {
        id: 'rose_lab',
        name: 'Rosé Lab',
        tagline: 'Skincare premium com toque parisiense.',
        desc: 'Inspirada na elegância francesa, a Rosé Lab combina ativos premium com embalagens sofisticadas para um ritual de beleza luxuoso.',
        category: 'skincare',
        photo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
        cover: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80',
        phone: '(51) 96666-0004',
        address: 'Av. Independência, 320 — Moinhos de Vento, Porto Alegre/RS',
        hours: 'Seg a Qua: 09:30 às 18:00 | Qui e Sex: 09:30 às 18:30 | Sábados: 09:30 às 17:00',
        rating: '4.9',
        reviews: 389,
        products: 95,
        delivery: '99.8%',
        followersBase: 2100,
    },
    lumina: {
        id: 'lumina',
        name: 'Lumina Studio',
        tagline: 'Iluminando cada passo da sua rotina.',
        desc: 'A Lumina Studio é referência em produtos de beleza acessíveis e de qualidade. Acreditamos que toda pessoa merece se sentir incrível, todos os dias.',
        category: 'maquiagem',
        photo: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80',
        cover: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80',
        phone: '(31) 95555-0005',
        address: 'Av. do Contorno, 7000 — Savassi, Belo Horizonte/MG',
        hours: 'Seg a Qua: 09:30 às 18:00 | Qui e Sex: 09:30 às 18:30 | Sábados: 09:30 às 17:00',
        rating: '4.6',
        reviews: 156,
        products: 130,
        delivery: '96.5%',
        followersBase: 620,
    },
    cabelo_house: {
        id: 'cabelo_house',
        name: 'Cabelo House',
        tagline: 'Tratamento profissional em casa.',
        desc: 'Especialistas em reparação, hidratação e proteção para todos os tipos de cabelo.',
        category: 'cabelo',
        photo: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400&q=80',
        cover: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=1200&q=80',
        phone: '(21) 98888-0006',
        address: 'Av. das Américas, 100 — Barra, Rio de Janeiro/RJ',
        hours: 'Seg a Qua: 09:30 às 18:00 | Qui e Sex: 09:30 às 18:30 | Sábados: 09:30 às 17:00',
        rating: '4.8',
        reviews: 210,
        products: 80,
        delivery: '98.5%',
        followersBase: 950,
    },
    perfume_house: {
        id: 'perfume_house',
        name: 'Perfume House',
        tagline: 'Fragrâncias inesquecíveis.',
        desc: 'Curadoria exclusiva das melhores fragrâncias nacionais e internacionais.',
        category: 'perfumaria',
        photo: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80',
        cover: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1200&q=80',
        phone: '(11) 97777-0007',
        address: 'Rua Oscar Freire, 200 — Jardins, São Paulo/SP',
        hours: 'Seg a Qua: 09:30 às 18:00 | Qui e Sex: 09:30 às 18:30 | Sábados: 09:30 às 17:00',
        rating: '4.9',
        reviews: 320,
        products: 150,
        delivery: '99.1%',
        followersBase: 1100,
    },
    unhas_studio: {
        id: 'unhas_studio',
        name: 'Unhas Studio',
        tagline: 'Cores e cuidados em cada detalhe.',
        desc: 'Tudo o que você precisa para unhas fortes, saudáveis e estilosas.',
        category: 'maquiagem',
        photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80',
        cover: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=1200&q=80',
        phone: '(41) 96666-0008',
        address: 'Rua das Flores, 50 — Centro, Curitiba/PR',
        hours: 'Seg a Qua: 09:30 às 18:00 | Qui e Sex: 09:30 às 18:30 | Sábados: 09:30 às 17:00',
        rating: '4.7',
        reviews: 180,
        products: 90,
        delivery: '97.8%',
        followersBase: 650,
    }
};

// ── MAPEAMENTO DE IMAGENS POR KEYWORD DO NOME ──
const PRODUCT_IMAGE_MAP = [
    // MAQUIAGEM — base / primer / bb
    { keys: ['base fluida','base serum','base sérum','bb cream','cc cream','primer','base liquida','base líquida','base matte','base'],
      img: 'img/base_fluida_1791458954927.jpg' },
    // MAQUIAGEM — batom
    { keys: ['batom matte','batom liquido','batom líquido','batom cremoso','batom bala','batom'],
      img: 'img/batom_matte_1791458925028.jpg' },
    // MAQUIAGEM — gloss / labial
    { keys: ['gloss','brilho labial','lip gloss','lip tint','balm labial','hidratante labial','protetor labial','labial'],
      img: 'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=500&q=80' },
    // MAQUIAGEM — paleta / sombra
    { keys: ['paleta de sombra','paleta de sombras','paleta de olhos','sombra','paleta','eyeshadow'],
      img: 'img/paleta_sombras_1791458911527.jpg' },
    // MAQUIAGEM — blush / iluminador / bronzer / pó
    { keys: ['blush','iluminador','bronzer','po compacto','pó compacto','po translucido','pó translúcido','highlighter','po facial','pó facial'],
      img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80' },
    // MAQUIAGEM — máscara de cílios / rímel
    { keys: ['mascara de cilio','máscara de cílio','mascara para cilio','máscara para cílio','rimel','rímel','cilios','cílios'],
      img: 'https://images.unsplash.com/photo-1631214501587-02e7d1e7b561?w=500&q=80' },
    // MAQUIAGEM — delineador / lápis
    { keys: ['delineador','eyeliner','lapis de olho','lápis de olho','caneta delineadora'],
      img: 'https://images.unsplash.com/photo-1631214501587-02e7d1e7b561?w=500&q=80' },
    // MAQUIAGEM — contorno / corretivo
    { keys: ['contorno em bastao','contorno em bastão','contorno','corretivo liquido','corretivo'],
      img: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=500&q=80' },
    // MAQUIAGEM — pincéis / esponja
    { keys: ['pincel','pinceis','pincéis','kit pincel','kit pinceis','kit pincéis','esponja','beauty blender'],
      img: 'img/kit_pinceis_1791458940916.jpg' },
    // SKINCARE — sérum
    { keys: ['serum facial','sérum facial','serum hidra','serum botanico','sérum botânico','serum pele','serum retinol','serum vitamina','serum hidratante','serum clareador','serum','sérum','vitamina c','niacinamida','acido hialuronico','ácido hialurônico','retinol'],
      img: 'img/serum_facial_1791458880967.jpg' },
    // SKINCARE — creme / hidratante facial
    { keys: ['creme noturno','creme hidratante','creme barrier','creme petalas','creme pétalas','creme para olho','creme facial','hidratante facial','creme anti','creme'],
      img: 'img/creme_hidratante_1791458893023.jpg' },
    // SKINCARE — protetor solar
    { keys: ['protetor solar','protetor','spf','filtro solar','bloqueador solar'],
      img: 'https://images.unsplash.com/photo-1556228578-dd539282b964?w=500&q=80' },
    // SKINCARE — sabonete / gel de limpeza
    { keys: ['sabonete facial','gel de limpeza','espuma de limpeza','cleanser','limpeza facial','sabonete'],
      img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80' },
    // SKINCARE — água micelar / demaquilante
    { keys: ['agua micelar','água micelar','micelar','removedor bifasico','removedor bifásico','removedor de maquiagem','demaquilante'],
      img: 'https://images.unsplash.com/photo-1590156546064-c9aa34fe5b05?w=500&q=80' },
    // SKINCARE — esfoliante / peeling
    { keys: ['esfoliante facial','peeling facial','scrub facial','peeling','esfoliante'],
      img: 'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=500&q=80' },
    // SKINCARE — máscara facial / argila
    { keys: ['mascara argila','máscara argila','mascara noturna','máscara noturna','mascara facial','máscara facial','argila','sleeping mask','sheet mask'],
      img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80' },
    // SKINCARE — tônico
    { keys: ['tonico','tônico','toner','agua floral','água floral','agua de rosas','água de rosas'],
      img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80' },
    // CORPO — hidratante corporal / loção
    { keys: ['hidratante corporal nutritivo','hidratante corporal','locao corporal','loção corporal','creme corporal','manteiga corporal','oleo corporal','óleo corporal'],
      img: 'img/hidratante_corporal.jpg' },
    // CORPO — esfoliante corporal / banho
    { keys: ['esfoliante corporal','scrub corporal','gel de banho','sabonete liquido','sabonete líquido','sabonete corporal','sais de banho'],
      img: 'https://images.unsplash.com/photo-1570194065650-d99fb4cb7b4a?w=500&q=80' },
    // PERFUMES / FRAGRÂNCIAS
    { keys: ['perfume','eau de parfum','eau de toilette','colonia','colônia','body splash','deo parfum','fragrancia','fragrância','elixir'],
      img: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=500&q=80' },
    // CABELO — shampoo / condicionador
    { keys: ['shampoo','condicionador','co-wash','shampoo antirresiduos'],
      img: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&q=80' },
    // CABELO — máscara capilar
    { keys: ['mascara capilar','máscara capilar','tratamento capilar','hidratacao capilar','hidratação capilar','cronograma capilar'],
      img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500&q=80' },
    // CABELO — óleo / leave-in / finalizador
    { keys: ['oleo capilar','óleo capilar','leave-in','finalizador','serum capilar','sérum capilar','protetor termico','protetor térmico','reparador de pontas'],
      img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80' },
    // UNHAS
    { keys: ['esmalte','nail polish','top coat','base para unha','oleo para cuticula','óleo para cutícula','removedor de esmalte','kit nail','unha','unhas'],
      img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80' },
];

const CATEGORY_FALLBACK = {
    'Skincare':      'img/serum_facial_1791458880967.jpg',
    'Maquiagem':     'img/batom_matte_1791458925028.jpg',
    'Corpo & Banho': 'img/hidratante_corporal.jpg',
    'Acessórios':    'img/kit_pinceis_1791458940916.jpg',
    'Cabelo':        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&q=80',
    'Perfumes':      'https://images.unsplash.com/photo-1541643600914-78b084683702?w=500&q=80',
    'Perfumaria':    'https://images.unsplash.com/photo-1541643600914-78b084683702?w=500&q=80',
    'Unhas':         'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80',
};

/** Retorna a imagem correta para o produto baseando-se no nome e categoria. */
export function getProductImage(name, cat) {
    const norm = (s) => (s || '').toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const n = norm(name);
    
    if (n) {
        for (const entry of PRODUCT_IMAGE_MAP) {
            for (const key of entry.keys) {
                if (n.includes(norm(key))) return entry.img;
            }
        }
    }
    return CATEGORY_FALLBACK[cat] || 'img/serum_facial_1791458880967.jpg';
}

if (typeof window !== 'undefined') {
    window.getProductImage = getProductImage;
    window.PRODUCT_IMAGE_MAP = PRODUCT_IMAGE_MAP;
}

const categoryImages = {
    'Skincare':  ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80','https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80','https://images.unsplash.com/photo-1617897903246-719242758050?w=500&q=80','https://images.unsplash.com/photo-1590156546064-c9aa34fe5b05?w=500&q=80'],
    'Maquiagem': ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80','https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80','https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80','https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80'],
    'Corpo & Banho': ['https://images.unsplash.com/photo-1556228578-dd539282b964?w=500&q=80','https://images.unsplash.com/photo-1570194065650-d99fb4cb7b4a?w=500&q=80','https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&q=80','https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80'],
    'Cabelo':    ['https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&q=80','https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500&q=80','https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80','https://images.unsplash.com/photo-1487174244970-cd18784bb4a4?w=500&q=80'],
    'Perfumes':  ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=500&q=80','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&q=80','https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&q=80','https://images.unsplash.com/photo-1547887538-047ad8ad49d7?w=500&q=80'],
    'Unhas':     ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80','https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80','https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80','https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80'],
};

const videoImages = [
    'AB6AXuA0aB4buqqgmFalZY_yrYrGGIj8X-ArLG976VPWI84b9rGp_r4t4xkjx9ll4vut7hPFKJul2z2brx3W_kVp5TinaWdjJ9gSqRCzY3vMRfTzmRTTxfIyCBHm91eRCDHaSMWFvNTEmEd0rqN5u_XUYefL8fi8LYzd_o5DgMs6lZpn4K31z1zDT_0auNNoOmR2Dl-0WZaslZbjjGW0O7t-QEbC4v0H_TqVmUy7ALooScm9uyOSfnmspx8M3Vr2eA4IIdmJdC3OrmK3fGEI',
    'AB6AXuCsb0X9za5E14wyiYdZ7-b-qjww8m01AdekvJ1iHfEl4iD6UPWK20u9sShLmVu_U-ZY3ocqbytdMZZa5R-ScTHvXbWHtpwsu-gUkuxExrc8jwOGiHgMbWJzET4fhk5nHXCutGh0txsY-mYiCcjStm-nFXSFyb7jpW7gkFDXUgBf7tV7f_axlA680zf_MmvJjpzprCwU-00uruyInoEDmt5vQN_eb08epGxxtc8sLbNYUHS9rzikWJejX0i_DZDHGZMKJHiSRL_fIOrS',
    'AB6AXuBAJMMiPjMspADE4iF7Uv_VIRtOUTN4oSwDH5l6rW4aeqncBkCQ6SaL5RebUh16pdoZOm9YJHQa8JZHA8APOj4obt4VSdrdqvj0u_IQs1kuD11ZA76xd3wsDJjSEGsrLbtVMIyAY2b9y8kJYna2q8Ti3o75sqVejGW2-qovCQOGPBYDvBbG3Sr9CRCDZ_cbpxdx-Qpw70FYHo0BOuLIk-TSGO-rvZBqeWO2UQknJO1QSIDEU5b7T9E7gCzBK42Eidcc9Nn7yfQV509t',
    'AB6AXuAtWOSKckDEZJK6xwvM2u7sMOI1jH_kXM43iFoaUVPTaWE4kbKtQgX1R5fIR_9AM3XVvp4U5ZgDj191cOFk0Im8b50TgS1MkN5hzInG4PTb0YTreGJGbtebmF6fgKznrsgnw5Kg8A13MV9nlIrazeDAesZqHGZEtEYEJVDXNhZ1VWWe_dZufxLv0mdRuZnhjWnbn_FShSjXvUa9wLB_bF2QpwKnHXrCuZ2BqwNj7Mr4qnR36L_DlfFVQRlnPCm8KFOOOXCto3Wle3Up',
    'AB6AXuCMIsmJ-AadvSze3EqTlRffxMHD3ZJS-gEOhGK5XRbq88_AZPwFH7aZBh9P2bECMeId6B8RAUxJz7Hv76FYG6QbzhZyrL65ipUryA_JiojsbOqb65DiTeb8orIUvmLWBNsUcdSNXfJErVceduA8jAic_SL3wk-alEmNleweWxoJLayiDGEEoPt-XwnSX2hIH682CGK8yUtHi3wxhQPwPPVyS17r1Tp0zUmjpQJgGSOpfr1Z6hU1lZeUk2hBDGs-m7JVZR5TIfmLVtfT'
];

const videoTitles = [
    'Tutorial de Delineado', 'Rotina Matinal', 'Make para Noite', 'Dicas de Skincare',
    'Como usar Retinol', 'Batom que não sai', 'Pele de Vidro', 'Contorno Perfeito',
    'Preparação de Pele', 'Removendo Make', 'Ritual de Spa', 'Favoritos do Mês'
];

// Atalho para criar produto com imagem automática
const _p = (name, desc, cat, price, badge = '', rating = 4.8, reviews = 124) => ({
    name, desc, cat, price, badge, rating, reviews,
    img: getProductImage(name, cat)
});

// Catálogo completo de produtos por loja
const storeProducts = {
    ann_beauty: [
        _p('Sérum Facial Vitamina C',       'Fórmula exclusiva com 15% de Vitamina C pura. Clareia manchas e unifica o tom da pele em 2 semanas.',      'Skincare',       189.90, 'Novo', 4.8, 124),
        _p('Batom Matte Duradouro',          'Pigmentação intensa com até 12h de duração. Fórmula com vitamina E para não ressecar.',                   'Maquiagem',       79.90, 'Mais vendido', 4.8, 98),
        _p('Hidratante Corporal Nutritivo',  'Com manteiga de karité e óleo de argan. Hidratação intensa por 48h para pele seca e sensível.',           'Corpo',           89.90, 'Novo', 4.7, 256),
        _p('Creme Facial Antissinais',       'Retinol 0.3% + peptídeos de cobre. Regenera a pele durante o sono e reduz linhas finas.',                 'Skincare',       159.90, 'Top', 4.9, 310),
        _p('Paleta de Sombras Nude',         'Paleta sofisticada com 12 tons neutros clássicos e acabamento matte aveludado.',                            'Maquiagem',      129.90, '', 4.8, 115),
        _p('Base Fluida HD',                 'Cobertura buildável de média a total com acabamento natural. Disponível em 40 tons inclusivos.',            'Maquiagem',      149.00, 'Novo', 4.7, 142),
        _p('Iluminador Glowing',             'Pó prensado com micropartículas reflectoras. Glow natural para bochechas e clavícula.',                   'Maquiagem',      119.00, 'Novo', 4.9, 88),
        _p('Óleo Facial Niacinamida',        'Soro com 10% de Niacinamida + Ácido Hialurônico. Poros minimizados e pele equilibrada.',                 'Skincare',       159.00, '', 4.6, 75),
    ],
    nycoly: [
        _p('Sérum Hidra Boost',          'Sérum com 3 tipos de ácido hialurônico. Preenche instantaneamente e hidrata em profundidade.',             'Skincare',       139.90, 'Novo'),
        _p('Batom Líquido Vibrante',     'Cor ultra pigmentada em acabamento cremoso. 20 tons intensos que duram o dia todo.',                      'Maquiagem',       69.90),
        _p('Máscara de Cílios Volume',   'Fórmula com fibras naturais que multiplicam o volume dos cílios sem grudar ou pesar.',                    'Maquiagem',       89.00, 'Bestseller'),
        _p('Paleta de Sombras Neon',     '12 cores ultravibrantes com alta pigmentação. Tons ousados para looks noturnos e festivais.',             'Maquiagem',      179.00),
        _p('Gloss Labial Iluminado',     'Gloss com efeito espelho e partículas holográficas. Volume natural e brilho intenso.',                   'Maquiagem',       59.90, 'Novo'),
        _p('Primer Poros Invisíveis',    'Base de silicone que prepara a pele, cobre poros e prolonga a durabilidade da maquiagem.',                'Maquiagem',      109.00),
        _p('Gel de Banho Exotic',        'Fragrância tropical exclusiva com extratos de maracujá e coco. Pele perfumada e suave.',                  'Corpo & Banho',   55.90),
        _p('Contorno em Bastão',         'Textura cremosa que se funde com a pele. Define maçãs do rosto e mandíbula com naturalidade.',            'Maquiagem',       79.00),
    ],
    glow_co: [
        _p('Sérum Botânico Concentrado', 'Extrato de rosa mosqueta + babosa orgânica. Hidrata, cicatriza e suaviza marcas de acne.',                'Skincare',       249.00, 'Bestseller'),
        _p('Óleo de Limpeza Facial',     'Blend de 5 óleos vegetais que dissolve maquiagem, protetor solar e impurezas suavemente.',                'Skincare',       169.00),
        _p('Tônico Floral Calmante',     'Água de rosas + extrato de camomila. Equilibra o pH, fecha poros e prepara para o sérum.',                'Skincare',       119.00, 'Novo'),
        _p('Máscara Argila Verde',       'Argila verde + carvão ativado + melaleuca. Desobstrui poros e controla a oleosidade.',                   'Skincare',        89.90),
        _p('Creme Barrier Repair',       'Ceramidas + ácidos graxos essenciais para restaurar a barreira protetora da pele sensível.',              'Skincare',       199.00),
        _p('Esfoliante Corporal Natural','Sal marinho + café + óleo de coco. Elimina células mortas e deixa a pele lisinha.',                     'Corpo & Banho',   75.90, 'Novo'),
        _p('Sérum Pele de Vidro',        'Ácido hialurônico de baixo peso molecular que penetra nas camadas mais profundas da pele.',               'Skincare',       279.00),
        _p('Protetor Solar Glow SPF50',  'Proteção total com acabamento luminoso. Fórmula leve que não embranquece e hidrata.',                     'Skincare',       139.00, 'Bestseller'),
    ],
    rose_lab: [
        _p('Sérum Rétinol Luxe',         'Retinol encapsulado 1% de liberação lenta. Antienvelhecimento premium com zero irritação.',               'Skincare',       349.00, 'Exclusivo'),
        _p('Creme Hidratante Pétalas',   'Extrato concentrado de rosa búlgara + colágeno marinho. Firmeza e luminosidade imediatas.',               'Skincare',       289.00),
        _p('Água Micelar Rosé',          'Remove maquiagem e impurezas em um único passo. Com extrato de rosa e pantenol.',                         'Skincare',       129.00, 'Novo'),
        _p('Óleo Seco Corporal',         'Blend de 7 óleos nobles: argan, jojoba, amêndoa, rosas, macadâmia e rosa mosqueta.',                     'Corpo & Banho',  219.00),
        _p('Base Sérum Luxe',            'Base fluida com ativos de skincare. Cobertura média com cuidado diário. Sem óleo.',                       'Maquiagem',      259.00, 'Bestseller'),
        _p('Blush Cremoso Rosé',         'Textura mousse que se funde perfeitamente com a pele. Tom rosé natural para um look de saúde.',           'Maquiagem',      149.00),
        _p('Máscara Noturna Facial',     'Sleeping mask com ácido glicólico e vitamina C que renova a pele enquanto você dorme.',                   'Skincare',       199.00, 'Novo'),
        _p('Perfume Rosé Elixir',        'Eau de parfum floral com notas de rosa, peônia e musk. Fragrância que dura até 24 horas.',                'Perfumes',       389.00, 'Exclusivo'),
    ],
    lumina: [
        _p('Sérum Hidratante Express',   'Hidratação instantânea. Ácido hialurônico + glicerina vegetal para todos os tipos de pele.',             'Skincare',        69.90, 'Oferta'),
        _p('BB Cream 5 em 1',            'Hidrata, protege, corrige, ilumina e cobre. O multitarefa perfeito para o dia a dia.',                   'Maquiagem',       79.90),
        _p('Kit Pincel Completo',        'Conjunto com 12 pincéis de pelo sintético ultrasuave para maquiagem profissional em casa.',               'Maquiagem',       99.90, 'Novo'),
        _p('Sabonete Facial Suave',      'Limpa sem ressecar. Com prebióticos que equilibram o microbioma da pele.',                               'Skincare',        45.90),
        _p('Creme Hidratante Facial',    'Textura leve e não oleosa que hidrata por 24h. Ideal para pele normal a mista.',                         'Skincare',        59.90),
        _p('Removedor Bifásico',         'Remove maquiagem à prova d\'água sem esfregar. Com óleo de girassol e água micelar.',                     'Skincare',        39.90, 'Oferta'),
        _p('Loção Corporal Pós-Sol',     'Aloe vera + vitamina E que acalma e recupera a pele após exposição solar.',                               'Corpo & Banho',   49.90, 'Novo'),
        _p('Corretivo Fluido',           'Cobertura total em 30 tons. Fórmula de longa duração com ácido hialurônico.',                             'Maquiagem',       64.90),
    ],
    // ── Cabelo & Tratamentos ──
    cabelo_house: [
        _p('Shampoo Reparador Intensivo', 'Queratina hidrolisada + proteínas da seda. Repara fios danificados e devolve o brilho.',                 'Cabelo',          89.90, 'Bestseller'),
        _p('Condicionador Hidra Liso',    'Óleo de argan + manteiga de karité. Hidrata profundamente e facilita a escovação.',                     'Cabelo',          79.90),
        _p('Máscara Capilar Nutritiva',   'Tratamento intensivo com 3 tipos de queratina. Fios sedosos com brilho espelhado.',                     'Cabelo',         119.00, 'Novo'),
        _p('Leave-in Proteção Total',     'Protege contra calor até 230°C, hidrata e controla o frizz sem pesar.',                                 'Cabelo',          69.90),
        _p('Óleo Capilar Luminoso',       'Blend de argan, macadâmia e abissínia. Finaliza, sela as pontas e dá brilho espelhado.',                'Cabelo',          99.90),
        _p('Finalizador Anti-Frizz',      'Creme de pentear que define os cachos e controla o volume por até 48h.',                                'Cabelo',          59.90, 'Oferta'),
        _p('Protetor Térmico Spray',      'Barreira protetora em spray que suporta o calor da chapinha sem ressecamento.',                         'Cabelo',          79.00, 'Novo'),
        _p('Shampoo Sem Sulfato',         'Fórmula suave que respeita o pH natural dos fios e do couro cabeludo.',                                 'Cabelo',          74.90),
    ],
    // ── Perfumes & Fragrâncias ──
    perfume_house: [
        _p('Perfume Floral Rosé',         'Eau de parfum com notas de rosa búlgara, jasmim e musk branco. Feminino e elegante.',                   'Perfumes',       299.00, 'Exclusivo'),
        _p('Eau de Parfum Noir',          'Fragrância oriental com baunilha, âmbar e sândalo. Intensa e envolvente para a noite.',                 'Perfumes',       349.00),
        _p('Body Splash Tropical',        'Refrescante e leve, com notas de maracujá, coco e baunilha. Perfeito para o dia a dia.',               'Perfumes',        59.90, 'Oferta'),
        _p('Colônia Fresh & Clean',       'Fragrância aquática e cítrica com bergamota e cedro. Versátil e duradoura.',                            'Perfumes',        99.90),
        _p('Eau de Toilette Blossom',     'Leveza floral de peônia e frésia com base de almíscar. Feminina e despretensiosa.',                     'Perfumes',       189.00, 'Novo'),
        _p('Deo Parfum Vanilla Gold',     'Fragrância cremosa e doce com baunilha, caramelo e sândalo. Quente e sofisticada.',                     'Perfumes',       129.00),
        _p('Perfume Frutal Vibrante',     'Eau de parfum com morango, ameixa e rosa. Jovial, alegre e duradouro.',                                 'Perfumes',       219.00, 'Bestseller'),
        _p('Eau de Parfum Green Zen',     'Fragrância vegetal com bambu, chá verde e cedro. Calma e minimalista.',                                 'Perfumes',       259.00),
    ],
    // ── Unhas & Nail Care ──
    unhas_studio: [
        _p('Esmalte Gel Longa Duração',   'Cor ultra intensa com efeito gel. Seca rápido e dura até 10 dias sem lascar.',                          'Unhas',           29.90, 'Bestseller'),
        _p('Base Fortalecedora de Unhas', 'Trata, fortalece e protege unhas fracas e quebradiças. Fórmula com cálcio e vitaminas.',                'Unhas',           24.90),
        _p('Top Coat Brilhante',          'Acabamento super brilhante que lacra o esmalte e prolonga a durabilidade.',                             'Unhas',           22.90, 'Novo'),
        _p('Esmalte Matte',               'Acabamento aveludado e fosco. Estilo moderno e contemporâneo.',                                         'Unhas',           27.90),
        _p('Óleo para Cutículas',         'Blend de jojoba, amêndoa e vitamina E que nutre e amolece as cutículas.',                              'Unhas',           19.90),
        _p('Removedor de Esmalte',        'Remove com suavidade qualquer esmalte. Sem acetona, com aloe vera.',                                    'Unhas',           15.90, 'Oferta'),
        _p('Esmalte Holográfico',         'Partículas holográficas que criam um efeito arco-íris na luz. Único e impactante.',                     'Unhas',           34.90, 'Novo'),
        _p('Kit Nail Art',                'Base, esmalte de cor, top coat e palito para nail arts profissionais em casa.',                          'Unhas',           69.90),
    ],
};

export { categoryImages };

const storeList = Object.values(storesData);

export const dataManager = {
    // Get custom products from localStorage
    getCustomProducts: () => {
        return JSON.parse(localStorage.getItem('ann_custom_products') || '[]');
    },

    // Save a new custom product
    addProduct: (product) => {
        const customs = dataManager.getCustomProducts();
        product.id = `custom-${Date.now()}`;
        product.code = `ANN-C${(customs.length + 1).toString().padStart(3, '0')}`;
        product.badge = 'Novo';
        if (!product.img || product.img.includes('photo-1556228720-195a672e8a03')) {
            product.img = getProductImage(product.name, product.cat || product.category);
        }
        customs.push(product);
        localStorage.setItem('ann_custom_products', JSON.stringify(customs));
        return product;
    },

    // Edit existing custom product
    editProduct: (productId, updates) => {
        const customs = dataManager.getCustomProducts();
        const idx = customs.findIndex(p => p.id === productId);
        if (idx > -1) {
            if (updates.name && (!updates.img || updates.img.includes('photo-1556228720-195a672e8a03'))) {
                updates.img = getProductImage(updates.name, updates.cat || updates.category);
            }
            customs[idx] = { ...customs[idx], ...updates };
            localStorage.setItem('ann_custom_products', JSON.stringify(customs));
            return customs[idx];
        }
        return null;
    },

    // Delete custom product
    deleteProduct: (productId) => {
        const customs = dataManager.getCustomProducts();
        const filtered = customs.filter(p => p.id !== productId);
        localStorage.setItem('ann_custom_products', JSON.stringify(filtered));
    },

    generateProducts: (count = 100) => {
        const overrides = JSON.parse(localStorage.getItem('ann_price_overrides') || '{}');
        const products = [];
        let globalIndex = 0;

        // Build full catalog: each store's products, uniquely identified
        for (const store of storeList) {
            const storeProds = storeProducts[store.id] || [];
            storeProds.forEach((template, localIdx) => {
                const id = `p-${store.id}-${localIdx}`;
                const code = `${store.id.substring(0, 3).toUpperCase()}-${(localIdx + 1).toString().padStart(3, '0')}`;
                const basePriceVal = template.price;
                const basePriceStr = `R$ ${basePriceVal.toFixed(2).replace('.', ',')}`;
                const price = overrides[id] || basePriceStr;
                let oldPrice = null;
                if (overrides[id]) {
                    const v = parseFloat(overrides[id].replace('R$ ', '').replace('.', '').replace(',', '.'));
                    if (v < basePriceVal) oldPrice = basePriceStr;
                }
                products.push({
                    id,
                    code,
                    name: template.name,
                    desc: template.desc,
                    price,
                    oldPrice,
                    cat: template.cat,
                    img: template.img,
                    company_id: store.id,
                    company_name: store.name,
                    company_photo: store.photo,
                    badge: template.badge || '',
                    rating: template.rating || (4.6 + (localIdx % 4) * 0.1).toFixed(1),
                    reviews: template.reviews || (80 + localIdx * 25),
                });
                globalIndex++;
            });
        }

        // If more products are requested, cycle through adding variants
        if (count > products.length) {
            const base = [...products];
            let extra = count - products.length;
            let varIdx = 0;
            while (extra > 0) {
                const src = base[varIdx % base.length];
                const id = `p-ext-${varIdx}`;
                const code = `EXT-${(varIdx + 1).toString().padStart(3, '0')}`;
                const basePriceVal = parseFloat(src.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
                const adjusted = basePriceVal * (0.85 + (varIdx % 5) * 0.08);
                const priceStr = `R$ ${adjusted.toFixed(2).replace('.', ',')}`;
                products.push({ ...src, id, code, price: priceStr, oldPrice: src.price, badge: '' });
                extra--;
                varIdx++;
            }
        }

        // Merge custom products on top
        const customs = dataManager.getCustomProducts();
        return [...customs, ...products.slice(0, count)];
    },

    generateVideos: (count = 100) => {
        const videos = [];
        for (let i = 0; i < count; i++) {
            const title = videoTitles[i % videoTitles.length];
            const img = videoImages[i % videoImages.length];
            const cats = ['Maquiagem', 'Skincare', 'Tutoriais', 'Rituais'];
            videos.push({
                id: `v-${i}`,
                title: `${title} #${i + 1}`,
                cat: cats[i % cats.length],
                time: `${Math.floor(Math.random() * 8) + 2}:${Math.floor(Math.random() * 50) + 10}`,
                img: img
            });
        }
        return videos;
    }
};
