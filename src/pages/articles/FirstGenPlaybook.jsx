import { Link } from 'react-router-dom'
import ArticleLayout from '../../components/ArticleLayout'
import ArticleSubscribe from '../../components/ArticleSubscribe'
import { useT } from '../../hooks/useT'

export default function FirstGenPlaybook() {
  const t = useT('firstGenPlaybook')

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: t.shareTitle, url: window.location.href })
    else navigator.clipboard?.writeText(window.location.href)
  }

  return (
    <ArticleLayout title={t.pageTitle}>
      <header className="art-header">
        <span className="art-header__label art-header__label--both">{t.headerLabel}</span>
        <h1 className="art-header__title">{t.headerTitle}</h1>
        <p className="art-header__subtitle">{t.headerSubtitle}</p>
        <div className="art-header__meta art-header__meta--both">
          <div className="art-header__avatars" role="group" aria-label={t.authorsAriaLabel}>
            <img src="/images/jose.jpeg" alt="" className="art-header__avatar art-header__avatar--stack" width="44" height="44" decoding="async" />
            <img src="/images/jocelyn.jpeg" alt="" className="art-header__avatar art-header__avatar--stack" width="44" height="44" decoding="async" />
          </div>
          <div className="art-header__author-info">
            <span className="art-header__author-name">{t.authorName}</span>
            <span className="art-header__date">{t.authorDate}</span>
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
            {t.shareBtn}
          </button>
        </div>
      </div>

      <article className="art-body">
        <p>{t.p1}</p>
        <p>{t.p2}</p>

        <h2>{t.h2Phase1}</h2>

        <h3>{t.h3Know}</h3>
        <p>{t.pKnow}</p>
        <ol>
          {t.knowList.map(item => <li key={item}>{item}</li>)}
        </ol>
        <p>{t.pFilter}</p>

        <h3>{t.h3Tracker}</h3>
        <p>{t.pTracker}</p>

        <h3>{t.h3Where}</h3>
        <ul>
          {t.whereList.map(item => <li key={item}>{item}</li>)}
        </ul>

        <h2>{t.h2Phase2}</h2>

        <h3>{t.h3Resume}</h3>
        <p>{t.pResume}</p>

        <h3>{t.h3LinkedIn}</h3>
        <p>{t.pLinkedIn}</p>

        <h3>{t.h3Technical}</h3>
        <p>{t.pTechnical}</p>

        <h3>{t.h3Behavioral}</h3>
        <p>{t.pBehavioral}</p>

        <h2>{t.h2Phase3}</h2>
        <p>{t.pSprint}</p>

        <div className="art-callout">
          <p dangerouslySetInnerHTML={{ __html: t.calloutJose }} />
          <p dangerouslySetInnerHTML={{ __html: t.calloutJocelyn }} />
        </div>

        <h2>{t.h2Phase4}</h2>

        <h3>{t.h3Before}</h3>
        <ul>
          {t.beforeList.map(item => <li key={item}>{item}</li>)}
        </ul>

        <h3>{t.h3During}</h3>
        <ul>
          {t.duringList.map(item => <li key={item}>{item}</li>)}
        </ul>

        <h3>{t.h3After}</h3>
        <p>{t.pAfter}</p>

        <h2>{t.h2Phase5}</h2>
        <p>{t.pNegotiate}</p>

        <blockquote>
          <p>{t.blockquote}</p>
        </blockquote>

        <p>{t.pClose}</p>
      </article>

      <ArticleSubscribe source="article_first_gen_playbook" />

      <section className="art-recs">
        <h3 className="art-recs__title">{t.recsTitle}</h3>
        <div className="art-recs__grid">
          <Link to="/articles/late-cycle-internships" className="art-recs__card">
            <div className="art-recs__card-tag">{t.rec1Tag}</div>
            <h4 className="art-recs__card-title">{t.rec1Title}</h4>
          </Link>
          <Link to="/articles/rejection" className="art-recs__card">
            <div className="art-recs__card-tag">{t.rec2Tag}</div>
            <h4 className="art-recs__card-title">{t.rec2Title}</h4>
          </Link>
        </div>
      </section>

    </ArticleLayout>
  )
}
