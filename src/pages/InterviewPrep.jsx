import { useState } from 'react'
import { Link } from 'react-router-dom'
import ArticleLayout from '../components/ArticleLayout'
import { supabase } from '../lib/supabase'

const GRADE_CARDS = [
  {
    bar: 'fy',
    label: 'First-Year / Sophomore',
    title: 'First Interviews & Early Opportunities',
    body: 'If you are early in college, the goal is not to sound "impressive" - it is to show <strong>curiosity, reliability, communication, and proof that you can learn quickly.</strong> You may be interviewing for externships, insight programs, student leadership roles, or freshman/sophomore internships. You do not need a perfect story. You need a clear one.',
    resources: [
      { label: 'Tell Me About Yourself Script', to: '/career-templates' },
      { label: 'First Interview Checklist', to: '/career-templates' },
      { label: 'Common Behavioral Questions for Early Students', to: '/career-templates' },
      { label: 'How to Talk About Class Projects and Club Work', to: '/career-templates' },
      { label: 'Questions to Ask at the End of an Interview', to: '/career-templates' },
    ],
  },
  {
    bar: 'jr',
    label: 'Junior / Internship Recruiting',
    title: 'Internship Interviews & Recruiter Rounds',
    body: 'Juniors are usually being tested on <strong>readiness, communication, and whether you can contribute quickly</strong> in an internship environment. You need to know how to talk about projects, coursework, leadership, and prior experience in a structured way - not just describe what you did, but frame what it shows about you.',
    resources: [
      { label: 'STAR Story Bank', to: '/career-templates' },
      { label: 'Resume-to-Interview Translation Guide', to: '/career-templates' },
      { label: 'Recruiter Screen Prep Guide', to: '/career-templates' },
      { label: 'Technical Interview Checklist', to: '/career-templates' },
      { label: 'Behavioral Interview Question Bank', to: '/career-templates' },
      { label: 'Post-Interview Thank You Template', to: '/career-templates' },
    ],
  },
  {
    bar: 'sr',
    label: 'Senior / New Grad',
    title: 'Full-Time Roles, Finals & Late Cycle',
    body: "Senior-level interviews often test <strong>maturity, clarity, decision-making, and whether you seem ready to operate as a full-time employee</strong> rather than just a student. This section also helps seniors still searching late in the cycle - the question is not just how to interview, but how to interview when your search timeline is longer than your peers'.",
    resources: [
      { label: 'Full-Time Tell Me About Yourself Script', to: '/career-templates' },
      { label: 'How to Explain Your Search Timeline', to: '/career-templates' },
      { label: 'Final Round Prep Guide', to: '/career-templates' },
      { label: 'Offer-Stage Interview Questions', to: '/career-templates' },
      { label: 'Questions to Ask Hiring Managers', to: '/career-templates' },
      { label: 'Post-Interview Reflection Doc', to: '/career-templates' },
    ],
  },
  {
    bar: 'rg',
    label: 'Recent Grad / Bridge Year',
    title: 'Gap Navigation, Apprenticeships & Transitions',
    body: 'This stage is less about sounding perfect and more about <strong>explaining your path clearly, showing momentum, and connecting your past experience to where you are trying to go next.</strong> Interviewers will ask about your timeline. The way you answer that question matters more than most candidates realize.',
    resources: [
      { label: 'Gap Narrative Script', to: '/career-templates' },
      { label: 'Apprenticeship Interview Guide', to: '/bridge-year' },
      { label: 'Career Transition Story Builder', to: '/career-templates' },
      { label: 'Confidence Reframe Worksheet', to: '/career-templates' },
      { label: 'Interview Tracker + Reflection Tool', to: '/career-templates' },
    ],
  },
]

