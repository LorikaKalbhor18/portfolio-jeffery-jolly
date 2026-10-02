export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={[
        'fixed top-2 left-2 z-[200] px-4 py-2 rounded-lg',
        'bg-[var(--primary)] text-white text-sm font-semibold',
        'translate-y-[-120%] focus:translate-y-0',
        'transition-transform duration-200',
        'touch-auto',
      ].join(' ')}
    >
      Skip to main content
    </a>
  )
}
