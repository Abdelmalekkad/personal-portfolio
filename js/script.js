// Portfolio interactive scripts - KADDOUR Abdelmalek Islam

'use strict';

document.addEventListener('DOMContentLoaded', initPortfolio);

function initPortfolio() {
  initMobileNav();
  initScrollHeader();
  initActiveNavLinks();
  initRevealAnimations();
  initContactForm();
  initFooterYear();
  initCourSpaceGallery();
  initLanguage();
}

// Mobile navigation toggle
function initMobileNav() {
  const toggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('nav-links');

  if (!toggle || !navList) return;

  function setMenuOpen(isOpen) {
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    navList.classList.toggle('nav-open', isOpen);
  }

  toggle.addEventListener('click', () => {
    const isCurrentlyOpen = toggle.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isCurrentlyOpen);
  });

  navList.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('click', event => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (!isOpen) return;
    const clickedInsideNav = navList.contains(event.target) || toggle.contains(event.target);
    if (!clickedInsideNav) setMenuOpen(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      toggle.focus();
    }
  });
}

// Header shadow on scroll
function initScrollHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const threshold = 20;

  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > threshold);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

// Active navigation link highlighting
function initActiveNavLinks() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!navLinks.length) return;

  const sectionMap = new Map();
  navLinks.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (section) sectionMap.set(section, link);
  });

  if (!sectionMap.size) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const correspondingLink = sectionMap.get(entry.target);
        if (correspondingLink) {
          correspondingLink.classList.add('active');
        }
      }
    });
  }, {
    rootMargin: '-25% 0px -65% 0px',
    threshold: 0
  });

  sectionMap.forEach((_, section) => observer.observe(section));
}

// Scroll reveal animations
function initRevealAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (prefersReducedMotion) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  elements.forEach(el => observer.observe(el));
}

