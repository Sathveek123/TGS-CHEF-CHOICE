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
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

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

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const progress = (window.scrollY / totalHeight) * 100;
          progressBar.style.width = `${progress}%`;
        }
        ticking = false;
      });
      ticking = true;
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

/** Generates a sequential reference ID: TGS-3001, TGS-3002, TGS-3003... */
function generateOrderId() {
  let seq = parseInt(localStorage.getItem('tgs_order_seq') || '3001', 10);
  if (isNaN(seq) || seq < 3001) seq = 3001;
  const orderId = `TGS-${seq}`;
  localStorage.setItem('tgs_order_seq', (seq + 1).toString());
  return orderId;
}

/** Saves an order / booking record to LocalStorage for the Admin Panel */
function saveAdminRecord(category, record) {
  const storageKey = `tgs_admin_${category}_orders`;
  let list = [];
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) list = JSON.parse(raw);
  } catch (e) {
    console.error('Error reading admin storage:', e);
  }

  record.timestamp = new Date().toISOString();
  record.status = record.status || 'Pending';
  list.unshift(record);

  try {
    localStorage.setItem(storageKey, JSON.stringify(list));
  } catch (e) {
    console.error('Error writing admin storage:', e);
  }
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

    saveAdminRecord('table', {
      orderId,
      name,
      phone,
      date,
      time,
      guests,
      service: service === 'dinein' ? 'Dine-In Table' : 'Takeaway Counter',
      occasion: occasion || 'General Dining',
      notes,
      totalAmount: 1000,
      status: 'Pending'
    });

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

    saveAdminRecord('event', {
      orderId,
      name,
      phone,
      date,
      occasion,
      notes,
      totalAmount: 5000,
      status: 'Pending'
    });

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
}

/* ============================================================
   MENU LIVE SEARCH, DIETARY FILTER & PRICE SORTING
   ============================================================ */
