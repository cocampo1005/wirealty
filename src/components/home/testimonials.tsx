'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { hasUnapprovedTestimonials, visibleTestimonials } from '@/content/testimonials'
import { cn } from '@/lib/utils/cn'
import { Eyebrow } from '@/components/ui/eyebrow'
import { SampleNotice } from '@/components/ui/sample-badge'

/**
 * Client testimonials. Renders nothing unless there is at least one
 * testimonial that may be shown in the current mode — the public site never
 * falls back to invented reviews.
 */
export function Testimonials({ index }: { index?: string }) {
  const [active, setActive] = useState(0)
  const reduceMotion = useReducedMotion()
  const items = visibleTestimonials

  if (items.length === 0) return null
  const current = items[Math.min(active, items.length - 1)]

  return (
    <section className="bg-mist section-y">
      <div className="container-wi">
        <Eyebrow index={index}>Client Perspectives</Eyebrow>
        <h2 className="sr-only">What clients say</h2>

        {hasUnapprovedTestimonials ? (
          <SampleNotice className="mt-8">
            These testimonials are reproduced from the current website and are awaiting client approval. They
            are hidden on the public site until each one is marked as approved.
          </SampleNotice>
        ) : null}

        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={current.id}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="min-h-[22rem] sm:min-h-[19rem]"
              >
                <span aria-hidden className="block font-display text-7xl leading-[0.6] text-brand-red">
                  “
                </span>
                <blockquote className="mt-4">
                  {current.headline ? (
                    <p className="text-display-md text-navy-deep">{current.headline}</p>
                  ) : null}
                  <p className="mt-6 max-w-3xl text-lead text-ink">{current.quote}</p>
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span aria-hidden className="h-px w-10 bg-brand-red" />
                  <span>
                    <span className="block text-[0.9375rem] font-semibold text-navy-deep">{current.name}</span>
                    {current.role ? <span className="block text-sm text-slate">{current.role}</span> : null}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {items.length > 1 ? (
            <div className="lg:col-span-4">
              <ul role="group" aria-label="Choose a testimonial" className="border-t border-line">
                {items.map((item, i) => {
                  const selected = i === active
                  return (
                    <li key={item.id} className="border-b border-line">
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setActive(i)}
                        className={cn(
                          'group flex w-full items-center gap-4 py-4 text-left transition-colors duration-300',
                          selected ? 'text-navy-deep' : 'text-slate hover:text-navy-deep',
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            'h-px shrink-0 bg-brand-red transition-[width] duration-500 ease-out-expo',
                            selected ? 'w-8' : 'w-0 group-hover:w-4',
                          )}
                        />
                        <span className="min-w-0">
                          <span className="block text-[0.9375rem] font-semibold">{item.name}</span>
                          <span className="block text-[0.8125rem] text-slate">
                            {[item.role, item.service].filter(Boolean).join(' · ')}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
