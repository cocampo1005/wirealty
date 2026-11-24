import type { CommercialPropertyType } from '@/lib/properties/types'
import type { SiteImage } from './images'
import { images } from './images'

/**
 * Service copy.
 * [SITE]  = verbatim from the current wirealty.us website
 * [BRIEF] = supplied in the project brief
 * [DRAFT] = proposed copy awaiting client approval (see CONTENT_VERIFICATION.md)
 *
 * Keep descriptions grounded. Do not add financial advisory, underwriting,
 * financing, legal or guaranteed-outcome claims.
 */

export interface FaqItem {
  question: string
  answer: string
}

// ---------------------------------------------------------------------------
// Commercial
// ---------------------------------------------------------------------------

export interface CommercialType {
  slug: CommercialPropertyType
  name: string
  description: string
  image: SiteImage
}

export const commercialTypes: CommercialType[] = [
  {
    slug: 'multifamily',
    name: 'Multifamily',
    description:
      'Support for owners and investors seeking apartment buildings and income-producing residential assets.', // [SITE]
    image: images.typeMultifamily,
  },
  {
    slug: 'retail',
    name: 'Retail',
    description:
      'Guidance for storefronts, shopping centers, and retail opportunities in high-visibility locations.', // [SITE]
    image: images.typeRetail,
  },
  {
    slug: 'industrial',
    name: 'Industrial',
    description: 'Commercial solutions for logistics, storage, manufacturing, and distribution needs.', // [SITE]
    image: images.typeIndustrial,
  },
  {
    slug: 'warehouse',
    name: 'Warehouses',
    description: 'Help finding, leasing and selling warehouse space suited to the way a business operates.', // [DRAFT]
    image: images.typeWarehouse,
  },
  {
    slug: 'office',
    name: 'Office',
    description: 'Assistance buying, selling and leasing office property, from professional suites to standalone buildings.', // [DRAFT]
    image: images.typeOffice,
  },
  {
    slug: 'mixed-use',
    name: 'Mixed-Use',
    description: 'Guidance on properties that combine uses, such as street-level retail with residences or offices above.', // [DRAFT]
    image: images.typeMixedUse,
  },
]

export const commercialIntro = {
  heading: 'Commercial Real Estate Services in South Florida', // [SITE]
  lead: 'Helping investors, property owners, and businesses navigate commercial real estate with expert guidance.', // [SITE]
  sectionHeading: 'Commercial Real Estate Solutions Tailored to Your Goals', // [SITE]
  body: [
    'Whether you are looking to acquire an income producing asset, lease space for your business, market a commercial property, or improve the performance of an existing one, Weston International Realty provides experienced support throughout the process. We work with a range of commercial property types and help clients make informed decisions based on their goals, timeline, and market conditions.', // [SITE]
    'With deep familiarity in South Florida real estate, we provide a practical and personalized approach that keeps your priorities front and center from the first conversation to closing and beyond.', // [SITE]
  ],
}

/** Who we work with — derived from the approved commercial introduction. [DRAFT] */
export const commercialAudiences: { title: string; need: string; description: string }[] = [
  {
    title: 'Investors & Buyers',
    need: 'Acquire an income-producing asset',
    description:
      'We help you identify properties that fit your goals and timeline, and guide you from the first showing through closing.',
  },
  {
    title: 'Property Owners',
    need: 'Market a commercial property',
    description:
      'When it is time to sell or lease, we position and market your property and represent your interests throughout the transaction.',
  },
  {
    title: 'Businesses',
    need: 'Lease space for your business',
    description:
      'We help business owners find retail, office, warehouse and industrial space that suits how they operate today and where they are headed.',
  },
  {
    title: 'Existing Owners',
    need: 'Improve an existing property’s performance',
    description:
      'For owners who want more from a property they already hold, we offer practical guidance and ongoing property management.',
  },
]

/** [DRAFT] — based on the "Local Knowledge. Proven Experience." section of the current site. */
export const commercialReasons: { title: string; description: string }[] = [
  {
    title: 'South Florida focused',
    description: 'Deep understanding of local markets, neighborhoods, and investment opportunities.', // [SITE]
  },
  {
    title: 'A direct relationship',
    description:
      'You work directly with an experienced broker who stays involved from the first conversation to closing and beyond.',
  },
  {
    title: 'Informed decisions',
    description:
      'We help you weigh each opportunity against your goals, your timeline and current market conditions.',
  },
  {
    title: 'Continuity after closing',
    description:
      'Clients who acquire investment property with us can continue the relationship through our property management services.',
  },
]

