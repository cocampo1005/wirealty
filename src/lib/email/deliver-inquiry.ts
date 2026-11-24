import 'server-only'
import { business, siteUrl } from '@/content/business'
import { interestLabels, type InquiryPayload } from '@/lib/validation/inquiry'

/**
 * Inquiry email delivery (server-side only).
 *
 * Uses the Resend HTTP API directly, so no SDK dependency is needed. To use a
 * different provider (SMTP, SendGrid, Postmark…), replace the body of
 * `deliverInquiry` — the route handler only depends on the result type.
 *
 * Required environment variables:
 *   RESEND_API_KEY      API key (never exposed to the browser)
 *   INQUIRY_FROM_EMAIL  verified sender, e.g. "Weston International Realty <website@wirealty.us>"
 * Optional:
 *   INQUIRY_TO_EMAIL    recipient; defaults to the address in content/business.ts
 */

export type DeliveryResult =
  | { status: 'sent' }
  | { status: 'not_configured' }
  | { status: 'failed'; detail: string }

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.INQUIRY_FROM_EMAIL)
}

const kindLabels: Record<InquiryPayload['kind'], string> = {
  contact: 'Website inquiry',
  management: 'Property management consultation request',
  property: 'Property inquiry',
}

function rows(payload: InquiryPayload): [string, string][] {
  const list: [string, string | undefined][] = [
    ['Type', kindLabels[payload.kind]],
    ['Name', payload.name],
    ['Email', payload.email],
    ['Phone', payload.phone || undefined],
    ['Regarding', payload.interest ? interestLabels[payload.interest] : undefined],
    ['Request', payload.requestType === 'tour' ? 'Schedule a tour' : payload.requestType ? 'Request information' : undefined],
    ['Property', payload.propertyTitle],
    ['Property ID', payload.propertyId],
    ['Property location', payload.propertyLocation],
    ['Property type', payload.propertyType],
    ['Approx. units', payload.unitCount],
    ['Submitted from', `${siteUrl}${payload.pagePath}`],
  ]
  return list.filter((row): row is [string, string] => Boolean(row[1]))
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function deliverInquiry(payload: InquiryPayload): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.INQUIRY_FROM_EMAIL
  if (!apiKey || !from) return { status: 'not_configured' }

  const to = process.env.INQUIRY_TO_EMAIL || business.email
  const details = rows(payload)
  const subject = `${kindLabels[payload.kind]} — ${payload.name}${payload.propertyTitle ? ` — ${payload.propertyTitle}` : ''}`

  const textBody = [
    ...details.map(([label, value]) => `${label}: ${value}`),
    '',
    'Message:',
    payload.message || '(no message)',
  ].join('\n')

  const htmlBody = `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${details
    .map(
      ([label, value]) =>
        `<tr><td style="color:#5a6372;vertical-align:top"><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`,
    )
    .join('')}</table><p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap"><strong>Message</strong><br>${escapeHtml(
    payload.message || '(no message)',
  )}</p>`

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email,
        subject,
        text: textBody,
        html: htmlBody,
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) {
      return { status: 'failed', detail: `Provider responded ${response.status}: ${(await response.text()).slice(0, 300)}` }
    }
    return { status: 'sent' }
  } catch (error) {
    return { status: 'failed', detail: error instanceof Error ? error.message : 'Unknown error' }
  }
}
