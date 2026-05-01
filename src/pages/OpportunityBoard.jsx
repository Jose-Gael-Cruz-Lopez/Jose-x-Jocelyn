import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ArticleLayout from '../components/ArticleLayout'
import { supabase } from '../lib/supabase'
import { useT } from '../hooks/useT'

const FEATURED = [
  {
    id: 'f1', logo: 'TT', logoStyle: {}, deadlineLabel: 'Closes May 15', deadlineCls: 'urgent',
    title: 'GPU/AI Application Platform Engineer Intern', company: 'TikTok · Server Platform',
    tags: [{ l: 'Internship', c: 'ob-tag--intern' }, { l: 'PhD', c: 'ob-tag--muted' }, { l: 'AI/ML', c: 'ob-tag--muted' }, { l: 'Fall 2026', c: 'ob-tag--muted' }],
    meta: ['Remote / US', 'Competitive salary'],
    desc: <span>Fall 2026 PhD-level GPU/AI internship focused on server platform applications. <strong>Strong fit for students doing research in systems, ML infra, or high-performance computing.</strong></span>,
    source: 'J&J LinkedIn post', viewLink: '#', postLink: 'https://www.linkedin.com/in/josegaelcruzlopez', postLabel: 'View post ↗',
    type: 'internship', stage: 'phd', location: 'us', deadline: 'this-month', bridge: false,
    keywords: 'tiktok gpu ai intern phd ml systems server platform',
  },
  {
    id: 'f2', logo: 'Pi', logoStyle: { background: 'rgba(179,69,57,.08)', color: 'var(--color-accent)' }, deadlineLabel: 'Rolling', deadlineCls: 'rolling',
    title: 'Apprenticeship Program - Software Engineering', company: 'Pinterest',
    tags: [{ l: 'Apprenticeship', c: 'ob-tag--apprent' }, { l: 'Bridge Year Friendly', c: 'ob-tag--bridge' }, { l: 'No Degree Required', c: 'ob-tag--muted' }],
    meta: ['Remote / US', 'Paid, competitive'],
    desc: <span>Pinterest's apprenticeship is one of the best entry points in tech for candidates without a traditional CS degree. <strong>Especially strong for career changers and nontraditional students.</strong></span>,
    source: 'Bridge Year Hub', viewLink: '#', postLink: '/bridge-year', postLabel: 'Bridge Year Hub',
    type: 'apprenticeship', stage: 'recent-grad transition', location: 'us', deadline: 'rolling', bridge: true,
    keywords: 'pinterest apprenticeship software engineering swe early career',
  },
  {
    id: 'f3', logo: 'Ms', logoStyle: { background: 'rgba(91,142,194,.12)', color: 'var(--color-blue)' }, deadlineLabel: 'Rolling', deadlineCls: 'rolling',
    title: 'LEAP Apprenticeship Program', company: 'Microsoft',
    tags: [{ l: 'Apprenticeship', c: 'ob-tag--apprent' }, { l: 'Bridge Year Friendly', c: 'ob-tag--bridge' }, { l: 'Open to Non-CS', c: 'ob-tag--muted' }],
    meta: ['US (various)', 'Paid + benefits'],
    desc: <span>LEAP is Microsoft's flagship apprenticeship for people transitioning into tech. <strong>Open to people without a CS degree, including career changers and self-taught developers.</strong></span>,
    source: 'Bridge Year Hub', viewLink: '#', postLink: '/bridge-year', postLabel: 'Bridge Year Hub',
    type: 'apprenticeship', stage: 'recent-grad transition', location: 'us', deadline: 'rolling', bridge: true,
    keywords: 'microsoft leap apprenticeship software engineering career change',
  },
]

