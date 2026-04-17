/**
 * Prefetch linked pages: hover/tap targets + idle batch for article URLs.
 * Makes same-origin navigations feel instant (pairs with view transitions in CSS).
 * Resolves relative hrefs (e.g. ./other.html from /articles/) so article→article is covered.
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

  function isArticlePath(pathname) {
    return /\/articles\/[^/]+\.html$/.test(pathname);
  }

  function isHomePath(pathname) {
    return (
      pathname === '/' ||
      pathname === '/index.html' ||
      /\/images\/index\.html$/.test(pathname)
    );
  }

  function maybePrefetchFromAnchor(a) {
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    var resolved;
    try {
      resolved = new URL(href, window.location.href);
    } catch (_) {
      return;
    }

    if (resolved.origin !== window.location.origin) return;

    var pathname = resolved.pathname;
    if (!isArticlePath(pathname) && !isHomePath(pathname)) return;

    prefetchUrl(resolved.origin + resolved.pathname + resolved.search);
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

  /* Warm cache for every same-origin article/home link in the document (idle / after first paint). */
  function prefetchAllNavAnchors() {
    document.querySelectorAll('a[href]').forEach(function (a) {
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
      scheduleIdle(prefetchAllNavAnchors);
    });
  } else {
    scheduleIdle(prefetchAllNavAnchors);
  }
})();
