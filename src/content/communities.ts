import type { SiteImage } from './images'
import { images } from './images'

/**
 * Areas shown in the regional explorer and on /areas.
 *
 * All copy here is [DRAFT] marketing copy awaiting approval, and the list of
 * counties and cities is [CONFIRM] — it must match the brokerage's real service
 * area. Descriptions stick to plain geography on purpose: no housing
 * statistics, yields, demographics or projections may be added without a
 * verified source.
 */

export interface County {
  kind: 'county'
  slug: string
  name: string
  shortName: string
  /** One-line summary for the map panel. */
  summary: string
  overview: string[]
  image: SiteImage
}

export interface City {
  kind: 'city'
  slug: string
  name: string
  countySlug: string
  /** Approximate city center, used to place the marker on the map. */
  coordinates: { lat: number; lng: number }
  summary: string
  overview: string[]
  image: SiteImage
}

export type Area = County | City

export const counties: County[] = [
  {
    kind: 'county',
    slug: 'palm-beach-county',
    name: 'Palm Beach County',
    shortName: 'Palm Beach',
    summary:
      'The northern end of the South Florida region, running from Boca Raton through West Palm Beach to Jupiter.',
    overview: [
      'Palm Beach County forms the northern end of the tri-county South Florida region. Its communities stretch along the Atlantic coast from Boca Raton and Delray Beach through West Palm Beach to Jupiter, with agricultural and conservation land extending west toward Lake Okeechobee.',
      'Weston International Realty assists clients with commercial, residential and property management needs in the county. Tell us what you are looking for and we will discuss how we can help.',
    ],
    image: images.areaPalmBeach,
  },
  {
    kind: 'county',
    slug: 'broward-county',
    name: 'Broward County',
    shortName: 'Broward',
    summary:
      'Between Miami-Dade and Palm Beach counties — home to Fort Lauderdale, Hollywood and western communities such as Weston, Plantation and Davie.',
    overview: [
      'Broward County sits at the center of South Florida, between Miami-Dade County to the south and Palm Beach County to the north. Fort Lauderdale is the county seat, with coastal cities such as Hollywood to the south and suburban communities including Plantation, Davie and Weston to the west.',
      'From neighborhood retail and multifamily buildings to single-family homes, we work with owners, investors, businesses and residents across the county.',
    ],
    image: images.areaBroward,
  },
  {
    kind: 'county',
    slug: 'miami-dade-county',
    name: 'Miami-Dade County',
    shortName: 'Miami-Dade',
    summary:
      'The southern anchor of the region, from Downtown Miami and Brickell to communities across the county.',
    overview: [
      'Miami-Dade County anchors the southern end of South Florida. The City of Miami is the county seat, surrounded by a wide range of neighborhoods and municipalities between Biscayne Bay and the Everglades.',
      'We work with clients across the county on commercial acquisitions, sales and leasing, residential purchases and sales, and ongoing property management.',
    ],
    image: images.areaMiamiDade,
  },
]

