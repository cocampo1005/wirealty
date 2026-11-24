import { Mail, Phone } from 'lucide-react'
import { business, primaryPhone } from '@/content/business'
import { Button } from '@/components/ui/button'

/** Skeleton shown while search results stream in. */
export function ListingsSkeleton() {
  return (
    <div role="status" aria-label="Loading listings">
      <div className="border-b border-line bg-mist">
        <div className="container-wi animate-pulse py-5 lg:py-7">
          <div className="h-12 bg-mist-deep lg:h-28" />
        </div>
      </div>
      <div className="container-wi animate-pulse pt-10 pb-28">
        <div className="h-5 w-40 bg-mist-deep" />
        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="aspect-[4/3] bg-mist-deep" />
              <div className="mt-5 h-3 w-1/3 bg-mist-deep" />
              <div className="mt-3 h-5 w-3/4 bg-mist-deep" />
              <div className="mt-3 h-4 w-1/2 bg-mist" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Shown on the public site until a listing source (MLS feed) is connected.
 * Deliberately honest: no placeholder inventory, just a direct path to the
 * brokerage.
 */
export function ListingsPending() {
  return (
    <section className="bg-white section-y-sm">
      <div className="container-wi">
        <div className="grid gap-10 border border-line bg-mist p-8 sm:p-12 lg:grid-cols-12 lg:items-center lg:p-16">
          <div className="lg:col-span-7">
            <p className="text-eyebrow text-brand-blue">Property Search</p>
            <h2 className="mt-5 text-display-md text-navy-deep">Our online property search is being connected.</h2>
            <p className="mt-5 max-w-xl text-slate">
              Live listings will appear here once the connection is complete. In the meantime, contact us for current commercial,
              investment and residential opportunities — tell us what you are looking for and we will send
              you matching properties directly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Button href="/contact?interest=commercial" arrow>
                Commercial & Investment
              </Button>
              <Button href="/contact?interest=residential" variant="navy" arrow>
                Residential
              </Button>
            </div>
          </div>
          <ul className="space-y-1 border-t border-navy-deep/10 pt-8 lg:col-span-4 lg:col-start-9 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <li>
              <a href={`tel:${primaryPhone.e164}`} className="inline-flex min-h-12 items-center gap-3 font-display text-xl font-semibold text-navy-deep hover:text-brand-blue">
                <Phone aria-hidden className="size-5 text-brand-red" strokeWidth={1.5} />
                {primaryPhone.display}
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="inline-flex min-h-12 items-center gap-3 font-semibold break-all text-navy-deep hover:text-brand-blue">
                <Mail aria-hidden className="size-5 shrink-0 text-brand-red" strokeWidth={1.5} />
                {business.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

/** No listings match the current filters. */
export function ListingsEmpty({ clearHref }: { clearHref: string }) {
  return (
    <div className="border border-line bg-mist p-8 text-center sm:p-14">
      <h2 className="text-display-sm text-navy-deep">No properties match these filters.</h2>
      <p className="mx-auto mt-3 max-w-lg text-slate">
        Try widening your search, or tell us what you are looking for and we will follow up with you
        directly.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
        <Button href={clearHref} variant="navy">
          Clear Filters
        </Button>
        <Button href="/contact" variant="outline" arrow>
          Tell Us Your Criteria
        </Button>
      </div>
    </div>
  )
}
