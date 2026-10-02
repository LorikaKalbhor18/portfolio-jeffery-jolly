import { motion } from 'framer-motion'
import { Award, Shield } from 'lucide-react'
import { featuredProject } from '@/data/content'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const CHIP_POSITIONS = [
  { top: '10%',  left: '-22%',  delay: 0 },
  { top: '32%',  right: '-24%', delay: 0.4 },
  { top: '58%',  left: '-26%',  delay: 0.8 },
  { top: '78%',  right: '-20%', delay: 1.2 },
]

export default function FeaturedSection() {
  const reduced = useReducedMotion()

  return (
    <section className="py-20 px-4 sm:px-6 bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-2">
            Featured work
          </p>
          <h2 className="text-section font-bold text-[var(--heading)]">
            Case study
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--pale-blue)] border border-[var(--border)]">
              <Shield size={13} className="text-[var(--primary)]" />
              <span className="text-xs font-semibold text-[var(--primary)]">
                {featuredProject.subtitle}
              </span>
            </div>

            <h3 className="text-section font-bold text-[var(--heading)] leading-snug">
              {featuredProject.title}
            </h3>

            <p className="text-[var(--body)] leading-relaxed">
              {featuredProject.description}
            </p>

            {/* Control area chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {featuredProject.chips.map((chip) => (
                <span
                  key={chip}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--pale-blue)] text-[var(--primary)] border border-[var(--border)]"
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* Client recognition badge */}
            <div className="flex items-start gap-3 p-4 rounded-card bg-[var(--bg-alt)] border border-[var(--border)]">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Award size={16} className="text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--heading)]">Client recognition</p>
                <p className="text-xs text-[var(--body)] mt-0.5">
                  Received client appreciation for the onsite assessment and security findings.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — iPad mockup */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              {/* Backdrop glow */}
              <div
                className="absolute inset-0 rounded-full bg-[var(--primary)]/10 blur-3xl scale-90"
                aria-hidden="true"
              />

              {/* iPad frame */}
              <motion.div
                animate={reduced ? {} : { y: [0, -8, 0] }}
                transition={reduced ? {} : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
                aria-label="iPad mockup representing the Electronic Flight Bag assessment"
              >
                {/* Outer shell */}
                <div className="relative w-56 sm:w-64 bg-[#1C1C1E] rounded-[2.2rem] p-2.5 shadow-2xl border border-[#3A3A3C]">
                  {/* Camera bar */}
                  <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-[#3A3A3C]" aria-hidden="true" />
                  {/* Screen */}
                  <div className="rounded-[1.6rem] overflow-hidden bg-[#0A0A0F] aspect-[3/4] flex flex-col">
                    {/* Status bar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-[#0A0A0F]">
                      <span className="text-[9px] text-white/60 font-medium">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-1.5 rounded-sm border border-white/40 relative">
                          <div className="absolute inset-[1px] right-[2px] bg-green-400 rounded-sm" />
                        </div>
                      </div>
                    </div>
                    {/* Screen content */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 pb-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center">
                        <Shield size={22} className="text-[var(--primary)]" />
                      </div>
                      <p className="text-white text-[11px] font-semibold text-center leading-snug">
                        Security Assessment
                      </p>
                      <p className="text-white/50 text-[9px] text-center leading-relaxed">
                        Electronic Flight Bag
                      </p>
                      {/* Fake progress bars */}
                      <div className="w-full space-y-2 mt-2">
                        {['MDM Config', 'OS Hardening', 'App Security', 'Data Protection'].map((label, i) => (
                          <div key={label} className="space-y-0.5">
                            <div className="flex justify-between">
                              <span className="text-[8px] text-white/50">{label}</span>
                              <span className="text-[8px] text-green-400">✓</span>
                            </div>
                            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-green-400"
                                style={{ width: `${[92, 88, 95, 90][i]}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Home bar */}
                  <div className="mt-2 mx-auto w-16 h-1 rounded-full bg-[#3A3A3C]" aria-hidden="true" />
                </div>

                {/* Floating chips around iPad */}
                {featuredProject.chips.map((chip, i) => (
                  <motion.span
                    key={chip}
                    style={CHIP_POSITIONS[i]}
                    animate={reduced ? {} : {
                      y: [0, i % 2 === 0 ? -5 : 5, 0],
                    }}
                    transition={reduced ? {} : {
                      duration: 3 + i * 0.6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: CHIP_POSITIONS[i].delay,
                    }}
                    className="absolute px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[var(--surface)] border border-[var(--border)] text-[var(--primary)] shadow-card whitespace-nowrap"
                  >
                    {chip}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
