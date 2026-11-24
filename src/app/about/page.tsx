import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { business, experienceFigure, experiencePhrase, verifiedCredentials } from '@/content/business'
import { images } from '@/content/images'
import { showSampleContent } from '@/lib/site-mode'
import { pageMetadata } from '@/lib/seo/metadata'
import { JsonLdScript, breadcrumbJsonLd } from '@/lib/seo/structured-data'
import { BrokerPortrait } from '@/components/home/broker-intro'
import { PortfolioPreview } from '@/components/home/portfolio-preview'
import { ClosingCta } from '@/components/layout/closing-cta'
import { PageHero } from '@/components/layout/page-hero'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/ui/reveal'
import { SampleBadge } from '@/components/ui/sample-badge'
import { SectionHeading } from '@/components/ui/section-heading'

export const metadata = pageMetadata({
  title: 'About Weston International Realty',
  description:
    'Weston International Realty is a South Florida real estate brokerage led by broker German Ocampo, serving investors, property owners, businesses and residential clients.',
  path: '/about',
  image: images.aboutArchitecture.src,
})

const expertise = [
  {
    title: 'Commercial Real Estate',
    description:
      'Acquisition, sales and leasing across multifamily, retail, industrial, warehouse, office and mixed-use property.',
    href: '/commercial',
    image: images.typeMultifamily,
  },
  {
    title: 'Residential Real Estate',
    description: 'Helping clients buy, sell and rent homes and condos across South Florida.',
    href: '/listings?category=residential',
    image: images.residentialExterior,
  },
  {
    title: 'Property Management',
    description: 'Tenant placement, rent collection, reporting and maintenance coordination for owners and investors.',
    href: '/property-management',
    image: images.managementHero,
  },
]

