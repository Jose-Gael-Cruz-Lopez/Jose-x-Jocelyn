import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ArticleLayout from '../components/ArticleLayout'
import { supabase } from '../lib/supabase'

const PROGRAMS = [
  {
    company: 'Pinterest',
    name: 'Engineer Apprenticeship',
    pills: [
      { label: '12 months', type: '' },
      { label: '$9,350–$11,000 / mo', type: 'pay' },
      { label: '⚠ 4-day window', type: 'urgent' },
    ],
    note: 'One of the most competitive and respected apprenticeships in tech. It is explicitly built for people the standard hiring process overlooks. The 2026 window ran March 23–27. Get on the notification list now so you do not miss the next cycle.',
    ctaLabel: 'Get Notified',
    href: 'https://www.pinterestcareers.com',
  },
  {
    company: 'Microsoft',
    name: 'LEAP Apprenticeship',
    pills: [
      { label: '16 weeks', type: '' },
      { label: '~$40 / hr', type: 'pay' },
      { label: 'Rolling cohorts', type: '' },
    ],
    note: 'Microsoft built LEAP in 2015 specifically to create pathways for people from non-traditional tech backgrounds - no CS degree required. You work on real Microsoft products: Azure, Xbox, Bing, Office 365. Rolling cohorts mean you can apply year-round.',
    ctaLabel: 'Apply Now',
    href: 'https://leap.microsoft.com',
  },
  {
    company: 'Google',
    name: 'Build Your Future Apprenticeship',
    pills: [
      { label: 'Paid', type: '' },
      { label: 'No CS degree required', type: '' },
      { label: 'Varies by cohort', type: '' },
    ],
    note: "Google's apprenticeship is one of the most selective but also one of the most worth it - the name alone opens doors for everything that comes after. Specifically targets candidates without four-year CS degrees. Check Google Careers regularly for openings.",
    ctaLabel: 'Check Openings',
    href: 'https://careers.google.com',
  },
  {
    company: 'IBM',
    name: 'New Collar Apprenticeship',
    pills: [
      { label: '12 months', type: '' },
      { label: 'Skills-based hiring', type: 'pay' },
      { label: 'No degree required', type: '' },
    ],
    note: 'IBM runs one of the most established non-degree tech apprenticeships in the industry. They evaluate on skills, not credentials - explicitly. Covers software development, cybersecurity, data, and IT. If you keep getting filtered out for not having the right credential, this is your path.',
    ctaLabel: 'Apply Now',
    href: 'https://www.ibm.com/us-en/employment/newcollar/apprenticeships.html',
  },
  {
    company: 'Airbnb',
    name: 'Connect Engineering Apprenticeship',
    pills: [
      { label: '6 months', type: '' },
      { label: 'Paid', type: 'pay' },
      { label: '⚠ Short window', type: 'urgent' },
    ],
    note: 'Short application window, high value. The 2026 window opened April 6. In 2025 it ran Feb 10–17 - just one week. Add the date to your calendar and be ready. This one goes fast and most people miss it because they did not know to look.',
    ctaLabel: 'Get Notified',
    href: 'https://careers.airbnb.com',
  },
  {
    company: 'JPMorgan Chase',
    name: 'Emerging Talent Program',
    pills: [
      { label: '2 years', type: '' },
      { label: 'Full-time employee', type: '' },
      { label: '⚠ Jan–Feb window', type: 'urgent' },
    ],
    note: 'Two years of structured experience at one of the biggest financial institutions in the world. The 2026 window ran January 9 – February 9. Strong option for anyone targeting data, engineering, or finance-adjacent tech roles - and the two-year track builds real credential.',
    ctaLabel: 'Check Openings',
    href: 'https://careers.jpmorgan.com',
  },
  {
    company: 'Accenture',
    name: 'Apprenticeship Program',
    pills: [
      { label: '12 months', type: '' },
      { label: 'High school diploma only', type: 'pay' },
      { label: 'Rolling openings', type: '' },
    ],
    note: 'One of the most accessible entry points into a major tech consulting firm - only a high school diploma required. If you want to get into tech consulting or enterprise software, Accenture\'s apprenticeship is one of the fastest doors in. Search "apprenticeship" on their careers page.',
    ctaLabel: 'Apply Now',
    href: 'https://www.accenture.com/us-en/careers/local/apprenticeship-program',
  },
]

