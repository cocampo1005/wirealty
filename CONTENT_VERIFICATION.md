# Content Verification Checklist

Everything on this list needs confirmation or approval from Weston International Realty before the site goes live. Nothing unverified is shown on the public (production) site as fact: unverified items are either hidden, replaced with neutral wording, or listed here as proposed copy to approve.

**How to read the status column**

- **Hidden** — not rendered publicly until the flag noted is changed.
- **Live as drafted** — this text *will* appear publicly as written, so it must be read and approved.
- **Placeholder** — a stand-in asset that must be replaced.

Sources referenced: the current wirealty.us website (reviewed 23 Nov 2026) and the project brief.

---

## 1. Business facts — `src/content/business.ts`

| # | Item | What we have | Status | Action |
|---|---|---|---|---|
| 1.1 | **Years of experience** | Current site says "30+ Years of Experience" (home) **and** "over 25 years" (footer). | Hidden — public site says "decades" until confirmed | Confirm the figure; set `experience.years` and `experience.confirmed: true`. |
| 1.2 | **Broker license number** | Not published anywhere. | Not shown | Confirm against Florida DBPR; add to `licensing.brokerLicenseNumber`. |
| 1.3 | **Brokerage license number / registered name** | Not published. Site uses "Licensed Real Estate Broker • Florida". | Statement is live as on the current site | Confirm exact licensed brokerage name and number; confirm the footer line satisfies Florida advertising rules. |
| 1.4 | **Broker's title** | Brief says German Ocampo is the principal broker; the current site never attaches a title to his name. | Live as "Principal Broker" | Confirm the exact title to display. |
| 1.5 | **Phone numbers** | (786) 246-4160 (labeled with German's name on the current site) and (305) 907-9543 (unlabeled). | Live | Confirm both are current and how each should be labeled (office / mobile). |
| 1.6 | **Email** | gocampo@wirealty.us | Live | Confirm; also decide the address that receives website inquiries. |
| 1.7 | **Office address** | None published; only "South Florida". | Not shown | Decide whether a street address should appear (also improves local search results). |
| 1.8 | **Business hours** | None published. | Not shown | Supply if they should be displayed. |
| 1.9 | **Service area** | Brief: Miami-Dade, Broward, Palm Beach. Current site says only "South Florida". | Live (counties named in several places) | Confirm all three counties are served. |
| 1.10 | **Social links** | Facebook, Instagram, LinkedIn URLs from the current site. | Live | Confirm each account is active and official. |
| 1.11 | **REALTOR® / association membership** | Not confirmed; none shown on the current site. | Hidden (`verified: false`) | Supply the local board and any designations; only then may names or logos be shown. |
| 1.12 | **Equal Housing Opportunity statement / logo** | Not on the current site. | Not shown | Recommended for real-estate advertising — confirm and supply approved artwork. |
| 1.13 | **Languages spoken** | Not stated. | Not shown | Supply if relevant. |

## 2. Broker profile — `src/content/business.ts`, About page, home "Meet the Broker"

| # | Item | Status | Action |
|---|---|---|---|
| 2.1 | **Professional portrait** | Placeholder panel (logo mark + name) | Supply an approved portrait; set `broker.portrait`. |
| 2.2 | **Biography** | Live as drafted — limited to: he leads the firm, works directly with clients, and has experience across residential, commercial and property management. No career history is claimed. | Approve the wording; supply a fuller approved bio (career background, education, specialties) if wanted. |
| 2.3 | **"Clients are not passed between departments / the broker who takes the first call sees the transaction through"** | Live as drafted (About) | Confirm this reflects how the firm actually operates. |
| 2.4 | **Values** (Professionalism, Transparency, Personal Service, Local Knowledge) | Live as drafted (About) | Approve. |
| 2.5 | Statement beside the portrait: *"A personal, direct relationship — from the first conversation to closing, and beyond."* | Live as drafted (home). It is presented as the firm's approach, not as a quotation from German. | Approve. |

## 3. Testimonials — `src/content/testimonials.ts`

Four testimonials are reproduced **verbatim from the current homepage**. They are **hidden** on the public site until each is marked `approved: true`.

| # | Attributed to | Action |
|---|---|---|
| 3.1 | Juan Carlos Clavijo, ICON Group USA | Confirm it is genuine, correctly attributed, and that the person consents to publication. |
| 3.2 | Juan Garcia, Real Estate Investor | Same. |
| 3.3 | Mark Jessub, Engineering Contractor | Same (note the quote refers to "Wirealty"). |
| 3.4 | Diana Gonzales, Retail Manager | Same. |

Note: two testimonials mention outcomes ("Occupancy has stayed strong"). Keep them only as the clients' own words; the site makes no such claims itself.

## 4. Portfolio — `src/content/portfolio.ts`

**All six records are draft samples and are hidden publicly.** The public Portfolio page currently shows a "being prepared" message.

For each real transaction, supply: property name/address as it may be shown, city, property type, role (buyer / seller / landlord / tenant representation), transaction type, year, a short approved description, photographs the brokerage may publish, and — only if verified **and** the client authorizes it — the price. Set `state: 'published'`.

Also approve this live sentence used to introduce the portfolio: *"Our portfolio documents properties we have sold, acquired and leased on behalf of clients across South Florida."*

## 5. Featured opportunities — `src/content/featured-properties.ts`

Three **sample** entries built from development fixtures; hidden publicly. Supply real featured opportunities (with publishable details and approved photography) or leave the section in its "contact us" state.

## 6. Listings

- The 14 properties in `src/lib/properties/fixtures.ts` are **fictional development data** with deliberately fake street names. They never appear on the public site and are excluded from the sitemap.
- The public Listings page shows an "online property search is being connected" message until an MLS feed is integrated (`MLS_INTEGRATION.md`).
- The current website embeds an MLS Matrix IDX frame. Decide whether to keep an interim embed/link until the new integration is ready.

## 7. Service copy — `src/content/services.ts`

Verbatim from the current site (no action beyond a read-through): commercial page heading, lead, both introduction paragraphs, and the Multifamily / Retail / Industrial descriptions.

**Proposed copy — live as drafted, needs approval:**

| # | Where | Content |
|---|---|---|
| 7.1 | Commercial types | Descriptions for **Warehouses, Office, Mixed-Use** (the current site lists these categories without descriptions). |
| 7.2 | Commercial → "Who we work with" | Four audience descriptions (investors & buyers, property owners, businesses, existing owners). |
| 7.3 | Commercial → "Why Weston" | Four reasons, including "you work directly with an experienced broker" and "continuity after closing". |
| 7.4 | Commercial FAQs | Six questions/answers — especially "Do you represent buyers and tenants as well as owners?" and the statement that the firm does not give legal, tax or financing advice. |
| 7.5 | Property management services | The five service descriptions. Titles come from the brief; descriptions are new. |
| 7.6 | Property management → "Why choose Weston" | Three reasons. |
| 7.7 | Property management **process** | Four illustrative steps (consultation → review → proposed approach → onboarding). **This is draft marketing copy, not a confirmed operating procedure** — confirm or rewrite. |
| 7.8 | Property management FAQs | Six questions/answers, including "you do not need to have purchased through us" and that terms are discussed after a consultation. |
| 7.9 | Property management overview | "Owning property should not mean being on call for it…" paragraph and "There is no obligation." beside the form. |
| 7.10 | Residential (home) | "Homes and Condos Across South Florida" section copy; "Buy / Sell / Rent" summary. Confirm the firm handles residential rentals. |
| 7.11 | Homepage | Hero headline and supporting line (from the brief); credibility markers "Licensed", "Tri-County", "Full-Cycle — acquire, lease, sell & manage with one firm". |

**Not claimed anywhere (confirm before adding):** tenant/owner portals, 24/7 emergency maintenance, legal or eviction services, guaranteed occupancy/returns, management pricing or packages, financing, underwriting or investment advisory services, transaction totals or sales volume, awards, ratings.

## 8. Areas — `src/content/communities.ts`

| # | Item | Status | Action |
|---|---|---|---|
| 8.1 | Cities shown: Weston, Plantation, Davie, Fort Lauderdale, Hollywood, Miami | Live | Confirm each is actually served; add or remove cities as needed. |
| 8.2 | County and city descriptions | Live as drafted | Approve. They contain general geography only — no statistics, yields, demographics or projections. |
| 8.3 | Palm Beach County | Live, with no city pages | Confirm it should be presented as a service area. |

## 9. Photography — `src/content/images.ts`

**Every photograph on the site is a placeholder** under the free Unsplash License (credits and source links: `public/images/placeholder/credits.json`). None shows a Weston listing or transaction.

| # | Note | Action |
|---|---|---|
| 9.1 | All 40 images | Replace with approved brokerage photography (actual represented properties first), or approve specific placeholders for launch. |
| 9.2 | Weston, Plantation and Davie pages | Use the Broward County (Fort Lauderdale skyline) photo because no verified local image is available. Supply local photographs. |
| 9.3 | `management-hero`, `type-mixed-use`, `sample-mixed-use-1` | Likely not photographed in Florida. Replace before launch. |
| 9.4 | `type-retail`, `sample-retail-1` | Show real street scenes with small signage/people. Replace before launch. |
| 9.5 | Current-site images | The five photos on today's site have unknown licensing (their names suggest stock). Not reused. Confirm rights if any should carry over. |

## 10. Brand assets

| # | Item | Action |
|---|---|---|
| 10.1 | **Logo wordmark** | `assets/wirealty-horizontal-logo.svg` sets "Weston International Realty" as live *Trajan Pro* text, which browsers cannot render without the font. The site therefore uses the authentic vector **mark** plus a wordmark typeset in Cinzel (`src/components/ui/logo.tsx`). Supply a logo SVG with the text converted to outlines to use the exact artwork. |
| 10.2 | Mark on dark backgrounds | Shown as the red mark on a white disc (as in the supplied icon). Approve, or supply a reversed version. |
| 10.3 | Social sharing image | `public/og-default.jpg` was generated from the placeholder hero photo. Regenerate once final photography and logo are approved. |

## 11. Legal

| # | Item | Status | Action |
|---|---|---|---|
| 11.1 | **Privacy policy** | Live as drafted | Legal review; add an effective date. Describes forms, local-only favorites and no analytics. |
| 11.2 | Form consent line | Live ("By submitting, you agree to be contacted about your inquiry.") | Approve. |
| 11.3 | Florida brokerage advertising requirements | — | Confirm the licensed brokerage name appears as required wherever the firm is advertised. |
| 11.4 | MLS display rules | — | Attribution, disclaimers and field restrictions depend on the MLS/provider chosen. See `MLS_INTEGRATION.md`. |
| 11.5 | Listing disclaimer | Live wording for non-MLS listings: "Information is believed to be reliable but is not guaranteed and should be independently verified." | Approve. |

## 12. Technical items needing credentials or decisions

- Email delivery provider and sender address (forms report "not sent" until configured).
- Hosting plan with Node.js support (see README → Deployment).
- Redirects from old URLs and Search Console verification for the new site.
- Whether analytics will be used (requires a privacy-policy update).
