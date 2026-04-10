/* ============================================
   JOSE x JOCELYN — Faithful kobykooba.com replica
   Animations: loader, native scroll, GSAP ScrollTrigger,
   section pinning, text reveals, clip-path wipes
   ============================================ */
(function () {
  'use strict';

  /* === LOADER === */
  function runLoader() {
    const loader = document.getElementById('loader');
    const fill = document.getElementById('loaderFill');
    const panels = loader?.querySelectorAll('.loader__panel');
    if (!loader || !fill || !panels?.length || typeof gsap === 'undefined') {
      showHeroInstantly();
      loader?.remove();
      return initSite();
    }

    const wipeEase = 'power3.inOut';
    const wipeDur = 0.88;

    const tl = gsap.timeline({
      onComplete() {
        loader.remove();
        initSite();
      },
    });

    tl.to(fill, { width: '35%', duration: 0.35, ease: 'power2.out' })
      .to(fill, { width: '72%', duration: 0.32, ease: 'power2.out' })
      .to(fill, { width: '100%', duration: 0.28, ease: 'power2.out' })
      .add('wipe')
      .to(
        panels[0],
        { xPercent: -100, duration: wipeDur, ease: wipeEase, force3D: true },
        'wipe'
      )
      .to(
        panels[1],
        { xPercent: 100, duration: wipeDur, ease: wipeEase, force3D: true },
        'wipe+=0.08'
      )
      .to(
        panels[2],
        { xPercent: -100, duration: wipeDur, ease: wipeEase, force3D: true },
        'wipe+=0.16'
      )
      /* Hero elements fade in as panels slide away (not after) */
      .fromTo('.hero__sun',     { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.75, ease: 'power2.out', stagger: 0.1 }, 'wipe')
      .fromTo('.hero__j',       { y: 80, opacity: 0 },       { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out', stagger: 0.13 }, 'wipe+=0.05')
      .fromTo('.hero__x',       { scale: 0, opacity: 0 },    { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.7)' }, 'wipe+=0.2')
      .fromTo('.hero__names',   { y: 20, opacity: 0 },       { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, 'wipe+=0.3')
      .fromTo('.hero__tagline', { y: 16, opacity: 0 },       { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, 'wipe+=0.4')
      .fromTo('.hero__rule',    { scaleX: 0, opacity: 0 },   { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out', transformOrigin: 'center center' }, 'wipe+=0.48')
      .fromTo('.hero__foot',    { y: 12, opacity: 0 },       { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 'wipe+=0.55');
  }

  /* Fallback: if loader is missing or GSAP isn't loaded, reveal hero elements */
  function showHeroInstantly() {
    document.querySelectorAll('.hero__sun, .hero__jxj, .hero__names, .hero__tagline, .hero__rule, .hero__foot')
      .forEach(el => { el.style.opacity = '1'; });
  }

  /* === INIT === */
  function initSite() {
    initAnchorScroll();
    initNav();
    initBurger();
    initAboutTabs();
    initServicesTabs();
    initGallery();
    initModal();
    initGSAP();
  }

  /* === IN-PAGE ANCHORS (native scroll) === */
  function initAnchorScroll() {
    const navOffset = 80;
    const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - navOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion() ? 'auto' : 'smooth' });
      });
    });
  }

  /* === ABOUT TABS === */
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


  /* === GALLERY — kobykooba-style horizontal rotating carousel === */
  function initGallery() {
    const cards = Array.from(document.querySelectorAll('.gallery__card'));
    if (!cards.length || typeof anime === 'undefined') return;

    const N = cards.length;      // 6 cards
    let activeIdx = 0;           // which logical card is in center position

    // Track dimensions for responsive sizing
    const track = document.getElementById('galleryTrack');
    function getTrackW() { return track ? track.offsetWidth : 1200; }
    function isMobile() { return window.innerWidth < 768; }

    /*
     * Position slots (0-based from left to right):
     *   slot 0: far left   — large square, no rotation
     *   slot 1: left-mid   — small square, behind + rotated
     *   slot 2: center     — TALLEST rectangle, no rotation, z-top
     *   slot 3: right-mid  — small square, behind + rotated
     *   slot 4: far right  — large square, no rotation
     *   slot 5+: hidden (offscreen or invisible for >5 card setups)
     */
    function getSlots() {
      const tw = getTrackW();
      const mob = isMobile();

      // Card sizes
      const bigW   = mob ? tw * 0.38 : tw * 0.24;   // far-left, far-right cards
      const bigH   = mob ? bigW * 1.05 : bigW * 1.05;
      const centerW = mob ? tw * 0.42 : tw * 0.28;   // center card
      const centerH = mob ? centerW * 1.4 : centerW * 1.4;
      const smallW  = mob ? tw * 0.22 : tw * 0.16;   // overlap cards
      const smallH  = mob ? smallW * 1.0 : smallW * 1.0;

      const centerX = tw / 2;
      const trackH  = mob ? 320 : 480;
      const centerY  = trackH / 2;

      return [
        // slot 0 — far left
        { x: centerX - tw * 0.37, y: centerY,
          w: bigW, h: bigH, rotate: 0, z: 3, opacity: 1 },
        // slot 1 — left-mid (smaller, overlaps between 0 and 2, rotated)
        { x: centerX - tw * 0.17, y: centerY,
          w: smallW, h: smallH, rotate: 12, z: 2, opacity: 1 },
        // slot 2 — CENTER (tallest, no rotation)
        { x: centerX, y: centerY,
          w: centerW, h: centerH, rotate: 0, z: 5, opacity: 1 },
        // slot 3 — right-mid (smaller, overlaps between 2 and 4, rotated)
        { x: centerX + tw * 0.17, y: centerY,
          w: smallW, h: smallH, rotate: -10, z: 2, opacity: 1 },
        // slot 4 — far right
        { x: centerX + tw * 0.37, y: centerY,
          w: bigW, h: bigH, rotate: 0, z: 3, opacity: 1 },
        // slot 5 — hidden (for 6th card)
        { x: centerX + tw * 0.58, y: centerY,
          w: bigW, h: bigH, rotate: 0, z: 0, opacity: 0 },
      ];
    }

    function layout(animate) {
      const slots = getSlots();

      cards.forEach((card, i) => {
        // Map card to slot based on rotation offset
        const slotIdx = ((i - activeIdx) % N + N) % N;
        const slot = slots[slotIdx] || slots[slots.length - 1];

        card.style.zIndex = slot.z;

        const props = {
          left: slot.x - slot.w / 2,
          top: slot.y - slot.h / 2,
          width: slot.w,
          height: slot.h,
          rotate: `${slot.rotate}deg`,
          opacity: slot.opacity,
        };

        if (animate) {
          anime({
            targets: card,
            ...props,
            duration: 800,
            easing: 'cubicBezier(0.16, 1, 0.3, 1)',
          });
        } else {
          anime.set(card, props);
        }
      });
    }

    // Initial snap (no animation), then fade in
    layout(false);
    anime({
      targets: cards,
      opacity: (el, i) => {
        const slotIdx = ((i - activeIdx) % N + N) % N;
        return slotIdx < 5 ? 1 : 0;
      },
      duration: 600,
      easing: 'easeOutQuad',
      delay: anime.stagger(60),
    });

    // Rotate forward every 3s
    function step() {
      activeIdx = (activeIdx + 1) % N;
      layout(true);
    }

    // Click a card to bring it to center
    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        activeIdx = i;
        layout(true);
      });
    });

    setInterval(step, 3000);

    // Re-layout on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => layout(false), 150);
    });
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
    }
    function closeModal() {
      modal.classList.remove('modal--open');
      document.body.style.overflow = '';
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

    const nav = document.getElementById('nav');
    if (nav) {
      ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        onLeave: () => {
          nav.classList.remove('nav--on-hero');
          nav.classList.add('nav--dark');
        },
        onEnterBack: () => {
          nav.classList.add('nav--on-hero');
          nav.classList.remove('nav--dark');
        },
      });
    }

    /* Hero parallax on scroll */
    if (window.innerWidth >= 1024) {
      ScrollTrigger.create({
        trigger: '.hero', start: 'top top', end: 'bottom top',
        onUpdate(self) {
          const el = document.querySelector('.hero__inner');
          if (el) {
            el.style.opacity = 1 - self.progress * 1.5;
            el.style.transform = `scale(${1 - self.progress * 0.12}) translateY(${self.progress * -60}px)`;
          }
        }
      });
    }

    /*
     * toggleActions: 'play none none reverse'
     *   onEnter → play       (scroll down into section)
     *   onLeave → none       (content stays while you keep scrolling)
     *   onEnterBack → none   (content stays when scrolling back into it)
     *   onLeaveBack → reverse (only resets when section fully leaves viewport going up)
     */
    const toggle = 'play none none reverse';

    /* Intro text reveal */
    gsap.from('.intro__text', {
      scrollTrigger: { trigger: '.intro__right', start: 'top 80%', toggleActions: toggle },
      opacity: 0, y: 40, duration: 0.8, ease: 'power2.out'
    });
    gsap.from('.intro__dot', {
      scrollTrigger: { trigger: '.intro__right', start: 'top 80%', toggleActions: toggle },
      scale: 0, duration: 0.5, ease: 'back.out(1.7)'
    });

    /* Intro left brand crop — clip-path reveal */
    gsap.from('.intro__brand-crop', {
      scrollTrigger: { trigger: '.intro', start: 'top 65%', toggleActions: toggle },
      clipPath: 'inset(0 100% 0 0)', duration: 1, ease: 'power3.inOut'
    });

    /* About section reveals */
    gsap.from('.about__header', {
      scrollTrigger: { trigger: '.about', start: 'top 78%', toggleActions: toggle },
      y: 30, opacity: 0, duration: 0.7, ease: 'power2.out'
    });
    gsap.from('.about__intro', {
      scrollTrigger: { trigger: '.about', start: 'top 70%', toggleActions: toggle },
      y: 30, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.1
    });
    gsap.from('.about__card--jose', {
      scrollTrigger: { trigger: '.about__cards', start: 'top 80%', toggleActions: toggle },
      x: -50, opacity: 0, duration: 0.8, ease: 'power3.out'
    });
    gsap.from('.about__card--jocelyn', {
      scrollTrigger: { trigger: '.about__cards', start: 'top 80%', toggleActions: toggle },
      x: 50, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.12
    });
    gsap.from('.about__closing', {
      scrollTrigger: { trigger: '.about__closing', start: 'top 90%', toggleActions: toggle },
      y: 20, opacity: 0, duration: 0.6, ease: 'power2.out'
    });

    /* Services — clip-path image reveal */
    gsap.from('.services__image-inner', {
      scrollTrigger: { trigger: '.services', start: 'top 75%', toggleActions: toggle },
      clipPath: 'inset(20%)', scale: 1.2, duration: 1, ease: 'power2.out'
    });
    gsap.from('.services__body', {
      scrollTrigger: { trigger: '.services__content', start: 'top 75%', toggleActions: toggle },
      y: 40, opacity: 0, duration: 0.8, ease: 'power2.out'
    });

    /* Interruption — text entrance */
    gsap.from('.interr__line', {
      scrollTrigger: { trigger: '.interr', start: 'top 70%', toggleActions: toggle },
      y: 60, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12
    });

    /* Interruption bars parallax (scrub already works both directions) */
    gsap.to('.interr__bar--cream', {
      scrollTrigger: { trigger: '.interr', start: 'top bottom', end: 'bottom top', scrub: 0.35 },
      y: -40, ease: 'none'
    });
    gsap.to('.interr__bar--accent', {
      scrollTrigger: { trigger: '.interr', start: 'top bottom', end: 'bottom top', scrub: 0.35 },
      y: 30, ease: 'none'
    });

    /* Editorial showcase */
    gsap.from('.editorial__showcase-inner', {
      scrollTrigger: { trigger: '.editorial__showcase', start: 'top 80%', toggleActions: toggle },
      y: 60, opacity: 0, duration: 0.8, ease: 'power2.out'
    });

    /* Editorial cards — staggered clip-path wipe */
    gsap.utils.toArray('.editorial__card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: toggle },
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.7, ease: 'power3.out',
        delay: (i % 2) * 0.1
      });
    });

    /* Footer reveals */
    gsap.from('.footer__logo-svg', {
      scrollTrigger: { trigger: '.footer', start: 'top 80%', toggleActions: toggle },
      x: -60, opacity: 0, duration: 0.8, ease: 'power2.out'
    });
    gsap.from('.footer__cta', {
      scrollTrigger: { trigger: '.footer', start: 'top 75%', toggleActions: toggle },
      x: 80, rotation: -15, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.15
    });
  }

  /* === BOOT === */
  window.history.scrollRestoration = 'manual';
  window.addEventListener('beforeunload', () => window.scrollTo(0, 0));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runLoader);
  else runLoader();
})();
