import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ArticleLayout from '../components/ArticleLayout'
import ResumeSubNav from '../components/ResumeSubNav'
import { supabase } from '../lib/supabase'
import { useT } from '../hooks/useT'

const COMPANY_CATALOG = {
  google:    { name: 'Google',    slug: 'google' },
  apple:     { name: 'Apple',     slug: 'apple' },
  microsoft: { name: 'Microsoft', slug: 'microsoft' },
  meta:      { name: 'Meta',      slug: 'meta' },
  amazon:    { name: 'Amazon',    slug: 'amazon' },
  tiktok:    { name: 'TikTok',    slug: 'tiktok' },
  pinterest: { name: 'Pinterest', slug: 'pinterest' },
  reddit:    { name: 'Reddit',    slug: 'reddit' },
  discord:   { name: 'Discord',   slug: 'discord' },
  stripe:    { name: 'Stripe',    slug: 'stripe' },
  figma:     { name: 'Figma',     slug: 'figma' },
  dropbox:   { name: 'Dropbox',   slug: 'dropbox' },
  ibm:       { name: 'IBM',       slug: 'ibm' },
  airbnb:    { name: 'Airbnb',    slug: 'airbnb' },
  spotify:   { name: 'Spotify',   slug: 'spotify' },
  netflix:   { name: 'Netflix',   slug: 'netflix' },
  uber:      { name: 'Uber',      slug: 'uber' },
  lyft:      { name: 'Lyft',      slug: 'lyft' },
  linkedin:  { name: 'LinkedIn',  slug: 'linkedin' },
  openai:    { name: 'OpenAI',    slug: 'openai' },
  anthropic: { name: 'Anthropic', slug: null, letter: 'A', color: '#C4602D' },
  fidelity:  { name: 'Fidelity',  slug: null, letter: 'F', color: '#006633' },
  jpmorgan:  { name: 'JPMorgan',  slug: null, letter: 'JP', color: '#003087' },
}