// Contact form validation
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const feedback = document.getElementById('form-feedback');

  if (!form) return;

  const isDemo = form.dataset.demo === 'true';

  const fields = [
    {
      id: 'contact-name',
      errorId: 'name-error',
      label: 'Full name',
      validate: value => {
        if (!value.trim()) return 'Please enter your name.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        return null;
      }
    },
    {
      id: 'contact-email',
      errorId: 'email-error',
      label: 'Email address',
      validate: value => {
        if (!value.trim()) return 'Please enter your email address.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
        return null;
      }
    },
    {
      id: 'contact-subject',
      errorId: 'subject-error',
      label: 'Subject',
      validate: value => {
        if (!value.trim()) return 'Please enter a subject.';
        if (value.trim().length < 3) return 'Subject must be at least 3 characters.';
        return null;
      }
    },
    {
      id: 'contact-message',
      errorId: 'message-error',
      label: 'Message',
      validate: value => {
        if (!value.trim()) return 'Please write your message.';
        if (value.trim().length < 10) return 'Message must be at least 10 characters.';
        return null;
      }
    }
  ];

  function setFieldError(field, message) {
    const input = document.getElementById(field.id);
    const errorEl = document.getElementById(field.errorId);
    if (!input || !errorEl) return;

    if (message) {
      input.classList.add('invalid');
      input.setAttribute('aria-invalid', 'true');
      errorEl.textContent = message;
    } else {
      input.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
      errorEl.textContent = '';
    }
  }

  // Real-time validation on blur and input
  fields.forEach(field => {
    const input = document.getElementById(field.id);
    if (!input) return;

    input.addEventListener('blur', () => {
      const error = field.validate(input.value);
      setFieldError(field, error);
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) {
        const error = field.validate(input.value);
        if (!error) setFieldError(field, null);
      }
    });
  });

  function showFeedback(type, message) {
    if (!feedback) return;
    feedback.hidden = false;
    feedback.className = 'form-feedback ' + type;
    feedback.textContent = message;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideFeedback() {
    if (!feedback) return;
    feedback.hidden = true;
    feedback.className = 'form-feedback';
    feedback.textContent = '';
  }

  // Handle form submission
  form.addEventListener('submit', async event => {
    event.preventDefault();
    hideFeedback();

    let firstInvalidInput = null;
    let hasErrors = false;

    fields.forEach(field => {
      const input = document.getElementById(field.id);
      const error = field.validate(input ? input.value : '');
      setFieldError(field, error);
      if (error) {
        hasErrors = true;
        if (!firstInvalidInput) firstInvalidInput = input;
      }
    });

    if (hasErrors) {
      if (firstInvalidInput) firstInvalidInput.focus();
      return;
    }

    if (isDemo) {
      const isArabic = document.documentElement.lang === 'ar';
      showFeedback(
        'success',
        isArabic ? '✓ شكراً لك! تم إرسال رسالتك بنجاح.' : '✓ Thank you! Your message has been sent successfully.'
      );
      form.reset();
      fields.forEach(field => setFieldError(field, null));
      submitBtn.disabled = true;
      setTimeout(() => { submitBtn.disabled = false; }, 4000);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        showFeedback('success', '✓ Your message has been sent. Thank you!');
        form.reset();
        fields.forEach(field => setFieldError(field, null));
      } else {
        showFeedback('error', '✗ Something went wrong. Please try again.');
      }
    } catch {
      showFeedback('error', '✗ Network error. Please check your connection and try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

// Footer year
function initFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// CourSpace gallery and lightbox modal
function initCourSpaceGallery() {
  const thumbs = document.querySelectorAll('.project-gallery__thumb');
  const mainImg = document.getElementById('courspace-main-img');
  const zoomBtn = document.getElementById('courspace-zoom-btn');
  const modal = document.getElementById('courspace-modal');
  const modalImg = document.getElementById('courspace-modal-img');
  const modalCaption = document.getElementById('courspace-modal-caption');
  const modalClose = document.getElementById('courspace-modal-close');

  if (!thumbs.length || !mainImg) return;

  function selectThumb(thumb) {
    thumbs.forEach(t => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });

    thumb.classList.add('is-active');
    thumb.setAttribute('aria-selected', 'true');

    const newSrc = thumb.getAttribute('data-img-src');
    const newCaption = thumb.getAttribute('data-caption') || thumb.getAttribute('aria-label');

    if (newSrc) {
      mainImg.src = newSrc;
      mainImg.alt = newCaption;
    }
  }

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => selectThumb(thumb));
    thumb.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectThumb(thumb);
      }
    });
  });

  function openModal() {
    if (!modal || !modalImg) return;

    const activeThumb = document.querySelector('.project-gallery__thumb.is-active') || thumbs[0];
    const src = activeThumb ? activeThumb.getAttribute('data-img-src') : mainImg.src;
    const caption = activeThumb ? activeThumb.getAttribute('data-caption') : mainImg.alt;

    modalImg.src = src;
    modalImg.alt = caption;
    if (modalCaption) modalCaption.textContent = caption;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (modalClose) modalClose.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (zoomBtn) zoomBtn.focus();
  }

  if (zoomBtn) zoomBtn.addEventListener('click', openModal);
  if (mainImg) mainImg.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', event => {
      if (event.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

// Language switcher (English / Arabic)
function initLanguage() {
  const langBtn = document.getElementById('lang-switch-btn');
  const langText = document.getElementById('lang-text');

  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = urlParams.get('lang');
  const savedLang = localStorage.getItem('portfolio_lang');

  let currentLang = 'en';
  if (paramLang === 'ar' || paramLang === 'en') {
    currentLang = paramLang;
  } else if (savedLang === 'ar' || savedLang === 'en') {
    currentLang = savedLang;
  }

  function applyLanguage(lang) {
    if (typeof TRANSLATIONS === 'undefined' || !TRANSLATIONS[lang]) return;
    currentLang = lang;
    localStorage.setItem('portfolio_lang', lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    if (langText) {
      langText.textContent = TRANSLATIONS[lang].langToggle;
    }
    if (langBtn) {
      langBtn.setAttribute('aria-label', TRANSLATIONS[lang].langToggleAria);
    }

    const translatableElements = document.querySelectorAll('[data-i18n]');
    translatableElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (TRANSLATIONS[lang][key] !== undefined) {
        if (TRANSLATIONS[lang][key].includes('<')) {
          el.innerHTML = TRANSLATIONS[lang][key];
        } else {
          el.textContent = TRANSLATIONS[lang][key];
        }
      }
    });

    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (TRANSLATIONS[lang][key] !== undefined) {
        el.placeholder = TRANSLATIONS[lang][key];
      }
    });

    const ariaElements = document.querySelectorAll('[data-i18n-aria]');
    ariaElements.forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (TRANSLATIONS[lang][key] !== undefined) {
        el.setAttribute('aria-label', TRANSLATIONS[lang][key]);
      }
    });

    const altElements = document.querySelectorAll('[data-i18n-alt]');
    altElements.forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      if (TRANSLATIONS[lang][key] !== undefined) {
        el.setAttribute('alt', TRANSLATIONS[lang][key]);
      }
    });

    // Update CourSpace gallery captions
    const thumb1 = document.querySelector('.project-gallery__thumb:nth-child(1)');
    if (thumb1) thumb1.setAttribute('data-caption', TRANSLATIONS[lang].captionThumb1);
    const thumb2 = document.querySelector('.project-gallery__thumb:nth-child(2)');
    if (thumb2) thumb2.setAttribute('data-caption', TRANSLATIONS[lang].captionThumb2);
    const thumb3 = document.querySelector('.project-gallery__thumb:nth-child(3)');
    if (thumb3) thumb3.setAttribute('data-caption', TRANSLATIONS[lang].captionThumb3);
    const thumb4 = document.querySelector('.project-gallery__thumb:nth-child(4)');
    if (thumb4) thumb4.setAttribute('data-caption', TRANSLATIONS[lang].captionThumb4);
    const thumb5 = document.querySelector('.project-gallery__thumb:nth-child(5)');
    if (thumb5) thumb5.setAttribute('data-caption', TRANSLATIONS[lang].captionThumb5);

    const mainImg = document.getElementById('courspace-main-img');
    const activeThumb = document.querySelector('.project-gallery__thumb.is-active');
    if (mainImg && activeThumb) {
      mainImg.alt = activeThumb.getAttribute('data-caption');
    }
  }

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'en' ? 'ar' : 'en';
      applyLanguage(nextLang);
    });
  }

  applyLanguage(currentLang);
}
