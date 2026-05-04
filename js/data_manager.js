/**
 * Data Manager for A.n.n Beauty
 * Generates and manages the large catalog of products and videos.
 */

const productImages = [
    'AB6AXuBoSml9a2Sq7qZoOQdUD8cBxSOMeKA3_ODlbLSV57E-PeV_dYTi6Xar8d-ZbqCdVDRnxuQFzdoC4tg_Hhl7AcTowJgqQx9qAf6xLa67tm8fyFN0eZzneKLN3XNy8VGEK2ZMqoeKtSL1ds3kE6Ty8ZQCsLYqIcin7flYpMzyP2k12BBYPOCuBCBc26GQdRvvywwgGkT4KP1T6tobWWqTSwAn0nQXwRMkmo7QkaFvs_K4FcXATcKyxWSH9ZSF-dwSo6Vc_IPCNfqdnCF5',
    'AB6AXuCTXHEqLFQPw5zX70ucVslqE5v58aFYT-h2QhAF23WbKG9zCIRlnWUAoHnHSHQWpLE8wAZUvpJrK-tlWh33Uyc67P_oBpaqtqF0rypcAi-40cNEKBGN0Au5x3YkCDyFH6BesNlQEkQG0a5l8TF_-4T194V_PfCxm5e3UMi86_K_kNuwF7ENg1g9U2hHHBYbnKK5qCgYXbnaeeoBWuX1lqW3XyxYMbbyzmS8kgkMPOcJ_QDW6GUTZurpKEUiWof2_7X85evGcoUb5PsF',
    'AB6AXuD18GXwV-Fkc6wDo7J4wrXsDQej-dEfgu5VImTb9uItwdNW88u_1yCxDVF9on8jlVNCPo-eKZEl9aNMrTISfydrBo8SR077DCvYnLcSDxEAalZqqw8TZ3jpvZRULCa0zP9BNNQ-i470VZ5EDn7JHQ2btfru-a-pTCf15BaEHzY9QZpQAus_V57bsYk-VpSr7PEucVXEHnd0d4RBqKFQaBZaW1EDR4bo-Ej6RqvwLps8AyPi3RQMWfHu9arWD8Wneoh9RG_l1BG98xQC',
    'AB6AXuDfWZeYH0RfUox3HFNX-ZuvCiQhPcXY6GFg0aGybVs1Fs_SVFneI_D8qAuRRGQwQRrOjM2fHVNAau_wjxCoO8X_Gdu3whd8QMkWzJNvLHnVPr0ta-eHqN96IQcg22YKTrNzNp-na9A_2WHuZNw33NX_Cdldo9RKv9S4FNHSuYUaV9URstXl9ieuB1yiJDWT3kgUIPJ60uRm0fJofzQ9N-OJ4y2GbkymIz_MtT3QuZrQgb_DRILOV8xRTcv52M_BlrSLhlnFEP2ltVfy',
    'AB6AXuD2hgcce4O4kspOlwrAyGVp1tZHMK7994wnWpmyaFo0vhwHc_Z52AT1CxU84ee0LiolAcBNli5gigKQXF0Dqgev6FvdgM7ZqMF-rzpv3LcA360cpBbxhZ5W_noP_He0k6JMIrNeiGfuuh8pyTo32Q1i7i6yglAzNsQ8-C1o7SsmCL27GTuLOBgpG3lsla1CoLb6xeJkA_KjZdVrQspe5_YoRDjy-NpYJe0scznMd4KOnQj70J15rPgOJEmPSZolP1mFXPvFoW29P0VZ',
    'AB6AXuCe1GWq4h3fP1-1ukYU9GBOpvNc883t2rkTuwOkHZLcScMdqSOIgz_m8Gm2nFE5btCRETL2pylFCkqS6mw3Jl19U958tiTy_FMlDerxqULaphgQvnv00MtYLcYqmelwvEoF2VkjqcWaK3cP_21UeRU6DwTMRT35v_R38AozN3xL9i5q1BthB9_BIWw8djLGgDCBk6cvuj-25rf99iKDGaY2kb2LY8GVAHRmZDTzAp_xzCg-YdXXfrxwHimmSJatHwic4EaxjN5hqLvg',
    'AB6AXuAjWqD3Tsv5scFZNt8XXTqsP_LXiYhX-m8P_UNYqjKCLIAI0NkDj4Xty254sKOUES7tBOlzRGmRYEGurxwwS7TS0ypuxeNSbE9enhR2E4HkxzMkEx5APNAanPAl8eFh1gNvxRfqWFGyRwpWvBMGHMyuX7ZHC1TuPbeoXgpY8XytnIKpuBolqxnzU9AGm3-XQ0BeNGzVFX7T_NNrJUxYnKep_QX62dGkwi_olJ19iFe72vpASHaHmEywLpB0FpKZEGWH3cqeDpnbxqYv'
];

