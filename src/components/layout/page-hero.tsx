import Image from 'next/image'
import type { ReactNode } from 'react'
import type { SiteImage } from '@/content/images'
import { cn } from '@/lib/utils/cn'
import { Eyebrow } from '@/components/ui/eyebrow'

interface PageHeroProps {
  eyebrow: string
  title: ReactNode
  children?: ReactNode
  /** Buttons / links rendered beneath the introduction. */
  actions?: ReactNode
  image?: SiteImage
  /** `tall` for the main service pages, `compact` for utility pages. */
  size?: 'tall' | 'compact'
  className?: string
}

/**
 * Dark hero band that opens every interior page. The transparent header sits
 * on top of it, so every route must start with this (or the home hero).
 */
export function PageHero({ eyebrow, title, children, actions, image, size = 'tall', className }: PageHeroProps) {
  return (
    <section
      className={cn(
        'on-dark relative isolate overflow-hidden bg-navy-deep text-white',
        size === 'tall' ? 'pt-40 pb-20 lg:pt-56 lg:pb-28' : 'pt-36 pb-14 lg:pt-44 lg:pb-16',
        className,
      )}
    >
      {image ? (
        <>
          <Image
            src={image.src}
            alt=""
            fill
            preload
            sizes="100vw"
            quality={70}
            className="-z-20 animate-fade-in object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(11_32_68/0.94)_0%,rgb(11_32_68/0.82)_42%,rgb(11_32_68/0.45)_100%)]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-navy-deep/80 to-transparent"
          />
        </>
      ) : (
        <div aria-hidden className="absolute inset-0 -z-10 bg-blueprint" />
      )}

      <div className="container-wi">
        <div className="max-w-4xl">
          <Eyebrow tone="light" className="animate-fade-up">
            {eyebrow}
          </Eyebrow>
          <h1
            className={cn(
              'mt-7 animate-fade-up text-white [animation-delay:90ms]',
              size === 'tall' ? 'text-display-xl' : 'text-display-lg',
            )}
          >
            {title}
          </h1>
          {children ? (
            <div className="mt-7 max-w-2xl animate-fade-up text-lead text-white/80 [animation-delay:180ms]">
              {children}
            </div>
          ) : null}
          {actions ? (
            <div className="mt-10 flex animate-fade-up flex-wrap gap-4 [animation-delay:270ms]">{actions}</div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
