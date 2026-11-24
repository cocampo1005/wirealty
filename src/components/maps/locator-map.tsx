import { projectPoint } from '@/lib/geo/project'
import { cn } from '@/lib/utils/cn'
import { RegionMap } from './region-map'

interface LocatorMapProps {
  /** County to highlight. */
  countySlug?: string
  /** Point to mark (approximate location). */
  point?: { lat: number; lng: number }
  /** Visible label beside the marker. */
  label?: string
  /** Text alternative describing what the map shows. */
  description: string
  className?: string
}

/**
 * Static regional locator: highlights a county and/or marks a point on the
 * tri-county map. Used on area pages and listing detail pages. It shows
 * general location only — a street-level map can replace it once a map
 * provider is chosen alongside the MLS integration.
 */
export function LocatorMap({ countySlug, point, label, description, className }: LocatorMapProps) {
  const position = point ? projectPoint(point) : null
  // Keep labels inside the viewBox: flip to the left when the point is near the coast.
  const labelLeft = position ? position.x > 330 : false

  return (
    <figure className={cn('relative', className)}>
      <div role="img" aria-label={description} className="mx-auto aspect-[640/1083] max-h-[34rem] w-auto max-w-full">
        <RegionMap activeCounty={countySlug}>
          {position ? (
            <g>
              <circle cx={position.x} cy={position.y} r={30} className="fill-brand-red/15" />
              <circle cx={position.x} cy={position.y} r={11} strokeWidth={4} className="fill-brand-red stroke-white" />
              {label ? (
                <text
                  x={position.x + (labelLeft ? -24 : 24)}
                  y={position.y + 8}
                  textAnchor={labelLeft ? 'end' : 'start'}
                  strokeWidth={6}
                  strokeLinejoin="round"
                  style={{ paintOrder: 'stroke' }}
                  className={cn(
                    'font-sans text-[24px] font-bold',
                    countySlug ? 'fill-white stroke-brand-blue' : 'fill-navy-deep stroke-white',
                  )}
                >
                  {label}
                </text>
              ) : null}
            </g>
          ) : null}
        </RegionMap>
      </div>
      <figcaption className="mt-3 text-center text-xs text-slate">
        Approximate location. County boundaries: U.S. Census Bureau.
      </figcaption>
    </figure>
  )
}
