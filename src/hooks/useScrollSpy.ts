import { useState, useEffect } from 'react'

/**
 * Returns the id of the last section whose top edge is above 35% of viewport height.
 */
export function useScrollSpy(sectionIds: string[]): string {
  const [active, setActive] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    if (sectionIds.length === 0) return

    const THRESHOLD = 0.35 // 35% of viewport

    const update = () => {
      const trigger = window.innerHeight * THRESHOLD
      let current = sectionIds[0]

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= trigger) {
          current = id
        }
      }
      setActive(current)
    }

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          update()
          ticking = false
        })
      }
    }

    update() // run once on mount
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sectionIds])

  return active
}
