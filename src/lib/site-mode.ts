/**
 * Sample content switch.
 *
 * "Sample content" is everything that must never be presented as real on the
 * public website: development listing fixtures, draft portfolio records,
 * testimonials awaiting approval, unconfirmed figures and placeholder slots.
 *
 * - `next dev`            → ON by default (so the full design can be reviewed)
 * - production builds     → OFF by default
 * - NEXT_PUBLIC_SHOW_SAMPLE_CONTENT=true|false overrides either default
 *   (use `true` only for private previews / staging).
 */
const override = process.env.NEXT_PUBLIC_SHOW_SAMPLE_CONTENT

export const showSampleContent: boolean =
  override === 'true' || (override !== 'false' && process.env.NODE_ENV !== 'production')
