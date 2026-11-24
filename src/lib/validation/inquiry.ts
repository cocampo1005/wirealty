/**
 * Inquiry payload + validation, shared by the browser form and the
 * /api/inquiries route so both apply exactly the same rules.
 */

export const inquiryInterests = ['commercial', 'residential', 'management', 'general'] as const
export type InquiryInterest = (typeof inquiryInterests)[number]

export const interestLabels: Record<InquiryInterest, string> = {
  commercial: 'Commercial real estate',
  residential: 'Residential buying / selling',
  management: 'Property management',
  general: 'General inquiry',
}

export const managedPropertyTypes = [
  'Single-family home',
  'Condo / townhouse',
  'Multifamily building',
  'Retail',
  'Office',
  'Industrial / warehouse',
  'Mixed-use',
  'Other',
] as const

export type InquiryKind = 'contact' | 'management' | 'property'

export interface InquiryPayload {
  kind: InquiryKind
  name: string
  email: string
  phone: string
  message: string
  /** contact */
  interest?: InquiryInterest
  /** management */
  propertyLocation?: string
  propertyType?: string
  unitCount?: string
  /** property */
  requestType?: 'information' | 'tour'
  propertyId?: string
  propertyTitle?: string
  /** context */
  pagePath: string
  /** Honeypot — must stay empty. Real visitors never see this field. */
  company?: string
  /** Milliseconds the form was open before submitting (basic bot signal). */
  elapsedMs?: number
}

export type InquiryField =
  | 'name'
  | 'email'
  | 'phone'
  | 'message'
  | 'interest'
  | 'propertyLocation'
  | 'propertyType'
  | 'unitCount'

export type InquiryErrors = Partial<Record<InquiryField, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const limits = {
  name: 100,
  email: 160,
  phone: 40,
  message: 4000,
  propertyLocation: 160,
  propertyType: 60,
  unitCount: 20,
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

/** Coerces unknown input (e.g. a parsed JSON body) into a clean payload. */
export function normalizeInquiry(input: unknown): InquiryPayload {
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>
  const kind: InquiryKind = raw.kind === 'management' || raw.kind === 'property' ? raw.kind : 'contact'
  const interest = inquiryInterests.find((value) => value === raw.interest)
  return {
    kind,
    name: text(raw.name, limits.name),
    email: text(raw.email, limits.email),
    phone: text(raw.phone, limits.phone),
    message: text(raw.message, limits.message),
    interest,
    propertyLocation: text(raw.propertyLocation, limits.propertyLocation) || undefined,
    propertyType: text(raw.propertyType, limits.propertyType) || undefined,
    unitCount: text(raw.unitCount, limits.unitCount) || undefined,
    requestType: raw.requestType === 'tour' ? 'tour' : raw.requestType === 'information' ? 'information' : undefined,
    propertyId: text(raw.propertyId, 80) || undefined,
    propertyTitle: text(raw.propertyTitle, 200) || undefined,
    pagePath: text(raw.pagePath, 300) || '/',
    company: text(raw.company, 200) || undefined,
    elapsedMs: typeof raw.elapsedMs === 'number' && Number.isFinite(raw.elapsedMs) ? raw.elapsedMs : undefined,
  }
}

export function validateInquiry(payload: InquiryPayload): InquiryErrors {
  const errors: InquiryErrors = {}

  if (payload.name.length < 2) errors.name = 'Please enter your name.'
  if (!payload.email) errors.email = 'Please enter your email address.'
  else if (!EMAIL.test(payload.email)) errors.email = 'Please enter a valid email address.'

  if (payload.phone) {
    const digits = payload.phone.replace(/\D/g, '')
    if (digits.length < 7 || digits.length > 15) errors.phone = 'Please enter a valid phone number.'
  }

  if (payload.kind === 'contact' && !payload.interest) {
    errors.interest = 'Please choose what your inquiry is about.'
  }

  if (payload.kind === 'management') {
    if (!payload.propertyLocation) errors.propertyLocation = 'Please tell us where the property is located.'
    if (!payload.propertyType) errors.propertyType = 'Please select a property type.'
    // Message is optional for management consultations.
  } else if (payload.message.length < 10) {
    errors.message = 'Please add a short message (at least 10 characters).'
  }

  return errors
}

export function hasErrors(errors: InquiryErrors): boolean {
  return Object.keys(errors).length > 0
}

/** Response contract of POST /api/inquiries. */
export type InquiryResponse =
  | { ok: true }
  | {
      ok: false
      /**
       * invalid         — field errors are included
       * not_configured  — email delivery has not been set up on the server
       * delivery_failed — the provider rejected or failed the send
       * rate_limited    — too many attempts from this address
       */
      code: 'invalid' | 'not_configured' | 'delivery_failed' | 'rate_limited'
      errors?: InquiryErrors
    }
