import { useState } from 'react'
import { Link } from 'react-router-dom'
import ArticleLayout from '../components/ArticleLayout'
import { supabase } from '../lib/supabase'
import { useT } from '../hooks/useT'

// Stable structural data — canonical keys only, no display strings
const EPISODES = [
  { num: '01', lens: 'both', topics: 'internships rejection', tags: ['internships', 'rejection'], posts: [{ type: 'announcement', author: 'both', status: 'coming-soon' }, { type: 'student-lens', author: 'jose', status: 'coming-soon' }, { type: 'post-grad-lens', author: 'jocelyn', status: 'coming-soon' }, { type: 'recap-cta', author: 'both', status: 'coming-soon' }] },
  { num: '02', lens: 'jose', topics: 'internships', tags: ['internships'], posts: [{ type: 'student-lens', author: 'jose', status: 'coming-soon' }, { type: 'student-lens', author: 'jose', status: 'coming-soon' }, { type: 'carousel', author: 'jose', status: 'coming-soon' }] },
  { num: '03', lens: 'jocelyn', topics: 'offers on-the-job', tags: ['offers', 'on-the-job'], posts: [{ type: 'post-grad-lens', author: 'jocelyn', status: 'coming-soon' }, { type: 'post-grad-lens', author: 'jocelyn', status: 'coming-soon' }, { type: 'carousel', author: 'jocelyn', status: 'coming-soon' }] },
  { num: '04', lens: 'both', topics: 'offers', tags: ['offers'], posts: [{ type: 'student-lens', author: 'jose', status: 'coming-soon' }, { type: 'post-grad-lens', author: 'jocelyn', status: 'coming-soon' }, { type: 'carousel', author: 'both', status: 'coming-soon' }] },
  { num: '05', lens: 'jose', topics: 'internships', tags: ['internships'], posts: [{ type: 'student-lens', author: 'jose', status: 'coming-soon' }, { type: 'student-lens', author: 'jose', status: 'coming-soon' }, { type: 'carousel', author: 'jose', status: 'coming-soon' }] },
  { num: '06', lens: 'jocelyn', topics: 'on-the-job', tags: ['on-the-job'], posts: [{ type: 'post-grad-lens', author: 'jocelyn', status: 'coming-soon' }, { type: 'post-grad-lens', author: 'jocelyn', status: 'coming-soon' }, { type: 'carousel', author: 'jocelyn', status: 'coming-soon' }] },
  { num: '07', lens: 'both', topics: 'rejection', tags: ['rejection'], posts: [{ type: 'student-lens', author: 'jose', status: 'coming-soon' }, { type: 'post-grad-lens', author: 'jocelyn', status: 'coming-soon' }, { type: 'recap', author: 'both', status: 'coming-soon' }] },
  { num: '08', lens: 'both', topics: 'internships', tags: ['internships'], posts: [{ type: 'student-lens', author: 'jose', status: 'coming-soon' }, { type: 'post-grad-lens', author: 'jocelyn', status: 'coming-soon' }, { type: 'carousel', author: 'both', status: 'coming-soon' }] },
  { num: '09', lens: 'both', topics: 'internships offers on-the-job', tags: ['internships', 'offers', 'on-the-job'], posts: [{ type: 'student-lens', author: 'jose', status: 'coming-soon' }, { type: 'post-grad-lens', author: 'jocelyn', status: 'coming-soon' }, { type: 'recap', author: 'both', status: 'coming-soon' }] },
  { num: '10', lens: 'both', topics: 'internships offers rejection on-the-job', tags: ['internships', 'offers', 'rejection', 'on-the-job'], posts: [{ type: 'student-lens', author: 'jose', status: 'coming-soon' }, { type: 'post-grad-lens', author: 'jocelyn', status: 'coming-soon' }, { type: 'recap-cta', author: 'both', status: 'coming-soon' }] },
]

const LENS_FILTERS = new Set(['all', 'jose', 'jocelyn', 'both'])
const TOPIC_FILTERS = new Set(['internships', 'offers', 'rejection', 'on-the-job'])

