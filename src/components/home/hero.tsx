'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { cities, counties } from '@/content/communities'
import { images, type SiteImage } from '@/content/images'
import { commercialTypes } from '@/content/services'
import { listingsHref } from '@/lib/properties/search-params'
import type { CommercialPropertyType, ListingIntent } from '@/lib/properties/types'
import { cn } from '@/lib/utils/cn'
import { ArrowLink } from '@/components/ui/arrow-link'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'

type ModeId = 'investment' | 'residential' | 'management'

interface Mode {
  id: ModeId
  label: string
  shortLabel: string
  caption: string
  image: SiteImage
  cta: { label: string; href: string }
}

const modes: Mode[] = [
  {
    id: 'investment',
    label: 'Investment Properties',
    shortLabel: 'Investment',
    caption: 'Multifamily & income-producing property',
    image: images.heroInvestment,
    cta: { label: 'Explore Investment Opportunities', href: listingsHref({ category: 'commercial' }) },
  },
  {
    id: 'residential',
    label: 'Residential',
    shortLabel: 'Residential',
    caption: 'Homes & condos across South Florida',
    image: images.heroResidential,
    cta: { label: 'Browse Homes & Condos', href: listingsHref({ category: 'residential' }) },
  },
  {
    id: 'management',
    label: 'Property Management',
    shortLabel: 'Management',
    caption: 'Ongoing care for owners & investors',
    image: images.heroManagement,
    cta: { label: 'Explore Property Management', href: '/property-management' },
  },
]

