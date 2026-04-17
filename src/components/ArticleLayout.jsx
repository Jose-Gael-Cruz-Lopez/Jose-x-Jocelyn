import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/articles', label: 'La Voz del Día' },
  { to: '/career-templates', label: 'Templates' },
  { to: '/bridge-year', label: 'Bridge Year' },
  { to: '/coffee-chat', label: 'Coffee Chat' },
  { to: '/opportunity-board', label: 'Opportunities' },
  { to: '/partner-panels', label: 'Panels' },
  { to: '/resume-reviews', label: 'Resumes' },
]

export default function ArticleLayout({ children, title }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

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
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className={`art-nav${scrolled ? ' art-nav--scrolled' : ''}`} id="artNav">
        <Link to="/" className="art-nav__brand">Jose × Jocelyn</Link>
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
          <Link to="/#contact" className="art-nav__link">Get in Touch</Link>
        </div>
        <button
          className={`art-nav__burger${menuOpen ? ' art-nav__burger--open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`art-nav__mobile${menuOpen ? ' art-nav__mobile--open' : ''}`} id="mobileNav">
        <div className="art-nav__mobile-panel">
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
          <Link to="/#contact" className="art-nav__mobile-link" onClick={closeMenu}>Get in Touch</Link>
        </div>
      </div>

      {children}
    </>
  )
}
