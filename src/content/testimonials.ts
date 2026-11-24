import { showSampleContent } from '@/lib/site-mode'

export interface Testimonial {
  id: string
  quote: string
  headline?: string
  name: string
  role?: string
  /** Which service the testimonial relates to — used for subtle labeling. */
  service?: 'Commercial' | 'Property Management' | 'Residential'
  /**
   * Only approved testimonials are rendered on the public site.
   * Set to true once the client confirms the quote is genuine, accurately
   * attributed, and that the person has agreed to its publication.
   */
  approved: boolean
}

/**
 * The four entries below are reproduced verbatim from the current
 * wirealty.us homepage. They are held as unapproved until the client
 * confirms each one (see CONTENT_VERIFICATION.md) — flip `approved` to
 * publish. Never add invented or paraphrased reviews.
 */
export const testimonials: Testimonial[] = [
  {
    id: 'clavijo',
    headline: 'Hands-On, Professional, and Results-Driven',
    quote:
      'German helped me acquire a multifamily property and continues to manage it through Weston International Realty. Occupancy has stayed strong, and any issues are handled quickly and professionally. What stands out most is how involved he is. You’re not passed around to different people; he stays engaged and makes sure everything runs smoothly.',
    name: 'Juan Carlos Clavijo',
    role: 'ICON Group USA',
    service: 'Property Management',
    approved: false,
  },
  {
    id: 'garcia',
    headline: 'Reliable Property Management I Can Count On',
    quote:
      'I trust German and the Weston International team completely with managing my properties. From tenant placement to maintenance, everything is handled professionally and on time. Communication is clear and consistent, which is critical for me as an out-of-state investor. It’s rare to find this level of reliability and attention to detail.',
    name: 'Juan Garcia',
    role: 'Real Estate Investor',
    service: 'Property Management',
    approved: false,
  },
  {
    id: 'jessub',
    headline: 'A Strategic Partner for Our Expansion',
    quote:
      'Working with German at Wirealty was a turning point for our business. He helped us secure the right warehouse space and guided us through every detail, from lease terms to long-term scalability. His hands-on approach and deep understanding of the market made the entire process efficient and stress-free. You can tell he genuinely cares about his clients’ success.',
    name: 'Mark Jessub',
    role: 'Engineering Contractor',
    service: 'Commercial',
    approved: false,
  },
  {
    id: 'gonzales',
    headline: 'He Knows the Market Inside and Out',
    quote:
      'German was instrumental in helping me find the perfect retail space. He understood my business needs immediately and worked quickly to secure a location that fit both my vision and budget. His knowledge of the commercial market and negotiation skills gave me confidence throughout the entire process.',
    name: 'Diana Gonzales',
    role: 'Retail Manager',
    service: 'Commercial',
    approved: false,
  },
]

/** Testimonials that may be shown in the current mode. */
export const visibleTestimonials: Testimonial[] = testimonials.filter(
  (t) => t.approved || showSampleContent,
)

/** True when at least one visible testimonial is still awaiting approval. */
export const hasUnapprovedTestimonials: boolean = visibleTestimonials.some((t) => !t.approved)
