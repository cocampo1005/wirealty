import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getPortfolio, getPortfolioTransaction } from '@/content/portfolio'
import { propertyTypeLabels } from '@/lib/properties/labels'
import { pageMetadata } from '@/lib/seo/metadata'
import { JsonLdScript, breadcrumbJsonLd } from '@/lib/seo/structured-data'
import { formatCurrency } from '@/lib/utils/format'
import { ClosingCta } from '@/components/layout/closing-cta'
import { PageHero } from '@/components/layout/page-hero'
import { PageHeroSkeleton } from '@/components/layout/page-hero-skeleton'
import { PortfolioCard } from '@/components/portfolio/portfolio-card'
import { ArrowLink } from '@/components/ui/arrow-link'
import { Reveal } from '@/components/ui/reveal'
import { SampleNotice } from '@/components/ui/sample-badge'

type Props = PageProps<'/portfolio/[slug]'>

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const transaction = getPortfolioTransaction(slug)
  if (!transaction) return { title: 'Transaction Not Found', robots: { index: false } }
  return pageMetadata({
    title: `${transaction.title} — ${transaction.city}`,
    description: transaction.summary,
    path: `/portfolio/${transaction.slug}`,
    image: transaction.cover.src,
    // Draft samples must never be indexed.
    noindex: transaction.state !== 'published',
  })
}

/**
 * Portfolio records are resolved at request time (the published set may be
 * empty at build), so the detail streams in behind a skeleton.
 */
export default function PortfolioTransactionPage({ params }: Props) {
  return (
    <Suspense fallback={<PageHeroSkeleton label="Loading transaction" />}>
      <TransactionDetail params={params} />
    </Suspense>
  )
}

async function TransactionDetail({ params }: Pick<Props, 'params'>) {
  const { slug } = await params
  const transaction = getPortfolioTransaction(slug)
  if (!transaction) notFound()

  const others = getPortfolio()
    .filter((t) => t.slug !== transaction.slug)
    .sort((a, b) => Number(b.category === transaction.category) - Number(a.category === transaction.category))
    .slice(0, 2)

  const facts = [
    { label: 'Status', value: transaction.status },
    { label: 'Transaction', value: transaction.transactionType },
    ...transaction.facts,
    ...(transaction.year ? [{ label: 'Year', value: String(transaction.year) }] : []),
    ...(transaction.price ? [{ label: 'Price', value: formatCurrency(transaction.price) }] : []),
  ]

  return (
    <>
      <PageHero
        eyebrow={`Portfolio · ${propertyTypeLabels[transaction.propertyType]}`}
        title={transaction.title}
        size="compact"
      >
        {transaction.city}
        {transaction.county ? `, ${transaction.county}` : ''} · {transaction.role}
      </PageHero>

      <section className="bg-white section-y-sm">
        <div className="container-wi">
          {transaction.state === 'draft' ? (
            <SampleNotice className="mb-8">
              This is a draft sample record — not a real transaction. It is hidden on the public site.
            </SampleNotice>
          ) : null}

          <Reveal variant="unveil" className="relative aspect-[4/3] overflow-hidden bg-mist-deep sm:aspect-[16/9] lg:aspect-[16/8]">
            <Image
              src={transaction.cover.src}
              alt={transaction.cover.alt}
              fill
              preload
              sizes="(min-width: 1344px) 1250px, 100vw"
              className="object-cover"
            />
          </Reveal>

          <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-lead text-ink">{transaction.summary}</p>
                <div className="mt-6 space-y-5 text-slate">
                  {transaction.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={100} className="lg:col-span-4 lg:col-start-9">
              <h2 className="text-eyebrow text-slate">Transaction Details</h2>
              <dl className="mt-5 border-t border-line">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-baseline justify-between gap-6 border-b border-line py-4">
                    <dt className="text-sm text-slate">{fact.label}</dt>
                    <dd className="text-right font-semibold text-navy-deep">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {transaction.gallery?.length ? (
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-20">
              {transaction.gallery.map((image, i) => (
                <Reveal as="li" key={image.src} variant="unveil" delay={i * 100} className="relative aspect-[4/3] overflow-hidden bg-mist-deep">
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                </Reveal>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {others.length > 0 ? (
        <section className="bg-mist section-y-sm">
          <div className="container-wi">
            <div className="flex items-end justify-between gap-6">
              <h2 className="text-display-md text-navy-deep">More Transactions</h2>
              <ArrowLink href="/portfolio">Full Portfolio</ArrowLink>
            </div>
            <div className="mt-10 grid gap-x-10 gap-y-14 md:grid-cols-2">
              {others.map((item) => (
                <PortfolioCard key={item.slug} transaction={item} sizes="(min-width: 768px) 46vw, 100vw" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ClosingCta
        eyebrow="Similar Property?"
        title="Let’s Talk About Yours."
        cta={{ label: 'Start a Conversation', href: '/contact' }}
      >
        If you own, or are looking for, a similar property, we would be glad to discuss it with you.
      </ClosingCta>

      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
          { name: transaction.title, path: `/portfolio/${transaction.slug}` },
        ])}
      />
    </>
  )
}
