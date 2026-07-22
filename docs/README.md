# TGS ChefChoice Restaurant — Official Master Documentation 👑

Welcome to the complete project documentation for the **TGS ChefChoice Restaurant** web platform and digital ordering ecosystem.

> **Live Website URL:** [https://tgs-chef-choice.vercel.app/](https://tgs-chef-choice.vercel.app/)  
> **GitHub Repository:** [Sathveek123/TGS-CHEF-CHOICE](https://github.com/Sathveek123/TGS-CHEF-CHOICE)  
> **Primary Contact Number / WhatsApp Desk:** `+91 97013 25292`  
> **Location:** Shivaji Nagar, Kasibugga, Palasa, Andhra Pradesh 532222  
> **Opening Hours:** Daily 11:30 AM – 10:30 PM  
> **Owners:** Tarakeswari & Balakrishna Gujju  

---

## 📚 Documentation Index

| Document | Description | Link |
| :--- | :--- | :--- |
| 📖 **Menu System Docs** | 21-section master menu, price leaders, and filter engine | [`docs/MENU_STRUCTURE.md`](./MENU_STRUCTURE.md) |
| 💬 **WhatsApp Automation** | Reference generator, mini-cart, and QR code table ordering | [`docs/WHATSAPP_AUTOMATION.md`](./WHATSAPP_AUTOMATION.md) |
| 🎨 **Brand Guidelines** | Color tokens, typography, logo usage, and UI design rules | [`docs/BRAND_GUIDELINES.md`](./BRAND_GUIDELINES.md) |
| 🚀 **Deployment Guide** | GitHub & Vercel hosting, custom domain setup, and maintenance | [`docs/DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) |
| 📱 **Owner's Reply Sheet** | Canned WhatsApp replies for Tarakeswari & Balakrishna | [`WHATSAPP_REPLY_CHEAT_SHEET.md`](../WHATSAPP_REPLY_CHEAT_SHEET.md) |

---

## 🛠️ Technology Stack & Architecture

- **Core:** Semantic HTML5, Vanilla JavaScript (ES6+), CSS3 Vanilla Design System (Zero Framework Overhead).
- **Styling:** Custom CSS Custom Properties (`:root` design tokens), CSS Grid, Flexbox, Fluid Typography (`clamp()`), Modern Elevation Glassmorphism.
- **Typography:** Google Fonts (`Outfit`, `Cormorant Garamond`, `Plus Jakarta Sans`, `JetBrains Mono`).
- **Icons & Graphics:** Handcrafted inline SVGs, high-res webp/jpg culinary imagery, custom floating SVG animations.
- **Hosting & CI/CD:** GitHub + Vercel Instant Deployment pipeline.

---

## 🌟 Key Features Overview

1. **Splash Screen V2:** Custom dark ink background (`#14110F`) with radial saffron warm glow, floating steam wisps, and an animated Iris-Wipe exit.
2. **Real Brand Asset Integration:** Circular brand logo badge (`tgs-circular.png`), owner photo (`owners-tarakeswari-balakrishna.png`), and exact Kasibugga map coordinates.
3. **21-Section Master Menu (`menu.html`):** Real physical menu board data with price leaders, veg/nonveg icons, search filter, and sticky horizontal jump navigation.
4. **WhatsApp Ordering Engine (`order.html` & `menu.html`):** Zero-backend client-side ordering system generating unique Reference IDs (`TGS-YYMMDD-XXXX`).
5. **Interactive Mini-Cart:** Item quantity steppers (`- 0 +`), floating summary bar, itemized review modal.
6. **QR Code Table Ordering:** Scan table QR codes (`menu.html?table=7`) to automatically tag orders with table numbers.
7. **Full SEO & Social Sharing:** Favicon icons, OpenGraph sharing preview cards, and Google LocalBusiness JSON-LD Schema markup on all pages.

---

## 📁 Repository Directory Structure

```
TGS CHEF CHOICE/
├── index.html                 # Homepage with hero, menu highlights, reviews & stats
├── about.html                 # Brand heritage, milestones, principles & owner story
├── menu.html                  # 21-section master menu with mini-cart & search
├── order.html                 # Table reservation & takeaway booking form
├── offers.html                # Per-person dining packages & seasonal curations
├── catering.html              # Celebrations, group packages & event booking
├── locations.html             # Google Maps location, phone desk & visit options
├── reviews.html               # 233+ Google reviews grid & rating breakdown
├── gallery.html               # High-res photo gallery with custom JS lightbox
├── contact.html               # Direct contact form & counter desk details
├── faq.html                   # Interactive accordion FAQ
├── privacy-policy.html        # Privacy policy documentation
├── terms.html                 # Terms & conditions documentation
├── thank-you.html             # Form confirmation landing page
├── 404.html                   # Custom culinary 404 error page
├── styles.css                 # Master design system & CSS rules (1700+ lines)
├── main.js                    # Core interactive script & WhatsApp engines
├── WHATSAPP_REPLY_CHEAT_SHEET.md # Owner reply templates for WhatsApp
├── assets/                    # Optimized image assets (logos, gallery, owners)
└── docs/                      # Comprehensive documentation suite
    ├── README.md              # Master Index (This File)
    ├── MENU_STRUCTURE.md      # Menu Data & Architecture
    ├── WHATSAPP_AUTOMATION.md # WhatsApp & QR System Spec
    ├── BRAND_GUIDELINES.md    # Design Tokens & Styling Rules
    └── DEPLOYMENT_GUIDE.md    # Vercel & Hosting Setup
```
