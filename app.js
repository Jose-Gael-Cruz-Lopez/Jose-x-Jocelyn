/* ============================================
   JOSE x JOCELYN — Main Application JS
   Replicates kobykooba.com interactions:
   - Page loader with animated panels
   - Lenis smooth scroll + GSAP integration
   - GSAP ScrollTrigger section reveals
   - Tabbed components
   - Swiper gallery
   - Multi-step modal
   - Nav scroll behavior
   ============================================ */

(function () {
  'use strict';

  // ============ LOADER ============
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');
  const bars = loader?.querySelectorAll('.loader__bar');

  function runLoader() {
    if (!loader || !loaderFill || !bars || typeof gsap === 'undefined') {
      loader?.classList.add('loader--hidden');
      loader?.remove();
      initSite();
      return;
    }

    // Animate progress
    const tl = gsap.timeline({
      onComplete: () => {
        // Slide bars away
        gsap.to(bars[0], { yPercent: -100, duration: 0.7, ease: 'power3.inOut' });
        gsap.to(bars[1], { yPercent: 100, duration: 0.7, ease: 'power3.inOut', delay: 0.05 });
        gsap.to(bars[2], { yPercent: -100, duration: 0.7, ease: 'power3.inOut', delay: 0.1, onComplete: () => {
          loader.classList.add('loader--hidden');
          setTimeout(() => loader.remove(), 300);
          initSite();
        }});
      }
    });

    tl.to(loaderFill, { width: '40%', duration: 0.5, ease: 'power2.out' })
      .to(loaderFill, { width: '75%', duration: 0.4, ease: 'power2.out' })
      .to(loaderFill, { width: '100%', duration: 0.3, ease: 'power2.out' });
  }

  // ============ MAIN INIT ============
  function initSite() {
    initLenis();
    initNav();
    initHamburger();
    initTabs();
    initServicesTabs();
    initSwiper();
    initScrollAnimations();
    initModal();
    initFormHandler();
    initInterruptionBars();
  }

  // ============ LENIS SMOOTH SCROLL ============
  let lenisInstance = null;

  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    // Integrate with GSAP ticker
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Handle anchor clicks with smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          lenisInstance.scrollTo(target, { offset: -80 });
        }
      });
    });
  }

  // ============ NAV ============
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let lastScroll = 0;
    const threshold = 100;

    function onScroll() {
      const currentScroll = window.scrollY;

      if (currentScroll > threshold) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }

      if (currentScroll > lastScroll && currentScroll > 300) {
        nav.classList.add('nav--hidden');
      } else {
        nav.classList.remove('nav--hidden');
      }

      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ============ HAMBURGER MENU ============
  function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('nav__hamburger--open');
      mobileMenu.classList.toggle('mobile-menu--open');
      document.body.style.overflow = mobileMenu.classList.contains('mobile-menu--open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('nav__hamburger--open');
        mobileMenu.classList.remove('mobile-menu--open');
        document.body.style.overflow = '';
      });
    });
  }

  // ============ ABOUT TABS ============
  function initTabs() {
    const tabs = document.querySelectorAll('.about__tab');
    const panels = document.querySelectorAll('.about__panel');
    const indicator = document.querySelector('.about__tab-indicator');
    if (!tabs.length || !panels.length) return;

    function updateIndicator(tab) {
      if (!indicator) return;
      indicator.style.left = tab.offsetLeft + 'px';
      indicator.style.width = tab.offsetWidth + 'px';
    }

    // Init indicator position
    const activeTab = document.querySelector('.about__tab--active');
    if (activeTab) updateIndicator(activeTab);

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('about__tab--active'));
        panels.forEach(p => p.classList.remove('about__panel--active'));

        tab.classList.add('about__tab--active');
        document.querySelector(`[data-panel="${target}"]`)?.classList.add('about__panel--active');

        updateIndicator(tab);
      });
    });

    // Handle resize
    window.addEventListener('resize', () => {
      const active = document.querySelector('.about__tab--active');
      if (active) updateIndicator(active);
    });
  }

  // ============ SERVICES TABS ============
  function initServicesTabs() {
    const tabs = document.querySelectorAll('.services__tab');
    const panels = document.querySelectorAll('.services__panel');
    const indicator = document.querySelector('.services__tab-indicator');
    if (!tabs.length || !panels.length) return;

    function updateIndicator(tab) {
      if (!indicator) return;
      indicator.style.left = tab.offsetLeft + 'px';
      indicator.style.width = tab.offsetWidth + 'px';
    }

    const activeTab = document.querySelector('.services__tab--active');
    if (activeTab) updateIndicator(activeTab);

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.stab;

        tabs.forEach(t => t.classList.remove('services__tab--active'));
        panels.forEach(p => p.classList.remove('services__panel--active'));

        tab.classList.add('services__tab--active');
        document.querySelector(`[data-spanel="${target}"]`)?.classList.add('services__panel--active');

        updateIndicator(tab);
      });
    });

    window.addEventListener('resize', () => {
      const active = document.querySelector('.services__tab--active');
      if (active) updateIndicator(active);
    });
  }

  // ============ SWIPER ============
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;

    new Swiper('.programs__swiper', {
      slidesPerView: 'auto',
      spaceBetween: 24,
      centeredSlides: false,
      grabCursor: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          spaceBetween: 32,
        },
        1024: {
          spaceBetween: 40,
        }
      }
    });
  }

  // ============ SCROLL ANIMATIONS (GSAP ScrollTrigger) ============
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero elements
    gsap.from('.hero__title-line', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.15,
      delay: 0.2
    });

    gsap.from('.hero__title-x', {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: 0.5
    });

    gsap.from('.hero__tagline', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.7
    });

    gsap.from('.hero__accent', {
      scaleX: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.4
    });

    gsap.from('.hero__scroll-cue', {
      opacity: 0,
      duration: 1,
      delay: 1.2
    });

    // Intro section
    gsap.from('.intro__label', {
      scrollTrigger: { trigger: '.intro', start: 'top 80%' },
      x: -30, opacity: 0, duration: 0.6, ease: 'power2.out'
    });

    gsap.from('.intro__heading', {
      scrollTrigger: { trigger: '.intro', start: 'top 80%' },
      y: 40, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.15
    });

    gsap.from('.intro__text', {
      scrollTrigger: { trigger: '.intro__right', start: 'top 80%' },
      y: 30, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.15
    });

    // About section
    gsap.from('.about__tabs', {
      scrollTrigger: { trigger: '.about', start: 'top 80%' },
      y: 30, opacity: 0, duration: 0.7, ease: 'power2.out'
    });

    // Programs header
    gsap.from('.programs__header', {
      scrollTrigger: { trigger: '.programs', start: 'top 80%' },
      y: 40, opacity: 0, duration: 0.8, ease: 'power2.out'
    });

    // Interruption heading
    gsap.from('.interruption__line', {
      scrollTrigger: { trigger: '.interruption', start: 'top 70%' },
      y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.2
    });

    // Services
    gsap.from('.services__image-wrap', {
      scrollTrigger: { trigger: '.services', start: 'top 80%' },
      clipPath: 'inset(20%)',
      scale: 1.15,
      duration: 1,
      ease: 'power2.out'
    });

    // Editorial
    gsap.from('.editorial__header', {
      scrollTrigger: { trigger: '.editorial', start: 'top 80%' },
      y: 40, opacity: 0, duration: 0.8, ease: 'power2.out'
    });

    gsap.from('.editorial__card', {
      scrollTrigger: { trigger: '.editorial__grid', start: 'top 80%' },
      y: 40, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.1
    });

    // Contact
    gsap.from('.contact__logo', {
      scrollTrigger: { trigger: '.contact', start: 'top 80%' },
      x: -40, opacity: 0, duration: 0.8, ease: 'power2.out'
    });

    gsap.from('.contact__cta', {
      scrollTrigger: { trigger: '.contact', start: 'top 80%' },
      x: 40, opacity: 0, rotation: -15, duration: 0.8, ease: 'power2.out', delay: 0.2
    });

    gsap.from('.contact__form-container', {
      scrollTrigger: { trigger: '.contact__form-section', start: 'top 85%' },
      y: 40, opacity: 0, duration: 0.8, ease: 'power2.out'
    });

    // Section pin on desktop (kobykooba-style cinematic scroll)
    if (window.matchMedia('(min-width: 1024px)').matches) {
      // Pin hero slightly
      ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        pin: false,
        onUpdate: (self) => {
          const hero = document.querySelector('.hero__content');
          if (hero) {
            hero.style.opacity = 1 - self.progress * 1.5;
            hero.style.transform = `translateY(${self.progress * -60}px) scale(${1 - self.progress * 0.1})`;
          }
        }
      });
    }
  }

  // ============ INTERRUPTION BARS ANIMATION ============
  function initInterruptionBars() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const bars = document.querySelectorAll('.interruption__bar');
    if (!bars.length) return;

    bars.forEach((bar, i) => {
      gsap.to(bar, {
        scrollTrigger: {
          trigger: '.interruption',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        y: (i % 2 === 0 ? -1 : 1) * (20 + i * 15),
        ease: 'none'
      });
    });
  }

  // ============ MODAL ============
  function initModal() {
    const modal = document.getElementById('contactModal');
    if (!modal) return;

    const overlay = modal.querySelector('.modal__overlay');
    const closeBtn = modal.querySelector('.modal__close');
    const steps = modal.querySelectorAll('.modal__step');
    const dots = modal.querySelectorAll('.modal__progress-dot');
    const nextBtns = modal.querySelectorAll('.modal__next');
    const doneBtn = modal.querySelector('.modal__done');
    let currentStep = 1;

    // Open triggers
    document.querySelectorAll('.contact__cta, .nav__link--cta, .mobile-menu__link--cta').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    function openModal() {
      modal.classList.add('modal--open');
      document.body.style.overflow = 'hidden';
      if (lenisInstance) lenisInstance.stop();
    }

    function closeModal() {
      modal.classList.remove('modal--open');
      document.body.style.overflow = '';
      if (lenisInstance) lenisInstance.start();
      // Reset to step 1
      setTimeout(() => {
        currentStep = 1;
        goToStep(1);
      }, 400);
    }

    function goToStep(step) {
      steps.forEach(s => s.classList.remove('modal__step--active'));
      dots.forEach(d => d.classList.remove('modal__progress-dot--active'));

      const targetStep = modal.querySelector(`[data-step="${step}"]`);
      const targetDot = modal.querySelector(`[data-dot="${step}"]`);
      if (targetStep) targetStep.classList.add('modal__step--active');

      // Activate all dots up to current
      dots.forEach(d => {
        if (parseInt(d.dataset.dot) <= step) {
          d.classList.add('modal__progress-dot--active');
        }
      });
    }

    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentStep++;
        goToStep(currentStep);
      });
    });

    if (doneBtn) doneBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
        closeModal();
      }
    });
  }

  // ============ FORM HANDLER ============
  function initFormHandler() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Open modal as confirmation
      const modal = document.getElementById('contactModal');
      if (modal) {
        modal.classList.add('modal--open');
        document.body.style.overflow = 'hidden';
        if (lenisInstance) lenisInstance.stop();
        // Jump to step 3 (success)
        modal.querySelectorAll('.modal__step').forEach(s => s.classList.remove('modal__step--active'));
        modal.querySelectorAll('.modal__progress-dot').forEach(d => d.classList.add('modal__progress-dot--active'));
        const step3 = modal.querySelector('[data-step="3"]');
        if (step3) step3.classList.add('modal__step--active');
      }
    });
  }

  // ============ BOOT ============
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runLoader);
  } else {
    runLoader();
  }

  // Scroll to top on load (kobykooba pattern)
  window.history.scrollRestoration = 'manual';
  window.addEventListener('beforeunload', () => window.scrollTo(0, 0));

})();
