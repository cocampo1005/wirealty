'use client'

import { useRouter } from 'next/navigation'
import { Bookmark, BookmarkCheck, LayoutGrid, Map as MapIcon, SlidersHorizontal, X } from 'lucide-react'
import { useCallback, useOptimistic, useRef, useState, useTransition, type ReactNode } from 'react'
import { useSavedSearches } from '@/hooks/use-favorites'
import { intentLabel, propertyTypeLabels, sortLabels } from '@/lib/properties/labels'
import {
  buildListingsQuery,
  countActiveFilters,
  describeFilters,
  listingsHref,
  type ListingsView,
} from '@/lib/properties/search-params'
import type { PropertySearchFilters, PropertySort } from '@/lib/properties/types'
import { formatCurrencyCompact } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import { FilterDrawer } from './filter-drawer'
import { FilterFields } from './filter-fields'
import { locationLabel } from './filter-options'

interface ListingsShellProps {
  filters: PropertySearchFilters
  view: ListingsView
  total: number
  /** Server-rendered results. */
  children: ReactNode
}

interface Chip {
  key: string
  label: string
  remove: Partial<PropertySearchFilters>
}

function activeChips(filters: PropertySearchFilters): Chip[] {
  const chips: Chip[] = []
  if (filters.intent)
    chips.push({ key: 'intent', label: filters.category ? intentLabel(filters.intent, filters.category) : filters.intent === 'sale' ? 'For Sale' : 'Lease / Rent', remove: { intent: undefined } })
  if (filters.propertyTypes?.length)
    chips.push({
      key: 'type',
      label: filters.propertyTypes.map((type) => propertyTypeLabels[type]).join(', '),
      remove: { propertyTypes: undefined },
    })
  if (filters.location)
    chips.push({ key: 'location', label: locationLabel(filters.location) ?? filters.location, remove: { location: undefined } })
  if (filters.query) chips.push({ key: 'q', label: `“${filters.query}”`, remove: { query: undefined } })
  if (filters.minPrice) chips.push({ key: 'minPrice', label: `From ${formatCurrencyCompact(filters.minPrice)}`, remove: { minPrice: undefined } })
  if (filters.maxPrice) chips.push({ key: 'maxPrice', label: `Up to ${formatCurrencyCompact(filters.maxPrice)}`, remove: { maxPrice: undefined } })
  if (filters.minBedrooms) chips.push({ key: 'beds', label: `${filters.minBedrooms}+ beds`, remove: { minBedrooms: undefined } })
  if (filters.minBathrooms) chips.push({ key: 'baths', label: `${filters.minBathrooms}+ baths`, remove: { minBathrooms: undefined } })
  if (filters.minSqFt) chips.push({ key: 'sqft', label: `${filters.minSqFt.toLocaleString('en-US')}+ sq ft`, remove: { minSqFt: undefined } })
  if (filters.minUnits) chips.push({ key: 'units', label: `${filters.minUnits}+ units`, remove: { minUnits: undefined } })
  return chips
}

/**
 * Interactive frame around the server-rendered results: filters, sort, view
 * switch and saved searches. All state lives in the URL — every control
 * simply navigates to the matching /listings query.
 */
