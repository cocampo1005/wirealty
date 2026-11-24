'use client'

import { Search } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { intentLabel, propertyTypeLabels, typesForCategory } from '@/lib/properties/labels'
import type { ListingIntent, PropertyCategory, PropertySearchFilters, PropertyType } from '@/lib/properties/types'
import { cn } from '@/lib/utils/cn'
import {
  bathroomOptions,
  bedroomOptions,
  locationOptions,
  priceOptions,
  sqFtOptions,
  unitOptions,
} from './filter-options'

interface FilterFieldsProps {
  value: PropertySearchFilters
  onChange: (next: PropertySearchFilters) => void
  /** `bar` lays controls out inline (desktop); `stack` is the mobile sheet. */
  layout: 'bar' | 'stack'
}

const selectClass =
  'select-chevron block h-11 w-full border border-line bg-white pr-9 pl-3.5 text-[0.875rem] text-ink transition-colors hover:border-navy-deep/40 focus:border-brand-blue'

const labelClass = 'mb-1.5 block text-[0.6875rem] font-semibold tracking-[0.14em] text-slate uppercase'

/** Changing category or intent invalidates the filters that only apply to the old one. */
function withCategory(filters: PropertySearchFilters, category: PropertyCategory | undefined): PropertySearchFilters {
  const allowed = typesForCategory(category)
  return {
    ...filters,
    category,
    propertyTypes: filters.propertyTypes?.filter((type) => allowed.includes(type)),
    minBedrooms: category === 'commercial' ? undefined : filters.minBedrooms,
    minBathrooms: category === 'commercial' ? undefined : filters.minBathrooms,
    minUnits: category === 'residential' ? undefined : filters.minUnits,
    page: undefined,
  }
}

function withIntent(filters: PropertySearchFilters, intent: ListingIntent | undefined): PropertySearchFilters {
  // Sale prices and monthly rents are different scales, so reset the range.
  return { ...filters, intent, minPrice: undefined, maxPrice: undefined, page: undefined }
}

const toNumber = (value: string): number | undefined => (value ? Number(value) : undefined)

