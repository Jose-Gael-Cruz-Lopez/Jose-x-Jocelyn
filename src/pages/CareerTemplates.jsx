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
  const [fieldErrors, setFieldErrors] = useState({ request: '', email: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleFilterClick = useCallback(e => setActiveFilter(e.currentTarget.dataset.key), [])

  const handleSubmit = async e => {
    e.preventDefault()
    const errors = { request: '', email: '' }
    if (!request.trim()) errors.request = t.formErrorRequired
    if (reqEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reqEmail.trim())) errors.email = t.formErrorEmail
    if (errors.request || errors.email) {
      setFieldErrors(errors)
      setFormError('')
      return
    }
    setFieldErrors({ request: '', email: '' })
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
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 clamp(20px,5vw,56px) 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .ct-count { font-size: 13px; color: var(--color-muted); }
        .ct-count strong { color: var(--color-dark); font-weight: 700; }

        .ct-grid {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 clamp(20px,5vw,56px) 80px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }
        @media (max-width: 960px) { .ct-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 560px) { .ct-grid { grid-template-columns: 1fr; } }
        .ct-grid > .ct-card { animation: ct-card-in .55s cubic-bezier(.16,1,.3,1) backwards; animation-delay: calc(var(--ct-i, 0) * 50ms); }
        @keyframes ct-card-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

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
          padding: 60px 24px;
          color: var(--color-muted);
          font-size: 15px;
          line-height: 1.6;
          background: rgba(232,168,56,.05);
          border: 1px dashed rgba(232,168,56,.25);
          border-radius: 16px;
        }

        .ct-legend {
          max-width: 1240px;
          margin: 0 auto 48px;
          padding: 0 clamp(20px,5vw,56px);
          display: flex;
          flex-wrap: wrap;
          gap: 10px 24px;
        }
        .ct-legend__item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--color-muted); letter-spacing: .02em; }
        .ct-legend__dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 0 2px var(--color-cream), 0 0 0 3px rgba(26,25,22,.08); }
        .ct-legend__dot--outreach  { background: var(--color-teal); }
        .ct-legend__dot--apply     { background: var(--color-blue); }
        .ct-legend__dot--interview { background: var(--color-gold); }
        .ct-legend__dot--offers    { background: var(--color-accent); }
        .ct-legend__dot--job       { background: var(--color-navy); }

        .ct-form-wrap {
          background: var(--color-navy);
          padding: clamp(56px,8vw,96px) clamp(20px,5vw,56px);
          position: relative;
          overflow: hidden;
          scroll-margin-top: 96px;
        }
        .ct-form-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 84% 76%, rgba(232,168,56,.08) 0%, transparent 50%);
          pointer-events: none;
        }
        .ct-form-inner {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0,1fr) minmax(0,1.4fr);
          gap: clamp(40px,5vw,72px);
          align-items: start;
          position: relative;
        }
        .ct-form-copy__kicker {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--color-gold);
          margin-bottom: 16px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .ct-form-copy__kicker::after {
          content: '';
          width: 24px;
          height: 1px;
          background: var(--color-gold);
          opacity: .5;
        }
        .ct-form-copy__title {
          font-family: var(--font-display);
          font-size: clamp(28px,4vw,46px);
          font-weight: 700;
          letter-spacing: -.025em;
          color: var(--color-cream);
          line-height: 1.05;
          margin-bottom: 18px;
          max-width: 18ch;
          text-wrap: balance;
        }
        .ct-form-copy__title em {
          font-style: italic;
          font-family: var(--font-serif, var(--font-display));
          color: var(--color-gold);
          font-weight: 500;
          padding-right: .04em;
        }
        .ct-form-copy__sub { font-size: 15px; color: rgba(242,228,206,.7); line-height: 1.7; max-width: 50ch; }
        .ct-form-perks { margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(242,228,206,.18); display: flex; flex-direction: column; gap: 12px; list-style: none; }
        .ct-form-perk { display: flex; align-items: flex-start; gap: 11px; font-size: 14px; color: rgba(242,228,206,.7); line-height: 1.55; }
        .ct-form-perk__icon { width: 22px; height: 22px; border-radius: 50%; background: rgba(232,168,56,.16); color: var(--color-gold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; box-shadow: inset 0 0 0 1.5px rgba(232,168,56,.3); }
        .ct-form-perk strong { color: var(--color-cream); font-weight: 700; }
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
        .ct-form-box { background: rgba(255,255,255,.04); border: 1px solid rgba(242,228,206,.12); border-radius: 14px; padding: clamp(24px,3vw,32px); }
        .ct-form-input,
        .ct-form-select,
        .ct-form-textarea {
          width: 100%;
          font-family: var(--font-body);
          font-size: 15px;
          padding: 12px 14px;
          border: 1.5px solid rgba(242,228,206,.15);
          border-radius: 10px;
          background: rgba(255,255,255,.07);
          color: var(--color-cream);
          outline: none;
          transition: border-color .2s, background .2s, box-shadow .2s;
        }
        .ct-form-input::placeholder,
        .ct-form-textarea::placeholder { color: rgba(242,228,206,.3); }
        .ct-form-input:focus,
        .ct-form-select:focus,
        .ct-form-textarea:focus { border-color: var(--color-gold); background: rgba(255,255,255,.1); box-shadow: 0 0 0 4px rgba(232,168,56,.16); }
        .ct-form-input.is-invalid, .ct-form-select.is-invalid, .ct-form-textarea.is-invalid { border-color: rgba(232,168,56,.6); }
        .ct-form-input.is-invalid:focus, .ct-form-select.is-invalid:focus, .ct-form-textarea.is-invalid:focus { border-color: var(--color-gold); box-shadow: 0 0 0 4px rgba(232,168,56,.24); }
        .ct-form-select { appearance: none; cursor: pointer; }
        .ct-form-select option { background: var(--color-navy); color: var(--color-cream); }
        .ct-form-textarea { min-height: 90px; resize: vertical; line-height: 1.55; }
        .ct-form-row__error { display: block; margin-top: 6px; font-size: 12px; font-weight: 600; color: var(--color-gold); line-height: 1.4; }
        .ct-form-row__error::before { content: ''; display: inline-block; width: 4px; height: 4px; border-radius: 50%; background: var(--color-gold); margin-right: 7px; vertical-align: .18em; }
        .ct-form-row__counter { display: block; margin-top: 6px; font-size: 11px; color: rgba(242,228,206,.5); text-align: right; font-variant-numeric: tabular-nums; letter-spacing: .02em; }
        .ct-form-row__counter--warn { color: var(--color-gold); font-weight: 600; }
        .ct-form-error-card { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; padding: 14px 16px; background: rgba(232,168,56,.08); border: 1px solid rgba(232,168,56,.3); border-left: 3px solid var(--color-gold); border-radius: 10px; }
        .ct-form-error-card__msg { flex: 1; font-size: 13px; color: var(--color-cream); line-height: 1.5; }
        .ct-form-error-card__msg strong { color: var(--color-gold); font-weight: 700; }
        .ct-form-error-card__retry { flex-shrink: 0; padding: 7px 14px; background: transparent; border: 1.5px solid var(--color-gold); color: var(--color-gold); border-radius: 999px; font-family: var(--font-display); font-size: 12px; font-weight: 700; letter-spacing: -.005em; cursor: pointer; transition: background .2s, color .2s; }
        .ct-form-error-card__retry:hover { background: var(--color-gold); color: var(--color-dark); }
        .ct-form-btn {
          margin-top: 4px;
          padding: 14px 28px;
          background: var(--color-gold);
          color: var(--color-dark);
          border: none;
          border-radius: 999px;
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -.005em;
          cursor: pointer;
          box-shadow: 0 8px 20px -10px rgba(232,168,56,.4);
          transition: background .25s, transform .22s cubic-bezier(.16,1,.3,1), box-shadow .25s;
        }
        .ct-form-btn:hover { background: var(--color-cream); transform: translateY(-2px); box-shadow: 0 14px 24px -12px rgba(232,228,206,.5); }
        .ct-form-btn:active { transform: translateY(0); }
        .ct-form-btn:disabled { opacity: .55; cursor: not-allowed; transform: none; box-shadow: none; }
        .ct-form-success { padding: 32px 0; text-align: center; }
        .ct-form-success__icon { width: 52px; height: 52px; border-radius: 50%; background: rgba(232,168,56,.14); color: var(--color-gold); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: inset 0 0 0 1.5px rgba(232,168,56,.3); }
        .ct-form-success__title { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--color-cream); margin-bottom: 6px; letter-spacing: -.01em; }
        .ct-form-success__body { font-size: 14px; color: rgba(242,228,206,.7); line-height: 1.6; }

        @media (max-width: 860px) {
          .ct-form-inner { grid-template-columns: 1fr; gap: 36px; }
        }
        @media (max-width: 768px) {
          .ct-hero { padding: 88px 20px 48px; }
        }
        @media (max-width: 480px) {
          .ct-hero { padding: 80px 16px 40px; }
          .ct-filters { overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap; padding-bottom: 4px; }
          .ct-filter { flex-shrink: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ct-card, .ct-filter, .ct-form-btn, .ct-form-input, .ct-form-select, .ct-form-textarea,
          .ct-form-error-card__retry, .ct-card__cta { transition: none !important; }
          .ct-card:hover, .ct-filter:hover, .ct-form-btn:hover, .ct-card__cta:hover,
          .ct-form-error-card__retry:hover { transform: none !important; }
          .ct-grid > .ct-card { animation: none !important; }
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
              aria-pressed={activeFilter === key}
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
          visible.map((tmpl, idx) => (
            <div key={tmpl.id} className={`ct-card ct-card--${tmpl.stage}`} style={{ '--ct-i': idx % 12 }}>
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

      <section className="ct-form-wrap" id="suggest">
        <div className="ct-form-inner">
          <div className="ct-form-copy">
            <p className="ct-form-copy__kicker">{t.formKicker}</p>
            <h2 className="ct-form-copy__title">{t.formTitle}</h2>
            <p className="ct-form-copy__sub">{t.formSub}</p>
            <ul className="ct-form-perks">
              {(t.formPerks || []).map((perk, i) => (
                <li key={i} className="ct-form-perk">
                  <span className="ct-form-perk__icon" aria-hidden="true">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.8l2.4 2.4L9 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span><strong>{perk.strong}</strong>{perk.rest}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ct-form-box">
            {formSubmitted ? (
              <div className="ct-form-success">
                <div className="ct-form-success__icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 11.5l4 4L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="ct-form-success__title">{t.formSuccessTitle}</p>
                <p className="ct-form-success__body">{t.formSuccessBody}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="ct-form-row">
                  <label className="ct-form-label" htmlFor="reqField">{t.formLabelRequest}</label>
                  <textarea
                    className={`ct-form-textarea${fieldErrors.request ? ' is-invalid' : ''}`}
                    id="reqField"
                    placeholder={t.formPlaceholderRequest}
                    value={request}
                    maxLength={10000}
                    onChange={e => { setRequest(e.target.value); if (fieldErrors.request) setFieldErrors(s => ({ ...s, request: '' })) }}
                    aria-invalid={!!fieldErrors.request}
                    aria-describedby={fieldErrors.request ? 'reqField-error' : (request.length >= 500 ? 'reqField-counter' : undefined)}
                  />
                  {fieldErrors.request && <span id="reqField-error" className="ct-form-row__error" role="alert">{fieldErrors.request}</span>}
                  {request.length >= 500 && (
                    <span id="reqField-counter" className={`ct-form-row__counter${request.length >= 9000 ? ' ct-form-row__counter--warn' : ''}`} aria-live="polite">
                      {request.length >= 9000 ? `${request.length} / 10000` : `${request.length} chars`}
                    </span>
                  )}
                </div>
                <div className="ct-form-row">
                  <label className="ct-form-label" htmlFor="reqEmailField">{t.formLabelEmail}</label>
                  <input
                    className={`ct-form-input${fieldErrors.email ? ' is-invalid' : ''}`}
                    type="email"
                    id="reqEmailField"
                    placeholder={t.formPlaceholderEmail}
                    value={reqEmail}
                    onChange={e => { setReqEmail(e.target.value); if (fieldErrors.email) setFieldErrors(s => ({ ...s, email: '' })) }}
                    onBlur={e => {
                      const v = e.target.value.trim()
                      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
                        setFieldErrors(s => ({ ...s, email: t.formErrorEmail }))
                      }
                    }}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? 'reqEmailField-error' : undefined}
                  />
                  {fieldErrors.email && <span id="reqEmailField-error" className="ct-form-row__error" role="alert">{fieldErrors.email}</span>}
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
                {formError && (
                  <div role="alert" className="ct-form-error-card">
                    <span className="ct-form-error-card__msg"><strong>{t.formErrorLabel}</strong> {formError}</span>
                    <button type="submit" className="ct-form-error-card__retry" disabled={formLoading}>{formLoading ? t.formBtnSubmitting : t.formRetryLabel}</button>
                  </div>
                )}
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
