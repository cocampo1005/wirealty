import { getFeaturedProperties } from '@/content/featured-properties'
import { listingsHref } from '@/lib/properties/search-params'
import type { PropertyCategory } from '@/lib/properties/types'
import { ArrowLink } from '@/components/ui/arrow-link'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { SampleNotice } from '@/components/ui/sample-badge'
import { SectionHeading } from '@/components/ui/section-heading'
import { PropertyCard } from '@/components/listings/property-card'

interface FeaturedOpportunitiesProps {
  /** Restrict to one category (the Commercial page shows commercial only). */
  category?: PropertyCategory
  index?: string
  title?: string
  intro?: string
}

export function FeaturedOpportunities({
  category,
  index,
  title = 'Featured Opportunities',
  intro = 'A curated selection of commercial and investment property, with multifamily and other income-producing assets at the forefront.',
}: FeaturedOpportunitiesProps) {
  const featured = getFeaturedProperties(category)
  const hasSamples = featured.some((entry) => entry.state === 'sample')
  const [lead, ...rest] = featured

  return (
    <section className="bg-white section-y">
      <div className="container-wi">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionHeading eyebrow="Opportunities" index={index} title={title} className="max-w-2xl">
              {intro}
            </SectionHeading>
          </Reveal>
          {featured.length > 0 ? (
            <Reveal delay={120} className="shrink-0">
              <ArrowLink href={listingsHref({ category: 'commercial' })}>View All Commercial Listings</ArrowLink>
            </Reveal>
          ) : null}
        </div>

        {hasSamples ? (
          <SampleNotice className="mt-10">
            The properties below are development samples that demonstrate the layout. They are not real
            listings and are hidden on the public site until approved opportunities are added.
          </SampleNotice>
        ) : null}

        {lead ? (
          <div className="mt-12 grid gap-x-10 gap-y-14 lg:mt-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <PropertyCard
                property={lead.property}
                note={lead.note}
                variant="feature"
                sizes="(min-width: 1024px) 56vw, 100vw"
              />
            </Reveal>
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-y-10 lg:pt-16">
              {rest.slice(0, 2).map((entry, i) => (
                <Reveal key={entry.id} delay={120 + i * 100}>
                  <PropertyCard
                    property={entry.property}
                    note={entry.note}
                    sizes="(min-width: 1024px) 38vw, (min-width: 640px) 50vw, 100vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        ) : (
          <Reveal className="mt-12 grid gap-8 border border-line bg-mist p-8 sm:p-12 lg:mt-16 lg:grid-cols-12 lg:items-center lg:p-16">
            <div className="lg:col-span-8">
              <h3 className="text-display-md text-navy-deep">Looking for a specific type of property?</h3>
              <p className="mt-4 max-w-2xl text-slate">
                Featured opportunities will be published here as they become available. In the meantime, tell
                us what you are looking for — property type, location and goals — and we will follow up with
                you directly.
              </p>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <Button href="/contact?interest=commercial" arrow>
                Discuss Your Criteria
              </Button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
