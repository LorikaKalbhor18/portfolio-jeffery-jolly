import { useRef, useState, useId, useEffect } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion'
import {
  Briefcase, GraduationCap, ChevronDown,
  CheckCircle2, Download,
} from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useCountUp } from '@/hooks/useCountUp'
import { experience, siteConfig } from '@/data/content'

// ── Types ─────────────────────────────────────────────────────────────────────

type WorkData      = Extract<typeof experience[number], { type: 'work' }>
type EducationData = Extract<typeof experience[number], { type: 'education' }>

type TimelineItem =
  | { kind: 'education'; year: string; data: EducationData }
  | { kind: 'work';      year: string; data: WorkData; isPresent?: boolean }

// ── Timeline entries ──────────────────────────────────────────────────────────

const edu = experience.find((e) => e.type === 'education')! as EducationData
const ey  = experience.find((e) => e.type === 'work' && e.org.includes('Ernst'))! as WorkData
const tcs = experience.find((e) => e.type === 'work' && e.org.includes('Tata'))!  as WorkData

const TIMELINE: TimelineItem[] = [
  { kind: 'education', year: '2018', data: edu },
  { kind: 'work',      year: '2022', data: ey },
  { kind: 'work',      year: '2023', data: tcs, isPresent: true },
]

// ── Expanded card data ────────────────────────────────────────────────────────

const WORK_EXTRA: Record<string, { skills: string[]; metrics: string[] }> = {
  'Tata Consultancy Services': {
    skills:  ['Burp Suite', 'Tenable.io', 'InsightAppSec', 'Nmap', 'Metasploit', 'Python'],
    metrics: ['50+ web apps tested', '70+ vulnerabilities documented', '150+ hosts assessed'],
  },
  'Ernst & Young GDS': {
    skills:  ['Burp Suite', 'OWASP Top 10'],
    metrics: ['20+ apps tested', '50+ findings documented'],
  },
}

// ── Kind chip ─────────────────────────────────────────────────────────────────

function KindChip({ kind }: { kind: 'work' | 'education' }) {
  const map = {
    education: { icon: <GraduationCap size={9} strokeWidth={2} />, label: 'Education' },
    work:      { icon: <Briefcase     size={9} strokeWidth={2} />, label: 'Experience' },
  }
  const { icon, label } = map[kind]
  return (
    <span className="touch-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--pale-blue)] text-[var(--primary)] border border-[var(--border)]">
      {icon} {label}
    </span>
  )
}

// ── Work card ─────────────────────────────────────────────────────────────────