const ROLE_CARDS = [
  {
    tags: [
      { label: 'New Grad', type: '' },
      { label: 'Engineering', type: '' },
    ],
    rtags: 'new-grad engineering',
    title: 'New Grad Software Engineer Roles',
    company: 'Various companies · via newgrad-jobs.com',
    why: '<strong>Updated hourly.</strong> The most comprehensive aggregator of new grad engineering roles across the industry - covers FAANG-adjacent, mid-size tech, startups, and fintech. Filter by location, stack, and experience level.',
    ctaLabel: 'View Roles →',
    href: 'https://newgrad-jobs.com',
  },
  {
    tags: [
      { label: 'Rotational', type: 'rota' },
      { label: 'Non-CS Background', type: '' },
      { label: 'New Grad', type: '' },
    ],
    rtags: 'rotational non-cs new-grad',
    title: 'Technology Leadership Program',
    company: 'Target Corporation',
    why: 'Full-time rotational program open to CS and non-CS backgrounds. <strong>Full-time employee status from day one</strong> - not a contract or temp role. Most recent window ran January to February. Worth putting in your calendar for next cycle and applying early.',
    ctaLabel: 'Learn More →',
    href: 'https://corporate.target.com/careers/students-graduates',
  },
  {
    tags: [
      { label: 'New Grad', type: '' },
      { label: 'Engineering', type: '' },
      { label: 'Non-CS Background', type: '' },
    ],
    rtags: 'new-grad engineering non-cs',
    title: 'Futureforce Tech Launchpad',
    company: 'Salesforce · Powered by CodePath · San Francisco',
    why: '10-week paid pre-internship focused on <strong>AI-native software engineering.</strong> Open to rising juniors through 2028 grads. Based at Salesforce Tower in SF. One of the best pre-internship programs for students who want real technical experience at a name-brand company.',
    ctaLabel: 'Apply →',
    href: 'https://trailhead.salesforce.com/en/career-path/futureforce',
  },
]

const ROLE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'new-grad', label: 'New Grad' },
  { key: 'rotational', label: 'Rotational' },
  { key: 'data', label: 'Data' },
  { key: 'engineering', label: 'Engineering' },
  { key: 'non-cs', label: 'Non-CS Background' },
  { key: 'remote', label: 'Remote' },
]

const SPRINT_STEPS = [
  {
    num: '01',
    title: 'Audit where you are.',
    body: 'Before you change anything about your job search, you need to understand what is actually happening in it. Document every application you have sent in the last 30 days: company, role, date sent, whether you heard back, and what the result was. Most people who feel stuck have either been applying to too few roles, applying without any outreach, or applying to roles that are not right for their actual experience level. <strong>The audit will tell you which problem you have.</strong>',
    toolLabel: 'Use the Internship Application Tracker',
    toolLink: '/career-templates',
    external: false,
  },
  {
    num: '02',
    title: 'Reset your search strategy.',
    body: 'Once you see the audit, read <strong>Episode 01 of the LinkedIn Series</strong> - "Still Recruiting in April" - for a joint breakdown from Jose and Jocelyn on what late-cycle searching actually looks like, where roles are still open, and how to reframe your timeline. Most of the panic around the bridge year comes from comparing your timeline to peers who came in through early recruiting, which is the wrong comparison entirely.',
    toolLabel: 'Read Ep. 01 - Still Recruiting in April',
    toolLink: '/linkedin-series',
    external: false,
  },
  {
    num: '03',
    title: 'Build your outreach list.',
    body: 'The single biggest gap in most people\'s job searches is that they are applying but not reaching out to anyone. Build a list of <strong>10 to 15 people to contact this week</strong> - engineers, recruiters, alumni, or anyone at a company you are targeting. Jocelyn\'s version of these templates is specifically written for post-grad applicants, not students, so it will land differently than a generic outreach message.',
    toolLabel: 'Get the Cold LinkedIn DM + Recruiter Outreach Templates',
    toolLink: '/career-templates',
    external: false,
  },
  {
    num: '04',
    title: 'Work on your gap narrative.',
    body: 'If you have a gap - time between graduation and your current search - you need a clean, confident way to explain it that is not defensive or over-apologetic. Build a one to two sentence explanation that <strong>frames the gap as a period of intentional movement</strong> rather than passive waiting. Jocelyn wrote this template specifically because she has coached students through this exact conversation in interviews.',
    toolLabel: 'Use the "Tell Me About Yourself" Script',
    toolLink: '/career-templates',
    external: false,
  },
  {
    num: '05',
    title: 'Apply to two or three apprenticeship programs.',
    body: 'Most people skip the apprenticeship section because they think it is not for them, or because they have not heard of the programs. <strong>Apply to at least two or three of the programs in Section 1</strong> this week, even if you are also applying to full-time roles simultaneously. These programs are designed specifically for your situation, and the application process is almost always faster than a standard full-time hiring process.',
    toolLabel: 'Go to Apprenticeships and Alternative Entry Programs ↑',
    toolLink: '#apprenticeships',
    external: false,
    anchor: true,
  },
  {
    num: '06',
    title: 'Prepare for interviews.',
    body: 'Once applications are out, build your story bank, practice your "tell me about yourself" answer, and prepare the specific questions you will ask at the end of each interview. The interview prep resources below are built specifically for students and early-career candidates who have real experiences but <strong>have not been taught how to translate those experiences into interview-ready language.</strong>',
    toolLabel: 'Get the STAR Story Bank + Interview Templates',
    toolLink: '/career-templates',
    external: false,
  },
  {
    num: '07',
    title: 'Track everything.',
    body: 'Use the Application Tracker to log every application, every outreach message, and every interview in a single document. The bridge year feels chaotic largely because most people are trying to manage it all in their heads. <strong>Putting it in a tracker turns a scattered job search into a visible pipeline</strong> where you can see exactly where things are and what needs follow-up.',
    toolLabel: 'Open the Application Tracker',
    toolLink: '/career-templates',
    external: false,
  },
]

