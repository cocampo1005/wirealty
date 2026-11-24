'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { cities, citiesInCounty, counties, referencePlaces, type City } from '@/content/communities'
import { countyShapes } from '@/content/geo/south-florida'
import { projectPoint } from '@/lib/geo/project'
import { listingsHref } from '@/lib/properties/search-params'
import { cn } from '@/lib/utils/cn'
import { ArrowLink } from '@/components/ui/arrow-link'
import { Button } from '@/components/ui/button'
import { RegionMap } from './region-map'

/** Where each city label sits relative to its marker, to avoid collisions. */
const labelPlacement: Record<string, { dx: number; dy: number; anchor: 'start' | 'end' | 'middle' }> = {
  weston: { dx: -14, dy: 6, anchor: 'end' },
  plantation: { dx: 0, dy: -16, anchor: 'middle' },
  davie: { dx: -14, dy: 14, anchor: 'end' },
  'fort-lauderdale': { dx: 16, dy: 6, anchor: 'start' },
  hollywood: { dx: 16, dy: 7, anchor: 'start' },
  miami: { dx: 16, dy: 7, anchor: 'start' },
}

/** County name positions, nudged into open land away from the city markers. */
const countyLabelOffset: Record<string, { dx: number; dy: number }> = {
  'palm-beach-county': { dx: -10, dy: 0 },
  'broward-county': { dx: -88, dy: 4 },
  'miami-dade-county': { dx: -40, dy: -30 },
}

const EASE = [0.16, 1, 0.3, 1] as const

interface RegionExplorerProps {
  /** County selected on load. */
  defaultCounty?: string
  /** Show the county photograph in the information panel. */
  showImage?: boolean
  className?: string
}