const TRENDING = ['google', 'amazon', 'discord', 'apple', 'microsoft', 'meta', 'spotify', 'reddit', 'openai']
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function CompanyMark({ slug, letter, color, size = 28 }) {
  if (slug) {
    return <img src={`https://cdn.simpleicons.org/${slug}`} alt="" width={size} height={size} loading="lazy" style={{ width: size, height: size, objectFit: 'contain' }} />
  }
  return (
    <span style={{ width: size, height: size, borderRadius: 6, background: color || 'var(--color-muted)', color: 'var(--color-white)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: Math.round(size * 0.42) }}>
      {letter || '?'}
    </span>
  )
}

export default function ResumeCompanies() {
  const t = useT('resumeCompanies')
  const navigate = useNavigate()
  const [counts, setCounts] = useState({})
  const [search, setSearch] = useState('')
  const [activeLetter, setActiveLetter] = useState(null)
  const [reqName, setReqName] = useState('')
  const [reqWebsite, setReqWebsite] = useState('')
  const [reqStatus, setReqStatus] = useState('idle')

  useEffect(() => {
    supabase.from('resume_submissions')
      .select('target_companies')
      .in('status', ['approved', 'featured'])
      .then(({ data }) => {
        if (!data) return
        const c = {}
        data.forEach(row => {
          const keys = (row.target_companies || '').split(',')
            .map(s => s.trim().toLowerCase().replace(/\s+/g, ''))
            .filter(Boolean)
          new Set(keys).forEach(k => { c[k] = (c[k] || 0) + 1 })
        })
        setCounts(c)
      })
  }, [])

  const allCompanies = useMemo(() => {
    return Object.entries(COMPANY_CATALOG).map(([key, meta]) => ({
      key,
      name: meta.name,
      slug: meta.slug,
      letter: meta.letter,
      color: meta.color,
      count: counts[key] || 0,
    }))
  }, [counts])

  const filteredCompanies = useMemo(() => {
    let list = allCompanies
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.key.includes(q))
    }
    if (activeLetter) {
      list = list.filter(c => c.name[0].toUpperCase() === activeLetter)
    }
    return list.sort((a, b) => a.name.localeCompare(b.name))
  }, [allCompanies, search, activeLetter])

  const availableLetters = useMemo(() => {
    const set = new Set(allCompanies.map(c => c.name[0].toUpperCase()))
    return set
  }, [allCompanies])

  function goToCompany(key) {
    navigate(`/resume-reviews?company=${encodeURIComponent(key)}`)
  }

  async function handleRequestSubmit(e) {
    e.preventDefault()
    if (!reqName.trim()) return
    setReqStatus('loading')
    const { error } = await supabase.from('template_requests').insert({
      request: `${reqName.trim()}${reqWebsite ? ' | ' + reqWebsite.trim() : ''}`,
      category: 'company',
    })
    if (error) setReqStatus('error')
    else { setReqStatus('success'); setReqName(''); setReqWebsite('') }
  }

  const stackLogos = ['meta', 'figma', 'dropbox', 'amazon', 'lyft', 'uber', 'netflix', 'pinterest', 'spotify']

  return (
    <ArticleLayout title={t.heroTitle}>
      <style>{`
        html, body { background: var(--color-cream); }
        .rc-wrap { max-width: 1240px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 56px) 80px; }

        .rc-hero { position: relative; padding: 90px 24px 56px; text-align: center; overflow: hidden; isolation: isolate; }
        .rc-hero__stack { position: absolute; inset: 30px 0 auto 0; display: flex; justify-content: center; align-items: flex-start; gap: 24px; opacity: .25; pointer-events: none; filter: blur(.4px); z-index: 0; }
        .rc-hero__stack-icon { width: 72px; height: 72px; border-radius: 18px; background: var(--color-white); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 18px rgba(0,0,0,.06); }
        .rc-hero__stack-icon:nth-child(1) { transform: translateY(-8px) rotate(-3deg); }
        .rc-hero__stack-icon:nth-child(2) { transform: translateY(14px) rotate(2deg); }
        .rc-hero__stack-icon:nth-child(3) { transform: translateY(-4px); }
        .rc-hero__stack-icon:nth-child(4) { transform: translateY(20px) rotate(-2deg); }
        .rc-hero__stack-icon:nth-child(5) { transform: translateY(-2px) rotate(4deg); position: relative; z-index: 2; opacity: 1; box-shadow: 0 14px 32px rgba(179,69,57,.18); background: var(--color-accent); }
        .rc-hero__stack-icon:nth-child(5) img { filter: brightness(0) invert(1); }
        .rc-hero__stack-icon:nth-child(6) { transform: translateY(18px) rotate(2deg); }
        .rc-hero__stack-icon:nth-child(7) { transform: translateY(-6px); }
        .rc-hero__stack-icon:nth-child(8) { transform: translateY(10px) rotate(-2deg); }
        .rc-hero__stack-icon:nth-child(9) { transform: translateY(-8px) rotate(3deg); }
        .rc-hero__inner { position: relative; z-index: 1; padding-top: 110px; }
        .rc-hero__title { font-family: var(--font-display); font-size: clamp(36px, 5.5vw, 64px); font-weight: 700; color: var(--color-dark); line-height: 1.05; margin-bottom: 14px; letter-spacing: -0.01em; }
        .rc-hero__title em { font-style: normal; color: var(--color-gold); }
        .rc-hero__body { font-size: clamp(15px, 1.7vw, 17px); color: var(--color-muted); line-height: 1.7; max-width: 620px; margin: 0 auto; }

        .rc-search { position: relative; max-width: 100%; margin: 32px 0 56px; }
        .rc-search__input { width: 100%; padding: 16px 16px 16px 48px; background: var(--color-white); border: 1.5px solid rgba(0,0,0,.1); border-radius: 12px; font-family: var(--font-body); font-size: 15px; color: var(--color-dark); transition: border-color .18s, box-shadow .18s; }
        .rc-search__input:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 4px rgba(179,69,57,.12); }
        .rc-search__icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: var(--color-muted); pointer-events: none; }

        .rc-section-title { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--color-dark); margin-bottom: 18px; }

        .rc-trending { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 56px; }
        .rc-trending__card { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 18px 22px; background: var(--color-white); border: 1px solid rgba(0,0,0,.08); border-radius: 12px; cursor: pointer; transition: transform .18s cubic-bezier(.16,1,.3,1), border-color .18s, box-shadow .18s; text-decoration: none; color: inherit; }
        .rc-trending__card:hover { transform: translateY(-2px); border-color: var(--color-accent); box-shadow: 0 6px 18px rgba(0,0,0,.06); }
        .rc-trending__card-left { display: flex; align-items: center; gap: 14px; min-width: 0; }
        .rc-trending__card-name { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--color-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rc-trending__card-arrow { color: var(--color-muted); flex-shrink: 0; transition: transform .18s, color .18s; }
        .rc-trending__card:hover .rc-trending__card-arrow { transform: translateX(4px); color: var(--color-accent); }
        @media (max-width: 800px) { .rc-trending { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px) { .rc-trending { grid-template-columns: 1fr; } }

        .rc-alpha { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .rc-alpha__btn { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid rgba(0,0,0,.12); background: transparent; font-family: var(--font-display); font-size: 13px; font-weight: 700; color: var(--color-dark); cursor: pointer; transition: background .18s, border-color .18s, color .18s; display: inline-flex; align-items: center; justify-content: center; }
        .rc-alpha__btn:hover:not(:disabled) { border-color: var(--color-accent); color: var(--color-accent); }
        .rc-alpha__btn--active { background: var(--color-dark); border-color: var(--color-dark); color: var(--color-cream); }
        .rc-alpha__btn:disabled { opacity: .35; cursor: not-allowed; }

        .rc-letter-clear { font-size: 13px; color: var(--color-muted); background: none; border: none; cursor: pointer; text-decoration: underline; margin-left: 8px; align-self: center; }
        .rc-letter-clear:hover { color: var(--color-accent); }

        .rc-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 56px; }
        .rc-list__item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: var(--color-white); border: 1px solid rgba(0,0,0,.08); border-radius: 10px; cursor: pointer; text-decoration: none; color: inherit; transition: border-color .18s, transform .18s; }
        .rc-list__item:hover { border-color: var(--color-accent); transform: translateX(2px); }
        .rc-list__item-name { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--color-dark); flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rc-list__item-count { font-size: 12px; color: var(--color-muted); flex-shrink: 0; }
        .rc-list__empty { grid-column: 1 / -1; padding: 32px; text-align: center; color: var(--color-muted); font-size: 14px; }
        @media (max-width: 800px) { .rc-list { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px) { .rc-list { grid-template-columns: 1fr; } }

        .rc-request { display: grid; grid-template-columns: 1fr 1.6fr; gap: 32px; align-items: start; padding: 32px; background: var(--color-white); border: 1px solid rgba(0,0,0,.08); border-radius: 14px; }
        .rc-request__icon { width: 56px; height: 56px; border-radius: 14px; background: rgba(91,142,194,.14); color: var(--color-blue); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 18px; font-family: var(--font-display); font-size: 26px; font-weight: 700; }
        .rc-request__title { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--color-dark); margin-bottom: 8px; }
        .rc-request__body { font-size: 14px; color: var(--color-muted); line-height: 1.6; max-width: 320px; }
        .rc-request__field { margin-bottom: 14px; }
        .rc-request__label { display: block; font-size: 13px; font-weight: 700; color: var(--color-dark); margin-bottom: 6px; font-family: var(--font-display); }
        .rc-request__input { width: 100%; padding: 11px 14px; background: var(--color-cream); border: 1.5px solid rgba(0,0,0,.1); border-radius: 8px; font-family: var(--font-body); font-size: 14px; color: var(--color-dark); transition: border-color .18s, box-shadow .18s; }
        .rc-request__input:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(179,69,57,.1); }
        .rc-request__submit { display: inline-block; padding: 11px 22px; background: var(--color-accent); color: var(--color-white); border: none; border-radius: 8px; font-family: var(--font-display); font-size: 14px; font-weight: 700; cursor: pointer; transition: background .18s, transform .18s; margin-top: 4px; }
        .rc-request__submit:hover:not(:disabled) { background: var(--color-accent-hover); transform: translateY(-1px); }
        .rc-request__submit:disabled { opacity: .55; cursor: not-allowed; }
        .rc-request__msg { font-size: 13px; margin-top: 10px; }
        .rc-request__msg--success { color: var(--color-teal); }
        .rc-request__msg--error { color: var(--color-accent); }
        @media (max-width: 720px) { .rc-request { grid-template-columns: 1fr; padding: 24px; } }
      `}</style>

      <ResumeSubNav />

      <div className="rc-wrap">
        <header className="rc-hero">
          <div className="rc-hero__stack" aria-hidden="true">
            {stackLogos.map(slug => (
              <span key={slug} className="rc-hero__stack-icon">
                <img src={`https://cdn.simpleicons.org/${slug}`} alt="" width={36} height={36} loading="lazy" />
              </span>
            ))}
          </div>
          <div className="rc-hero__inner">
            <h1 className="rc-hero__title">{t.heroTitle}</h1>
            <p className="rc-hero__body">{t.heroBody}</p>
          </div>
        </header>

        <div className="rc-search">
          <svg className="rc-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            className="rc-search__input"
            type="search"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label={t.searchPlaceholder}
          />
        </div>

        {!search && !activeLetter && (
          <>
            <h2 className="rc-section-title">{t.trendingTitle}</h2>
            <div className="rc-trending">
              {TRENDING.map(key => {
                const meta = COMPANY_CATALOG[key]
                if (!meta) return null
                return (
                  <button
                    key={key}
                    type="button"
                    className="rc-trending__card"
                    onClick={() => goToCompany(key)}
                    aria-label={`${t.viewCompanyAria} ${meta.name}`}
                  >
                    <span className="rc-trending__card-left">
                      <CompanyMark slug={meta.slug} letter={meta.letter} color={meta.color} size={28} />
                      <span className="rc-trending__card-name">{meta.name}</span>
                    </span>
                    <svg className="rc-trending__card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                )
              })}
            </div>
          </>
        )}

        <h2 className="rc-section-title">
          {t.allCompaniesTitle}
          {activeLetter && (
            <button className="rc-letter-clear" onClick={() => setActiveLetter(null)}>{t.backToAll}</button>
          )}
        </h2>
        <div className="rc-alpha" role="group" aria-label="Filter by letter">
          {ALPHABET.map(L => {
            const has = availableLetters.has(L)
            return (
              <button
                key={L}
                type="button"
                className={`rc-alpha__btn${activeLetter === L ? ' rc-alpha__btn--active' : ''}`}
                onClick={() => setActiveLetter(prev => prev === L ? null : L)}
                disabled={!has}
                aria-pressed={activeLetter === L}
              >
                {L}
              </button>
            )
          })}
        </div>

        {(search || activeLetter) && (
          <div className="rc-list">
            {filteredCompanies.length === 0 ? (
              <div className="rc-list__empty">{t.emptyForLetter} <strong>{activeLetter || `"${search}"`}</strong></div>
            ) : filteredCompanies.map(c => (
              <button key={c.key} type="button" className="rc-list__item" onClick={() => goToCompany(c.key)}>
                <CompanyMark slug={c.slug} letter={c.letter} color={c.color} size={24} />
                <span className="rc-list__item-name">{c.name}</span>
                <span className="rc-list__item-count">{c.count} {c.count === 1 ? t.countResume : t.countResumes}</span>
              </button>
            ))}
          </div>
        )}

        <section className="rc-request" aria-labelledby="rc-request-title">
          <div>
            <span className="rc-request__icon">?</span>
            <h2 className="rc-request__title" id="rc-request-title">{t.notListedTitle}</h2>
            <p className="rc-request__body">{t.notListedBody}</p>
          </div>
          <form onSubmit={handleRequestSubmit}>
            <div className="rc-request__field">
              <label className="rc-request__label" htmlFor="rcReqName">{t.notListedNameLabel}</label>
              <input
                id="rcReqName"
                className="rc-request__input"
                type="text"
                placeholder={t.notListedNamePlaceholder}
                value={reqName}
                onChange={e => setReqName(e.target.value)}
                required
              />
            </div>
            <div className="rc-request__field">
              <label className="rc-request__label" htmlFor="rcReqUrl">{t.notListedWebsiteLabel}</label>
              <input
                id="rcReqUrl"
                className="rc-request__input"
                type="url"
                placeholder={t.notListedWebsitePlaceholder}
                value={reqWebsite}
                onChange={e => setReqWebsite(e.target.value)}
              />
            </div>
            <button type="submit" className="rc-request__submit" disabled={reqStatus === 'loading' || !reqName.trim()}>
              {reqStatus === 'loading' ? t.notListedSubmitting : t.notListedSubmit}
            </button>
            {reqStatus === 'success' && <p className="rc-request__msg rc-request__msg--success">{t.notListedSuccess}</p>}
            {reqStatus === 'error' && <p className="rc-request__msg rc-request__msg--error">{t.notListedError}</p>}
          </form>
        </section>
      </div>
    </ArticleLayout>
  )
}
