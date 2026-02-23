/* ============================================
   money web | Main JavaScript
   ============================================ */

'use strict';

/* ---------- Header scroll behaviour ---------- */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add('site-header--scrolled');
      header.classList.remove('site-header--top');
    } else {
      header.classList.remove('site-header--scrolled');
      if (header.dataset.transparent === 'true') {
        header.classList.add('site-header--top');
      }
    }
  }

  if (header.dataset.transparent === 'true') {
    header.classList.add('site-header--top');
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
})();


/* ---------- Mobile Navigation ---------- */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.mobile-menu');
  const body   = document.body;

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('is-open');
    menu.classList.toggle('is-open', isOpen);
    body.style.overflow = isOpen ? 'hidden' : '';
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('is-open');
      menu.classList.remove('is-open');
      body.style.overflow = '';
    });
  });

  // Close on backdrop click (outside menu content)
  menu.addEventListener('click', (e) => {
    if (e.target === menu) {
      toggle.classList.remove('is-open');
      menu.classList.remove('is-open');
      body.style.overflow = '';
    }
  });
})();


/* ---------- Scroll Animations (Intersection Observer) ---------- */
(function () {
  const targets = document.querySelectorAll('.fade-up, .fade-in, .stagger');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  targets.forEach(el => observer.observe(el));
})();


/* ---------- Hero bg loaded class ---------- */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  setTimeout(() => hero.classList.add('is-loaded'), 100);
})();


/* ---------- Back to Top ---------- */
(function () {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ---------- Active nav link ---------- */
(function () {
  const links = document.querySelectorAll('.site-nav__link, .mobile-menu__link');
  const path  = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });
})();


/* ---------- Contact Form Validation ---------- */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const result = document.getElementById('formResult');

  function validateField(field) {
    const group = field.closest('.form-group');
    const error = group ? group.querySelector('.form-error') : null;
    let valid = true;
    let msg   = '';

    if (field.required && !field.value.trim()) {
      valid = false;
      msg = 'この項目は必須です。';
    } else if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      valid = false;
      msg = '正しいメールアドレスを入力してください。';
    }

    if (error) {
      error.textContent = msg;
      error.classList.toggle('is-visible', !valid);
    }
    field.classList.toggle('is-error', !valid);
    return valid;
  }

  // Real-time validation on blur
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('is-error')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    form.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    // Checkbox
    const consent = form.querySelector('#consent');
    if (consent && !consent.checked) {
      const label = consent.closest('.form-check');
      if (label) {
        const err = label.querySelector('.form-error') || (() => {
          const el = document.createElement('span');
          el.className = 'form-error';
          label.appendChild(el);
          return el;
        })();
        err.textContent = '個人情報の取り扱いに同意してください。';
        err.classList.add('is-visible');
      }
      allValid = false;
    }

    if (!allValid) return;

    // Simulate submission (no backend)
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中…';

    setTimeout(() => {
      if (result) {
        result.className = 'form-result form-result--success';
        result.innerHTML = '<i class="fa-solid fa-circle-check"></i> お問い合わせを受け付けました。<br>通常2〜3営業日以内にご連絡いたします。';
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = '送信する';
    }, 1200);
  });
})();


/* ---------- Smooth Scroll for anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80; // header height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
