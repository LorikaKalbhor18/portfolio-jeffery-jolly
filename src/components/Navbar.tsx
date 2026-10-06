import { useState, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Linkedin, Github, BookOpen } from 'lucide-react'
import { useThemeContext } from '@/components/ThemeProvider'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Logo from '@/components/Logo'
import { navLinks, siteConfig } from '@/data/content'
import NavLinks from './navbar/NavLinks'
import MobileDrawer from './navbar/MobileDrawer'
import ThemeToggle from './navbar/ThemeToggle'
import ScrollProgress from './navbar/ScrollProgress'

const SECTION_IDS = navLinks.map((l) => l.href.slice(1))

const SOCIAL_LINKS = [
  { href: siteConfig.linkedin, label: 'LinkedIn profile', Icon: Linkedin },
  { href: siteConfig.github,   label: 'GitHub profile',   Icon: Github },
  { href: siteConfig.medium,   label: 'Medium blog',      Icon: BookOpen },
]

function scrollToSection(href: string, navHeight: number) {
  const id = href.slice(1)
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - navHeight
  window.scrollTo({ top, behavior: 'smooth' })
}

export default function Navbar() {
  const { theme, toggle } = useThemeContext()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()
  const location = useLocation()
  const navigate = useNavigate()

  // On a detail page the sections live on the home page, so links point there.
  const onHomePage = location.pathname === '/'

  const { scrolled, progress } = useScrollDirection(drawerOpen)
  const spyActive = useScrollSpy(SECTION_IDS)
  const active = onHomePage ? spyActive : 'projects'

  const navHeight = scrolled ? 58 : 72

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const handleNavigate = useCallback(
    (href: string) => {
      if (onHomePage) {
        scrollToSection(href, navHeight)
        return
      }
      // From a detail page, go to the home page then scroll to the section.
      navigate('/' + href)
      setDrawerOpen(false)
    },
    [navHeight, onHomePage, navigate],
  )

  return (
    <>
      <header
        role="banner"
        className={[
          'fixed top-0 left-0 right-0 z-50',
          'pt-[env(safe-area-inset-top)]',
          'transition-transform',
          reduced ? '' : 'duration-300',
          // Hide/show
          'translate-y-0',
        ].join(' ')}
        style={{
          // Translucent + blur always; shadow only when scrolled
          background: scrolled
            ? 'color-mix(in srgb, var(--surface) 90%, transparent)'
            : 'transparent',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: scrolled
            ? '1px solid var(--border)'
            : '1px solid transparent',
          boxShadow: scrolled
            ? '0 2px 20px rgba(37, 99, 235, 0.08), 0 1px 4px rgba(0,0,0,0.06)'
            : 'none',
          transition: reduced
            ? 'none'
            : 'height 250ms ease, background 300ms ease, box-shadow 300ms ease, border-color 300ms ease',
        }}
      >
        <ScrollProgress progress={progress} />

        <nav
          className="mx-auto flex items-center justify-between px-5 sm:px-8"
          style={{
            maxWidth: 1280,
            height: navHeight,
            transition: reduced ? 'none' : 'height 250ms ease',
          }}
          aria-label="Primary"
        >
          {/* ── Brand ── */}
          <Logo
            className="shrink-0"
            onHomePage={onHomePage}
            onClick={(event) => {
              event.preventDefault()
              if (onHomePage) {
                handleNavigate('#home')
              } else {
                navigate('/')
                setDrawerOpen(false)
              }
            }}
          />

          {/* ── Desktop center links ── */}
          <NavLinks links={navLinks} active={active} onNavigate={handleNavigate} onHomePage={onHomePage} />

          {/* ── Right cluster ── */}
          <div className="flex items-center gap-0.5">
            {/* Social icons — desktop only */}
            <div className="hidden md:flex items-center gap-0.5">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-full text-[var(--body)] hover:text-[var(--primary)] hover:bg-[var(--pale-blue)] transition-colors duration-200 touch-auto"
                >
                  <Icon size={15} strokeWidth={1.75} />
                </a>
              ))}
            </div>

            {/* Divider */}
            <div
              className="hidden md:block w-px h-4 bg-[var(--border)] mx-1.5"
              aria-hidden="true"
            />

            {/* Theme toggle */}
            <ThemeToggle theme={theme} onToggle={toggle} />

            {/* CTA — desktop */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                handleNavigate('#contact')
              }}
              className={[
                'btn-shine hidden xl:inline-flex items-center gap-1.5 ml-2',
                'px-4 py-2 rounded-lg text-[13px] font-semibold',
                'bg-[var(--btn-dark)] text-white dark:text-[var(--bg)]',
                'hover:opacity-90 active:scale-[0.97]',
                'transition-all duration-200',
              ].join(' ')}
            >
              Let's talk
              <ArrowRight size={13} strokeWidth={2} />
            </a>

            {/* Hamburger — mobile/tablet */}
            <button
              ref={hamburgerRef}
              onClick={() => setDrawerOpen((o) => !o)}
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              className="xl:hidden flex items-center justify-center w-9 h-9 rounded-full ml-1 text-[var(--heading)] hover:text-[var(--primary)] hover:bg-[var(--pale-blue)] transition-colors duration-200 touch-auto"
            >
              {/* Morphing hamburger → X */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
                className="overflow-visible"
              >
                {/* Top line */}
                <line
                  x1="2" y1={drawerOpen ? '9' : '4'} x2="16" y2={drawerOpen ? '9' : '4'}
                  stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
                  style={{
                    transformOrigin: '9px 9px',
                    transform: drawerOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: reduced ? 'none' : 'transform 250ms ease, y1 250ms ease, y2 250ms ease',
                  }}
                />
                {/* Middle line */}
                <line
                  x1="2" y1="9" x2="16" y2="9"
                  stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
                  style={{
                    opacity: drawerOpen ? 0 : 1,
                    transition: reduced ? 'none' : 'opacity 200ms ease',
                  }}
                />
                {/* Bottom line */}
                <line
                  x1="2" y1={drawerOpen ? '9' : '14'} x2="16" y2={drawerOpen ? '9' : '14'}
                  stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
                  style={{
                    transformOrigin: '9px 9px',
                    transform: drawerOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
                    transition: reduced ? 'none' : 'transform 250ms ease, y1 250ms ease, y2 250ms ease',
                  }}
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer
        open={drawerOpen}
        links={navLinks}
        active={active}
        theme={theme}
        onToggleTheme={toggle}
        onNavigate={handleNavigate}
        onClose={closeDrawer}
        onHomePage={onHomePage}
        triggerRef={hamburgerRef}
      />
    </>
  )
}