const MAIN_CARDS = [
  {
    id: 'm1', logo: 'G', logoStyle: { background: 'rgba(58,125,107,.1)', color: 'var(--color-teal)' }, deadlineLabel: 'Closes May 1', deadlineCls: 'urgent',
    title: 'STEP Internship - Software Engineering', company: 'Google',
    tags: [{ l: 'Internship', c: 'ob-tag--intern' }, { l: 'Sophomore / First Year', c: 'ob-tag--muted' }, { l: 'Summer 2026', c: 'ob-tag--muted' }],
    meta: ['US (various)', '$7,000–$8,000/mo'],
    desc: <span>Google's STEP program is built for first- and second-year CS students. <strong>One of the most competitive early-stage internships in tech - apply early.</strong></span>,
    source: 'J&J LinkedIn post', viewLink: '#', postLink: 'https://www.linkedin.com/in/josegaelcruzlopez', postLabel: 'View post ↗',
    type: 'internship', stage: 'first-second junior', location: 'us', deadline: 'this-month', bridge: false,
    keywords: 'google step internship sophomore first year cs early experience',
  },
  {
    id: 'm2', logo: 'Sf', logoStyle: { background: 'rgba(91,142,194,.12)', color: 'var(--color-blue)' }, deadlineLabel: 'Closes May 10', deadlineCls: 'urgent',
    title: 'Futureforce Summer Internship - SWE', company: 'Salesforce',
    tags: [{ l: 'Internship', c: 'ob-tag--intern' }, { l: 'Junior / Senior', c: 'ob-tag--muted' }, { l: 'Summer 2026', c: 'ob-tag--muted' }],
    meta: ['San Francisco / Remote', '$50/hr'],
    desc: <span>Salesforce Futureforce is a great pipeline into full-time roles. <strong>Strong return offer rate and well-regarded rotational program post-internship.</strong></span>,
    source: 'J&J LinkedIn post', viewLink: '#', postLink: 'https://www.linkedin.com/in/josegaelcruzlopez', postLabel: 'View post ↗',
    type: 'internship', stage: 'junior senior', location: 'us', deadline: 'this-month', bridge: false,
    keywords: 'salesforce futureforce intern summer software engineering early career',
  },
  {
    id: 'm3', logo: 'St', logoStyle: { background: 'rgba(22,43,68,.08)', color: 'var(--color-navy)' }, deadlineLabel: 'Rolling', deadlineCls: 'rolling',
    title: 'New Grad - Software Engineer', company: 'Stripe',
    tags: [{ l: 'New Grad', c: 'ob-tag--newgrad' }, { l: 'Recent Grad', c: 'ob-tag--muted' }, { l: 'Full-Time', c: 'ob-tag--muted' }],
    meta: ['Remote / US', '$180k–$220k TC'],
    desc: <span>Stripe's new grad SWE role is highly competitive but worth the prep. <strong>Strong culture, high bar for writing and systems thinking - not just leetcode.</strong></span>,
    source: 'J&J LinkedIn post', viewLink: '#', postLink: 'https://www.linkedin.com/in/josegaelcruzlopez', postLabel: 'View post ↗',
    type: 'new-grad', stage: 'recent-grad', location: 'us', deadline: 'rolling', bridge: false,
    keywords: 'stripe new grad software engineer full-time early career fintech',
  },
  {
    id: 'm4', logo: 'Sp', logoStyle: { background: 'rgba(58,125,107,.1)', color: 'var(--color-teal)' }, deadlineLabel: 'Rolling', deadlineCls: 'rolling',
    title: 'Tech Fellowship - Early Career Engineering', company: 'Spotify',
    tags: [{ l: 'Fellowship', c: 'ob-tag--fellowship' }, { l: 'Bridge Year Friendly', c: 'ob-tag--bridge' }, { l: 'Non-Traditional Welcome', c: 'ob-tag--muted' }],
    meta: ['Remote / Stockholm', 'Paid'],
    desc: <span>Spotify's early-career fellowship welcomes engineers from nontraditional backgrounds. <strong>Good option for bridge year candidates still building their portfolio.</strong></span>,
    source: 'Bridge Year Hub', viewLink: '#', postLink: '/bridge-year', postLabel: 'Bridge Year Hub',
    type: 'apprenticeship', stage: 'recent-grad transition', location: 'us', deadline: 'rolling', bridge: true,
    keywords: 'spotify tech fellowship apprenticeship music early career non-traditional',
  },
  {
    id: 'm5', logo: 'Me', logoStyle: { background: 'rgba(91,142,194,.12)', color: 'var(--color-blue)' }, deadlineLabel: 'Closes Apr 30', deadlineCls: 'urgent',
    title: 'Meta University Research Program', company: 'Meta',
    tags: [{ l: 'Program', c: 'ob-tag--program' }, { l: 'Undergraduate', c: 'ob-tag--muted' }, { l: 'Underrepresented Students', c: 'ob-tag--muted' }],
    meta: ['Menlo Park / Remote', '$7,500/mo + housing'],
    desc: <span>Meta University is specifically designed for underrepresented undergrads. <strong>Pairing research mentorship with SWE/PM internship tracks - exceptional for first-gen students.</strong></span>,
    source: 'J&J LinkedIn post', viewLink: '#', postLink: 'https://www.linkedin.com/in/josegaelcruzlopez', postLabel: 'View post ↗',
    type: 'program', stage: 'junior senior', location: 'us', deadline: 'this-month', bridge: false,
    keywords: 'meta university research program undergraduate first-gen underrepresented',
  },
  {
    id: 'm6', logo: 'IB', logoStyle: { background: 'rgba(22,43,68,.08)', color: 'var(--color-navy)' }, deadlineLabel: 'Closes May 20', deadlineCls: '',
    title: 'Data Science Summer Intern', company: 'IBM',
    tags: [{ l: 'Internship', c: 'ob-tag--intern' }, { l: 'Data', c: 'ob-tag--muted' }, { l: 'Junior / Senior', c: 'ob-tag--muted' }, { l: 'Open to Non-CS', c: 'ob-tag--muted' }],
    meta: ['Austin, TX / Hybrid', '$38/hr'],
    desc: <span>IBM's data science intern track is one of the more accessible pipelines for non-CS students in STEM. <strong>Statistics, math, and econ majors encouraged to apply.</strong></span>,
    source: 'J&J LinkedIn post', viewLink: '#', postLink: 'https://www.linkedin.com/in/josegaelcruzlopez', postLabel: 'View post ↗',
    type: 'internship', stage: 'junior senior', location: 'us', deadline: 'this-month', bridge: false,
    keywords: 'ibm data science intern summer undergraduate analytics',
  },
  {
    id: 'm7', logo: 'Fi', logoStyle: { background: 'rgba(179,69,57,.08)', color: 'var(--color-accent)' }, deadlineLabel: 'Rolling', deadlineCls: 'rolling',
    title: 'Research Fellowship - Design & Product', company: 'Figma',
    tags: [{ l: 'Fellowship', c: 'ob-tag--fellowship' }, { l: 'Bridge Year Friendly', c: 'ob-tag--bridge' }, { l: 'Design / PM', c: 'ob-tag--muted' }],
    meta: ['San Francisco / Remote', 'Paid, competitive'],
    desc: <span>Figma's research fellowship is a great stepping stone for students pursuing design or PM. <strong>Especially strong for underrepresented designers without traditional portfolios yet.</strong></span>,
    source: 'Bridge Year Hub', viewLink: '#', postLink: '/bridge-year', postLabel: 'Bridge Year Hub',
    type: 'program', stage: 'junior senior recent-grad', location: 'us', deadline: 'rolling', bridge: true,
    keywords: 'figma research fellowship design product research underrepresented',
  },
]

