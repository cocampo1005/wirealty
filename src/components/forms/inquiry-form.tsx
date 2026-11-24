'use client'

import Link from 'next/link'
import { CircleAlert, CircleCheck, LoaderCircle, Mail, Phone } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useId, useRef, useState, type FormEvent } from 'react'
import { business, primaryPhone } from '@/content/business'
import {
  hasErrors,
  inquiryInterests,
  interestLabels,
  managedPropertyTypes,
  validateInquiry,
  type InquiryErrors,
  type InquiryField,
  type InquiryInterest,
  type InquiryKind,
  type InquiryPayload,
  type InquiryResponse,
} from '@/lib/validation/inquiry'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { SelectField, TextAreaField, TextField } from './fields'

interface InquiryFormProps {
  kind: InquiryKind
  /** Pre-selected inquiry category (contact form). */
  defaultInterest?: InquiryInterest
  /** Property context, included automatically with the inquiry (property form). */
  property?: { id: string; title: string }
  defaultMessage?: string
  submitLabel?: string
  className?: string
}

type Status =
  | { state: 'idle' }
  | { state: 'submitting' }
  | { state: 'success' }
  | { state: 'error'; code: 'not_configured' | 'delivery_failed' | 'rate_limited' | 'network' }

interface Values {
  name: string
  email: string
  phone: string
  message: string
  interest: InquiryInterest | ''
  propertyLocation: string
  propertyType: string
  unitCount: string
  requestType: 'information' | 'tour'
  company: string
}

const errorCopy: Record<Extract<Status, { state: 'error' }>['code'], { title: string; body: string }> = {
  not_configured: {
    title: 'Your message was not sent.',
    body: 'Online inquiries are not yet connected on this website. Please reach us directly using the details below — we would not want to miss your message.',
  },
  delivery_failed: {
    title: 'Your message could not be delivered.',
    body: 'Something went wrong while sending. Please try again, or reach us directly using the details below.',
  },
  rate_limited: {
    title: 'Please wait a moment before trying again.',
    body: 'We received several submissions in a short time. You can also reach us directly using the details below.',
  },
  network: {
    title: 'We could not reach the server.',
    body: 'Please check your connection and try again, or reach us directly using the details below.',
  },
}

