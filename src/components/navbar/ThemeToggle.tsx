import { Sun, Moon } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
  className?: string
}

export default function ThemeToggle({ theme, onToggle, className = '' }: ThemeToggleProps) {
  const reduced = useReducedMotion()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={[
        'relative flex items-center justify-center w-9 h-9 rounded-full',
        'text-[var(--body)] hover:text-[var(--heading)] hover:bg-[var(--pale-blue)]',
        'transition-colors duration-200',
        className,
      ].join(' ')}
    >
      {/* Sun */}
      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: isDark ? 1 : 0,
          transform: reduced ? 'none' : isDark ? 'rotate(0deg)' : 'rotate(-90deg)',
          transition: reduced ? 'none' : 'opacity 300ms ease, transform 300ms ease',
        }}
        aria-hidden="true"
      >
        <Sun size={16} strokeWidth={1.75} />
      </span>
      {/* Moon */}
      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: isDark ? 0 : 1,
          transform: reduced ? 'none' : isDark ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: reduced ? 'none' : 'opacity 300ms ease, transform 300ms ease',
        }}
        aria-hidden="true"
      >
        <Moon size={16} strokeWidth={1.75} />
      </span>
    </button>
  )
}
