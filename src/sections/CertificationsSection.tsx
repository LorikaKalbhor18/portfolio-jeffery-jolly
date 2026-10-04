import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Trophy, Star, Shield, ChevronLeft, ChevronRight } from 'lucide-react'
import { certifications, achievements } from '@/data/content'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ── Cert card ─────────────────────────────────────────────────────────────────

function CertCard({ cert }: { cert: (typeof certifications)[number] }) {
  const certImg: Record<string, string> = {
    'eJPT': '/images/ejpt-certification.svg',
    'Ethical Hacking Associate': '/images/eha-certification..png',
    'CompTIA Security+': '/images/blob.png',
    'CRTP': '/images/crtp.png',
  }
  const img = certImg[cert.name]
  return (
    <div className="flex flex-col gap-3 p-5 rounded-card-lg bg-[var(--surface)] border border-[var(--border)] shadow-card h-full">
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-lg bg-[var(--pale-blue)] flex items-center justify-center flex-shrink-0 overflow-hidden">
          {img
            ? <img src={img} alt={cert.name} className="w-8 h-8 object-contain" />
            : <Shield size={20} className="text-[var(--primary)]" />
          }
        </div>
        {cert.inProgress ? (
          <span className="touch-auto px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/30 text-[#F59E0B] border border-amber-200 dark:border-amber-800 whitespace-nowrap">
            In progress
          </span>
        ) : (
          <span className="touch-auto px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-100 dark:bg-green-900/30 text-[#16A34A] border border-green-200 dark:border-green-800 whitespace-nowrap">
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

// ── Carousel ──────────────────────────────────────────────────────────────────

function CertCarousel() {
  const reduced = useReducedMotion()
  const total = certifications.length
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)

  const go = (next: number) => {
    setDir(next > idx ? 1 : -1)
    setIdx((next + total) % total)
  }
  const prev = () => go(idx - 1)
  const next = () => go(idx + 1)

  const variants = {
    enter: (d: number) => ({ x: d * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d: number) => ({ x: d * -60, opacity: 0 }),
  }

  if (reduced) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {certifications.map((c) => <CertCard key={c.name} cert={c} />)}
      </div>
    )
  }

  return (
    <div role="region" aria-label="Certifications carousel">
      {/* Track */}
      <div className="relative overflow-hidden rounded-card-lg" style={{ minHeight: 148 }}>
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={idx}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -40) next()
              else if (info.offset.x > 40) prev()
            }}
            className="cursor-grab active:cursor-grabbing select-none"
          >
            <CertCard cert={certifications[idx]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        {/* Prev */}
        <button
          onClick={prev}
          aria-label="Previous certification"
          className="w-9 h-9 min-w-0 min-h-0 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--body)] hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[var(--pale-blue)] transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2" aria-hidden="true">
          {certifications.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to certification ${i + 1}`}
              className={[
                'touch-auto min-w-0 min-h-0 h-2 rounded-full transition-all duration-250',
                i === idx
                  ? 'w-6 bg-[var(--primary)]'
                  : 'w-2 bg-[var(--border)] hover:bg-[var(--primary)]/50',
              ].join(' ')}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          aria-label="Next certification"
          className="w-9 h-9 min-w-0 min-h-0 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--body)] hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[var(--pale-blue)] transition-colors"
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Counter */}
      <p className="text-center text-[11px] tabular-nums text-[var(--body)] mt-2">
        {idx + 1} / {total}
      </p>
    </div>
  )
}

// ── Achievement icons ─────────────────────────────────────────────────────────

const ACHIEVEMENT_ICONS = [
  <Trophy size={18} className="text-[#F59E0B]" />,
  <Award  size={18} className="text-[var(--primary)]" />,
  <Star   size={18} className="text-[#F59E0B]" />,
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

        {/* Carousel — constrained width so it doesn't stretch full page */}
        <div className="mx-auto max-w-sm">
          <CertCarousel />
        </div>

        {/* Achievements */}
        <div className="mt-16">
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

      </div>
    </section>
  )
}
