import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Navigation from './sections/Navigation'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import ProjectsSection from './sections/ProjectsSection'
import PhotoSection from './sections/PhotoSection'
import TimelineSection from './sections/TimelineSection'
import FooterSection from './sections/FooterSection'
import { initAnalytics } from './lib/analytics'
import WorkPage from './pages/Work'
import PhotographyPage from './pages/Photography'
import PhotoArticlePage from './pages/PhotoArticle'
import RecordsPage from './pages/Records'
import RecordArticlePage from './pages/RecordArticle'

function App() {
  useEffect(() => {
    initAnalytics()
  }, [])

  return (
    <div className="site-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <HeroSection />
                <AboutSection />
                <ProjectsSection />
                <PhotoSection />
                <TimelineSection />
                <FooterSection />
              </main>
            }
          />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/records/:slug" element={<RecordArticlePage />} />
          <Route path="/photography" element={<PhotographyPage />} />
          <Route path="/photography/:slug" element={<PhotoArticlePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
