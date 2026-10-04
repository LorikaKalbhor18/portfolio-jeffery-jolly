import { useEffect, useRef, useState, useCallback } from 'react'
import { Download, ArrowRight, Shield, CheckCircle, Star } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { hero, siteConfig } from '@/data/content'
import { useTypewriter } from '@/hooks/useTypewriter'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import StatsRow from '@/components/StatsRow'

// ── Constants ────────────────────────────────────────────────────────────────

const CHIPS = ['Web', 'API', 'Mobile', 'AI/LLM', 'Cloud', 'Network']

// Tailwind class positions so chips can be repositioned per breakpoint.
// Base = small screens (photo is 260px wide, so keep them close to the frame),
// sm = tablet, lg = desktop (photo is 340px wide, allow them to overhang).
const CHIP_POSITIONS: string[] = [
  'top-[0%] left-[-2%] sm:top-[1%] sm:left-[-5%] lg:top-[2%] lg:left-[-3%]',
  'top-[0%] right-[-2%] sm:top-[18%] sm:right-[-5%] lg:top-[3%] lg:right-[-1%]',
  'top-[36%] left-[-6%] sm:top-[36%] sm:left-[-9%] lg:top-[36%] lg:left-[-11%]',
  'top-[28%] right-[-3%] sm:top-[28%] sm:right-[-7%] lg:top-[28%] lg:right-[-9%]',
  'top-[72%] left-[-8%] sm:top-[72%] sm:left-[-8%] lg:top-[72%] lg:left-[-9%]',
  'top-[66%] right-[-3%] sm:top-[66%] sm:right-[-7%] lg:top-[66%] lg:right-[-9%]',

]

const TRUST_BADGES = [
  { label: 'eJPT',           icon: <Shield    size={11} strokeWidth={2} /> },
  { label: 'Security+',      icon: <Shield    size={11} strokeWidth={2} /> },
  { label: 'EC-Council EHA', icon: <CheckCircle size={11} strokeWidth={2} /> },
  { label: 'Star of the Year ×2', icon: <Star size={11} strokeWidth={2} /> },
]

// Generic live-finding cards — no client details
const FINDING_CARDS = [
  {
    id: 'f1',
    title: 'IDOR — Object Reference',
    severity: 'High',
    severityColor: 'bg-red-500/15 text-red-500 border-red-500/30',
    endpoint: '/api/v1/users/{id}',
    offset: 'bottom-[-6%] left-[-16%] sm:bottom-[-16%] sm:left-[-16%] lg:bottom-[-18%] lg:left-[-24%]',
    delay: 0,
  },
  {
    id: 'f2',
    title: 'Missing Rate Limiting',
    severity: 'Medium',
    severityColor: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
    endpoint: '/api/v1/auth/login',
    offset: 'bottom-[-6%] right-[-18%] sm:bottom-[-16%] sm:right-[-18%] lg:bottom-[-18%] lg:right-[-26%]',
    delay: 1.4,
  },
]

// Headline word arrays
const headlineWords1 = hero.headlineLine1.split(' ')
const headlineWords2 = hero.headlineLine2.split(' ')

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
}
const wordVariant = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const } },
}

// ── Live finding card ────────────────────────────────────────────────────────