/** [DRAFT] — values distilled from the current site's language; pending approval. */
const values = [
  {
    title: 'Professionalism',
    description: 'Clear communication, careful preparation and respect for your time at every step.',
  },
  {
    title: 'Transparency',
    description: 'Straightforward guidance about the market and your options — including when the answer is to wait.',
  },
  {
    title: 'Personal Service',
    description: 'You work directly with an experienced broker who knows your goals and stays involved.',
  },
  {
    title: 'Local Knowledge',
    description: 'A deep understanding of South Florida’s markets, neighborhoods and opportunities.',
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About the Firm" title="Established Expertise. Personal Attention." image={images.aboutArchitecture}>
        {business.description}
      </PageHero>

      {/* Brokerage introduction */}
      <section className="bg-white section-y">
        <div className="container-wi">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-5">
              <SectionHeading eyebrow="The Brokerage" index="01" title="A South Florida Firm, Built on Relationships" size="md" />
            </Reveal>
            <div className="lg:col-span-7 lg:pl-8">
              <Reveal>
                <p className="text-lead text-ink">
                  With {experiencePhrase} of experience, we work closely with property owners, investors, and
                  businesses to navigate the market with confidence and clarity.
                </p>
              </Reveal>
              <Reveal delay={100}>
                <p className="mt-6 text-slate">
                  We keep the relationship personal: clients deal directly with an experienced broker, advice is
                  given with the long term in mind, and the same firm can stay with you beyond a single
                  transaction — from acquiring a property to having it managed.
                </p>
              </Reveal>

              <Reveal delay={160}>
                <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-9 sm:grid-cols-3">
                  <div>
                    <dt className="font-display text-3xl font-medium text-navy-deep">{experienceFigure ?? 'Decades'}</dt>
                    <dd className="mt-2 text-[0.8125rem] font-medium text-slate">
                      {experienceFigure ? 'Years of experience' : 'Of experience'}
                    </dd>
                    {experienceFigure && !business.experience.confirmed && showSampleContent ? (
                      <SampleBadge className="mt-2">Pending confirmation</SampleBadge>
                    ) : null}
                  </div>
                  <div>
                    <dt className="font-display text-3xl font-medium text-navy-deep">3</dt>
                    <dd className="mt-2 text-[0.8125rem] font-medium text-slate">Service lines under one roof</dd>
                  </div>
                  <div>
                    <dt className="font-display text-3xl font-medium text-navy-deep">Tri-County</dt>
                    <dd className="mt-2 text-[0.8125rem] font-medium text-slate">Miami-Dade, Broward & Palm Beach</dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Broker profile */}
      <section className="bg-mist section-y">
        <div className="container-wi">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal variant="unveil" className="lg:sticky lg:top-28 lg:col-span-5">
              <BrokerPortrait className="aspect-[4/5]" />
            </Reveal>

            <div className="lg:col-span-7 lg:pl-12">
              <Reveal>
                <Eyebrow index="02">Broker Profile</Eyebrow>
                <h2 className="mt-6 text-display-lg text-navy-deep">{business.broker.name}</h2>
                <p className="mt-3 text-label text-brand-blue">
                  {business.broker.title} · {business.name}
                </p>
              </Reveal>

              <Reveal delay={100}>
                <div className="mt-8 space-y-5 text-ink">
                  <p className="text-lead">
                    {business.broker.name} leads {business.name}, working directly with the firm’s clients
                    across commercial real estate, residential sales and property management.
                  </p>
                  <p className="text-slate">
                    His work draws on {experiencePhrase} of hands-on experience across residential, commercial,
                    and property management in South Florida. Clients are not passed between departments: the
                    broker who takes the first call is the one who sees the transaction through.
                  </p>
                </div>
              </Reveal>

              {showSampleContent ? (
                <Reveal delay={140}>
                  <p className="mt-6 border border-dashed border-brand-red/50 bg-white px-4 py-3 text-[0.8125rem] text-ink">
                    <strong className="mr-2 text-[0.6875rem] font-semibold tracking-[0.16em] text-brand-red uppercase">
                      Preview only
                    </strong>
                    Biography is limited to confirmed facts. A fuller professional background (career history,
                    education, languages, specialties) should be supplied by the client.
                  </p>
                </Reveal>
              ) : null}

              {/* Professional credentials — verified items only */}
              <Reveal delay={180}>
                <h3 className="mt-12 text-eyebrow text-slate">Professional Credentials</h3>
                <ul className="mt-5 border-t border-navy-deep/10">
                  {verifiedCredentials.map((credential) => (
                    <li key={credential.id} className="flex items-baseline justify-between gap-6 border-b border-navy-deep/10 py-4">
                      <span className="font-semibold text-navy-deep">{credential.label}</span>
                      {'detail' in credential && credential.detail ? (
                        <span className="text-sm text-slate">{credential.detail}</span>
                      ) : null}
                    </li>
                  ))}
                  {showSampleContent
                    ? business.credentials
                        .filter((credential) => !credential.verified)
                        .map((credential) => (
                          <li key={credential.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-navy-deep/10 py-4">
                            <span className="font-semibold text-slate">{credential.label}</span>
                            <SampleBadge>Unverified — hidden publicly</SampleBadge>
                          </li>
                        ))
                    : null}
                </ul>
              </Reveal>

              <Reveal delay={220} className="mt-10">
                <Button href="/contact" variant="navy" arrow>
                  Contact {business.broker.name.split(' ')[0]}
                </Button>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="bg-white section-y">
        <div className="container-wi">
          <Reveal>
            <SectionHeading eyebrow="Expertise" index="03" title="Commercial, Residential and Management Expertise" className="max-w-3xl">
              Three complementary services, so clients can stay with one firm as their needs change.
            </SectionHeading>
          </Reveal>

          <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-3 lg:mt-20">
            {expertise.map((item, i) => (
              <Reveal key={item.title} delay={i * 110} className={i === 1 ? 'md:mt-16' : undefined}>
                <Link href={item.href} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-mist-deep">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width: 768px) 30vw, 100vw"
                      className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.045]"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-5 pt-6">
                    <div>
                      <h3 className="text-display-sm text-navy-deep">{item.title}</h3>
                      <p className="mt-2 text-[0.9375rem] text-slate">{item.description}</p>
                    </div>
                    <ArrowUpRight
                      aria-hidden
                      className="mt-1 size-5 shrink-0 text-slate/60 transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-red"
                      strokeWidth={1.5}
                    />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach & values */}
      <section className="on-dark relative isolate overflow-hidden bg-navy-deep text-white section-y">
        <div aria-hidden className="absolute inset-0 -z-10 bg-blueprint" />
        <div className="container-wi">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-5">
              <SectionHeading eyebrow="Our Approach" index="04" title="Local Knowledge. Proven Experience." tone="light">
                Serving South Florida with a commitment to professionalism, transparency, and results.
              </SectionHeading>
            </Reveal>
            <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7 lg:pl-8">
              {values.map((value, i) => (
                <Reveal as="li" key={value.title} delay={(i % 2) * 100} className="border-t border-white/15 py-8">
                  <span aria-hidden className="text-[0.6875rem] font-semibold tracking-[0.2em] text-sky">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 text-display-sm text-white">{value.title}</h3>
                  <p className="mt-3 text-[0.9375rem] text-white/70">{value.description}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <PortfolioPreview index="05" title="Selected Portfolio" tone="light" />

      <ClosingCta />

      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />
    </>
  )
}
