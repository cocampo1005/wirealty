import Image from 'next/image'
import { images } from '@/content/images'
import { managementHighlights, managementIntro } from '@/content/services'
import { ArrowLink } from '@/components/ui/arrow-link'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'

export function ManagementPreview({ index }: { index?: string }) {
  return (
    <section className="overflow-hidden bg-white section-y">
      <div className="container-wi">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Layered photography */}
          <div className="relative lg:col-span-6">
            <Reveal variant="unveil" className="relative aspect-[4/5] w-[82%] overflow-hidden bg-mist-deep sm:aspect-[5/6]">
              <Image
                src={images.managementHero.src}
                alt={images.managementHero.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 82vw"
                className="object-cover"
              />
            </Reveal>
            <Reveal
              variant="unveil"
              delay={200}
              className="absolute right-0 bottom-[-2.5rem] aspect-[4/3] w-[52%] overflow-hidden border-[10px] border-white bg-mist-deep lg:bottom-[-3.5rem]"
            >
              <Image
                src={images.managementInterior.src}
                alt={images.managementInterior.alt}
                fill
                sizes="(min-width: 1024px) 26vw, 52vw"
                className="object-cover"
              />
            </Reveal>
            <div aria-hidden className="absolute top-[-1.25rem] right-[10%] -z-10 h-40 w-px bg-brand-red/60" />
          </div>

          <div className="pt-10 lg:col-span-6 lg:pt-0 lg:pl-12">
            <Reveal>
              <SectionHeading eyebrow="Property Management" index={index} title={managementIntro.homeHeading}>
                {managementIntro.homeBody}
              </SectionHeading>
            </Reveal>

            <ul className="mt-10 border-t border-line">
              {managementHighlights.map((item, i) => (
                <Reveal as="li" key={item} delay={i * 70} className="flex items-baseline gap-5 border-b border-line py-4">
                  <span aria-hidden className="w-6 shrink-0 text-[0.6875rem] font-semibold tracking-[0.2em] text-brand-red">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[1.0625rem] font-medium text-navy-deep">{item}</span>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={150} className="mt-10 flex flex-col gap-x-8 gap-y-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Button href="/property-management#consultation" arrow>
                Request a Property Management Consultation
              </Button>
              <ArrowLink href="/property-management">How It Works</ArrowLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
