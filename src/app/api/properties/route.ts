import { getPropertyRepository } from '@/lib/properties/repository'

/**
 * GET /api/properties?ids=a,b,c
 *
 * Resolves saved-property ids (kept in the visitor's browser) to current
 * listing data. Ids that no longer exist are simply absent from the response,
 * which lets the Saved page flag them as unavailable.
 */
export async function GET(request: Request): Promise<Response> {
  const ids = (new URL(request.url).searchParams.get('ids') ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => /^[\w-]{1,80}$/.test(id))
    .slice(0, 50)

  const properties = ids.length > 0 ? await getPropertyRepository().getByIds(ids) : []
  return Response.json({ properties }, { headers: { 'Cache-Control': 'no-store' } })
}
