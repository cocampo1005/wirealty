'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useModal } from '@/hooks/use-modal'
import type { PropertyImage } from '@/lib/properties/types'
import { cn } from '@/lib/utils/cn'

interface PropertyGalleryProps {
  images: PropertyImage[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [slide, setSlide] = useState(0)
  const trackRef = useRef<HTMLUListElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  const open = (index: number, opener: HTMLElement) => {
    openerRef.current = opener
    setLightboxIndex(index)
  }
  const close = useCallback(() => {
    setLightboxIndex(null)
    openerRef.current?.focus()
  }, [])

  // Track the visible slide in the mobile carousel.
  const onScroll = () => {
    const track = trackRef.current
    if (!track) return
    setSlide(Math.round(track.scrollLeft / track.clientWidth))
  }

  if (images.length === 0) return null
  const [lead, ...rest] = images
  const thumbs = rest.slice(0, 2)
  const remaining = images.length - 1 - thumbs.length

  return (
    <div>
      {/* Mobile: swipeable carousel */}
      <div className="relative lg:hidden">
        <ul
          ref={trackRef}
          onScroll={onScroll}
          aria-label={`Photos of ${title}`}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto"
        >
          {images.map((image, i) => (
            <li key={image.src} className="relative aspect-[4/3] w-full shrink-0 snap-center bg-mist-deep">
              <button
                type="button"
                onClick={(event) => open(i, event.currentTarget)}
                className="absolute inset-0 block"
                aria-label={`View photo ${i + 1} of ${images.length} full screen`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="100vw"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
        <p className="pointer-events-none absolute right-3 bottom-3 bg-navy-deep/85 px-3 py-1.5 text-[0.75rem] font-semibold tracking-[0.1em] text-white">
          {slide + 1} / {images.length}
        </p>
      </div>

      {/* Desktop: lead image with supporting frames */}
      <div className={cn('hidden gap-3 lg:grid', thumbs.length > 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-1')}>
        <GalleryTile
          image={lead}
          label={`View photo 1 of ${images.length} full screen`}
          onOpen={(el) => open(0, el)}
          className={cn('aspect-[16/10]', thumbs.length > 0 ? 'lg:col-span-2' : '')}
          sizes="(min-width: 1344px) 830px, 66vw"
          preload
        />
        {thumbs.length > 0 ? (
          <div className="grid grid-rows-2 gap-3">
            {thumbs.map((image, i) => (
              <GalleryTile
                key={image.src}
                image={image}
                label={`View photo ${i + 2} of ${images.length} full screen`}
                onOpen={(el) => open(i + 1, el)}
                className="h-full"
                sizes="(min-width: 1344px) 410px, 33vw"
                overlay={i === thumbs.length - 1 && remaining > 0 ? `+${remaining} more` : undefined}
              />
            ))}
          </div>
        ) : null}
      </div>

      <Lightbox images={images} index={lightboxIndex} title={title} onChange={setLightboxIndex} onClose={close} />
    </div>
  )
}

interface GalleryTileProps {
  image: PropertyImage
  label: string
  onOpen: (opener: HTMLElement) => void
  className?: string
  sizes: string
  preload?: boolean
  overlay?: string
}

function GalleryTile({ image, label, onOpen, className, sizes, preload, overlay }: GalleryTileProps) {
  return (
    <button
      type="button"
      onClick={(event) => onOpen(event.currentTarget)}
      aria-label={label}
      className={cn('group relative block w-full overflow-hidden bg-mist-deep', className)}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.035]"
      />
      {overlay ? (
        <span className="absolute inset-0 flex items-center justify-center bg-navy-deep/60 text-label text-white">
          {overlay}
        </span>
      ) : (
        <span
          aria-hidden
          className="absolute right-3 bottom-3 inline-flex size-10 items-center justify-center bg-white/95 text-navy-deep opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <Expand className="size-4" strokeWidth={1.75} />
        </span>
      )}
    </button>
  )
}

interface LightboxProps {
  images: PropertyImage[]
  index: number | null
  title: string
  onChange: (index: number) => void
  onClose: () => void
}

function Lightbox({ images, index, title, onChange, onClose }: LightboxProps) {
  return (
    <AnimatePresence>
      {index !== null ? (
        <LightboxDialog images={images} index={index} title={title} onChange={onChange} onClose={onClose} />
      ) : null}
    </AnimatePresence>
  )
}

function LightboxDialog({ images, index, title, onChange, onClose }: LightboxProps & { index: number }) {
  const reduceMotion = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const count = images.length
  const image = images[index]

  useModal(true, onClose, dialogRef, closeRef)

  const step = useCallback(
    (delta: number) => onChange((index + delta + count) % count),
    [index, count, onChange],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [step])

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photos of ${title}`}
      className="on-dark fixed inset-0 z-[80] flex flex-col bg-navy-deep/[0.97] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6">
        <p aria-live="polite" className="text-label text-white/80">
          {index + 1} <span className="text-white/40">/ {count}</span>
        </p>
        <button ref={closeRef} type="button" onClick={onClose} className="inline-flex size-11 items-center justify-center">
          <span className="sr-only">Close photos</span>
          <X aria-hidden className="size-6" strokeWidth={1.5} />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={image.src}
            className="absolute inset-0 mx-4 mb-4 sm:mx-20"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 640px) calc(100vw - 10rem), calc(100vw - 2rem)"
              quality={85}
              className="object-contain"
            />
          </motion.div>
        </AnimatePresence>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              className="absolute top-1/2 left-2 inline-flex size-12 -translate-y-1/2 items-center justify-center bg-navy-deep/60 transition-colors hover:bg-white hover:text-navy-deep sm:left-5"
            >
              <span className="sr-only">Previous photo</span>
              <ChevronLeft aria-hidden className="size-6" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="absolute top-1/2 right-2 inline-flex size-12 -translate-y-1/2 items-center justify-center bg-navy-deep/60 transition-colors hover:bg-white hover:text-navy-deep sm:right-5"
            >
              <span className="sr-only">Next photo</span>
              <ChevronRight aria-hidden className="size-6" strokeWidth={1.5} />
            </button>
          </>
        ) : null}
      </div>

      <p className="shrink-0 px-6 pb-5 text-center text-sm text-white/70">{image.alt}</p>
    </motion.div>
  )
}
