'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'
import { cn } from '@/lib/utils/cn'

interface FavoriteButtonProps {
  propertyId: string
  /** Used in the accessible name, e.g. the property title. */
  label: string
  variant?: 'overlay' | 'inline'
  className?: string
}

export function FavoriteButton({ propertyId, label, variant = 'overlay', className }: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(propertyId)

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remove ${label} from saved properties` : `Save ${label}`}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggle(propertyId)
      }}
      className={cn(
        'group/fav inline-flex items-center justify-center transition-colors duration-200',
        variant === 'overlay'
          ? 'size-11 bg-white/95 text-navy-deep shadow-sm hover:bg-white'
          : 'h-12 gap-2.5 border border-navy-deep/25 px-5 text-label text-navy-deep hover:border-navy-deep',
        className,
      )}
    >
      <Heart
        aria-hidden
        className={cn(
          'size-[1.125rem] transition-transform duration-300 ease-out-expo group-active/fav:scale-90',
          active ? 'fill-brand-red text-brand-red' : 'group-hover/fav:text-brand-red',
        )}
        strokeWidth={1.75}
      />
      {variant === 'inline' ? <span>{active ? 'Saved' : 'Save'}</span> : null}
    </button>
  )
}
