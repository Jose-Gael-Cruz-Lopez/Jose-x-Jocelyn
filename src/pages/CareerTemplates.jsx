import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ArticleLayout from '../components/ArticleLayout'
import { supabase } from '../lib/supabase'
import { useT } from '../hooks/useT'

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
)

const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

export default function CareerTemplates() {
  const t = useT('careerTemplates')
  const [activeFilter, setActiveFilter] = useState('all')
  const [request, setRequest] = useState('')
  const [reqEmail, setReqEmail] = useState('')
  const [reqCategory, setReqCategory] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleFilterClick = useCallback(e => setActiveFilter(e.currentTarget.dataset.key), [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!request.trim()) { setFormError(t.formErrorRequired); return }
    setFormLoading(true)
    setFormError('')
    const { error } = await supabase.from('template_requests').insert({
      request: request.trim(),
      email: reqEmail.trim() || null,
      category: reqCategory || null,
    })
    setFormLoading(false)
    if (error) { setFormError(t.formErrorGeneric) }
    else { setFormSubmitted(true) }
  }

  const TEMPLATES = t.templates

  const STAGE_LABELS = {
    outreach: t.stageOutreach,
    apply: t.stageApply,
    interview: t.stageInterview,
    offers: t.stageOffers,
    job: t.stageJob,
  }

  const FILTERS = [
    { key: 'all', label: t.filterAll },
    { key: 'outreach', label: t.filterOutreach },
    { key: 'apply', label: t.filterApply },
    { key: 'interview', label: t.filterInterview },
    { key: 'offers', label: t.filterOffers },
    { key: 'job', label: t.filterJob },
  ]

  const LEGEND_LABELS = {
    outreach: t.filterOutreach,
    apply: t.filterApply,
    interview: t.filterInterview,
    offers: t.filterOffers,
    job: t.filterJob,
  }

  const visible = activeFilter === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(tmpl => tmpl.cat === activeFilter)

  const countLabel = visible.length === 1
    ? t.countOne
    : t.countMany.replace('{n}', visible.length)

  return (
    <ArticleLayout title={t.heroTitle}>
      <style>{`
        html, body { background: var(--color-cream); }

        .ct-hero {
          max-width: 1240px;
          margin: 0 auto;
          padding: 96px clamp(20px,5vw,56px) 64px;
          position: relative;
          overflow: hidden;
        }
        .ct-hero::before {
          content: '';
          position: absolute;
          top: 96px;
          left: clamp(20px,5vw,56px);
          width: 56px;
          height: 4px;
          background: var(--color-accent);
          border-radius: 2px;
        }
        .ct-hero::after {
          content: '';
          position: absolute;
          top: -14%;
          right: -10%;
          width: 520px;
          height: 520px;
          background: radial-gradient(closest-side, rgba(179,69,57,.1), transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .ct-hero > * { position: relative; z-index: 1; }
        .ct-hero__kicker {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin: 28px 0 22px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .ct-hero__kicker::after {
          content: '';
          width: 24px;
          height: 1px;
          background: var(--color-accent);
          opacity: .5;
        }
        .ct-hero__title {
          font-family: var(--font-display);
          font-size: clamp(44px, 8vw, 96px);
          font-weight: 700;
          line-height: .98;
          letter-spacing: -.028em;
          color: var(--color-dark);
          margin-bottom: 18px;
          max-width: 18ch;
        }
        .ct-hero__title em {
          font-style: italic;
          font-family: var(--font-serif, var(--font-display));
          color: var(--color-gold-dark);
          font-weight: 500;
          padding-right: .04em;
        }
        .ct-hero__tagline {
          font-family: var(--font-serif, var(--font-display));
          font-size: clamp(18px,2.2vw,24px);
          font-style: italic;
          font-weight: 400;
          color: var(--color-accent);
          margin-bottom: 22px;
          letter-spacing: -.005em;
        }
        .ct-hero__sub {
          font-size: clamp(16px,1.8vw,18px);
          color: var(--color-muted);
          line-height: 1.7;
          max-width: 62ch;
        }
        .ct-hero__sub strong { color: var(--color-dark); font-weight: 600; }

        .ct-controls {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 clamp(20px,5vw,56px) 40px;
        }
        .ct-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .ct-filter {
          padding: 11px 18px;
          border-radius: 999px;
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: -.005em;
          cursor: pointer;
          border: 1.5px solid rgba(26,25,22,.1);
          background: rgba(255,255,255,.55);
          color: var(--color-muted);
          transition: background-color .2s, color .2s, border-color .2s, transform .15s, box-shadow .2s;
        }
        .ct-filter:hover { color: var(--color-dark); border-color: rgba(26,25,22,.22); background: rgba(255,255,255,.85); transform: translateY(-1px); box-shadow: 0 4px 12px -4px rgba(63,42,28,.1); }
        .ct-filter:active { transform: translateY(0); }
        .ct-filter:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; border-radius: 999px; }
        .ct-filter--active { background: var(--color-dark); color: var(--color-cream); border-color: var(--color-dark); box-shadow: 0 8px 18px -8px rgba(63,42,28,.32), inset 0 1px 0 rgba(255,255,255,.08); }
        .ct-filter--outreach.ct-filter--active { background: var(--color-teal);  border-color: var(--color-teal); }
        .ct-filter--apply.ct-filter--active    { background: var(--color-blue);  border-color: var(--color-blue); }
        .ct-filter--interview.ct-filter--active { background: var(--color-gold-dark); border-color: var(--color-gold-dark); }
        .ct-filter--offers.ct-filter--active   { background: var(--color-accent); border-color: var(--color-accent); }
        .ct-filter--job.ct-filter--active      { background: var(--color-navy);  border-color: var(--color-navy); }

        .ct-meta {
          max-width: 1040px;
          margin: 0 auto;
          padding: 0 clamp(20px,5vw,56px) 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .ct-count { font-size: 13px; color: var(--color-muted); }

        .ct-grid {
          max-width: 1040px;
          margin: 0 auto;
          padding: 0 clamp(20px,5vw,56px) 80px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .ct-card {
          background: linear-gradient(180deg, rgba(255,250,242,.85) 0%, rgba(255,250,242,.55) 100%);
          border: 1px solid rgba(26,25,22,.13);
          border-radius: 14px;
          padding: 24px 24px 22px;
          display: flex;
          flex-direction: column;
          gap: 0;
          box-shadow: 0 1px 0 rgba(255,255,255,.5) inset, 0 4px 12px -6px rgba(63,42,28,.12);
          transition: transform .28s cubic-bezier(.16,1,.3,1), box-shadow .28s cubic-bezier(.16,1,.3,1), border-color .28s;
        }
        .ct-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 1px 0 rgba(255,255,255,.6) inset, 0 16px 36px -12px rgba(63,42,28,.22);
          border-color: rgba(26,25,22,.22);
        }
        /* per-stage tint replaces the banned 3px colored top stripe */
        .ct-card--outreach  { background: linear-gradient(180deg, rgba(58,125,107,.07) 0%, rgba(255,250,242,.55) 60%); border-color: rgba(58,125,107,.22); }
        .ct-card--apply     { background: linear-gradient(180deg, rgba(91,142,194,.07) 0%, rgba(255,250,242,.55) 60%); border-color: rgba(91,142,194,.22); }
        .ct-card--interview { background: linear-gradient(180deg, rgba(232,168,56,.07) 0%, rgba(255,250,242,.55) 60%); border-color: rgba(232,168,56,.26); }
        .ct-card--offers    { background: linear-gradient(180deg, rgba(179,69,57,.06) 0%, rgba(255,250,242,.55) 60%); border-color: rgba(179,69,57,.22); }
        .ct-card--job       { background: linear-gradient(180deg, rgba(22,43,68,.06) 0%, rgba(255,250,242,.55) 60%); border-color: rgba(22,43,68,.2); }

        .ct-card__top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .ct-card__num {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: -.005em;
          color: rgba(232,168,56,.55);
          font-variant-numeric: tabular-nums;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .ct-card__badges { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
        .ct-card__stage {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .ct-card__stage--outreach  { background: rgba(58,125,107,0.14);  color: var(--color-teal); }
        .ct-card__stage--apply     { background: rgba(91,142,194,0.14);  color: var(--color-blue); }
        .ct-card__stage--interview { background: rgba(232,168,56,0.18);  color: var(--color-gold-dark); }
        .ct-card__stage--offers    { background: rgba(179,69,57,0.12);   color: var(--color-accent); }
        .ct-card__stage--job       { background: rgba(22,43,68,0.12);    color: var(--color-navy); }

        .ct-card__author {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          color: var(--color-white);
        }
        .ct-card__author--jose    { background: var(--color-teal); }
        .ct-card__author--jocelyn { background: var(--color-accent); }
        .ct-card__author--both    { background: var(--color-navy); }

        .ct-card__title {
          font-family: var(--font-display);
          font-size: clamp(16px,1.8vw,19px);
          font-weight: 600;
          color: var(--color-dark);
          line-height: 1.3;
          margin-bottom: 10px;
        }
        .ct-card__desc {
          font-size: 14px;
          color: var(--color-muted);
          line-height: 1.6;
          flex: 1;
          margin-bottom: 22px;
        }
        .ct-card__cta {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 18px;
          border-radius: 999px;
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: -.005em;
          text-decoration: none;
          cursor: pointer;
          border: 1.5px solid;
          transition: background .25s, color .25s, transform .22s cubic-bezier(.16,1,.3,1), box-shadow .25s;
          align-self: flex-start;
        }
        .ct-card__cta--outreach  { background: transparent; color: var(--color-teal);      border-color: rgba(58,125,107,.5); }
        .ct-card__cta--apply     { background: transparent; color: var(--color-blue);      border-color: rgba(91,142,194,.5); }
        .ct-card__cta--interview { background: transparent; color: var(--color-gold-dark); border-color: rgba(232,168,56,.6); }
        .ct-card__cta--offers    { background: transparent; color: var(--color-accent);    border-color: rgba(179,69,57,.5); }
        .ct-card__cta--job       { background: transparent; color: var(--color-navy);      border-color: rgba(22,43,68,.4); }
        .ct-card__cta:hover { transform: translateY(-1px); }
        .ct-card__cta--outreach:hover  { background: var(--color-teal);   color: var(--color-cream); border-color: var(--color-teal);   box-shadow: 0 8px 16px -8px rgba(58,125,107,.5); }
        .ct-card__cta--apply:hover     { background: var(--color-blue);   color: var(--color-cream); border-color: var(--color-blue);   box-shadow: 0 8px 16px -8px rgba(91,142,194,.5); }
        .ct-card__cta--interview:hover { background: var(--color-gold);   color: var(--color-dark);  border-color: var(--color-gold);   box-shadow: 0 8px 16px -8px rgba(232,168,56,.5); }
        .ct-card__cta--offers:hover    { background: var(--color-accent); color: var(--color-cream); border-color: var(--color-accent); box-shadow: 0 8px 16px -8px rgba(179,69,57,.5); }
        .ct-card__cta--job:hover       { background: var(--color-navy);   color: var(--color-cream); border-color: var(--color-navy);   box-shadow: 0 8px 16px -8px rgba(22,43,68,.5); }
        .ct-card__cta:active { transform: translateY(0); }

        .ct-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 64px 0;
          color: var(--color-muted);
          font-size: 16px;
        }

        .ct-legend {
          max-width: 1040px;
          margin: 0 auto 48px;
          padding: 0 clamp(20px,5vw,56px);
          display: flex;
          flex-wrap: wrap;
          gap: 10px 24px;
        }
        .ct-legend__item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--color-muted); }
        .ct-legend__dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .ct-legend__dot--outreach  { background: var(--color-teal); }
        .ct-legend__dot--apply     { background: var(--color-blue); }
        .ct-legend__dot--interview { background: var(--color-gold); }
        .ct-legend__dot--offers    { background: var(--color-accent); }
        .ct-legend__dot--job       { background: var(--color-navy); }

        .ct-form-wrap {
          background: var(--color-navy);
          padding: clamp(56px,8vw,96px) clamp(20px,5vw,56px);
        }
        .ct-form-inner {
          max-width: 1040px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: start;
        }
        .ct-form-copy__kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-gold);
          margin-bottom: 16px;
        }
        .ct-form-copy__title {
          font-family: var(--font-display);
          font-size: clamp(24px,3.5vw,38px);
          font-weight: 700;
          color: var(--color-cream);
          line-height: 1.15;
          margin-bottom: 16px;
        }
        .ct-form-copy__sub { font-size: 15px; color: rgba(242,228,206,0.65); line-height: 1.7; }
        .ct-form-row { margin-bottom: 16px; }
        .ct-form-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(242,228,206,0.5);
          margin-bottom: 6px;
        }
        .ct-form-input,
        .ct-form-select,
        .ct-form-textarea {
          width: 100%;
          font-family: var(--font-body);
          font-size: 15px;
          padding: 12px 14px;
          border: 1.5px solid rgba(242,228,206,0.15);
          border-radius: 8px;
          background: rgba(255,255,255,0.07);
          color: var(--color-cream);
          outline: none;
          transition: border-color 0.2s;
        }
        .ct-form-input::placeholder,
        .ct-form-textarea::placeholder { color: rgba(242,228,206,0.3); }
        .ct-form-input:focus,
        .ct-form-select:focus,
        .ct-form-textarea:focus { border-color: var(--color-gold); }
        .ct-form-select { appearance: none; cursor: pointer; }
        .ct-form-select option { background: var(--color-navy); color: var(--color-cream); }
        .ct-form-textarea { min-height: 90px; resize: vertical; line-height: 1.55; }
        .ct-form-btn {
          margin-top: 4px;
          padding: 13px 28px;
          background: var(--color-gold);
          color: var(--color-dark);
          border: none;
          border-radius: 8px;
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.18s;
        }
        .ct-form-btn:hover { background: var(--color-cream); transform: translateY(-1px); }

        @media (max-width: 768px) {
          .ct-form-inner { grid-template-columns: 1fr; gap: 32px; }
          .ct-grid { grid-template-columns: 1fr; }
          .ct-hero { padding: 88px 20px 48px; }
        }
        @media (max-width: 480px) {
          .ct-hero { padding: 80px 16px 40px; }
          .ct-filters { overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap; padding-bottom: 4px; }
          .ct-filter { flex-shrink: 0; }
        }
      `}</style>

      <header className="ct-hero">
        <p className="ct-hero__kicker">{t.heroKicker}</p>
        <h1 className="ct-hero__title">{t.heroTitle}</h1>
        <p className="ct-hero__tagline">{t.heroTagline}</p>
        <p className="ct-hero__sub">
          {t.heroSub}{' '}
          <strong>{t.heroSubStrong}</strong>{' '}{t.heroSubSuffix}
        </p>
      </header>

      <div className="ct-controls">
        <div className="ct-filters" role="group" aria-label={t.filterAriaLabel}>
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              data-key={key}
              className={`ct-filter${key !== 'all' ? ` ct-filter--${key}` : ''}${activeFilter === key ? ' ct-filter--active' : ''}`}
              onClick={handleFilterClick}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="ct-legend" aria-hidden="true">
        {['outreach', 'apply', 'interview', 'offers', 'job'].map(s => (
          <div key={s} className="ct-legend__item">
            <span className={`ct-legend__dot ct-legend__dot--${s}`}></span>
            {LEGEND_LABELS[s]}
          </div>
        ))}
      </div>

      <div className="ct-meta">
        <p className="ct-count">{countLabel}</p>
      </div>

      <div className="ct-grid" aria-label={t.gridAriaLabel}>
        {visible.length === 0 ? (
          <div className="ct-empty" aria-live="polite">{t.emptyState}</div>
        ) : (
          visible.map(tmpl => (
            <div key={tmpl.id} className={`ct-card ct-card--${tmpl.stage}`}>
              <div className="ct-card__top">
                <span className="ct-card__num">{tmpl.num}</span>
                <div className="ct-card__badges">
                  <span className={`ct-card__stage ct-card__stage--${tmpl.stage}`}>{STAGE_LABELS[tmpl.stage]}</span>
                  <span className={`ct-card__author ct-card__author--${tmpl.author}`}>
                    {tmpl.author === 'jose' ? t.authorJose : tmpl.author === 'jocelyn' ? t.authorJocelyn : t.authorBoth}
                  </span>
                </div>
              </div>
              <h2 className="ct-card__title">{tmpl.title}</h2>
              <p className="ct-card__desc">{tmpl.desc}</p>
              <a href="#" className={`ct-card__cta ct-card__cta--${tmpl.stage}`}>
                {tmpl.ctaLabel}
                {tmpl.ctaIcon === 'copy' ? <CopyIcon /> : <ExternalIcon />}
              </a>
            </div>
          ))
        )}
      </div>

      <section className="ct-form-wrap">
        <div className="ct-form-inner">
          <div className="ct-form-copy">
            <p className="ct-form-copy__kicker">{t.formKicker}</p>
            <h2 className="ct-form-copy__title">{t.formTitle}</h2>
            <p className="ct-form-copy__sub">{t.formSub}</p>
          </div>
          <div className="ct-form-box">
            {formSubmitted ? (
              <div style={{ padding: '32px 0', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(58,125,107,.1)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 14px' }}>✓</div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--color-dark)', marginBottom: 6 }}>{t.formSuccessTitle}</p>
                <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>{t.formSuccessBody}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="ct-form-row">
                  <label className="ct-form-label" htmlFor="reqField">{t.formLabelRequest}</label>
                  <textarea className="ct-form-textarea" id="reqField" placeholder={t.formPlaceholderRequest} value={request} onChange={e => setRequest(e.target.value)}></textarea>
                </div>
                <div className="ct-form-row">
                  <label className="ct-form-label" htmlFor="reqEmailField">{t.formLabelEmail}</label>
                  <input className="ct-form-input" type="email" id="reqEmailField" placeholder={t.formPlaceholderEmail} value={reqEmail} onChange={e => setReqEmail(e.target.value)} />
                </div>
                <div className="ct-form-row">
                  <label className="ct-form-label" htmlFor="reqCat">{t.formLabelCategory}</label>
                  <select className="ct-form-select" id="reqCat" value={reqCategory} onChange={e => setReqCategory(e.target.value)}>
                    <option value="">{t.formCategoryPlaceholder}</option>
                    <option value="internship-search">{t.catInternshipSearch}</option>
                    <option value="networking-outreach">{t.catNetworkingOutreach}</option>
                    <option value="interview-prep">{t.catInterviewPrep}</option>
                    <option value="offers-negotiation">{t.catOffersNegotiation}</option>
                    <option value="first-job-onboarding">{t.catFirstJobOnboarding}</option>
                  </select>
                </div>
                {formError && <p role="alert" style={{ color: 'var(--color-accent)', fontSize: '13px', marginBottom: '10px' }}>{formError}</p>}
                <button className="ct-form-btn" type="submit" disabled={formLoading}>{formLoading ? t.formBtnSubmitting : t.formBtnSubmit}</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="art-footer" style={{ maxWidth: '1040px' }}>
        <span className="art-footer__copy">{t.footerCopy}</span>
        <div className="art-footer__links">
          <Link to="/" className="art-footer__link">{t.footerHome}</Link>
          <Link to="/articles" className="art-footer__link">{t.footerArticles}</Link>
          <Link to="/linkedin-series" className="art-footer__link">{t.footerLinkedIn}</Link>
        </div>
      </footer>
    </ArticleLayout>
  )
}
