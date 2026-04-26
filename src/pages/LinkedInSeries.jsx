import { useState } from 'react'
import { Link } from 'react-router-dom'
import ArticleLayout from '../components/ArticleLayout'
import { supabase } from '../lib/supabase'

const EPISODES = [
  { num:'01', lens:'both', topics:'internships rejection', lensLabel:'Both', tags:['Internships','Rejection'], title:'Still Recruiting in April', summary:'Jose covers where to find late-cycle roles and how to move fast when everyone says it\'s too late. Jocelyn explains how hiring teams view late applicants and how to frame "still searching" in interviews.', why:'Late-cycle recruiting is where most first-gen students lose momentum - this episode reframes it as a real strategy, not a fallback.', posts:[{type:'Announcement',title:'Kicking off Ep. 01 - Still Recruiting in April',preview:'Series launch post introducing the episode premise and what\'s coming from both lenses.',author:'both',status:'Coming Soon'},{type:'Student Lens',title:'Where the late-cycle roles actually are (and how to find them fast)',preview:'The exact search process Jose uses - company career pages, Handshake filters, outreach-first applications, and why LinkedIn is the last place to look.',author:'jose',status:'Coming Soon'},{type:'Post-Grad Lens',title:'How hiring teams actually see late applicants',preview:'What Jocelyn learned being on the inside - reneges open seats, budget comes in late, and late applicants can actually move faster than early ones.',author:'jocelyn',status:'Coming Soon'},{type:'Recap & CTA',title:'Ep. 01 Recap - The late-cycle playbook in one post',preview:'Full episode summary, key takeaways from both lenses, and links to the related article and application tracker template.',author:'both',status:'Coming Soon'}]},
  { num:'02', lens:'jose', topics:'internships', lensLabel:'Jose', tags:['Internships'], title:'What Nobody Tells You About Internship Apps', summary:'The timeline myths most students believe, when early-ID programs actually close (much earlier than you think), and how most students apply so late they never had a real shot.', why:'Most students don\'t lose the recruiting game at the interview - they lose it before they even apply. This episode fixes that.', posts:[{type:'Student Lens',title:'The internship recruiting timeline nobody shows you',preview:'When early-ID programs open, when they actually close, and why applying in February for a summer internship is already too late for most top firms.',author:'jose',status:'Coming Soon'},{type:'Student Lens',title:'How most students apply wrong (and how to fix it)',preview:'The real habits separating students who land roles from those who wonder what went wrong - tracking, follow-up cadence, and targeting over volume.',author:'jose',status:'Coming Soon'},{type:'Carousel',title:'The recruiting timeline, slide by slide',preview:'A visual breakdown of the full internship recruiting calendar - when to research, when to apply, when to follow up, and when it\'s actually over.',author:'jose',status:'Coming Soon'}]},
  { num:'03', lens:'jocelyn', topics:'offers on-the-job', lensLabel:'Jocelyn', tags:['Offers','On the Job'], title:'How Return Offers Actually Work', summary:'What managers track all summer, the unspoken criteria they use to make return offer decisions, and how to position yourself for a yes before the summer ends.', why:'Most interns try to impress during their last two weeks. The ones who get return offers started on day one.', posts:[{type:'Post-Grad Lens',title:'What your manager is actually tracking this summer',preview:'The real criteria behind return offer decisions - visibility, initiative, relationships, communication patterns, and how you handle uncertainty.',author:'jocelyn',status:'Coming Soon'},{type:'Post-Grad Lens',title:'The unspoken criteria nobody puts in the intern handbook',preview:'Culture fit signals, how you navigate ambiguity, whether you ask the right questions - the soft factors that often matter more than project output.',author:'jocelyn',status:'Coming Soon'},{type:'Carousel',title:'The return offer checklist',preview:'A week-by-week guide for the first 10 weeks of an internship, built around the moments that matter most for getting a return offer.',author:'jocelyn',status:'Coming Soon'}]},
  { num:'04', lens:'both', topics:'offers', lensLabel:'Both', tags:['Offers'], title:'Reading Your First Full-Time Offer', summary:'Jose breaks down what\'s confusing about comp, titles, and benefits when you\'ve never seen a six-figure offer before. Jocelyn walks through exactly how she broke down her first full-time offer - and what she negotiated.', why:'First-gen students often accept the first number they see. This episode gives you the vocabulary and framework to actually read what you\'re signing.', posts:[{type:'Student Lens',title:'I have an offer. Now what does any of this mean?',preview:'Base, bonus, equity, vesting, benefits, 401k match - a plain-language breakdown for students who\'ve never seen an offer letter before.',author:'jose',status:'Coming Soon'},{type:'Post-Grad Lens',title:'How I broke down my first offer - and what I pushed back on',preview:'Jocelyn\'s real story: the number, the confusion, the negotiation conversation, and what she wishes she had known when the offer hit her inbox.',author:'jocelyn',status:'Coming Soon'},{type:'Carousel',title:'The anatomy of a full-time offer',preview:'Every line item explained: base salary, signing bonus, equity (RSUs vs options), benefits, PTO, and what\'s actually negotiable.',author:'both',status:'Coming Soon'}]},
  { num:'05', lens:'jose', topics:'internships', lensLabel:'Jose', tags:['Internships'], title:'Cold Outreach That Gets Replies', summary:'Exact message frameworks, subject lines that work, follow-up timing, and everything you should not say in a cold LinkedIn DM or outreach email.', why:'Cold outreach is the most underused lever in student recruiting. Most students do it once, hear nothing, and stop. This episode fixes the execution.', posts:[{type:'Student Lens',title:'The cold DM that actually gets a response',preview:'Three message frameworks - one for recruiters, one for engineers, one for alumni - and the exact structure that makes each one work.',author:'jose',status:'Coming Soon'},{type:'Student Lens',title:'The follow-up sequence (without sounding desperate)',preview:'Day 1, Day 7, Day 14 - the exact timing and phrasing for following up on outreach that hasn\'t gotten a response yet.',author:'jose',status:'Coming Soon'},{type:'Carousel',title:'What not to say in a cold DM (and why it kills your shot)',preview:'Real examples of cold outreach that doesn\'t work - too long, too generic, too desperate - and the rewritten versions that actually convert.',author:'jose',status:'Coming Soon'}]},
  { num:'06', lens:'jocelyn', topics:'on-the-job', lensLabel:'Jocelyn', tags:['On the Job'], title:'Your First 90 Days in a Tech Role', summary:'How to onboard effectively, build relationships without being annoying, find your footing fast, and make your work visible in a corporate environment.', why:'The first 90 days set the tone for your entire first year. Most people coast through them. The ones who don\'t are the ones who get promoted.', posts:[{type:'Post-Grad Lens',title:'The first 30 days: your only job is to listen',preview:'Why the first month isn\'t about impressing anyone - it\'s about understanding the team, the culture, and what actually matters here.',author:'jocelyn',status:'Coming Soon'},{type:'Post-Grad Lens',title:'How to build relationships at work without being weird about it',preview:'First-gen-specific advice on navigating office dynamics - who to connect with, how often, and why being too eager can backfire just as much as being too quiet.',author:'jocelyn',status:'Coming Soon'},{type:'Carousel',title:'The 30-60-90 framework for your first role',preview:'Three phases, three mindsets, three sets of goals - a visual guide to structuring your first three months so you actually find your footing.',author:'jocelyn',status:'Coming Soon'}]},
  { num:'07', lens:'both', topics:'rejection', lensLabel:'Both', tags:['Rejection'], title:'How to Handle Rejection Without Spiraling', summary:'Jose shares the real-time feelings of rejection and what he does next. Jocelyn breaks down what rejection actually tells you - and what it doesn\'t - and how she reframes it.', why:'Rejection is not a signal you did it wrong. But nobody tells you that in the moment. This episode is the conversation we wish we had when it happened to us.', posts:[{type:'Student Lens',title:'I just got rejected. Here\'s what I actually did next.',preview:'A real account of what rejection feels like in real time, the temptation to spiral, and the small actions that helped Jose keep moving forward.',author:'jose',status:'Coming Soon'},{type:'Post-Grad Lens',title:'What rejection is actually telling you (it\'s not what you think)',preview:'Three real stories of final-round rejections, what the actual reasons were, and why none of them were about being inadequate.',author:'jocelyn',status:'Coming Soon'},{type:'Recap',title:'Ep. 07 Recap - Rejection doesn\'t mean you did it wrong',preview:'A grounded, direct recap of both perspectives - with a link to the full article and a reminder that the process is longer than any single outcome.',author:'both',status:'Coming Soon'}]},
  { num:'08', lens:'both', topics:'internships', lensLabel:'Both', tags:['Internships'], title:'Low GPA, First-Gen, No Networks - Now What?', summary:'An honest conversation about structural disadvantages and what actually moves the needle when you don\'t have the traditional markers of access.', why:'A lot of advice is written for people who are one good resume away from success. This episode is for everyone else.', posts:[{type:'Student Lens',title:'What I actually did when my GPA wasn\'t competitive',preview:'The moves Jose made when the standard path felt closed - alternative entry points, skills-forward positioning, and the companies that genuinely don\'t filter by GPA.',author:'jose',status:'Coming Soon'},{type:'Post-Grad Lens',title:'What the hiring team actually sees when there\'s no network',preview:'Jocelyn on being first-gen in a field full of legacy connections - what she substituted for networks, and what she\'d tell herself to do differently.',author:'jocelyn',status:'Coming Soon'},{type:'Carousel',title:'The moves that work when you don\'t have traditional access',preview:'A practical slide deck on the levers that actually shift outcomes for first-gen students - fellowships, alternate pipelines, community programs, and visibility plays.',author:'both',status:'Coming Soon'}]},
  { num:'09', lens:'both', topics:'internships offers on-the-job', lensLabel:'Both', tags:['Internships','Offers','On the Job'], title:'Internship to Full-Time: The Handoff', summary:'The relay in one episode - Jose on landing the internship, Jocelyn on turning it into a career. The full arc from first application to full-time offer, told from both ends.', why:'The whole point of this series is in this episode. The handoff is the thing we built this platform to make visible.', posts:[{type:'Student Lens',title:'How I land internships - the real process, not the polished version',preview:'Jose\'s actual system: where he looks, how he tracks, how he reaches out, what happens when things go wrong, and what a "yes" actually feels like.',author:'jose',status:'Coming Soon'},{type:'Post-Grad Lens',title:'How I turned my internship into a full-time role',preview:'Jocelyn on the specific moves she made during her internship - the relationships she built, the visibility she created, and the conversation she had to ask for the offer.',author:'jocelyn',status:'Coming Soon'},{type:'Recap',title:'The full arc - from first app to full-time offer',preview:'Both perspectives woven together into one complete narrative. The relay baton, passed from Jose\'s side of the bridge to Jocelyn\'s.',author:'both',status:'Coming Soon'}]},
  { num:'10', lens:'both', topics:'internships offers rejection on-the-job', lensLabel:'Both', tags:['Internships','Offers','Rejection','On the Job'], title:'What We Wish We Knew Earlier', summary:'Personal, storytelling-forward, designed to go viral. Jose and Jocelyn each share the one thing they wish someone had told them before they started - and why it matters more than any tactic.', why:'This is the episode people share. It\'s not about strategy - it\'s about truth.', posts:[{type:'Student Lens',title:'What I wish I knew before I started applying',preview:'Jose\'s most personal post in the series - the things no one told him, the assumptions he made that cost him time, and what he\'d go back and change.',author:'jose',status:'Coming Soon'},{type:'Post-Grad Lens',title:'What I wish I knew before I graduated',preview:'Jocelyn on the gap between college and the real world - the things she had to learn the hard way that nobody warned her about and that she now tells every first-gen student she mentors.',author:'jocelyn',status:'Coming Soon'},{type:'Recap & CTA',title:'Ep. 10 Recap - The full series in one post',preview:'A look back at all 10 episodes, the most important lessons from each, and a call to action for the next cohort of first-gen students ready to start their journey.',author:'both',status:'Coming Soon'}]},
]

