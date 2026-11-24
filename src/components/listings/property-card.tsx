import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import {
  cityLine,
  keyFacts,
  priceLabel,
  propertyTitle,
  propertyTypeLabels,
  statusLabel,
  streetAddress,
} from '@/lib/properties/labels'
import type { Property } from '@/lib/properties/types'
import { cn } from '@/lib/utils/cn'
import { SampleBadge } from '@/components/ui/sample-badge'
import { FavoriteButton } from './favorite-button'

interface PropertyCardProps {
  property: Property
  /** `feature` is the large editorial treatment used for curated opportunities. */
  variant?: 'default' | 'feature'
  /** Optional editorial note (featured opportunities). */
  note?: string
  sizes?: string
  /** Set on the first visible cards to load their image eagerly. */
  eager?: boolean
  className?: string
}

export function PropertyCard({
  property,
  variant = 'default',
  note,
  sizes = '(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw',
  eager = false,
  className,
}: PropertyCardProps) {
  const title = propertyTitle(property)
  const cover = property.media[0]
  const facts = keyFacts(property)
  const feature = variant === 'feature'
  const commercial = property.category === 'commercial'

  return (
    <article className={cn('group relative flex h-full flex-col', className)}>
      <div className={cn('relative overflow-hidden bg-mist-deep', feature ? 'aspect-[4/3] lg:aspect-[4/5]' : 'aspect-[4/3]')}>
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes={sizes}
            loading={eager ? 'eager' : 'lazy'}
            className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.045]"
          />
        ) : null}
        <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-navy-deep/35 to-transparent" />

        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-1.5 text-[0.625rem] leading-none font-semibold tracking-[0.16em] uppercase',
              commercial ? 'bg-navy-deep text-white' : 'bg-white text-navy-deep',
            )}
          >
            {statusLabel(property)}
          </span>
          {property.source === 'fixture' ? <SampleBadge /> : null}
        </div>

        <FavoriteButton propertyId={property.id} label={title} className="absolute top-3 right-3 z-10" />
      </div>

      <div className={cn('flex flex-1 flex-col', feature ? 'pt-6' : 'pt-5')}>
        <p className="text-eyebrow text-brand-blue">
          {note ?? propertyTypeLabels[property.propertyType]}
          <span className="mx-2 text-line">/</span>
          <span className="text-slate">{property.address.city}</span>
        </p>

        <h3
          className={cn(
            'mt-3 text-navy-deep',
            feature ? 'text-display-sm' : 'text-[1.0625rem] leading-snug font-semibold',
          )}
        >
          <Link
            href={`/listings/${property.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand-blue"
          >
            {title}
          </Link>
        </h3>

        <p className="mt-1.5 text-sm text-slate">
          {property.title ? `${streetAddress(property)} · ` : ''}
          {cityLine(property)}
        </p>

        {feature ? <p className="mt-4 max-w-xl text-[0.9375rem] text-slate">{property.summary}</p> : null}

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <div className="min-w-0 flex-1 border-t border-line pt-4">
            <p className={cn('font-semibold text-navy-deep', feature ? 'text-xl' : 'text-lg')}>{priceLabel(property)}</p>
            {facts.length > 0 ? (
              <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem] text-slate">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-baseline gap-1.5">
                    <dd className="font-semibold text-ink">{fact.value}</dd>
                    <dt>{fact.label}</dt>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
          <span
            aria-hidden
            className="mb-1 inline-flex size-10 shrink-0 items-center justify-center border border-line text-navy-deep transition-colors duration-300 group-hover:border-brand-red group-hover:bg-brand-red group-hover:text-white"
          >
            <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </article>
  )
}
