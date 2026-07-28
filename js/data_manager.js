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
        photo: 'https://picsum.photos/seed/store_ann/300/300',
        cover: 'https://picsum.photos/seed/cover_ann/1200/400',
        phone: '(11) 99999-0001',
        address: 'Av. Paulista, 1000 — Bela Vista, São Paulo/SP',
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
        photo: '../img/nycoly_profile.png',
        cover: 'https://picsum.photos/seed/cover_nyc/1200/400',
        phone: '(21) 98888-0002',
        address: 'Rua do Catete, 200 — Flamengo, Rio de Janeiro/RJ',
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
        photo: 'https://picsum.photos/seed/store_glw/300/300',
        cover: 'https://picsum.photos/seed/cover_glw/1200/400',
        phone: '(41) 97777-0003',
        address: 'Rua XV de Novembro, 500 — Centro, Curitiba/PR',
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
        photo: 'https://picsum.photos/seed/store_rsl/300/300',
        cover: 'https://picsum.photos/seed/cover_rsl/1200/400',
        phone: '(51) 96666-0004',
        address: 'Av. Independência, 320 — Moinhos de Vento, Porto Alegre/RS',
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
        photo: 'https://picsum.photos/seed/store_lum/300/300',
        cover: 'https://picsum.photos/seed/cover_lum/1200/400',
        phone: '(31) 95555-0005',
        address: 'Av. do Contorno, 7000 — Savassi, Belo Horizonte/MG',
        rating: '4.6',
        reviews: 156,
        products: 130,
        delivery: '96.5%',
        followersBase: 620,
    },
};

