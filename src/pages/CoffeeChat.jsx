import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ArticleLayout from '../components/ArticleLayout'
import { supabase } from '../lib/supabase'


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

const slugify = (s) => (s || '')
  .toLowerCase()
  .replace(/[\s\/]+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')

const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

const LINKEDIN_URL_REGEX = /^(https?:\/\/)?([a-z0-9-]+\.)?linkedin\.[a-z]{2,}\/.+/i

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
  const capacityMap = {
    '1-2': 'Takes 1–2 chats / month',
    '3-5': 'Takes 3–5 chats / month',
    '6-9': 'Takes 6–9 chats / month',
    '6+': 'Takes 6+ chats / month',
    '10+': 'Takes 10+ chats / month',
  }
  const capacityLabel = capacityMap[row.capacity] || 'Open to coffee chats'
  const createdAt = row.created_at ? new Date(row.created_at) : new Date()
  // Prefer approval timestamp for the "Member since" label so it reflects when the profile actually became visible.
  const memberSinceDate = row.approved_at ? new Date(row.approved_at) : createdAt
  const memberSince = memberSinceDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const titleLower = (row.role_title || '').toLowerCase()
  const topicsLower = (row.topics || '').toLowerCase()
  const haystack = `${titleLower} ${topicsLower}`

  // Exact-match slugs prevent "first-gen" filter from accidentally matching "first-gen immigrant".
  const identitySlugs = identities.map(slugify)
  const funcSlugs = funcs.map(slugify)
  const identitySlugString = `|${identitySlugs.join('|')}|`
  const funcSlugString = `|${funcSlugs.join('|')}|`

  // Multi-valued: a profile can fit several role/stage buckets at once
  // (e.g. a senior engineer who's also a career changer should match both).
  const dataRoles = []
  if (/\b(student|undergraduate|undergrad|grad student|phd candidate)\b/.test(haystack) || /\bintern\b/.test(haystack)) dataRoles.push('student')
  if (/(new|recent).?grad|entry.?level/.test(haystack)) dataRoles.push('new-grad')
  if (/\b(junior|jr\.?|associate|analyst i)\b/.test(haystack)) dataRoles.push('early-career')
  if (/\b(senior|sr\.?|lead|staff|principal|manager|director|vp|head of)\b/.test(haystack)) dataRoles.push('mid-career')
  if (/recruit|talent.?acqui|sourcer/.test(haystack) || funcSlugs.includes('recruiting-hr')) dataRoles.push('recruiter')
  if (
    identitySlugs.includes('career-changer') ||
    identitySlugs.includes('nontraditional-path') ||
    identitySlugs.includes('returning-adult-student')
  ) dataRoles.push('career-changer')

  const dataStages = []
  if (/\bintern\b/.test(haystack)) dataStages.push('first-internship')
  if (/apprentice/.test(haystack)) dataStages.push('apprenticeship')
  if (/(new|recent).?grad|first.?(job|role|full.?time)/.test(haystack)) dataStages.push('first-full-time')
  if (/\b(searching|job.?search|seeking|laid off)\b/.test(haystack)) dataStages.push('job-searching')
  if (
    identitySlugs.includes('career-changer') ||
    identitySlugs.includes('nontraditional-path') ||
    /pivot|transition/.test(haystack)
  ) dataStages.push('transitioned')
  if (/\b(senior|staff|principal|lead|manager|director)\b/.test(haystack)) dataStages.push('experienced')

  const safeName = (row.name || '').trim()
  const firstName = safeName.split(/\s+/)[0] || 'there'
  const isNew = (Date.now() - memberSinceDate.getTime()) < 30 * 24 * 60 * 60 * 1000

  return {
    id: row.id,
    initial: safeName ? safeName.slice(0, 1).toUpperCase() : '?',
    name: safeName || 'Anonymous',
    firstName,
    // Featured beats New; otherwise show New only for genuinely-recent listings.
    badge: row.featured ? 'Featured' : (isNew ? 'New' : null),
    badgeKind: row.featured ? 'featured' : (isNew ? 'new' : null),
    featured: !!row.featured,
    // Drop appended location to avoid duplicating it (location already shows as a tag)
    role: row.role_title,
    // Use friendlier function-derived headlines (e.g. "Software engineer" not "Software Engineering professional")
    headline: funcs.length ? (FUNC_HEADLINE_MAP[funcs[0]] || funcs[0]) : row.role_title,
    topics: row.topics || '',
    tags,
    capacity: capacityLabel,
    updated: `Member since ${memberSince}`,
    linkedIn: row.linkedin_url || null,
    avatarUrl: row.avatar_url || null,
    dataRoleSlugs: `|${dataRoles.join('|')}|`,
    dataFuncSlugs: funcSlugString,
    dataStageSlugs: `|${dataStages.join('|')}|`,
    dataIdentitySlugs: identitySlugString,
    dataKeywords: `${safeName} ${row.role_title || ''} ${row.topics || ''} ${funcs.join(' ')} ${identities.join(' ')} ${row.location || ''}`.toLowerCase(),
  }
}

