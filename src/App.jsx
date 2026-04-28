import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { Component, Suspense, lazy, useEffect } from 'react'

// Home stays eager — it's the most-visited page and the layout shell.
import Home from './pages/Home'

// Everything else is lazy-loaded so the initial bundle drops to the home page only.
const CoffeeChat = lazy(() => import('./pages/CoffeeChat'))
const AdminCoffeeChat = lazy(() => import('./pages/AdminCoffeeChat'))
const OpportunityBoard = lazy(() => import('./pages/OpportunityBoard'))
const InterviewPrep = lazy(() => import('./pages/InterviewPrep'))
const ResumeReviews = lazy(() => import('./pages/ResumeReviews'))
const PartnerPanels = lazy(() => import('./pages/PartnerPanels'))
const LinkedInSeries = lazy(() => import('./pages/LinkedInSeries'))
const CareerTemplates = lazy(() => import('./pages/CareerTemplates'))
const BridgeYear = lazy(() => import('./pages/BridgeYear'))
const ArticlesIndex = lazy(() => import('./pages/articles/ArticlesIndex'))
const LateCycleInternships = lazy(() => import('./pages/articles/LateCycleInternships'))
const First90Days = lazy(() => import('./pages/articles/First90Days'))
const FirstGenPlaybook = lazy(() => import('./pages/articles/FirstGenPlaybook'))
const CoffeeChatFramework = lazy(() => import('./pages/articles/CoffeeChatFramework'))
const NegotiateSalary = lazy(() => import('./pages/articles/NegotiateSalary'))
const Rejection = lazy(() => import('./pages/articles/Rejection'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

function RouteFallback() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-cream)' }}>
      <p style={{ fontSize: '14px', color: 'var(--color-muted)', fontStyle: 'italic' }}>Loading…</p>
    </div>
  )
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('Top-level error boundary caught:', error, info)
  }
  reset = () => {
    this.setState({ hasError: false, error: null })
  }
  render() {
    if (this.state.hasError) {
      return (
        <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 60px', textAlign: 'center', background: 'var(--color-cream)' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '14px' }}>Something broke</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '12px', lineHeight: 1.1 }}>This page hit an error.</h1>
          <p style={{ fontSize: '15px', color: 'var(--color-muted)', maxWidth: '520px', lineHeight: 1.65, marginBottom: '24px' }}>Try refreshing. If it keeps happening, email <a href="mailto:campustocareerteam@gmail.com" style={{ color: 'var(--color-navy)', fontWeight: 600 }}>campustocareerteam@gmail.com</a> with what you were doing and we will investigate.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: 'var(--color-dark)', color: 'var(--color-cream)', border: 'none', borderRadius: '8px', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Refresh</button>
            <Link to="/" onClick={this.reset} style={{ padding: '12px 24px', background: 'transparent', color: 'var(--color-dark)', border: '1.5px solid rgba(0,0,0,.2)', borderRadius: '8px', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex' }}>Go home</Link>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coffee-chat" element={<CoffeeChat />} />
          <Route path="/admin/coffee-chat" element={<AdminCoffeeChat />} />
          <Route path="/opportunity-board" element={<OpportunityBoard />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/resume-reviews" element={<ResumeReviews />} />
          <Route path="/partner-panels" element={<PartnerPanels />} />
          <Route path="/linkedin-series" element={<LinkedInSeries />} />
          <Route path="/career-templates" element={<CareerTemplates />} />
          <Route path="/bridge-year" element={<BridgeYear />} />
          <Route path="/articles" element={<ArticlesIndex />} />
          <Route path="/articles/late-cycle-internships" element={<LateCycleInternships />} />
          <Route path="/articles/first-90-days" element={<First90Days />} />
          <Route path="/articles/first-gen-internship-playbook" element={<FirstGenPlaybook />} />
          <Route path="/articles/coffee-chat-framework" element={<CoffeeChatFramework />} />
          <Route path="/articles/negotiate-salary" element={<NegotiateSalary />} />
          <Route path="/articles/rejection" element={<Rejection />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

function NotFound() {
  return (
    <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 60px', textAlign: 'center', background: 'var(--color-cream)' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '14px' }}>404</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,6vw,64px)', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '12px', lineHeight: 1.05 }}>Page not found.</h1>
      <p style={{ fontSize: '16px', color: 'var(--color-muted)', maxWidth: '520px', lineHeight: 1.65, marginBottom: '32px' }}>The link may be broken, or the page may have moved. Try one of these instead.</p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" style={{ display: 'inline-flex', padding: '14px 28px', background: 'var(--color-dark)', color: 'var(--color-cream)', borderRadius: '8px', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Go home</Link>
        <Link to="/coffee-chat" style={{ display: 'inline-flex', padding: '14px 28px', background: 'transparent', color: 'var(--color-dark)', border: '1.5px solid rgba(0,0,0,.2)', borderRadius: '8px', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Coffee Chat Network</Link>
      </div>
    </main>
  )
}
