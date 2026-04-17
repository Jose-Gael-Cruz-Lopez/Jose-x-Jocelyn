import { useState } from 'react'
import { Link } from 'react-router-dom'
import ArticleLayout from '../components/ArticleLayout'

const UPCOMING_PANELS = [
  {
    id: 'up1',
    date: 'May 20, 2026',
    calStart: '2026-05-20T18:30',
    calEnd: '2026-05-20T20:00',
    title: 'From Internship Search to First Offer',
    desc: 'A conversation about what actually changes between looking for internships and preparing for full-time roles. This panel focuses on timing, positioning, confidence, and the mistakes students make when they assume the same strategy works for both.',
    time: '6:30 PM ET',
    bestFor: 'Juniors, Seniors, Recent Grads',
    panelists: ['Campus recruiter at a major company', 'Recent graduate in a first full-time role', 'Student who converted an internship into an offer'],
    tags: [{ label: 'Internships', type: 'blue' }, { label: 'New Grad', type: 'gold' }, { label: 'Recruiting', type: 'muted' }],
    cta: 'Reserve Your Spot',
  },
  {
    id: 'up2',
    date: 'June 5, 2026',
    calStart: '2026-06-05T19:30',
    calEnd: '2026-06-05T21:00',
    title: 'First-Gen Voices in Tech',
    desc: 'A panel centered on the experiences first-generation students and professionals carry into internships, interviews, and full-time roles. This session is focused on honesty, language, confidence, and navigating spaces that were not built with everyone in mind.',
    time: '7:30 PM ET',
    bestFor: 'First-Gen, Transfer, Underrepresented',
    panelists: ['First-gen software engineer', 'First-gen product or data professional', 'Student leader or community advocate'],
    tags: [{ label: 'First-Gen in Tech', type: 'teal' }, { label: 'Community', type: 'blue' }, { label: 'Identity', type: 'muted' }],
    cta: 'RSVP on Zoom',
  },
  {
    id: 'up3',
    date: 'June 18, 2026',
    calStart: '2026-06-18T19:00',
    calEnd: '2026-06-18T20:30',
    title: 'What Recruiters Wish Students Knew Earlier',
    desc: 'A practical session with recruiters and early-career hiring voices about resumes, outreach, interview signals, application timing, and the small things students do that either help them stand out or quietly knock them out of the process.',
    time: '7:00 PM ET',
    bestFor: 'Anyone in internship or new grad recruiting',
    panelists: ['University recruiter', 'Program manager or talent partner', 'Early-career professional on what worked'],
    tags: [{ label: 'Recruiting', type: 'navy' }, { label: 'Interviewing', type: 'blue' }, { label: 'Resume', type: 'muted' }],
    cta: 'Save My Spot',
  },
]

const ARCHIVE_CARDS = [
  {
    id: 'takeaways-1',
    date: 'April 3, 2026',
    title: 'Still Recruiting in April: What Now?',
    recap: 'A candid conversation for students and recent grads still searching late in the cycle. The panel focused on how to reset your search, where to look next, how to talk about your timeline without shame, and what kinds of roles and programs still make sense when things did not go according to plan.',
    panelists: 'Recent grad in a bridge-year search · Professional who found a late-cycle opportunity · Community builder supporting first-gen students',
    tags: [{ label: 'Bridge Year', type: 'accent' }, { label: 'Late-Cycle Recruiting', type: 'gold' }, { label: 'Internships', type: 'teal' }, { label: 'Confidence', type: 'muted' }, { label: 'New Grad', type: 'muted' }],
    takeaways: [
      'Late-cycle recruiting is real, but requires a narrower and more intentional strategy - not more applications.',
      'Students often need better positioning and a clearer narrative, not just more volume in their search.',
      'Alternative entry points like apprenticeships and niche fellowships matter more than most people realize late in the cycle.',
      'Talking about your timeline without shame is a skill - and it is one you can practice and get better at before the interview room.',
    ],
  },
  {
    id: 'takeaways-2',
    date: 'March 14, 2026',
    title: 'How to Navigate Rejection Without Spiraling',
    recap: 'This session focused on the emotional and strategic side of recruiting setbacks. Panelists discussed how to process rejection, learn from interviews, protect confidence, and keep moving without losing momentum or identity in the process.',
    panelists: 'Early-career professional · Student mental health and support voice · Student leader who navigated repeated rejection',
    tags: [{ label: 'Interviewing', type: 'blue' }, { label: 'Resilience', type: 'accent' }, { label: 'First-Gen', type: 'teal' }, { label: 'Confidence', type: 'muted' }],
    takeaways: [
      'Rejection is data, not a verdict - the way you process it determines whether it becomes information or identity.',
      'Building a short post-rejection ritual (reflect, document, reset) helps break the spiral faster than pushing straight into more applications.',
      'First-gen students are statistically more likely to over-personalize rejection - separating performance from worth is a core skill to develop early.',
      'The students who bounce back quickest usually have one trusted person in their corner who normalizes the experience.',
    ],
  },
  {
    id: 'takeaways-3',
    date: 'February 22, 2026',
    title: 'Coffee Chats That Actually Lead Somewhere',
    recap: 'A session about how to approach networking without sounding transactional, how to ask better questions, and how to turn one conversation into long-term connection and career insight.',
    panelists: 'Technical recruiter · Recent grad in their first role · Student community leader',
    tags: [{ label: 'Networking', type: 'navy' }, { label: 'Coffee Chats', type: 'blue' }, { label: 'LinkedIn', type: 'gold' }, { label: 'Relationships', type: 'muted' }],
    takeaways: [
      'The best first messages are specific, short, and show you actually read the other person\'s profile - not templated.',
      'Asking "what do you wish someone had told you at my stage?" almost always unlocks the most honest, useful parts of the conversation.',
      'A coffee chat only "leads somewhere" if you follow up within 48 hours and stay in touch in a non-transactional way after.',
      'Most people in tech are genuinely willing to talk - the barrier is almost always on the student side, not the professional side.',
    ],
  },
]

const TOPIC_CHIPS = [
  { key: 'all', label: 'All Topics' },
  { key: 'internships', label: 'Internships' },
  { key: 'new-grad', label: 'New Grad Roles' },
  { key: 'bridge-year', label: 'Bridge Year' },
  { key: 'first-gen', label: 'First-Gen in Tech' },
  { key: 'apprenticeships', label: 'Apprenticeships' },
  { key: 'interviewing', label: 'Interviewing' },
  { key: 'recruiting', label: 'Recruiting' },
  { key: 'networking', label: 'Networking' },
  { key: 'pivots', label: 'Career Pivots' },
  { key: 'workplace', label: 'Workplace Readiness' },
  { key: 'data', label: 'Data Careers' },
  { key: 'community', label: 'Community Building' },
]

