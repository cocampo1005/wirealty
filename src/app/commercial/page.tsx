import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { experiencePhrase } from '@/content/business'
import { images } from '@/content/images'
import {
  commercialAudiences,
  commercialFaqs,
  commercialIntro,
  commercialReasons,
  commercialTypes,
} from '@/content/services'
import { listingsHref } from '@/lib/properties/search-params'
import { pageMetadata } from '@/lib/seo/metadata'
import { JsonLdScript, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/structured-data'
import { FeaturedOpportunities } from '@/components/home/featured-opportunities'
import { PortfolioPreview } from '@/components/home/portfolio-preview'
import { ClosingCta } from '@/components/layout/closing-cta'
import { PageHero } from '@/components/layout/page-hero'
import { ArrowLink } from '@/components/ui/arrow-link'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Faq } from '@/components/ui/faq'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'

export const metadata = pageMetadata({
  title: 'Commercial Real Estate Services in South Florida',
  description:
    'Commercial real estate guidance for investors, property owners and businesses across South Florida — multifamily, retail, industrial, warehouse, office and mixed-use.',
  path: '/commercial',
  image: images.commercialHero.src,
})

export default function CommercialPage() {
  return (
    <>
      <PageHero
        eyebrow="Commercial Real Estate"
        title={commercialIntro.heading}
        image={images.commercialHero}
        actions={
          <>
            <Button href="/contact?interest=commercial" size="lg" arrow>
              Discuss Your Commercial Property
            </Button>
            <Button href={listingsHref({ category: 'commercial' })} size="lg" variant="outline-light">
              View Commercial Listings
            </Button>
          </>
        }
      >
        {commercialIntro.lead}
      </PageHero>

      {/* Introduction */}
      <section className="bg-white section-y">
        <div className="container-wi">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-5">
              <SectionHeading eyebrow="Our Approach" index="01" title={commercialIntro.sectionHeading} size="md" />
            </Reveal>
            <div className="lg:col-span-7 lg:pl-8">
              <Reveal>
                <p className="text-lead text-ink">{commercialIntro.body[0]}</p>
              </Reveal>
              <Reveal delay={100}>
                <p className="mt-6 text-slate">{commercialIntro.body[1]}</p>
              </Reveal>
              <Reveal delay={160}>
                <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-4">
                  {['Acquisition', 'Sales', 'Leasing', 'Guidance'].map((service, i) => (
                    <div key={service}>
                      <dt className="text-[0.6875rem] font-semibold tracking-[0.2em] text-brand-red">
                        {String(i + 1).padStart(2, '0')}
                      </dt>
                      <dd className="mt-2 font-display text-lg font-semibold text-navy-deep">{service}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Property categories */}
      <section className="bg-mist section-y">
        <div className="container-wi">
          <Reveal>
            <SectionHeading
              eyebrow="Property Types"
              index="02"
              title="Types of Commercial Properties We Work With"
              className="max-w-3xl"
            >
              We work across a wide range of commercial property types throughout South Florida, including
              multifamily, retail, industrial, office, warehouse and mixed-use assets.
            </SectionHeading>
          </Reveal>

          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-12">
            {commercialTypes.map((type, i) => {
              // Multifamily leads with a wide tile; the rest follow in an offset rhythm.
              const wide = i === 0 || i === 3 || i === 4
              return (
                <Reveal
                  key={type.slug}
                  delay={(i % 2) * 100}
                  className={wide ? 'lg:col-span-7' : 'lg:col-span-5'}
                >
                  <Link
                    href={listingsHref({ category: 'commercial', propertyTypes: [type.slug] })}
                    className="group block"
                  >
                    <div
                      className={`relative overflow-hidden bg-mist-deep ${wide ? 'aspect-[4/3] lg:aspect-[16/10]' : 'aspect-[4/3] lg:aspect-[8/7]'}`}
                    >
                      <Image
                        src={type.image.src}
                        alt={type.image.alt}
                        fill
                        sizes={wide ? '(min-width: 1024px) 56vw, (min-width: 640px) 50vw, 100vw' : '(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw'}
                        className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.045]"
                      />
                      <span className="absolute top-0 left-0 bg-white px-4 py-2.5 text-[0.6875rem] font-semibold tracking-[0.2em] text-navy-deep">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-6 pt-6">
                      <div>
                        <h3 className="text-display-sm text-navy-deep">{type.name}</h3>
                        <p className="mt-2 max-w-md text-[0.9375rem] text-slate">{type.description}</p>
                      </div>
                      <span
                        aria-hidden
                        className="mt-1 inline-flex size-10 shrink-0 items-center justify-center border border-line bg-white text-navy-deep transition-colors duration-300 group-hover:border-brand-red group-hover:bg-brand-red group-hover:text-white"
                      >
                        <ArrowUpRight className="size-4" strokeWidth={1.75} />
                      </span>
                    </div>
                    <span className="sr-only">View {type.name.toLowerCase()} listings</span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Who we work with */}
      <section className="on-dark relative isolate overflow-hidden bg-navy-deep text-white section-y">
        <div aria-hidden className="absolute inset-0 -z-10 bg-blueprint" />
        <div className="container-wi">
          <Reveal>
            <SectionHeading
              eyebrow="Who We Work With"
              index="03"
              title="Services for Buyers, Investors, Owners and Businesses"
              tone="light"
              className="max-w-3xl"
            />
          </Reveal>

          <div className="mt-14 grid border-t border-white/15 md:grid-cols-2 lg:mt-20">
            {commercialAudiences.map((audience, i) => (
              <Reveal
                key={audience.title}
                delay={(i % 2) * 100}
                className={[
                  'border-b border-white/15 py-10 md:py-12',
                  i % 2 === 0 ? 'md:border-r md:pr-12' : 'md:pl-12',
                ].join(' ')}
              >
                <p className="text-eyebrow text-sky">{audience.title}</p>
                <h3 className="mt-4 text-display-sm text-white">{audience.need}</h3>
                <p className="mt-4 max-w-md text-white/70">{audience.description}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <p className="max-w-3xl text-sm text-white/55">
              Weston International Realty is a real estate brokerage. We do not provide legal, tax, lending or
              investment advisory services; we are glad to coordinate with your attorney, accountant and
              lender throughout a transaction.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Why Weston */}
      <section className="bg-white section-y">
        <div className="container-wi">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading eyebrow="Why Weston" index="04" title="Local Knowledge. Proven Experience.">
                  Serving South Florida with a commitment to professionalism, transparency, and results —
                  backed by {experiencePhrase} of hands-on experience.
                </SectionHeading>
              </Reveal>
              <Reveal variant="unveil" delay={120} className="relative mt-12 aspect-[4/3] overflow-hidden bg-mist-deep">
                <Image
                  src={images.aboutArchitecture.src}
                  alt={images.aboutArchitecture.alt}
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover"
                />
              </Reveal>
            </div>
            <ol className="lg:col-span-7 lg:pl-8">
              {commercialReasons.map((reason, i) => (
                <Reveal
                  as="li"
                  key={reason.title}
                  delay={i * 70}
                  className="grid gap-x-8 gap-y-2 border-b border-line py-8 first:border-t sm:grid-cols-[3rem_1fr]"
                >
                  <span aria-hidden className="pt-1.5 text-[0.6875rem] font-semibold tracking-[0.2em] text-brand-red">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-display-sm text-navy-deep">{reason.title}</h3>
                    <p className="mt-3 max-w-xl text-slate">{reason.description}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="border-t border-line">
        <FeaturedOpportunities
          category="commercial"
          index="05"
          title="Featured Commercial Opportunities"
          intro="Selected commercial and investment property currently being offered through Weston International Realty."
        />
      </div>

      <PortfolioPreview
        category="commercial"
        index="06"
        title="Selected Commercial Transactions"
        intro="A selection of commercial properties we have sold, acquired and leased on behalf of clients."
      />

      {/* Consultation CTA */}
      <section className="bg-mist section-y-sm">
        <div className="container-wi">
          <Reveal className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Eyebrow>Consultation</Eyebrow>
              <h2 className="mt-6 text-display-md text-navy-deep">
                Have a commercial property or requirement in mind?
              </h2>
              <p className="mt-4 max-w-2xl text-slate">
                Tell us about your goals and timeline. The first conversation is simply about understanding
                what you are trying to achieve.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:col-span-4 lg:flex-col lg:items-end">
              <Button href="/contact?interest=commercial" size="lg" arrow>
                Request a Consultation
              </Button>
              <ArrowLink href="/property-management">Property Management</ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white section-y">
        <div className="container-wi">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-4">
              <SectionHeading eyebrow="Questions" index="07" title="Commercial FAQs" size="md" />
            </Reveal>
            <Reveal delay={100} className="lg:col-span-8">
              <Faq items={commercialFaqs} />
            </Reveal>
          </div>
        </div>
      </section>

      <ClosingCta
        cta={{ label: 'Discuss Your Commercial Property', href: '/contact?interest=commercial' }}
      />

      <JsonLdScript data={faqJsonLd(commercialFaqs)} />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Commercial Real Estate', path: '/commercial' },
        ])}
      />
    </>
  )
}
