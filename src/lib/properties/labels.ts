import { formatCurrency, formatNumber } from '@/lib/utils/format'
import type {
  CommercialPropertyType,
  ListingIntent,
  Property,
  PropertyCategory,
  PropertySort,
  PropertyStatus,
  PropertyType,
  ResidentialPropertyType,
} from './types'

export const commercialTypeLabels: Record<CommercialPropertyType, string> = {
  multifamily: 'Multifamily',
  retail: 'Retail',
  industrial: 'Industrial',
  warehouse: 'Warehouse',
  office: 'Office',
  'mixed-use': 'Mixed-Use',
}

export const residentialTypeLabels: Record<ResidentialPropertyType, string> = {
  'single-family': 'Single-Family Home',
  condo: 'Condo',
  townhouse: 'Townhouse',
}

export const propertyTypeLabels: Record<PropertyType, string> = {
  ...commercialTypeLabels,
  ...residentialTypeLabels,
}

export const categoryLabels: Record<PropertyCategory, string> = {
  commercial: 'Commercial',
  residential: 'Residential',
}

export const sortLabels: Record<PropertySort, string> = {
  newest: 'Newest',
  'price-desc': 'Price: high to low',
  'price-asc': 'Price: low to high',
  'size-desc': 'Largest',
}

export function isPropertyType(value: string): value is PropertyType {
  return value in propertyTypeLabels
}

export function typesForCategory(category?: PropertyCategory): PropertyType[] {
  if (category === 'commercial') return Object.keys(commercialTypeLabels) as PropertyType[]
  if (category === 'residential') return Object.keys(residentialTypeLabels) as PropertyType[]
  return Object.keys(propertyTypeLabels) as PropertyType[]
}

/** "For Sale" / "For Lease" (commercial) / "For Rent" (residential). */
export function intentLabel(intent: ListingIntent, category?: PropertyCategory): string {
  if (intent === 'sale') return 'For Sale'
  return category === 'residential' ? 'For Rent' : 'For Lease'
}

const statusLabels: Record<PropertyStatus, string> = {
  active: 'Active',
  pending: 'Pending',
  sold: 'Sold',
  leased: 'Leased',
  'off-market': 'Off Market',
}

/** Card/detail status: active listings show their intent, others their status. */
export function statusLabel(property: Property): string {
  return property.status === 'active'
    ? intentLabel(property.intent, property.category)
    : statusLabels[property.status]
}

export function propertyTitle(property: Property): string {
  return property.title ?? streetAddress(property)
}

export function streetAddress(property: Property): string {
  const { line1, unit } = property.address
  return unit ? `${line1}, ${unit}` : line1
}

export function cityLine(property: Property): string {
  const { city, state, postalCode } = property.address
  return `${city}, ${state} ${postalCode}`
}

/** "$4,850,000", "$3,400 / mo", "$38 / sq ft / yr" or "Price upon request". */
export function priceLabel(property: Property): string {
  const price = property.price
  if (!price) return 'Price upon request'
  const amount = formatCurrency(price.amount)
  if (price.perSqFt) return `${amount} / sq ft / yr`
  if (price.period === 'month') return `${amount} / mo`
  if (price.period === 'year') return `${amount} / yr`
  return amount
}

export interface PropertyFact {
  label: string
  value: string
}

/** The two or three facts that matter most on a card, by category. */
export function keyFacts(property: Property): PropertyFact[] {
  const facts: PropertyFact[] = []
  const { residential, commercial } = property

  if (property.category === 'residential' && residential) {
    if (residential.bedrooms !== undefined) facts.push({ label: 'Beds', value: String(residential.bedrooms) })
    if (residential.bathrooms !== undefined) facts.push({ label: 'Baths', value: String(residential.bathrooms) })
    if (residential.livingAreaSqFt !== undefined)
      facts.push({ label: 'Sq Ft', value: formatNumber(residential.livingAreaSqFt) })
  }

  if (property.category === 'commercial' && commercial) {
    if (commercial.unitCount !== undefined) facts.push({ label: 'Units', value: formatNumber(commercial.unitCount) })
    if (commercial.buildingSizeSqFt !== undefined)
      facts.push({ label: 'Sq Ft', value: formatNumber(commercial.buildingSizeSqFt) })
    if (commercial.lotSizeAcres !== undefined && facts.length < 3)
      facts.push({ label: 'Acres', value: String(commercial.lotSizeAcres) })
    if (commercial.yearBuilt !== undefined && facts.length < 3)
      facts.push({ label: 'Built', value: String(commercial.yearBuilt) })
  }

  return facts.slice(0, 3)
}

/** Full specification list for the detail page. Only populated fields are returned. */
export function detailFacts(property: Property): PropertyFact[] {
  const facts: PropertyFact[] = [
    { label: 'Property type', value: propertyTypeLabels[property.propertyType] },
    { label: 'Status', value: statusLabel(property) },
  ]
  const { residential: r, commercial: c } = property

  if (r) {
    if (r.bedrooms !== undefined) facts.push({ label: 'Bedrooms', value: String(r.bedrooms) })
    if (r.bathrooms !== undefined) facts.push({ label: 'Bathrooms', value: String(r.bathrooms) })
    if (r.livingAreaSqFt !== undefined) facts.push({ label: 'Living area', value: `${formatNumber(r.livingAreaSqFt)} sq ft` })
    if (r.lotSizeSqFt !== undefined) facts.push({ label: 'Lot size', value: `${formatNumber(r.lotSizeSqFt)} sq ft` })
    if (r.yearBuilt !== undefined) facts.push({ label: 'Year built', value: String(r.yearBuilt) })
    if (r.hoaFeeMonthly !== undefined) facts.push({ label: 'HOA fee', value: `${formatCurrency(r.hoaFeeMonthly)} / mo` })
  }

  if (c) {
    if (c.unitCount !== undefined) facts.push({ label: 'Units', value: formatNumber(c.unitCount) })
    if (c.buildingSizeSqFt !== undefined) facts.push({ label: 'Building size', value: `${formatNumber(c.buildingSizeSqFt)} sq ft` })
    if (c.lotSizeAcres !== undefined) facts.push({ label: 'Lot size', value: `${c.lotSizeAcres} acres` })
    if (c.yearBuilt !== undefined) facts.push({ label: 'Year built', value: String(c.yearBuilt) })
    if (c.zoning) facts.push({ label: 'Zoning', value: c.zoning })
    if (c.leaseType) facts.push({ label: 'Lease type', value: c.leaseType })
    // Financial metrics appear only when the data source supplies them.
    if (c.capRatePercent !== undefined) facts.push({ label: 'Cap rate', value: `${c.capRatePercent}%` })
    if (c.noiAnnual !== undefined) facts.push({ label: 'Net operating income', value: `${formatCurrency(c.noiAnnual)} / yr` })
    if (c.occupancyPercent !== undefined) facts.push({ label: 'Occupancy', value: `${c.occupancyPercent}%` })
  }

  if (property.address.county) facts.push({ label: 'County', value: property.address.county })
  return facts
}
