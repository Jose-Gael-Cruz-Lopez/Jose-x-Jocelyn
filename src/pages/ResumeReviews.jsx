import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ArticleLayout from '../components/ArticleLayout'
import ResumeSubNav from '../components/ResumeSubNav'
import { supabase } from '../lib/supabase'
import { useT } from '../hooks/useT'

const LIKES_KEY = 'jxj_resume_likes_v1'

const COMPANIES = {
  google:    { name: 'Google',    slug: 'google',    hex: '4285F4' },
  apple:     { name: 'Apple',     slug: 'apple',     hex: '555555' },
  microsoft: { name: 'Microsoft', slug: 'microsoft', hex: '5E5E5E' },
  meta:      { name: 'Meta',      slug: 'meta',      hex: '0082FB' },
  amazon:    { name: 'Amazon',    slug: 'amazon',    hex: 'FF9900' },
  tiktok:    { name: 'TikTok',   slug: 'tiktok',    hex: '010101' },
  pinterest: { name: 'Pinterest', slug: 'pinterest', hex: 'E60023' },
  reddit:    { name: 'Reddit',   slug: 'reddit',    hex: 'FF4500' },
  discord:   { name: 'Discord',  slug: 'discord',   hex: '5865F2' },
  stripe:    { name: 'Stripe',   slug: 'stripe',    hex: '635BFF' },
  figma:     { name: 'Figma',    slug: 'figma',     hex: 'F24E1E' },
  dropbox:   { name: 'Dropbox',  slug: 'dropbox',   hex: '0061FF' },
  ibm:       { name: 'IBM',      slug: 'ibm',       hex: '052FAD' },
  airbnb:    { name: 'Airbnb',   slug: 'airbnb',    hex: 'FF5A5F' },
  fidelity:  { name: 'Fidelity', slug: null, letter: 'F',  color: '#006633', bg: 'rgba(0,102,51,.1)' },
  jpmorgan:  { name: 'JPMorgan', slug: null, letter: 'JP', color: '#003087', bg: 'rgba(0,48,135,.1)' },
  anthropic: { name: 'Anthropic',slug: null, letter: 'A',  color: '#C4602D', bg: 'rgba(196,96,45,.1)' },
}

const STAGE_META_STYLE = {
  intern:        { cls: 'intern',        tagCls: 'rr-tag--blue' },
  newgrad:       { cls: 'newgrad',       tagCls: 'rr-tag--teal' },
  fulltime:      { cls: 'fulltime',      tagCls: 'rr-tag--navy' },
  pivot:         { cls: 'pivot',         tagCls: 'rr-tag--accent' },
  contract:      { cls: 'contract',      tagCls: 'rr-tag--muted' },
  apprenticeship:{ cls: 'apprenticeship',tagCls: 'rr-tag--gold' },
}

function getStageMeta(stage, t) {
  const style = STAGE_META_STYLE[stage] || { cls: 'contract', tagCls: 'rr-tag--muted' }
  const labelMap = {
    intern:         t.stageInternLabel,
    newgrad:        t.stageNewGradLabel,
    fulltime:       t.stageFullTimeLabel,
    pivot:          t.stageCareerPivotLabel,
    contract:       t.stageContractLabel,
    apprenticeship: t.stageApprenticeshipLabel,
  }
  return { ...style, label: labelMap[stage] || stage.toUpperCase() }
}

const TAG_LABELS = {
  'first-gen':           'First-Gen',
  'non-cs':              'Non-CS Major',
  'nontraditional':      'Nontraditional',
  'transfer':            'Transfer Student',
  'career-changer':      'Career Changer',
  'community-college':   'Community College',
  'lgbtq':               'LGBTQ+',
  'veteran':             'Veteran',
  'first-gen-immigrant': 'First-Gen Immigrant',
  'disability':          'Person with Disability',
  'rural':               'Rural Background',
  'returning-adult':     'Returning Adult',
  'international':       'International Student',
  'black':               'Black / African American',
  'latinx':              'Latinx / Hispanic',
  'indigenous':          'Indigenous / Native American',
  'asian':               'Asian / Pacific Islander',
  'foster':              'Foster Care Alumni',
}

const TAG_COLOR_MAP = {
  'first-gen':           'teal',
  'non-cs':              'blue',
  'nontraditional':      'accent',
  'transfer':            'gold',
  'career-changer':      'navy',
  'community-college':   'muted',
  'lgbtq':               'teal',
  'veteran':             'navy',
  'first-gen-immigrant': 'teal',
  'disability':          'blue',
  'rural':               'gold',
  'returning-adult':     'accent',
  'international':       'blue',
  'black':               'navy',
  'latinx':              'accent',
  'indigenous':          'gold',
  'asian':               'teal',
  'foster':              'muted',
}



const SIDEBAR_COMPANIES = ['google','microsoft','meta','apple','amazon','stripe','pinterest','reddit','dropbox','fidelity','jpmorgan','anthropic']


function CoLogo({ coKey, size = 18, fullColor = false }) {
  const c = COMPANIES[coKey]
  if (!c) return <span className="rr-co-letter" style={{ background: 'rgba(0,0,0,.08)', color: 'var(--color-muted)', fontSize: '8px', width: size, height: size }}>{(coKey[0] || '?').toUpperCase()}</span>
  if (c.slug) {
    const url = fullColor ? `https://cdn.simpleicons.org/${c.slug}` : `https://cdn.simpleicons.org/${c.slug}/8A7E72`
    return <img className="rr-co-logo" style={{ width: size, height: size }} src={url} alt={c.name} width={size} height={size} loading="lazy" onError={e => { e.target.outerHTML = `<span class="rr-co-letter" style="background:rgba(0,0,0,.08);color:var(--color-muted);font-size:${Math.round(size * 0.44)}px;width:${size}px;height:${size}px;">${c.name[0]}</span>` }} />
  }
  return <span className="rr-co-letter" style={{ background: c.bg, color: c.color, fontSize: Math.round(size * 0.44), width: size, height: size }}>{c.letter}</span>
}

function TagPill({ tag, small = false, labelMap = TAG_LABELS }) {
  return <span className={`rr-tag rr-tag--${TAG_COLOR_MAP[tag] || 'muted'}`} style={{ fontSize: small ? '9px' : '10px' }}>{labelMap[tag] || tag}</span>
}

