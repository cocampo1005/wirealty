# Weston International Realty — Website

Commercial-first brokerage website for Weston International Realty (South Florida): commercial real estate, residential listings and property management.

Built with Next.js 16 (App Router, React 19, TypeScript), Tailwind CSS 4, Motion and Lucide icons.

> **Before launch, read [`CONTENT_VERIFICATION.md`](./CONTENT_VERIFICATION.md).** The site is built to never show invented listings, transactions, reviews or credentials — but several real business facts and assets still have to be supplied and approved.

---

## Quick start

Requirements: **Node.js 20.9 or newer** and npm.

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server, Turbopack (sample content **on** — see below) |
| `npm run dev:webpack` | Development server using Webpack, matching the production bundler |
| `npm run build` | Production build with Webpack (`next build --webpack`) |
| `npm start` | Serves the production build (`PORT` env var sets the port) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates route types and runs `tsc --noEmit` |
| `npm run build:map` | Regenerates the regional map geometry from U.S. Census data |

## Environment variables

Copy `.env.example` to `.env.local`. Nothing is required to run locally.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public origin for canonical URLs, sitemap and Open Graph tags. Defaults to `https://wirealty.us`. |
| `NEXT_PUBLIC_SHOW_SAMPLE_CONTENT` | `true` / `false`. Overrides the sample-content default (see below). |
| `RESEND_API_KEY` | Server-only key for inquiry email delivery ([Resend](https://resend.com)). |
| `INQUIRY_FROM_EMAIL` | Verified sender, e.g. `Weston International Realty <website@wirealty.us>`. |
| `INQUIRY_TO_EMAIL` | Recipient. Defaults to the email in `src/content/business.ts`. |

`NEXT_PUBLIC_*` values are inlined at **build** time — rebuild after changing them.

## Sample content vs. the public site

The design needs realistic content to be reviewed, but none of it may reach the public. One switch controls this (`src/lib/site-mode.ts`):

| | `npm run dev` | Production build |
|---|---|---|
| Default | Sample content **ON** | Sample content **OFF** |
| Override | `NEXT_PUBLIC_SHOW_SAMPLE_CONTENT=false` | `NEXT_PUBLIC_SHOW_SAMPLE_CONTENT=true` (private previews / staging only) |

With sample content **ON** you see development listing fixtures, draft portfolio records, unapproved testimonials, the unconfirmed "30+ years" figure and placeholder slots — each labeled with a red dashed "Sample" / "Preview only" marker — and `robots.txt` blocks all crawling.

With it **OFF** (the public site) those items are not rendered at all. Each section falls back to an intentional state instead:

- **Listings** → "property search is being connected" panel with direct contact paths
- **Featured opportunities / Portfolio** → an invitation to get in touch
- **Testimonials** → section omitted
- **Experience** → "decades of experience" wording instead of a number

To preview exactly what the public would see while developing: `NEXT_PUBLIC_SHOW_SAMPLE_CONTENT=false npm run dev`.

## Editing content

All business content lives in `src/content/` — components contain no hard-coded business facts.

| File | Contains |
|---|---|
| `business.ts` | Name, broker, phones, email, social links, licensing line, experience figure, credentials |
| `navigation.ts` | Header and footer navigation |
| `services.ts` | Commercial property types, audiences, reasons, management services, process, all FAQs |
| `communities.ts` | Counties and cities for the regional explorer and `/areas` pages |
| `portfolio.ts` | Completed transactions (`state: 'published' \| 'draft'`) |
| `featured-properties.ts` | Hand-curated featured opportunities (`state: 'published' \| 'sample'`) |
| `testimonials.ts` | Testimonials (`approved: true` to publish) |
| `images.ts` | Photography registry (every entry is currently a licensed placeholder) |

Comments in those files mark where each fact came from: `[SITE]` (current wirealty.us), `[BRIEF]`, `[DRAFT]` (proposed copy awaiting approval) and `[CONFIRM]` (must be verified).

Common tasks:

- **Confirm the experience figure** — set `experience.years` and `experience.confirmed: true` in `business.ts`.
- **Add a license number / credential** — fill `licensing` or add to `credentials` with `verified: true`.
- **Publish a testimonial** — set `approved: true`.
- **Publish a portfolio transaction** — add a record with `state: 'published'` (price only when verified and authorized).
- **Add the broker portrait** — put the file in `public/images/` and set `broker.portrait` to its path.
- **Replace a photograph** — add the file under `public/images/` and update its entry in `images.ts`.

## Project structure

```text
src/
  app/                    Routes (App Router)
    page.tsx              Home
    commercial/ property-management/ about/ contact/ privacy-policy/
    listings/             Search, [slug] detail, saved/
    portfolio/            Grid and [slug] case study
    areas/                Regional explorer and [slug] area guides
    api/inquiries/        Form endpoint (validation, spam checks, email delivery)
    api/properties/       Resolves saved-property ids
    sitemap.ts robots.ts not-found.tsx error.tsx
  proxy.ts                Returns real 404s for unknown detail URLs
  components/
    layout/               Header, mobile menu, footer, page hero, closing CTA
    home/                 Homepage sections (hero, credibility, featured, …)
    listings/             Cards, filters, map view, gallery, favorites
    portfolio/ maps/ forms/ ui/
  content/                Business content (see above) and generated map geometry
  lib/
    properties/           Property model, repository, fixtures, search, URL contract
    email/ validation/ seo/ geo/ utils/
  hooks/                  localStorage stores (favorites, saved searches), modal behavior
scripts/build-map-data.mjs  Map geometry generator
assets/                   Source brand files
```

### Design system

Tokens are defined in `src/app/globals.css` (`@theme`): brand red `#B21F25`, brand blue `#1F4C8F`, ink `#262626`, plus supporting navy / mist / line neutrals. Type utilities: `text-display-xl|lg|md|sm` (Cinzel), `text-eyebrow`, `text-label`, `text-lead` (Montserrat). Layout utilities: `container-wi`, `section-y`.

Every page opens with a dark hero band (`<PageHero>` or the home `<Hero>`) because the header is transparent until the page scrolls — keep that when adding routes.

### Listings architecture

`/listings` reads its state from the URL (`?category=…&type=…&location=…`), so searches are shareable and server-rendered. Data comes from a `PropertyRepository` (`src/lib/properties/repository.ts`); today that is either the development fixtures or an empty repository. See [`MLS_INTEGRATION.md`](./MLS_INTEGRATION.md).

Favorites and saved searches are stored in the visitor's browser only (`localStorage`); there are no accounts.

### Regional map

County boundaries are U.S. Census Bureau cartographic boundary files (2023, 1:500,000, public domain), projected to SVG by `scripts/build-map-data.mjs` into `src/content/geo/south-florida.ts`. The generated file is committed; re-run `npm run build:map` only to change the map's size or extent. The map does not depend on any tile provider or on the MLS feed.

## Forms and email

All forms post to `POST /api/inquiries`, which validates the payload, applies a honeypot and timing check, rate-limits per address (in-memory, per server instance) and sends the email through Resend.

The form only shows "sent" after the provider accepts the message. **Until `RESEND_API_KEY` and `INQUIRY_FROM_EMAIL` are set, every submission shows an explicit "not sent" message with the phone number and a pre-filled email link** — a lead is never dropped silently. To use a different provider (for example the SMTP mailbox that comes with the domain), replace the body of `deliverInquiry()` in `src/lib/email/deliver-inquiry.ts`.

## Deployment

This is a **Node.js application**, not a static site. It needs a host that can run `next start`:

1. Node.js **20.9+**
2. `npm ci && npm run build` — the build uses **Webpack**, not Turbopack (see below)
3. `npm start` as a long-running process (set `PORT` if required), behind HTTPS
4. Environment variables from the table above

**Why Webpack:** Turbopack requires Next's native SWC binary, which needs glibc 2.30+. Hostinger's build servers ship an older glibc, so the build runs with `--webpack`, which can fall back to the bundled WebAssembly compiler (`@next/swc-wasm-nodejs`). For the same reason the config file is plain JavaScript (`next.config.mjs`), Tailwind CSS runs through PostCSS (`postcss.config.mjs`), and the packages needed at build time (Tailwind, TypeScript, type definitions) are regular `dependencies` so they install even when dev dependencies are skipped.

Server features in use: the inquiry endpoint, request-time listing search, the 404 proxy and on-demand image optimization.

**Hostinger:** the current domain is hosted there, but do not assume the existing plan can run a Node.js server — classic shared/WordPress plans cannot. Confirm one of the following before launch:

- the plan includes Node.js web-app hosting, or upgrade to one that does; **or**
- use a Hostinger VPS and run the app with a process manager (e.g. PM2) behind a reverse proxy; **or**
- host the app on a Next.js-native platform (e.g. Vercel) and point the domain's DNS at it, keeping email on Hostinger.

A fully static export (`output: 'export'`) is **not** supported as-is: it would remove the form endpoint, URL-driven search, the 404 proxy and image optimization.

Also confirm before launch: `NEXT_PUBLIC_SITE_URL` is the final origin, redirects from old WordPress URLs are in place (`/commercial/`, `/property-management/`, `/listings/`, `/about/`, `/contact/` map 1:1), and email DNS (SPF/DKIM) is set for the sending domain.

## Unconfigured integrations and launch requirements

| Item | Status |
|---|---|
| Inquiry email delivery | Not configured — needs `RESEND_API_KEY` + `INQUIRY_FROM_EMAIL` (or another provider) |
| MLS listing feed | Not selected / not connected — see `MLS_INTEGRATION.md` |
| Street-level listing maps | Not included — choose a map provider together with the MLS feed |
| Analytics | None installed (update the privacy policy if added) |
| Brand logo file | Header uses the authentic mark + a Cinzel wordmark; an outlined logo SVG is needed (see verification doc) |
| Photography | All placeholders — replace with approved brokerage images |
| Business facts, bio, credentials, testimonials, portfolio | Awaiting client confirmation — see `CONTENT_VERIFICATION.md` |
| Privacy policy | Draft — needs legal review |
| Hosting | Confirm Node.js support (above) |

## Notes for developers

- Next.js 16 with **Cache Components** and **Partial Prefetching** enabled (`next.config.mjs`). Request-time data (`searchParams`, `params` on detail pages) is read inside `<Suspense>`; client components that read the pathname are wrapped the same way (`components/layout/nav-link.tsx`). The bundled docs are in `node_modules/next/dist/docs/`.
- Detail pages stream, so a missing record would otherwise return HTTP 200 with a `noindex` tag. `src/proxy.ts` checks the slug first and returns a real 404.
- Scroll reveals (`components/ui/reveal.tsx`) are CSS-driven and only hide content when JavaScript is running; all motion respects `prefers-reduced-motion`.
