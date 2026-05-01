import { Link } from 'react-router-dom'
import ArticleLayout from '../../components/ArticleLayout'
import ArticleSubscribe from '../../components/ArticleSubscribe'
import { useT } from '../../hooks/useT'

export default function LateCycleInternships() {
  const t = useT('lateCycleInternships')

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: t.shareTitle, url: window.location.href })
    else navigator.clipboard?.writeText(window.location.href)
  }

  return (
    <ArticleLayout title={t.pageTitle}>
      <header className="art-header">
        <span className="art-header__label art-header__label--jose">{t.headerLabel}</span>
        <h1 className="art-header__title">{t.headerTitle}</h1>
        <p className="art-header__subtitle">{t.headerSubtitle}</p>
        <div className="art-header__meta">
          <img src="/images/jose.jpeg" alt={t.authorAlt} className="art-header__avatar" />
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
            {t.shareBtn}
          </button>
        </div>
      </div>

      <article className="art-body">
        <p>{t.p1}</p>
        <p><strong>{t.p2Strong}</strong></p>
        <p>{t.p3}</p>

        <h2>{t.h2Why}</h2>
        <p>{t.pWhy}</p>
        <ul>
          {t.whyList.map(item => (
            <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
        <p>{t.pOpps}</p>

        <h2>{t.h2Where}</h2>

        <h3>{t.h3Career}</h3>
        <p>{t.pCareer}</p>

        <h3>{t.h3Handshake}</h3>
        <p>{t.pHandshake}</p>

        <h3>{t.h3Startups}</h3>
        <p>{t.pStartups}</p>

        <h3>{t.h3Cold}</h3>
        <p>{t.pCold}</p>

        <h3>{t.h3Research}</h3>
        <p>{t.pResearch}</p>

        <h2>{t.h2HowToStand}</h2>

        <h3>{t.h3MoveFast}</h3>
        <p>{t.pMoveFast}</p>

        <h3>{t.h3Flexible}</h3>
        <p>{t.pFlexible}</p>

        <h3>{t.h3Lead}</h3>
        <p>{t.pLead}</p>

        <blockquote>
          <p>{t.blockquote}</p>
        </blockquote>

        <h2>{t.h2WhatIf}</h2>
        <p>{t.pWhatIf1}</p>
        <p>{t.pWhatIf2}</p>
        <p>{t.pWhatIf3}</p>
      </article>

      <ArticleSubscribe source="article_late_cycle_internships" />

      <section className="art-recs">
        <h3 className="art-recs__title">{t.recsTitle}</h3>
        <div className="art-recs__grid">
          <Link to="/articles/coffee-chat-framework" className="art-recs__card">
            <div className="art-recs__card-tag">{t.rec1Tag}</div>
            <h4 className="art-recs__card-title">{t.rec1Title}</h4>
          </Link>
          <Link to="/articles/first-gen-internship-playbook" className="art-recs__card">
            <div className="art-recs__card-tag">{t.rec2Tag}</div>
            <h4 className="art-recs__card-title">{t.rec2Title}</h4>
          </Link>
        </div>
      </section>

    </ArticleLayout>
  )
}
