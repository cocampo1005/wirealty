import { mapProjection } from '@/content/geo/south-florida'

/**
 * Projects a latitude/longitude onto the regional SVG map, using the same
 * Mercator parameters the county geometry was generated with.
 */
export function projectPoint({ lat, lng }: { lat: number; lng: number }): { x: number; y: number } {
  const lambda = (lng * Math.PI) / 180
  const phi = (lat * Math.PI) / 180
  const [tx, ty] = mapProjection.translate
  // Rounded so server and browser floating-point results always agree.
  const round = (n: number) => Math.round(n * 10) / 10
  return {
    x: round(mapProjection.scale * lambda + tx),
    y: round(-mapProjection.scale * Math.log(Math.tan(Math.PI / 4 + phi / 2)) + ty),
  }
}
