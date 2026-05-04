---
name: Luminous Ethereal
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#494550'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#7a7581'
  outline-variant: '#cac4d2'
  surface-tint: '#66519f'
  primary: '#54408c'
  on-primary: '#ffffff'
  primary-container: '#6d58a6'
  on-primary-container: '#e9deff'
  inverse-primary: '#cfbdff'
  secondary: '#6c586d'
  on-secondary: '#ffffff'
  secondary-container: '#f5daf4'
  on-secondary-container: '#725e73'
  tertiary: '#5e474a'
  on-tertiary: '#ffffff'
  tertiary-container: '#775f62'
  on-tertiary-container: '#fcdbde'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbdff'
  on-primary-fixed: '#220458'
  on-primary-fixed-variant: '#4e3985'
  secondary-fixed: '#f5daf4'
  secondary-fixed-dim: '#d8bfd8'
  on-secondary-fixed: '#251628'
  on-secondary-fixed-variant: '#534155'
  tertiary-fixed: '#fbdbde'
  tertiary-fixed-dim: '#debfc2'
  on-tertiary-fixed: '#281719'
  on-tertiary-fixed-variant: '#574144'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Noto Serif
    fontSize: 36px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system is anchored in a "Luminous Ethereal" aesthetic, blending the precision of high-end clinical skincare with the soft, sensory indulgence of luxury cosmetics. The brand personality is sophisticated, gentle, and authoritative, targeting a discerning audience that values both scientific efficacy and aesthetic ritual.

The visual style employs a refined **Minimalism** enriched with subtle **Glassmorphism**. By utilizing generous whitespace and translucent layers, the interface feels breathable and premium. The goal is to evoke a sense of calm and clarity, allowing high-quality product photography to serve as the primary visual anchor. The aesthetic is intentionally feminine but maintains a professional, modern edge through structured layouts and disciplined color application.

## Colors

The color palette is built on a foundation of "Petal Tones." The primary purple provides necessary contrast for call-to-action elements and core branding, while the secondary lilac acts as the primary atmospheric hue. Soft pink is reserved for delicate accents, such as notification badges, sale indicators, or hover states on interactive icons.

Backgrounds utilize a tiered neutral system. The base layer is a pristine white, while secondary containers and section breaks use a very light gray to provide subtle structural definition without breaking the minimalist flow. This ensures the vibrant purples and soft pinks feel intentional and radiant rather than overwhelming.

## Typography

The typographic strategy relies on a high-contrast pairing that balances editorial heritage with modern usability. **Noto Serif** is used for all major headings and product titles, providing a classic, premium feel that echoes luxury beauty packaging. 

For functional text, **Plus Jakarta Sans** is selected for its approachable, contemporary character and high legibility at small sizes. Its slightly rounded terminals complement the overall softness of the design system. Label styles often use uppercase with increased letter spacing to create a sense of hierarchy and professional categorization in navigation and product metadata.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model for desktop to ensure a curated, editorial look, while transitioning to a fluid model for mobile devices. The layout is structured on a 12-column grid with generous 24px gutters to prevent visual clutter.

Spacing follows a strict 8px base unit, prioritizing vertical breathing room (Stack-LG) between major content sections to reinforce the premium brand positioning. Content should be centered within the 1280px container, using wide margins to draw the eye inward toward the product imagery.

## Elevation & Depth

Depth is conveyed through **Ambient Shadows** and **Tonal Layers**. Shadows are never pure black; they are tinted with a hint of the primary purple (#6D58A6) and set to a very low opacity (5-10%) with a high blur radius to create a soft, "floating" effect for cards and modals.

To enhance the ethereal feel, glassmorphism is applied to navigation bars and floating action buttons. This includes a backdrop blur of 10px-16px combined with a semi-transparent white fill (80% opacity), allowing product colors to subtly bleed through as the user scrolls.

## Shapes

The shape language is consistently **Rounded**, avoiding sharp corners to maintain the feminine and approachable aesthetic. The standard 0.5rem (8px) radius is applied to buttons and input fields, while larger components like product cards and decorative containers use the `rounded-lg` (16px) or `rounded-xl` (24px) variants.

Interactive elements like "Add to Cart" or "Quick View" buttons may occasionally use pill-shaped (100px) radii to distinguish them as primary conversion points against the more structured grid of the product cards.

## Components

### Buttons
Primary buttons use a solid primary purple fill with white text and a subtle 4px shadow. Secondary buttons utilize a lilac ghost style—a transparent background with a 1.5px border in secondary lilac.

### Input Fields
Inputs are styled with a very light gray background and a 1px border that shifts to primary purple on focus. Labels should always sit above the field in the `label-md` typographic style.

### Product Cards
Cards feature a white background, a `rounded-lg` corner radius, and a soft ambient shadow. Product images should be centered with ample padding, using a subtle off-white or light gray background to create a "studio" look within the card.

### Chips & Badges
Used for categories (e.g., "Vegan," "Bestseller"), these should be small, pill-shaped, and use the tertiary pink or secondary lilac at 20% opacity with saturated text of the same color.

### Additional Components
- **Shade Selector:** Circular color swatches with a high-contrast border ring when selected.
- **Floating Navigation:** A glassmorphic top bar that remains pinned, providing constant access to the cart and search features.
- **Review Stars:** Custom-styled stars using the tertiary pink color to maintain the brand's soft palette.