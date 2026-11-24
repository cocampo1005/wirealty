# MLS Integration Guide

No MLS provider has been selected, connected or subscribed to. This document explains how the site is prepared for one, and what has to be decided and built when the time comes.

## 1. Current state

- The listings experience (search, filters, list and map views, detail pages, favorites, saved searches, inquiry forms) is complete and runs against **development fixtures**.
- Fixtures are only served when sample content is enabled (development / private preview). The **public site uses an empty repository** and shows an "online property search is being connected" state — never fabricated inventory.
- All listing access goes through one interface, so adding a real source does not require changes to pages or components.

## 2. Architecture

```text
routes & components
        │  depend only on…
        ▼
PropertyRepository  (src/lib/properties/types.ts)
        ▲
        │  implemented by…
 ┌──────┴─────────────┬───────────────────────┬─────────────────────────┐
 FixturePropertyRepository   EmptyPropertyRepository   MlsPropertyRepository (to build)
 (dev fixtures)              (public site today)       (provider API → Property)
```

`getPropertyRepository()` in `src/lib/properties/repository.ts` chooses the implementation.

```ts
interface PropertyRepository {
  readonly source: 'fixture' | 'curated' | 'mls' | 'none'
  readonly isConfigured: boolean
  search(filters: PropertySearchFilters): Promise<PropertySearchResult>
  getBySlug(slug: string): Promise<Property | null>
  getByIds(ids: string[]): Promise<Property[]>          // favorites
  getRelated(property: Property, limit?: number): Promise<Property[]>
}
```

Three content types are deliberately kept separate, because they have different sources and publishing rules:

| Content | Source | File |
|---|---|---|
| **MLS inventory** | Provider feed (future) | `src/lib/properties/repository.ts` |
| **Featured opportunities** | Curated by hand | `src/content/featured-properties.ts` |
| **Portfolio transactions** | Historical records, verified by the brokerage | `src/content/portfolio.ts` |

## 3. Steps to connect a provider

1. **Create `src/lib/properties/mls-repository.ts`** with `class MlsPropertyRepository implements PropertyRepository` (`source = 'mls'`). Mark the module `import 'server-only'` and read credentials from environment variables — never `NEXT_PUBLIC_*`.
2. **Map provider records to `Property`** in one function (`toProperty(record)`); see the field table below. Leave optional fields `undefined` when the provider does not supply them — the UI already hides empty facts.
3. **Push filters down** to the provider's query API in `search()` rather than filtering in memory. `PropertySearchFilters` is the full list the UI can produce (`src/lib/properties/search.ts` shows the intended semantics of each).
4. **Return it from `getPropertyRepository()`** when credentials are present; keep the empty repository as the fallback so a missing key degrades to the "being connected" state rather than an error.
5. **Add caching** appropriate to the provider's refresh rules, e.g. a `'use cache'` function with `cacheLife(...)` around provider calls (the project runs Next.js Cache Components).
6. **Populate `attribution`** on every record. The detail page already renders MLS name/number, listing office, agent, last-updated and the disclaimer when present (`src/app/listings/[slug]/page.tsx`); add the same to cards if the MLS requires it.
7. **Allow remote images**: add the provider's image host to `images.remotePatterns` in `next.config.ts` (or proxy/copy photos if the license requires it).
8. **Sitemap**: add live listing URLs in `src/app/sitemap.ts` if the MLS permits indexing.
9. **404 handling**: `src/proxy.ts` returns real 404s for unknown listing slugs only for in-memory sources. For MLS data either add a fast existence check there, or accept the page-level fallback (HTTP 200 with a `noindex` tag).
10. **Remove sample labelling assumptions**: sample badges key off `source === 'fixture'`, so MLS records display without them automatically.

## 4. Field mapping reference

`Property` (see `src/lib/properties/types.ts`) — typical RESO Data Dictionary equivalents are given as a starting point only; confirm against the chosen provider.

