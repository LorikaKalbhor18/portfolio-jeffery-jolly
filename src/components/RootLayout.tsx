import { ThemeProvider } from '@/components/ThemeProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import IntroOverlay from '@/components/IntroOverlay'
import SkipToContent from '@/components/SkipToContent'
import CursorGlow from '@/components/CursorGlow'
import AnimatedBackground from '@/components/AnimatedBackground'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

/**
 * Scroll to top on every route change, except when navigating to "/" with a
 * hash, in which case scroll to that section after render.
 */
function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (pathname !== '/' || !hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = hash.slice(1)
    const tryScroll = (attempt = 0) => {
      const el = document.getElementById(id)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 88
        window.scrollTo({ top, behavior: 'smooth' })
        return
      }
      // Sections mount in sequence, so retry briefly before giving up.
      if (attempt < 20) requestAnimationFrame(() => tryScroll(attempt + 1))
    }
    tryScroll()
  }, [pathname, hash])

  return null
}

/**
 * Shared shell. Navbar and footer render on every route, home and detail alike,
 * with the same global chrome the single-page version had.
 */
export default function RootLayout() {
  return (
    <ThemeProvider>
      <SkipToContent />
      <CursorGlow />
      <IntroOverlay />
      <AnimatedBackground />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <ScrollToHash />
    </ThemeProvider>
  )
}