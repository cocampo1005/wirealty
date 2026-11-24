import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { Eyebrow } from './eyebrow'

interface SectionHeadingProps {
  eyebrow?: string
  index?: string
  title: ReactNode
  children?: ReactNode
  tone?: 'dark' | 'light'
  as?: 'h1' | 'h2' | 'h3'
  size?: 'lg' | 'md'
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  children,
  tone = 'dark',
  as: Tag = 'h2',
  size = 'lg',
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? (
        <Eyebrow tone={tone} index={index} className={cn('mb-6', align === 'center' && 'justify-center')}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Tag
        className={cn(
          size === 'lg' ? 'text-display-lg' : 'text-display-md',
          tone === 'dark' ? 'text-navy-deep' : 'text-white',
        )}
      >
        {title}
      </Tag>
      {children ? (
        <div
          className={cn(
            'mt-6 max-w-2xl text-lead',
            tone === 'dark' ? 'text-slate' : 'text-white/75',
            align === 'center' && 'mx-auto',
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
