import type { MetadataRoute } from 'next'
import { siteUrl } from '@/content/business'
import { areas } from '@/content/communities'
import { getPublishedPortfolio } from '@/content/portfolio'

/**
 * XML sitemap. Lists content pages only: sample listings, draft portfolio
 * records and device-specific pages (saved items) are never included.
 * Live MLS listing URLs can be added here once the integration exists.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }[] = [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/commercial', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/listings', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/property-management', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/portfolio', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/areas', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/privacy-policy', priority: 0.2, changeFrequency: 'yearly' },
  ]

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route.path === '/' ? '' : route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...areas.map((area) => ({
      url: `${siteUrl}/areas/${area.slug}`,
      changeFrequency: 'monthly' as const,
      priority: area.kind === 'county' ? 0.6 : 0.5,
    })),
    ...getPublishedPortfolio().map((transaction) => ({
      url: `${siteUrl}/portfolio/${transaction.slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ]
}
