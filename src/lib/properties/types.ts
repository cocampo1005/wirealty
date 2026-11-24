/**
 * Normalized property model.
 *
 * Every listing source (development fixtures today, an MLS feed later) is
 * mapped into these shapes, so UI components never depend on a provider's
 * field names. See MLS_INTEGRATION.md for the mapping notes.
 */

export type PropertyCategory = 'commercial' | 'residential'

export type CommercialPropertyType =
  | 'multifamily'
  | 'retail'
  | 'industrial'
  | 'warehouse'
  | 'office'
  | 'mixed-use'

export type ResidentialPropertyType = 'single-family' | 'condo' | 'townhouse'

export type PropertyType = CommercialPropertyType | ResidentialPropertyType

/** Whether the property is offered for sale or for lease/rent. */
export type ListingIntent = 'sale' | 'lease'

export type PropertyStatus = 'active' | 'pending' | 'sold' | 'leased' | 'off-market'

/**
 * Where a record came from. Drives labeling and publishing rules:
 * - fixture: development-only sample data — never shown on the public site
 * - curated: entered by hand by the brokerage (featured opportunities)
 * - mls:     supplied by the future MLS integration
 */
export type PropertySource = 'fixture' | 'curated' | 'mls'

export interface PropertyAddress {
  line1: string
  unit?: string
  city: string
  /** Slug of the matching community in content/communities.ts, when one exists. */
  citySlug?: string
  county?: string
  state: string
  postalCode: string
}

export interface GeoPoint {
  lat: number
  lng: number
}

export interface PropertyImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface PropertyPrice {
  amount: number
  /** Present for leases: the period the amount applies to. */
  period?: 'month' | 'year'
  /** Commercial leases are often quoted per square foot per year. */
  perSqFt?: boolean
}

/** Residential facts. All optional — sources differ in what they supply. */
export interface ResidentialDetails {
  bedrooms?: number
  bathrooms?: number
  livingAreaSqFt?: number
  lotSizeSqFt?: number
  yearBuilt?: number
  hoaFeeMonthly?: number
}

/**
 * Commercial facts. Financial metrics (cap rate, NOI, occupancy) are optional
 * and must only ever be populated from a legitimate data source — never
 * estimated or invented for display.
 */
export interface CommercialDetails {
  buildingSizeSqFt?: number
  lotSizeAcres?: number
  unitCount?: number
  yearBuilt?: number
  zoning?: string
  capRatePercent?: number
  noiAnnual?: number
  occupancyPercent?: number
  leaseType?: string
}

/** Attribution an MLS typically requires next to its data. Filled by the MLS provider. */
export interface MlsAttribution {
  mlsName: string
  mlsNumber: string
  listingOffice?: string
  listingAgent?: string
  disclaimer?: string
  lastUpdated?: string
}

export interface Property {
  id: string
  slug: string
  source: PropertySource
  category: PropertyCategory
  propertyType: PropertyType
  intent: ListingIntent
  status: PropertyStatus
  /** Marketing name. Falls back to the street address when absent. */
  title?: string
  address: PropertyAddress
  coordinates?: GeoPoint
  /** Omitted when the price is not publishable ("Price upon request"). */
  price?: PropertyPrice
  summary: string
  description: string[]
  highlights: string[]
  media: PropertyImage[]
  residential?: ResidentialDetails
  commercial?: CommercialDetails
  /** ISO date the listing was first published; used for "newest" sorting. */
  listedAt?: string
  attribution?: MlsAttribution
}

export type PropertySort = 'newest' | 'price-asc' | 'price-desc' | 'size-desc'

export interface PropertySearchFilters {
  category?: PropertyCategory
  intent?: ListingIntent
  propertyTypes?: PropertyType[]
  /** Community slug (see content/communities.ts) or county slug. */
  location?: string
  /** Free-text match against title, address and city. */
  query?: string
  minPrice?: number
  maxPrice?: number
  /** Residential only. */
  minBedrooms?: number
  /** Residential only. */
  minBathrooms?: number
  /** Living area (residential) or building size (commercial). */
  minSqFt?: number
  /** Commercial only — multifamily unit count. */
  minUnits?: number
  sort?: PropertySort
  page?: number
  pageSize?: number
}

export interface PropertySearchResult {
  items: Property[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export interface PropertyLocationOption {
  slug: string
  label: string
  kind: 'county' | 'city'
}

/**
 * The contract every listing source implements. Components and routes only
 * talk to this interface, so replacing fixtures with an MLS provider means
 * writing one new class — see lib/properties/repository.ts.
 */
export interface PropertyRepository {
  /** Identifies the active source for diagnostics and UI labeling. */
  readonly source: PropertySource | 'none'
  /** True when the repository can return listings at all. */
  readonly isConfigured: boolean
  search(filters: PropertySearchFilters): Promise<PropertySearchResult>
  getBySlug(slug: string): Promise<Property | null>
  /** Returns the listings that still exist, in the order requested. */
  getByIds(ids: string[]): Promise<Property[]>
  getRelated(property: Property, limit?: number): Promise<Property[]>
}

/**
 * A hand-picked opportunity for the homepage and Commercial page. Managed in
 * content/featured-properties.ts, independently of MLS search results.
 */
export interface FeaturedProperty {
  id: string
  /** Lower numbers appear first. */
  order: number
  /**
   * `published` entries appear on the public site. `sample` entries exist to
   * demonstrate the layout and are only visible in sample-content mode.
   */
  state: 'published' | 'sample'
  /** Optional one-line editorial note shown on the card. */
  note?: string
  property: Property
}

export type TransactionRole =
  | 'Seller representation'
  | 'Buyer representation'
  | 'Landlord representation'
  | 'Tenant representation'
  | 'Buyer & seller representation'

/**
 * A completed or represented transaction for the Portfolio. Historical record
 * — unrelated to live inventory and never sourced from the MLS feed.
 */
export interface PortfolioTransaction {
  slug: string
  /**
   * `published` — verified by the brokerage and cleared for public display.
   * `draft`     — awaiting verification; visible only in sample-content mode.
   */
  state: 'published' | 'draft'
  title: string
  city: string
  county?: string
  category: PropertyCategory
  propertyType: PropertyType
  transactionType: 'Sale' | 'Acquisition' | 'Lease'
  /** Display status, e.g. "Sold", "Acquired", "Leased". */
  status: string
  role: TransactionRole
  year?: number
  /** Only set when verified and the client has authorized disclosure. */
  price?: number
  summary: string
  body: string[]
  facts: { label: string; value: string }[]
  cover: PropertyImage
  gallery?: PropertyImage[]
}
