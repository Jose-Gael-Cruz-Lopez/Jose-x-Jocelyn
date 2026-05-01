import { Link } from 'react-router-dom'
import ArticleLayout from '../../components/ArticleLayout'
import ArticleSubscribe from '../../components/ArticleSubscribe'

export default function LateCycleInternships() {
  const handleShare = () => {
    if (navigator.share) navigator.share({ title: 'Late-Cycle Internships', url: window.location.href })
    else navigator.clipboard?.writeText(window.location.href)
  }

  return (
    <ArticleLayout title="Late-Cycle Internships: Where to Look When Everyone Says It's Over | La Voz del Día">
      <header className="art-header">
        <span className="art-header__label art-header__label--jose">Jose</span>
        <h1 className="art-header__title">Late-Cycle Internships: Where to Look When Everyone Says It's Over</h1>
        <p className="art-header__subtitle">It is April and you still don't have an internship. Here is what to do right now.</p>
        <div className="art-header__meta">
          <img src="/images/jose.jpeg" alt="Jose G. Cruz-Lopez" className="art-header__avatar" />
          <div className="art-header__author-info">
            <span className="art-header__author-name">Jose G. Cruz-Lopez</span>
            <span className="art-header__date">April 2026 · 8 min read</span>
          </div>
        </div>
      </header>

      <div className="art-engage">
        <div className="art-engage__left">
          <div className="art-engage__item">
            <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>24</span>
          </div>
          <div className="art-engage__item">
            <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>6</span>
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
        <p>Everyone told you the recruiting cycle ends in November. That the best internships were locked down months ago. That if you don't have something by now, you missed your window.</p>
        <p><strong>They're wrong.</strong></p>
        <p>I'm writing this as someone who landed opportunities well past the "deadline." Late-cycle recruiting is real, it is happening right now, and it rewards the students who refuse to stop looking.</p>

        <h2>Why late-cycle openings exist</h2>
        <p>Companies reopen roles for three main reasons:</p>
        <ul>
          <li><strong>Candidates renege on offers.</strong> It happens every year. A student accepts an offer, then backs out for a better one. That seat opens back up quietly.</li>
          <li><strong>Budget approvals come in late.</strong> Smaller teams, newer programs, and mid-size companies don't always know their intern headcount until Q1 or Q2.</li>
          <li><strong>Diversity initiatives.</strong> Some companies specifically keep positions open to ensure they're reaching underrepresented candidates.</li>
        </ul>
        <p>The opportunities are there. You just have to know where to look and how to move fast.</p>

        <h2>Where to look right now</h2>

        <h3>1. Company career pages (not LinkedIn)</h3>
        <p>Most big-company listings hit LinkedIn last. Go directly to career pages. Filter by "internship" and sort by date posted. Check weekly. Companies like Capital One, Deloitte, and smaller tech firms post late-cycle roles quietly.</p>

        <h3>2. Handshake and university job boards</h3>
        <p>Your school's career center has partnerships you probably haven't explored. Handshake is gold in the spring because local and regional companies actively recruit there when the big-name firms are done.</p>

        <h3>3. Startups and nonprofits</h3>
        <p>If you've only been looking at Fortune 500 companies, you're missing the richest late-cycle pipeline. Startups on Y Combinator's Work at a Startup, AngelList, and even LinkedIn startup filters hire on rolling timelines. The work is often more hands-on and the experience is just as valuable.</p>

        <h3>4. Cold outreach</h3>
        <p>This one requires courage, but it works. Find a team doing work you care about. Find someone on that team on LinkedIn. Send a thoughtful, specific message about why you want to contribute. Not every message will land, but the ones that do can lead to opportunities that were never posted publicly.</p>

        <h3>5. Research positions and campus programs</h3>
        <p>Professors, labs, and campus departments hire late because they operate on academic timelines, not corporate ones. If you're interested in data, engineering, or policy, your own campus might be the answer.</p>

        <h2>How to stand out this late in the game</h2>

        <h3>Move fast</h3>
        <p>When you see a late-cycle posting, apply within 24 hours. These roles fill fast because there are fewer of them. Have your resume, cover letter template, and portfolio link ready to go at all times.</p>

        <h3>Be flexible</h3>
        <p>The perfect internship at the perfect company in the perfect city might not exist right now. What matters is getting real experience. A smaller company in a different city can teach you more than sitting out the summer.</p>

        <h3>Lead with urgency and enthusiasm</h3>
        <p>Hiring managers filling late roles want candidates who can start quickly and hit the ground running. In your applications, make it clear you're available, you're ready, and you've done your research on the company.</p>

        <blockquote>
          <p>The internship search doesn't end when everyone says it does. It ends when you decide to stop looking.</p>
        </blockquote>

        <h2>What if you still don't land one?</h2>
        <p>Build your own experience. Freelance. Contribute to open-source. Start a project. Document what you learn publicly. When I didn't have a traditional internship one summer, I built things, wrote about them, and talked about what I learned. That body of work opened doors later.</p>
        <p>The worst thing you can do is nothing. The second worst thing is believing it's too late.</p>
        <p>It's April. You're still in the game.</p>
      </article>

      <ArticleSubscribe source="article_late_cycle_internships" />

      <section className="art-recs">
        <h3 className="art-recs__title">Recommended reading</h3>
        <div className="art-recs__grid">
          <Link to="/articles/coffee-chat-framework" className="art-recs__card">
            <div className="art-recs__card-tag">Jose</div>
            <h4 className="art-recs__card-title">The Coffee Chat Framework That Actually Gets Responses</h4>
          </Link>
          <Link to="/articles/first-gen-internship-playbook" className="art-recs__card">
            <div className="art-recs__card-tag">Both</div>
            <h4 className="art-recs__card-title">The Complete First-Gen Internship Playbook</h4>
          </Link>
        </div>
      </section>

    </ArticleLayout>
  )
}
