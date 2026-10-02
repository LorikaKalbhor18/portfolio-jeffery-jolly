import type { MouseEventHandler } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type LogoProps = {
  showSubtitle?: boolean
  className?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export default function Logo({
  showSubtitle = true,
  className = '',
  onClick,
}: LogoProps) {
  const reduced = useReducedMotion()

  return (
    <a
      href="#home"
      onClick={onClick}
      aria-label="Jeffrey Jolly, home"
      className={`logo inline-flex flex-col items-start rounded-lg leading-none text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary,#2563EB)]${reduced ? ' logo--reduced' : ''} ${className}`}
    >
      <span className="text-[19px] font-semibold tracking-tight text-[var(--heading,#0B1220)] sm:text-[20px]">
        Jeffrey Jolly
        <span
          aria-hidden="true"
          className="logo-cursor ml-px text-[var(--primary,#2563EB)]"
        >
          _
        </span>
      </span>
      {showSubtitle && (
        <span className="mt-1.5 hidden text-[11px] font-medium text-[var(--body,#4B5565)] min-[1280px]:block">
          Cybersecurity Professional
        </span>
      )}
    </a>
  )
}