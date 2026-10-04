import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, ChevronDown, CheckCircle, Home, ListChecks } from 'lucide-react'
import { projects, getProject } from '@/data/projects'
import { projectIcon } from '@/lib/projectIcons'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import NotFoundPage from '@/pages/NotFoundPage'

const SECTIONS = [
  { id: 'process', label: 'Process' },
  { id: 'tools', label: 'Tools' },
  { id: 'deliverables', label: 'What you get' },
] as const

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const reduced = useReducedMotion()
  const project = slug ? getProject(slug) : undefined

  if (!project) return <NotFoundPage />

  return <ProjectDetail key={project.slug} project={project} reduced={reduced} />
}

function ProjectDetail({
  project,
  reduced,
}: {
  project: (typeof projects)[number]
  reduced: boolean
}) {
  const Icon = projectIcon(project.icon)
  const h1Ref = useRef<HTMLHeadingElement>(null)

  const [expanded, setExpanded] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(project.phases.map((_, i) => [i, true]))
  )
  const [activeSection, setActiveSection] = useState<string>('process')

  const index = projects.findIndex((p) => p.slug === project.slug)
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]

  const allOpen = project.phases.every((_, i) => expanded[i])
  const phaseIds = project.phases.map((p) => slugify(p.title))

  // Document title and meta description per page.
  useEffect(() => {
    document.title = `${project.title} methodology | Jeffrey Jolly`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', project.overview)
  }, [project.title, project.overview])

  // Move focus to the h1 on route change and announce it.
  useEffect(() => {
    h1Ref.current?.focus()
  }, [project.slug])

  // Scroll spy over the three sections and the six phases.
  useEffect(() => {
    const ids = [...SECTIONS.map((s) => s.id), ...phaseIds]
    const onScroll = () => {
      const trigger = 120
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= trigger) current = id
      }
      setActiveSection(current)
    }
    onScroll()
    let ticking = false
    const handler = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        onScroll()
        ticking = false
      })
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [project.slug, phaseIds.join(',')])

  const jump = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
  }

  const toggleAll = () => {
    const nextState = !allOpen
    setExpanded(Object.fromEntries(project.phases.map((_, i) => [i, nextState])))
  }

  const tileStyle =
    'flex h-12 w-12 shrink-0 items-center justify-center rounded-card-lg bg-[var(--pale-blue)] text-[var(--primary)]'

  return (
    <article className="pt-[104px] pb-20 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-[var(--body)]">
            <li>
              <Link
                to="/"
                className="inline-flex items-center gap-1 hover:text-[var(--primary)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] rounded"
              >
                <Home size={13} aria-hidden="true" />
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-[var(--border)]">
              /
            </li>
            <li>
              <Link
                to="/#projects"
                className="hover:text-[var(--primary)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] rounded"
              >
                Projects
              </Link>
            </li>
            <li aria-hidden="true" className="text-[var(--border)]">
              /
            </li>
            <li aria-current="page" className="text-[var(--heading)] font-medium">
              {project.title}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <motion.header
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="flex items-start gap-4">
            <span className={tileStyle} aria-hidden="true">
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <h1
                ref={h1Ref}
                tabIndex={-1}
                className="text-3xl sm:text-4xl font-bold text-[var(--heading)] tracking-tight"
              >
                {project.title}
              </h1>
              <span className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--pale-blue)] text-[var(--primary)]">
                {project.standard}
              </span>
            </div>
          </div>

          <p className="mt-5 text-[15px] sm:text-base text-[var(--body)] leading-relaxed max-w-[70ch]">
            {project.overview}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--surface)] border border-[var(--border)] text-[var(--body)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-5 text-[12px] italic text-[var(--body)]/80 max-w-[70ch]">
            This page describes the method I follow. It does not contain details of any client
            engagement.
          </p>
        </motion.header>

        {/* Two columns from 1024px */}
        <div className="mt-12 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
          {/* Left: On this page. Mobile becomes a horizontal chip row. */}
          <nav aria-label="On this page" className="lg:sticky lg:top-24 mb-8 lg:mb-0">
            <h2 className="sr-only">On this page</h2>
            <ul className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:overflow-visible lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 lg:hidden">
              {SECTIONS.map((s) => (
                <li key={s.id} className="shrink-0">
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      jump(s.id)
                    }}
                    className={[
                      'inline-block whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors',
                      activeSection === s.id
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--body)]',
                    ].join(' ')}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop list, with phases nested under Process */}
            <div className="hidden lg:block">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--body)] mb-3">
                On this page
              </p>
              <ul className="space-y-0.5">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        jump(s.id)
                      }}
                      className={[
                        'block py-1 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] rounded',
                        activeSection === s.id
                          ? 'text-[var(--primary)]'
                          : 'text-[var(--body)] hover:text-[var(--heading)]',
                      ].join(' ')}
                    >
                      {s.label}
                    </a>
                    {s.id === 'process' && (
                      <ul className="mt-0.5 mb-1.5 space-y-0.5 border-l border-[var(--border)] pl-3">
                        {project.phases.map((phase, i) => {
                          const id = phaseIds[i]
                          const isActive = activeSection === id
                          return (
                            <li key={id}>
                              <a
                                href={`#${id}`}
                                onClick={(e) => {
                                  e.preventDefault()
                                  jump(id)
                                }}
                                aria-current={isActive ? 'true' : undefined}
                                className={[
                                  'flex gap-1.5 py-0.5 text-[12px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] rounded',
                                  isActive
                                    ? 'text-[var(--primary)] font-medium'
                                    : 'text-[var(--body)]/75 hover:text-[var(--heading)]',
                                ].join(' ')}
                              >
                                <span className="tabular-nums">{i + 1}.</span>
                                <span>{phase.title}</span>
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Right: content */}
          <div className="min-w-0 space-y-14">
            {/* Process */}
            <section id="process" className="scroll-mt-28">
              <div className="flex items-end justify-between gap-4 mb-5">
                <h2 className="text-2xl font-bold text-[var(--heading)] tracking-tight">Process</h2>
                <button
                  type="button"
                  onClick={toggleAll}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[12px] font-semibold text-[var(--body)] hover:text-[var(--primary)] hover:border-[var(--primary)]/40 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                >
                  {allOpen ? 'Collapse all' : 'Expand all'}
                </button>
              </div>

              <ol className="space-y-3">
                {project.phases.map((phase, i) => {
                  const open = expanded[i]
                  return (
                    <li key={phase.title} id={phaseIds[i]} className="scroll-mt-28">
                      <div className="rounded-card-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-colors duration-200 hover:border-[var(--primary)]/25 hover:bg-[var(--pale-blue)]/30">
                        <h3>
                          <button
                            type="button"
                            onClick={() => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))}
                            aria-expanded={open}
                            aria-controls={`phase-body-${i}`}
                            className="flex w-full items-start gap-3 p-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--primary)]"
                          >
                            <span
                              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--pale-blue)] text-[12px] font-bold text-[var(--primary)] tabular-nums"
                              aria-hidden="true"
                            >
                              {i + 1}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[15px] font-semibold text-[var(--heading)]">
                                {phase.title}
                              </span>
                              <span className="mt-0.5 block text-[13px] text-[var(--body)] leading-relaxed">
                                {phase.summary}
                              </span>
                            </span>
                            <ChevronDown
                              size={17}
                              aria-hidden="true"
                              className={[
                                'mt-1 shrink-0 text-[var(--body)] transition-transform duration-300',
                                open ? 'rotate-180' : '',
                              ].join(' ')}
                            />
                          </button>
                        </h3>

                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div
                              id={`phase-body-${i}`}
                              key="body"
                              initial={reduced ? false : { height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                              transition={{
                                duration: reduced ? 0 : 0.3,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="overflow-hidden"
                            >
                              <ul className="space-y-2 px-5 pb-5 pl-[60px]">
                                {phase.steps.map((step) => (
                                  <li
                                    key={step}
                                    className="flex items-start gap-2 text-[13px] text-[var(--body)] leading-relaxed"
                                  >
                                    <CheckCircle
                                      size={15}
                                      className="mt-0.5 shrink-0 text-[var(--primary)]"
                                      aria-hidden="true"
                                    />
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </section>

            {/* Tools */}
            <section id="tools" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-[var(--heading)] tracking-tight mb-5">
                Tools
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {project.tools.map((tool) => (
                  <li
                    key={tool.name}
                    className="rounded-card-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors duration-200 hover:border-[var(--primary)]/25 hover:bg-[var(--pale-blue)]/30"
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--pale-blue)] text-[var(--primary)]"
                      aria-hidden="true"
                    >
                      <ListChecks size={16} strokeWidth={1.75} />
                    </span>
                    <p className="mt-2.5 text-[13px] font-semibold text-[var(--heading)]">
                      {tool.name}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[var(--body)] leading-relaxed">
                      {tool.use}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Deliverables */}
            <section id="deliverables" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-[var(--heading)] tracking-tight mb-5">
                What you get
              </h2>
              <ul className="rounded-card-lg border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2.5">
                {project.deliverables.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-2.5 text-[14px] text-[var(--body)] leading-relaxed"
                  >
                    <CheckCircle
                      size={17}
                      className="mt-0.5 shrink-0 text-[var(--primary)]"
                      aria-hidden="true"
                    />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Closing card */}
            <section className="rounded-card-lg border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--heading)] tracking-tight">
                Want this kind of assessment reviewed or discussed?
              </h2>
              <p className="mt-2 text-[14px] text-[var(--body)] leading-relaxed max-w-[60ch]">
                If this looks like the kind of work you need, I am happy to talk through the scope
                and what it would involve.
              </p>
              <Link
                to="/#contact"
                className="btn-shine mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--btn-dark)] text-white dark:text-[var(--bg)] font-semibold text-sm hover:opacity-90 active:scale-[0.97] transition-all"
              >
                Send me a message
                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
              </Link>
            </section>

            {/* Previous and next, wrapping around */}
            <nav aria-label="Project navigation" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to={`/projects/${prev.slug}`}
                className="group rounded-card-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors duration-200 hover:border-[var(--primary)]/25 hover:bg-[var(--pale-blue)]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
              >
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--body)]">
                  <ArrowLeft
                    size={12}
                    aria-hidden="true"
                    className="transition-transform group-hover:-translate-x-0.5"
                  />
                  Previous
                </span>
                <span className="mt-1.5 block text-[14px] font-semibold text-[var(--heading)]">
                  {prev.title}
                </span>
              </Link>

              <Link
                to={`/projects/${next.slug}`}
                className="group rounded-card-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-right transition-colors duration-200 hover:border-[var(--primary)]/25 hover:bg-[var(--pale-blue)]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
              >
                <span className="flex items-center justify-end gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--body)]">
                  Next
                  <ArrowRight
                    size={12}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
                <span className="mt-1.5 block text-[14px] font-semibold text-[var(--heading)]">
                  {next.title}
                </span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </article>
  )
}
