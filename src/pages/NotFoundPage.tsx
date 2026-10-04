import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page not found | Jeffrey Jolly'
  }, [])

  return (
    <div className="pt-[120px] pb-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">
          404
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--heading)] tracking-tight">
          This page does not exist
        </h1>
        <p className="mt-4 text-[15px] text-[var(--body)] leading-relaxed max-w-[60ch]">
          The link may be out of date, or the page may have moved. Head back to the home page to
          find what you were looking for.
        </p>
        <Link
          to="/"
          className="btn-shine mt-7 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--btn-dark)] text-white dark:text-[var(--bg)] font-semibold text-sm hover:opacity-90 active:scale-[0.97] transition-all"
        >
          Back to home
          <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
