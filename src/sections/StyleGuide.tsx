import { Sun, Moon, Shield, Lock, Globe, Zap } from 'lucide-react'
import { useThemeContext } from '@/components/ThemeProvider'

const swatches = [
  { label: 'Background', var: 'var(--bg)', tw: 'bg-[var(--bg)]' },
  { label: 'Alt Section', var: 'var(--bg-alt)', tw: 'bg-[var(--bg-alt)]' },
  { label: 'Surface', var: 'var(--surface)', tw: 'bg-[var(--surface)]' },
  { label: 'Primary', var: 'var(--primary)', tw: 'bg-[var(--primary)]' },
  { label: 'Pale Blue', var: 'var(--pale-blue)', tw: 'bg-[var(--pale-blue)]' },
  { label: 'Border', var: 'var(--border)', tw: 'bg-[var(--border)]' },
  { label: 'Heading', var: 'var(--heading)', tw: 'bg-[var(--heading)]' },
  { label: 'Body', var: 'var(--body)', tw: 'bg-[var(--body)]' },
  { label: 'Accent Purple', var: '#7C3AED', tw: 'bg-[#7C3AED]' },
  { label: 'Accent Red', var: '#E5484D', tw: 'bg-[#E5484D]' },
  { label: 'Accent Amber', var: '#F59E0B', tw: 'bg-[#F59E0B]' },
  { label: 'Accent Green', var: '#16A34A', tw: 'bg-[#16A34A]' },
]

