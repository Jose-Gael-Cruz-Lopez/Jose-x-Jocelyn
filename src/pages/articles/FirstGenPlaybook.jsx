import { Link } from 'react-router-dom'
import ArticleLayout from '../../components/ArticleLayout'
import ArticleSubscribe from '../../components/ArticleSubscribe'

export default function FirstGenPlaybook() {
  const handleShare = () => {
    if (navigator.share) navigator.share({ title: 'The Complete First-Gen Internship Playbook', url: window.location.href })
    else navigator.clipboard?.writeText(window.location.href)
  }

  return (
    <ArticleLayout title="The Complete First-Gen Internship Playbook | La Voz del Día">
      <header className="art-header">
        <span className="art-header__label art-header__label--both">Both</span>
        <h1 className="art-header__title">The Complete First-Gen Internship Playbook</h1>
        <p className="art-header__subtitle">From discovery to signed offer, with no sugar-coating. Everything we learned.</p>
        <div className="art-header__meta art-header__meta--both">
          <div className="art-header__avatars" role="group" aria-label="Authors: Jose G. Cruz-Lopez and Jocelyn Vazquez">
            <img src="/images/jose.jpeg" alt="" className="art-header__avatar art-header__avatar--stack" width="44" height="44" decoding="async" />
            <img src="/images/jocelyn.jpeg" alt="" className="art-header__avatar art-header__avatar--stack" width="44" height="44" decoding="async" />
          </div>
          <div className="art-header__author-info">
            <span className="art-header__author-name">Jose G. Cruz-Lopez &amp; Jocelyn Vazquez</span>
            <span className="art-header__date">March 2026 · 14 min read</span>
          </div>
        </div>
      </header>

      <div className="art-engage">
        <div className="art-engage__left">
          <div className="art-engage__item">
            <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>47</span>
          </div>
          <div className="art-engage__item">
            <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>12</span>
          </div>
        </div>
        <div className="art-engage__right">
          <button className="art-engage__share" onClick={handleShare}>
            <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </button>
        </div>
      </div>

      <article className="art-body">
        <p>We wrote this together because the internship search looks different depending on where you're standing. Jose is in it right now. Jocelyn has been through it and came out the other side. Between us, we've applied to hundreds of roles, gotten rejected from most of them, and still ended up exactly where we needed to be.</p>
        <p>This is the playbook we wish someone had handed us. No motivational fluff. Just the steps.</p>

        <h2>Phase 1: Discovery (months 1 through 2)</h2>

        <h3>Know what you're looking for</h3>
        <p>Before you apply anywhere, answer three questions:</p>
        <ol>
          <li>What skills do you want to build this summer?</li>
          <li>What industry or domain interests you most?</li>
          <li>What is your minimum bar for compensation and location?</li>
        </ol>
        <p>You don't need perfect answers. You need a filter. Without one, you'll apply to everything and prepare for nothing.</p>

        <h3>Build your tracker</h3>
        <p>Create a spreadsheet with these columns: Company, Role, Date Applied, Status, Contact, Next Step. Update it every time you apply. This is your command center.</p>

        <h3>Where to find opportunities</h3>
        <ul>
          <li>Handshake and your university career portal</li>
          <li>Company career pages directly</li>
          <li>LinkedIn Jobs (set alerts)</li>
          <li>GitHub repos that aggregate internship listings</li>
          <li>Professional organizations in your field (SHPE, ColorStack, NSBE, etc.)</li>
        </ul>

        <h2>Phase 2: Preparation (months 2 through 3)</h2>

        <h3>Resume</h3>
        <p>One page. Always one page. Lead with education if you're a student. Use action verbs and quantify impact wherever possible. "Increased event attendance by 40%" beats "Helped plan events." Have at least two people review it before submitting anywhere.</p>

        <h3>LinkedIn</h3>
        <p>Your LinkedIn profile is your second resume. Professional headshot, clear headline, an "About" section that tells your story. Connect with recruiters at companies you're targeting. Engage with content in your field.</p>

        <h3>Technical preparation</h3>
        <p>If your field requires technical interviews, start practicing early. LeetCode, HackerRank, or NeetCode for software engineering. Case study practice for consulting. SQL and Excel practice for data and analytics. Consistency beats intensity.</p>

        <h3>Behavioral preparation</h3>
        <p>Learn the STAR method (Situation, Task, Action, Result). Prepare 5 to 7 stories from your experience that demonstrate leadership, problem-solving, teamwork, and resilience. Practice saying them out loud until they feel natural.</p>

        <h2>Phase 3: Application sprint (months 3 through 5)</h2>
        <p>Set a weekly target. We recommend 15 to 25 applications per week during peak season. Quality still matters, but volume creates options.</p>

        <div className="art-callout">
          <p><strong>Jose's take:</strong> I applied to over 200 roles my first cycle. I heard back from maybe 20. Got interviews at 8. Landed 2 offers. Those numbers are normal. Don't let the silence break your rhythm.</p>
          <p><strong>Jocelyn's take:</strong> When I was applying, I kept a "rejection wall" in my notes app. Every no was proof I was in the game. By the end, those rejections were the foundation of the story I told in interviews.</p>
        </div>

        <h2>Phase 4: Interviews (ongoing)</h2>

        <h3>Before the interview</h3>
        <ul>
          <li>Research the company's recent news, products, and values.</li>
          <li>Prepare 3 questions to ask your interviewer that show genuine curiosity.</li>
          <li>Test your tech setup if it's virtual. Camera, mic, lighting, background.</li>
        </ul>

        <h3>During the interview</h3>
        <ul>
          <li>Take a breath before answering. Silence is not a weakness.</li>
          <li>If you don't know, say so. Then walk through how you'd figure it out.</li>
          <li>Be specific. Replace "I worked on a team project" with "I led a 4-person team to build a dashboard that tracked student engagement across 3 campus organizations."</li>
        </ul>

        <h3>After the interview</h3>
        <p>Send a thank-you email within 24 hours. Reference something specific from the conversation. Keep it short and genuine.</p>

        <h2>Phase 5: Offer negotiation</h2>
        <p>Yes, you can negotiate an internship offer. Not always on pay, but on start date, housing stipend, team placement, or project scope. The worst they can say is no, and they will not rescind the offer for asking.</p>

        <blockquote>
          <p>Every "no" you collect is one step closer to the "yes" that changes everything. Keep applying.</p>
        </blockquote>

        <p>The complete journey from first application to signed offer is messy, nonlinear, and exhausting. But it is also completely doable. We are proof. And soon, you will be too.</p>
      </article>

      <ArticleSubscribe source="article_first_gen_playbook" />

      <section className="art-recs">
        <h3 className="art-recs__title">Recommended reading</h3>
        <div className="art-recs__grid">
          <Link to="/articles/late-cycle-internships" className="art-recs__card">
            <div className="art-recs__card-tag">Jose</div>
            <h4 className="art-recs__card-title">Late-Cycle Internships: Where to Look When Everyone Says It's Over</h4>
          </Link>
          <Link to="/articles/rejection" className="art-recs__card">
            <div className="art-recs__card-tag">Both</div>
            <h4 className="art-recs__card-title">Rejection Doesn't Mean You Did It Wrong</h4>
          </Link>
        </div>
      </section>

      <footer className="art-footer--wide" style={{ maxWidth: 680 }}>
        <span className="art-footer__copy">Jose x Jocelyn © 2026</span>
        <div className="art-footer__links">
          <Link to="/" className="art-footer__link">Home</Link>
          <Link to="/#contact" className="art-footer__link">Contact</Link>
        </div>
      </footer>
    </ArticleLayout>
  )
}
