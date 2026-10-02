import { useState, useEffect } from 'react'

// Global store so footer toggle syncs everywhere
let listeners: Array<(v: boolean) => void> = []
let manualReduced: boolean | null = null

export function setReducedMotion(val: boolean) {
  manualReduced = val
  try { localStorage.setItem('reduceMotion', String(val)) } catch (_) {}
  listeners.forEach((fn) => fn(val))
}

export function useReducedMotion(): boolean {
  const systemPref =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const getInitial = () => {
    if (manualReduced !== null) return manualReduced
    try {
      const stored = localStorage.getItem('reduceMotion')
      if (stored !== null) return stored === 'true'
    } catch (_) {}
    return systemPref
  }

  const [reduced, setReduced] = useState<boolean>(getInitial)

  useEffect(() => {
    const handler = (v: boolean) => setReduced(v)
    listeners.push(handler)
    return () => { listeners = listeners.filter((l) => l !== handler) }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => {
      if (manualReduced === null) setReduced(e.matches)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