| `Property` field | Meaning | Typical RESO field(s) |
|---|---|---|
| `id` | Stable unique id (used for favorites) | `ListingKey` |
| `slug` | URL segment — e.g. address + id | derived |
| `source` | `'mls'` | — |
| `category` | `commercial` \| `residential` | from `PropertyType` |
| `propertyType` | multifamily, retail, industrial, warehouse, office, mixed-use, single-family, condo, townhouse | `PropertyType` / `PropertySubType` |
| `intent` | `sale` \| `lease` | `PropertyType` (Lease classes) / `ListingAgreement` |
| `status` | active, pending, sold, leased, off-market | `StandardStatus` |
| `title` | Optional marketing name | — (curated) |
| `address.*` | line1, unit, city, county, state, postalCode | `UnparsedAddress`, `UnitNumber`, `City`, `CountyOrParish`, `StateOrProvince`, `PostalCode` |
| `address.citySlug` | Links a listing to an area guide | derived from city |
| `coordinates` | lat / lng for maps | `Latitude`, `Longitude` |
| `price.amount` / `period` / `perSqFt` | Sale price, or rent with its period | `ListPrice`, lease rate fields |
| `summary`, `description[]` | Public remarks | `PublicRemarks` |
| `highlights[]` | Short feature list | curated / derived |
| `media[]` | Photos with alt text and dimensions | `Media` resource |
| `residential.*` | bedrooms, bathrooms, livingAreaSqFt, lotSizeSqFt, yearBuilt, hoaFeeMonthly | `BedroomsTotal`, `BathroomsTotalDecimal`, `LivingArea`, `LotSizeSquareFeet`, `YearBuilt`, `AssociationFee` |
| `commercial.*` | buildingSizeSqFt, lotSizeAcres, unitCount, yearBuilt, zoning, leaseType | `BuildingAreaTotal`, `LotSizeAcres`, `NumberOfUnitsTotal`, `YearBuilt`, `Zoning`, lease fields |
| `commercial.capRatePercent`, `noiAnnual`, `occupancyPercent` | **Only when the source legitimately supplies them** | `CapRate`, `NetOperatingIncome`, — |
| `listedAt` | Used for "Newest" sort | `OnMarketDate` / `ListingContractDate` |
| `attribution.*` | mlsName, mlsNumber, listingOffice, listingAgent, disclaimer, lastUpdated | `ListingId`, `ListOfficeName`, `ListAgentFullName`, `ModificationTimestamp` |

Commercial inventory is often carried by a different system than residential MLS data. The repository interface allows combining sources inside one implementation if needed.

## 5. Search contract

URL parameters understood by `/listings` (`src/lib/properties/search-params.ts`):

| Param | Values |
|---|---|
| `category` | `commercial`, `residential` |
| `intent` | `sale`, `lease` |
| `type` | comma-separated property types |
| `location` | county or city slug from `src/content/communities.ts` |
| `q` | free text (address, city, ZIP) |
| `minPrice`, `maxPrice` | numbers |
| `beds`, `baths` | minimums (residential only) |
| `minSqft` | living area or building size |
| `minUnits` | multifamily unit count (commercial only) |
| `sort` | `newest`, `price-asc`, `price-desc`, `size-desc` |
| `view` | `list`, `map` |
| `page` | 1-based |

Residential-only filters are hidden for commercial searches and vice-versa. Price filters exclude unpriced listings and per-square-foot lease rates.

## 6. Decisions and research required before integrating

These are intentionally **not** decided yet:

- **Provider / access route** — direct MLS data license (e.g. a RESO Web API feed), an IDX vendor API, or an interim embed. Which MLS(s) the brokerage participates in; whether commercial listings come from the same source.
- **Authentication and credentials** — how keys/tokens are issued, rotated and stored (server-side environment variables only).
- **Display compliance** — required attribution and logos, disclaimer text, listing-office/agent display, "last updated" stamps, maximum result counts, rules for sold/off-market data, restrictions on which fields may be shown, and any registration requirements before showing details.
- **Photograph rights** — whether images may be hot-linked, must be proxied, or may be cached; watermark rules.
- **Refresh schedule** — how often data must be refreshed, and how removed listings must be purged (affects caching and the sitemap).
- **Fair-housing and state advertising rules** applicable to listing display.
- **Map provider** — the current map view is a regional overview (county-level SVG with numbered pins). Street-level maps need a tile provider (cost, API key, attribution) and should be chosen alongside the feed. The swap points are `src/components/listings/listings-map-view.tsx` and `src/components/maps/locator-map.tsx`.
- **Lead routing** — whether MLS/IDX terms require particular lead-capture behavior.

## 7. Explicitly out of scope for now

Live MLS integration, provider selection, user accounts, listing alerts, saved-search emails, cross-device favorites, automated underwriting, and scraping of any MLS or third-party site (which must never be done).
