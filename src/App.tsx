import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router'
import Navigation from './sections/Navigation'
import HeroSection from './sections/HeroSection'
import PhotoSection from './sections/PhotoSection'
import TimelineSection from './sections/TimelineSection'
import FooterSection from './sections/FooterSection'
import { initAnalytics } from './lib/analytics'
import AboutPage from './pages/About'
import PhotographyPage from './pages/Photography'
import PhotoArticlePage from './pages/PhotoArticle'
import RecordsPage from './pages/Records'
import RecordArticlePage from './pages/RecordArticle'
import WorksPage from './pages/Works'
import useScrollReveal from './hooks/use-scroll-reveal'

function HomePage() {
  return (
    <main>
      <HeroSection />
      <TimelineSection />
      <PhotoSection />
      <FooterSection />
    </main>
  )
}

function LegacyRecordRedirect() {
  const { slug } = useParams()

  return <Navigate to={slug ? `/blogs/${slug}` : '/blogs'} replace />
}

function AnimatedRoutes() {
  const location = useLocation()
  const [isInitialRoute, setIsInitialRoute] = useState(true)

  useScrollReveal(location.pathname)

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setIsInitialRoute(false), 720)
    return () => window.clearTimeout(enterTimer)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div id="main-content" className={`route-shell ${isInitialRoute ? 'is-initial-route' : ''}`} key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/blogs" element={<RecordsPage />} />
        <Route path="/blogs/:slug" element={<RecordArticlePage />} />
        <Route path="/records" element={<LegacyRecordRedirect />} />
        <Route path="/records/:slug" element={<LegacyRecordRedirect />} />
        <Route path="/photography" element={<PhotographyPage />} />
        <Route path="/photography/:slug" element={<PhotoArticlePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  useEffect(() => {
    initAnalytics()
  }, [])

  return (
    <div className="site-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <a className="skip-link" href="#main-content">
        跳到内容
      </a>
      <BrowserRouter>
        <Navigation />
        <AnimatedRoutes />
      </BrowserRouter>
    </div>
  )
}
