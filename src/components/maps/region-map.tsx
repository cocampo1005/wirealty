import type { ReactNode } from 'react'
import { contextShapes, countyShapes, mapViewBox } from '@/content/geo/south-florida'
import { cn } from '@/lib/utils/cn'

interface RegionMapProps {
  /** Slug of the highlighted county, if any. */
  activeCounty?: string | null
  hoveredCounty?: string | null
  onCountyHover?: (slug: string | null) => void
  onCountySelect?: (slug: string) => void
  /** Markers, labels and pins rendered above the geometry (in viewBox units). */
  children?: ReactNode
  className?: string
}

/**
 * Base map of Palm Beach, Broward and Miami-Dade counties.
 * Geometry comes from U.S. Census Bureau cartographic boundary files
 * (see scripts/build-map-data.mjs). The SVG is decorative for assistive
 * technology — callers provide equivalent list-based controls.
 */
export function RegionMap({
  activeCounty,
  hoveredCounty,
  onCountyHover,
  onCountySelect,
  children,
  className,
}: RegionMapProps) {
  const interactive = Boolean(onCountySelect)

  return (
    <svg
      viewBox={`0 0 ${mapViewBox.width} ${mapViewBox.height}`}
      aria-hidden
      focusable="false"
      className={cn('block h-full w-full select-none', className)}
    >
      <g>
        {contextShapes.map((shape) => (
          <path key={shape.name} d={shape.path} className="fill-mist-deep stroke-white" strokeWidth={1.5} />
        ))}
      </g>

      <g>
        {countyShapes.map((county) => {
          const active = county.slug === activeCounty
          const hovered = county.slug === hoveredCounty
          return (
            <path
              key={county.slug}
              d={county.path}
              strokeWidth={active ? 2.5 : 1.5}
              strokeLinejoin="round"
              onMouseEnter={interactive ? () => onCountyHover?.(county.slug) : undefined}
              onMouseLeave={interactive ? () => onCountyHover?.(null) : undefined}
              onClick={interactive ? () => onCountySelect?.(county.slug) : undefined}
              className={cn(
                'transition-[fill,stroke] duration-500 ease-out-expo',
                interactive && 'cursor-pointer',
                active
                  ? 'fill-brand-blue stroke-navy-deep'
                  : hovered
                    ? 'fill-sky stroke-brand-blue'
                    : 'fill-white stroke-brand-blue/45',
              )}
            />
          )
        })}
      </g>

      {children}
    </svg>
  )
}
