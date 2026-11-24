import { Plus } from 'lucide-react'
import type { FaqItem } from '@/content/services'
import { cn } from '@/lib/utils/cn'

interface FaqProps {
  items: FaqItem[]
  className?: string
}

/**
 * FAQ list built on native <details>, so it works without JavaScript and is
 * keyboard- and screen-reader-accessible by default.
 */
export function Faq({ items, className }: FaqProps) {
  return (
    <div className={cn('border-t border-line', className)}>
      {items.map((item) => (
        <details key={item.question} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
            <h3 className="text-[1.0625rem] leading-snug font-semibold text-navy-deep transition-colors group-hover:text-brand-blue">
              {item.question}
            </h3>
            <span
              aria-hidden
              className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center border border-line text-navy-deep transition-[transform,background-color,color,border-color] duration-300 ease-out-expo group-open:rotate-45 group-open:border-brand-red group-open:bg-brand-red group-open:text-white"
            >
              <Plus className="size-4" strokeWidth={1.75} />
            </span>
          </summary>
          <p className="max-w-3xl pr-12 pb-7 text-slate">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
