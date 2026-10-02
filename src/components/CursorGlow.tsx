import { useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function CursorGlow() {
  const reduced = useReducedMotion()

  useEffect(() => {
    // Only on pointer-capable devices
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const el = document.getElementById('cursor-glow')
    if (!el) return

    el.style.opacity = '1'
    let rafId = 0
    let tx = -9999, ty = -9999

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
    }

    const tick = () => {
      el.style.transform = `translate(calc(${tx}px - 50%), calc(${ty}px - 50%))`
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      el.style.opacity = '0'
    }
  }, [reduced])

  return <div id="cursor-glow" style={{ opacity: 0 }} aria-hidden="true" />
}
