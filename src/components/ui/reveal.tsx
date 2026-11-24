'use client'

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** up: fade + rise · fade: opacity only · unveil: top-to-bottom wipe (images) */
  variant?: 'up' | 'fade' | 'unveil'
  /** Delay in milliseconds, for gentle staggering. */
  delay?: number
  as?: ElementType
  className?: string
}

/**
 * Reveals its children once when scrolled into view.
 * Styling lives in globals.css and is gated on `html.js`, so content is never
 * hidden when JavaScript is unavailable, and reduced-motion users see it at once.
 */
export function Reveal({ children, variant = 'up', delay = 0, as: Tag = 'div', className }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.setAttribute('data-revealed', '')
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.setAttribute('data-revealed', '')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      className={className}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