const FILTERS = [
  { f:'all', label:'All Posts' },
  { f:'jose', label:"Jose's Lens" },
  { f:'jocelyn', label:"Jocelyn's Lens" },
  { f:'both', label:'Both Perspectives' },
  { f:'internships', label:'Internships' },
  { f:'offers', label:'Offers' },
  { f:'rejection', label:'Rejection' },
  { f:'on-the-job', label:'On the Job' },
]

const LENS_FILTERS = new Set(['all','jose','jocelyn','both'])
const TOPIC_FILTERS = new Set(['internships','offers','rejection','on-the-job'])

function lensClass(a) {
  return a === 'jose' ? 'ls-ep__lens--jose' : a === 'jocelyn' ? 'ls-ep__lens--jocelyn' : 'ls-ep__lens--both'
}
function authorClass(a) {
  return a === 'jose' ? 'ls-post__author--jose' : a === 'jocelyn' ? 'ls-post__author--jocelyn' : 'ls-post__author--both'
}

const PAGE_CSS = `
  html, body { background: var(--color-cream); }
  :root { --linkedin-brand-blue: #0a66c2; }
  .ls-linkedin { color: var(--linkedin-brand-blue); }
  .ls-hero { max-width:1040px;margin:0 auto;padding:120px clamp(20px,5vw,56px) 48px; }
  .ls-hero__kicker { font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--color-muted);margin-bottom:18px; }
  .ls-hero__title { font-family:var(--font-display);font-size:clamp(36px,6.5vw,68px);font-weight:700;line-height:1.06;color:var(--color-dark);margin-bottom:20px; }
  .ls-hero__title em { font-style:normal;color:var(--color-accent); }
  .ls-hero__sub { font-size:clamp(15px,2vw,18px);color:var(--color-muted);line-height:1.7;max-width:640px;margin-bottom:40px; }
  .ls-hero__sub strong { color:var(--color-dark);font-weight:600; }
  .ls-stats { display:flex;flex-wrap:wrap;gap:0;border:1.5px solid rgba(0,0,0,.1);border-radius:12px;overflow:hidden;max-width:640px;background:var(--color-white); }
  .ls-stat { flex:1;min-width:130px;padding:18px 20px;border-right:1px solid rgba(0,0,0,.08); }
  .ls-stat:last-child { border-right:none; }
  .ls-stat__num { font-family:var(--font-display);font-size:22px;font-weight:700;color:var(--color-dark);line-height:1;margin-bottom:4px; }
  .ls-stat__label { font-size:12px;color:var(--color-muted);line-height:1.4; }
  .ls-controls { max-width:1040px;margin:0 auto;padding:0 clamp(20px,5vw,56px) 40px; }
  .ls-filters { display:flex;flex-wrap:wrap;gap:8px; }
  .ls-filter { padding:13px 18px;border-radius:999px;font-family:var(--font-body);font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid rgba(0,0,0,.12);background:var(--color-white);color:var(--color-muted);transition:background .2s,color .2s,border-color .2s; }
  .ls-filter:hover { color:var(--color-dark);border-color:rgba(0,0,0,.25); }
  .ls-filter--active { background:var(--color-dark);color:var(--color-cream);border-color:var(--color-dark); }
  .ls-filter:focus-visible { outline: 2px solid var(--color-dark); outline-offset: 2px; border-radius: 999px; }
  .ls-divider { max-width:1040px;margin:0 auto 48px;padding:0 clamp(20px,5vw,56px); }
  .ls-divider hr { border:none;border-top:1px solid rgba(0,0,0,.08); }
  .ls-episodes { max-width:1040px;margin:0 auto;padding:0 clamp(20px,5vw,56px) 80px;display:flex;flex-direction:column;gap:56px; }
  .ls-ep__head { display:flex;align-items:flex-start;gap:28px;margin-bottom:24px; }
  .ls-ep__num { font-family:var(--font-display);font-size:clamp(40px,5vw,56px);font-weight:700;line-height:1;color:rgba(0,0,0,.08);flex-shrink:0;min-width:72px; }
  .ls-ep__info { flex:1;min-width:0; }
  .ls-ep__badges { display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap; }
  .ls-ep__lens { font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 10px;border-radius:4px;color:var(--color-white); }
  .ls-ep__lens--jose { background:var(--color-teal); }
  .ls-ep__lens--jocelyn { background:var(--color-accent); }
  .ls-ep__lens--both { background:var(--color-navy); }
  .ls-ep__tag { font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--color-muted);padding:3px 10px;border-radius:4px;background:rgba(0,0,0,.06); }
  .ls-ep__title { font-family:var(--font-display);font-size:clamp(20px,2.8vw,28px);font-weight:600;color:var(--color-dark);line-height:1.25;margin-bottom:10px; }
  .ls-ep__summary { font-size:15px;color:var(--color-muted);line-height:1.6;max-width:640px;margin-bottom:8px; }
  .ls-ep__why { font-size:13px;color:var(--color-teal);font-weight:500; }
  .ls-ep__why::before { content:"Why it matters: ";font-weight:700; }
  .ls-ep__posts { display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px; }
  .ls-post { background:var(--color-white);border:1px solid rgba(0,0,0,.08);border-radius:12px;padding:20px;display:flex;flex-direction:column;gap:10px; }
  .ls-post--featured { border-color:var(--color-gold);background:rgba(232,168,56,.04); }
  .ls-post__type { font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--color-muted); }
  .ls-post__title { font-family:var(--font-display);font-size:14px;font-weight:600;color:var(--color-dark);line-height:1.4; }
  .ls-post__preview { font-size:13px;color:var(--color-muted);line-height:1.55;flex:1; }
  .ls-post__footer { display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:auto; }
  .ls-post__author { font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:2px 8px;border-radius:3px;color:var(--color-white); }
  .ls-post__author--jose { background:var(--color-teal); }
  .ls-post__author--jocelyn { background:var(--color-accent); }
  .ls-post__author--both { background:var(--color-navy); }
  .ls-post__status { font-size:11px;font-weight:600;color:var(--color-muted);padding:2px 8px;border-radius:3px;background:rgba(0,0,0,.05); }
  .ls-how { background:var(--color-navy);padding:clamp(48px,7vw,88px) clamp(20px,5vw,56px); }
  .ls-how__inner { max-width:1040px;margin:0 auto; }
  .ls-how__kicker { font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--color-gold);margin-bottom:16px; }
  .ls-how__title { font-family:var(--font-display);font-size:clamp(24px,3.5vw,36px);font-weight:700;color:var(--color-cream);margin-bottom:40px; }
  .ls-how__grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px; }
  .ls-how__item-icon { font-family:var(--font-display);font-size:28px;font-weight:700;color:var(--color-gold);margin-bottom:10px;line-height:1; }
  .ls-how__item-title { font-family:var(--font-display);font-size:16px;font-weight:600;color:var(--color-cream);margin-bottom:6px; }
  .ls-how__item-desc { font-size:14px;color:rgba(242,228,206,.65);line-height:1.6; }
  .ls-form-wrap { max-width:1040px;margin:0 auto;padding:clamp(56px,8vw,96px) clamp(20px,5vw,56px); }
  .ls-form-box { background:var(--color-white);border-radius:16px;padding:clamp(32px,4vw,56px);border:1px solid rgba(0,0,0,.07);max-width:640px; }
  .ls-form-box__kicker { font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--color-muted);margin-bottom:12px; }
  .ls-form-box__title { font-family:var(--font-display);font-size:clamp(22px,3vw,30px);font-weight:700;color:var(--color-dark);margin-bottom:8px; }
  .ls-form-box__sub { font-size:15px;color:var(--color-muted);margin-bottom:28px;line-height:1.6; }
  .ls-form-row { margin-bottom:16px; }
  .ls-form-label { display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--color-muted);margin-bottom:6px; }
  .ls-form-input,.ls-form-select,.ls-form-textarea { width:100%;font-family:var(--font-body);font-size:15px;padding:12px 14px;border:1.5px solid rgba(0,0,0,.12);border-radius:8px;background:var(--color-white);color:var(--color-dark);outline:none;transition:border-color .2s; }
  .ls-form-textarea { min-height:90px;resize:vertical;line-height:1.55; }
  .ls-form-input:focus,.ls-form-select:focus,.ls-form-textarea:focus { border-color:var(--color-gold); }
  .ls-form-btn { margin-top:6px;padding:13px 28px;background:var(--color-dark);color:var(--color-cream);border:none;border-radius:8px;font-family:var(--font-display);font-size:14px;font-weight:600;cursor:pointer;transition:background .2s,transform .2s; }
  .ls-form-btn:hover { background:var(--color-accent);transform:translateY(-1px); }
  .ls-no-results { text-align:center;padding:64px 0;color:var(--color-muted); }
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

export default function LinkedInSeries() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [topic, setTopic] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!topic.trim()) { setFormError('Please enter a topic or question.'); return }
    setFormLoading(true)
    setFormError('')
    const { error } = await supabase.from('linkedin_episode_requests').insert({
      topic: topic.trim(),
      email: email.trim() || null,
      category: category || null,
    })
    setFormLoading(false)
    if (error) { setFormError('Something went wrong. Please try again.') }
    else { setFormSubmitted(true) }
  }

  const visibleEps = EPISODES.filter(ep => {
    if (activeFilter === 'all') return true
    if (LENS_FILTERS.has(activeFilter)) return ep.lens === activeFilter
    if (TOPIC_FILTERS.has(activeFilter)) return ep.topics.includes(activeFilter)
    return true
  })

  return (
    <ArticleLayout title="The LinkedIn Series">
      <style>{PAGE_CSS}</style>

      <header className="ls-hero">
        <p className="ls-hero__kicker">From Campus to Career · Content Series</p>
        <h1 className="ls-hero__title">The <span className="ls-linkedin">LinkedIn</span> <em>Series</em></h1>
        <p className="ls-hero__sub">One topic. Two perspectives. Real-time notes from both sides of the bridge.<br /><br /><strong>Jose</strong> covers the student lens - internships, outreach, applications, rejection, and figuring things out in real time. <strong>Jocelyn</strong> covers the post-grad lens - interviews, offers, onboarding, and early-career growth. Every episode lives on LinkedIn first, then gets archived here.</p>
        <div className="ls-stats">
          <div className="ls-stat"><div className="ls-stat__num">10</div><div className="ls-stat__label">Episodes planned</div></div>
          <div className="ls-stat"><div className="ls-stat__num">0</div><div className="ls-stat__label">Posts published</div></div>
          <div className="ls-stat"><div className="ls-stat__num">2</div><div className="ls-stat__label">Lenses</div></div>
          <div className="ls-stat"><div className="ls-stat__num">Weekly</div><div className="ls-stat__label">Updated</div></div>
        </div>
      </header>

      <div className="ls-controls">
        <div className="ls-filters" role="group" aria-label="Filter episodes">
          {FILTERS.map(({ f, label }) => (
            <button key={f} className={`ls-filter${activeFilter === f ? ' ls-filter--active' : ''}`} onClick={() => setActiveFilter(f)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="ls-divider"><hr /></div>

      <div className="ls-episodes">
        {visibleEps.length === 0
          ? <div className="ls-no-results" aria-live="polite"><p>No episodes match that filter.</p></div>
          : visibleEps.map(ep => (
            <div key={ep.num} className="ls-ep">
              <div className="ls-ep__head">
                <div className="ls-ep__num">{ep.num}</div>
                <div className="ls-ep__info">
                  <div className="ls-ep__badges">
                    <span className={`ls-ep__lens ${lensClass(ep.lens)}`}>{ep.lensLabel}</span>
                    {ep.tags.map(t => <span key={t} className="ls-ep__tag">{t}</span>)}
                  </div>
                  <h2 className="ls-ep__title">{ep.title}</h2>
                  <p className="ls-ep__summary">{ep.summary}</p>
                  <p className="ls-ep__why">{ep.why}</p>
                </div>
              </div>
              <div className="ls-ep__posts">
                {ep.posts.map((p, i) => (
                  <div key={i} className={`ls-post${i === 0 ? ' ls-post--featured' : ''}`}>
                    <div className="ls-post__type">{p.type}</div>
                    <div className="ls-post__title">{p.title}</div>
                    <div className="ls-post__preview">{p.preview}</div>
                    <div className="ls-post__footer">
                      <span className={`ls-post__author ${authorClass(p.author)}`}>{p.author === 'both' ? 'Both' : p.author === 'jose' ? 'Jose' : 'Jocelyn'}</span>
                      <span className="ls-post__status">{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        }
      </div>

      <section className="ls-how">
        <div className="ls-how__inner">
          <p className="ls-how__kicker">The Ecosystem</p>
          <h2 className="ls-how__title">How this series works</h2>
          <div className="ls-how__grid">
            {[['01','LinkedIn Series','Where content is published in real time. Follow Jose and Jocelyn to get each post as it drops.'],['02','This Archive','Every post organized by episode, labeled, searchable, and connected to related resources. Your home base.'],['03','Career Templates','Every episode connects to a copy-paste tool you can use immediately - outreach scripts, trackers, planners.'],['04','La Voz del Día','The deeper breakdown of each episode - longer analysis, more context, and the nuance that doesn\'t fit in a LinkedIn post.']].map(([n,t,d]) => (
              <div key={n} className="ls-how__item">
                <div className="ls-how__item-icon">{n}</div>
                <div className="ls-how__item-title">{n === '01' ? <><span className="ls-linkedin">LinkedIn</span> Series</> : t}</div>
                <div className="ls-how__item-desc">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ls-form-wrap">
        <div className="ls-form-box">
          <p className="ls-form-box__kicker">Shape the Series</p>
          <h2 className="ls-form-box__title">What do you want us to cover?</h2>
          <p className="ls-form-box__sub">We source episode topics directly from the people reading this. Tell us where you're stuck and we'll build an episode around it.</p>
          {formSubmitted ? (
            <div style={{ padding: '32px 0', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(58,125,107,.1)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 14px' }}>✓</div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--color-dark)', marginBottom: 6 }}>Topic submitted!</p>
              <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>Thanks — we'll consider it for an upcoming episode.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="ls-form-row"><label className="ls-form-label" htmlFor="topicField">Your topic or question</label><textarea className="ls-form-textarea" id="topicField" placeholder="e.g. How do I handle a gap in my resume? What do I do after I get ghosted by a recruiter?" value={topic} onChange={e => setTopic(e.target.value)} /></div>
              <div className="ls-form-row"><label className="ls-form-label" htmlFor="emailField">Your email</label><input className="ls-form-input" type="email" id="emailField" placeholder="you@school.edu" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="ls-form-row">
                <label className="ls-form-label" htmlFor="topicCat">Topic area (optional)</label>
                <select className="ls-form-select" id="topicCat" value={category} onChange={e => setCategory(e.target.value)}><option value="">Select a category…</option><option>Internship search</option><option>Offers &amp; negotiation</option><option>Recruiting &amp; outreach</option><option>Workplace &amp; onboarding</option><option>Mindset &amp; rejection</option></select>
              </div>
              {formError && <p role="alert" style={{ color: 'var(--color-accent)', fontSize: '13px', marginBottom: '10px' }}>{formError}</p>}
              <button className="ls-form-btn" type="submit" disabled={formLoading}>{formLoading ? 'Submitting…' : 'Submit Topic'}</button>
            </form>
          )}
        </div>
      </div>

      <footer className="art-footer" style={{ maxWidth: '1040px' }}>
        <span className="art-footer__copy">Jose x Jocelyn &copy; 2026</span>
        <div className="art-footer__links">
          <Link to="/" className="art-footer__link">Home</Link>
          <Link to="/articles" className="art-footer__link">La Voz del Día</Link>
          <Link to="/career-templates" className="art-footer__link">Templates</Link>
        </div>
      </footer>
    </ArticleLayout>
  )
}
