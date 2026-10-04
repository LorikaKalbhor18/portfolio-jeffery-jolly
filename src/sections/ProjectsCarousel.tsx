import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { projects, type Project } from '@/data/projects'
import { projectIcon } from '@/lib/projectIcons'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const carouselLoops = true
/** Pointer travel (px) beyond which a click counts as a drag, not a tap. */
const DRAG_THRESHOLD = 6

function ProjectCard({
  project,
  isActive,
}: {
  project: Project
  isActive: boolean
}) {
  const reduced = useReducedMotion()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const Icon = projectIcon(project.icon)

  // A drag across the carousel should not follow the link, so a click is
  // ignored when the pointer travelled more than the threshold.
  const start = useRef<{ x: number; y: number } | null>(null)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 8
    const y = -((e.clientX - rect.left) / rect.width - 0.5) * 8
    setTilt({ x, y })
  }

  return (
    <motion.div
      animate={{
        scale: 1,
        opacity: isActive ? 1 : 0.6,
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={
        hovering && !reduced
          ? { transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }
          : undefined
      }
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false)
        setTilt({ x: 0, y: 0 })
      }}
      className={[
        'relative flex flex-col gap-4 p-6 rounded-card-lg border bg-[var(--surface)] h-full',
        'transition-shadow duration-200',
        isActive
          ? 'border-[var(--primary)]/30 shadow-card-hover'
          : 'border-[var(--border)] shadow-card',
        hovering && isActive ? 'shadow-[0_12px_40px_0_rgba(37,99,235,0.18)]' : '',
      ].join(' ')}
    >
      {/* Active indicator */}
      {isActive && <div className="w-8 h-1 rounded-full bg-[var(--primary)]" aria-hidden="true" />}

      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--pale-blue)] text-[var(--primary)]"
          aria-hidden="true"
        >
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <h3 className="text-lg font-bold text-[var(--heading)]">{project.title}</h3>
      </div>

      <p className="text-sm text-[var(--body)] leading-relaxed flex-1">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 pt-1">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--pale-blue)] text-[var(--primary)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <span className="inline-flex items-center gap-1.5 pt-1 text-[13px] font-semibold text-[var(--primary)]">
        View methodology
        <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
      </span>

      {/* The whole card is one real link so middle-click and keyboard work. */}
      <Link
        to={`/projects/${project.slug}`}
        aria-label={`View methodology: ${project.title}`}
        onPointerDown={(e) => {
          start.current = { x: e.clientX, y: e.clientY }
        }}
        onClick={(e) => {
          const s = start.current
          start.current = null
          if (!s) return
          const moved = Math.hypot(e.clientX - s.x, e.clientY - s.y)
          if (moved > DRAG_THRESHOLD) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
        className="absolute inset-0 z-10 rounded-card-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
      />
    </motion.div>
  )
}

export default function ProjectsCarousel() {
  const reduced = useReducedMotion()

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: carouselLoops,
      align: 'center',
      skipSnaps: false,
      dragFree: false,
    },
    reduced ? [] : [Autoplay({ delay: 3500, stopOnInteraction: true })]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [canScrollPrev, setCanScrollPrev] = useState(carouselLoops)
  const [canScrollNext, setCanScrollNext] = useState(carouselLoops)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(carouselLoops || emblaApi.canScrollPrev())
    setCanScrollNext(carouselLoops || emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    onSelect()
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      scrollPrev()
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      scrollNext()
    }
  }

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 bg-[var(--bg-alt)]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-2">
            My work
          </p>
          <h2 className="text-section font-bold text-[var(--heading)]">Security assessments</h2>
          <p className="mt-3 text-[var(--body)] text-sm max-w-md mx-auto">
            Methodology-level overviews of assessment types I conduct.
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          role="region"
          aria-label="Security assessment projects carousel"
          onKeyDown={onKeyDown}
          tabIndex={0}
        >
          <div className="project-carousel__viewport overflow-hidden" ref={emblaRef}>
            <div className="flex items-stretch gap-4 py-4 lg:px-16">
              {projects.map((project, i) => (
                <div
                  key={project.slug}
                  className="relative flex flex-none w-[85%] sm:w-[60%] lg:w-[40%]"
                  role="group"
                  aria-label={`${i + 1} of ${projects.length}: ${project.title}`}
                  aria-roledescription="slide"
                >
                  <ProjectCard project={project} isActive={i === selectedIndex} />
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous project"
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 min-h-0 min-w-0 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-card items-center justify-center text-[var(--heading)] hover:bg-[var(--pale-blue)] hover:text-[var(--primary)] transition-colors disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next project"
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 min-h-0 min-w-0 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-card items-center justify-center text-[var(--heading)] hover:bg-[var(--pale-blue)] hover:text-[var(--primary)] transition-colors disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Mobile controls */}
        <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous project"
            className="flex h-8 min-h-0 w-8 min-w-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--heading)] transition-colors hover:bg-[var(--pale-blue)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronLeft size={16} />
          </button>

          <div
            className="project-carousel__dots flex items-center justify-center gap-2"
            role="group"
            aria-label="Choose project"
          >
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1} of ${projects.length}`}
                aria-current={i === selectedIndex ? 'true' : undefined}
                onClick={() => emblaApi?.scrollTo(i)}
                className="project-carousel__dot"
              >
                <span
                  className={[
                    'block h-2 rounded-full transition-[width,background-color] duration-[250ms] ease-in-out',
                    i === selectedIndex ? 'w-6 bg-[var(--primary)]' : 'w-2 bg-[var(--border)]',
                  ].join(' ')}
                />
              </button>
            ))}
          </div>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next project"
            className="flex h-8 min-h-0 w-8 min-w-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--heading)] transition-colors hover:bg-[var(--pale-blue)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Desktop dots */}
        <div className="mt-6 hidden items-center justify-center lg:flex">
          <div
            className="project-carousel__dots flex items-center justify-center gap-2"
            role="group"
            aria-label="Choose project"
          >
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1} of ${projects.length}`}
                aria-current={i === selectedIndex ? 'true' : undefined}
                onClick={() => emblaApi?.scrollTo(i)}
                className="project-carousel__dot"
              >
                <span
                  className={[
                    'block h-2 rounded-full transition-[width,background-color] duration-[250ms] ease-in-out',
                    i === selectedIndex ? 'w-6 bg-[var(--primary)]' : 'w-2 bg-[var(--border)]',
                  ].join(' ')}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
