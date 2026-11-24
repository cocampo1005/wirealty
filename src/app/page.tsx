import type { Metadata } from 'next'
import { business } from '@/content/business'
import { pageMetadata } from '@/lib/seo/metadata'
import { BrokerIntro } from '@/components/home/broker-intro'
import { CommercialExpertise } from '@/components/home/commercial-expertise'
import { Credibility } from '@/components/home/credibility'
import { ExploreAreas } from '@/components/home/explore-areas'
import { FeaturedOpportunities } from '@/components/home/featured-opportunities'
import { Hero } from '@/components/home/hero'
import { ManagementPreview } from '@/components/home/management-preview'
import { PortfolioPreview } from '@/components/home/portfolio-preview'
import { ResidentialPreview } from '@/components/home/residential-preview'
import { Testimonials } from '@/components/home/testimonials'
import { ClosingCta } from '@/components/layout/closing-cta'

const brandTitle = `${business.name} | South Florida Commercial Real Estate & Property Management`

const shared = pageMetadata({
  title: 'South Florida Commercial Real Estate & Property Management',
  description:
    'Weston International Realty provides commercial real estate guidance, residential opportunities and property management across South Florida — with a focus on multifamily and income-producing property.',
  path: '/',
})

// The homepage leads with the brand name instead of using the "%s | Brand" template.
export const metadata: Metadata = {
  ...shared,
  title: { absolute: brandTitle },
  openGraph: { ...shared.openGraph, title: brandTitle },
  twitter: { ...shared.twitter, title: brandTitle },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Credibility />
      <FeaturedOpportunities index="01" />
      <PortfolioPreview index="02" />
      <CommercialExpertise index="03" />
      <ExploreAreas index="04" />
      <ManagementPreview index="05" />
      <ResidentialPreview index="06" />
      <BrokerIntro index="07" />
      <Testimonials index="08" />
      <ClosingCta />
    </>
  )
}
