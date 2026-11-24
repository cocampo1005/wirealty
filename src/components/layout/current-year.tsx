'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * Copyright year. Prerendered pages carry the build year (set in
 * next.config.ts) and the browser swaps in the current year after hydration,
 * so a long-lived deployment never shows a stale date.
 */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => String(new Date().getFullYear()),
    () => process.env.NEXT_PUBLIC_BUILD_YEAR ?? '',
  )
  return <span>{year}</span>
}