export const cities: City[] = [
  {
    kind: 'city',
    slug: 'weston',
    name: 'Weston',
    countySlug: 'broward-county',
    coordinates: { lat: 26.1004, lng: -80.3998 },
    summary: 'A master-planned city on the western edge of Broward County, bordering the Everglades.',
    overview: [
      'Weston is a master-planned city on the western edge of Broward County, where the suburbs meet the Everglades. It is known for its residential neighborhoods, lakes and landscaped streets, along with office and retail centers serving the community.',
      'Whether you are buying or selling a home in Weston, looking for commercial space, or need a property managed, we can help you take the next step.',
    ],
    image: images.areaBroward, // [CONFIRM] replace with an approved local photograph
  },
  {
    kind: 'city',
    slug: 'plantation',
    name: 'Plantation',
    countySlug: 'broward-county',
    coordinates: { lat: 26.1276, lng: -80.2331 },
    summary: 'A central Broward city just west of Fort Lauderdale, with established neighborhoods and business districts.',
    overview: [
      'Plantation lies in central Broward County, immediately west of Fort Lauderdale. Established residential neighborhoods sit alongside office parks, retail corridors and medical and professional space.',
      'We assist buyers, sellers, tenants and property owners in Plantation with both residential and commercial real estate.',
    ],
    image: images.areaBroward, // [CONFIRM] replace with an approved local photograph
  },
  {
    kind: 'city',
    slug: 'davie',
    name: 'Davie',
    countySlug: 'broward-county',
    coordinates: { lat: 26.0765, lng: -80.2521 },
    summary: 'A central Broward town with a mix of residential areas, campuses and commercial corridors.',
    overview: [
      'Davie is a town in central Broward County, south of Plantation and west of Fort Lauderdale and Hollywood. It combines residential areas — including larger-lot and equestrian properties — with college campuses and commercial corridors.',
      'From homes to retail, office and industrial space, we can help you evaluate opportunities in Davie.',
    ],
    image: images.areaBroward, // [CONFIRM] replace with an approved local photograph
  },
  {
    kind: 'city',
    slug: 'fort-lauderdale',
    name: 'Fort Lauderdale',
    countySlug: 'broward-county',
    coordinates: { lat: 26.1224, lng: -80.1373 },
    summary: 'The Broward County seat — a coastal city of canals, a downtown core and a busy port.',
    overview: [
      'Fort Lauderdale is the seat of Broward County. Its downtown, the Las Olas corridor, miles of navigable canals, the beach and Port Everglades give the city a broad mix of residential and commercial property.',
      'We work with investors, business owners, buyers and sellers throughout Fort Lauderdale.',
    ],
    image: images.areaFortLauderdale,
  },
  {
    kind: 'city',
    slug: 'hollywood',
    name: 'Hollywood',
    countySlug: 'broward-county',
    coordinates: { lat: 26.0112, lng: -80.1495 },
    summary: 'A coastal Broward city between Fort Lauderdale and Miami, known for its beach and Broadwalk.',
    overview: [
      'Hollywood sits on the coast in southern Broward County, between Fort Lauderdale and Miami. The city is known for Hollywood Beach and its Broadwalk, a walkable downtown, and a mix of condominiums, single-family neighborhoods and commercial districts.',
      'We can help with residential purchases and sales, commercial property and property management in Hollywood.',
    ],
    image: images.areaHollywood,
  },
  {
    kind: 'city',
    slug: 'miami',
    name: 'Miami',
    countySlug: 'miami-dade-county',
    coordinates: { lat: 25.7617, lng: -80.1918 },
    summary: 'The Miami-Dade County seat and the urban center of South Florida.',
    overview: [
      'Miami is the seat of Miami-Dade County and the urban center of South Florida. Its neighborhoods range from the high-rise districts of Downtown and Brickell to long-established residential and commercial areas across the city.',
      'We assist clients with commercial property, multifamily and other investment real estate, and residential purchases and sales in Miami.',
    ],
    image: images.areaMiami,
  },
]

/** Non-interactive orientation labels on the map (no pages). */
export const referencePlaces: { name: string; coordinates: { lat: number; lng: number } }[] = [
  { name: 'West Palm Beach', coordinates: { lat: 26.7153, lng: -80.0534 } },
  { name: 'Boca Raton', coordinates: { lat: 26.3683, lng: -80.1289 } },
  { name: 'Homestead', coordinates: { lat: 25.4687, lng: -80.4776 } },
]

export const areas: Area[] = [...counties, ...cities]

export function getArea(slug: string): Area | undefined {
  return areas.find((area) => area.slug === slug)
}

export function getCounty(slug: string): County | undefined {
  return counties.find((county) => county.slug === slug)
}

export function citiesInCounty(countySlug: string): City[] {
  return cities.filter((city) => city.countySlug === countySlug)
}
