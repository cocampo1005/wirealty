'use client'

import Link from 'next/link'
import { ChevronDown, Menu } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { contactNav, primaryNav } from '@/content/navigation'
import { cn } from '@/lib/utils/cn'
import { Logo } from '@/components/ui/logo'
import { MobileMenu } from './mobile-menu'
import { NavLink } from './nav-link'

/**
 * Site header.
 * - Transparent over the dark hero band every page opens with.
 * - Turns solid white once the page scrolls.
 * - Slides away while reading down and returns as soon as the visitor scrolls up.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      setScrolled(y > 12)
      if (y < 480) setHidden(false)
      else if (y > lastY.current + 6) setHidden(true)
      else if (y < lastY.current - 6) setHidden(false)
      lastY.current = y
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    toggleRef.current?.focus()
  }, [])

  const solid = scrolled
  const tone = solid ? 'color' : 'light'

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-out-expo',
          solid ? 'bg-white/95 shadow-header backdrop-blur-md' : 'on-dark bg-transparent',
          hidden && !menuOpen ? '-translate-y-full focus-within:translate-y-0' : 'translate-y-0',
        )}
      >
        <div
          className={cn(
            'container-wi flex items-center justify-between gap-6 transition-[height] duration-500 ease-out-expo',
            solid ? 'h-[4.25rem] xl:h-[4.75rem]' : 'h-[4.5rem] xl:h-24',
          )}
        >
          <Link href="/" aria-label="Weston International Realty — home" className="shrink-0">
            <span className="block xl:hidden">
              <Logo tone={tone} size="sm" />
            </span>
            <span className="hidden xl:block">
              <Logo tone={tone} size="md" />
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => (
                <li key={item.href} className="group/nav relative">
                  <NavLink
                    href={item.href}
                    className={cn(
                      'relative flex h-11 items-center gap-1.5 px-3.5 text-[0.71875rem] font-semibold tracking-[0.13em] uppercase transition-colors duration-300',
                      'after:absolute after:inset-x-3.5 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-brand-red after:transition-transform after:duration-500 after:ease-out-expo hover:after:scale-x-100 data-active:after:scale-x-100',
                      solid ? 'text-ink hover:text-brand-blue' : 'text-white/90 hover:text-white',
                    )}
                    activeClassName={solid ? 'text-brand-blue' : 'text-white'}
                  >
                    {item.label}
                    {item.children ? (
                      <ChevronDown
                        aria-hidden
                        className="size-3.5 opacity-70 transition-transform duration-300 group-focus-within/nav:rotate-180 group-hover/nav:rotate-180"
                        strokeWidth={2}
                      />
                    ) : null}
                  </NavLink>

                  {item.children ? (
                    <div
                      className={cn(
                        'on-light invisible absolute top-full left-0 z-10 w-80 pt-3 opacity-0 transition-[opacity,transform,visibility] duration-300 ease-out-expo',
                        'translate-y-2 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100',
                      )}
                    >
                      <ul className="border border-line bg-white p-2 shadow-panel">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="group/item block border-l-2 border-transparent px-4 py-3 transition-colors duration-200 hover:border-brand-red hover:bg-mist"
                            >
                              <span className="block text-[0.8125rem] font-semibold text-navy-deep">
                                {child.label}
                              </span>
                              {child.description ? (
                                <span className="mt-0.5 block text-xs leading-snug text-slate">
                                  {child.description}
                                </span>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={contactNav.href}
              className={cn(
                'hidden h-11 items-center px-6 text-[0.71875rem] font-semibold tracking-[0.13em] uppercase transition-colors duration-300 sm:inline-flex',
                solid
                  ? 'bg-brand-red text-white hover:bg-brand-red-deep'
                  : 'border border-white/45 text-white hover:border-white hover:bg-white hover:text-navy-deep',
              )}
            >
              {contactNav.label}
            </Link>
            <button
              ref={toggleRef}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
              className={cn(
                '-mr-2 inline-flex size-11 items-center justify-center transition-colors xl:hidden',
                solid ? 'text-navy-deep' : 'text-white',
              )}
            >
              <span className="sr-only">Open menu</span>
              <Menu aria-hidden className="size-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  )
}
