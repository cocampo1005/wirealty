import { ArrowLink } from '@/components/ui/arrow-link'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { RegionExplorer } from '@/components/maps/region-explorer'

export function ExploreAreas({ index }: { index?: string }) {
  return (
    <section className="bg-mist section-y">
      <div className="container-wi">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionHeading eyebrow="Explore South Florida" index={index} title="Three Counties. One Local Perspective." className="max-w-3xl">
              Select a county or city to see where we work — from Palm Beach in the north to Miami-Dade in
              the south.
            </SectionHeading>
          </Reveal>
          <Reveal delay={120} className="shrink-0">
            <ArrowLink href="/areas">All Areas</ArrowLink>
          </Reveal>
        </div>

        <Reveal className="mt-12 lg:mt-16">
          <RegionExplorer showImage={false} />
        </Reveal>
      </div>
    </section>
  )
}
