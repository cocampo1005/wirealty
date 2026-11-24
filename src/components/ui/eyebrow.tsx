import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface EyebrowProps {
  children: ReactNode
  tone?: 'dark' | 'light'
  /** Optional section index, rendered as "01". */
  index?: string
  className?: string
}

/** Small tracked label led by the brand's red rule. */
export function Eyebrow({ children, tone = 'dark', index, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-4 text-eyebrow',
        tone === 'dark' ? 'text-brand-blue' : 'text-sky',
        className,
      )}
    >
      <span aria-hidden className="rule-red shrink-0" />
      {index ? (
        <span aria-hidden className={tone === 'dark' ? 'text-slate' : 'text-white/60'}>
          {index}
        </span>
      ) : null}
      <span>{children}</span>
    </p>
  )
}
