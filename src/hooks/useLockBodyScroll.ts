import { useEffect } from 'react'

/** Locks body scroll while `locked` is true. */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [locked])
}
