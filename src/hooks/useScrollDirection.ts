import { useState, useEffect, useRef } from 'react'

interface ScrollState {
  /** true once scrolled past 20px — triggers navbar shrink */
  scrolled: boolean
  /** true when user scrolled down past 140px — navbar slides up */
  hidden: boolean
  /** 0–1 page scroll progress */
  progress: number
  /** raw scrollY */
  scrollY: number
}

/**
 * RAF-throttled scroll direction tracker.
 * @param drawerOpen - when true, never hides the navbar
 */
export function useScrollDirection(drawerOpen = false): ScrollState {
  const [state, setState] = useState<ScrollState>({
    scrolled: false,
    hidden: false,
    progress: 0,
    scrollY: 0,
  })

  const lastY = useRef(0)
  const ticking = useRef(false)
  const drawerOpenRef = useRef(drawerOpen)

  // Keep ref in sync without re-subscribing
  useEffect(() => {
    drawerOpenRef.current = drawerOpen
  }, [drawerOpen])

  useEffect(() => {
    const DEAD_ZONE = 6
    const HIDE_THRESHOLD = 140
    const SHRINK_THRESHOLD = 20

    const update = () => {
      const y = window.scrollY
      const docH = document.documentElement.scrollHeight - window.innerHeight
      const progress = docH > 0 ? Math.min(y / docH, 1) : 0
      const scrolled = y > SHRINK_THRESHOLD
      const delta = y - lastY.current

      let hidden = false
      if (!drawerOpenRef.current) {
        if (delta > DEAD_ZONE && y > HIDE_THRESHOLD) {
          hidden = true
        } else if (delta < -DEAD_ZONE) {
          hidden = false
        } else {
          // within dead zone — preserve previous hidden state
          setState((prev) => {
            hidden = prev.hidden
            return { scrolled, hidden, progress, scrollY: y }
          })
          lastY.current = y
          ticking.current = false
          return
        }
      }

      lastY.current = y
      ticking.current = false
      setState({ scrolled, hidden, progress, scrollY: y })
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

  return state
}
