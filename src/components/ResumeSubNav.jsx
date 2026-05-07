import { NavLink } from 'react-router-dom'
import { useT } from '../hooks/useT'

export default function ResumeSubNav() {
  const t = useT('resumeSubnav')
  const tabs = [
    { to: '/resume-reviews',          label: t.explore,   end: true },
    { to: '/resume-reviews/companies', label: t.companies },
    { to: '/resume-reviews/builder',   label: t.builder },
  ]

  return (
    <nav className="rsn" aria-label={t.ariaLabel}>
      <style>{`
        .rsn {
          max-width: 1240px;
          margin: 0 auto;
          padding: 12px clamp(20px, 5vw, 56px) 0;
          display: flex;
          gap: 4px;
          border-bottom: 1px solid rgba(0,0,0,.08);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .rsn::-webkit-scrollbar { display: none; }
        .rsn__tab {
          position: relative;
          padding: 10px 14px 14px;
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          color: var(--color-muted);
          text-decoration: none;
          white-space: nowrap;
          transition: color .18s;
        }
        .rsn__tab:hover { color: var(--color-dark); }
        .rsn__tab--active { color: var(--color-accent); }
        .rsn__tab--active::after {
          content: '';
          position: absolute;
          left: 14px; right: 14px; bottom: -1px;
          height: 2px;
          background: var(--color-accent);
          border-radius: 2px 2px 0 0;
        }
      `}</style>
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => `rsn__tab${isActive ? ' rsn__tab--active' : ''}`}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
