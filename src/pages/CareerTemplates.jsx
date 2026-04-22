import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ArticleLayout from '../components/ArticleLayout'
import { supabase } from '../lib/supabase'

const TEMPLATES = [
  {
    id: 1, cat: 'outreach', stage: 'outreach', author: 'jose',
    num: '01',
    title: 'Cold LinkedIn DM - Student to Professional',
    desc: 'Three versions: to a recruiter, to an engineer, and to an alum. Short, specific, non-desperate. The exact messages that actually get replies.',
    ctaLabel: 'Copy Template', ctaIcon: 'copy',
  },
  {
    id: 2, cat: 'outreach', stage: 'outreach', author: 'jose',
    num: '02',
    title: 'Coffee Chat Request Email',
    desc: 'One template with customizable fields - intro, specific ask, and availability block. Turns cold outreach into warm conversations without sounding transactional.',
    ctaLabel: 'Copy Template', ctaIcon: 'copy',
  },
  {
    id: 3, cat: 'outreach', stage: 'outreach', author: 'jose',
    num: '03',
    title: 'Follow-Up After No Response (3-Step Sequence)',
    desc: 'Day 1, Day 7, Day 14 follow-up messages that don\'t sound needy or desperate. The system Jose uses to follow up on every outreach without burning bridges.',
    ctaLabel: 'Copy Template', ctaIcon: 'copy',
  },
  {
    id: 4, cat: 'outreach', stage: 'outreach', author: 'both',
    num: '04',
    title: 'Recruiter Outreach on LinkedIn',
    desc: 'Specific to early-career - how to express genuine interest in a role without formally applying yet, and how to position yourself before the application portal even opens.',
    ctaLabel: 'Copy Template', ctaIcon: 'copy',
  },
  {
    id: 5, cat: 'apply', stage: 'apply', author: 'both',
    num: '05',
    title: 'Internship Application Tracker',
    desc: 'Spreadsheet layout: company, role, deadline, application status, contact name, follow-up date, and notes column. The system that turns chaotic applying into a real pipeline.',
    ctaLabel: 'Open Tracker', ctaIcon: 'external',
  },
  {
    id: 6, cat: 'apply', stage: 'apply', author: 'both',
    num: '06',
    title: 'Resume Bullet Formula',
    desc: 'A STAR-lite formula with 10 filled-in examples from CS, data, and engineering roles. Converts vague experience descriptions into specific, measurable bullet points that recruiters actually read.',
    ctaLabel: 'Open Framework', ctaIcon: 'external',
  },
  {
    id: 7, cat: 'interview', stage: 'interview', author: 'both',
    num: '07',
    title: '"Tell Me About Yourself" Script',
    desc: 'A 3-part framework: who you are, what you\'ve done, why this role - with a student version and a post-grad version. Converts generic self-introductions into confident, specific narratives.',
    ctaLabel: 'Copy Template', ctaIcon: 'copy',
  },
  {
    id: 8, cat: 'interview', stage: 'interview', author: 'both',
    num: '08',
    title: 'STAR Story Bank Template',
    desc: 'A blank template for 6–8 stories covering leadership, failure, teamwork, and problem-solving. Build your whole story library once, then pull from it in every interview.',
    ctaLabel: 'Open Framework', ctaIcon: 'external',
  },
  {
    id: 9, cat: 'interview', stage: 'interview', author: 'both',
    num: '09',
    title: 'Post-Interview Thank You Note',
    desc: 'Two versions: one for after a recruiter screen, one for after a technical or panel round. Specific, warm, and short - the kind that actually gets forwarded.',
    ctaLabel: 'Copy Template', ctaIcon: 'copy',
  },
  {
    id: 10, cat: 'interview', stage: 'interview', author: 'jocelyn',
    num: '10',
    title: 'Questions to Ask at the End of an Interview',
    desc: '15 specific, non-generic questions organized by who you\'re talking to: recruiter, engineer, or hiring manager. The questions that actually show you\'ve thought about the role.',
    ctaLabel: 'Open Framework', ctaIcon: 'external',
  },
  {
    id: 11, cat: 'offers', stage: 'offers', author: 'jocelyn',
    num: '11',
    title: 'How to Compare Two Offers',
    desc: 'A weighted decision matrix template - base, bonus, equity, growth trajectory, culture signals, and location. Makes the decision visible and less emotionally driven.',
    ctaLabel: 'Open Tracker', ctaIcon: 'external',
  },
  {
    id: 12, cat: 'offers', stage: 'offers', author: 'jocelyn',
    num: '12',
    title: 'Offer Negotiation Email',
    desc: 'A copy-paste script for asking for more comp with a specific number already filled in. Professional, direct, and warm - the version that doesn\'t risk the offer.',
    ctaLabel: 'Copy Template', ctaIcon: 'copy',
  },
  {
    id: 13, cat: 'job', stage: 'job', author: 'jocelyn',
    num: '13',
    title: 'First Week Check-In Message to Manager',
    desc: 'How to set up your first 1:1, what to say in it, and how to start the relationship on the right note without being over-eager or under-prepared.',
    ctaLabel: 'Copy Template', ctaIcon: 'copy',
  },
  {
    id: 14, cat: 'job', stage: 'job', author: 'jocelyn',
    num: '14',
    title: '30-60-90 Day Plan Template',
    desc: 'A three-phase plan for your first three months - goals, key relationships to build, and deliverables at each stage. The document that turns a good first impression into a strong first year.',
    ctaLabel: 'Open Framework', ctaIcon: 'external',
  },
  {
    id: 15, cat: 'job', stage: 'job', author: 'both',
    num: '15',
    title: 'End-of-Internship Reflection Doc',
    desc: 'A self-evaluation template to fill out before your last week - documenting your impact, the relationships you built, and how to prep for the return offer conversation.',
    ctaLabel: 'Open Framework', ctaIcon: 'external',
  },
]

