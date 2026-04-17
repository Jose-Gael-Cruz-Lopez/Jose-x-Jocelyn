import { Link } from 'react-router-dom'
import ArticleLayout from '../../components/ArticleLayout'

export default function First90Days() {
  const handleShare = () => {
    if (navigator.share) navigator.share({ title: 'Your First 90 Days', url: window.location.href })
    else navigator.clipboard?.writeText(window.location.href)
  }

  return (
    <ArticleLayout title="Your First 90 Days: A Survival Guide for First-Gen Professionals | La Voz del Día">
      <header className="art-header">
        <span className="art-header__label art-header__label--jocelyn">Jocelyn</span>
        <h1 className="art-header__title">Your First 90 Days: A Survival Guide for First-Gen Professionals</h1>
        <p className="art-header__subtitle">No one teaches you how to read benefits, navigate office politics, or build a career ladder. Until now.</p>
        <div className="art-header__meta">
          <img src="/images/jocelyn.jpeg" alt="Jocelyn Vazquez" className="art-header__avatar" />
          <div className="art-header__author-info">
            <span className="art-header__author-name">Jocelyn Vazquez</span>
            <span className="art-header__date">April 2026 · 10 min read</span>
          </div>
        </div>
      </header>

      <div className="art-engage">
        <div className="art-engage__left">
          <div className="art-engage__item">
            <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>31</span>
          </div>
          <div className="art-engage__item">
            <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>9</span>
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
        <p>You got the job. The offer letter is signed. You're about to start your first full-time role in tech. Congratulations.</p>
        <p>Now here's the part nobody told you about.</p>
        <p>The first 90 days of a full-time role are the most disorienting period of your career, and it's ten times harder when you're the first person in your family to do this. There's no one at home to call when your benefits portal looks like a foreign language, when your manager gives you vague feedback, or when you realize corporate culture has its own unwritten rulebook.</p>
        <p>I wrote this because I lived it. And I want you to walk in prepared.</p>

        <h2>Before Day 1: the paperwork no one explains</h2>

        <h3>Benefits enrollment</h3>
        <p>You will have a window (usually 30 days) to choose your health insurance, dental, vision, and retirement plan. Here is what to actually do:</p>
        <ul>
          <li><strong>Health insurance:</strong> If you're healthy and young, the high-deductible plan (HDHP) paired with an HSA is usually the most cost-effective. The HSA money is yours forever and grows tax-free.</li>
          <li><strong>401(k):</strong> Contribute at least enough to get the full employer match. That is free money. If your company matches 4%, contribute 4% minimum on day one.</li>
          <li><strong>Life and disability insurance:</strong> The basic plan your company provides for free is usually enough to start.</li>
        </ul>

        <h3>Equity and stock options</h3>
        <p>If your company offers RSUs (Restricted Stock Units) or stock options, learn your vesting schedule. Most vest over 4 years with a 1-year cliff, meaning you get nothing if you leave before 12 months. This matters for career planning.</p>

        <h2>Days 1 through 30: learn, don't perform</h2>
        <p>Your only job for the first month is to absorb. Resist the urge to prove yourself immediately. Instead:</p>
        <ul>
          <li><strong>Map the people.</strong> Who makes decisions? Who influences decisions but doesn't have the title? Who is respected across teams?</li>
          <li><strong>Learn the communication style.</strong> Does your team prefer Slack or email? Are meetings where decisions happen, or just where decisions get announced?</li>
          <li><strong>Ask questions relentlessly.</strong> You have a limited window where asking "basic" questions is expected and encouraged. Use it.</li>
          <li><strong>Document everything.</strong> Keep a running log of what you learn, who you meet, and what processes exist. This will be invaluable later.</li>
        </ul>

        <h2>Days 30 through 60: build relationships</h2>
        <p>The number one predictor of success in a new role is relationships, not technical skill. Schedule 1:1 coffee chats with people on your team and adjacent teams. Ask them:</p>
        <ul>
          <li>What is the biggest challenge the team is facing right now?</li>
          <li>What do you wish someone had told you when you started?</li>
          <li>What does success look like in this role from your perspective?</li>
        </ul>

        <blockquote>
          <p>Your network inside the company is your safety net. Build it before you need it.</p>
        </blockquote>

        <h2>Days 60 through 90: deliver and communicate</h2>
        <p>By now you should have a clear picture of where you can contribute. Pick one project or area and deliver a visible win. It doesn't have to be huge. It has to be clear, complete, and communicated.</p>

        <h3>The communication part matters most</h3>
        <p>In corporate environments, work that isn't visible doesn't count. Send a brief update to your manager about what you delivered. Mention it in your team standup. This isn't bragging. It's how the game works.</p>

        <h2>Things I wish someone had told me</h2>
        <ul>
          <li>Imposter syndrome is normal. It does not mean you don't belong.</li>
          <li>You will not understand everything in every meeting. That's fine. Write down what confused you and look it up later.</li>
          <li>Saying "I don't know, but I'll find out" is always better than pretending.</li>
          <li>Your manager is not your parent. They want to help you succeed because it makes them look good. Use that alignment.</li>
          <li>Corporate culture rewards visibility. Do good work, and make sure people know about it.</li>
        </ul>

        <p>Your first 90 days set the foundation for everything that follows. Take them seriously, but don't take yourself too seriously. You earned this seat. Now make it yours.</p>
      </article>

      <div className="art-subscribe">
        <div className="art-subscribe__box">
          <h3 className="art-subscribe__title">Stay in the loop</h3>
          <p className="art-subscribe__desc">Get new articles from La Voz del Día delivered to your inbox.</p>
          <form className="art-subscribe__form" onSubmit={e => e.preventDefault()}>
            <input type="email" className="art-subscribe__input" placeholder="your@email.com" />
            <button className="art-subscribe__btn" type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <section className="art-recs">
        <h3 className="art-recs__title">Recommended reading</h3>
        <div className="art-recs__grid">
          <Link to="/articles/negotiate-salary" className="art-recs__card">
            <div className="art-recs__card-tag">Jocelyn</div>
            <h4 className="art-recs__card-title">How to Negotiate When You've Never Seen a Six-Figure Salary</h4>
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
