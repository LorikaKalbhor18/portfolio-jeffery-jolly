import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Puzzle, BookOpen, Target, Users,
  Download, ArrowRight,
} from 'lucide-react'
import { about, siteConfig } from '@/data/content'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ── Icon maps ────────────────────────────────────────────────────────────────

const VALUE_ICONS: Record<string, React.ReactNode> = {
  Puzzle:   <Puzzle   size={17} strokeWidth={1.75} />,
  BookOpen: <BookOpen size={17} strokeWidth={1.75} />,
  Target:   <Target   size={17} strokeWidth={1.75} />,
  Users:    <Users    size={17} strokeWidth={1.75} />,
}

// ── Framer variants ──────────────────────────────────────────────────────────

const textContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}
const cardStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const cardItem = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
}
const glanceContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const glanceRow = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
}

// ── Component ────────────────────────────────────────────────────────────────

export default function AboutSection() {
  const reduced = useReducedMotion()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreContentId = useId()

  const scrollToContact = () => {
    const el = document.getElementById('contact')
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' })
  }

  return (
    <section id="about" className="py-24 bg-[var(--bg-alt)]">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <div className="grid lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-start">

          {/* ── Photo column ── */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:sticky lg:top-24 lg:self-start lg:justify-start"
          >
            <div className="relative w-full max-w-[340px]">

              {/* Photo card */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[var(--pale-blue)] border-2 border-[var(--primary)]/30 shadow-card-hover">
                <img
                  src="/images/jeffrey-about.png"
                  alt="Illustrated portrait of Jeffrey Jolly standing in front of a flower wall"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const t = e.currentTarget
                    t.style.display = 'none'
                    const parent = t.parentElement
                    if (parent && !parent.querySelector('.about-ph')) {
                      const div = document.createElement('div')
                      div.className = 'about-ph absolute inset-0 flex flex-col items-center justify-center gap-3'
                      div.innerHTML = `
                        <div style="width:88px;height:88px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(37,99,235,0.25);">
                          <span style="color:white;font-size:28px;font-weight:800;">JJ</span>
                        </div>
                        <span style="color:var(--body);font-size:11px;letter-spacing:0.05em;">Portrait unavailable</span>
                      `
                      parent.appendChild(div)
                    }
                  }}
                />
              </div>

              <motion.div
                variants={reduced ? undefined : glanceContainer}
                initial={reduced ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="mt-6 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-card"
              >
                <h3 className="mb-3 text-sm font-bold text-[var(--heading)]">At a glance</h3>
                <div className="space-y-2.5">
                  {about.chipGroups.map((group) => (
                    <motion.div key={group.label} variants={reduced ? undefined : glanceRow} className="space-y-1.5">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--body)]">
                        {group.label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.chips.map((chip) => (
                          <span
                            key={chip}
                            className="touch-auto inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-alt)] px-3 py-1.5 text-[12px] font-medium text-[var(--body)]"
                          >
                            {group.label === 'Status' && (
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                            )}
                            {chip}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Text column ── */}
          <motion.div
            variants={reduced ? undefined : textContainer}
            initial={reduced ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="space-y-5"
          >
            {/* Eyebrow + headline */}
            <motion.div variants={reduced ? undefined : fadeUp}>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">
                {about.eyebrow}
              </p>
              <h2
                className="font-bold text-[var(--heading)] leading-snug"
                style={{ fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.25rem)' }}
              >
                {about.heading}{' '}
                <span className="block text-[var(--primary)]">{about.headingBlue}</span>
              </h2>
            </motion.div>

            <motion.p
              variants={reduced ? undefined : fadeUp}
              className="text-base sm:text-lg font-medium text-[var(--body)] leading-relaxed"
            >
              {about.lead}
            </motion.p>

            {/* Paragraphs */}
            {about.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                variants={reduced ? undefined : fadeUp}
                className="text-[15px] text-[var(--body)] leading-relaxed"
              >
                {p}
              </motion.p>
            ))}

            <motion.div variants={reduced ? undefined : fadeUp}>
              <button
                type="button"
                aria-expanded={moreOpen}
                aria-controls={moreContentId}
                onClick={() => setMoreOpen((open) => !open)}
                className="text-sm font-semibold text-[var(--primary)] hover:underline focus-visible:underline"
              >
                {moreOpen ? about.showLessLabel : about.readMoreLabel}
              </button>
              <motion.div
                id={moreContentId}
                aria-hidden={!moreOpen}
                initial={false}
                animate={{ height: moreOpen ? 'auto' : 0, opacity: moreOpen ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-5 pt-4">
                  {about.moreParagraphs.map((p, i) => (
                    <motion.p
                      key={p}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: moreOpen ? 1 : 0, y: moreOpen ? 0 : 8 }}
                      transition={{ duration: reduced ? 0 : 0.22, delay: reduced || !moreOpen ? 0 : i * 0.07 }}
                      className="text-[15px] text-[var(--body)] leading-relaxed"
                    >
                      {p}
                    </motion.p>
                  ))}
                  <a
                    href="#blog"
                    tabIndex={moreOpen ? 0 : -1}
                    className="inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                  >
                    {about.latestArticlesLabel}
                  </a>
                </div>
              </motion.div>
            </motion.div>

            {/* Value cards */}
            <motion.div
              variants={reduced ? undefined : cardStagger}
              className="grid grid-cols-2 items-stretch gap-2.5"
            >
              {about.values.map((v) => (
                <motion.div
                  key={v.label}
                  variants={reduced ? undefined : cardItem}
                  whileHover={reduced ? {} : { boxShadow: '0 8px 28px rgba(37,99,235,0.13)' }}
                  className="flex h-full flex-col gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-card cursor-default"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[var(--pale-blue)] flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                      {VALUE_ICONS[v.icon]}
                    </div>
                    <span className="text-[13px] font-semibold text-[var(--heading)]">{v.label}</span>
                  </div>
                  <p className="text-[12px] text-[var(--body)] leading-snug pl-9">{v.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              variants={reduced ? undefined : fadeUp}
              className="flex flex-wrap gap-3 pt-1"
            >
              <a
                href={siteConfig.resumeUrl}
                download
                className="btn-shine inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[var(--primary)] text-[var(--primary)] font-semibold text-sm hover:bg-[var(--pale-blue)] active:scale-[0.97] transition-all"
              >
                <Download size={15} strokeWidth={2} />
                {about.downloadLabel}
              </a>
              <button
                onClick={scrollToContact}
                className="btn-shine inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--btn-dark)] text-white dark:text-[var(--bg)] font-semibold text-sm hover:opacity-90 active:scale-[0.97] transition-all"
              >
                {about.contactLabel}
                <ArrowRight size={15} strokeWidth={2} />
              </button>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
