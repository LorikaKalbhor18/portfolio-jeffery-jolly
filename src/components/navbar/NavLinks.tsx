import { motion, LayoutGroup } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface NavLink {
  label: string
  href: string
}

interface NavLinksProps {
  links: NavLink[]
  active: string
  onNavigate: (href: string) => void
  /** When false the links point back to the home page sections (/ #about). */
  onHomePage?: boolean
}
export default function NavLinks({ links, active, onNavigate, onHomePage = true }: NavLinksProps) {
  const reduced = useReducedMotion()

  return (
    <LayoutGroup id="nav-pill">
      <ul
        className="hidden xl:flex items-center gap-0.5 bg-[var(--bg-alt)] rounded-full px-1.5 py-1"
        role="list"
      >
        {links.map((link) => {
          const isActive = active === link.href.slice(1)
          // On a detail page the sections only exist on the home page.
          const href = onHomePage ? link.href : '/' + link.href
          return (
            <li key={link.href} className="relative">
              {isActive && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-[var(--surface)] shadow-sm"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 400, damping: 35 }
                  }
                  aria-hidden="true"
                />
              )}
              <a
                href={href}
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate(link.href)
                }}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'relative z-10 inline-flex items-center px-3.5 py-1.5 rounded-full',
                  'text-[13px] font-medium transition-colors duration-200',
                  isActive
                    ? 'text-[var(--primary)]'
                    : 'text-[var(--body)] hover:text-[var(--heading)]',
                ].join(' ')}
              >
                {link.label}
              </a>
            </li>
          )
        })}
      </ul>
    </LayoutGroup>
  )
}
