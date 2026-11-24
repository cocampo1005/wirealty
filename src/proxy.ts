import { NextResponse, type NextRequest } from 'next/server'
import { getArea } from '@/content/communities'
import { getPortfolioTransaction } from '@/content/portfolio'
import { getPropertyRepository } from '@/lib/properties/repository'

/**
 * Returns a real HTTP 404 for detail URLs that do not exist.
 *
 * Detail pages stream their content, and a streamed response has already
 * started with a 200 status by the time the page discovers the record is
 * missing. Checking the slug here — before rendering — keeps status codes
 * accurate for search engines and analytics.
 *
 * Area and portfolio slugs are static lists, so the check is instant. For
 * listings the check only runs against in-memory sources; once an MLS feed is
 * connected, unknown listing URLs fall back to the page's own not-found
 * handling (a 200 response carrying a `noindex` tag) unless a fast existence
 * lookup is added here.
 */
export async function proxy(request: NextRequest) {
  const [, section, slug, ...rest] = request.nextUrl.pathname.split('/')
  if (!slug || rest.length > 0) return NextResponse.next()

  let exists = true
  if (section === 'areas') {
    exists = Boolean(getArea(slug))
  } else if (section === 'portfolio') {
    exists = Boolean(getPortfolioTransaction(slug))
  } else if (section === 'listings' && slug !== 'saved') {
    const repository = getPropertyRepository()
    if (repository.source !== 'mls') exists = Boolean(await repository.getBySlug(slug))
  }

  if (exists) return NextResponse.next()

  // Rewriting to a path no route matches renders the standard not-found page with a 404 status.
  return NextResponse.rewrite(new URL('/_not-found-proxy', request.url))
}

export const config = {
  matcher: ['/areas/:slug', '/portfolio/:slug', '/listings/:slug'],
}
