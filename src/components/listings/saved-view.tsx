'use client'

import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFavorites, useSavedSearches } from '@/hooks/use-favorites'
import { useHydrated } from '@/hooks/use-local-store'
import type { Property } from '@/lib/properties/types'
import { Button } from '@/components/ui/button'
import { PropertyCard } from './property-card'

type Loaded = { key: string; properties: Property[]; failed: boolean }

/**
 * Saved properties and searches for this browser. Ids come from localStorage
 * and are resolved against the live listing source, so listings that have
 * been removed are flagged instead of silently disappearing.
 */
export function SavedView() {
  const hydrated = useHydrated()
  const { ids, remove } = useFavorites()
  const { searches, remove: removeSearch } = useSavedSearches()
  const [loaded, setLoaded] = useState<Loaded | null>(null)

  const key = ids.join(',')

  useEffect(() => {
    if (!hydrated || ids.length === 0) return
    const controller = new AbortController()
    fetch(`/api/properties?ids=${encodeURIComponent(key)}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data: { properties: Property[] }) => setLoaded({ key, properties: data.properties, failed: false }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setLoaded({ key, properties: [], failed: true })
      })
    return () => controller.abort()
    // `ids` is represented by `key`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, key])

  if (!hydrated) {
    return (
      <div role="status" aria-label="Loading saved properties" className="grid animate-pulse gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="aspect-[4/3] bg-mist-deep" />
        ))}
      </div>
    )
  }

  const current = loaded && loaded.key === key ? loaded : null
  const loading = ids.length > 0 && !current
  const properties = current ? current.properties.filter((property) => ids.includes(property.id)) : []
  const unavailable = current && !current.failed ? ids.filter((id) => !current.properties.some((p) => p.id === id)) : []

  return (
    <div className="space-y-20">
      <section aria-labelledby="saved-properties">
        <h2 id="saved-properties" className="text-display-md text-navy-deep">
          Saved Properties
        </h2>

        {ids.length === 0 ? (
          <div className="mt-8 border border-line bg-mist p-8 sm:p-12">
            <p className="max-w-xl text-slate">
              You have not saved any properties yet. Select the heart on any listing to keep it here. Saved
              properties are stored in this browser only — no account is needed.
            </p>
            <div className="mt-6">
              <Button href="/listings" variant="navy" arrow>
                Browse Listings
              </Button>
            </div>
          </div>
        ) : null}

        {loading ? (
          <p role="status" className="mt-8 text-slate">
            Loading your saved properties…
          </p>
        ) : null}

        {current?.failed ? (
          <p role="alert" className="mt-8 border border-brand-red/40 bg-[#fdf6f6] p-5 text-ink">
            We could not load your saved properties right now. Please refresh the page to try again.
          </p>
        ) : null}

        {properties.length > 0 ? (
          <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {properties.map((property, i) => (
              <li key={property.id}>
                <PropertyCard property={property} eager={i < 3} />
              </li>
            ))}
          </ul>
        ) : null}

        {unavailable.length > 0 ? (
          <div className="mt-10 flex flex-col gap-4 border border-line bg-mist p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.9375rem] text-ink">
              {unavailable.length === 1
                ? '1 saved property is no longer available.'
                : `${unavailable.length} saved properties are no longer available.`}
            </p>
            <button
              type="button"
              onClick={() => unavailable.forEach(remove)}
              className="inline-flex min-h-11 items-center gap-2 self-start text-label text-navy-deep underline underline-offset-4 sm:self-auto"
            >
              <Trash2 aria-hidden className="size-4" strokeWidth={1.75} />
              Remove From Saved
            </button>
          </div>
        ) : null}
      </section>

      <section aria-labelledby="saved-searches">
        <h2 id="saved-searches" className="text-display-md text-navy-deep">
          Saved Searches
        </h2>
        {searches.length === 0 ? (
          <p className="mt-6 max-w-xl text-slate">
            No saved searches yet. Use “Save Search” on the listings page to keep a set of filters here.
          </p>
        ) : (
          <ul className="mt-8 border-t border-line">
            {searches.map((search) => (
              <li key={search.id} className="flex items-center justify-between gap-4 border-b border-line py-4">
                <Link
                  href={search.query ? `/listings?${search.query}` : '/listings'}
                  className="min-w-0 font-semibold text-navy-deep underline-offset-4 hover:text-brand-blue hover:underline"
                >
                  {search.label}
                </Link>
                <button
                  type="button"
                  onClick={() => removeSearch(search.id)}
                  className="inline-flex size-11 shrink-0 items-center justify-center text-slate transition-colors hover:text-brand-red"
                >
                  <Trash2 aria-hidden className="size-4" strokeWidth={1.75} />
                  <span className="sr-only">Remove saved search: {search.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
