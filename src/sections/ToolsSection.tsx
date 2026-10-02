import { motion } from 'framer-motion'
import { skillFrameworkEntries, skillToolEntries } from '@/data/content'
import type { SkillEntry } from '@/data/content'
import { Wrench } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type ToolRow = {
  name: string
  use: string
}

const securityTools: ToolRow[] = [
  { name: 'Burp Suite', use: 'Manual web app testing' },
  { name: 'Nmap', use: 'Network discovery and assessment' },
  { name: 'Metasploit', use: 'Validating exploitability' },
  { name: 'SQLMap', use: 'SQL injection testing' },
  { name: 'Tenable.io', use: 'Vulnerability assessment' },
  { name: 'InsightAppSec', use: 'Dynamic application scanning' },
  { name: 'Gobuster', use: 'Content discovery' },
  { name: 'Wireshark', use: 'Traffic analysis' },
  { name: 'Hydra', use: 'Credential testing' },
]

const technicalStack: ToolRow[] = [
  { name: 'Kali Linux', use: 'Testing platform' },
  { name: 'Postman', use: 'API testing' },
  { name: 'Python', use: 'Security automation' },
  { name: 'REST APIs', use: 'API fundamentals' },
  { name: 'JSON', use: 'Data formats' },
]

const standardRows: ToolRow[] = [
  { name: 'OWASP Top 10', use: 'Web application security risks' },
  { name: 'OWASP API Top 10', use: 'API security risks' },
  { name: 'OWASP Mobile Top 10', use: 'Mobile app security risks' },
  { name: 'OWASP Top 10 for LLM Apps', use: 'LLM application risks' },
  { name: 'CVSS v3.1', use: 'Vulnerability severity scoring' },
  { name: 'MITRE ATT&CK', use: 'Adversary tactics and techniques' },
]

const coreGroups = [
  { label: 'Application', chips: ['Web App Pentesting', 'API Security', 'Mobile Security', 'Thick Client', 'DAST'] },
  { label: 'Infrastructure', chips: ['Network Security', 'Cloud Security', 'VAPT'] },
  { label: 'Emerging', chips: ['AI/LLM Security'] },
]

const cardStyle = 'h-full rounded-card-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-card'
const rowStyle = 'grid grid-cols-[32px_minmax(0,1fr)] items-center gap-x-3 gap-y-0.5 rounded-lg border border-transparent p-2.5 transition-colors duration-200 hover:border-[var(--primary)]/25 hover:bg-[var(--pale-blue)]/60'

function EntryIcon({ entry }: { entry: SkillEntry | undefined }) {
  if (!entry) return <Wrench size={20} aria-hidden="true" />
  if (entry.type === 'img')
    return <img src={entry.src} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
  const Icon = entry.icon
  return <Icon size={20} color={entry.color} aria-hidden="true" focusable="false" />
}

function ToolList({
  items,
  entries,
  twoColumns = false,
}: {
  items: ToolRow[]
  entries: Record<string, SkillEntry>
  twoColumns?: boolean
}) {
  return (
    <ul className={`grid grid-cols-1 gap-2 ${twoColumns ? 'sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2' : ''}`}>
      {items.map((item) => {
        const entry = entries[item.name]
        const bg = entry?.bg ?? 'bg-[var(--pale-blue)]'
        return (
          <li key={item.name} className={rowStyle}>
            <span className={`row-span-2 flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
              <EntryIcon entry={entry} />
            </span>
            <span className="min-w-0 text-[13px] font-medium leading-tight text-[var(--heading)]">{item.name}</span>
            <span className="min-w-0 text-[10px] leading-tight text-[var(--body)]">{item.use}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default function ToolsSection() {
  const reduced = useReducedMotion()

  return (
    <motion.section
      id="skills"
      className="bg-[var(--bg)] py-20"
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
            Skills and tools
          </p>
          <h2 className="text-section font-bold text-[var(--heading)]">
            Tools and standards I use across assessments
          </h2>
          <p className="mt-3 text-sm text-[var(--body)]">
            Tools, techniques and standards used across assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          <article className={cardStyle}>
            <h3 className="mb-4 text-base font-semibold text-[var(--heading)]">Security tools</h3>
            <ToolList items={securityTools} entries={skillToolEntries} twoColumns />
          </article>

          <article className={cardStyle}>
            <h3 className="mb-4 text-base font-semibold text-[var(--heading)]">Technical stack</h3>
            <ToolList items={technicalStack} entries={skillToolEntries} />
          </article>

          <article className={cardStyle}>
            <h3 className="mb-4 text-base font-semibold text-[var(--heading)]">Standards and frameworks</h3>
            <ToolList items={standardRows} entries={skillFrameworkEntries} />
          </article>
        </div>


        <div className="mt-8">
          <h3 className="mb-4 text-sm font-semibold text-[var(--heading)]">Core skills</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {coreGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--body)]">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--body)] transition-colors duration-200 hover:border-[var(--primary)]/30 hover:bg-[var(--pale-blue)]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
