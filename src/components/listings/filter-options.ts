import { cities, counties } from '@/content/communities'
import type { ListingIntent, PropertyLocationOption } from '@/lib/properties/types'
import { formatCurrencyCompact } from '@/lib/utils/format'

/** Locations offered in the search filters. */
export const locationOptions: PropertyLocationOption[] = [
  ...counties.map((county) => ({ slug: county.slug, label: county.name, kind: 'county' as const })),
  ...cities.map((city) => ({ slug: city.slug, label: city.name, kind: 'city' as const })),
]

export function locationLabel(slug: string | undefined): string | undefined {
  return slug ? locationOptions.find((option) => option.slug === slug)?.label : undefined
}

const salePrices = [100_000, 250_000, 500_000, 750_000, 1_000_000, 2_000_000, 3_000_000, 5_000_000, 10_000_000]
const monthlyRents = [1_000, 1_500, 2_000, 2_500, 3_000, 4_000, 5_000, 7_500, 10_000]

/** Price steps depend on whether the search is for purchases or rentals. */
export function priceOptions(intent: ListingIntent | undefined): { value: number; label: string }[] {
  const steps = intent === 'lease' ? monthlyRents : salePrices
  return steps.map((value) => ({
    value,
    label: intent === 'lease' ? `${formatCurrencyCompact(value)}/mo` : formatCurrencyCompact(value),
  }))
}

export const bedroomOptions = [1, 2, 3, 4, 5]
export const bathroomOptions = [1, 2, 3, 4]
export const sqFtOptions = [500, 1_000, 1_500, 2_000, 3_000, 5_000, 10_000, 20_000]
export const unitOptions = [2, 5, 10, 20, 50]
