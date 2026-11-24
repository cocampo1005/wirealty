import { cn } from '@/lib/utils/cn'

/**
 * Weston International Realty logo lockup.
 *
 * The mark is the brokerage's authentic vector path (assets/wirealty-logomark.svg).
 * The official horizontal logo file sets its wordmark as live Trajan Pro text,
 * which cannot be embedded on the web, so the wordmark here is typeset in the
 * brand's web display face (Cinzel). Replace with an outlined logo file when
 * the designer supplies one — see CONTENT_VERIFICATION.md.
 */

const MARK_PATH =
  'M485.913,907.89C510.092,895.053 537.668,887.779 566.93,887.779C662.497,887.779 740.085,965.367 740.085,1060.935C740.085,1156.502 662.497,1234.09 566.93,1234.09C471.363,1234.09 393.774,1156.502 393.774,1060.935C393.774,1015.58 411.249,974.275 439.828,943.391L439.828,1102.977C441.2,1141.926 473.252,1173.125 512.533,1173.125C531.723,1173.125 549.187,1165.679 562.192,1153.521C575.197,1165.679 592.662,1173.125 611.851,1173.125C651.132,1173.125 683.184,1141.926 684.556,1102.977L684.556,993.892C684.556,993.892 677.674,1006.097 661.544,1006.097C645.415,1006.097 638.472,993.892 638.472,993.892L638.472,1102.977C637.162,1116.519 625.735,1127.12 611.851,1127.12C597.986,1127.12 586.571,1116.547 585.236,1103.03L585.238,1102.977L585.238,1049.379L539.156,1049.379L539.156,1102.977L539.146,1102.977L539.148,1103.03C537.813,1116.547 526.398,1127.12 512.533,1127.12C498.65,1127.12 487.223,1116.519 485.913,1102.977L485.913,907.89ZM661.526,950.418C648.815,950.418 638.495,960.738 638.495,973.449C638.495,986.16 648.815,996.479 661.526,996.479C674.237,996.479 684.556,986.16 684.556,973.449C684.556,960.738 674.237,950.418 661.526,950.418Z'

interface LogoMarkProps {
  /** Places the red mark on a white disc, as in the brand's icon. For dark surfaces. */
  onDark?: boolean
  className?: string
}

export function LogoMark({ onDark = false, className }: LogoMarkProps) {
  return (
    <svg viewBox="376 870 382 382" aria-hidden focusable="false" className={className}>
      {onDark ? <circle cx="566.93" cy="1060.935" r="191" fill="#fff" /> : null}
      <path d={MARK_PATH} fill="#B21F25" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

interface LogoProps {
  tone?: 'color' | 'light'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { mark: 'size-9', text: 'text-[0.6875rem] leading-[1.14]' },
  md: { mark: 'size-11', text: 'text-[0.8125rem] leading-[1.12]' },
  lg: { mark: 'size-16', text: 'text-[1.125rem] leading-[1.1]' },
} as const

export function Logo({ tone = 'color', size = 'md', className }: LogoProps) {
  const s = sizeMap[size]
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <LogoMark onDark={tone === 'light'} className={cn(s.mark, 'shrink-0')} />
      <span
        aria-hidden
        className={cn(
          'font-display font-bold tracking-[0.01em] transition-colors duration-300',
          s.text,
          tone === 'light' ? 'text-white' : 'text-brand-blue',
        )}
      >
        <span className="block">Weston</span>
        <span className="block">International</span>
        <span className="block">Realty</span>
      </span>
      <span className="sr-only">Weston International Realty</span>
    </span>
  )
}
