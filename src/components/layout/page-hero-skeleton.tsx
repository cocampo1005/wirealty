/**
 * Loading placeholder for pages whose hero depends on request-time data
 * (listing and portfolio detail pages). Keeps the dark band under the
 * transparent header so the layout never flashes white.
 */
export function PageHeroSkeleton({ label = 'Loading' }: { label?: string }) {
  return (
    <>
      <section
        role="status"
        aria-label={label}
        className="on-dark relative isolate overflow-hidden bg-navy-deep pt-36 pb-14 text-white lg:pt-44 lg:pb-16"
      >
        <div aria-hidden className="absolute inset-0 -z-10 bg-blueprint" />
        <div className="container-wi animate-pulse">
          <div className="h-3 w-40 bg-white/15" />
          <div className="mt-8 h-10 w-full max-w-2xl bg-white/10 lg:h-14" />
          <div className="mt-6 h-4 w-full max-w-lg bg-white/10" />
        </div>
      </section>
      <div aria-hidden className="container-wi animate-pulse py-16">
        <div className="aspect-[16/8] w-full bg-mist-deep" />
        <div className="mt-10 h-4 w-2/3 bg-mist-deep" />
        <div className="mt-4 h-4 w-1/2 bg-mist-deep" />
      </div>
    </>
  )
}