export default function CoffeeChat() {
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
    consent1: false, consent2: false, consent3: false,
    // Honeypot — real users never fill this. Bots that auto-fill all inputs will trip it.
    website: '',
  })

  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileWidgetRef = useRef(null)
  const turnstileRenderedRef = useRef(false)

  useEffect(() => {
    if (!turnstileSiteKey) return
    if (document.getElementById('cf-turnstile-script')) return
    const script = document.createElement('script')
    script.id = 'cf-turnstile-script'
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [turnstileSiteKey])

  useEffect(() => {
    if (!turnstileSiteKey || formSubmitted) return
    const renderWidget = () => {
      if (!window.turnstile || !turnstileWidgetRef.current || turnstileRenderedRef.current) return
      window.turnstile.render(turnstileWidgetRef.current, {
        sitekey: turnstileSiteKey,
        callback: (token) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
        theme: 'light',
      })
      turnstileRenderedRef.current = true
    }
    renderWidget()
    const interval = setInterval(renderWidget, 250)
    const timeout = setTimeout(() => clearInterval(interval), 8000)
    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [turnstileSiteKey, formSubmitted])

  const [dbProfiles, setDbProfiles] = useState([])
  const [profilesLoading, setProfilesLoading] = useState(true)
  const [profilesError, setProfilesError] = useState(false)
  const [sharedId, setSharedId] = useState(null)
  const [highlightId, setHighlightId] = useState(null)
  const [submittedProfileId, setSubmittedProfileId] = useState(null)

  // Newsletter signup state (small subscribe row near the bottom of the page).
  const [subEmail, setSubEmail] = useState('')
  const [subHoneypot, setSubHoneypot] = useState('')
  const [subState, setSubState] = useState('idle') // idle | loading | success | error
  const [subError, setSubError] = useState('')

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setSubError('')
    // Honeypot: bots auto-filling all inputs trip this; treat as silent success.
    if (subHoneypot) {
      setSubState('success')
      setSubEmail('')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subEmail.trim())) {
      setSubError('Please enter a valid email.')
      return
    }
    setSubState('loading')
    const { error } = await supabase.from('subscribers').insert({
      email: subEmail.trim(),
      source: 'coffee-chat-page',
    })
    if (error && error.code !== '23505') {
      setSubState('error')
      setSubError('Could not subscribe. Try again in a moment.')
      return
    }
    // Treat existing email as success (silent re-subscribe is fine UX).
    setSubState('success')
    setSubEmail('')
  }
  const [searchParams] = useSearchParams()
  const ccModalRef = useRef(null)
  const lastFocusedRef = useRef(null)
  const copyTimeoutRef = useRef(null)
  const shareTimeoutRef = useRef(null)

  useEffect(() => {
    // Explicit column list — never fetch `email` to the public client.
    // Try first with approved_at (newer schema). Fall back to created_at-only on column-missing
    // so the page still works against an older deployed schema.
    const baseColumns = 'id, name, pronouns, linkedin_url, role_title, location, role_function, identity_tags, topics, capacity, avatar_url, created_at'
    const run = async () => {
      // Try newest schema first (featured + approved_at). Fall back twice for older deploys.
      let { data, error } = await supabase.from('coffee_chat_profiles')
        .select(`${baseColumns}, approved_at, featured`)
        .eq('status', 'approved')
        .eq('public_profile', true)
        .order('featured', { ascending: false })
        .order('approved_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
      if (error?.code === '42703' && error?.message?.includes('featured')) {
        // Schema has approved_at but not featured.
        ;({ data, error } = await supabase.from('coffee_chat_profiles')
          .select(`${baseColumns}, approved_at`)
          .eq('status', 'approved')
          .eq('public_profile', true)
          .order('approved_at', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false }))
      }
      if (error?.code === '42703') {
        // Oldest schema — neither column.
        ;({ data, error } = await supabase.from('coffee_chat_profiles')
          .select(baseColumns)
          .eq('status', 'approved')
          .eq('public_profile', true)
          .order('created_at', { ascending: false }))
      }
      if (error) {
        setProfilesError(true)
      } else if (data?.length) {
        setDbProfiles(data.map(dbProfileToCard))
      }
      setProfilesLoading(false)
    }
    run()
  }, [])

  // Debounced search keeps filter responsive at scale.
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 180)
    return () => clearTimeout(id)
  }, [search])

  // Deep link: ?profile=<id> scrolls to and highlights a specific card.
  // Fires once when profiles finish loading so submitting a new profile
  // afterward doesn't re-scroll the user back to the originally-shared card.
  const deepLinkHandledRef = useRef(false)
  useEffect(() => {
    if (deepLinkHandledRef.current) return
    const id = searchParams.get('profile')
    if (!id || profilesLoading) return
    deepLinkHandledRef.current = true
    setTimeout(() => {
      const el = document.getElementById(`cc-card-${id}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setHighlightId(id)
        setTimeout(() => setHighlightId(null), 2500)
      }
    }, 300)
  }, [searchParams, profilesLoading])

  const copyShareLink = (profileId) => {
    const url = `${window.location.origin}/coffee-chat?profile=${profileId}`
    navigator.clipboard.writeText(url).then(() => {
      setSharedId(profileId)
      if (shareTimeoutRef.current) clearTimeout(shareTimeoutRef.current)
      shareTimeoutRef.current = setTimeout(() => setSharedId(null), 2500)
    }).catch(() => {})
  }

  useEffect(() => () => {
    if (shareTimeoutRef.current) clearTimeout(shareTimeoutRef.current)
  }, [])

  useEffect(() => () => {
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
  }, [])

  // Revoke any leftover object URL when the form unmounts to prevent leaks.
  useEffect(() => () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
  }, [photoPreview])

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

  // Helper: does a profile match the search query and the active filters,
  // optionally excluding one filter category (used for stacked filter counts).
  const matchesFilters = useCallback((p, exclude) => {
    const q = debouncedSearch.toLowerCase().trim()
    if (q) {
      const haystack = [p.dataKeywords, p.name.toLowerCase(), p.dataRoleSlugs, p.dataStageSlugs].join(' ')
      if (!haystack.includes(q)) return false
    }
    if (exclude !== 'role' && filterRole && !p.dataRoleSlugs.includes(`|${filterRole}|`)) return false
    if (exclude !== 'func' && filterFunc && !p.dataFuncSlugs.includes(`|${filterFunc}|`)) return false
    if (exclude !== 'stage' && filterStage && !p.dataStageSlugs.includes(`|${filterStage}|`)) return false
    if (exclude !== 'identity' && filterIdentity && !p.dataIdentitySlugs.includes(`|${filterIdentity}|`)) return false
    return true
  }, [debouncedSearch, filterRole, filterFunc, filterStage, filterIdentity])

  const visibleProfiles = useMemo(
    () => dbProfiles.filter(p => matchesFilters(p)),
    [dbProfiles, matchesFilters]
  )

  const anyFilterActive = Boolean(debouncedSearch || filterRole || filterFunc || filterStage || filterIdentity)

  // Per-option counts that respect *other* active filters so the numbers stay honest.
  // Picking Role=Student updates Function counts to "(N within students)" rather than "(N total)".
  const filterCounts = useMemo(() => {
    const counts = { role: {}, func: {}, stage: {}, identity: {} }
    const bump = (obj, slugs) => slugs.split('|').filter(Boolean).forEach(s => { obj[s] = (obj[s] || 0) + 1 })
    for (const p of dbProfiles) {
      if (matchesFilters(p, 'role')) bump(counts.role, p.dataRoleSlugs)
      if (matchesFilters(p, 'func')) bump(counts.func, p.dataFuncSlugs)
      if (matchesFilters(p, 'stage')) bump(counts.stage, p.dataStageSlugs)
      if (matchesFilters(p, 'identity')) bump(counts.identity, p.dataIdentitySlugs)
    }
    return counts
  }, [dbProfiles, matchesFilters])
  const countSuffix = (n) => n ? ` (${n})` : ''

  const openModal = (name) => {
    lastFocusedRef.current = document.activeElement
    setModalName(name)
    setModalOpen(true)
    setCopied(false)
  }

  const closeModal = () => {
    setModalOpen(false)
    setCopied(false)
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = null
    }
    // Restore focus to the trigger so keyboard users don't lose their place
    setTimeout(() => {
      const el = lastFocusedRef.current
      if (el && typeof el.focus === 'function') el.focus()
    }, 0)
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

  // Smooth scroll for in-page hero CTAs without fighting the router's hash effect.
  const scrollToSection = (id) => (e) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const copyTemplate = () => {
    const text = TEMPLATE_TEXT.replace('[Name]', modalName)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false)
        copyTimeoutRef.current = null
      }, 2500)
    }).catch(() => {
      setCopied(false)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Honeypot: silently swallow bots without surfacing a real error.
    if (formData.website) {
      setFormSubmitted(true)
      return
    }
    if (turnstileSiteKey && !turnstileToken) {
      setFormError('Please complete the verification challenge before submitting.')
      return
    }
    // Server-side verify the Turnstile token. If the edge function isn't deployed yet,
    // we treat it as a soft-pass (the client widget alone still gates obvious bots).
    if (turnstileSiteKey && turnstileToken) {
      try {
        const { data: verify, error: verifyErr } = await supabase.functions.invoke('verify-turnstile', {
          body: { token: turnstileToken },
        })
        if (verifyErr) {
          // Edge function missing or returned non-2xx — log but allow submission.
          console.warn('Turnstile verify call failed; falling back to client-only gate:', verifyErr.message)
        } else if (verify && verify.success === false) {
          setFormError('The verification challenge failed. Please try again.')
          if (window.turnstile && turnstileWidgetRef.current) {
            try { window.turnstile.reset(turnstileWidgetRef.current) } catch {}
          }
          setTurnstileToken('')
          return
        }
      } catch (e) {
        console.warn('Turnstile verify threw:', e)
      }
    }
    const { name, email, linkedin, role, topics, capacity, consent1, consent2, consent3 } = formData
    const trimmedEmail = email.trim()
    if (!name.trim() || !trimmedEmail || !linkedin.trim() || !role.trim() || !topics.trim() || !capacity || funcChips.length === 0) {
      setFormError('Please fill in all required fields before submitting.')
      return
    }
    // Basic email shape check beyond browser validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.')
      return
    }
    if (!LINKEDIN_URL_REGEX.test(linkedin.trim())) {
      setFormError('Please enter a valid LinkedIn URL (e.g. https://linkedin.com/in/yourname).')
      return
    }
    if (funcChips.includes('Other') && !funcOtherText.trim()) {
      setFormError('Please describe your role / function in the "Other" field.')
      return
    }
    if (identityChips.includes('Other') && !identityOtherText.trim()) {
      setFormError('Please describe your identity in the "Other" field.')
      return
    }
    if (!consent1 || !consent2 || !consent3) {
      setFormError('Please check all three consent boxes before submitting.')
      return
    }
    setFormLoading(true)
    setFormError('')

    // Normalize LinkedIn URL — accept "linkedin.com/in/foo" without scheme
    const normalizedLinkedIn = (() => {
      const trimmed = linkedin.trim()
      if (/^https?:\/\//i.test(trimmed)) return trimmed
      return `https://${trimmed.replace(/^\/+/, '')}`
    })()

    let avatar_url = null
    if (photoFile) {
      const ext = (photoFile.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, photoFile, { contentType: photoFile.type })
      if (uploadError) {
        setFormLoading(false)
        setFormError('We couldn\'t upload your photo. Please try a smaller image, a different format, or remove it and resubmit.')
        return
      }
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      avatar_url = data.publicUrl
    }

    const processedFuncChips = funcChips.map(c => c === 'Other' ? funcOtherText.trim() : c)
    const processedIdentityChips = identityChips.map(c => c === 'Other' ? identityOtherText.trim() : c)

    const nowIso = new Date().toISOString()
    const insertPayload = {
      name: name.trim(),
      pronouns: formData.pronouns.trim() || null,
      email: trimmedEmail,
      linkedin_url: normalizedLinkedIn,
      role_title: role.trim(),
      location: formData.location.trim() || null,
      role_function: processedFuncChips,
      identity_tags: processedIdentityChips,
      topics: topics.trim(),
      capacity: capacity,
      consented_at: nowIso,
      // Auto-approve for now: profiles go live immediately so the directory builds momentum.
      // The admin moderation page still exists at /admin/coffee-chat — it can be re-enabled
      // later by flipping this back to 'pending'.
      status: 'approved',
      approved_at: nowIso,
      public_profile: true,
      avatar_url,
    }
    const { data: insertedRows, error } = await supabase.from('coffee_chat_profiles')
      .insert(insertPayload)
      .select('id, name, pronouns, linkedin_url, role_title, location, role_function, identity_tags, topics, capacity, avatar_url, created_at, approved_at, featured')
    setFormLoading(false)
    if (error) {
      if (error.code === '23505') {
        setFormError('We already have a submission with this email. If you\'d like to update your profile, please email campustocareerteam@gmail.com.')
      } else if (error.message?.toLowerCase().includes('row-level security')) {
        setFormError('Submission was blocked by security rules. Please email campustocareerteam@gmail.com so we can investigate.')
      } else {
        setFormError('Something went wrong. Please try again.')
      }
    } else {
      const newRow = insertedRows?.[0]
      if (newRow) {
        const newCard = dbProfileToCard(newRow)
        setDbProfiles(prev => [newCard, ...prev])
        setSubmittedProfileId(newRow.id)
        // Fire-and-forget: send the welcome email if the edge function is deployed.
        // Failures are silent — the directory listing is the source of truth.
        try {
          supabase.functions.invoke('coffee-chat-welcome', {
            body: { name: newRow.name, email: trimmedEmail, profileId: newRow.id },
          }).catch(() => {})
        } catch { /* noop — edge function may not be deployed */ }
      }
      setFormSubmitted(true)
    }
  }

  const viewMyProfile = () => {
    if (!submittedProfileId) return
    const el = document.getElementById(`cc-card-${submittedProfileId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setHighlightId(submittedProfileId)
      setTimeout(() => setHighlightId(null), 2500)
    }
  }

  return (
    <ArticleLayout
      title="Coffee Chat Network"
      description="A live directory of students, grads, and professionals who actually want to be reached out to. Browse profiles, filter by background and role, and request a 15–30 minute coffee chat using our templates."
    >
      <style>{`
        html, body { background: var(--color-cream); }

        .cc-kicker { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--color-muted); margin-bottom: 14px; }
        .cc-section-title { font-family: var(--font-display); font-size: clamp(26px,4vw,40px); font-weight: 700; color: var(--color-dark); line-height: 1.15; margin-bottom: 10px; }
        .cc-section-sub { font-family: var(--font-display); font-size: clamp(16px,2vw,20px); font-weight: 400; color: var(--color-accent); margin-bottom: 20px; }
        .cc-section-body { font-size: clamp(15px,1.8vw,17px); color: var(--color-muted); line-height: 1.75; max-width: 700px; }
        .cc-section-body + .cc-section-body { margin-top: 18px; }
        .cc-section-body strong { color: var(--color-dark); font-weight: 600; }
        .cc-divider { border: none; border-top: 1px solid rgba(0,0,0,.08); margin: 0; }

        .cc-hero { padding: 120px clamp(20px,5vw,56px) 64px; max-width: 1040px; margin: 0 auto; }
        .cc-hero__kicker { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--color-muted); margin-bottom: 18px; }
        .cc-hero__title { font-family: var(--font-display); font-size: clamp(42px,7vw,80px); font-weight: 700; line-height: 1.04; color: var(--color-dark); margin-bottom: 14px; }
        .cc-hero__title em { font-style: normal; color: var(--color-teal); }
        .cc-hero__sub { font-family: var(--font-display); font-size: clamp(18px,2.5vw,26px); font-weight: 400; color: var(--color-dark); line-height: 1.4; max-width: 720px; margin-bottom: 24px; }
        .cc-hero__body { font-size: clamp(15px,1.8vw,17px); color: var(--color-muted); line-height: 1.8; max-width: 680px; margin-bottom: 40px; }
        .cc-hero__body strong { color: var(--color-dark); font-weight: 600; }
        .cc-hero__ctas { display: flex; flex-wrap: wrap; gap: 12px; }

        .cc-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: var(--color-dark); color: var(--color-cream); border-radius: 8px; font-family: var(--font-display); font-size: 14px; font-weight: 600; text-decoration: none; border: 1.5px solid var(--color-dark); cursor: pointer; transition: background .2s, transform .18s cubic-bezier(.16,1,.3,1); }
        .cc-btn-primary:hover { background: var(--color-teal); border-color: var(--color-teal); transform: translateY(-1px); }
        .cc-btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: transparent; color: var(--color-dark); border-radius: 8px; font-family: var(--font-display); font-size: 14px; font-weight: 600; text-decoration: none; border: 1.5px solid rgba(0,0,0,.2); cursor: pointer; transition: border-color .2s, color .2s, transform .18s; }
        .cc-btn-secondary:hover { border-color: var(--color-dark); color: var(--color-accent); transform: translateY(-1px); }

        .cc-how { max-width: 1040px; margin: 0 auto; padding: 80px clamp(20px,5vw,56px); }
        .cc-how__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px 60px; margin-top: 36px; }
        .cc-how__step { display: flex; flex-direction: column; gap: 10px; }
        .cc-how__num { font-family: var(--font-display); font-size: 13px; font-weight: 700; color: var(--color-teal); letter-spacing: .1em; text-transform: uppercase; }
        .cc-how__step-title { font-family: var(--font-display); font-size: clamp(17px,2vw,20px); font-weight: 700; color: var(--color-dark); line-height: 1.25; }
        .cc-how__step-body { font-size: clamp(14px,1.6vw,15px); color: var(--color-muted); line-height: 1.75; }

        .cc-browse { max-width: 1040px; margin: 0 auto; padding: 80px clamp(20px,5vw,56px); }
        .cc-browse__head { margin-bottom: 36px; }
        .cc-filter-bar { display: flex; flex-direction: column; gap: 14px; margin-bottom: 36px; }
        .cc-search-wrap { position: relative; }
        .cc-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--color-muted); pointer-events: none; }
        .cc-search { width: 100%; font-family: var(--font-body); font-size: 15px; padding: 13px 14px 13px 42px; border: 1.5px solid rgba(0,0,0,.12); border-radius: 10px; background: var(--color-white); color: var(--color-dark); outline: none; transition: border-color .2s; }
        .cc-search:focus { border-color: var(--color-gold); }
        .cc-search::placeholder { color: var(--color-muted); }
        .cc-filters { display: flex; flex-wrap: wrap; gap: 10px; }
        .cc-filter-select { font-family: var(--font-body); font-size: 13px; font-weight: 500; padding: 9px 32px 9px 12px; border: 1.5px solid rgba(0,0,0,.12); border-radius: 8px; background: var(--color-white); color: var(--color-dark); outline: none; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B5E52' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; transition: border-color .2s; flex-shrink: 0; }
        .cc-filter-select:focus { border-color: var(--color-gold); }
        .cc-results-count { font-size: 13px; color: var(--color-muted); margin-bottom: 20px; }
        .cc-results-count span { font-weight: 600; color: var(--color-dark); }

        .cc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 20px; }
        .cc-no-results { grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--color-muted); font-size: 15px; }

        .cc-card { background: var(--color-white); border: 1px solid rgba(0,0,0,.08); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 14px; transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s; }
        .cc-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(0,0,0,.09); }
        .cc-card__top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .cc-card__avatar { width: 48px; height: 48px; border-radius: 50%; background: rgba(58,125,107,.1); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--color-teal); flex-shrink: 0; border: 1.5px solid rgba(58,125,107,.15); }
        .cc-card__badge { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: 3px 9px; border-radius: 20px; background: rgba(58,125,107,.1); color: var(--color-teal); flex-shrink: 0; }
        .cc-card__badge--new { background: rgba(232,168,56,.12); color: var(--color-gold-dark); }
        .cc-card__badge--featured { background: rgba(58,125,107,.14); color: var(--color-teal); }
        .cc-card__name { font-family: var(--font-display); font-size: clamp(16px,1.8vw,18px); font-weight: 700; color: var(--color-dark); line-height: 1.2; }
        .cc-card__role { font-size: 13px; color: var(--color-muted); line-height: 1.4; }
        .cc-card__headline { font-size: 13px; color: var(--color-teal); font-weight: 500; font-style: italic; line-height: 1.5; }
        .cc-card__topics-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--color-muted); margin-bottom: 4px; }
        .cc-card__topics { font-size: 13px; color: var(--color-muted); line-height: 1.55; }
        .cc-card__tags { display: flex; flex-wrap: wrap; gap: 5px; }
        .cc-tag { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; }
        .cc-tag--teal   { background: rgba(58,125,107,.1);  color: var(--color-teal); }
        .cc-tag--blue   { background: rgba(91,142,194,.12); color: var(--color-navy); }
        .cc-tag--gold   { background: rgba(232,168,56,.12); color: var(--color-gold-dark); }
        .cc-tag--accent { background: rgba(179,69,57,.08);  color: var(--color-accent); }
        .cc-tag--navy   { background: rgba(22,43,68,.08);   color: var(--color-navy); }
        .cc-tag--muted  { background: rgba(0,0,0,.05);      color: var(--color-muted); }
        .cc-card__capacity { font-size: 12px; color: var(--color-muted); display: flex; align-items: center; gap: 5px; }
        .cc-card__capacity::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--color-teal); flex-shrink: 0; }
        .cc-card__updated { font-size: 11px; color: rgba(0,0,0,.3); }
        .cc-card__actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 2px; }
        .cc-card__cta-primary { display: inline-flex; align-items: center; gap: 6px; padding: 13px 16px; background: var(--color-dark); color: var(--color-cream); border-radius: 8px; font-family: var(--font-display); font-size: 12px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: background .2s, transform .15s; flex: 1; justify-content: center; }
        .cc-card__cta-primary:hover { background: var(--color-teal); transform: translateY(-1px); }
        .cc-card__cta-secondary { display: inline-flex; align-items: center; gap: 6px; padding: 13px 14px; background: transparent; color: var(--color-muted); border-radius: 8px; font-family: var(--font-display); font-size: 12px; font-weight: 600; text-decoration: none; border: 1.5px solid rgba(0,0,0,.12); cursor: pointer; transition: border-color .2s, color .2s; flex-shrink: 0; }
        .cc-card__cta-secondary:hover { border-color: var(--color-dark); color: var(--color-dark); }
        .cc-card__footer-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: -2px; }
        .cc-card__report { font-size: 11px; color: rgba(0,0,0,.35); text-decoration: none; transition: color .15s; }
        .cc-card__report:hover { color: var(--color-accent); text-decoration: underline; }
        .cc-card__share { font-size: 11px; color: rgba(0,0,0,.45); text-decoration: none; background: none; border: none; padding: 0; cursor: pointer; font-family: var(--font-body); transition: color .15s; }
        .cc-card__share:hover { color: var(--color-teal); text-decoration: underline; }
        .cc-card--highlight { box-shadow: 0 0 0 3px rgba(58,125,107,.4), 0 10px 32px rgba(0,0,0,.12); transform: translateY(-3px); }

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

        .cc-apply { max-width: 1040px; margin: 0 auto; padding: 80px clamp(20px,5vw,56px); }
        .cc-apply__layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; align-items: flex-start; }
        .cc-apply__intro-kicker { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--color-muted); margin-bottom: 12px; }
        .cc-apply__intro-title { font-family: var(--font-display); font-size: clamp(22px,3vw,32px); font-weight: 700; color: var(--color-dark); line-height: 1.2; margin-bottom: 16px; }
        .cc-apply__intro-body { font-size: clamp(14px,1.6vw,15px); color: var(--color-muted); line-height: 1.75; }
        .cc-apply__intro-body strong { color: var(--color-dark); font-weight: 600; }
        .cc-apply__perks { margin-top: 28px; display: flex; flex-direction: column; gap: 12px; }
        .cc-apply__perk { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--color-muted); line-height: 1.55; }
        .cc-apply__perk-icon { width: 22px; height: 22px; border-radius: 50%; background: rgba(58,125,107,.1); color: var(--color-teal); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }

        .cc-form-box { background: var(--color-white); border: 1px solid rgba(0,0,0,.07); border-radius: 16px; padding: clamp(28px,4vw,44px); }
        .cc-form-row { margin-bottom: 16px; }
        .cc-form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .cc-form-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--color-muted); margin-bottom: 6px; }
        .cc-form-label span { color: var(--color-accent); }
        .cc-form-input, .cc-form-select, .cc-form-textarea { width: 100%; font-family: var(--font-body); font-size: 15px; padding: 11px 14px; border: 1.5px solid rgba(0,0,0,.12); border-radius: 8px; background: var(--color-white); color: var(--color-dark); outline: none; transition: border-color .2s; }
        .cc-form-input:focus, .cc-form-select:focus, .cc-form-textarea:focus { border-color: var(--color-gold); }
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
        .cc-safety__box { background: rgba(22,43,68,.04); border: 1px solid rgba(22,43,68,.1); border-radius: 12px; padding: 28px 32px; display: flex; gap: 18px; align-items: flex-start; }
        .cc-safety__icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
        .cc-safety__text { font-size: clamp(13px,1.5vw,14px); color: var(--color-muted); line-height: 1.75; }
        .cc-safety__text strong { color: var(--color-navy); font-weight: 600; }

        .cc-eco { background: var(--color-navy); padding: 72px clamp(20px,5vw,56px); }
        .cc-eco__inner { max-width: 1040px; margin: 0 auto; }
        .cc-eco__kicker { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(242,228,206,.45); margin-bottom: 10px; }
        .cc-eco__title { font-family: var(--font-display); font-size: clamp(22px,3vw,30px); font-weight: 700; color: var(--color-cream); margin-bottom: 8px; line-height: 1.25; }
        .cc-eco__body { font-size: clamp(14px,1.7vw,15px); color: rgba(242,228,206,.6); line-height: 1.7; max-width: 640px; margin-bottom: 36px; }
        .cc-eco__grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(200px,1fr)); gap: 16px; }
        .cc-eco__link { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; padding: 20px 22px; text-decoration: none; transition: background .2s, transform .2s cubic-bezier(.16,1,.3,1); display: block; }
        .cc-eco__link:hover { background: rgba(255,255,255,.1); transform: translateY(-2px); }
        .cc-eco__link-title { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--color-cream); margin-bottom: 4px; }
        .cc-eco__link-desc { font-size: 12px; color: rgba(242,228,206,.5); line-height: 1.5; }

        .cc-modal-overlay { position: fixed; inset: 0; background: rgba(26,25,22,.55); backdrop-filter: blur(4px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; pointer-events: none; transition: opacity .2s; }
        .cc-modal-overlay.open { opacity: 1; pointer-events: all; }
        .cc-modal { background: var(--color-white); border-radius: 16px; padding: 36px; max-width: 560px; width: 100%; max-height: 85vh; overflow-y: auto; transform: translateY(12px); transition: transform .25s cubic-bezier(.16,1,.3,1); position: relative; }
        .cc-modal-overlay.open .cc-modal { transform: translateY(0); }
        .cc-modal__close { position: absolute; top: 12px; right: 12px; min-width: 44px; min-height: 44px; border-radius: 50%; border: none; background: rgba(0,0,0,.06); color: var(--color-muted); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .15s; }
        .cc-modal__close:hover { background: rgba(0,0,0,.12); }
        .cc-modal__kicker { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--color-teal); margin-bottom: 8px; }
        .cc-modal__title { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--color-dark); margin-bottom: 6px; }
        .cc-modal__sub { font-size: 13px; color: var(--color-muted); line-height: 1.6; margin-bottom: 20px; }
        .cc-modal__template { background: var(--color-cream); border-radius: 10px; padding: 20px 22px; font-size: 14px; line-height: 1.75; color: var(--color-dark); margin-bottom: 16px; white-space: pre-wrap; font-family: var(--font-body); }
        .cc-modal__copy-btn { width: 100%; padding: 13px; background: var(--color-dark); color: var(--color-cream); border: none; border-radius: 8px; font-family: var(--font-display); font-size: 13px; font-weight: 600; cursor: pointer; transition: background .2s; }
        .cc-modal__copy-btn:hover, .cc-modal__copy-btn.copied { background: var(--color-teal); }
        .cc-modal__close:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px; }
        .cc-modal__copy-btn:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px; border-radius: 8px; }
        .cc-card__cta-primary:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px; border-radius: 8px; }
        .cc-card__cta-secondary:focus-visible { outline: 2px solid var(--color-dark); outline-offset: 2px; border-radius: 8px; }

        .cc-ms-trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 11px 14px; border: 1.5px solid rgba(0,0,0,.12); border-radius: 8px; background: var(--color-white); color: var(--color-dark); font-family: var(--font-body); font-size: 15px; text-align: left; cursor: pointer; transition: border-color .2s; }
        .cc-ms-trigger:focus { border-color: var(--color-gold); outline: none; }
        .cc-ms-trigger span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--color-dark); }
        .cc-ms-trigger span.cc-ms-placeholder { color: var(--color-muted); }
        .cc-ms-menu { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: var(--color-white); border: 1.5px solid rgba(0,0,0,.12); border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.1); z-index: 100; max-height: 220px; overflow-y: auto; padding: 6px; }
        .cc-ms-option { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 6px; font-size: 14px; color: var(--color-dark); cursor: pointer; transition: background .15s; }
        .cc-ms-option:hover { background: rgba(0,0,0,.04); }
        .cc-ms-option.selected { background: rgba(58,125,107,.08); color: var(--color-teal); }
        .cc-ms-check { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid rgba(0,0,0,.2); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; color: var(--color-teal); }
        .cc-ms-option.selected .cc-ms-check { border-color: var(--color-teal); background: rgba(58,125,107,.12); }
        .cc-selected-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .cc-selected-tag { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: rgba(58,125,107,.1); color: var(--color-teal); border-radius: 20px; font-size: 12px; font-weight: 600; }
        .cc-selected-tag button { background: none; border: none; color: inherit; cursor: pointer; font-size: 14px; line-height: 1; padding: 0; opacity: .7; }
        .cc-selected-tag button:hover { opacity: 1; }

        .cc-photo-upload { display: flex; align-items: center; gap: 16px; }
        .cc-photo-preview { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(0,0,0,.1); flex-shrink: 0; }
        .cc-photo-placeholder { width: 64px; height: 64px; border-radius: 50%; background: rgba(0,0,0,.05); display: flex; align-items: center; justify-content: center; color: var(--color-muted); flex-shrink: 0; border: 1.5px dashed rgba(0,0,0,.15); }
        .cc-photo-right { display: flex; flex-direction: column; gap: 4px; }
        .cc-photo-btn { display: inline-block; padding: 8px 16px; background: var(--color-white); border: 1.5px solid rgba(0,0,0,.15); border-radius: 8px; font-family: var(--font-display); font-size: 13px; font-weight: 600; color: var(--color-dark); cursor: pointer; transition: border-color .2s; }
        .cc-photo-btn:hover { border-color: var(--color-dark); }
        .cc-photo-hint { font-size: 12px; color: var(--color-muted); margin: 0; }
        .cc-photo-remove { background: none; border: none; font-size: 12px; color: var(--color-accent); cursor: pointer; padding: 0; font-family: var(--font-body); }

        @media (max-width: 640px) { .cc-how__grid { grid-template-columns: 1fr; gap: 28px; } }
        @media (max-width: 640px) { .cc-reach__grid { grid-template-columns: 1fr; gap: 32px; } }
        @media (max-width: 740px) { .cc-apply__layout { grid-template-columns: 1fr; gap: 36px; } .cc-form-row-2 { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .cc-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .cc-hero { padding: 88px 20px 48px; } .cc-how, .cc-browse, .cc-apply, .cc-safety { padding-top: 48px; padding-bottom: 48px; } }
        @media (max-width: 480px) { .cc-hero { padding: 80px 16px 40px; } }
      `}</style>

      <header className="cc-hero">
        <p className="cc-hero__kicker">From Campus to Career · Community</p>
        <h1 className="cc-hero__title">Coffee Chat <em>Network</em></h1>
        <p className="cc-hero__sub">A live directory of students, grads, and professionals who actually want to be reached out to.</p>
        <p className="cc-hero__body">
          Cold outreach is hard when you don't know who is open to talking. The Coffee Chat Network is a self-serve directory of people who have raised their hand to say, <strong>"Yes, you can reach out to me."</strong> Everyone listed here has opted in to be contacted for 15–30 minute conversations about career paths, recruiting, internships, apprenticeships, and early-career life in tech and related fields. You can browse profiles, find people whose journeys look like the future you want, and click straight into their LinkedIn to request a chat using our templates.
        </p>
        <div className="cc-hero__ctas">
          <a href="#browse" onClick={scrollToSection('browse')} className="cc-btn-primary">Browse profiles</a>
          <a href="#apply" onClick={scrollToSection('apply')} className="cc-btn-secondary">Add yourself to the network</a>
        </div>
      </header>

      <hr className="cc-divider" />

      <section className="cc-how" id="how-it-works">
        <div>
          <p className="cc-kicker">Section 01</p>
          <h2 className="cc-section-title">How this network works</h2>
          <p className="cc-section-sub">No guessing. No cold-messaging strangers. Just a directory of people who said yes.</p>
        </div>
        <p className="cc-section-body">
          Everyone in this directory has filled out a short form and agreed to be listed as a connection. That means you are not guessing if someone is open to messages — you already know they are. The goal is to make networking feel less random and more like a structured, human directory you can navigate by interest, role, identity, and location.
        </p>
        <p className="cc-section-body" style={{ marginTop: '16px' }}>
          You pick who to reach out to, you send the request directly (usually via LinkedIn), and you schedule time that works for both of you. <strong>Jose and Jocelyn are not brokering introductions in the middle</strong> — this is a self-serve network designed to scale and stay lightweight.
        </p>
        <p className="cc-section-body" style={{ marginTop: '16px' }}>
          Want to be listed yourself? Fill out the form at the bottom of the page. Your profile <strong>goes live in the directory the moment you submit</strong> — no review queue, no waiting. You can email us anytime to update or remove it.
        </p>
        <div className="cc-how__grid">
          {[
            { num: 'Step 01', title: 'Browse the directory', body: 'Use the search bar and filters to find people whose backgrounds, roles, or paths align with where you are trying to go. Read their cards carefully before reaching out.' },
            { num: 'Step 02', title: 'Read their profile', body: "Every card shows their current role, their function tags (SWE, data, design, etc.), background tags (first-gen, transfer, etc.), the topics they can talk about, and how many chats per month they take. Use all of that before you write your message." },
            { num: 'Step 03', title: 'Send a personalized message', body: 'Use our coffee chat request templates as a starting point. Keep it short, specific, and respectful of their time. Under 80 words is a good rule of thumb.' },
            { num: 'Step 04', title: 'Show up prepared', body: 'If they accept, come ready with 3–5 real questions. Do your research. Be on time. Send a thank-you after. These small things matter more than most people think.' },
          ].map(s => (
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
          <p className="cc-kicker">Section 02</p>
          <h2 className="cc-section-title">Browse the Coffee Chat Network</h2>
          <p className="cc-section-sub">Search and filter by role, function, career stage, or background.</p>
          <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '6px', maxWidth: '640px' }}>
            <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px', background: 'rgba(58,125,107,.14)', color: 'var(--color-teal)', marginRight: '6px' }}>Featured</span>
            profiles appear at the top — typically people Jose &amp; Jocelyn have personally vouched for.
            <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px', background: 'rgba(232,168,56,.12)', color: 'var(--color-gold-dark)', margin: '0 6px 0 14px' }}>New</span>
            badges mark profiles added in the last 30 days.
          </p>
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
              placeholder="Search by name, role, company, school, or keyword…"
              aria-label="Search profiles"
              autoComplete="off"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="cc-filters">
            <select className="cc-filter-select" aria-label="Role type" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option value="">All Role Types</option>
              <option value="student">Student / Intern{countSuffix(filterCounts.role['student'])}</option>
              <option value="new-grad">New Grad{countSuffix(filterCounts.role['new-grad'])}</option>
              <option value="early-career">Early Career{countSuffix(filterCounts.role['early-career'])}</option>
              <option value="mid-career">Mid / Senior{countSuffix(filterCounts.role['mid-career'])}</option>
              <option value="recruiter">Recruiter{countSuffix(filterCounts.role['recruiter'])}</option>
              <option value="career-changer">Career Changer{countSuffix(filterCounts.role['career-changer'])}</option>
            </select>
            <select className="cc-filter-select" aria-label="Function" value={filterFunc} onChange={e => setFilterFunc(e.target.value)}>
              <option value="">All Functions</option>
              {FUNCTION_OPTIONS.filter(f => f !== 'Other').map(f => {
                const slug = slugify(f)
                return <option key={f} value={slug}>{f}{countSuffix(filterCounts.func[slug])}</option>
              })}
            </select>
            <select className="cc-filter-select" aria-label="Stage" value={filterStage} onChange={e => setFilterStage(e.target.value)}>
              <option value="">All Stages</option>
              <option value="first-internship">First Internship{countSuffix(filterCounts.stage['first-internship'])}</option>
              <option value="apprenticeship">Apprenticeship{countSuffix(filterCounts.stage['apprenticeship'])}</option>
              <option value="first-full-time">First Full-Time{countSuffix(filterCounts.stage['first-full-time'])}</option>
              <option value="job-searching">Currently Job Searching{countSuffix(filterCounts.stage['job-searching'])}</option>
              <option value="transitioned">Transitioned / Pivoted{countSuffix(filterCounts.stage['transitioned'])}</option>
              <option value="experienced">Experienced{countSuffix(filterCounts.stage['experienced'])}</option>
            </select>
            <select className="cc-filter-select" aria-label="Identity" value={filterIdentity} onChange={e => setFilterIdentity(e.target.value)}>
              <option value="">All Identities</option>
              {IDENTITY_OPTIONS.filter(i => i !== 'Other').map(i => {
                const slug = slugify(i)
                return <option key={i} value={slug}>{i}{countSuffix(filterCounts.identity[slug])}</option>
              })}
            </select>
          </div>
        </div>

        {anyFilterActive && (
          <button
            type="button"
            onClick={() => { setSearch(''); setFilterRole(''); setFilterFunc(''); setFilterStage(''); setFilterIdentity('') }}
            style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: '0 0 14px', fontFamily: 'var(--font-body)' }}
          >
            Clear all filters ×
          </button>
        )}
        {!profilesLoading && !profilesError && (
          <p className="cc-results-count">
            {anyFilterActive
              ? <>Showing <span>{visibleProfiles.length}</span> of <span>{dbProfiles.length}</span> {dbProfiles.length === 1 ? 'profile' : 'profiles'}</>
              : <><span>{dbProfiles.length}</span> {dbProfiles.length === 1 ? 'person' : 'people'} in the network</>
            }
          </p>
        )}

        <div className="cc-grid">
          {profilesLoading ? (
            <p className="cc-no-results" style={{ fontStyle: 'italic' }}>Loading profiles…</p>
          ) : profilesError ? (
            <p className="cc-no-results">Something went wrong loading profiles. Please refresh the page.</p>
          ) : dbProfiles.length === 0 ? (
            <div className="cc-no-results">
              <p style={{ marginBottom: '14px' }}>The directory is just getting started — be one of the first to join.</p>
              <a href="#apply" onClick={scrollToSection('apply')} className="cc-btn-primary" style={{ display: 'inline-flex' }}>Add yourself to the network</a>
            </div>
          ) : visibleProfiles.length === 0 ? (
            <p className="cc-no-results">No profiles match your filters. Try adjusting your search.</p>
          ) : visibleProfiles.map(p => (
            <article key={p.id} id={`cc-card-${p.id}`} className={`cc-card${highlightId === p.id ? ' cc-card--highlight' : ''}`}>
              <div className="cc-card__top">
                <div className="cc-card__avatar">
                  {p.avatarUrl ? (
                    <img
                      src={p.avatarUrl}
                      alt={`${p.name}'s profile photo`}
                      loading="lazy"
                      onError={(e) => {
                        // Hide the broken image and let the initial show as fallback
                        e.currentTarget.style.display = 'none'
                        if (e.currentTarget.parentElement && !e.currentTarget.parentElement.dataset.fallback) {
                          e.currentTarget.parentElement.dataset.fallback = '1'
                          e.currentTarget.parentElement.textContent = p.initial
                        }
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                  ) : p.initial}
                </div>
                {p.badge && <span className={`cc-card__badge cc-card__badge--${p.badgeKind}`}>{p.badge}</span>}
              </div>
              <div>
                <div className="cc-card__name">{p.name}</div>
                <div className="cc-card__role">{p.role}</div>
              </div>
              <div className="cc-card__headline">{p.headline}</div>
              {p.topics && (
                <div>
                  <div className="cc-card__topics-label">Topics</div>
                  <div className="cc-card__topics">{p.topics}</div>
                </div>
              )}
              {p.tags.length > 0 && (
                <div className="cc-card__tags">
                  {p.tags.map(t => <span key={t.label} className={`cc-tag ${t.cls}`}>{t.label}</span>)}
                </div>
              )}
              <div className="cc-card__capacity">{p.capacity}</div>
              <div className="cc-card__updated">{p.updated}</div>
              <div className="cc-card__actions">
                {p.linkedIn && <a href={p.linkedIn} target="_blank" rel="noopener noreferrer" className="cc-card__cta-primary">Connect on LinkedIn ↗</a>}
                <button
                  className="cc-card__cta-secondary"
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => openModal(p.firstName)}
                >
                  Copy template
                </button>
              </div>
              <div className="cc-card__footer-row">
                <button
                  type="button"
                  className="cc-card__share"
                  onClick={() => copyShareLink(p.id)}
                  aria-label={`Share link to ${p.name}'s profile`}
                >
                  {sharedId === p.id ? '✓ Link copied' : 'Share profile'}
                </button>
                <a
                  className="cc-card__report"
                  href={`mailto:campustocareerteam@gmail.com?subject=Coffee%20Chat%20Network%20—%20Report%20listing&body=Listing%20ID%3A%20${encodeURIComponent(p.id)}%0AName%3A%20${encodeURIComponent(p.name)}%0A%0AReason%3A%20`}
                >
                  Report listing
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <hr className="cc-divider" />

      <section className="cc-reach" id="how-to-reach-out">
        <p className="cc-kicker">Section 03</p>
        <h2 className="cc-section-title">How to reach out (without being awkward)</h2>
        <p className="cc-section-sub">A strong first message is short, specific, and human.</p>
        <div className="cc-reach__grid">
          <div>
            <h3 className="cc-reach__col-title">What makes a good message</h3>
            <p className="cc-reach__body">Before you message anyone in the network, read their card and only reach out if something about their path actually connects to where you are trying to go. Your first message should be <strong>under 80 words</strong>, mention something specific about their background, and ask for a simple 15–30 minute chat — not "can you mentor me forever?"</p>
            <p className="cc-reach__body">A strong message usually includes three things: <strong>who you are</strong>, <strong>why you are reaching out to them specifically</strong>, and a <strong>clear, respectful ask</strong>. The Career Templates page has ready-to-use coffee chat request templates you can copy and personalize for each person you contact.</p>
            <Link to="/career-templates" className="cc-reach__templates-link">See coffee chat templates</Link>
          </div>
          <div>
            <h3 className="cc-reach__col-title">The do / don't list</h3>
            <div className="cc-do-list">
              {[
                { type: 'do', text: <><strong>Do</strong> read their profile and LinkedIn before messaging.</> },
                { type: 'do', text: <><strong>Do</strong> personalize at least one sentence to their specific background.</> },
                { type: 'do', text: <><strong>Do</strong> show up on time and prepared with real questions.</> },
                { type: 'do', text: <><strong>Do</strong> send a short thank-you within 24 hours.</> },
                { type: 'dont', text: <><strong>Don't</strong> ask them to get you a job or a referral in the first message.</> },
                { type: 'dont', text: <><strong>Don't</strong> send copy-paste messages to ten people in one hour.</> },
                { type: 'dont', text: <><strong>Don't</strong> ask questions you could have Googled in 30 seconds.</> },
                { type: 'dont', text: <><strong>Don't</strong> ghost after they accept — that harms everyone in the network.</> },
              ].map((item, i) => (
                <div key={i} className="cc-do-item">
                  <span className={`cc-do-item__icon cc-do-item__icon--${item.type}`}>{item.type === 'do' ? '✓' : '✕'}</span>
                  <span>{item.text}</span>
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
            <p className="cc-apply__intro-kicker">Section 04</p>
            <h2 className="cc-apply__intro-title">Want to be listed in the Coffee Chat Network?</h2>
            <p className="cc-apply__intro-body">
              If you are a student, recent grad, or professional who wants to give back — especially if you are <strong>first-gen, from an underrepresented group, or took a nontraditional route into tech</strong> — you can add yourself to the Coffee Chat Network. Your profile goes live the moment you submit, so others can reach out for short conversations, questions, and perspective.
            </p>
            <div className="cc-apply__perks">
              {[
                'You control your own availability and capacity',
                'Your profile goes live the moment you submit',
                'New listings stay highlighted for 30 days',
                'Your email is stored privately and never displayed publicly',
                'You are never obligated to accept every request',
              ].map(p => (
                <div key={p} className="cc-apply__perk">
                  <span className="cc-apply__perk-icon">✓</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cc-form-box">
            {formSubmitted ? (
              <div className="cc-form-success">
                <div className="cc-form-success__icon">✓</div>
                <div className="cc-form-success__title">You're in the network!</div>
                <p className="cc-form-success__body">Your profile is now live in the Coffee Chat Network. Students and peers can find you and reach out via your LinkedIn. Thanks for being someone who shows up for the next person.</p>
                {submittedProfileId && (
                  <button type="button" onClick={viewMyProfile} className="cc-btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
                    See my listing in the directory →
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="cc-form-row">
                  <label className="cc-form-label">Profile Photo <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                  <div className="cc-photo-upload">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="cc-photo-preview" />
                    ) : (
                      <div className="cc-photo-placeholder">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                    )}
                    <div className="cc-photo-right">
                      <label htmlFor="ccPhoto" className="cc-photo-btn">Choose photo</label>
                      <input id="ccPhoto" type="file" accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: 'none' }} onChange={e => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
                          setPhotoError('Please use JPG, PNG, GIF, or WebP. SVG and other formats are not supported.')
                          e.target.value = ''
                          return
                        }
                        if (file.size > 2 * 1024 * 1024) {
                          setPhotoError('Photo must be under 2MB.')
                          e.target.value = ''
                          return
                        }
                        setPhotoError('')
                        setPhotoFile(file)
                        setPhotoPreview(URL.createObjectURL(file))
                      }} />
                      <p className="cc-photo-hint">JPG, PNG, GIF, or WebP · Max 2MB</p>
                      {photoError && <p style={{ color: 'var(--color-accent)', fontSize: '12px', margin: 0 }}>{photoError}</p>}
                      {photoPreview && <button type="button" className="cc-photo-remove" onClick={() => {
                        if (photoPreview) URL.revokeObjectURL(photoPreview)
                        setPhotoFile(null)
                        setPhotoPreview(null)
                        setPhotoError('')
                      }}>Remove</button>}
                    </div>
                  </div>
                </div>
                <div className="cc-form-row cc-form-row-2">
                  <div>
                    <label className="cc-form-label" htmlFor="ccName">Full Name <span>*</span></label>
                    <input className="cc-form-input" type="text" id="ccName" placeholder="Your full name" required maxLength={100} autoComplete="name" value={formData.name} onChange={e => setFormData(d => ({ ...d, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="cc-form-label" htmlFor="ccPronouns">Pronouns</label>
                    <input className="cc-form-input" type="text" id="ccPronouns" placeholder="e.g. she/her" maxLength={40} value={formData.pronouns} onChange={e => setFormData(d => ({ ...d, pronouns: e.target.value }))} />
                  </div>
                </div>
                <div className="cc-form-row">
                  <label className="cc-form-label" htmlFor="ccEmail">Email <span>*</span> <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(stored privately — never shown publicly)</span></label>
                  <input className="cc-form-input" type="email" id="ccEmail" placeholder="your@email.com" required maxLength={255} autoComplete="email" value={formData.email} onChange={e => setFormData(d => ({ ...d, email: e.target.value }))} />
                </div>
                <div className="cc-form-row">
                  <label className="cc-form-label" htmlFor="ccLinkedIn">LinkedIn URL <span>*</span></label>
                  {/* type=text + inputMode=url so users can paste 'linkedin.com/in/foo' without scheme; we normalize on submit */}
                  <input className="cc-form-input" type="text" inputMode="url" id="ccLinkedIn" placeholder="https://linkedin.com/in/yourname" required maxLength={300} autoComplete="url" title="Enter your LinkedIn profile URL (e.g. https://linkedin.com/in/yourname)" value={formData.linkedin} onChange={e => setFormData(d => ({ ...d, linkedin: e.target.value }))} />
                </div>
                <div className="cc-form-row cc-form-row-2">
                  <div>
                    <label className="cc-form-label" htmlFor="ccCurrentRole">Current Role + Company/School <span>*</span></label>
                    <input className="cc-form-input" type="text" id="ccCurrentRole" placeholder="e.g. SWE @ Stripe" required maxLength={200} autoComplete="organization-title" value={formData.role} onChange={e => setFormData(d => ({ ...d, role: e.target.value }))} />
                  </div>
                  <div>
                    <label className="cc-form-label" htmlFor="ccLocation">City / Time Zone</label>
                    <input className="cc-form-input" type="text" id="ccLocation" placeholder="e.g. Boston, ET" maxLength={100} autoComplete="address-level2" value={formData.location} onChange={e => setFormData(d => ({ ...d, location: e.target.value }))} />
                  </div>
                </div>
                <div className="cc-form-row">
                  <label className="cc-form-label">Role / Function <span>*</span></label>
                  <MultiSelectDropdown
                    options={FUNCTION_OPTIONS}
                    selected={funcChips}
                    onChange={setFuncChips}
                    placeholder="Select all that apply…"
                  />
                  {funcChips.length > 0 && <div className="cc-selected-tags">{funcChips.map(c => <span key={c} className="cc-selected-tag">{c} <button type="button" onClick={() => { setFuncChips(p => p.filter(v => v !== c)); if (c === 'Other') setFuncOtherText('') }}>×</button></span>)}</div>}
                  {funcChips.includes('Other') && (
                    <input
                      className="cc-form-input"
                      type="text"
                      placeholder="Please describe your role / function…"
                      maxLength={80}
                      value={funcOtherText}
                      onChange={e => setFuncOtherText(e.target.value)}
                      style={{ marginTop: '10px' }}
                    />
                  )}
                </div>
                <div className="cc-form-row">
                  <label className="cc-form-label">Identity Tags <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                  <MultiSelectDropdown
                    options={IDENTITY_OPTIONS}
                    selected={identityChips}
                    onChange={setIdentityChips}
                    placeholder="Select all that apply…"
                  />
                  {identityChips.length > 0 && <div className="cc-selected-tags">{identityChips.map(c => <span key={c} className="cc-selected-tag">{c} <button type="button" onClick={() => { setIdentityChips(p => p.filter(v => v !== c)); if (c === 'Other') setIdentityOtherText('') }}>×</button></span>)}</div>}
                  {identityChips.includes('Other') && (
                    <input
                      className="cc-form-input"
                      type="text"
                      placeholder="Please describe your identity…"
                      maxLength={80}
                      value={identityOtherText}
                      onChange={e => setIdentityOtherText(e.target.value)}
                      style={{ marginTop: '10px' }}
                    />
                  )}
                </div>
                <div className="cc-form-row">
                  <label className="cc-form-label" htmlFor="ccTopics">What topics can you talk about? <span>*</span></label>
                  <textarea className="cc-form-textarea" id="ccTopics" placeholder="e.g. First internships, technical interviews, navigating being first-gen at a big company…" required maxLength={500} value={formData.topics} onChange={e => setFormData(d => ({ ...d, topics: e.target.value }))}></textarea>
                  <p style={{ fontSize: '11px', color: 'var(--color-muted)', textAlign: 'right', margin: '4px 2px 0 0' }}>{formData.topics.length} / 500</p>
                </div>
                <div className="cc-form-row">
                  <label className="cc-form-label" htmlFor="ccCapacity">How many chats per month can you take? <span>*</span></label>
                  <select className="cc-form-select" id="ccCapacity" required value={formData.capacity} onChange={e => setFormData(d => ({ ...d, capacity: e.target.value }))}>
                    <option value="">Select capacity…</option>
                    <option value="1-2">1–2 chats / month</option>
                    <option value="3-5">3–5 chats / month</option>
                    <option value="6-9">6–9 chats / month</option>
                    <option value="10+">10+ chats / month</option>
                  </select>
                </div>
                <div className="cc-form-row" style={{ marginBottom: '20px' }}>
                  <div className="cc-form-check">
                    <input type="checkbox" id="ccConsent1" required checked={formData.consent1} onChange={e => setFormData(d => ({ ...d, consent1: e.target.checked }))} />
                    <label className="cc-form-check-label" htmlFor="ccConsent1">I consent to being listed publicly on the Coffee Chat Network. My name, pronouns, role, photo (if uploaded), LinkedIn URL, location, topics, and selected tags will be visible to anyone who visits the directory.</label>
                  </div>
                  <div className="cc-form-check">
                    <input type="checkbox" id="ccConsent2" required checked={formData.consent2} onChange={e => setFormData(d => ({ ...d, consent2: e.target.checked }))} />
                    <label className="cc-form-check-label" htmlFor="ccConsent2">I understand my email is stored privately, used only by the Jose × Jocelyn team for moderation and updates, and will not appear in the public directory.</label>
                  </div>
                  <div className="cc-form-check">
                    <input type="checkbox" id="ccConsent3" required checked={formData.consent3} onChange={e => setFormData(d => ({ ...d, consent3: e.target.checked }))} />
                    <label className="cc-form-check-label" htmlFor="ccConsent3">I understand this is not a job placement service and I am not required to say yes to every request.</label>
                  </div>
                </div>
                {/* Honeypot — visually hidden but reachable to bots that scrape and auto-fill */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                  <label htmlFor="ccWebsite">Leave this field blank</label>
                  <input
                    id="ccWebsite"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={e => setFormData(d => ({ ...d, website: e.target.value }))}
                  />
                </div>
                {turnstileSiteKey && (
                  <div className="cc-form-row" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div ref={turnstileWidgetRef} />
                  </div>
                )}
                <p style={{ fontSize: '12px', color: 'var(--color-muted)', lineHeight: 1.55, marginBottom: '14px', padding: '12px 14px', background: 'rgba(22,43,68,.04)', border: '1px solid rgba(22,43,68,.08)', borderRadius: '8px' }}>
                  <strong style={{ color: 'var(--color-dark)', fontWeight: 600 }}>Privacy:</strong> Your data is stored privately in our database and is only used to operate the directory. To <strong>edit, pause, or delete</strong> your listing anytime, email <a href="mailto:campustocareerteam@gmail.com" style={{ color: 'var(--color-navy)', fontWeight: 600 }}>campustocareerteam@gmail.com</a>.
                </p>
                {formError && <p role="alert" style={{ color: 'var(--color-accent)', fontSize: '13px', marginBottom: '10px' }}>{formError}</p>}
                <button className="cc-form-btn" type="submit" disabled={formLoading}>{formLoading ? 'Submitting…' : 'Submit my profile'}</button>
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
            <strong>A note on safety and boundaries.</strong> This network is for informational conversations only. Always protect your personal information, never send money, and remember that you are not obligated to answer any question that makes you uncomfortable. If any interaction feels off, you can block or report the person on LinkedIn and <a href="mailto:campustocareerteam@gmail.com" style={{ color: 'var(--color-navy)', fontWeight: 600 }}>let us know</a> so we can review their listing. We take this seriously.
          </p>
        </div>
      </section>

      <hr className="cc-divider" />

      <section className="cc-eco">
        <div className="cc-eco__inner">
          <p className="cc-eco__kicker">The J&amp;J Ecosystem</p>
          <h2 className="cc-eco__title">The network is one part of a bigger system.</h2>
          <p className="cc-eco__body">The Coffee Chat Network connects you with people. The rest of the ecosystem helps you prepare to make the most of those conversations.</p>
          <div className="cc-eco__grid">
            {[
              { to: '/opportunity-board', title: 'Opportunity Board', desc: 'Curated internships, apprenticeships & roles' },
              { to: '/bridge-year', title: 'Bridge Year Hub', desc: "Your path when the offer didn't come yet" },
              { to: '/career-templates', title: 'Career Templates', desc: 'Scripts & trackers for outreach & applications' },
              { to: '/interview-prep', title: 'Interview Prep Hub', desc: 'Structured prep for every stage and interview type' },
              { to: '/articles', title: 'La Voz del Día', desc: 'Weekly essays on careers, identity & early-career life' },
            ].map(link => (
              <Link key={link.to} to={link.to} className="cc-eco__link">
                <div className="cc-eco__link-title">{link.title}</div>
                <div className="cc-eco__link-desc">{link.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '720px', margin: '0 auto', padding: '60px clamp(20px,5vw,56px)', textAlign: 'center' }}>
        <p className="cc-kicker" style={{ marginBottom: '10px' }}>La Voz del Día</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,2.6vw,26px)', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '8px', lineHeight: 1.25 }}>Get the weekly career letter.</h2>
        <p style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '20px' }}>Practical essays on first internships, recruiting, identity, and early-career life. One a week, no spam.</p>
        {subState === 'success' ? (
          <div>
            <p style={{ color: 'var(--color-teal)', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>✓ You're subscribed — see you in your inbox.</p>
            <button
              type="button"
              onClick={() => { setSubState('idle'); setSubError(''); setSubEmail('') }}
              style={{ background: 'none', border: 'none', color: 'var(--color-muted)', textDecoration: 'underline', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-body)', padding: 0 }}
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '480px', margin: '0 auto' }}>
            <input
              type="email"
              required
              maxLength={255}
              autoComplete="email"
              placeholder="you@example.com"
              value={subEmail}
              onChange={e => setSubEmail(e.target.value)}
              style={{ flex: '1 1 220px', minWidth: '180px', padding: '11px 14px', border: '1.5px solid rgba(0,0,0,.12)', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '14px', background: 'var(--color-white)', color: 'var(--color-dark)', outline: 'none' }}
              aria-label="Email for newsletter"
            />
            <button type="submit" disabled={subState === 'loading'} className="cc-btn-primary" style={{ padding: '11px 20px', fontSize: '13px' }}>
              {subState === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
            {/* Honeypot — visually hidden but reachable to scraping bots */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
              <label htmlFor="newsletterCompany">Company (leave blank)</label>
              <input
                id="newsletterCompany"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={subHoneypot}
                onChange={e => setSubHoneypot(e.target.value)}
              />
            </div>
          </form>
        )}
        {subError && <p style={{ color: 'var(--color-accent)', fontSize: '13px', marginTop: '10px' }}>{subError}</p>}
      </section>

      <hr className="cc-divider" />

      {/* Template Modal */}
      <div className={`cc-modal-overlay${modalOpen ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
        <div className="cc-modal" role="dialog" aria-modal="true" aria-labelledby="cc-modal-title" ref={ccModalRef} onKeyDown={handleCcModalKeyDown}>
          <button className="cc-modal__close" onClick={closeModal} aria-label="Close">✕</button>
          <p className="cc-modal__kicker">Coffee Chat Templates</p>
          <h2 id="cc-modal-title" className="cc-modal__title">Coffee Chat Request — Reaching out to {modalName}</h2>
          <p className="cc-modal__sub">Personalize the bracketed fields before sending. Keep your final message under 80 words.</p>
          <div className="cc-modal__template">{TEMPLATE_TEXT.replace('[Name]', modalName)}</div>
          <button className={`cc-modal__copy-btn${copied ? ' copied' : ''}`} onClick={copyTemplate}>
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </button>
        </div>
      </div>
    </ArticleLayout>
  )
}