export function InquiryForm({
  kind,
  defaultInterest,
  property,
  defaultMessage = '',
  submitLabel,
  className,
}: InquiryFormProps) {
  const uid = useId()
  const reduceMotion = useReducedMotion()
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const openedAt = useRef<number | null>(null)

  const [values, setValues] = useState<Values>({
    name: '',
    email: '',
    phone: '',
    message: defaultMessage,
    interest: defaultInterest ?? '',
    propertyLocation: '',
    propertyType: '',
    unitCount: '',
    requestType: 'information',
    company: '',
  })
  const [errors, setErrors] = useState<InquiryErrors>({})
  const [status, setStatus] = useState<Status>({ state: 'idle' })

  const id = (field: string) => `${uid}-${field}`
  const submitting = status.state === 'submitting'

  const buildPayload = (): InquiryPayload => ({
    kind,
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    message: values.message.trim(),
    interest: values.interest || undefined,
    propertyLocation: values.propertyLocation.trim() || undefined,
    propertyType: values.propertyType || undefined,
    unitCount: values.unitCount.trim() || undefined,
    requestType: kind === 'property' ? values.requestType : undefined,
    propertyId: property?.id,
    propertyTitle: property?.title,
    pagePath: `${window.location.pathname}${window.location.search}`,
    company: values.company || undefined,
    elapsedMs: openedAt.current === null ? undefined : Date.now() - openedAt.current,
  })

  const update = <K extends keyof Values>(field: K, value: Values[K]) => {
    openedAt.current ??= Date.now()
    setValues((current) => ({ ...current, [field]: value }))
    if (field in errors) {
      setErrors((current) => {
        const next = { ...current }
        delete next[field as InquiryField]
        return next
      })
    }
  }

  const focusField = (field: InquiryField) => {
    const target =
      field === 'interest'
        ? formRef.current?.querySelector<HTMLElement>('input[name="interest"]')
        : formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(field))}`)
    target?.focus()
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    const payload = buildPayload()
    const found = validateInquiry(payload)
    setErrors(found)
    if (hasErrors(found)) {
      focusField(Object.keys(found)[0] as InquiryField)
      return
    }

    setStatus({ state: 'submitting' })
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = (await response.json()) as InquiryResponse
      if (result.ok) {
        setStatus({ state: 'success' })
      } else if (result.code === 'invalid') {
        setErrors(result.errors ?? {})
        setStatus({ state: 'idle' })
        const first = Object.keys(result.errors ?? {})[0] as InquiryField | undefined
        if (first) focusField(first)
        return
      } else {
        setStatus({ state: 'error', code: result.code })
      }
    } catch {
      setStatus({ state: 'error', code: 'network' })
    }
    // Move focus to the result so screen-reader and keyboard users land on it.
    requestAnimationFrame(() => statusRef.current?.focus())
  }

  const mailtoHref = `mailto:${business.email}?subject=${encodeURIComponent(
    property ? `Inquiry: ${property.title}` : 'Website inquiry',
  )}&body=${encodeURIComponent(values.message)}`

  const transition = { duration: reduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] as const }

  return (
    <div className={cn('on-light', className)}>
      <AnimatePresence mode="wait" initial={false}>
        {status.state === 'success' ? (
          <motion.div
            key="success"
            ref={statusRef}
            tabIndex={-1}
            role="status"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="border border-line bg-mist p-8 outline-none sm:p-10"
          >
            <CircleCheck aria-hidden className="size-9 text-brand-blue" strokeWidth={1.25} />
            <h3 className="mt-5 text-display-sm text-navy-deep">Thank you — your message has been sent.</h3>
            <p className="mt-3 max-w-lg text-slate">
              We have received your inquiry and will be in touch. If your request is time-sensitive, please
              call{' '}
              <a href={`tel:${primaryPhone.e164}`} className="font-semibold text-navy-deep underline underline-offset-4">
                {primaryPhone.display}
              </a>
              .
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            aria-busy={submitting}
          >
            {/* Honeypot: hidden from people and assistive technology; bots tend to fill it. */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={id('company')}>Leave this field blank</label>
              <input
                id={id('company')}
                name="wi_confirm_blank"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.company}
                onChange={(event) => update('company', event.target.value)}
              />
            </div>

            <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
              {kind === 'contact' ? (
                <fieldset className="sm:col-span-2" aria-describedby={errors.interest ? id('interest-error') : undefined}>
                  <legend className="text-[0.8125rem] font-semibold text-navy-deep">
                    What can we help you with?
                    <span aria-hidden className="ml-0.5 text-brand-red">
                      *
                    </span>
                  </legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {inquiryInterests.map((interest) => {
                      const checked = values.interest === interest
                      return (
                        <label key={interest} className="relative block">
                          <input
                            type="radio"
                            name="interest"
                            value={interest}
                            checked={checked}
                            onChange={() => update('interest', interest)}
                            className="peer sr-only"
                          />
                          <span
                            className={cn(
                              'flex min-h-12 cursor-pointer items-center gap-3 border px-4 py-2.5 text-[0.875rem] font-medium transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-blue',
                              checked
                                ? 'border-navy-deep bg-navy-deep text-white'
                                : 'border-line bg-white text-ink hover:border-navy-deep/50',
                            )}
                          >
                            <span
                              aria-hidden
                              className={cn(
                                'size-2 shrink-0 rounded-full transition-colors',
                                checked ? 'bg-brand-red' : 'bg-line',
                              )}
                            />
                            {interestLabels[interest]}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                  {errors.interest ? (
                    <p id={id('interest-error')} className="mt-1.5 text-[0.8125rem] font-medium text-brand-red">
                      {errors.interest}
                    </p>
                  ) : null}
                </fieldset>
              ) : null}

              {kind === 'property' ? (
                <fieldset className="sm:col-span-2">
                  <legend className="text-[0.8125rem] font-semibold text-navy-deep">I would like to</legend>
                  <div className="mt-2 grid grid-cols-2 border border-line">
                    {(
                      [
                        { value: 'information', label: 'Request information' },
                        { value: 'tour', label: 'Schedule a tour' },
                      ] as const
                    ).map((option, i) => {
                      const checked = values.requestType === option.value
                      return (
                        <label key={option.value} className={cn('relative block', i > 0 && 'border-l border-line')}>
                          <input
                            type="radio"
                            name="requestType"
                            value={option.value}
                            checked={checked}
                            onChange={() => update('requestType', option.value)}
                            className="peer sr-only"
                          />
                          <span
                            className={cn(
                              'flex min-h-12 cursor-pointer items-center justify-center px-3 text-center text-[0.8125rem] font-semibold transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-blue',
                              checked ? 'bg-navy-deep text-white' : 'bg-white text-ink hover:bg-mist',
                            )}
                          >
                            {option.label}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              ) : null}

              <TextField
                id={id('name')}
                label="Name"
                name="name"
                autoComplete="name"
                required
                value={values.name}
                onChange={(event) => update('name', event.target.value)}
                error={errors.name}
                wrapperClassName={kind === 'property' ? 'sm:col-span-2' : undefined}
              />
              <TextField
                id={id('email')}
                label="Email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={values.email}
                onChange={(event) => update('email', event.target.value)}
                error={errors.email}
                wrapperClassName={kind === 'property' ? 'sm:col-span-2' : undefined}
              />
              <TextField
                id={id('phone')}
                label="Phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                optional
                value={values.phone}
                onChange={(event) => update('phone', event.target.value)}
                error={errors.phone}
                wrapperClassName={kind === 'management' ? undefined : 'sm:col-span-2'}
              />

              {kind === 'management' ? (
                <>
                  <TextField
                    id={id('propertyLocation')}
                    label="Property location"
                    name="propertyLocation"
                    placeholder="City or neighborhood"
                    required
                    value={values.propertyLocation}
                    onChange={(event) => update('propertyLocation', event.target.value)}
                    error={errors.propertyLocation}
                  />
                  <SelectField
                    id={id('propertyType')}
                    label="Property type"
                    name="propertyType"
                    required
                    value={values.propertyType}
                    onChange={(event) => update('propertyType', event.target.value)}
                    error={errors.propertyType}
                  >
                    <option value="">Select a type</option>
                    {managedPropertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </SelectField>
                  <TextField
                    id={id('unitCount')}
                    label="Approximate unit count"
                    name="unitCount"
                    inputMode="numeric"
                    placeholder="e.g. 1, 8, 24"
                    optional
                    value={values.unitCount}
                    onChange={(event) => update('unitCount', event.target.value)}
                    error={errors.unitCount}
                  />
                </>
              ) : null}

              <TextAreaField
                id={id('message')}
                label="Message"
                name="message"
                required={kind !== 'management'}
                optional={kind === 'management'}
                rows={kind === 'property' ? 4 : 5}
                value={values.message}
                onChange={(event) => update('message', event.target.value)}
                error={errors.message}
                wrapperClassName="sm:col-span-2"
              />
            </div>

            {property ? (
              <p className="mt-4 text-xs text-slate">
                Your inquiry will reference <span className="font-semibold text-ink">{property.title}</span>.
              </p>
            ) : null}

            <AnimatePresence initial={false}>
              {status.state === 'error' ? (
                <motion.div
                  key="error"
                  ref={statusRef}
                  tabIndex={-1}
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={transition}
                  className="overflow-hidden outline-none"
                >
                  <div className="mt-6 border border-brand-red/40 bg-[#fdf6f6] p-5">
                    <p className="flex items-start gap-3 font-semibold text-navy-deep">
                      <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-red" strokeWidth={1.75} />
                      {errorCopy[status.code].title}
                    </p>
                    <p className="mt-2 text-sm text-ink">{errorCopy[status.code].body}</p>
                    <ul className="mt-4 flex flex-col gap-x-6 gap-y-1 text-sm font-semibold text-navy-deep sm:flex-row sm:flex-wrap">
                      <li>
                        <a href={`tel:${primaryPhone.e164}`} className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4">
                          <Phone aria-hidden className="size-4" strokeWidth={1.75} />
                          {primaryPhone.display}
                        </a>
                      </li>
                      <li>
                        <a href={mailtoHref} className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4">
                          <Mail aria-hidden className="size-4" strokeWidth={1.75} />
                          Email {business.email}
                        </a>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" size="lg" disabled={submitting} className="sm:min-w-56">
                {submitting ? (
                  <span className="inline-flex items-center gap-3">
                    <LoaderCircle aria-hidden className="size-4 animate-spin" strokeWidth={2} />
                    Sending…
                  </span>
                ) : (
                  (submitLabel ?? 'Send Message')
                )}
              </Button>
              <p className="max-w-xs text-xs leading-relaxed text-slate">
                By submitting, you agree to be contacted about your inquiry. See our{' '}
                <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-navy-deep">
                  privacy policy
                </Link>
                .
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
