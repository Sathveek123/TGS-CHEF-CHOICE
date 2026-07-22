/* ============================================================
   TGS CHEFCHOICE RESTAURANT — Main Interactive Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Dynamic Copyright Year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Navigation Active-State Auto Highlight & Mobile Toggle
  initSharedNav();

  // Global Scroll Reveal Observer
  initScrollReveal();

  initSplashV2();
  initScrollProgress();
  initMenuJumpNav();
  initCategoryFilters();
  initLightbox();
  initOrderFormValidation();
  initEventFormValidation();
  initContactFormValidation();
  initFAQAccordion();
  initMenuSearchAndFilters(); // Live Search, Veg/NonVeg Filter, and Price Sort for Menu
  initMenuCart();           // Mini-cart on menu page
  initPackageWAButtons();   // WA buttons on tier/package cards
  initStickyWhatsApp();     // Floating WA button on all pages
  initFloatingIngredients();
});

/* ---------------- Shared Navigation Auto-Highlight & Toggle ---------------- */
function initSharedNav() {
  const pathname = window.location.pathname;
  let currentPath = pathname.split('/').pop() || 'index.html';
  currentPath = currentPath.replace('.html', ''); // Remove extension

  document.querySelectorAll('.site-nav__links a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const cleanHref = href.replace('.html', '').replace('./', '').replace('/', '');
    const cleanCurrent = currentPath.replace('index', '');

    if (cleanHref === cleanCurrent || (cleanCurrent === '' && (cleanHref === 'index' || cleanHref === ''))) {
      link.setAttribute('aria-current', 'page');
    }
  });

  const toggleBtn = document.getElementById('navToggle');
  const linksNav = document.querySelector('.site-nav__links');

  if (toggleBtn && linksNav) {
    toggleBtn.addEventListener('click', () => {
      linksNav.classList.toggle('open');
      toggleBtn.classList.toggle('active');
    });

    linksNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        linksNav.classList.remove('open');
        toggleBtn.classList.remove('active');
      });
    });
  }
}

/* ---------------- Scroll Reveal Intersection Observer ---------------- */
function initScrollReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ---------------- Splash Screen V2 (Bigger Logo + Iris Wipe Exit) ---------------- */
function initSplashV2() {
  const splash = document.getElementById('splash');
  if (!splash) return;

  let exited = false;

  function triggerExit() {
    if (exited) return;
    exited = true;
    splash.classList.add('exit');
    sessionStorage.setItem('tgsSplashSeen', 'true');

    setTimeout(() => {
      splash.style.display = 'none';
    }, 950);
  }

  // Auto exit at 5.0s as requested by user
  const timer = setTimeout(triggerExit, 5000);

  // Click or keypress anywhere triggers immediate iris-wipe exit
  splash.addEventListener('click', () => {
    clearTimeout(timer);
    triggerExit();
  });

  window.addEventListener('keydown', (e) => {
    if (!exited) {
      clearTimeout(timer);
      triggerExit();
    }
  }, { once: true });
}

/* ---------------- Scroll Progress Hairline ---------------- */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });
}

/* ---------------- Menu JumpNav IntersectionObserver ---------------- */
function initMenuJumpNav() {
  const jumpLinks = document.querySelectorAll('.jumpnav__link');
  const categories = document.querySelectorAll('.menu__category');
  if (!jumpLinks.length || !categories.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        jumpLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  categories.forEach(cat => observer.observe(cat));
}

/* ---------------- Gallery & Review Category Filtering ---------------- */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterGroup = btn.parentElement;
      filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const galleryItems = document.querySelectorAll('.gallery__item');
      const reviewCards = document.querySelectorAll('.review-card');

      if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
          const cat = item.dataset.category;
          item.style.display = (filter === 'all' || cat === filter) ? 'block' : 'none';
        });
      }

      if (reviewCards.length > 0) {
        reviewCards.forEach(item => {
          const cat = item.dataset.category;
          item.style.display = (filter === 'all' || cat === filter) ? 'block' : 'none';
        });
      }
    });
  });
}

