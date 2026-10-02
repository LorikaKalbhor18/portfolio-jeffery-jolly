import { useRef, useEffect, useCallback } from 'react'
import { X, ArrowRight, Linkedin, Github, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import ThemeToggle from './ThemeToggle'
import Logo from '@/components/Logo'
import { siteConfig } from '@/data/content'

interface NavLink {
  label: string
  href: string
}

interface MobileDrawerProps {
  open: boolean
  links: NavLink[]
  active: string
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onNavigate: (href: string) => void
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const SOCIAL_LINKS = [
  { href: siteConfig.linkedin, label: 'LinkedIn profile', Icon: Linkedin },
  { href: siteConfig.github,   label: 'GitHub profile',   Icon: Github },
  { href: siteConfig.medium,   label: 'Medium blog',      Icon: BookOpen },
]

export default function MobileDrawer({
  open,
  links,
  active,
  theme,
  onToggleTheme,
  onNavigate,
  onClose,
  triggerRef,
}: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useLockBodyScroll(open)
  useFocusTrap(drawerRef, open, triggerRef)

  // Close on Esc
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Close when viewport grows past breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)')
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) onClose()
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [onClose])

  const handleNavClick = useCallback(
    (href: string) => {
      onNavigate(href)
      onClose()
    },
    [onNavigate, onClose],
  )

  const drawerVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.div
        ref={drawerRef}
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!open}
        className={[
          'fixed top-0 right-0 bottom-0 z-50 flex flex-col xl:hidden',
          'w-[min(86vw,360px)]',
          'bg-[var(--surface)] border-l border-[var(--border)]',
          'shadow-[-4px_0_40px_rgba(0,0,0,0.15)]',
          'pb-[env(safe-area-inset-bottom)]',
        ].join(' ')}
        variants={drawerVariants}
        initial="hidden"
        animate={open ? 'visible' : 'hidden'}
        transition={{ type: 'tween', duration: reduced ? 0 : 0.28, ease: [0.32, 0, 0.67, 0] }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-[72px] border-b border-[var(--border)] shrink-0">
          <Logo
            showSubtitle={false}
            className="shrink-0"
            onClick={(event) => {
              event.preventDefault()
              handleNavClick('#home')
            }}
          />
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex items-center justify-center w-9 h-9 rounded-full text-[var(--body)] hover:text-[var(--heading)] hover:bg-[var(--pale-blue)] transition-colors"
          >
            <X size={17} strokeWidth={1.75} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Mobile navigation">
          <ul role="list" className="space-y-0.5">
            {links.map((link, i) => {
              const isActive = active === link.href.slice(1)
              return (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 16 }}
                  animate={
                    open
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: 16 }
                  }
                  transition={{
                    duration: reduced ? 0 : 0.22,
                    delay: reduced ? 0 : open ? i * 0.035 : 0,
                    ease: 'easeOut',
                  }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(link.href)
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={[
                      'flex items-center justify-between px-4 py-3.5 rounded-xl',
                      'text-[15px] font-semibold transition-colors duration-150',
                      'border-b border-[var(--border)] last:border-0',
                      isActive
                        ? 'text-[var(--primary)] bg-[var(--pale-blue)]'
                        : 'text-[var(--body)] hover:text-[var(--heading)] hover:bg-[var(--pale-blue)]/50',
                    ].join(' ')}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        className="w-2 h-2 rounded-full bg-[var(--primary)]"
                        aria-hidden="true"
                      />
                    )}
                  </a>
                </motion.li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[var(--border)] space-y-3 shrink-0">
          <div className="flex items-center gap-1">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center w-9 h-9 rounded-full text-[var(--body)] hover:text-[var(--primary)] hover:bg-[var(--pale-blue)] transition-colors touch-auto"
              >
                <Icon size={15} strokeWidth={1.75} />
              </a>
            ))}
            <div className="ml-auto">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>
          </div>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick('#contact')
            }}
            className="btn-shine flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[var(--btn-dark)] text-white dark:text-[var(--bg)] text-[14px] font-semibold hover:opacity-90 transition-opacity"
          >
            Let's talk
            <ArrowRight size={14} strokeWidth={2} />
          </a>
        </div>
      </motion.div>
    </>
  )
}
