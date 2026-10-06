import { useId, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Copy,
  Download,
  Github,
  Linkedin,
  Loader2,
  Mail,
  Send,
  X,
} from 'lucide-react'
import { contactPrivacy, siteConfig } from '@/data/content'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim() ?? ''
console.log('[ContactForm] endpoint:', formEndpoint || '(empty — mock mode)')
const topics = ['Hiring', 'Collaboration', 'Security question', 'Other'] as const

type Topic = (typeof topics)[number]
type EditableField = 'name' | 'email' | 'message'
type FormState = 'idle' | 'submitting' | 'success' | 'error'
type Fields = Record<EditableField, string> & { company: string }
type Errors = Partial<Record<EditableField, string>>

const SOCIAL_CARDS = [
  { label: 'LinkedIn', href: siteConfig.linkedin, icon: <Linkedin size={18} aria-hidden="true" /> },
  { label: 'GitHub', href: siteConfig.github, icon: <Github size={18} aria-hidden="true" /> },
  { label: 'Medium', href: siteConfig.medium, icon: <BookOpen size={18} aria-hidden="true" /> },
]

function validateField(field: EditableField, value: string) {
  const trimmed = value.trim()
  if (field === 'name') {
    if (trimmed.length < 2) return 'Name must be at least 2 characters.'
    if (trimmed.length > 80) return 'Name must be 80 characters or fewer.'
  }
  if (field === 'email') {
    if (!trimmed) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Enter a valid email address.'
  }
  if (field === 'message') {
    if (trimmed.length < 10) return 'Message must be at least 10 characters.'
    if (trimmed.length > 2000) return 'Message must be 2000 characters or fewer.'
  }
  return undefined
}

function CopyButton({ value, label = 'email address' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={copyValue}
        aria-label={`Copy ${label}`}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-xs font-semibold text-[var(--primary)] transition-colors hover:border-[var(--primary)]/40 hover:bg-[var(--pale-blue)]"
      >
        <Copy size={13} aria-hidden="true" />
        {copied ? 'Copied' : 'Copy'}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? 'Copied to clipboard.' : ''}</span>
    </div>
  )
}

function FloatingInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  inputRef,
  error,
  reduced,
  maxLength,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  inputRef: (node: HTMLInputElement | null) => void
  error?: string
  reduced: boolean
  maxLength?: number
}) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); onBlur() }}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          'peer w-full rounded-lg border bg-[var(--surface)] px-4 pb-2 pt-5 text-sm text-[var(--heading)] outline-none',
          reduced ? '' : 'transition-[border-color,box-shadow] duration-200',
          'focus:ring-2 focus:ring-[var(--primary)]/30',
          error ? 'border-[#E5484D] focus:border-[#E5484D]' : 'border-[var(--border)] focus:border-[var(--primary)]',
        ].join(' ')}
      />
      <label
        htmlFor={id}
        className={[
          'pointer-events-none absolute left-4 font-medium',
          reduced ? '' : 'transition-all duration-200',
          lifted ? 'top-1.5 text-[10px] text-[var(--primary)]' : 'top-3.5 text-sm text-[var(--body)]',
        ].join(' ')}
      >
        {label}
      </label>
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-[#E5484D]">{error}</p>}
    </div>
  )
}

