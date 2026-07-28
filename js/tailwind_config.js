tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "background": "#EBE1D7",
                "surface": "#F7EBE8",     // Nude tone for cards
                "primary": "#8967B3",     // Main Purple
                "primary-container": "#F1EBF7", 
                "on-primary-container": "#4A2E6B",
                "secondary": "#CF5A9C",   // Main Magenta
                "secondary-container": "#FBF0F6", 
                "on-secondary-container": "#802358", 
                "tertiary": "#A486CA",    
                "tertiary-container": "#F8F4FD",
                "on-tertiary-container": "#31184F",
                "error": "#BA1A1A", 
                "on-error": "#FFFFFF",
                "on-background": "#2C2233", // Elegant dark purple-gray text
                "on-surface": "#2C2233",    
                "on-surface-variant": "#584B61",
                "outline": "#C2A9DF",
                "outline-variant": "#EBE2F5",
                "surface-container": "#F6F1F8",
                "surface-container-low": "#EBE1D7",
                "surface-container-high": "#EFE6FA",
                "surface-container-highest": "#E5D9F2",
                "surface-bright": "#F7EBE8", // Nude tone
                "surface-dim": "#EFE6F0",
                "surface-tint": "#8967B3",
                "inverse-surface": "#31184F",
                "inverse-on-surface": "#F1EBF7",
                "inverse-primary": "#C2A9DF",
                "primary-fixed": "#EBE2F5",
                "primary-fixed-dim": "#C2A9DF",
                "on-primary-fixed": "#31184F",
                "on-primary-fixed-variant": "#4E3E61",
                "secondary-fixed": "#FBF0F6",
                "secondary-fixed-dim": "#EDB4D2",
                "on-secondary-fixed": "#4D1131",
                "on-secondary-fixed-variant": "#802358",
                "tertiary-fixed": "#F8F4FD",
                "tertiary-fixed-dim": "#DDD0F0",
                "on-tertiary-fixed": "#1A1124",
                "on-tertiary-fixed-variant": "#4E3E61"
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            spacing: {
                "base": "8px",
                "container-max": "1280px",
                "stack-sm": "12px",
                "margin-mobile": "16px",
                "stack-lg": "48px",
                "gutter": "24px",
                "stack-md": "24px",
                "margin-desktop": "40px"
            },
            fontFamily: {
                "label-sm": ["Plus Jakarta Sans"],
                "body-lg": ["Plus Jakarta Sans"],
                "display-lg": ["Noto Serif"],
                "label-md": ["Plus Jakarta Sans"],
                "headline-xl": ["Noto Serif"],
                "body-sm": ["Plus Jakarta Sans"],
                "body-md": ["Plus Jakarta Sans"],
                "headline-md": ["Noto Serif"]
            },
            fontSize: {
                "label-sm": ["12px", { lineHeight: "1.2", letterSpacing: "0.08em", fontWeight: "700" }],
                "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
                "display-lg": ["48px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
                "label-md": ["14px", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "600" }],
                "headline-xl": ["36px", { lineHeight: "1.3", fontWeight: "500" }],
                "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
                "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
                "headline-md": ["24px", { lineHeight: "1.4", fontWeight: "500" }]
            }
        }
    }
};