const INTERVIEW_TYPES = [
  {
    key: 'recruiter',
    label: 'Recruiter Screen',
    desc: 'Recruiter screens are usually the <strong>first filter</strong> and are less about technical depth than about clarity, fit, communication, and whether your story makes sense. The recruiter is not trying to trip you up - they are trying to decide if they should send you further. Your job is to be clear, specific, and easy to advocate for. Practice your "tell me about yourself" and your "why this company" until they are effortless.',
    resources: [
      'Recruiter Screen Prep Checklist',
      '10 Common Recruiter Screen Questions',
      'Tell Me About Yourself Script',
      'Why This Role / Why This Company Framework',
      'Salary Question Guidance for Early-Career',
    ],
  },
  {
    key: 'behavioral',
    label: 'Behavioral',
    desc: 'Behavioral interviews are used to <strong>predict future performance based on past actions</strong> - which is why the STAR method matters so much. Every question that starts with "tell me about a time when…" is an invitation to tell a story. The candidates who do well in behavioral rounds are not the ones with the most impressive stories; they are the ones who tell their stories with the most structure and specificity.',
    resources: [
      'STAR Story Bank',
      'Behavioral Question Bank (30 questions)',
      'Story Selection Guide',
      '"Weaknesses" Answer Framework',
      'Leadership / Teamwork / Failure Answer Builder',
    ],
  },
  {
    key: 'technical',
    label: 'Technical',
    desc: 'Technical interviews test <strong>problem-solving, clarity of thought, and communication under pressure</strong> - not just whether you get the perfect answer. Interviewers often care as much about how you think out loud as about what you produce. If you get stuck, narrating your thought process and asking clarifying questions will always serve you better than going silent and hoping.',
    resources: [
      'Technical Interview Prep Checklist',
      'How to Narrate Your Thinking Out Loud',
      'Project Walkthrough Framework',
      'SQL / Coding / Data Question Prep Templates',
      'What to Do When You Get Stuck',
    ],
  },
  {
    key: 'case',
    label: 'Case',
    desc: 'Case interviews test <strong>structure, logic, prioritization, and communication</strong> rather than memorized knowledge. They are most common in consulting, product, strategy, and business internships. The biggest mistake candidates make is jumping to conclusions before structuring the problem. The interviewers are evaluating your process - how you break down ambiguous problems - more than your final answer.',
    resources: [
      'Case Interview Framework Sheet',
      'Profitability / Market Entry / Product Strategy Examples',
      'How to Structure Your Answer in Real Time',
      'Common Mistakes in Case Interviews',
    ],
  },
  {
    key: 'oneway',
    label: 'One-Way / Recorded',
    desc: 'Asynchronous and recorded interviews are increasingly common - and they need their own strategy. <strong>Timing, tone, environment, and on-camera presence matter differently</strong> when there is no human on the other side reacting to you. The biggest traps are reading answers off a script, running over time, and a poor setup that distracts from your answers.',
    resources: [
      'One-Way Interview Checklist',
      'Camera / Lighting / Environment Setup Guide',
      'How to Sound Natural Without Reading',
      'Time-Boxed Answer Practice Sheet',
    ],
  },
  {
    key: 'final',
    label: 'Final Round',
    desc: 'Final round interviews often involve hiring managers, team members, and sometimes senior leadership. They are testing <strong>maturity, team fit, communication style, and readiness for the actual day-to-day work.</strong> The questions are less predictable than earlier rounds - interviewers at this stage want to have a conversation, not run a checklist. The candidates who advance are the ones who seem genuinely ready to show up.',
    resources: [
      'Final Round Prep Guide',
      'Questions to Ask a Hiring Manager',
      'Team-Fit Answer Guide',
      'Offer-Stage Red Flags and Green Flags',
      'Post-Interview Thank You Note',
    ],
  },
]

const RESOURCE_CARDS = [
  {
    name: 'Tell Me About Yourself Script',
    desc: 'Three versions: student, senior/new grad, and career transition. A 3-part framework - who you are, what you have done, why this role - that turns the most-asked question into a practiced, confident answer.',
    gradeTags: [
      { label: 'First-Year', type: 'fy' },
      { label: 'Junior', type: 'jr' },
      { label: 'Senior', type: 'sr' },
      { label: 'Recent Grad', type: 'rg' },
    ],
    roundTags: [
      { label: 'Recruiter', type: 'rec' },
      { label: 'Behavioral', type: 'beh' },
      { label: 'Final Round', type: 'fin' },
    ],
    ctaLabel: 'Copy Template →',
  },
  {
    name: 'STAR Story Bank Template',
    desc: 'A blank document for building 6–8 interview stories organized by teamwork, leadership, challenge, failure, conflict, and initiative - built once, reused in every interview.',
    gradeTags: [
      { label: 'Junior', type: 'jr' },
      { label: 'Senior', type: 'sr' },
      { label: 'Recent Grad', type: 'rg' },
    ],
    roundTags: [
      { label: 'Behavioral', type: 'beh' },
      { label: 'Final Round', type: 'fin' },
    ],
    ctaLabel: 'Open Framework →',
  },
  {
    name: 'Questions to Ask at the End',
    desc: '15 specific, non-generic questions organized by who you are talking to: recruiter, engineer, hiring manager, or panel. The questions that actually show you have thought about the role.',
    gradeTags: [
      { label: 'First-Year', type: 'fy' },
      { label: 'Junior', type: 'jr' },
      { label: 'Senior', type: 'sr' },
      { label: 'Recent Grad', type: 'rg' },
    ],
    roundTags: [
      { label: 'Recruiter', type: 'rec' },
      { label: 'Technical', type: 'tech' },
      { label: 'Final Round', type: 'fin' },
    ],
    ctaLabel: 'Open Framework →',
  },
  {
    name: 'Post-Interview Reflection Doc',
    desc: 'What happened, what questions you got, where you froze, and what to improve next time. Turns every interview - successful or not - into feedback for the next one.',
    gradeTags: [
      { label: 'Junior', type: 'jr' },
      { label: 'Senior', type: 'sr' },
      { label: 'Recent Grad', type: 'rg' },
    ],
    roundTags: [
      { label: 'Behavioral', type: 'beh' },
      { label: 'Technical', type: 'tech' },
      { label: 'Final Round', type: 'fin' },
    ],
    ctaLabel: 'Open Framework →',
  },
  {
    name: 'Mock Answer Builder',
    desc: 'A worksheet for drafting strong responses to specific questions before practice - so you are building answers from structure, not performing under pressure for the first time in the real interview.',
    gradeTags: [
      { label: 'First-Year', type: 'fy' },
      { label: 'Junior', type: 'jr' },
      { label: 'Senior', type: 'sr' },
    ],
    roundTags: [
      { label: 'Behavioral', type: 'beh' },
      { label: 'Technical', type: 'tech' },
      { label: 'Case', type: 'case' },
    ],
    ctaLabel: 'Open Framework →',
  },
  {
    name: 'Interview Day Checklist',
    desc: 'What to do 24 hours before, 1 hour before, and 10 minutes before - so the day of the interview is about being present, not scrambling. Covers both virtual and in-person formats.',
    gradeTags: [
      { label: 'First-Year', type: 'fy' },
      { label: 'Junior', type: 'jr' },
      { label: 'Senior', type: 'sr' },
      { label: 'Recent Grad', type: 'rg' },
    ],
    roundTags: [
      { label: 'Recruiter', type: 'rec' },
      { label: 'Behavioral', type: 'beh' },
      { label: 'Technical', type: 'tech' },
      { label: 'One-Way', type: 'ow' },
    ],
    ctaLabel: 'Copy Template →',
  },
  {
    name: 'Confidence Reframe Guide',
    desc: 'Built specifically for first-gen students who tend to undersell their experience. A framework for translating real grit, real responsibility, and real leadership from non-traditional contexts into language that interviewers recognize.',
    gradeTags: [
      { label: 'First-Year', type: 'fy' },
      { label: 'Junior', type: 'jr' },
      { label: 'Recent Grad', type: 'rg' },
    ],
    roundTags: [
      { label: 'Recruiter', type: 'rec' },
      { label: 'Behavioral', type: 'beh' },
      { label: 'Final Round', type: 'fin' },
    ],
    ctaLabel: 'Open Framework →',
  },
]

