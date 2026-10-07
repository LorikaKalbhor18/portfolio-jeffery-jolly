import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowRight, Calendar, Clock, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/data/content'
import posts from '@/data/posts.json'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Post {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  cover: string
  url?: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const reduced = useReducedMotion()
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col bg-[var(--surface)] rounded-card-lg border border-[var(--border)] shadow-card hover:shadow-card-hover transition-shadow duration-200 overflow-hidden h-full"
    >
      {/* Cover */}
      <div className="h-44 bg-[var(--pale-blue)] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
        {post.cover ? (
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-40">
            <BookOpen size={32} className="text-[var(--primary)]" />
            <span className="text-xs text-[var(--body)]">cover image</span>
          </div>
        )}
        {/* Tag pill overlay
        {post.tags[0] && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[var(--surface)]/90 text-[var(--primary)] border border-[var(--border)]">
            {post.tags[0]}
          </span>
        )} */}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex items-center gap-3 text-xs text-[var(--body)]">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {post.readTime}
          </span>
        </div>

        <h3 className="font-bold text-[var(--heading)] leading-snug group-hover:text-[var(--primary)] transition-colors">
          {post.title}
        </h3>

        <p className="text-sm text-[var(--body)] leading-relaxed flex-1">
          {post.excerpt}
        </p>

        <a
          href={post.url || siteConfig.medium}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)] hover:gap-2 transition-all mt-auto"
          aria-label={`Read ${post.title} on Medium`}
        >
          Read more <ArrowRight size={14} />
        </a>
      </div>
    </motion.article>
  )
}

function MobileCarousel({ items }: { items: Post[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true })
  const [selected, setSelected] = useState(0)

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  return (
    <div role="region" aria-label="Blog posts carousel">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {items.map((post, i) => (
            <div
              key={post.id}
              className="flex-none w-[85vw] max-w-sm"
              role="group"
              aria-label={`Post ${i + 1} of ${items.length}`}
              aria-roledescription="slide"
            >
              <PostCard post={post} index={i} />
            </div>
          ))}
        </div>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Blog carousel navigation">
        {items.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === selected}
            aria-label={`Go to post ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={[
              'rounded-full transition-all duration-300',
              i === selected ? 'w-5 h-2 bg-[var(--primary)]' : 'w-2 h-2 bg-[var(--border)] hover:bg-[var(--body)]',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[var(--pale-blue)] flex items-center justify-center">
        <BookOpen size={24} className="text-[var(--primary)]" />
      </div>
      <div>
        <p className="font-semibold text-[var(--heading)]">No posts yet</p>
        <p className="text-sm text-[var(--body)] mt-1">Articles will appear here once published.</p>
      </div>
      <a
        href={siteConfig.medium}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] hover:underline"
      >
        Visit Medium <ArrowRight size={14} />
      </a>
    </div>
  )
}

export default function BlogSection() {
  const typedPosts = posts as Post[]

  return (
    <section id="blog" className="py-20 px-4 sm:px-6 bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-2">
              Writing
            </p>
            <h2 className="text-section font-bold text-[var(--heading)]">
              Latest from my blog
            </h2>
          </div>
          {typedPosts.length > 0 && (
            <a
              href={siteConfig.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] hover:gap-2.5 transition-all whitespace-nowrap"
            >
              View all articles <ArrowRight size={14} />
            </a>
          )}
        </div>

        {typedPosts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {typedPosts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
            {/* Mobile carousel */}
            <div className="sm:hidden">
              <MobileCarousel items={typedPosts} />
            </div>
          </>
        )}
      </div>
    </section>
  )
}
