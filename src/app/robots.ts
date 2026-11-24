import type { MetadataRoute } from 'next'
import { siteUrl } from '@/content/business'
import { showSampleContent } from '@/lib/site-mode'

/**
 * Robots rules. When sample content is enabled (development, private
 * previews, staging) the whole site is blocked from indexing, so placeholder
 * listings and draft records can never reach a search engine.
 */
export default function robots(): MetadataRoute.Robots {
  if (showSampleContent) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
