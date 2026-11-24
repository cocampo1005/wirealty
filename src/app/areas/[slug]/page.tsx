import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { areas, citiesInCounty, getArea, getCounty } from '@/content/communities'
import { commercialTypes } from '@/content/services'
import { listingsHref } from '@/lib/properties/search-params'
import { pageMetadata } from '@/lib/seo/metadata'
import { JsonLdScript, breadcrumbJsonLd } from '@/lib/seo/structured-data'
import { ClosingCta } from '@/components/layout/closing-cta'
import { PageHero } from '@/components/layout/page-hero'
import { PageHeroSkeleton } from '@/components/layout/page-hero-skeleton'
import { LocatorMap } from '@/components/maps/locator-map'
import { ArrowLink } from '@/components/ui/arrow-link'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'

export function generateStaticParams() {
  return areas.map((area) => ({ slug: area.slug }))
}

export async function generateMetadata({ params }: PageProps<'/areas/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const area = getArea(slug)
  if (!area) return { title: 'Area Not Found', robots: { index: false } }
  const place = area.kind === 'city' ? `${area.name}, Florida` : `${area.name}, Florida`
  return pageMetadata({
    title: `${area.name} Real Estate`,
    description: `Commercial real estate, homes and property management in ${place} with Weston International Realty. ${area.summary}`,
    path: `/areas/${area.slug}`,
    image: area.image.src,
  })
}

/**
 * Every area is prerendered (see generateStaticParams). Reading the slug inside
 * <Suspense> keeps the route's shared shell free of URL data, so navigation
 * between areas stays instant.
 */
export default function AreaPage({ params }: PageProps<'/areas/[slug]'>) {
  return (
    <Suspense fallback={<PageHeroSkeleton label="Loading area" />}>
      <AreaDetail params={params} />
    </Suspense>
  )
}