function SidebarFilters({ filter, onFilter, t }) {
  const [coSearch, setCoSearch] = useState('')
  const visibleCos = SIDEBAR_COMPANIES.filter(co => !coSearch || co.includes(coSearch.toLowerCase()) || (COMPANIES[co]?.name || '').toLowerCase().includes(coSearch.toLowerCase()))

  function toggle(arr, val) {
    return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
  }

  return (
    <div className="rr-sidebar__block">
      <div className="rr-sidebar__search-wrap">
        <input className="rr-sidebar__search" type="text" placeholder={t.filterSearchPlaceholder} autoComplete="off" value={filter.search} onChange={e => onFilter(f => ({ ...f, search: e.target.value }))} />
      </div>
      <div className="rr-filter-group">
        <span className="rr-filter-label">{t.filterRoleTypeLabel}</span>
        {t.filterRoles.map(({ value, label }) => (
          <label key={value} className="rr-check-row">
            <input type="checkbox" checked={filter.roles.includes(value)} onChange={() => onFilter(f => ({ ...f, roles: toggle(f.roles, value) }))} />
            <span>{label}</span>
          </label>
        ))}
      </div>
      <div className="rr-filter-group">
        <span className="rr-filter-label">{t.filterStageLabel}</span>
        {t.filterStages.map(({ value, label }) => (
          <label key={value} className="rr-check-row">
            <input type="checkbox" checked={filter.stages.includes(value)} onChange={() => onFilter(f => ({ ...f, stages: toggle(f.stages, value) }))} />
            <span>{label}</span>
          </label>
        ))}
      </div>
      <div className="rr-filter-group">
        <span className="rr-filter-label">{t.filterCompaniesLabel}</span>
        <div className="rr-co-chips">
          {visibleCos.map(co => (
            <button key={co} type="button" className={`rr-co-chip${filter.companies.includes(co) ? ' active' : ''}`} aria-pressed={filter.companies.includes(co)} onClick={() => onFilter(f => ({ ...f, companies: toggle(f.companies, co) }))}>
              {COMPANIES[co]?.slug
                ? <img src={`https://cdn.simpleicons.org/${COMPANIES[co].slug}/8A7E72`} alt={COMPANIES[co]?.name || co} width="13" height="13" loading="lazy" />
                : null
              }
              {COMPANIES[co]?.name || co}
            </button>
          ))}
        </div>
        <input className="rr-co-search" type="text" placeholder={t.filterCompanySearchPlaceholder} autoComplete="off" value={coSearch} onChange={e => setCoSearch(e.target.value)} />
      </div>
      <div className="rr-filter-group">
        <span className="rr-filter-label">{t.filterBackgroundLabel}</span>
        {t.filterBackgrounds.map(({ value, label }) => (
          <label key={value} className="rr-check-row">
            <input type="checkbox" checked={filter.tags.includes(value)} onChange={() => onFilter(f => ({ ...f, tags: toggle(f.tags, value) }))} />
            <span>{label}</span>
          </label>
        ))}
      </div>
      <div className="rr-filter-group">
        <span className="rr-filter-label">{t.filterSortLabel}</span>
        <select className="rr-sort-select" value={filter.sort} onChange={e => onFilter(f => ({ ...f, sort: e.target.value }))}>
          {t.filterSortOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div style={{ padding: '12px 16px' }}>
        <button className="rr-filter-reset" onClick={() => onFilter({ search: '', roles: [], stages: [], companies: [], tags: [], sort: 'newest' })}>{t.filterClearAll}</button>
      </div>
    </div>
  )
}

function dbResumeToCard(row) {
  const companyKeys = (row.target_companies || '').split(',')
    .map(s => s.trim().toLowerCase().replace(/\s+/g, ''))
    .filter(Boolean)
  const knownCompanies = companyKeys.filter(c => COMPANIES[c]).slice(0, 3)
  const companyExtra = Math.max(0, companyKeys.length - 3)
  const submitted = new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return {
    id: row.id,
    handle: row.handle,
    role: row.role_title || row.role_type || 'Unknown Role',
    roleType: row.role_type || 'other',
    stage: row.stage || 'intern',
    companies: knownCompanies,
    companyExtra,
    tags: row.background_tags || [],
    submitted,
    featured: row.status === 'featured' ? { annotation: null } : null,
    allowDownload: row.allow_download || false,
    story: row.story || null,
    appliedRole: row.role_title || row.role_type || '',
    _storagePath: row.file_name || null,
    avatarUrl: row.avatar_url || null,
    likeCount: row.like_count || 0,
    viewCount: row.view_count || 0,
  }
}

export default function ResumeReviews() {
  const t = useT('resumeReviews')
  const [dbResumes, setDbResumes] = useState([])
  const [filter, setFilter] = useState({ search: '', roles: [], stages: [], companies: [], tags: [], sort: 'newest' })
  const [panelId, setPanelId] = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [submitSubmitted, setSubmitSubmitted] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitForm, setSubmitForm] = useState({ handle: '', email: '', linkedin: '', roleTitle: '', roleType: '', stage: '', companies: '', bgTags: [], download: 'no', story: '', annotate: 'no' })
  const [fileName, setFileName] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileRef = useRef(null)
  const avatarRef = useRef(null)
  const panelRef = useRef(null)
  const panelTriggerRef = useRef(null)

  const allResumes = dbResumes

  const visibleResumes = useMemo(() => {
    let result = allResumes.filter(r => {
      if (filter.search) {
        const q = filter.search.toLowerCase()
        if (!(r.handle + ' ' + r.role + ' ' + r.companies.join(' ')).toLowerCase().includes(q)) return false
      }
      if (filter.roles.length && !filter.roles.includes(r.roleType)) return false
      if (filter.stages.length && !filter.stages.includes(r.stage)) return false
      if (filter.companies.length && !filter.companies.some(c => r.companies.includes(c))) return false
      if (filter.tags.length && !filter.tags.every(tag => r.tags.includes(tag))) return false
      return true
    })
    if (filter.sort === 'featured') result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    if (filter.sort === 'intern') result = result.filter(r => r.stage === 'intern')
    if (filter.sort === 'newgrad') result = result.filter(r => r.stage === 'newgrad')
    return result
  }, [filter, allResumes])

  const tRoleLabelMap = useMemo(() => Object.fromEntries((t.filterRoles || []).map(({ value, label }) => [value, label])), [t])
  const tStageLabelMap = useMemo(() => Object.fromEntries((t.filterStages || []).map(({ value, label }) => [value, label])), [t])
  const tTagLabelMap = useMemo(() => Object.fromEntries((t.formBgTagOptions || []).map(({ value, label }) => [value, label])), [t])

  const activeFilters = useMemo(() => {
    const all = []
    filter.roles.forEach(v => all.push({ type: 'role', val: v, label: tRoleLabelMap[v] || v }))
    filter.stages.forEach(v => all.push({ type: 'stage', val: v, label: tStageLabelMap[v] || v }))
    filter.companies.forEach(v => all.push({ type: 'company', val: v, label: COMPANIES[v]?.name || v }))
    filter.tags.forEach(v => all.push({ type: 'tag', val: v, label: tTagLabelMap[v] || v }))
    if (filter.search) all.push({ type: 'search', val: filter.search, label: `"${filter.search}"` })
    return all
  }, [filter, tRoleLabelMap, tStageLabelMap, tTagLabelMap])

  function removeFilter(type, val) {
    setFilter(f => {
      if (type === 'role') return { ...f, roles: f.roles.filter(v => v !== val) }
      if (type === 'stage') return { ...f, stages: f.stages.filter(v => v !== val) }
      if (type === 'company') return { ...f, companies: f.companies.filter(v => v !== val) }
      if (type === 'tag') return { ...f, tags: f.tags.filter(v => v !== val) }
      if (type === 'search') return { ...f, search: '' }
      return f
    })
  }

  const panelResume = panelId ? allResumes.find(r => r.id === panelId) : null

  useEffect(() => {
    supabase.from('resume_submissions')
      .select('*')
      .in('status', ['approved', 'featured'])
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data?.length) setDbResumes(data.map(dbResumeToCard))
      })
  }, [])

  useEffect(() => {
    if (panelId || sheetOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [panelId, sheetOpen])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { setPanelId(null); setSheetOpen(false) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (panelId) {
      const firstFocusable = panelRef.current?.querySelector('a, button, [tabindex]:not([tabindex="-1"])')
      firstFocusable?.focus()
    } else if (panelTriggerRef.current) {
      panelTriggerRef.current.focus()
      panelTriggerRef.current = null
    }
  }, [panelId])

  const handlePanelKeyDown = (e) => {
    if (e.key !== 'Tab') return
    const focusable = Array.from(panelRef.current?.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])') ?? [])
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!submitForm.handle || !submitForm.email || !submitForm.roleType || !submitForm.stage || !submitForm.companies) {
      setSubmitError(t.formErrorRequired)
      return
    }
    if (!file) {
      setSubmitError(t.formErrorNoFile)
      return
    }
    setSubmitLoading(true)
    setSubmitError('')
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `pending/${Date.now()}-${safeName}`
    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(storagePath, file, { contentType: 'application/pdf', upsert: false })
    if (uploadError) {
      setSubmitLoading(false)
      setSubmitError(t.formErrorUpload)
      return
    }
    let avatar_url = null
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: avErr } = await supabase.storage.from('avatars').upload(path, avatarFile, { contentType: avatarFile.type })
      if (!avErr) {
        const { data } = supabase.storage.from('avatars').getPublicUrl(path)
        avatar_url = data.publicUrl
      }
    }
    const { error } = await supabase.from('resume_submissions').insert({
      handle: submitForm.handle,
      email: submitForm.email,
      linkedin_url: submitForm.linkedin || null,
      role_title: submitForm.roleTitle || null,
      role_type: submitForm.roleType,
      stage: submitForm.stage,
      target_companies: submitForm.companies,
      background_tags: submitForm.bgTags,
      allow_download: submitForm.download === 'yes',
      story: submitForm.story || null,
      allow_annotation: submitForm.annotate === 'yes',
      file_name: storagePath,
      status: 'approved',
      avatar_url,
    })
    setSubmitLoading(false)
    if (error) { setSubmitError(t.formErrorGeneric) }
    else { setSubmitSubmitted(true) }
  }

  function toggleBgTag(tag) {
    setSubmitForm(f => ({
      ...f,
      bgTags: f.bgTags.includes(tag) ? f.bgTags.filter(t => t !== tag) : [...f.bgTags, tag]
    }))
  }

  return (
    <ArticleLayout title={`${t.heroTitle} ${t.heroTitleEm}`}>
      <style>{`
        html, body { background: var(--color-cream); }

        .rr-divider { border: none; border-top: 1px solid rgba(0,0,0,.08); margin: 0; }
        .rr-kicker { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--color-muted); margin-bottom: 14px; }
        .rr-section-title { font-family: var(--font-display); font-size: clamp(26px,4vw,40px); font-weight: 700; color: var(--color-dark); line-height: 1.15; margin-bottom: 10px; }
        .rr-section-sub { font-family: var(--font-display); font-size: clamp(16px,2vw,20px); font-weight: 400; color: var(--color-accent); margin-bottom: 18px; }
        .rr-section-body { font-size: clamp(15px,1.8vw,17px); color: var(--color-muted); line-height: 1.75; max-width: 700px; }
        .rr-section-body strong { color: var(--color-dark); font-weight: 600; }

        .rr-tag { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; }
        .rr-tag--blue   { background: rgba(91,142,194,.12);  color: var(--color-blue); }
        .rr-tag--teal   { background: rgba(58,125,107,.1);   color: var(--color-teal); }
        .rr-tag--gold   { background: rgba(232,168,56,.14);  color: var(--color-gold-dark); }
        .rr-tag--navy   { background: rgba(22,43,68,.1);     color: var(--color-navy); }
        .rr-tag--accent { background: rgba(179,69,57,.1);    color: var(--color-accent); }

        .rr-tag--muted  { background: rgba(0,0,0,.06);       color: var(--color-muted); }

        .rr-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 13px 26px; background: var(--color-dark); color: var(--color-cream); border-radius: 8px; font-family: var(--font-display); font-size: 14px; font-weight: 600; text-decoration: none; border: 1.5px solid var(--color-dark); cursor: pointer; transition: background .2s, transform .18s cubic-bezier(.16,1,.3,1); }
        .rr-btn-primary:hover { background: var(--color-accent); border-color: var(--color-accent); transform: translateY(-1px); }
        .rr-btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 13px 26px; background: transparent; color: var(--color-dark); border-radius: 8px; font-family: var(--font-display); font-size: 14px; font-weight: 600; text-decoration: none; border: 1.5px solid rgba(0,0,0,.2); cursor: pointer; transition: border-color .2s, color .2s, transform .18s cubic-bezier(.16,1,.3,1); }
        .rr-btn-secondary:hover { border-color: var(--color-dark); color: var(--color-accent); transform: translateY(-1px); }

        /* HERO */
        .rr-hero { padding: 120px clamp(20px,5vw,56px) 64px; max-width: 1240px; margin: 0 auto; }
        .rr-hero__kicker { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--color-muted); margin-bottom: 18px; }
        .rr-hero__title { font-family: var(--font-display); font-size: clamp(42px,7vw,80px); font-weight: 700; line-height: 1.04; color: var(--color-dark); margin-bottom: 14px; }
        .rr-hero__title em { font-style: normal; color: var(--color-gold); }
        .rr-hero__sub { font-family: var(--font-display); font-size: clamp(18px,2.5vw,24px); font-weight: 400; color: var(--color-dark); line-height: 1.4; max-width: 680px; margin-bottom: 20px; }
        .rr-hero__body { font-size: clamp(15px,1.8vw,17px); color: var(--color-muted); line-height: 1.8; max-width: 680px; margin-bottom: 36px; }
        .rr-hero__body strong { color: var(--color-dark); font-weight: 600; }
        .rr-hero__ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 48px; }
        .rr-stats { display: flex; flex-wrap: wrap; gap: 36px; padding-top: 32px; border-top: 1px solid rgba(0,0,0,.08); }
        .rr-stat__num { font-family: var(--font-display); font-size: clamp(26px,3.5vw,38px); font-weight: 700; color: var(--color-dark); line-height: 1; }
        .rr-stat__num em { font-style: normal; color: var(--color-gold); }
        .rr-stat__label { font-size: 13px; color: var(--color-muted); margin-top: 5px; }

        /* LAYOUT */
        .rr-layout { max-width: 1240px; margin: 0 auto; padding: 48px clamp(20px,5vw,56px) 80px; display: grid; grid-template-columns: 256px 1fr; gap: 40px; align-items: start; }
        .rr-sidebar { position: sticky; top: 80px; max-height: calc(100vh - 100px); overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(0,0,0,.1) transparent; }
        .rr-sidebar::-webkit-scrollbar { width: 4px; }
        .rr-sidebar::-webkit-scrollbar-thumb { background: rgba(0,0,0,.12); border-radius: 4px; }
        .rr-sidebar__block { background: var(--color-white); border: 1px solid rgba(0,0,0,.08); border-radius: 14px; overflow: hidden; }
        .rr-sidebar__search-wrap { padding: 14px 16px; border-bottom: 1px solid rgba(0,0,0,.06); }
        .rr-sidebar__search { width: 100%; font-family: var(--font-body); font-size: 13px; padding: 9px 12px 9px 32px; border: 1.5px solid rgba(0,0,0,.1); border-radius: 8px; background: var(--color-cream) url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='6' cy='6' r='4.5' stroke='%238A7E72' stroke-width='1.5'/%3E%3Cpath d='M9.5 9.5L12 12' stroke='%238A7E72' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat 10px center; color: var(--color-dark); outline: none; transition: border-color .2s; box-sizing: border-box; }
        .rr-sidebar__search:focus { border-color: var(--color-gold); }
        .rr-sidebar__search::placeholder { color: var(--color-muted); }
        .rr-filter-group { padding: 14px 16px; border-bottom: 1px solid rgba(0,0,0,.06); }
        .rr-filter-group:last-child { border-bottom: none; }
        .rr-filter-label { font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--color-muted); margin-bottom: 10px; display: block; }
        .rr-check-row { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; cursor: pointer; }
        .rr-check-row:last-child { margin-bottom: 0; }
        .rr-check-row input[type="checkbox"] { width: 15px; height: 15px; accent-color: var(--color-dark); cursor: pointer; flex-shrink: 0; }
        .rr-check-row span { font-size: 13px; color: var(--color-dark); line-height: 1.3; cursor: pointer; }
        .rr-co-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
        .rr-co-chip { display: inline-flex; align-items: center; gap: 5px; padding: 16px 10px; border: 1.5px solid rgba(0,0,0,.1); border-radius: 20px; cursor: pointer; font-size: 11px; font-weight: 600; color: var(--color-muted); transition: border-color .15s, color .15s, background .15s; user-select: none; }
        .rr-co-chip:hover { border-color: var(--color-dark); color: var(--color-dark); }
        .rr-co-chip.active { border-color: var(--color-navy); background: var(--color-navy); color: var(--color-cream); }
        .rr-co-chip img { width: 13px; height: 13px; object-fit: contain; opacity: .7; }
        .rr-co-chip.active img { filter: brightness(10); opacity: 1; }
        .rr-co-chip:focus-visible { outline: 2px solid var(--color-navy); outline-offset: 2px; border-radius: 20px; }
        .rr-co-search { width: 100%; font-family: var(--font-body); font-size: 12px; padding: 7px 10px; border: 1.5px solid rgba(0,0,0,.1); border-radius: 7px; background: var(--color-cream); color: var(--color-dark); outline: none; transition: border-color .2s; box-sizing: border-box; }
        .rr-co-search:focus { border-color: var(--color-gold); }
        .rr-co-search::placeholder { color: var(--color-muted); }
        .rr-sort-select { width: 100%; font-family: var(--font-body); font-size: 13px; padding: 9px 30px 9px 10px; border: 1.5px solid rgba(0,0,0,.1); border-radius: 8px; background: var(--color-cream); color: var(--color-dark); appearance: none; cursor: pointer; outline: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238A7E72' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; transition: border-color .2s; }
        .rr-sort-select:focus { border-color: var(--color-gold); }
        .rr-filter-reset { display: block; margin-top: 12px; font-size: 12px; font-weight: 600; color: var(--color-accent); cursor: pointer; text-align: center; padding: 8px; background: rgba(179,69,57,.06); border-radius: 7px; border: none; width: 100%; font-family: var(--font-body); transition: background .2s; }
        .rr-filter-reset:hover { background: rgba(179,69,57,.12); }
        .rr-mobile-filter-btn { display: none; align-items: center; gap: 8px; padding: 10px 18px; background: var(--color-white); border: 1.5px solid rgba(0,0,0,.12); border-radius: 8px; font-family: var(--font-display); font-size: 13px; font-weight: 600; color: var(--color-dark); cursor: pointer; margin-bottom: 16px; transition: border-color .2s; }
        .rr-mobile-filter-btn:hover { border-color: var(--color-dark); }

        /* GRID AREA */
        .rr-grid-area { min-width: 0; }
        .rr-active-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 16px; min-height: 28px; }
        .rr-active-bar__label { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--color-muted); flex-shrink: 0; }
        .rr-active-chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; background: rgba(22,43,68,.08); color: var(--color-navy); border-radius: 20px; font-size: 11px; font-weight: 600; cursor: pointer; transition: background .15s; border: none; font-family: var(--font-body); }
        .rr-active-chip:hover { background: rgba(179,69,57,.1); color: var(--color-accent); }
        .rr-active-chip__x { font-size: 13px; line-height: 1; margin-left: 1px; }
        .rr-active-bar__clear { font-size: 11px; font-weight: 600; color: var(--color-accent); cursor: pointer; margin-left: auto; text-decoration: underline; background: none; border: none; font-family: var(--font-body); }
        .rr-active-bar__clear:hover { color: var(--color-dark); }
        .rr-grid-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 8px; }
        .rr-grid-count { font-size: 13px; color: var(--color-muted); font-weight: 500; }
        .rr-grid-count strong { color: var(--color-dark); font-weight: 700; }
        .rr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; contain: layout style; }
        .rr-grid--empty { grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--color-muted); font-size: 15px; line-height: 1.7; }
        .rr-grid--empty strong { display: block; font-family: var(--font-display); font-size: 18px; color: var(--color-dark); margin-bottom: 6px; }

        /* RESUME CARD */
        .rr-card { background: var(--color-white); border: 1px solid rgba(0,0,0,.08); border-radius: 14px; overflow: hidden; cursor: pointer; transition: transform .22s cubic-bezier(.16,1,.3,1), box-shadow .22s; position: relative; }
        .rr-card:hover { transform: translateY(-4px); box-shadow: 0 10px 32px rgba(0,0,0,.09); }
        .rr-card__stage-wrap { position: relative; }
        .rr-card__stage-badge { position: absolute; top: 10px; left: 10px; z-index: 2; font-size: 9px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; padding: 4px 9px; border-radius: 5px; }
        .rr-badge--intern     { background: rgba(22,43,68,.1);    color: var(--color-navy); }
        .rr-badge--newgrad    { background: rgba(58,125,107,.1);  color: var(--color-teal); }
        .rr-badge--fulltime   { background: rgba(22,43,68,.08);   color: var(--color-navy); }
        .rr-badge--apprenticeship { background: rgba(232,168,56,.12); color: var(--color-gold-dark); }
        .rr-badge--pivot      { background: rgba(179,69,57,.08);  color: var(--color-accent); }
        .rr-badge--contract   { background: rgba(0,0,0,.06);      color: var(--color-muted); }
        .rr-card__featured-badge { position: absolute; top: 10px; right: 10px; z-index: 2; display: flex; align-items: center; gap: 4px; padding: 4px 9px; border-radius: 5px; background: rgba(232,168,56,.12); color: var(--color-gold-dark); font-size: 9px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
        .rr-card__thumb { width: 100%; aspect-ratio: 8.5 / 11; background: rgba(0,0,0,.03); position: relative; overflow: hidden; }
        .rr-card__thumb-paper { position: absolute; inset: 10px 12px; background: var(--color-white); border-radius: 3px; box-shadow: 0 2px 8px rgba(0,0,0,.06); overflow: hidden; }
        .rr-card__thumb-paper::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 20%; background: linear-gradient(180deg, rgba(0,0,0,.035) 0%, transparent 100%); border-bottom: 1px solid rgba(0,0,0,.04); }
        .rr-card__thumb-paper::after { content: ''; position: absolute; top: 24%; left: 10%; right: 10%; bottom: 8%; background: repeating-linear-gradient(180deg, rgba(0,0,0,.055) 0px, rgba(0,0,0,.055) 1.5px, transparent 1.5px, transparent 9px); }
        .rr-card__thumb-name { position: absolute; top: 6%; left: 50%; transform: translateX(-50%); width: 40%; height: 5px; border-radius: 3px; background: rgba(0,0,0,.1); }
        .rr-card__thumb-subname { position: absolute; top: 13%; left: 50%; transform: translateX(-50%); width: 55%; height: 3px; border-radius: 3px; background: rgba(0,0,0,.06); }
        .rr-card__thumb-overlay { position: absolute; inset: 0; z-index: 3; background: rgba(26,25,22,.6); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity .2s; backdrop-filter: blur(2px); }
        .rr-card:hover .rr-card__thumb-overlay { opacity: 1; }
        .rr-card__thumb-btn { display: inline-flex; align-items: center; gap: 7px; padding: 10px 20px; background: var(--color-cream); color: var(--color-dark); border-radius: 8px; font-family: var(--font-display); font-size: 13px; font-weight: 700; border: none; cursor: pointer; transform: translateY(6px); transition: transform .2s cubic-bezier(.16,1,.3,1); }
        .rr-card:hover .rr-card__thumb-btn { transform: translateY(0); }
        .rr-card__info { padding: 12px 14px 14px; border-top: 1px solid rgba(0,0,0,.07); }
        .rr-card__handle { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--color-dark); margin-bottom: 2px; }
        .rr-card__role { font-size: 12px; color: var(--color-muted); margin-bottom: 8px; }
        .rr-card__companies { display: flex; align-items: center; gap: 5px; margin-bottom: 8px; flex-wrap: wrap; }
        .rr-co-logo { width: 18px; height: 18px; object-fit: contain; border-radius: 3px; flex-shrink: 0; }
        .rr-co-letter { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 3px; font-size: 8px; font-weight: 800; flex-shrink: 0; }
        .rr-co-extra { font-size: 10px; font-weight: 700; color: var(--color-muted); }
        .rr-card__foot { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 4px; }
        .rr-card__tags { display: flex; gap: 4px; flex-wrap: wrap; }
        .rr-card__submitted { font-size: 11px; color: var(--color-muted); }

        /* HOW IT WORKS */
        .rr-howto { max-width: 1240px; margin: 0 auto; padding: 80px clamp(20px,5vw,56px); }
        .rr-howto__head { margin-bottom: 36px; }
        .rr-howto__grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .rr-howto__card { background: var(--color-white); border: 1px solid rgba(0,0,0,.08); border-radius: 16px; padding: 28px 26px; }
        .rr-howto__num { font-family: var(--font-display); font-size: 36px; font-weight: 700; color: rgba(0,0,0,.06); line-height: 1; margin-bottom: 14px; }
        .rr-howto__title { font-family: var(--font-display); font-size: 17px; font-weight: 700; color: var(--color-dark); margin-bottom: 10px; line-height: 1.3; }
        .rr-howto__body { font-size: 14px; color: var(--color-muted); line-height: 1.75; }
        @media (max-width: 700px) { .rr-howto__grid { grid-template-columns: 1fr; } }

        /* SUBMIT FORM */
        .rr-submit { max-width: 1240px; margin: 0 auto; padding: 80px clamp(20px,5vw,56px); }
        .rr-submit__layout { display: grid; grid-template-columns: 1fr 1.6fr; gap: 64px; align-items: flex-start; }
        .rr-submit__intro-kicker { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--color-muted); margin-bottom: 12px; }
        .rr-submit__intro-title { font-family: var(--font-display); font-size: clamp(22px,3vw,32px); font-weight: 700; color: var(--color-dark); line-height: 1.2; margin-bottom: 16px; }
        .rr-submit__intro-body { font-size: clamp(14px,1.6vw,15px); color: var(--color-muted); line-height: 1.75; }
        .rr-submit__intro-body strong { color: var(--color-dark); font-weight: 600; }
        .rr-submit__bullets { margin-top: 22px; display: flex; flex-direction: column; gap: 10px; }
        .rr-submit__bullet { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--color-muted); line-height: 1.5; }
        .rr-submit__bullet::before { content: '→'; color: var(--color-teal); font-weight: 700; flex-shrink: 0; margin-top: 1px; }
        .rr-form-box { background: var(--color-white); border: 1px solid rgba(0,0,0,.07); border-radius: 18px; padding: clamp(24px,4vw,44px); }
        .rr-form-row { margin-bottom: 14px; }
        .rr-form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .rr-form-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--color-muted); margin-bottom: 6px; }
        .rr-form-label span { color: var(--color-accent); }
        .rr-form-label em { font-weight: 400; text-transform: none; letter-spacing: 0; font-style: normal; }
        .rr-form-input, .rr-form-select, .rr-form-textarea { width: 100%; font-family: var(--font-body); font-size: 14px; padding: 10px 13px; border: 1.5px solid rgba(0,0,0,.12); border-radius: 8px; background: var(--color-white); color: var(--color-dark); outline: none; transition: border-color .2s; box-sizing: border-box; }
        .rr-form-input:focus, .rr-form-select:focus, .rr-form-textarea:focus { border-color: var(--color-gold); }
        .rr-form-textarea { min-height: 72px; resize: vertical; line-height: 1.6; }
        .rr-form-select { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238A7E72' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
        .rr-tag-toggles { display: flex; flex-wrap: wrap; gap: 7px; }
        .rr-tag-toggle { display: inline-flex; align-items: center; padding: 16px 13px; border: 1.5px solid rgba(0,0,0,.12); border-radius: 20px; cursor: pointer; user-select: none; font-family: var(--font-body); font-size: 12px; font-weight: 600; color: var(--color-muted); transition: all .15s; }
        .rr-tag-toggle:hover { border-color: var(--color-dark); color: var(--color-dark); }
        .rr-tag-toggle.active { border-color: var(--color-navy); background: var(--color-navy); color: var(--color-cream); }
        .rr-tag-toggle:focus-visible { outline: 2px solid var(--color-navy); outline-offset: 2px; border-radius: 20px; }
        .rr-upload-zone { width: 100%; border: 2px dashed rgba(0,0,0,.14); border-radius: 10px; padding: 24px 16px; text-align: center; cursor: pointer; transition: border-color .2s, background .2s; position: relative; }
        .rr-upload-zone:hover { border-color: var(--color-gold); background: rgba(232,168,56,.04); }
        .rr-upload-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .rr-upload-icon { font-size: 22px; margin-bottom: 6px; display: block; }
        .rr-upload-label { font-size: 13px; font-weight: 600; color: var(--color-dark); display: block; margin-bottom: 3px; }
        .rr-upload-hint { font-size: 11px; color: var(--color-muted); }
        .rr-upload-filename { font-size: 12px; color: var(--color-teal); font-weight: 600; margin-top: 8px; display: flex; align-items: center; gap: 6px; justify-content: center; }
        .rr-radio-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .rr-radio-option { display: flex; align-items: center; gap: 7px; cursor: pointer; font-size: 13px; color: var(--color-dark); }
        .rr-radio-option input[type="radio"] { accent-color: var(--color-dark); cursor: pointer; }
        .rr-form-note { font-size: 11px; color: var(--color-muted); line-height: 1.65; margin-top: 10px; font-style: italic; }
        .rr-form-btn { width: 100%; padding: 14px 24px; background: var(--color-dark); color: var(--color-cream); border: none; border-radius: 8px; font-family: var(--font-display); font-size: 14px; font-weight: 600; cursor: pointer; transition: background .2s, transform .18s; margin-top: 6px; }
        .rr-form-btn:hover { background: var(--color-teal); transform: translateY(-1px); }
        .rr-form-success { text-align: center; padding: 40px 20px; }
        .rr-form-success__icon { width: 54px; height: 54px; border-radius: 50%; background: rgba(58,125,107,.1); color: var(--color-teal); display: flex; align-items: center; justify-content: center; font-size: 22px; margin: 0 auto 16px; }
        .rr-form-success__title { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--color-dark); margin-bottom: 8px; }
        .rr-form-success__body { font-size: 14px; color: var(--color-muted); line-height: 1.7; }
        @media (max-width: 740px) { .rr-submit__layout { grid-template-columns: 1fr; gap: 36px; } .rr-form-row-2 { grid-template-columns: 1fr; } }

        /* PANEL */
        .rr-overlay { position: fixed; inset: 0; z-index: 900; background: rgba(26,25,22,.5); backdrop-filter: blur(4px); opacity: 0; pointer-events: none; transition: opacity .3s; }
        .rr-overlay.open { opacity: 1; pointer-events: all; }
        .rr-panel { position: fixed; top: 0; right: 0; bottom: 0; z-index: 901; width: min(520px, 100vw); background: var(--color-cream); box-shadow: -8px 0 40px rgba(0,0,0,.15); transform: translateX(100%); transition: transform .38s cubic-bezier(.16,1,.3,1); display: flex; flex-direction: column; overflow: hidden; }
        .rr-panel.open { transform: translateX(0); }
        .rr-panel__head { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px 16px; border-bottom: 1px solid rgba(0,0,0,.08); flex-shrink: 0; }
        .rr-panel__close { display: flex; align-items: center; justify-content: center; min-width: 44px; min-height: 44px; border-radius: 8px; background: rgba(0,0,0,.06); border: none; cursor: pointer; font-size: 16px; color: var(--color-dark); transition: background .2s; }
        .rr-panel__close:hover { background: rgba(0,0,0,.1); }
        .rr-panel__close:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px; border-radius: 8px; }
        .rr-panel__title { font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--color-dark); }
        .rr-panel__body { flex: 1; overflow-y: auto; padding: 22px; scrollbar-width: thin; }
        .rr-panel__thumb { width: 100%; aspect-ratio: 8.5 / 11; background: var(--color-paper); border-radius: 10px; overflow: hidden; border: 1px solid rgba(0,0,0,.08); margin-bottom: 20px; position: relative; }
        .rr-panel__thumb-paper { position: absolute; inset: 14px 18px; background: var(--color-white); border-radius: 4px; box-shadow: 0 4px 16px rgba(0,0,0,.1); overflow: hidden; }
        .rr-panel__thumb-paper::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 18%; background: linear-gradient(180deg, rgba(0,0,0,.03) 0%, transparent 100%); border-bottom: 1px solid rgba(0,0,0,.04); }
        .rr-panel__thumb-paper::after { content: ''; position: absolute; top: 22%; left: 8%; right: 8%; bottom: 6%; background: repeating-linear-gradient(180deg, rgba(0,0,0,.05) 0px, rgba(0,0,0,.05) 1.5px, transparent 1.5px, transparent 10px); }
        .rr-panel__thumb-name { position: absolute; top: 5%; left: 50%; transform: translateX(-50%); width: 38%; height: 6px; background: rgba(0,0,0,.1); border-radius: 3px; }
        .rr-panel__thumb-sub { position: absolute; top: 11%; left: 50%; transform: translateX(-50%); width: 50%; height: 4px; background: rgba(0,0,0,.06); border-radius: 3px; }
        .rr-panel__no-preview { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--color-muted); font-size: 14px; gap: 10px; }
        .rr-panel__no-preview-icon { font-size: 36px; opacity: .4; }
        .rr-panel__meta { display: flex; flex-direction: column; gap: 14px; }
        .rr-panel__meta-row { display: flex; flex-direction: column; gap: 4px; }
        .rr-panel__meta-label { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--color-muted); }
        .rr-panel__meta-val { font-size: 14px; color: var(--color-dark); font-weight: 600; }
        .rr-panel__meta-co { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
        .rr-panel__meta-tags { display: flex; gap: 5px; flex-wrap: wrap; }
        .rr-panel__annotation { margin-top: 16px; padding: 16px 18px; background: rgba(232,168,56,.1); border-radius: 10px; }
        .rr-panel__annotation-label { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--color-gold-dark); margin-bottom: 6px; }
        .rr-panel__annotation-text { font-size: 14px; color: var(--color-dark); line-height: 1.7; font-style: italic; }
        .rr-panel__story { margin-top: 16px; padding: 14px 16px; background: rgba(58,125,107,.07); border-radius: 10px; font-size: 13px; color: var(--color-muted); line-height: 1.7; }
        .rr-panel__story-label { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--color-teal); margin-bottom: 5px; }
        .rr-panel__foot { padding: 16px 22px; border-top: 1px solid rgba(0,0,0,.08); display: flex; gap: 10px; flex-shrink: 0; }
        .rr-panel__dl-btn { flex: 1; padding: 12px; background: var(--color-dark); color: var(--color-cream); border-radius: 8px; border: none; cursor: pointer; font-family: var(--font-display); font-size: 13px; font-weight: 600; transition: background .2s; display: flex; align-items: center; justify-content: center; gap: 7px; }
        .rr-panel__dl-btn:hover { background: var(--color-teal); }
        .rr-panel__dl-btn:disabled { background: rgba(0,0,0,.08); color: var(--color-muted); cursor: default; }
        .rr-panel__share-btn { padding: 12px 16px; background: transparent; border: 1.5px solid rgba(0,0,0,.14); border-radius: 8px; cursor: pointer; font-family: var(--font-display); font-size: 13px; font-weight: 600; color: var(--color-muted); transition: border-color .2s, color .2s; }
        .rr-panel__share-btn:hover { border-color: var(--color-dark); color: var(--color-dark); }

        /* MOBILE SHEET */
        .rr-sheet-overlay { position: fixed; inset: 0; z-index: 800; background: rgba(26,25,22,.4); opacity: 0; pointer-events: none; transition: opacity .3s; }
        .rr-sheet-overlay.open { opacity: 1; pointer-events: all; }
        .rr-sheet { position: fixed; bottom: 0; left: 0; right: 0; z-index: 801; background: var(--color-cream); border-radius: 20px 20px 0 0; max-height: 85vh; overflow-y: auto; padding: 0 0 32px; transform: translateY(100%); transition: transform .38s cubic-bezier(.16,1,.3,1); }
        .rr-sheet.open { transform: translateY(0); }
        .rr-sheet__handle { display: flex; align-items: center; justify-content: center; padding: 14px; }
        .rr-sheet__handle::before { content: ''; width: 36px; height: 4px; background: rgba(0,0,0,.15); border-radius: 2px; }
        .rr-sheet__head { display: flex; align-items: center; justify-content: space-between; padding: 0 20px 14px; border-bottom: 1px solid rgba(0,0,0,.08); }
        .rr-sheet__title { font-family: var(--font-display); font-size: 17px; font-weight: 700; color: var(--color-dark); }
        .rr-sheet__close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; background: rgba(0,0,0,.06); border: none; cursor: pointer; font-size: 16px; color: var(--color-dark); }
        .rr-sheet__body { padding: 16px 20px; }

        /* ECOSYSTEM */
        .rr-eco { background: var(--color-dark); padding: 80px clamp(20px,5vw,56px); }
        .rr-eco__inner { max-width: 1240px; margin: 0 auto; }
        .rr-eco__kicker { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(242,228,206,.4); margin-bottom: 10px; }
        .rr-eco__title { font-family: var(--font-display); font-size: clamp(20px,3vw,30px); font-weight: 700; color: var(--color-cream); margin-bottom: 8px; line-height: 1.25; }
        .rr-eco__body { font-size: clamp(14px,1.6vw,15px); color: rgba(242,228,206,.55); line-height: 1.75; max-width: 680px; margin-bottom: 36px; }
        .rr-eco__grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(190px,1fr)); gap: 14px; }
        .rr-eco__link { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09); border-radius: 12px; padding: 18px 20px; text-decoration: none; transition: background .2s, transform .2s cubic-bezier(.16,1,.3,1); display: block; }
        .rr-eco__link:hover { background: rgba(255,255,255,.09); transform: translateY(-2px); }
        .rr-eco__link-title { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--color-cream); margin-bottom: 4px; }
        .rr-eco__link-desc { font-size: 12px; color: rgba(242,228,206,.45); line-height: 1.5; }

        /* CLOSING */
        .rr-closing { background: var(--color-teal); padding: 64px clamp(20px,5vw,56px); text-align: center; }
        .rr-closing__inner { max-width: 640px; margin: 0 auto; }
        .rr-closing__headline { font-family: var(--font-display); font-size: clamp(22px,4vw,34px); font-weight: 700; color: var(--color-cream); line-height: 1.2; margin-bottom: 28px; }
        .rr-closing__btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
        .rr-closing__btn-p { display: inline-flex; align-items: center; gap: 8px; padding: 13px 26px; background: var(--color-cream); color: var(--color-teal); border-radius: 8px; font-family: var(--font-display); font-size: 14px; font-weight: 700; text-decoration: none; border: 1.5px solid var(--color-cream); transition: background .2s, color .2s, transform .18s; }
        .rr-closing__btn-p:hover { background: var(--color-dark); color: var(--color-cream); border-color: var(--color-dark); transform: translateY(-1px); }
        .rr-closing__btn-s { display: inline-flex; align-items: center; gap: 8px; padding: 13px 26px; background: transparent; color: var(--color-cream); border-radius: 8px; font-family: var(--font-display); font-size: 14px; font-weight: 700; text-decoration: none; border: 1.5px solid rgba(242,228,206,.5); transition: border-color .2s, background .2s, transform .18s; }
        .rr-closing__btn-s:hover { border-color: var(--color-cream); background: rgba(255,255,255,.1); transform: translateY(-1px); }

        /* RESPONSIVE */
        @media (max-width: 960px) {
          .rr-layout { grid-template-columns: 1fr; }
          .rr-sidebar { position: static; max-height: none; display: none; }
          .rr-mobile-filter-btn { display: inline-flex; }
          .rr-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) { .rr-grid { grid-template-columns: 1fr; } .rr-panel { width: 100vw; } }
        @media (max-width: 768px) { .rr-hero { padding: 88px 20px 48px; } .rr-stats { gap: 20px; } .rr-hero__ctas { flex-wrap: wrap; } }
        @media (max-width: 480px) {
          .rr-hero { padding: 80px 16px 40px; }
          .rr-hero__ctas { flex-direction: column; }
          .rr-hero__ctas a { justify-content: center; }
          .rr-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .rr-panel { top: auto; bottom: 0; right: 0; left: 0; width: 100vw; height: 85vh; border-radius: 16px 16px 0 0; }
        }
      `}</style>

      {/* HERO */}
      <header className="rr-hero" id="top">
        <p className="rr-hero__kicker">{t.heroKicker}</p>
        <h1 className="rr-hero__title">{t.heroTitle} <em>{t.heroTitleEm}</em></h1>
        <p className="rr-hero__sub">{t.heroSub}</p>
        <p className="rr-hero__body">
          {t.heroBody} <strong>{t.heroBodyStrong}</strong>
        </p>
        <div className="rr-hero__ctas">
          <a href="#browse" className="rr-btn-primary">{t.heroCta1}</a>
          <a href="#submit" className="rr-btn-secondary">{t.heroCta2}</a>
        </div>
        <div className="rr-stats">
          <div><div className="rr-stat__num">{t.statResumesNum}</div><div className="rr-stat__label">{t.statResumesLabel}</div></div>
          <div><div className="rr-stat__num">{t.statCompaniesNum}</div><div className="rr-stat__label">{t.statCompaniesLabel}</div></div>
          <div><div className="rr-stat__num">{t.statRolesNum}</div><div className="rr-stat__label">{t.statRolesLabel}</div></div>
          <div><div className="rr-stat__num">{t.statUpdatedNum}</div><div className="rr-stat__label">{t.statUpdatedLabel}</div></div>
        </div>
      </header>

      <hr className="rr-divider" />

      {/* MAIN LAYOUT */}
      <div className="rr-layout" id="browse">
        <aside className="rr-sidebar">
          <SidebarFilters filter={filter} onFilter={setFilter} t={t} />
        </aside>

        <div className="rr-grid-area">
          <button className="rr-mobile-filter-btn" onClick={() => setSheetOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            {t.mobileFilterBtn}
          </button>

          {activeFilters.length > 0 && (
            <div className="rr-active-bar">
              <span className="rr-active-bar__label">{t.activeFiltersLabel}</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {activeFilters.map(item => (
                  <button key={`${item.type}-${item.val}`} className="rr-active-chip" onClick={() => removeFilter(item.type, item.val)}>
                    {item.label} <span className="rr-active-chip__x">×</span>
                  </button>
                ))}
              </div>
              <button className="rr-active-bar__clear" onClick={() => setFilter({ search: '', roles: [], stages: [], companies: [], tags: [], sort: 'newest' })}>{t.clearAll}</button>
            </div>
          )}

          <div className="rr-grid-meta">
            <p className="rr-grid-count"><strong>{visibleResumes.length}</strong> {t.gridCountOf} <strong>{allResumes.length}</strong> {t.gridCountResumes}</p>
          </div>

          <div className="rr-grid">
            {visibleResumes.length === 0 ? (
              <div className="rr-grid--empty">
                <strong>{t.gridEmptyStrong}</strong>
                {t.gridEmptyBody}
              </div>
            ) : visibleResumes.map(r => {
              const sm = getStageMeta(r.stage, t)
              return (
                <article key={r.id} className="rr-card" onClick={() => { panelTriggerRef.current = document.activeElement; setPanelId(r.id) }} tabIndex={0} role="button" aria-label={`${t.cardViewBtn} ${r.handle}`} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { panelTriggerRef.current = e.currentTarget; setPanelId(r.id) } }}>
                  <div className="rr-card__stage-wrap">
                    <span className={`rr-card__stage-badge rr-badge--${sm.cls}`}>{sm.label}</span>
                    {r.featured && <span className="rr-card__featured-badge">{t.cardFeaturedBadge}</span>}
                    <div className="rr-card__thumb">
                      <div className="rr-card__thumb-paper">
                        <div className="rr-card__thumb-name" />
                        <div className="rr-card__thumb-subname" />
                      </div>
                      <div className="rr-card__thumb-overlay">
                        <button className="rr-card__thumb-btn">{t.cardViewBtn}</button>
                      </div>
                    </div>
                  </div>
                  <div className="rr-card__info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      {r.avatarUrl
                        ? <img src={r.avatarUrl} alt="" width={28} height={28} style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        : <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,.07)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', flexShrink: 0 }}>{(r.handle?.[0] || '?').toUpperCase()}</span>
                      }
                      <div className="rr-card__handle">@{r.handle}</div>
                    </div>
                    <div className="rr-card__role">{r.role}</div>
                    <div className="rr-card__companies">
                      {r.companies.slice(0, 3).map(co => <CoLogo key={co} coKey={co} size={18} />)}
                      {r.companyExtra > 0 && <span className="rr-co-extra">+{r.companyExtra}</span>}
                    </div>
                    <div className="rr-card__foot">
                      <div className="rr-card__tags">
                        {r.tags.map(tag => <TagPill key={tag} tag={tag} small labelMap={tTagLabelMap} />)}
                      </div>
                      <span className="rr-card__submitted">{r.submitted}</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      <hr className="rr-divider" />

      {/* HOW IT WORKS */}
      <section className="rr-howto">
        <div className="rr-howto__head">
          <p className="rr-kicker">{t.howKicker}</p>
          <h2 className="rr-section-title">{t.howTitle}</h2>
          <p className="rr-section-sub">{t.howSub}</p>
        </div>
        <div className="rr-howto__grid">
          <div className="rr-howto__card">
            <div className="rr-howto__num">{t.howStep1Num}</div>
            <div className="rr-howto__title">{t.howStep1Title}</div>
            <p className="rr-howto__body">{t.howStep1Body}</p>
          </div>
          <div className="rr-howto__card">
            <div className="rr-howto__num">{t.howStep2Num}</div>
            <div className="rr-howto__title">{t.howStep2Title}</div>
            <p className="rr-howto__body">{t.howStep2Body}</p>
          </div>
          <div className="rr-howto__card">
            <div className="rr-howto__num">{t.howStep3Num}</div>
            <div className="rr-howto__title">{t.howStep3Title}</div>
            <p className="rr-howto__body">{t.howStep3Body}</p>
          </div>
        </div>
      </section>

      <hr className="rr-divider" />

      {/* SUBMIT FORM */}
      <section className="rr-submit" id="submit">
        <div className="rr-submit__layout">
          <div>
            <p className="rr-submit__intro-kicker">{t.submitKicker}</p>
            <h2 className="rr-submit__intro-title">{t.submitTitle}</h2>
            <p className="rr-submit__intro-body">{t.submitBody} <strong>{t.submitBodyStrong}</strong> {t.submitBodyTail}</p>
            <div className="rr-submit__bullets">
              <div className="rr-submit__bullet">{t.submitBullet1}</div>
              <div className="rr-submit__bullet">{t.submitBullet2}</div>
              <div className="rr-submit__bullet">{t.submitBullet3}</div>
              <div className="rr-submit__bullet">{t.submitBullet4}</div>
            </div>
          </div>
          <div className="rr-form-box">
            {submitSubmitted ? (
              <div className="rr-form-success">
                <div className="rr-form-success__icon">{t.formSuccessIcon}</div>
                <div className="rr-form-success__title">{t.formSuccessTitle}</div>
                <p className="rr-form-success__body">{t.formSuccessBody}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="rr-form-row rr-form-row-2">
                  <div>
                    <label className="rr-form-label" htmlFor="sfHandle">{t.formLabelHandle} <span>{t.formLabelHandleRequired}</span></label>
                    <input className="rr-form-input" type="text" id="sfHandle" placeholder={t.formPlaceholderHandle} value={submitForm.handle} onChange={e => setSubmitForm(f => ({ ...f, handle: e.target.value }))} />
                  </div>
                  <div>
                    <label className="rr-form-label" htmlFor="sfEmail">{t.formLabelEmail} <span>{t.formLabelEmailRequired}</span> <em>{t.formLabelEmailNote}</em></label>
                    <input className="rr-form-input" type="email" id="sfEmail" placeholder={t.formPlaceholderEmail} value={submitForm.email} onChange={e => setSubmitForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>
                <div className="rr-form-row">
                  <label className="rr-form-label" htmlFor="sfLinkedIn">{t.formLabelLinkedIn} <em>{t.formLabelLinkedInNote}</em></label>
                  <input className="rr-form-input" type="url" id="sfLinkedIn" placeholder={t.formPlaceholderLinkedIn} value={submitForm.linkedin} onChange={e => setSubmitForm(f => ({ ...f, linkedin: e.target.value }))} />
                </div>
                <div className="rr-form-row rr-form-row-2">
                  <div>
                    <label className="rr-form-label" htmlFor="sfRoleTitle">{t.formLabelRoleTitle} <span>{t.formLabelRoleTitleRequired}</span></label>
                    <input className="rr-form-input" type="text" id="sfRoleTitle" placeholder={t.formPlaceholderRoleTitle} value={submitForm.roleTitle} onChange={e => setSubmitForm(f => ({ ...f, roleTitle: e.target.value }))} />
                  </div>
                  <div>
                    <label className="rr-form-label" htmlFor="sfRoleType">{t.formLabelRoleType} <span>{t.formLabelRoleTypeRequired}</span></label>
                    <select className="rr-form-select" id="sfRoleType" value={submitForm.roleType} onChange={e => setSubmitForm(f => ({ ...f, roleType: e.target.value }))}>
                      <option value="">{t.formSelectRoleTypePlaceholder}</option>
                      {t.formRoleOptions.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="rr-form-row">
                  <label className="rr-form-label" htmlFor="sfStage">{t.formLabelStage} <span>{t.formLabelStageRequired}</span></label>
                  <select className="rr-form-select" id="sfStage" value={submitForm.stage} onChange={e => setSubmitForm(f => ({ ...f, stage: e.target.value }))}>
                    <option value="">{t.formSelectStagePlaceholder}</option>
                    {t.formStageOptions.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="rr-form-row">
                  <label className="rr-form-label" htmlFor="sfCompanies">{t.formLabelCompanies} <span>{t.formLabelCompaniesRequired}</span></label>
                  <input className="rr-form-input" type="text" id="sfCompanies" placeholder={t.formPlaceholderCompanies} value={submitForm.companies} onChange={e => setSubmitForm(f => ({ ...f, companies: e.target.value }))} />
                </div>
                <div className="rr-form-row">
                  <label className="rr-form-label" style={{ marginBottom: '10px' }}>{t.formLabelBgTags} <em>{t.formLabelBgTagsNote}</em></label>
                  <div className="rr-tag-toggles">
                    {t.formBgTagOptions.map(({ value, label }) => (
                      <button key={value} type="button" className={`rr-tag-toggle${submitForm.bgTags.includes(value) ? ' active' : ''}`} aria-pressed={submitForm.bgTags.includes(value)} onClick={() => toggleBgTag(value)}>{label}</button>
                    ))}
                  </div>
                </div>
                <div className="rr-form-row">
                  <label className="rr-form-label">{t.formLabelAvatar} <em>{t.formLabelAvatarNote}</em></label>
                  <div className="rr-upload-zone" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', cursor: 'pointer' }} onClick={() => avatarRef.current?.click()}>
                    <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                      const f = e.target.files?.[0]
                      if (f) { setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)) }
                    }} />
                    {avatarPreview
                      ? <img src={avatarPreview} alt="Preview" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-muted)', flexShrink: 0 }} aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    }
                    <div>
                      <span className="rr-upload-label" style={{ display: 'block', textAlign: 'left' }}>{avatarFile ? avatarFile.name : t.formAvatarLabel}</span>
                      <span className="rr-upload-hint">{t.formAvatarHint}</span>
                    </div>
                  </div>
                </div>
                <div className="rr-form-row">
                  <label className="rr-form-label">{t.formLabelResume} <span>{t.formLabelResumeRequired}</span> <em>{t.formLabelResumeNote}</em></label>
                  <div className="rr-upload-zone">
                    <input ref={fileRef} type="file" id="sfFile" accept=".pdf" onChange={e => { if (e.target.files[0]) setFileName(e.target.files[0].name) }} />
                    <svg className="rr-upload-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    <span className="rr-upload-label">{t.formResumeUploadLabel}</span>
                    <span className="rr-upload-hint">{t.formResumeUploadHint}</span>
                    {fileName && <div className="rr-upload-filename"><span>✓</span><span>{fileName}</span></div>}
                  </div>
                </div>
                <div className="rr-form-row">
                  <label className="rr-form-label">{t.formLabelDownload} <span>{t.formLabelDownloadRequired}</span></label>
                  <div className="rr-radio-row">
                    <label className="rr-radio-option"><input type="radio" name="sfDownload" value="yes" checked={submitForm.download === 'yes'} onChange={() => setSubmitForm(f => ({ ...f, download: 'yes' }))} /> {t.formDownloadYes}</label>
                    <label className="rr-radio-option"><input type="radio" name="sfDownload" value="no" checked={submitForm.download === 'no'} onChange={() => setSubmitForm(f => ({ ...f, download: 'no' }))} /> {t.formDownloadNo}</label>
                  </div>
                </div>
                <div className="rr-form-row">
                  <label className="rr-form-label" htmlFor="sfStory">{t.formLabelStory} <em>{t.formLabelStoryNote}</em></label>
                  <textarea className="rr-form-textarea" id="sfStory" placeholder={t.formPlaceholderStory} value={submitForm.story} onChange={e => setSubmitForm(f => ({ ...f, story: e.target.value }))} />
                </div>
                <div className="rr-form-row">
                  <label className="rr-form-label">{t.formLabelAnnotate} <em>{t.formLabelAnnotateNote}</em></label>
                  <div className="rr-radio-row">
                    <label className="rr-radio-option"><input type="radio" name="sfAnnotate" value="yes" checked={submitForm.annotate === 'yes'} onChange={() => setSubmitForm(f => ({ ...f, annotate: 'yes' }))} /> {t.formAnnotateYes}</label>
                    <label className="rr-radio-option"><input type="radio" name="sfAnnotate" value="no" checked={submitForm.annotate === 'no'} onChange={() => setSubmitForm(f => ({ ...f, annotate: 'no' }))} /> {t.formAnnotateNo}</label>
                  </div>
                </div>
                {submitError && <p role="alert" style={{ color: 'var(--color-accent)', fontSize: '13px', marginBottom: '10px' }}>{submitError}</p>}
                <button className="rr-form-btn" type="submit" disabled={submitLoading}>{submitLoading ? t.formSubmitting : t.formSubmit}</button>
                <p className="rr-form-note">{t.formNote}</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="rr-eco">
        <div className="rr-eco__inner">
          <p className="rr-eco__kicker">{t.ecoKicker}</p>
          <h2 className="rr-eco__title">{t.ecoTitle}</h2>
          <p className="rr-eco__body">{t.ecoBody}</p>
          <div className="rr-eco__grid">
            {t.ecoLinks.map(link => (
              <Link key={link.to} to={link.to} className="rr-eco__link">
                <div className="rr-eco__link-title">{link.title}</div>
                <div className="rr-eco__link-desc">{link.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="rr-closing">
        <div className="rr-closing__inner">
          <h2 className="rr-closing__headline">{t.closingHeadline}</h2>
          <div className="rr-closing__btns">
            <a href="#browse" className="rr-closing__btn-p">{t.closingBtn1}</a>
            <a href="#submit" className="rr-closing__btn-s">{t.closingBtn2}</a>
          </div>
        </div>
      </section>

      {/* RESUME DETAIL PANEL */}
      <div className={`rr-overlay${panelId ? ' open' : ''}`} onClick={() => setPanelId(null)} />
      <div className={`rr-panel${panelId ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label={t.panelTitle} ref={panelRef} onKeyDown={handlePanelKeyDown}>
        <div className="rr-panel__head">
          <span className="rr-panel__title">{t.panelTitle}</span>
          <button className="rr-panel__close" onClick={() => setPanelId(null)} aria-label={t.panelCloseLabel}>✕</button>
        </div>
        {panelResume && (
          <>
            <div className="rr-panel__body">
              <div className="rr-panel__thumb">
                <div className="rr-panel__thumb-paper">
                  <div className="rr-panel__thumb-name" />
                  <div className="rr-panel__thumb-sub" />
                </div>
                <div className="rr-panel__no-preview">
                  <svg className="rr-panel__no-preview-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  <span>{t.panelNoPreview}</span>
                  <span style={{ fontSize: '11px', opacity: .6 }}>{t.panelNoPreviewSub}</span>
                </div>
              </div>
              <div className="rr-panel__meta">
                <div className="rr-panel__meta-row">
                  <span className="rr-panel__meta-label">{t.panelMetaSubmittedBy}</span>
                  <span className="rr-panel__meta-val">@{panelResume.handle}</span>
                </div>
                <div className="rr-panel__meta-row">
                  <span className="rr-panel__meta-label">{t.panelMetaAppliedRole}</span>
                  <span className="rr-panel__meta-val">{panelResume.appliedRole}</span>
                </div>
                <div className="rr-panel__meta-row">
                  <span className="rr-panel__meta-label">{t.panelMetaStage}</span>
                  <span className={`rr-tag ${getStageMeta(panelResume.stage, t).tagCls}`}>{getStageMeta(panelResume.stage, t).label}</span>
                </div>
                <div className="rr-panel__meta-row">
                  <span className="rr-panel__meta-label">{t.panelMetaTraction}</span>
                  <div className="rr-panel__meta-co">
                    {panelResume.companies.map(co => <CoLogo key={co} coKey={co} size={22} />)}
                    {panelResume.companyExtra > 0 && <span className="rr-co-extra">+{panelResume.companyExtra}</span>}
                  </div>
                </div>
                {panelResume.tags.length > 0 && (
                  <div className="rr-panel__meta-row">
                    <span className="rr-panel__meta-label">{t.panelMetaBackground}</span>
                    <div className="rr-panel__meta-tags">{panelResume.tags.map(tag => <TagPill key={tag} tag={tag} labelMap={tTagLabelMap} />)}</div>
                  </div>
                )}
                <div className="rr-panel__meta-row">
                  <span className="rr-panel__meta-label">{t.panelMetaSubmitted}</span>
                  <span className="rr-panel__meta-val">{panelResume.submitted}</span>
                </div>
              </div>
              {panelResume.featured && (
                <div className="rr-panel__annotation">
                  <div className="rr-panel__annotation-label">{t.panelAnnotationLabel}</div>
                  <div className="rr-panel__annotation-text">"{panelResume.featured.annotation}"</div>
                </div>
              )}
              {panelResume.story && (
                <div className="rr-panel__story">
                  <div className="rr-panel__story-label">{t.panelStoryLabel}</div>
                  {panelResume.story}
                </div>
              )}
            </div>
            <div className="rr-panel__foot">
              <button className="rr-panel__dl-btn" disabled={!panelResume.allowDownload}>
                {panelResume.allowDownload ? t.panelDownloadBtn : t.panelDownloadDisabled}
              </button>
              <button className="rr-panel__share-btn" onClick={() => setPanelId(null)}>{t.panelBackBtn}</button>
            </div>
          </>
        )}
      </div>

      {/* MOBILE FILTER SHEET */}
      <div className={`rr-sheet-overlay${sheetOpen ? ' open' : ''}`} onClick={() => setSheetOpen(false)} />
      <div className={`rr-sheet${sheetOpen ? ' open' : ''}`}>
        <div className="rr-sheet__handle" />
        <div className="rr-sheet__head">
          <span className="rr-sheet__title">{t.sheetTitle}</span>
          <button className="rr-sheet__close" onClick={() => setSheetOpen(false)}>✕</button>
        </div>
        <div className="rr-sheet__body">
          <SidebarFilters filter={filter} onFilter={setFilter} t={t} />
        </div>
      </div>
    </ArticleLayout>
  )
}
