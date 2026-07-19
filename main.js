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
  initFloatingIngredients();
});

/* ---------------- Shared Navigation Auto-Highlight & Toggle ---------------- */
function initSharedNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
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

/* ---------------- Client-Side Order Form Validation ---------------- */
function initOrderFormValidation() {
  const form = document.getElementById('orderForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('time');

  function validateName() {
    if (!nameInput) return true;
    const val = nameInput.value.trim();
    const errSpan = document.getElementById('nameError');
    if (!val || val.length < 2 || !/^[a-zA-Z\s]+$/.test(val)) {
      nameInput.classList.add('invalid');
      if (errSpan) errSpan.textContent = 'Please enter your full name.';
      return false;
    } else {
      nameInput.classList.remove('invalid');
      if (errSpan) errSpan.textContent = '';
      return true;
    }
  }

  function validatePhone() {
    if (!phoneInput) return true;
    const val = phoneInput.value.replace(/[\s\-]/g, '').trim();
    const errSpan = document.getElementById('phoneError');
    if (!/^[0-9]{10}$/.test(val)) {
      phoneInput.classList.add('invalid');
      if (errSpan) errSpan.textContent = 'Enter a valid 10-digit number.';
      return false;
    } else {
      phoneInput.classList.remove('invalid');
      if (errSpan) errSpan.textContent = '';
      return true;
    }
  }

  function validateDate() {
    if (!dateInput) return true;
    const val = dateInput.value;
    const errSpan = document.getElementById('dateError');
    if (!val) {
      dateInput.classList.add('invalid');
      if (errSpan) errSpan.textContent = 'Please choose a date.';
      return false;
    }
    const selected = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected < today) {
      dateInput.classList.add('invalid');
      if (errSpan) errSpan.textContent = 'Please choose a future date.';
      return false;
    } else {
      dateInput.classList.remove('invalid');
      if (errSpan) errSpan.textContent = '';
      return true;
    }
  }

  function validateTime() {
    if (!timeInput) return true;
    const val = timeInput.value;
    const errSpan = document.getElementById('timeError');
    if (!val) {
      timeInput.classList.add('invalid');
      if (errSpan) errSpan.textContent = 'Please select a time.';
      return false;
    } else {
      timeInput.classList.remove('invalid');
      if (errSpan) errSpan.textContent = '';
      return true;
    }
  }

  if (nameInput) nameInput.addEventListener('blur', validateName);
  if (phoneInput) phoneInput.addEventListener('blur', validatePhone);
  if (dateInput) dateInput.addEventListener('blur', validateDate);
  if (timeInput) timeInput.addEventListener('blur', validateTime);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isNameValid = validateName();
    const isPhoneValid = validatePhone();
    const isDateValid = validateDate();
    const isTimeValid = validateTime();

    if (isNameValid && isPhoneValid && isDateValid && isTimeValid) {
      window.location.href = 'thank-you.html';
    }
  });
}

/* ---------------- Client-Side Event Form Validation ---------------- */
function initEventFormValidation() {
  const form = document.getElementById('eventForm');
  if (!form) return;

  const nameInput = document.getElementById('ev-name');
  const phoneInput = document.getElementById('ev-phone');
  const dateInput = document.getElementById('ev-date');
  const guestsSelect = document.getElementById('ev-guests');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameInput.classList.add('invalid');
      valid = false;
    } else {
      nameInput.classList.remove('invalid');
    }

    const phoneVal = phoneInput.value.replace(/[\s\-]/g, '').trim();
    if (!/^[0-9]{10}$/.test(phoneVal)) {
      phoneInput.classList.add('invalid');
      valid = false;
    } else {
      phoneInput.classList.remove('invalid');
    }

    if (!dateInput.value) {
      dateInput.classList.add('invalid');
      valid = false;
    } else {
      dateInput.classList.remove('invalid');
    }

    if (!guestsSelect.value) {
      guestsSelect.classList.add('invalid');
      valid = false;
    } else {
      guestsSelect.classList.remove('invalid');
    }

    if (valid) {
      window.location.href = 'thank-you.html';
    }
  });
}

