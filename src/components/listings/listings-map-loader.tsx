'use client'

import dynamic from 'next/dynamic'
import type { Property } from '@/lib/properties/types'

// The map view is only downloaded when a visitor switches to it.
const ListingsMapView = dynamic(() => import('./listings-map-view'), {
  loading: () => (
    <div role="status" aria-label="Loading map" className="grid animate-pulse gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="h-[30rem] bg-mist-deep lg:order-2 lg:col-span-5" />
      <div className="space-y-5 lg:order-1 lg:col-span-7">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-mist" />
        ))}
      </div>
    </div>
  ),
})

export function ListingsMapLoader({ properties }: { properties: Property[] }) {
  return <ListingsMapView properties={properties} />
}
