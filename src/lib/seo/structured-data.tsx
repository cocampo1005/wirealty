import { business, siteUrl } from '@/content/business'
import { absoluteUrl } from './metadata'

type JsonLd = Record<string, unknown>

/** Renders a JSON-LD block. `<` is escaped so content can never close the script tag. */
export function JsonLdScript({ data }: { data: JsonLd }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

/**
 * Organization-level structured data. Only facts held in content/business.ts
 * are emitted — no ratings, reviews, awards or unverified credentials.
 */
export function organizationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${siteUrl}/#organization`,
    name: business.name,
    url: siteUrl,
    logo: absoluteUrl('/logo/wirealty-logomark.svg'),
    description: business.description,
    email: business.email,
    telephone: business.phones.map((p) => p.e164),
    areaServed: business.serviceArea.map((name) => ({
      '@type': 'AdministrativeArea',
      name: `${name}, Florida`,
    })),
    ...(business.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: business.address.line1,
            addressLocality: business.address.city,
            addressRegion: business.address.state,
            postalCode: business.address.postalCode,
            addressCountry: 'US',
          },
        }
      : {}),
    sameAs: business.social.map((s) => s.href),
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function faqJsonLd(items: { question: string; answer: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}
