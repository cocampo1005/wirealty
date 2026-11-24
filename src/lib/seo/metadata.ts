import type { Metadata } from 'next'
import { business, siteUrl } from '@/content/business'

interface PageMetadataInput {
  /** Page title without the brand suffix (the root layout appends it). */
  title: string
  description: string
  /** Route path beginning with "/". */
  path: string
  /** Absolute or root-relative image used for social sharing. */
  image?: string
  /** Exclude from search engines (sample listings, saved items, etc.). */
  noindex?: boolean
}

/** Branded fallback used whenever a page has no photograph of its own (1200×630). */
export const defaultSocialImage = '/og-default.jpg'

/** Per-page metadata with canonical URL and Open Graph / Twitter tags. */
export function pageMetadata({
  title,
  description,
  path,
  image = defaultSocialImage,
  noindex,
}: PageMetadataInput): Metadata {
  const url = path === '/' ? '/' : path.replace(/\/$/, '')
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${business.name}`,
      description,
      url,
      siteName: business.name,
      locale: 'en_US',
      type: 'website',
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${business.name}`,
      description,
      images: [image],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  }
}

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}
