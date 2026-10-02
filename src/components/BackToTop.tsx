import { useState, useEffect, useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const SHOW_THRESHOLD = 500
const RADIUS = 18
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const reduced = useReducedMotion()
  const ticking = useRef(false)

  useEffect(() => {
    const update = () => {
      const y = window.scrollY
      const docH = document.documentElement.scrollHeight - window.innerHeight
      const p = docH > 0 ? Math.min(y / docH, 1) : 0
      setProgress(p)
      setVisible(y > SHOW_THRESHOLD)
      ticking.current = false
    }

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' })}
      aria-label="Back to top"
      className={[
        'fixed z-40 flex items-center justify-center',
        'w-11 h-11 rounded-full',
        'bg-[var(--surface)] border border-[var(--border)]',
        'text-[var(--primary)] hover:bg-[var(--pale-blue)]',
        'shadow-card transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
      ].join(' ')}
      style={{
        bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
        right: 'calc(1.5rem + env(safe-area-inset-right))',
      }}
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 44 44"
        aria-hidden="true"
      >
        <circle
          cx="22" cy="22" r={RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
        />
        <circle
          cx="22" cy="22" r={RADIUS}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <ArrowUp size={15} className="relative z-10" strokeWidth={2} />
    </button>
  )
}
