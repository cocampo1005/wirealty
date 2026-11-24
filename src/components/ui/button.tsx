import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'navy' | 'outline' | 'outline-light' | 'white'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group/btn relative inline-flex items-center justify-center gap-3 text-center text-label transition-colors sm:whitespace-nowrap duration-300 select-none disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-red text-white hover:bg-brand-red-deep',
  navy: 'bg-navy-deep text-white hover:bg-brand-blue',
  outline:
    'border border-navy-deep/25 text-navy-deep hover:border-navy-deep hover:bg-navy-deep hover:text-white',
  'outline-light': 'border border-white/40 text-white hover:border-white hover:bg-white hover:text-navy-deep',
  white: 'bg-white text-navy-deep hover:bg-mist',
}

const sizes: Record<Size, string> = {
  sm: 'min-h-10 px-5 py-2',
  md: 'min-h-12 px-7 py-3',
  lg: 'min-h-14 px-8 py-4',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  /** Appends an arrow that nudges on hover. `external` uses a diagonal arrow. */
  arrow?: boolean | 'external'
  children: ReactNode
  className?: string
}

type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, 'className' | 'children'> & { href: string }
type ButtonAsButton = CommonProps &
  Omit<ComponentProps<'button'>, 'className' | 'children'> & { href?: undefined }

function Arrow({ kind }: { kind: true | 'external' }) {
  const Icon = kind === 'external' ? ArrowUpRight : ArrowRight
  return (
    <Icon
      aria-hidden
      className="size-4 shrink-0 transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-1"
      strokeWidth={1.75}
    />
  )
}

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = 'primary', size = 'md', arrow = false, children, className, ...rest } = props
  const classes = cn(base, variants[variant], sizes[size], className)
  const content = (
    <>
      <span>{children}</span>
      {arrow ? <Arrow kind={arrow} /> : null}
    </>
  )

  if (typeof rest.href === 'string') {
    return (
      <Link {...(rest as ComponentProps<typeof Link>)} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" {...(rest as ComponentProps<'button'>)} className={classes}>
      {content}
    </button>
  )
}
