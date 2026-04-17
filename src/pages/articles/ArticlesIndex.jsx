import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ArticleLayout from '../../components/ArticleLayout'

const ARTICLES = [
  {
    id: 'late-cycle-internships',
    to: '/articles/late-cycle-internships',
    author: 'jose',
    month: 'April 2026',
    title: "Late-Cycle Internships: Where to Look When Everyone Says It's Over",
    excerpt: "It is April and you still don't have an internship. Here is what to do right now.",
    date: 'April 2026',
    read: '8 min read',
  },
  {
    id: 'first-90-days',
    to: '/articles/first-90-days',
    author: 'jocelyn',
    month: 'April 2026',
    title: 'Your First 90 Days: A Survival Guide for First-Gen Professionals',
    excerpt: 'No one teaches you how to read benefits, navigate office politics, or build a career ladder. Until now.',
    date: 'April 2026',
    read: '10 min read',
  },
  {
    id: 'first-gen-internship-playbook',
    to: '/articles/first-gen-internship-playbook',
    author: 'both',
    month: 'March 2026',
    title: 'The Complete First-Gen Internship Playbook',
    excerpt: 'From discovery to signed offer, with no sugar-coating. Everything we learned.',
    date: 'March 2026',
    read: '14 min read',
  },
  {
    id: 'coffee-chat-framework',
    to: '/articles/coffee-chat-framework',
    author: 'jose',
    month: 'March 2026',
    title: 'The Coffee Chat Framework That Actually Gets Responses',
    excerpt: 'A step-by-step system for reaching out to professionals and turning conversations into opportunities.',
    date: 'March 2026',
    read: '7 min read',
  },
  {
    id: 'negotiate-salary',
    to: '/articles/negotiate-salary',
    author: 'jocelyn',
    month: 'February 2026',
    title: "How to Negotiate When You've Never Seen a Six-Figure Salary",
    excerpt: "Compensation is benefits, equity, signing bonuses, and leverage you didn't know you had.",
    date: 'February 2026',
    read: '9 min read',
  },
  {
    id: 'rejection',
    to: '/articles/rejection',
    author: 'both',
    month: 'February 2026',
    title: "Rejection Doesn't Mean You Did It Wrong",
    excerpt: 'You can do everything right and still get rejected. How to process it and keep moving.',
    date: 'February 2026',
    read: '6 min read',
  },
]

const MONTHS = ['April 2026', 'March 2026', 'February 2026']
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'jose', label: 'Jose' },
  { key: 'jocelyn', label: 'Jocelyn' },
  { key: 'both', label: 'Both' },
]
const AUTHOR_LABEL = { jose: 'Jose', jocelyn: 'Jocelyn', both: 'Both' }

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

