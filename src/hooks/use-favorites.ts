'use client'

import { useCallback } from 'react'
import { createLocalStore, useLocalStore } from './use-local-store'

/**
 * Favorites and saved searches are stored in this browser only
 * (localStorage). There are no accounts and nothing is sent to a server.
 */

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const EMPTY: string[] = []
const favoritesStore = createLocalStore<string[]>('wi:favorites:v1', EMPTY, isStringArray)

export function useFavorites() {
  const ids = useLocalStore(favoritesStore)

  const toggle = useCallback((id: string) => {
    const current = favoritesStore.get()
    favoritesStore.set(current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }, [])

  const remove = useCallback((id: string) => {
    favoritesStore.set(favoritesStore.get().filter((item) => item !== id))
  }, [])

  return { ids, toggle, remove, isFavorite: (id: string) => ids.includes(id) }
}

export interface SavedSearch {
  id: string
  /** Query string without the leading "?". */
  query: string
  label: string
  savedAt: string
}

const isSavedSearchArray = (value: unknown): value is SavedSearch[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as SavedSearch).id === 'string' &&
      typeof (item as SavedSearch).query === 'string' &&
      typeof (item as SavedSearch).label === 'string',
  )

const EMPTY_SEARCHES: SavedSearch[] = []
const searchesStore = createLocalStore<SavedSearch[]>('wi:saved-searches:v1', EMPTY_SEARCHES, isSavedSearchArray)

export function useSavedSearches() {
  const searches = useLocalStore(searchesStore)

  const save = useCallback((query: string, label: string) => {
    const current = searchesStore.get()
    if (current.some((item) => item.query === query)) return
    searchesStore.set([
      { id: `${Date.now()}`, query, label, savedAt: new Date().toISOString() },
      ...current,
    ].slice(0, 20))
  }, [])

  const remove = useCallback((id: string) => {
    searchesStore.set(searchesStore.get().filter((item) => item.id !== id))
  }, [])

  return { searches, save, remove, isSaved: (query: string) => searches.some((item) => item.query === query) }
}
