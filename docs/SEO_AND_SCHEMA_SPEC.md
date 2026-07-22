# 🔍 TGS ChefChoice — SEO, Social Sharing & Google Schema Specification (`SEO_AND_SCHEMA_SPEC.md`)

This document outlines the Search Engine Optimization (SEO) strategy, OpenGraph social sharing preview specifications, and Google Structured Data (JSON-LD Schema) implementation for **TGS ChefChoice Restaurant**.

---

## 🎯 1. SEO Metadata Standard

Every HTML page across the domain includes standardized primary SEO meta tags:

- **Character Set:** `<meta charset="UTF-8">`
- **Viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- **Page Titles:** Unique, keyword-rich title tags (e.g. `The Master Menu — TGS ChefChoice Kasibugga`).
- **Meta Descriptions:** Descriptive 150-160 character summaries including target keywords (*Kasibugga, Palasa, Biryani, Chicken 555, Restaurant, Table Reservation*).
- **Clean Canonical Routing:** Standardized URLs managed via `vercel.json` (`cleanUrls: true`).

---

## 📱 2. OpenGraph (OG) Social Sharing Meta Tags

When a website link is shared on WhatsApp, Facebook, iMessage, LinkedIn, or Twitter, social platforms read the page's OpenGraph tags to render a rich link preview card.

All 16 HTML pages include the following tags:

```html
<!-- OpenGraph Social Sharing Metadata -->
<meta property="og:title" content="The Master Menu — TGS ChefChoice Kasibugga">
<meta property="og:description" content="Official website of TGS ChefChoice Restaurant Kasibugga. 21-section master menu, table reservations, and WhatsApp ordering.">
<meta property="og:image" content="https://tgs-chef-choice.vercel.app/assets/tgs-circular.png">
<meta property="og:type" content="website">
<meta property="og:url" content="https://tgs-chef-choice.vercel.app/menu.html">
```

### Visual Preview Render
- **Title:** Page-specific title.
- **Thumbnail:** High-resolution circular brand logo badge (`tgs-circular.png`).
- **Description:** Concise summary of Kasibugga restaurant offerings.

---

## 🏷️ 3. Google Structured Data (JSON-LD Restaurant Schema)

To help Google Search and Google Maps understand that TGS ChefChoice is a physical restaurant business in Kasibugga, official JSON-LD Schema markup is embedded in the head of key landing pages (`index.html`, `menu.html`, `about.html`, `locations.html`, `contact.html`, `order.html`):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "TGS ChefChoice Restaurant",
  "image": "https://tgs-chef-choice.vercel.app/assets/tgs-circular.png",
  "telephone": "+919701325292",
  "url": "https://tgs-chef-choice.vercel.app",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shivaji Nagar",
    "addressLocality": "Kasibugga",
    "addressRegion": "Palasa, Andhra Pradesh",
    "postalCode": "532222",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 18.77,
    "longitude": 84.41
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "11:30",
    "closes": "22:30"
  },
  "servesCuisine": [
    "Indian",
    "Chinese",
    "Biryani",
    "Fast Food"
  ],
  "priceRange": "₹₹",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.1",
    "reviewCount": "233"
  }
}
</script>
```

### SEO Benefits:
1. **Google Maps Knowledge Graph:** Enables rich snippets in Google Search results showing opening hours (11:30 AM – 10:30 PM), rating (4.1★), phone number, and address.
2. **Local Pack Ranking:** Improves rank for queries like *"restaurants near me"*, *"biryani in Kasibugga"*, and *"best food in Palasa"*.
3. **Action Links:** Direct link to online menu and reservation flow.
