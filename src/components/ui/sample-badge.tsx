import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface SampleBadgeProps {
  children?: string
  className?: string
}

/**
 * Marks development-only / unapproved content. Anything carrying this badge is
 * hidden on the public site (see src/lib/site-mode.ts).
 */
export function SampleBadge({ children = 'Sample', className }: SampleBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center border border-dashed border-brand-red/60 bg-white/95 px-2 py-1 text-[0.625rem] leading-none font-semibold tracking-[0.16em] text-brand-red uppercase',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Full-width notice shown above sample listings, drafts and placeholders. */
export function SampleNotice({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      role="note"
      className={cn(
        'on-light border border-dashed border-brand-red/50 bg-[#fdf6f6] px-4 py-3 text-[0.8125rem] leading-relaxed text-ink',
        className,
      )}
    >
      <strong className="mr-2 text-[0.6875rem] font-semibold tracking-[0.16em] text-brand-red uppercase">
        Preview only
      </strong>
      {children}
    </p>
  )
}
