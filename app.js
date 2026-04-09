/* ============================================
   JOSE x JOCELYN — Faithful kobykooba.com replica
   Animations: loader, Lenis, GSAP ScrollTrigger,
   section pinning, text reveals, clip-path wipes
   ============================================ */
(function () {
  'use strict';

  let lenis = null;

  /* === LOADER === */
  function runLoader() {
    const loader = document.getElementById('loader');
    const fill = document.getElementById('loaderFill');
    const panels = loader?.querySelectorAll('.loader__panel');
    if (!loader || !fill || !panels?.length || typeof gsap === 'undefined') {
      loader?.remove();
      return initSite();
    }

    const tl = gsap.timeline({
      onComplete() {
        gsap.to(panels[0], { yPercent: -100, duration: 0.7, ease: 'power3.inOut' });
        gsap.to(panels[1], { yPercent: 100, duration: 0.7, ease: 'power3.inOut', delay: 0.06 });
        gsap.to(panels[2], { yPercent: -100, duration: 0.7, ease: 'power3.inOut', delay: 0.12,
          onComplete() { loader.remove(); initSite(); }
        });
      }
    });
    tl.to(fill, { width: '40%', duration: 0.4, ease: 'power2.out' })
      .to(fill, { width: '80%', duration: 0.35, ease: 'power2.out' })
      .to(fill, { width: '100%', duration: 0.25, ease: 'power2.out' });
  }

  /* === INIT === */
  function initSite() {
    initLenis();
    initNav();
    initBurger();
    initAboutTabs();
    initServicesTabs();
    initModal();
    initGSAP();
  }

  /* === LENIS SMOOTH SCROLL === */
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    }
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -40 }); }
      });
    });
  }

  /* === NAV hide on scroll === */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    let last = 0;
    window.addEventListener('scroll', () => {
      const cur = window.scrollY;
      nav.classList.toggle('nav--hidden', cur > last && cur > 300);
      last = cur;
    }, { passive: true });
  }

  /* === BURGER === */
  function initBurger() {
    const btn = document.getElementById('navBurger');
    const menu = document.getElementById('mobileNav');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
      btn.classList.toggle('nav__burger--open');
      menu.classList.toggle('mobile-nav--open');
      document.body.style.overflow = menu.classList.contains('mobile-nav--open') ? 'hidden' : '';
    });
    menu.querySelectorAll('.mobile-nav__link').forEach(l => l.addEventListener('click', () => {
      btn.classList.remove('nav__burger--open');
      menu.classList.remove('mobile-nav--open');
      document.body.style.overflow = '';
    }));
  }

  /* === ABOUT TABS (with | separators) === */
  function initAboutTabs() {
    const tabs = document.querySelectorAll('.about__tab');
    const panels = document.querySelectorAll('.about__panel');
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('about__tab--active'));
      panels.forEach(p => p.classList.remove('about__panel--active'));
      tab.classList.add('about__tab--active');
      document.querySelector(`[data-panel="${tab.dataset.tab}"]`)?.classList.add('about__panel--active');
    }));
  }

  /* === SERVICES TABS === */
  function initServicesTabs() {
    const tabs = document.querySelectorAll('.services__tab');
    const panels = document.querySelectorAll('.services__panel');
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('services__tab--active'));
      panels.forEach(p => p.classList.remove('services__panel--active'));
      tab.classList.add('services__tab--active');
      document.querySelector(`[data-spanel="${tab.dataset.stab}"]`)?.classList.add('services__panel--active');
    }));
  }

  /* === MODAL === */
  function initModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    const steps = modal.querySelectorAll('.modal__step');
    const dots = modal.querySelectorAll('.modal__dot');
    let current = 1;

    function openModal() {
      modal.classList.add('modal--open');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    }
    function closeModal() {
      modal.classList.remove('modal--open');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
      setTimeout(() => { current = 1; goStep(1); }, 400);
    }
    function goStep(n) {
      steps.forEach(s => s.classList.remove('modal__step--active'));
      dots.forEach(d => d.classList.remove('modal__dot--active'));
      modal.querySelector(`[data-mstep="${n}"]`)?.classList.add('modal__step--active');
      dots.forEach(d => { if (parseInt(d.dataset.mdot) <= n) d.classList.add('modal__dot--active'); });
    }

    // Triggers
    document.querySelectorAll('.nav__link--cta, .mobile-nav__link:last-child, .footer__cta').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); openModal(); });
    });

    modal.querySelectorAll('[data-next]').forEach(btn => {
      btn.addEventListener('click', () => { current = parseInt(btn.dataset.next); goStep(current); });
    });
    modal.querySelector('.modal__btn--done')?.addEventListener('click', closeModal);
    modal.querySelector('.modal__bg')?.addEventListener('click', closeModal);
    document.getElementById('modalClose')?.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('modal--open')) closeModal(); });
  }

  /* === GSAP ANIMATIONS === */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* Hero entrance */
    gsap.from('.hero__text-j1', { y: 80, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.1 });
    gsap.from('.hero__text-x', { scale: 0, opacity: 0, duration: 0.7, ease: 'back.out(1.7)', delay: 0.4 });
    gsap.from('.hero__text-j2', { y: 80, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.25 });
    gsap.from('.hero__accent-bar', { scaleX: 0, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5, transformOrigin: 'left center' });

    /* Hero parallax on scroll (kobykooba: content fades/scales out) */
    if (window.innerWidth >= 1024) {
      ScrollTrigger.create({
        trigger: '.hero', start: 'top top', end: 'bottom top',
        onUpdate(self) {
          const el = document.querySelector('.hero__wordmark');
          if (el) {
            el.style.opacity = 1 - self.progress * 1.5;
            el.style.transform = `scale(${1 - self.progress * 0.15}) translateY(${self.progress * -80}px)`;
          }
        }
      });
    }

    /* Intro text reveal (word-by-word fade like kobykooba) */
    gsap.from('.intro__text', {
      scrollTrigger: { trigger: '.intro__right', start: 'top 75%' },
      opacity: 0, y: 40, duration: 1, ease: 'power2.out'
    });
    gsap.from('.intro__dot', {
      scrollTrigger: { trigger: '.intro__right', start: 'top 80%' },
      scale: 0, duration: 0.6, ease: 'back.out(1.7)'
    });

    /* Intro left brand crop — clip-path reveal */
    gsap.from('.intro__brand-crop', {
      scrollTrigger: { trigger: '.intro', start: 'top 60%' },
      clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'power3.inOut'
    });

    /* About section reveals */
    gsap.from('.about__tabs', {
      scrollTrigger: { trigger: '.about', start: 'top 70%' },
      y: 30, opacity: 0, duration: 0.8, ease: 'power2.out'
    });
    gsap.from('.about__body', {
      scrollTrigger: { trigger: '.about', start: 'top 60%' },
      y: 50, opacity: 0, duration: 1, ease: 'power2.out', delay: 0.2
    });

    /* Gallery cards — staggered entrance */
    gsap.from('.gallery__card', {
      scrollTrigger: { trigger: '.gallery', start: 'top 70%' },
      y: 80, opacity: 0, rotation: 20, duration: 0.9, ease: 'power3.out',
      stagger: 0.1
    });
    gsap.from('.gallery__accent-bar', {
      scrollTrigger: { trigger: '.gallery', start: 'top 60%' },
      scaleX: 0, opacity: 0, duration: 1, ease: 'power3.out',
      transformOrigin: 'left center'
    });

    /* Services — clip-path image reveal (kobykooba style) */
    gsap.from('.services__image-inner', {
      scrollTrigger: { trigger: '.services', start: 'top 70%' },
      clipPath: 'inset(20%)', scale: 1.2, duration: 1.2, ease: 'power2.out'
    });
    gsap.from('.services__body', {
      scrollTrigger: { trigger: '.services__content', start: 'top 70%' },
      y: 40, opacity: 0, duration: 0.9, ease: 'power2.out'
    });

    /* Interruption — text entrance */
    gsap.from('.interr__line', {
      scrollTrigger: { trigger: '.interr', start: 'top 65%' },
      y: 60, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.15
    });

    /* Interruption bars parallax */
    gsap.to('.interr__bar--cream', {
      scrollTrigger: { trigger: '.interr', start: 'top bottom', end: 'bottom top', scrub: 1 },
      y: -40, ease: 'none'
    });
    gsap.to('.interr__bar--accent', {
      scrollTrigger: { trigger: '.interr', start: 'top bottom', end: 'bottom top', scrub: 1 },
      y: 30, ease: 'none'
    });

    /* Editorial showcase */
    gsap.from('.editorial__showcase-inner', {
      scrollTrigger: { trigger: '.editorial__showcase', start: 'top 75%' },
      y: 60, opacity: 0, duration: 1, ease: 'power2.out'
    });

    /* Editorial cards — staggered clip-path wipe (kobykooba portfolio reveal) */
    gsap.utils.toArray('.editorial__card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 85%' },
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.9, ease: 'power3.out',
        delay: (i % 2) * 0.15
      });
    });

    /* Footer reveals */
    gsap.from('.footer__logo-svg', {
      scrollTrigger: { trigger: '.footer', start: 'top 80%' },
      x: -60, opacity: 0, duration: 1, ease: 'power2.out'
    });
    gsap.from('.footer__cta', {
      scrollTrigger: { trigger: '.footer', start: 'top 70%' },
      x: 80, rotation: -15, opacity: 0, duration: 1, ease: 'power2.out', delay: 0.2
    });
  }

  /* === BOOT === */
  window.history.scrollRestoration = 'manual';
  window.addEventListener('beforeunload', () => window.scrollTo(0, 0));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runLoader);
  else runLoader();
})();
