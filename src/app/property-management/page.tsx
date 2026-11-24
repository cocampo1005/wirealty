import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import { business, primaryPhone } from '@/content/business'
import { images } from '@/content/images'
import {
  managementFaqs,
  managementIntro,
  managementProcess,
  managementReasons,
  managementServices,
} from '@/content/services'
import { showSampleContent } from '@/lib/site-mode'
import { pageMetadata } from '@/lib/seo/metadata'
import { JsonLdScript, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/structured-data'
import { InquiryForm } from '@/components/forms/inquiry-form'
import { PageHero } from '@/components/layout/page-hero'
import { ArrowLink } from '@/components/ui/arrow-link'
import { Button } from '@/components/ui/button'
import { Faq } from '@/components/ui/faq'
import { Reveal } from '@/components/ui/reveal'
import { SampleNotice } from '@/components/ui/sample-badge'
import { SectionHeading } from '@/components/ui/section-heading'

export const metadata = pageMetadata({
  title: 'Property Management in South Florida',
  description:
    'Personalized property management for South Florida owners and investors: tenant screening and placement, rent collection, owner reporting and maintenance coordination.',
  path: '/property-management',
  image: images.managementHero.src,
})

export default function PropertyManagementPage() {
  return (
    <>
      <PageHero
        eyebrow="Property Management"
        title={managementIntro.pageHeading}
        image={images.managementHero}
        actions={
          <>
            <Button href="#consultation" size="lg" arrow>
              Request a Management Consultation
            </Button>
            <Button href="#services" size="lg" variant="outline-light">
              View Services
            </Button>
          </>
        }
      >
        {managementIntro.pageLead}
      </PageHero>

      {/* Overview */}
      <section className="overflow-hidden bg-white section-y">
        <div className="container-wi">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6 lg:pr-10">
              <Reveal>
                <SectionHeading eyebrow="Overview" index="01" title={managementIntro.homeHeading}>
                  {managementIntro.homeBody}
                </SectionHeading>
              </Reveal>
              <Reveal delay={100}>
                <p className="mt-6 max-w-xl text-slate">
                  Owning property should not mean being on call for it. We take on the day-to-day work —
                  finding and placing tenants, collecting rent, coordinating maintenance — and keep you
                  informed, so you can stay focused on the bigger picture.
                </p>
              </Reveal>
              <Reveal delay={160} className="mt-9">
                <ArrowLink href="#consultation">Request a Consultation</ArrowLink>
              </Reveal>
            </div>

            <div className="relative lg:col-span-6">
              <Reveal variant="unveil" className="relative ml-auto aspect-[4/3] w-[88%] overflow-hidden bg-mist-deep">
                <Image
                  src={images.managementInterior.src}
                  alt={images.managementInterior.alt}
                  fill
                  sizes="(min-width: 1024px) 42vw, 88vw"
                  className="object-cover"
                />
              </Reveal>
              <Reveal
                variant="unveil"
                delay={200}
                className="absolute bottom-[-2.5rem] left-0 aspect-[4/5] w-[38%] overflow-hidden border-[10px] border-white bg-mist-deep"
              >
                <Image
                  src={images.managementDetail.src}
                  alt={images.managementDetail.alt}
                  fill
                  sizes="(min-width: 1024px) 18vw, 38vw"
                  className="object-cover"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Core services */}
      <section id="services" className="scroll-mt-20 bg-mist section-y">
        <div className="container-wi">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <SectionHeading eyebrow="Core Services" index="02" title="What We Handle for You" size="md">
                  The essentials of managing an investment property, handled with personal attention.
                </SectionHeading>
              </div>
            </Reveal>

            <ol className="lg:col-span-8 lg:pl-8">
              {managementServices.map((service, i) => (
                <Reveal
                  as="li"
                  key={service.title}
                  delay={i * 60}
                  className="grid gap-x-8 gap-y-2 border-b border-navy-deep/10 py-8 first:border-t sm:grid-cols-[3rem_1fr]"
                >
                  <span aria-hidden className="pt-1.5 text-[0.6875rem] font-semibold tracking-[0.2em] text-brand-red">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-display-sm text-navy-deep">{service.title}</h3>
                    <p className="mt-3 max-w-xl text-slate">{service.description}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Why choose Weston */}
      <section className="bg-white section-y">
        <div className="container-wi">
          <Reveal>
            <SectionHeading eyebrow="Why Choose Weston" index="03" title="Management That Stays Personal" className="max-w-3xl" />
          </Reveal>
          <div className="mt-14 grid border-t border-line md:grid-cols-3 lg:mt-16">
            {managementReasons.map((reason, i) => (
              <Reveal
                key={reason.title}
                delay={i * 100}
                className={[
                  'border-b border-line py-9 md:border-b-0 md:py-10',
                  i > 0 ? 'md:border-l md:pl-10' : '',
                  i < managementReasons.length - 1 ? 'md:pr-10' : '',
                ].join(' ')}
              >
                <h3 className="text-display-sm text-navy-deep">{reason.title}</h3>
                <p className="mt-4 text-slate">{reason.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="on-dark relative isolate overflow-hidden bg-navy-deep text-white section-y">
        <div aria-hidden className="absolute inset-0 -z-10 bg-blueprint" />
        <div className="container-wi">
          <Reveal>
            <SectionHeading eyebrow="The Process" index="04" title="How the Management Process Works" tone="light" className="max-w-3xl">
              A typical path from first conversation to ongoing management. Every property is different, so
              the details are confirmed with you directly.
            </SectionHeading>
          </Reveal>

          {showSampleContent ? (
            <SampleNotice className="mt-10">
              This process is draft marketing copy pending the brokerage’s confirmation. It is shown on the
              public site as written here, so it must be reviewed before launch.
            </SampleNotice>
          ) : null}

          <ol className="mt-14 grid gap-y-10 md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {managementProcess.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 110} className="relative pr-8">
                <div className="flex items-center gap-4">
                  <span className="font-display text-4xl font-medium text-white">{String(i + 1).padStart(2, '0')}</span>
                  <span aria-hidden className="h-px flex-1 bg-white/20" />
                </div>
                <h3 className="mt-6 text-display-sm text-white">{step.title}</h3>
                <p className="mt-3 text-[0.9375rem] text-white/70">{step.description}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Acquisition → management */}
      <section className="bg-white section-y">
        <div className="container-wi">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal variant="unveil" className="relative aspect-[4/3] overflow-hidden bg-mist-deep lg:col-span-6">
              <Image
                src={images.typeMultifamily.src}
                alt={images.typeMultifamily.alt}
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </Reveal>
            <div className="lg:col-span-6 lg:pl-12">
              <Reveal>
                <SectionHeading eyebrow="From Acquisition to Management" index="05" title="One Relationship, From Purchase to Day-to-Day">
                  Investors who acquire property with Weston International Realty can continue the
                  relationship after closing. The firm that helped you find and purchase the asset already
                  understands it — and your goals for it — when management begins.
                </SectionHeading>
              </Reveal>
              <Reveal delay={120}>
                <ol className="mt-10 grid grid-cols-3 border-t border-line">
                  {['Acquire', 'Manage', 'Advise'].map((stage, i) => (
                    <li key={stage} className={`pt-6 ${i > 0 ? 'border-l border-line pl-5' : 'pr-5'}`}>
                      <span className="text-[0.6875rem] font-semibold tracking-[0.2em] text-brand-red">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="mt-2 font-display text-xl font-semibold text-navy-deep">{stage}</p>
                    </li>
                  ))}
                </ol>
              </Reveal>
              <Reveal delay={180} className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
                <Button href="/commercial" variant="navy" arrow>
                  Commercial Services
                </Button>
                <ArrowLink href="/listings?category=commercial">Investment Opportunities</ArrowLink>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-white section-y">
        <div className="container-wi">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-4">
              <SectionHeading eyebrow="Questions" index="06" title="Property Management FAQs" size="md" />
            </Reveal>
            <Reveal delay={100} className="lg:col-span-8">
              <Faq items={managementFaqs} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Consultation form */}
      <section id="consultation" className="scroll-mt-16 bg-mist section-y">
        <div className="container-wi">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading eyebrow="Consultation" index="07" title="Request a Management Consultation">
                  Tell us about your property and we will follow up to discuss how we can help. There is no
                  obligation.
                </SectionHeading>
              </Reveal>
              <Reveal delay={120}>
                <ul className="mt-10 space-y-1 border-t border-navy-deep/10 pt-8 text-[0.9375rem]">
                  <li>
                    <a href={`tel:${primaryPhone.e164}`} className="inline-flex min-h-11 items-center gap-3 font-semibold text-navy-deep hover:text-brand-blue">
                      <Phone aria-hidden className="size-4 text-brand-red" strokeWidth={1.75} />
                      {primaryPhone.display}
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${business.email}`} className="inline-flex min-h-11 items-center gap-3 font-semibold text-navy-deep hover:text-brand-blue">
                      <Mail aria-hidden className="size-4 text-brand-red" strokeWidth={1.75} />
                      {business.email}
                    </a>
                  </li>
                </ul>
              </Reveal>
            </div>
            <Reveal delay={100} className="lg:col-span-7">
              <div className="border border-line bg-white p-6 sm:p-10">
                <InquiryForm kind="management" submitLabel="Request Consultation" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <JsonLdScript data={faqJsonLd(managementFaqs)} />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Property Management', path: '/property-management' },
        ])}
      />
    </>
  )
}