const videoImages = [
    'AB6AXuA0aB4buqqgmFalZY_yrYrGGIj8X-ArLG976VPWI84b9rGp_r4t4xkjx9ll4vut7hPFKJul2z2brx3W_kVp5TinaWdjJ9gSqRCzY3vMRfTzmRTTxfIyCBHm91eRCDHaSMWFvNTEmEd0rqN5u_XUYefL8fi8LYzd_o5DgMs6lZpn4K31z1zDT_0auNNoOmR2Dl-0WZaslZbjjGW0O7t-QEbC4v0H_TqVmUy7ALooScm9uyOSfnmspx8M3Vr2eA4IIdmJdC3OrmK3fGEI',
    'AB6AXuCsb0X9za5E14wyiYdZ7-b-qjww8m01AdekvJ1iHfEl4iD6UPWK20u9sShLmVu_U-ZY3ocqbytdMZZa5R-ScTHvXbWHtpwsu-gUkuxExrc8jwOGiHgMbWJzET4fhk5nHXCutGh0txsY-mYiCcjStm-nFXSFyb7jpW7gkFDXUgBf7tV7f_axlA680zf_MmvJjpzprCwU-00uruyInoEDmt5vQN_eb08epGxxtc8sLbNYUHS9rzikWJejX0i_DZDHGZMKJHiSRL_fIOrS',
    'AB6AXuBAJMMiPjMspADE4iF7Uv_VIRtOUTN4oSwDH5l6rW4aeqncBkCQ6SaL5RebUh16pdoZOm9YJHQa8JZHA8APOj4obt4VSdrdqvj0u_IQs1kuD11ZA76xd3wsDJjSEGsrLbtVMIyAY2b9y8kJYna2q8Ti3o75sqVejGW2-qovCQOGPBYDvBbG3Sr9CRCDZ_cbpxdx-Qpw70FYHo0BOuLIk-TSGO-rvZBqeWO2UQknJO1QSIDEU5b7T9E7gCzBK42Eidcc9Nn7yfQV509t',
    'AB6AXuAtWOSKckDEZJK6xwvM2u7sMOI1jH_kXM43iFoaUVPTaWE4kbKtQgX1R5fIR_9AM3XVvp4U5ZgDj191cOFk0Im8b50TgS1MkN5hzInG4PTb0YTreGJGbtebmF6fgKznrsgnw5Kg8A13MV9nlIrazeDAesZqHGZEtEYEJVDXNhZ1VWWe_dZufxLv0mdRuZnhjWnbn_FShSjXvUa9wLB_bF2QpwKnHXrCuZ2BqwNj7Mr4qnR36L_DlfFVQRlnPCm8KFOOOXCto3Wle3Up',
    'AB6AXuCMIsmJ-AadvSze3EqTlRffxMHD3ZJS-gEOhGK5XRbq88_AZPwFH7aZBh9P2bECMeId6B8RAUxJz7Hv76FYG6QbzhZyrL65ipUryA_JiojsbOqb65DiTeb8orIUvmLWBNsUcdSNXfJErVceduA8jAic_SL3wk-alEmNleweWxoJLayiDGEEoPt-XwnSX2hIH682CGK8yUtHi3wxhQPwPPVyS17r1Tp0zUmjpQJgGSOpfr1Z6hU1lZeUk2hBDGs-m7JVZR5TIfmLVtfT'
];

const productTypes = [
    { name: 'Sérum', desc: 'Hidratação profunda e brilho natural.', cat: 'Skincare' },
    { name: 'Batom Matte', desc: 'Cor intensa e longa duração.', cat: 'Maquiagem' },
    { name: 'Base Fluida', desc: 'Acabamento natural e leve.', cat: 'Maquiagem' },
    { name: 'Creme Noturno', desc: 'Renovação celular enquanto você dorme.', cat: 'Skincare' },
    { name: 'Máscara de Cílios', desc: 'Volume dramático e definição.', cat: 'Maquiagem' },
    { name: 'Iluminador Glow', desc: 'Brilho celestial para todos os tons.', cat: 'Maquiagem' },
    { name: 'Óleo de Limpeza', desc: 'Remove impurezas suavemente.', cat: 'Skincare' },
    { name: 'Paleta de Sombras', desc: 'Cores vibrantes e pigmentadas.', cat: 'Maquiagem' }
];

const videoTitles = [
    'Tutorial de Delineado', 'Rotina Matinal', 'Make para Noite', 'Dicas de Skincare',
    'Como usar Retinol', 'Batom que não sai', 'Pele de Vidro', 'Contorno Perfeito',
    'Preparação de Pele', 'Removendo Make', 'Ritual de Spa', 'Favoritos do Mês'
];

export const dataManager = {
    generateProducts: (count = 100) => {
        const products = [];
        for (let i = 0; i < count; i++) {
            const type = productTypes[i % productTypes.length];
            const img = productImages[i % productImages.length];
            const price = (Math.random() * (250 - 45) + 45).toFixed(2);
            products.push({
                id: `p-${i}`,
                name: `${type.name} ${['Luxury', 'Pro', 'Velvet', 'Pure', 'Gold', 'Elite'][i % 6]}`,
                desc: type.desc,
                price: `R$ ${price.replace('.', ',')}`,
                cat: type.cat,
                img: img,
                badge: i < 10 ? 'Novo' : (i % 15 === 0 ? 'Bestseller' : '')
            });
        }
        return products;
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
