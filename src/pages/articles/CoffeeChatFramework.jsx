import { Link } from 'react-router-dom'
import ArticleLayout from '../../components/ArticleLayout'

export default function CoffeeChatFramework() {
  const handleShare = () => {
    if (navigator.share) navigator.share({ title: 'The Coffee Chat Framework That Actually Gets Responses', url: window.location.href })
    else navigator.clipboard?.writeText(window.location.href)
  }

  return (
    <ArticleLayout title="The Coffee Chat Framework That Actually Gets Responses | La Voz del Día">
      <header className="art-header">
        <span className="art-header__label art-header__label--jose">Jose</span>
        <h1 className="art-header__title">The Coffee Chat Framework That Actually Gets Responses</h1>
        <p className="art-header__subtitle">A step-by-step system for reaching out to professionals and turning conversations into opportunities.</p>
        <div className="art-header__meta">
          <img src="/images/jose.jpeg" alt="Jose G. Cruz-Lopez" className="art-header__avatar" />
          <div className="art-header__author-info">
            <span className="art-header__author-name">Jose G. Cruz-Lopez</span>
            <span className="art-header__date">March 2026 · 7 min read</span>
          </div>
        </div>
      </header>

      <div className="art-engage">
        <div className="art-engage__left">
          <div className="art-engage__item">
            <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>38</span>
          </div>
          <div className="art-engage__item">
            <svg className="art-engage__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>11</span>
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
        <p>"Just reach out to people on LinkedIn." Everyone says it. No one teaches you how.</p>
        <p>I spent months sending messages that went nowhere before I figured out what actually works. The difference between a message that gets ignored and one that gets a response is not luck. It is structure.</p>
        <p>Here is the exact framework I use, and it has a response rate above 40%.</p>

        <h2>The anatomy of a message that works</h2>
        <p>Every cold outreach message that gets a response has three elements:</p>
        <ol>
          <li><strong>A specific hook</strong> that shows you did your homework</li>
          <li><strong>A clear ask</strong> that is easy to say yes to</li>
          <li><strong>Respect for their time</strong> that removes friction</li>
        </ol>
        <p>That's it. No flattery essays. No life stories. Three elements, under 100 words.</p>

        <h2>The template</h2>
        <div className="art-callout">
          <p>Hi [Name],</p>
          <p>I saw your [specific post / project / talk about X] and it resonated because [brief personal connection in 1 sentence].</p>
          <p>I'm a [year] student at [school] exploring [field], and I'd love to hear how you approached [specific thing they did]. Would you have 15 minutes for a quick virtual chat this week or next?</p>
          <p>Totally understand if not. Either way, thanks for sharing your work.</p>
          <p>Best, [Your name]</p>
        </div>

        <h3>Why this works</h3>
        <ul>
          <li><strong>Specific hook:</strong> Referencing their actual work proves you're not mass-messaging. People respond to people who pay attention.</li>
          <li><strong>Clear ask:</strong> "15 minutes" is a low commitment. "This week or next" gives them flexibility. You made it easy to say yes.</li>
          <li><strong>Graceful exit:</strong> "Totally understand if not" removes pressure. Ironically, this makes people more likely to respond.</li>
        </ul>

        <h2>Before you send: the prep work</h2>

        <h3>Step 1: Choose the right people</h3>
        <p>Don't start with the CEO. Target people 1 to 3 levels above where you want to be. They remember what it's like to be early-career and they're more likely to respond.</p>

        <h3>Step 2: Do the research</h3>
        <p>Spend 5 minutes on their LinkedIn profile. Read their recent posts. Check if they've been featured in any articles or podcasts. Find one specific thing you can reference. This is what separates your message from the other 50 they got this week.</p>

        <h3>Step 3: Warm the connection first</h3>
        <p>Before you send a message, engage with their content. Like a post. Leave a thoughtful comment. Do this for a week. When your name shows up in their DMs, they'll recognize it.</p>

        <h2>During the chat: the 15-minute playbook</h2>
        <p>You asked for 15 minutes. Respect that. Here is how to structure it:</p>
        <ul>
          <li><strong>Minutes 1 to 2:</strong> Thank them. Introduce yourself in 30 seconds or less.</li>
          <li><strong>Minutes 3 to 10:</strong> Ask your prepared questions. Listen more than you talk. Take notes.</li>
          <li><strong>Minutes 11 to 14:</strong> Ask "Is there anyone else you'd recommend I talk to?" This one question can snowball a single chat into an entire network.</li>
          <li><strong>Minute 15:</strong> Thank them again. Wrap up on time, even if they offer to keep going. Respecting their time builds respect for you.</li>
        </ul>

        <h2>After the chat: the follow-up that seals it</h2>
        <p>Within 24 hours, send a thank-you message. Reference one specific takeaway from the conversation. If they mentioned someone to connect with, follow up on that referral and let the original person know you did.</p>

        <blockquote>
          <p>A coffee chat is not a job interview. It is a relationship. Play the long game. The people you connect with today will remember you when opportunities open up tomorrow.</p>
        </blockquote>

        <h2>Common mistakes to avoid</h2>
        <ul>
          <li><strong>Asking for a job in the first message.</strong> Never. The ask is for a conversation, not a position.</li>
          <li><strong>Sending a generic message.</strong> If your message could be sent to anyone, it will be ignored by everyone.</li>
          <li><strong>Not following up.</strong> If they don't respond in a week, send one polite follow-up. After that, move on.</li>
          <li><strong>Going over time.</strong> If you asked for 15 minutes, end at 15 minutes. Period.</li>
        </ul>

        <p>Networking is a skill, not a personality trait. You can learn it. And once you do, it becomes the single most powerful tool in your career toolkit.</p>
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
          <Link to="/articles/late-cycle-internships" className="art-recs__card">
            <div className="art-recs__card-tag">Jose</div>
            <h4 className="art-recs__card-title">Late-Cycle Internships: Where to Look When Everyone Says It's Over</h4>
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
          <a href="/#contact" className="art-footer__link">Contact</a>
        </div>
      </footer>
    </ArticleLayout>
  )
}
