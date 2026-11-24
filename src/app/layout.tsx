import type { Metadata, Viewport } from 'next'
import { Cinzel, Montserrat } from 'next/font/google'
import { business, siteUrl } from '@/content/business'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { defaultSocialImage } from '@/lib/seo/metadata'
import { JsonLdScript, organizationJsonLd } from '@/lib/seo/structured-data'
import './globals.css'

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  display: 'swap',
})

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.name} | South Florida Commercial Real Estate & Property Management`,
    template: `%s | ${business.name}`,
  },
  description: business.tagline,
  applicationName: business.name,
  openGraph: {
    siteName: business.name,
    locale: 'en_US',
    type: 'website',
    images: [{ url: defaultSocialImage, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [defaultSocialImage] },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#0b2044',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${montserrat.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Enables scroll-reveal styling only when JavaScript is available. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="sr-only z-[100] bg-white px-5 py-3 text-label text-navy-deep focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLdScript data={organizationJsonLd()} />
      </body>
    </html>
  )
}
