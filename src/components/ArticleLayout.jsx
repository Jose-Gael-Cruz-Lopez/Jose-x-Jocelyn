import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useT } from '../hooks/useT'

export default function ArticleLayout({ children, title, footerWidth = 680, signoffLine, signoffSub, signoffCta }) {
  const t = useT('articleLayout')

  const NAV_LINKS = [
    { to: '/articles',         label: t.navLaVoz },
    { to: '/linkedin-series',  label: t.navLinkedIn },
    { to: '/career-templates', label: t.navTemplates },
    { to: '/bridge-year',      label: t.navBridgeYear },
    { to: '/coffee-chat',      label: t.navCoffeeChat },
    { to: '/opportunity-board',label: t.navOpportunities },
    { to: '/interview-prep',   label: t.navInterviewPrep },
    { to: '/partner-panels',   label: t.navPanels },
    { to: '/resume-reviews',   label: t.navResumes },
  ]

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const panelRef = useRef(null)
  const burgerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.title = title ? `${title} | Jose x Jocelyn` : 'Jose x Jocelyn'
  }, [title])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      const firstFocusable = panelRef.current?.querySelector('a, button, [tabindex]:not([tabindex="-1"])')
      firstFocusable?.focus()
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        burgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const handlePanelKeyDown = (e) => {
    if (e.key !== 'Tab') return
    const focusable = Array.from(panelRef.current?.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])') ?? [])
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className={`art-nav${scrolled ? ' art-nav--scrolled' : ''}`} id="artNav">
        <Link to="/" className="art-nav__brand">{t.brand}</Link>
        <div className="art-nav__right">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="art-nav__link"
              style={pathname === to ? { color: 'var(--color-dark)', fontWeight: 600 } : undefined}
            >
              {label}
            </Link>
          ))}
          <Link to="/#contact" className="art-nav__link">{t.navGetInTouch}</Link>
        </div>
        <button
          ref={burgerRef}
          className={`art-nav__burger${menuOpen ? ' art-nav__burger--open' : ''}`}
          aria-label={menuOpen ? t.closeMenu : t.openMenu}
          aria-expanded={menuOpen}
          aria-controls="mobileNav"
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`art-nav__mobile${menuOpen ? ' art-nav__mobile--open' : ''}`} id="mobileNav" role="dialog" aria-modal="true" aria-label={t.navAriaLabel} aria-hidden={!menuOpen}>
        <div className="art-nav__mobile-panel" ref={panelRef} onKeyDown={handlePanelKeyDown}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`art-nav__mobile-link${pathname === to ? ' art-nav__mobile-link--active' : ''}`}
              onClick={closeMenu}
            >
              {label}
            </Link>
          ))}
          <Link to="/#contact" className="art-nav__mobile-link" onClick={closeMenu}>{t.navGetInTouch}</Link>
        </div>
      </div>

      <main>{children}</main>

      <section className="art-signoff" aria-label="Sign off">
        <div className="art-signoff__inner" style={{ maxWidth: footerWidth }}>
          <p className="art-signoff__line">{signoffLine ?? t.signoffLine}</p>
          <p className="art-signoff__sub">{signoffSub ?? t.signoffSub}</p>
          <Link to="/#contact" className="art-signoff__cta">{signoffCta ?? t.signoffCta}</Link>
        </div>
      </section>

      <footer className="art-footer--wide" style={{ maxWidth: footerWidth }}>
        <span className="art-footer__copy">{t.footerCopy}</span>
        <div className="art-footer__links">
          <Link to="/" className="art-footer__link">{t.footerHome}</Link>
          <Link to="/#contact" className="art-footer__link">{t.footerContact}</Link>
        </div>
      </footer>
    </>
  )
}
