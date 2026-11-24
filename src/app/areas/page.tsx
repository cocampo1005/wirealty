import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { citiesInCounty, counties } from '@/content/communities'
import { images } from '@/content/images'
import { pageMetadata } from '@/lib/seo/metadata'
import { JsonLdScript, breadcrumbJsonLd } from '@/lib/seo/structured-data'
import { ClosingCta } from '@/components/layout/closing-cta'
import { PageHero } from '@/components/layout/page-hero'
import { RegionExplorer } from '@/components/maps/region-explorer'
import { ArrowLink } from '@/components/ui/arrow-link'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'

export const metadata = pageMetadata({
  title: 'Explore South Florida Areas',
  description:
    'Explore the South Florida areas served by Weston International Realty — Miami-Dade, Broward and Palm Beach counties, including Weston, Plantation, Davie, Fort Lauderdale, Hollywood and Miami.',
  path: '/areas',
  image: images.areaAerial.src,
})

export default function AreasPage() {
  return (
    <>
      <PageHero eyebrow="Explore Areas" title="South Florida, County by County." image={images.areaAerial}>
        From Palm Beach in the north to Miami-Dade in the south, explore the counties and cities where we
        help clients buy, sell, lease and manage property.
      </PageHero>

      <section className="bg-mist section-y">
        <div className="container-wi">
          <Reveal>
            <SectionHeading eyebrow="Regional Explorer" index="01" title="Select a County or City" size="md" className="max-w-2xl">
              Use the map or the controls beside it. Each area links to its guide and to available listings.
            </SectionHeading>
          </Reveal>
          <Reveal className="mt-12 lg:mt-16">
            <RegionExplorer />
          </Reveal>
        </div>
      </section>

      {/* Crawlable, list-based index of every area */}
      <section className="bg-white section-y">
        <div className="container-wi">
          <Reveal>
            <SectionHeading eyebrow="Area Guides" index="02" title="Counties and Communities" size="md" />
          </Reveal>

          <div className="mt-14 space-y-16 lg:mt-20 lg:space-y-24">
            {counties.map((county, i) => {
              const cities = citiesInCounty(county.slug)
              const flipped = i % 2 === 1
              return (
                <article key={county.slug} className="grid items-center gap-10 lg:grid-cols-12">
                  <Reveal variant="unveil" className={`relative aspect-[16/10] overflow-hidden bg-mist-deep lg:col-span-7 ${flipped ? 'lg:order-2' : ''}`}>
                    <Image
                      src={county.image.src}
                      alt={county.image.alt}
                      fill
                      sizes="(min-width: 1024px) 56vw, 100vw"
                      className="object-cover"
                    />
                  </Reveal>
                  <Reveal delay={100} className={`lg:col-span-5 ${flipped ? 'lg:order-1 lg:pr-8' : 'lg:pl-8'}`}>
                    <p className="text-eyebrow text-brand-blue">{String(i + 1).padStart(2, '0')} / County</p>
                    <h3 className="mt-4 text-display-md text-navy-deep">
                      <Link href={`/areas/${county.slug}`} className="transition-colors hover:text-brand-blue">
                        {county.name}
                      </Link>
                    </h3>
                    <p className="mt-4 text-slate">{county.summary}</p>

                    {cities.length > 0 ? (
                      <ul className="mt-7 border-t border-line">
                        {cities.map((city) => (
                          <li key={city.slug} className="border-b border-line">
                            <Link
                              href={`/areas/${city.slug}`}
                              className="group flex min-h-12 items-center justify-between gap-4 py-3 font-semibold text-navy-deep transition-colors hover:text-brand-blue"
                            >
                              {city.name}
                              <ArrowUpRight
                                aria-hidden
                                className="size-4 text-slate/60 transition-colors group-hover:text-brand-red"
                                strokeWidth={1.75}
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    <div className="mt-7">
                      <ArrowLink href={`/areas/${county.slug}`}>Explore {county.shortName}</ArrowLink>
                    </div>
                  </Reveal>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <ClosingCta
        eyebrow="Not Sure Where to Start?"
        title="Tell Us Where You Are Looking."
        cta={{ label: 'Contact Us', href: '/contact' }}
      >
        Share the area and the type of property you have in mind, and we will help you narrow it down.
      </ClosingCta>

      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Explore Areas', path: '/areas' },
        ])}
      />
    </>
  )
}
