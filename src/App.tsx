import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Navigation from './sections/Navigation'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import ProjectsSection from './sections/ProjectsSection'
import TimelineSection from './sections/TimelineSection'
import FooterSection from './sections/FooterSection'
import { initAnalytics } from './lib/analytics'
import WorkPage from './pages/Work'

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
                <TimelineSection />
                <FooterSection />
              </main>
            }
          />
          <Route path="/work" element={<WorkPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
