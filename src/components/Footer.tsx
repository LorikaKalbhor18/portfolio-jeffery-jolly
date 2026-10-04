import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Download,
  Github,
  Linkedin,
  Mail,
  Moon,
  Shield,
  Sun,
} from 'lucide-react'
import { navLinks, siteConfig } from '@/data/content'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useThemeContext } from '@/components/ThemeProvider'
import Logo from '@/components/Logo'

// ── Closing-card network geometry (unchanged) ────────────────────────────────
const networkDots = [
  [75, 70], [180, 145], [300, 80], [430, 185], [560, 105], [720, 195],
  [850, 80], [1010, 160], [1135, 75], [940, 285], [690, 310], [360, 300],
]
const networkLines = [
  [75, 70, 180, 145], [180, 145, 300, 80], [300, 80, 430, 185],
  [430, 185, 560, 105], [560, 105, 720, 195], [720, 195, 850, 80],
  [850, 80, 1010, 160], [1010, 160, 1135, 75], [430, 185, 360, 300],
  [430, 185, 690, 310], [720, 195, 690, 310], [720, 195, 940, 285],
  [1010, 160, 940, 285],
]

// ── Footer bar background network geometry ───────────────────────────────────
const barDots: [number, number][] = [
  [40, 30], [140, 80], [260, 20], [380, 70], [500, 35], [640, 85],
  [760, 25], [900, 75], [1020, 30], [1160, 70], [1260, 40],
  [80, 110], [220, 130], [460, 120], [700, 115], [960, 125], [1100, 105],
]
const barLines: [number, number, number, number][] = [
  [40, 30, 140, 80], [140, 80, 260, 20], [260, 20, 380, 70],
  [380, 70, 500, 35], [500, 35, 640, 85], [640, 85, 760, 25],
  [760, 25, 900, 75], [900, 75, 1020, 30], [1020, 30, 1160, 70],
  [1160, 70, 1260, 40], [140, 80, 80, 110], [380, 70, 220, 130],
  [500, 35, 460, 120], [640, 85, 700, 115], [900, 75, 960, 125],
  [1020, 30, 1100, 105],
]

function scrollTo(id: string, reduced: boolean) {
  const element = document.getElementById(id)
  if (!element) return
  window.scrollTo({
    top: element.getBoundingClientRect().top + window.scrollY - 72,
    behavior: reduced ? 'instant' : 'smooth',
  })
}