export const commercialFaqs: FaqItem[] = [
  {
    question: 'What types of commercial property do you work with?',
    answer:
      'We work across a wide range of commercial property types throughout South Florida, including multifamily, retail, industrial, office, warehouse and mixed-use assets.',
  },
  {
    question: 'Do you represent buyers and tenants as well as owners?',
    answer:
      'Yes. We assist clients looking to acquire or lease commercial property, as well as owners who want to sell or lease a property they hold.',
  },
  {
    question: 'Which areas do you serve?',
    answer:
      'We serve South Florida, including Miami-Dade, Broward and Palm Beach counties. If you are unsure whether a property falls within our service area, contact us and we will let you know.',
  },
  {
    question: 'Can you manage a property after I purchase it?',
    answer:
      'Yes. Weston International Realty also provides property management, so clients who acquire an investment property with us can keep working with the same firm after closing.',
  },
  {
    question: 'Do you provide legal, tax or financing advice?',
    answer:
      'No. We are a real estate brokerage. We recommend consulting your attorney, accountant and lender on legal, tax and financing matters, and we are glad to coordinate with them during a transaction.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Reach out by phone, email or the contact form. We will start with a conversation about your goals, your timeline and the type of property you have in mind.',
  },
]

// ---------------------------------------------------------------------------
// Property management
// ---------------------------------------------------------------------------

export const managementIntro = {
  homeHeading: 'Your Property. Our Priority.', // [BRIEF]
  homeBody:
    'From tenant placement to day-to-day oversight, Weston International Realty provides personalized property management designed to help owners protect their investments and simplify ownership.', // [BRIEF]
  pageHeading: 'Property Management Built Around Your Investment.', // [BRIEF]
  pageLead:
    'Personalized property management services to help owners simplify operations, protect their properties, and stay informed.', // [BRIEF]
}

/** Short list used on the homepage — matches the services named on the current site. [SITE] */
export const managementHighlights: string[] = [
  'Tenant screening and placement',
  'Rent collection and reporting',
  'Maintenance coordination',
  'Local market knowledge and owner support',
]

/** Core services for the Property Management page. Titles [BRIEF], descriptions [DRAFT]. */
export const managementServices: { title: string; description: string }[] = [
  {
    title: 'Tenant screening and placement',
    description: 'Marketing available units, screening applicants and placing tenants for your property.',
  },
  {
    title: 'Rent collection',
    description: 'Handling rent collection on your behalf, so income from the property stays organized.',
  },
  {
    title: 'Owner reporting',
    description: 'Regular reporting so you can see how your property is performing and what has been done.',
  },
  {
    title: 'Maintenance coordination',
    description: 'Coordinating repairs and routine maintenance to keep your property in good condition.',
  },
  {
    title: 'Local market guidance and communication',
    description: 'Clear communication and South Florida market knowledge to support your decisions as an owner.',
  },
]

/** [DRAFT] */
export const managementReasons: { title: string; description: string }[] = [
  {
    title: 'Personal attention',
    description: 'Your property is managed by a firm that knows you and your goals — not treated as one account among many.',
  },
  {
    title: 'Local knowledge',
    description: 'Decades of hands-on experience across residential, commercial, and property management.', // [SITE]
  },
  {
    title: 'One relationship',
    description:
      'The same brokerage can help you acquire a property, manage it, and advise you when it is time to sell.',
  },
]

/**
 * Illustrative onboarding process.
 * [DRAFT] — presented as draft marketing content pending confirmation; it is
 * not an established operating policy and must be approved before launch.
 */
export const managementProcess: { title: string; description: string }[] = [
  {
    title: 'Initial consultation',
    description: 'We talk through your property, your goals as an owner and what you need from a manager.',
  },
  {
    title: 'Property review',
    description: 'We review the property and its current situation to understand which services are required.',
  },
  {
    title: 'Proposed approach',
    description: 'You receive a recommended management approach to consider, tailored to the property.',
  },
  {
    title: 'Onboarding and ongoing support',
    description: 'Once you decide to move forward, we take the property on and keep you informed from there.',
  },
]

export const managementFaqs: FaqItem[] = [
  {
    question: 'What does your property management service include?',
    answer:
      'Our core services are tenant screening and placement, rent collection, owner reporting, maintenance coordination, and local market guidance and communication.',
  },
  {
    question: 'What kinds of properties do you manage?',
    answer:
      'We work with property owners and real estate investors across South Florida. Tell us about your property — its type, location and number of units — and we will let you know how we can help.',
  },
  {
    question: 'How much does property management cost?',
    answer:
      'Management terms depend on the property and the services you need. We will discuss them with you after an initial consultation and review of the property.',
  },
  {
    question: 'I bought my property through another broker. Can you still manage it?',
    answer:
      'Yes. You do not need to have purchased the property through Weston International Realty to request a management consultation.',
  },
  {
    question: 'Can you help me buy an investment property and then manage it?',
    answer:
      'Yes. We can assist with the acquisition and continue the relationship through property management after closing.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Complete the consultation request form on this page or call us. We will follow up to learn more about your property and your goals.',
  },
]
