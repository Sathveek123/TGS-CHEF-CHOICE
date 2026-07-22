# 🎨 TGS ChefChoice — Brand Guidelines & Design Tokens (`BRAND_GUIDELINES.md`)

This document defines the official visual identity, color tokens, typography system, component styling standards, and logo usage guidelines for **TGS ChefChoice Restaurant**.

---

## 🎨 Color Palette & Design Tokens

All colors are centralized as CSS custom variables inside `:root` in `styles.css`:

```css
:root {
  /* Primary Brand Gold & Amber Tokens */
  --saffron-gold:    #D97706;  /* Primary Accent & Active Buttons */
  --saffron-bright:  #F59E0B;  /* Highlight Sun Gold */
  --saffron-light:   #FFFBEB;  /* Soft Warm Cream Tint for Cards/Badges */
  --saffron-border:  #FDE68A;  /* Accent Border Lines */
  --turmeric-gold:   #C9962E;  /* Secondary Amber Accent */
  --turmeric-light:  #E8C878;  /* Subtitle Accent Text */

  /* Urgency & Non-Veg Chili Accents */
  --chili-red:       #DC2626;  /* Crimson Chili Red Accent */
  --chili-light:     #FEF2F2;  /* Non-Veg Badge Background */

  /* Neutral Surface & Background Tokens */
  --bg-app:          #FAF9F5;  /* Luxury Textured Warm Cream Paper */
  --bg-surface:      #FFFFFF;  /* Card Surfaces */
  --bg-subtle:       #F8FAFC;  /* Light Section Contrast Tint */
  --ink:             #14110F;  /* Deep Charcoal Dark Ink (Splash & Cart Bar) */

  /* High-Contrast Typography Color Tokens */
  --text-dark:       #0F172A;  /* Primary Headings & High Contrast Body */
  --text-body:       #334155;  /* Slate Body Copy */
  --text-muted:      #475569;  /* Subtitles & Captions */
  --muted-clay:      #C9BBA3;  /* Muted Footer Subtext */
}
```

---

## ✒️ Typography System

Four curated Google Fonts create a distinct hierarchy:

| Font Role | Font Family | Weights Used | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Headings** | `"Outfit", sans-serif` | 600, 700, 800 | Section titles, dish names, hero headlines |
| **Culinary Accents** | `"Cormorant Garamond", serif` | 500, 600 (Italic) | Heritage eyebrows, dish descriptions, ledes |
| **Body & UI Controls** | `"Plus Jakarta Sans", sans-serif` | 400, 500, 600, 700 | Body paragraphs, form inputs, buttons, navigation |
| **Reference IDs & Code** | `'JetBrains Mono', monospace` | 500, 700 | Reference IDs (`TGS-260723-4821`), prices |

---

## 🖼️ Logo Asset Rules

1. **Circular Logo Badge (`assets/tgs-circular.png`):**
   - 1024x1024 high-resolution circular chef-hat badge featuring red/gold branding.
   - Used for the Splash Screen V2, Header Navigation, Footer Brand Column, and About Page intro seal.
2. **Nav Bar Display:** Rendered as clean text wordmark `TGS ChefChoice` or circular badge at `width: 38px; height: 38px; border-radius: 50%`.
3. **Footer Display:** Rendered at `width: 80px; height: 80px; border-radius: 50%` with a subtle drop-shadow (`drop-shadow(0 4px 10px rgba(0,0,0,0.15))`).

---

## 📐 Spacing & Layout Rules

- **Container Padding:** Standard horizontal padding uses fluid viewport units: `padding: 80px 6vw;`.
- **Card Radius:** Standard card border-radius is `border-radius: 16px;` or `border-radius: 12px;`.
- **Elevation Shadows:**
  - Fast hover transitions: `var(--transition-fast: 0.22s cubic-bezier(0.16, 1, 0.3, 1))`.
  - Shadow medium: `box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);`.
  - Gold glow shadow: `box-shadow: 0 20px 35px -10px rgba(217, 119, 6, 0.12);`.
