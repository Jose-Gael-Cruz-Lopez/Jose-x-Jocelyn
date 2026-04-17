import { Link } from 'react-router-dom'
import ArticleLayout from '../../components/ArticleLayout'
import ArticleSubscribe from '../../components/ArticleSubscribe'

export default function NegotiateSalary() {
  const handleShare = () => {
    if (navigator.share) navigator.share({ title: 'How to Negotiate When You\'ve Never Seen a Six-Figure Salary', url: window.location.href })
    else navigator.clipboard?.writeText(window.location.href)
  }

  return (
    <ArticleLayout title="How to Negotiate When You've Never Seen a Six-Figure Salary | La Voz del Día">
      <header className="art-header">
        <span className="art-header__label art-header__label--jocelyn">Jocelyn</span>
        <h1 className="art-header__title">How to Negotiate When You've Never Seen a Six-Figure Salary</h1>
        <p className="art-header__subtitle">Compensation is benefits, equity, signing bonuses, and leverage you didn't know you had.</p>
        <div className="art-header__meta">
          <img src="/images/jocelyn.jpeg" alt="Jocelyn Vazquez" className="art-header__avatar" />
          <div className="art-header__author-info">
            <span className="art-header__author-name">Jocelyn Vazquez</span>
            <span className="art-header__date">February 2026 · 9 min read</span>
          </div>
        </div>
      </header>

      <div className="art-engage">
        <div className="art-engage__left">
          <div className="art-engage__item">
            <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>52</span>
          </div>
          <div className="art-engage__item">
            <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>15</span>
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
        <p>When I got my first real offer letter, I stared at the number and had no idea if it was good, bad, or average. No one in my family had ever worked in tech. No one had ever negotiated a salary. The idea of asking for more money felt ungrateful, risky, and terrifying.</p>
        <p>I accepted the first number.</p>
        <p>That decision cost me thousands over the next two years. I'm writing this so you don't make the same mistake.</p>

        <h2>First: understand what compensation actually means</h2>
        <p>Your salary is one piece of the puzzle. Total compensation includes:</p>
        <ul>
          <li><strong>Base salary:</strong> The number on your paycheck every two weeks.</li>
          <li><strong>Signing bonus:</strong> One-time cash paid at the start (often negotiable).</li>
          <li><strong>Equity/RSUs:</strong> Stock that vests over time. Can be worth more than your salary at some companies.</li>
          <li><strong>Annual bonus:</strong> Performance-based payout, usually a percentage of your base.</li>
          <li><strong>Benefits:</strong> Health insurance, 401(k) match, PTO, remote work flexibility, learning stipends.</li>
        </ul>
        <p>When you negotiate, you're not just negotiating one number. You're negotiating a package.</p>

        <h2>How to research your market value</h2>

        <h3>Use data, not feelings</h3>
        <p>Before any negotiation, know the range for your role, level, and location. Use these resources:</p>
        <ul>
          <li><strong>Levels.fyi</strong> for tech compensation data broken down by company, level, and location.</li>
          <li><strong>Glassdoor</strong> for broader salary ranges.</li>
          <li><strong>Blind</strong> (anonymous professional network) for real reported offers.</li>
          <li><strong>Your own network.</strong> Ask peers who recently went through the same process. Normalize sharing salary data.</li>
        </ul>

        <h2>The negotiation conversation</h2>

        <h3>When they give you the number</h3>
        <p>Do not respond immediately. Say: "Thank you so much for this offer. I'm really excited about the opportunity. I'd like to take a couple of days to review the full package. Can I get back to you by [date]?"</p>
        <p>This is not stalling. This is standard. Every recruiter expects it.</p>

        <h3>The counter</h3>
        <p>When you call back, frame it around value, not need:</p>
        <div className="art-callout">
          <p>"I've done some research on compensation for this role at similar companies, and based on my experience and the scope of this position, I was hoping we could explore a base salary closer to [X]. I'm also curious about flexibility on [signing bonus / equity / start date]."</p>
        </div>

        <p>Key principles:</p>
        <ul>
          <li><strong>Use "we" language.</strong> "Can we explore" feels collaborative, not combative.</li>
          <li><strong>Anchor high, but within reason.</strong> Aim for 10 to 15% above their offer. If they offered $85k, counter at $95k. They may land at $90k.</li>
          <li><strong>Negotiate more than one thing.</strong> If base salary is firm, push on signing bonus, extra PTO, remote flexibility, or start date.</li>
        </ul>

        <h2>What if they say no?</h2>
        <p>Then you have a decision to make with full information. You asked. They answered. Now you know exactly where you stand. That clarity is valuable.</p>
        <p>In my experience, the vast majority of companies expect negotiation. They build room into their offers. The people who don't ask leave money on the table every single time.</p>

        <blockquote>
          <p>Negotiating is not about being greedy. It is about knowing your worth and communicating it clearly. The company already decided you're worth hiring. Now help them pay you what the role is worth.</p>
        </blockquote>

        <h2>Negotiation is a muscle</h2>
        <p>The first time is the hardest. After that, it becomes second nature. You'll negotiate raises, promotions, project assignments, and eventually your next offer at a new company. Each time gets easier.</p>
        <p>Start now. Your future self will thank you.</p>
      </article>

      <ArticleSubscribe source="article_negotiate_salary" />

      <section className="art-recs">
        <h3 className="art-recs__title">Recommended reading</h3>
        <div className="art-recs__grid">
          <Link to="/articles/first-90-days" className="art-recs__card">
            <div className="art-recs__card-tag">Jocelyn</div>
            <h4 className="art-recs__card-title">Your First 90 Days: A Survival Guide for First-Gen Professionals</h4>
          </Link>
          <Link to="/articles/first-gen-internship-playbook" className="art-recs__card">
            <div className="art-recs__card-tag">Both</div>
            <h4 className="art-recs__card-title">The Complete First-Gen Internship Playbook</h4>
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
