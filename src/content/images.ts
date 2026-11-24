import type { PropertyImage } from '@/lib/properties/types'

/**
 * Site photography registry.
 *
 * Every image below is currently a licensed PLACEHOLDER (Unsplash License —
 * credits in public/images/placeholder/credits.json). None of them depicts a
 * Weston International Realty listing or transaction. Replace them with
 * approved brokerage photography before launch: add the new file under
 * /public/images, then update the matching entry here (src, alt, width, height).
 */
export type SiteImage = PropertyImage

const dir = '/images/placeholder'

export const images = {
  heroInvestment: {
    src: `${dir}/hero-investment.jpg`,
    alt: 'Low-angle view of a white modern apartment building with stacked, cantilevered balconies against a deep blue sky.',
    width: 2000,
    height: 2500,
  },
  heroResidential: {
    src: `${dir}/hero-residential.jpg`,
    alt: 'White stucco Mediterranean-style house with green-trimmed windows, palm trees and a landscaped front garden.',
    width: 2000,
    height: 2500,
  },
  heroManagement: {
    src: `${dir}/hero-management.jpg`,
    alt: 'Low-rise mid-century apartment building with glass-walled balconies behind a lawn, fountain, hedges and palm trees.',
    width: 2000,
    height: 2500,
  },
  commercialHero: {
    src: `${dir}/commercial-hero.jpg`,
    alt: 'Curved blue glass curtain-wall facade of a modern office building against a pale blue sky.',
    width: 2000,
    height: 1333,
  },
  typeMultifamily: {
    src: `${dir}/type-multifamily.jpg`,
    alt: 'Low-angle view of a contemporary black-and-white apartment building with large windows under a light blue sky.',
    width: 1600,
    height: 1067,
  },
  typeRetail: {
    src: `${dir}/type-retail.jpg`,
    alt: 'Curved white modern retail building on a palm-lined street corner.',
    width: 1600,
    height: 1070,
  },
  typeIndustrial: {
    src: `${dir}/type-industrial.jpg`,
    alt: 'Row of four truck loading dock doors on a cream-colored industrial building.',
    width: 1600,
    height: 1066,
  },
  typeWarehouse: {
    src: `${dir}/type-warehouse.jpg`,
    alt: 'Bright, empty warehouse interior with a polished concrete floor, steel roof structure and yellow-banded columns.',
    width: 1600,
    height: 1067,
  },
  typeOffice: {
    src: `${dir}/type-office.jpg`,
    alt: 'Corner of a white modern office building with tall narrow windows against a clear blue sky.',
    width: 1600,
    height: 1067,
  },
  typeMixedUse: {
    src: `${dir}/type-mixed-use.jpg`,
    alt: 'Five-story brick apartment building with balconies above street-level shops on an urban street, with a cyclist passing.',
    width: 1600,
    height: 2400,
  },
  managementHero: {
    src: `${dir}/management-hero.jpg`,
    alt: 'Low-rise condominium buildings with balconies overlooking a landscaped courtyard and swimming pool on a sunny day.',
    width: 2000,
    height: 1333,
  },
  managementDetail: {
    src: `${dir}/management-detail.jpg`,
    alt: 'Bright, clean residential building corridor with elevators, white walls and pendant lights visible through interior glazing.',
    width: 1600,
    height: 1067,
  },
  managementInterior: {
    src: `${dir}/management-interior.jpg`,
    alt: 'Empty, bright apartment living room with white walls, wood-look flooring and a sliding glass balcony door.',
    width: 1600,
    height: 1067,
  },
  residentialExterior: {
    src: `${dir}/residential-exterior.jpg`,
    alt: 'Large white shingle-style coastal house with a balcony, manicured lawn, hedges and palm trees.',
    width: 1600,
    height: 1067,
  },
  residentialInterior: {
    src: `${dir}/residential-interior.jpg`,
    alt: 'Bright modern living room with a white sofa, armchairs, a glass coffee table and a large landscape painting.',
    width: 1600,
    height: 1067,
  },
  residentialCondo: {
    src: `${dir}/residential-condo.jpg`,
    alt: 'High-rise condominium tower with rows of balconies overlooking the turquoise Atlantic Ocean.',
    width: 1600,
    height: 1200,
  },
  areaMiamiDade: {
    src: `${dir}/area-miami-dade.jpg`,
    alt: 'Aerial view of the Brickell and Downtown Miami skyline along Biscayne Bay.',
    width: 1600,
    height: 1075,
  },
  areaBroward: {
    src: `${dir}/area-broward.jpg`,
    alt: 'Aerial view of the downtown Fort Lauderdale skyline rising above a canal lined with boats, homes and palm trees.',
    width: 1600,
    height: 1069,
  },
  areaPalmBeach: {
    src: `${dir}/area-palm-beach.jpg`,
    alt: 'West Palm Beach waterfront buildings at dusk with a sailboat and lights reflecting on the water.',
    width: 1600,
    height: 1143,
  },
  areaMiami: {
    src: `${dir}/area-miami.jpg`,
    alt: 'Miami skyline towers rising behind palm trees and a waterfront home, seen from Star Island in Miami Beach.',
    width: 1600,
    height: 1067,
  },
  areaFortLauderdale: {
    src: `${dir}/area-fort-lauderdale.jpg`,
    alt: 'Top-down aerial view of the winding Tarpon River and waterfront homes in Fort Lauderdale, Florida.',
    width: 1600,
    height: 1199,
  },
  areaHollywood: {
    src: `${dir}/area-hollywood.jpg`,
    alt: 'Elevated view of Hollywood Beach, Florida, with palm trees, a lifeguard stand, beachgoers and the ocean.',
    width: 1600,
    height: 1067,
  },
  areaSuburban: {
    src: `${dir}/area-suburban.jpg`,
    alt: 'Top-down aerial view of Florida homes with pools and private docks surrounding a small lake.',
    width: 1600,
    height: 1199,
  },
  areaAerial: {
    src: `${dir}/area-aerial.jpg`,
    alt: 'Aerial view of the Miami Beach coastline with high-rise buildings, white sand and turquoise water.',
    width: 1600,
    height: 1067,
  },
  aboutArchitecture: {
    src: `${dir}/about-architecture.jpg`,
    alt: 'Abstract view of curved white tiled architecture with a column against a pale sky.',
    width: 1600,
    height: 1067,
  },
  aboutOffice: {
    src: `${dir}/about-office.jpg`,
    alt: 'Empty modern office meeting area with a wooden table, pink chairs and floor-to-ceiling windows.',
    width: 1600,
    height: 1068,
  },
  ctaArchitecture: {
    src: `${dir}/cta-architecture.jpg`,
    alt: 'Brickell, Miami high-rise towers at dusk under a purple sky, reflected in calm water.',
    width: 2000,
    height: 1323,
  },
  sampleMultifamily1: {
    src: `${dir}/sample-multifamily-1.jpg`,
    alt: 'Modern low-rise apartment building with glass balconies, white siding and a brick base.',
    width: 1600,
    height: 1067,
  },
  sampleMultifamily2: {
    src: `${dir}/sample-multifamily-2.jpg`,
    alt: 'Mid-rise beige apartment building with wide balconies behind palm trees and a parked car.',
    width: 1600,
    height: 1415,
  },
  sampleMultifamily3: {
    src: `${dir}/sample-multifamily-3.jpg`,
    alt: 'Two-story garden-style apartment building with white railings, blue doors, hedges and small palm trees.',
    width: 1600,
    height: 1067,
  },
  sampleRetail1: {
    src: `${dir}/sample-retail-1.jpg`,
    alt: 'Palm-lined street of two-story storefronts with outdoor restaurant seating and people dining.',
    width: 1600,
    height: 1061,
  },
  sampleIndustrial1: {
    src: `${dir}/sample-industrial-1.jpg`,
    alt: 'Beige concrete-block warehouse building with two loading dock doors and an empty parking lot.',
    width: 1600,
    height: 1280,
  },
  sampleOffice1: {
    src: `${dir}/sample-office-1.jpg`,
    alt: 'Upper corner of a low-rise beige office building with dark ribbon windows under an overcast sky.',
    width: 1600,
    height: 1067,
  },
  sampleMixedUse1: {
    src: `${dir}/sample-mixed-use-1.jpg`,
    alt: 'Weathered pink three-story corner building with a ground-floor storefront and a palmetto tree at a street crossing.',
    width: 1600,
    height: 2500,
  },
  sampleHome1: {
    src: `${dir}/sample-home-1.jpg`,
    alt: 'Grey house with a stone chimney, front porch and palm trees.',
    width: 1600,
    height: 1067,
  },
  sampleHome2: {
    src: `${dir}/sample-home-2.jpg`,
    alt: 'Two-story white board-and-batten house with a covered porch and a three-car garage.',
    width: 1600,
    height: 1280,
  },
  sampleHome3: {
    src: `${dir}/sample-home-3.jpg`,
    alt: 'White two-story house with wraparound porches behind a brick path, fountain and lush tropical garden.',
    width: 1600,
    height: 1179,
  },
  sampleCondo1: {
    src: `${dir}/sample-condo-1.jpg`,
    alt: 'Low-angle view of white high-rise condominium towers behind tall coconut palms.',
    width: 1600,
    height: 1067,
  },
  sampleInterior1: {
    src: `${dir}/sample-interior-1.jpg`,
    alt: 'Bright modern kitchen with white cabinets, stainless steel appliances, a white island and black pendant lights.',
    width: 1600,
    height: 1063,
  },
  sampleInterior2: {
    src: `${dir}/sample-interior-2.jpg`,
    alt: 'Bright white bedroom with a white bed, corner windows and a framed owl print on the wall.',
    width: 1600,
    height: 1067,
  },
} as const satisfies Record<string, SiteImage>

export type SiteImageKey = keyof typeof images