function lensClass(a) {
  return a === 'jose' ? 'ls-ep__lens--jose' : a === 'jocelyn' ? 'ls-ep__lens--jocelyn' : 'ls-ep__lens--both'
}
function authorClass(a) {
  return a === 'jose' ? 'ls-post__author--jose' : a === 'jocelyn' ? 'ls-post__author--jocelyn' : 'ls-post__author--both'
}

const PAGE_CSS = `
  html, body { background: var(--color-cream); }
  :root { --linkedin-brand-blue: #0a66c2; --ls-shadow-warm: 58, 38, 22; }
  .ls-linkedin { color: var(--linkedin-brand-blue); }
  .ls-hero { max-width:1040px;margin:0 auto;padding:120px clamp(20px,5vw,56px) 48px; }
  .ls-hero__kicker { font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--color-muted);margin-bottom:18px; }
  .ls-hero__title { font-family:var(--font-display);font-size:clamp(36px,6.5vw,68px);font-weight:700;line-height:1.04;letter-spacing:-0.02em;text-wrap:balance;color:var(--color-dark);margin-bottom:20px; }
  .ls-hero__title em { font-style:normal;color:var(--color-accent); }
  .ls-hero__sub { font-size:clamp(15px,2vw,18px);color:var(--color-muted);line-height:1.7;text-wrap:pretty;max-width:640px;margin-bottom:40px; }
  .ls-hero__sub strong { color:var(--color-dark);font-weight:600; }
  .ls-stats { display:flex;flex-wrap:wrap;gap:0;border:1.5px solid rgba(0,0,0,.08);border-radius:12px;overflow:hidden;max-width:640px;background:var(--color-white);box-shadow:0 2px 12px -4px rgba(var(--ls-shadow-warm),.08),0 1px 2px rgba(var(--ls-shadow-warm),.04); }
  .ls-stat { flex:1;min-width:130px;padding:18px 20px;border-right:1px solid rgba(0,0,0,.06); }
  .ls-stat:last-child { border-right:none; }
  .ls-stat__num { font-family:var(--font-display);font-size:22px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.01em;color:var(--color-dark);line-height:1;margin-bottom:4px; }
  .ls-stat__label { font-size:12px;color:var(--color-muted);line-height:1.4; }
  .ls-controls { max-width:1040px;margin:0 auto;padding:0 clamp(20px,5vw,56px) 40px; }
  .ls-filters { display:flex;flex-wrap:wrap;gap:8px; }
  .ls-filter { padding:13px 18px;border-radius:999px;font-family:var(--font-body);font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid rgba(0,0,0,.12);background:var(--color-white);color:var(--color-muted);transition:background-color .2s ease,color .2s ease,border-color .2s ease,transform .15s ease,box-shadow .2s ease; }
  .ls-filter:hover { color:var(--color-dark);border-color:rgba(0,0,0,.22);transform:translateY(-1px);box-shadow:0 4px 12px -4px rgba(var(--ls-shadow-warm),.1); }
  .ls-filter:active { transform:translateY(0);box-shadow:0 1px 2px rgba(var(--ls-shadow-warm),.06); }
  .ls-filter--active { background:var(--color-dark);color:var(--color-cream);border-color:var(--color-dark);box-shadow:0 4px 12px -4px rgba(var(--ls-shadow-warm),.18); }
  .ls-filter--active:hover { background:var(--color-dark);color:var(--color-cream); }
  .ls-filter:focus-visible { outline: 2px solid var(--color-dark); outline-offset: 2px; border-radius: 999px; }
  .ls-divider { max-width:1040px;margin:0 auto 48px;padding:0 clamp(20px,5vw,56px); }
  .ls-divider hr { border:none;border-top:1px solid rgba(0,0,0,.08); }
  .ls-episodes { max-width:1040px;margin:0 auto;padding:0 clamp(20px,5vw,56px) 80px;display:flex;flex-direction:column;gap:56px; }
  .ls-ep__head { display:flex;align-items:flex-start;gap:28px;margin-bottom:24px; }
  .ls-ep__num { font-family:var(--font-display);font-size:clamp(40px,5vw,56px);font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.04em;line-height:1;color:rgba(0,0,0,.09);flex-shrink:0;min-width:72px; }
  .ls-ep__info { flex:1;min-width:0; }
  .ls-ep__badges { display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap; }
  .ls-ep__lens { font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 10px;border-radius:4px;color:var(--color-white); }
  .ls-ep__lens--jose { background:var(--color-teal); }
  .ls-ep__lens--jocelyn { background:var(--color-accent); }
  .ls-ep__lens--both { background:var(--color-navy); }
  .ls-ep__tag { font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--color-muted);padding:3px 10px;border-radius:4px;background:rgba(0,0,0,.06); }
  .ls-ep__title { font-family:var(--font-display);font-size:clamp(20px,2.8vw,28px);font-weight:600;color:var(--color-dark);line-height:1.22;letter-spacing:-0.01em;text-wrap:balance;margin-bottom:10px; }
  .ls-ep__summary { font-size:15px;color:var(--color-muted);line-height:1.6;text-wrap:pretty;max-width:640px;margin-bottom:8px; }
  .ls-ep__why { font-size:13px;color:var(--color-teal);font-weight:500; }
  .ls-ep__why-prefix { font-weight:700; }
  .ls-ep__posts { display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px; }
  .ls-post { position:relative;background:var(--color-white);border:1px solid rgba(0,0,0,.08);border-radius:12px;padding:20px;display:flex;flex-direction:column;gap:10px;transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease; }
  .ls-post:hover { transform:translateY(-2px);border-color:rgba(0,0,0,.14);box-shadow:0 10px 28px -10px rgba(var(--ls-shadow-warm),.14),0 2px 4px rgba(var(--ls-shadow-warm),.04); }
  .ls-post--featured { border-color:var(--color-gold);border-width:1.5px;background:linear-gradient(180deg,rgba(232,168,56,.05) 0%,rgba(232,168,56,.02) 100%); }
  .ls-post--featured:hover { border-color:var(--color-gold);box-shadow:0 12px 32px -10px rgba(232,168,56,.28),0 2px 6px rgba(var(--ls-shadow-warm),.06); }
  .ls-post--featured::before { content:'';position:absolute;top:-1px;left:18px;width:24px;height:5px;background:var(--color-gold);border-radius:0 0 3px 3px; }
  .ls-post__type { font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--color-muted); }
  .ls-post__title { font-family:var(--font-display);font-size:14px;font-weight:600;color:var(--color-dark);line-height:1.4;text-wrap:balance; }
  .ls-post__preview { font-size:13px;color:var(--color-muted);line-height:1.55;flex:1; }
  .ls-post__footer { display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:auto; }
  .ls-post__author { font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:2px 8px;border-radius:3px;color:var(--color-white); }
  .ls-post__author--jose { background:var(--color-teal); }
  .ls-post__author--jocelyn { background:var(--color-accent); }
  .ls-post__author--both { background:var(--color-navy); }
  .ls-post__status { font-size:11px;font-weight:600;color:var(--color-muted);padding:2px 8px;border-radius:3px;background:rgba(0,0,0,.05); }
  .ls-how { position:relative;overflow:hidden;background:var(--color-navy);padding:clamp(48px,7vw,88px) clamp(20px,5vw,56px); }
  .ls-how::before { content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 22% 28%,rgba(232,168,56,.07) 0%,transparent 45%),radial-gradient(circle at 82% 72%,rgba(58,125,107,.06) 0%,transparent 50%);pointer-events:none; }
  .ls-how__inner { position:relative;max-width:1040px;margin:0 auto; }
  .ls-how__kicker { font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--color-gold);margin-bottom:16px; }
  .ls-how__title { font-family:var(--font-display);font-size:clamp(24px,3.5vw,36px);font-weight:700;letter-spacing:-0.01em;text-wrap:balance;color:var(--color-cream);margin-bottom:40px; }
  .ls-how__grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px; }
  .ls-how__item-icon { font-family:var(--font-display);font-size:28px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.03em;color:var(--color-gold);margin-bottom:10px;line-height:1; }
  .ls-how__item-title { font-family:var(--font-display);font-size:16px;font-weight:600;color:var(--color-cream);margin-bottom:6px; }
  .ls-how__item-desc { font-size:14px;color:rgba(242,228,206,.7);line-height:1.6;text-wrap:pretty; }
  .ls-form-wrap { max-width:1040px;margin:0 auto;padding:clamp(56px,8vw,96px) clamp(20px,5vw,56px); }
  .ls-form-box { background:var(--color-white);border-radius:16px;padding:clamp(32px,4vw,56px);border:1px solid rgba(0,0,0,.06);max-width:640px;box-shadow:0 6px 28px -10px rgba(var(--ls-shadow-warm),.1),0 1px 2px rgba(var(--ls-shadow-warm),.04); }
  .ls-form-box__kicker { font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--color-muted);margin-bottom:12px; }
  .ls-form-box__title { font-family:var(--font-display);font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-0.01em;text-wrap:balance;color:var(--color-dark);margin-bottom:8px; }
  .ls-form-box__sub { font-size:15px;color:var(--color-muted);margin-bottom:28px;line-height:1.6;text-wrap:pretty; }
  .ls-form-row { margin-bottom:16px; }
  .ls-form-label { display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--color-muted);margin-bottom:6px; }
  .ls-form-input,.ls-form-select,.ls-form-textarea { width:100%;font-family:var(--font-body);font-size:15px;padding:12px 14px;border:1.5px solid rgba(0,0,0,.12);border-radius:8px;background:var(--color-white);color:var(--color-dark);outline:none;transition:border-color .2s ease,box-shadow .2s ease; }
  .ls-form-textarea { min-height:90px;resize:vertical;line-height:1.55; }
  .ls-form-input:focus,.ls-form-select:focus,.ls-form-textarea:focus { border-color:var(--color-gold);box-shadow:0 0 0 3px rgba(232,168,56,.16); }
  .ls-form-btn { margin-top:6px;padding:13px 28px;background:var(--color-dark);color:var(--color-cream);border:none;border-radius:8px;font-family:var(--font-display);font-size:14px;font-weight:600;letter-spacing:.01em;cursor:pointer;transition:background-color .2s ease,transform .15s ease,box-shadow .2s ease; }
  .ls-form-btn:hover { background:var(--color-accent);transform:translateY(-1px);box-shadow:0 8px 18px -8px rgba(var(--ls-shadow-warm),.22); }
  .ls-form-btn:active { transform:translateY(0);box-shadow:0 2px 4px -2px rgba(var(--ls-shadow-warm),.18); }
  .ls-form-btn:disabled { opacity:.55;cursor:not-allowed;transform:none;box-shadow:none; }
  .ls-no-results { text-align:center;padding:64px 0;color:var(--color-muted); }
  @media (prefers-reduced-motion: reduce) {
    .ls-post,.ls-filter,.ls-form-btn { transition:none; }
    .ls-post:hover,.ls-filter:hover,.ls-form-btn:hover { transform:none; }
  }
  @media (max-width:768px) {
    .ls-hero { padding: 88px 20px 48px; }
    .ls-controls { padding-bottom: 28px; }
    .ls-form-wrap { padding-top: 48px; padding-bottom: 48px; }
  }
  @media (max-width:640px) { .ls-ep__head{flex-direction:column;gap:8px;} .ls-ep__num{font-size:32px;min-width:unset;} .ls-how__grid{grid-template-columns:1fr 1fr;} .ls-stats{flex-direction:column;} .ls-stat{border-right:none;border-bottom:1px solid rgba(0,0,0,.08);} .ls-stat:last-child{border-bottom:none;} }
  @media (max-width:480px) {
    .ls-hero { padding: 80px 16px 40px; }
    .ls-how__grid { grid-template-columns: 1fr; }
    .ls-filters { overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap; padding-bottom: 4px; }
    .ls-filter { flex-shrink: 0; }
  }
`

