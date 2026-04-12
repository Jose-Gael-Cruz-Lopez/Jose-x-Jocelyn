/**
 * Substack-style threaded comments for static article pages.
 * Persists per-article in localStorage (browser-only; no server).
 */
(function () {
  'use strict';

  const STORAGE_PREFIX = 'jxj-comments-v1-';

  /** Starter threads so the section is never empty on first visit */
  const SEED_BY_ARTICLE = {
    'late-cycle-internships': [
      { id: 's1', parentId: null, author: 'Marisol R.', text: 'This is exactly what I needed in April last year. Thank you for writing it.', createdAt: new Date('2026-03-15T14:00:00').toISOString() },
      { id: 's2', parentId: 's1', author: 'Jose', text: 'Glad it helped. Keep applying — one yes is all it takes.', createdAt: new Date('2026-03-15T18:30:00').toISOString() },
    ],
    'first-90-days': [
      { id: 's1', parentId: null, author: 'Alex T.', text: 'The benefits section alone saved me hours of confusion. 🙏', createdAt: new Date('2026-03-20T10:00:00').toISOString() },
      { id: 's2', parentId: 's1', author: 'Jocelyn', text: 'You got this. Ask HR anything that still feels unclear.', createdAt: new Date('2026-03-20T11:15:00').toISOString() },
    ],
    'first-gen-internship-playbook': [
      { id: 's1', parentId: null, author: 'Jordan K.', text: 'Shared this with my whole student org.', createdAt: new Date('2026-03-10T09:00:00').toISOString() },
    ],
    'coffee-chat-framework': [
      { id: 's1', parentId: null, author: 'Priya S.', text: 'Used the template and got two responses the same week.', createdAt: new Date('2026-03-18T16:00:00').toISOString() },
      { id: 's2', parentId: 's1', author: 'Jose', text: 'That is what we like to hear. Keep the convos going.', createdAt: new Date('2026-03-18T17:00:00').toISOString() },
    ],
    'negotiate-salary': [
      { id: 's1', parentId: null, author: 'Chris M.', text: 'Wish I had read this before my first offer. Negotiated the second time and it worked.', createdAt: new Date('2026-02-28T12:00:00').toISOString() },
    ],
    'rejection': [
      { id: 's1', parentId: null, author: 'Sam L.', text: 'Needed this honesty. The debrief section is gold.', createdAt: new Date('2026-02-22T20:00:00').toISOString() },
      { id: 's2', parentId: 's1', author: 'Jocelyn', text: 'We are rooting for you.', createdAt: new Date('2026-02-23T08:00:00').toISOString() },
    ],
  };

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function uid() {
    return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    } catch {
      return '';
    }
  }

  function loadComments(articleId) {
    const key = STORAGE_PREFIX + articleId;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    const seed = SEED_BY_ARTICLE[articleId] || [];
    return seed.map(function (c) { return Object.assign({}, c); });
  }

  function saveComments(articleId, list) {
    localStorage.setItem(STORAGE_PREFIX + articleId, JSON.stringify(list));
  }

  function buildTree(flat) {
    const byId = {};
    flat.forEach(function (c) { byId[c.id] = Object.assign({ children: [] }, c); });
    const roots = [];
    flat.forEach(function (c) {
      const node = byId[c.id];
      if (c.parentId && byId[c.parentId]) {
        byId[c.parentId].children.push(node);
      } else {
        roots.push(node);
      }
    });
    function sortCh(n) {
      n.children.sort(function (a, b) { return new Date(a.createdAt) - new Date(b.createdAt); });
      n.children.forEach(sortCh);
    }
    roots.sort(function (a, b) { return new Date(a.createdAt) - new Date(b.createdAt); });
    roots.forEach(sortCh);
    return roots;
  }

  function renderComment(node, articleId, depth) {
    const maxDepth = 8;
    const d = Math.min(depth, maxDepth);
    const wrap = document.createElement('div');
    wrap.className = 'art-comments__item';
    wrap.dataset.commentId = node.id;
    wrap.dataset.depth = String(d);
    wrap.style.setProperty('--depth', String(d));

    const inner = document.createElement('div');
    inner.className = 'art-comments__bubble';
    inner.innerHTML =
      '<div class="art-comments__meta">' +
      '<span class="art-comments__author">' + escapeHtml(node.author || 'Anonymous') + '</span>' +
      '<span class="art-comments__date">' + escapeHtml(formatDate(node.createdAt)) + '</span>' +
      '</div>' +
      '<p class="art-comments__text">' + escapeHtml(node.text) + '</p>' +
      '<button type="button" class="art-comments__reply-btn" data-parent="' + escapeHtml(node.id) + '">Reply</button>';

    wrap.appendChild(inner);

    const replySlot = document.createElement('div');
    replySlot.className = 'art-comments__reply-slot';
    replySlot.dataset.replyFor = node.id;
    wrap.appendChild(replySlot);

    node.children.forEach(function (ch) {
      wrap.appendChild(renderComment(ch, articleId, d + 1));
    });

    return wrap;
  }

  function makeComposer(articleId, parentId, onPosted, placeholder) {
    const box = document.createElement('div');
    box.className = 'art-comments__composer' + (parentId ? ' art-comments__composer--reply' : '');
    box.innerHTML =
      '<label class="art-comments__label"><span class="art-comments__label-text">Name</span>' +
      '<input type="text" class="art-comments__input art-comments__input--name" placeholder="Your name" maxlength="80" /></label>' +
      '<label class="art-comments__label"><span class="art-comments__label-text">' + (parentId ? 'Reply' : 'Comment') + '</span>' +
      '<textarea class="art-comments__textarea" rows="' + (parentId ? '3' : '4') + '" placeholder="' + (placeholder || 'Write something...') + '" maxlength="4000"></textarea></label>' +
      '<div class="art-comments__composer-actions">' +
      (parentId ? '<button type="button" class="art-comments__btn art-comments__btn--ghost art-comments__cancel-reply">Cancel</button>' : '') +
      '<button type="button" class="art-comments__btn art-comments__btn--primary art-comments__submit">' + (parentId ? 'Post reply' : 'Post comment') + '</button>' +
      '</div>';

    const nameIn = box.querySelector('.art-comments__input--name');
    const ta = box.querySelector('.art-comments__textarea');
    const submit = box.querySelector('.art-comments__submit');
    const cancel = box.querySelector('.art-comments__cancel-reply');

    function post() {
      const author = (nameIn.value || '').trim() || 'Anonymous';
      const text = (ta.value || '').trim();
      if (text.length < 1) {
        ta.focus();
        return;
      }
      const list = loadComments(articleId);
      list.push({
        id: uid(),
        parentId: parentId || null,
        author: author,
        text: text,
        createdAt: new Date().toISOString(),
      });
      saveComments(articleId, list);
      onPosted();
    }

    submit.addEventListener('click', post);
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) post();
    });
    if (cancel) {
      cancel.addEventListener('click', function () {
        box.remove();
      });
    }

    return box;
  }

  function mount(root) {
    const articleId = root.dataset.articleId;
    if (!articleId) return;

    function fullRender() {
      root.innerHTML = '';
      const title = document.createElement('h3');
      title.className = 'art-comments__title';
      title.textContent = 'Discussion';

      const count = loadComments(articleId).length;
      const sub = document.createElement('p');
      sub.className = 'art-comments__subtitle';
      sub.textContent = count === 1 ? '1 comment' : count + ' comments';

      const topComposerWrap = document.createElement('div');
      topComposerWrap.className = 'art-comments__top-composer';

      function refresh() {
        fullRender();
      }

      topComposerWrap.appendChild(
        makeComposer(articleId, null, refresh, 'Share your thoughts…')
      );

      const listEl = document.createElement('div');
      listEl.className = 'art-comments__list';

      const tree = buildTree(loadComments(articleId));
      tree.forEach(function (node) {
        listEl.appendChild(renderComment(node, articleId, 0));
      });

      root.appendChild(title);
      root.appendChild(sub);
      root.appendChild(topComposerWrap);
      root.appendChild(listEl);

      /* Delegate reply clicks */
      listEl.addEventListener('click', function (e) {
        const btn = e.target.closest('.art-comments__reply-btn');
        if (!btn || !listEl.contains(btn)) return;
        const parentId = btn.dataset.parent;
        const item = btn.closest('.art-comments__item');
        if (!item) return;
        const slot = item.querySelector('.art-comments__reply-slot[data-reply-for="' + parentId + '"]');
        if (!slot) return;
        if (slot.querySelector('.art-comments__composer')) return;
        const comp = makeComposer(articleId, parentId, function () {
          refresh();
        }, 'Write a reply…');
        slot.appendChild(comp);
        comp.querySelector('.art-comments__textarea').focus();
      });
    }

    fullRender();
  }

  document.querySelectorAll('[data-article-id].art-comments').forEach(mount);
})();