export function RegionExplorer({ defaultCounty = 'broward-county', showImage = true, className }: RegionExplorerProps) {
  const [countySlug, setCountySlug] = useState(defaultCounty)
  const [citySlug, setCitySlug] = useState<string | null>(null)
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()

  const county = counties.find((c) => c.slug === countySlug) ?? counties[0]
  const countyCities = citiesInCounty(county.slug)
  const city = citySlug ? cities.find((c) => c.slug === citySlug) : undefined
  const subject = city ?? county

  const selectCounty = (slug: string) => {
    setCountySlug(slug)
    setCitySlug(null)
  }

  const selectCity = (target: City) => {
    setCountySlug(target.countySlug)
    setCitySlug(target.slug)
  }

  return (
    <div className={cn('grid gap-10 lg:grid-cols-12 lg:gap-8', className)}>
      {/* Map */}
      <div className="lg:col-span-5">
        <div className="mx-auto aspect-[640/1083] max-h-[40rem] w-auto max-w-full lg:max-h-[46rem]">
          <RegionMap
            activeCounty={county.slug}
            hoveredCounty={hoveredCounty}
            onCountyHover={setHoveredCounty}
            onCountySelect={selectCounty}
          >
            {/* County names */}
            <g className="pointer-events-none">
              {countyShapes.map((shape) => {
                const offset = countyLabelOffset[shape.slug] ?? { dx: 0, dy: 0 }
                const meta = counties.find((c) => c.slug === shape.slug)
                const active = shape.slug === county.slug
                return (
                  <text
                    key={shape.slug}
                    x={shape.centroid[0] + offset.dx}
                    y={shape.centroid[1] + offset.dy}
                    textAnchor="middle"
                    className={cn(
                      'font-sans text-[17px] font-semibold tracking-[0.2em] uppercase transition-[fill] duration-500',
                      active ? 'fill-white' : 'fill-brand-blue/70',
                    )}
                  >
                    {meta?.shortName}
                  </text>
                )
              })}
            </g>

            {/* Orientation labels (not selectable) */}
            <g className="pointer-events-none">
              {referencePlaces.map((place) => {
                const { x, y } = projectPoint(place.coordinates)
                return (
                  <g key={place.name}>
                    <circle cx={x} cy={y} r={3.5} className="fill-slate/60" />
                    <text x={x + 12} y={y + 6} className="fill-slate font-sans text-[17px] font-medium">
                      {place.name}
                    </text>
                  </g>
                )
              })}
            </g>

            {/* City markers */}
            <g>
              {cities.map((item) => {
                const { x, y } = projectPoint(item.coordinates)
                const place = labelPlacement[item.slug] ?? { dx: 16, dy: 7, anchor: 'start' as const }
                const selected = item.slug === citySlug
                const inActiveCounty = item.countySlug === county.slug
                const emphasized = selected || item.slug === hoveredCity
                return (
                  <g
                    key={item.slug}
                    className="cursor-pointer"
                    onClick={() => selectCity(item)}
                    onMouseEnter={() => setHoveredCity(item.slug)}
                    onMouseLeave={() => setHoveredCity(null)}
                  >
                    {/* Generous invisible hit area for touch. */}
                    <circle cx={x} cy={y} r={26} fill="transparent" />
                    <circle
                      cx={x}
                      cy={y}
                      r={emphasized ? 15 : 0}
                      className={cn(
                        'transition-[r] duration-500 ease-out-expo',
                        inActiveCounty ? 'fill-white/25' : 'fill-brand-red/15',
                      )}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={selected ? 7.5 : 6}
                      strokeWidth={2.5}
                      className={cn(
                        'transition-[fill,stroke,r] duration-300',
                        selected
                          ? 'fill-brand-red stroke-white'
                          : inActiveCounty
                            ? 'fill-white stroke-navy-deep'
                            : 'fill-white stroke-brand-blue',
                      )}
                    />
                    <text
                      x={x + place.dx}
                      y={y + place.dy}
                      textAnchor={place.anchor}
                      strokeWidth={5}
                      strokeLinejoin="round"
                      style={{ paintOrder: 'stroke' }}
                      className={cn(
                        'font-sans text-[19px] transition-[fill,stroke] duration-300',
                        emphasized ? 'font-bold' : 'font-semibold',
                        // Labels sitting over the active (blue) county are reversed; the
                        // halo keeps the others legible over land, borders and ocean.
                        inActiveCounty && place.anchor !== 'start'
                          ? 'fill-white stroke-brand-blue'
                          : 'fill-navy-deep stroke-mist',
                      )}
                    >
                      {item.name}
                    </text>
                  </g>
                )
              })}
            </g>
          </RegionMap>
        </div>
        <p className="mt-4 text-center text-xs text-slate">
          County boundaries: U.S. Census Bureau cartographic boundary files.
        </p>
      </div>

      {/* Controls + information panel (the accessible equivalent of the map) */}
      <div className="lg:col-span-7 lg:pl-6 xl:pl-12">
        <div role="group" aria-label="Select a county" className="grid grid-cols-3 border border-line bg-white">
          {counties.map((item, i) => {
            const active = item.slug === county.slug
            return (
              <button
                key={item.slug}
                type="button"
                aria-pressed={active}
                onClick={() => selectCounty(item.slug)}
                onMouseEnter={() => setHoveredCounty(item.slug)}
                onMouseLeave={() => setHoveredCounty(null)}
                onFocus={() => setHoveredCounty(item.slug)}
                onBlur={() => setHoveredCounty(null)}
                className={cn(
                  'relative min-h-14 px-2 py-3 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase transition-colors duration-300 sm:text-[0.75rem] sm:tracking-[0.14em]',
                  i > 0 && 'border-l border-line',
                  active ? 'bg-navy-deep text-white' : 'text-slate hover:bg-mist hover:text-navy-deep',
                )}
              >
                {item.shortName}
                <span className="sr-only"> County</span>
              </button>
            )
          })}
        </div>

        <div className="mt-8 min-h-[26rem]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={subject.slug}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {showImage ? (
                <div className="relative mb-8 aspect-[16/8] overflow-hidden bg-mist-deep">
                  <Image
                    src={subject.image.src}
                    alt={subject.image.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <p className="text-eyebrow text-brand-blue">
                {city ? county.name : 'County'}
              </p>
              <h3 className="mt-3 text-display-md text-navy-deep">{subject.name}</h3>
              <p className="mt-4 max-w-xl text-slate">{subject.summary}</p>

              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
                <Button href={`/areas/${subject.slug}`} variant="navy" arrow>
                  {city ? `Explore ${subject.name}` : `Explore ${county.shortName}`}
                </Button>
                <ArrowLink href={listingsHref({ location: subject.slug })}>View Listings</ArrowLink>
              </div>
            </motion.div>
          </AnimatePresence>

          {countyCities.length > 0 ? (
            <div className="mt-10 border-t border-line pt-7">
              <p id="explorer-cities" className="text-eyebrow text-slate">
                Cities in {county.name}
              </p>
              <ul aria-labelledby="explorer-cities" className="mt-4 flex flex-wrap gap-2">
                {countyCities.map((item) => {
                  const selected = item.slug === citySlug
                  return (
                    <li key={item.slug}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => (selected ? setCitySlug(null) : selectCity(item))}
                        onMouseEnter={() => setHoveredCity(item.slug)}
                        onMouseLeave={() => setHoveredCity(null)}
                        onFocus={() => setHoveredCity(item.slug)}
                        onBlur={() => setHoveredCity(null)}
                        className={cn(
                          'inline-flex min-h-11 items-center border px-4 text-[0.8125rem] font-semibold transition-colors duration-200',
                          selected
                            ? 'border-brand-red bg-brand-red text-white'
                            : 'border-line bg-white text-ink hover:border-navy-deep/50',
                        )}
                      >
                        {item.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
