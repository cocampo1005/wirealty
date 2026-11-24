import { deliverInquiry } from '@/lib/email/deliver-inquiry'
import {
  hasErrors,
  normalizeInquiry,
  validateInquiry,
  type InquiryResponse,
} from '@/lib/validation/inquiry'

/**
 * POST /api/inquiries — receives every form on the site.
 *
 * The response always states what actually happened: `ok: true` is returned
 * only after the email provider has accepted the message. If delivery is not
 * configured or fails, the form shows an explicit error with direct contact
 * details, so a lead is never lost silently.
 */

// Basic in-memory rate limit: 5 submissions per 10 minutes per client address.
// This is per server instance; add a shared store (or a WAF rule) if the site
// is ever deployed across multiple instances.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const attempts = new Map<string, number[]>()

function isRateLimited(key: string, now: number): boolean {
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    attempts.set(key, recent)
    return true
  }
  recent.push(now)
  attempts.set(key, recent)
  // Opportunistic cleanup so the map cannot grow without bound.
  if (attempts.size > 5000) {
    for (const [k, times] of attempts) {
      if (times.every((time) => now - time >= WINDOW_MS)) attempts.delete(k)
    }
  }
  return false
}

function json(body: InquiryResponse, status: number): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, code: 'invalid' }, 400)
  }

  const payload = normalizeInquiry(body)

  // Honeypot / implausibly fast submission: accept and discard without sending.
  // Automated senders get no signal; real visitors never trigger this.
  if (payload.company || (payload.elapsedMs !== undefined && payload.elapsedMs < 1500)) {
    return json({ ok: true }, 200)
  }

  const errors = validateInquiry(payload)
  if (hasErrors(errors)) return json({ ok: false, code: 'invalid', errors }, 422)

  const client = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(client, Date.now())) return json({ ok: false, code: 'rate_limited' }, 429)

  const result = await deliverInquiry(payload)

  if (result.status === 'sent') return json({ ok: true }, 200)

  if (result.status === 'not_configured') {
    console.warn('[inquiries] Email delivery is not configured (RESEND_API_KEY / INQUIRY_FROM_EMAIL). Inquiry was NOT sent.')
    return json({ ok: false, code: 'not_configured' }, 503)
  }

  console.error(`[inquiries] Delivery failed: ${result.detail}`)
  return json({ ok: false, code: 'delivery_failed' }, 502)
}
