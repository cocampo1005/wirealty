import type { Metadata } from 'next'
import { primaryNav } from '@/content/navigation'
import { PageHero } from '@/components/layout/page-hero'
import { ArrowLink } from '@/components/ui/arrow-link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Error 404"
      title="This Page Could Not Be Found."
      className="flex min-h-[80svh] items-center"
      actions={
        <>
          <Button href="/" size="lg" arrow>
            Return Home
          </Button>
          <Button href="/contact" size="lg" variant="outline-light">
            Contact Us
          </Button>
        </>
      }
    >
      <p>
        The page may have moved, or the property may no longer be available. Try one of the sections below, or
        get in touch and we will point you in the right direction.
      </p>
      <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-1">
        {primaryNav.map((item) => (
          <li key={item.href}>
            <ArrowLink href={item.href} tone="light">
              {item.label}
            </ArrowLink>
          </li>
        ))}
      </ul>
    </PageHero>
  )
}
