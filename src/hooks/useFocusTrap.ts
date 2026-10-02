import { useEffect, RefObject } from 'react'

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/**
 * Traps focus inside `containerRef` while `active` is true.
 * Moves focus to the first focusable element on activation.
 * Returns focus to `returnRef` on deactivation.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  returnRef?: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    // Move focus in
    first?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (focusable.length === 0) { e.preventDefault(); return }

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      // Return focus to trigger element
      returnRef?.current?.focus()
    }
  }, [active, containerRef, returnRef])
}
