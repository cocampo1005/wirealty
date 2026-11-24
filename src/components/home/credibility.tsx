import { business, experienceFigure } from '@/content/business'
import { showSampleContent } from '@/lib/site-mode'
import { Reveal } from '@/components/ui/reveal'
import { SampleBadge } from '@/components/ui/sample-badge'

interface Marker {
  figure: string
  label: string
  /** Shown as a preview-only flag when the figure still needs client confirmation. */
  pending?: boolean
}

/**
 * Credibility strip. Every marker is drawn from content/business.ts — nothing
 * here may state a transaction total, sales volume, rating, award or
 * affiliation that has not been verified.
 */
export function Credibility() {
  const markers: Marker[] = [
    experienceFigure
      ? {
          figure: experienceFigure,
          label: 'Years of South Florida real estate experience',
          pending: !business.experience.confirmed,
        }
      : { figure: 'Decades', label: 'Of hands-on South Florida real estate experience' },
    { figure: 'Licensed', label: 'Florida real estate broker' },
    { figure: 'Tri-County', label: 'Miami-Dade, Broward & Palm Beach' },
    { figure: 'Full-Cycle', label: 'Acquire, lease, sell & manage with one firm' },
  ]

  return (
    <section aria-label="Experience and credentials" className="border-b border-line bg-white">
      <div className="container-wi">
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {markers.map((marker, i) => (
            <Reveal
              as="li"
              key={marker.figure}
              delay={i * 80}
              className={[
                'relative px-1 py-9 sm:px-6 lg:px-8 lg:py-12',
                i % 2 === 1 ? 'border-l border-line pl-5 sm:pl-6' : '',
                i >= 2 ? 'border-t border-line lg:border-t-0' : '',
                i === 2 ? 'lg:border-l' : '',
                i === 0 ? 'lg:pl-0' : '',
              ].join(' ')}
            >
              <p className="font-display text-[clamp(1.5rem,1rem+1.9vw,2.5rem)] leading-none font-medium whitespace-nowrap text-navy-deep">
                {marker.figure}
              </p>
              <p className="mt-3 max-w-[15rem] text-[0.8125rem] leading-snug font-medium text-slate">
                {marker.label}
              </p>
              {marker.pending && showSampleContent ? (
                <SampleBadge className="mt-3">Figure pending confirmation</SampleBadge>
              ) : null}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
