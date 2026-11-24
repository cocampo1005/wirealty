import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { business, primaryPhone } from '@/content/business'
import { images, type SiteImage } from '@/content/images'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/ui/reveal'

interface ClosingCtaProps {
  eyebrow?: string
  title?: ReactNode
  children?: ReactNode
  cta?: { label: string; href: string }
  image?: SiteImage
}

/** Photographic call to action that closes most pages. */
export function ClosingCta({
  eyebrow = 'Start a Conversation',
  title = (
    <>
      Let’s Discuss Your Next Opportunity<span className="text-brand-red">.</span>
    </>
  ),
  children = 'Whether you’re acquiring an investment property, exploring commercial real estate, or seeking reliable management, we’re here to help.',
  cta = { label: 'Contact Weston International Realty', href: '/contact' },
  image = images.ctaArchitecture,
}: ClosingCtaProps) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-deep text-white">
      <Image src={image.src} alt="" fill sizes="100vw" quality={70} className="-z-20 object-cover" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgb(11_32_68/0.96)_0%,rgb(11_32_68/0.86)_45%,rgb(11_32_68/0.55)_100%)]"
      />

      <div className="container-wi section-y">
        <Reveal className="max-w-3xl">
          <Eyebrow tone="light">{eyebrow}</Eyebrow>
          <h2 className="mt-7 text-display-lg text-white">{title}</h2>
          <p className="mt-6 max-w-xl text-lead text-white/80">{children}</p>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            <Button href={cta.href} size="lg" arrow>
              {cta.label}
            </Button>
          </div>

          <ul className="mt-12 flex flex-col gap-x-10 gap-y-2 border-t border-white/15 pt-7 text-[0.9375rem] sm:flex-row">
            <li>
              <a
                href={`tel:${primaryPhone.e164}`}
                className="inline-flex min-h-11 items-center gap-3 text-white/85 transition-colors hover:text-white"
              >
                <Phone aria-hidden className="size-4 text-sky" strokeWidth={1.5} />
                {primaryPhone.display}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${business.email}`}
                className="inline-flex min-h-11 items-center gap-3 text-white/85 transition-colors hover:text-white"
              >
                <Mail aria-hidden className="size-4 text-sky" strokeWidth={1.5} />
                {business.email}
              </a>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
