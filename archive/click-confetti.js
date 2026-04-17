/**
 * Click confetti burst (site palette) — shared by index + article pages.
 * Requires GSAP (gsap global). Skips when prefers-reduced-motion: reduce.
 */
(function () {
  'use strict';

  function initClickConfetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof gsap === 'undefined') return;

    var COLORS = [
      '#E8A838', '#B34539', '#3A7D6B', '#5B8EC2', '#162B44', '#F2E4CE', '#1A1916',
      '#f5c026',
    ];

    document.addEventListener(
      'click',
      function (e) {
        if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]')) return;

        /* Do not run heavy confetti when leaving the page — it caused janky / laggy article navigations. */
        var anchor = e.target.closest && e.target.closest('a[href]');
        if (anchor) {
          var href = anchor.getAttribute('href');
          if (href && !href.startsWith('#')) {
            try {
              var resolved = new URL(href, window.location.href);
              var here = new URL(window.location.href);
              if (
                resolved.origin + resolved.pathname + resolved.search !==
                here.origin + here.pathname + here.search
              ) {
                return;
              }
            } catch (err) {}
          }
        }

        var x = e.clientX;
        var y = e.clientY;
        var n = 48;

        for (var i = 0; i < n; i++) {
          var w = 10 + Math.random() * 18;
          var h = 4 + Math.random() * 10;
          var color = COLORS[(Math.random() * COLORS.length) | 0];
          var el = document.createElement('div');
          el.setAttribute('aria-hidden', 'true');
          var edge =
            color === '#F2E4CE' || color === '#f5c026'
              ? '0 0 0 1px rgba(26,25,22,0.18)'
              : '0 2px 6px rgba(0,0,0,0.28)';
          el.style.cssText = [
            'position:fixed',
            'left:' + x + 'px',
            'top:' + y + 'px',
            'width:' + w + 'px',
            'height:' + h + 'px',
            'background:' + color,
            'border-radius:2px',
            'box-shadow:' + edge,
            'pointer-events:none',
            'z-index:10050',
          ].join(';');

          document.body.appendChild(el);

          var angle = Math.random() * Math.PI * 2;
          var dist = 75 + Math.random() * 185;
          var dur = 0.95 + Math.random() * 0.75;

          gsap.set(el, { xPercent: -50, yPercent: -50 });
          var rotEnd = (Math.random() - 0.5) * 620;
          var s0 = 0.55 + Math.random() * 0.55;
          var s1 = 0.35 + Math.random() * 0.45;
          var tl = gsap.timeline({ onComplete: function () { el.remove(); } });
          tl.fromTo(
            el,
            {
              opacity: 1,
              scale: s0,
              rotation: Math.random() * 360,
              x: 0,
              y: 0,
            },
            {
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              rotation: '+=' + rotEnd,
              scale: s1,
              duration: dur,
              ease: 'power3.out',
            }
          );
          tl.fromTo(
            el,
            { opacity: 1 },
            { opacity: 0, duration: dur * 0.42, ease: 'power2.in' },
            dur * 0.58
          );
        }
      },
      false
    );
  }

  initClickConfetti();
})();