/* ---------------- Vanilla JS Lightbox ---------------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const img = document.getElementById('lightboxImg');
  const video = document.getElementById('lightboxVideo');
  const caption = document.getElementById('lightboxCaption');

  let activeItems = [];
  let currentIndex = 0;

  function updateActiveItems() {
    activeItems = Array.from(document.querySelectorAll('.gallery__item')).filter(
      item => getComputedStyle(item).display !== 'none'
    );
  }

  function openLightbox(index) {
    updateActiveItems();
    if (!activeItems.length) return;

    currentIndex = (index + activeItems.length) % activeItems.length;
    const item = activeItems[currentIndex];
    const imageElement = item.querySelector('img');
    const videoSrc = item.dataset.video;
    const capText = item.querySelector('figcaption')?.textContent || '';

    if (videoSrc) {
      if (img) img.style.display = 'none';
      if (video) {
        video.style.display = 'block';
        video.src = videoSrc;
        video.play().catch(() => {});
      }
    } else {
      if (video) {
        video.pause();
        video.style.display = 'none';
      }
      if (img) {
        img.style.display = 'block';
        img.src = imageElement ? imageElement.src : '';
        img.alt = imageElement ? imageElement.alt : '';
      }
    }

    if (caption) caption.textContent = capText;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }

  document.querySelectorAll('.gallery__item').forEach((item) => {
    item.addEventListener('click', () => {
      updateActiveItems();
      const targetIdx = activeItems.indexOf(item);
      openLightbox(targetIdx >= 0 ? targetIdx : 0);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(currentIndex + 1); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox__stage')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
  });
}

/* ============================================================
   WHATSAPP ORDERING SYSTEM — Shared Helpers
   ============================================================ */