function FloatingTextarea({
  id,
  label,
  value,
  onChange,
  onBlur,
  inputRef,
  error,
  reduced,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  inputRef: (node: HTMLTextAreaElement | null) => void
  error?: string
  reduced: boolean
}) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0
  const counterId = `${id}-counter`
  const describedBy = [error ? `${id}-error` : '', counterId].filter(Boolean).join(' ')
  const messageLength = value.trim().length

  return (
    <div className="relative">
      <textarea
        ref={inputRef}
        id={id}
        value={value}
        maxLength={2000}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); onBlur() }}
        rows={5}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={[
          'peer w-full resize-none rounded-lg border bg-[var(--surface)] px-4 pb-2 pt-5 text-sm text-[var(--heading)] outline-none',
          reduced ? '' : 'transition-[border-color,box-shadow] duration-200',
          'focus:ring-2 focus:ring-[var(--primary)]/30',
          error ? 'border-[#E5484D] focus:border-[#E5484D]' : 'border-[var(--border)] focus:border-[var(--primary)]',
        ].join(' ')}
      />
      <label
        htmlFor={id}
        className={[
          'pointer-events-none absolute left-4 font-medium',
          reduced ? '' : 'transition-all duration-200',
          lifted ? 'top-1.5 text-[10px] text-[var(--primary)]' : 'top-3.5 text-sm text-[var(--body)]',
        ].join(' ')}
      >
        {label}
      </label>
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-[#E5484D]">{error}</p>}
      <p id={counterId} className="mt-1 text-right text-[10px] text-[var(--body)]">
        {messageLength}/2000
      </p>
    </div>
  )
}

