import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import ArticleLayout from '../components/ArticleLayout'
import { supabase } from '../lib/supabase'
import { useT } from '../hooks/useT'


const TEMPLATE_TEXT = `Hi [Name],

I came across your profile on the Coffee Chat Network and your path from [their background] really stood out to me — I'm currently [your situation, e.g. a first-gen CS junior trying to break into data roles].

Would you be open to a 15–30 minute chat sometime in the next few weeks? I have specific questions about [topic you read on their card].

No worries at all if your schedule is full. Thank you either way!`

const FUNCTION_OPTIONS = [
  'Software Engineering', 'Data / Analytics', 'Product Management', 'UX / UI Design',
  'Research', 'Business / Operations', 'Recruiting / HR', 'Marketing', 'Sales',
  'Finance / Accounting', 'Consulting', 'Legal', 'Healthcare / Medicine',
  'Education / Teaching', 'Cybersecurity', 'DevOps / Infrastructure',
  'Machine Learning / AI', 'Mobile Development', 'QA / Testing',
  'Project / Program Management', 'Social Work / Nonprofit', 'Journalism / Media',
  'Architecture / Engineering', 'Customer Success', 'Other',
]

const IDENTITY_OPTIONS = [
  'First-Generation College Student', 'Low-Income Background', 'Transfer Student',
  'Community College', 'International Student', 'Nontraditional Path',
  'DACA / Undocumented', 'Black / African American', 'Latinx / Hispanic',
  'Indigenous / Native American', 'Asian / Pacific Islander', 'LGBTQ+',
  'First-Gen Immigrant', 'Veteran', 'Person with Disability', 'Single Parent',
  'Rural Background', 'Career Changer', 'Returning Adult Student',
  'Foster Care Alumni', 'Other',
]