export default function StyleGuide() {
  const { theme, toggle } = useThemeContext()

  return (
    <div className="min-h-screen bg-[var(--bg)] transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <span className="font-bold text-lg text-[var(--heading)]">Jeffrey Jolly</span>
          <span className="ml-2 text-xs text-[var(--body)] font-medium">Design System</span>
        </div>
        <button
          onClick={toggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--heading)] hover:bg-[var(--pale-blue)] transition-colors"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* Title */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-2">
            Phase 1 — Design System
          </p>
          <h1 className="text-4xl font-bold text-[var(--heading)] mb-3">Style Guide</h1>
          <p className="text-[var(--body)] max-w-xl">
            All design tokens, typography, components and colour swatches for the Jeffrey Jolly
            portfolio. Currently in{' '}
            <strong className="text-[var(--heading)]">{theme} mode</strong>.
          </p>
        </section>

        {/* Colour Palette */}
        <section>
          <h2 className="text-xl font-semibold text-[var(--heading)] mb-6">Colour Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {swatches.map((s) => (
              <div key={s.label} className="space-y-2">
                <div
                  className={`h-16 rounded-card border border-[var(--border)] ${s.tw}`}
                  style={{ backgroundColor: s.var }}
                />
                <p className="text-xs font-medium text-[var(--heading)]">{s.label}</p>
                <p className="text-xs text-[var(--body)] font-mono">{s.var}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-xl font-semibold text-[var(--heading)] mb-6">Typography</h2>
          <div className="space-y-4 bg-[var(--surface)] rounded-card-lg border border-[var(--border)] p-8 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
              Eyebrow label — sentence case
            </p>
            <h1 className="text-5xl font-extrabold text-[var(--heading)] leading-tight">
              Heading 1 — Big & Confident
            </h1>
            <h2 className="text-3xl font-bold text-[var(--heading)]">Heading 2 — Section Title</h2>
            <h3 className="text-xl font-semibold text-[var(--heading)]">Heading 3 — Card Title</h3>
            <p className="text-base text-[var(--body)] leading-relaxed max-w-prose">
              Body text — Inter 16px. Penetration tester with 4+ years in vulnerability assessment
              and penetration testing across Web, API, Mobile, Thick Client, Network, Cloud and
              AI/LLM security.
            </p>
            <p className="text-sm text-[var(--body)]">Small text — 14px supporting copy</p>
            <p className="text-xs text-[var(--body)]">Caption — 12px metadata</p>
            <p className="font-mono text-sm text-[var(--primary)]">
              Monospace — code / values
            </p>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-xl font-semibold text-[var(--heading)] mb-6">Buttons</h2>
          <div className="flex flex-wrap gap-4 items-center bg-[var(--surface)] rounded-card-lg border border-[var(--border)] p-8 shadow-card">
            {/* Primary */}
            <button className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white font-semibold text-sm hover:bg-[var(--primary-hover)] transition-colors">
              Primary
            </button>
            {/* Dark */}
            <button className="px-5 py-2.5 rounded-lg bg-[var(--btn-dark)] text-white font-semibold text-sm hover:opacity-90 transition-opacity dark:text-[#0B1220]">
              Dark
            </button>
            {/* Outline */}
            <button className="px-5 py-2.5 rounded-lg border-2 border-[var(--primary)] text-[var(--primary)] font-semibold text-sm hover:bg-[var(--pale-blue)] transition-colors">
              Outline
            </button>
            {/* Ghost */}
            <button className="px-5 py-2.5 rounded-lg text-[var(--body)] font-semibold text-sm hover:bg-[var(--pale-blue)] hover:text-[var(--primary)] transition-colors">
              Ghost
            </button>
            {/* Disabled */}
            <button
              disabled
              className="px-5 py-2.5 rounded-lg bg-[var(--border)] text-[var(--body)] font-semibold text-sm cursor-not-allowed opacity-60"
            >
              Disabled
            </button>
            {/* Icon button */}
            <button className="p-2.5 rounded-lg border border-[var(--border)] text-[var(--heading)] hover:bg-[var(--pale-blue)] transition-colors">
              <Shield size={18} />
            </button>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-xl font-semibold text-[var(--heading)] mb-6">Cards</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Standard card */}
            <div className="bg-[var(--surface)] rounded-card-lg border border-[var(--border)] p-6 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[var(--pale-blue)] flex items-center justify-center mb-4">
                <Globe size={20} className="text-[var(--primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--heading)] mb-2">Web & API Security</h3>
              <p className="text-sm text-[var(--body)]">
                OWASP Top 10 and API Top 10 assessments, manual and automated.
              </p>
            </div>

            {/* Accent card */}
            <div className="bg-[var(--surface)] rounded-card-lg border border-[var(--border)] p-6 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <Zap size={20} className="text-[#7C3AED]" />
              </div>
              <h3 className="font-semibold text-[var(--heading)] mb-2">AI/LLM Security</h3>
              <p className="text-sm text-[var(--body)]">
                Prompt injection, data leakage and OWASP LLM Top 10 testing.
              </p>
              <span className="mt-3 inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-[#7C3AED]">
                AI/LLM
              </span>
            </div>

            {/* Stat card */}
            <div className="bg-[var(--primary)] rounded-card-lg p-6 text-white">
              <Lock size={24} className="mb-4 opacity-80" />
              <p className="text-3xl font-extrabold mb-1">50+</p>
              <p className="text-sm opacity-80">Web applications tested</p>
            </div>
          </div>
        </section>

        {/* Badges / Tags */}
        <section>
          <h2 className="text-xl font-semibold text-[var(--heading)] mb-6">Badges & Tags</h2>
          <div className="flex flex-wrap gap-3 bg-[var(--surface)] rounded-card-lg border border-[var(--border)] p-8 shadow-card">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--pale-blue)] text-[var(--primary)]">
              Web App Pentesting
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-[#7C3AED]">
              AI/LLM
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-[#16A34A]">
              Certified
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-[#F59E0B]">
              In progress
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-[#E5484D]">
              Critical
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold border border-[var(--border)] text-[var(--body)]">
              OWASP Top 10
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold border border-[var(--border)] text-[var(--body)]">
              MITRE ATT&CK
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold border border-[var(--border)] text-[var(--body)]">
              CVSS v3.1
            </span>
          </div>
        </section>

        {/* Spacing & Radius reference */}
        <section>
          <h2 className="text-xl font-semibold text-[var(--heading)] mb-6">Spacing & Radius</h2>
          <div className="flex flex-wrap gap-4 items-end bg-[var(--surface)] rounded-card-lg border border-[var(--border)] p-8 shadow-card">
            {[4, 8, 12, 16, 20, 24, 32, 48].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div
                  className="bg-[var(--primary)] opacity-70"
                  style={{ width: s, height: s, borderRadius: 4 }}
                />
                <span className="text-xs text-[var(--body)] font-mono">{s}px</span>
              </div>
            ))}
            <div className="ml-8 flex gap-4 items-center">
              <div className="w-16 h-16 bg-[var(--pale-blue)] border border-[var(--border)] rounded-lg flex items-center justify-center">
                <span className="text-xs text-[var(--body)]">8px</span>
              </div>
              <div className="w-16 h-16 bg-[var(--pale-blue)] border border-[var(--border)] rounded-card flex items-center justify-center">
                <span className="text-xs text-[var(--body)]">16px</span>
              </div>
              <div className="w-16 h-16 bg-[var(--pale-blue)] border border-[var(--border)] rounded-card-lg flex items-center justify-center">
                <span className="text-xs text-[var(--body)]">20px</span>
              </div>
              <div className="w-16 h-16 bg-[var(--pale-blue)] border border-[var(--border)] rounded-full flex items-center justify-center">
                <span className="text-xs text-[var(--body)]">full</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--body)]">
        Jeffrey Jolly Portfolio — Phase 1 Design System
      </footer>
    </div>
  )
}
