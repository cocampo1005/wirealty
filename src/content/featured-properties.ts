import { fixtureProperties } from '@/lib/properties/fixtures'
import { showSampleContent } from '@/lib/site-mode'
import type { FeaturedProperty, Property } from '@/lib/properties/types'

/**
 * Featured opportunities — curated by hand, independent of MLS search results.
 *
 * To publish a real opportunity, add an entry with `state: 'published'` and a
 * complete `property` record (`source: 'curated'`), using approved photography
 * and only publishable figures. The three entries below are layout samples
 * built from development fixtures; they are hidden on the public site.
 */

function fixture(id: string): Property {
  const property = fixtureProperties.find((p) => p.id === id)
  if (!property) throw new Error(`Unknown fixture: ${id}`)
  return property
}

export const featuredProperties: FeaturedProperty[] = [
  {
    id: 'featured-sample-1',
    order: 1,
    state: 'sample',
    note: 'Multifamily',
    property: fixture('fx-102'),
  },
  {
    id: 'featured-sample-2',
    order: 2,
    state: 'sample',
    property: fixture('fx-101'),
  },
  {
    id: 'featured-sample-3',
    order: 3,
    state: 'sample',
    property: fixture('fx-105'),
  },
]

/** Featured entries that may be shown in the current mode, in display order. */
export function getFeaturedProperties(category?: Property['category']): FeaturedProperty[] {
  return featuredProperties
    .filter((entry) => entry.state === 'published' || showSampleContent)
    .filter((entry) => !category || entry.property.category === category)
    .sort((a, b) => a.order - b.order)
}
