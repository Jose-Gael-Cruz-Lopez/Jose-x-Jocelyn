import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ArticleLayout from '../components/ArticleLayout'
import { supabase } from '../lib/supabase'
import { useT } from '../hooks/useT'

function ExtIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  )
}

export default function BridgeYear() {
  const t = useT('bridgeYear')

  const [roleFilter, setRoleFilter] = useState('all')
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({ program: '', company: '', link: '', why: '', email: '' })

  const visibleRoles = roleFilter === 'all'
    ? t.roleCards
    : t.roleCards.filter(c => c.rtags.includes(roleFilter))

  const handleRoleFilter = useCallback(e => setRoleFilter(e.currentTarget.dataset.key), [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.program || !form.company) {
      setFormError(t.formErrorRequired)
      return
    }
    setFormLoading(true)
    setFormError('')
    const { error } = await supabase.from('bridge_year_suggestions').insert({
      program_name: form.program,
      company: form.company,
      link: form.link || null,
      why: form.why || null,
      email: form.email || null,
    })
    setFormLoading(false)
    if (error) {
      setFormError(t.formErrorGeneric)
    } else {
      setFormSubmitted(true)
    }
  }

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <ArticleLayout title="Bridge Year Hub">
      <style>{`
        html, body { background: var(--color-cream); }
        :root { --by-shadow-warm: 58, 38, 22; }

        .by-wrap {
          max-width: 1040px;
          margin: 0 auto;
          padding-left:  clamp(20px,5vw,56px);
          padding-right: clamp(20px,5vw,56px);
        }
        .by-kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--color-muted);
          margin-bottom: 14px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .by-kicker::after {
          content: '';
          width: 24px;
          height: 1px;
          background: currentColor;
          opacity: .5;
        }
        .by-section-title {
          font-family: var(--font-display);
          font-size: clamp(26px,4vw,40px);
          font-weight: 700;
          color: var(--color-dark);
          line-height: 1.15;
          margin-bottom: 10px;
        }
        .by-section-sub {
          font-family: var(--font-display);
          font-size: clamp(16px,2vw,20px);
          font-weight: 400;
          color: var(--color-accent);
          margin-bottom: 20px;
        }
        .by-section-body {
          font-size: clamp(15px,1.8vw,17px);
          color: var(--color-muted);
          line-height: 1.75;
          max-width: 700px;
        }
        .by-section-body strong { color: var(--color-dark); font-weight: 600; }
        .by-divider {
          border: none;
          border-top: 1px solid rgba(0,0,0,.08);
          margin: 0;
        }

        /* HERO */
        .by-hero {
          padding: 120px clamp(20px,5vw,56px) 64px;
          max-width: 1040px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }
        .by-hero::before {
          content: '';
          position: absolute;
          top: 96px;
          left: clamp(20px,5vw,56px);
          width: 56px;
          height: 4px;
          background: var(--color-accent);
          border-radius: 2px;
          z-index: 1;
        }
        .by-hero::after {
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
        .by-hero > * { position: relative; z-index: 1; }
        .by-hero__kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin-bottom: 18px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .by-hero__kicker::after {
          content: '';
          width: 24px;
          height: 1px;
          background: currentColor;
          opacity: .5;
        }
        .by-hero__title {
          font-family: var(--font-display);
          font-size: clamp(42px,7vw,80px);
          font-weight: 700;
          line-height: 1.04;
          color: var(--color-dark);
          margin-bottom: 14px;
        }
        .by-hero__title em {
          font-style: italic;
          font-family: var(--font-serif, var(--font-display));
          color: var(--color-gold-dark);
          font-weight: 500;
          padding-right: .04em;
        }
        .by-hero__tagline {
          font-family: var(--font-serif, var(--font-display));
          font-size: clamp(18px,2.2vw,24px);
          font-style: italic;
          font-weight: 400;
          color: var(--color-accent);
          margin-bottom: 22px;
          letter-spacing: -.005em;
          max-width: 60ch;
        }
        .by-hero__sub {
          font-family: var(--font-display);
          font-size: clamp(18px,2.5vw,26px);
          font-weight: 400;
          color: var(--color-dark);
          line-height: 1.4;
          max-width: 680px;
          margin-bottom: 28px;
        }
        .by-hero__body {
          font-size: clamp(15px,1.8vw,17px);
          color: var(--color-muted);
          line-height: 1.8;
          max-width: 680px;
          margin-bottom: 40px;
        }
        .by-hero__body strong { color: var(--color-dark); font-weight: 600; }
        .by-jumps { display: flex; flex-direction: column; gap: 10px; }
        .by-jump {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          color: var(--color-dark);
          text-decoration: none;
          transition: color .2s, gap .2s;
        }
        .by-jump::before {
          content: '→';
          color: var(--color-accent);
          font-weight: 700;
          transition: transform .2s cubic-bezier(.16,1,.3,1);
        }
        .by-jump:hover { color: var(--color-accent); }
        .by-jump:hover::before { transform: translateX(4px); }

        /* IS THIS FOR YOU */
        .by-for {
          padding: 72px clamp(20px,5vw,56px);
          max-width: 1040px;
          margin: 0 auto;
        }
        .by-for__card {
          background: var(--color-navy);
          border-radius: 16px;
          padding: clamp(32px,4vw,52px);
          max-width: 720px;
        }
        .by-for__kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--color-gold);
          margin-bottom: 14px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .by-for__kicker::after {
          content: '';
          width: 24px;
          height: 1px;
          background: currentColor;
          opacity: .5;
        }
        .by-for__title {
          font-family: var(--font-display);
          font-size: clamp(22px,3vw,30px);
          font-weight: 700;
          color: var(--color-cream);
          margin-bottom: 18px;
        }
        .by-for__body {
          font-size: clamp(14px,1.7vw,16px);
          color: rgba(242,228,206,.72);
          line-height: 1.8;
        }
        .by-for__body strong { color: var(--color-cream); font-weight: 600; }

        /* APPRENTICESHIPS */
        .by-apprentice {
          padding: 80px clamp(20px,5vw,56px);
          max-width: 1040px;
          margin: 0 auto;
        }
        .by-apprentice__head { margin-bottom: 40px; }
        .by-apprentice__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .by-apprentice__grid > .by-prog,
        .by-tools__grid > .by-tool-card {
          animation: by-card-in .55s cubic-bezier(.16,1,.3,1) backwards;
          animation-delay: calc(var(--by-i, 0) * 50ms);
        }
        @keyframes by-card-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .by-apprentice__grid > .by-prog,
          .by-tools__grid > .by-tool-card { animation: none !important; }
        }
        .by-prog {
          background: linear-gradient(180deg, rgba(179,69,57,.06) 0%, rgba(255,250,242,.55) 60%);
          border: 1.5px solid rgba(179,69,57,.22);
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 0 rgba(255,255,255,.5) inset, 0 4px 12px -6px rgba(var(--by-shadow-warm),.12);
          transition: transform .22s cubic-bezier(.16,1,.3,1), box-shadow .22s, border-color .22s;
        }
        .by-prog:hover {
          transform: translateY(-3px);
          border-color: rgba(179,69,57,.35);
          box-shadow: 0 14px 32px -10px rgba(var(--by-shadow-warm),.18);
        }
        .by-prog--featured {
          grid-column: 1 / -1;
          background: var(--color-accent);
          border-color: var(--color-accent);
          position: relative;
        }
        .by-prog--featured::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 28px;
          width: 36px;
          height: 6px;
          background: var(--color-gold);
          border-radius: 0 0 4px 4px;
          box-shadow: 0 1px 2px rgba(232,168,56,.4);
        }
        .by-prog--featured .by-prog__company { color: rgba(242,228,206,.7); }
        .by-prog--featured .by-prog__name { color: var(--color-cream); }
        .by-prog--featured .by-prog__pill { background: rgba(242,228,206,.14); color: var(--color-cream); }
        .by-prog--featured .by-prog__pill--urgent { background: rgba(232,168,56,.22); color: var(--color-gold); }
        .by-prog--featured .by-prog__pill--pay { background: rgba(58,125,107,.28); color: var(--color-cream); }
        .by-prog--featured .by-prog__note {
          background: rgba(255,255,255,.06);
          border-color: rgba(232,168,56,.35);
        }
        .by-prog--featured .by-prog__note-label { color: var(--color-gold); }
        .by-prog--featured .by-prog__note-text { color: rgba(242,228,206,.85); }
        .by-prog--featured .by-prog__cta {
          background: var(--color-cream);
          color: var(--color-dark);
        }
        .by-prog--featured .by-prog__cta:hover { background: var(--color-gold); color: var(--color-dark); }
        .by-prog--featured-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--color-gold);
          margin-bottom: 8px;
        }
        .by-prog__inner { padding: 24px 24px 20px; flex: 1; display: flex; flex-direction: column; }
        .by-prog__company {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--color-muted);
          margin-bottom: 6px;
        }
        .by-prog__name {
          font-family: var(--font-display);
          font-size: clamp(16px,1.9vw,20px);
          font-weight: 600;
          color: var(--color-dark);
          line-height: 1.3;
          margin-bottom: 16px;
        }
        .by-prog__meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
        .by-prog__pill {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(0,0,0,.05);
          color: var(--color-muted);
        }
        .by-prog__pill--urgent { background: rgba(179,69,57,.08); color: var(--color-accent); }
        .by-prog__pill--pay    { background: rgba(58,125,107,.1);  color: var(--color-teal); }
        .by-prog__note {
          background: rgba(232,168,56,.07);
          border: 1px solid rgba(232,168,56,.22);
          border-radius: 8px;
          padding: 12px 14px;
          margin-bottom: 20px;
          flex: 1;
        }
        .by-prog__note-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--color-gold);
          margin-bottom: 5px;
        }
        .by-prog__note-text { font-size: 13px; color: var(--color-muted); line-height: 1.6; }
        .by-prog__cta {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 13px 20px;
          border-radius: 8px;
          background: var(--color-dark);
          color: var(--color-cream);
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background .2s, transform .18s;
          align-self: flex-start;
        }
        .by-prog__cta:hover { background: var(--color-accent); transform: translateY(-1px); }
        .by-apprentice__note {
          margin-top: 32px;
          padding: 0 0 0 18px;
          border-left: none;
          font-family: var(--font-serif, var(--font-body));
          font-style: italic;
          font-size: 15px;
          color: var(--color-muted);
          line-height: 1.7;
          max-width: 640px;
        }
        .by-apprentice__note strong { color: var(--color-dark); font-weight: 600; font-style: normal; }

        /* NEW GRAD ROLES */
        .by-roles {
          padding: 80px clamp(20px,5vw,56px);
          max-width: 1040px;
          margin: 0 auto;
        }
        .by-roles__head { margin-bottom: 28px; }
        .by-roles__filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
        .by-roles__filter {
          padding: 13px 16px;
          border-radius: 999px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 1.5px solid rgba(26,25,22,.12);
          background: rgba(255,250,242,.6);
          color: var(--color-muted);
          transition: background .2s, color .2s, border-color .2s;
        }
        .by-roles__filter:hover { color: var(--color-dark); border-color: rgba(0,0,0,.22); }
        .by-roles__filter:focus-visible { outline: 2px solid var(--color-teal); outline-offset: 2px; }
        .by-roles__filter--active { background: var(--color-teal); color: var(--color-cream); border-color: var(--color-teal); }
        .by-roles__list { display: flex; flex-direction: column; gap: 14px; }
        .by-role-card {
          background: transparent;
          border: 1px solid rgba(26,25,22,.1);
          border-radius: 12px;
          padding: 22px 24px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s, border-color .2s;
        }
        .by-role-card:hover {
          transform: translateX(4px);
          border-color: rgba(58,125,107,.4);
          box-shadow: 4px 4px 18px -6px rgba(var(--by-shadow-warm),.14);
        }
        .by-role-card__left { flex: 1; min-width: 0; }
        .by-role-card__tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
        .by-role-card__tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 4px;
          background: rgba(58,125,107,.1);
          color: var(--color-teal);
        }
        .by-role-card__tag--remote { background: rgba(91,142,194,.12);  color: var(--color-blue); }
        .by-role-card__tag--rota   { background: rgba(91,142,194,.12);  color: var(--color-blue-light); }
        .by-role-card__tag--data   { background: rgba(232,168,56,.15);  color: var(--color-gold); }
        .by-role-card__title {
          font-family: var(--font-display);
          font-size: clamp(15px,1.8vw,18px);
          font-weight: 600;
          color: var(--color-dark);
          margin-bottom: 4px;
        }
        .by-role-card__company { font-size: 13px; color: var(--color-muted); margin-bottom: 8px; }
        .by-role-card__why { font-size: 13px; color: var(--color-muted); line-height: 1.55; }
        .by-role-card__why strong { color: var(--color-dark); font-weight: 600; }
        .by-role-card__cta {
          flex-shrink: 0;
          padding: 13px 18px;
          border-radius: 8px;
          background: transparent;
          border: 1.5px solid var(--color-teal);
          color: var(--color-teal);
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: background .2s, color .2s;
          white-space: nowrap;
        }
        .by-role-card__cta:hover { background: var(--color-teal); color: var(--color-cream); }

        /* SPRINT PATH */
        .by-sprint {
          background: var(--color-navy);
          padding: clamp(64px,8vw,100px) clamp(20px,5vw,56px);
        }
        .by-sprint__inner { max-width: 1040px; margin: 0 auto; }
        .by-sprint__kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--color-gold);
          margin-bottom: 14px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .by-sprint__kicker::after {
          content: '';
          width: 24px;
          height: 1px;
          background: currentColor;
          opacity: .5;
        }
        .by-sprint__title {
          font-family: var(--font-display);
          font-size: clamp(28px,4.5vw,48px);
          font-weight: 700;
          color: var(--color-cream);
          margin-bottom: 10px;
        }
        .by-sprint__sub {
          font-family: var(--font-display);
          font-size: clamp(16px,2vw,20px);
          font-weight: 400;
          color: rgba(232,168,56,.9);
          margin-bottom: 22px;
        }
        .by-sprint__intro {
          font-size: clamp(15px,1.8vw,17px);
          color: rgba(242,228,206,.65);
          line-height: 1.8;
          max-width: 680px;
          margin-bottom: 56px;
        }
        .by-sprint__intro strong { color: var(--color-cream); font-weight: 600; }
        .by-sprint__intro em { font-style: italic; color: rgba(242,228,206,.8); }
        .by-sprint__steps { display: flex; flex-direction: column; gap: 0; }
        .by-step {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 0 24px;
          padding: 32px 0;
          border-bottom: 1px solid rgba(242,228,206,.08);
        }
        .by-step:last-child { border-bottom: none; }
        .by-step__num {
          font-family: var(--font-display);
          font-size: clamp(36px,5vw,56px);
          font-weight: 700;
          color: rgba(242,228,206,.12);
          line-height: 1;
          padding-top: 4px;
          text-align: right;
        }
        .by-step__title {
          font-family: var(--font-display);
          font-size: clamp(17px,2.2vw,22px);
          font-weight: 600;
          color: var(--color-cream);
          margin-bottom: 10px;
        }
        .by-step__body {
          font-size: clamp(14px,1.7vw,16px);
          color: rgba(242,228,206,.62);
          line-height: 1.8;
          margin-bottom: 14px;
        }
        .by-step__body strong { color: var(--color-cream); font-weight: 600; }
        .by-step__tool {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-gold);
          text-decoration: none;
          transition: color .2s;
        }
        .by-step__tool::before { content: '↗'; font-size: 11px; }
        .by-step__tool:hover { color: var(--color-cream); }

        /* TOOLS */
        .by-tools {
          padding: 80px clamp(20px,5vw,56px);
          max-width: 1040px;
          margin: 0 auto;
        }
        .by-tools__head { margin-bottom: 36px; }
        .by-tools__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px,1fr));
          gap: 16px;
        }
        .by-tool-card {
          background: linear-gradient(180deg, rgba(58,125,107,.06) 0%, rgba(255,250,242,.4) 60%);
          border: 1.5px solid rgba(58,125,107,.3);
          border-radius: 12px;
          padding: 22px 22px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 1px 0 rgba(255,255,255,.5) inset, 0 4px 12px -6px rgba(var(--by-shadow-warm),.1);
          transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s, border-color .2s, background .2s;
        }
        .by-tool-card:hover {
          transform: translateY(-2px);
          border-color: var(--color-teal);
          background: rgba(58,125,107,.04);
          box-shadow: 0 10px 24px -8px rgba(var(--by-shadow-warm),.18);
        }
        .by-tool-card__name {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 600;
          color: var(--color-dark);
          line-height: 1.3;
        }
        .by-tool-card__desc { font-size: 13px; color: var(--color-muted); line-height: 1.6; flex: 1; }
        .by-tool-card__link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 700;
          color: var(--color-teal);
          text-decoration: none;
          transition: color .2s;
        }
        .by-tool-card__link:hover { color: var(--color-dark); }

        /* FOLLOW */
        .by-follow {
          padding: 80px clamp(20px,5vw,56px);
          max-width: 1040px;
          margin: 0 auto;
        }
        .by-follow__inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .by-follow-card {
          border: none;
          border-radius: 14px;
          padding: 32px 28px;
          color: var(--color-cream);
        }
        .by-follow-card--jose    { background: var(--color-teal); }
        .by-follow-card--jocelyn { background: var(--color-accent); }
        .by-follow-card__label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: rgba(242,228,206,.72);
          display: inline-block;
          margin-bottom: 14px;
        }
        .by-follow-card__name {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: var(--color-cream);
          margin-bottom: 10px;
          letter-spacing: -.005em;
        }
        .by-follow-card__desc { font-size: 14px; color: rgba(242,228,206,.78); line-height: 1.7; margin-bottom: 22px; }
        .by-follow-card__cta {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 20px;
          border-radius: 8px;
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          background: var(--color-cream);
          color: var(--color-dark);
          transition: transform .18s, background .2s, color .2s;
        }
        .by-follow-card__cta:hover { transform: translateY(-1px); background: var(--color-gold); color: var(--color-dark); }

        /* SUGGEST FORM — full-bleed teal section (CT pattern) */
        .by-suggest {
          background: var(--color-teal);
          padding: clamp(56px,8vw,96px) clamp(20px,5vw,56px);
          margin: 0;
          max-width: none;
          position: relative;
          overflow: hidden;
          scroll-margin-top: 96px;
        }
        .by-suggest::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 84% 76%, rgba(232,168,56,.12) 0%, transparent 50%);
          pointer-events: none;
        }
        .by-suggest__inner {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0,1fr) minmax(0,1.4fr);
          gap: clamp(40px,5vw,72px);
          align-items: start;
          position: relative;
        }
        @media (max-width: 860px) {
          .by-suggest__inner { grid-template-columns: 1fr; gap: 36px; }
        }
        .by-suggest__copy { max-width: 460px; }
        .by-suggest__box {
          background: rgba(255,250,242,.7);
          border: 1px solid rgba(26,25,22,.13);
          border-radius: 16px;
          padding: clamp(32px,4vw,52px);
          box-shadow: 0 1px 0 rgba(255,255,255,.5) inset, 0 18px 40px -22px rgba(var(--by-shadow-warm),.18);
        }
        .by-suggest__kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--color-gold);
          margin-bottom: 14px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .by-suggest__kicker::after {
          content: '';
          width: 24px;
          height: 1px;
          background: currentColor;
          opacity: .5;
        }
        .by-suggest__title {
          font-family: var(--font-display);
          font-size: clamp(28px,4vw,46px);
          font-weight: 700;
          color: var(--color-cream);
          line-height: 1.05;
          letter-spacing: -.025em;
          text-wrap: balance;
          margin-bottom: 16px;
          max-width: 18ch;
        }
        .by-suggest__title em {
          font-style: italic;
          font-family: var(--font-serif, var(--font-display));
          color: var(--color-gold);
          font-weight: 500;
          padding-right: .04em;
        }
        .by-suggest__sub { font-size: 15px; color: rgba(242,228,206,.7); line-height: 1.7; margin-bottom: 0; max-width: 50ch; }
        .by-suggest__row { margin-bottom: 16px; }
        .by-suggest__label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: var(--color-muted);
          margin-bottom: 6px;
        }
        .by-suggest__input,
        .by-suggest__textarea {
          width: 100%;
          font-family: var(--font-body);
          font-size: 15px;
          padding: 12px 14px;
          border: 1.5px solid rgba(0,0,0,.12);
          border-radius: 8px;
          background: var(--color-white);
          color: var(--color-dark);
          outline: none;
          transition: border-color .2s;
          box-sizing: border-box;
        }
        .by-suggest__textarea { min-height: 80px; resize: vertical; line-height: 1.55; }
        .by-suggest__input:focus,
        .by-suggest__textarea:focus { border-color: var(--color-gold); }
        .by-suggest__btn {
          margin-top: 6px;
          padding: 13px 28px;
          background: var(--color-dark);
          color: var(--color-cream);
          border: none;
          border-radius: 8px;
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background .2s, transform .18s;
        }
        .by-suggest__btn:hover { background: var(--color-accent); transform: translateY(-1px); }
        .by-jump:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; border-radius: 3px; }
        .by-prog__cta:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px; }
        .by-role-card__cta:focus-visible { outline: 2px solid var(--color-teal); outline-offset: 2px; }
        .by-step__tool:focus-visible { outline: 2px solid var(--color-teal); outline-offset: 2px; border-radius: 3px; }
        .by-follow-card__cta:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 3px; }
        .by-suggest__btn:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px; }
        .by-suggest__success {
          text-align: center;
          padding: 32px 0;
        }
        .by-suggest__success h3 {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: var(--color-dark);
          margin-bottom: 8px;
        }
        .by-suggest__success p { font-size: 15px; color: var(--color-muted); line-height: 1.7; }

        @media (max-width: 768px) {
          .by-follow__inner { grid-template-columns: 1fr; }
          .by-apprentice__grid { grid-template-columns: 1fr; }
          .by-tools__grid { grid-template-columns: 1fr; }
          .by-hero { padding: 88px 20px 48px; }
          .by-apprentice, .by-roles, .by-tools, .by-follow, .by-suggest { padding-top: 48px; padding-bottom: 48px; }
        }
        @media (max-width: 560px) {
          .by-step { grid-template-columns: 48px 1fr; gap: 0 16px; }
          .by-role-card { flex-direction: column; }
          .by-role-card__cta { align-self: flex-start; }
        }
        @media (max-width: 480px) {
          .by-hero { padding: 80px 16px 40px; }
        }
      `}</style>

      {/* HERO */}
      <header className="by-hero" id="top">
        <p className="by-hero__kicker">{t.heroKicker}</p>
        <h1 className="by-hero__title">{t.heroTitle} <em>{t.heroTitleEm}</em></h1>
        {t.heroTagline && <p className="by-hero__tagline">{t.heroTagline}</p>}
        <p className="by-hero__sub">{t.heroSub}</p>
        <p className="by-hero__body" dangerouslySetInnerHTML={{ __html: t.heroBody }} />
        <nav className="by-jumps" aria-label={t.heroJumpsAriaLabel}>
          <a href="#apprenticeships" className="by-jump">{t.heroJump1}</a>
          <a href="#roles" className="by-jump">{t.heroJump2}</a>
          <a href="#sprint" className="by-jump">{t.heroJump3}</a>
        </nav>
      </header>

      <hr className="by-divider" />

      {/* IS THIS FOR YOU */}
      <section className="by-for">
        <div className="by-for__card">
          <p className="by-for__kicker">{t.forKicker}</p>
          <h2 className="by-for__title">{t.forTitle}</h2>
          <p className="by-for__body" dangerouslySetInnerHTML={{ __html: t.forBody }} />
        </div>
      </section>

      <hr className="by-divider" />

      {/* APPRENTICESHIPS */}
      <section className="by-apprentice" id="apprenticeships">
        <div className="by-apprentice__head">
          <p className="by-kicker">{t.apprenticeKicker}</p>
          <h2 className="by-section-title">{t.apprenticeTitle}</h2>
          <p className="by-section-sub">{t.apprenticeSub}</p>
          <p className="by-section-body">{t.apprenticeBody}</p>
        </div>

        <div className="by-apprentice__grid">
          {t.programs.map((prog, idx) => (
            <div className={`by-prog${idx === 0 ? ' by-prog--featured' : ''}`} key={prog.name} style={{ '--by-i': idx }}>
              <div className="by-prog__inner">
                {idx === 0 && <span className="by-prog--featured-tag">{t.featuredLabel ?? 'Start here'}</span>}
                <p className="by-prog__company">{prog.company}</p>
                <h3 className="by-prog__name">{prog.name}</h3>
                <div className="by-prog__meta">
                  {prog.pills.map(pill => (
                    <span key={pill.label} className={`by-prog__pill${pill.type ? ` by-prog__pill--${pill.type}` : ''}`}>{pill.label}</span>
                  ))}
                </div>
                <div className="by-prog__note">
                  <p className="by-prog__note-label">{t.apprenticeNoteLabel}</p>
                  <p className="by-prog__note-text">{prog.note}</p>
                </div>
                <a href={prog.href} target="_blank" rel="noopener noreferrer" className="by-prog__cta">
                  {prog.ctaLabel}
                  <ExtIcon />
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="by-apprentice__note" dangerouslySetInnerHTML={{ __html: t.apprenticeFootnote }} />
      </section>

      <hr className="by-divider" />

      {/* NEW GRAD ROLES */}
      <section className="by-roles" id="roles">
        <div className="by-roles__head">
          <p className="by-kicker">{t.rolesKicker}</p>
          <h2 className="by-section-title">{t.rolesTitle}</h2>
          <p className="by-section-sub">{t.rolesSub}</p>
          <p className="by-section-body">{t.rolesBody}</p>
        </div>

        <div className="by-roles__filters" role="group" aria-label={t.rolesFiltersAriaLabel}>
          {t.roleFilters.map(f => (
            <button
              key={f.key}
              data-key={f.key}
              className={`by-roles__filter${roleFilter === f.key ? ' by-roles__filter--active' : ''}`}
              onClick={handleRoleFilter}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="by-roles__list">
          {visibleRoles.map(card => (
            <div className="by-role-card" key={card.title}>
              <div className="by-role-card__left">
                <div className="by-role-card__tags">
                  {card.tags.map(tag => (
                    <span key={tag.label} className={`by-role-card__tag${tag.type ? ` by-role-card__tag--${tag.type}` : ''}`}>{tag.label}</span>
                  ))}
                </div>
                <h3 className="by-role-card__title">{card.title}</h3>
                <p className="by-role-card__company">{card.company}</p>
                <p className="by-role-card__why" dangerouslySetInnerHTML={{ __html: card.why }} />
              </div>
              <a href={card.href} target="_blank" rel="noopener noreferrer" className="by-role-card__cta">{card.ctaLabel}</a>
            </div>
          ))}
        </div>
      </section>

      {/* SPRINT PATH */}
      <section className="by-sprint" id="sprint">
        <div className="by-sprint__inner">
          <p className="by-sprint__kicker">{t.sprintKicker}</p>
          <h2 className="by-sprint__title">{t.sprintTitle}</h2>
          <p className="by-sprint__sub">{t.sprintSub}</p>
          <p className="by-sprint__intro" dangerouslySetInnerHTML={{ __html: t.sprintIntro }} />

          <div className="by-sprint__steps">
            {t.sprintSteps.map(step => (
              <div className="by-step" key={step.num}>
                <div className="by-step__num">{step.num}</div>
                <div className="by-step__content">
                  <h3 className="by-step__title">{step.title}</h3>
                  <p className="by-step__body" dangerouslySetInnerHTML={{ __html: step.body }} />
                  {step.anchor ? (
                    <a href={step.toolLink} className="by-step__tool">{step.toolLabel}</a>
                  ) : (
                    <Link to={step.toolLink} className="by-step__tool">{step.toolLabel}</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="by-tools" id="tools">
        <div className="by-tools__head">
          <p className="by-kicker">{t.toolsKicker}</p>
          <h2 className="by-section-title">{t.toolsTitle}</h2>
          <p className="by-section-sub">{t.toolsSub}</p>
        </div>
        <div className="by-tools__grid">
          {t.tools.map((tool, idx) => (
            <div className="by-tool-card" key={tool.name} style={{ '--by-i': idx }}>
              <h3 className="by-tool-card__name">{tool.name}</h3>
              <p className="by-tool-card__desc">{tool.desc}</p>
              <Link to="/career-templates" className="by-tool-card__link">{tool.linkLabel}</Link>
            </div>
          ))}
        </div>
      </section>

      <hr className="by-divider" />

      {/* FOLLOW */}
      <section className="by-follow">
        <p className="by-kicker">{t.followKicker}</p>
        <h2 className="by-section-title" style={{ marginBottom: '8px' }}>{t.followTitle}</h2>
        <p className="by-section-body" style={{ marginBottom: '36px' }}>{t.followBody}</p>
        <div className="by-follow__inner">
          <div className="by-follow-card by-follow-card--jose">
            <span className="by-follow-card__label">{t.joseCardLabel}</span>
            <h3 className="by-follow-card__name">{t.joseCardName}</h3>
            <p className="by-follow-card__desc">{t.joseCardDesc}</p>
            <a href="https://www.linkedin.com/in/cjxsez/" target="_blank" rel="noopener noreferrer" className="by-follow-card__cta">
              {t.joseCardCta}
            </a>
          </div>
          <div className="by-follow-card by-follow-card--jocelyn">
            <span className="by-follow-card__label">{t.jocelynCardLabel}</span>
            <h3 className="by-follow-card__name">{t.jocelynCardName}</h3>
            <p className="by-follow-card__desc">{t.jocelynCardDesc}</p>
            <a href="https://www.linkedin.com/in/jocelyn-vazquez/" target="_blank" rel="noopener noreferrer" className="by-follow-card__cta">
              {t.jocelynCardCta}
            </a>
          </div>
        </div>
      </section>

      <hr className="by-divider" />

      {/* SUGGEST FORM */}
      <section className="by-suggest" id="suggest">
        <div className="by-suggest__inner">
          <div className="by-suggest__copy">
            <p className="by-suggest__kicker">{t.suggestKicker}</p>
            <h2 className="by-suggest__title">{t.suggestTitle}</h2>
            <p className="by-suggest__sub">{t.suggestSub}</p>
          </div>
          <div className="by-suggest__box">
          {formSubmitted ? (
            <div className="by-suggest__success">
              <h3>{t.formSuccessTitle}</h3>
              <p>{t.formSuccessBody}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="by-suggest__row">
                <label className="by-suggest__label" htmlFor="sgProgram">{t.formLabelProgram}</label>
                <input className="by-suggest__input" type="text" id="sgProgram" placeholder={t.formPlaceholderProgram} value={form.program} onChange={e => setField('program', e.target.value)} />
              </div>
              <div className="by-suggest__row">
                <label className="by-suggest__label" htmlFor="sgCompany">{t.formLabelCompany}</label>
                <input className="by-suggest__input" type="text" id="sgCompany" placeholder={t.formPlaceholderCompany} value={form.company} onChange={e => setField('company', e.target.value)} />
              </div>
              <div className="by-suggest__row">
                <label className="by-suggest__label" htmlFor="sgLink">{t.formLabelLink}</label>
                <input className="by-suggest__input" type="url" id="sgLink" placeholder="https://…" value={form.link} onChange={e => setField('link', e.target.value)} />
              </div>
              <div className="by-suggest__row">
                <label className="by-suggest__label" htmlFor="sgWhy">{t.formLabelWhy}</label>
                <textarea className="by-suggest__textarea" id="sgWhy" placeholder={t.formPlaceholderWhy} value={form.why} onChange={e => setField('why', e.target.value)} />
              </div>
              <div className="by-suggest__row">
                <label className="by-suggest__label" htmlFor="sgEmail">{t.formLabelEmail}</label>
                <input className="by-suggest__input" type="email" id="sgEmail" placeholder={t.formPlaceholderEmail} value={form.email} onChange={e => setField('email', e.target.value)} />
              </div>
              {formError && <p role="alert" style={{ color: 'var(--color-accent)', fontSize: '13px', marginBottom: '10px' }}>{formError}</p>}
              <button className="by-suggest__btn" type="submit" disabled={formLoading}>{formLoading ? t.formSubmitting : t.formSubmit}</button>
            </form>
          )}
          </div>
        </div>
      </section>

    </ArticleLayout>
  )
}
