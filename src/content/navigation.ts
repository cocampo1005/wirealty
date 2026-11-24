export interface NavChild {
  label: string
  href: string
  description?: string
}

export interface NavItem {
  label: string
  href: string
  children?: NavChild[]
}

/** Primary navigation. "Home" is the logo on desktop and listed first on mobile. */
export const primaryNav: NavItem[] = [
  { label: 'Commercial', href: '/commercial' },
  {
    label: 'Listings',
    href: '/listings',
    children: [
      {
        label: 'Commercial & Investment',
        href: '/listings?category=commercial',
        description: 'Multifamily, retail, industrial, office and mixed-use',
      },
      {
        label: 'Residential',
        href: '/listings?category=residential',
        description: 'Homes and condos to buy or rent',
      },
      { label: 'Saved Properties', href: '/listings/saved', description: 'Your favorites on this device' },
    ],
  },
  { label: 'Property Management', href: '/property-management' },
  { label: 'Portfolio', href: '/portfolio' },
  {
    label: 'Explore Areas',
    href: '/areas',
    children: [
      { label: 'Miami-Dade County', href: '/areas/miami-dade-county' },
      { label: 'Broward County', href: '/areas/broward-county' },
      { label: 'Palm Beach County', href: '/areas/palm-beach-county' },
      { label: 'All Areas & Map', href: '/areas' },
    ],
  },
  { label: 'About', href: '/about' },
]

export const contactNav: NavItem = { label: 'Contact', href: '/contact' }

export const footerNav: { title: string; links: NavChild[] }[] = [
  {
    title: 'Services',
    links: [
      { label: 'Commercial Real Estate', href: '/commercial' },
      { label: 'Property Management', href: '/property-management' },
      { label: 'Residential Listings', href: '/listings?category=residential' },
      { label: 'Investment Opportunities', href: '/listings?category=commercial' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Explore Areas', href: '/areas' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]
