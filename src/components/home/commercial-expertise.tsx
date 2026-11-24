'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { commercialTypes } from '@/content/services'
import { listingsHref } from '@/lib/properties/search-params'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'

/**
 * Commercial property types as an editorial index: the photograph follows the
 * row being hovered or focused. On small screens each row carries its own image.
 */
export function CommercialExpertise({ index }: { index?: string }) {
  const [active, setActive] = useState(0)

  return (
    <section className="bg-white section-y">
      <div className="container-wi">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading eyebrow="Commercial Real Estate" index={index} title="Commercial Expertise, Property by Property">
                Acquisition, leasing, sales and strategic guidance for investors, owners and businesses — with
                particular depth in multifamily and other income-producing assets.
              </SectionHeading>
              <div className="mt-9">
                <Button href="/commercial" variant="navy" arrow>
                  View Commercial Services
                </Button>
              </div>
            </Reveal>

            {/* Photograph that tracks the active row (desktop). */}
            <Reveal variant="unveil" delay={120} className="relative mt-14 hidden aspect-[4/5] overflow-hidden bg-mist-deep lg:block">
              {commercialTypes.map((type, i) => (
                <Image
                  key={type.slug}
                  src={type.image.src}
                  alt={i === active ? type.image.alt : ''}
                  fill
                  sizes="(min-width: 1024px) 36vw, 100vw"
                  className={cn(
                    'object-cover transition-[opacity,transform] duration-[900ms] ease-out-expo',
                    i === active ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0',
                  )}
                />
              ))}
              <p className="absolute bottom-0 left-0 bg-white px-5 py-3 text-eyebrow text-navy-deep">
                {String(active + 1).padStart(2, '0')} — {commercialTypes[active].name}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:pl-8">
            <ul className="border-t border-line">
              {commercialTypes.map((type, i) => {
                const isActive = i === active
                return (
                  <Reveal as="li" key={type.slug} delay={i * 60} className="border-b border-line">
                    <Link
                      href={listingsHref({ category: 'commercial', propertyTypes: [type.slug] })}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className="group relative flex items-start gap-5 py-7 transition-[padding] duration-500 ease-out-expo lg:items-center lg:gap-8 lg:py-9 lg:hover:pl-4 lg:focus-visible:pl-4"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'hidden w-7 shrink-0 text-[0.6875rem] font-semibold tracking-[0.2em] transition-colors duration-300 lg:block',
                          isActive ? 'text-brand-red' : 'text-slate/70',
                        )}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      <span className="relative block size-20 shrink-0 overflow-hidden bg-mist-deep lg:hidden">
                        <Image src={type.image.src} alt="" fill sizes="80px" className="object-cover" />
                      </span>

                      <span className="min-w-0 flex-1 lg:grid lg:grid-cols-[minmax(0,13rem)_1fr] lg:items-center lg:gap-8">
                        <span
                          className={cn(
                            'block text-display-sm transition-colors duration-300 lg:text-[1.75rem]',
                            isActive ? 'text-navy-deep' : 'text-navy-deep lg:text-navy-deep/55',
                          )}
                        >
                          {type.name}
                        </span>
                        <span className="mt-2 block text-[0.9375rem] leading-relaxed text-slate lg:mt-0">
                          {type.description}
                        </span>
                      </span>

                      <ArrowUpRight
                        aria-hidden
                        className={cn(
                          'mt-1 size-5 shrink-0 transition-[color,transform] duration-300 lg:mt-0',
                          isActive ? 'text-brand-red' : 'text-slate/50',
                          'group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                        )}
                        strokeWidth={1.5}
                      />
                      <span className="sr-only">— view {type.name.toLowerCase()} listings</span>
                    </Link>
                  </Reveal>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