/* ---------------- Client-Side Contact Form Validation ---------------- */
function initContactFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('c-name');
  const phoneInput = document.getElementById('c-phone');
  const emailInput = document.getElementById('c-email');
  const subjectSelect = document.getElementById('c-subject');
  const messageInput = document.getElementById('c-message');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameInput.classList.add('invalid');
      valid = false;
    } else {
      nameInput.classList.remove('invalid');
    }

    const phoneVal = phoneInput.value.replace(/[\s\-]/g, '').trim();
    if (!/^[0-9]{10}$/.test(phoneVal)) {
      phoneInput.classList.add('invalid');
      valid = false;
    } else {
      phoneInput.classList.remove('invalid');
    }

    if (emailInput && emailInput.value.trim().length > 0) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        emailInput.classList.add('invalid');
        valid = false;
      } else {
        emailInput.classList.remove('invalid');
      }
    }

    if (!subjectSelect.value) {
      subjectSelect.classList.add('invalid');
      valid = false;
    } else {
      subjectSelect.classList.remove('invalid');
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      messageInput.classList.add('invalid');
      valid = false;
    } else {
      messageInput.classList.remove('invalid');
    }

    if (valid) {
      window.location.href = 'thank-you.html';
    }
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

/* ---------------- Floating Culinary Ingredients background ---------------- */
function initFloatingIngredients() {
  const container = document.createElement('div');
  container.className = 'floating-bg-container';
  container.style.cssText = 'position:fixed; inset:0; pointer-events:none; z-index:950; overflow:hidden;';

  // Detailed SVG outlines for Palasa cashews, chili, leaf, chef hat
  const cashewPath = "M12 3a7 7 0 0 0-7 7c0 4 3 6.5 5 8s4 2.5 6.5 2.5c2 0 4-1.5 4-3.5s.5-4-1-5.5-3.5-2-5.5-2a4 4 0 0 1-1.5-3c0-2 1.5-3.5 3.5-3.5";
  const chiliPath = "M16.5 3.5a1.5 1.5 0 0 1 2.2 2.2l-11 11a4.5 4.5 0 0 1-6.4-6.4l11-11a1.5 1.5 0 0 1 2.2 2.2M7.5 16.5c-2 2-5 2-7 0m14-11l3 3";
  const leafPath = "M12 2c-5.5 0-10 4.5-10 10 0 4.5 3.5 8 8.5 9.5.5-2 1.5-3.5 3.5-4.5 2-1 4.5-1.5 6-4 1.5-2.5 1-6-1.5-8.5C16.5 2.5 14.5 2 12 2z";
  const hatPath = "M6 18c0-3 2-4 4-4s4 1 4 4v2H6v-2zm4-6c-1.5 0-3-1.5-3-3s1.5-3 3-3 3 1.5 3 3-1.5 3-3 3zm7 5v3h2v-3zm-2-5c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5c0 1.5-1.5 2.5-3 2.5";

  const icons = [
    { path: cashewPath, label: 'cashew' },
    { path: chiliPath, label: 'chili' },
    { path: leafPath, label: 'leaf' },
    { path: hatPath, label: 'hat' }
  ];

  // Spawn 10 floating elements on the side margins so they are 100% visible
  for (let i = 0; i < 10; i++) {
    const icon = icons[i % icons.length];
    const el = document.createElement('div');
    el.className = `floating-bg-item float-anim-${(i % 3) + 1}`;
    
    // Random sizes between 34px and 70px
    const size = Math.floor(Math.random() * 36) + 34;
    
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    
    // Position on left 10vw or right 10vw so they overlay page margins
    if (i % 2 === 0) {
      el.style.left = `${Math.random() * 8 + 1}vw`;
    } else {
      el.style.right = `${Math.random() * 8 + 1}vw`;
    }
    
    el.style.top = `${Math.random() * 80 + 10}vh`;
    el.style.animationDuration = `${Math.random() * 20 + 20}s`; // 20s to 40s drift speed
    el.style.animationDelay = `${Math.random() * -15}s`; // start at different timelines
    
    el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="var(--saffron-gold)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="width:100%; height:100%;"><path d="${icon.path}" /></svg>`;
    container.appendChild(el);
  }
  document.body.appendChild(container);
}