export default function ArticlesIndex() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')

  const visible = useMemo(() => {
    const q = search.toLowerCase().trim()
    return ARTICLES.filter(a => {
      const matchesFilter = activeFilter === 'all' || a.author === activeFilter
      const matchesSearch = !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.includes(q)
      return matchesFilter && matchesSearch
    })
  }, [activeFilter, search])

  const countText = visible.length === 1 ? '1 article' : `${visible.length} articles`

  return (
    <ArticleLayout title="La Voz del Día - All Articles | Jose x Jocelyn">
      <style>{`
        html, body { background: var(--color-cream); }
        .arc-hero {
          max-width: 900px; margin: 0 auto;
          padding: 120px clamp(20px, 5vw, 48px) 48px;
        }
        .arc-hero__label {
          display: inline-block; font-family: var(--font-body); font-size: 11px;
          font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--color-muted); margin-bottom: 16px;
        }
        .arc-hero__title {
          font-family: var(--font-display); font-size: clamp(40px, 7vw, 72px);
          font-weight: 700; line-height: 1.05; color: var(--color-dark); margin-bottom: 16px;
        }
        .arc-hero__title span { color: var(--color-accent); }
        .arc-hero__sub {
          font-size: clamp(16px, 2vw, 18px); color: var(--color-muted);
          max-width: 560px; line-height: 1.6;
        }
        .arc-controls {
          max-width: 900px; margin: 0 auto;
          padding: 0 clamp(20px, 5vw, 48px) 40px;
          display: flex; flex-wrap: wrap; gap: 16px; align-items: center;
        }
        .arc-search { position: relative; flex: 1; min-width: 220px; }
        .arc-search__icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          width: 18px; height: 18px; stroke: var(--color-muted); fill: none;
          stroke-width: 2; pointer-events: none;
        }
        .arc-search__input {
          width: 100%; padding: 12px 16px 12px 42px; background: var(--color-white);
          border: 1.5px solid rgba(0,0,0,0.1); border-radius: 10px;
          font-family: var(--font-body); font-size: 15px; color: var(--color-dark);
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .arc-search__input::placeholder { color: var(--color-muted); }
        .arc-search__input:focus {
          border-color: var(--color-gold); box-shadow: 0 0 0 3px rgba(232,168,56,0.12);
        }
        .arc-filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .arc-filter-btn {
          padding: 10px 18px; border-radius: 8px; font-family: var(--font-body);
          font-size: 13px; font-weight: 600; cursor: pointer;
          border: 1.5px solid rgba(0,0,0,0.12); background: var(--color-white);
          color: var(--color-muted); transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .arc-filter-btn:hover { color: var(--color-dark); border-color: rgba(0,0,0,0.22); }
        .arc-filter-btn--active {
          background: var(--color-navy); color: var(--color-cream); border-color: var(--color-navy);
        }
        .arc-count {
          max-width: 900px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 48px) 24px;
          font-size: 13px; color: var(--color-muted); font-family: var(--font-body);
        }
        .arc-list { max-width: 900px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 48px) 80px; }
        .arc-month-group { margin-bottom: 48px; }
        .arc-month-label {
          font-family: var(--font-display); font-size: 11px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-muted);
          padding-bottom: 16px; border-bottom: 1.5px solid rgba(0,0,0,0.08); margin-bottom: 4px;
        }
        .arc-card {
          display: flex; align-items: flex-start; gap: 24px; padding: 28px 0;
          border-bottom: 1px solid rgba(0,0,0,0.07); text-decoration: none; color: inherit;
          transition: transform 0.22s cubic-bezier(0.16,1,0.3,1);
        }
        .arc-card:last-child { border-bottom: none; }
        .arc-card:hover { transform: translateX(4px); }
        .arc-card__accent {
          width: 4px; min-width: 4px; height: 52px; border-radius: 2px;
          margin-top: 4px; flex-shrink: 0;
        }
        .arc-card__accent--jose    { background: var(--color-teal); }
        .arc-card__accent--jocelyn { background: var(--color-accent); }
        .arc-card__accent--both    { background: var(--color-navy); }
        .arc-card__body { flex: 1; min-width: 0; }
        .arc-card__meta {
          display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap;
        }
        .arc-card__tag {
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 3px 10px; border-radius: 4px; color: var(--color-white);
        }
        .arc-card__tag--jose    { background: var(--color-teal); }
        .arc-card__tag--jocelyn { background: var(--color-accent); }
        .arc-card__tag--both    { background: var(--color-navy); }
        .arc-card__date { font-size: 13px; color: var(--color-muted); }
        .arc-card__read { font-size: 13px; color: var(--color-muted); }
        .arc-card__read::before { content: "·"; margin-right: 10px; }
        .arc-card__title {
          font-family: var(--font-display); font-size: clamp(17px, 2.2vw, 22px);
          font-weight: 600; line-height: 1.3; color: var(--color-dark);
          margin-bottom: 8px; transition: color 0.2s;
        }
        .arc-card:hover .arc-card__title { color: var(--color-accent); }
        .arc-card__excerpt { font-size: 14px; line-height: 1.6; color: var(--color-muted); max-width: 600px; }
        .arc-card__arrow {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; margin-top: 8px; flex-shrink: 0;
          color: var(--color-muted); transition: color 0.2s, transform 0.22s cubic-bezier(0.16,1,0.3,1);
        }
        .arc-card:hover .arc-card__arrow { color: var(--color-accent); transform: translateX(4px); }
        .arc-empty { text-align: center; padding: 64px 0; color: var(--color-muted); font-size: 16px; }
        .arc-empty__icon { font-size: 36px; margin-bottom: 12px; }
        @media (max-width: 600px) {
          .arc-card { gap: 14px; }
          .arc-card__arrow { display: none; }
          .arc-controls { flex-direction: column; align-items: stretch; }
          .arc-search { min-width: 0; }
        }
      `}</style>

      <header className="arc-hero">
        <span className="arc-hero__label">Knowledge Hub</span>
        <h1 className="arc-hero__title">La Voz <span>del Día</span></h1>
        <p className="arc-hero__sub">Practical advice on recruiting, internships, full-time offers, and first-gen career survival — written from both sides of the bridge.</p>
      </header>

      <div className="arc-controls">
        <div className="arc-search">
          <svg className="arc-search__icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search"
            className="arc-search__input"
            placeholder="Search articles…"
            aria-label="Search articles"
            autoComplete="off"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="arc-filters" role="group" aria-label="Filter by author">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`arc-filter-btn${activeFilter === f.key ? ' arc-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="arc-count" aria-live="polite">{countText}</p>

      <main className="arc-list" aria-label="Article list">
        {visible.length === 0 ? (
          <div className="arc-empty" aria-live="polite">
            <div className="arc-empty__icon">—</div>
            <p>No articles match your search.</p>
          </div>
        ) : (
          MONTHS.map(month => {
            const monthArticles = visible.filter(a => a.month === month)
            if (monthArticles.length === 0) return null
            return (
              <div key={month} className="arc-month-group">
                <p className="arc-month-label">{month}</p>
                {monthArticles.map(a => (
                  <Link key={a.id} to={a.to} className="arc-card">
                    <span className={`arc-card__accent arc-card__accent--${a.author}`} aria-hidden="true" />
                    <div className="arc-card__body">
                      <div className="arc-card__meta">
                        <span className={`arc-card__tag arc-card__tag--${a.author}`}>{AUTHOR_LABEL[a.author]}</span>
                        <span className="arc-card__date">{a.date}</span>
                        <span className="arc-card__read">{a.read}</span>
                      </div>
                      <h2 className="arc-card__title">{a.title}</h2>
                      <p className="arc-card__excerpt">{a.excerpt}</p>
                    </div>
                    <span className="arc-card__arrow" aria-hidden="true">
                      <ArrowIcon />
                    </span>
                  </Link>
                ))}
              </div>
            )
          })
        )}
      </main>

      <footer className="art-footer--wide" style={{ maxWidth: 900 }}>
        <span className="art-footer__copy">Jose x Jocelyn © 2026</span>
        <div className="art-footer__links">
          <Link to="/" className="art-footer__link">Home</Link>
          <a href="/#contact" className="art-footer__link">Contact</a>
        </div>
      </footer>
    </ArticleLayout>
  )
}
