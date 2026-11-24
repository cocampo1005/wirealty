import type { Property, PropertySearchFilters, PropertySearchResult } from './types'

export const DEFAULT_PAGE_SIZE = 9

/** "Broward County" → "broward-county" */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Living area for homes, building size for commercial property. */
export function propertySize(property: Property): number | undefined {
  return property.residential?.livingAreaSqFt ?? property.commercial?.buildingSizeSqFt
}

function matchesLocation(property: Property, location: string): boolean {
  const { citySlug, city, county } = property.address
  return (
    citySlug === location ||
    slugify(city) === location ||
    (county !== undefined && slugify(county) === location)
  )
}

function matchesQuery(property: Property, query: string): boolean {
  const haystack = [
    property.title,
    property.address.line1,
    property.address.city,
    property.address.county,
    property.address.postalCode,
    property.propertyType,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term))
}

export function matchesFilters(property: Property, filters: PropertySearchFilters): boolean {
  if (filters.category && property.category !== filters.category) return false
  if (filters.intent && property.intent !== filters.intent) return false
  if (filters.propertyTypes?.length && !filters.propertyTypes.includes(property.propertyType)) return false
  if (filters.location && !matchesLocation(property, filters.location)) return false
  if (filters.query && !matchesQuery(property, filters.query)) return false

  // Price filters exclude unpriced listings and per-square-foot lease rates,
  // which are not comparable with a total price.
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const price = property.price
    if (!price || price.perSqFt) return false
    if (filters.minPrice !== undefined && price.amount < filters.minPrice) return false
    if (filters.maxPrice !== undefined && price.amount > filters.maxPrice) return false
  }

  if (filters.minBedrooms !== undefined && (property.residential?.bedrooms ?? -1) < filters.minBedrooms) return false
  if (filters.minBathrooms !== undefined && (property.residential?.bathrooms ?? -1) < filters.minBathrooms) return false
  if (filters.minSqFt !== undefined && (propertySize(property) ?? -1) < filters.minSqFt) return false
  if (filters.minUnits !== undefined && (property.commercial?.unitCount ?? -1) < filters.minUnits) return false

  return true
}

function comparator(sort: PropertySearchFilters['sort']): (a: Property, b: Property) => number {
  switch (sort) {
    case 'price-asc':
    case 'price-desc': {
      const direction = sort === 'price-asc' ? 1 : -1
      // Unpriced and per-sq-ft listings sort last in either direction.
      const value = (p: Property) => (p.price && !p.price.perSqFt ? p.price.amount : undefined)
      return (a, b) => {
        const av = value(a)
        const bv = value(b)
        if (av === undefined && bv === undefined) return 0
        if (av === undefined) return 1
        if (bv === undefined) return -1
        return (av - bv) * direction
      }
    }
    case 'size-desc':
      return (a, b) => (propertySize(b) ?? 0) - (propertySize(a) ?? 0)
    case 'newest':
    default:
      return (a, b) => (b.listedAt ?? '').localeCompare(a.listedAt ?? '')
  }
}

/**
 * In-memory search used by the fixture repository. An MLS-backed repository
 * would normally push these filters down to the provider's query API instead.
 */
export function searchProperties(all: Property[], filters: PropertySearchFilters): PropertySearchResult {
  const pageSize = Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE)
  const matches = all.filter((property) => matchesFilters(property, filters)).sort(comparator(filters.sort))
  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize))
  const page = Math.min(Math.max(1, filters.page ?? 1), pageCount)
  return {
    items: matches.slice((page - 1) * pageSize, page * pageSize),
    total: matches.length,
    page,
    pageSize,
    pageCount,
  }
}