export function ListingsShell({ filters: appliedFilters, view: appliedView, total, children }: ListingsShellProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  // Controls reflect a choice immediately, while the matching results load.
  const [filters, setOptimisticFilters] = useOptimistic(appliedFilters)
  const [view, setOptimisticView] = useOptimistic(appliedView)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerToggle = useRef<HTMLButtonElement>(null)
  const { save, remove, searches } = useSavedSearches()

  const navigate = useCallback(
    (nextFilters: PropertySearchFilters, nextView: ListingsView = view) => {
      startTransition(() => {
        setOptimisticFilters(nextFilters)
        setOptimisticView(nextView)
        router.push(listingsHref(nextFilters, nextView), { scroll: false })
      })
    },
    [router, view, setOptimisticFilters, setOptimisticView],
  )

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    drawerToggle.current?.focus()
  }, [])

  const chips = activeChips(filters)
  const activeCount = countActiveFilters(filters)
  // Saved searches ignore the page number and view.
  const searchQuery = buildListingsQuery({ ...filters, page: undefined })
  const saved = searches.find((item) => item.query === searchQuery)

  return (
    <>
      {/* Filters */}
      <div className="border-b border-line bg-mist">
        <div className="container-wi py-5 lg:py-7">
          <div className="hidden lg:block">
            <FilterFields layout="bar" value={filters} onChange={(next) => navigate(next)} />
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              ref={drawerToggle}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-12 flex-1 items-center justify-center gap-3 bg-navy-deep px-5 text-label text-white"
            >
              <SlidersHorizontal aria-hidden className="size-4" strokeWidth={1.75} />
              Filters
              {activeCount > 0 ? (
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-brand-red text-[0.6875rem] tracking-normal">
                  {activeCount}
                  <span className="sr-only"> active</span>
                </span>
              ) : null}
            </button>
            <ViewToggle view={view} onChange={(next) => navigate(filters, next)} />
          </div>
        </div>
      </div>

      <div className="container-wi pt-8 pb-20 lg:pt-10 lg:pb-28">
        {/* Results header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p aria-live="polite" className="text-[0.9375rem] text-ink">
              <span className="font-semibold text-navy-deep">{total}</span>{' '}
              {total === 1 ? 'property' : 'properties'}
              {filters.category ? ` · ${filters.category === 'commercial' ? 'Commercial' : 'Residential'}` : ''}
              {pending ? <span className="ml-3 text-slate">Updating…</span> : null}
            </p>
            {chips.length > 0 ? (
              <ul className="mt-3 flex flex-wrap items-center gap-2">
                {chips.map((chip) => (
                  <li key={chip.key}>
                    <button
                      type="button"
                      onClick={() => navigate({ ...filters, ...chip.remove, page: undefined })}
                      className="group inline-flex min-h-9 items-center gap-2 border border-line bg-white py-1 pr-2 pl-3 text-[0.8125rem] font-medium text-ink transition-colors hover:border-navy-deep/50"
                    >
                      {chip.label}
                      <X aria-hidden className="size-3.5 text-slate group-hover:text-brand-red" strokeWidth={2} />
                      <span className="sr-only">Remove filter</span>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => navigate({ category: filters.category, sort: filters.sort })}
                    className="min-h-9 px-2 text-[0.8125rem] font-semibold text-brand-blue underline underline-offset-4"
                  >
                    Clear all
                  </button>
                </li>
              </ul>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <button
              type="button"
              aria-pressed={Boolean(saved)}
              onClick={() =>
                saved ? remove(saved.id) : save(searchQuery, describeFilters(filters, locationLabel(filters.location)))
              }
              className={cn(
                'inline-flex h-11 items-center gap-2.5 border px-4 text-[0.75rem] font-semibold tracking-[0.1em] uppercase transition-colors',
                saved ? 'border-navy-deep bg-navy-deep text-white' : 'border-line text-navy-deep hover:border-navy-deep/50',
              )}
            >
              {saved ? (
                <BookmarkCheck aria-hidden className="size-4" strokeWidth={1.75} />
              ) : (
                <Bookmark aria-hidden className="size-4" strokeWidth={1.75} />
              )}
              {saved ? 'Search Saved' : 'Save Search'}
            </button>

            <label className="flex items-center gap-2">
              <span className="sr-only">Sort by</span>
              <select
                value={filters.sort ?? 'newest'}
                onChange={(event) => navigate({ ...filters, sort: event.target.value as PropertySort, page: undefined })}
                className="select-chevron block h-11 border border-line bg-white pr-9 pl-3.5 text-[0.875rem] text-ink hover:border-navy-deep/40"
              >
                {(Object.keys(sortLabels) as PropertySort[]).map((sort) => (
                  <option key={sort} value={sort}>
                    {sortLabels[sort]}
                  </option>
                ))}
              </select>
            </label>

            <div className="hidden lg:block">
              <ViewToggle view={view} onChange={(next) => navigate(filters, next)} />
            </div>
          </div>
        </div>

        <div aria-busy={pending} className={cn('mt-8 transition-opacity duration-300 lg:mt-10', pending && 'opacity-50')}>
          {children}
        </div>
      </div>

      <FilterDrawer open={drawerOpen} filters={filters} onApply={(next) => navigate(next)} onClose={closeDrawer} />
    </>
  )
}

function ViewToggle({ view, onChange }: { view: ListingsView; onChange: (view: ListingsView) => void }) {
  const options: { value: ListingsView; label: string; icon: typeof LayoutGrid }[] = [
    { value: 'list', label: 'List', icon: LayoutGrid },
    { value: 'map', label: 'Map', icon: MapIcon },
  ]
  return (
    <div role="group" aria-label="Results view" className="inline-flex border border-line bg-white">
      {options.map((option, i) => {
        const active = option.value === view
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex h-[2.875rem] items-center gap-2 px-4 text-[0.75rem] font-semibold tracking-[0.1em] uppercase transition-colors lg:h-[2.625rem]',
              i > 0 && 'border-l border-line',
              active ? 'bg-navy-deep text-white' : 'text-navy-deep hover:bg-mist',
            )}
          >
            <option.icon aria-hidden className="size-4" strokeWidth={1.75} />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
