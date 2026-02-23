/* ============================================================
   money web | Main JavaScript v2
   ============================================================ */
'use strict';

/* ---------- 1. Header: scroll + transparent + hamburger ---------- */
(function () {
  const header  = document.querySelector('.site-header');
  const toggle  = document.querySelector('.nav-toggle');
  const menu    = document.querySelector('.mobile-menu');
  if (!header) return;

  function syncHeader() {
    if (window.scrollY > 60) {
      header.classList.add('site-header--scrolled');
      header.classList.remove('site-header--top');
    } else {
      header.classList.remove('site-header--scrolled');
      if (header.dataset.transparent === 'true') header.classList.add('site-header--top');
    }
  }

  if (header.dataset.transparent === 'true') header.classList.add('site-header--top');
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('is-open');
      menu.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', open);
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('is-open');
        menu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }
})();

/* ---------- 2. Active nav link ---------- */
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav__link, .mobile-menu__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });
})();

/* ---------- 3. Scroll animations (Intersection Observer) ---------- */
(function () {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -50px 0px', threshold: 0.08 });

  els.forEach(el => obs.observe(el));
})();

/* ---------- 4. Smooth scroll for anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- 5. Back to top ---------- */
(function () {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ---------- 6. Category filter (blog/glossary) ---------- */
(function () {
  document.querySelectorAll('.cat-filter').forEach(filter => {
    const btns  = filter.querySelectorAll('.cat-filter__btn');
    const items = document.querySelectorAll('[data-cat]');
    if (!btns.length || !items.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');

        const cat = btn.dataset.cat;
        items.forEach(item => {
          const show = cat === 'all' || item.dataset.cat === cat;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  });
})();

/* ---------- 7. Contact form validation + modal ---------- */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const overlay  = document.getElementById('confirmModal');
  const result   = document.getElementById('formResult');

  function validate(field) {
    const group = field.closest('.form-group');
    const errEl = group?.querySelector('.form-error-msg');
    let msg = '';

    if (field.required && !field.value.trim()) {
      msg = 'この項目は必須です。';
    } else if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      msg = '正しいメールアドレスの形式で入力してください。';
    }

    const invalid = Boolean(msg);
    field.classList.toggle('is-error', invalid);
    if (errEl) { errEl.textContent = msg; errEl.classList.toggle('is-visible', invalid); }
    return !invalid;
  }

  form.querySelectorAll('input, textarea, select').forEach(f => {
    f.addEventListener('blur', () => validate(f));
    f.addEventListener('input', () => { if (f.classList.contains('is-error')) validate(f); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(f => { if (!validate(f)) ok = false; });

    const consent = form.querySelector('#consent');
    if (consent && !consent.checked) {
      const g = consent.closest('.form-group') || consent.parentElement;
      const e = g?.querySelector('.form-error-msg');
      if (e) { e.textContent = '同意が必要です。'; e.classList.add('is-visible'); }
      ok = false;
    }
    if (!ok) return;

    // Show confirm modal
    if (overlay) {
      // Populate summary
      const nameEl  = form.querySelector('#name');
      const emailEl = form.querySelector('#email');
      const sumEl   = document.getElementById('modalSummary');
      if (sumEl && nameEl && emailEl) {
        sumEl.innerHTML = `<strong>${nameEl.value}</strong> 様（${emailEl.value}）<br>の内容で送信します。`;
      }
      overlay.classList.add('is-open');
    } else {
      doSubmit();
    }
  });

  window.closeConfirmModal = () => {
    if (overlay) overlay.classList.remove('is-open');
  };

  window.doSubmit = () => {
    if (overlay) overlay.classList.remove('is-open');
    const btn = form.querySelector('[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = '送信中…'; }

    // Simulate submit (Netlify handles actual submission)
    setTimeout(() => {
      if (result) {
        result.innerHTML = `
          <i class="fa-solid fa-circle-check" style="color:#15803d;margin-right:8px;"></i>
          お問い合わせを受け付けました。<br>
          通常2〜3営業日以内にご連絡いたします。迷惑メールフォルダもご確認ください。`;
        result.style.cssText = 'display:block;padding:16px 20px;background:#DCFCE7;border:1px solid #86EFAC;border-radius:8px;margin-bottom:20px;font-size:.9rem;line-height:1.7;';
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
      if (btn) { btn.disabled = false; btn.textContent = '送信する'; }
    }, 1000);
  };
})();
