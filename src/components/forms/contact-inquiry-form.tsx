'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { inquiryInterests, type InquiryInterest } from '@/lib/validation/inquiry'
import { InquiryForm } from './inquiry-form'

function WithInterestFromUrl() {
  const param = useSearchParams().get('interest')
  const interest = inquiryInterests.find((value) => value === param) as InquiryInterest | undefined
  // Keyed so a link such as /contact?interest=commercial preselects the category.
  return <InquiryForm key={interest ?? 'none'} kind="contact" defaultInterest={interest} />
}

/**
 * Contact form that preselects its category from `?interest=`.
 * The query string is only known at request time, so the plain form is
 * prerendered as the fallback.
 */
export function ContactInquiryForm() {
  return (
    <Suspense fallback={<InquiryForm kind="contact" />}>
      <WithInterestFromUrl />
    </Suspense>
  )
}
