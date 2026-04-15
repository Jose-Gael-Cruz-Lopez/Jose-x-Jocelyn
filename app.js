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
    initFooterDots();
    initPinata();
    initGSAP();
  }

  /* === PIÑATA MINI-GAME — click to crack through real artwork stages, explodes confetti === */
  function initPinata() {
    const wrap = document.getElementById('pinata');
    const body = document.getElementById('pinataBody');
    const img = document.getElementById('pinataImg');
    const prompt = document.getElementById('pinataPrompt');
    if (!wrap || !body || !img) return;

    /*
     * Damage stages — each maps a hit threshold to a new image.
     * Pinata.png (0 hits) -> step1 (hit 2) -> step2 (hit 4) -> step3 (hit 6) -> break (hit 8)
     */
    const STAGES = [
      { at: 0, src: '/pinanta/step1.png' },
      { at: 3, src: '/pinanta/step2.png' },
      { at: 5, src: '/pinanta/step3.png' },
    ];
    const HITS_TO_BREAK = 7;
    let hits = 0;
    let broken = false;

    // Preload stage images
    STAGES.forEach(s => { const i = new Image(); i.src = s.src; });

    wrap.classList.add('pinata--idle');

    const CONFETTI_COLORS = [
      '#E8A838', '#B34539', '#3A7D6B', '#5B8EC2', '#F2E4CE',
      '#f5c026', '#ff6b6b', '#ff9ff3', '#54a0ff', '#5f27cd',
      '#01a3a4', '#feca57', '#ff6348', '#7bed9f',
    ];

    function updateImage() {
      let best = STAGES[0];
      for (const s of STAGES) {
        if (hits >= s.at) best = s;
      }
      if (img.src !== best.src) img.src = best.src;
    }

    function spawnHitStars(x, y, count) {
      for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'pinata__star';
        const size = 6 + Math.random() * 12;
        const color = CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0];
        star.style.cssText = `
          left:${x}px; top:${y}px;
          width:${size}px; height:${size}px;
          background:${color};
          border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
          transform: rotate(${Math.random() * 360}deg);
        `;
        document.body.appendChild(star);

        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 100;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 30;

        if (typeof gsap !== 'undefined') {
          gsap.to(star, {
            x: dx, y: dy, opacity: 0,
            rotation: Math.random() * 720 - 360,
            duration: 0.6 + Math.random() * 0.4,
            ease: 'power2.out',
            onComplete: () => star.remove(),
          });
        } else {
          setTimeout(() => star.remove(), 800);
        }
      }
    }

    function bigConfetti() {
      const N = 140;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const frag = document.createDocumentFragment();
      const pieces = [];

      for (let i = 0; i < N; i++) {
        const el = document.createElement('div');
        el.setAttribute('aria-hidden', 'true');
        const w = 8 + Math.random() * 16;
        const h = 4 + Math.random() * 10;
        const color = CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0];
        const startX = vw * 0.2 + Math.random() * vw * 0.6;
        const startY = vh * 0.25 + Math.random() * vh * 0.25;
        el.style.cssText = `
          position:fixed;
          left:${startX}px;top:${startY}px;
          width:${w}px;height:${h}px;
          background:${color};
          border-radius:${Math.random() > 0.4 ? '2px' : '50%'};
          pointer-events:none;
          z-index:10060;
          will-change:transform,opacity;
        `;
        frag.appendChild(el);
        pieces.push(el);
      }

      /* Single DOM write — all pieces at once */
      document.body.appendChild(frag);

      /* Let the browser paint the frame, then animate */
      requestAnimationFrame(() => {
        if (typeof gsap !== 'undefined') {
          pieces.forEach(el => {
            const dx = (Math.random() - 0.5) * vw * 1.4;
            const dy = (Math.random() - 0.55) * vh * 1.5;
            gsap.fromTo(el,
              { x: 0, y: 0, rotation: 0, scale: 0 },
              {
                x: dx, y: dy,
                rotation: Math.random() * 900 - 450,
                scale: 1 + Math.random() * 0.4,
                opacity: 0,
                duration: 1.6 + Math.random() * 1.0,
                delay: Math.random() * 0.08,
                ease: 'power2.out',
                onComplete: () => el.remove(),
              }
            );
          });
        } else {
          setTimeout(() => pieces.forEach(el => el.remove()), 2800);
        }
      });
    }

    body.addEventListener('click', (e) => {
      if (broken) return;
      e.stopPropagation();
      hits++;

      wrap.classList.remove('pinata--idle', 'pinata--hit');
      void wrap.offsetWidth;
      wrap.classList.add('pinata--hit');

      updateImage();

      if (hits >= 5) wrap.classList.add('pinata--shaking');

      spawnHitStars(e.clientX, e.clientY, 6 + hits * 3);

      if (hits >= HITS_TO_BREAK) {
        broken = true;
        prompt?.classList.add('pinata__prompt--hidden');
        wrap.classList.remove('pinata--shaking');

        /* Pre-build the message so there's zero creation cost at reveal time */
        const BREAK_MSGS = [
          'Echale ganas, you already took the first step.',
          'Nobody gave us the blueprint either. That\'s why we built this.',
          'Ya llegaste. The sun rises for you too.',
          'First-gen is not a limitation. It\'s the origin story.',
          'No palancas needed. Just you and this community.',
        ];
        const msg = document.createElement('p');
        msg.className = 'pinata__break-msg';
        msg.setAttribute('role', 'status');
        msg.textContent = BREAK_MSGS[(Math.random() * BREAK_MSGS.length) | 0];

        /* Start break + confetti on the very next frame — no 150ms wait */
        requestAnimationFrame(() => {
          wrap.classList.remove('pinata--hit');
          wrap.classList.add('pinata--break');
          bigConfetti();

          /* Hide piñata and reveal message after break animation peaks (~600ms) */
          setTimeout(() => {
            wrap.style.visibility = 'hidden';
            wrap.parentElement.appendChild(msg);

            /* Reset everything after 6.5s so the user can play again */
            setTimeout(() => {
              /* Fade message out */
              msg.style.transition = 'opacity 0.6s ease';
              msg.style.opacity = '0';

              setTimeout(() => {
                /* Remove message */
                msg.remove();

                /* Reset piñata state */
                hits = 0;
                broken = false;
                wrap.style.visibility = 'visible';
                wrap.classList.remove('pinata--break', 'pinata--hit', 'pinata--shaking');
                void wrap.offsetWidth; /* force reflow to restart animation */
                wrap.classList.add('pinata--idle');

                /* Restore prompt */
                if (prompt) {
                  prompt.classList.remove('pinata__prompt--hidden');
                }

                /* Reset image back to pristine */
                updateImage();
              }, 650); /* after fade */
            }, 6500); /* message display time */
          }, 600);
        });
      } else {
        setTimeout(() => {
          wrap.classList.remove('pinata--hit');
          if (hits < 5) wrap.classList.add('pinata--idle');
        }, 500);
      }
    });
  }

  /* === FOOTER — dotted grid repelled by cursor (1080×1350-style reference: dense gray dots) === */
  function initFooterDots() {
    const footer = document.getElementById('contact');
    const canvas = footer?.querySelector('.footer__dots-canvas');
    if (!footer || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dots = [];
    let wCss = 1;
    let hCss = 1;
    let dpr = 1;
    const mouse = { x: 0, y: 0, inside: false };
    let visible = true;

    const SPACING = 11;
    const INFLUENCE = 120;
    const MAX_PUSH = 40;
    const LERP = 0.2;
    const DOT_R = 1.05;

    function buildDots() {
      dots = [];
      for (let y = SPACING * 0.5; y < hCss; y += SPACING) {
        for (let x = SPACING * 0.5; x < wCss; x += SPACING) {
          const g = 0.18 + Math.random() * 0.42;
          dots.push({ bx: x, by: y, ox: 0, oy: 0, g });
        }
      }
    }

    function resize() {
      const rect = footer.getBoundingClientRect();
      wCss = Math.max(1, rect.width);
      hCss = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(wCss * dpr);
      canvas.height = Math.floor(hCss * dpr);
      canvas.style.width = `${wCss}px`;
      canvas.style.height = `${hCss}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
    }

    function draw() {
      if (!visible) return;
      ctx.clearRect(0, 0, wCss, hCss);
      const rect = footer.getBoundingClientRect();
      const mx = mouse.x - rect.left;
      const my = mouse.y - rect.top;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        let tx = 0;
        let ty = 0;
        if (!reduced && mouse.inside) {
          const dx = d.bx - mx;
          const dy = d.by - my;
          const dist = Math.hypot(dx, dy);
          if (dist < INFLUENCE && dist > 0.001) {
            const t = 1 - dist / INFLUENCE;
            const push = t * t * MAX_PUSH;
            tx = (dx / dist) * push;
            ty = (dy / dist) * push;
          }
        }
        d.ox += (tx - d.ox) * LERP;
        d.oy += (ty - d.oy) * LERP;
        if (!mouse.inside) {
          d.ox *= 0.93;
          d.oy *= 0.93;
        }

        ctx.fillStyle = `rgba(26,25,22,${d.g})`;
        ctx.beginPath();
        ctx.arc(d.bx + d.ox, d.by + d.oy, DOT_R, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      requestAnimationFrame(loop);
      draw();
    }

    footer.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.inside = true;
    });
    footer.addEventListener('mouseenter', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.inside = true;
    });
    footer.addEventListener('mouseleave', () => {
      mouse.inside = false;
    });

    footer.addEventListener(
      'touchmove',
      (e) => {
        if (!e.touches.length) return;
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.inside = true;
      },
      { passive: true }
    );
    footer.addEventListener(
      'touchstart',
      (e) => {
        if (!e.touches.length) return;
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.inside = true;
      },
      { passive: true }
    );
    footer.addEventListener('touchend', () => {
      mouse.inside = false;
    });

    const ro = new ResizeObserver(() => resize());
    ro.observe(footer);

    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting !== false;
    }, { threshold: 0 });
    io.observe(footer);

    resize();
    window.addEventListener('resize', resize);
    loop();
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
    function getTrackH() {
      if (track && track.offsetHeight > 0) return track.offsetHeight;
      return window.innerWidth < 768 ? 320 : 480;
    }
    function isMobile() { return window.innerWidth < 768; }

    // All cards match 1080×1350 reference frames (4:5 width:height)
    const CARD_ASPECT = 1350 / 1080;
    const cardH = (w) => w * CARD_ASPECT;

    /*
     * Position slots (0-based from left to right):
     *   slot 0: far left   — large card, no rotation
     *   slot 1: left-mid   — smaller card, behind + rotated
     *   slot 2: center     — largest width, no rotation, z-top (same 4:5 aspect as others)
     *   slot 3: right-mid  — smaller card, behind + rotated
     *   slot 4: far right  — large card, no rotation
     *   slot 5+: hidden (offscreen or invisible for >5 card setups)
     */
    function getSlots() {
      const tw = getTrackW();
      const mob = isMobile();

      // Card widths — heights follow 1080×1350 (4:5) for every slot
      const bigW = mob ? tw * 0.38 : tw * 0.24; // far-left, far-right
      const bigHeight = cardH(bigW);
      const centerW = mob ? tw * 0.42 : tw * 0.28; // center card
      const centerHeight = cardH(centerW);
      const smallW = mob ? tw * 0.22 : tw * 0.16; // overlap cards
      const smallHeight = cardH(smallW);

      const centerX = tw / 2;
      const trackH = getTrackH();
      const centerY = trackH / 2;

      return [
        // slot 0 — far left
        { x: centerX - tw * 0.37, y: centerY,
          w: bigW, h: bigHeight, rotate: 0, z: 3, opacity: 1 },
        // slot 1 — left-mid (smaller, overlaps between 0 and 2, rotated)
        { x: centerX - tw * 0.17, y: centerY,
          w: smallW, h: smallHeight, rotate: 12, z: 2, opacity: 1 },
        // slot 2 — CENTER (no rotation)
        { x: centerX, y: centerY,
          w: centerW, h: centerHeight, rotate: 0, z: 5, opacity: 1 },
        // slot 3 — right-mid (smaller, overlaps between 2 and 4, rotated)
        { x: centerX + tw * 0.17, y: centerY,
          w: smallW, h: smallHeight, rotate: -10, z: 2, opacity: 1 },
        // slot 4 — far right
        { x: centerX + tw * 0.37, y: centerY,
          w: bigW, h: bigHeight, rotate: 0, z: 3, opacity: 1 },
        // slot 5 — hidden (for 6th card)
        { x: centerX + tw * 0.58, y: centerY,
          w: bigW, h: bigHeight, rotate: 0, z: 0, opacity: 0 },
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
    const persistToggle = 'play none none none';

    /* Intro text reveal */
    gsap.from('.intro__text', {
      scrollTrigger: { trigger: '.intro__right', start: 'top 80%', toggleActions: persistToggle },
      opacity: 0, y: 40, duration: 0.8, ease: 'power2.out'
    });
    gsap.from('.intro__dot', {
      scrollTrigger: { trigger: '.intro__right', start: 'top 80%', toggleActions: persistToggle },
      scale: 0, duration: 0.5, ease: 'back.out(1.7)'
    });

    /* Intro left — banner grid clip-path reveal */
    gsap.from('.intro__banners', {
      scrollTrigger: { trigger: '.intro', start: 'top 65%', toggleActions: persistToggle },
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

    /* Campus to Career — explainer section */
    gsap.from('.c2c__title-img', {
      scrollTrigger: { trigger: '.c2c', start: 'top 75%', toggleActions: toggle },
      y: -30, opacity: 0, duration: 0.9, ease: 'power2.out'
    });
    gsap.from('.c2c__lead', {
      scrollTrigger: { trigger: '.c2c', start: 'top 65%', toggleActions: toggle },
      y: 30, opacity: 0, duration: 0.7, ease: 'power2.out'
    });
    gsap.utils.toArray('.c2c__card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: '.c2c__grid', start: 'top 80%', toggleActions: toggle },
        y: 50, opacity: 0, duration: 0.6, ease: 'power3.out',
        delay: i * 0.12
      });
    });
    gsap.from('.c2c__closing', {
      scrollTrigger: { trigger: '.c2c__closing', start: 'top 92%', toggleActions: toggle },
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
      scrollTrigger: { trigger: '.editorial__showcase', start: 'top 80%', toggleActions: persistToggle },
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

    /* Mascot reveals — stay visible after first play (no reverse on scroll-up) */
    gsap.utils.toArray('.mascot').forEach(mascot => {
      gsap.fromTo(mascot,
        { opacity: 0, scale: 0, rotate: -30 },
        {
          opacity: 1, scale: 1, rotate: 0,
          duration: 0.9,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: mascot.closest('section, footer'),
            start: 'top 80%',
            once: true,
            toggleActions: persistToggle,
          },
        }
      );
    });

    /* Footer reveals */
    const footerToggle = 'play none none none';
    gsap.from('.footer__logo-svg', {
      scrollTrigger: { trigger: '.footer', start: 'top 80%', toggleActions: footerToggle },
      x: -60, opacity: 0, duration: 0.8, ease: 'power2.out'
    });
    gsap.from('.footer__cta', {
      scrollTrigger: { trigger: '.footer', start: 'top 75%', toggleActions: footerToggle },
      x: 80, rotation: -15, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.15
    });

    ScrollTrigger.refresh();
    requestAnimationFrame(function () {
      ScrollTrigger.refresh();
    });
  }

  /* === BOOT === */
  window.history.scrollRestoration = 'manual';
  /* Do not scroll-to-top on beforeunload — that jumped the viewport to the hero for a frame when
     leaving for an article (looked like a “flash” of the landing page). */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runLoader);
  else runLoader();
})();
