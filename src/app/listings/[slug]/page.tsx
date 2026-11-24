import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowLeft, Phone } from 'lucide-react'
import { business, primaryPhone } from '@/content/business'
import { getArea } from '@/content/communities'
import {
  cityLine,
  detailFacts,
  keyFacts,
  priceLabel,
  propertyTitle,
  propertyTypeLabels,
  statusLabel,
  streetAddress,
} from '@/lib/properties/labels'
import { getPropertyRepository } from '@/lib/properties/repository'
import { listingsHref } from '@/lib/properties/search-params'
import { slugify } from '@/lib/properties/search'
import { pageMetadata } from '@/lib/seo/metadata'
import { JsonLdScript, breadcrumbJsonLd } from '@/lib/seo/structured-data'
import { InquiryForm } from '@/components/forms/inquiry-form'
import { ClosingCta } from '@/components/layout/closing-cta'
import { PageHero } from '@/components/layout/page-hero'
import { PageHeroSkeleton } from '@/components/layout/page-hero-skeleton'
import { FavoriteButton } from '@/components/listings/favorite-button'
import { PropertyCard } from '@/components/listings/property-card'
import { PropertyGallery } from '@/components/listings/property-gallery'
import { LocatorMap } from '@/components/maps/locator-map'
import { ArrowLink } from '@/components/ui/arrow-link'
import { Button } from '@/components/ui/button'
import { SampleNotice } from '@/components/ui/sample-badge'

type Props = PageProps<'/listings/[slug]'>

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const property = await getPropertyRepository().getBySlug(slug)
  if (!property) return { title: 'Listing Not Found', robots: { index: false } }
  const title = propertyTitle(property)
  return pageMetadata({
    title: `${title} — ${property.address.city}, ${property.address.state}`,
    description: `${propertyTypeLabels[property.propertyType]} ${statusLabel(property).toLowerCase()} in ${property.address.city}. ${property.summary}`,
    path: `/listings/${property.slug}`,
    image: property.media[0]?.src,
    // Sample fixtures must never be indexed.
    noindex: property.source === 'fixture',
  })
}

/**
 * Listings are resolved per request from the active repository (fixtures now,
 * an MLS feed later), so the detail streams in behind a skeleton.
 */
export default function ListingPage({ params }: Props) {
  return (
    <Suspense fallback={<PageHeroSkeleton label="Loading listing" />}>
      <ListingDetail params={params} />
    </Suspense>
  )
}

