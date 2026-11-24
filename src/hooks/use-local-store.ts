'use client'

import { useSyncExternalStore } from 'react'

/**
 * Tiny localStorage-backed store.
 *
 * Built on useSyncExternalStore so server-rendered HTML always uses the
 * fallback value and the stored value is applied after hydration — no
 * hydration mismatches. Changes sync across tabs via the `storage` event.
 */
export interface LocalStore<T> {
  get(): T
  set(next: T): void
  subscribe(listener: () => void): () => void
  /** Stable server snapshot. */
  getServerSnapshot(): T
}

export function createLocalStore<T>(key: string, fallback: T, isValid: (value: unknown) => value is T): LocalStore<T> {
  const listeners = new Set<() => void>()
  let cachedRaw: string | null | undefined
  let cachedValue: T = fallback

  const read = (): T => {
    let raw: string | null = null
    try {
      raw = window.localStorage.getItem(key)
    } catch {
      return cachedValue // storage unavailable (private mode, blocked) — keep in-memory value
    }
    if (raw === cachedRaw) return cachedValue
    cachedRaw = raw
    try {
      const parsed: unknown = raw === null ? fallback : JSON.parse(raw)
      cachedValue = isValid(parsed) ? parsed : fallback
    } catch {
      cachedValue = fallback
    }
    return cachedValue
  }

  return {
    get: read,
    getServerSnapshot: () => fallback,
    set(next) {
      const raw = JSON.stringify(next)
      cachedRaw = raw
      cachedValue = next
      try {
        window.localStorage.setItem(key, raw)
      } catch {
        // Ignore quota / availability errors; the in-memory value still updates.
      }
      listeners.forEach((listener) => listener())
    },
    subscribe(listener) {
      listeners.add(listener)
      const onStorage = (event: StorageEvent) => {
        if (event.key === key || event.key === null) listener()
      }
      window.addEventListener('storage', onStorage)
      return () => {
        listeners.delete(listener)
        window.removeEventListener('storage', onStorage)
      }
    },
  }
}

export function useLocalStore<T>(store: LocalStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.getServerSnapshot)
}

/** False during server render and hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  )
}

const subscribeNoop = () => () => {}