const SUGGESTED_PATHS = [
  {
    num: '01',
    trigger: '"I\'m a sophomore and I have my first interview."',
    items: [
      { label: 'Tell Me About Yourself Script', to: '/career-templates' },
      { label: 'First Interview Checklist', to: '/career-templates' },
      { label: 'Common Behavioral Questions for Early Students', to: '/career-templates' },
      { label: 'Questions to Ask at the End of an Interview', to: '/career-templates' },
    ],
  },
  {
    num: '02',
    trigger: '"I\'m a junior interviewing for internships."',
    items: [
      { label: 'Recruiter Screen Prep Guide', to: '/career-templates' },
      { label: 'STAR Story Bank', to: '/career-templates' },
      { label: 'Technical Interview Checklist', to: '/career-templates' },
      { label: 'Post-Interview Thank You Note', to: '/career-templates' },
    ],
  },
  {
    num: '03',
    trigger: '"I\'m a senior and I keep reaching final rounds."',
    items: [
      { label: 'Final Round Prep Guide', to: '/career-templates' },
      { label: 'Team-Fit Answer Builder', to: '/career-templates' },
      { label: 'Questions to Ask Hiring Managers', to: '/career-templates' },
      { label: 'Post-Interview Reflection Doc', to: '/career-templates' },
    ],
  },
  {
    num: '04',
    trigger: '"I graduated and I\'m trying to break into tech."',
    items: [
      { label: 'Gap Narrative Script', to: '/career-templates' },
      { label: 'Apprenticeship Interview Guide', to: '/bridge-year' },
      { label: 'Career Transition Story Builder', to: '/career-templates' },
      { label: 'Confidence Reframe Guide', to: '/career-templates' },
    ],
  },
]

const ECO_LINKS = [
  {
    num: '01',
    title: 'LinkedIn Series',
    desc: 'The broader career context and real-time breakdowns - recruiting timelines, offer anatomy, and first-gen-specific strategy.',
    to: '/linkedin-series',
  },
  {
    num: '02',
    title: 'Career Templates',
    desc: 'The scripts and trackers you can copy and use immediately - outreach, applications, offers, and on-the-job tools.',
    to: '/career-templates',
  },
  {
    num: '03',
    title: 'Bridge Year Hub',
    desc: 'If the bigger issue is not just interviewing, but figuring out what roles and pathways to pursue - apprenticeships, new grad roles, and a self-guided sprint path.',
    to: '/bridge-year',
  },
  {
    num: '04',
    title: 'La Voz del Día',
    desc: 'Deeper reading on rejection, negotiation, onboarding, and the parts of the process that are harder to fit in a checklist.',
    to: '/articles',
  },
]