/** Generates a short human-readable reference ID: TGS-YYMMDD-XXXX */
function generateOrderId() {
  const d = new Date();
  const yy = d.getFullYear().toString().slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TGS-${yy}${mm}${dd}-${rand}`;
}

/** Shared WhatsApp SVG icon string */
const WA_SVG = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 2C8.28 2 2 8.28 2 16c0 2.42.65 4.7 1.78 6.67L2 30l7.56-1.74C11.38 29.36 13.64 30 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm7.3 19.76c-.3.85-1.78 1.62-2.43 1.72-.64.1-1.44.14-2.33-.15-.54-.18-1.23-.42-2.1-.82-3.7-1.6-6.12-5.37-6.31-5.62-.18-.24-1.5-2-.1-3.7.6-.72 1.34-1.07 1.77-1.07.14 0 .26 0 .37.01.34.01.52.03.74.6.25.66.87 2.3.94 2.47.08.17.13.37.03.6-.1.22-.15.36-.3.55-.14.18-.3.4-.43.54-.14.14-.29.3-.12.59.17.28.75 1.24 1.61 2 1.1.99 2.03 1.3 2.33 1.44.3.14.47.12.64-.07.18-.19.76-.89.96-1.2.2-.3.4-.25.67-.15.28.1 1.78.84 2.08.99.3.15.5.22.58.34.07.12.07.7-.23 1.54z"/></svg>`;

/** Build and open a WhatsApp link */
function openWhatsApp(msgBody) {
  const encoded = encodeURIComponent(msgBody);
  window.open(`https://wa.me/919701325292?text=${encoded}`, '_blank');
}

/* ---------------- Inject Sticky WhatsApp Button on all pages ---------------- */
function initStickyWhatsApp() {
  const btn = document.createElement('a');
  btn.className = 'wa-sticky-btn';
  btn.id = 'waStickyBtn';
  btn.setAttribute('aria-label', 'Chat on WhatsApp');
  btn.setAttribute('rel', 'noopener noreferrer');
  btn.innerHTML = WA_SVG;
  const preMsg = 'Hi TGS ChefChoice! I have a question / want to place an order.';
  btn.href = `https://wa.me/919701325292?text=${encodeURIComponent(preMsg)}`;
  btn.target = '_blank';
  document.body.appendChild(btn);
}

/* ---------------- Order Form → WhatsApp ---------------- */
function initOrderFormValidation() {
  const form = document.getElementById('reserveForm');
  if (!form) return;

  const dateInput = document.getElementById('ord-date');
  if (dateInput) {
    const today = new Date();
    dateInput.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  }

  const submitBtn = document.getElementById('submitBtn');
  const successBanner = document.getElementById('successBanner') || document.getElementById('waBanner');

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add('show'); }
  }
  function clearError(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.remove('show'); }
  }

  function validateForm() {
    let valid = true;
    const name   = document.getElementById('ord-name')?.value.trim() || '';
    const phone  = document.getElementById('ord-phone')?.value.trim() || '';
    const date   = document.getElementById('ord-date')?.value || '';
    const time   = document.getElementById('ord-time')?.value || '';
    const guests = document.getElementById('ord-guests')?.value || '';

    ['err-name','err-phone','err-date','err-time','err-guests'].forEach(id => clearError(id));

    if (!name || name.length < 2) { showError('err-name', 'Please enter your full name (min 2 characters).'); valid = false; }
    if (!phone || !/^[6-9][0-9]{9}$/.test(phone)) { showError('err-phone', 'Enter a valid 10-digit Indian mobile number.'); valid = false; }
    if (!date) { showError('err-date', 'Please select a reservation date.'); valid = false; }
    if (!time) {
      showError('err-time', 'Please select a preferred time (11 AM – 10:30 PM).'); valid = false;
    } else {
      const [h, m] = time.split(':').map(Number);
      if ((h * 60 + m) < 690 || (h * 60 + m) > 1350) {
        showError('err-time', 'We are open 11:30 AM – 10:30 PM only.'); valid = false;
      }
    }
    if (!guests) { showError('err-guests', 'Please select your party size.'); valid = false; }
    return valid;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const orderId   = generateOrderId();
    const name      = document.getElementById('ord-name').value.trim();
    const phone     = document.getElementById('ord-phone').value.trim();
    const date      = document.getElementById('ord-date').value;
    const time      = document.getElementById('ord-time').value;
    const guests    = document.getElementById('ord-guests').value;
    const service   = document.querySelector('input[name="service"]:checked')?.value || 'Dine-In';
    const occasion  = document.getElementById('ord-occasion')?.value || '';
    const notes     = document.getElementById('ord-notes')?.value.trim() || '';

    let msg = `*New Booking Request — TGS ChefChoice* 🍽️\n\n`;
    msg += `*Ref ID:* ${orderId}\n`;
    msg += `*Name:* ${name}\n`;
    msg += `*Phone:* ${phone}\n`;
    msg += `*Date:* ${date}\n`;
    msg += `*Time:* ${time}\n`;
    msg += `*Service:* ${service === 'dinein' ? 'Dine-In Table' : 'Takeaway Counter'}\n`;
    msg += `*Party Size:* ${guests}\n`;
    if (occasion) msg += `*Occasion:* ${occasion}\n`;
    if (notes) msg += `*Notes:* ${notes}\n`;
    msg += `\n_Sent via tgs-chef-choice.vercel.app_`;

    submitBtn.textContent = '⏳ Opening WhatsApp...';
    submitBtn.disabled = true;

    // Show confirmation banner with ref ID
    if (successBanner) {
      const refSpan = successBanner.querySelector('.ref-id');
      if (refSpan) refSpan.textContent = orderId;
      successBanner.classList.add('show');
      form.style.display = 'none';
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setTimeout(() => openWhatsApp(msg), 1000);
  });

  // Real-time blur clearing
  document.getElementById('ord-name')?.addEventListener('blur', function() { if (this.value.trim().length >= 2) clearError('err-name'); });
  document.getElementById('ord-phone')?.addEventListener('blur', function() { if (/^[6-9][0-9]{9}$/.test(this.value.trim())) clearError('err-phone'); });
  document.getElementById('ord-date')?.addEventListener('change', function() { if (this.value) clearError('err-date'); });
}

