import Link from 'next/link'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { business } from '@/content/business'
import { footerNav } from '@/content/navigation'
import { Logo } from '@/components/ui/logo'
import { CurrentYear } from './current-year'

export function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-navy-deep text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-blueprint opacity-50" />

      <div className="container-wi relative pt-20 pb-10 lg:pt-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Link href="/" aria-label="Weston International Realty — home" className="inline-block">
              <Logo tone="light" size="lg" />
            </Link>
            <p className="mt-8 max-w-md text-[0.9375rem] leading-relaxed text-white/70">
              {business.description}
            </p>
            <p className="mt-6 text-eyebrow text-sky">{business.licensing.statement}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 lg:col-span-4">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="text-eyebrow text-white/50">{group.title}</h2>
                <ul className="mt-5 space-y-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-9 items-center text-[0.9375rem] text-white/85 transition-colors duration-200 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="lg:col-span-3">
            <h2 className="text-eyebrow text-white/50">Contact</h2>
            <ul className="mt-5 space-y-1 text-[0.9375rem]">
              {business.phones.map((phone) => (
                <li key={phone.e164}>
                  <a
                    href={`tel:${phone.e164}`}
                    className="inline-flex min-h-9 items-center gap-3 text-white/85 transition-colors hover:text-white"
                  >
                    <Phone aria-hidden className="size-4 shrink-0 text-sky" strokeWidth={1.5} />
                    {phone.display}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${business.email}`}
                  className="inline-flex min-h-9 items-center gap-3 text-white/85 transition-colors hover:text-white"
                >
                  <Mail aria-hidden className="size-4 shrink-0 text-sky" strokeWidth={1.5} />
                  {business.email}
                </a>
              </li>
              <li className="flex min-h-9 items-center gap-3 text-white/85">
                <MapPin aria-hidden className="size-4 shrink-0 text-sky" strokeWidth={1.5} />
                {business.locationLabel}
              </li>
            </ul>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1">
              {business.social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-1 text-[0.75rem] font-semibold tracking-[0.12em] text-white/70 uppercase transition-colors hover:text-white"
                  >
                    {item.label}
                    <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={1.75} />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/15 pt-8 text-[0.8125rem] text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © <CurrentYear /> {business.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/privacy-policy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
