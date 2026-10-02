interface ScrollProgressProps {
  progress: number
}

export default function ScrollProgress({ progress }: ScrollProgressProps) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-[var(--primary)]"
      style={{ transform: `scaleX(${progress})`, transition: 'transform 0.1s linear' }}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    />
  )
}
