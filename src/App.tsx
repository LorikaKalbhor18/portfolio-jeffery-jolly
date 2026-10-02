import { ThemeProvider } from '@/components/ThemeProvider'
import Navbar from '@/components/Navbar'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import IntroOverlay from '@/components/IntroOverlay'
import SkipToContent from '@/components/SkipToContent'
import CursorGlow from '@/components/CursorGlow'
import HeroSection from '@/sections/HeroSection'
import AboutSection from '@/sections/AboutSection'
import ExperienceSection from '@/sections/ExperienceSection'
import ServicesSection from '@/sections/ServicesSection'
import FeaturedSection from '@/sections/FeaturedSection'
import ProjectsCarousel from '@/sections/ProjectsCarousel'
import ToolsSection from '@/sections/ToolsSection'
import CertificationsSection from '@/sections/CertificationsSection'
import BlogSection from '@/sections/BlogSection'
import ContactSection from '@/sections/ContactSection'

export default function App() {
  return (
    <ThemeProvider>
      <SkipToContent />
      <CursorGlow />
      <IntroOverlay />
      <AnimatedBackground />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ServicesSection />
        <FeaturedSection />
        <ProjectsCarousel />
        <ToolsSection />
        <CertificationsSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </ThemeProvider>
  )
}