export default function InterviewPrep() {
  const [activeTab, setActiveTab] = useState('recruiter')
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({ role: '', stage: '', type: '', need: '', email: '' })

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.role) {
      setFormError('Please describe your role or interview situation.')
      return
    }
    setFormLoading(true)
    setFormError('')
    const { error } = await supabase.from('interview_prep_requests').insert({
      description: form.role,
      stage: form.stage || null,
      interview_type: form.type || null,
      help_needed: form.need || null,
      email: form.email || null,
    })
    setFormLoading(false)
    if (error) {
      setFormError('Something went wrong. Please try again.')
    } else {
      setFormSubmitted(true)
    }
  }

  const activePanel = INTERVIEW_TYPES.find(t => t.key === activeTab)

  return (
    <ArticleLayout title="Interview Prep Hub">
      <style>{`
        html, body { background: var(--color-cream); }

        .ip-kicker {
          font-size: 11px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: var(--color-muted); margin-bottom: 14px;
        }
        .ip-section-title {
          font-family: var(--font-display);
          font-size: clamp(26px,4vw,40px); font-weight: 700;
          color: var(--color-dark); line-height: 1.15; margin-bottom: 10px;
        }
        .ip-section-sub {
          font-family: var(--font-display);
          font-size: clamp(16px,2vw,20px); font-weight: 400;
          color: var(--color-accent); margin-bottom: 18px;
        }
        .ip-section-body {
          font-size: clamp(14px,1.7vw,16px); color: var(--color-muted);
          line-height: 1.8; max-width: 700px;
        }
        .ip-section-body strong { color: var(--color-dark); font-weight: 600; }
        .ip-divider { border: none; border-top: 1px solid rgba(0,0,0,.08); margin: 0; }

        /* Tag pills */
        .ip-tag {
          display: inline-block; font-size: 10px; font-weight: 700;
          letter-spacing: .07em; text-transform: uppercase;
          padding: 3px 9px; border-radius: 4px;
        }
        .ip-tag--fy   { background: rgba(58,125,107,.1);  color: var(--color-teal); }
        .ip-tag--jr   { background: rgba(232,168,56,.14); color: #a07820; }
        .ip-tag--sr   { background: rgba(22,43,68,.1);    color: var(--color-navy); }
        .ip-tag--rg   { background: rgba(179,69,57,.1);   color: var(--color-accent); }
        .ip-tag--rec  { background: rgba(91,142,194,.12); color: var(--color-blue); }
        .ip-tag--beh  { background: rgba(58,125,107,.1);  color: var(--color-teal); }
        .ip-tag--tech { background: rgba(232,168,56,.14); color: #a07820; }
        .ip-tag--case { background: rgba(22,43,68,.1);    color: var(--color-navy); }
        .ip-tag--ow   { background: rgba(0,0,0,.06);      color: var(--color-muted); }
        .ip-tag--fin  { background: rgba(179,69,57,.1);   color: var(--color-accent); }

        /* HERO */
        .ip-hero {
          max-width: 1040px; margin: 0 auto;
          padding: 120px clamp(20px,5vw,56px) 64px;
        }
        .ip-hero__kicker {
          font-size: 11px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: var(--color-muted); margin-bottom: 18px;
        }
        .ip-hero__title {
          font-family: var(--font-display);
          font-size: clamp(42px,7vw,80px); font-weight: 700;
          line-height: 1.04; color: var(--color-dark); margin-bottom: 14px;
        }
        .ip-hero__title em { font-style: normal; color: var(--color-accent); }
        .ip-hero__sub {
          font-family: var(--font-display);
          font-size: clamp(18px,2.5vw,26px); font-weight: 400;
          color: var(--color-dark); line-height: 1.4;
          max-width: 680px; margin-bottom: 24px;
        }
        .ip-hero__body {
          font-size: clamp(15px,1.8vw,17px); color: var(--color-muted);
          line-height: 1.8; max-width: 680px; margin-bottom: 40px;
        }
        .ip-hero__body strong { color: var(--color-dark); font-weight: 600; }
        .ip-jumps { display: flex; flex-direction: column; gap: 10px; }
        .ip-jump {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--font-display); font-size: 15px; font-weight: 600;
          color: var(--color-dark); text-decoration: none; transition: color .2s;
        }
        .ip-jump::before {
          content: '→'; color: var(--color-accent); font-weight: 700;
          transition: transform .2s cubic-bezier(.16,1,.3,1);
        }
        .ip-jump:hover { color: var(--color-accent); }
        .ip-jump:hover::before { transform: translateX(4px); }

        /* GRADE LEVEL */
        .ip-grade {
          max-width: 1040px; margin: 0 auto;
          padding: 80px clamp(20px,5vw,56px);
        }
        .ip-grade__head { margin-bottom: 40px; }
        .ip-grade__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px,1fr));
          gap: 20px;
        }
        .ip-grade-card {
          background: var(--color-white); border: 1px solid rgba(0,0,0,.08);
          border-radius: 14px; overflow: hidden;
          display: flex; flex-direction: column;
          transition: transform .22s cubic-bezier(.16,1,.3,1), box-shadow .22s;
        }
        .ip-grade-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(0,0,0,.09); }
        .ip-grade-card__bar { height: 4px; }
        .ip-grade-card__bar--fy  { background: var(--color-teal); }
        .ip-grade-card__bar--jr  { background: var(--color-gold); }
        .ip-grade-card__bar--sr  { background: var(--color-navy); }
        .ip-grade-card__bar--rg  { background: var(--color-accent); }
        .ip-grade-card__inner { padding: 24px; flex: 1; display: flex; flex-direction: column; }
        .ip-grade-card__label {
          font-size: 11px; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; padding: 3px 10px; border-radius: 4px;
          color: white; display: inline-block; align-self: flex-start; margin-bottom: 14px;
        }
        .ip-grade-card__label--fy  { background: var(--color-teal); }
        .ip-grade-card__label--jr  { background: #a07820; }
        .ip-grade-card__label--sr  { background: var(--color-navy); }
        .ip-grade-card__label--rg  { background: var(--color-accent); }
        .ip-grade-card__title {
          font-family: var(--font-display); font-size: clamp(17px,2vw,20px);
          font-weight: 700; color: var(--color-dark); margin-bottom: 10px;
        }
        .ip-grade-card__body {
          font-size: 13px; color: var(--color-muted); line-height: 1.7;
          margin-bottom: 20px; flex: 1;
        }
        .ip-grade-card__body strong { color: var(--color-dark); font-weight: 600; }
        .ip-grade-card__resources { border-top: 1px solid rgba(0,0,0,.06); padding-top: 16px; }
        .ip-grade-card__res-label {
          font-size: 10px; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--color-muted); margin-bottom: 10px;
        }
        .ip-grade-card__res-list { display: flex; flex-direction: column; gap: 6px; }
        .ip-grade-card__res-item {
          display: flex; align-items: center; gap: 7px;
          font-size: 13px; color: var(--color-dark);
          text-decoration: none; font-weight: 500; transition: color .2s;
        }
        .ip-grade-card__res-item::before {
          content: '→'; font-size: 11px; font-weight: 700;
          flex-shrink: 0; transition: transform .18s cubic-bezier(.16,1,.3,1);
        }
        .ip-grade-card__res-item--fy::before  { color: var(--color-teal); }
        .ip-grade-card__res-item--jr::before  { color: #a07820; }
        .ip-grade-card__res-item--sr::before  { color: var(--color-navy); }
        .ip-grade-card__res-item--rg::before  { color: var(--color-accent); }
        .ip-grade-card__res-item:hover { color: var(--color-accent); }
        .ip-grade-card__res-item:hover::before { transform: translateX(3px); }

        /* INTERVIEW TYPES */
        .ip-types {
          background: var(--color-navy);
          padding: clamp(64px,8vw,96px) clamp(20px,5vw,56px);
        }
        .ip-types__inner { max-width: 1040px; margin: 0 auto; }
        .ip-types__kicker {
          font-size: 11px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: var(--color-gold); margin-bottom: 14px;
        }
        .ip-types__title {
          font-family: var(--font-display);
          font-size: clamp(28px,4.5vw,48px); font-weight: 700;
          color: var(--color-cream); margin-bottom: 10px;
        }
        .ip-types__sub {
          font-family: var(--font-display); font-size: clamp(16px,2vw,20px);
          font-weight: 400; color: rgba(232,168,56,.85); margin-bottom: 48px;
        }
        .ip-type-tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 36px; }
        .ip-type-tab {
          padding: 8px 18px; border-radius: 999px; font-family: var(--font-body);
          font-size: 13px; font-weight: 600; cursor: pointer;
          border: 1.5px solid rgba(242,228,206,.2);
          background: transparent; color: rgba(242,228,206,.6);
          transition: background .2s, color .2s, border-color .2s;
        }
        .ip-type-tab:hover { color: var(--color-cream); border-color: rgba(242,228,206,.45); }
        .ip-type-tab--active { background: var(--color-cream); color: var(--color-dark); border-color: var(--color-cream); }
        .ip-type-panel__inner {
          display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start;
        }
        .ip-type-panel__desc {
          font-size: clamp(14px,1.7vw,16px); color: rgba(242,228,206,.7); line-height: 1.8;
        }
        .ip-type-panel__desc strong { color: var(--color-cream); font-weight: 600; }
        .ip-type-panel__res-label {
          font-size: 10px; font-weight: 700; letter-spacing: .12em;
          text-transform: uppercase; color: var(--color-gold); margin-bottom: 12px;
        }
        .ip-type-panel__res-list { display: flex; flex-direction: column; gap: 8px; }
        .ip-type-panel__res {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 14px; border-radius: 8px;
          background: rgba(255,255,255,.06); border: 1px solid rgba(242,228,206,.1);
          font-size: 13px; font-weight: 500; color: var(--color-cream);
          text-decoration: none; transition: background .2s, border-color .2s;
        }
        .ip-type-panel__res:hover { background: rgba(255,255,255,.1); border-color: rgba(242,228,206,.25); }
        .ip-type-panel__res::before {
          content: '→'; color: var(--color-gold); font-weight: 700;
          flex-shrink: 0; font-size: 11px;
          transition: transform .18s cubic-bezier(.16,1,.3,1);
        }
        .ip-type-panel__res:hover::before { transform: translateX(3px); }

        /* RESOURCE LIBRARY */
        .ip-library {
          max-width: 1040px; margin: 0 auto;
          padding: 80px clamp(20px,5vw,56px);
        }
        .ip-library__head { margin-bottom: 36px; }
        .ip-library__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px,1fr));
          gap: 18px;
        }
        .ip-res-card {
          background: var(--color-white); border: 1px solid rgba(0,0,0,.08);
          border-radius: 14px; padding: 24px;
          display: flex; flex-direction: column; gap: 12px;
          transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s;
        }
        .ip-res-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.09); }
        .ip-res-card__name {
          font-family: var(--font-display); font-size: clamp(15px,1.8vw,18px);
          font-weight: 600; color: var(--color-dark); line-height: 1.3;
        }
        .ip-res-card__desc { font-size: 13px; color: var(--color-muted); line-height: 1.65; flex: 1; }
        .ip-res-card__tags-group { display: flex; flex-direction: column; gap: 6px; }
        .ip-res-card__tag-row { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
        .ip-res-card__tag-label {
          font-size: 10px; font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase; color: var(--color-muted); margin-right: 4px; flex-shrink: 0;
        }
        .ip-res-card__cta {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 18px; border-radius: 8px;
          background: var(--color-dark); color: var(--color-cream);
          font-family: var(--font-display); font-size: 12px; font-weight: 600;
          text-decoration: none; border: none; cursor: pointer;
          transition: background .2s, transform .18s; align-self: flex-start;
        }
        .ip-res-card__cta:hover { background: var(--color-accent); transform: translateY(-1px); }

        /* SUGGESTED PATHS */
        .ip-paths {
          max-width: 1040px; margin: 0 auto;
          padding: 80px clamp(20px,5vw,56px);
        }
        .ip-paths__head { margin-bottom: 36px; }
        .ip-paths__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .ip-path-card {
          background: var(--color-white); border: 1px solid rgba(0,0,0,.08);
          border-radius: 14px; padding: 28px;
        }
        .ip-path-card__num {
          font-family: var(--font-display); font-size: 36px; font-weight: 700;
          color: rgba(0,0,0,.08); line-height: 1; margin-bottom: 10px;
        }
        .ip-path-card__trigger {
          font-family: var(--font-display); font-size: clamp(15px,1.8vw,17px);
          font-weight: 600; color: var(--color-muted);
          border-bottom: 1px solid rgba(0,0,0,.08);
          padding-bottom: 14px; margin-bottom: 16px; line-height: 1.45; font-style: italic;
        }
        .ip-path-card__list { display: flex; flex-direction: column; gap: 8px; }
        .ip-path-card__item {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 14px; color: var(--color-dark);
          text-decoration: none; font-weight: 500; transition: color .2s;
        }
        .ip-path-card__item::before {
          content: '→'; font-size: 11px; font-weight: 700;
          color: var(--color-accent); flex-shrink: 0; margin-top: 2px;
          transition: transform .18s cubic-bezier(.16,1,.3,1);
        }
        .ip-path-card__item:hover { color: var(--color-accent); }
        .ip-path-card__item:hover::before { transform: translateX(3px); }

        /* ECOSYSTEM */
        .ip-eco {
          background: var(--color-navy);
          padding: clamp(48px,6vw,80px) clamp(20px,5vw,56px);
        }
        .ip-eco__inner {
          max-width: 1040px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start;
        }
        .ip-eco__kicker {
          font-size: 11px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: var(--color-gold); margin-bottom: 14px;
        }
        .ip-eco__title {
          font-family: var(--font-display); font-size: clamp(22px,3vw,32px);
          font-weight: 700; color: var(--color-cream); margin-bottom: 16px;
        }
        .ip-eco__body {
          font-size: clamp(14px,1.7vw,16px); color: rgba(242,228,206,.65); line-height: 1.8;
        }
        .ip-eco__body strong { color: var(--color-cream); font-weight: 600; }
        .ip-eco__links { display: flex; flex-direction: column; gap: 12px; margin-top: 4px; }
        .ip-eco__link {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 16px 18px; border-radius: 10px;
          background: rgba(255,255,255,.06); border: 1px solid rgba(242,228,206,.1);
          text-decoration: none; transition: background .2s, border-color .2s;
        }
        .ip-eco__link:hover { background: rgba(255,255,255,.1); border-color: rgba(242,228,206,.22); }
        .ip-eco__link-icon {
          font-family: var(--font-display); font-size: 20px; font-weight: 700;
          color: var(--color-gold); flex-shrink: 0; line-height: 1; margin-top: 1px;
        }
        .ip-eco__link-title {
          font-family: var(--font-display); font-size: 14px; font-weight: 600;
          color: var(--color-cream); margin-bottom: 3px;
        }
        .ip-eco__link-desc { font-size: 12px; color: rgba(242,228,206,.55); line-height: 1.5; }

        /* REQUEST FORM */
        .ip-form-wrap {
          max-width: 1040px; margin: 0 auto;
          padding: 80px clamp(20px,5vw,56px) 100px;
        }
        .ip-form-box {
          background: var(--color-white); border: 1px solid rgba(0,0,0,.07);
          border-radius: 16px; padding: clamp(32px,4vw,52px); max-width: 680px;
        }
        .ip-form-box__kicker {
          font-size: 11px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: var(--color-muted); margin-bottom: 12px;
        }
        .ip-form-box__title {
          font-family: var(--font-display); font-size: clamp(22px,3vw,30px);
          font-weight: 700; color: var(--color-dark); margin-bottom: 8px;
        }
        .ip-form-box__sub { font-size: 15px; color: var(--color-muted); line-height: 1.7; margin-bottom: 28px; }
        .ip-form-row { margin-bottom: 16px; }
        .ip-form-label {
          display: block; font-size: 12px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .08em;
          color: var(--color-muted); margin-bottom: 6px;
        }
        .ip-form-input,
        .ip-form-select,
        .ip-form-textarea {
          width: 100%; font-family: var(--font-body); font-size: 15px;
          padding: 12px 14px; border: 1.5px solid rgba(0,0,0,.12);
          border-radius: 8px; background: var(--color-white);
          color: var(--color-dark); outline: none; transition: border-color .2s;
          box-sizing: border-box;
        }
        .ip-form-textarea { min-height: 90px; resize: vertical; line-height: 1.55; }
        .ip-form-input:focus,
        .ip-form-select:focus,
        .ip-form-textarea:focus { border-color: var(--color-gold); }
        .ip-form-select { appearance: none; cursor: pointer; }
        .ip-form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
        .ip-form-btn {
          margin-top: 6px; padding: 13px 28px; background: var(--color-dark);
          color: var(--color-cream); border: none; border-radius: 8px;
          font-family: var(--font-display); font-size: 14px; font-weight: 600;
          cursor: pointer; transition: background .2s, transform .18s;
        }
        .ip-form-btn:hover { background: var(--color-accent); transform: translateY(-1px); }
        .ip-form-success { text-align: center; padding: 32px 0; }
        .ip-form-success h3 {
          font-family: var(--font-display); font-size: 22px; font-weight: 700;
          color: var(--color-dark); margin-bottom: 8px;
        }
        .ip-form-success p { font-size: 15px; color: var(--color-muted); line-height: 1.7; }

        @media (max-width: 768px) {
          .ip-hero { padding: 88px 20px 48px; }
          .ip-grade, .ip-library, .ip-paths, .ip-form-wrap { padding-top: 48px; padding-bottom: 48px; }
          .ip-type-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap; padding-bottom: 4px; }
          .ip-type-tab { flex-shrink: 0; }
        }
        @media (max-width: 640px) {
          .ip-type-panel__inner { grid-template-columns: 1fr; gap: 24px; }
          .ip-paths__grid { grid-template-columns: 1fr; }
          .ip-eco__inner { grid-template-columns: 1fr; }
        }
        @media (max-width: 500px) {
          .ip-form-row-2 { grid-template-columns: 1fr; }
          .ip-grade__grid { grid-template-columns: 1fr; }
          .ip-library__grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .ip-hero { padding: 80px 16px 40px; }
        }
      `}</style>

      {/* HERO */}
      <header className="ip-hero" id="top">
        <p className="ip-hero__kicker">From Campus to Career · Interview Prep</p>
        <h1 className="ip-hero__title">Interview Prep <em>Hub</em></h1>
        <p className="ip-hero__sub">Stop guessing what the interviewer wants. Start preparing with a system.</p>
        <p className="ip-hero__body">
          This page is built for students and early-career candidates preparing for internships, apprenticeships, new grad roles, and early full-time opportunities. <strong>Jose brings the student-side view</strong> of what it feels like to prepare in real time, and <strong>Jocelyn brings the early-career view</strong> of what actually stands out once you are in the room. Together, this page gives you practical tools, organized pathways, and interview-specific resources you can use right now.
        </p>
        <nav className="ip-jumps" aria-label="Page sections">
          <a href="#by-grade" className="ip-jump">Start by grade level</a>
          <a href="#by-type" className="ip-jump">Browse by interview type</a>
          <a href="#resources" className="ip-jump">Use interview templates</a>
          <a href="#paths" className="ip-jump">Find your suggested path</a>
        </nav>
      </header>

      <hr className="ip-divider" />

      {/* S1: GRADE LEVEL */}
      <section className="ip-grade" id="by-grade">
        <div className="ip-grade__head">
          <p className="ip-kicker">Section 01</p>
          <h2 className="ip-section-title">Start by Grade Level</h2>
          <p className="ip-section-sub">Different stages. Different needs. Different resources.</p>
          <p className="ip-section-body">Students at different points in college need completely different preparation. Find your stage, read the paragraph, and work through the recommended resources in order - that is the fastest path to being ready.</p>
        </div>
        <div className="ip-grade__grid">
          {GRADE_CARDS.map(card => (
            <div className="ip-grade-card" key={card.bar}>
              <div className={`ip-grade-card__bar ip-grade-card__bar--${card.bar}`} />
              <div className="ip-grade-card__inner">
                <span className={`ip-grade-card__label ip-grade-card__label--${card.bar}`}>{card.label}</span>
                <h3 className="ip-grade-card__title">{card.title}</h3>
                <p className="ip-grade-card__body" dangerouslySetInnerHTML={{ __html: card.body }} />
                <div className="ip-grade-card__resources">
                  <p className="ip-grade-card__res-label">Recommended resources</p>
                  <div className="ip-grade-card__res-list">
                    {card.resources.map(r => (
                      <Link key={r.label} to={r.to} className={`ip-grade-card__res-item ip-grade-card__res-item--${card.bar}`}>{r.label}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="ip-divider" />

      {/* S2: INTERVIEW TYPES */}
      <section className="ip-types" id="by-type">
        <div className="ip-types__inner">
          <p className="ip-types__kicker">Section 02</p>
          <h2 className="ip-types__title">Browse by Interview Type</h2>
          <p className="ip-types__sub">I have a [type] interview tomorrow. Here is exactly where to start.</p>

          <div className="ip-type-tabs" role="tablist" aria-label="Interview types">
            {INTERVIEW_TYPES.map(t => (
              <button
                key={t.key}
                className={`ip-type-tab${activeTab === t.key ? ' ip-type-tab--active' : ''}`}
                role="tab"
                aria-selected={activeTab === t.key}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activePanel && (
            <div className="ip-type-panel__inner">
              <div className="ip-type-panel__desc" dangerouslySetInnerHTML={{ __html: `<p>${activePanel.desc}</p>` }} />
              <div>
                <p className="ip-type-panel__res-label">Resources for this round</p>
                <div className="ip-type-panel__res-list">
                  {activePanel.resources.map(res => (
                    <Link key={res} to="/career-templates" className="ip-type-panel__res">{res}</Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* S3: RESOURCE LIBRARY */}
      <section className="ip-library" id="resources">
        <div className="ip-library__head">
          <p className="ip-kicker">Section 03</p>
          <h2 className="ip-section-title">Core Resource Library</h2>
          <p className="ip-section-sub">Every tool you need. Organized by who it is for and what interview it fits.</p>
        </div>
        <div className="ip-library__grid">
          {RESOURCE_CARDS.map(card => (
            <div className="ip-res-card" key={card.name}>
              <h3 className="ip-res-card__name">{card.name}</h3>
              <p className="ip-res-card__desc">{card.desc}</p>
              <div className="ip-res-card__tags-group">
                <div className="ip-res-card__tag-row">
                  <span className="ip-res-card__tag-label">Grade:</span>
                  {card.gradeTags.map(t => (
                    <span key={t.label} className={`ip-tag ip-tag--${t.type}`}>{t.label}</span>
                  ))}
                </div>
                <div className="ip-res-card__tag-row">
                  <span className="ip-res-card__tag-label">Round:</span>
                  {card.roundTags.map(t => (
                    <span key={t.label} className={`ip-tag ip-tag--${t.type}`}>{t.label}</span>
                  ))}
                </div>
              </div>
              <Link to="/career-templates" className="ip-res-card__cta">{card.ctaLabel}</Link>
            </div>
          ))}
        </div>
      </section>

      <hr className="ip-divider" />

      {/* S4: SUGGESTED PATHS */}
      <section className="ip-paths" id="paths">
        <div className="ip-paths__head">
          <p className="ip-kicker">Section 04</p>
          <h2 className="ip-section-title">Suggested Paths</h2>
          <p className="ip-section-sub">Find your situation. Follow the path.</p>
          <p className="ip-section-body">Not sure where to start? Find the sentence that matches your situation and work through the four resources in order. These paths combine grade level and interview type into a single, actionable sequence.</p>
        </div>
        <div className="ip-paths__grid">
          {SUGGESTED_PATHS.map(path => (
            <div className="ip-path-card" key={path.num}>
              <div className="ip-path-card__num">{path.num}</div>
              <p className="ip-path-card__trigger">{path.trigger}</p>
              <div className="ip-path-card__list">
                {path.items.map(item => (
                  <Link key={item.label} to={item.to} className="ip-path-card__item">{item.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* S5: ECOSYSTEM */}
      <section className="ip-eco" id="ecosystem">
        <div className="ip-eco__inner">
          <div>
            <p className="ip-eco__kicker">The Ecosystem</p>
            <h2 className="ip-eco__title">How this hub fits the rest of the site</h2>
            <p className="ip-eco__body">The Interview Prep Hub helps you <strong>prepare for the room.</strong> But interviewing is only one part of the campus-to-career pipeline - and the other parts are already built out. Use this page for interview readiness, then use the rest of the site for the context and tools around it.</p>
          </div>
          <div className="ip-eco__links">
            {ECO_LINKS.map(link => (
              <Link key={link.num} to={link.to} className="ip-eco__link">
                <span className="ip-eco__link-icon">{link.num}</span>
                <div>
                  <p className="ip-eco__link-title">{link.title}</p>
                  <p className="ip-eco__link-desc">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* S6: REQUEST FORM */}
      <section className="ip-form-wrap" id="request">
        <div className="ip-form-box">
          <p className="ip-form-box__kicker">Shape This Hub</p>
          <h2 className="ip-form-box__title">What kind of interview do you need help with?</h2>
          <p className="ip-form-box__sub">If there is a resource, question bank, or guide you wish existed on this page, send it here. Jose and Jocelyn use these requests to decide what templates, explainers, and LinkedIn episodes to make next.</p>

          {formSubmitted ? (
            <div className="ip-form-success">
              <h3>Request received!</h3>
              <p>Jose and Jocelyn review every submission and use them to decide what to build next. Thank you for helping shape this hub.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="ip-form-row">
                <label className="ip-form-label" htmlFor="ipRole">What role or interview are you preparing for?</label>
                <input className="ip-form-input" type="text" id="ipRole" placeholder="e.g. SWE internship at Salesforce, data analyst new grad role…" value={form.role} onChange={e => setField('role', e.target.value)} />
              </div>
              <div className="ip-form-row-2">
                <div>
                  <label className="ip-form-label" htmlFor="ipStage">Your stage</label>
                  <select className="ip-form-select" id="ipStage" value={form.stage} onChange={e => setField('stage', e.target.value)}>
                    <option value="">Select…</option>
                    <option>First-Year / Sophomore</option>
                    <option>Junior</option>
                    <option>Senior / New Grad</option>
                    <option>Recent Grad</option>
                    <option>Career Transition</option>
                  </select>
                </div>
                <div>
                  <label className="ip-form-label" htmlFor="ipType">Interview type</label>
                  <select className="ip-form-select" id="ipType" value={form.type} onChange={e => setField('type', e.target.value)}>
                    <option value="">Select…</option>
                    <option>Recruiter Screen</option>
                    <option>Behavioral</option>
                    <option>Technical</option>
                    <option>Case</option>
                    <option>One-Way / Recorded</option>
                    <option>Final Round</option>
                  </select>
                </div>
              </div>
              <div className="ip-form-row">
                <label className="ip-form-label" htmlFor="ipNeed">What do you need help with?</label>
                <textarea className="ip-form-textarea" id="ipNeed" placeholder="e.g. I keep blanking on leadership questions. I don't know how to explain my gap year. I have a case interview in 48 hours and no idea where to start…" value={form.need} onChange={e => setField('need', e.target.value)} />
              </div>
              <div className="ip-form-row">
                <label className="ip-form-label" htmlFor="ipEmail">Email (optional)</label>
                <input className="ip-form-input" type="email" id="ipEmail" placeholder="you@school.edu" value={form.email} onChange={e => setField('email', e.target.value)} />
              </div>
              {formError && <p style={{ color: 'var(--color-accent)', fontSize: '13px', marginBottom: '10px' }}>{formError}</p>}
              <button className="ip-form-btn" type="submit" disabled={formLoading}>{formLoading ? 'Sending…' : 'Send Request'}</button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="art-footer art-footer--wide">
        <span className="art-footer__copy">Jose x Jocelyn © 2026</span>
        <div className="art-footer__links">
          <Link to="/" className="art-footer__link">Home</Link>
          <Link to="/articles" className="art-footer__link">La Voz del Día</Link>
          <Link to="/career-templates" className="art-footer__link">Templates</Link>
          <Link to="/bridge-year" className="art-footer__link">Bridge Year</Link>
        </div>
      </footer>
    </ArticleLayout>
  )
}
