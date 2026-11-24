import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { propertyTypeLabels } from '@/lib/properties/labels'
import type { PortfolioTransaction } from '@/lib/properties/types'
import { formatCurrency } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import { SampleBadge } from '@/components/ui/sample-badge'

interface PortfolioCardProps {
  transaction: PortfolioTransaction
  tone?: 'dark' | 'light'
  /** Tailwind aspect-ratio class for the image, to vary the grid rhythm. */
  aspect?: string
  sizes?: string
  className?: string
}

export function PortfolioCard({
  transaction,
  tone = 'light',
  aspect = 'aspect-[4/3]',
  sizes = '(min-width: 1024px) 40vw, 100vw',
  className,
}: PortfolioCardProps) {
  const dark = tone === 'dark'
  return (
    <article className={cn('group relative', className)}>
      <div className={cn('relative overflow-hidden', aspect, dark ? 'bg-navy' : 'bg-mist-deep')}>
        <Image
          src={transaction.cover.src}
          alt={transaction.cover.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.045]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-navy-deep/70 via-navy-deep/0 to-navy-deep/0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        />
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center bg-white px-2.5 py-1.5 text-[0.625rem] leading-none font-semibold tracking-[0.16em] text-navy-deep uppercase">
            {transaction.status}
          </span>
          {transaction.state === 'draft' ? <SampleBadge>Draft sample</SampleBadge> : null}
        </div>
        <span
          aria-hidden
          className="absolute right-4 bottom-4 inline-flex size-11 translate-y-2 items-center justify-center bg-brand-red text-white opacity-0 transition-[opacity,transform] duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-4" strokeWidth={1.75} />
        </span>
      </div>

      <div className="pt-5">
        <p className={cn('text-eyebrow', dark ? 'text-sky' : 'text-brand-blue')}>
          {propertyTypeLabels[transaction.propertyType]}
          <span className={cn('mx-2', dark ? 'text-white/30' : 'text-line')}>/</span>
          <span className={dark ? 'text-white/60' : 'text-slate'}>
            {transaction.city}
            {transaction.year ? ` · ${transaction.year}` : ''}
          </span>
        </p>
        <h3 className={cn('mt-3 text-display-sm', dark ? 'text-white' : 'text-navy-deep')}>
          <Link
            href={`/portfolio/${transaction.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-current"
          >
            {transaction.title}
          </Link>
        </h3>
        <p className={cn('mt-2 text-sm', dark ? 'text-white/65' : 'text-slate')}>
          {transaction.role}
          {transaction.price ? ` · ${formatCurrency(transaction.price)}` : ''}
        </p>
      </div>
    </article>
  )
}
