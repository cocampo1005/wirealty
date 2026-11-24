'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense, type ComponentProps } from 'react'
import { cn } from '@/lib/utils/cn'

type NavLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string
  /** Classes applied when the link matches the current section. */
  activeClassName?: string
}

function isActive(pathname: string, href: string): boolean {
  const target = href.split('?')[0]
  if (target === '/') return pathname === '/'
  return pathname === target || pathname.startsWith(`${target}/`)
}

function ActiveNavLink({ href, className, activeClassName, ...props }: NavLinkProps) {
  const active = isActive(usePathname(), href)
  return (
    <Link
      {...props}
      href={href}
      aria-current={active ? 'page' : undefined}
      data-active={active || undefined}
      className={cn(className, active && activeClassName)}
    />
  )
}

/**
 * Link that marks itself as current. Reading the pathname suspends while the
 * static shell of a dynamic route is prerendered, so the plain link is used as
 * the fallback and the active state resolves on the client.
 */
export function NavLink({ activeClassName, ...props }: NavLinkProps) {
  return (
    <Suspense fallback={<Link {...props} />}>
      <ActiveNavLink {...props} activeClassName={activeClassName} />
    </Suspense>
  )
}
