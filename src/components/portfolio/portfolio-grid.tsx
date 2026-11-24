'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import type { PortfolioTransaction, PropertyCategory } from '@/lib/properties/types'
import { cn } from '@/lib/utils/cn'
import { PortfolioCard } from './portfolio-card'

type Filter = 'all' | PropertyCategory

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'residential', label: 'Residential' },
]

export function PortfolioGrid({ transactions }: { transactions: PortfolioTransaction[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const reduceMotion = useReducedMotion()
  const visible = filter === 'all' ? transactions : transactions.filter((t) => t.category === filter)
  const count = (value: Filter) =>
    value === 'all' ? transactions.length : transactions.filter((t) => t.category === value).length

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter transactions by category" className="flex flex-wrap gap-2">
          {filters.map((item) => {
            const active = item.value === filter
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item.value)}
                className={cn(
                  'inline-flex min-h-11 items-center gap-2.5 border px-5 text-[0.75rem] font-semibold tracking-[0.13em] uppercase transition-colors duration-200',
                  active
                    ? 'border-navy-deep bg-navy-deep text-white'
                    : 'border-line text-ink hover:border-navy-deep/50',
                )}
              >
                {item.label}
                <span className={cn('text-[0.6875rem] tracking-normal', active ? 'text-white/60' : 'text-slate')}>
                  {count(item.value)}
                </span>
              </button>
            )
          })}
        </div>
        <p aria-live="polite" className="text-sm text-slate">
          Showing {visible.length} {visible.length === 1 ? 'transaction' : 'transactions'}
        </p>
      </div>

      <ul className="mt-12 grid gap-x-10 gap-y-16 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((transaction, i) => (
            <motion.li
              key={transaction.slug}
              layout={!reduceMotion}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={cn(i % 2 === 1 && 'md:mt-20')}
            >
              <PortfolioCard transaction={transaction} aspect="aspect-[4/3]" sizes="(min-width: 768px) 46vw, 100vw" />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {visible.length === 0 ? (
        <p className="mt-4 border border-line bg-mist p-8 text-slate">
          No transactions in this category have been published yet.
        </p>
      ) : null}
    </div>
  )
}
