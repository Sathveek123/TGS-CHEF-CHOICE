# 🚀 TGS ChefChoice — Deployment & Hosting Guide (`DEPLOYMENT_GUIDE.md`)

This guide explains how **TGS ChefChoice** is deployed, hosted, and maintained on **Vercel** via **GitHub**.

---

## 🌐 Current Live Infrastructure

- **Live URL:** [https://tgs-chef-choice.vercel.app/](https://tgs-chef-choice.vercel.app/)
- **Hosting Provider:** Vercel (Edge Network Platform)
- **Git Repository:** GitHub (`Sathveek123/TGS-CHEF-CHOICE`)
- **Deployment Trigger:** Automatic CI/CD build on push to branch `main`

---

## 🔄 Deploying Updates (Step-by-Step)

To deploy any future code updates to the live site:

1. Open your terminal in the project directory (`d:\Client Projects\TGS CHEF CHOICE`).
2. Stage modified files:
   ```bash
   git add .
   ```
3. Commit your changes with a descriptive message:
   ```bash
   git commit -m "feat: add new dish to menu"
   ```
4. Push to GitHub:
   ```bash
   git push origin main
   ```
5. **Vercel CI/CD Build:** Vercel automatically detects the push, builds the HTML/CSS/JS bundle, and updates `https://tgs-chef-choice.vercel.app/` within **10–15 seconds**.

---

## 🌐 Setting Up a Custom Domain (e.g. `tgschefchoice.com`)

If the client purchases a custom domain (e.g., `tgschefchoice.com` or `tgschefchoice.in`):

1. Log into the **Vercel Dashboard** at [vercel.com](https://vercel.com).
2. Select the **`tgs-chef-choice`** project.
3. Go to **Settings → Domains**.
4. Type in `tgschefchoice.com` and click **Add**.
5. Log into your domain registrar (GoDaddy, Namecheap, BigRock, Hostinger) and configure the DNS records provided by Vercel:
   - **Type A Record:** `@` → `76.76.21.21`
   - **Type CNAME Record:** `www` → `cname.vercel-dns.com`
6. Vercel automatically issues a free SSL certificate (`https://`) within a few minutes.

---

## 🧹 URL Clean Routing (`vercel.json`)

The project uses `vercel.json` rewrite rules so pages load cleanly without needing `.html` extensions (e.g., `https://tgs-chef-choice.vercel.app/menu` instead of `/menu.html`):

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

---

## 🔒 Security & Performance Best Practices

- **Zero Backend Security Footprint:** Since the site relies on client-side WhatsApp routing, there are no databases, server credentials, or API keys exposed that could be hacked or compromised.
- **Fast Global Delivery:** Static HTML, Vanilla CSS, and JS assets are cached globally on Vercel's Edge CDN for sub-300ms page load speeds across India.
