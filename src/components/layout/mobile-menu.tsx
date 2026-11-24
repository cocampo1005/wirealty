'use client'

import Link from 'next/link'
import { Mail, Phone, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { business, primaryPhone } from '@/content/business'
import { contactNav, primaryNav } from '@/content/navigation'
import { useModal } from '@/hooks/use-modal'
import { Logo } from '@/components/ui/logo'
import { NavLink } from './nav-link'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const reduceMotion = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useModal(open, onClose, panelRef, closeRef)

  const links = [{ label: 'Home', href: '/' }, ...primaryNav, contactNav]

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="on-dark fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-navy-deep text-white xl:hidden"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: reduceMotion ? 0.15 : 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-blueprint opacity-60" />

          <div className="container-wi relative flex h-[4.5rem] shrink-0 items-center justify-between">
            <Link href="/" onClick={onClose} aria-label="Weston International Realty — home">
              <Logo tone="light" size="sm" />
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="-mr-2 inline-flex size-11 items-center justify-center text-white"
            >
              <span className="sr-only">Close menu</span>
              <X aria-hidden className="size-6" strokeWidth={1.5} />
            </button>
          </div>

          <nav aria-label="Mobile" className="container-wi relative flex-1 pt-4 pb-8">
            <ul className="border-t border-white/15">
              {links.map((item, i) => (
                <motion.li
                  key={item.href}
                  className="border-b border-white/15"
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.12 + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink
                    href={item.href}
                    onClick={onClose}
                    className="group flex min-h-[3.75rem] items-baseline gap-5 py-4"
                    activeClassName="text-sky"
                  >
                    <span aria-hidden className="w-6 text-[0.6875rem] font-semibold tracking-[0.2em] text-white/45">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-[1.375rem] leading-tight font-medium sm:text-2xl">
                      {item.label}
                    </span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </nav>

          <motion.div
            className="container-wi relative shrink-0 pb-10"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex flex-col gap-1 text-sm">
              <a href={`tel:${primaryPhone.e164}`} className="inline-flex min-h-11 items-center gap-3 text-white/85">
                <Phone aria-hidden className="size-4 text-sky" strokeWidth={1.5} />
                {primaryPhone.display}
              </a>
              <a href={`mailto:${business.email}`} className="inline-flex min-h-11 items-center gap-3 text-white/85">
                <Mail aria-hidden className="size-4 text-sky" strokeWidth={1.5} />
                {business.email}
              </a>
            </div>
            <p className="mt-6 text-[0.6875rem] tracking-[0.18em] text-white/50 uppercase">
              {business.licensing.statement}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