const ECO_LINKS = [
  { to: '/opportunity-board', title: 'Opportunity Board', desc: 'Curated internships, apprenticeships & roles' },
  { to: '/coffee-chat', title: 'Coffee Chat Network', desc: 'Connect with people who\'ve walked this path' },
  { to: '/bridge-year', title: 'Bridge Year Hub', desc: 'Your path when the offer didn\'t come yet' },
  { to: '/career-templates', title: 'Career Templates', desc: 'Scripts & trackers for outreach & applications' },
  { to: '/interview-prep', title: 'Interview Prep Hub', desc: 'Structured prep for every stage and type' },
  { to: '/articles', title: 'La Voz del Día', desc: 'Weekly essays on careers, identity & early-career life' },
]

function addToCalendar(title, start, end) {
  const startStr = start.replace(/[-:]/g, '') + '00'
  const endStr = end.replace(/[-:]/g, '') + '00'
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//JoseJocelyn//Panels//EN',
    'BEGIN:VEVENT',
    'DTSTART:' + startStr,
    'DTEND:' + endStr,
    'SUMMARY:' + title + ' - J&J Partner Panel',
    'DESCRIPTION:Hosted by Jose Cruz-Lopez and Jocelyn Vazquez. Live on Zoom.',
    'URL:https://josejocelyn.com/partner-panels',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.ics'
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function PartnerPanels() {
  const [openTakeaway, setOpenTakeaway] = useState(null)
  const [activeTopic, setActiveTopic] = useState('all')
  const [suggestSubmitted, setSuggestSubmitted] = useState(false)
  const [panelistSubmitted, setPanelistSubmitted] = useState(false)
  const [suggestForm, setSuggestForm] = useState({ topic: '', why: '', stage: '', category: '', email: '' })
  const [panelistForm, setPanelistForm] = useState({ name: '', email: '', linkedin: '', role: '', topic: '', interest: '', notes: '' })

  function toggleTakeaway(id) {
    setOpenTakeaway(prev => prev === id ? null : id)
  }

  function submitSuggest(e) {
    e.preventDefault()
    if (!suggestForm.topic || !suggestForm.why || !suggestForm.stage || !suggestForm.category) {
      alert('Please fill in all required fields before submitting.')
      return
    }
    setSuggestSubmitted(true)
  }

  function submitPanelist(e) {
    e.preventDefault()
    if (!panelistForm.name || !panelistForm.email || !panelistForm.linkedin || !panelistForm.role || !panelistForm.topic || !panelistForm.interest) {
      alert('Please fill in all required fields before submitting.')
      return
    }
    setPanelistSubmitted(true)
  }

  return (
    <ArticleLayout title="Partner Panels">
      <style>{`
        html, body { background: var(--color-cream); }

        .pp-wrap {
          max-width: 1040px;
          margin: 0 auto;
          padding-left: clamp(20px,5vw,56px);
          padding-right: clamp(20px,5vw,56px);
        }

        .pp-kicker {
          font-size: 11px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: var(--color-muted); margin-bottom: 14px;
        }
        .pp-section-title {
          font-family: var(--font-display);
          font-size: clamp(26px,4vw,40px); font-weight: 700;
          color: var(--color-dark); line-height: 1.15; margin-bottom: 10px;
        }
        .pp-section-sub {
          font-family: var(--font-display);
          font-size: clamp(16px,2vw,20px); font-weight: 400;
          color: var(--color-accent); margin-bottom: 20px;
        }
        .pp-section-body {
          font-size: clamp(15px,1.8vw,17px); color: var(--color-muted);
          line-height: 1.75; max-width: 700px;
        }
        .pp-section-body strong { color: var(--color-dark); font-weight: 600; }
        .pp-divider { border: none; border-top: 1px solid rgba(0,0,0,.08); margin: 0; }

        .pp-tag {
          display: inline-block; font-size: 10px; font-weight: 700;
          letter-spacing: .06em; text-transform: uppercase;
          padding: 3px 8px; border-radius: 4px;
        }
        .pp-tag--blue    { background: rgba(91,142,194,.12);  color: var(--color-blue); }
        .pp-tag--teal    { background: rgba(58,125,107,.1);   color: var(--color-teal); }
        .pp-tag--gold    { background: rgba(232,168,56,.14);  color: var(--color-gold-dark); }
        .pp-tag--accent  { background: rgba(179,69,57,.1);    color: var(--color-accent); }
        .pp-tag--navy    { background: rgba(22,43,68,.1);     color: var(--color-navy); }
        .pp-tag--muted   { background: rgba(0,0,0,.06);       color: var(--color-muted); }

        .pp-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 26px; background: var(--color-dark);
          color: var(--color-cream); border-radius: 8px;
          font-family: var(--font-display); font-size: 14px; font-weight: 600;
          text-decoration: none; border: 1.5px solid var(--color-dark); cursor: pointer;
          transition: background .2s, transform .18s cubic-bezier(.16,1,.3,1);
        }
        .pp-btn-primary:hover { background: var(--color-accent); border-color: var(--color-accent); transform: translateY(-1px); }
        .pp-btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 26px; background: transparent;
          color: var(--color-dark); border-radius: 8px;
          font-family: var(--font-display); font-size: 14px; font-weight: 600;
          text-decoration: none; border: 1.5px solid rgba(0,0,0,.2); cursor: pointer;
          transition: border-color .2s, color .2s, transform .18s cubic-bezier(.16,1,.3,1);
        }
        .pp-btn-secondary:hover { border-color: var(--color-dark); color: var(--color-accent); transform: translateY(-1px); }

        /* HERO */
        .pp-hero {
          padding: 120px clamp(20px,5vw,56px) 64px;
          max-width: 1040px; margin: 0 auto;
        }
        .pp-hero__kicker {
          font-size: 11px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: var(--color-muted); margin-bottom: 18px;
        }
        .pp-hero__title {
          font-family: var(--font-display);
          font-size: clamp(42px,7vw,80px); font-weight: 700;
          line-height: 1.04; color: var(--color-dark); margin-bottom: 14px;
        }
        .pp-hero__title em { font-style: normal; color: var(--color-gold); }
        .pp-hero__sub {
          font-family: var(--font-display);
          font-size: clamp(18px,2.5vw,26px); font-weight: 400;
          color: var(--color-dark); line-height: 1.4;
          max-width: 700px; margin-bottom: 22px;
        }
        .pp-hero__body {
          font-size: clamp(15px,1.8vw,17px); color: var(--color-muted);
          line-height: 1.8; max-width: 680px; margin-bottom: 36px;
        }
        .pp-hero__body strong { color: var(--color-dark); font-weight: 600; }
        .pp-hero__ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 48px; }

        .pp-stats {
          display: flex; flex-wrap: wrap; gap: 36px;
          padding-top: 32px;
          border-top: 1px solid rgba(0,0,0,.08);
        }
        .pp-stat__num {
          font-family: var(--font-display);
          font-size: clamp(28px,4vw,40px); font-weight: 700;
          color: var(--color-dark); line-height: 1;
        }
        .pp-stat__num em { font-style: normal; color: var(--color-gold); }
        .pp-stat__label { font-size: 13px; color: var(--color-muted); margin-top: 5px; }

        /* FEATURED */
        .pp-featured {
          max-width: 1040px; margin: 0 auto;
          padding: 80px clamp(20px,5vw,56px);
        }
        .pp-featured__head { margin-bottom: 28px; }
        .pp-featured-card {
          background: var(--color-white);
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 20px; overflow: hidden;
          display: grid; grid-template-columns: 1fr 340px;
          min-height: 380px;
        }
        .pp-featured-card__body {
          padding: clamp(28px,4vw,52px);
          display: flex; flex-direction: column; gap: 18px;
          border-right: 1px solid rgba(0,0,0,.07);
        }
        .pp-featured-card__eyebrow {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        .pp-featured-card__live-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 20px;
          background: rgba(58,125,107,.1); color: var(--color-teal);
          font-size: 11px; font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase;
        }
        .pp-featured-card__live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--color-teal); flex-shrink: 0;
          animation: pulseDot 1.8s ease-in-out infinite;
        }
        @keyframes pulseDot {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: .4; transform: scale(.75); }
        }
        .pp-featured-card__title {
          font-family: var(--font-display);
          font-size: clamp(22px,3vw,32px); font-weight: 700;
          color: var(--color-dark); line-height: 1.2;
        }
        .pp-featured-card__desc {
          font-size: clamp(14px,1.6vw,15px); color: var(--color-muted);
          line-height: 1.75; flex: 1;
        }
        .pp-featured-card__desc strong { color: var(--color-dark); font-weight: 600; }
        .pp-featured-card__panelists { display: flex; flex-direction: column; gap: 6px; }
        .pp-featured-card__panelists-label {
          font-size: 10px; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--color-muted); margin-bottom: 4px;
        }
        .pp-featured-card__panelist {
          font-size: 13px; color: var(--color-dark); line-height: 1.5;
          display: flex; align-items: flex-start; gap: 8px;
        }
        .pp-featured-card__panelist::before {
          content: '-'; color: var(--color-muted); flex-shrink: 0; font-size: 12px;
        }
        .pp-featured-card__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
        .pp-featured-card__note {
          font-size: 12px; color: var(--color-muted);
          line-height: 1.55; margin-top: 10px; font-style: italic;
        }
        .pp-featured-card__sidebar {
          padding: clamp(24px,3vw,40px);
          background: rgba(242,228,206,.35);
          display: flex; flex-direction: column; gap: 22px;
        }
        .pp-featured-card__detail-label {
          font-size: 10px; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--color-muted); margin-bottom: 2px;
        }
        .pp-featured-card__detail-value {
          font-size: clamp(13px,1.5vw,14px); color: var(--color-dark); font-weight: 600;
        }
        .pp-featured-card__detail-sub { font-size: 12px; color: var(--color-muted); margin-top: 1px; }

        @media (max-width: 760px) {
          .pp-featured-card { grid-template-columns: 1fr; }
          .pp-featured-card__body { border-right: none; border-bottom: 1px solid rgba(0,0,0,.07); }
        }

        /* UPCOMING */
        .pp-upcoming {
          max-width: 1040px; margin: 0 auto;
          padding: 80px clamp(20px,5vw,56px);
        }
        .pp-upcoming__head { margin-bottom: 32px; }
        .pp-upcoming__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px,1fr));
          gap: 20px;
        }
        .pp-panel-card {
          background: var(--color-white);
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 16px; padding: 26px;
          display: flex; flex-direction: column; gap: 14px;
          transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s;
        }
        .pp-panel-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,.09); }
        .pp-panel-card__date-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(232,168,56,.12); color: var(--color-gold-dark);
          font-size: 11px; font-weight: 700;
          padding: 5px 11px; border-radius: 6px; align-self: flex-start;
        }
        .pp-panel-card__title {
          font-family: var(--font-display);
          font-size: clamp(16px,1.9vw,19px); font-weight: 700;
          color: var(--color-dark); line-height: 1.25;
        }
        .pp-panel-card__desc { font-size: 13px; color: var(--color-muted); line-height: 1.7; flex: 1; }
        .pp-panel-card__meta { display: flex; flex-direction: column; gap: 5px; }
        .pp-panel-card__meta-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: var(--color-muted);
        }
        .pp-panel-card__meta-icon { flex-shrink: 0; font-size: 13px; }
        .pp-panel-card__meta-val { font-weight: 500; color: var(--color-dark); }
        .pp-panel-card__panelists { font-size: 12px; color: var(--color-muted); line-height: 1.65; }
        .pp-panel-card__panelists strong { color: var(--color-dark); font-weight: 600; font-size: 11px; letter-spacing:.04em; text-transform:uppercase; display:block; margin-bottom:4px; }
        .pp-panel-card__tags { display: flex; flex-wrap: wrap; gap: 5px; }
        .pp-panel-card__actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
        .pp-panel-card__cta-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          padding: 10px 16px; background: var(--color-dark); color: var(--color-cream);
          border-radius: 8px; font-family: var(--font-display); font-size: 12px; font-weight: 600;
          text-decoration: none; border: none; cursor: pointer; flex: 1;
          transition: background .2s, transform .15s;
        }
        .pp-panel-card__cta-primary:hover { background: var(--color-accent); transform: translateY(-1px); }
        .pp-panel-card__cta-sm {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 10px 12px; background: transparent;
          color: var(--color-muted); border-radius: 8px;
          font-family: var(--font-display); font-size: 11px; font-weight: 600;
          text-decoration: none; border: 1.5px solid rgba(0,0,0,.12); cursor: pointer; flex-shrink: 0;
          transition: border-color .2s, color .2s;
        }
        .pp-panel-card__cta-sm:hover { border-color: var(--color-dark); color: var(--color-dark); }

        @media (max-width: 560px) { .pp-upcoming__grid { grid-template-columns: 1fr; } }

        /* ARCHIVE */
        .pp-archive {
          max-width: 1040px; margin: 0 auto;
          padding: 80px clamp(20px,5vw,56px);
        }
        .pp-archive__head { margin-bottom: 32px; }
        .pp-archive__list { display: flex; flex-direction: column; gap: 16px; }
        .pp-archive-card {
          background: var(--color-white);
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 16px; overflow: hidden;
          transition: box-shadow .2s;
        }
        .pp-archive-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.08); }
        .pp-archive-card__main {
          padding: 26px 28px;
          display: grid; grid-template-columns: 1fr auto;
          gap: 20px; align-items: flex-start;
        }
        .pp-archive-card__date {
          font-size: 11px; font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase; color: var(--color-muted); margin-bottom: 8px;
        }
        .pp-archive-card__title {
          font-family: var(--font-display);
          font-size: clamp(17px,2.2vw,22px); font-weight: 700;
          color: var(--color-dark); line-height: 1.2; margin-bottom: 10px;
        }
        .pp-archive-card__recap {
          font-size: 13px; color: var(--color-muted); line-height: 1.75;
          max-width: 560px; margin-bottom: 12px;
        }
        .pp-archive-card__panelists {
          font-size: 12px; color: var(--color-muted); margin-bottom: 10px; line-height: 1.6;
        }
        .pp-archive-card__panelists strong { color: var(--color-dark); font-weight: 600; }
        .pp-archive-card__tags { display: flex; flex-wrap: wrap; gap: 5px; }
        .pp-archive-card__actions {
          display: flex; flex-direction: column; gap: 8px;
          flex-shrink: 0; min-width: 150px; align-items: stretch;
        }
        .pp-archive-card__cta {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          padding: 10px 14px; border-radius: 8px;
          font-family: var(--font-display); font-size: 12px; font-weight: 600;
          text-decoration: none; border: 1.5px solid; cursor: pointer;
          transition: background .2s, color .2s, border-color .2s, transform .15s;
          text-align: center; background: none;
        }
        .pp-archive-card__cta--watch { background: var(--color-dark); color: var(--color-cream); border-color: var(--color-dark); }
        .pp-archive-card__cta--watch:hover { background: var(--color-accent); border-color: var(--color-accent); transform: translateY(-1px); }
        .pp-archive-card__cta--flyer { color: var(--color-muted); border-color: rgba(0,0,0,.12); }
        .pp-archive-card__cta--flyer:hover { border-color: var(--color-dark); color: var(--color-dark); }
        .pp-archive-card__cta--takeaways { color: var(--color-teal); border-color: rgba(58,125,107,.25); }
        .pp-archive-card__cta--takeaways:hover { background: rgba(58,125,107,.06); }

        .pp-takeaways {
          display: grid; grid-template-rows: 0fr;
          transition: grid-template-rows .4s cubic-bezier(.16,1,.3,1);
          border-top: 1px solid rgba(0,0,0,.07);
          background: rgba(242,228,206,.3);
        }
        .pp-takeaways.open { grid-template-rows: 1fr; }
        .pp-takeaways__inner {
          overflow: hidden; min-height: 0;
          padding: 0 28px;
          transition: padding .35s cubic-bezier(.16,1,.3,1);
        }
        .pp-takeaways.open .pp-takeaways__inner { padding: 22px 28px; }
        .pp-takeaways__title {
          font-size: 11px; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--color-teal); margin-bottom: 12px;
        }
        .pp-takeaways__list { display: flex; flex-direction: column; gap: 10px; }
        .pp-takeaways__item {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13px; color: var(--color-muted); line-height: 1.65;
        }
        .pp-takeaways__item::before {
          content: '→'; color: var(--color-teal); flex-shrink: 0; font-weight: 700; font-size: 12px; margin-top: 1px;
        }

        @media (max-width: 640px) {
          .pp-archive-card__main { grid-template-columns: 1fr; }
          .pp-archive-card__actions { flex-direction: row; flex-wrap: wrap; }
        }

        /* TOPICS */
        .pp-topics {
          max-width: 1040px; margin: 0 auto;
          padding: 80px clamp(20px,5vw,56px);
        }
        .pp-topics__head { margin-bottom: 28px; }
        .pp-topics__chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
        .pp-topic-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 18px;
          border: 1.5px solid rgba(0,0,0,.1);
          border-radius: 24px;
          font-family: var(--font-body); font-size: 13px; font-weight: 600;
          color: var(--color-muted); cursor: pointer;
          transition: border-color .18s, color .18s, background .18s;
          user-select: none;
        }
        .pp-topic-chip:hover { border-color: var(--color-dark); color: var(--color-dark); }
        .pp-topic-chip.active { border-color: var(--color-navy); background: var(--color-navy); color: var(--color-cream); }
        .pp-topics__note {
          font-size: clamp(14px,1.6vw,15px); color: var(--color-muted); line-height: 1.7;
          max-width: 640px; font-style: italic; margin-top: 4px;
        }

        /* SUGGEST FORM */
        .pp-suggest {
          max-width: 1040px; margin: 0 auto;
          padding: 80px clamp(20px,5vw,56px);
        }
        .pp-suggest__layout { display: grid; grid-template-columns: 1fr 1.4fr; gap: 60px; align-items: flex-start; }
        .pp-suggest__intro-kicker {
          font-size: 11px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: var(--color-muted); margin-bottom: 12px;
        }
        .pp-suggest__intro-title {
          font-family: var(--font-display);
          font-size: clamp(22px,3vw,32px); font-weight: 700;
          color: var(--color-dark); line-height: 1.2; margin-bottom: 16px;
        }
        .pp-suggest__intro-body { font-size: clamp(14px,1.6vw,15px); color: var(--color-muted); line-height: 1.75; }
        .pp-suggest__intro-body strong { color: var(--color-dark); font-weight: 600; }

        .pp-form-box {
          background: var(--color-white);
          border: 1px solid rgba(0,0,0,.07);
          border-radius: 16px;
          padding: clamp(26px,4vw,44px);
        }
        .pp-form-row { margin-bottom: 16px; }
        .pp-form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .pp-form-label {
          display: block; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .09em;
          color: var(--color-muted); margin-bottom: 6px;
        }
        .pp-form-label span { color: var(--color-accent); }
        .pp-form-input,
        .pp-form-select,
        .pp-form-textarea {
          width: 100%; font-family: var(--font-body); font-size: 15px;
          padding: 11px 14px; border: 1.5px solid rgba(0,0,0,.12);
          border-radius: 8px; background: var(--color-white);
          color: var(--color-dark); outline: none; transition: border-color .2s;
          box-sizing: border-box;
        }
        .pp-form-input:focus,
        .pp-form-select:focus,
        .pp-form-textarea:focus { border-color: var(--color-gold); }
        .pp-form-textarea { min-height: 80px; resize: vertical; line-height: 1.6; }
        .pp-form-select {
          appearance: none; cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238A7E72' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center;
        }
        .pp-form-note { font-size: 12px; color: var(--color-muted); line-height: 1.6; margin-top: 10px; font-style: italic; }
        .pp-form-btn {
          width: 100%; padding: 14px 24px; background: var(--color-dark);
          color: var(--color-cream); border: none; border-radius: 8px;
          font-family: var(--font-display); font-size: 14px; font-weight: 600;
          cursor: pointer; transition: background .2s, transform .18s; margin-top: 4px;
        }
        .pp-form-btn:hover { background: var(--color-accent); transform: translateY(-1px); }
        .pp-form-success { text-align: center; padding: 40px 20px; }
        .pp-form-success__icon {
          width: 56px; height: 56px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin: 0 auto 16px;
        }
        .pp-form-success__icon--gold { background: rgba(232,168,56,.12); color: var(--color-gold-dark); }
        .pp-form-success__icon--teal { background: rgba(58,125,107,.1);  color: var(--color-teal); }
        .pp-form-success__title {
          font-family: var(--font-display); font-size: 22px;
          font-weight: 700; color: var(--color-dark); margin-bottom: 8px;
        }
        .pp-form-success__body { font-size: 14px; color: var(--color-muted); line-height: 1.7; }

        @media (max-width: 740px) {
          .pp-suggest__layout { grid-template-columns: 1fr; gap: 36px; }
          .pp-form-row-2 { grid-template-columns: 1fr; }
        }

        /* PANELIST SECTION */
        .pp-panelist { background: var(--color-navy); padding: 80px clamp(20px,5vw,56px); }
        .pp-panelist__inner {
          max-width: 1040px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1.4fr; gap: 60px; align-items: flex-start;
        }
        .pp-panelist__intro-kicker {
          font-size: 11px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: rgba(242,228,206,.45); margin-bottom: 12px;
        }
        .pp-panelist__intro-title {
          font-family: var(--font-display);
          font-size: clamp(22px,3vw,32px); font-weight: 700;
          color: var(--color-cream); line-height: 1.2; margin-bottom: 16px;
        }
        .pp-panelist__intro-body { font-size: clamp(14px,1.6vw,15px); color: rgba(242,228,206,.65); line-height: 1.75; }
        .pp-panelist__intro-body strong { color: var(--color-cream); font-weight: 600; }
        .pp-panelist__perks { margin-top: 24px; display: flex; flex-direction: column; gap: 12px; }
        .pp-panelist__perk {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 14px; color: rgba(242,228,206,.65); line-height: 1.5;
        }
        .pp-panelist__perk-icon {
          width: 22px; height: 22px; border-radius: 50%;
          background: rgba(232,168,56,.2); color: var(--color-gold);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; flex-shrink: 0; margin-top: 1px;
        }
        .pp-form-box--dark {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1);
        }
        .pp-form-box--dark .pp-form-input,
        .pp-form-box--dark .pp-form-select,
        .pp-form-box--dark .pp-form-textarea {
          background: rgba(255,255,255,.07);
          border-color: rgba(255,255,255,.15);
          color: var(--color-cream);
        }
        .pp-form-box--dark .pp-form-input::placeholder,
        .pp-form-box--dark .pp-form-textarea::placeholder { color: rgba(242,228,206,.35); }
        .pp-form-box--dark .pp-form-label { color: rgba(242,228,206,.55); }
        .pp-form-box--dark .pp-form-input:focus,
        .pp-form-box--dark .pp-form-select:focus,
        .pp-form-box--dark .pp-form-textarea:focus { border-color: var(--color-gold); }
        .pp-form-box--dark .pp-form-select {
          background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='rgba(242,228,206,0.45)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center;
          color-scheme: dark;
        }
        .pp-form-box--dark .pp-form-btn { background: var(--color-gold); color: var(--color-dark); }
        .pp-form-box--dark .pp-form-btn:hover { background: #CF952F; }
        .pp-form-box--dark .pp-form-success__title { color: var(--color-cream); }
        .pp-form-box--dark .pp-form-success__body { color: rgba(242,228,206,.65); }

        @media (max-width: 740px) { .pp-panelist__inner { grid-template-columns: 1fr; gap: 36px; } }

        /* ECOSYSTEM */
        .pp-eco { background: var(--color-dark); padding: 80px clamp(20px,5vw,56px); }
        .pp-eco__inner { max-width: 1040px; margin: 0 auto; }
        .pp-eco__kicker {
          font-size: 11px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: rgba(242,228,206,.4); margin-bottom: 10px;
        }
        .pp-eco__title {
          font-family: var(--font-display);
          font-size: clamp(20px,3vw,30px); font-weight: 700;
          color: var(--color-cream); margin-bottom: 8px; line-height: 1.25;
        }
        .pp-eco__body {
          font-size: clamp(14px,1.6vw,15px); color: rgba(242,228,206,.55);
          line-height: 1.75; max-width: 680px; margin-bottom: 36px;
        }
        .pp-eco__body strong { color: var(--color-gold); font-weight: 600; }
        .pp-eco__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill,minmax(200px,1fr));
          gap: 14px;
        }
        .pp-eco__link {
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09);
          border-radius: 12px; padding: 18px 20px; text-decoration: none;
          transition: background .2s, transform .2s cubic-bezier(.16,1,.3,1);
          display: block;
        }
        .pp-eco__link:hover { background: rgba(255,255,255,.09); transform: translateY(-2px); }
        .pp-eco__link-title { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--color-cream); margin-bottom: 4px; }
        .pp-eco__link-desc { font-size: 12px; color: rgba(242,228,206,.45); line-height: 1.5; }

        /* CLOSING */
        .pp-closing { background: var(--color-accent); padding: 64px clamp(20px,5vw,56px); text-align: center; }
        .pp-closing__inner { max-width: 680px; margin: 0 auto; }
        .pp-closing__headline {
          font-family: var(--font-display);
          font-size: clamp(22px,4vw,36px); font-weight: 700;
          color: var(--color-cream); line-height: 1.2; margin-bottom: 28px;
        }
        .pp-closing__btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
        .pp-closing__btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: var(--color-cream); color: var(--color-accent);
          border-radius: 8px; font-family: var(--font-display);
          font-size: 14px; font-weight: 700; text-decoration: none;
          border: 1.5px solid var(--color-cream);
          transition: background .2s, color .2s, transform .18s;
        }
        .pp-closing__btn-primary:hover { background: var(--color-dark); color: var(--color-cream); border-color: var(--color-dark); transform: translateY(-1px); }
        .pp-closing__btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: transparent; color: var(--color-cream);
          border-radius: 8px; font-family: var(--font-display);
          font-size: 14px; font-weight: 700; text-decoration: none;
          border: 1.5px solid rgba(242,228,206,.5);
          transition: border-color .2s, background .2s, transform .18s;
        }
        .pp-closing__btn-secondary:hover { border-color: var(--color-cream); background: rgba(255,255,255,.08); transform: translateY(-1px); }

        @media (max-width: 768px) {
          .pp-hero { padding: 88px 20px 48px; }
          .pp-stats { gap: 20px; }
          .pp-featured, .pp-upcoming, .pp-archive,
          .pp-topics, .pp-suggest { padding-top: 48px; padding-bottom: 48px; }
          .pp-panelist { padding: 48px 20px; }
          .pp-eco { padding: 48px 20px; }
          .pp-closing { padding: 48px 20px; }
          .pp-section-title { font-size: clamp(22px,5vw,30px); }
          .pp-btn-primary, .pp-btn-secondary { padding: 13px 20px; font-size: 13px; }
        }
        @media (max-width: 480px) {
          .pp-hero { padding: 80px 16px 40px; }
          .pp-hero__ctas { flex-direction: column; }
          .pp-hero__ctas a { text-align: center; justify-content: center; }
          .pp-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; }
          .pp-archive-card__cta { padding: 9px 14px; font-size: 11px; }
          .pp-archive-card__actions { gap: 8px; }
        }
      `}</style>

      {/* HERO */}
      <header className="pp-hero" id="top">
        <p className="pp-hero__kicker">Community · Live Conversations</p>
        <h1 className="pp-hero__title">Partner <em>Panels</em></h1>
        <p className="pp-hero__sub">Live conversations with people who have actually walked the path.</p>
        <p className="pp-hero__body">
          Partner Panels are live Zoom conversations hosted by Jose and Jocelyn with students, recent grads, professionals, recruiters, founders, and community leaders across tech, data, and adjacent career spaces. These sessions are built to <strong>make career paths more visible, more honest, and more actionable</strong> for people navigating the journey from campus to career.
        </p>
        <div className="pp-hero__ctas">
          <a href="#upcoming" className="pp-btn-primary">View Upcoming Panels</a>
          <a href="#archive" className="pp-btn-secondary">Watch Past Panels</a>
        </div>
        <div className="pp-stats">
          <div>
            <div className="pp-stat__num">12<em>+</em></div>
            <div className="pp-stat__label">Panels hosted</div>
          </div>
          <div>
            <div className="pp-stat__num">35<em>+</em></div>
            <div className="pp-stat__label">Speakers featured</div>
          </div>
          <div>
            <div className="pp-stat__num">8<em>+</em></div>
            <div className="pp-stat__label">Career topics covered</div>
          </div>
          <div>
            <div className="pp-stat__num">↗</div>
            <div className="pp-stat__label">Growing archive of recordings & flyers</div>
          </div>
        </div>
      </header>

      <hr className="pp-divider" />

      {/* FEATURED PANEL */}
      <section className="pp-featured" id="featured">
        <div className="pp-featured__head">
          <p className="pp-kicker">Section 01 · Next Up</p>
          <h2 className="pp-section-title">Featured Next Panel</h2>
        </div>
        <div className="pp-featured-card">
          <div className="pp-featured-card__body">
            <div className="pp-featured-card__eyebrow">
              <span className="pp-featured-card__live-badge">
                <span className="pp-featured-card__live-dot" />
                Coming up
              </span>
              <span className="pp-tag pp-tag--gold">May 8, 2026</span>
              <span className="pp-tag pp-tag--muted">Zoom</span>
            </div>
            <h3 className="pp-featured-card__title">Breaking Into Tech Without a Traditional Path</h3>
            <p className="pp-featured-card__desc">
              A live conversation with apprentices, career changers, first-generation professionals, and early-career technologists about how they found their way into tech without a perfectly linear path. This session is designed for students and recent grads who feel like they are behind, off-track, or trying to enter the industry without the <strong>"usual" credentials</strong>.
            </p>
            <div className="pp-featured-card__panelists">
              <p className="pp-featured-card__panelists-label">Panelists</p>
              <div className="pp-featured-card__panelist">A first-gen software engineer who landed through an apprenticeship</div>
              <div className="pp-featured-card__panelist">A recent grad working in data analytics</div>
              <div className="pp-featured-card__panelist">A professional who pivoted into tech from another field</div>
              <div className="pp-featured-card__panelist">A recruiter focused on early-career access and inclusion</div>
            </div>
            <div className="pp-featured-card__actions">
              <a href="#" className="pp-btn-primary">RSVP on Zoom</a>
              <button className="pp-btn-secondary" onClick={() => addToCalendar('Breaking Into Tech Without a Traditional Path', '2026-05-08T19:00', '2026-05-08T20:30')}>Add to Calendar</button>
              <a href="#" className="pp-btn-secondary">View Flyer</a>
            </div>
            <p className="pp-featured-card__note">Can't make it live? Register anyway to get the recording if it becomes available.</p>
          </div>
          <div className="pp-featured-card__sidebar">
            <div>
              <p className="pp-featured-card__detail-label">Date</p>
              <p className="pp-featured-card__detail-value">Thursday, May 8, 2026</p>
            </div>
            <div>
              <p className="pp-featured-card__detail-label">Time</p>
              <p className="pp-featured-card__detail-value">7:00 PM ET</p>
              <p className="pp-featured-card__detail-sub">4:00 PM PT · 6:00 PM CT</p>
            </div>
            <div>
              <p className="pp-featured-card__detail-label">Format</p>
              <p className="pp-featured-card__detail-value">Live on Zoom</p>
              <p className="pp-featured-card__detail-sub">Free to attend</p>
            </div>
            <div>
              <p className="pp-featured-card__detail-label">Hosted by</p>
              <p className="pp-featured-card__detail-value">Jose Cruz-Lopez</p>
              <p className="pp-featured-card__detail-sub">+ Jocelyn Vazquez</p>
            </div>
            <div>
              <p className="pp-featured-card__detail-label">Best for</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                <span className="pp-tag pp-tag--teal">Students</span>
                <span className="pp-tag pp-tag--gold">Recent Grads</span>
                <span className="pp-tag pp-tag--accent">Bridge Year</span>
                <span className="pp-tag pp-tag--navy">Career Changers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="pp-divider" />

      {/* UPCOMING PANELS */}
      <section className="pp-upcoming" id="upcoming">
        <div className="pp-upcoming__head">
          <p className="pp-kicker">Section 02</p>
          <h2 className="pp-section-title">Upcoming Panels</h2>
          <p className="pp-section-sub">Register. Show up. Ask the questions you never had the chance to ask.</p>
          <p className="pp-section-body">Join live conversations designed to help students and early-career talent hear directly from people who have navigated the internships, first offers, pivots, rejections, and wins that shape the road from campus to career. Each session is built around <strong>practical insight, not generic advice.</strong></p>
        </div>
        <div className="pp-upcoming__grid">
          {UPCOMING_PANELS.map(panel => (
            <article key={panel.id} className="pp-panel-card">
              <span className="pp-panel-card__date-badge">📅 {panel.date}</span>
              <h3 className="pp-panel-card__title">{panel.title}</h3>
              <p className="pp-panel-card__desc">{panel.desc}</p>
              <div className="pp-panel-card__meta">
                <div className="pp-panel-card__meta-row">
                  <span className="pp-panel-card__meta-icon">🕐</span>
                  <span>{panel.time} &nbsp;·&nbsp; <span className="pp-panel-card__meta-val">Zoom</span></span>
                </div>
                <div className="pp-panel-card__meta-row">
                  <span className="pp-panel-card__meta-icon">🎯</span>
                  <span>Best for: <span className="pp-panel-card__meta-val">{panel.bestFor}</span></span>
                </div>
              </div>
              <div className="pp-panel-card__panelists">
                <strong>Panelists</strong>
                {panel.panelists.join('\n').split('\n').map((p, i) => (
                  <span key={i}>{p}<br /></span>
                ))}
              </div>
              <div className="pp-panel-card__tags">
                {panel.tags.map(t => (
                  <span key={t.label} className={`pp-tag pp-tag--${t.type}`}>{t.label}</span>
                ))}
              </div>
              <div className="pp-panel-card__actions">
                <a href="#" className="pp-panel-card__cta-primary">{panel.cta}</a>
                <button className="pp-panel-card__cta-sm" onClick={() => addToCalendar(panel.title, panel.calStart, panel.calEnd)}>📅 Calendar</button>
                <a href="#" className="pp-panel-card__cta-sm">🗒 Flyer</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <hr className="pp-divider" />

      {/* PAST PANELS ARCHIVE */}
      <section className="pp-archive" id="archive">
        <div className="pp-archive__head">
          <p className="pp-kicker">Section 03</p>
          <h2 className="pp-section-title">Past Panels</h2>
          <p className="pp-section-sub">A growing archive of conversations you can come back to.</p>
          <p className="pp-section-body">Missed a live session? Past panels live here as a growing archive of conversations, recordings, flyers, and takeaways. Every session is meant to stay useful after the event ends, so you can come back to the conversations <strong>most relevant to where you are right now.</strong></p>
        </div>
        <div className="pp-archive__list">
          {ARCHIVE_CARDS.map(card => (
            <article key={card.id} className="pp-archive-card">
              <div className="pp-archive-card__main">
                <div>
                  <p className="pp-archive-card__date">{card.date}</p>
                  <h3 className="pp-archive-card__title">{card.title}</h3>
                  <p className="pp-archive-card__recap">{card.recap}</p>
                  <p className="pp-archive-card__panelists">
                    <strong>Panelists:</strong> {card.panelists}
                  </p>
                  <div className="pp-archive-card__tags">
                    {card.tags.map(t => (
                      <span key={t.label} className={`pp-tag pp-tag--${t.type}`}>{t.label}</span>
                    ))}
                  </div>
                </div>
                <div className="pp-archive-card__actions">
                  <a href="#" className="pp-archive-card__cta pp-archive-card__cta--watch">▶ Watch Recording</a>
                  <a href="#" className="pp-archive-card__cta pp-archive-card__cta--flyer">🗒 View Flyer</a>
                  <button
                    className="pp-archive-card__cta pp-archive-card__cta--takeaways"
                    onClick={() => toggleTakeaway(card.id)}
                  >
                    ✦ {openTakeaway === card.id ? 'Hide Takeaways' : 'Key Takeaways'}
                  </button>
                </div>
              </div>
              <div className={`pp-takeaways${openTakeaway === card.id ? ' open' : ''}`}>
                <div className="pp-takeaways__inner">
                  <p className="pp-takeaways__title">Key Takeaways from This Session</p>
                  <div className="pp-takeaways__list">
                    {card.takeaways.map((t, i) => (
                      <div key={i} className="pp-takeaways__item">{t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <hr className="pp-divider" />

      {/* TOPIC BROWSE */}
      <section className="pp-topics" id="topics">
        <div className="pp-topics__head">
          <p className="pp-kicker">Section 04</p>
          <h2 className="pp-section-title">Browse by Topic</h2>
          <p className="pp-section-sub">Find the conversations that match where you are right now.</p>
          <p className="pp-section-body">Not every panel is for everyone. Browse the archive by topic to find the conversations most relevant to what you are navigating.</p>
        </div>
        <div className="pp-topics__chips">
          {TOPIC_CHIPS.map(chip => (
            <span
              key={chip.key}
              className={`pp-topic-chip${activeTopic === chip.key ? ' active' : ''}`}
              onClick={() => setActiveTopic(chip.key)}
            >
              {chip.label}
            </span>
          ))}
        </div>
        <p className="pp-topics__note">Whether you are preparing for your first internship, trying to land your first full-time role, or figuring out how to keep going after a hard recruiting season - there is a panel path here for you.</p>
      </section>

      <hr className="pp-divider" />

      {/* SUGGEST A PANEL */}
      <section className="pp-suggest" id="suggest">
        <div className="pp-suggest__layout">
          <div>
            <p className="pp-suggest__intro-kicker">Section 05</p>
            <h2 className="pp-suggest__intro-title">What panel should we host next?</h2>
            <p className="pp-suggest__intro-body">
              The best panel ideas come directly from the questions people are already living through. If there is a conversation, role, industry, or perspective you want us to feature in a future Partner Panel, <strong>send it here.</strong> We use community feedback to shape what we host next.
            </p>
          </div>
          <div className="pp-form-box">
            {suggestSubmitted ? (
              <div className="pp-form-success">
                <div className="pp-form-success__icon pp-form-success__icon--gold">✓</div>
                <div className="pp-form-success__title">Suggestion received!</div>
                <p className="pp-form-success__body">Thank you - we read every submission. If we host a panel on your topic, we'll let you know if you left an email. Keep an eye on upcoming panels.</p>
              </div>
            ) : (
              <form onSubmit={submitSuggest}>
                <div className="pp-form-row">
                  <label className="pp-form-label" htmlFor="suggestTopic">Panel topic you want to see <span>*</span></label>
                  <input className="pp-form-input" type="text" id="suggestTopic" placeholder="Ex: Breaking into product management without prior experience" value={suggestForm.topic} onChange={e => setSuggestForm(f => ({ ...f, topic: e.target.value }))} />
                </div>
                <div className="pp-form-row">
                  <label className="pp-form-label" htmlFor="suggestWhy">Why would this be helpful? <span>*</span></label>
                  <textarea className="pp-form-textarea" id="suggestWhy" placeholder="Tell us what question, challenge, or gap this panel would help address…" value={suggestForm.why} onChange={e => setSuggestForm(f => ({ ...f, why: e.target.value }))} />
                </div>
                <div className="pp-form-row pp-form-row-2">
                  <div>
                    <label className="pp-form-label" htmlFor="suggestStage">Your stage <span>*</span></label>
                    <select className="pp-form-select" id="suggestStage" value={suggestForm.stage} onChange={e => setSuggestForm(f => ({ ...f, stage: e.target.value }))}>
                      <option value="">Select stage…</option>
                      <option>First-Year</option>
                      <option>Sophomore</option>
                      <option>Junior</option>
                      <option>Senior</option>
                      <option>Recent Grad</option>
                      <option>Bridge Year</option>
                      <option>Career Transition</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="pp-form-label" htmlFor="suggestCategory">Category <span>*</span></label>
                    <select className="pp-form-select" id="suggestCategory" value={suggestForm.category} onChange={e => setSuggestForm(f => ({ ...f, category: e.target.value }))}>
                      <option value="">Select category…</option>
                      <option>Internships</option>
                      <option>New Grad Roles</option>
                      <option>Apprenticeships</option>
                      <option>Interviewing</option>
                      <option>Networking</option>
                      <option>First-Gen Experience</option>
                      <option>Data Careers</option>
                      <option>Software Engineering</option>
                      <option>Recruiting</option>
                      <option>Career Pivots</option>
                      <option>Workplace Readiness</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="pp-form-row">
                  <label className="pp-form-label" htmlFor="suggestEmail">Email <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional - if you want a heads-up when we host it)</span></label>
                  <input className="pp-form-input" type="email" id="suggestEmail" placeholder="your@email.com" value={suggestForm.email} onChange={e => setSuggestForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <button className="pp-form-btn" type="submit">Send Topic Suggestion</button>
                <p className="pp-form-note">Not every idea becomes a panel immediately, but every submission helps shape what we build next.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <hr className="pp-divider" />

      {/* BECOME A PANELIST */}
      <section className="pp-panelist" id="panelist">
        <div className="pp-panelist__inner">
          <div>
            <p className="pp-panelist__intro-kicker">Section 06</p>
            <h2 className="pp-panelist__intro-title">Want to speak or partner with us?</h2>
            <p className="pp-panelist__intro-body">
              If you are a student leader, recent grad, professional, recruiter, founder, or community builder who wants to join a future panel or co-host a conversation with us, <strong>we would love to hear from you.</strong> We are especially interested in voices that bring lived experience, honest perspective, and practical value for students navigating the path from campus to career.
            </p>
            <div className="pp-panelist__perks">
              <div className="pp-panelist__perk">
                <span className="pp-panelist__perk-icon">✓</span>
                <span>We actively seek first-gen, underrepresented, and nontraditional voices</span>
              </div>
              <div className="pp-panelist__perk">
                <span className="pp-panelist__perk-icon">✓</span>
                <span>You don't need a big platform - just real experience and genuine perspective</span>
              </div>
              <div className="pp-panelist__perk">
                <span className="pp-panelist__perk-icon">✓</span>
                <span>Partnership and sponsorship inquiries also welcome</span>
              </div>
              <div className="pp-panelist__perk">
                <span className="pp-panelist__perk-icon">✓</span>
                <span>All panels are free for attendees - we keep it accessible intentionally</span>
              </div>
            </div>
          </div>
          <div className="pp-form-box pp-form-box--dark">
            {panelistSubmitted ? (
              <div className="pp-form-success">
                <div className="pp-form-success__icon pp-form-success__icon--teal">✓</div>
                <div className="pp-form-success__title">We'd love to connect.</div>
                <p className="pp-form-success__body">Thank you for your interest in speaking or partnering. We'll be in touch at your email within a few days to learn more.</p>
              </div>
            ) : (
              <form onSubmit={submitPanelist}>
                <div className="pp-form-row pp-form-row-2">
                  <div>
                    <label className="pp-form-label" htmlFor="plName">Full Name <span>*</span></label>
                    <input className="pp-form-input" type="text" id="plName" placeholder="Your name" value={panelistForm.name} onChange={e => setPanelistForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="pp-form-label" htmlFor="plEmail">Email <span>*</span></label>
                    <input className="pp-form-input" type="email" id="plEmail" placeholder="your@email.com" value={panelistForm.email} onChange={e => setPanelistForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>
                <div className="pp-form-row">
                  <label className="pp-form-label" htmlFor="plLinkedIn">LinkedIn Profile <span>*</span></label>
                  <input className="pp-form-input" type="url" id="plLinkedIn" placeholder="linkedin.com/in/yourname" value={panelistForm.linkedin} onChange={e => setPanelistForm(f => ({ ...f, linkedin: e.target.value }))} />
                </div>
                <div className="pp-form-row">
                  <label className="pp-form-label" htmlFor="plRole">Current Role / Organization <span>*</span></label>
                  <input className="pp-form-input" type="text" id="plRole" placeholder="e.g. SWE @ Stripe, CS student @ BU" value={panelistForm.role} onChange={e => setPanelistForm(f => ({ ...f, role: e.target.value }))} />
                </div>
                <div className="pp-form-row">
                  <label className="pp-form-label" htmlFor="plTopic">What topic could you speak on? <span>*</span></label>
                  <textarea className="pp-form-textarea" id="plTopic" placeholder="What experience, perspective, or insight would you bring to a panel?" value={panelistForm.topic} onChange={e => setPanelistForm(f => ({ ...f, topic: e.target.value }))} />
                </div>
                <div className="pp-form-row">
                  <label className="pp-form-label" htmlFor="plInterest">Interested in… <span>*</span></label>
                  <select className="pp-form-select" id="plInterest" value={panelistForm.interest} onChange={e => setPanelistForm(f => ({ ...f, interest: e.target.value }))}>
                    <option value="">Select…</option>
                    <option>Joining as a Panelist</option>
                    <option>Community Partnership</option>
                    <option>Sponsorship</option>
                    <option>Co-hosting a Session</option>
                    <option>Not sure yet - just want to connect</option>
                  </select>
                </div>
                <div className="pp-form-row">
                  <label className="pp-form-label" htmlFor="plNotes">Anything else we should know?</label>
                  <textarea className="pp-form-textarea" id="plNotes" placeholder="Optional - any context that helps us understand your interest or background" value={panelistForm.notes} onChange={e => setPanelistForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                <button className="pp-form-btn" type="submit">Express Interest</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="pp-eco" id="ecosystem">
        <div className="pp-eco__inner">
          <p className="pp-eco__kicker">The J&J Ecosystem</p>
          <h2 className="pp-eco__title">How Partner Panels fit the bigger picture.</h2>
          <p className="pp-eco__body">
            Partner Panels are one part of the larger J&J ecosystem. The Opportunity Board helps you find what is open. The Coffee Chat Network helps you meet people you can learn from directly. The Career Templates page gives you scripts, trackers, and tools you can use immediately. The Interview Prep Hub helps you get ready for the room. Partner Panels sit in the middle of all of that as the <strong>live conversation layer</strong> — the place where questions become dialogue, and information becomes community.
          </p>
          <div className="pp-eco__grid">
            {ECO_LINKS.map(link => (
              <Link key={link.to} to={link.to} className="pp-eco__link">
                <div className="pp-eco__link-title">{link.title}</div>
                <div className="pp-eco__link-desc">{link.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING STRIP */}
      <section className="pp-closing">
        <div className="pp-closing__inner">
          <h2 className="pp-closing__headline">Come to listen. Come to ask. Come to see what is possible.</h2>
          <div className="pp-closing__btns">
            <a href="#upcoming" className="pp-closing__btn-primary">Browse Upcoming Panels</a>
            <a href="#archive" className="pp-closing__btn-secondary">Explore the Archive</a>
          </div>
        </div>
      </section>
    </ArticleLayout>
  )
}
