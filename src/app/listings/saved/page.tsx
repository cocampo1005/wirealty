import { pageMetadata } from '@/lib/seo/metadata'
import { PageHero } from '@/components/layout/page-hero'
import { SavedView } from '@/components/listings/saved-view'
import { ArrowLink } from '@/components/ui/arrow-link'

export const metadata = pageMetadata({
  title: 'Saved Properties',
  description: 'Properties and searches you have saved on this device.',
  path: '/listings/saved',
  noindex: true,
})

export default function SavedListingsPage() {
  return (
    <>
      <PageHero eyebrow="Listings" title="Saved Properties & Searches" size="compact">
        <p>Kept in this browser only — no account required.</p>
        <p className="mt-5">
          <ArrowLink href="/listings" tone="light">
            Back to Property Search
          </ArrowLink>
        </p>
      </PageHero>

      <section className="bg-white section-y-sm">
        <div className="container-wi">
          <SavedView />
        </div>
      </section>
    </>
  )
}
