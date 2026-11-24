import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils/cn'

interface ArrowLinkProps extends ComponentProps<typeof Link> {
  tone?: 'dark' | 'light'
}

/** Understated text link: the hairline underline redraws in red and the arrow nudges. */
export function ArrowLink({ tone = 'dark', className, children, ...props }: ArrowLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        'group/link inline-flex min-h-11 items-center gap-3 text-label whitespace-nowrap transition-colors duration-300',
        tone === 'dark' ? 'text-navy-deep hover:text-brand-blue' : 'text-white hover:text-sky',
        className,
      )}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className={cn(
            'absolute inset-x-0 -bottom-1.5 h-px origin-right transition-transform duration-500 ease-out-expo group-hover/link:scale-x-0',
            tone === 'dark' ? 'bg-navy-deep/30' : 'bg-white/40',
          )}
        />
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-1.5 h-px origin-left scale-x-0 bg-brand-red transition-transform delay-100 duration-500 ease-out-expo group-hover/link:scale-x-100"
        />
      </span>
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-300 ease-out-expo group-hover/link:translate-x-1"
        strokeWidth={1.75}
      />
    </Link>
  )
}
