import HeroSection from '@/sections/HeroSection'
import AboutSection from '@/sections/AboutSection'
import ExperienceSection from '@/sections/ExperienceSection'
import FeaturedSection from '@/sections/FeaturedSection'
import ProjectsCarousel from '@/sections/ProjectsCarousel'
import ToolsSection from '@/sections/ToolsSection'
import CertificationsSection from '@/sections/CertificationsSection'
import BlogSection from '@/sections/BlogSection'
import ContactSection from '@/sections/ContactSection'

/** The single-page home, unchanged in content and layout. */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <FeaturedSection />
      <ProjectsCarousel />
      <ToolsSection />
      <CertificationsSection />
      <BlogSection />
      <ContactSection />
    </>
  )
}
