# ⚡ TGS ChefChoice — JavaScript Engine Architecture (`JAVASCRIPT_ARCHITECTURE.md`)

This document outlines the core JavaScript architecture, function execution hierarchy, event listeners, state machine, and DOM manipulation logic implemented in `main.js`.

---

## 🏗️ 1. Execution Pipeline (`DOMContentLoaded`)

When the browser finishes parsing HTML, `main.js` initializes all modules sequentially:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  initSharedNav();            // 1. Header active tab & mobile toggle
  initScrollReveal();         // 2. IntersectionObserver scroll animations
  initSplashV2();             // 3. Iris-wipe splash screen controller
  initScrollProgress();       // 4. Hairline scroll progress indicator
  initMenuJumpNav();          // 5. Menu sticky category observer
  initCategoryFilters();      // 6. Gallery & Review tab filters
  initLightbox();             // 7. Photo & Video lightbox popup
  initOrderFormValidation();  // 8. Reservation form -> WhatsApp
  initEventFormValidation();  // 9. Catering form -> WhatsApp
  initContactFormValidation();// 10. Contact form -> WhatsApp
  initFAQAccordion();         // 11. FAQ accordion toggle
  initMenuCart();             // 12. Mini-Cart & QR Table Order engine
  initPackageWAButtons();     // 13. Tier card WA CTA buttons
  initStickyWhatsApp();       // 14. Global floating WA button injector
  initFloatingIngredients();  // 15. Background floating SVG elements
});
```

---

## ⚙️ 2. Detailed Function Index

### 🟢 `generateOrderId()`
- **Output:** String `TGS-YYMMDD-XXXX`.
- **Logic:** Combines 2-digit year, 2-digit month, 2-digit date, and a 4-digit random number (`Math.floor(1000 + Math.random() * 9000)`).

### 🟢 `openWhatsApp(msgBody)`
- **Input:** Raw un-encoded message string.
- **Action:** Calls `encodeURIComponent(msgBody)` and opens `https://wa.me/919701325292?text=${encoded}` in a new tab (`_blank`).

### 🟢 `initStickyWhatsApp()`
- **Action:** Dynamically creates `<a class="wa-sticky-btn">` containing the WhatsApp inline SVG icon and appends it to `document.body`. Pinned to bottom-right corner.

### 🟢 `initMenuCart()`
- **State Machine:** In-memory object `const cart = {}`.
- **Stepper Handlers:** Attaches click listeners to `.qty-plus` and `.qty-minus` buttons on all 203 menu items.
- **UI Recalculator (`recalcUI`):**
  - Sums total items (`reduce((s, i) => s + i.qty, 0)`) and total price (`reduce((s, i) => s + i.qty * i.price, 0)`).
  - Toggles `.visible` class on `#cartFloatingBar`.
  - Toggles `cart-active` body class to dynamically adjust the sticky WhatsApp button position (`bottom: 88px` vs `bottom: 24px`).
- **QR Code Parameter Check:** Reads `window.location.search` for `?table=X`. If found, stores `window.tgsTableNumber = X` and prepends `.table-order-banner` to `<main>`.

### 🟢 `initSplashV2()`
- **Auto-Exit:** 5.0 second timer (`setTimeout(triggerExit, 5000)`).
- **Manual Trigger:** Click or keydown events trigger `triggerExit()`, applying `.exit` class (`clip-path: circle(0%)`) and hiding the splash wrapper.
- **Session Check:** Uses `sessionStorage.setItem('tgsSplashSeen', 'true')` to prevent re-triggering within the same session.

### 🟢 `initScrollReveal()`
- Uses native `IntersectionObserver` (`threshold: 0.15`) to observe all `.reveal` elements and add the `.visible` CSS class when scrolled into view.

### 🟢 `initLightbox()`
- Observes clicks on `.gallery__item` elements.
- Dynamically populates `#lightboxImg` or `#lightboxVideo` depending on `data-video` attribute.
- Binds keyboard events (`Escape` to close, `ArrowLeft`/`ArrowRight` for navigation).