function MultiSelectDropdown({ options, selected, onChange, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  const toggle = (val) => onChange(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(o => !o)} className="cc-ms-trigger" aria-haspopup="listbox" aria-expanded={open}>
        <span className={selected.length ? '' : 'cc-ms-placeholder'}>{selected.length ? selected.join(', ') : placeholder}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="cc-ms-menu" role="listbox" aria-multiselectable="true">
          {options.map(opt => (
            <label key={opt} className={`cc-ms-option${selected.includes(opt) ? ' selected' : ''}`}>
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} style={{ display: 'none' }} />
              <span className="cc-ms-check">{selected.includes(opt) ? '✓' : ''}</span>
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

const FUNC_HEADLINE_MAP = {
  'Software Engineering': 'Software engineer',
  'Data / Analytics': 'Data & analytics',
  'Product Management': 'Product manager',
  'UX / UI Design': 'UX/UI designer',
  'Research': 'Researcher',
  'Business / Operations': 'Business & operations',
  'Recruiting / HR': 'Recruiter / HR',
  'Marketing': 'Marketer',
  'Sales': 'Sales professional',
  'Finance / Accounting': 'Finance & accounting',
  'Consulting': 'Consultant',
  'Legal': 'Legal professional',
  'Healthcare / Medicine': 'Healthcare professional',
  'Education / Teaching': 'Educator',
  'Cybersecurity': 'Cybersecurity professional',
  'DevOps / Infrastructure': 'DevOps engineer',
  'Machine Learning / AI': 'ML/AI engineer',
  'Mobile Development': 'Mobile developer',
  'QA / Testing': 'QA engineer',
  'Project / Program Management': 'Program manager',
  'Social Work / Nonprofit': 'Social sector professional',
  'Journalism / Media': 'Journalist / media',
  'Architecture / Engineering': 'Architect / engineer',
  'Customer Success': 'Customer success',
}

function dbProfileToCard(row) {
  const funcColorMap = {
    'Software Engineering': 'cc-tag--blue',
    'Data / Analytics': 'cc-tag--teal',
    'Product Management': 'cc-tag--gold',
    'UX / UI Design': 'cc-tag--navy',
    'Research': 'cc-tag--navy',
    'Business / Operations': 'cc-tag--muted',
    'Recruiting / HR': 'cc-tag--accent',
    'Machine Learning / AI': 'cc-tag--teal',
    'Cybersecurity': 'cc-tag--blue',
    'DevOps / Infrastructure': 'cc-tag--blue',
    'Mobile Development': 'cc-tag--blue',
  }
  const identityColorMap = {
    'First-Generation College Student': 'cc-tag--teal',
    'First-Gen Immigrant': 'cc-tag--teal',
    'Transfer Student': 'cc-tag--blue',
    'Community College': 'cc-tag--blue',
    'International Student': 'cc-tag--navy',
    'Nontraditional Path': 'cc-tag--gold',
    'Low-Income Background': 'cc-tag--accent',
    'Career Changer': 'cc-tag--gold',
    'DACA / Undocumented': 'cc-tag--accent',
    'Latinx / Hispanic': 'cc-tag--teal',
    'Black / African American': 'cc-tag--teal',
    'Indigenous / Native American': 'cc-tag--teal',
  }
  const funcs = row.role_function || []
  const identities = row.identity_tags || []
  const tags = [
    ...identities.map(id => ({ label: id, cls: identityColorMap[id] || 'cc-tag--muted' })),
    ...funcs.map(f => ({ label: f, cls: funcColorMap[f] || 'cc-tag--muted' })),
    ...(row.location ? [{ label: row.location, cls: 'cc-tag--muted' }] : []),
  ]
  const capacityMap = { '1-2': 'Open to 1–2 chats / month', '3-5': 'Open to 3–5 chats / month', '6+': 'Open to 6+ chats / month' }
  const joined = new Date(row.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const titleLower = (row.role_title || '').toLowerCase()
  const identityLower = identities.join(' ').toLowerCase()
  const funcLower = funcs.join(' ').toLowerCase()

  let dataRole = ''
  if (/student|intern|undergraduate/.test(titleLower)) dataRole = 'student'
  else if (/new.?grad|recent.?grad|entry.?level/.test(titleLower)) dataRole = 'new-grad'
  else if (/\b(junior|jr\.?|associate)\b/.test(titleLower)) dataRole = 'early-career'
  else if (/\b(senior|sr\.?|lead|staff|principal|manager|director)\b/.test(titleLower)) dataRole = 'mid-career'
  else if (/recruit|talent.?acqui/.test(titleLower) || funcLower.includes('recruiting')) dataRole = 'recruiter'
  else if (identityLower.includes('career changer') || identityLower.includes('nontraditional') || identityLower.includes('returning adult')) dataRole = 'career-changer'

  let dataStage = ''
  if (/intern/.test(titleLower)) dataStage = 'first-internship'
  else if (/apprentice/.test(titleLower)) dataStage = 'apprenticeship'
  else if (/new.?grad|recent.?grad/.test(titleLower)) dataStage = 'first-full-time'
  else if (identityLower.includes('career changer') || identityLower.includes('nontraditional')) dataStage = 'transitioned'

  return {
    id: row.id,
    initial: (row.name || '?')[0].toUpperCase(),
    name: row.name, badge: (Date.now() - new Date(row.created_at).getTime()) < 30 * 24 * 60 * 60 * 1000 ? 'New' : 'Active',
    role: row.role_title,
    headline: funcs.length ? (FUNC_HEADLINE_MAP[funcs[0]] || funcs[0]) : row.role_title,
    topics: row.topics || '',
    tags, capacity: capacityMap[row.capacity] || row.capacity || 'Open',
    updated: `Joined ${joined}`,
    linkedIn: row.linkedin_url, avatarUrl: row.avatar_url || null,
    dataRole, dataFunc: funcLower,
    dataStage, dataIdentity: identityLower,
    dataKeywords: `${row.name} ${row.role_title} ${row.topics || ''} ${funcs.join(' ')} ${identities.join(' ')} ${row.location || ''}`.toLowerCase(),
  }
}

export default function CoffeeChat() {
  const t = useT('coffeeChat')
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterFunc, setFilterFunc] = useState('')
  const [filterStage, setFilterStage] = useState('')
  const [filterIdentity, setFilterIdentity] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalName, setModalName] = useState('')
  const [copied, setCopied] = useState(false)

  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [funcChips, setFuncChips] = useState([])
  const [identityChips, setIdentityChips] = useState([])
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoError, setPhotoError] = useState('')
  const [funcOtherText, setFuncOtherText] = useState('')
  const [identityOtherText, setIdentityOtherText] = useState('')
  const [formData, setFormData] = useState({
    name: '', pronouns: '', email: '', linkedin: '',
    role: '', location: '', topics: '', capacity: '',
    consent1: false, consent2: false,
  })

  const [dbProfiles, setDbProfiles] = useState([])
  const [profilesLoading, setProfilesLoading] = useState(true)
  const [profilesError, setProfilesError] = useState(false)
  const ccModalRef = useRef(null)

  useEffect(() => {
    supabase.from('coffee_chat_profiles')
      .select('*')
      .eq('status', 'approved')
      .eq('public_profile', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setProfilesError(true)
        } else if (data?.length) {
          setDbProfiles(data.map(dbProfileToCard))
        }
        setProfilesLoading(false)
      })
  }, [])

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        ccModalRef.current?.querySelector('button:not([disabled])')?.focus()
      }, 50)
      const onKey = (e) => { if (e.key === 'Escape') setModalOpen(false) }
      document.addEventListener('keydown', onKey)
      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', onKey)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [modalOpen])

  const visibleProfiles = dbProfiles.filter(p => {
    const q = search.toLowerCase().trim()
    if (q) {
      const haystack = [p.dataKeywords, p.name.toLowerCase(), p.dataRole, p.dataFunc, p.dataStage, p.dataIdentity].join(' ')
      if (!haystack.includes(q)) return false
    }
    if (filterRole && !p.dataRole.includes(filterRole)) return false
    if (filterFunc && !p.dataFunc.includes(filterFunc)) return false
    if (filterStage && !p.dataStage.includes(filterStage)) return false
    if (filterIdentity && !p.dataIdentity.includes(filterIdentity)) return false
    return true
  })

  const openModal = (name) => {
    setModalName(name)
    setModalOpen(true)
    setCopied(false)
  }

  const closeModal = () => {
    setModalOpen(false)
    setCopied(false)
  }

  const handleCcModalKeyDown = useCallback((e) => {
    if (e.key !== 'Tab' || !ccModalRef.current) return
    const focusable = Array.from(
      ccModalRef.current.querySelectorAll('button:not([disabled])')
    )
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }, [])

  const copyTemplate = () => {
    const text = TEMPLATE_TEXT.replace('[Name]', modalName)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, linkedin, role, topics, capacity, consent1, consent2 } = formData
    if (!name || !email || !linkedin || !role || !topics || !capacity || funcChips.length === 0) {
      setFormError(t.formErrorRequired)
      return
    }
    if (!consent1 || !consent2) {
      setFormError(t.formErrorConsent)
      return
    }
    setFormLoading(true)
    setFormError('')
    let avatar_url = null
    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, photoFile, { contentType: photoFile.type })
      if (!uploadError) {
        const { data } = supabase.storage.from('avatars').getPublicUrl(path)
        avatar_url = data.publicUrl
      }
    }
    const processedFuncChips = funcChips.map(c => c === 'Other' ? (funcOtherText.trim() || 'Other') : c)
    const processedIdentityChips = identityChips.map(c => c === 'Other' ? (identityOtherText.trim() || 'Other') : c)
    const { error } = await supabase.from('coffee_chat_profiles').insert({
      name: formData.name,
      pronouns: formData.pronouns || null,
      email: formData.email,
      linkedin_url: formData.linkedin,
      role_title: formData.role,
      location: formData.location || null,
      role_function: processedFuncChips,
      identity_tags: processedIdentityChips,
      topics: formData.topics,
      capacity: formData.capacity,
      consented_at: new Date().toISOString(),
      status: 'approved',
      public_profile: true,
      avatar_url,
    })
    setFormLoading(false)
    if (error) {
      setFormError(t.formErrorGeneric)
    } else {
      setFormSubmitted(true)
    }
  }

  return (
    <ArticleLayout title={t.pageTitle}>
      <style>{`
        html, body { background: var(--color-cream); }

        .cc-kicker { font-size: 11px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: var(--color-accent); margin-bottom: 14px; display: inline-flex; align-items: center; gap: 10px; }
        .cc-kicker::after { content: ''; width: 24px; height: 1px; background: var(--color-accent); opacity: .5; }
        .cc-section-title { font-family: var(--font-display); font-size: clamp(30px,4.6vw,52px); font-weight: 700; color: var(--color-dark); line-height: 1.05; letter-spacing: -.02em; margin-bottom: 14px; max-width: 18ch; }
        .cc-section-sub { font-family: var(--font-serif, var(--font-display)); font-size: clamp(17px,2vw,22px); font-style: italic; font-weight: 400; color: var(--color-accent); margin-bottom: 20px; max-width: 50ch; }
        .cc-section-body { font-size: clamp(15px,1.8vw,17px); color: var(--color-muted); line-height: 1.75; max-width: 700px; }
        .cc-section-body + .cc-section-body { margin-top: 18px; }
        .cc-section-body strong { color: var(--color-dark); font-weight: 600; }
        .cc-divider { border: none; border-top: 1px solid rgba(26,25,22,.08); margin: 0; }

        .cc-hero { padding: 96px clamp(20px,5vw,56px) 56px; max-width: 1040px; margin: 0 auto; position: relative; overflow: hidden; }
        .cc-hero::before { content: ''; position: absolute; top: 96px; left: clamp(20px,5vw,56px); width: 56px; height: 4px; background: var(--color-teal); border-radius: 2px; }
        .cc-hero::after { content: ''; position: absolute; top: -10%; right: -6%; width: 360px; height: 360px; background: radial-gradient(closest-side, rgba(58,125,107,.12), transparent 70%); pointer-events: none; z-index: -1; }
        .cc-hero__kicker { font-size: 11px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: var(--color-teal); margin: 28px 0 22px; display: inline-flex; align-items: center; gap: 10px; }
        .cc-hero__kicker::after { content: ''; width: 24px; height: 1px; background: var(--color-teal); opacity: .5; }
        .cc-hero__title { font-family: var(--font-display); font-size: clamp(46px,7.6vw,90px); font-weight: 700; line-height: .98; letter-spacing: -.025em; color: var(--color-dark); margin-bottom: 22px; max-width: 18ch; }
        .cc-hero__title em { font-style: italic; font-family: var(--font-serif, var(--font-display)); color: var(--color-gold-dark); font-weight: 500; padding-right: .04em; }
        .cc-hero__sub { font-family: var(--font-display); font-size: clamp(18px,2.5vw,26px); font-weight: 400; color: var(--color-dark); line-height: 1.4; max-width: 600px; margin-bottom: 18px; }
        .cc-hero__body { font-size: clamp(15px,1.8vw,17px); color: var(--color-muted); line-height: 1.7; max-width: 580px; margin-bottom: 36px; }
        .cc-hero__body strong { color: var(--color-dark); font-weight: 600; }
        .cc-hero__ctas { display: flex; flex-wrap: wrap; gap: 12px; }

        .cc-btn-primary { display: inline-flex; align-items: center; gap: 10px; padding: 15px 28px; background: var(--color-dark); color: var(--color-cream); border-radius: 10px; font-family: var(--font-display); font-size: 14px; font-weight: 700; letter-spacing: -.005em; text-decoration: none; border: 1.5px solid var(--color-dark); cursor: pointer; box-shadow: 0 8px 20px -10px rgba(26,25,22,.4), inset 0 1px 0 rgba(255,255,255,.08); transition: background .25s, transform .22s cubic-bezier(.16,1,.3,1), box-shadow .25s, border-color .25s; }
        .cc-btn-primary:hover { background: var(--color-teal); border-color: var(--color-teal); transform: translateY(-2px); box-shadow: 0 14px 26px -12px rgba(58,125,107,.5), inset 0 1px 0 rgba(255,255,255,.12); }
        .cc-btn-primary:active { transform: translateY(0); }
        .cc-btn-secondary { display: inline-flex; align-items: center; gap: 10px; padding: 15px 28px; background: transparent; color: var(--color-dark); border-radius: 10px; font-family: var(--font-display); font-size: 14px; font-weight: 700; letter-spacing: -.005em; text-decoration: none; border: 1.5px solid rgba(26,25,22,.22); cursor: pointer; transition: border-color .25s, color .25s, background .25s, transform .22s cubic-bezier(.16,1,.3,1); }
        .cc-btn-secondary:hover { border-color: var(--color-dark); color: var(--color-accent); background: rgba(179,69,57,.04); transform: translateY(-2px); }
        .cc-btn-secondary:active { transform: translateY(0); }

        .cc-how { max-width: 1040px; margin: 0 auto; padding: 80px clamp(20px,5vw,56px); }
        .cc-how__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px 60px; margin-top: 40px; }
        .cc-how__step { display: flex; flex-direction: column; gap: 10px; position: relative; padding-top: 6px; }
        .cc-how__step::before { content: ''; position: absolute; top: 0; left: 0; width: 28px; height: 2px; background: var(--color-accent); border-radius: 2px; opacity: .8; }
        .cc-how__step:nth-child(1)::before { background: var(--color-accent); }
        .cc-how__step:nth-child(2)::before { background: var(--color-teal); }
        .cc-how__step:nth-child(3)::before { background: var(--color-gold-dark); }
        .cc-how__step:nth-child(4)::before { background: var(--color-navy); }
        .cc-how__num { font-family: var(--font-display); font-size: 11px; font-weight: 800; color: var(--color-accent); letter-spacing: .2em; text-transform: uppercase; }
        .cc-how__step:nth-child(2) .cc-how__num { color: var(--color-teal); }
        .cc-how__step:nth-child(3) .cc-how__num { color: var(--color-gold-dark); }
        .cc-how__step:nth-child(4) .cc-how__num { color: var(--color-navy); }
        .cc-how__step-title { font-family: var(--font-display); font-size: clamp(20px,2.4vw,26px); font-weight: 700; color: var(--color-dark); line-height: 1.2; letter-spacing: -.01em; }
        .cc-how__step-body { font-size: clamp(14px,1.6vw,15px); color: var(--color-muted); line-height: 1.7; }

        .cc-browse { max-width: 1040px; margin: 0 auto; padding: 80px clamp(20px,5vw,56px); }
        .cc-browse__head { margin-bottom: 36px; }
        .cc-filter-bar { display: flex; flex-direction: column; gap: 14px; margin-bottom: 36px; }
        .cc-search-wrap { position: relative; }
        .cc-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--color-muted); pointer-events: none; }
        .cc-search { width: 100%; font-family: var(--font-body); font-size: 15px; padding: 14px 16px 14px 44px; border: 1.5px solid rgba(26,25,22,.1); border-radius: 12px; background: rgba(255,255,255,.7); color: var(--color-dark); outline: none; transition: border-color .2s, background .2s, box-shadow .2s; }
        .cc-search:focus { border-color: var(--color-gold); background: var(--color-white); box-shadow: 0 0 0 4px rgba(232,168,56,.12); }
        .cc-search::placeholder { color: var(--color-muted); }
        .cc-filters { display: flex; flex-wrap: wrap; gap: 8px; }
        .cc-filter-select { font-family: var(--font-display); font-size: 12px; font-weight: 700; letter-spacing: -.005em; padding: 9px 30px 9px 14px; border: 1.5px solid rgba(26,25,22,.1); border-radius: 999px; background: rgba(255,255,255,.55); color: var(--color-dark); outline: none; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B5E52' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; transition: border-color .2s, background-color .2s, color .2s; flex-shrink: 0; }
        .cc-filter-select:hover { border-color: rgba(26,25,22,.22); background-color: rgba(255,255,255,.85); }
        .cc-filter-select:focus { border-color: var(--color-gold); background-color: var(--color-white); }
        .cc-filter-select:not([value=""]):not(:invalid) { background-color: rgba(179,69,57,.06); border-color: rgba(179,69,57,.3); color: var(--color-accent); }
        .cc-results-count { font-size: 13px; color: var(--color-muted); margin-bottom: 20px; }
        .cc-results-count span { font-weight: 700; color: var(--color-dark); }
        .cc-clear-filters { background: none; border: none; color: var(--color-accent); font-size: 13px; font-weight: 700; letter-spacing: -.005em; cursor: pointer; padding: 0 0 14px; font-family: var(--font-body); display: inline-flex; align-items: center; gap: 6px; transition: color .2s; }
        .cc-clear-filters::before { content: '×'; font-size: 16px; line-height: 1; }
        .cc-clear-filters:hover { color: var(--color-dark); }

        .cc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px,1fr)); gap: 18px; }
        .cc-grid > .cc-card { animation: cc-card-in .55s cubic-bezier(.16,1,.3,1) backwards; animation-delay: calc(var(--cc-i, 0) * 50ms); }
        @keyframes cc-card-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .cc-no-results { grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--color-muted); font-size: 15px; background: rgba(232,168,56,.05); border-radius: 16px; border: 1px dashed rgba(232,168,56,.25); }

        /* CARD — tinted surfaces, 3-tier hierarchy (lead with topic + name) */
        .cc-card { background: var(--color-cream); border: 1px solid rgba(26,25,22,.07); border-radius: 16px; padding: 22px 22px 20px; display: flex; flex-direction: column; gap: 16px; cursor: default; transition: transform .28s cubic-bezier(.16,1,.3,1), box-shadow .28s cubic-bezier(.16,1,.3,1), border-color .28s; position: relative; }
        .cc-card:hover { transform: translateY(-3px); box-shadow: 0 14px 36px -14px rgba(63,42,28,.16); border-color: rgba(26,25,22,.13); }
        .cc-card--new { background: rgba(232,168,56,.06); border-color: rgba(232,168,56,.22); }
        .cc-card--new:hover { box-shadow: 0 14px 36px -14px rgba(232,168,56,.28); border-color: rgba(232,168,56,.38); }
        .cc-card__top { display: flex; align-items: center; gap: 12px; }
        .cc-card__avatar { width: 44px; height: 44px; border-radius: 50%; background: rgba(58,125,107,.12); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--color-teal); flex-shrink: 0; box-shadow: 0 0 0 2px var(--color-cream), 0 1px 3px rgba(63,42,28,.08); overflow: hidden; }
        .cc-card__avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
        .cc-card__id { flex: 1; min-width: 0; }
        .cc-card__name { font-family: var(--font-display); font-size: 17px; font-weight: 700; color: var(--color-dark); line-height: 1.2; letter-spacing: -.005em; }
        .cc-card__role { font-size: 12px; color: var(--color-muted); line-height: 1.4; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cc-card__badge { font-size: 9px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; padding: 4px 9px; border-radius: 999px; background: rgba(58,125,107,.14); color: var(--color-teal); flex-shrink: 0; }
        .cc-card__badge--new { background: var(--color-gold); color: var(--color-dark); box-shadow: 0 1px 3px -1px rgba(232,168,56,.5); }
        .cc-card__topic-block { padding: 14px 16px; background: linear-gradient(180deg, rgba(179,69,57,.08) 0%, rgba(255,255,255,.55) 60%); border-radius: 10px; border: 1px solid rgba(179,69,57,.22); }
        .cc-card--new .cc-card__topic-block { background: linear-gradient(180deg, rgba(232,168,56,.1) 0%, rgba(255,255,255,.6) 60%); border-color: rgba(232,168,56,.3); }
        .cc-card__topic-headline { font-family: var(--font-serif, var(--font-display)); font-size: 14px; font-style: italic; font-weight: 500; color: var(--color-accent); line-height: 1.4; margin-bottom: 6px; }
        .cc-card--new .cc-card__topic-headline { color: var(--color-gold-dark); }
        .cc-card__topics { font-size: 13px; color: var(--color-dark); line-height: 1.6; }
        .cc-card__tags { display: flex; flex-wrap: wrap; gap: 5px; }
        .cc-tag { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: 3px 9px; border-radius: 999px; }
        .cc-tag--teal   { background: rgba(58,125,107,.12); color: var(--color-teal); }
        .cc-tag--blue   { background: rgba(91,142,194,.14); color: var(--color-navy); }
        .cc-tag--gold   { background: rgba(232,168,56,.14); color: var(--color-gold-dark); }
        .cc-tag--accent { background: rgba(179,69,57,.1);   color: var(--color-accent); }
        .cc-tag--navy   { background: rgba(22,43,68,.1);    color: var(--color-navy); }
        .cc-tag--muted  { background: rgba(26,25,22,.06);   color: var(--color-muted); }
        .cc-card__meta { display: flex; align-items: center; gap: 14px; font-size: 11px; color: var(--color-muted); padding-top: 4px; border-top: 1px solid rgba(26,25,22,.06); padding-top: 12px; }
        .cc-card__capacity { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; color: var(--color-dark); }
        .cc-card__capacity::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--color-teal); flex-shrink: 0; box-shadow: 0 0 0 2px rgba(58,125,107,.2); }
        .cc-card__updated { color: rgba(63,42,28,.5); margin-left: auto; }
        .cc-card__actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 2px; }
        .cc-card__cta-primary { display: inline-flex; align-items: center; gap: 6px; padding: 12px 16px; background: var(--color-dark); color: var(--color-cream); border-radius: 999px; font-family: var(--font-display); font-size: 12px; font-weight: 700; letter-spacing: -.005em; text-decoration: none; border: none; cursor: pointer; box-shadow: 0 6px 14px -8px rgba(26,25,22,.4), inset 0 1px 0 rgba(255,255,255,.08); transition: background .25s, transform .22s cubic-bezier(.16,1,.3,1), box-shadow .25s; flex: 1; justify-content: center; }
        .cc-card__cta-primary:hover { background: var(--color-teal); transform: translateY(-1px); box-shadow: 0 10px 20px -10px rgba(58,125,107,.45); }
        .cc-card__cta-secondary { display: inline-flex; align-items: center; gap: 6px; padding: 12px 14px; background: transparent; color: var(--color-dark); border-radius: 999px; font-family: var(--font-display); font-size: 12px; font-weight: 700; letter-spacing: -.005em; text-decoration: none; border: 1.5px solid rgba(26,25,22,.18); cursor: pointer; transition: border-color .25s, color .25s, background .25s, transform .22s cubic-bezier(.16,1,.3,1); flex-shrink: 0; }
        .cc-card__cta-secondary:hover { border-color: var(--color-accent); color: var(--color-accent); background: rgba(179,69,57,.04); transform: translateY(-1px); }

        .cc-reach { max-width: 1040px; margin: 0 auto; padding: 80px clamp(20px,5vw,56px); }
        .cc-reach__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 32px; }
        .cc-reach__col-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--color-dark); margin-bottom: 14px; }
        .cc-reach__body { font-size: clamp(14px,1.6vw,15px); color: var(--color-muted); line-height: 1.75; margin-bottom: 20px; }
        .cc-reach__body strong { color: var(--color-dark); font-weight: 600; }
        .cc-do-list { display: flex; flex-direction: column; gap: 10px; }
        .cc-do-item { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.5vw,14px); color: var(--color-muted); line-height: 1.6; }
        .cc-do-item__icon { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; margin-top: 1px; }
        .cc-do-item__icon--do   { background: rgba(58,125,107,.12); color: var(--color-teal); }
        .cc-do-item__icon--dont { background: rgba(179,69,57,.1);   color: var(--color-accent); }
        .cc-do-item strong { color: var(--color-dark); font-weight: 600; }
        .cc-reach__templates-link { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--color-dark); text-decoration: none; margin-top: 20px; transition: color .2s; }
        .cc-reach__templates-link::before { content: '→'; color: var(--color-accent); transition: transform .2s; }
        .cc-reach__templates-link:hover { color: var(--color-accent); }

        .cc-apply { max-width: 1040px; margin: 0 auto; padding: 88px clamp(20px,5vw,56px); position: relative; }
        .cc-apply__layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; align-items: flex-start; }
        .cc-apply__intro-kicker { font-size: 11px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: var(--color-teal); margin-bottom: 14px; display: inline-flex; align-items: center; gap: 10px; }
        .cc-apply__intro-kicker::after { content: ''; width: 24px; height: 1px; background: var(--color-teal); opacity: .5; }
        .cc-apply__intro-title { font-family: var(--font-display); font-size: clamp(28px,3.6vw,42px); font-weight: 700; color: var(--color-dark); line-height: 1.05; letter-spacing: -.02em; margin-bottom: 18px; max-width: 14ch; }
        .cc-apply__intro-title em { font-style: italic; font-family: var(--font-serif, var(--font-display)); color: var(--color-teal); font-weight: 500; padding-right: .04em; }
        .cc-apply__intro-body { font-size: clamp(14px,1.6vw,16px); color: var(--color-muted); line-height: 1.7; }
        .cc-apply__intro-body strong { color: var(--color-dark); font-weight: 600; }
        .cc-apply__perks { margin-top: 28px; display: flex; flex-direction: column; gap: 12px; }
        .cc-apply__perk { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--color-muted); line-height: 1.55; }
        .cc-apply__perk-icon { width: 22px; height: 22px; border-radius: 50%; background: rgba(58,125,107,.14); color: var(--color-teal); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0; margin-top: 1px; box-shadow: inset 0 0 0 1.5px rgba(58,125,107,.18); }

        .cc-form-box { background: linear-gradient(180deg, rgba(255,255,255,.7) 0%, rgba(58,125,107,.04) 100%); border: 1px solid rgba(26,25,22,.08); border-radius: 18px; padding: clamp(28px,4vw,44px); box-shadow: 0 1px 0 rgba(255,255,255,.6) inset, 0 24px 48px -28px rgba(63,42,28,.18); }
        .cc-form-row { margin-bottom: 16px; }
        .cc-form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .cc-form-label { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; color: var(--color-muted); margin-bottom: 7px; }
        .cc-form-label span { color: var(--color-accent); }
        .cc-form-input, .cc-form-select, .cc-form-textarea { width: 100%; font-family: var(--font-body); font-size: 15px; padding: 12px 14px; border: 1.5px solid rgba(26,25,22,.12); border-radius: 10px; background: rgba(255,255,255,.85); color: var(--color-dark); outline: none; transition: border-color .2s, background .2s, box-shadow .2s; }
        .cc-form-input:focus, .cc-form-select:focus, .cc-form-textarea:focus { border-color: var(--color-gold); background: var(--color-white); box-shadow: 0 0 0 4px rgba(232,168,56,.12); }
        .cc-form-textarea { min-height: 80px; resize: vertical; line-height: 1.6; }
        .cc-form-select { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B5E52' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
        .cc-form-check { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
        .cc-form-check input[type="checkbox"] { width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px; accent-color: var(--color-teal); cursor: pointer; }
        .cc-form-check-label { font-size: 13px; color: var(--color-muted); line-height: 1.6; }
        .cc-form-btn { width: 100%; padding: 14px 24px; background: var(--color-dark); color: var(--color-cream); border: none; border-radius: 8px; font-family: var(--font-display); font-size: 14px; font-weight: 600; cursor: pointer; transition: background .2s, transform .18s; margin-top: 6px; }
        .cc-form-btn:hover { background: var(--color-teal); transform: translateY(-1px); }
        .cc-form-success { text-align: center; padding: 40px 20px; }
        .cc-form-success__icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(58,125,107,.1); color: var(--color-teal); display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 16px; }
        .cc-form-success__title { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--color-dark); margin-bottom: 8px; }
        .cc-form-success__body { font-size: 14px; color: var(--color-muted); line-height: 1.7; }

        .cc-safety { max-width: 1040px; margin: 0 auto; padding: 60px clamp(20px,5vw,56px); }
        .cc-safety__box { background: rgba(22,43,68,.05); border: 1px solid rgba(22,43,68,.12); border-left: 3px solid var(--color-navy); border-radius: 14px; padding: 28px 32px; display: flex; gap: 18px; align-items: flex-start; }
        .cc-safety__icon { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: rgba(22,43,68,.12); color: var(--color-navy); display: flex; align-items: center; justify-content: center; margin-top: 1px; }
        .cc-safety__text { font-size: clamp(13px,1.5vw,14px); color: var(--color-muted); line-height: 1.75; }
        .cc-safety__text strong { color: var(--color-navy); font-weight: 700; }
        .cc-safety__text a { color: var(--color-navy); font-weight: 700; text-decoration: underline; text-decoration-color: rgba(22,43,68,.3); text-underline-offset: 2px; transition: text-decoration-color .2s; }
        .cc-safety__text a:hover { text-decoration-color: var(--color-navy); }

        .cc-eco { background: var(--color-navy); padding: 88px clamp(20px,5vw,56px); position: relative; overflow: hidden; }
        .cc-eco::before { content: ''; position: absolute; top: -10%; left: -6%; width: 360px; height: 360px; background: radial-gradient(closest-side, rgba(232,168,56,.16), transparent 70%); pointer-events: none; }
        .cc-eco__inner { max-width: 1040px; margin: 0 auto; position: relative; }
        .cc-eco__kicker { font-size: 11px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: var(--color-gold); margin-bottom: 14px; display: inline-flex; align-items: center; gap: 10px; }
        .cc-eco__kicker::after { content: ''; width: 24px; height: 1px; background: var(--color-gold); opacity: .5; }
        .cc-eco__title { font-family: var(--font-display); font-size: clamp(28px,4.4vw,46px); font-weight: 700; color: var(--color-cream); margin-bottom: 14px; line-height: 1.05; letter-spacing: -.02em; max-width: 18ch; }
        .cc-eco__title em { font-style: italic; font-family: var(--font-serif, var(--font-display)); color: var(--color-gold); font-weight: 500; padding-right: .04em; }
        .cc-eco__body { font-size: clamp(15px,1.7vw,16px); color: rgba(242,228,206,.7); line-height: 1.65; max-width: 580px; margin-bottom: 40px; }
        .cc-eco__grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(200px,1fr)); gap: 14px; }
        .cc-eco__link { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); border-radius: 14px; padding: 22px 24px; text-decoration: none; transition: background .25s, border-color .25s, transform .25s cubic-bezier(.16,1,.3,1); display: block; position: relative; }
        .cc-eco__link::after { content: '→'; position: absolute; top: 22px; right: 22px; font-size: 14px; color: var(--color-gold); opacity: 0; transform: translateX(-4px); transition: opacity .25s, transform .25s cubic-bezier(.16,1,.3,1); }
        .cc-eco__link:hover { background: rgba(232,168,56,.07); border-color: rgba(232,168,56,.25); transform: translateY(-2px); }
        .cc-eco__link:hover::after { opacity: 1; transform: translateX(0); }
        .cc-eco__link-title { font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--color-cream); margin-bottom: 6px; letter-spacing: -.005em; }
        .cc-eco__link-desc { font-size: 12px; color: rgba(242,228,206,.55); line-height: 1.55; }

        .cc-modal-overlay { position: fixed; inset: 0; background: rgba(26,25,22,.55); backdrop-filter: blur(4px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; pointer-events: none; transition: opacity .2s; }
        .cc-modal-overlay.open { opacity: 1; pointer-events: all; }
        .cc-modal { background: linear-gradient(180deg, var(--color-white), rgba(232,168,56,.04)); border-radius: 18px; padding: 40px 36px 36px; max-width: 560px; width: 100%; max-height: 85vh; overflow-y: auto; transform: translateY(12px); transition: transform .3s cubic-bezier(.16,1,.3,1); position: relative; box-shadow: 0 30px 60px -20px rgba(63,42,28,.32); border: 1px solid rgba(26,25,22,.06); }
        .cc-modal-overlay.open .cc-modal { transform: translateY(0); }
        .cc-modal__close { position: absolute; top: 14px; right: 14px; min-width: 44px; min-height: 44px; border-radius: 50%; border: none; background: rgba(26,25,22,.06); color: var(--color-muted); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .15s, color .15s; }
        .cc-modal__close:hover { background: rgba(179,69,57,.1); color: var(--color-accent); }
        .cc-modal__kicker { font-size: 11px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: var(--color-accent); margin-bottom: 12px; display: inline-flex; align-items: center; gap: 10px; }
        .cc-modal__kicker::after { content: ''; width: 24px; height: 1px; background: var(--color-accent); opacity: .5; }
        .cc-modal__title { font-family: var(--font-display); font-size: 26px; font-weight: 700; color: var(--color-dark); margin-bottom: 8px; line-height: 1.1; letter-spacing: -.02em; }
        .cc-modal__sub { font-size: 14px; color: var(--color-muted); line-height: 1.6; margin-bottom: 22px; max-width: 50ch; }
        .cc-modal__template { background: rgba(232,168,56,.06); border: 1px solid rgba(232,168,56,.2); border-left: 3px solid var(--color-gold-dark); border-radius: 12px; padding: 22px 24px; font-size: 14px; line-height: 1.75; color: var(--color-dark); margin-bottom: 16px; white-space: pre-wrap; font-family: var(--font-body); }
        .cc-modal__copy-btn { width: 100%; padding: 14px; background: var(--color-dark); color: var(--color-cream); border: none; border-radius: 999px; font-family: var(--font-display); font-size: 13px; font-weight: 700; letter-spacing: -.005em; cursor: pointer; box-shadow: 0 8px 20px -10px rgba(26,25,22,.4), inset 0 1px 0 rgba(255,255,255,.08); transition: background .25s, transform .22s cubic-bezier(.16,1,.3,1), box-shadow .25s; }
        .cc-modal__copy-btn:hover { background: var(--color-teal); transform: translateY(-1px); box-shadow: 0 12px 24px -10px rgba(58,125,107,.5); }
        .cc-modal__copy-btn.copied { background: var(--color-teal); }
        .cc-modal__close:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px; }
        .cc-modal__copy-btn:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px; border-radius: 8px; }
        .cc-card__cta-primary:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px; border-radius: 8px; }
        .cc-card__cta-secondary:focus-visible { outline: 2px solid var(--color-dark); outline-offset: 2px; border-radius: 8px; }

        .cc-ms-trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 12px 14px; border: 1.5px solid rgba(26,25,22,.12); border-radius: 10px; background: rgba(255,255,255,.85); color: var(--color-dark); font-family: var(--font-body); font-size: 15px; text-align: left; cursor: pointer; transition: border-color .2s, background .2s, box-shadow .2s; }
        .cc-ms-trigger:focus { border-color: var(--color-gold); background: var(--color-white); outline: none; box-shadow: 0 0 0 4px rgba(232,168,56,.12); }
        .cc-ms-trigger span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--color-dark); }
        .cc-ms-trigger span.cc-ms-placeholder { color: var(--color-muted); }
        .cc-ms-menu { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: var(--color-white); border: 1.5px solid rgba(26,25,22,.1); border-radius: 12px; box-shadow: 0 16px 36px -12px rgba(63,42,28,.18); z-index: 100; max-height: 220px; overflow-y: auto; padding: 6px; }
        .cc-ms-option { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px; font-size: 14px; color: var(--color-dark); cursor: pointer; transition: background .15s; }
        .cc-ms-option:hover { background: rgba(58,125,107,.05); }
        .cc-ms-option.selected { background: rgba(58,125,107,.1); color: var(--color-teal); }
        .cc-ms-check { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid rgba(26,25,22,.18); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; color: var(--color-teal); transition: border-color .15s, background .15s; }
        .cc-ms-option.selected .cc-ms-check { border-color: var(--color-teal); background: rgba(58,125,107,.14); }
        .cc-selected-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .cc-selected-tag { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: rgba(58,125,107,.1); color: var(--color-teal); border-radius: 20px; font-size: 12px; font-weight: 600; }
        .cc-selected-tag button { background: none; border: none; color: inherit; cursor: pointer; font-size: 14px; line-height: 1; padding: 0; opacity: .7; }
        .cc-selected-tag button:hover { opacity: 1; }

        .cc-photo-upload { display: flex; align-items: center; gap: 16px; }
        .cc-photo-preview { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 2px var(--color-cream), 0 0 0 3.5px rgba(58,125,107,.3), 0 4px 12px -4px rgba(63,42,28,.18); flex-shrink: 0; }
        .cc-photo-placeholder { width: 64px; height: 64px; border-radius: 50%; background: rgba(58,125,107,.08); display: flex; align-items: center; justify-content: center; color: var(--color-teal); flex-shrink: 0; border: 1.5px dashed rgba(58,125,107,.3); }
        .cc-photo-right { display: flex; flex-direction: column; gap: 4px; }
        .cc-photo-btn { display: inline-block; padding: 9px 18px; background: rgba(58,125,107,.06); border: 1.5px solid rgba(58,125,107,.22); border-radius: 999px; font-family: var(--font-display); font-size: 13px; font-weight: 700; letter-spacing: -.005em; color: var(--color-teal); cursor: pointer; transition: background .2s, border-color .2s, transform .18s cubic-bezier(.16,1,.3,1); }
        .cc-photo-btn:hover { background: rgba(58,125,107,.1); border-color: rgba(58,125,107,.4); transform: translateY(-1px); }
        .cc-photo-hint { font-size: 12px; color: var(--color-muted); margin: 0; }
        .cc-photo-remove { background: none; border: none; font-size: 12px; color: var(--color-accent); cursor: pointer; padding: 0; font-family: var(--font-body); }

        /* Skeleton card (matches restructured card layout) */
        .cc-card-skel { background: var(--color-cream); border: 1px solid rgba(26,25,22,.06); border-radius: 16px; padding: 22px 22px 20px; display: flex; flex-direction: column; gap: 16px; animation: cc-shimmer 1.6s ease-in-out infinite; }
        .cc-card-skel__top { display: flex; align-items: center; gap: 12px; }
        .cc-card-skel__avatar { width: 44px; height: 44px; border-radius: 50%; background: rgba(26,25,22,.05); flex-shrink: 0; }
        .cc-card-skel__id { flex: 1; display: flex; flex-direction: column; gap: 6px; }
        .cc-card-skel__id-line { height: 10px; background: rgba(26,25,22,.06); border-radius: 4px; }
        .cc-card-skel__id-line--w50 { width: 50%; }
        .cc-card-skel__badge { width: 60px; height: 18px; background: rgba(26,25,22,.05); border-radius: 999px; flex-shrink: 0; }
        .cc-card-skel__topic { padding: 14px 16px; background: linear-gradient(180deg, rgba(179,69,57,.05) 0%, rgba(255,255,255,.4) 60%); border-radius: 10px; border: 1px solid rgba(179,69,57,.16); display: flex; flex-direction: column; gap: 8px; }
        .cc-card-skel__topic-line { height: 10px; background: rgba(26,25,22,.05); border-radius: 4px; }
        .cc-card-skel__topic-line--w70 { width: 70%; }
        .cc-card-skel__tags { display: flex; gap: 6px; }
        .cc-card-skel__tag { width: 56px; height: 14px; background: rgba(26,25,22,.05); border-radius: 999px; }
        .cc-card-skel__actions { display: flex; gap: 8px; margin-top: 4px; }
        .cc-card-skel__btn { flex: 1; height: 38px; background: rgba(26,25,22,.05); border-radius: 999px; }
        .cc-card-skel__btn--narrow { flex: 0 0 80px; background: rgba(26,25,22,.04); }
        @keyframes cc-shimmer { 0%, 100% { opacity: 1; } 50% { opacity: .6; } }
        @media (prefers-reduced-motion: reduce) {
          .cc-card-skel, .cc-grid > .cc-card { animation: none; }
          .cc-card:hover, .cc-btn-primary:hover, .cc-btn-secondary:hover, .cc-card__cta-primary:hover, .cc-card__cta-secondary:hover, .cc-photo-btn:hover { transform: none !important; }
        }

        @media (max-width: 768px) {
          .cc-hero { padding: 88px 20px 48px; }
          .cc-how, .cc-browse, .cc-apply, .cc-safety, .cc-eco { padding-top: 56px; padding-bottom: 56px; }
        }
        @media (max-width: 740px) {
          .cc-apply__layout { grid-template-columns: 1fr; gap: 36px; }
          .cc-form-row-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .cc-how__grid { grid-template-columns: 1fr; gap: 28px; }
          .cc-reach__grid { grid-template-columns: 1fr; gap: 32px; }
          .cc-modal { padding: 30px 24px 24px; }
        }
        @media (max-width: 560px) { .cc-grid { grid-template-columns: 1fr; } }
        @media (max-width: 480px) {
          .cc-hero { padding: 80px 16px 40px; }
          .cc-eco { padding: 56px 16px; }
          .cc-safety__box { padding: 22px 20px; gap: 14px; flex-direction: column; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cc-card-skel, .cc-grid > .cc-card { animation: none; }
          .cc-card, .cc-btn-primary, .cc-btn-secondary, .cc-card__cta-primary, .cc-card__cta-secondary,
          .cc-photo-btn, .cc-eco__link, .cc-modal, .cc-form-input, .cc-form-select, .cc-form-textarea,
          .cc-search, .cc-filter-select, .cc-ms-trigger, .cc-modal__copy-btn { transition: none !important; }
          .cc-card:hover, .cc-btn-primary:hover, .cc-btn-secondary:hover, .cc-card__cta-primary:hover,
          .cc-card__cta-secondary:hover, .cc-photo-btn:hover, .cc-eco__link:hover, .cc-modal__copy-btn:hover { transform: none !important; }
          .cc-modal-overlay, .cc-modal-overlay.open .cc-modal { transition-duration: .01ms !important; }
        }
      `}</style>

      <header className="cc-hero" id="top">
        <p className="cc-hero__kicker">{t.heroKicker}</p>
        <h1 className="cc-hero__title">{t.heroTitle} <em>{t.heroTitleEm}</em></h1>
        <p className="cc-hero__sub">{t.heroSub}</p>
        <p className="cc-hero__body">
          {t.heroBody1} <strong>{t.heroBodyQuote}</strong> {t.heroBody2}
        </p>
        <div className="cc-hero__ctas">
          <a href="#browse" className="cc-btn-primary">{t.heroCta1}</a>
          <a href="#apply" className="cc-btn-secondary">{t.heroCta2}</a>
        </div>
      </header>

      <hr className="cc-divider" />

      <section className="cc-how" id="how-it-works">
        <div>
          <p className="cc-kicker">{t.howKicker}</p>
          <h2 className="cc-section-title">{t.howTitle}</h2>
          <p className="cc-section-sub">{t.howSub}</p>
        </div>
        <p className="cc-section-body">
          {t.howBody1}
        </p>
        <p className="cc-section-body" style={{ marginTop: '16px' }}>
          {t.howBody2Part1} <strong>{t.howBody2Strong}</strong> {t.howBody2Part2}
        </p>
        <div className="cc-how__grid">
          {t.howSteps.map(s => (
            <div key={s.num} className="cc-how__step">
              <span className="cc-how__num">{s.num}</span>
              <h3 className="cc-how__step-title">{s.title}</h3>
              <p className="cc-how__step-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="cc-divider" />

      <section className="cc-browse" id="browse">
        <div className="cc-browse__head">
          <p className="cc-kicker">{t.browseKicker}</p>
          <h2 className="cc-section-title">{t.browseTitle}</h2>
          <p className="cc-section-sub">{t.browseSub}</p>
        </div>

        <div className="cc-filter-bar">
          <div className="cc-search-wrap">
            <svg className="cc-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              className="cc-search"
              placeholder={t.searchPlaceholder}
              aria-label={t.searchAriaLabel}
              autoComplete="off"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="cc-filters">
            <select className="cc-filter-select" aria-label={t.filterRoleLabel} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option value="">{t.filterRoleAll}</option>
              <option value="student">{t.filterRoleStudent}</option>
              <option value="new-grad">{t.filterRoleNewGrad}</option>
              <option value="early-career">{t.filterRoleEarlyCareer}</option>
              <option value="mid-career">{t.filterRoleMidCareer}</option>
              <option value="recruiter">{t.filterRoleRecruiter}</option>
              <option value="career-changer">{t.filterRoleCareerChanger}</option>
            </select>
            <select className="cc-filter-select" aria-label={t.filterFuncLabel} value={filterFunc} onChange={e => setFilterFunc(e.target.value)}>
              <option value="">{t.filterFuncAll}</option>
              <option value="software engineering">{t.filterFuncSWE}</option>
              <option value="data">{t.filterFuncData}</option>
              <option value="product">{t.filterFuncProduct}</option>
              <option value="design">{t.filterFuncDesign}</option>
              <option value="research">{t.filterFuncResearch}</option>
              <option value="business">{t.filterFuncBusiness}</option>
              <option value="recruiting">{t.filterFuncRecruiting}</option>
              <option value="marketing">{t.filterFuncMarketing}</option>
              <option value="sales">{t.filterFuncSales}</option>
              <option value="finance">{t.filterFuncFinance}</option>
              <option value="consulting">{t.filterFuncConsulting}</option>
              <option value="legal">{t.filterFuncLegal}</option>
              <option value="healthcare">{t.filterFuncHealthcare}</option>
              <option value="education">{t.filterFuncEducation}</option>
              <option value="cybersecurity">{t.filterFuncCyber}</option>
              <option value="devops">{t.filterFuncDevOps}</option>
              <option value="machine learning">{t.filterFuncML}</option>
              <option value="mobile">{t.filterFuncMobile}</option>
              <option value="qa">{t.filterFuncQA}</option>
              <option value="program management">{t.filterFuncPM}</option>
              <option value="social work">{t.filterFuncSocialWork}</option>
              <option value="journalism">{t.filterFuncJournalism}</option>
              <option value="architecture">{t.filterFuncArch}</option>
              <option value="customer success">{t.filterFuncCS}</option>
            </select>
            <select className="cc-filter-select" aria-label={t.filterStageLabel} value={filterStage} onChange={e => setFilterStage(e.target.value)}>
              <option value="">{t.filterStageAll}</option>
              <option value="first-internship">{t.filterStageInternship}</option>
              <option value="apprenticeship">{t.filterStageApprenticeship}</option>
              <option value="first-full-time">{t.filterStageFirstFullTime}</option>
              <option value="transitioned">{t.filterStageTransitioned}</option>
            </select>
            <select className="cc-filter-select" aria-label={t.filterIdentityLabel} value={filterIdentity} onChange={e => setFilterIdentity(e.target.value)}>
              <option value="">{t.filterIdentityAll}</option>
              <option value="first-gen">{t.filterIdentityFirstGen}</option>
              <option value="low-income">{t.filterIdentityLowIncome}</option>
              <option value="transfer">{t.filterIdentityTransfer}</option>
              <option value="community college">{t.filterIdentityCC}</option>
              <option value="international">{t.filterIdentityInternational}</option>
              <option value="nontraditional">{t.filterIdentityNontraditional}</option>
              <option value="daca">{t.filterIdentityDACA}</option>
              <option value="black">{t.filterIdentityBlack}</option>
              <option value="latinx">{t.filterIdentityLatinx}</option>
              <option value="indigenous">{t.filterIdentityIndigenous}</option>
              <option value="asian">{t.filterIdentityAsian}</option>
              <option value="lgbtq">{t.filterIdentityLGBTQ}</option>
              <option value="veteran">{t.filterIdentityVeteran}</option>
              <option value="disability">{t.filterIdentityDisability}</option>
              <option value="single parent">{t.filterIdentitySingleParent}</option>
              <option value="rural">{t.filterIdentityRural}</option>
              <option value="career changer">{t.filterIdentityCareerChanger}</option>
              <option value="returning adult">{t.filterIdentityReturning}</option>
              <option value="foster">{t.filterIdentityFoster}</option>
            </select>
          </div>
        </div>

        {(search || filterRole || filterFunc || filterStage || filterIdentity) && (
          <button
            type="button"
            className="cc-clear-filters"
            onClick={() => { setSearch(''); setFilterRole(''); setFilterFunc(''); setFilterStage(''); setFilterIdentity('') }}
          >
            {t.clearFilters}
          </button>
        )}
        {!profilesLoading && !profilesError && <p className="cc-results-count"><span>{visibleProfiles.length}</span> {t.resultsCount}</p>}

        <div className="cc-grid">
          {profilesLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`cc-skel-${i}`} className="cc-card-skel" style={{ animationDelay: `${i * 80}ms` }} aria-hidden="true">
                <div className="cc-card-skel__top">
                  <div className="cc-card-skel__avatar" />
                  <div className="cc-card-skel__id">
                    <div className="cc-card-skel__id-line" />
                    <div className="cc-card-skel__id-line cc-card-skel__id-line--w50" />
                  </div>
                  <div className="cc-card-skel__badge" />
                </div>
                <div className="cc-card-skel__topic">
                  <div className="cc-card-skel__topic-line" />
                  <div className="cc-card-skel__topic-line cc-card-skel__topic-line--w70" />
                </div>
                <div className="cc-card-skel__tags">
                  <div className="cc-card-skel__tag" /><div className="cc-card-skel__tag" /><div className="cc-card-skel__tag" />
                </div>
                <div className="cc-card-skel__actions">
                  <div className="cc-card-skel__btn" />
                  <div className="cc-card-skel__btn cc-card-skel__btn--narrow" />
                </div>
              </div>
            ))
          ) : profilesError ? (
            <p className="cc-no-results">{t.profilesError}</p>
          ) : visibleProfiles.length === 0 ? (
            <p className="cc-no-results">{t.noResults}</p>
          ) : visibleProfiles.map((p, idx) => (
            <article key={p.id} className={`cc-card${p.badge === 'New' ? ' cc-card--new' : ''}`} style={{ '--cc-i': idx % 12 }}>
              <div className="cc-card__top">
                <div className="cc-card__avatar">
                  {p.avatarUrl ? <img src={p.avatarUrl} alt="" /> : p.initial}
                </div>
                <div className="cc-card__id">
                  <div className="cc-card__name">{p.name}</div>
                  <div className="cc-card__role">{p.role}</div>
                </div>
                <span className={`cc-card__badge${p.badge === 'New' ? ' cc-card__badge--new' : ''}`}>
                  {p.badge === 'New' ? t.cardBadgeNew : t.cardBadgeActive}
                </span>
              </div>
              <div className="cc-card__topic-block">
                <div className="cc-card__topic-headline">{p.headline}</div>
                <div className="cc-card__topics">{p.topics}</div>
              </div>
              <div className="cc-card__tags">
                {p.tags.map(tag => <span key={tag.label} className={`cc-tag ${tag.cls}`}>{tag.label}</span>)}
              </div>
              <div className="cc-card__meta">
                <span className="cc-card__capacity">{p.capacity}</span>
                <span className="cc-card__updated">{p.updated}</span>
              </div>
              <div className="cc-card__actions">
                {p.linkedIn && <a href={p.linkedIn} target="_blank" rel="noopener noreferrer" className="cc-card__cta-primary">{t.cardCtaPrimary}</a>}
                <button className="cc-card__cta-secondary" onClick={() => openModal(p.name.split(' ')[0])}>{t.cardCtaSecondary}</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <hr className="cc-divider" />

      <section className="cc-reach" id="how-to-reach-out">
        <p className="cc-kicker">{t.reachKicker}</p>
        <h2 className="cc-section-title">{t.reachTitle}</h2>
        <p className="cc-section-sub">{t.reachSub}</p>
        <div className="cc-reach__grid">
          <div>
            <h3 className="cc-reach__col-title">{t.reachCol1Title}</h3>
            <p className="cc-reach__body">{t.reachCol1Body1Part1} <strong>{t.reachCol1Body1Strong}</strong>{t.reachCol1Body1Part2}</p>
            <p className="cc-reach__body">{t.reachCol1Body2Part1} <strong>{t.reachCol1Body2Strong1}</strong>, <strong>{t.reachCol1Body2Strong2}</strong>, and a <strong>{t.reachCol1Body2Strong3}</strong>{t.reachCol1Body2Part2}</p>
            <Link to="/career-templates" className="cc-reach__templates-link">{t.reachTemplatesLink}</Link>
          </div>
          <div>
            <h3 className="cc-reach__col-title">{t.reachCol2Title}</h3>
            <div className="cc-do-list">
              {t.reachDoDont.map((item) => (
                <div key={item.strongText} className="cc-do-item">
                  <span className={`cc-do-item__icon cc-do-item__icon--${item.type}`} aria-hidden="true">
                    {item.type === 'do'
                      ? <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.8l2.4 2.4L9 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 1.5l6 6m0-6l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    }
                  </span>
                  <span><strong>{item.strongText}</strong>{item.rest}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="cc-divider" />

      <section className="cc-apply" id="apply">
        <div className="cc-apply__layout">
          <div>
            <p className="cc-apply__intro-kicker">{t.applyKicker}</p>
            <h2 className="cc-apply__intro-title">{t.applyTitle}</h2>
            <p className="cc-apply__intro-body">
              {t.applyBody1Part1} <strong>{t.applyBody1Strong}</strong> {t.applyBody1Part2}
            </p>
            <div className="cc-apply__perks">
              {t.applyPerks.map(perk => (
                <div key={perk} className="cc-apply__perk">
                  <span className="cc-apply__perk-icon">✓</span>
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cc-form-box">
            {formSubmitted ? (
              <div className="cc-form-success">
                <div className="cc-form-success__icon">✓</div>
                <div className="cc-form-success__title">{t.formSuccessTitle}</div>
                <p className="cc-form-success__body">{t.formSuccessBody}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="cc-form-row">
                  <label className="cc-form-label">{t.formLabelPhoto} <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{t.formPhotoOptional}</span></label>
                  <div className="cc-photo-upload">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="cc-photo-preview" />
                    ) : (
                      <div className="cc-photo-placeholder">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                    )}
                    <div className="cc-photo-right">
                      <label htmlFor="ccPhoto" className="cc-photo-btn">{t.formPhotoChoose}</label>
                      <input id="ccPhoto" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        if (file.size > 2 * 1024 * 1024) {
                          setPhotoError(t.formPhotoErrorSize)
                          e.target.value = ''
                          return
                        }
                        setPhotoError('')
                        setPhotoFile(file)
                        setPhotoPreview(URL.createObjectURL(file))
                      }} />
                      <p className="cc-photo-hint">{t.formPhotoHint}</p>
                      {photoError && <p style={{ color: 'var(--color-accent)', fontSize: '12px', margin: 0 }}>{photoError}</p>}
                      {photoPreview && <button type="button" className="cc-photo-remove" onClick={() => { setPhotoFile(null); setPhotoPreview(null); setPhotoError('') }}>{t.formPhotoRemove}</button>}
                    </div>
                  </div>
                </div>
                <div className="cc-form-row cc-form-row-2">
                  <div>
                    <label className="cc-form-label" htmlFor="ccName">{t.formLabelName} <span>*</span></label>
                    <input className="cc-form-input" type="text" id="ccName" placeholder={t.formPlaceholderName} value={formData.name} onChange={e => setFormData(d => ({ ...d, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="cc-form-label" htmlFor="ccPronouns">{t.formLabelPronouns}</label>
                    <input className="cc-form-input" type="text" id="ccPronouns" placeholder={t.formPlaceholderPronouns} value={formData.pronouns} onChange={e => setFormData(d => ({ ...d, pronouns: e.target.value }))} />
                  </div>
                </div>
                <div className="cc-form-row">
                  <label className="cc-form-label" htmlFor="ccEmail">{t.formLabelEmail} <span>*</span> <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{t.formEmailNote}</span></label>
                  <input className="cc-form-input" type="email" id="ccEmail" placeholder={t.formPlaceholderEmail} value={formData.email} onChange={e => setFormData(d => ({ ...d, email: e.target.value }))} />
                </div>
                <div className="cc-form-row">
                  <label className="cc-form-label" htmlFor="ccLinkedIn">{t.formLabelLinkedIn} <span>*</span></label>
                  <input className="cc-form-input" type="url" id="ccLinkedIn" placeholder={t.formPlaceholderLinkedIn} value={formData.linkedin} onChange={e => setFormData(d => ({ ...d, linkedin: e.target.value }))} />
                </div>
                <div className="cc-form-row cc-form-row-2">
                  <div>
                    <label className="cc-form-label" htmlFor="ccCurrentRole">{t.formLabelRole} <span>*</span></label>
                    <input className="cc-form-input" type="text" id="ccCurrentRole" placeholder={t.formPlaceholderRole} value={formData.role} onChange={e => setFormData(d => ({ ...d, role: e.target.value }))} />
                  </div>
                  <div>
                    <label className="cc-form-label" htmlFor="ccLocation">{t.formLabelLocation}</label>
                    <input className="cc-form-input" type="text" id="ccLocation" placeholder={t.formPlaceholderLocation} value={formData.location} onChange={e => setFormData(d => ({ ...d, location: e.target.value }))} />
                  </div>
                </div>
                <div className="cc-form-row">
                  <label className="cc-form-label">{t.formLabelFunction} <span>*</span></label>
                  <MultiSelectDropdown
                    options={FUNCTION_OPTIONS}
                    selected={funcChips}
                    onChange={setFuncChips}
                    placeholder={t.formFunctionPlaceholder}
                  />
                  {funcChips.length > 0 && <div className="cc-selected-tags">{funcChips.map(c => <span key={c} className="cc-selected-tag">{c} <button type="button" onClick={() => { setFuncChips(p => p.filter(v => v !== c)); if (c === 'Other') setFuncOtherText('') }}>×</button></span>)}</div>}
                  {funcChips.includes('Other') && (
                    <input
                      className="cc-form-input"
                      type="text"
                      placeholder={t.formFunctionOtherPlaceholder}
                      value={funcOtherText}
                      onChange={e => setFuncOtherText(e.target.value)}
                      style={{ marginTop: '10px' }}
                    />
                  )}
                </div>
                <div className="cc-form-row">
                  <label className="cc-form-label">{t.formLabelIdentity} <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{t.formIdentityOptional}</span></label>
                  <MultiSelectDropdown
                    options={IDENTITY_OPTIONS}
                    selected={identityChips}
                    onChange={setIdentityChips}
                    placeholder={t.formIdentityPlaceholder}
                  />
                  {identityChips.length > 0 && <div className="cc-selected-tags">{identityChips.map(c => <span key={c} className="cc-selected-tag">{c} <button type="button" onClick={() => { setIdentityChips(p => p.filter(v => v !== c)); if (c === 'Other') setIdentityOtherText('') }}>×</button></span>)}</div>}
                  {identityChips.includes('Other') && (
                    <input
                      className="cc-form-input"
                      type="text"
                      placeholder={t.formIdentityOtherPlaceholder}
                      value={identityOtherText}
                      onChange={e => setIdentityOtherText(e.target.value)}
                      style={{ marginTop: '10px' }}
                    />
                  )}
                </div>
                <div className="cc-form-row">
                  <label className="cc-form-label" htmlFor="ccTopics">{t.formLabelTopics} <span>*</span></label>
                  <textarea className="cc-form-textarea" id="ccTopics" placeholder={t.formPlaceholderTopics} value={formData.topics} onChange={e => setFormData(d => ({ ...d, topics: e.target.value }))}></textarea>
                </div>
                <div className="cc-form-row">
                  <label className="cc-form-label" htmlFor="ccCapacity">{t.formLabelCapacity} <span>*</span></label>
                  <select className="cc-form-select" id="ccCapacity" value={formData.capacity} onChange={e => setFormData(d => ({ ...d, capacity: e.target.value }))}>
                    <option value="">{t.formCapacityDefault}</option>
                    <option value="1-2">{t.formCapacity1}</option>
                    <option value="3-5">{t.formCapacity2}</option>
                    <option value="6+">{t.formCapacity3}</option>
                  </select>
                </div>
                <div className="cc-form-row" style={{ marginBottom: '20px' }}>
                  <div className="cc-form-check">
                    <input type="checkbox" id="ccConsent1" checked={formData.consent1} onChange={e => setFormData(d => ({ ...d, consent1: e.target.checked }))} />
                    <label className="cc-form-check-label" htmlFor="ccConsent1">{t.formConsent1}</label>
                  </div>
                  <div className="cc-form-check">
                    <input type="checkbox" id="ccConsent2" checked={formData.consent2} onChange={e => setFormData(d => ({ ...d, consent2: e.target.checked }))} />
                    <label className="cc-form-check-label" htmlFor="ccConsent2">{t.formConsent2}</label>
                  </div>
                </div>
                {formError && <p role="alert" style={{ color: 'var(--color-accent)', fontSize: '13px', marginBottom: '10px' }}>{formError}</p>}
                <button className="cc-form-btn" type="submit" disabled={formLoading}>{formLoading ? t.formSubmitting : t.formSubmit}</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <hr className="cc-divider" />

      <section className="cc-safety">
        <div className="cc-safety__box">
          <span className="cc-safety__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L3 5v5c0 4.25 3.05 7.6 7 8.5 3.95-.9 7-4.25 7-8.5V5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </span>
          <p className="cc-safety__text">
            <strong>{t.safetyStrong}</strong>{t.safetyBody}<a href="mailto:campustocareerteam@gmail.com">{t.safetyLinkText}</a>{t.safetySuffix}
          </p>
        </div>
      </section>

      <hr className="cc-divider" />

      <section className="cc-eco">
        <div className="cc-eco__inner">
          <p className="cc-eco__kicker">{t.ecoKicker}</p>
          <h2 className="cc-eco__title">{t.ecoTitle}</h2>
          <p className="cc-eco__body">{t.ecoBody}</p>
          <div className="cc-eco__grid">
            {t.ecoLinks.map(link => (
              <Link key={link.to} to={link.to} className="cc-eco__link">
                <div className="cc-eco__link-title">{link.title}</div>
                <div className="cc-eco__link-desc">{link.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Template Modal */}
      <div className={`cc-modal-overlay${modalOpen ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
        <div className="cc-modal" role="dialog" aria-modal="true" aria-labelledby="cc-modal-title" ref={ccModalRef} onKeyDown={handleCcModalKeyDown}>
          <button className="cc-modal__close" onClick={closeModal} aria-label={t.modalClose}>✕</button>
          <p className="cc-modal__kicker">{t.modalKicker}</p>
          <h2 id="cc-modal-title" className="cc-modal__title">{t.modalTitlePrefix} {modalName}</h2>
          <p className="cc-modal__sub">{t.modalSub}</p>
          <div className="cc-modal__template">{TEMPLATE_TEXT.replace('[Name]', modalName)}</div>
          <button className={`cc-modal__copy-btn${copied ? ' copied' : ''}`} onClick={copyTemplate}>
            {copied ? t.modalCopied : t.modalCopyBtn}
          </button>
        </div>
      </div>
    </ArticleLayout>
  )
}
