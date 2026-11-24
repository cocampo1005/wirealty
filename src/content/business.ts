import { showSampleContent } from '@/lib/site-mode'

/**
 * Single source of truth for business facts.
 *
 * Provenance key used in comments throughout /content:
 *   [SITE]     taken verbatim from the current wirealty.us website
 *   [BRIEF]    supplied in the project brief
 *   [CONFIRM]  must be confirmed by the client before launch (see CONTENT_VERIFICATION.md)
 *   [DRAFT]    proposed marketing copy awaiting approval
 */

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wirealty.us').replace(/\/$/, '')

export interface PhoneNumber {
  display: string
  /** E.164 number used in tel: links. */
  e164: string
  primary?: boolean
}

export interface Credential {
  id: string
  label: string
  /** Shown beneath the label, e.g. a license number once confirmed. */
  detail?: string
  /** Unverified credentials are never rendered on the public site. */
  verified: boolean
}

export const business = {
  name: 'Weston International Realty', // [SITE]
  shortName: 'Weston International',
  tagline: 'Commercial real estate, residential opportunities and property management across South Florida.', // [DRAFT]
  description:
    'Weston International Realty is a South Florida-based real estate firm specializing in commercial and residential real estate, as well as full-service property management.', // [SITE]

  /** Licensing line used in the footer and anywhere the brokerage is advertised. */
  licensing: {
    statement: 'Licensed Real Estate Broker · Florida', // [SITE]
    brokerLicenseNumber: null as string | null, // [CONFIRM] against Florida DBPR
    brokerageLicenseNumber: null as string | null, // [CONFIRM] against Florida DBPR
  },

  broker: {
    name: 'German Ocampo', // [SITE]
    title: 'Principal Broker', // [BRIEF] — confirm exact licensed title [CONFIRM]
    /** Path under /public, or null until an approved portrait is supplied. */
    portrait: null as string | null, // [CONFIRM]
  },

  phones: [
    { display: '(786) 246-4160', e164: '+17862464160', primary: true }, // [SITE]
    { display: '(305) 907-9543', e164: '+13059079543' }, // [SITE]
  ] satisfies PhoneNumber[],

  email: 'gocampo@wirealty.us', // [SITE]

  /** No street address is published on the current site. [CONFIRM] whether one should be. */
  address: null as null | { line1: string; city: string; state: string; postalCode: string },
  locationLabel: 'South Florida', // [SITE]
  serviceArea: ['Miami-Dade County', 'Broward County', 'Palm Beach County'], // [BRIEF] [CONFIRM]

  social: [
    { label: 'Facebook', href: 'https://www.facebook.com/wirealty/' }, // [SITE]
    { label: 'Instagram', href: 'https://www.instagram.com/wirealty_' }, // [SITE]
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/weston-international-realty/' }, // [SITE]
  ],

  /**
   * Years of experience. The current site says "30+ Years" in one place and
   * "over 25 years" in another, so the figure is held here and treated as
   * unconfirmed: the public site falls back to non-numeric wording until
   * `confirmed` is set to true. [CONFIRM]
   */
  experience: {
    years: 30,
    confirmed: false,
  },

  /**
   * Professional credentials. Nothing here is rendered publicly unless
   * `verified` is true. Add association memberships, designations and license
   * numbers only once confirmed against an authoritative source. [CONFIRM]
   */
  credentials: [
    {
      id: 'florida-broker',
      label: 'Licensed Florida Real Estate Broker',
      verified: true, // [SITE] statement is published today; license number still to be added
    },
    {
      id: 'realtor-association',
      label: 'REALTOR® association membership',
      detail: 'Local board to be confirmed',
      verified: false,
    },
  ] satisfies Credential[],
} as const

export const primaryPhone: PhoneNumber = business.phones[0]

/** True when the numeric experience figure may be shown in the current mode. */
export const showExperienceFigure: boolean = business.experience.confirmed || showSampleContent

/** "30+" when the figure may be shown, otherwise null. */
export const experienceFigure: string | null = showExperienceFigure
  ? `${business.experience.years}+`
  : null

/** Sentence-ready phrase: "more than 30 years" or "decades". */
export const experiencePhrase: string = showExperienceFigure
  ? `more than ${business.experience.years} years`
  : 'decades'

export const verifiedCredentials: Credential[] = business.credentials.filter((c) => c.verified)
