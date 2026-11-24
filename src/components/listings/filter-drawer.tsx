'use client'

import { X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { useModal } from '@/hooks/use-modal'
import type { PropertySearchFilters } from '@/lib/properties/types'
import { Button } from '@/components/ui/button'
import { FilterFields } from './filter-fields'

interface FilterDrawerProps {
  open: boolean
  filters: PropertySearchFilters
  onApply: (filters: PropertySearchFilters) => void
  onClose: () => void
}

/**
 * Mobile filter sheet. Edits a draft copy of the filters and only applies
 * them when the visitor chooses "Show results", so the list behind it does
 * not reload on every tap.
 */
export function FilterDrawer({ open, filters, onApply, onClose }: FilterDrawerProps) {
  return <AnimatePresence>{open ? <Sheet filters={filters} onApply={onApply} onClose={onClose} /> : null}</AnimatePresence>
}

function Sheet({ filters, onApply, onClose }: Omit<FilterDrawerProps, 'open'>) {
  const [draft, setDraft] = useState(filters)
  const reduceMotion = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useModal(true, onClose, panelRef, closeRef)

  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-navy-deep/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-sheet-title"
        className="on-light absolute inset-x-0 bottom-0 flex max-h-[92svh] flex-col bg-white shadow-panel"
        initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
        animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
        transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-3">
          <h2 id="filter-sheet-title" className="text-label text-navy-deep">
            Filter Listings
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="-mr-2 inline-flex size-11 items-center justify-center text-navy-deep"
          >
            <span className="sr-only">Close filters</span>
            <X aria-hidden className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
          <FilterFields layout="stack" value={draft} onChange={setDraft} />
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setDraft({ sort: draft.sort })}
            className="min-h-12 px-3 text-label text-slate underline underline-offset-4"
          >
            Clear All
          </button>
          <Button
            variant="navy"
            className="flex-1"
            onClick={() => {
              onApply(draft)
              onClose()
            }}
          >
            Show Results
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