const categoryImages = {
    'Skincare': [
        'https://picsum.photos/seed/sk1/500/500',
        'https://picsum.photos/seed/sk2/500/500',
        'https://picsum.photos/seed/sk3/500/500',
        'https://picsum.photos/seed/sk4/500/500'
    ],
    'Maquiagem': [
        'https://picsum.photos/seed/mq1/500/500',
        'https://picsum.photos/seed/mq2/500/500',
        'https://picsum.photos/seed/mq3/500/500',
        'https://picsum.photos/seed/mq4/500/500'
    ],
    'Corpo & Banho': [
        'https://picsum.photos/seed/cb1/500/500',
        'https://picsum.photos/seed/cb2/500/500',
        'https://picsum.photos/seed/cb3/500/500',
        'https://picsum.photos/seed/cb4/500/500'
    ]
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

// Rich per-company product catalog with unique images, descriptions and prices
const storeProducts = {
    ann_beauty: [
        { name: 'Sérum Facial Vitamina C', desc: 'Fórmula exclusiva com 15% de Vitamina C pura. Clareia manchas e unifica o tom da pele em 2 semanas.', cat: 'Skincare', price: 189.90, img: 'https://loremflickr.com/500/500/vitamin,serum,skincare?lock=101', badge: 'Bestseller' },
        { name: 'Base Fluida HD', desc: 'Cobertura buildável de média a total com acabamento natural. Disponível em 40 tons inclusivos.', cat: 'Maquiagem', price: 149.00, img: 'https://loremflickr.com/500/500/foundation,makeup?lock=102', badge: 'Novo' },
        { name: 'Loção Corporal Nutritiva', desc: 'Com manteiga de karité e óleo de argan. Hidratação intensa por 48h para pele seca e sensível.', cat: 'Corpo & Banho', price: 89.90, img: 'https://loremflickr.com/500/500/body,lotion,moisturizer?lock=103', badge: '' },
        { name: 'Creme Noturno Reparador', desc: 'Retinol 0.3% + peptídeos de cobre. Regenera a pele durante o sono e reduz linhas finas.', cat: 'Skincare', price: 219.00, img: 'https://loremflickr.com/500/500/skincare,cream,jar?lock=104', badge: '' },
        { name: 'Batom Matte Duradouro', desc: 'Pigmentação intensa com até 12h de duração. Formula com vitamina E para não ressecar.', cat: 'Maquiagem', price: 79.90, img: 'https://loremflickr.com/500/500/lipstick,matte?lock=105', badge: '' },
        { name: 'Iluminador Glowing', desc: 'Pó prensado com micropartículas reflectoras. Dá aquele glow natural para bochechas e clavícula.', cat: 'Maquiagem', price: 119.00, img: 'https://loremflickr.com/500/500/highlighter,makeup,glow?lock=106', badge: 'Novo' },
        { name: 'Óleo Facial Niacinamida', desc: 'Soro com 10% de Niacinamida + Ácido Hialurônico. Poros minimizados e pele equilibrada.', cat: 'Skincare', price: 159.00, img: 'https://loremflickr.com/500/500/face,oil,serum?lock=107', badge: '' },
        { name: 'Esfoliante Facial', desc: 'Grãos ultrafinos de açúcar + ácido glicólico. Renova a pele sem agredir a barreira cutânea.', cat: 'Skincare', price: 99.90, img: 'https://loremflickr.com/500/500/face,scrub,exfoliant?lock=108', badge: '' },
    ],
    nycoly: [
        { name: 'Sérum Hidra Boost', desc: 'Sérum com 3 tipos de ácido hialurônico. Preenche instantaneamente e hidrata em profundidade.', cat: 'Skincare', price: 139.90, img: 'https://loremflickr.com/500/500/hyaluronic,serum?lock=201', badge: 'Novo' },
        { name: 'Batom Líquido Vibrante', desc: 'Cor ultra pigmentada em acabamento cremoso. 20 tons intensos que duram o dia todo.', cat: 'Maquiagem', price: 69.90, img: 'https://loremflickr.com/500/500/liquid,lipstick,red?lock=202', badge: '' },
        { name: 'Máscara de Cílios Volume', desc: 'Fórmula com fibras naturais que multiplicam o volume dos cílios sem grudar ou pesar.', cat: 'Maquiagem', price: 89.00, img: 'https://loremflickr.com/500/500/mascara,eyelash?lock=203', badge: 'Bestseller' },
        { name: 'Paleta de Sombras Neon', desc: '12 cores ultravibrantes com alta pigmentação. Tons ousados para looks noturnos e festivais.', cat: 'Maquiagem', price: 179.00, img: 'https://loremflickr.com/500/500/eyeshadow,palette,makeup?lock=204', badge: '' },
        { name: 'Gloss Labial Iluminado', desc: 'Gloss com espelho d\'água e partículas holográficas. Volume natural e brilho intenso.', cat: 'Maquiagem', price: 59.90, img: 'https://loremflickr.com/500/500/lip,gloss,shine?lock=205', badge: 'Novo' },
        { name: 'Primer Poros Invisíveis', desc: 'Base de silicone que prepara a pele, cobre poros e prolonga a durabilidade da maquiagem.', cat: 'Maquiagem', price: 109.00, img: 'https://loremflickr.com/500/500/primer,makeup,pores?lock=206', badge: '' },
        { name: 'Gel de Banho Exotic', desc: 'Fragrância tropical exclusiva com extratos de maracujá e coco. Pele perfumada e suave.', cat: 'Corpo & Banho', price: 55.90, img: 'https://loremflickr.com/500/500/shower,gel,bath?lock=207', badge: '' },
        { name: 'Contorno em Bastão', desc: 'Textura cremosa que se funde com a pele. Define maçãs do rosto e mandíbula com naturalidade.', cat: 'Maquiagem', price: 79.00, img: 'https://loremflickr.com/500/500/contour,makeup,blush?lock=208', badge: '' },
    ],
    glow_co: [
        { name: 'Sérum Botânico Concentrado', desc: 'Extrato de rosa mosqueta + babosa orgânica. Hidrata, cicatriza e suaviza marcas de acne.', cat: 'Skincare', price: 249.00, img: 'https://loremflickr.com/500/500/botanical,serum,organic?lock=301', badge: 'Bestseller' },
        { name: 'Óleo de Limpeza Facial', desc: 'Blend de 5 óleos vegetais que dissolve maquiagem, protetor solar e impurezas suavemente.', cat: 'Skincare', price: 169.00, img: 'https://loremflickr.com/500/500/cleansing,oil,skincare?lock=302', badge: '' },
        { name: 'Tônico Floral Calmante', desc: 'Água de rosas + extrato de camomila. Equilibra o pH, fecha poros e prepara para o sérum.', cat: 'Skincare', price: 119.00, img: 'https://loremflickr.com/500/500/toner,rosewater,floral?lock=303', badge: 'Novo' },
        { name: 'Máscara Argila Verde', desc: 'Argila verde + carvão ativado + melaleuca. Desobstrui poros e controla a oleosidade da pele.', cat: 'Skincare', price: 89.90, img: 'https://loremflickr.com/500/500/clay,mask,skincare?lock=304', badge: '' },
        { name: 'Creme Barrier Repair', desc: 'Ceramidas + ácidos graxos essenciais para restaurar a barreira protetora da pele sensível.', cat: 'Skincare', price: 199.00, img: 'https://loremflickr.com/500/500/moisturizer,cream,skincare?lock=305', badge: '' },
        { name: 'Esfoliante Corporal Natural', desc: 'Sal marinho + café + óleo de coco. Elimina células mortas e deixa a pele lisinha e sedosa.', cat: 'Corpo & Banho', price: 75.90, img: 'https://loremflickr.com/500/500/body,scrub,coffee?lock=306', badge: 'Novo' },
        { name: 'Sérum Pele de Vidro', desc: 'Ácido hialurônico de baixo peso molecular que penetra nas camadas mais profundas da pele.', cat: 'Skincare', price: 279.00, img: 'https://loremflickr.com/500/500/glass,skin,serum?lock=307', badge: '' },
        { name: 'Protetor Solar Glow SPF50', desc: 'Proteção total com acabamento brilhante. Fórmula leve que não embranquece e hidrata.', cat: 'Skincare', price: 139.00, img: 'https://loremflickr.com/500/500/sunscreen,spf,sunblock?lock=308', badge: 'Bestseller' },
    ],
    rose_lab: [
        { name: 'Sérum Rétinol Luxe', desc: 'Retinol encapsulado 1% de liberação lenta. Antienvelhecimento premium com zero irritação.', cat: 'Skincare', price: 349.00, img: 'https://loremflickr.com/500/500/retinol,antiaging,serum?lock=401', badge: 'Exclusivo' },
        { name: 'Creme Pétalas de Rosa', desc: 'Extrato concentrado de rosa búlgara + colágeno marinho. Firmeza e luminosidade imediatas.', cat: 'Skincare', price: 289.00, img: 'https://loremflickr.com/500/500/rose,cream,luxury?lock=402', badge: '' },
        { name: 'Água Micelar Rosé', desc: 'Remove maquiagem e impurezas em um único passo. Com extrato de rosa e pantenol.', cat: 'Skincare', price: 129.00, img: 'https://loremflickr.com/500/500/micellar,water,cleanser?lock=403', badge: 'Novo' },
        { name: 'Óleo Seco Corporal', desc: 'Blend de 7 óleos nobles: argan, jojoba, amêndoa, rosas, macadâmia, rosa mosqueta e baobá.', cat: 'Corpo & Banho', price: 219.00, img: 'https://loremflickr.com/500/500/dry,oil,body?lock=404', badge: '' },
        { name: 'Base Serum Luxe', desc: 'Base fluida com ativos de skincare. Cobertura media com cuidado diário. Sem óleo e não comedogênica.', cat: 'Maquiagem', price: 259.00, img: 'https://loremflickr.com/500/500/foundation,serum,luxury?lock=405', badge: 'Bestseller' },
        { name: 'Blush Cremoso Rosé', desc: 'Textura mousse que se funde perfeitamente com a pele. Tom rosé natural para um look de saúde.', cat: 'Maquiagem', price: 149.00, img: 'https://loremflickr.com/500/500/blush,cheek,makeup?lock=406', badge: '' },
        { name: 'Máscara Noturna Glow', desc: 'Sleeping mask com ácido glicólico e vitamina C que renova a pele enquanto você dorme.', cat: 'Skincare', price: 199.00, img: 'https://loremflickr.com/500/500/sleeping,mask,overnight?lock=407', badge: 'Novo' },
        { name: 'Perfume Rosé Elixir', desc: 'Eau de parfum floral com notas de rosa, peônia e musk. Fragrância que dura até 24 horas.', cat: 'Corpo & Banho', price: 389.00, img: 'https://loremflickr.com/500/500/perfume,fragrance,bottle?lock=408', badge: 'Exclusivo' },
    ],
    lumina: [
        { name: 'Sérum Hidratante Express', desc: 'Hidratação instantânea e acessível. Ácido hialurônico + glicerina vegetal para todos os tipos de pele.', cat: 'Skincare', price: 69.90, img: 'https://loremflickr.com/500/500/hydrating,serum,skincare?lock=501', badge: 'Oferta' },
        { name: 'BB Cream 5 em 1', desc: 'Hidrata, protege, corrige, ilumina e cobre. O multitarefa perfeito para o dia a dia corrido.', cat: 'Maquiagem', price: 79.90, img: 'https://loremflickr.com/500/500/bb,cream,makeup?lock=502', badge: '' },
        { name: 'Kit Pincel Completo', desc: 'Conjunto com 12 pincéis de pelo sintético ultrasuave. Perfeitos para maquiagem profissional em casa.', cat: 'Maquiagem', price: 99.90, img: 'https://loremflickr.com/500/500/makeup,brushes,kit?lock=503', badge: 'Novo' },
        { name: 'Sabonete Facial Suave', desc: 'Limpa sem ressecar. Com prebióticos que equilibram o microbioma da pele e reduzem vermelhidão.', cat: 'Skincare', price: 45.90, img: 'https://loremflickr.com/500/500/face,wash,cleanser?lock=504', badge: '' },
        { name: 'Creme Hidratante Rosto', desc: 'Textura leve e não oleosa que hidrata por 24h. Ideal para pele normal a mista.', cat: 'Skincare', price: 59.90, img: 'https://loremflickr.com/500/500/face,moisturizer,cream?lock=505', badge: '' },
        { name: 'Removedor Bifásico', desc: 'Remove maquiagem à prova d\'água sem esfregar. Com óleo de girassol e água micelar.', cat: 'Skincare', price: 39.90, img: 'https://loremflickr.com/500/500/makeup,remover,cleanser?lock=506', badge: 'Oferta' },
        { name: 'Loção Pós-Sol', desc: 'Aloe vera + vitamina E que acalma, refresca e recupera a pele após exposição solar.', cat: 'Corpo & Banho', price: 49.90, img: 'https://loremflickr.com/500/500/aftersun,aloe,lotion?lock=507', badge: 'Novo' },
        { name: 'Corretivo Fluido', desc: 'Cobertura total em 30 tons. Fórmula de longa duração com ácido hialurônico para não caducar.', cat: 'Maquiagem', price: 64.90, img: 'https://loremflickr.com/500/500/concealer,makeup,coverage?lock=508', badge: '' },
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
        customs.push(product);
        localStorage.setItem('ann_custom_products', JSON.stringify(customs));
        return product;
    },

    // Edit existing custom product
    editProduct: (productId, updates) => {
        const customs = dataManager.getCustomProducts();
        const idx = customs.findIndex(p => p.id === productId);
        if (idx > -1) {
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
                    badge: template.badge || (globalIndex < 5 ? 'Novo' : ''),
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