function MagneticLink({
  href,
  children,
  reduced,
  variant,
  download,
}: {
  href: string
  children: React.ReactNode
  reduced: boolean
  variant: 'primary' | 'outline'
  download?: boolean
}) {
  const linkRef = useRef<HTMLAnchorElement>(null)

  function moveMagnetically(event: React.PointerEvent<HTMLAnchorElement>) {
    if (reduced || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const offsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8
    const offsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6
    event.currentTarget.style.transform = `translate(${offsetX}px, ${offsetY}px)`
  }

  function resetMagnet() {
    if (linkRef.current) linkRef.current.style.transform = ''
  }

  useEffect(() => { if (reduced) resetMagnet() }, [reduced])

  return (
    <a
      ref={linkRef}
      href={href}
      download={download}
      className={`closing-action closing-action--${variant}${variant === 'primary' && !reduced ? ' closing-email' : ''}`}
      style={{ transition: reduced ? 'none' : 'transform 220ms ease', willChange: reduced ? 'auto' : 'transform' }}
      onPointerMove={moveMagnetically}
      onPointerLeave={resetMagnet}
      onBlur={resetMagnet}
    >
      {children}
    </a>
  )
}

export default function Footer() {
  const reduced = useReducedMotion()
  const { theme, toggle } = useThemeContext()
  const isDark = theme === 'dark'

  return (
    <footer className={`site-footer${reduced ? ' site-footer--reduced' : ''}`}>
      <div className="site-footer__inner">

        {/* ── Closing CTA card (unchanged) ──────────────────────────────── */}
        {/* <motion.div
          className={`closing-card${reduced ? ' closing-card--static' : ''}`}
          initial={reduced ? false : { opacity: 0, scale: 0.975 }}
          whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-48px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="closing-card__wash" aria-hidden="true" />
          {!reduced && <div className="closing-card__edge" aria-hidden="true" />}
          <div className="closing-card__orb closing-card__orb--one" aria-hidden="true" />
          <div className="closing-card__orb closing-card__orb--two" aria-hidden="true" />
          <svg className="closing-card__network" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g className={reduced ? '' : 'closing-network-drift'}>
              {networkLines.map(([x1, y1, x2, y2], i) => (
                <line key={`cl-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />
              ))}
              {networkDots.map(([cx, cy], i) => (
                <circle key={`cd-${i}`} cx={cx} cy={cy} r={i % 3 === 0 ? 2.5 : 1.8} />
              ))}
            </g>
          </svg>
          <Shield className="closing-card__shield" aria-hidden="true" strokeWidth={0.8} />
          <div className="closing-card__content">
            <div className="closing-card__availability">
              <span className="closing-card__pulse" aria-hidden="true">
                <span className={reduced ? '' : 'avail-pulse'} />
                <span />
              </span>
              <span>Open to opportunities</span>
            </div>
            <h2 className="closing-card__heading">Let's build a safer digital world.</h2>
            <p className="closing-card__subline">Open to security roles, collaborations and conversations.</p>
            <div className="closing-card__actions">
              <MagneticLink href={`mailto:${siteConfig.email}`} reduced={reduced} variant="primary">
                <Mail size={17} aria-hidden="true" />
                Email me
              </MagneticLink>
              <MagneticLink href={siteConfig.resumeUrl} reduced={reduced} variant="outline" download>
                <Download size={17} aria-hidden="true" />
                Download resume
              </MagneticLink>
              <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="closing-card__linkedin">
                Connect on LinkedIn
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </motion.div> */}

        {/* ── Redesigned footer bar ─────────────────────────────────────── */}
        <div className="fbar">

          {/* Subtle network background */}
          <svg className="fbar__bg-network" viewBox="0 0 1300 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {barLines.map(([x1, y1, x2, y2], i) => (
              <line key={`bl-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />
            ))}
            {barDots.map(([cx, cy], i) => (
              <circle key={`bd-${i}`} cx={cx} cy={cy} r={i % 4 === 0 ? 2.2 : 1.5} />
            ))}
          </svg>

          {/* Top divider */}
          <div className="fbar__divider" aria-hidden="true" />

          {/* 3-column grid */}
          <div className="fbar__columns">

            {/* Col 1 — Brand */}
            <div className="fbar__brand">
              <Logo
                showSubtitle={false}
                onClick={(e) => { e.preventDefault(); scrollTo('home', reduced) }}
              />
              <p className="fbar__brand-role">Penetration Tester · Cybersecurity Analyst</p>
              <p className="fbar__brand-tagline">Building secure and resilient digital experiences.</p>
            </div>

            {/* Col 2 — Explore */}
            <div className="fbar__col">
              <p className="fbar__col-heading">Explore</p>
              <nav className="fbar__nav" aria-label="Footer navigation">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="fbar__nav-link"
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href.slice(1), reduced) }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Col 3 — Connect */}
            <div className="fbar__col">
              <p className="fbar__col-heading">Connect</p>
              <div className="fbar__connect">
                <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="fbar__connect-link">
                  <Linkedin size={15} aria-hidden="true" />
                  LinkedIn
                </a>
                <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="fbar__connect-link">
                  <Github size={15} aria-hidden="true" />
                  GitHub
                </a>
                <a href={`mailto:${siteConfig.email}`} className="fbar__connect-link">
                  <Mail size={15} aria-hidden="true" />
                  Email
                </a>
                <a href={siteConfig.resumeUrl} download className="fbar__connect-link">
                  <Download size={15} aria-hidden="true" />
                  Download Resume
                </a>
                <a href={siteConfig.medium} target="_blank" rel="noopener noreferrer" className="fbar__connect-link">
                  <BookOpen size={15} aria-hidden="true" />
                  Blog
                </a>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="fbar__bottom">
            <p className="fbar__copyright">© 2026 Jeffrey Jolly. Built with React.</p>
            <p className="fbar__location">Bhubaneswar, India</p>
            <div className="fbar__controls">
              <button
                type="button"
                className="fbar__theme-btn"
                onClick={toggle}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