async function AreaDetail({ params }: Pick<PageProps<'/areas/[slug]'>, 'params'>) {
  const { slug } = await params
  const area = getArea(slug)
  if (!area) notFound()

  const county = area.kind === 'city' ? getCounty(area.countySlug) : area
  const relatedCities = citiesInCounty(county?.slug ?? '').filter((city) => city.slug !== area.slug)

  const searches = [
    { label: 'All listings', href: listingsHref({ location: area.slug }) },
    { label: 'Commercial & investment', href: listingsHref({ location: area.slug, category: 'commercial' }) },
    { label: 'Homes & condos for sale', href: listingsHref({ location: area.slug, category: 'residential', intent: 'sale' }) },
    { label: 'Residential rentals', href: listingsHref({ location: area.slug, category: 'residential', intent: 'lease' }) },
  ]

  return (
    <>
      <PageHero
        eyebrow={area.kind === 'city' ? (county?.name ?? 'South Florida') : 'South Florida County'}
        title={area.name}
        image={area.image}
        actions={
          <>
            <Button href={listingsHref({ location: area.slug })} size="lg" arrow>
              View Listings in {area.kind === 'county' ? area.shortName : area.name}
            </Button>
            <Button href="/contact" size="lg" variant="outline-light">
              Ask About This Area
            </Button>
          </>
        }
      >
        {area.summary}
      </PageHero>

      {/* Overview + locator */}
      <section className="bg-white section-y">
        <div className="container-wi">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7 lg:pr-8">
              <Reveal>
                <SectionHeading eyebrow="Overview" index="01" title={`About ${area.name}`} size="md" />
              </Reveal>
              <Reveal delay={100}>
                <div className="mt-8 space-y-5">
                  {area.overview.map((paragraph, i) => (
                    <p key={paragraph} className={i === 0 ? 'text-lead text-ink' : 'text-slate'}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={160}>
                <h2 className="mt-14 text-eyebrow text-slate">Browse listings in {area.name}</h2>
                <ul className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-2">
                  {searches.map((search) => (
                    <li key={search.label} className="bg-white">
                      <Link
                        href={search.href}
                        className="group flex min-h-16 items-center justify-between gap-4 px-5 py-4 font-semibold text-navy-deep transition-colors duration-200 hover:bg-mist"
                      >
                        {search.label}
                        <ArrowUpRight
                          aria-hidden
                          className="size-4 shrink-0 text-slate/60 transition-colors group-hover:text-brand-red"
                          strokeWidth={1.75}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={120} className="lg:col-span-5">
              <div className="bg-mist p-6 sm:p-10">
                <LocatorMap
                  countySlug={county?.slug}
                  point={area.kind === 'city' ? area.coordinates : undefined}
                  label={area.kind === 'city' ? area.name : undefined}
                  description={
                    area.kind === 'city'
                      ? `Map of South Florida showing ${area.name} within ${county?.name ?? 'the region'}.`
                      : `Map of South Florida with ${area.name} highlighted.`
                  }
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Relevant property categories */}
      <section className="bg-mist section-y">
        <div className="container-wi">
          <Reveal>
            <SectionHeading eyebrow="Property Categories" index="02" title={`How We Can Help in ${area.name}`} size="md" className="max-w-3xl">
              Commercial real estate is our primary focus, alongside residential sales and property
              management.
            </SectionHeading>
          </Reveal>

          <div className="mt-12 grid gap-px border border-navy-deep/10 bg-navy-deep/10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {commercialTypes.map((type, i) => (
              <Reveal key={type.slug} delay={(i % 3) * 80} className="bg-mist">
                <Link
                  href={listingsHref({ location: area.slug, category: 'commercial', propertyTypes: [type.slug] })}
                  className="group flex h-full flex-col justify-between gap-8 p-7 transition-colors duration-300 hover:bg-white"
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className="text-display-sm text-navy-deep">{type.name}</span>
                    <ArrowUpRight
                      aria-hidden
                      className="mt-1 size-5 shrink-0 text-slate/50 transition-colors group-hover:text-brand-red"
                      strokeWidth={1.5}
                    />
                  </span>
                  <span className="text-[0.9375rem] text-slate">{type.description}</span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 flex flex-wrap gap-x-10 gap-y-3">
            <ArrowLink href={listingsHref({ location: area.slug, category: 'residential' })}>
              Residential Listings
            </ArrowLink>
            <ArrowLink href="/property-management">Property Management</ArrowLink>
            <ArrowLink href="/commercial">Commercial Services</ArrowLink>
          </Reveal>
        </div>
      </section>

      {/* Related areas */}
      {county && (relatedCities.length > 0 || area.kind === 'city') ? (
        <section className="bg-white section-y-sm">
          <div className="container-wi">
            <Reveal>
              <h2 className="text-eyebrow text-slate">
                {area.kind === 'city' ? `More in ${county.name}` : `Cities in ${county.name}`}
              </h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {area.kind === 'city' ? (
                  <li>
                    <Link
                      href={`/areas/${county.slug}`}
                      className="inline-flex min-h-11 items-center border border-navy-deep bg-navy-deep px-5 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-brand-blue"
                    >
                      {county.name}
                    </Link>
                  </li>
                ) : null}
                {relatedCities.map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={`/areas/${city.slug}`}
                      className="inline-flex min-h-11 items-center border border-line px-5 text-[0.8125rem] font-semibold text-navy-deep transition-colors hover:border-navy-deep/50"
                    >
                      {city.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/areas"
                    className="inline-flex min-h-11 items-center px-3 text-[0.8125rem] font-semibold text-brand-blue underline underline-offset-4"
                  >
                    All areas
                  </Link>
                </li>
              </ul>
            </Reveal>
          </div>
        </section>
      ) : null}

      <ClosingCta
        eyebrow="Inquire"
        title={`Looking in ${area.name}?`}
        cta={{ label: 'Start a Conversation', href: '/contact' }}
      >
        Tell us what you are looking for — an investment property, commercial space, a home, or management
        for a property you own — and we will follow up personally.
      </ClosingCta>

      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Explore Areas', path: '/areas' },
          ...(area.kind === 'city' && county ? [{ name: county.name, path: `/areas/${county.slug}` }] : []),
          { name: area.name, path: `/areas/${area.slug}` },
        ])}
      />
    </>
  )
}