const STAGE_LABELS = {
  outreach: 'Outreach',
  apply: 'Apply Better',
  interview: 'Interviews',
  offers: 'Offers',
  job: 'On the Job',
}

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
    if (!request.trim()) { setFormError('Please describe the template you need.'); return }
    setFormLoading(true)
    setFormError('')
    const { error } = await supabase.from('template_requests').insert({
      request: request.trim(),
      email: reqEmail.trim() || null,
      category: reqCategory || null,
    })
    setFormLoading(false)
    if (error) { setFormError('Something went wrong. Please try again.') }
    else { setFormSubmitted(true) }
  }

  const visible = activeFilter === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.cat === activeFilter)

  return (
    <ArticleLayout title="Career Templates">
      <style>{`
        html, body { background: var(--color-cream); }

        .ct-hero {
          max-width: 1040px;
          margin: 0 auto;
          padding: 120px clamp(20px,5vw,56px) 48px;
        }
        .ct-hero__kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-muted);
          margin-bottom: 18px;
        }
        .ct-hero__title {
          font-family: var(--font-display);
          font-size: clamp(36px,6.5vw,68px);
          font-weight: 700;
          line-height: 1.06;
          color: var(--color-dark);
          margin-bottom: 10px;
        }
        .ct-hero__tagline {
          font-family: var(--font-display);
          font-size: clamp(17px,2.4vw,24px);
          font-weight: 400;
          color: var(--color-accent);
          margin-bottom: 20px;
        }
        .ct-hero__sub {
          font-size: clamp(15px,2vw,17px);
          color: var(--color-muted);
          line-height: 1.7;
          max-width: 640px;
        }
        .ct-hero__sub strong { color: var(--color-dark); font-weight: 600; }

        .ct-controls {
          max-width: 1040px;
          margin: 0 auto;
          padding: 0 clamp(20px,5vw,56px) 40px;
        }
        .ct-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .ct-filter {
          padding: 13px 20px;
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: 1.5px solid rgba(0,0,0,0.12);
          background: var(--color-white);
          color: var(--color-muted);
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .ct-filter:hover { color: var(--color-dark); border-color: rgba(0,0,0,0.25); }
        .ct-filter:focus-visible { outline: 2px solid var(--color-dark); outline-offset: 2px; }
        .ct-filter--active { background: var(--color-dark); color: var(--color-cream); border-color: var(--color-dark); }
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
          background: var(--color-white);
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 14px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s;
        }
        .ct-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 32px rgba(0,0,0,.09);
        }

        .ct-card__bar {
          height: 3px;
          border-radius: 2px;
          margin-bottom: 20px;
        }
        .ct-card__bar--outreach  { background: var(--color-teal); }
        .ct-card__bar--apply     { background: var(--color-blue); }
        .ct-card__bar--interview { background: var(--color-gold); }
        .ct-card__bar--offers    { background: var(--color-accent); }
        .ct-card__bar--job       { background: var(--color-navy); }

        .ct-card__top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .ct-card__num {
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          color: rgba(0,0,0,.2);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .ct-card__badges { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
        .ct-card__stage {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .ct-card__stage--outreach  { background: rgba(58,125,107,0.12); color: var(--color-teal); }
        .ct-card__stage--apply     { background: rgba(91,142,194,0.12); color: var(--color-blue); }
        .ct-card__stage--interview { background: rgba(232,168,56,0.15); color: var(--color-gold); }
        .ct-card__stage--offers    { background: rgba(179,69,57,0.1);   color: var(--color-accent); }
        .ct-card__stage--job       { background: rgba(91,142,194,0.15); color: var(--color-blue-light); }

        .ct-card__author {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 4px;
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
          padding: 11px 20px;
          border-radius: 8px;
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          border: 1.5px solid;
          transition: background 0.2s, color 0.2s, transform 0.18s;
          align-self: flex-start;
        }
        .ct-card__cta--outreach  { background: transparent; color: var(--color-teal);      border-color: var(--color-teal); }
        .ct-card__cta--apply     { background: transparent; color: var(--color-blue);      border-color: var(--color-blue); }
        .ct-card__cta--interview { background: transparent; color: var(--color-gold);      border-color: var(--color-gold); }
        .ct-card__cta--offers    { background: transparent; color: var(--color-accent);    border-color: var(--color-accent); }
        .ct-card__cta--job       { background: transparent; color: var(--color-blue-light); border-color: var(--color-blue-light); }
        .ct-card__cta:hover { transform: translateY(-1px); }
        .ct-card__cta--outreach:hover  { background: var(--color-teal);   color: var(--color-cream); }
        .ct-card__cta--apply:hover     { background: var(--color-blue);   color: var(--color-cream); }
        .ct-card__cta--interview:hover { background: var(--color-gold);   color: var(--color-dark); }
        .ct-card__cta--offers:hover    { background: var(--color-accent); color: var(--color-cream); }
        .ct-card__cta--job:hover       { background: var(--color-navy);   color: var(--color-cream); }

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
        <p className="ct-hero__kicker">From Campus to Career · Resource Library</p>
        <h1 className="ct-hero__title">Career Templates</h1>
        <p className="ct-hero__tagline">Copy. Edit. Send.</p>
        <p className="ct-hero__sub">
          Real scripts, trackers, and frameworks from{' '}
          <strong>two people who are actually doing this</strong> - not career coaches who haven't applied in a decade. Every template maps to a real moment in the journey from campus to career.
        </p>
      </header>

      <div className="ct-controls">
        <div className="ct-filters" role="group" aria-label="Filter by pipeline stage">
          {[
            { key: 'all', label: 'All' },
            { key: 'outreach', label: 'Outreach & Networking' },
            { key: 'apply', label: 'Applications' },
            { key: 'interview', label: 'Interviews' },
            { key: 'offers', label: 'Offers & Negotiation' },
            { key: 'job', label: 'On the Job' },
          ].map(({ key, label }) => (
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
            {s === 'outreach' ? 'Outreach & Networking' : s === 'apply' ? 'Applications' : s === 'interview' ? 'Interviews' : s === 'offers' ? 'Offers & Negotiation' : 'On the Job'}
          </div>
        ))}
      </div>

      <div className="ct-meta">
        <p className="ct-count">{visible.length === 1 ? '1 template' : `${visible.length} templates`}</p>
      </div>

      <div className="ct-grid" aria-label="Template library">
        {visible.length === 0 ? (
          <div className="ct-empty" aria-live="polite">No templates in this category yet.</div>
        ) : (
          visible.map(t => (
            <div key={t.id} className="ct-card">
              <div className={`ct-card__bar ct-card__bar--${t.stage}`}></div>
              <div className="ct-card__top">
                <span className="ct-card__num">{t.num}</span>
                <div className="ct-card__badges">
                  <span className={`ct-card__stage ct-card__stage--${t.stage}`}>{STAGE_LABELS[t.stage]}</span>
                  <span className={`ct-card__author ct-card__author--${t.author}`}>
                    {t.author === 'jose' ? 'Jose' : t.author === 'jocelyn' ? 'Jocelyn' : 'Both'}
                  </span>
                </div>
              </div>
              <h2 className="ct-card__title">{t.title}</h2>
              <p className="ct-card__desc">{t.desc}</p>
              <a href="#" className={`ct-card__cta ct-card__cta--${t.stage}`}>
                {t.ctaLabel}
                {t.ctaIcon === 'copy' ? <CopyIcon /> : <ExternalIcon />}
              </a>
            </div>
          ))
        )}
      </div>

      <section className="ct-form-wrap">
        <div className="ct-form-inner">
          <div className="ct-form-copy">
            <p className="ct-form-copy__kicker">Shape the Library</p>
            <h2 className="ct-form-copy__title">What part of the campus-to-career process feels unclear right now?</h2>
            <p className="ct-form-copy__sub">Every template on this page started with a question someone couldn't find a good answer to. Tell us where you're stuck and we'll build the tool for it.</p>
          </div>
          <div className="ct-form-box">
            {formSubmitted ? (
              <div style={{ padding: '32px 0', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(58,125,107,.1)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 14px' }}>✓</div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--color-dark)', marginBottom: 6 }}>Request submitted!</p>
                <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>Thanks — we'll build it if enough people ask for the same thing.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="ct-form-row">
                  <label className="ct-form-label" htmlFor="reqField">What template do you wish existed?</label>
                  <textarea className="ct-form-textarea" id="reqField" placeholder="e.g. A script for asking for a deadline extension on an offer…" value={request} onChange={e => setRequest(e.target.value)}></textarea>
                </div>
                <div className="ct-form-row">
                  <label className="ct-form-label" htmlFor="reqEmailField">Your email</label>
                  <input className="ct-form-input" type="email" id="reqEmailField" placeholder="you@school.edu" value={reqEmail} onChange={e => setReqEmail(e.target.value)} />
                </div>
                <div className="ct-form-row">
                  <label className="ct-form-label" htmlFor="reqCat">Pipeline stage (optional)</label>
                  <select className="ct-form-select" id="reqCat" value={reqCategory} onChange={e => setReqCategory(e.target.value)}>
                    <option value="">Select a stage…</option>
                    <option>Internship search</option>
                    <option>Networking &amp; outreach</option>
                    <option>Interview prep</option>
                    <option>Offers &amp; negotiation</option>
                    <option>First job &amp; onboarding</option>
                  </select>
                </div>
                {formError && <p role="alert" style={{ color: 'var(--color-accent)', fontSize: '13px', marginBottom: '10px' }}>{formError}</p>}
                <button className="ct-form-btn" type="submit" disabled={formLoading}>{formLoading ? 'Submitting…' : 'Submit Request'}</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="art-footer" style={{ maxWidth: '1040px' }}>
        <span className="art-footer__copy">Jose x Jocelyn &copy; 2026</span>
        <div className="art-footer__links">
          <Link to="/" className="art-footer__link">Home</Link>
          <Link to="/articles" className="art-footer__link">La Voz del Día</Link>
          <Link to="/linkedin-series" className="art-footer__link">LinkedIn Series</Link>
        </div>
      </footer>
    </ArticleLayout>
  )
}
