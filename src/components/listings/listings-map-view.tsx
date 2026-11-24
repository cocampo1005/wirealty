'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { projectPoint } from '@/lib/geo/project'
import { cityLine, priceLabel, propertyTitle, propertyTypeLabels, statusLabel } from '@/lib/properties/labels'
import type { Property } from '@/lib/properties/types'
import { cn } from '@/lib/utils/cn'
import { RegionMap } from '@/components/maps/region-map'
import { SampleBadge } from '@/components/ui/sample-badge'
import { FavoriteButton } from './favorite-button'

/**
 * Map view: numbered pins on the regional map, synchronized with a compact
 * list. The list is the accessible equivalent of the map — every pin has a
 * matching, keyboard-reachable row.
 *
 * This is a regional overview. A street-level, tile-based map can replace
 * <RegionMap> here when a map provider is selected with the MLS integration.
 */
export default function ListingsMapView({ properties }: { properties: Property[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const located = properties.filter((property) => property.coordinates)

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:order-2 lg:col-span-5">
        <div className="bg-mist p-4 sm:p-8 lg:sticky lg:top-24">
          <div className="mx-auto aspect-[640/1083] max-h-[30rem] w-auto max-w-full lg:max-h-[calc(100svh-12rem)]">
            <RegionMap>
              {located.map((property) => {
                const index = properties.indexOf(property) + 1
                const { x, y } = projectPoint(property.coordinates!)
                const active = property.id === activeId
                return (
                  <g
                    key={property.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveId(property.id)}
                    onMouseLeave={() => setActiveId(null)}
                    onClick={() => {
                      setActiveId(property.id)
                      document.getElementById(`map-row-${property.id}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
                    }}
                  >
                    <circle cx={x} cy={y} r={30} fill="transparent" />
                    <circle
                      cx={x}
                      cy={y}
                      r={active ? 21 : 16}
                      strokeWidth={3}
                      className={cn(
                        'stroke-white transition-[r,fill] duration-300 ease-out-expo',
                        active ? 'fill-brand-red' : 'fill-navy-deep',
                      )}
                    />
                    <text
                      x={x}
                      y={y + 6}
                      textAnchor="middle"
                      className="pointer-events-none fill-white font-sans text-[17px] font-bold"
                    >
                      {index}
                    </text>
                  </g>
                )
              })}
              {/* Draw the active pin last so it sits above its neighbors. */}
              {located
                .filter((property) => property.id === activeId)
                .map((property) => {
                  const index = properties.indexOf(property) + 1
                  const { x, y } = projectPoint(property.coordinates!)
                  return (
                    <g key={`active-${property.id}`} className="pointer-events-none">
                      <circle cx={x} cy={y} r={21} strokeWidth={3} className="fill-brand-red stroke-white" />
                      <text x={x} y={y + 6} textAnchor="middle" className="fill-white font-sans text-[17px] font-bold">
                        {index}
                      </text>
                    </g>
                  )
                })}
            </RegionMap>
          </div>
          <p className="mt-4 text-center text-xs text-slate">
            Approximate locations of the listings on this page. County boundaries: U.S. Census Bureau.
          </p>
        </div>
      </div>

      <ol className="lg:order-1 lg:col-span-7">
        {properties.map((property, i) => {
          const title = propertyTitle(property)
          const cover = property.media[0]
          const active = property.id === activeId
          return (
            <li
              key={property.id}
              id={`map-row-${property.id}`}
              onMouseEnter={() => setActiveId(property.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(property.id)}
              onBlur={() => setActiveId(null)}
              className={cn(
                'group relative flex scroll-mt-28 gap-4 border-b border-line py-5 transition-colors first:border-t sm:gap-6',
                active && 'bg-mist',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'absolute top-5 left-0 z-10 inline-flex size-7 items-center justify-center text-[0.75rem] font-bold text-white transition-colors',
                  active ? 'bg-brand-red' : 'bg-navy-deep',
                )}
              >
                {i + 1}
              </span>
              <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden bg-mist-deep sm:w-48">
                {cover ? (
                  <Image src={cover.src} alt={cover.alt} fill sizes="(min-width: 640px) 192px, 128px" className="object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 pr-12">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-eyebrow text-brand-blue">
                  {propertyTypeLabels[property.propertyType]}
                  <span className="text-slate">{statusLabel(property)}</span>
                  {property.source === 'fixture' ? <SampleBadge /> : null}
                </p>
                <h3 className="mt-2 text-[1.0625rem] leading-snug font-semibold text-navy-deep">
                  <Link href={`/listings/${property.slug}`} className="after:absolute after:inset-0 after:content-['']">
                    {title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-slate">{cityLine(property)}</p>
                <p className="mt-2 font-semibold text-navy-deep">{priceLabel(property)}</p>
              </div>
              <FavoriteButton
                propertyId={property.id}
                label={title}
                className="absolute top-4 right-0 z-10 border border-line shadow-none"
              />
            </li>
          )
        })}
      </ol>
    </div>
  )
}