function FindingCard({
  title,
  severity,
  severityColor,
  endpoint,
  offset,
  delay,
  reduced,
}: (typeof FINDING_CARDS)[0] & { reduced: boolean }) {
  // 'scanning' → brief 'leaving' crossfade → 'found'
  const [phase, setPhase] = useState<'scanning' | 'leaving' | 'found'>(
    reduced ? 'found' : 'scanning',
  )
  const [dots, setDots] = useState('.')

  useEffect(() => {
    if (reduced) return
    const dotTimer = setInterval(() => setDots((d) => (d.length >= 3 ? '.' : d + '.')), 400)
    // After scan duration, fade out scanning state first
    const leaveTimer = setTimeout(() => {
      clearInterval(dotTimer)
      setPhase('leaving')
    }, 2200 + delay * 1000)
    return () => { clearInterval(dotTimer); clearTimeout(leaveTimer) }
  }, [reduced, delay])

  // Once 'leaving' opacity-out finishes (180ms), flip to 'found'
  useEffect(() => {
    if (phase !== 'leaving') return
    const t = setTimeout(() => setPhase('found'), 180)
    return () => clearTimeout(t)
  }, [phase])

  return (
    <motion.div
      className={`absolute z-20 max-sm:hidden w-[140px] sm:w-[168px] rounded-xl bg-[var(--surface)]/95 border border-[var(--border)] shadow-card-hover backdrop-blur-sm p-2 sm:p-3 ${offset}`}
      initial={reduced ? false : { opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: reduced ? 0 : delay + 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header row — state labels occupy the same cell */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse flex-shrink-0" />
        <span className="grid text-[10px] font-semibold text-[var(--body)] uppercase tracking-wide">
          <motion.span
            className="col-start-1 row-start-1"
            animate={{ opacity: phase === 'scanning' ? 1 : 0 }}
            aria-hidden={phase !== 'scanning'}
          >
            Scanning
          </motion.span>
          <motion.span
            className="col-start-1 row-start-1"
            animate={{ opacity: phase === 'found' ? 1 : 0 }}
            aria-hidden={phase !== 'found'}
          >
            Finding
          </motion.span>
        </span>
      </div>

      <div className="grid">
        <motion.div
          animate={{ opacity: phase === 'scanning' ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          className="col-start-1 row-start-1 space-y-1"
          aria-hidden={phase !== 'scanning'}
        >
          <p className="text-[11px] text-[var(--body)] font-mono">{dots}</p>
        </motion.div>

        <motion.div
          animate={{ opacity: phase === 'found' ? 1 : 0 }}
          transition={{ duration: 0.22 }}
          className="col-start-1 row-start-1 space-y-1.5"
          aria-hidden={phase !== 'found'}
        >
          <p className="text-[11px] font-semibold text-[var(--heading)] leading-tight">{title}</p>
          <p className="text-[10px] text-[var(--body)] font-mono truncate">{endpoint}</p>
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${severityColor}`}
          >
            {severity}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function HeroSection() {
  const reduced = useReducedMotion()
  const typed = useTypewriter(reduced ? [] : hero.roles, 70, 1800, 40)
  const [caretVisible, setCaretVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)

  // Parallax on photo
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 50])

  // Blinking caret
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setCaretVisible((v) => !v), 530)
    return () => clearInterval(id)
  }, [reduced])

  // Hide scroll cue after first scroll
  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 40) setScrolled(true) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cursor tilt on photo (desktop only, hover:hover media)
  const tiltRef = useRef({ x: 0, y: 0 })
  const rafTilt = useRef<number>(0)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return
    const el = photoRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    tiltRef.current = {
      x: ((e.clientY - cy) / (rect.height / 2)) * 6,
      y: -((e.clientX - cx) / (rect.width / 2)) * 6,
    }
    cancelAnimationFrame(rafTilt.current)
    rafTilt.current = requestAnimationFrame(() => {
      if (photoRef.current) {
        photoRef.current.style.transform =
          `perspective(800px) rotateX(${tiltRef.current.x}deg) rotateY(${tiltRef.current.y}deg)`
      }
    })
  }, [reduced])

  const onMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafTilt.current)
    if (photoRef.current) {
      photoRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
    }
  }, [])

  const scrollToWork = () => {
    const el = document.getElementById('projects')
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center pt-[88px] pb-10 overflow-hidden"
    >
      {/* ── Main content container — matches navbar max-width + padding ── */}
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-10 lg:gap-8 items-center">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-4 order-2 lg:order-1">

            {/* Availability pill */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="flex items-center gap-2 w-fit"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[12px] font-medium text-[var(--body)]">
                Open to opportunities
              </span>
            </motion.div>

            {/* Eyebrow */}
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="text-[11px] font-semibold uppercase tracking-widest text-[var(--primary)]"
            >
              {hero.eyebrow}
            </motion.p>

            {/* Headline */}
            <motion.h1
              variants={reduced ? undefined : containerVariants}
              initial={reduced ? false : 'hidden'}
              animate="show"
              className="font-extrabold text-[var(--heading)] tracking-tight leading-[1.08]"
              style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
              aria-label={`${hero.headlineLine1} ${hero.headlineLine2}`}
            >
              <span className="block">
                {headlineWords1.map((w, i) => (
                  <motion.span
                    key={i}
                    variants={reduced ? undefined : wordVariant}
                    className="inline-block mr-[0.22em]"
                  >
                    {w}
                  </motion.span>
                ))}
              </span>
              {/* Line 2 — blue + shimmer */}
              <span className="block relative overflow-hidden">
                {headlineWords2.map((w, i) => (
                  <motion.span
                    key={i}
                    variants={reduced ? undefined : wordVariant}
                    className="inline-block mr-[0.22em] text-[var(--primary)]"
                  >
                    {w}
                  </motion.span>
                ))}
                {!reduced && (
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    initial={{ x: '-100%' }}
                    animate={{ x: '220%' }}
                    transition={{ duration: 1.0, delay: 1.1, ease: 'easeInOut' }}
                    style={{
                      background:
                        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.32) 50%, transparent 100%)',
                    }}
                  />
                )}
              </span>
            </motion.h1>

            {/* Role line: "I'm a [typed role]" */}
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.4 }}
              className="flex items-center gap-2 h-8"
              aria-live="polite"
              aria-label={`I'm a ${reduced ? hero.roles[0] : typed}`}
            >
              <span className="text-[17px] sm:text-[19px] font-medium text-[var(--body)]">
                I'm a
              </span>
              <span className="text-[17px] sm:text-[19px] font-semibold text-[var(--primary)]">
                {reduced ? hero.roles[0] : typed}
              </span>
              {!reduced && (
                <span
                  className={[
                    'inline-block w-[2px] h-5 bg-[var(--primary)] rounded-full transition-opacity duration-100',
                    caretVisible ? 'opacity-100' : 'opacity-0',
                  ].join(' ')}
                  aria-hidden="true"
                />
              )}
            </motion.div>

            {/* Subline */}
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.5 }}
              className="text-[15px] sm:text-[16px] text-[var(--body)] leading-relaxed max-w-[520px]"
            >
              {hero.subline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.45 }}
              className="flex flex-wrap gap-3 pt-1"
            >
              <button
                onClick={scrollToWork}
                className="btn-shine inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--btn-dark)] text-white dark:text-[var(--bg)] font-semibold text-sm hover:opacity-90 active:scale-[0.97] transition-all"
              >
                {hero.ctaPrimary}
                <ArrowRight size={15} strokeWidth={2} />
              </button>
              <a
                href={siteConfig.resumeUrl}
                download
                className="btn-shine inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[var(--primary)] text-[var(--primary)] font-semibold text-sm hover:bg-[var(--pale-blue)] active:scale-[0.97] transition-all"
              >
                <Download size={15} strokeWidth={2} />
                {hero.ctaSecondary}
              </a>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25, duration: 0.4 }}
              className="flex flex-wrap items-center gap-2 pt-0.5"
            >
              <span className="text-[11px] text-[var(--body)] mr-1">Credentials &amp; recognition:</span>
              {TRUST_BADGES.map((b) => (
                <span
                  key={b.label}
                  className="touch-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--surface)] border border-[var(--border)] text-[var(--body)] shadow-sm"
                >
                  <span className="text-[var(--primary)]">{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Right column — photo ── */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center order-1 lg:order-2"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          >
            {/* Outer glow ring */}
            <div
              className="absolute rounded-full bg-[var(--primary)]/10 dark:bg-[var(--primary)]/8 blur-3xl"
              style={{ width: '110%', height: '110%' }}
              aria-hidden="true"
            />

            {/* Float wrapper */}
            <motion.div
              style={{ y: imageY }}
              animate={reduced ? {} : { y: [0, -12, 0] }}
              transition={reduced ? {} : { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 w-[260px] h-[300px] sm:w-[300px] sm:h-[340px] lg:w-[340px] lg:h-[390px]"
            >
              {/* Tilt wrapper */}
              <div
                ref={photoRef}
                className="relative w-full h-full"
                style={{ transition: 'transform 0.15s ease-out', willChange: 'transform' }}
              >
                {/* Blue gradient background behind arch */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-[#2563EB]/40 via-[#2563EB]/20 to-transparent dark:from-[#5B9BFF]/30 dark:via-[#5B9BFF]/12 dark:to-transparent"
                  style={{ borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%' }}
                  aria-hidden="true"
                />
                {/* Dark-mode shoulder glow */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-2/5 opacity-0 dark:opacity-100 blur-2xl"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 100%, rgba(91,155,255,0.28) 0%, transparent 70%)',
                  }}
                  aria-hidden="true"
                />

                {/* Arch photo frame */}
                <div
                  className="relative w-full h-full overflow-hidden bg-[var(--pale-blue)] border border-[var(--border)]/60 shadow-card-hover"
                  style={{ borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%' }}
                >
                  <img
                    src="/images/jeffrey-hero.webp"
                    width={1309}
                    height={1202}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    alt="Illustrated portrait of Jeffrey Jolly, penetration tester and cybersecurity analyst"
                    className="hero-portrait absolute bottom-0 left-1/2 h-[92%] w-auto max-h-[92%] max-w-full -translate-x-1/2 object-contain object-bottom"
                    onError={(e) => {
                      const t = e.currentTarget
                      t.style.display = 'none'
                      const parent = t.parentElement
                      if (parent && !parent.querySelector('.hero-placeholder')) {
                        const div = document.createElement('div')
                        div.className =
                          'hero-placeholder absolute inset-0 flex flex-col items-center justify-end pb-8 gap-2'
                        div.innerHTML = `
                          <div style="width:90px;height:90px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(37,99,235,0.3);">
                            <span style="color:white;font-size:30px;font-weight:800;">JJ</span>
                          </div>
                        `
                        parent.appendChild(div)
                      }
                    }}
                  />
                </div>

                {/* Skill chips */}
                {CHIPS.map((chip, i) => (
                  <motion.span
                    key={chip}
                    className={`absolute z-30 touch-auto px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--surface)] border-2 border-[var(--primary)] text-[var(--primary)] shadow-card whitespace-nowrap ${CHIP_POSITIONS[i]}`}
                    animate={reduced ? {} : {
                      y: [0, i % 2 === 0 ? -7 : 7, 0],
                      rotate: [0, i % 2 === 0 ? 1.5 : -1.5, 0],
                    }}
                    transition={reduced ? {} : {
                      duration: 3.2 + i * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.35,
                    }}
                  >
                    {chip}
                  </motion.span>
                ))}

                {/* Live finding cards */}
                {FINDING_CARDS.map((card) => (
                  <FindingCard key={card.id} {...card} reduced={reduced} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.55 }}
          className="mt-10 lg:mt-12"
        >
          <StatsRow />
        </motion.div>
      </div>

      {/* Scroll cue — fades out after 40px scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: reduced ? 0 : 0.4, delay: scrolled ? 0 : 1.9 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-widest text-[var(--body)]/70">Scroll</span>
        <motion.svg
          width="20" height="20" viewBox="0 0 20 20" fill="none"
          animate={reduced ? {} : { y: [0, 5, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M4 7l6 6 6-6"
            stroke="var(--primary)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    </section>
  )
}