function initMenuSearchAndFilters() {
  const searchInput    = document.getElementById('menuSearch');
  const typeFilter     = document.getElementById('typeFilter');
  const priceSort      = document.getElementById('priceSort');
  const categorySelect = document.getElementById('categorySelect');

  if (!searchInput && !typeFilter && !priceSort && !categorySelect) return;

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

  // Quick Jump Category Dropdown Handler
  categorySelect?.addEventListener('change', () => {
    const catId = categorySelect.value;
    if (!catId) return;
    const targetSection = document.getElementById(catId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/* ============================================================
   MENU MINI-CART & QUICK POPOVER WITH DELETE & GPS LOCATION
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

  const floatingBar     = document.getElementById('cartFloatingBar');
  const barCount        = document.getElementById('cartBadgeCount');
  const barTotal        = document.getElementById('cartBadgeTotal');
  const barSummary      = document.getElementById('cartBarSummary');
  const togglePeekBtn   = document.getElementById('toggleCartPeekBtn');
  const popover         = document.getElementById('cartQuickPopover');
  const popoverList     = document.getElementById('popoverItemList');
  const popoverCount    = document.getElementById('popoverCount');
  const closePopoverBtn = document.getElementById('closePopoverBtn');

  const reviewBtn       = document.getElementById('reviewOrderBtn');
  const modal           = document.getElementById('cartModal');
  const modalList       = document.getElementById('cartModalList');
  const modalTotal      = document.getElementById('cartModalTotal');
  const sendBtn         = document.getElementById('sendCartOrder');
  const keepBtn         = document.getElementById('closeCartModal');
  const cartName        = document.getElementById('cartName');
  const cartPhone       = document.getElementById('cartPhone');
  const deliveryAddressBlock = document.getElementById('deliveryAddressBlock');
  const cartAddress     = document.getElementById('cartAddress');
  const detectGpsBtn    = document.getElementById('detectGpsBtn');
  const gpsStatusText   = document.getElementById('gpsStatusText');
  const cartGpsUrl      = document.getElementById('cartGpsUrl');

  if (!floatingBar || !modal) return;

  function renderPopover() {
    if (!popoverList) return;
    popoverList.innerHTML = '';
    const entries = Object.entries(cart);
    popoverCount.textContent = entries.length;

    if (entries.length === 0) {
      popoverList.innerHTML = `<div style="text-align:center; padding:12px; color:#94A3B8; font-size:0.85rem;">No items selected yet</div>`;
      popover?.classList.remove('open');
      return;
    }

    entries.forEach(([name, item]) => {
      const row = document.createElement('div');
      row.className = 'cart-popover__item';
      row.innerHTML = `
        <div class="cart-popover__item-name" title="${name}">${name}</div>
        <div class="cart-popover__item-price">₹${item.qty * item.price}</div>
        <div class="cart-popover__item-actions">
          <button class="popover-qty-btn popover-minus" data-name="${name}">−</button>
          <span style="font-weight:700; width:16px; text-align:center;">${item.qty}</span>
          <button class="popover-qty-btn popover-plus" data-name="${name}">+</button>
          <button class="popover-delete-btn" data-name="${name}" title="Remove item">🗑️ Delete</button>
        </div>
      `;
      popoverList.appendChild(row);
    });

    // Add event listeners to popover buttons
    popoverList.querySelectorAll('.popover-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const n = btn.dataset.name;
        if (cart[n]) {
          cart[n].qty++;
          updateCardQtyDisplay(n);
          recalcUI();
          renderPopover();
        }
      });
    });

    popoverList.querySelectorAll('.popover-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const n = btn.dataset.name;
        if (cart[n] && cart[n].qty > 0) {
          cart[n].qty--;
          if (cart[n].qty === 0) delete cart[n];
          updateCardQtyDisplay(n);
          recalcUI();
          renderPopover();
        }
      });
    });

    popoverList.querySelectorAll('.popover-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const n = btn.dataset.name;
        delete cart[n];
        updateCardQtyDisplay(n);
        recalcUI();
        renderPopover();
      });
    });
  }

  function updateCardQtyDisplay(name) {
    const card = Array.from(allItems).find(item => item.dataset.name === name);
    if (card) {
      const qtyEl = card.querySelector('.qty-value');
      if (qtyEl) qtyEl.textContent = cart[name] ? cart[name].qty : 0;
    }
  }

  function recalcUI() {
    const totalItems = Object.values(cart).reduce((s, i) => s + i.qty, 0);
    const totalPrice = Object.values(cart).reduce((s, i) => s + i.qty * i.price, 0);

    barCount.textContent = totalItems;
    barTotal.textContent = `₹${totalPrice}`;
    floatingBar.classList.toggle('visible', totalItems > 0);
    document.body.classList.toggle('cart-active', totalItems > 0);

    if (totalItems === 0) {
      popover?.classList.remove('open');
    }

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
      if (popover?.classList.contains('open')) renderPopover();
    });

    minus.addEventListener('click', () => {
      if (!cart[name] || cart[name].qty === 0) return;
      cart[name].qty--;
      qtyEl.textContent = cart[name].qty;
      if (cart[name].qty === 0) delete cart[name];
      recalcUI();
      if (popover?.classList.contains('open')) renderPopover();
    });
  });

  // Toggle Cart Popover Peak
  function togglePopover() {
    renderPopover();
    popover?.classList.toggle('open');
  }

  barSummary?.addEventListener('click', togglePopover);
  togglePeekBtn?.addEventListener('click', togglePopover);
  closePopoverBtn?.addEventListener('click', () => popover?.classList.remove('open'));

  // GPS Location Detection Handler
  detectGpsBtn?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      if (gpsStatusText) gpsStatusText.textContent = '❌ GPS not supported on your browser.';
      return;
    }

    if (gpsStatusText) gpsStatusText.textContent = '⏳ Detecting location...';

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const customerPinUrl = `https://maps.google.com/?q=${lat.toFixed(5)},${lng.toFixed(5)}`;
        // Turn-by-turn Driving Route from TGS ChefChoice Kasibugga to Customer Delivery Location
        const routeFromTgsUrl = `https://www.google.com/maps/dir/?api=1&origin=TGS+ChefChoice+Kasibugga&destination=${lat.toFixed(5)},${lng.toFixed(5)}`;

        if (cartGpsUrl) cartGpsUrl.value = customerPinUrl;
        window.tgsRouteUrl = routeFromTgsUrl;

        try {
          if (gpsStatusText) gpsStatusText.textContent = '📍 Resolving street address...';
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { 'Accept-Language': 'en-US,en;q=0.9' }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              if (cartAddress) cartAddress.value = data.display_name;
              if (gpsStatusText) gpsStatusText.textContent = '✅ Location & Address Detected!';
              return;
            }
          }
        } catch (err) {
          console.warn('Reverse geocoding error:', err);
        }

        if (cartAddress && !cartAddress.value) {
          cartAddress.value = `📍 Current GPS Coords: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }
        if (gpsStatusText) gpsStatusText.textContent = '✅ Location Detected!';
      },
      err => {
        if (gpsStatusText) gpsStatusText.textContent = '⚠️ Location permission denied or timed out.';
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });

  // Order Type Radio Selection Handler
  document.querySelectorAll('input[name="cartOrderType"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.cart-type-option').forEach(o => o.classList.remove('selected'));
      radio.closest('.cart-type-option')?.classList.add('selected');

      const val = radio.value;
      if (deliveryAddressBlock) {
        // Delivery Address & GPS Block ONLY required for Delivery! Dine-In & Takeaway do not ask for delivery address!
        deliveryAddressBlock.style.display = (val === 'delivery') ? 'block' : 'none';
      }
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

    // Sync delivery address block visibility based on selected order type
    const selectedType = document.querySelector('input[name="cartOrderType"]:checked')?.value || 'dinein';
    if (deliveryAddressBlock) {
      deliveryAddressBlock.style.display = (selectedType === 'delivery') ? 'block' : 'none';
    }

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

  // "Send via WhatsApp" 
  sendBtn?.addEventListener('click', () => {
    const name  = cartName?.value.trim() || '';
    const phone = cartPhone?.value.trim() || '';

    if (!name || name.length < 2) { cartName.classList.add('invalid'); cartName.focus(); return; }
    else cartName.classList.remove('invalid');

    if (!/^[6-9][0-9]{9}$/.test(phone)) { cartPhone.classList.add('invalid'); cartPhone.focus(); return; }
    else cartPhone.classList.remove('invalid');

    const orderType = document.querySelector('input[name="cartOrderType"]:checked')?.value || 'dinein';
    const address   = cartAddress?.value.trim() || '';
    const gpsUrl    = cartGpsUrl?.value || '';
    const orderId   = generateOrderId();

    let msg = `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📋 *NEW ORDER — TGS CHEFCHOICE*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `🆔 *Order ID:* ${orderId}\n\n`;
    if (window.tgsTableNumber) {
      msg += `🪑 *Table Number:* Table ${window.tgsTableNumber}\n\n`;
    }
    msg += `👤 *Customer Name:* ${name}\n\n`;
    msg += `📞 *Phone Number:* ${phone}\n\n`;

    const typeLabel = orderType === 'dinein' 
      ? '🪑 DINE-IN TABLE' 
      : (orderType === 'delivery' ? '🏠 HOME DELIVERY' : '🥡 TAKEAWAY COUNTER');
    msg += `🚲 *Order Type:* ${typeLabel}\n\n`;

    if (orderType === 'delivery') {
      msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `📍 *DELIVERY LOCATION DETAILS*\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

      if (address) {
        msg += `🏡 *Delivery Address:*\n${address}\n\n`;
      }
      if (gpsUrl) {
        msg += `📍 *Customer GPS Pin:*\n${gpsUrl}\n\n`;
      }
      if (window.tgsRouteUrl) {
        msg += `🚗 *Driving Route from TGS:*\n${window.tgsRouteUrl}\n\n`;
      }
    } else if (orderType === 'takeaway') {
      msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `🥡 *TAKEAWAY PARCEL INFO*\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      msg += `ℹ️ Customer will pick up parcel directly at TGS Counter.\n\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🍲 *ITEMS ORDERED*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    let total = 0;
    Object.entries(cart).forEach(([itemName, item]) => {
      msg += `• ${item.qty} × ${itemName} — ₹${item.qty * item.price}\n\n`;
      total += item.qty * item.price;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💰 *TOTAL AMOUNT: ₹${total}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `📱 *TAP TO PAY VIA UPI (PhonePe / GPay / Paytm):*\n`;
    msg += `upi://pay?pa=9701325292@okbizaxis&pn=TGS%20ChefChoice&am=${total}&cu=INR\n\n`;

    msg += `📸 *PAYMENT & ORDER VERIFICATION:*\n`;
    msg += `• If paying via UPI, tap the link above (Mobile) and reply with a screenshot of your payment receipt.\n`;
    msg += `• If paying Cash on Delivery / Counter Pickup, reply "CASH" in this chat.\n\n`;

    msg += `_Order placed via tgs-chef-choice.vercel.app_`;

    // Save record to Admin Dashboard LocalStorage BEFORE opening WhatsApp
    saveAdminRecord('food', {
      orderId,
      name,
      phone,
      orderType,
      address: address || (orderType === 'takeaway' ? 'Takeaway Counter Pickup' : 'Dine-In Table'),
      gpsUrl,
      items: Object.entries(cart).map(([n, i]) => ({ name: n, qty: i.qty, price: i.price })),
      totalAmount: total,
      status: 'Awaiting WA',
      paymentStatus: 'Unpaid'
    });

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/919701325292?text=${encoded}`, '_blank');
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
  // Disable floating elements on mobile viewports for 60fps fast performance
  if (window.innerWidth < 768) return;

  const container = document.createElement('div');
  container.className = 'floating-bg-container';
  container.style.cssText = 'position:fixed; inset:0; pointer-events:none; z-index:950; overflow:hidden; transform:translateZ(0);';

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

  for (let i = 0; i < 6; i++) {
    const icon = icons[i % icons.length];
    const el = document.createElement('div');
    el.className = `floating-bg-item float-anim-${(i % 3) + 1}`;
    const size = Math.floor(Math.random() * 28) + 28;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.willChange = 'transform, opacity';
    el.style.opacity = '0.12';
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
