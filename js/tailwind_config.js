tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // ── Paleta Beleza na Web ────
                // Fundo com toque suave lilás
                "background":                "#F6F5FB",
                "surface":                   "#FFFFFF",
                "surface-bright":            "#FFFFFF",
                "surface-dim":               "#E8DDEF",
                "surface-container":         "#F3EDF8",
                "surface-container-low":     "#F8F4FB",
                "surface-container-high":    "#E8DDEF",
                "surface-container-highest": "#DDD0E8",
                "surface-tint":              "#9B6DC2",

                // ── Cor Primária — Roxo Vibrante ────────────────────
                "primary":                   "#8B5FBF",
                "primary-dark":              "#6B3FA0",
                "primary-light":             "#C4A8E0",
                "primary-container":         "#E8D8F4",
                "on-primary":                "#FFFFFF",
                "on-primary-container":      "#5A3388",

                // ── Cor Secundária — Lilás Médio ─────────────────────
                "secondary":                 "#D4BDE8",
                "secondary-container":       "#E8D8F4",
                "on-secondary":              "#5A3388",
                "on-secondary-container":    "#5A3388",

                // ── Terciária ─────────────────────────────────────
                "tertiary":                  "#E0CCF2",
                "tertiary-container":        "#D4BDE8",
                "on-tertiary-container":     "#2D1A40",

                // ── Textos — Forte e legível ──────────────────────
                "on-background":             "#1E1228",
                "on-surface":                "#1E1228",
                "on-surface-variant":        "#5C4D6B",

                // ── Contornos ─────────────────────────────────────
                "outline":                   "#C4A8E0",
                "outline-variant":           "#DDD0E8",

                // ── Inversos ──────────────────────────────────────
                "inverse-surface":           "#2D1A40",
                "inverse-on-surface":        "#F3EDF8",
                "inverse-primary":           "#D4BDE8",

                // ── Fixed ─────────────────────────────────────────
                "primary-fixed":             "#E8D8F4",
                "primary-fixed-dim":         "#D4BDE8",
                "on-primary-fixed":          "#2D1A40",
                "on-primary-fixed-variant":  "#6B3FA0",
                "secondary-fixed":           "#E8D8F4",
                "secondary-fixed-dim":       "#D4BDE8",
                "on-secondary-fixed":        "#2D1A40",
                "on-secondary-fixed-variant":"#6B3FA0",
                "tertiary-fixed":            "#D4BDE8",
                "tertiary-fixed-dim":        "#E0CCF2",
                "on-tertiary-fixed":         "#FFFFFF",
                "on-tertiary-fixed-variant": "#6B3FA0",

                // ── Status ────────────────────────────────────────
                "error":                     "#C25A6A",
                "on-error":                  "#FFFFFF",
                "success":                   "#4E9E6D",
                "on-success":                "#FFFFFF",

                // ── Aliases de conveniência ───────────────────────
                "beauty-bg":                 "#F3EDF8",
                "beauty-border":             "#DDD0E8",
                "beauty-text":               "#1E1228",
                "beauty-text-soft":          "#5C4D6B",
                "beauty-lilac":              "#D4BDE8",
                "beauty-lilac-light":        "#E8D8F4",
                "beauty-purple":             "#8B5FBF",
                "beauty-purple-dark":        "#6B3FA0",
                "beauty-purple-pastel":      "#C4A8E0"
            },
            borderRadius: {
                "DEFAULT": "0.375rem",
                "sm":    "0.25rem",
                "md":    "0.5rem",
                "lg":    "0.75rem",
                "xl":    "1rem",
                "2xl":   "1.25rem",
                "3xl":   "1.5rem",
                "4xl":   "2rem",
                "full":  "9999px"
            },
            spacing: {
                "base":          "8px",
                "container-max": "1280px",
                "stack-sm":      "12px",
                "margin-mobile": "16px",
                "stack-lg":      "48px",
                "gutter":        "24px",
                "stack-md":      "24px",
                "margin-desktop":"40px"
            },
            fontFamily: {
                "display":     ["Poppins", "sans-serif"],
                "serif":       ["Poppins", "sans-serif"],
                "headline-xl": ["Poppins", "sans-serif"],
                "headline-md": ["Poppins", "sans-serif"],
                "display-lg":  ["Poppins", "sans-serif"],
                "body":        ["Inter", "sans-serif"],
                "body-lg":     ["Inter", "sans-serif"],
                "body-md":     ["Inter", "sans-serif"],
                "body-sm":     ["Inter", "sans-serif"],
                "label-sm":    ["Inter", "sans-serif"],
                "label-md":    ["Inter", "sans-serif"]
            },
            fontSize: {
                "label-sm":    ["11px", { lineHeight: "1.2", letterSpacing: "0.08em", fontWeight: "600" }],
                "body-lg":     ["18px", { lineHeight: "1.6", fontWeight: "400" }],
                "display-lg":  ["52px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
                "label-md":    ["13px", { lineHeight: "1.2", letterSpacing: "0.06em", fontWeight: "600" }],
                "headline-xl": ["34px", { lineHeight: "1.25", fontWeight: "600" }],
                "body-sm":     ["14px", { lineHeight: "1.5", fontWeight: "400" }],
                "body-md":     ["16px", { lineHeight: "1.6", fontWeight: "400" }],
                "headline-md": ["24px", { lineHeight: "1.4", fontWeight: "600" }]
            },
            boxShadow: {
                "luxury":       "0 2px 20px -4px rgba(139, 95, 191, 0.14)",
                "luxury-hover": "0 8px 32px -4px rgba(139, 95, 191, 0.24)",
                "luxury-card":  "0 1px 8px -2px rgba(139, 95, 191, 0.10), 0 4px 16px -4px rgba(139, 95, 191, 0.14)",
                "ethereal":     "0 4px 24px -6px rgba(139, 95, 191, 0.16)",
                "ethereal-hover":"0 12px 40px -8px rgba(139, 95, 191, 0.26)"
            }
        }
    }
};
