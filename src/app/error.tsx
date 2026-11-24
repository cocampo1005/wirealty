'use client'

import { useEffect } from 'react'
import { business, primaryPhone } from '@/content/business'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="on-dark relative isolate flex min-h-[80svh] items-center overflow-hidden bg-navy-deep pt-36 pb-20 text-white">
      <div aria-hidden className="absolute inset-0 -z-10 bg-blueprint" />
      <div className="container-wi">
        <div className="max-w-3xl">
          <Eyebrow tone="light">Something Went Wrong</Eyebrow>
          <h1 className="mt-7 text-display-lg text-white">We Could Not Load This Page.</h1>
          <p className="mt-6 max-w-xl text-lead text-white/80">
            An unexpected error occurred. Please try again. If the problem continues, you can reach us at{' '}
            <a href={`tel:${primaryPhone.e164}`} className="font-semibold text-white underline underline-offset-4">
              {primaryPhone.display}
            </a>{' '}
            or{' '}
            <a href={`mailto:${business.email}`} className="font-semibold text-white underline underline-offset-4">
              {business.email}
            </a>
            .
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" onClick={() => retry()}>
              Try Again
            </Button>
            <Button href="/" size="lg" variant="outline-light">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