/* ---------------- Event/Catering Form → WhatsApp ---------------- */
function initEventFormValidation() {
  const form = document.getElementById('eventForm');
  if (!form) return;

  const nameInput    = document.getElementById('ev-name');
  const phoneInput   = document.getElementById('ev-phone');
  const dateInput    = document.getElementById('ev-date');
  const guestsSelect = document.getElementById('ev-guests');

  function validate() {
    let valid = true;
    [nameInput, phoneInput, dateInput, guestsSelect].forEach(el => { if (el) el.classList.remove('invalid'); });

    if (!nameInput?.value.trim() || nameInput.value.trim().length < 2) { nameInput.classList.add('invalid'); valid = false; }
    const phoneVal = phoneInput?.value.replace(/[\s\-]/g, '').trim();
    if (!/^[0-9]{10}$/.test(phoneVal)) { phoneInput.classList.add('invalid'); valid = false; }
    if (!dateInput?.value) { dateInput.classList.add('invalid'); valid = false; }
    if (!guestsSelect?.value) { guestsSelect.classList.add('invalid'); valid = false; }
    return valid;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validate()) return;

    const orderId  = generateOrderId();
    const name     = nameInput.value.trim();
    const phone    = phoneInput.value.trim();
    const date     = dateInput.value;
    const occasion = guestsSelect.value;
    const notes    = document.getElementById('ev-notes')?.value.trim() || '';

    let msg = `*Event Booking Enquiry — TGS ChefChoice* 🎉\n\n`;
    msg += `*Ref ID:* ${orderId}\n`;
    msg += `*Name:* ${name}\n`;
    msg += `*Phone:* ${phone}\n`;
    msg += `*Preferred Date:* ${date}\n`;
    msg += `*Occasion / Size:* ${occasion}\n`;
    if (notes) msg += `*Additional Notes:* ${notes}\n`;
    msg += `\n_Sent via tgs-chef-choice.vercel.app_`;

    const successP = form.querySelector('.form-success');
    if (successP) {
      successP.textContent = `Your reference ${orderId} is ready — opening WhatsApp now...`;
      successP.style.display = 'block';
      successP.style.color = '#16A34A';
      successP.style.fontWeight = '700';
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '⏳ Opening WhatsApp...'; }

    setTimeout(() => openWhatsApp(msg), 1000);
  });
}

/* ---------------- Contact Form → WhatsApp ---------------- */
function initContactFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput    = document.getElementById('cnt-name') || document.getElementById('c-name');
  const phoneInput   = document.getElementById('cnt-phone') || document.getElementById('c-phone');
  const emailInput   = document.getElementById('cnt-email') || document.getElementById('c-email');
  const subjectSel   = document.getElementById('cnt-topic') || document.getElementById('c-subject');
  const messageInput = document.getElementById('cnt-message') || document.getElementById('c-message');

  function validate() {
    let valid = true;
    [nameInput, phoneInput, emailInput, subjectSel, messageInput].forEach(el => { if (el) el.classList.remove('invalid'); });

    if (!nameInput?.value.trim() || nameInput.value.trim().length < 2) { nameInput.classList.add('invalid'); valid = false; }
    const phoneVal = phoneInput?.value.replace(/[\s\-]/g, '').trim();
    if (!/^[0-9]{10}$/.test(phoneVal)) { phoneInput.classList.add('invalid'); valid = false; }
    if (emailInput?.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) { emailInput.classList.add('invalid'); valid = false; }
    if (!subjectSel?.value) { subjectSel.classList.add('invalid'); valid = false; }
    if (!messageInput?.value.trim() || messageInput.value.trim().length < 10) { messageInput.classList.add('invalid'); valid = false; }
    return valid;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validate()) return;

    const orderId = generateOrderId();
    const name    = nameInput.value.trim();
    const phone   = phoneInput.value.trim();
    const email   = emailInput?.value.trim() || '';
    const subject = subjectSel.value;
    const message = messageInput.value.trim();

    let msg = `*New Contact Message — TGS ChefChoice* 📩\n\n`;
    msg += `*Ref ID:* ${orderId}\n`;
    msg += `*Name:* ${name}\n`;
    msg += `*Phone:* ${phone}\n`;
    if (email) msg += `*Email:* ${email}\n`;
    msg += `*Subject:* ${subject}\n`;
    msg += `*Message:* ${message}\n`;
    msg += `\n_Sent via tgs-chef-choice.vercel.app_`;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '⏳ Opening WhatsApp...'; }

    const successMsg = form.querySelector('.form-success');
    if (successMsg) {
      successMsg.textContent = `Reference ${orderId} — opening WhatsApp to send your message...`;
      successMsg.style.display = 'block';
      successMsg.style.color = '#16A34A';
    }

    setTimeout(() => openWhatsApp(msg), 1000);
  });
}

