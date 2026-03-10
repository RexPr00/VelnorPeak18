const body = document.body;

function initLanguageMenus() {
  document.querySelectorAll('[data-lang-switch]').forEach((wrap) => {
    const btn = wrap.querySelector('.lang-toggle');
    const menu = wrap.querySelector('.lang-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', () => menu.classList.remove('open'));
  });
}

function lockScroll(lock) {
  body.style.overflow = lock ? 'hidden' : '';
}

function trapFocus(container, closeFn) {
  const selectors = 'a, button, input, [tabindex]:not([tabindex="-1"])';
  const nodes = [...container.querySelectorAll(selectors)].filter((el) => !el.disabled);
  if (!nodes.length) return () => {};
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  first.focus();
  const onKey = (e) => {
    if (e.key === 'Escape') closeFn();
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  container.addEventListener('keydown', onKey);
  return () => container.removeEventListener('keydown', onKey);
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const openBtn = document.getElementById('burgerBtn');
  const closeBtn = document.getElementById('drawerClose');
  if (!drawer || !backdrop || !openBtn || !closeBtn) return;

  let untrap = () => {};
  const close = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    lockScroll(false);
    untrap();
    openBtn.focus();
  };
  const open = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    lockScroll(true);
    untrap = trapFocus(drawer, close);
  };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) close();
  });
}

function initFaq() {
  const items = [...document.querySelectorAll('.faq-item')];
  items.forEach((item) => {
    const btn = item.querySelector('.faq-q');
    btn?.addEventListener('click', () => {
      items.forEach((other) => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open');
    });
  });
}

function initModal() {
  const modal = document.getElementById('privacyModal');
  const open = document.querySelectorAll('[data-open-privacy]');
  const closes = document.querySelectorAll('[data-close-privacy]');
  if (!modal) return;
  let untrap = () => {};

  const closeModal = () => {
    modal.classList.remove('open');
    lockScroll(false);
    untrap();
  };

  open.forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('open');
    lockScroll(true);
    untrap = trapFocus(modal.querySelector('.modal-card'), closeModal);
  }));

  closes.forEach((el) => el.addEventListener('click', closeModal));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.card, .visual-card, .review-card, .metric-card, .process-card').forEach((el) => {
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'transform .45s ease, opacity .45s ease';
    io.observe(el);
  });
}

initLanguageMenus();
initDrawer();
initFaq();
initModal();
initReveal();
