import Link from 'next/link'
import { Suspense } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getPropertyRepository } from '@/lib/properties/repository'
import { listingsHref, parseListingsQuery, type ListingsView } from '@/lib/properties/search-params'
import type { PropertySearchFilters, PropertySearchResult } from '@/lib/properties/types'
import { pageMetadata } from '@/lib/seo/metadata'
import { JsonLdScript, breadcrumbJsonLd } from '@/lib/seo/structured-data'
import { cn } from '@/lib/utils/cn'
import { PageHero } from '@/components/layout/page-hero'
import { ListingsMapLoader } from '@/components/listings/listings-map-loader'
import { ListingsShell } from '@/components/listings/listings-shell'
import { ListingsEmpty, ListingsPending, ListingsSkeleton } from '@/components/listings/listings-states'
import { PropertyCard } from '@/components/listings/property-card'
import { ArrowLink } from '@/components/ui/arrow-link'
import { SampleNotice } from '@/components/ui/sample-badge'

export const metadata = pageMetadata({
  title: 'South Florida Property Listings',
  description:
    'Search commercial, investment and residential property across South Florida — multifamily, retail, industrial, office, homes and condos.',
  path: '/listings',
})

export default function ListingsPage({ searchParams }: PageProps<'/listings'>) {
  return (
    <>
      <PageHero eyebrow="Listings" title="Property Search" size="compact">
        <p>Commercial, investment and residential property across South Florida.</p>
        <p className="mt-5">
          <ArrowLink href="/listings/saved" tone="light">
            Saved Properties & Searches
          </ArrowLink>
        </p>
      </PageHero>

      {/* Search state comes from the URL, which is only known per request. */}
      <Suspense fallback={<ListingsSkeleton />}>
        <ListingsContent searchParams={searchParams} />
      </Suspense>

      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Listings', path: '/listings' },
        ])}
      />
    </>
  )
}

async function ListingsContent({ searchParams }: Pick<PageProps<'/listings'>, 'searchParams'>) {
  const repository = getPropertyRepository()
  if (!repository.isConfigured) return <ListingsPending />

  const { filters, view } = parseListingsQuery(await searchParams)
  const result = await repository.search(filters)

  return (
    <ListingsShell filters={filters} view={view} total={result.total}>
      {repository.source === 'fixture' ? (
        <SampleNotice className="mb-8">
          These are development sample listings, not real properties. The public site shows live MLS data
          once the integration is connected — and no listings at all until then.
        </SampleNotice>
      ) : null}

      {result.items.length === 0 ? (
        <ListingsEmpty clearHref={listingsHref({ category: filters.category })} />
      ) : view === 'map' ? (
        <ListingsMapLoader properties={result.items} />
      ) : (
        <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {result.items.map((property, i) => (
            <li key={property.id}>
              <PropertyCard property={property} eager={i < 3} />
            </li>
          ))}
        </ul>
      )}

      <Pagination result={result} filters={filters} view={view} />
    </ListingsShell>
  )
}

/** First, last and the pages around the current one; `null` marks a gap. */
function pageWindow(current: number, count: number): (number | null)[] {
  const pages = new Set([1, count, current - 1, current, current + 1])
  const sorted = [...pages].filter((page) => page >= 1 && page <= count).sort((a, b) => a - b)
  return sorted.flatMap((page, i) => (i > 0 && page - sorted[i - 1] > 1 ? [null, page] : [page]))
}

function Pagination({
  result,
  filters,
  view,
}: {
  result: PropertySearchResult
  filters: PropertySearchFilters
  view: ListingsView
}) {
  if (result.pageCount <= 1) return null
  const href = (page: number) => listingsHref({ ...filters, page }, view)
  const linkClass =
    'inline-flex size-11 items-center justify-center border border-line text-[0.875rem] font-semibold text-navy-deep transition-colors hover:border-navy-deep/50'

  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-2">
      {result.page > 1 ? (
        <Link href={href(result.page - 1)} className={linkClass} rel="prev">
          <ChevronLeft aria-hidden className="size-4" strokeWidth={1.75} />
          <span className="sr-only">Previous page</span>
        </Link>
      ) : null}
      {pageWindow(result.page, result.pageCount).map((page, i) =>
        page === null ? (
          <span key={`gap-${i}`} aria-hidden className="px-1 text-slate">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={href(page)}
            aria-current={page === result.page ? 'page' : undefined}
            className={cn(linkClass, page === result.page && 'border-navy-deep bg-navy-deep text-white hover:border-navy-deep')}
          >
            <span className="sr-only">Page </span>
            {page}
          </Link>
        ),
      )}
      {result.page < result.pageCount ? (
        <Link href={href(result.page + 1)} className={linkClass} rel="next">
          <ChevronRight aria-hidden className="size-4" strokeWidth={1.75} />
          <span className="sr-only">Next page</span>
        </Link>
      ) : null}
    </nav>
  )
}
