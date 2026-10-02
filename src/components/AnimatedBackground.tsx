import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useThemeContext } from '@/components/ThemeProvider'

// ── Canvas node network ──────────────────────────────────────────────────────

interface Node {
  x: number; y: number; vx: number; vy: number
}

function isMobile() {
  return window.innerWidth < 768
}

export default function AnimatedBackground() {
  const reduced = useReducedMotion()
  const { theme } = useThemeContext()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const nodesRef = useRef<Node[]>([])

  // Canvas network
  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mobile = isMobile()
    const COUNT = mobile ? 30 : 70
    const MAX_DIST = mobile ? 100 : 140
    const SPEED = 0.25

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }
    resize()

    // Init nodes
    nodesRef.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
    }))

    const isDark = () => document.documentElement.classList.contains('dark')

    const draw = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const dark = isDark()
      const baseNodeAlpha = dark ? 0.6 : 0.35
      const baseLineAlpha = dark ? 0.25 : 0.18

      const nodes = nodesRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Compute per-node alpha: fade nodes that sit in the left-column
      // text area (left 58% of viewport, top 80%) to keep headline readable.
      const textZoneRight = w * 0.58
      const textZoneBottom = h * 0.80

      const nodeAlpha = (nx: number, ny: number) => {
        if (nx < textZoneRight && ny < textZoneBottom) {
          // Soft gradient fade: full opacity at edges, 30% at centre of zone
          const fx = Math.min(nx / textZoneRight, 1)          // 0 at left → 1 at zone edge
          const fy = Math.min(ny / textZoneBottom, 1)         // 0 at top  → 1 at zone edge
          const proximity = 1 - Math.min(fx, fy)              // how deep inside the zone
          return baseNodeAlpha * (1 - proximity * 0.72)
        }
        return baseNodeAlpha
      }

      for (const n of nodes) {
        // Gentle cursor attraction
        const dx = mx - n.x
        const dy = my - n.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 220 && dist > 0) {
          n.vx += (dx / dist) * 0.012
          n.vy += (dy / dist) * 0.012
        }

        // Speed cap
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
        if (speed > 0.8) { n.vx *= 0.8 / speed; n.vy *= 0.8 / speed }

        n.x += n.vx
        n.y += n.vy

        // Wrap edges
        if (n.x < 0) n.x = w
        if (n.x > w) n.x = 0
        if (n.y < 0) n.y = h
        if (n.y > h) n.y = 0

        // Draw node
        const na = nodeAlpha(n.x, n.y)
        const rgb = dark ? '91,155,255' : '37,99,235'
        ctx.beginPath()
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${na})`
        ctx.fill()
      }

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < MAX_DIST) {
            // Use the dimmer of the two endpoint alphas for the line
            const la = Math.min(nodeAlpha(nodes[i].x, nodes[i].y), nodeAlpha(nodes[j].x, nodes[j].y))
            const lineA = la / baseNodeAlpha  // normalise to 0-1
            const rgb = dark ? '91,155,255' : '37,99,235'
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(${rgb},${lineA * baseLineAlpha * (1 - d / MAX_DIST)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current)
      } else {
        rafRef.current = requestAnimationFrame(draw)
      }
    }

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const onResize = () => { resize() }

    rafRef.current = requestAnimationFrame(draw)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
    }
  }, [reduced, theme])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Gradient mesh orbs */}
      {!reduced && (
        <div className="absolute inset-0">
          <div className={[
            'absolute rounded-full blur-3xl animate-orb-1',
            'w-[600px] h-[600px] -top-32 -left-32',
            'bg-blue-200/55 dark:bg-[#1D4ED8]/[0.12]',
          ].join(' ')} />
          <div className={[
            'absolute rounded-full blur-3xl animate-orb-2',
            'w-[500px] h-[500px] top-1/3 -right-24',
            'bg-indigo-200/45 dark:bg-indigo-900/25',
          ].join(' ')} />
          <div className={[
            'absolute rounded-full blur-3xl animate-orb-3',
            'w-[400px] h-[400px] bottom-0 left-1/3',
            'bg-violet-200/35 dark:bg-violet-900/18',
          ].join(' ')} />
        </div>
      )}

      {/* Node canvas */}
      {!reduced && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  )
}