function ContactForm({
  reduced,
  privacyOpen,
  setPrivacyOpen,
  privacyLinkRef,
  privacyDialogId,
}: {
  reduced: boolean
  privacyOpen: boolean
  setPrivacyOpen: (open: boolean) => void
  privacyLinkRef: React.RefObject<HTMLAnchorElement>
  privacyDialogId: string
}) {
  const uid = useId()
  const [fields, setFields] = useState<Fields>({ name: '', email: '', message: '', company: '' })
  const [topic, setTopic] = useState<Topic>('Hiring')
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Record<EditableField, boolean>>({ name: false, email: false, message: false })
  const [formState, setFormState] = useState<FormState>('idle')
  const [announcement, setAnnouncement] = useState('')
  const renderedAt = useRef(Date.now())
  const fieldRefs = useRef<Record<EditableField, HTMLInputElement | HTMLTextAreaElement | null>>({
    name: null,
    email: null,
    message: null,
  })

  function updateError(field: EditableField, value: string) {
    const error = validateField(field, value)
    setErrors((current) => {
      const next = { ...current }
      if (error) next[field] = error
      else delete next[field]
      return next
    })
  }

  function changeField(field: EditableField, value: string) {
    setFields((current) => ({ ...current, [field]: value }))
    if (touched[field]) updateError(field, value)
  }

  function blurField(field: EditableField) {
    setTouched((current) => ({ ...current, [field]: true }))
    updateError(field, fields[field])
  }

  function resetForm() {
    setFields({ name: '', email: '', message: '', company: '' })
    setTopic('Hiring')
    setErrors({})
    setTouched({ name: false, email: false, message: false })
    setFormState('idle')
    setAnnouncement('')
    renderedAt.current = Date.now()
  }

  function clearSubmittedFields() {
    setFields({ name: '', email: '', message: '', company: '' })
    setTopic('Hiring')
    setErrors({})
    setTouched({ name: false, email: false, message: false })
  }

  function showSuccess(message: string) {
    clearSubmittedFields()
    setFormState('success')
    setAnnouncement(message)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log('[ContactForm] handleSubmit fired, fields:', fields)

    if (fields.company.trim()) {
      showSuccess('Message sent.')
      return
    }

    const nextErrors: Errors = {
      name: validateField('name', fields.name),
      email: validateField('email', fields.email),
      message: validateField('message', fields.message),
    }
    const cleanErrors = Object.fromEntries(Object.entries(nextErrors).filter(([, error]) => error)) as Errors
    setTouched({ name: true, email: true, message: true })
    setErrors(cleanErrors)

    const firstInvalid = (['name', 'email', 'message'] as const).find((field) => cleanErrors[field])
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus()
      return
    }

    console.log('[ContactForm] elapsed ms:', Date.now() - renderedAt.current)

    const payload = {
      name: fields.name.trim(),
      email: fields.email.trim(),
      topic,
      message: fields.message.trim(),
    }

    setFormState('submitting')
    setAnnouncement('Sending message.')

    try {
      if (!formEndpoint) {
        console.log('[Contact form mock]', payload)
        await new Promise((resolve) => window.setTimeout(resolve, 800))
      } else {
        const controller = new AbortController()
        const timeoutId = window.setTimeout(() => controller.abort(), 10_000)
        try {
          const response = await fetch(formEndpoint, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          })
          if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`)
        } finally {
          window.clearTimeout(timeoutId)
        }
      }
      showSuccess('Message sent. Thanks for reaching out. I will reply by email.')
    } catch {
      setFormState('error')
      setAnnouncement('Something went wrong. You can email me directly at jeffryjolly@gmail.com')
    }
  }

  return (
    <>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
      {formState === 'success' ? (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-[#16A34A] dark:bg-green-900/30">
            <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" aria-hidden="true">
              <motion.path
                d="m5 12 4 4L19 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduced ? 0 : 0.45, ease: 'easeOut' }}
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-[var(--heading)]">Message sent</p>
            <p className="mt-1 text-sm text-[var(--body)]">Thanks for reaching out. I'll reply by email.</p>
          </div>
          <button type="button" onClick={resetForm} className="text-sm font-semibold text-[var(--primary)] hover:underline">
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate aria-busy={formState === 'submitting'} className="space-y-4">
          <input
            type="text"
            name="_gotcha"
            value={fields.company}
            onChange={(event) => setFields((current) => ({ ...current, company: event.target.value }))}
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            style={{ display: 'none' }}
          />

          <FloatingInput
            id={`${uid}-name`}
            label="Name"
            value={fields.name}
            onChange={(value) => changeField('name', value)}
            onBlur={() => blurField('name')}
            inputRef={(node) => { fieldRefs.current.name = node }}
            error={errors.name}
            reduced={reduced}
            maxLength={80}
          />
          <FloatingInput
            id={`${uid}-email`}
            label="Email"
            type="email"
            value={fields.email}
            onChange={(value) => changeField('email', value)}
            onBlur={() => blurField('email')}
            inputRef={(node) => { fieldRefs.current.email = node }}
            error={errors.email}
            reduced={reduced}
          />

          <fieldset className="space-y-2">
            <legend className="text-xs font-semibold text-[var(--heading)]">Topic</legend>
            <div className="flex flex-wrap gap-2">
              {topics.map((option) => (
                <label key={option} className="cursor-pointer">
                  <input
                    type="radio"
                    name={`${uid}-topic`}
                    value={option}
                    checked={topic === option}
                    onChange={() => setTopic(option)}
                    className="peer sr-only"
                  />
                  <span className="inline-flex min-h-10 items-center rounded-full border border-[var(--border)] px-3 text-xs font-medium text-[var(--body)] transition-colors hover:border-[var(--primary)]/40 hover:bg-[var(--pale-blue)] peer-checked:border-[var(--primary)] peer-checked:bg-[var(--pale-blue)] peer-checked:text-[var(--primary)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--primary)]">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <FloatingTextarea
            id={`${uid}-message`}
            label="Message"
            value={fields.message}
            onChange={(value) => changeField('message', value)}
            onBlur={() => blurField('message')}
            inputRef={(node) => { fieldRefs.current.message = node }}
            error={errors.message}
            reduced={reduced}
          />

          {formState === 'error' && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E5484D]/30 bg-red-50 p-3 text-sm text-[var(--body)] dark:bg-red-950/20">
              <p>Something went wrong. You can email me directly at {siteConfig.email}</p>
              <CopyButton value={siteConfig.email} />
            </div>
          )}

          <button
            type="submit"
            disabled={formState === 'submitting'}
            onClick={() => console.log('[ContactForm] button clicked, formState:', formState)}
            className="btn-shine flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {formState === 'submitting' ? (
              <>
                <Loader2 size={16} className={reduced ? '' : 'animate-spin'} aria-hidden="true" />
                Sending...
              </>
            ) : (
              <>
                <Send size={15} aria-hidden="true" />
                {formState === 'error' ? 'Try again' : 'Send message'}
              </>
            )}
          </button>
          <p className="flex flex-wrap items-center justify-center gap-x-1 text-center text-[10px] text-[var(--body)]">
            <span>{contactPrivacy.summary}</span>
            <a
              ref={privacyLinkRef}
              href="#contact-privacy"
              aria-haspopup="dialog"
              aria-expanded={privacyOpen}
              aria-controls={privacyDialogId}
              onClick={(event) => { event.preventDefault(); setPrivacyOpen(true) }}
              className="shrink-0 font-semibold text-[var(--primary)] underline underline-offset-2"
            >
              Privacy details
            </a>
          </p>
          {import.meta.env.DEV && !formEndpoint && (
            <p className="text-center text-[10px] text-amber-600 dark:text-amber-400">
              This form is mocked locally. No emails are sent.
            </p>
          )}
        </form>
      )}
    </>
  )
}

const contactFade = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

type CopyState = 'idle' | 'copied' | 'failed'

function EmailCopyButton({ email, reduced }: { email: string; reduced: boolean }) {
  const [state, setState] = useState<CopyState>('idle')
  const [tooltip, setTooltip] = useState(false)
  const emailRef = useRef<HTMLAnchorElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const reset = useCallback(() => setState('idle'), [])

  async function handleCopy() {
    clearTimeout(timerRef.current)
    try {
      await navigator.clipboard.writeText(email)
      setState('copied')
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = email
        ta.style.cssText = 'position:fixed;opacity:0'
        document.body.appendChild(ta)
        ta.focus()
        ta.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(ta)
        if (ok) { setState('copied') } else {
          setState('failed')
          emailRef.current?.focus()
        }
      } catch {
        setState('failed')
      }
    }
    timerRef.current = setTimeout(reset, 1500)
  }

  const tooltipLabel = state === 'copied' ? 'Copied' : state === 'failed' ? 'Could not copy' : 'Copy email'

  return (
    <div className="relative flex items-center justify-center">
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {state === 'copied' ? 'Email address copied' : ''}
      </span>
      {(tooltip || state !== 'idle') && (
        <span
          role="tooltip"
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--heading)] px-2 py-0.5 text-[10px] font-medium text-[var(--bg)] shadow z-10"
        >
          {tooltipLabel}
        </span>
      )}
      <button
        type="button"
        aria-label="Copy email address"
        onClick={handleCopy}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        onFocus={() => setTooltip(true)}
        onBlur={() => setTooltip(false)}
        className="relative flex h-8 w-8 items-center justify-center rounded-full text-[var(--body)]/50 transition-colors hover:bg-[var(--pale-blue)] hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] focus-visible:bg-[var(--pale-blue)] focus-visible:text-[var(--primary)]"
      >
        <span className="absolute -inset-[6px]" aria-hidden="true" />
        {state === 'copied'
          ? <Check size={16} aria-hidden="true" className={['text-emerald-500', !reduced ? 'scale-in' : ''].join(' ')} />
          : <Copy size={16} aria-hidden="true" />}
      </button>
    </div>
  )
}

export default function ContactSection() {
  const reduced = useReducedMotion()
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const privacyLinkRef = useRef<HTMLAnchorElement>(null)
  const privacyDialogRef = useRef<HTMLDivElement>(null)
  const privacyDialogId = useId()

  useFocusTrap(privacyDialogRef, privacyOpen, privacyLinkRef)

  return (
    <motion.section
      id="contact"
      className="bg-[var(--bg-alt)] px-4 py-20 sm:px-6"
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={contactFade}
      transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">Contact</p>
          <h2 className="mx-auto max-w-lg text-section font-bold leading-snug text-[var(--heading)]">
            Let's work together
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--body)]">
            Hiring, collaborating, or just curious about security? Send me a message and I'll get back to you by email.
          </p>
        </div>

        <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SOCIAL_CARDS.map((card) => (
                <a
                  key={card.label}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-card border border-[var(--border)] bg-[var(--surface)] p-4 shadow-card transition-colors hover:border-[var(--primary)]/35 hover:bg-[var(--pale-blue)]/50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--pale-blue)] text-[var(--primary)]">
                    {card.icon}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-[var(--heading)]">{card.label}</span>
                  <ArrowUpRight size={14} className="shrink-0 text-[var(--body)]" aria-hidden="true" />
                </a>
              ))}

              <div className="relative flex min-w-0 items-center gap-3 rounded-card border border-[var(--border)] bg-[var(--surface)] py-4 pl-4 pr-[52px] shadow-card">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--pale-blue)] text-[var(--primary)]">
                  <Mail size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="text-xs font-semibold text-[var(--heading)]">Email</p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="block select-all whitespace-nowrap text-xs text-[var(--body)] hover:text-[var(--primary)]"
                  >
                    {siteConfig.email}
                  </a>
                </div>
                <div className="absolute right-[10px] top-[10px]">
                  <EmailCopyButton email={siteConfig.email} reduced={reduced} />
                </div>
              </div>
            </div>

            <a
              href={siteConfig.resumeUrl}
              download
              className="inline-flex min-h-10 w-fit items-center gap-1.5 text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              <Download size={15} aria-hidden="true" />
              Download resume
            </a>

            <div className="space-y-3 rounded-card border border-[var(--border)] bg-[var(--surface)] p-4 shadow-card">
              <h3 className="text-sm font-semibold text-[var(--heading)]">What helps in a first message</h3>
              <ul className="space-y-1.5 text-sm text-[var(--body)]">
                <li>What you would like tested or discussed</li>
                <li>A rough timeline</li>
                <li>The best way to reply</li>
              </ul>
            </div>

            <p className="flex min-h-10 w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-medium text-[var(--body)]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Open to opportunities
            </p>
          </div>

          <div className="rounded-card-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-card sm:p-8">
            <h3 className="mb-5 font-bold text-[var(--heading)]">Send me a message</h3>
            <ContactForm
              reduced={reduced}
              privacyOpen={privacyOpen}
              setPrivacyOpen={setPrivacyOpen}
              privacyLinkRef={privacyLinkRef}
              privacyDialogId={privacyDialogId}
            />
          </div>
        </div>
      </div>
      {privacyOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPrivacyOpen(false)
          }}
        >
          <div
            ref={privacyDialogRef}
            id={privacyDialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${privacyDialogId}-title`}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.preventDefault()
                setPrivacyOpen(false)
              }
            }}
            className="max-h-[min(90vh,560px)] w-full max-w-md overflow-y-auto rounded-card-lg border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--body)] shadow-card"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 id={`${privacyDialogId}-title`} className="text-lg font-bold text-[var(--heading)]">Privacy details</h3>
              <button
                type="button"
                autoFocus
                onClick={() => setPrivacyOpen(false)}
                aria-label="Close privacy details"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--body)] transition-colors hover:bg-[var(--pale-blue)] hover:text-[var(--heading)]"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <p className="mb-5 text-sm leading-relaxed">{contactPrivacy.summary}</p>
            <dl className="space-y-4 text-sm leading-relaxed">
              <div>
                <dt className="font-semibold text-[var(--heading)]">What is collected</dt>
                <dd>{contactPrivacy.collected}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--heading)]">Purpose</dt>
                <dd>{contactPrivacy.purpose}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--heading)]">Where it goes</dt>
                <dd>{contactPrivacy.destination}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--heading)]">Retention</dt>
                <dd>{contactPrivacy.retention}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--heading)]">Deletion requests</dt>
                <dd>{contactPrivacy.deletion}</dd>
              </div>
              {!formEndpoint && import.meta.env.DEV && (
                <div>
                  <dt className="font-semibold text-[var(--heading)]">Local development</dt>
                  <dd>{contactPrivacy.mockMode}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>,
        document.body,
      )}
    </motion.section>
  )
}
