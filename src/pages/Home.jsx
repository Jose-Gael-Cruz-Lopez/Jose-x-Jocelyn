import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { supabase } from '../lib/supabase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const SEARCH_INDEX = [
  { label: 'About', description: 'Who we are & our story', type: 'section', target: '#about',
    keywords: ['who we are', 'about us', 'our story', 'jose', 'jocelyn', 'founders', 'co-founders', 'creator', 'hosts', 'people behind', 'first gen', 'first generation', 'mexican american', 'latino', 'latina', 'hispanic', 'latinx', 'chicano', 'brown', 'immigrant', 'immigrants', 'underrepresented', 'minority', 'diversity', 'inclusion', 'equity', 'mission', 'vision', 'values', 'why', 'purpose', 'background', 'journey', 'path', 'how it started', 'origin story', 'why we built this', 'personal story', 'team', 'people', 'real', 'authentic', 'what is campus to career', 'what is this', 'about the platform', 'representation'] },
  { label: 'Services', description: 'All services overview', type: 'section', target: '#services',
    keywords: ['services', 'all services', 'offerings', 'programs', 'what we do', 'what do you offer', 'help', 'resources', 'tools', 'features', 'overview', 'everything', 'explore', 'discover', 'platform', 'career help', 'career support', 'career resources', 'career tools', 'content', 'sprints', 'community', 'categories', 'navigation', 'where to go', 'what can i do here'] },
  { label: 'La Voz del Día', description: 'Daily editorial & career insights', type: 'section', target: '#editorial',
    keywords: ['la voz', 'voz', 'blog', 'articles', 'article', 'editorial', 'daily', 'insights', 'reads', 'reading', 'posts', 'post', 'news', 'writing', 'content', 'career content', 'tips', 'advice', 'guides', 'how to', 'stories', 'perspectives', 'opinions', 'featured', 'latest', 'recent', 'subscribe', 'newsletter', 'digest', 'weekly', 'thought pieces', 'career stories', 'industry insights', 'career reads'] },
  { label: 'LinkedIn Series', description: 'Content · LinkedIn growth tips', type: 'page', to: '/linkedin-series',
    keywords: ['linkedin', 'linked in', 'social media', 'profile', 'linkedin profile', 'optimize profile', 'profile tips', 'improve profile', 'headline', 'summary', 'about section', 'featured section', 'profile picture', 'banner', 'connections', 'followers', 'posts', 'posting', 'content creation', 'content strategy', 'thought leadership', 'articles', 'newsletter', 'carousel', 'personal brand', 'personal branding', 'brand yourself', 'visibility', 'reach', 'impressions', 'engagement', 'likes', 'comments', 'shares', 'algorithm', 'linkedin algorithm', 'beat the algorithm', 'get more views', 'networking online', 'online networking', 'connect on linkedin', 'linkedin networking', 'send connection request', 'inmail', 'online presence', 'digital presence', 'digital identity', 'online reputation', 'get noticed by recruiters', 'attract recruiters', 'linkedin jobs', 'series', 'episodes', 'tips', 'tricks', 'guide', 'growth', 'grow on linkedin'] },
  { label: 'Career Templates', description: 'Content · Plug-and-play career docs', type: 'page', to: '/career-templates',
    keywords: ['templates', 'template', 'free templates', 'free resources', 'downloadable', 'download', 'resume template', 'resume format', 'resume example', 'resume sample', 'ats resume', 'cover letter', 'cover letter template', 'cover letter example', 'how to write cover letter', 'email template', 'professional email', 'cold email template', 'follow up email', 'follow up', 'thank you email', 'thank you note', 'after interview email', 'networking email', 'reach out email', 'introduction email', 'linkedin message template', 'linkedin outreach', 'cold message', 'salary negotiation', 'negotiate offer', 'negotiate salary', 'counter offer', 'how to negotiate', 'negotiation script', 'negotiation email', 'negotiation', 'tracker', 'job tracker', 'application tracker', 'track applications', 'stay organized', 'spreadsheet', 'job search tracker', 'application spreadsheet', 'career tracker', '30 60 90', 'brag document', 'brag doc', 'goal setting', 'documents', 'docs', 'google doc', 'notion', 'scripts', 'plug and play', 'copy paste', 'materials', 'career documents', 'plug in', 'ready to use'] },
  { label: 'Bridge Year Sprint', description: 'Sprints · Bridge year program', type: 'page', to: '/bridge-year',
    keywords: ['bridge year', 'gap year', 'underclassmen', 'freshman', 'freshmen', 'sophomore', 'junior', 'first year', 'second year', 'third year', '1st year', '2nd year', '3rd year', 'early in college', 'new to college', 'just started college', 'early career', 'beginner', 'new to tech', 'new to industry', 'just starting', 'getting started', 'start', 'foundation', 'no experience', 'no internship yet', 'build experience', 'first internship', 'land first internship', 'break into tech', 'break into industry', 'pivot', 'career switcher', 'program', 'cohort', 'sprint', 'accountability', 'structured program', 'curriculum', 'first gen', 'nontraditional', 'transfer student', 'community college', 'returning student', 'underprivileged', 'low income', 'limited resources', 'lost', 'confused', 'overwhelmed', 'dont know where to start', 'where do i start', 'what should i do', 'need direction', 'what to do', 'roadmap', 'plan', 'career plan', 'career path', 'career roadmap', 'explore', 'discover', 'next steps', 'step by step', 'where to begin', 'early stage', 'guidance', 'help me start'] },
  { label: 'Interview Prep', description: 'Sprints · Interview preparation', type: 'page', to: '/interview-prep',
    keywords: ['interview', 'interviews', 'prep', 'preparation', 'prepare', 'practice', 'mock', 'mock interview', 'practice interview', 'get ready for interview', 'technical interview', 'coding interview', 'behavioral interview', 'system design interview', 'product interview', 'pm interview', 'design interview', 'case interview', 'consulting interview', 'finance interview', 'behavioral', 'technical', 'coding', 'algorithm', 'algorithms', 'data structure', 'data structures', 'dynamic programming', 'binary search', 'trees', 'graphs', 'arrays', 'linked list', 'recursion', 'big o', 'time complexity', 'leetcode', 'leet code', 'hackerrank', 'codewars', 'oa', 'online assessment', 'coding challenge', 'take home', 'star method', 'star framework', 'tell me about yourself', 'greatest strength', 'weakness', 'why this company', 'why this role', 'leadership', 'teamwork', 'conflict', 'failure', 'success', 'accomplishment', 'behavioral questions', 'faang', 'maang', 'big tech', 'google', 'meta', 'amazon', 'microsoft', 'apple', 'netflix', 'stripe', 'airbnb', 'uber', 'doordash', 'startup', 'underclassmen', 'new grad', 'new graduate', 'entry level', 'junior', 'tips', 'how to', 'guide', 'cheat sheet', 'nervous', 'anxious', 'scared', 'intimidated', 'unprepared', 'struggling', 'failing interviews', 'bombing interviews', 'need help', 'confidence', 'offer', 'job offer', 'return offer', 'rejection', 'rejected', 'phone screen', 'phone interview', 'technical screen', 'onsite', 'virtual interview', 'zoom interview', 'questions', 'common questions', 'internship interview', 'job interview', 'intern', 'cracking the interview', 'python', 'java', 'javascript', 'sql'] },
  { label: 'Opportunity Board', description: 'Community · Jobs & internships', type: 'page', to: '/opportunity-board',
    keywords: ['jobs', 'job', 'work', 'gig', 'career', 'internship', 'internships', 'intern', 'opportunities', 'opportunity', 'listing', 'listings', 'posting', 'postings', 'board', 'apply', 'application', 'applying', 'hire', 'hiring', 'recruited', 'recruiting', 'recruiter', 'hr', 'human resources', 'new grad', 'new graduate', 'recent grad', 'recent graduate', 'fresh grad', 'college grad', 'entry level', 'junior', 'first job', 'first real job', 'post grad', 'after college', 'after graduation', 'no experience', '0 years experience', 'summer', 'summer 2025', 'summer 2026', 'summer internship', 'summer program', 'fall', 'spring', 'winter', 'co-op', 'coop', 'fellowship', 'apprenticeship', 'full time', 'fulltime', 'part time', 'contract', 'freelance', 'remote', 'hybrid', 'in person', 'onsite', 'relocation', 'paid', 'stipend', 'salary', 'compensation', 'hourly', 'wage', 'unpaid', 'role', 'position', 'opening', 'employment', 'company', 'job board', 'job search', 'job hunting', 'find a job', 'find work', 'career opportunities', 'tech job', 'technology', 'software', 'engineering', 'software engineer', 'swe', 'product manager', 'pm', 'tpm', 'data science', 'data analytics', 'ux', 'ui', 'design', 'marketing', 'finance', 'consulting', 'banking', 'investment banking', 'healthcare', 'biotech', 'startup', 'faang', 'google', 'meta', 'amazon', 'microsoft', 'apple', 'business', 'mis', 'non-cs', 'nontechnical', 'stem', 'cs', 'computer science', 'diversity hiring', 'underrepresented', 'visa', 'sponsorship', 'opt', 'cpt', 'h1b', 'international', 'where to find jobs', 'career search'] },
  { label: 'Coffee Chat Network', description: 'Community · Connect with professionals', type: 'page', to: '/coffee-chat',
    keywords: ['coffee chat', 'coffee chats', 'virtual coffee', 'grab coffee', 'coffee meeting', 'networking', 'network', 'build connections', 'connect', 'connection', 'connections', 'meet professionals', 'meet people', 'reach out', 'cold email', 'cold outreach', 'linkedin message', 'mentor', 'mentors', 'mentorship', 'mentoring', 'mentee', 'find a mentor', 'get mentored', 'advisory', 'advisor', 'guide', 'guidance', 'career guidance', 'career advice', 'informational interview', 'info interview', 'info chat', 'industry insights', 'learning from professionals', 'professional', 'professionals', 'industry professional', 'industry expert', 'recruiter', 'hiring manager', 'engineer', 'designer', 'alumni', 'alum', 'alums', 'upperclassmen', 'peers', 'community', 'people', 'relationship', 'relationship building', 'professional development', 'professional network', 'talk to someone', 'talk to someone in the industry', 'get advice', 'ask questions', 'career questions', 'career path', 'day in the life', 'what is it like to work at', 'company culture', 'chat', 'talk', 'conversation', 'meet', 'meeting', 'zoom call', 'phone call', 'virtual meeting', 'advice', 'support', 'learn', 'how to reach out', 'how to network'] },
  { label: 'Resume Reviews', description: 'Community · Get your resume reviewed', type: 'page', to: '/resume-reviews',
    keywords: ['resume', 'resumes', 'cv', 'curriculum vitae', 'bio', 'professional profile', 'review', 'reviews', 'reviewed', 'feedback', 'critique', 'critiqued', 'help', 'resume help', 'improve', 'improve resume', 'fix', 'fix my resume', 'check', 'check my resume', 'proofread', 'edit', 'polish', 'polish up', 'ats', 'ats friendly', 'applicant tracking', 'keyword', 'keywords', 'format', 'formatting', 'layout', 'design', 'one page', 'two page', 'one pager', 'chronological', 'functional', 'skills', 'experience', 'work experience', 'projects', 'extracurriculars', 'clubs', 'gpa', 'education', 'certifications', 'awards', 'honors', 'leadership', 'bullet points', 'action verbs', 'quantify', 'metrics', 'numbers', 'accomplishments', 'achievements', 'results', 'student resume', 'college resume', 'undergrad resume', 'undergraduate', 'graduate', 'new grad resume', 'entry level resume', 'first resume', 'no experience resume', 'limited experience', 'tech resume', 'software engineer resume', 'swe resume', 'pm resume', 'product manager resume', 'data science resume', 'ux resume', 'marketing resume', 'internship resume', 'career changer resume', 'transfer student', 'nontraditional', 'international student resume', 'get reviewed', 'submit resume', 'share resume', 'see other resumes', 'browse resumes', 'resume examples', 'resume inspiration', 'showcase', 'upload', 'first gen resume', 'weak resume', 'strong resume', 'bad resume'] },
  { label: 'Partner Panels', description: 'Community · Live panels with partners', type: 'page', to: '/partner-panels',
    keywords: ['panel', 'panels', 'event', 'events', 'live', 'live event', 'webinar', 'webinars', 'talk', 'talks', 'speaker', 'speakers', 'panelist', 'panelists', 'industry talk', 'industry expert', 'fireside chat', 'fireside chats', 'roundtable', 'summit', 'workshop', 'seminar', 'recording', 'recordings', 'replay', 'rewatch', 'watch', 'listen', 'video', 'watch again', 'presentation', 'q&a', 'qa', 'questions', 'discussion', 'conversation', 'partners', 'partner', 'partner companies', 'company', 'sponsor', 'recruiter panel', 'alumni panel', 'career panel', 'tech panel', 'diversity panel', 'first gen panel', 'recruiting panel', 'zoom', 'virtual', 'online', 'live stream', 'past events', 'archive', 'past panels', 'previous panels', 'rsvp', 'register', 'sign up', 'attend', 'upcoming', 'schedule', 'next event', 'future events', '30 under 30', 'industry professionals speaking', 'hear from professionals', 'learn from professionals'] },
]