async function ListingDetail({ params }: Pick<Props, 'params'>) {
  const { slug } = await params
  const repository = getPropertyRepository()
  const property = await repository.getBySlug(slug)
  if (!property) notFound()

  const related = await repository.getRelated(property, 3)
  const title = propertyTitle(property)
  const facts = keyFacts(property)
  const specs = detailFacts(property)
  const area = property.address.citySlug ? getArea(property.address.citySlug) : undefined
  const countySlug = property.address.county ? slugify(property.address.county) : undefined
  const inquiryMessage = `I would like more information about ${title} (${cityLine(property)}).`

  return (
    <>
      <PageHero
        eyebrow={`${propertyTypeLabels[property.propertyType]} · ${statusLabel(property)}`}
        title={title}
        size="compact"
      >
        <p>
          {property.title ? `${streetAddress(property)}, ` : ''}
          {cityLine(property)}
        </p>
      </PageHero>

      <article className="bg-white pt-6 pb-20 lg:pt-8 lg:pb-28">
        <div className="container-wi">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <Link
              href={listingsHref({ category: property.category })}
              className="inline-flex min-h-11 items-center gap-2.5 text-label text-navy-deep transition-colors hover:text-brand-blue"
            >
              <ArrowLeft aria-hidden className="size-4" strokeWidth={1.75} />
              Back to Listings
            </Link>
            <FavoriteButton propertyId={property.id} label={title} variant="inline" />
          </div>

          {property.source === 'fixture' ? (
            <SampleNotice className="mb-6">
              This is a development sample listing — not a real property and not an offer. It is hidden on
              the public site.
            </SampleNotice>
          ) : null}
        </div>

        {/* Gallery runs edge-to-edge on small screens */}
        <div className="lg:container-wi">
          <PropertyGallery images={property.media} title={title} />
        </div>

        <div className="container-wi">
          {/* Price + key facts */}
          <div className="mt-8 flex flex-col gap-6 border-b border-line pb-8 lg:mt-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-eyebrow text-brand-blue">{statusLabel(property)}</p>
              <p className="mt-3 font-display text-[clamp(1.875rem,1.4rem+2vw,3rem)] leading-none font-medium text-navy-deep">
                {priceLabel(property)}
              </p>
            </div>
            {facts.length > 0 ? (
              <dl className="flex flex-wrap gap-x-10 gap-y-4">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dd className="font-display text-2xl font-semibold text-navy-deep">{fact.value}</dd>
                    <dt className="mt-1 text-eyebrow text-slate">{fact.label}</dt>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              {/* Description */}
              <section aria-labelledby="listing-about">
                <h2 id="listing-about" className="text-display-md text-navy-deep">
                  About This Property
                </h2>
                <p className="mt-6 text-lead text-ink">{property.summary}</p>
                <div className="mt-5 space-y-4 text-slate">
                  {property.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {/* Highlights */}
              {property.highlights.length > 0 ? (
                <section aria-labelledby="listing-highlights" className="mt-14">
                  <h2 id="listing-highlights" className="text-eyebrow text-slate">
                    Highlights
                  </h2>
                  <ul className="mt-5 grid gap-x-10 border-t border-line sm:grid-cols-2">
                    {property.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-baseline gap-4 border-b border-line py-3.5 font-medium text-navy-deep">
                        <span aria-hidden className="h-px w-4 shrink-0 translate-y-[-0.3em] bg-brand-red" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* Specifications */}
              <section aria-labelledby="listing-specs" className="mt-14">
                <h2 id="listing-specs" className="text-eyebrow text-slate">
                  Features & Specifications
                </h2>
                <dl className="mt-5 grid gap-x-10 border-t border-line sm:grid-cols-2">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex items-baseline justify-between gap-6 border-b border-line py-3.5">
                      <dt className="text-sm text-slate">{spec.label}</dt>
                      <dd className="text-right font-semibold text-navy-deep">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* Location */}
              <section aria-labelledby="listing-location" className="mt-14">
                <h2 id="listing-location" className="text-eyebrow text-slate">
                  Location
                </h2>
                <div className="mt-5 grid gap-8 border border-line sm:grid-cols-2">
                  <div className="bg-mist p-6">
                    <LocatorMap
                      countySlug={countySlug}
                      point={property.coordinates}
                      description={`Map of South Florida showing the approximate location of ${title} in ${property.address.city}.`}
                      className="[&>div]:max-h-[22rem]"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-6 sm:pl-0">
                    <p className="font-display text-2xl font-semibold text-navy-deep">{property.address.city}</p>
                    <p className="mt-1 text-slate">
                      {streetAddress(property)}
                      <br />
                      {cityLine(property)}
                    </p>
                    {property.address.county ? <p className="mt-1 text-sm text-slate">{property.address.county}</p> : null}
                    {area ? (
                      <>
                        <p className="mt-5 text-[0.9375rem] text-slate">{area.summary}</p>
                        <div className="mt-4">
                          <ArrowLink href={`/areas/${area.slug}`}>Explore {area.name}</ArrowLink>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </section>

              {/* MLS attribution — populated by the listing source once connected */}
              <section aria-label="Listing attribution" className="mt-14 border-t border-line pt-6 text-xs leading-relaxed text-slate">
                {property.attribution ? (
                  <>
                    <p>
                      {property.attribution.mlsName} #{property.attribution.mlsNumber}
                      {property.attribution.listingOffice ? ` · Listing courtesy of ${property.attribution.listingOffice}` : ''}
                      {property.attribution.listingAgent ? ` (${property.attribution.listingAgent})` : ''}
                      {property.attribution.lastUpdated ? ` · Updated ${property.attribution.lastUpdated}` : ''}
                    </p>
                    {property.attribution.disclaimer ? <p className="mt-2">{property.attribution.disclaimer}</p> : null}
                  </>
                ) : (
                  <p>
                    {property.source === 'fixture'
                      ? 'Sample data for development purposes only. MLS attribution, listing office and required disclaimers will appear here once the MLS integration is connected.'
                      : `Information is believed to be reliable but is not guaranteed and should be independently verified. Presented by ${business.name}.`}
                  </p>
                )}
              </section>
            </div>

            {/* Inquiry */}
            <aside className="lg:col-span-5 lg:pl-6">
              <div id="inquire" className="scroll-mt-28 border border-line bg-mist p-6 sm:p-8 lg:sticky lg:top-24">
                <h2 className="text-display-sm text-navy-deep">Ask About This Property</h2>
                <p className="mt-2 mb-6 text-sm text-slate">
                  Request information or schedule a tour with {business.name}.
                </p>
                <InquiryForm
                  kind="property"
                  property={{ id: property.id, title: `${title} — ${cityLine(property)}` }}
                  defaultMessage={inquiryMessage}
                  submitLabel="Send Request"
                />
                <p className="mt-6 border-t border-navy-deep/10 pt-5 text-sm text-slate">
                  Prefer to talk?{' '}
                  <a href={`tel:${primaryPhone.e164}`} className="font-semibold whitespace-nowrap text-navy-deep underline underline-offset-4">
                    {primaryPhone.display}
                  </a>
                </p>
              </div>
            </aside>
          </div>
        </div>
        {/* Sticky inquiry actions on small screens */}
        <div className="on-light sticky bottom-0 z-40 mt-14 flex gap-px border-t border-line bg-line pb-[env(safe-area-inset-bottom)] lg:hidden">
          <a
            href={`tel:${primaryPhone.e164}`}
            className="inline-flex h-14 flex-1 items-center justify-center gap-2.5 bg-white text-label text-navy-deep"
          >
            <Phone aria-hidden className="size-4" strokeWidth={1.75} />
            Call
          </a>
          <Button href="#inquire" className="h-14 flex-[2]">
            Request Information
          </Button>
        </div>

      </article>

      {related.length > 0 ? (
        <section className="bg-mist section-y-sm">
          <div className="container-wi">
            <div className="flex items-end justify-between gap-6">
              <h2 className="text-display-md text-navy-deep">Related Properties</h2>
              <ArrowLink href={listingsHref({ category: property.category })}>All Listings</ArrowLink>
            </div>
            <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <PropertyCard property={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <ClosingCta
        eyebrow="Looking for Something Else?"
        title="Tell Us What You Need."
        cta={{ label: 'Contact Us', href: '/contact' }}
      >
        Share your criteria and we will follow up with properties that fit.
      </ClosingCta>

      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Listings', path: '/listings' },
          { name: title, path: `/listings/${property.slug}` },
        ])}
      />
    </>
  )
}
