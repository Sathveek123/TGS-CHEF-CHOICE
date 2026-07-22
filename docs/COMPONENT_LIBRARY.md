# 🧩 TGS ChefChoice — UI Component Library & Visual Specs (`COMPONENT_LIBRARY.md`)

This document serves as the master catalog of all UI components, visual patterns, HTML class conventions, and interactive behaviors across the **TGS ChefChoice** platform.

---

## 🧭 1. Header Navigation (`.site-nav`)

- **Class:** `.site-nav`
- **Behavior:** Fixed hairline header (`position: sticky; top: 0; z-index: 900;`) with `backdrop-filter: blur(12px)` over a 97% translucent white background (`rgba(255,255,255,0.97)`).
- **Brand Element:** `.site-nav__logo` featuring the text wordmark `TGS ChefChoice` with gold accent styling.
- **Navigation Links:** `.site-nav__links` with auto-highlighting (`aria-current="page"`) based on `window.location.pathname`.
- **Primary CTA:** `.site-nav__cta` ("Reserve Table") styled as a solid saffron amber button (`background: var(--saffron-gold)`).
- **Mobile Menu:** `.site-nav__toggle` hamburger icon morphing into an "X" on toggle, triggering a full vertical drawer overlay on mobile screens ($< 768\text{px}$).

---

## 🎆 2. Splash Screen V2 (`#splash`)

- **Class:** `#splash`
- **Background:** Dark charcoal radial gradient (`radial-gradient(ellipse at 50% 50%, #241D16 0%, #14110F 55%, #0D0B08 100%)`).
- **Logo Display:** Circular badge (`assets/tgs-circular.png`) scaling from `0.7` → `1.0` with a pulsing golden drop-shadow filter (`drop-shadow(0 0 48px rgba(201,150,46,0.8))`).
- **Tagline:** *"Kasibugga · Est. 2017"* rendered in Cormorant Garamond gold text (`color: #E8C878`).
- **Animations:** Floating ember drift background glow (`.splash-bg-glow`), vertical rising steam wisps (`.wisp`).
- **Exit Trigger:** Iris-Wipe circular clip-path transition (`clip-path: circle(0% at 50% 50%)`) triggered automatically after 5.0 seconds or instantly upon click/keypress.

---

## 🍽️ 3. Menu Item Card (`.menu__item`)

- **Class:** `.menu__item`
- **Structure:**
  - `.menu__item-icon`: Dietary indicator (`.menu__item-icon--veg` green dot vs `.menu__item-icon--nonveg` red triangle/dot).
  - `.menu__item-name`: Dish title in Outfit font (`font-weight: 700`).
  - `.menu__item-dots`: Flexible dotted price leader line (`border-bottom: 2px dotted #CBD5E1`).
  - `.menu__item-price`: Monospace price badge (e.g., `₹260`).
  - `.menu__item-cart-control`: Integrated quantity stepper (`- 0 +`).
- **Data Attributes:** `data-veg="true/false"`, `data-name="..."`, `data-price="..."`.

---

## 🛒 4. Floating Cart Bar (`.cart-floating-bar`)

- **Class:** `.cart-floating-bar`
- **Container:** Dark ink bar (`#14110F`) pinned to screen bottom (`position: fixed; bottom: 0; left: 0; right: 0; z-index: 500;`).
- **Visibility:** Hidden via `transform: translateY(110%)`; slides up smoothly (`transform: translateY(0)`) as soon as cart item count $> 0$.
- **Elements:**
  - `.cart-bar__count`: Saffron gold circular badge showing total items selected.
  - `.cart-bar__total`: Large white monetary sum (`₹...`).
  - `.cart-bar__btn`: Pill button ("Review & Send Order →") opening the order review modal.

---

## 📋 5. Cart Review Modal (`.cart-modal`)

- **Class:** `.cart-modal` & `.cart-modal__panel`
- **Behavior:** Backdrop overlay (`rgba(0,0,0,0.65)` with `backdrop-filter: blur(6px)`) animating a slide-up panel (`max-width: 640px`) from bottom viewport.
- **Fields:**
  - `#cartModalList`: Itemized list of selected dishes and individual line-item prices.
  - `#cartModalTotal`: Full total sum banner (`background: #FFFBEB`).
  - `#cartName` & `#cartPhone`: Customer name and 10-digit mobile number validation inputs.
  - `.cart-modal__order-type`: Toggle selector between **Dine-In Table** and **Takeaway Counter**.
  - `#sendCartOrder`: WhatsApp green button (`background: #25D366`) launching `wa.me`.

---

## 📱 6. Sticky WhatsApp Action Button (`.wa-sticky-btn`)

- **Class:** `.wa-sticky-btn`
- **Position:** Fixed bottom-right corner (`bottom: 24px; right: 24px; z-index: 490`).
- **Visual:** Circular 56px WhatsApp green icon with gold tooltip on hover ("Chat on WhatsApp").
- **Dynamic Shift:** Automatically shifts upward (`bottom: 88px`) when the Menu Cart Bar is visible to prevent element collision.

---

## 📍 7. QR Table Order Banner (`.table-order-banner`)

- **Class:** `.table-order-banner`
- **Trigger:** Parameter `?table=X` present in URL.
- **Visual:** Warm amber gold banner (`background: linear-gradient(135deg, #FEF3C7, #FDE68A)`) sticky below header (`top: 58px`).
- **Text:** `📍 Ordering for Table X`.

---

## 🖼️ 8. Photo & Video Lightbox (`#lightbox`)

- **Class:** `#lightbox`
- **Behavior:** Full-screen modal stage displaying high-res images (`#lightboxImg`) or HTML5 video player (`#lightboxVideo`).
- **Controls:** Previous (`#lightboxPrev`), Next (`#lightboxNext`), Close (`#lightboxClose`), and Keyboard listeners (`Escape`, `ArrowLeft`, `ArrowRight`).

---

## 📦 9. Package & Tier Cards (`.tier-card`)

- **Class:** `.tier-card` & `.tier-card--featured`
- **Used In:** `offers.html` and `catering.html`.
- **Features:** Hover lift effect (`transform: translateY(-4px)`), bullet points (`✓`), featured badge (`Most Popular` / `Most Booked`), and direct WhatsApp booking buttons (`.pkg-wa-btn`).