// Maps canonical type key → translation key
const TYPE_KEY_MAP = {
  'announcement': 'typeAnnouncement',
  'student-lens': 'typeStudentLens',
  'post-grad-lens': 'typePostGradLens',
  'recap-cta': 'typeRecapCTA',
  'carousel': 'typeCarousel',
  'recap': 'typeRecap',
}

// Maps canonical tag key → translation key
const TAG_KEY_MAP = {
  'internships': 'tagInternships',
  'offers': 'tagOffers',
  'rejection': 'tagRejection',
  'on-the-job': 'tagOnTheJob',
}

export default function LinkedInSeries() {
  const t = useT('linkedInSeries')

  const [activeFilter, setActiveFilter] = useState('all')
  const [topic, setTopic] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)

  const FILTERS = [
    { f: 'all',        label: t.filterAll },
    { f: 'jose',       label: t.filterJose },
    { f: 'jocelyn',    label: t.filterJocelyn },
    { f: 'both',       label: t.filterBoth },
    { f: 'internships',label: t.filterInternships },
    { f: 'offers',     label: t.filterOffers },
    { f: 'rejection',  label: t.filterRejection },
    { f: 'on-the-job', label: t.filterOnTheJob },
  ]

  const handleSubmit = async e => {
    e.preventDefault()
    if (!topic.trim()) { setFormError(t.formErrorTopic); return }
    setFormLoading(true)
    setFormError('')
    const { error } = await supabase.from('linkedin_episode_requests').insert({
      topic: topic.trim(),
      email: email.trim() || null,
      category: category || null,
    })
    setFormLoading(false)
    if (error) { setFormError(t.formErrorGeneric) }
    else { setFormSubmitted(true) }
  }

  const visibleEps = EPISODES.filter(ep => {
    if (activeFilter === 'all') return true
    if (LENS_FILTERS.has(activeFilter)) return ep.lens === activeFilter
    if (TOPIC_FILTERS.has(activeFilter)) return ep.topics.includes(activeFilter)
    return true
  })

  function getLensLabel(lens) {
    if (lens === 'jose') return t.lensLabelJose
    if (lens === 'jocelyn') return t.lensLabelJocelyn
    return t.lensLabelBoth
  }

  function getAuthorLabel(author) {
    if (author === 'jose') return t.authorJose
    if (author === 'jocelyn') return t.authorJocelyn
    return t.authorBoth
  }

  return (
    <ArticleLayout title="The LinkedIn Series">
      <style>{PAGE_CSS}</style>

      <header className="ls-hero">
        <p className="ls-hero__kicker">{t.heroKicker}</p>
        <h1 className="ls-hero__title">{t.heroTitlePrefix}<span className="ls-linkedin">{t.heroTitleLinkedIn}</span> <em>{t.heroTitleEm}</em></h1>
        <p className="ls-hero__sub" dangerouslySetInnerHTML={{ __html: t.heroSubHTML }} />
        <div className="ls-stats">
          <div className="ls-stat"><div className="ls-stat__num">{t.stat1Num}</div><div className="ls-stat__label">{t.stat1Label}</div></div>
          <div className="ls-stat"><div className="ls-stat__num">{t.stat2Num}</div><div className="ls-stat__label">{t.stat2Label}</div></div>
          <div className="ls-stat"><div className="ls-stat__num">{t.stat3Num}</div><div className="ls-stat__label">{t.stat3Label}</div></div>
          <div className="ls-stat"><div className="ls-stat__num">{t.stat4Num}</div><div className="ls-stat__label">{t.stat4Label}</div></div>
        </div>
      </header>

      <div className="ls-controls">
        <div className="ls-filters" role="group" aria-label={t.filtersAriaLabel}>
          {FILTERS.map(({ f, label }) => (
            <button key={f} className={`ls-filter${activeFilter === f ? ' ls-filter--active' : ''}`} onClick={() => setActiveFilter(f)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="ls-divider"><hr /></div>

      <div className="ls-episodes">
        {visibleEps.length === 0
          ? <div className="ls-no-results" aria-live="polite"><p>{t.noResults}</p></div>
          : visibleEps.map(ep => {
              const epData = t.episodes[parseInt(ep.num, 10) - 1] ?? {}
              return (
                <div key={ep.num} className="ls-ep">
                  <div className="ls-ep__head">
                    <div className="ls-ep__num">{ep.num}</div>
                    <div className="ls-ep__info">
                      <div className="ls-ep__badges">
                        <span className={`ls-ep__lens ${lensClass(ep.lens)}`}>{getLensLabel(ep.lens)}</span>
                        {ep.tags.map(tag => <span key={tag} className="ls-ep__tag">{t[TAG_KEY_MAP[tag]] ?? tag}</span>)}
                      </div>
                      <h2 className="ls-ep__title">{epData.title}</h2>
                      <p className="ls-ep__summary">{epData.summary}</p>
                      <p className="ls-ep__why"><span className="ls-ep__why-prefix">{t.whyPrefix}</span>{epData.why}</p>
                    </div>
                  </div>
                  <div className="ls-ep__posts">
                    {ep.posts.map((p, postIdx) => {
                      const postData = epData.posts?.[postIdx] ?? {}
                      return (
                        <div key={`${ep.num}-${postIdx}`} className={`ls-post${postIdx === 0 ? ' ls-post--featured' : ''}`}>
                          <div className="ls-post__type">{t[TYPE_KEY_MAP[p.type]] ?? p.type}</div>
                          <div className="ls-post__title">{postData.title}</div>
                          <div className="ls-post__preview">{postData.preview}</div>
                          <div className="ls-post__footer">
                            <span className={`ls-post__author ${authorClass(p.author)}`}>{getAuthorLabel(p.author)}</span>
                            <span className="ls-post__status">{t.statusComingSoon}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
        }
      </div>

      <section className="ls-how">
        <div className="ls-how__inner">
          <p className="ls-how__kicker">{t.howKicker}</p>
          <h2 className="ls-how__title">{t.howTitle}</h2>
          <div className="ls-how__grid">
            {t.howItems.map(item => (
              <div key={item.n} className="ls-how__item">
                <div className="ls-how__item-icon">{item.n}</div>
                <div className="ls-how__item-title">{item.n === '01' ? <><span className="ls-linkedin">{t.heroTitleLinkedIn}</span> {t.heroTitleEm}</> : item.title}</div>
                <div className="ls-how__item-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ls-form-wrap">
        <div className="ls-form-box">
          <p className="ls-form-box__kicker">{t.formKicker}</p>
          <h2 className="ls-form-box__title">{t.formTitle}</h2>
          <p className="ls-form-box__sub">{t.formSub}</p>
          {formSubmitted ? (
            <div style={{ padding: '32px 0', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(58,125,107,.1)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 14px' }}>✓</div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--color-dark)', marginBottom: 6 }}>{t.formSuccessTitle}</p>
              <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>{t.formSuccessBody}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="ls-form-row"><label className="ls-form-label" htmlFor="topicField">{t.formLabelTopic}</label><textarea className="ls-form-textarea" id="topicField" placeholder={t.formPlaceholderTopic} value={topic} onChange={e => setTopic(e.target.value)} /></div>
              <div className="ls-form-row"><label className="ls-form-label" htmlFor="emailField">{t.formLabelEmail}</label><input className="ls-form-input" type="email" id="emailField" placeholder={t.formPlaceholderEmail} value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="ls-form-row">
                <label className="ls-form-label" htmlFor="topicCat">{t.formLabelCategory}</label>
                <select className="ls-form-select" id="topicCat" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">{t.formCategoryPlaceholder}</option>
                  <option value="internship-search">{t.catInternshipSearch}</option>
                  <option value="offers-negotiation">{t.catOffersNegotiation}</option>
                  <option value="recruiting-outreach">{t.catRecruitingOutreach}</option>
                  <option value="workplace-onboarding">{t.catWorkplaceOnboarding}</option>
                  <option value="mindset-rejection">{t.catMindsetRejection}</option>
                </select>
              </div>
              {formError && <p role="alert" style={{ color: 'var(--color-accent)', fontSize: '13px', marginBottom: '10px' }}>{formError}</p>}
              <button className="ls-form-btn" type="submit" disabled={formLoading}>{formLoading ? t.formBtnSubmitting : t.formBtnSubmit}</button>
            </form>
          )}
        </div>
      </div>

      <footer className="art-footer" style={{ maxWidth: '1040px' }}>
        <span className="art-footer__copy">{t.footerCopy}</span>
        <div className="art-footer__links">
          <Link to="/" className="art-footer__link">{t.footerHome}</Link>
          <Link to="/articles" className="art-footer__link">{t.footerArticles}</Link>
          <Link to="/career-templates" className="art-footer__link">{t.footerTemplates}</Link>
        </div>
      </footer>
    </ArticleLayout>
  )
}