/* ---------------- FAQ Accordion Toggle ---------------- */
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (!faqQuestions.length) return;

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      item.classList.toggle('open');
    });
  });
/* ============================================================
   MENU LIVE SEARCH, DIETARY FILTER & PRICE SORTING
   ============================================================ */
function initMenuSearchAndFilters() {
  const searchInput = document.getElementById('menuSearch');
  const typeFilter  = document.getElementById('typeFilter');
  const priceSort   = document.getElementById('priceSort');

  if (!searchInput && !typeFilter && !priceSort) return;

  const categories = document.querySelectorAll('.menu__category');
  const items = document.querySelectorAll('.menu__item[data-name]');
  if (!categories.length || !items.length) return;

  function applyFilters() {
    const query = (searchInput?.value || '').toLowerCase().trim();
    const type  = typeFilter?.value || 'all';

    categories.forEach(cat => {
      let visibleCount = 0;
      const catItems = cat.querySelectorAll('.menu__item[data-name]');

      catItems.forEach(item => {
        const name = (item.dataset.name || '').toLowerCase();
        const price = item.dataset.price || '';
        const isVeg = item.dataset.veg === 'true';
        const textContent = item.textContent.toLowerCase();

        // Check query match
        const matchesQuery = !query || name.includes(query) || textContent.includes(query) || price.includes(query);

        // Check type match
        let matchesType = true;
        if (type === 'veg') matchesType = isVeg;
        else if (type === 'nonveg') matchesType = !isVeg;

        const isVisible = matchesQuery && matchesType;
        item.style.display = isVisible ? 'flex' : 'none';
        if (isVisible) visibleCount++;
      });

      // Hide category section header entirely if zero items match in that category
      cat.style.display = visibleCount > 0 ? 'block' : 'none';
    });
  }

  function applySorting() {
    const sortVal = priceSort?.value || 'default';

    categories.forEach(cat => {
      const grid = cat.querySelector('.menu__grid-2col');
      if (!grid) return;
      const itemList = Array.from(grid.querySelectorAll('.menu__item[data-name]'));

      if (sortVal === 'default') {
        // Restore original DOM order
        itemList.sort((a, b) => (parseInt(a.dataset.originalIndex || '0', 10) - parseInt(b.dataset.originalIndex || '0', 10)));
      } else {
        itemList.sort((a, b) => {
          const priceA = parseInt(a.dataset.price, 10) || 0;
          const priceB = parseInt(b.dataset.price, 10) || 0;
          return sortVal === 'low-high' ? priceA - priceB : priceB - priceA;
        });
      }

      itemList.forEach(item => grid.appendChild(item));
    });
  }

  // Store original index for default sort restoration
  items.forEach((item, idx) => {
    item.dataset.originalIndex = idx;
  });

  searchInput?.addEventListener('input', applyFilters);
  typeFilter?.addEventListener('change', applyFilters);
  priceSort?.addEventListener('change', () => {
    applySorting();
    applyFilters();
  });
}

/* ============================================================
   MENU MINI-CART ENGINE
   ============================================================ */

