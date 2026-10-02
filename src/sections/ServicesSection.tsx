import { Globe, Smartphone, Monitor, Network, Brain, Cloud, Code2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { services } from '@/data/content'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const ICON_MAP: Record<string, React.ReactNode> = {
  Globe: <Globe size={22} />,
  Smartphone: <Smartphone size={22} />,
  Monitor: <Monitor size={22} />,
  Network: <Network size={22} />,
  Brain: <Brain size={22} />,
  Cloud: <Cloud size={22} />,
  Code2: <Code2 size={22} />,
}

const AI_TITLE = 'AI/LLM Security'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function ServicesSection() {
  const reduced = useReducedMotion()
  const isAI = (title: string) => title === AI_TITLE

  return (
    <section id="services" className="bg-[var(--bg-alt)] py-20">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
            What I work on
          </p>
          <h2 className="text-section font-bold text-[var(--heading)]">
            Areas of expertise
          </h2>
        </div>

        <motion.div
          variants={reduced ? undefined : container}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => {
            const featured = isAI(service.title)

            return (
              <motion.article
                key={service.title}
                variants={reduced ? undefined : item}
                whileHover={reduced ? undefined : { y: -4 }}
                className={[
                  'group relative flex h-full flex-col gap-3 rounded-card-lg border p-5 shadow-card',
                  'bg-[var(--surface)] cursor-default hover:shadow-card-hover',
                  featured ? 'sm:col-span-2 border-purple-300 dark:border-purple-800/60' : 'border-[var(--border)]',
                ].join(' ')}
              >
                <motion.div
                  className={[
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    featured ? 'bg-purple-100 text-[#7C3AED] dark:bg-purple-900/30' : 'bg-[var(--pale-blue)] text-[var(--primary)]',
                    reduced ? '' : 'transition-transform duration-200 group-hover:rotate-3',
                  ].join(' ')}
                >
                  {ICON_MAP[service.icon]}
                </motion.div>

                <h3 className="text-sm font-semibold text-[var(--heading)]">{service.title}</h3>
                <p className="text-xs leading-relaxed text-[var(--body)]">{service.description}</p>

                {service.chips.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    {service.chips.map((chip) => (
                      <span
                        key={chip}
                        className="self-start rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-semibold text-[#7C3AED] dark:bg-purple-900/30"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
