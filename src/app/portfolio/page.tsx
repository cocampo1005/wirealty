import { getPortfolio } from '@/content/portfolio'
import { images } from '@/content/images'
import { pageMetadata } from '@/lib/seo/metadata'
import { JsonLdScript, breadcrumbJsonLd } from '@/lib/seo/structured-data'
import { ClosingCta } from '@/components/layout/closing-cta'
import { PageHero } from '@/components/layout/page-hero'
import { PortfolioGrid } from '@/components/portfolio/portfolio-grid'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { SampleNotice } from '@/components/ui/sample-badge'

export const metadata = pageMetadata({
  title: 'Portfolio of Completed Transactions',
  description:
    'A record of commercial and residential transactions completed by Weston International Realty across South Florida.',
  path: '/portfolio',
  image: images.typeMultifamily.src,
})

export default function PortfolioPage() {
  const transactions = getPortfolio()
  const hasDrafts = transactions.some((t) => t.state === 'draft')

  return (
    <>
      <PageHero eyebrow="Portfolio" title="A Documented History of Experience." image={images.typeOffice}>
        Properties we have sold, acquired and leased on behalf of clients — commercial and residential.
      </PageHero>

      <section className="bg-white section-y-sm">
        <div className="container-wi">
          {hasDrafts ? (
            <SampleNotice className="mb-10">
              Every record on this page is a draft sample that demonstrates the layout — none is a real
              transaction. They are hidden on the public site until verified transactions are published.
            </SampleNotice>
          ) : null}

          {transactions.length > 0 ? (
            <PortfolioGrid transactions={transactions} />
          ) : (
            <Reveal className="grid gap-8 border border-line bg-mist p-8 sm:p-12 lg:grid-cols-12 lg:items-center lg:p-16">
              <div className="lg:col-span-8">
                <h2 className="text-display-md text-navy-deep">Our portfolio is being prepared for publication.</h2>
                <p className="mt-4 max-w-2xl text-slate">
                  We are documenting selected transactions for this page. In the meantime, we are glad to
                  discuss our experience with a particular property type or area directly.
                </p>
              </div>
              <div className="lg:col-span-4 lg:justify-self-end">
                <Button href="/contact" arrow>
                  Contact Us
                </Button>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <ClosingCta
        eyebrow="Your Property Could Be Next"
        title="Considering a Sale, Purchase or Lease?"
        cta={{ label: 'Start a Conversation', href: '/contact' }}
      >
        Tell us about the property and your goals. We will follow up personally.
      </ClosingCta>

      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
        ])}
      />
    </>
  )
}
