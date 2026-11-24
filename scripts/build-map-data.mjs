/**
 * Generates src/content/geo/south-florida.ts — the projected SVG geometry used by
 * the regional explorer and the listings locator map.
 *
 * Source: U.S. Census Bureau, Cartographic Boundary Files (2023, 1:500,000),
 * cb_2023_us_county_500k — public domain.
 * https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html
 *
 * Usage: npm run build:map   (downloads the shapefile into .cache/geo on first run)
 *
 * The generated file is committed, so this script only needs to be re-run when the
 * map extent, size, or simplification settings change.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { geoMercator, geoPath, geoCentroid } from 'd3-geo'
import * as shapefile from 'shapefile'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const cacheDir = join(root, '.cache', 'geo')
const shp = join(cacheDir, 'cb_2023_us_county_500k.shp')
const SOURCE_URL =
  'https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_us_county_500k.zip'

if (!existsSync(shp)) {
  mkdirSync(cacheDir, { recursive: true })
  const zip = join(cacheDir, 'county.zip')
  execFileSync('curl', ['-sL', '-o', zip, SOURCE_URL], { stdio: 'inherit' })
  execFileSync('unzip', ['-o', '-q', zip, '-d', cacheDir], { stdio: 'inherit' })
}

// County FIPS (GEOID) → slug used across the site.
const FOCUS = {
  12099: 'palm-beach-county',
  12011: 'broward-county',
  12086: 'miami-dade-county',
}

const WIDTH = 640
// Extra room on the right (Atlantic side) for city labels.
const PAD_LEFT = 40
const PAD_RIGHT = 170
const PAD_Y = 28
const MIN_STEP = 0.55 // px — points closer than this to the previous kept point are dropped

const { features } = await shapefile.read(shp, shp.replace(/\.shp$/, '.dbf'))
const florida = features.filter((f) => f.properties.STATEFP === '12')
const focus = florida.filter((f) => FOCUS[f.properties.GEOID])
if (focus.length !== 3) throw new Error('Expected three focus counties')

const collection = { type: 'FeatureCollection', features: focus }
const projection = geoMercator().fitWidth(WIDTH - PAD_LEFT - PAD_RIGHT, collection)
const [[x0, y0], [, y1]] = geoPath(projection).bounds(collection)
const [tx, ty] = projection.translate()
projection.translate([tx - x0 + PAD_LEFT, ty - y0 + PAD_Y])
const HEIGHT = Math.ceil(y1 - y0 + PAD_Y * 2)

const round = (n) => Math.round(n * 10) / 10

function ringToPath(ring) {
  const pts = []
  for (const coord of ring) {
    const [x, y] = projection(coord)
    const last = pts[pts.length - 1]
    if (!last || Math.hypot(x - last[0], y - last[1]) >= MIN_STEP) pts.push([x, y])
  }
  if (pts.length < 3) return ''
  return 'M' + pts.map(([x, y]) => `${round(x)},${round(y)}`).join('L') + 'Z'
}

function inView(ring) {
  return ring.some((coord) => {
    const [x, y] = projection(coord)
    return x >= -20 && x <= WIDTH + 20 && y >= -20 && y <= HEIGHT + 20
  })
}

function featureToPath(feature, { clip = false } = {}) {
  const polygons =
    feature.geometry.type === 'Polygon'
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates
  return polygons
    .filter((polygon) => !clip || inView(polygon[0]))
    .map((polygon) => polygon.map(ringToPath).join(''))
    .join('')
}

const counties = focus
  .map((f) => {
    const [cx, cy] = projection(geoCentroid(f))
    return {
      slug: FOCUS[f.properties.GEOID],
      fips: f.properties.GEOID,
      name: f.properties.NAMELSAD,
      path: featureToPath(f),
      centroid: [round(cx), round(cy)],
    }
  })
  .sort((a, b) => a.centroid[1] - b.centroid[1])

const context = florida
  .filter((f) => !FOCUS[f.properties.GEOID])
  .map((f) => ({ name: f.properties.NAME, path: featureToPath(f, { clip: true }) }))
  .filter((c) => c.path)

const out = `// GENERATED FILE — do not edit by hand. Run \`npm run build:map\` to regenerate.
// Source: U.S. Census Bureau Cartographic Boundary Files, 2023, 1:500,000 (public domain).
// Geometry is projected (Web Mercator) into the SVG viewBox below.

export const mapViewBox = { width: ${WIDTH}, height: ${HEIGHT} } as const

/** Mercator parameters used to place latitude/longitude points on the map. */
export const mapProjection = {
  scale: ${projection.scale()},
  translate: [${projection.translate().join(', ')}],
} as const

export interface CountyShape {
  slug: string
  fips: string
  name: string
  path: string
  centroid: readonly [number, number]
}

export const countyShapes: readonly CountyShape[] = ${JSON.stringify(counties, null, 2)}

/** Neighboring Florida counties, drawn faintly for geographic context. */
export const contextShapes: readonly { name: string; path: string }[] = ${JSON.stringify(context, null, 2)}
`

const target = join(root, 'src', 'content', 'geo', 'south-florida.ts')
mkdirSync(dirname(target), { recursive: true })
writeFileSync(target, out)
console.log(
  `Wrote ${target} (${(out.length / 1024).toFixed(1)} KB) — viewBox ${WIDTH}×${HEIGHT}; context: ${context.map((c) => c.name).join(', ')}`,
)
