/**
 * Prefetch linked pages: hover/tap targets + idle batch for article URLs.
 * Makes same-origin navigations feel instant (pairs with view transitions in CSS).
 */
(function () {
  'use strict';

  var prefetched = new Set();

  function prefetchUrl(url) {
    if (!url || prefetched.has(url)) return;
    prefetched.add(url);
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }

  function maybePrefetchFromAnchor(a) {
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;

    var isArticle = href.indexOf('articles/') !== -1 || href.indexOf('/articles/') !== -1;
    var isHome =
      /index\.html$/.test(href) ||
      href === '../' ||
      href === './' ||
      href === '/' ||
      href === '../index.html';

    if (!isArticle && !isHome) return;

    try {
      var resolved = new URL(href, window.location.href);
      prefetchUrl(resolved.origin + resolved.pathname + resolved.search);
    } catch (_) {}
  }

  document.addEventListener(
    'pointerenter',
    function (e) {
      var a = e.target && e.target.closest && e.target.closest('a[href]');
      maybePrefetchFromAnchor(a);
    },
    true
  );

  /* Touch / fast click: prefetch before click (pointerenter often does not run on tap). */
  document.addEventListener(
    'pointerdown',
    function (e) {
      var a = e.target && e.target.closest && e.target.closest('a[href]');
      maybePrefetchFromAnchor(a);
    },
    true
  );

  /* Warm cache for every article link in the document (idle / after first paint). */
  function prefetchAllArticleAnchors() {
    document.querySelectorAll('a[href*="articles/"]').forEach(function (a) {
      maybePrefetchFromAnchor(a);
    });
  }

  function scheduleIdle(fn) {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(fn, { timeout: 2500 });
    } else {
      window.setTimeout(fn, 400);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      scheduleIdle(prefetchAllArticleAnchors);
    });
  } else {
    scheduleIdle(prefetchAllArticleAnchors);
  }
})();