function initMenuCart() {
  const allItems = document.querySelectorAll('.menu__item[data-name]');
  if (!allItems.length) return;

  // Read ?table= URL parameter for dine-in QR table ordering
  const urlParams = new URLSearchParams(window.location.search);
  const tableParam = urlParams.get('table');
  if (tableParam) {
    window.tgsTableNumber = tableParam;
    let tableBanner = document.getElementById('tableOrderBanner');
    if (!tableBanner) {
      tableBanner = document.createElement('div');
      tableBanner.id = 'tableOrderBanner';
      tableBanner.className = 'table-order-banner';
      tableBanner.innerHTML = `<span>📍 Ordering for <strong>Table ${tableParam}</strong></span>`;
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.prepend(tableBanner);
    }
  }

  // In-memory cart state — resets on page refresh by design
  const cart = {};

  const floatingBar  = document.getElementById('cartFloatingBar');
  const barCount     = document.getElementById('cartBadgeCount');
  const barTotal     = document.getElementById('cartBadgeTotal');
  const reviewBtn    = document.getElementById('reviewOrderBtn');
  const modal        = document.getElementById('cartModal');
  const modalList    = document.getElementById('cartModalList');
  const modalTotal   = document.getElementById('cartModalTotal');
  const sendBtn      = document.getElementById('sendCartOrder');
  const keepBtn      = document.getElementById('closeCartModal');
  const cartName     = document.getElementById('cartName');
  const cartPhone    = document.getElementById('cartPhone');

  if (!floatingBar || !modal) return; // HTML not present — nothing to do

  function recalcUI() {
    const totalItems = Object.values(cart).reduce((s, i) => s + i.qty, 0);
    const totalPrice = Object.values(cart).reduce((s, i) => s + i.qty * i.price, 0);

    barCount.textContent = totalItems;
    barTotal.textContent = `₹${totalPrice}`;
    floatingBar.classList.toggle('visible', totalItems > 0);
    document.body.classList.toggle('cart-active', totalItems > 0);

    // Shift sticky WA btn up dynamically
    const waBtn = document.getElementById('waStickyBtn');
    if (waBtn) waBtn.style.bottom = totalItems > 0 ? '88px' : '24px';
  }

  allItems.forEach(item => {
    const name   = item.dataset.name;
    const price  = parseInt(item.dataset.price, 10) || 0;
    const qtyEl  = item.querySelector('.qty-value');
    const plus   = item.querySelector('.qty-plus');
    const minus  = item.querySelector('.qty-minus');
    if (!qtyEl || !plus || !minus) return;

    plus.addEventListener('click', () => {
      cart[name] = cart[name] || { qty: 0, price };
      cart[name].qty++;
      qtyEl.textContent = cart[name].qty;
      recalcUI();
    });

    minus.addEventListener('click', () => {
      if (!cart[name] || cart[name].qty === 0) return;
      cart[name].qty--;
      qtyEl.textContent = cart[name].qty;
      if (cart[name].qty === 0) delete cart[name];
      recalcUI();
    });
  });

  // "Review Order" → open modal
  reviewBtn?.addEventListener('click', () => {
    modalList.innerHTML = '';
    let total = 0;
    Object.entries(cart).forEach(([name, item]) => {
      total += item.qty * item.price;
      const li = document.createElement('li');
      li.innerHTML = `<span>${item.qty} × ${name}</span><span class="item-price">₹${item.qty * item.price}</span>`;
      modalList.appendChild(li);
    });
    modalTotal.innerHTML = `Total: <span>₹${total}</span>`;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  // Close modal
  keepBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Handle cart type option clicks (label radio workaround for :has)
  document.querySelectorAll('.cart-type-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.cart-type-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // "Send via WhatsApp" 
  sendBtn?.addEventListener('click', () => {
    const name  = cartName?.value.trim() || '';
    const phone = cartPhone?.value.trim() || '';

    if (!name || name.length < 2) { cartName.classList.add('invalid'); cartName.focus(); return; }
    else cartName.classList.remove('invalid');

    if (!/^[6-9][0-9]{9}$/.test(phone)) { cartPhone.classList.add('invalid'); cartPhone.focus(); return; }
    else cartPhone.classList.remove('invalid');

    const orderType = document.querySelector('input[name="cartOrderType"]:checked')?.value || 'dinein';
    const orderId   = generateOrderId();

    let msg = `*New Order — TGS ChefChoice* 🛒\n\n`;
    msg += `*Order ID:* ${orderId}\n`;
    if (window.tgsTableNumber) {
      msg += `*Table:* Table ${window.tgsTableNumber}\n`;
    }
    msg += `*Name:* ${name}\n`;
    msg += `*Phone:* ${phone}\n`;
    msg += `*Type:* ${orderType === 'dinein' ? 'Dine-In' : 'Takeaway'}\n\n`;
    msg += `*Items Ordered:*\n`;

    let total = 0;
    Object.entries(cart).forEach(([itemName, item]) => {
      msg += `• ${item.qty} × ${itemName} — ₹${item.qty * item.price}\n`;
      total += item.qty * item.price;
    });
    msg += `\n*Total: ₹${total}*\n\n_Sent via tgs-chef-choice.vercel.app_`;

    openWhatsApp(msg);
    closeModal();
  });

  // Keyboard ESC closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/* ============================================================
   PACKAGE/TIER WhatsApp CTA Buttons (offers + catering)
   ============================================================ */
function initPackageWAButtons() {
  document.querySelectorAll('[data-wa-pkg]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pkg  = btn.dataset.waPkg;
      const page = btn.dataset.waPage || 'package';
      let msg = '';

      if (page === 'offer') {
        msg = `Hi TGS ChefChoice! 🍽️\nI'm interested in booking the *${pkg}* dining package.\nCould you please confirm availability and details?\n\n_Enquiry via tgs-chef-choice.vercel.app_`;
      } else if (page === 'event') {
        msg = `Hi TGS ChefChoice! 🎉\nI'd like to enquire about the *${pkg}* event package.\nCould you share more details on availability and what's included?\n\n_Enquiry via tgs-chef-choice.vercel.app_`;
      } else {
        msg = `Hi TGS ChefChoice! I'm enquiring about: *${pkg}*\n\n_Sent via tgs-chef-choice.vercel.app_`;
      }

      openWhatsApp(msg);
    });
  });
}

/* ---------------- Floating Culinary Ingredients background ---------------- */
function initFloatingIngredients() {
  const container = document.createElement('div');
  container.className = 'floating-bg-container';
  container.style.cssText = 'position:fixed; inset:0; pointer-events:none; z-index:950; overflow:hidden;';

  // Detailed SVG outlines for Palasa cashews, chili, leaf, chef hat
  const cashewPath = "M12 3a7 7 0 0 0-7 7c0 4 3 6.5 5 8s4 2.5 6.5 2.5c2 0 4-1.5 4-3.5s.5-4-1-5.5-3.5-2-5.5-2a4 4 0 0 1-1.5-3c0-2 1.5-3.5 3.5-3.5";
  const chiliPath  = "M16.5 3.5a1.5 1.5 0 0 1 2.2 2.2l-11 11a4.5 4.5 0 0 1-6.4-6.4l11-11a1.5 1.5 0 0 1 2.2 2.2M7.5 16.5c-2 2-5 2-7 0m14-11l3 3";
  const leafPath   = "M12 2c-5.5 0-10 4.5-10 10 0 4.5 3.5 8 8.5 9.5.5-2 1.5-3.5 3.5-4.5 2-1 4.5-1.5 6-4 1.5-2.5 1-6-1.5-8.5C16.5 2.5 14.5 2 12 2z";
  const hatPath    = "M6 18c0-3 2-4 4-4s4 1 4 4v2H6v-2zm4-6c-1.5 0-3-1.5-3-3s1.5-3 3-3 3 1.5 3 3-1.5 3-3 3zm7 5v3h2v-3zm-2-5c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5c0 1.5-1.5 2.5-3 2.5";

  const icons = [
    { path: cashewPath, label: 'cashew' },
    { path: chiliPath,  label: 'chili' },
    { path: leafPath,   label: 'leaf' },
    { path: hatPath,    label: 'hat' }
  ];

  for (let i = 0; i < 10; i++) {
    const icon = icons[i % icons.length];
    const el = document.createElement('div');
    el.className = `floating-bg-item float-anim-${(i % 3) + 1}`;
    const size = Math.floor(Math.random() * 36) + 34;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    if (i % 2 === 0) {
      el.style.left = `${Math.random() * 8 + 1}vw`;
    } else {
      el.style.right = `${Math.random() * 8 + 1}vw`;
    }
    el.style.top = `${Math.random() * 80 + 10}vh`;
    el.style.animationDuration = `${Math.random() * 20 + 20}s`;
    el.style.animationDelay = `${Math.random() * -15}s`;
    el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="var(--saffron-gold)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="width:100%; height:100%;"><path d="${icon.path}" /></svg>`;
    container.appendChild(el);
  }
  document.body.appendChild(container);
}
