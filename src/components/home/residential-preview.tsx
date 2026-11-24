import Image from 'next/image'
import { images } from '@/content/images'
import { listingsHref } from '@/lib/properties/search-params'
import { ArrowLink } from '@/components/ui/arrow-link'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'

export function ResidentialPreview({ index }: { index?: string }) {
  return (
    <section className="relative bg-mist">
      <div className="grid lg:grid-cols-2">
        {/* Photography: one large exterior with an interior inset */}
        <div className="relative min-h-[22rem] lg:min-h-[44rem]">
          <Reveal variant="unveil" className="absolute inset-0 overflow-hidden bg-mist-deep">
            <Image
              src={images.residentialExterior.src}
              alt={images.residentialExterior.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal
            variant="unveil"
            delay={220}
            className="absolute right-5 bottom-[-3rem] z-10 hidden aspect-[4/3] w-[42%] overflow-hidden border-[10px] border-mist bg-mist-deep sm:block lg:right-[-4rem] lg:bottom-16 lg:w-[46%] lg:border-mist"
          >
            <Image
              src={images.residentialInterior.src}
              alt={images.residentialInterior.alt}
              fill
              sizes="(min-width: 1024px) 23vw, 42vw"
              className="object-cover"
            />
          </Reveal>
        </div>

        <div className="flex items-center px-5 py-16 sm:px-8 sm:pt-24 lg:px-0 lg:py-28">
          <div className="w-full lg:pr-12 lg:pl-24 xl:pr-[max(3rem,calc((100vw-84rem)/2+3rem))]">
            <Reveal>
              <SectionHeading eyebrow="Residential Real Estate" index={index} title="Homes and Condos Across South Florida">
                Buying, selling or renting a home is a personal decision. We bring the same care and local
                knowledge to residential clients that we bring to investors — whether it is a first condo, a
                family home or your next move.
              </SectionHeading>
            </Reveal>

            <Reveal delay={120} className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
              <Button href={listingsHref({ category: 'residential' })} variant="navy" arrow>
                Browse Residential Listings
              </Button>
              <ArrowLink href="/contact?interest=residential">Selling a Home?</ArrowLink>
            </Reveal>

            <Reveal delay={200}>
              <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-7">
                {[
                  { term: 'Buy', detail: 'Homes & condos' },
                  { term: 'Sell', detail: 'Listing & marketing' },
                  { term: 'Rent', detail: 'Residential leases' },
                ].map((item) => (
                  <div key={item.term}>
                    <dt className="font-display text-xl font-semibold text-navy-deep">{item.term}</dt>
                    <dd className="mt-1 text-[0.8125rem] leading-snug text-slate">{item.detail}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
