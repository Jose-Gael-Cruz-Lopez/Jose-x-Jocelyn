import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import CoffeeChat from './pages/CoffeeChat'
import OpportunityBoard from './pages/OpportunityBoard'
import InterviewPrep from './pages/InterviewPrep'
import ResumeReviews from './pages/ResumeReviews'
import PartnerPanels from './pages/PartnerPanels'
import LinkedInSeries from './pages/LinkedInSeries'
import CareerTemplates from './pages/CareerTemplates'
import BridgeYear from './pages/BridgeYear'
import ArticlesIndex from './pages/articles/ArticlesIndex'
import LateCycleInternships from './pages/articles/LateCycleInternships'
import First90Days from './pages/articles/First90Days'
import FirstGenPlaybook from './pages/articles/FirstGenPlaybook'
import CoffeeChatFramework from './pages/articles/CoffeeChatFramework'
import NegotiateSalary from './pages/articles/NegotiateSalary'
import Rejection from './pages/articles/Rejection'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname === '/') {
      window.scrollTo(0, 0)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coffee-chat" element={<CoffeeChat />} />
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
      </Routes>
    </>
  )
}
