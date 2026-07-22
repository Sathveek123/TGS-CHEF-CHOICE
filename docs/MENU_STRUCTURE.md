# 📖 TGS ChefChoice — Menu System & Data Architecture (`MENU_STRUCTURE.md`)

This document details the structure, categories, data attributes, search filters, and interactive mini-cart architecture of the **21-Section Master Menu** (`menu.html`).

---

## 📋 The 21 Menu Sections (In Order)

The menu was extracted directly from TGS ChefChoice's physical menu board in Kasibugga:

| # | Section ID | Category Name | Key Items | Price Range |
| :-: | :--- | :--- | :--- | :--- |
| **01** | `biryani` | Biryani | Hyd Chicken Dum Biryani, Lollypop Biryani, Joint Biryani | ₹200 – ₹300 |
| **02** | `fried-rice` | Fried Rice | Veg Fried Rice, Chicken Fried Rice, Mixed Fried Rice | ₹110 – ₹240 |
| **03** | `tgs-combos` | TGS Special Combo's | Family Biryani Pack, Combo Platters | ₹350 – ₹699 |
| **04** | `veg-curries` | Veg Curries | Paneer Butter Masala, Kaju Curry, Mixed Veg | ₹140 – ₹220 |
| **05** | `nonveg-curries` | Non-Veg Curries | Chicken Curry, Butter Chicken, Mutton Curry | ₹180 – ₹320 |
| **06** | `soups` | Soups | Veg Manchow, Chicken Hot & Sour, Sweet Corn | ₹80 – ₹130 |
| **07** | `fries-rings` | Fries & Rings | French Fries, Peri Peri Fries, Onion Rings | ₹90 – ₹160 |
| **08** | `pizza` | Pizza | Veg Margherita, Chicken Supreme, Paneer Tikka Pizza | ₹180 – ₹290 |
| **09** | `chicken-starters` | Chicken Starters | **Chicken 555**, Chilli Chicken, Dragon Chicken | ₹190 – ₹280 |
| **10** | `fish-starters` | Fish Starters | Apollo Fish, Fish Fry, Chilli Fish | ₹220 – ₹290 |
| **11** | `prawn-starters` | Prawn Starters | Loose Prawns, Chilli Prawns, Prawn Fry | ₹240 – ₹310 |
| **12** | `calamari` | Calamari | Crispy Squid Rings, Garlic Butter Calamari | ₹250 – ₹320 |
| **13** | `spring-rolls` | Spring Rolls | Veg Spring Rolls, Chicken Spring Rolls | ₹120 – ₹180 |
| **14** | `veg-starters` | Veg Starters | Crispy Corn, Paneer 65, Babycorn Manchurian | ₹130 – ₹200 |
| **15** | `noodles` | Noodles | Hakka Noodles, Chicken Schezwan Noodles | ₹110 – ₹210 |
| **16** | `lemonades` | Lemonades | Fresh Lime Soda, Mint Mojito, Blue Lagoon | ₹50 – ₹100 |
| **17** | `shakes` | Shakes | Oreo Shake, KitKat Shake, Thick Chocolate Shake | ₹90 – ₹160 |
| **18** | `burgers` | Burgers | Veg Burger, Crunchy Chicken Burger, Cheese Burger | ₹110 – ₹190 |
| **19** | `brownie` | Brownie | Sizzling Brownie with Ice Cream, Chocolate Fudge | ₹120 – ₹180 |
| **20** | `ice-cream` | Ice Cream | Vanilla, Chocolate, Butterscotch, Special Sundae | ₹60 – ₹140 |
| **21** | `contact-order` | Contact Desk | Front Desk Hotline & Quick Order CTA | Desk Info |

---

## ⚙️ HTML Data Markup Standards

Each item in `menu.html` follows strict semantic data markup consumed by JavaScript filters and the mini-cart engine:

```html
<div class="menu__item" data-veg="false" data-name="Chicken 555" data-price="260">
  <span class="menu__item-icon menu__item-icon--nonveg"></span>
  <div class="menu__item-text" style="display: flex; flex-direction: column; width: 100%;">
    <div class="menu__item-title-row" style="display: flex; align-items: baseline; width: 100%;">
      <h3 class="menu__item-name" style="margin: 0; font-family: var(--font-heading); font-size: 1.08rem; font-weight: 700; color: var(--text-dark); white-space: nowrap;">Chicken 555</h3>
      <span class="menu__item-dots" style="flex: 1; border-bottom: 2px dotted #CBD5E1; margin: 0 8px; position: relative; top: -4px;"></span>
      <span class="menu__item-price" style="flex-shrink: 0;">₹260</span>
    </div>
    <p style="margin-top: 6px; font-family: var(--font-accent); font-style: italic; font-size: 0.95rem; color: var(--text-body); line-height: 1.45;">Signature wok-tossed chicken strips with cashews and curry leaves.</p>
    <div class="menu__item-cart-control">
      <button class="qty-btn qty-minus" aria-label="Decrease quantity">−</button>
      <span class="qty-value">0</span>
      <button class="qty-btn qty-plus" aria-label="Increase quantity">+</button>
    </div>
  </div>
</div>
```

---

## 🔍 Filtering & Search Functionality

- **Live Search (`#menuSearch`):** Filters dish names in real time as the user types (e.g. typing "555" instantly shows Chicken 555).
- **Dietary Filter (`#typeFilter`):** Filters between *All Food Types*, *🌿 Veg Only*, and *🥩 Non-Veg Only* using `data-veg="true/false"`.
- **Price Sorting (`#priceSort`):** Dynamically sorts item DOM nodes within each category section by ascending (`low-high`) or descending (`high-low`) price.