const TAB_KEYS = ['all', 'internship', 'apprenticeship', 'new-grad', 'program', 'bridge']

function matchCard(card, { tab, query, stage, location, deadline }) {
  if (tab !== 'all') {
    if (tab === 'bridge') { if (!card.bridge) return false }
    else if (!card.type.includes(tab)) return false
  }
  if (query) {
    const hay = (card.keywords + ' ' + card.title + ' ' + card.company).toLowerCase()
    if (!hay.includes(query)) return false
  }
  if (stage && !card.stage.includes(stage)) return false
  if (location && !card.location.includes(location)) return false
  if (deadline && !card.deadline.includes(deadline)) return false
  return true
}

function dbOpportunityToCard(row) {
  const abbr = row.company.replace(/\s+/g, '').slice(0, 2).toUpperCase() || '??'
  const typeKey = (row.role_type || '').toLowerCase()
  const tagTypeMap = {
    internship: 'ob-tag--intern', apprenticeship: 'ob-tag--apprent',
    'new grad': 'ob-tag--newgrad', fellowship: 'ob-tag--fellowship',
    program: 'ob-tag--program', scholarship: 'ob-tag--program',
  }
  let deadlineLabel = 'Rolling', deadlineCls = 'rolling', deadlineFilter = 'rolling'
  if (row.deadline) {
    const d = new Date(row.deadline)
    const diffDays = (d - new Date()) / 86400000
    deadlineLabel = `Closes ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    deadlineCls = diffDays < 30 ? 'urgent' : ''
    deadlineFilter = diffDays < 30 ? 'this-month' : 'rolling'
  }
  const tags = [{ l: row.role_type || 'Opportunity', c: tagTypeMap[typeKey] || 'ob-tag--muted' }]
  if (row.eligibility) tags.push({ l: row.eligibility, c: 'ob-tag--muted' })
  return {
    id: row.id, logo: abbr, logoStyle: {},
    deadlineLabel, deadlineCls,
    title: row.role, company: row.company,
    tags, meta: [...(row.location ? [row.location] : []), ...(row.pay ? [row.pay] : [])], desc: row.why || '',
    source: 'Community submission',
    viewLink: row.link, postLink: row.link, postLabel: 'View role ↗',
    type: typeKey, stage: '', location: '', deadline: deadlineFilter, bridge: false,
    keywords: `${row.role} ${row.company} ${row.eligibility || ''}`.toLowerCase(),
    _featured: row.status === 'featured',
  }
}

function OBCard({ card, featured, t }) {
  const isExternal = card.postLink.startsWith('http')
  return (
    <article className={`ob-card${featured ? ' featured' : ''}`}>
      {featured && <span className="ob-card__featured-badge">{t.cardFeaturedBadge}</span>}
      <div className="ob-card__top">
        <div className="ob-card__company-logo" style={card.logoStyle}>{card.logo}</div>
        <span className={`ob-card__deadline${card.deadlineCls ? ' ' + card.deadlineCls : ''}`}>{card.deadlineLabel}</span>
      </div>
      <div>
        <div className="ob-card__title">{card.title}</div>
        <div className="ob-card__company">{card.company}</div>
      </div>
      <div className="ob-card__tags">
        {card.tags.map(tag => <span key={tag.l} className={`ob-tag ${tag.c}`}>{tag.l}</span>)}
      </div>
      <div className="ob-card__meta">
        {card.meta.map(m => { const chars = [...m]; return <span key={m} className="ob-card__meta-item"><span aria-hidden="true">{chars[0]}</span>{chars.slice(1).join('')}</span> })}
      </div>
      <div className="ob-card__desc">{card.desc}</div>
      <div className="ob-card__source"><span className="ob-card__source-dot"></span> {card.source}</div>
      <div className="ob-card__actions">
        <a href={card.viewLink} className="ob-card__cta-primary" target="_blank" rel="noopener">{t.cardViewRole}</a>
        {isExternal
          ? <a href={card.postLink} className="ob-card__cta-secondary" target="_blank" rel="noopener">{card.postLabel}</a>
          : <Link to={card.postLink} className="ob-card__cta-secondary">{card.postLabel}</Link>
        }
      </div>
    </article>
  )
}

export default function OpportunityBoard() {
  const t = useT('opportunityBoard')
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [stage, setStage] = useState('')
  const [location, setLocation] = useState('')
  const [deadline, setDeadline] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({ role: '', company: '', type: '', link: '', deadline: '', eligibility: '', why: '', email: '', location: '', pay: '' })

  const [dbOpportunities, setDbOpportunities] = useState([])

  useEffect(() => {
    supabase.from('opportunities')
      .select('*')
      .in('status', ['approved', 'featured'])
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data?.length) setDbOpportunities(data.map(dbOpportunityToCard))
      })
  }, [])

  const filters = { tab, query: search.toLowerCase().trim(), stage, location, deadline }

  const allFeatured = [...FEATURED, ...dbOpportunities.filter(c => c._featured)]
  const allMain = [...MAIN_CARDS, ...dbOpportunities.filter(c => !c._featured)]
  const visibleFeatured = allFeatured.filter(c => matchCard(c, filters))
  const visibleMain = allMain.filter(c => matchCard(c, filters))
  const totalVisible = visibleFeatured.length + visibleMain.length

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { role, company, type, link, why } = form
    if (!role || !company || !type || !link || !why) {
      setFormError(t.formErrorRequired)
      return
    }
    setFormLoading(true)
    setFormError('')
    const { error } = await supabase.from('opportunities').insert({
      role: form.role,
      company: form.company,
      role_type: form.type,
      link: form.link,
      deadline: form.deadline || null,
      eligibility: form.eligibility || null,
      why: form.why,
      submitted_by: form.email || null,
      status: 'approved',
      location: form.location || null,
      pay: form.pay || null,
    })
    setFormLoading(false)
    if (error) {
      setFormError(t.formErrorGeneric)
    } else {
      setFormSubmitted(true)
    }
  }

  const SOURCE_ITEM_STYLES = [
    {},
    { background: 'rgba(22,43,68,.1)', color: 'var(--color-navy)' },
    { background: 'rgba(232,168,56,.12)', color: 'var(--color-gold-dark)' },
  ]

  return (
    <ArticleLayout title="Opportunity Board">
      <style>{`
        html, body { background: var(--color-cream); }
        .ob-kicker { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--color-muted); margin-bottom: 14px; }
        .ob-section-title { font-family: var(--font-display); font-size: clamp(26px,4vw,40px); font-weight: 700; color: var(--color-dark); line-height: 1.15; margin-bottom: 10px; }
        .ob-section-sub { font-family: var(--font-display); font-size: clamp(16px,2vw,20px); font-weight: 400; color: var(--color-accent); margin-bottom: 20px; }
        .ob-section-body { font-size: clamp(15px,1.8vw,17px); color: var(--color-muted); line-height: 1.75; max-width: 700px; }
        .ob-section-body strong { color: var(--color-dark); font-weight: 600; }
        .ob-divider { border: none; border-top: 1px solid rgba(0,0,0,.08); margin: 0; }

        .ob-hero { padding: 120px clamp(20px,5vw,56px) 64px; max-width: 1040px; margin: 0 auto; }
        .ob-hero__kicker { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--color-muted); margin-bottom: 18px; }
        .ob-hero__title { font-family: var(--font-display); font-size: clamp(42px,7vw,80px); font-weight: 700; line-height: 1.04; color: var(--color-dark); margin-bottom: 14px; }
        .ob-hero__title em { font-style: normal; color: var(--color-gold); }
        .ob-hero__sub { font-family: var(--font-display); font-size: clamp(18px,2.5vw,26px); font-weight: 400; color: var(--color-dark); line-height: 1.4; max-width: 720px; margin-bottom: 24px; }
        .ob-hero__body { font-size: clamp(15px,1.8vw,17px); color: var(--color-muted); line-height: 1.8; max-width: 680px; margin-bottom: 40px; }
        .ob-hero__body strong { color: var(--color-dark); font-weight: 600; }
        .ob-hero__stats { display: flex; flex-wrap: wrap; gap: 28px; }
        .ob-hero__stat-num { font-family: var(--font-display); font-size: clamp(28px,4vw,40px); font-weight: 700; color: var(--color-dark); line-height: 1; }
        .ob-hero__stat-num em { font-style: normal; color: var(--color-gold); }
        .ob-hero__stat-label { font-size: 12px; color: var(--color-muted); margin-top: 4px; letter-spacing: .02em; }

        .ob-board { max-width: 1040px; margin: 0 auto; padding: 72px clamp(20px,5vw,56px) 80px; }
        .ob-board__head { margin-bottom: 32px; }
        .ob-tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid rgba(0,0,0,.08); }
        .ob-tab { padding: 13px 18px; border-radius: 20px; border: 1.5px solid rgba(0,0,0,.1); background: transparent; font-family: var(--font-body); font-size: 13px; font-weight: 600; color: var(--color-muted); cursor: pointer; transition: background .18s, border-color .18s, color .18s; }
        .ob-tab:hover { border-color: var(--color-dark); color: var(--color-dark); }
        .ob-tab.active { background: var(--color-dark); border-color: var(--color-dark); color: var(--color-cream); }
        .ob-tab:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px; border-radius: 6px; }
        .ob-filter-bar { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 28px; align-items: center; }
        .ob-search-wrap { position: relative; flex: 1; min-width: 220px; }
        .ob-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--color-muted); }
        .ob-search { width: 100%; font-family: var(--font-body); font-size: 15px; padding: 11px 14px 11px 42px; border: 1.5px solid rgba(0,0,0,.12); border-radius: 10px; background: var(--color-white); color: var(--color-dark); outline: none; transition: border-color .2s; }
        .ob-search:focus { border-color: var(--color-gold); }
        .ob-search::placeholder { color: var(--color-muted); }
        .ob-filter-select { font-family: var(--font-body); font-size: 13px; font-weight: 500; padding: 11px 32px 11px 12px; border: 1.5px solid rgba(0,0,0,.12); border-radius: 8px; background: var(--color-white); color: var(--color-dark); outline: none; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B5E52' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; transition: border-color .2s; flex-shrink: 0; }
        .ob-filter-select:focus { border-color: var(--color-gold); }
        .ob-results-count { font-size: 13px; color: var(--color-muted); margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; }
        .ob-results-count span { font-weight: 600; color: var(--color-dark); }

        .ob-featured-strip { margin-bottom: 40px; }
        .ob-featured-label { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--color-gold); margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
        .ob-featured-label::before { content: ''; display: inline-block; width: 20px; height: 2px; background: var(--color-gold); border-radius: 1px; }
        .ob-featured-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px,1fr)); gap: 16px; }

        .ob-card { background: var(--color-paper); border: 1px solid rgba(26,25,22,.08); border-radius: 10px; padding: 22px 24px; display: flex; flex-direction: column; gap: 12px; transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s; position: relative; }
        .ob-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(26,25,22,.1); }
        .ob-card.featured { border-color: rgba(232,168,56,.35); }
        .ob-card.archived { opacity: .55; pointer-events: none; }
        .ob-card__featured-badge { position: absolute; top: -1px; right: 18px; background: var(--color-gold); color: var(--color-dark); font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 3px 10px; border-radius: 0 0 6px 6px; }
        .ob-card__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .ob-card__company-logo { width: 40px; height: 40px; border-radius: 10px; border: 1px solid rgba(0,0,0,.08); background: rgba(0,0,0,.04); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--color-dark); flex-shrink: 0; }
        .ob-card__deadline { font-size: 11px; font-weight: 700; color: var(--color-muted); letter-spacing: .04em; flex-shrink: 0; }
        .ob-card__deadline.urgent { color: var(--color-accent); }
        .ob-card__deadline.rolling { color: var(--color-teal); }
        .ob-card__title { font-family: var(--font-display); font-size: clamp(14px,1.7vw,16px); font-weight: 700; color: var(--color-dark); line-height: 1.3; }
        .ob-card__company { font-size: 13px; color: var(--color-muted); font-weight: 500; }
        .ob-card__tags { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
        .ob-tag { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; }
        .ob-tag--intern    { background: rgba(22,43,68,.08);    color: var(--color-navy); }
        .ob-tag--apprent   { background: rgba(58,125,107,.1);   color: var(--color-teal); }
        .ob-tag--newgrad   { background: rgba(232,168,56,.12);  color: var(--color-gold-dark); }
        .ob-tag--fellowship{ background: rgba(22,43,68,.08);    color: var(--color-navy); }
        .ob-tag--program   { background: rgba(179,69,57,.08);   color: var(--color-accent); }
        .ob-tag--muted     { background: rgba(0,0,0,.05);       color: var(--color-muted); }
        .ob-tag--bridge    { background: rgba(58,125,107,.1);   color: var(--color-teal); }
        .ob-card__meta { display: flex; flex-wrap: wrap; gap: 12px; }
        .ob-card__meta-item { font-size: 12px; color: var(--color-muted); display: flex; align-items: center; gap: 4px; }
        .ob-card__desc { font-size: 13px; color: var(--color-muted); line-height: 1.65; }
        .ob-card__desc strong { color: var(--color-dark); font-weight: 600; }
        .ob-card__source { font-size: 11px; color: rgba(0,0,0,.35); display: flex; align-items: center; gap: 5px; }
        .ob-card__source-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--color-gold-dark); flex-shrink: 0; }
        .ob-card__actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 2px; }
        .ob-card__cta-primary { display: inline-flex; align-items: center; gap: 6px; padding: 13px 16px; background: var(--color-dark); color: var(--color-cream); border-radius: 8px; font-family: var(--font-display); font-size: 12px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: background .2s, transform .15s; flex: 1; justify-content: center; }
        .ob-card__cta-primary:hover { background: var(--color-accent-hover); transform: translateY(-1px); }
        .ob-card__cta-secondary { display: inline-flex; align-items: center; gap: 6px; padding: 13px 14px; background: transparent; color: var(--color-muted); border-radius: 8px; font-family: var(--font-display); font-size: 12px; font-weight: 600; text-decoration: none; border: 1.5px solid rgba(0,0,0,.12); cursor: pointer; transition: border-color .2s, color .2s; flex-shrink: 0; }
        .ob-card__cta-secondary:hover { border-color: var(--color-dark); color: var(--color-dark); }
        .ob-card__cta-primary:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px; border-radius: 8px; }
        .ob-card__cta-secondary:focus-visible { outline: 2px solid var(--color-dark); outline-offset: 2px; border-radius: 8px; }
        .ob-main-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px,1fr)); gap: 16px; }
        .ob-no-results { grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--color-muted); font-size: 15px; }
        .ob-archive-strip { margin-top: 52px; }
        .ob-archive-label { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--color-muted); margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
        .ob-archive-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px,1fr)); gap: 16px; }

        .ob-source { max-width: 1040px; margin: 0 auto; padding: 80px clamp(20px,5vw,56px); }
        .ob-source__layout { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: flex-start; margin-top: 32px; }
        .ob-source__body { font-size: clamp(14px,1.6vw,15px); color: var(--color-muted); line-height: 1.8; }
        .ob-source__body strong { color: var(--color-dark); font-weight: 600; }
        .ob-source__body + .ob-source__body { margin-top: 16px; }
        .ob-source__list { display: flex; flex-direction: column; gap: 14px; }
        .ob-source__item { display: flex; align-items: flex-start; gap: 12px; }
        .ob-source__item-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(58,125,107,.1); color: var(--color-teal); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }
        .ob-source__item-title { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--color-dark); margin-bottom: 2px; }
        .ob-source__item-desc { font-size: 13px; color: var(--color-muted); line-height: 1.55; }

        .ob-submit { max-width: 1040px; margin: 0 auto; padding: 80px clamp(20px,5vw,56px); }
        .ob-submit__layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; align-items: flex-start; }
        .ob-submit__intro-kicker { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--color-muted); margin-bottom: 12px; }
        .ob-submit__intro-title { font-family: var(--font-display); font-size: clamp(22px,3vw,32px); font-weight: 700; color: var(--color-dark); line-height: 1.2; margin-bottom: 16px; }
        .ob-submit__intro-body { font-size: clamp(14px,1.6vw,15px); color: var(--color-muted); line-height: 1.75; }
        .ob-submit__intro-body strong { color: var(--color-dark); font-weight: 600; }
        .ob-form-box { background: var(--color-paper); border: 1px solid rgba(26,25,22,.07); border-radius: 10px; padding: clamp(28px,4vw,44px); }
        .ob-form-row { margin-bottom: 16px; }
        .ob-form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .ob-form-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--color-muted); margin-bottom: 6px; }
        .ob-form-label span { color: var(--color-accent); }
        .ob-form-input, .ob-form-select, .ob-form-textarea { width: 100%; font-family: var(--font-body); font-size: 15px; padding: 11px 14px; border: 1.5px solid rgba(0,0,0,.12); border-radius: 8px; background: var(--color-white); color: var(--color-dark); outline: none; transition: border-color .2s; }
        .ob-form-input:focus, .ob-form-select:focus, .ob-form-textarea:focus { border-color: var(--color-gold); }
        .ob-form-textarea { min-height: 80px; resize: vertical; line-height: 1.6; }
        .ob-form-select { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B5E52' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
        .ob-form-btn { width: 100%; padding: 14px 24px; background: var(--color-dark); color: var(--color-cream); border: none; border-radius: 8px; font-family: var(--font-display); font-size: 14px; font-weight: 600; cursor: pointer; transition: background .2s, transform .18s; margin-top: 6px; }
        .ob-form-btn:hover { background: var(--color-accent); transform: translateY(-1px); }
        .ob-form-btn:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px; }
        .ob-form-success { text-align: center; padding: 40px 20px; }
        .ob-form-success__icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(232,168,56,.12); color: var(--color-gold-dark); display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 16px; }
        .ob-form-success__title { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--color-dark); margin-bottom: 8px; }
        .ob-form-success__body { font-size: 14px; color: var(--color-muted); line-height: 1.7; }

        .ob-eco { background: var(--color-dark); padding: 72px clamp(20px,5vw,56px); }
        .ob-eco__inner { max-width: 1040px; margin: 0 auto; }
        .ob-eco__kicker { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(242,228,206,.4); margin-bottom: 10px; }
        .ob-eco__title { font-family: var(--font-display); font-size: clamp(20px,3vw,28px); font-weight: 700; color: var(--color-cream); margin-bottom: 8px; line-height: 1.25; }
        .ob-eco__body { font-size: clamp(14px,1.6vw,15px); color: rgba(242,228,206,.55); line-height: 1.75; max-width: 680px; margin-bottom: 36px; }
        .ob-eco__grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(200px,1fr)); gap: 14px; }
        .ob-eco__link { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09); border-radius: 12px; padding: 18px 20px; text-decoration: none; transition: background .2s, transform .2s cubic-bezier(.16,1,.3,1); display: block; }
        .ob-eco__link:hover { background: rgba(255,255,255,.09); transform: translateY(-2px); }
        .ob-eco__link-title { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--color-cream); margin-bottom: 4px; }
        .ob-eco__link-desc { font-size: 12px; color: rgba(242,228,206,.45); line-height: 1.5; }

        @media (max-width: 560px) { .ob-featured-grid, .ob-main-grid, .ob-archive-grid { grid-template-columns: 1fr; } }
        @media (max-width: 680px) { .ob-source__layout { grid-template-columns: 1fr; gap: 32px; } }
        @media (max-width: 740px) { .ob-submit__layout { grid-template-columns: 1fr; gap: 36px; } .ob-form-row-2 { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .ob-hero { padding: 88px 20px 48px; } .ob-board, .ob-source, .ob-submit { padding-top: 48px; padding-bottom: 48px; } }
        @media (max-width: 480px) { .ob-hero { padding: 80px 16px 40px; } .ob-hero__stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px; } }
      `}</style>

      <header className="ob-hero" id="top">
        <p className="ob-hero__kicker">{t.heroKicker}</p>
        <h1 className="ob-hero__title">{t.heroTitle} <em>{t.heroTitleEm}</em></h1>
        <p className="ob-hero__sub">{t.heroSub}</p>
        <p className="ob-hero__body">
          {t.heroBody1} <strong>{t.heroBodyStrong}</strong>{t.heroBody2}
        </p>
        <div className="ob-hero__stats">
          <div><div className="ob-hero__stat-num">{t.heroStatNum1}<em>{t.heroStatNumEm1}</em></div><div className="ob-hero__stat-label">{t.heroStatLabel1}</div></div>
          <div><div className="ob-hero__stat-num">{t.heroStatNum2}</div><div className="ob-hero__stat-label">{t.heroStatLabel2}</div></div>
          <div><div className="ob-hero__stat-num">{t.heroStatNum3}<em>{t.heroStatNumEm3}</em></div><div className="ob-hero__stat-label">{t.heroStatLabel3}</div></div>
        </div>
      </header>

      <hr className="ob-divider" />

      <section className="ob-board" id="board">
        <div className="ob-board__head">
          <p className="ob-kicker">{t.boardKicker}</p>
          <h2 className="ob-section-title">{t.boardTitle}</h2>
          <p className="ob-section-sub">{t.boardSub}</p>
        </div>

        <div className="ob-tabs" role="group" aria-label={t.tabGroupAriaLabel}>
          {TAB_KEYS.map(key => {
            const labelMap = { all: t.tabAll, internship: t.tabInternship, apprenticeship: t.tabApprenticeship, 'new-grad': t.tabNewGrad, program: t.tabProgram, bridge: t.tabBridge }
            return (
              <button key={key} id={`ob-tab-${key}`} className={`ob-tab${tab === key ? ' active' : ''}`} aria-pressed={tab === key} onClick={() => setTab(key)}>{labelMap[key]}</button>
            )
          })}
        </div>

        <div className="ob-filter-bar">
          <div className="ob-search-wrap">
            <svg className="ob-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input type="text" className="ob-search" placeholder={t.searchPlaceholder} aria-label={t.searchAriaLabel} autoComplete="off" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="ob-filter-select" aria-label={t.filterStageAriaLabel} value={stage} onChange={e => setStage(e.target.value)}>
            <option value="">{t.filterStageAll}</option>
            <option value="first-second">{t.filterStageFirstSecond}</option>
            <option value="junior">{t.filterStageJunior}</option>
            <option value="senior">{t.filterStageSenior}</option>
            <option value="recent-grad">{t.filterStageRecentGrad}</option>
            <option value="transition">{t.filterStageTransition}</option>
            <option value="phd">{t.filterStagePhD}</option>
          </select>
          <select className="ob-filter-select" aria-label={t.filterLocationAriaLabel} value={location} onChange={e => setLocation(e.target.value)}>
            <option value="">{t.filterLocationAll}</option>
            <option value="remote">{t.filterLocationRemote}</option>
            <option value="us">{t.filterLocationUS}</option>
            <option value="canada">{t.filterLocationCanada}</option>
            <option value="international">{t.filterLocationInternational}</option>
          </select>
          <select className="ob-filter-select" aria-label={t.filterDeadlineAriaLabel} value={deadline} onChange={e => setDeadline(e.target.value)}>
            <option value="">{t.filterDeadlineAny}</option>
            <option value="this-week">{t.filterDeadlineThisWeek}</option>
            <option value="this-month">{t.filterDeadlineThisMonth}</option>
            <option value="rolling">{t.filterDeadlineRolling}</option>
          </select>
        </div>

        <div className="ob-results-count"><span>{totalVisible}</span>&nbsp;{t.opportunitiesShown}</div>

        {visibleFeatured.length > 0 && (
          <div className="ob-featured-strip">
            <p className="ob-featured-label">{t.featuredLabel}</p>
            <div className="ob-featured-grid">
              {visibleFeatured.map(c => <OBCard key={c.id} card={c} featured t={t} />)}
            </div>
          </div>
        )}

        <div className="ob-main-grid">
          {visibleMain.length === 0 && visibleFeatured.length === 0
            ? <p className="ob-no-results">{t.noResults}</p>
            : visibleMain.map(c => <OBCard key={c.id} card={c} featured={false} t={t} />)
          }
        </div>

        <div className="ob-archive-strip">
          <p className="ob-archive-label">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: 'var(--color-muted)' }}><rect x="1" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 4V3a2 2 0 1 1 4 0v1" stroke="currentColor" strokeWidth="1.3"/></svg>
            {t.archiveLabel}
          </p>
          <div className="ob-archive-grid">
            {[
              { logo: 'Am', title: 'SWE Internship - Early Career (SDE I)', company: 'Amazon', closed: 'Closed Apr 1', tags: ['Internship', 'SWE', 'Summer 2026'], desc: 'Typically opens again in September for the following summer. Set a calendar reminder for August 15.' },
              { logo: 'As', title: 'Diversity & Inclusion Scholarship', company: 'Asana', closed: 'Closed Mar 20', tags: ['Scholarship', 'Underrepresented Students'], desc: 'Usually reopens each fall. Watch for the announcement in October - often tied to Grace Hopper / NSBE / SHPE season.' },
            ].map(a => (
              <article key={a.logo} className="ob-card archived">
                <div className="ob-card__top">
                  <div className="ob-card__company-logo" style={{ background: 'rgba(0,0,0,.05)', color: 'var(--color-muted)' }}>{a.logo}</div>
                  <span className="ob-card__deadline" style={{ color: 'var(--color-muted)' }}>{a.closed}</span>
                </div>
                <div>
                  <div className="ob-card__title">{a.title}</div>
                  <div className="ob-card__company">{a.company}</div>
                </div>
                <div className="ob-card__tags">{a.tags.map(tag => <span key={tag} className="ob-tag ob-tag--muted">{tag}</span>)}</div>
                <div className="ob-card__desc">{a.desc}</div>
                <div className="ob-card__source"><span className="ob-card__source-dot" style={{ background: 'var(--color-muted)' }}></span> {t.archiveSource}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <hr className="ob-divider" />

      <section className="ob-source" id="source">
        <p className="ob-kicker">{t.sourceKicker}</p>
        <h2 className="ob-section-title">{t.sourceTitle}</h2>
        <p className="ob-section-sub">{t.sourceSub}</p>
        <div className="ob-source__layout">
          <div>
            <p className="ob-source__body">{t.sourceBody1Part1} <strong>{t.sourceBody1Strong}</strong>{t.sourceBody1Part2}</p>
            <p className="ob-source__body" style={{ marginTop: '16px' }}>{t.sourceBody2Part1} <strong>{t.sourceBody2Strong}</strong>{t.sourceBody2Part2}</p>
          </div>
          <div className="ob-source__list">
            {t.sourceItems.map((s, i) => (
              <div key={s.title} className="ob-source__item">
                <span className="ob-source__item-icon" style={SOURCE_ITEM_STYLES[i]}>{s.icon}</span>
                <div>
                  <div className="ob-source__item-title">{s.title}</div>
                  <div className="ob-source__item-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="ob-divider" />

      <section className="ob-submit" id="submit">
        <div className="ob-submit__layout">
          <div>
            <p className="ob-submit__intro-kicker">{t.submitKicker}</p>
            <h2 className="ob-submit__intro-title">{t.submitTitle}</h2>
            <p className="ob-submit__intro-body">{t.submitBody} <strong>{t.submitBodyStrong}</strong>{t.submitBodySuffix}</p>
          </div>
          <div className="ob-form-box">
            {formSubmitted ? (
              <div className="ob-form-success">
                <div className="ob-form-success__icon">✓</div>
                <div className="ob-form-success__title">{t.formSuccessTitle}</div>
                <p className="ob-form-success__body">{t.formSuccessBody}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="ob-form-row">
                  <label className="ob-form-label" htmlFor="obRoleName">{t.formLabelRole} <span>{t.formLabelRoleRequired}</span></label>
                  <input className="ob-form-input" type="text" id="obRoleName" placeholder={t.formPlaceholderRole} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
                </div>
                <div className="ob-form-row ob-form-row-2">
                  <div>
                    <label className="ob-form-label" htmlFor="obCompany">{t.formLabelCompany} <span>{t.formLabelCompanyRequired}</span></label>
                    <input className="ob-form-input" type="text" id="obCompany" placeholder={t.formPlaceholderCompany} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                  </div>
                  <div>
                    <label className="ob-form-label" htmlFor="obRoleType">{t.formLabelType} <span>{t.formLabelTypeRequired}</span></label>
                    <select className="ob-form-select" id="obRoleType" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                      <option value="">{t.formTypeDefault}</option>
                      <option>{t.formTypeInternship}</option>
                      <option>{t.formTypeApprenticeship}</option>
                      <option>{t.formTypeNewGrad}</option>
                      <option>{t.formTypeFellowship}</option>
                      <option>{t.formTypeProgram}</option>
                      <option>{t.formTypeScholarship}</option>
                    </select>
                  </div>
                </div>
                <div className="ob-form-row">
                  <label className="ob-form-label" htmlFor="obLink">{t.formLabelLink} <span>{t.formLabelLinkRequired}</span></label>
                  <input className="ob-form-input" type="url" id="obLink" placeholder={t.formPlaceholderLink} value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
                </div>
                <div className="ob-form-row ob-form-row-2">
                  <div>
                    <label className="ob-form-label" htmlFor="obDeadline">{t.formLabelDeadline}</label>
                    <input className="ob-form-input" type="text" id="obDeadline" placeholder={t.formPlaceholderDeadline} value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
                  </div>
                  <div>
                    <label className="ob-form-label" htmlFor="obEligibility">{t.formLabelEligibility}</label>
                    <input className="ob-form-input" type="text" id="obEligibility" placeholder={t.formPlaceholderEligibility} value={form.eligibility} onChange={e => setForm(f => ({ ...f, eligibility: e.target.value }))} />
                  </div>
                </div>
                <div className="ob-form-row ob-form-row-2">
                  <div>
                    <label className="ob-form-label" htmlFor="obLocation">{t.formLabelLocation}</label>
                    <input className="ob-form-input" type="text" id="obLocation" placeholder={t.formPlaceholderLocation} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                  </div>
                  <div>
                    <label className="ob-form-label" htmlFor="obPay">{t.formLabelPay}</label>
                    <input className="ob-form-input" type="text" id="obPay" placeholder={t.formPlaceholderPay} value={form.pay} onChange={e => setForm(f => ({ ...f, pay: e.target.value }))} />
                  </div>
                </div>
                <div className="ob-form-row">
                  <label className="ob-form-label" htmlFor="obWhy">{t.formLabelWhy} <span>{t.formLabelWhyRequired}</span></label>
                  <textarea className="ob-form-textarea" id="obWhy" placeholder={t.formPlaceholderWhy} value={form.why} onChange={e => setForm(f => ({ ...f, why: e.target.value }))}></textarea>
                </div>
                <div className="ob-form-row">
                  <label className="ob-form-label" htmlFor="obEmail">{t.formLabelEmail} <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{t.formEmailOptional}</span></label>
                  <input className="ob-form-input" type="email" id="obEmail" placeholder={t.formPlaceholderEmail} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                {formError && <p role="alert" style={{ color: 'var(--color-accent)', fontSize: 13, marginBottom: 10 }}>{formError}</p>}
                <button className="ob-form-btn" type="submit" disabled={formLoading}>
                  {formLoading ? t.formSubmitting : t.formSubmit}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <hr className="ob-divider" />

      <section className="ob-eco">
        <div className="ob-eco__inner">
          <p className="ob-eco__kicker">{t.ecoKicker}</p>
          <h2 className="ob-eco__title">{t.ecoTitle}</h2>
          <p className="ob-eco__body">{t.ecoBody}</p>
          <div className="ob-eco__grid">
            {t.ecoLinks.map(l => (
              <Link key={l.to} to={l.to} className="ob-eco__link">
                <div className="ob-eco__link-title">{l.title}</div>
                <div className="ob-eco__link-desc">{l.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </ArticleLayout>
  )
}