const CONFETTI_COLORS = ['#E8A838','#B34539','#3A7D6B','#5B8EC2','#F2E4CE','#f5c026','#ff6b6b','#ff9ff3','#54a0ff','#5f27cd','#01a3a4','#feca57','#ff6348','#7bed9f']
const PINATA_STAGES = [{ at: 0, src: '/pinanta/step1.png' },{ at: 3, src: '/pinanta/step2.png' },{ at: 5, src: '/pinanta/step3.png' }]
const HITS_TO_BREAK = 7
const BREAK_MSGS = ["Echale ganas, you already took the first step.","Nobody gave us the blueprint either. That's why we built this.","Ya llegaste. The sun rises for you too.","First-gen is not a limitation. It's the origin story.","No palancas needed. Just you and this community."]

export default function Home() {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)
  const [aboutTab, setAboutTab] = useState('who-we-are')
  const [servicesTab, setServicesTab] = useState('content')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSent, setModalSent] = useState(false)
  const [modalName, setModalName] = useState('')
  const [modalEmail, setModalEmail] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [navOnHero, setNavOnHero] = useState(true)
  const [navHidden, setNavHidden] = useState(false)
  const [loaderDone, setLoaderDone] = useState(false)

  const pinataRef = useRef(null)
  const pinataImgRef = useRef(null)
  const pinataHitsRef = useRef(0)
  const pinataBrokenRef = useRef(false)
  const [pinataWrapClass, setPinataWrapClass] = useState('pinata--idle')
  const [pinataVisible, setPinataVisible] = useState(true)
  const [pinataMsg, setPinataMsg] = useState('')

  const footerRef = useRef(null)
  const canvasRef = useRef(null)
  const galleryRef = useRef(null)
  const loaderRef = useRef(null)
  const loaderFillRef = useRef(null)
  const gsapCtxRef = useRef(null)
  const modalRef = useRef(null)

  const openModal = useCallback((e) => {
    e?.preventDefault()
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setTimeout(() => {
      setModalSent(false)
      setModalName('')
      setModalEmail('')
      setModalMessage('')
      setModalError('')
    }, 400)
  }, [])

  const handleModalSubmit = useCallback(async () => {
    if (!modalEmail.trim() || !modalMessage.trim()) return
    setModalLoading(true)
    setModalError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ name: modalName.trim(), email: modalEmail.trim(), message: modalMessage.trim() }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setModalSent(true)
    } catch {
      setModalError('Something went wrong. Please try again.')
    }
    setModalLoading(false)
  }, [modalName, modalEmail, modalMessage])

  const handleModalKeyDown = useCallback((e) => {
    if (e.key !== 'Tab' || !modalRef.current) return
    const focusable = Array.from(
      modalRef.current.querySelectorAll('input, button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter(el => !el.closest('[aria-hidden="true"]'))
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }, [])

  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => {
        modalRef.current?.querySelector('input, button:not([disabled])')?.focus()
      }, 50)
      const onKey = (e) => { if (e.key === 'Escape') closeModal() }
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }
  }, [modalOpen, closeModal])

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modalOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* ── Gallery carousel ── */
  function initGallery() {
    const track = galleryRef.current
    if (!track) return
    const cards = Array.from(track.querySelectorAll('.gallery__card'))
    if (!cards.length) return

    const N = cards.length
    let activeIdx = 0
    const CARD_ASPECT = 1350 / 1080
    const BASE_W = 280
    const BASE_H = Math.round(BASE_W * CARD_ASPECT)

    // Set static dimensions once — all subsequent layout calls only mutate transforms
    cards.forEach(card => gsap.set(card, { width: BASE_W, height: BASE_H, left: 0, top: 0 }))

    function getTrackW() { return track.offsetWidth || 1200 }
    function getTrackH() {
      if (track.offsetHeight > 0) return track.offsetHeight
      return window.innerWidth < 768 ? 320 : 480
    }
    function isMob() { return window.innerWidth < 768 }

    function getSlots() {
      const tw = getTrackW()
      const mob = isMob()
      const bigW = mob ? tw * 0.38 : tw * 0.24
      const centerW = mob ? tw * 0.42 : tw * 0.28
      const smallW = mob ? tw * 0.22 : tw * 0.16
      const cx = tw / 2
      const cy = getTrackH() / 2
      return {
        cy,
        slots: [
          { x: cx - tw * 0.37, w: bigW,    rotate:   0, z: 3, opacity: 1 },
          { x: cx - tw * 0.17, w: smallW,  rotate:  12, z: 2, opacity: 1 },
          { x: cx,             w: centerW, rotate:   0, z: 5, opacity: 1 },
          { x: cx + tw * 0.17, w: smallW,  rotate: -10, z: 2, opacity: 1 },
          { x: cx + tw * 0.37, w: bigW,    rotate:   0, z: 3, opacity: 1 },
          { x: cx + tw * 0.58, w: bigW,    rotate:   0, z: 0, opacity: 0 },
        ],
      }
    }

    function layout(animate) {
      const { cy, slots } = getSlots()
      cards.forEach((card, i) => {
        const si = ((i - activeIdx) % N + N) % N
        const slot = slots[si] || slots[slots.length - 1]
        card.style.zIndex = slot.z
        card.setAttribute('aria-hidden', slot.opacity === 0 ? 'true' : 'false')
        const props = {
          x: slot.x - BASE_W / 2,
          y: cy - BASE_H / 2,
          scale: slot.w / BASE_W,
          rotation: slot.rotate,
          opacity: slot.opacity,
        }
        if (animate) {
          gsap.to(card, { ...props, duration: 0.8, ease: 'cubic-bezier(0.16, 1, 0.3, 1)', overwrite: 'auto' })
        } else {
          gsap.set(card, props)
        }
      })
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    layout(false)
    if (reducedMotion) {
      gsap.set(cards, { opacity: (i) => { const si = ((i - activeIdx) % N + N) % N; return si < 5 ? 1 : 0 } })
    } else {
      gsap.to(cards, { opacity: (i) => { const si = ((i - activeIdx) % N + N) % N; return si < 5 ? 1 : 0 }, duration: 0.6, ease: 'power2.out', stagger: 0.06, overwrite: 'auto' })
    }

    cards.forEach((card, i) => card.addEventListener('click', () => { activeIdx = i; layout(true) }))

    const interval = reducedMotion ? null : setInterval(() => { activeIdx = (activeIdx + 1) % N; layout(true) }, 3000)
    let resizeTimer
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => layout(false), 150) }
    window.addEventListener('resize', onResize)

    return () => { clearInterval(interval); window.removeEventListener('resize', onResize); clearTimeout(resizeTimer) }
  }

  /* ── Footer dots canvas ── */
  function initFooterDots() {
    const footer = footerRef.current
    const canvas = canvasRef.current
    if (!footer || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dots = [], wCss = 1, hCss = 1, dpr = 1
    const mouse = { x: 0, y: 0, inside: false }
    let visible = true
    let rafId
    const SPACING = 11, INFLUENCE = 120, MAX_PUSH = 40, LERP = 0.2, DOT_R = 1.05

    function buildDots() {
      dots = []
      for (let y = SPACING * 0.5; y < hCss; y += SPACING) {
        for (let x = SPACING * 0.5; x < wCss; x += SPACING) {
          dots.push({ bx: x, by: y, ox: 0, oy: 0, g: 0.18 + Math.random() * 0.42 })
        }
      }
    }

    function resize() {
      const rect = footer.getBoundingClientRect()
      wCss = Math.max(1, rect.width)
      hCss = Math.max(1, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(wCss * dpr)
      canvas.height = Math.floor(hCss * dpr)
      canvas.style.width = `${wCss}px`
      canvas.style.height = `${hCss}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildDots()
    }

    function draw() {
      if (!visible) return
      ctx.clearRect(0, 0, wCss, hCss)
      const rect = footer.getBoundingClientRect()
      const mx = mouse.x - rect.left, my = mouse.y - rect.top
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]
        let tx = 0, ty = 0
        if (!reduced && mouse.inside) {
          const dx = d.bx - mx, dy = d.by - my, dist = Math.hypot(dx, dy)
          if (dist < INFLUENCE && dist > 0.001) {
            const t = 1 - dist / INFLUENCE, push = t * t * MAX_PUSH
            tx = (dx / dist) * push; ty = (dy / dist) * push
          }
        }
        d.ox += (tx - d.ox) * LERP; d.oy += (ty - d.oy) * LERP
        if (!mouse.inside) { d.ox *= 0.93; d.oy *= 0.93 }
        ctx.fillStyle = `rgba(26,25,22,${d.g})`
        ctx.beginPath(); ctx.arc(d.bx + d.ox, d.by + d.oy, DOT_R, 0, Math.PI * 2); ctx.fill()
      }
    }

    function loop() { rafId = requestAnimationFrame(loop); draw() }

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.inside = true }
    const onTouch = (e) => { if (!e.touches.length) return; mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; mouse.inside = true }
    footer.addEventListener('mousemove', onMove)
    footer.addEventListener('mouseenter', onMove)
    footer.addEventListener('mouseleave', () => { mouse.inside = false })
    footer.addEventListener('touchmove', onTouch, { passive: true })
    footer.addEventListener('touchend', () => { mouse.inside = false })

    const ro = new ResizeObserver(resize)
    ro.observe(footer)
    const io = new IntersectionObserver((entries) => { visible = entries[0]?.isIntersecting !== false }, { threshold: 0 })
    io.observe(footer)

    resize()
    loop()

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect(); io.disconnect()
      footer.removeEventListener('mousemove', onMove)
      footer.removeEventListener('mouseenter', onMove)
      footer.removeEventListener('touchmove', onTouch)
    }
  }

  /* ── Click confetti ── */
  function initClickConfetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const handler = (e) => {
      if (e.target.closest('input, textarea, select, [contenteditable]')) return
      const anchor = e.target.closest('a[href]')
      if (anchor) {
        const href = anchor.getAttribute('href')
        if (href && !href.startsWith('#')) {
          try {
            const resolved = new URL(href, window.location.href)
            if (resolved.origin + resolved.pathname !== window.location.origin + window.location.pathname) return
          } catch {}
        }
      }
      const { clientX: x, clientY: y } = e
      for (let i = 0; i < 48; i++) {
        const w = 10 + Math.random() * 18, h = 4 + Math.random() * 10
        const color = CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0]
        const el = document.createElement('div')
        el.setAttribute('aria-hidden', 'true')
        el.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${color};border-radius:2px;pointer-events:none;z-index:10050;`
        document.body.appendChild(el)
        const angle = Math.random() * Math.PI * 2, dist = 75 + Math.random() * 185, dur = 0.95 + Math.random() * 0.75
        gsap.set(el, { xPercent: -50, yPercent: -50 })
        const tl = gsap.timeline({ onComplete: () => el.remove() })
        tl.fromTo(el, { opacity: 1, scale: 0.6, rotation: Math.random() * 360, x: 0, y: 0 }, { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, rotation: `+=${(Math.random() - 0.5) * 620}`, scale: 0.4, duration: dur, ease: 'power3.out' })
        tl.fromTo(el, { opacity: 1 }, { opacity: 0, duration: dur * 0.42, ease: 'power2.in' }, dur * 0.58)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }

  /* ── GSAP ScrollTrigger ── */
  function initGSAP() {
    const toggle = 'play none none reverse'
    const persistToggle = 'play none none none'

    gsap.from('.intro__text', { scrollTrigger: { trigger: '.intro__right', start: 'top 80%', toggleActions: persistToggle }, opacity: 0, y: 40, duration: 0.8, ease: 'power2.out' })
    gsap.from('.intro__dot', { scrollTrigger: { trigger: '.intro__right', start: 'top 80%', toggleActions: persistToggle }, scale: 0, duration: 0.5, ease: 'power3.out' })
    gsap.from('.intro__banners', { scrollTrigger: { trigger: '.intro', start: 'top 65%', toggleActions: persistToggle }, clipPath: 'inset(0 100% 0 0)', duration: 1, ease: 'power3.inOut' })
    gsap.from('.about__header', { scrollTrigger: { trigger: '.about', start: 'top 78%', toggleActions: toggle }, y: 30, opacity: 0, duration: 0.7, ease: 'power2.out' })
    gsap.from('.about__intro', { scrollTrigger: { trigger: '.about', start: 'top 70%', toggleActions: toggle }, y: 30, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.1 })
    gsap.from('.about__card--jose', { scrollTrigger: { trigger: '.about__cards', start: 'top 80%', toggleActions: toggle }, x: -50, opacity: 0, duration: 0.8, ease: 'power3.out' })
    gsap.from('.about__card--jocelyn', { scrollTrigger: { trigger: '.about__cards', start: 'top 80%', toggleActions: toggle }, x: 50, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.12 })
    gsap.from('.about__closing', { scrollTrigger: { trigger: '.about__closing', start: 'top 90%', toggleActions: toggle }, y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' })
    gsap.from('.c2c__title-img', { scrollTrigger: { trigger: '.c2c', start: 'top 75%', toggleActions: toggle }, y: -30, opacity: 0, duration: 0.9, ease: 'power2.out' })
    gsap.from('.c2c__lead', { scrollTrigger: { trigger: '.c2c', start: 'top 65%', toggleActions: toggle }, y: 30, opacity: 0, duration: 0.7, ease: 'power2.out' })
    gsap.utils.toArray('.c2c__card').forEach((card, i) => {
      gsap.from(card, { scrollTrigger: { trigger: '.c2c__grid', start: 'top 80%', toggleActions: toggle }, y: 50, opacity: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.12 })
    })
    gsap.from('.c2c__closing', { scrollTrigger: { trigger: '.c2c__closing', start: 'top 92%', toggleActions: toggle }, y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' })
    gsap.from('.services__image-inner', { scrollTrigger: { trigger: '.services', start: 'top 75%', toggleActions: toggle }, clipPath: 'inset(20%)', scale: 1.2, duration: 1, ease: 'power2.out' })
    gsap.from('.services__body', { scrollTrigger: { trigger: '.services__content', start: 'top 75%', toggleActions: toggle }, y: 40, opacity: 0, duration: 0.8, ease: 'power2.out' })
    gsap.fromTo('.interr__char',
      { color: 'rgba(255,255,255,0.2)' },
      { color: '#ffffff', stagger: 0.04, duration: 0.3, ease: 'none',
        scrollTrigger: { trigger: '.interr', start: 'top 75%', end: 'bottom 35%', scrub: 0.6 } }
    )
    if (window.innerWidth >= 1024) {
      gsap.to('.interr__bar--cream', { scrollTrigger: { trigger: '.interr', start: 'top bottom', end: 'bottom top', scrub: 0.35 }, y: -40, ease: 'none' })
      gsap.to('.interr__bar--accent', { scrollTrigger: { trigger: '.interr', start: 'top bottom', end: 'bottom top', scrub: 0.35 }, y: 30, ease: 'none' })
    }
    gsap.from('.editorial__showcase-inner', { scrollTrigger: { trigger: '.editorial__showcase', start: 'top 80%', toggleActions: persistToggle }, y: 60, opacity: 0, duration: 0.8, ease: 'power2.out' })
    gsap.utils.toArray('.editorial__card').forEach((card, i) => {
      gsap.from(card, { scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: toggle }, clipPath: 'inset(0 0 100% 0)', duration: 0.7, ease: 'power3.out', delay: (i % 2) * 0.1 })
    })
    gsap.utils.toArray('.mascot').forEach(mascot => {
      gsap.fromTo(mascot, { opacity: 0, scale: 0, rotate: -30 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: mascot.closest('section, footer') || mascot, start: 'top 80%', once: true, toggleActions: persistToggle } })
    })
    gsap.from('.footer__logo-svg', { scrollTrigger: { trigger: '.footer', start: 'top 80%', toggleActions: 'play none none none' }, x: -60, opacity: 0, duration: 0.8, ease: 'power2.out' })
    gsap.from('.footer__cta', { scrollTrigger: { trigger: '.footer', start: 'top 75%', toggleActions: 'play none none none' }, x: 80, rotation: -15, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.15 })

    const nav = document.getElementById('nav')
    if (nav) {
      ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onLeave: () => { setNavOnHero(false) }, onEnterBack: () => { setNavOnHero(true) } })
      if (window.innerWidth >= 1024) {
        ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onUpdate(self) {
          const el = document.querySelector('.hero__inner')
          if (el) { el.style.opacity = 1 - self.progress * 1.5; el.style.transform = `scale(${1 - self.progress * 0.12}) translateY(${self.progress * -60}px)` }
        }})
      }
    }

    ScrollTrigger.refresh()
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }

  /* ── Loader + site init ── */
  useEffect(() => {
    window.scrollTo(0, 0)
    history.scrollRestoration = 'manual'

    let cleanupScroll = null
    let cleanupGallery = null
    let cleanupDots = null
    let cleanupConfetti = null
    let tl = null

    const loader = loaderRef.current
    const fill = loaderFillRef.current
    const panels = loader?.querySelectorAll('.loader__panel')

    function afterLoader() {
      let last = 0
      const onScroll = () => {
        const cur = window.scrollY
        setNavHidden(cur > last && cur > 300)
        last = cur
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      cleanupScroll = () => window.removeEventListener('scroll', onScroll)

      const navOffset = 80
      const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          const id = a.getAttribute('href')
          if (!id || id === '#') return
          const target = document.querySelector(id)
          if (!target) return
          e.preventDefault()
          const y = target.getBoundingClientRect().top + window.scrollY - navOffset
          window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion() ? 'auto' : 'smooth' })
        })
      })

      cleanupGallery = initGallery()
      cleanupDots = initFooterDots()
      cleanupConfetti = initClickConfetti()
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        initGSAP()
      }
    }

    if (!loader || !fill || !panels?.length) {
      setLoaderDone(true)
      afterLoader()
    } else {
      const wipeEase = 'power3.inOut'
      const wipeDur = 0.88

      tl = gsap.timeline()
      tl.to(fill, { width: '35%', duration: 0.35, ease: 'power2.out' })
        .to(fill, { width: '72%', duration: 0.32, ease: 'power2.out' })
        .to(fill, { width: '100%', duration: 0.28, ease: 'power2.out' })
        .add('wipe')
        .to(panels[0], { xPercent: -100, duration: wipeDur, ease: wipeEase, force3D: true }, 'wipe')
        .to(panels[1], { xPercent: 100, duration: wipeDur, ease: wipeEase, force3D: true }, 'wipe+=0.08')
        .to(panels[2], { xPercent: -100, duration: wipeDur, ease: wipeEase, force3D: true }, 'wipe+=0.16')
        .call(() => { setLoaderDone(true); afterLoader() })
        .fromTo('.hero__sun',     { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.75, ease: 'power2.out', stagger: 0.1 }, 'wipe')
        .fromTo('.hero__j',       { y: 80, opacity: 0 },       { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out', stagger: 0.13 }, 'wipe+=0.05')
        .fromTo('.hero__x',       { scale: 0, opacity: 0 },    { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out' }, 'wipe+=0.2')
        .fromTo('.hero__names',   { y: 20, opacity: 0 },       { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, 'wipe+=0.3')
        .fromTo('.hero__tagline', { y: 16, opacity: 0 },       { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, 'wipe+=0.4')
        .fromTo('.hero__rule',    { scaleX: 0, opacity: 0 },   { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out', transformOrigin: 'center center' }, 'wipe+=0.48')
        .fromTo('.hero__foot',    { y: 12, opacity: 0 },       { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 'wipe+=0.55')
    }

    return () => {
      tl?.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
      cleanupScroll?.()
      cleanupGallery?.()
      cleanupDots?.()
      cleanupConfetti?.()
    }
  }, [])

  /* ── Piñata ── */
  function handlePinataClick(e) {
    if (pinataBrokenRef.current) return
    e.stopPropagation()
    const hits = ++pinataHitsRef.current

    const wrap = pinataRef.current
    wrap.classList.remove('pinata--idle', 'pinata--hit')
    void wrap.offsetWidth
    wrap.classList.add('pinata--hit')

    // Update image
    let best = PINATA_STAGES[0]
    for (const s of PINATA_STAGES) { if (hits >= s.at) best = s }
    if (pinataImgRef.current && pinataImgRef.current.src !== best.src) {
      pinataImgRef.current.src = best.src
    }

    if (hits >= 5) wrap.classList.add('pinata--shaking')

    // Spawn hit stars
    for (let i = 0; i < 6 + hits * 3; i++) {
      const star = document.createElement('div')
      star.className = 'pinata__star'
      star.setAttribute('aria-hidden', 'true')
      const size = 6 + Math.random() * 12
      const color = CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0]
      star.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;background:${color};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};transform:rotate(${Math.random() * 360}deg);`
      document.body.appendChild(star)
      const angle = Math.random() * Math.PI * 2, dist = 40 + Math.random() * 100
      gsap.to(star, { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist - 30, opacity: 0, rotation: Math.random() * 720 - 360, duration: 0.6 + Math.random() * 0.4, ease: 'power2.out', onComplete: () => star.remove() })
    }

    if (hits >= HITS_TO_BREAK) {
      pinataBrokenRef.current = true
      wrap.classList.remove('pinata--shaking')

      const vw = window.innerWidth, vh = window.innerHeight
      const frag = document.createDocumentFragment()
      const pieces = []
      for (let i = 0; i < 140; i++) {
        const el = document.createElement('div')
        el.setAttribute('aria-hidden', 'true')
        const w = 8 + Math.random() * 16, h = 4 + Math.random() * 10
        const color = CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0]
        el.style.cssText = `position:fixed;left:${vw * 0.2 + Math.random() * vw * 0.6}px;top:${vh * 0.25 + Math.random() * vh * 0.25}px;width:${w}px;height:${h}px;background:${color};border-radius:${Math.random() > 0.4 ? '2px' : '50%'};pointer-events:none;z-index:10060;will-change:transform,opacity;`
        frag.appendChild(el); pieces.push(el)
      }
      document.body.appendChild(frag)

      requestAnimationFrame(() => {
        wrap.classList.remove('pinata--hit')
        wrap.classList.add('pinata--break')
        pieces.forEach(el => {
          gsap.fromTo(el, { x: 0, y: 0, rotation: 0, scale: 0 }, { x: (Math.random() - 0.5) * vw * 1.4, y: (Math.random() - 0.55) * vh * 1.5, rotation: Math.random() * 900 - 450, scale: 1 + Math.random() * 0.4, opacity: 0, duration: 1.6 + Math.random() * 1.0, delay: Math.random() * 0.08, ease: 'power2.out', onComplete: () => el.remove() })
        })

        setTimeout(() => {
          setPinataVisible(false)
          const msg = BREAK_MSGS[(Math.random() * BREAK_MSGS.length) | 0]
          setPinataMsg(msg)

          setTimeout(() => {
            setPinataMsg('')
            pinataHitsRef.current = 0
            pinataBrokenRef.current = false
            if (pinataImgRef.current) pinataImgRef.current.src = PINATA_STAGES[0].src

            function reveal() {
              setPinataVisible(true)
              const wrap = pinataRef.current
              if (wrap) {
                wrap.classList.remove('pinata--break', 'pinata--hit', 'pinata--shaking', 'pinata--idle')
                void wrap.offsetWidth
                wrap.classList.add('pinata--idle')
              }
            }

            if (pinataImgRef.current && typeof pinataImgRef.current.decode === 'function') {
              pinataImgRef.current.decode().then(reveal).catch(reveal)
            } else {
              requestAnimationFrame(reveal)
            }
          }, 7150)
        }, 600)
      })
    } else {
      setTimeout(() => {
        wrap.classList.remove('pinata--hit')
        if (hits < 5) wrap.classList.add('pinata--idle')
      }, 500)
    }
  }

  const searchResults = (() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return SEARCH_INDEX
    const words = q.split(/\s+/).filter(w => w.length > 2)
    return SEARCH_INDEX.filter(item => {
      const haystack = `${item.label} ${item.description} ${item.keywords.join(' ')}`.toLowerCase()
      return haystack.includes(q) || words.some(w => haystack.includes(w))
    })
  })()

  const openSearch = () => { setSearchOpen(true); setSearchQuery(''); setTimeout(() => searchInputRef.current?.focus(), 50) }
  const closeSearch = () => { setSearchOpen(false); setSearchQuery('') }

  const handleSearchSelect = (item) => {
    closeSearch()
    if (item.to) { navigate(item.to); return }
    const el = document.querySelector(item.target)
    if (!el) return
    el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }

  const navClass = ['nav', navOnHero ? 'nav--on-hero' : 'nav--dark', navHidden ? 'nav--hidden' : ''].filter(Boolean).join(' ')

  return (
    <>
      {/* LOADER */}
      {!loaderDone && (
        <div className="loader" id="loader" ref={loaderRef}>
          <div className="loader__bands">
            <div className="loader__panel loader__panel--1" />
            <div className="loader__panel loader__panel--2" />
            <div className="loader__panel loader__panel--3" />
          </div>
          <div className="loader__progress">
            <div className="loader__fill" id="loaderFill" ref={loaderFillRef} />
          </div>
        </div>
      )}

      {/* SEARCH PALETTE */}
      {searchOpen && (
        <div className="search-overlay" onClick={closeSearch}>
          <div className="search-palette" onClick={e => e.stopPropagation()} onKeyDown={e => e.key === 'Escape' && closeSearch()}>
            <div className="search-palette__bar">
              <svg className="search-palette__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.7"/><path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
              <input
                ref={searchInputRef}
                className="search-palette__input"
                placeholder="Search pages & sections…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoComplete="off"
              />
              <button className="search-palette__esc" onClick={closeSearch}>Esc</button>
            </div>
            <ul className="search-palette__results">
              {searchResults.length === 0
                ? <li className="search-palette__empty">No results for "{searchQuery}"</li>
                : searchResults.map(item => (
                  <li key={item.label}>
                    <button className="search-palette__result" onClick={() => handleSearchSelect(item)}>
                      <span className="search-palette__result-label">{item.label}</span>
                      <span className="search-palette__result-desc">{item.description}</span>
                      <span className={`search-palette__result-type search-palette__result-type--${item.type}`}>{item.type}</span>
                    </button>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className={navClass} id="nav">
        <div className="nav__links">
          <button className="nav__search-btn" aria-label="Search" onClick={openSearch}>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="17" height="17"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.8"/><path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
          <a href="#about" className="nav__link">About</a>
          <div className="nav__services-wrap">
            <a href="#services" className="nav__link" onClick={e => {
              e.preventDefault()
              document.getElementById('services')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
            }}>Services</a>
            <div className="nav__services-dropdown">
              <div className="nav__services-group">
                <span className="nav__services-label">Content</span>
                <Link to="/linkedin-series" className="nav__services-item">LinkedIn Series</Link>
                <Link to="/career-templates" className="nav__services-item">Career Templates</Link>
              </div>
              <div className="nav__services-group">
                <span className="nav__services-label">Sprints</span>
                <Link to="/bridge-year" className="nav__services-item">Bridge Year Sprint</Link>
                <Link to="/interview-prep" className="nav__services-item">Interview Prep</Link>
              </div>
              <div className="nav__services-group">
                <span className="nav__services-label">Community</span>
                <Link to="/opportunity-board" className="nav__services-item">Opportunity Board</Link>
                <Link to="/coffee-chat" className="nav__services-item">Coffee Chat Network</Link>
                <Link to="/resume-reviews" className="nav__services-item">Resume Reviews</Link>
                <Link to="/partner-panels" className="nav__services-item">Partner Panels</Link>
              </div>
            </div>
          </div>
          <a href="#editorial" className="nav__link">La Voz del Día</a>
          <button className="nav__link nav__link--cta" onClick={openModal}>
            <span className="nav__link-accent" aria-hidden="true" />
            <span className="nav__link-label">Get in Touch</span>
          </button>
        </div>
        <button className="nav__search-btn nav__search-btn--mobile" aria-label="Search" onClick={openSearch}>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="19" height="19"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.8"/><path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
        <button
          className={`nav__burger${menuOpen ? ' nav__burger--open' : ''}`}
          id="navBurger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobileNav"
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE NAV */}
      <div className={`mobile-nav${menuOpen ? ' mobile-nav--open' : ''}`} id="mobileNav" role="navigation" aria-label="Mobile navigation" aria-hidden={!menuOpen}>
        <button className="mobile-nav__search" aria-label="Open search" onClick={() => { setMenuOpen(false); openSearch() }}>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="20" height="20"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.7"/><path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
          <span>Search</span>
        </button>
        <a href="#about" className="mobile-nav__link" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#services" className="mobile-nav__link" onClick={() => setMenuOpen(false)}>Services</a>
        <a href="#editorial" className="mobile-nav__link" onClick={() => setMenuOpen(false)}>La Voz del Día</a>
        <button className="mobile-nav__link" onClick={() => { setMenuOpen(false); openModal() }}>Get in Touch</button>
      </div>

      <main>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero__chrome-strip hero__chrome-strip--top" aria-hidden="true" />
        <div className="hero__inner">
          <div className="hero__mark-row">
            <div className="hero__sun hero__sun--spin" aria-hidden="true">
              <svg className="hero__sun-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="22" width="56" height="56" className="hero__sun-square"/>
                <rect x="22" y="22" width="56" height="56" className="hero__sun-square" transform="rotate(45 50 50)"/>
                <circle cx="50" cy="50" r="20" className="hero__sun-core"/>
              </svg>
            </div>
            <div className="hero__jxj">
              <span className="hero__jxj-cell hero__jxj-cell--left"><span className="hero__j">J</span></span>
              <span className="hero__x">×</span>
              <span className="hero__jxj-cell hero__jxj-cell--right"><span className="hero__j">J</span></span>
            </div>
            <div className="hero__sun hero__sun--spin-reverse" aria-hidden="true">
              <svg className="hero__sun-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="22" width="56" height="56" className="hero__sun-square"/>
                <rect x="22" y="22" width="56" height="56" className="hero__sun-square" transform="rotate(45 50 50)"/>
                <circle cx="50" cy="50" r="20" className="hero__sun-core"/>
              </svg>
            </div>
          </div>
          <h1 className="hero__names">Jose &amp; Jocelyn</h1>
          <p className="hero__tagline" lang="es">El sol sale para todos…</p>
          <div className="hero__rule" aria-hidden="true" />
          <p className="hero__foot">
            <span className="hero__foot-phrase">First-gen</span>
            <span className="hero__foot-sep" aria-hidden="true"> · </span>
            <span className="hero__foot-phrase">Mexican-American</span>
            <span className="hero__foot-sep" aria-hidden="true"> · </span>
            <span className="hero__foot-phrase">Tech careers</span>
          </p>
        </div>
        <div className="hero__chrome-strip hero__chrome-strip--bottom" aria-hidden="true" />
      </section>

      {/* INTRO */}
      <section className="intro" id="intro">
        <div className="intro__left">
          <div className="intro__banners" role="group" aria-label="From Campus to Career banners">
            <img src="/images/banner1.png" alt="" className="intro__banner-img" loading="lazy" decoding="async" />
            <img src="/images/banner2.png" alt="" className="intro__banner-img" loading="lazy" decoding="async" />
            <img src="/images/banner3.png" alt="" className="intro__banner-img" loading="lazy" decoding="async" />
            <img src="/images/banner4.png" alt="" className="intro__banner-img" loading="lazy" decoding="async" />
          </div>
        </div>
        <div className="intro__right">
          <div className="intro__dot" aria-hidden="true" />
          <p className="intro__text">We are two first-generation Mexican-Americans in tech who navigated every career milestone without a blueprint. No legacy connections. No family in the industry. No one to call when the offer letter made no sense. This platform exists to build what we never had: a visible pipeline from campus to career, told by two people at different stages of the same journey.</p>
          <img src="/images/sun.png" alt="" className="mascot mascot--sun mascot--intro" aria-hidden="true" loading="lazy" decoding="async" />
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="about__header">
          <span className="about__number">02</span>
          <h2 className="about__title">Who We Are</h2>
        </div>
        <div className="about__tabs" role="tablist" onKeyDown={e => {
          const KEYS = ['who-we-are', 'mission', 'vision']
          const idx = KEYS.indexOf(aboutTab)
          let next = null
          if (e.key === 'ArrowRight') { e.preventDefault(); next = KEYS[(idx + 1) % KEYS.length] }
          if (e.key === 'ArrowLeft')  { e.preventDefault(); next = KEYS[(idx - 1 + KEYS.length) % KEYS.length] }
          if (e.key === 'Home')       { e.preventDefault(); next = KEYS[0] }
          if (e.key === 'End')        { e.preventDefault(); next = KEYS[KEYS.length - 1] }
          if (next) { setAboutTab(next); setTimeout(() => document.getElementById(`about-tab-${next}`)?.focus(), 0) }
        }}>
          {['who-we-are', 'mission', 'vision'].map((tab, i) => (
            <>
              {i > 0 && <span key={`sep-${tab}`} className="about__tab-sep" aria-hidden="true">|</span>}
              <button
                key={tab}
                id={`about-tab-${tab}`}
                role="tab"
                className={`about__tab${aboutTab === tab ? ' about__tab--active' : ''}`}
                aria-selected={aboutTab === tab}
                aria-controls={`about-panel-${tab}`}
                tabIndex={aboutTab === tab ? 0 : -1}
                onClick={() => setAboutTab(tab)}
              >
                {tab === 'who-we-are' ? 'Who We Are' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </>
          ))}
        </div>

        <div id="about-panel-who-we-are" role="tabpanel" aria-labelledby="about-tab-who-we-are" className={`about__panel${aboutTab === 'who-we-are' ? ' about__panel--active' : ''}`}>
          <p className="about__panel-subtitle">One pipeline, two perspectives</p>
          <p className="about__intro"><em>From Campus to Career</em> is a collaborative initiative led by Jose G. Cruz&#8209;Lopez and Jocelyn Vazquez. Together, they turn lived experience into a roadmap that helps first&#8209;gen and underrepresented students move confidently from campus to career.</p>
          <div className="about__cards">
            <div className="about__card about__card--jose">
              <span className="about__card-label">The Student Perspective</span>
              <div className="about__card-identity">
                <div className="about__card-photo-wrap">
                  <img src="/images/jose.jpeg" alt="Jose G. Cruz-Lopez" className="about__card-photo about__card-photo--base" width="96" height="96" decoding="async" />
                  <img src="/images/JOSE.png" alt="" className="about__card-photo about__card-photo--alt" width="96" height="96" decoding="async" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="about__card-name">Jose G. Cruz&#8209;Lopez</h3>
                  <div className="about__card-role-row">
                    <p className="about__card-role">Breaking in</p>
                    <div className="about__card-socials">
                      <a href="https://www.linkedin.com/in/cjxsez/" className="about__card-social about__card-social--linkedin" target="_blank" rel="noopener noreferrer" aria-label="Jose G. Cruz-Lopez on LinkedIn">
                        <img src="/images/linkedin_logo.png" alt="" decoding="async" loading="lazy" />
                      </a>
                      <a href="https://www.instagram.com/cjxsez/" className="about__card-social about__card-social--instagram" target="_blank" rel="noopener noreferrer" aria-label="Jose G. Cruz-Lopez on Instagram">
                        <img src="/images/instagram_logo.png" alt="" decoding="async" loading="lazy" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <p className="about__card-desc">A first&#8209;generation college student helping peers land internships and early opportunities. Actively recruiting and documenting every step of the student journey in real time.</p>
              <div className="about__card-tags">
                <span>Internships</span><span>Applications</span><span>Fellowships</span><span>Student Life</span>
              </div>
            </div>
            <div className="about__card about__card--jocelyn">
              <span className="about__card-label">The Post&#8209;Grad Perspective</span>
              <div className="about__card-identity">
                <div className="about__card-photo-wrap">
                  <img src="/images/jocelyn.jpeg" alt="Jocelyn Vazquez" className="about__card-photo about__card-photo--base" width="96" height="96" decoding="async" />
                  <img src="/images/JOSECELYN.png" alt="" className="about__card-photo about__card-photo--alt" width="96" height="96" decoding="async" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="about__card-name">Jocelyn Vazquez</h3>
                  <div className="about__card-role-row">
                    <p className="about__card-role">Leveling up</p>
                    <div className="about__card-socials">
                      <a href="https://www.linkedin.com/in/jocelyn-vazquez/?skipRedirect=true" className="about__card-social about__card-social--linkedin" target="_blank" rel="noopener noreferrer" aria-label="Jocelyn Vazquez on LinkedIn">
                        <img src="/images/linkedin_logo.png" alt="" decoding="async" loading="lazy" />
                      </a>
                      <a href="https://www.instagram.com/beautyengineered/" className="about__card-social about__card-social--instagram" target="_blank" rel="noopener noreferrer" aria-label="Jocelyn Vazquez on Instagram">
                        <img src="/images/instagram_logo.png" alt="" decoding="async" loading="lazy" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <p className="about__card-desc">A first&#8209;generation Information Systems graduate now working in tech and data. Translating the &quot;mystery&quot; parts (compensation, corporate culture, career growth) into first&#8209;gen&#8209;friendly guidance.</p>
              <div className="about__card-tags">
                <span>Full&#8209;Time Roles</span><span>Negotiation</span><span>Career Growth</span><span>Onboarding</span>
              </div>
            </div>
          </div>
          <p className="about__closing">More than an idea, <em>From Campus to Career</em> is a movement driven by clarity, opportunity, and community.</p>
        </div>

        <div id="about-panel-mission" role="tabpanel" aria-labelledby="about-tab-mission" className={`about__panel${aboutTab === 'mission' ? ' about__panel--active' : ''}`}>
          <p className="about__label">Why we built this and who it is for</p>
          <blockquote className="about__quote">No one should have to <em>guess</em> their way from first internship to first offer. Every step should be <em>visible, mapped,</em> and <em>community&#8209;supported.</em></blockquote>
          <p className="about__attribution">Jose &amp; Jocelyn</p>
          <p className="about__body">Our mission is to empower first&#8209;generation and underrepresented students to confidently navigate every step from their first internship search to their first full&#8209;time role in tech and data. We make the journey transparent, actionable, and community&#8209;powered because no one should have to guess their way to opportunity.</p>
        </div>

        <div id="about-panel-vision" role="tabpanel" aria-labelledby="about-tab-vision" className={`about__panel${aboutTab === 'vision' ? ' about__panel--active' : ''}`}>
          <p className="about__body">We envision a future where every first&#8209;generation student graduates with not only skills but direction, supported by a network that transforms uncertainty into possibility and ambition into long&#8209;term success.</p>
        </div>
      </section>

      {/* CAMPUS TO CAREER */}
      <section className="c2c" id="c2c">
        <div className="c2c__inner">
          <div className="c2c__title-art">
            <img src="/images/c2c-title-collab.png" alt="From Campus to Career" className="c2c__title-img" loading="lazy" decoding="async" />
          </div>
          <div className="c2c__content">
            <p className="c2c__lead">A structured ecosystem that turns first&#8209;gen ambition into real career outcomes.</p>
            <div className="c2c__grid">
              {[
                { n: '01', t: 'Content', d: 'Split-screen LinkedIn series and plug-and-play career templates. Real talk from both sides of the pipeline, without the fluff.', cls: 'c2c__card--navy' },
                { n: '02', t: 'Sprints', d: 'Small-cohort programs built around a single career milestone. Bridge Year Sprint and Interview Prep keep you accountable and moving forward.', cls: 'c2c__card--teal' },
                { n: '03', t: 'Community', d: 'Curated opportunity board, partner panels, coffee chat networks, and resume review circles. Real connections, not just a group chat.', cls: 'c2c__card--accent' },
                { n: '04', t: 'La Voz del Día', d: 'Articles on recruiting, internships, full-time offers, and first-gen survival. Written by both of us from both sides of the bridge.', cls: 'c2c__card--gold' },
              ].map(({ n, t, d, cls }) => (
                <div key={n} className={`c2c__card ${cls}`}>
                  <span className="c2c__card-number">{n}</span>
                  <h3 className="c2c__card-title">{t}</h3>
                  <p className="c2c__card-desc">{d}</p>
                </div>
              ))}
            </div>
            <p className="c2c__closing">&ldquo;El camino no se encuentra, se construye. Paso a paso, juntos.&rdquo;</p>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery" id="gallery" aria-label="Photo gallery">
        <div className="gallery__track" id="galleryTrack" ref={galleryRef}>
          <div className="gallery__card gallery__card--photo" data-index="0" style={{ '--card-bg': '#B34539', '--card-image': "url('/images/gallery-photo.png')" }} />
          <div className="gallery__card gallery__card--photo" data-index="1" style={{ '--card-bg': '#E8A838', '--card-image': "url('/images/gallery-collage-azul.jpg')" }} />
          <div className="gallery__card" data-index="2" style={{ '--card-bg': '#3A7D6B' }}>
            <svg className="gallery__card-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="36" r="14" fill="#fff" opacity=".3"/><path d="M40 22v28M28 36h24" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="gallery__card" data-index="3" style={{ '--card-bg': '#5B8EC2' }}>
            <svg className="gallery__card-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="18" y="20" width="18" height="40" rx="9" stroke="#F2E4CE" strokeWidth="3"/><rect x="44" y="20" width="18" height="40" rx="9" stroke="#F2E4CE" strokeWidth="3"/>
            </svg>
          </div>
          <div className="gallery__card" data-index="4" style={{ '--card-bg': '#162B44' }}>
            <svg className="gallery__card-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 56V36c0-8.8 7.2-16 16-16s16 7.2 16 16v20" stroke="#E8A838" strokeWidth="3.5" strokeLinecap="round"/><circle cx="40" cy="36" r="6" fill="#E8A838"/>
            </svg>
          </div>
          <div className="gallery__card" data-index="5" style={{ '--card-bg': '#F2E4CE' }}>
            <svg className="gallery__card-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 28h14v24H22zM44 28h14v24H44z" fill="#3A7D6B" />
            </svg>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" id="services">
        <div className="services__image">
          <div className="services__image-inner">
            <div className="services__pattern" aria-hidden="true">
              <div className={`pinata ${pinataWrapClass}`} id="pinata" ref={pinataRef} style={{ visibility: pinataVisible ? 'visible' : 'hidden' }}>
                <button className="pinata__body" id="pinataBody" aria-label="Hit the piñata" onClick={handlePinataClick}>
                  <img src="/pinanta/step1.png" alt="" className="pinata__img" id="pinataImg" ref={pinataImgRef} draggable="false" />
                </button>
                <p className="pinata__prompt" id="pinataPrompt">Click to hit!</p>
              </div>
              {pinataMsg && <p className="pinata__break-msg" role="status">{pinataMsg}</p>}
            </div>
          </div>
        </div>
        <div className="services__content">
          <div className="services__tabs" role="tablist" onKeyDown={e => {
            const KEYS = ['content', 'sprints', 'community']
            const idx = KEYS.indexOf(servicesTab)
            let next = null
            if (e.key === 'ArrowRight') { e.preventDefault(); next = KEYS[(idx + 1) % KEYS.length] }
            if (e.key === 'ArrowLeft')  { e.preventDefault(); next = KEYS[(idx - 1 + KEYS.length) % KEYS.length] }
            if (e.key === 'Home')       { e.preventDefault(); next = KEYS[0] }
            if (e.key === 'End')        { e.preventDefault(); next = KEYS[KEYS.length - 1] }
            if (next) { setServicesTab(next); setTimeout(() => document.getElementById(`services-tab-${next}`)?.focus(), 0) }
          }}>
            {[['content','Content'],['sprints','Sprints'],['community','Community']].map(([key, label], i) => (
              <>
                {i > 0 && <span key={`sep-${key}`} className="services__tab-sep" aria-hidden="true">|</span>}
                <button
                  key={key}
                  id={`services-tab-${key}`}
                  role="tab"
                  className={`services__tab${servicesTab === key ? ' services__tab--active' : ''}`}
                  aria-selected={servicesTab === key}
                  aria-controls={`services-panel-${key}`}
                  tabIndex={servicesTab === key ? 0 : -1}
                  onClick={() => setServicesTab(key)}
                >
                  {label}
                </button>
              </>
            ))}
          </div>

          <div id="services-panel-content" role="tabpanel" aria-labelledby="services-tab-content" className={`services__panel${servicesTab === 'content' ? ' services__panel--active' : ''}`}>
            <p className="services__body">Our content strategy prioritizes clarity, shareability, and real value. That means split-screen perspectives, actionable templates, and honest recruiting insights, without the fluff.</p>
            <div className="services__list">
              <div className="services__list-col services__list-col--inline">
                <Link to="/linkedin-series" className="services__list-btn">LinkedIn Series &rarr;</Link>
                <Link to="/career-templates" className="services__list-btn">Career Templates &rarr;</Link>
              </div>
            </div>
          </div>
          <div id="services-panel-sprints" role="tabpanel" aria-labelledby="services-tab-sprints" className={`services__panel${servicesTab === 'sprints' ? ' services__panel--active' : ''}`}>
            <p className="services__body">Sprint-based programs that move small cohorts through a specific career milestone. Weekly application blocks, accountability sessions, interview prep, and storytelling workshops.</p>
            <div className="services__list">
              <div className="services__list-col services__list-col--inline">
                <Link to="/bridge-year" className="services__list-btn">Bridge Year Sprint &rarr;</Link>
                <Link to="/interview-prep" className="services__list-btn">Interview Prep &rarr;</Link>
              </div>
            </div>
          </div>
          <div id="services-panel-community" role="tabpanel" aria-labelledby="services-tab-community" className={`services__panel${servicesTab === 'community' ? ' services__panel--active' : ''}`}>
            <p className="services__body">Community-driven support built on accountability and real connections. Opportunity boards, partnership panels, coffee chat networks, and resume review circles.</p>
            <div className="services__list">
              <div className="services__list-col services__list-col--grid-2">
                <Link to="/opportunity-board" className="services__list-btn">Opportunity Board &rarr;</Link>
                <Link to="/coffee-chat" className="services__list-btn">Coffee Chat Network &rarr;</Link>
                <Link to="/resume-reviews" className="services__list-btn">Resume Reviews &rarr;</Link>
                <Link to="/partner-panels" className="services__list-btn">Partner Panels &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERRUPTION */}
      <section className="interr">
        <div className="interr__bars" aria-hidden="true">
          <div className="interr__bar interr__bar--cream" />
          <div className="interr__bar interr__bar--accent" />
        </div>
        <div className="interr__text">
          {['Transparent.', 'Actionable.', 'Community', 'Powered.'].map((line, li) => (
            <span key={li} className="interr__line">
              {line.split('').map((char, ci) => (
                <span key={ci} className="interr__char">{char}</span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* EDITORIAL */}
      <section className="editorial" id="editorial">
        <div className="editorial__showcase">
          <div className="editorial__showcase-inner">
            <div className="editorial__showcase-content">
              <span className="editorial__showcase-label">Knowledge Hub</span>
              <h2 className="editorial__showcase-title">La Voz del Día</h2>
              <p className="editorial__showcase-desc">Articles on recruiting, internships, full-time offers, and early-career survival, written by both of us from both sides of the bridge.</p>
            </div>
            <img src="/images/moon_2.png" alt="" className="mascot mascot--moon2 mascot--editorial" aria-hidden="true" loading="eager" decoding="async" width="96" height="96" />
          </div>
        </div>
        <div className="editorial__grid">
          <Link to="/articles/late-cycle-internships" className="editorial__card editorial__card--link">
            <div className="editorial__card-tag">Jose</div>
            <h3 className="editorial__card-title">Late-Cycle Internships: Where to Look When Everyone Says It's Over</h3>
            <p className="editorial__card-excerpt">It is April and you still don't have an internship. Here is what to do right now.</p>
          </Link>
          <Link to="/articles/first-90-days" className="editorial__card editorial__card--dark editorial__card--link">
            <div className="editorial__card-tag">Jocelyn</div>
            <h3 className="editorial__card-title">Your First 90 Days: A Survival Guide for First-Gen Professionals</h3>
            <p className="editorial__card-excerpt">No one teaches you how to read benefits, navigate office politics, or build a career ladder. Until now.</p>
          </Link>
        </div>
        <div className="editorial__grid">
          <Link to="/articles/first-gen-internship-playbook" className="editorial__card editorial__card--dark editorial__card--link">
            <div className="editorial__card-tag">Both</div>
            <h3 className="editorial__card-title">The Complete First-Gen Internship Playbook</h3>
            <p className="editorial__card-excerpt">From discovery to signed offer, with no sugar-coating. Everything we learned.</p>
          </Link>
          <Link to="/articles/coffee-chat-framework" className="editorial__card editorial__card--link">
            <div className="editorial__card-tag">Jose</div>
            <h3 className="editorial__card-title">The Coffee Chat Framework That Actually Gets Responses</h3>
            <p className="editorial__card-excerpt">A step-by-step system for reaching out to professionals and turning conversations into opportunities.</p>
          </Link>
        </div>
        <div className="editorial__grid">
          <Link to="/articles/negotiate-salary" className="editorial__card editorial__card--link">
            <div className="editorial__card-tag">Jocelyn</div>
            <h3 className="editorial__card-title">How to Negotiate When You've Never Seen a Six-Figure Salary</h3>
            <p className="editorial__card-excerpt">Compensation is benefits, equity, signing bonuses, and leverage you didn't know you had.</p>
          </Link>
          <Link to="/articles/rejection" className="editorial__card editorial__card--dark editorial__card--link">
            <div className="editorial__card-tag">Both</div>
            <h3 className="editorial__card-title">Rejection Doesn't Mean You Did It Wrong</h3>
            <p className="editorial__card-excerpt">You can do everything right and still get rejected. How to process it and keep moving.</p>
          </Link>
        </div>
        <div className="editorial__more">
          <Link to="/articles" className="editorial__more-btn">
            View All Articles
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </section>

      </main>

      {/* FOOTER */}
      <footer className="footer" id="contact" ref={footerRef}>
        <canvas className="footer__dots-canvas" aria-hidden="true" ref={canvasRef} />
        <div className="footer__logo">
          <svg viewBox="0 0 560 400" className="footer__logo-svg" aria-label="Jose x Jocelyn">
            <text x="0" y="320" className="footer__logo-text">J</text>
            <text x="280" y="320" className="footer__logo-text">J</text>
            <rect x="40" y="42" width="112" height="27" rx="3" transform="rotate(-18 96 55)" fill="#E8A838" />
            <rect x="315" y="42" width="112" height="27" rx="3" transform="rotate(-18 371 55)" fill="#E8A838" />
            <text x="190" y="252" className="footer__logo-x">x</text>
          </svg>
        </div>
        <button className="footer__cta" id="footerCta" onClick={openModal}>
          <span className="footer__cta-text">Let&apos;s<br/>connect</span>
        </button>
        <div className="footer__bottom">
          <span className="footer__credit">Jose x Jocelyn &copy; 2026</span>
          <div className="footer__legal">
            <a href="#" className="footer__legal-link">Privacy</a>
            <a href="#" className="footer__legal-link">Terms</a>
          </div>
        </div>
      </footer>

      {/* MODAL */}
      <div className={`modal${modalOpen ? ' modal--open' : ''}`} id="modal">
        <div className="modal__bg" onClick={closeModal} />
        <div className="modal__box" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={modalRef} onKeyDown={handleModalKeyDown}>
          <button className="modal__close" id="modalClose" onClick={closeModal} aria-label="Close dialog">&times;</button>
          {!modalSent ? (
            <>
              <h3 className="modal__title" id="modal-title">Get in touch</h3>
              <label className="sr-only" htmlFor="modalName">Full name</label>
              <input type="text" id="modalName" className="modal__input" placeholder="Your full name" value={modalName} onChange={e => setModalName(e.target.value)} />
              <label className="sr-only" htmlFor="modalEmail">Email address</label>
              <input type="email" id="modalEmail" className="modal__input" placeholder="Your email" value={modalEmail} onChange={e => setModalEmail(e.target.value)} />
              <label className="sr-only" htmlFor="modalMessage">Message</label>
              <textarea id="modalMessage" className="modal__input modal__textarea" placeholder="What's on your mind?" value={modalMessage} onChange={e => setModalMessage(e.target.value)} rows={5} />
              {modalError && <p role="alert" style={{ color: 'var(--color-accent)', fontSize: '13px', marginTop: '8px' }}>{modalError}</p>}
              <button className="modal__btn" disabled={modalLoading || !modalEmail.trim() || !modalMessage.trim()} onClick={handleModalSubmit}>
                {modalLoading ? 'Sending…' : 'Send message →'}
              </button>
            </>
          ) : (
            <>
              <h3 className="modal__title" id="modal-title">Message sent.</h3>
              <p className="modal__msg">Thanks for reaching out! We'll get back to you soon.</p>
              <button className="modal__btn modal__btn--done" onClick={closeModal}>Close</button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