const TOOLS = [
  { name: 'Internship & Application Tracker', desc: 'A spreadsheet-style document for logging every application, outreach message, and interview in one place so your search has structure instead of chaos.', linkLabel: 'Open Template →' },
  { name: 'Gap Narrative Script', desc: 'A fill-in-the-blank framework for explaining your timeline to recruiters in one to two sentences - without over-explaining or sounding defensive.', linkLabel: 'Get the Script →' },
  { name: 'Cold LinkedIn DM - Post-Grad Version', desc: 'Three outreach message templates written specifically for new grads reaching out to recruiters, engineers, and alumni. Not the student version - the post-grad version that lands differently.', linkLabel: 'Copy Template →' },
  { name: 'Follow-Up After No Response (3-Step Sequence)', desc: 'Day 1, Day 7, and Day 14 follow-up messages that are persistent without being desperate. The sequence most people never send.', linkLabel: 'Copy Template →' },
  { name: 'STAR Story Bank Template', desc: 'A blank document for building six to eight interview stories before your interviews start - so you are never starting from scratch in a real conversation.', linkLabel: 'Open Framework →' },
  { name: 'How to Compare Two Offers', desc: 'A weighted decision matrix for the moment decisions start coming in - evaluate options clearly on base, bonus, equity, growth, culture, and location instead of emotionally.', linkLabel: 'Open Tracker →' },
  { name: '30-60-90 Day Plan Template', desc: 'For anyone who lands a role during the sprint and wants to start strong. Three phases, three mindsets, three sets of goals - structured for the first three months.', linkLabel: 'Open Framework →' },
]

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
  const [roleFilter, setRoleFilter] = useState('all')
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({ program: '', company: '', link: '', why: '', email: '' })

  const visibleRoles = roleFilter === 'all'
    ? ROLE_CARDS
    : ROLE_CARDS.filter(c => c.rtags.includes(roleFilter))

  const handleRoleFilter = useCallback(e => setRoleFilter(e.currentTarget.dataset.key), [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.program || !form.company) {
      setFormError('Program name and company are required.')
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
      setFormError('Something went wrong. Please try again.')
    } else {
      setFormSubmitted(true)
    }
  }

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <ArticleLayout title="Bridge Year Hub">
      <style>{`
        html, body { background: var(--color-cream); }

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
        }
        .by-hero__kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--color-muted);
          margin-bottom: 18px;
        }
        .by-hero__title {
          font-family: var(--font-display);
          font-size: clamp(42px,7vw,80px);
          font-weight: 700;
          line-height: 1.04;
          color: var(--color-dark);
          margin-bottom: 14px;
        }
        .by-hero__title em { font-style: normal; color: var(--color-accent); }
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
        .by-prog {
          background: var(--color-white);
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform .22s cubic-bezier(.16,1,.3,1), box-shadow .22s;
        }
        .by-prog:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 32px rgba(0,0,0,.09);
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
          padding: 20px 24px;
          background: var(--color-white);
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,.08);
          font-size: 14px;
          color: var(--color-muted);
          line-height: 1.65;
          max-width: 700px;
        }
        .by-apprentice__note strong { color: var(--color-dark); font-weight: 600; }

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
          border: 1.5px solid rgba(0,0,0,.1);
          background: var(--color-white);
          color: var(--color-muted);
          transition: background .2s, color .2s, border-color .2s;
        }
        .by-roles__filter:hover { color: var(--color-dark); border-color: rgba(0,0,0,.22); }
        .by-roles__filter:focus-visible { outline: 2px solid var(--color-teal); outline-offset: 2px; }
        .by-roles__filter--active { background: var(--color-teal); color: var(--color-cream); border-color: var(--color-teal); }
        .by-roles__list { display: flex; flex-direction: column; gap: 14px; }
        .by-role-card {
          background: var(--color-white);
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 12px;
          padding: 22px 24px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s;
        }
        .by-role-card:hover { transform: translateX(4px); box-shadow: 4px 4px 20px rgba(0,0,0,.07); }
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
          background: var(--color-white);
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 12px;
          padding: 22px 22px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s;
        }
        .by-tool-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.08); }
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
          background: var(--color-white);
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 14px;
          padding: 28px;
        }
        .by-follow-card__label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 4px;
          color: var(--color-cream);
          display: inline-block;
          margin-bottom: 14px;
        }
        .by-follow-card__label--jose    { background: var(--color-teal); }
        .by-follow-card__label--jocelyn { background: var(--color-accent); }
        .by-follow-card__name {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: var(--color-dark);
          margin-bottom: 10px;
        }
        .by-follow-card__desc { font-size: 14px; color: var(--color-muted); line-height: 1.7; margin-bottom: 22px; }
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
          transition: transform .18s, opacity .2s;
        }
        .by-follow-card__cta:hover { opacity: .85; transform: translateY(-1px); }
        .by-follow-card__cta--jose    { background: var(--color-teal);   color: var(--color-cream); }
        .by-follow-card__cta--jocelyn { background: var(--color-accent); color: var(--color-cream); }

        /* SUGGEST FORM */
        .by-suggest {
          padding: 80px clamp(20px,5vw,56px) 100px;
          max-width: 1040px;
          margin: 0 auto;
        }
        .by-suggest__box {
          background: var(--color-white);
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 16px;
          padding: clamp(32px,4vw,52px);
          max-width: 680px;
        }
        .by-suggest__kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--color-muted);
          margin-bottom: 12px;
        }
        .by-suggest__title {
          font-family: var(--font-display);
          font-size: clamp(22px,3vw,30px);
          font-weight: 700;
          color: var(--color-dark);
          margin-bottom: 8px;
        }
        .by-suggest__sub { font-size: 15px; color: var(--color-muted); line-height: 1.7; margin-bottom: 28px; }
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
        <p className="by-hero__kicker">From Campus to Career · Bridge Year Sprint</p>
        <h1 className="by-hero__title">Bridge Year <em>Hub</em></h1>
        <p className="by-hero__sub">You finished school. You do not have an offer yet. That is not failure - that is exactly where this page is for.</p>
        <p className="by-hero__body">
          Most advice for people in the gap is either <strong>"keep applying"</strong> or <strong>"go to grad school."</strong> Neither of those is useful when you have already been applying for months, when grad school is not the goal, and when you are watching people around you announce offers you have not gotten yet. This page exists because Jose and Jocelyn have both been close to that moment and know what actually moves the needle. What you will find here is not motivation - it is a curated set of real doors, specific tools, and a step-by-step path through the gap, built for <strong>first-gen and underrepresented students</strong> who are trying to break into tech without a built-in network or family roadmap.
        </p>
        <nav className="by-jumps" aria-label="Page sections">
          <a href="#apprenticeships" className="by-jump">Apprenticeships and Alternative Entry Programs</a>
          <a href="#roles" className="by-jump">New Grad and Early-Career Roles</a>
          <a href="#sprint" className="by-jump">Self-Guided Sprint Path and Tools</a>
        </nav>
      </header>

      <hr className="by-divider" />

      {/* IS THIS FOR YOU */}
      <section className="by-for">
        <div className="by-for__card">
          <p className="by-for__kicker">Is this for you?</p>
          <h2 className="by-for__title">Four people built this page for</h2>
          <p className="by-for__body">
            <strong>Seniors who graduated without a return offer or full-time role</strong> and are now trying to figure out what comes next. <strong>Students in their last semester</strong> who do not have anything lined up yet and are starting to feel the pressure. <strong>Recent grads who have been actively applying for months</strong> with little to no movement and are not sure where the problem is. And <strong>anyone who wants to break into tech</strong> - whether from a traditional CS background, a bootcamp, a self-taught path, or a completely different field - and is looking for an entry point that is specifically designed for people who did not come through the traditional recruiting pipeline. If you recognize yourself in any of those, every section of this page was built for you.
          </p>
        </div>
      </section>

      <hr className="by-divider" />

      {/* APPRENTICESHIPS */}
      <section className="by-apprentice" id="apprenticeships">
        <div className="by-apprentice__head">
          <p className="by-kicker">Section 01</p>
          <h2 className="by-section-title">Apprenticeships and Alternative Entry Programs</h2>
          <p className="by-section-sub">The doors most people do not know exist.</p>
          <p className="by-section-body">These are paid, structured programs at real companies built specifically for people without traditional backgrounds or offers. They are not consolation prizes - many of them are the fastest path into a full-time tech role for someone who keeps getting filtered out of standard hiring. Jose and Jocelyn curate this list because these are exactly the kinds of programs that do not get enough attention and that first-gen students find out about too late or not at all.</p>
        </div>

        <div className="by-apprentice__grid">
          {PROGRAMS.map(prog => (
            <div className="by-prog" key={prog.name}>
              <div className="by-prog__inner">
                <p className="by-prog__company">{prog.company}</p>
                <h3 className="by-prog__name">{prog.name}</h3>
                <div className="by-prog__meta">
                  {prog.pills.map(pill => (
                    <span key={pill.label} className={`by-prog__pill${pill.type ? ` by-prog__pill--${pill.type}` : ''}`}>{pill.label}</span>
                  ))}
                </div>
                <div className="by-prog__note">
                  <p className="by-prog__note-label">J&amp;J Note</p>
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

        <p className="by-apprentice__note">
          <strong>This list is updated regularly.</strong> Jose and Jocelyn follow these programs closely because they are exactly the kinds of opportunities that fly under the radar. Bookmark this page and check back when new cycles open. If you know of a program that should be here, submit it at the bottom of the page.
        </p>
      </section>

      <hr className="by-divider" />

      {/* NEW GRAD ROLES */}
      <section className="by-roles" id="roles">
        <div className="by-roles__head">
          <p className="by-kicker">Section 02</p>
          <h2 className="by-section-title">New Grad and Early-Career Roles</h2>
          <p className="by-section-sub">Roles that are actually open to people starting out.</p>
          <p className="by-section-body">This is not a job board. It is a curated list of roles specifically open to new grads or candidates with zero to one year of experience in tech and data. Jose already curates early-career opportunities on LinkedIn as part of the regular J&amp;J series - this is where those opportunities live on the website, filtered specifically for bridge-year candidates.</p>
        </div>

        <div className="by-roles__filters" role="group" aria-label="Filter roles">
          {ROLE_FILTERS.map(f => (
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
          <p className="by-sprint__kicker">Section 03</p>
          <h2 className="by-sprint__title">Your Bridge Year Sprint Path</h2>
          <p className="by-sprint__sub">A self-guided sequence for moving from stuck to submitted.</p>
          <p className="by-sprint__intro">
            You do not need a cohort or a live program to move through the gap. You need a <strong>sequence</strong>, the right resources at each step, and enough accountability to actually follow through. This path is what Jose and Jocelyn would tell you to do if you messaged them tomorrow and said <em>"I graduated, I have no offer, what do I actually do now?"</em> Work through each step in order, at your own pace, and use the tools linked at each stage.
          </p>

          <div className="by-sprint__steps">
            {SPRINT_STEPS.map(step => (
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
          <p className="by-kicker">Section 04</p>
          <h2 className="by-section-title">Tools for the Gap</h2>
          <p className="by-section-sub">Everything you need is already here. No searching required.</p>
        </div>
        <div className="by-tools__grid">
          {TOOLS.map(tool => (
            <div className="by-tool-card" key={tool.name}>
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
        <p className="by-kicker">Section 05</p>
        <h2 className="by-section-title" style={{ marginBottom: '8px' }}>Follow Jose and Jocelyn on LinkedIn</h2>
        <p className="by-section-body" style={{ marginBottom: '36px' }}>Jose posts curated early-career roles, apprenticeship openings, and real-time recruiting updates on LinkedIn every week, specifically for students and new grads who are still searching. Jocelyn posts from the early-career professional side - what the first role actually looks like, how to navigate the gap between offer and start date, and what she would do differently if she were in the bridge year right now. Following both means you will see every new opportunity, every new episode of the LinkedIn Series, and every template or resource the moment it drops - without having to check this page manually.</p>
        <div className="by-follow__inner">
          <div className="by-follow-card">
            <span className="by-follow-card__label by-follow-card__label--jose">Student Lens</span>
            <h3 className="by-follow-card__name">Jose G. Cruz-Lopez</h3>
            <p className="by-follow-card__desc">Early-career roles, apprenticeship windows, recruiting timelines, and real-time notes from the student side of the bridge - posted weekly.</p>
            <a href="https://www.linkedin.com/in/cjxsez/" target="_blank" rel="noopener noreferrer" className="by-follow-card__cta by-follow-card__cta--jose">
              Follow Jose on LinkedIn →
            </a>
          </div>
          <div className="by-follow-card">
            <span className="by-follow-card__label by-follow-card__label--jocelyn">Post-Grad Lens</span>
            <h3 className="by-follow-card__name">Jocelyn Vazquez</h3>
            <p className="by-follow-card__desc">What the first role actually looks like, how to navigate the offer-to-start gap, and honest early-career guidance from someone already on the other side.</p>
            <a href="https://www.linkedin.com/in/jocelyn-vazquez/" target="_blank" rel="noopener noreferrer" className="by-follow-card__cta by-follow-card__cta--jocelyn">
              Follow Jocelyn on LinkedIn →
            </a>
          </div>
        </div>
      </section>

      <hr className="by-divider" />

      {/* SUGGEST FORM */}
      <section className="by-suggest" id="suggest">
        <div className="by-suggest__box">
          <p className="by-suggest__kicker">Contribute</p>
          <h2 className="by-suggest__title">Know a program we should add?</h2>
          <p className="by-suggest__sub">This list is maintained by Jose and Jocelyn and updated as new programs open. If you found an apprenticeship, rotational program, or new grad role that is not on this list - especially programs designed for non-traditional or first-gen candidates in tech - submit it below and we will review it.</p>

          {formSubmitted ? (
            <div className="by-suggest__success">
              <h3>Thanks for the submission!</h3>
              <p>We review every suggestion and update this list as new programs open. We appreciate you helping keep it current.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="by-suggest__row">
                <label className="by-suggest__label" htmlFor="sgProgram">Program or role name</label>
                <input className="by-suggest__input" type="text" id="sgProgram" placeholder="e.g. Spotify Green Room Engineering Fellowship" value={form.program} onChange={e => setField('program', e.target.value)} />
              </div>
              <div className="by-suggest__row">
                <label className="by-suggest__label" htmlFor="sgCompany">Company</label>
                <input className="by-suggest__input" type="text" id="sgCompany" placeholder="e.g. Spotify" value={form.company} onChange={e => setField('company', e.target.value)} />
              </div>
              <div className="by-suggest__row">
                <label className="by-suggest__label" htmlFor="sgLink">Link</label>
                <input className="by-suggest__input" type="url" id="sgLink" placeholder="https://…" value={form.link} onChange={e => setField('link', e.target.value)} />
              </div>
              <div className="by-suggest__row">
                <label className="by-suggest__label" htmlFor="sgWhy">Why it belongs here (optional)</label>
                <textarea className="by-suggest__textarea" id="sgWhy" placeholder="What makes this relevant for first-gen / non-traditional candidates?" value={form.why} onChange={e => setField('why', e.target.value)} />
              </div>
              <div className="by-suggest__row">
                <label className="by-suggest__label" htmlFor="sgEmail">Your email (optional)</label>
                <input className="by-suggest__input" type="email" id="sgEmail" placeholder="you@school.edu" value={form.email} onChange={e => setField('email', e.target.value)} />
              </div>
              {formError && <p role="alert" style={{ color: 'var(--color-accent)', fontSize: '13px', marginBottom: '10px' }}>{formError}</p>}
              <button className="by-suggest__btn" type="submit" disabled={formLoading}>{formLoading ? 'Submitting…' : 'Submit Program'}</button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="art-footer" style={{ maxWidth: '1040px' }}>
        <span className="art-footer__copy">Jose x Jocelyn © 2026</span>
        <div className="art-footer__links">
          <Link to="/" className="art-footer__link">Home</Link>
          <Link to="/articles" className="art-footer__link">La Voz del Día</Link>
          <Link to="/career-templates" className="art-footer__link">Templates</Link>
          <Link to="/linkedin-series" className="art-footer__link">LinkedIn Series</Link>
        </div>
      </footer>
    </ArticleLayout>
  )
}
