const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const number = new Intl.NumberFormat('en-US')

export function formatCurrency(amount: number): string {
  return usd.format(amount)
}

export function formatNumber(value: number): string {
  return number.format(value)
}

/** 1250000 → "$1.25M", 3500 → "$3,500". Used for compact map pins and chips. */
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000
    return `$${Number.isInteger(millions) ? millions : millions.toFixed(2).replace(/0$/, '')}M`
  }
  if (amount >= 10_000) return `$${Math.round(amount / 1000)}K`
  return usd.format(amount)
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural
}

/** "(786) 246-4160" → "+17862464160" */
export function toTelHref(display: string): string {
  const digits = display.replace(/\D/g, '')
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`
}
