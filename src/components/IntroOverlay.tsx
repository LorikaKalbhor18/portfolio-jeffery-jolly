import { useState, useEffect } from 'react'
import { Shield } from 'lucide-react'

const SESSION_KEY = 'intro_seen'

export default function IntroOverlay() {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return
    } catch (_) {}
    setVisible(true)
    const timer = setTimeout(() => dismiss(), 1150)
    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    setLeaving(true)
    setTimeout(() => {
      setVisible(false)
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch (_) {}
    }, 300)
  }

  if (!visible) return null

  return (
    <div
      className={[
        'fixed inset-0 z-[100] flex flex-col items-center justify-center',
        'bg-[var(--bg)] transition-opacity duration-300',
        leaving ? 'opacity-0' : 'opacity-100',
      ].join(' ')}
      role="status"
      aria-label="Loading"
    >
      <div
        className={[
          'flex flex-col items-center gap-4 transition-all duration-700',
          leaving ? 'opacity-0 scale-95' : 'opacity-100 scale-100',
        ].join(' ')}
        style={{
          filter: leaving ? 'blur(0px)' : undefined,
          animation: 'intro-blur-in 0.8s ease-out forwards',
        }}
      >
        <div className="w-16 h-16 rounded-2xl bg-[var(--primary)] flex items-center justify-center shadow-lg">
          <Shield size={32} className="text-white" />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-[var(--heading)]">Jeffrey Jolly</p>
          <p className="text-sm text-[var(--body)] mt-0.5">Cybersecurity Professional</p>
        </div>
      </div>

      <button
        onClick={dismiss}
        className="absolute bottom-8 text-xs text-[var(--body)] hover:text-[var(--heading)] transition-colors underline underline-offset-2"
        aria-label="Skip intro"
      >
        Skip
      </button>

      <style>{`
        @keyframes intro-blur-in {
          from { filter: blur(12px); opacity: 0; transform: scale(0.96); }
          to   { filter: blur(0px);  opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
