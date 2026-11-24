import Image from 'next/image'
import { business, experiencePhrase, verifiedCredentials } from '@/content/business'
import { showSampleContent } from '@/lib/site-mode'
import { cn } from '@/lib/utils/cn'
import { ArrowLink } from '@/components/ui/arrow-link'
import { LogoMark } from '@/components/ui/logo'
import { Reveal } from '@/components/ui/reveal'
import { SampleBadge } from '@/components/ui/sample-badge'
import { SectionHeading } from '@/components/ui/section-heading'

/** Portrait slot. Shows the approved portrait when supplied, otherwise a branded holding panel. */
export function BrokerPortrait({ className }: { className?: string }) {
  const { portrait, name } = business.broker
  return (
    <div className={cn('relative overflow-hidden bg-navy-deep', className)}>
      {portrait ? (
        <Image
          src={portrait}
          alt={`${name}, ${business.broker.title} of ${business.name}`}
          fill
          sizes="(min-width: 1024px) 34vw, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-blueprint p-8 text-center">
          <LogoMark onDark className="size-24 opacity-95" />
          <p className="mt-8 font-display text-2xl font-medium text-white">{name}</p>
          <p className="mt-2 text-eyebrow text-sky">{business.broker.title}</p>
          {showSampleContent ? (
            <SampleBadge className="mt-8">Portrait to be supplied</SampleBadge>
          ) : null}
        </div>
      )}
    </div>
  )
}

export function BrokerIntro({ index }: { index?: string }) {
  return (
    <section className="bg-white section-y">
      <div className="container-wi">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal variant="unveil" className="lg:col-span-5">
            <BrokerPortrait className="aspect-[4/5]" />
          </Reveal>

          <div className="lg:col-span-7 lg:pl-12">
            <Reveal>
              <SectionHeading eyebrow="Meet the Broker" index={index} title={business.broker.name}>
                <p>
                  {business.broker.name} is the {business.broker.title.toLowerCase()} of {business.name}. With{' '}
                  {experiencePhrase} of hands-on experience across residential, commercial and property
                  management, he works closely with property owners, investors and businesses throughout South
                  Florida.
                </p>
              </SectionHeading>
            </Reveal>

            <Reveal delay={100}>
              <p className="mt-8 max-w-2xl border-l-2 border-brand-red pl-6 font-display text-[1.375rem] leading-snug font-medium text-navy-deep sm:text-2xl">
                A personal, direct relationship — from the first conversation to closing, and beyond.
              </p>
            </Reveal>

            {verifiedCredentials.length > 0 ? (
              <Reveal delay={160}>
                <ul className="mt-9 flex flex-wrap gap-x-8 gap-y-2 text-eyebrow text-slate">
                  {verifiedCredentials.map((credential) => (
                    <li key={credential.id} className="flex items-center gap-3">
                      <span aria-hidden className="size-1.5 bg-brand-red" />
                      {credential.label}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            <Reveal delay={220} className="mt-9">
              <ArrowLink href="/about">About the Firm</ArrowLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