const EASE = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const [modeId, setModeId] = useState<ModeId>('investment')
  const reduceMotion = useReducedMotion()
  const mode = modes.find((m) => m.id === modeId) ?? modes[0]
  const modeIndex = modes.indexOf(mode)

  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-deep text-white">
      <div aria-hidden className="absolute inset-0 -z-20 bg-blueprint" />

      {/* Image stage — full-bleed backdrop on small screens, a tall architectural slab on desktop. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[36rem] animate-fade-in overflow-hidden lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[43vw] lg:animate-unveil"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={mode.id}
            className="absolute inset-0"
            initial={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0% 0% 0% 100%)' }}
            animate={reduceMotion ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={reduceMotion ? { opacity: 0 } : { scale: 1.05 }}
            transition={{ duration: reduceMotion ? 0.3 : 1.15, ease: EASE }}
          >
            <Image
              src={mode.image.src}
              alt=""
              fill
              preload={mode.id === 'investment'}
              sizes="(min-width: 1024px) 43vw, 100vw"
              quality={85}
              className="animate-drift object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {/* Navy treatment: keeps the photography restrained and the type legible. */}
        <div className="absolute inset-0 z-10 bg-navy-deep/20 mix-blend-multiply" />
        <div className="absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgb(11_32_68/0.55)_0%,rgb(11_32_68/0.15)_22%,rgb(11_32_68/0.7)_56%,rgb(11_32_68)_86%)] lg:bg-[linear-gradient(to_right,rgb(11_32_68)_0%,rgb(11_32_68/0.6)_18%,rgb(11_32_68/0)_52%),linear-gradient(to_bottom,rgb(11_32_68/0.5)_0%,rgb(11_32_68/0)_24%)]" />

        {/* Mode tracker on the slab (desktop). */}
        <div className="absolute right-8 bottom-10 z-20 hidden items-end gap-5 text-right lg:flex xl:right-12">
          <div>
            <p className="text-eyebrow text-white/70">
              {String(modeIndex + 1).padStart(2, '0')} <span className="text-white/40">/ 03</span>
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={mode.id}
                className="mt-2 max-w-48 text-[0.8125rem] leading-snug font-medium text-white"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {mode.caption}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex h-16 flex-col justify-between">
            {modes.map((m) => (
              <span
                key={m.id}
                className={cn(
                  'block w-px flex-1 transition-colors duration-500',
                  m.id === mode.id ? 'bg-brand-red' : 'bg-white/30',
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container-wi flex min-h-svh flex-col pt-48 lg:pt-0">
        <div className="flex flex-1 flex-col justify-center lg:max-w-[54%] lg:pt-28 lg:pb-10">
          <Eyebrow tone="light" className="animate-fade-up">
            South Florida Real Estate Brokerage
          </Eyebrow>

          <h1 className="mt-7 text-display-xl text-white lg:mt-8 lg:text-[clamp(2.75rem,min(5.4vw,7.6svh),5rem)]">
            {['Real Estate', 'Insight.', 'Investment', 'Confidence.'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span
                  className={cn('block animate-rise', i % 2 === 1 && 'lg:pl-[1.1em]')}
                  style={{ animationDelay: `${120 + i * 90}ms` }}
                >
                  {line.endsWith('.') ? (
                    <>
                      {line.slice(0, -1)}
                      <span className="text-brand-red">.</span>
                    </>
                  ) : (
                    line
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p className="mt-7 max-w-xl animate-fade-up text-lead text-white/80 [animation-delay:520ms] lg:mt-7">
            Strategic commercial real estate guidance, residential opportunities, and property management
            expertise across South Florida.
          </p>

          <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:640ms] sm:flex-row sm:flex-wrap sm:gap-4 lg:mt-9">
            <Button href={mode.cta.href} size="lg" arrow className="sm:min-w-[19.5rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mode.id}
                  className="inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mode.cta.label}
                </motion.span>
              </AnimatePresence>
            </Button>
            <Button href="/contact" size="lg" variant="outline-light">
              Discuss Your Goals
            </Button>
          </div>
        </div>

        <DiscoveryPanel modeId={modeId} onModeChange={setModeId} />
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Discovery panel                                                           */
/* -------------------------------------------------------------------------- */

interface DiscoveryPanelProps {
  modeId: ModeId
  onModeChange: (id: ModeId) => void
}

function DiscoveryPanel({ modeId, onModeChange }: DiscoveryPanelProps) {
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const reduceMotion = useReducedMotion()

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = modes.findIndex((m) => m.id === modeId)
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % modes.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + modes.length) % modes.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = modes.length - 1
    else return
    event.preventDefault()
    onModeChange(modes[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="on-light relative z-20 -mx-5 mt-12 animate-fade-up bg-white text-ink [animation-delay:760ms] sm:-mx-8 lg:mx-0 lg:mt-0 lg:w-[66%] lg:before:absolute lg:before:inset-y-0 lg:before:right-full lg:before:w-screen lg:before:bg-white xl:w-[62%]">
      <div
        role="tablist"
        aria-label="What are you looking for?"
        onKeyDown={onKeyDown}
        className="grid grid-cols-3 border-b border-line"
      >
        {modes.map((m, i) => {
          const selected = m.id === modeId
          return (
            <button
              key={m.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${m.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${m.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onModeChange(m.id)}
              className={cn(
                'relative flex min-h-14 items-center justify-center gap-3 px-2 py-4 text-center transition-colors duration-300 lg:justify-start lg:px-7 lg:py-5',
                i === 0 ? 'lg:pl-0' : 'border-l border-line',
                selected ? 'text-navy-deep' : 'text-slate hover:text-navy-deep',
              )}
            >
              {selected ? (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 bg-brand-red"
                  transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE }}
                />
              ) : null}
              <span aria-hidden className="hidden text-[0.6875rem] font-semibold tracking-[0.2em] text-slate/70 lg:inline">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[0.6875rem] leading-tight font-semibold tracking-[0.1em] uppercase sm:text-[0.75rem] sm:tracking-[0.13em]">
                <span className="sm:hidden">{m.shortLabel}</span>
                <span className="hidden sm:inline">{m.label}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="px-5 py-6 sm:px-8 lg:py-7 lg:pr-7 lg:pl-0">
        {modes.map((m) => (
          <div
            key={m.id}
            role="tabpanel"
            id={`${baseId}-panel-${m.id}`}
            aria-labelledby={`${baseId}-tab-${m.id}`}
            hidden={m.id !== modeId}
          >
            {m.id === modeId ? (
              <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {m.id === 'investment' ? <InvestmentPanel /> : null}
                {m.id === 'residential' ? <ResidentialPanel /> : null}
                {m.id === 'management' ? <ManagementPanel /> : null}
              </motion.div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

const chipClass =
  'inline-flex min-h-10 cursor-pointer items-center border px-4 text-[0.75rem] font-semibold tracking-[0.06em] transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-blue'

function InvestmentPanel() {
  const [type, setType] = useState<CommercialPropertyType | 'all'>('multifamily')
  const name = useId()
  const href = listingsHref({
    category: 'commercial',
    propertyTypes: type === 'all' ? undefined : [type],
  })

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
      <fieldset className="min-w-0">
        <legend className="text-[0.8125rem] font-medium text-slate">
          Explore curated opportunities by property type
        </legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {[{ slug: 'all' as const, name: 'All' }, ...commercialTypes.filter((t) => t.slug !== 'warehouse')].map((option) => {
            const checked = option.slug === type
            return (
              <label key={option.slug} className="relative">
                <input
                  type="radio"
                  name={name}
                  value={option.slug}
                  checked={checked}
                  onChange={() => setType(option.slug)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    chipClass,
                    checked
                      ? 'border-navy-deep bg-navy-deep text-white'
                      : 'border-line text-ink hover:border-navy-deep/50',
                  )}
                >
                  {option.name}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>
      <Button href={href} variant="navy" arrow className="shrink-0">
        View Opportunities
      </Button>
    </div>
  )
}

function ResidentialPanel() {
  const [intent, setIntent] = useState<ListingIntent>('sale')
  const [location, setLocation] = useState('')
  const name = useId()
  const selectId = useId()
  const href = listingsHref({ category: 'residential', intent, location: location || undefined })

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-6">
      <fieldset>
        <legend className="text-[0.8125rem] font-medium text-slate">I’m looking to</legend>
        <div className="mt-3 inline-flex border border-line">
          {(
            [
              { value: 'sale', label: 'Buy' },
              { value: 'lease', label: 'Rent' },
            ] as const
          ).map((option) => (
            <label key={option.value} className="relative">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={intent === option.value}
                onChange={() => setIntent(option.value)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'inline-flex min-h-12 min-w-20 cursor-pointer items-center justify-center px-5 text-[0.75rem] font-semibold tracking-[0.13em] uppercase transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-blue',
                  intent === option.value ? 'bg-navy-deep text-white' : 'text-ink hover:bg-mist',
                )}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="min-w-0 flex-1">
        <label htmlFor={selectId} className="text-[0.8125rem] font-medium text-slate">
          Location
        </label>
        <select
          id={selectId}
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="select-chevron mt-3 block h-12 w-full border border-line bg-white pr-10 pl-4 text-[0.9375rem] text-ink"
        >
          <option value="">All of South Florida</option>
          <optgroup label="Counties">
            {counties.map((county) => (
              <option key={county.slug} value={county.slug}>
                {county.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Cities">
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <Button href={href} variant="navy" arrow className="shrink-0">
        Search Homes
      </Button>
    </div>
  )
}

function ManagementPanel() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
      <p className="max-w-md text-[0.9375rem] leading-relaxed text-ink">
        For property owners and investors: tenant placement, rent collection, maintenance coordination and
        owner reporting, handled with personal attention.
      </p>
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <Button href="/property-management#consultation" variant="navy" arrow>
          Request a Consultation
        </Button>
        <ArrowLink href="/property-management">Learn More</ArrowLink>
      </div>
    </div>
  )
}
