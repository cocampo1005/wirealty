import { isPropertyType, propertyTypeLabels } from './labels'
import type { ListingIntent, PropertyCategory, PropertySearchFilters, PropertySort } from './types'

/**
 * URL contract for /listings. Search state lives entirely in the query string
 * so results are shareable, bookmarkable and server-rendered.
 *
 *   category  commercial | residential
 *   intent    sale | lease
 *   type      comma-separated property types
 *   location  community or county slug
 *   q         free-text search
 *   minPrice, maxPrice, beds, baths, minSqft, minUnits   numbers
 *   sort      newest | price-asc | price-desc | size-desc
 *   view      list | map
 *   page      1-based page number
 */

export type ListingsView = 'list' | 'map'

export interface ListingsQuery {
  filters: PropertySearchFilters
  view: ListingsView
}

export type RawSearchParams = Record<string, string | string[] | undefined>

const SORTS: PropertySort[] = ['newest', 'price-asc', 'price-desc', 'size-desc']

function first(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value
  return v?.trim() || undefined
}

function positiveNumber(value: string | undefined): number | undefined {
  if (!value) return undefined
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : undefined
}

export function parseListingsQuery(params: RawSearchParams): ListingsQuery {
  const category = first(params.category)
  const intent = first(params.intent)
  const sort = first(params.sort)
  const types = first(params.type)?.split(',').filter(isPropertyType)
  const page = positiveNumber(first(params.page))

  const filters: PropertySearchFilters = {
    category: category === 'commercial' || category === 'residential' ? (category as PropertyCategory) : undefined,
    intent: intent === 'sale' || intent === 'lease' ? (intent as ListingIntent) : undefined,
    propertyTypes: types?.length ? types : undefined,
    location: first(params.location)?.toLowerCase(),
    query: first(params.q)?.slice(0, 80),
    minPrice: positiveNumber(first(params.minPrice)),
    maxPrice: positiveNumber(first(params.maxPrice)),
    minBedrooms: positiveNumber(first(params.beds)),
    minBathrooms: positiveNumber(first(params.baths)),
    minSqFt: positiveNumber(first(params.minSqft)),
    minUnits: positiveNumber(first(params.minUnits)),
    sort: SORTS.includes(sort as PropertySort) ? (sort as PropertySort) : undefined,
    page: page ? Math.floor(page) : undefined,
  }

  return { filters, view: first(params.view) === 'map' ? 'map' : 'list' }
}

/** Serializes search state back into a query string (without the leading "?"). */
export function buildListingsQuery(filters: PropertySearchFilters, view: ListingsView = 'list'): string {
  const params = new URLSearchParams()
  const set = (key: string, value: string | number | undefined) => {
    if (value !== undefined && value !== '') params.set(key, String(value))
  }
  set('category', filters.category)
  set('intent', filters.intent)
  set('type', filters.propertyTypes?.join(','))
  set('location', filters.location)
  set('q', filters.query)
  set('minPrice', filters.minPrice)
  set('maxPrice', filters.maxPrice)
  set('beds', filters.minBedrooms)
  set('baths', filters.minBathrooms)
  set('minSqft', filters.minSqFt)
  set('minUnits', filters.minUnits)
  set('sort', filters.sort && filters.sort !== 'newest' ? filters.sort : undefined)
  set('view', view === 'map' ? 'map' : undefined)
  set('page', filters.page && filters.page > 1 ? filters.page : undefined)
  return params.toString()
}

export function listingsHref(filters: PropertySearchFilters = {}, view: ListingsView = 'list'): string {
  const query = buildListingsQuery(filters, view)
  return query ? `/listings?${query}` : '/listings'
}

/** Number of narrowing filters applied (excludes category, sort, view and page). */
export function countActiveFilters(filters: PropertySearchFilters): number {
  return [
    filters.intent,
    filters.propertyTypes?.length ? true : undefined,
    filters.location,
    filters.query,
    filters.minPrice,
    filters.maxPrice,
    filters.minBedrooms,
    filters.minBathrooms,
    filters.minSqFt,
    filters.minUnits,
  ].filter((value) => value !== undefined).length
}

/** Human-readable summary used for saved searches, e.g. "Commercial · Multifamily · Fort Lauderdale". */
export function describeFilters(filters: PropertySearchFilters, locationLabel?: string): string {
  const parts: string[] = []
  if (filters.category) parts.push(filters.category === 'commercial' ? 'Commercial' : 'Residential')
  if (filters.intent) parts.push(filters.intent === 'sale' ? 'For sale' : 'For lease / rent')
  if (filters.propertyTypes?.length) parts.push(filters.propertyTypes.map((type) => propertyTypeLabels[type]).join(', '))
  if (locationLabel) parts.push(locationLabel)
  if (filters.query) parts.push(`“${filters.query}”`)
  if (filters.minPrice || filters.maxPrice) parts.push('price range')
  if (filters.minBedrooms) parts.push(`${filters.minBedrooms}+ beds`)
  if (filters.minBathrooms) parts.push(`${filters.minBathrooms}+ baths`)
  if (filters.minSqFt) parts.push(`${filters.minSqFt.toLocaleString('en-US')}+ sq ft`)
  if (filters.minUnits) parts.push(`${filters.minUnits}+ units`)
  return parts.length ? parts.join(' · ') : 'All listings'
}
