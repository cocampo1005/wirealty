import { getPortfolio } from '@/content/portfolio'
import type { PropertyCategory } from '@/lib/properties/types'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { SampleNotice } from '@/components/ui/sample-badge'
import { SectionHeading } from '@/components/ui/section-heading'
import { PortfolioCard } from '@/components/portfolio/portfolio-card'

interface PortfolioPreviewProps {
  category?: PropertyCategory
  index?: string
  title?: string
  intro?: string
  tone?: 'dark' | 'light'
}

/** Asymmetric grid: wide / narrow on the first row, narrow / wide on the second. */
const layout = [
  { span: 'lg:col-span-7', aspect: 'aspect-[4/3] lg:aspect-[16/10]' },
  { span: 'lg:col-span-5 lg:mt-24', aspect: 'aspect-[4/3]' },
  { span: 'lg:col-span-5', aspect: 'aspect-[4/3]' },
  { span: 'lg:col-span-7 lg:mt-24', aspect: 'aspect-[4/3] lg:aspect-[16/10]' },
]

export function PortfolioPreview({
  category,
  index,
  title = 'A Record of Completed Transactions',
  intro = 'Experience is easiest to judge by the work behind it. Our portfolio documents properties we have sold, acquired and leased on behalf of clients across South Florida.',
  tone = 'dark',
}: PortfolioPreviewProps) {
  const transactions = getPortfolio(category).slice(0, 4)
  const hasDrafts = transactions.some((t) => t.state === 'draft')
  const dark = tone === 'dark'

  return (
    <section
      className={cn(
        'relative isolate overflow-hidden section-y',
        dark ? 'on-dark bg-navy-deep text-white' : 'bg-white',
      )}
    >
      {dark ? <div aria-hidden className="absolute inset-0 -z-10 bg-blueprint" /> : null}
      <div className="container-wi">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionHeading eyebrow="Proven Portfolio" index={index} title={title} tone={dark ? 'light' : 'dark'} className="max-w-3xl">
              {intro}
            </SectionHeading>
          </Reveal>
          <Reveal delay={120} className="shrink-0">
            <Button href="/portfolio" variant={dark ? 'outline-light' : 'outline'} arrow>
              Explore Our Portfolio
            </Button>
          </Reveal>
        </div>

        {hasDrafts ? (
          <SampleNotice className="mt-10">
            These are draft sample records that demonstrate the layout — not real transactions. They are
            hidden on the public site until verified transactions are published.
          </SampleNotice>
        ) : null}

        {transactions.length > 0 ? (
          <div className="mt-12 grid gap-x-10 gap-y-14 lg:mt-16 lg:grid-cols-12">
            {transactions.map((transaction, i) => (
              <Reveal key={transaction.slug} delay={(i % 2) * 120} className={layout[i]?.span}>
                <PortfolioCard transaction={transaction} tone={tone} aspect={layout[i]?.aspect} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal
            className={cn(
              'mt-12 border p-8 sm:p-12 lg:mt-16 lg:p-16',
              dark ? 'border-white/15' : 'border-line bg-mist',
            )}
          >
            <p className={cn('max-w-3xl text-display-sm font-medium', dark ? 'text-white' : 'text-navy-deep')}>
              Our transaction portfolio is being prepared for publication.
            </p>
            <p className={cn('mt-4 max-w-2xl', dark ? 'text-white/70' : 'text-slate')}>
              If you would like to hear about our experience with a particular property type or area, we are
              glad to discuss it with you directly.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
