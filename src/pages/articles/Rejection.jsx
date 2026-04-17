import { Link } from 'react-router-dom'
import ArticleLayout from '../../components/ArticleLayout'

export default function Rejection() {
  const handleShare = () => {
    if (navigator.share) navigator.share({ title: "Rejection Doesn't Mean You Did It Wrong", url: window.location.href })
    else navigator.clipboard?.writeText(window.location.href)
  }

  return (
    <ArticleLayout title="Rejection Doesn't Mean You Did It Wrong | La Voz del Día">
      <header className="art-header">
        <span className="art-header__label art-header__label--both">Both</span>
        <h1 className="art-header__title">Rejection Doesn't Mean You Did It Wrong</h1>
        <p className="art-header__subtitle">You can do everything right and still get rejected. How to process it and keep moving.</p>
        <div className="art-header__meta art-header__meta--both">
          <div className="art-header__avatars" role="group" aria-label="Authors: Jose G. Cruz-Lopez and Jocelyn Vazquez">
            <img src="/images/jose.jpeg" alt="" className="art-header__avatar art-header__avatar--stack" width="44" height="44" decoding="async" />
            <img src="/images/jocelyn.jpeg" alt="" className="art-header__avatar art-header__avatar--stack" width="44" height="44" decoding="async" />
          </div>
          <div className="art-header__author-info">
            <span className="art-header__author-name">Jose G. Cruz-Lopez &amp; Jocelyn Vazquez</span>
            <span className="art-header__date">February 2026 · 6 min read</span>
          </div>
        </div>
      </header>

      <div className="art-engage">
        <div className="art-engage__left">
          <div className="art-engage__item">
            <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>63</span>
          </div>
          <div className="art-engage__item">
            <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>18</span>
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
        <p>We need to talk about rejection, because nobody does. Not honestly.</p>
        <p>Every career advice page tells you to "learn from rejection" and "use it as motivation." That's fine as a bumper sticker. But when you're sitting in your room at 11pm reading your fourth automated rejection email this week, motivation is not what you need. What you need is honesty.</p>
        <p>So here's ours.</p>

        <h2>Jose's story</h2>
        <p>I applied to over 200 internships my sophomore year. I got rejected from the vast majority of them without ever talking to a human. Some I was genuinely excited about. Some I spent hours tailoring my resume for. The result was the same: a templated email that started with "After careful consideration..."</p>
        <p>The hardest part wasn't the rejection itself. It was the silence. Applications that went into a void and never came back. No feedback. No explanation. Just nothing.</p>
        <p>I started to wonder if something was wrong with me. If my resume wasn't good enough. If my school wasn't good enough. If I wasn't good enough.</p>

        <h2>Jocelyn's story</h2>
        <p>When I was job searching post-graduation, I made it to the final round of interviews at three different companies. Three times I was the last candidate standing. Three times they went with someone else.</p>
        <p>Each one felt personal. I replayed every answer I gave, every question I could have handled differently. I wondered if I had smiled enough, or too much. If my answers were too long or too short. I picked myself apart.</p>
        <p>The truth I learned later: one company hired internally. One had a budget cut. One chose a candidate with a specific niche skill I didn't have. None of it was about me being inadequate.</p>

        <h2>What rejection actually means</h2>
        <p>Here is what rejection almost never means:</p>
        <ul>
          <li>That you weren't qualified</li>
          <li>That you interviewed badly</li>
          <li>That you'll never get hired</li>
          <li>That you're falling behind your peers</li>
        </ul>

        <p>Here is what rejection usually means:</p>
        <ul>
          <li>Another candidate had a specific experience that matched slightly better</li>
          <li>The team's priorities shifted</li>
          <li>The role was filled before your application was reviewed</li>
          <li>The hiring manager had a bias they may not even be aware of</li>
          <li>Timing</li>
        </ul>
        <p>Most of these factors are completely outside your control. And accepting that is the hardest part.</p>

        <h2>How to process it without spiraling</h2>

        <h3>1. Feel it</h3>
        <p>Don't "stay positive" right away. If you're disappointed, be disappointed. If you're angry, be angry. Suppressing it just delays the crash.</p>

        <h3>2. Set a recovery window</h3>
        <p>Give yourself a defined amount of time to be in your feelings about it. 24 hours. 48 hours. Then actively choose to move forward. The window prevents the disappointment from becoming your identity.</p>

        <h3>3. Debrief, don't ruminate</h3>
        <p>Ask yourself three questions:</p>
        <ul>
          <li>Was there something I could have genuinely done better?</li>
          <li>Was there something outside my control?</li>
          <li>What's one small action I can take this week to keep moving?</li>
        </ul>
        <p>Write down the answers. Then close the notebook.</p>

        <h3>4. Talk to someone who gets it</h3>
        <p>Not someone who will say "everything happens for a reason." Someone who has been rejected and can sit with you in the discomfort without rushing to fix it. That's the kind of support that actually helps.</p>

        <blockquote>
          <p>Rejection is not the opposite of success. It is part of the path to it. Every person you admire has a stack of "no's" you never saw.</p>
        </blockquote>

        <h2>The numbers that matter</h2>
        <p>Between the two of us, we've collected well over 400 rejections. We've also landed internships, full-time offers, and built careers in tech. Both of those things are true at the same time.</p>
        <p>Your rejection count is not your failure count. It is your attempt count. And the only people who never get rejected are the ones who never try.</p>
        <p>Keep going. Seriously. Keep going.</p>
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
          <Link to="/articles/coffee-chat-framework" className="art-recs__card">
            <div className="art-recs__card-tag">Jose</div>
            <h4 className="art-recs__card-title">The Coffee Chat Framework That Actually Gets Responses</h4>
          </Link>
          <Link to="/articles/negotiate-salary" className="art-recs__card">
            <div className="art-recs__card-tag">Jocelyn</div>
            <h4 className="art-recs__card-title">How to Negotiate When You've Never Seen a Six-Figure Salary</h4>
          </Link>
        </div>
      </section>

      <footer className="art-footer--wide" style={{ maxWidth: 680 }}>
        <span className="art-footer__copy">Jose x Jocelyn © 2026</span>
        <div className="art-footer__links">
          <Link to="/" className="art-footer__link">Home</Link>
          <a href="/#contact" className="art-footer__link">Contact</a>
        </div>
      </footer>
    </ArticleLayout>
  )
}
