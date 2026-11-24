import { showSampleContent } from '@/lib/site-mode'
import type { PortfolioTransaction, PropertyCategory } from '@/lib/properties/types'
import { images } from './images'

/**
 * Portfolio — completed and represented transactions.
 *
 * IMPORTANT: every record below is a DRAFT SAMPLE created to demonstrate the
 * layout. None describes a real Weston International Realty transaction, and
 * none is shown on the public site. Replace them with verified records:
 *
 *   - set `state: 'published'` only once the transaction details are confirmed
 *     by the brokerage and the client has authorized their publication;
 *   - include `price` only when verified AND authorized for disclosure;
 *   - use photography the brokerage has the right to publish.
 *
 * See CONTENT_VERIFICATION.md → Portfolio.
 */

const draftBody = [
  'This is a draft sample record used to demonstrate the portfolio layout. It does not describe a real transaction.',
  'Replace this text with the verified story of the transaction: the client’s objective, how the property was sourced or marketed, and the outcome — in the brokerage’s own words and with the client’s approval.',
]

export const portfolioTransactions: PortfolioTransaction[] = [
  {
    slug: 'sample-multifamily-acquisition',
    state: 'draft',
    title: 'Multifamily Acquisition',
    city: 'Fort Lauderdale',
    county: 'Broward County',
    category: 'commercial',
    propertyType: 'multifamily',
    transactionType: 'Acquisition',
    status: 'Acquired',
    role: 'Buyer representation',
    summary: 'Draft sample — a garden-style apartment community acquired on behalf of an investor client.',
    body: draftBody,
    facts: [
      { label: 'Property type', value: 'Multifamily' },
      { label: 'Role', value: 'Buyer representation' },
      { label: 'Location', value: 'Fort Lauderdale, FL' },
    ],
    cover: images.typeMultifamily,
    gallery: [images.sampleMultifamily3, images.managementInterior],
  },
  {
    slug: 'sample-warehouse-lease',
    state: 'draft',
    title: 'Warehouse Lease',
    city: 'Miami',
    county: 'Miami-Dade County',
    category: 'commercial',
    propertyType: 'warehouse',
    transactionType: 'Lease',
    status: 'Leased',
    role: 'Tenant representation',
    summary: 'Draft sample — warehouse space secured for a growing business.',
    body: draftBody,
    facts: [
      { label: 'Property type', value: 'Warehouse' },
      { label: 'Role', value: 'Tenant representation' },
      { label: 'Location', value: 'Miami, FL' },
    ],
    cover: images.typeWarehouse,
    gallery: [images.typeIndustrial],
  },
  {
    slug: 'sample-retail-storefront-lease',
    state: 'draft',
    title: 'Retail Storefront Lease',
    city: 'Hollywood',
    county: 'Broward County',
    category: 'commercial',
    propertyType: 'retail',
    transactionType: 'Lease',
    status: 'Leased',
    role: 'Tenant representation',
    summary: 'Draft sample — a street-level retail location leased for a local operator.',
    body: draftBody,
    facts: [
      { label: 'Property type', value: 'Retail' },
      { label: 'Role', value: 'Tenant representation' },
      { label: 'Location', value: 'Hollywood, FL' },
    ],
    cover: images.typeRetail,
  },
  {
    slug: 'sample-office-building-sale',
    state: 'draft',
    title: 'Office Building Sale',
    city: 'Plantation',
    county: 'Broward County',
    category: 'commercial',
    propertyType: 'office',
    transactionType: 'Sale',
    status: 'Sold',
    role: 'Seller representation',
    summary: 'Draft sample — a professional office building marketed and sold for its owner.',
    body: draftBody,
    facts: [
      { label: 'Property type', value: 'Office' },
      { label: 'Role', value: 'Seller representation' },
      { label: 'Location', value: 'Plantation, FL' },
    ],
    cover: images.typeOffice,
  },
  {
    slug: 'sample-single-family-home-sale',
    state: 'draft',
    title: 'Single-Family Home Sale',
    city: 'Weston',
    county: 'Broward County',
    category: 'residential',
    propertyType: 'single-family',
    transactionType: 'Sale',
    status: 'Sold',
    role: 'Seller representation',
    summary: 'Draft sample — a family home prepared, listed and sold.',
    body: draftBody,
    facts: [
      { label: 'Property type', value: 'Single-family home' },
      { label: 'Role', value: 'Seller representation' },
      { label: 'Location', value: 'Weston, FL' },
    ],
    cover: images.residentialExterior,
    gallery: [images.residentialInterior],
  },
  {
    slug: 'sample-condo-purchase',
    state: 'draft',
    title: 'Oceanfront Condo Purchase',
    city: 'Hollywood',
    county: 'Broward County',
    category: 'residential',
    propertyType: 'condo',
    transactionType: 'Sale',
    status: 'Sold',
    role: 'Buyer representation',
    summary: 'Draft sample — a condominium purchased on behalf of a buyer.',
    body: draftBody,
    facts: [
      { label: 'Property type', value: 'Condo' },
      { label: 'Role', value: 'Buyer representation' },
      { label: 'Location', value: 'Hollywood, FL' },
    ],
    cover: images.residentialCondo,
  },
]

/** Transactions that may be shown in the current mode. */
export function getPortfolio(category?: PropertyCategory): PortfolioTransaction[] {
  return portfolioTransactions
    .filter((t) => t.state === 'published' || showSampleContent)
    .filter((t) => !category || t.category === category)
}

export function getPortfolioTransaction(slug: string): PortfolioTransaction | undefined {
  return getPortfolio().find((t) => t.slug === slug)
}

/** Published records only — used for the sitemap and static params. */
export function getPublishedPortfolio(): PortfolioTransaction[] {
  return portfolioTransactions.filter((t) => t.state === 'published')
}
