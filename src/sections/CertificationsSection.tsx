import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Award, Trophy, Star, Shield } from 'lucide-react'
import { certifications, achievements } from '@/data/content'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ── Cert card ─────────────────────────────────────────────────────────────────

function CertCard({ cert }: { cert: (typeof certifications)[number] }) {
  return (
    <div className="flex-none w-64 sm:w-72 flex flex-col gap-3 p-5 rounded-card-lg bg-[var(--surface)] border border-[var(--border)] shadow-card select-none">
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-lg bg-[var(--pale-blue)] flex items-center justify-center flex-shrink-0">
          <Shield size={20} className="text-[var(--primary)]" />
        </div>
        {cert.inProgress ? (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/30 text-[#F59E0B] border border-amber-200 dark:border-amber-800 whitespace-nowrap">
            In progress
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-100 dark:bg-green-900/30 text-[#16A34A] border border-green-200 dark:border-green-800 whitespace-nowrap">
            Certified
          </span>
        )}
      </div>
      <div>
        <p className="font-bold text-[var(--heading)] leading-snug">{cert.name}</p>
        <p className="text-sm text-[var(--primary)] font-medium mt-0.5">{cert.issuer}</p>
        <p className="text-xs text-[var(--body)] mt-1">{cert.year}</p>
      </div>
    </div>
  )
}

// ── Auto-scroll carousel ──────────────────────────────────────────────────────

function CertCarousel() {
  const reduced = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const rafRef = useRef<number>(0)
  const posRef = useRef(0)

  // Duplicate cards for seamless loop
  const doubled = [...certifications, ...certifications]

  const scroll = useCallback(() => {
    const track = trackRef.current
    if (!track || paused) {
      rafRef.current = requestAnimationFrame(scroll)
      return
    }
    posRef.current += 0.5
    const half = track.scrollWidth / 2
    if (posRef.current >= half) posRef.current = 0
    track.style.transform = `translateX(-${posRef.current}px)`
    rafRef.current = requestAnimationFrame(scroll)
  }, [paused])

  useEffect(() => {
    if (reduced) return
    rafRef.current = requestAnimationFrame(scroll)
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafRef.current)
      else rafRef.current = requestAnimationFrame(scroll)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced, scroll])

  const pause = () => setPaused(true)
  const resume = () => setPaused(false)

  return (
    <div
      role="region"
      aria-label="Certifications carousel"
      className="overflow-hidden"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      {reduced ? (
        // Static grid for reduced motion
        <div className="flex flex-wrap gap-4 justify-center px-4">
          {certifications.map((c) => <CertCard key={c.name} cert={c} />)}
        </div>
      ) : (
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[var(--bg-alt)] to-transparent pointer-events-none" aria-hidden="true" />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-[var(--bg-alt)] to-transparent pointer-events-none" aria-hidden="true" />
          <div
            ref={trackRef}
            className="flex gap-4 py-2 will-change-transform"
            style={{ width: 'max-content' }}
          >
            {doubled.map((cert, i) => (
              <CertCard key={`${cert.name}-${i}`} cert={cert} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Achievement icons ─────────────────────────────────────────────────────────

const ACHIEVEMENT_ICONS = [
  <Trophy size={18} className="text-[#F59E0B]" />,
  <Award size={18} className="text-[var(--primary)]" />,
  <Star size={18} className="text-[#F59E0B]" />,
]
const ACHIEVEMENT_BG = [
  'bg-amber-100 dark:bg-amber-900/30',
  'bg-[var(--pale-blue)]',
  'bg-amber-100 dark:bg-amber-900/30',
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function CertificationsSection() {
  const reduced = useReducedMotion()

  return (
    <section id="certifications" className="py-20 bg-[var(--bg-alt)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-2">
            Credentials
          </p>
          <h2 className="text-section font-bold text-[var(--heading)]">
            Certifications & achievements
          </h2>
        </div>
      </div>

      {/* Cert carousel — full bleed */}
      <CertCarousel />

      {/* Achievements */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--body)] mb-6 text-center">
          Highlights
        </p>
        <motion.div
          variants={reduced ? undefined : container}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid sm:grid-cols-3 gap-4"
        >
          {achievements.map((a, i) => (
            <motion.div
              key={a.title}
              variants={reduced ? undefined : item}
              className="flex flex-col gap-3 p-5 rounded-card-lg bg-[var(--surface)] border border-[var(--border)] shadow-card"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${ACHIEVEMENT_BG[i]}`}>
                {ACHIEVEMENT_ICONS[i]}
              </div>
              <p className="font-bold text-[var(--heading)] text-sm leading-snug">{a.title}</p>
              <p className="text-xs text-[var(--body)] leading-relaxed">{a.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