export function FilterFields({ value, onChange, layout }: FilterFieldsProps) {
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`
  const bar = layout === 'bar'
  const set = (patch: Partial<PropertySearchFilters>) => onChange({ ...value, ...patch, page: undefined })

  const types = typesForCategory(value.category)
  const prices = priceOptions(value.intent)
  const showResidential = value.category !== 'commercial'
  const showCommercial = value.category !== 'residential'

  return (
    <div className={cn(bar ? 'space-y-4' : 'space-y-7')}>
      <div className={cn(bar ? 'flex flex-wrap items-end gap-x-4 gap-y-4' : 'space-y-7')}>
        <Segmented
          legend="Category"
          name={id('category')}
          value={value.category ?? ''}
          options={[
            { value: '', label: 'All' },
            { value: 'commercial', label: 'Commercial' },
            { value: 'residential', label: 'Residential' },
          ]}
          onChange={(next) => onChange(withCategory(value, (next || undefined) as PropertyCategory | undefined))}
          stretch={!bar}
        />

        <Segmented
          legend="Offered"
          name={id('intent')}
          value={value.intent ?? ''}
          options={[
            { value: '', label: 'Any' },
            { value: 'sale', label: intentLabel('sale', value.category) },
            { value: 'lease', label: value.category ? intentLabel('lease', value.category) : 'Lease / Rent' },
          ]}
          onChange={(next) => onChange(withIntent(value, (next || undefined) as ListingIntent | undefined))}
          stretch={!bar}
        />

        <KeywordField
          key={value.query ?? ''}
          id={id('q')}
          initial={value.query ?? ''}
          onSubmit={(query) => set({ query: query || undefined })}
          className={bar ? 'min-w-56 flex-1' : undefined}
        />
      </div>

      <div className={cn(bar ? 'grid grid-cols-[repeat(auto-fit,minmax(8.5rem,1fr))] gap-x-4 gap-y-4' : 'grid grid-cols-2 gap-x-4 gap-y-6')}>
        <div className={cn(!bar && 'col-span-2')}>
          <label htmlFor={id('location')} className={labelClass}>
            Location
          </label>
          <select
            id={id('location')}
            className={selectClass}
            value={value.location ?? ''}
            onChange={(event) => set({ location: event.target.value || undefined })}
          >
            <option value="">All South Florida</option>
            <optgroup label="Counties">
              {locationOptions
                .filter((option) => option.kind === 'county')
                .map((option) => (
                  <option key={option.slug} value={option.slug}>
                    {option.label}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Cities">
              {locationOptions
                .filter((option) => option.kind === 'city')
                .map((option) => (
                  <option key={option.slug} value={option.slug}>
                    {option.label}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>

        <div className={cn(!bar && 'col-span-2')}>
          <label htmlFor={id('type')} className={labelClass}>
            Property type
          </label>
          <select
            id={id('type')}
            className={selectClass}
            value={value.propertyTypes?.[0] ?? ''}
            onChange={(event) =>
              set({ propertyTypes: event.target.value ? [event.target.value as PropertyType] : undefined })
            }
          >
            <option value="">Any type</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {propertyTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={id('minPrice')} className={labelClass}>
            Min price
          </label>
          <select
            id={id('minPrice')}
            className={selectClass}
            value={value.minPrice ?? ''}
            onChange={(event) => set({ minPrice: toNumber(event.target.value) })}
          >
            <option value="">No min</option>
            {prices.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={id('maxPrice')} className={labelClass}>
            Max price
          </label>
          <select
            id={id('maxPrice')}
            className={selectClass}
            value={value.maxPrice ?? ''}
            onChange={(event) => set({ maxPrice: toNumber(event.target.value) })}
          >
            <option value="">No max</option>
            {prices.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {showResidential ? (
          <>
            <div>
              <label htmlFor={id('beds')} className={labelClass}>
                Bedrooms
              </label>
              <select
                id={id('beds')}
                className={selectClass}
                value={value.minBedrooms ?? ''}
                onChange={(event) => set({ minBedrooms: toNumber(event.target.value) })}
              >
                <option value="">Any</option>
                {bedroomOptions.map((count) => (
                  <option key={count} value={count}>
                    {count}+
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={id('baths')} className={labelClass}>
                Bathrooms
              </label>
              <select
                id={id('baths')}
                className={selectClass}
                value={value.minBathrooms ?? ''}
                onChange={(event) => set({ minBathrooms: toNumber(event.target.value) })}
              >
                <option value="">Any</option>
                {bathroomOptions.map((count) => (
                  <option key={count} value={count}>
                    {count}+
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : null}

        <div>
          <label htmlFor={id('sqft')} className={labelClass}>
            {value.category === 'commercial' ? 'Building size' : 'Min sq ft'}
          </label>
          <select
            id={id('sqft')}
            className={selectClass}
            value={value.minSqFt ?? ''}
            onChange={(event) => set({ minSqFt: toNumber(event.target.value) })}
          >
            <option value="">Any size</option>
            {sqFtOptions.map((size) => (
              <option key={size} value={size}>
                {size.toLocaleString('en-US')}+ sq ft
              </option>
            ))}
          </select>
        </div>

        {showCommercial ? (
          <div>
            <label htmlFor={id('units')} className={labelClass}>
              Units <span className="tracking-normal normal-case">(multifamily)</span>
            </label>
            <select
              id={id('units')}
              className={selectClass}
              value={value.minUnits ?? ''}
              onChange={(event) => set({ minUnits: toNumber(event.target.value) })}
            >
              <option value="">Any</option>
              {unitOptions.map((count) => (
                <option key={count} value={count}>
                  {count}+ units
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

interface SegmentedProps {
  legend: string
  name: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  stretch?: boolean
}

function Segmented({ legend, name, value, options, onChange, stretch }: SegmentedProps) {
  return (
    <fieldset className={cn(stretch && 'w-full')}>
      <legend className={labelClass}>{legend}</legend>
      <div className={cn('border border-line bg-white', stretch ? 'grid' : 'inline-flex')} style={stretch ? { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` } : undefined}>
        {options.map((option, i) => {
          const checked = option.value === value
          return (
            <label key={option.value || 'any'} className={cn('relative block', i > 0 && 'border-l border-line')}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'flex h-[2.625rem] cursor-pointer items-center justify-center px-4 text-[0.75rem] font-semibold tracking-[0.06em] whitespace-nowrap transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-blue',
                  checked ? 'bg-navy-deep text-white' : 'text-ink hover:bg-mist',
                )}
              >
                {option.label}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

interface KeywordFieldProps {
  id: string
  initial: string
  onSubmit: (query: string) => void
  className?: string
}

/** Free-text search. Applies on Enter or when the field loses focus. */
function KeywordField({ id, initial, onSubmit, className }: KeywordFieldProps) {
  const [text, setText] = useState(initial)
  const commit = () => {
    const next = text.trim()
    if (next !== initial) onSubmit(next)
  }
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    commit()
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={className}>
      <label htmlFor={id} className={labelClass}>
        Keyword
      </label>
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate" strokeWidth={1.75} />
        <input
          id={id}
          type="search"
          enterKeyHint="search"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onBlur={commit}
          placeholder="Address, city or ZIP"
          maxLength={80}
          className="block h-11 w-full border border-line bg-white pr-3.5 pl-10 text-[0.875rem] text-ink placeholder:text-slate/70 hover:border-navy-deep/40 focus:border-brand-blue"
        />
      </div>
    </form>
  )
}
