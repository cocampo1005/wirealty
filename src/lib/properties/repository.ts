import { showSampleContent } from '@/lib/site-mode'
import { fixtureProperties } from './fixtures'
import { searchProperties } from './search'
import type { Property, PropertyRepository, PropertySearchFilters, PropertySearchResult } from './types'

/**
 * Listing data access.
 *
 * Routes and components call `getPropertyRepository()` and depend only on the
 * `PropertyRepository` interface. To connect an MLS feed later:
 *   1. write `class MlsPropertyRepository implements PropertyRepository`
 *      that maps the provider's records into the normalized `Property` shape;
 *   2. return it from `getPropertyRepository()` when its credentials are set.
 * Nothing else in the application needs to change. See MLS_INTEGRATION.md.
 */

/** Serves the development fixtures. Only ever used in sample-content mode. */
class FixturePropertyRepository implements PropertyRepository {
  readonly source = 'fixture' as const
  readonly isConfigured = true

  async search(filters: PropertySearchFilters): Promise<PropertySearchResult> {
    return searchProperties(fixtureProperties, filters)
  }

  async getBySlug(slug: string): Promise<Property | null> {
    return fixtureProperties.find((property) => property.slug === slug) ?? null
  }

  async getByIds(ids: string[]): Promise<Property[]> {
    return ids
      .map((id) => fixtureProperties.find((property) => property.id === id))
      .filter((property): property is Property => property !== undefined)
  }

  async getRelated(property: Property, limit = 3): Promise<Property[]> {
    const others = fixtureProperties.filter((p) => p.id !== property.id && p.category === property.category)
    const score = (p: Property) =>
      (p.propertyType === property.propertyType ? 2 : 0) +
      (p.address.city === property.address.city ? 1 : 0) +
      (p.intent === property.intent ? 1 : 0)
    return others.sort((a, b) => score(b) - score(a)).slice(0, limit)
  }
}

/**
 * Used on the public site until a real listing source is connected.
 * Returns nothing, so the UI shows its "integration pending" state rather
 * than fabricated inventory.
 */
class EmptyPropertyRepository implements PropertyRepository {
  readonly source = 'none' as const
  readonly isConfigured = false

  async search(filters: PropertySearchFilters): Promise<PropertySearchResult> {
    return { items: [], total: 0, page: 1, pageSize: filters.pageSize ?? 9, pageCount: 1 }
  }

  async getBySlug(): Promise<Property | null> {
    return null
  }

  async getByIds(): Promise<Property[]> {
    return []
  }

  async getRelated(): Promise<Property[]> {
    return []
  }
}

let repository: PropertyRepository | undefined

export function getPropertyRepository(): PropertyRepository {
  // Future: if MLS credentials are configured, return the MLS repository here.
  repository ??= showSampleContent ? new FixturePropertyRepository() : new EmptyPropertyRepository()
  return repository
}
