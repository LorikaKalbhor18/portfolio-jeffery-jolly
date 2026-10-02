import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { projects } from '@/data/content'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function ProjectCard({
  title,
  description,
  tags,
  isActive,
}: {
  title: string
  description: string
  tags: string[]
  isActive: boolean
}) {
  const reduced = useReducedMotion()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)

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
        scale: isActive ? 1 : 0.93,
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
      onMouseLeave={() => { setHovering(false); setTilt({ x: 0, y: 0 }) }}
      className={[
        'flex flex-col gap-4 p-6 rounded-card-lg border bg-[var(--surface)] h-full',
        'transition-shadow duration-200',
        isActive
          ? 'border-[var(--primary)]/30 shadow-card-hover'
          : 'border-[var(--border)] shadow-card',
        hovering && isActive ? 'shadow-[0_12px_40px_0_rgba(37,99,235,0.18)]' : '',
      ].join(' ')}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="w-8 h-1 rounded-full bg-[var(--primary)]" aria-hidden="true" />
      )}

      <h3 className="text-lg font-bold text-[var(--heading)]">{title}</h3>
      <p className="text-sm text-[var(--body)] leading-relaxed flex-1">{description}</p>

      <div className="flex flex-wrap gap-2 pt-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--pale-blue)] text-[var(--primary)]"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function ProjectsCarousel() {
  const reduced = useReducedMotion()

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      skipSnaps: false,
      dragFree: false,
    },
    reduced ? [] : [Autoplay({ delay: 3500, stopOnInteraction: true })]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    onSelect()
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollPrev() }
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollNext() }
  }

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 bg-[var(--bg-alt)]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-2">
            My work
          </p>
          <h2 className="text-section font-bold text-[var(--heading)]">
            Security assessments
          </h2>
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
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 py-4">
              {projects.map((project, i) => (
                <div
                  key={project.title}
                  className="flex-none w-[85%] sm:w-[60%] lg:w-[40%]"
                  role="group"
                  aria-label={`${i + 1} of ${projects.length}: ${project.title}`}
                  aria-roledescription="slide"
                >
                  <ProjectCard
                    {...project}
                    isActive={i === selectedIndex}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={scrollPrev}
            aria-label="Previous project"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-10 w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-card flex items-center justify-center text-[var(--heading)] hover:bg-[var(--pale-blue)] hover:text-[var(--primary)] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next project"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-10 w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-card flex items-center justify-center text-[var(--heading)] hover:bg-[var(--pale-blue)] hover:text-[var(--primary)] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dots */}
        <div
          className="flex items-center justify-center gap-2 mt-6"
          role="tablist"
          aria-label="Carousel navigation"
        >
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`Go to slide ${i + 1}: ${projects[i]?.title}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={[
                'rounded-full transition-all duration-300',
                i === selectedIndex
                  ? 'w-6 h-2 bg-[var(--primary)]'
                  : 'w-2 h-2 bg-[var(--border)] hover:bg-[var(--body)]',
              ].join(' ')}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