function WorkCard({
  data, isPresent, defaultOpen, reduced,
}: {
  data: WorkData; isPresent?: boolean; defaultOpen?: boolean; reduced: boolean
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  const panelId = useId()
  const extra   = WORK_EXTRA[data.org]

  const bulletVariants = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.04 } },
  }
  const bulletItem = {
    hidden: { opacity: 0, x: -8 },
    show:   { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
  }

  return (
    <motion.div
      whileHover={reduced ? {} : { y: -4, boxShadow: '0 8px 32px rgba(37,99,235,0.12)' }}
      transition={{ duration: 0.2 }}
      className={[
        'rounded-xl border overflow-hidden',
        'bg-[var(--surface)] border-[var(--border)]',
        open ? 'shadow-[0_4px_24px_rgba(37,99,235,0.10)]' : '',
      ].join(' ')}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left min-h-0"
      >
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <KindChip kind="work" />
            {isPresent && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/60">
                <span className="present-dot w-1.5 h-1.5 rounded-full bg-blue-500" />
                Present
              </span>
            )}
          </div>
          <p className="text-[16px] font-semibold text-[var(--heading)] leading-snug">{data.role}</p>
          <p className="text-[13px] font-medium text-[var(--primary)]">
            {data.org}{data.location ? ` · ${data.location}` : ''}
          </p>
          <p className="text-[12px] text-[var(--body)]">{data.period}</p>
          {!open && (
            <p className="text-[12px] text-[var(--body)] italic line-clamp-2 pt-0.5">
              {data.bullets[0]}
            </p>
          )}
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduced ? 0 : 0.22 }}
          className="flex-shrink-0 mt-1 text-[var(--primary)]"
          aria-hidden="true"
        >
          <ChevronDown size={15} strokeWidth={2} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-3 border-t border-[var(--border)] space-y-4">
              <motion.ul
                variants={reduced ? undefined : bulletVariants}
                initial={reduced ? false : 'hidden'}
                animate="show"
                className="space-y-2"
              >
                {data.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    variants={reduced ? undefined : bulletItem}
                    className="flex items-start gap-2.5 text-[13px] text-[var(--body)] leading-relaxed"
                  >
                    <CheckCircle2 size={13} strokeWidth={2} className="text-[var(--primary)] flex-shrink-0 mt-[3px]" />
                    {b}
                  </motion.li>
                ))}
              </motion.ul>
              {extra && (
                <div className="flex flex-wrap gap-1.5">
                  {extra.skills.map((s) => (
                    <span key={s} className="touch-auto px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[var(--pale-blue)] text-[var(--primary)] border border-[var(--border)]">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {extra && (
                <div className="flex flex-wrap gap-2">
                  {extra.metrics.map((m) => (
                    <span key={m} className="touch-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[var(--surface)] border border-[var(--border)] text-[var(--heading)] shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" aria-hidden="true" />
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Education card ────────────────────────────────────────────────────────────

function EducationCard({ data, reduced }: { data: EducationData; reduced: boolean }) {
  return (
    <motion.div
      whileHover={reduced ? {} : { y: -4, boxShadow: '0 8px 32px rgba(37,99,235,0.10)' }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border bg-[var(--surface)] border-[var(--border)] px-5 py-4 space-y-1.5"
    >
      <KindChip kind="education" />
      <p className="text-[16px] font-semibold text-[var(--heading)] leading-snug">{data.role}</p>
      <p className="text-[13px] font-medium text-[var(--primary)]">{data.org}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-[12px] text-[var(--body)]">{data.period}</p>
        {data.detail && (
          <>
            <span className="text-[var(--border)]" aria-hidden="true">·</span>
            <p className="text-[12px] text-[var(--body)]">{data.detail}</p>
          </>
        )}
      </div>
    </motion.div>
  )
}

// ── Left column stat ──────────────────────────────────────────────────────────

function StatNum({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value, 1200)
  return (
    <div ref={ref} className="text-center">
      <p className="text-2xl font-extrabold text-[var(--primary)] leading-none tabular-nums">
        {count}{suffix}
      </p>
      <p className="text-[11px] text-[var(--body)] mt-0.5">{label}</p>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

const RAIL_CENTER_MOBILE  = 20
const RAIL_CENTER_DESKTOP = 108
const NODE_HALF           = 28

export default function ExperienceSection() {
  const reduced = useReducedMotion()

  const timelineRef = useRef<HTMLDivElement>(null)
  const nodeRefs    = useRef<(HTMLDivElement | null)[]>([])

  const [nodesFilled, setNodesFilled] = useState<boolean[]>(TIMELINE.map(() => false))

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 20%'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  })

  const lineScaleY = useTransform(smoothProgress, [0, 1], [0, 1])

  useEffect(() => {
    const computeThresholds = (): number[] => {
      const container = timelineRef.current
      if (!container) return TIMELINE.map(() => 0)
      const containerTop = container.getBoundingClientRect().top + window.scrollY
      const containerH   = container.scrollHeight
      if (containerH === 0) return TIMELINE.map(() => 0)
      return nodeRefs.current.map((el) => {
        if (!el) return 0
        const elTop      = el.getBoundingClientRect().top + window.scrollY
        const nodeCenter = elTop - containerTop + el.offsetHeight / 2
        return nodeCenter / containerH
      })
    }

    let thresholds = computeThresholds()
    const ro = new ResizeObserver(() => { thresholds = computeThresholds() })
    if (timelineRef.current) ro.observe(timelineRef.current)

    const unsub = smoothProgress.on('change', (v) => {
      setNodesFilled(thresholds.map((t) => v >= t))
    })

    return () => { ro.disconnect(); unsub() }
  }, [smoothProgress])

  return (
    <section id="experience" className="py-24 bg-[var(--bg)]">
      <style>{`
        @keyframes present-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
        .present-dot { animation: present-pulse 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .present-dot { animation: none; } }
        @keyframes node-ring-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.45); }
          60%       { box-shadow: 0 0 0 7px rgba(37,99,235,0); }
        }
        .node-present-pulse { animation: node-ring-pulse 2.2s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) { .node-present-pulse { animation: none; } }
        @keyframes node-next-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(91,155,255,0.35); }
          60%       { box-shadow: 0 0 0 6px rgba(91,155,255,0); }
        }
        .node-next-pulse { animation: node-next-pulse 3s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) { .node-next-pulse { animation: none; } }
      `}</style>

      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <div className="grid lg:grid-cols-[4fr_8fr] gap-12 lg:gap-16 items-start">

          {/* ── Left sticky column ── */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">
                Experience
              </p>
              <h2
                className="font-bold text-[var(--heading)] leading-snug"
                style={{ fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.25rem)' }}
              >
                My journey<br className="hidden lg:block" /> so far
              </h2>
            </motion.div>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[14px] text-[var(--body)] leading-relaxed"
            >
              From computer science foundations to hands-on penetration testing across enterprise environments.
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-6 items-center"
            >
              <StatNum value={4} suffix="+" label="Years" />
              <div className="w-px h-8 bg-[var(--border)]" aria-hidden="true" />
              <StatNum value={2} suffix="" label="Companies" />
            </motion.div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <a
                href={siteConfig.resumeUrl}
                download
                className="btn-shine inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-[var(--primary)] text-[var(--primary)] font-semibold text-sm hover:bg-[var(--pale-blue)] active:scale-[0.97] transition-all"
              >
                <Download size={14} strokeWidth={2} />
                Download resume
              </a>
            </motion.div>
          </div>

          {/* ── Right timeline column ── */}
          <div ref={timelineRef} className="relative">

            {/* Grey base track */}
            <div
              className="absolute lg:hidden pointer-events-none bg-[var(--border)]"
              style={{ left: RAIL_CENTER_MOBILE - 1, width: 2, top: NODE_HALF, bottom: NODE_HALF, zIndex: 0 }}
              aria-hidden="true"
            />
            <div
              className="absolute hidden lg:block pointer-events-none bg-[var(--border)]"
              style={{ left: RAIL_CENTER_DESKTOP - 1, width: 2, top: NODE_HALF, bottom: NODE_HALF, zIndex: 0 }}
              aria-hidden="true"
            />

            {/* Blue animated fill */}
            {!reduced && (
              <>
                <motion.div
                  className="absolute lg:hidden pointer-events-none origin-top"
                  style={{
                    left: RAIL_CENTER_MOBILE - 1, width: 2,
                    top: NODE_HALF, bottom: NODE_HALF,
                    scaleY: lineScaleY, zIndex: 1,
                    background: 'linear-gradient(to bottom, var(--primary), color-mix(in srgb, var(--primary) 40%, transparent))',
                  }}
                  aria-hidden="true"
                />
                <motion.div
                  className="absolute hidden lg:block pointer-events-none origin-top"
                  style={{
                    left: RAIL_CENTER_DESKTOP - 1, width: 2,
                    top: NODE_HALF, bottom: NODE_HALF,
                    scaleY: lineScaleY, zIndex: 1,
                    background: 'linear-gradient(to bottom, var(--primary), color-mix(in srgb, var(--primary) 40%, transparent))',
                  }}
                  aria-hidden="true"
                />
              </>
            )}

            {/* Timeline rows */}
            <div className="space-y-6">
              {TIMELINE.map((item, i) => {
                const isLast    = i === TIMELINE.length - 1
                const isPresent = item.kind === 'work' && (item as { isPresent?: boolean }).isPresent
                const filled    = nodesFilled[i]

                const nodeBase = [
                  'w-14 h-14 rounded-full border-2',
                  'flex items-center justify-center',
                  'transition-colors duration-300',
                  'bg-[var(--bg)]',
                ].join(' ')

                const nodeClass = isLast
                  ? `${nodeBase} border-dashed ${
                      filled
                        ? 'border-[var(--primary)]/70 text-[var(--primary)]'
                        : 'border-[var(--primary)]/40 text-[var(--primary)]/50'
                    }${reduced ? '' : ' node-next-pulse'}`
                  : filled
                    ? `${nodeBase} border-[var(--primary)] !bg-[var(--primary)] text-white${
                        isPresent && !reduced ? ' node-present-pulse' : ''
                      }`
                    : `${nodeBase} border-[var(--primary)]/40 text-[var(--primary)]/50`

                return (
                  <motion.div
                    key={i}
                    initial={reduced ? false : { opacity: 0, x: 32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{
                      duration: 0.45,
                      delay: reduced ? 0 : i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="grid items-start gap-x-4 [grid-template-columns:40px_1fr] lg:[grid-template-columns:64px_56px_1fr]"
                  >
                    {/* Year label — desktop only */}
                    <div className="hidden lg:flex items-center justify-end h-14" aria-hidden="true">
                      <span
                        className="text-[11px] font-semibold tabular-nums whitespace-nowrap leading-none transition-colors duration-300"
                        style={{ color: filled ? 'var(--heading)' : 'var(--body)' }}
                      >
                        {item.year}
                      </span>
                    </div>

                    {/* Rail cell */}
                    <div className="flex items-start justify-center" style={{ zIndex: 2 }}>
                      <motion.div
                        ref={(el) => { nodeRefs.current[i] = el }}
                        initial={reduced ? false : { scale: 0.6, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{
                          duration: 0.3,
                          delay: reduced ? 0 : i * 0.08 + 0.12,
                          type: 'spring',
                          stiffness: 300,
                          damping: 18,
                        }}
                        className={nodeClass}
                        aria-hidden="true"
                      >
                        {item.kind === 'education' && <GraduationCap size={16} strokeWidth={2} />}
                        {item.kind === 'work'      && <Briefcase      size={16} strokeWidth={2} />}
                      </motion.div>
                    </div>

                    {/* Card */}
                    <div className="min-w-0 pb-2">
                      {item.kind === 'education' && (
                        <EducationCard data={item.data} reduced={reduced} />
                      )}
                      {item.kind === 'work' && (
                        <WorkCard
                          data={item.data}
                          isPresent={(item as { isPresent?: boolean }).isPresent}
                          defaultOpen={(item as { isPresent?: boolean }).isPresent}
                          reduced={reduced}
                        />
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
