import Link from 'next/link'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { business } from '@/content/business'
import { pageMetadata } from '@/lib/seo/metadata'
import { JsonLdScript, breadcrumbJsonLd } from '@/lib/seo/structured-data'
import { ContactInquiryForm } from '@/components/forms/contact-inquiry-form'
import { PageHero } from '@/components/layout/page-hero'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/ui/reveal'

export const metadata = pageMetadata({
  title: 'Contact',
  description:
    'Contact Weston International Realty about commercial real estate, buying or selling a home, or property management in South Florida.',
  path: '/contact',
})

const pathways = [
  {
    title: 'Commercial real estate',
    description: 'Acquire, sell or lease commercial and investment property.',
    href: '/contact?interest=commercial#inquiry',
  },
  {
    title: 'Residential buying / selling',
    description: 'Buy, sell or rent a home or condo.',
    href: '/contact?interest=residential#inquiry',
  },
  {
    title: 'Property management',
    description: 'Request a consultation for a property you own.',
    href: '/property-management#consultation',
  },
  {
    title: 'General inquiry',
    description: 'Anything else — we are glad to help.',
    href: '/contact?interest=general#inquiry',
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let’s Talk About Your Goals." size="compact">
        Tell us what you are looking for and we will follow up personally.
      </PageHero>

      <section className="bg-white section-y-sm">
        <div className="container-wi">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            {/* Details */}
            <div className="lg:col-span-5">
              <Reveal>
                <Eyebrow>Reach Us Directly</Eyebrow>
                <ul className="mt-7 border-t border-line">
                  {business.phones.map((phone, i) => (
                    <li key={phone.e164} className="border-b border-line">
                      <a href={`tel:${phone.e164}`} className="group flex min-h-[4.5rem] items-center gap-5 py-4">
                        <Phone aria-hidden className="size-5 shrink-0 text-brand-red" strokeWidth={1.5} />
                        <span>
                          <span className="block text-xs font-semibold tracking-[0.14em] text-slate uppercase">
                            {i === 0 ? `Phone · ${business.broker.name}` : 'Phone'}
                          </span>
                          <span className="block font-display text-xl font-semibold text-navy-deep transition-colors group-hover:text-brand-blue">
                            {phone.display}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                  <li className="border-b border-line">
                    <a href={`mailto:${business.email}`} className="group flex min-h-[4.5rem] items-center gap-5 py-4">
                      <Mail aria-hidden className="size-5 shrink-0 text-brand-red" strokeWidth={1.5} />
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold tracking-[0.14em] text-slate uppercase">Email</span>
                        <span className="block text-lg font-semibold break-words text-navy-deep transition-colors group-hover:text-brand-blue">
                          {business.email}
                        </span>
                      </span>
                    </a>
                  </li>
                  <li className="flex min-h-[4.5rem] items-center gap-5 border-b border-line py-4">
                    <MapPin aria-hidden className="size-5 shrink-0 text-brand-red" strokeWidth={1.5} />
                    <span>
                      <span className="block text-xs font-semibold tracking-[0.14em] text-slate uppercase">Serving</span>
                      <span className="block text-lg font-semibold text-navy-deep">
                        {business.locationLabel} — {business.serviceArea.map((c) => c.replace(' County', '')).join(', ')}
                      </span>
                    </span>
                  </li>
                </ul>
              </Reveal>

              <Reveal delay={120}>
                <h2 className="mt-14 text-eyebrow text-slate">How Can We Help?</h2>
                <ul className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {pathways.map((path) => (
                    <li key={path.title} className="bg-white">
                      <Link href={path.href} className="group flex h-full items-start justify-between gap-4 p-5 transition-colors duration-200 hover:bg-mist">
                        <span>
                          <span className="block font-semibold text-navy-deep">{path.title}</span>
                          <span className="mt-1 block text-[0.8125rem] leading-snug text-slate">{path.description}</span>
                        </span>
                        <ArrowUpRight
                          aria-hidden
                          className="mt-0.5 size-4 shrink-0 text-slate/60 transition-colors group-hover:text-brand-red"
                          strokeWidth={1.75}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-10 text-eyebrow text-slate">{business.name}</p>
                <p className="mt-2 text-sm text-slate">{business.licensing.statement}</p>
              </Reveal>
            </div>

            {/* Form */}
            <Reveal delay={80} className="lg:col-span-7 lg:pl-8">
              <div id="inquiry" className="scroll-mt-28 border border-line bg-mist p-6 sm:p-10">
                <h2 className="text-display-md text-navy-deep">Send a Message</h2>
                <p className="mt-3 mb-8 max-w-lg text-slate">
                  Share a few details and the best way to reach you. Fields marked{' '}
                  <span className="text-brand-red">*</span> are required.
                </p>
                <ContactInquiryForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
    </>
  )
}
