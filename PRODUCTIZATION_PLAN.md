# Productization Plan

Goal: ship a minimal, sellable MicroGallery workflow from curated image to successful payment and fulfillment handoff, while preserving canonical schema discipline.

## Current Position

- Canonical schema, validators, adapters, and governance are in place.
- microAlbum has read/write boundary validation.
- wallgallery has API boundary validation for hotspots.
- Commerce flow is architected but not yet operational.

## Decision Rules (Locked)

- `microAlbum` is the source of truth for saleable inventory metadata.
- `wallgallery` is the first customer-facing buy-flow host.
- Channel pricing and offer shape may differ by surface (for example framed wallgallery offers vs unframed or custom-size offers from microAlbum).
- `wallgallery` offer files are treated as derived channel projections, not the long-term inventory source of truth.
- Canonical schema in `MicroGallery/schema` remains the contract between systems.

## Execution Sequence

Run phases in order. Do not begin a phase until all exit criteria in the previous phase are met.

1. P0: Schema Delta Pack for Productization
2. P1: MVP Sell Path (manual Square links)
3. P2: Promotion Pipeline (microAlbum to MicroGallery)
4. P3: Commerce Boundary Function
5. P4: Order Signal and Fulfillment Queue
6. P5: Operational Hardening

## P0 - Schema Delta Pack (Required First)

Objective: align canonical schemas with architecture assumptions before building commerce features.

Tasks:

- [x] Resolve status vocabulary: `finished` input is normalized to canonical `ready`.
- [x] Add optional `checkoutUrl` on `ProductVariant` for Level 1 manual Square links.
- [x] Add explicit fulfillment-state field on `OrderRecord`.
- [x] Tighten hotspot validation constraints to match API boundary behavior.
- [x] Confirm and document money conversion rule: external dollars to canonical `priceMinor` cents.
- [x] Update `schema/entities.ts`, `schema/validators.ts`, `schema/adapters.ts`, and tests.

Primary repos/files:

- `MicroGallery/schema/entities.ts`
- `MicroGallery/schema/validators.ts`
- `MicroGallery/schema/adapters.ts`
- `MicroGallery/schema/*.test.ts`

Exit criteria:

- [x] All schema delta tests pass.
- [x] Canonical contracts cover Level 1 checkout-link flow.
- [x] Architecture language and canonical enums/fields are reconciled.

## P1 - MVP Sell Path (Manual Square Links)

Objective: enable real purchases quickly with the least new code.

Tasks:

- [x] Pick one pilot item and 2-3 variants. _(Mountain Ash 8×10 — Step 1)_
- [x] Store manual Square payment link per variant in commerce metadata. _(products.json — Step 2)_
- [x] Load gallery-items.json and products.json into wallgallery read-path. _(Step 1)_
- [x] Map hotspots to product variants via slug normalization. _(commerce-mapping.mjs — Step 2)_
- [x] Render variant selector on wallgallery viewer popup. _(Step 3)_
- [x] Render Buy button wired to selected variant checkoutUrl. _(Step 4)_
- [x] Ensure UI disables buy action for inactive or invalid variants. _(Step 4)_
- [x] Validate variant record before render and before purchase action. _(Step 5)_

Phase notes:

- Pilot channel host is `wallgallery`.
- The `products.json` / manual Square link approach is a **stepping stone only**. It proved the UI pattern (variant selector, Buy button, mapping logic) but does not scale.
- The real source of pricing data is the `price` field already present in hotspot metadata — the gallery is live with prices today.
- P1 buy flow will be **retired** once P3 (Square Checkout API) is in place.

Exit criteria:

- At least one published item can be purchased end-to-end through Square. ✅
- Variant selected by user maps to the correct payment link. ✅
- No client-side secrets are used. ✅

## P2 - Promotion Pipeline (microAlbum to MicroGallery)

**Status: DEFERRED** — not a prerequisite for live selling.

Objective: automate creation of wallgallery channel records from microAlbum archive metadata.

Rationale for deferral: wallgallery is already live with prices in hotspot metadata. P3 (Square Checkout API) reads price directly from hotspot data, making manual `products.json` records and a promotion pipeline unnecessary for the core sell path. P2 becomes relevant later if channel-specific offer overrides (framing options, size variants, edition types) need to be managed independently of the hotspot price field.

Tasks (deferred):

- [ ] Add promotion command to create or update wallgallery channel records from microAlbum archive metadata.
- [ ] Enforce canonical validation during promotion.
- [ ] Apply publish and sell state gates (`draft`, `published`, `forSale`).
- [ ] Allow channel-specific offer overrides (pricing, framing, size options).
- [ ] Emit actionable errors when required display or commerce fields are missing.

## P3 - Square Checkout API Integration

**Status: NEXT PRIORITY** — this replaces the P1 manual-link approach for all items.

Objective: dynamically create Square checkout sessions from hotspot price data, eliminating per-item manual Square link setup.

How it works:

1. Buyer taps "Buy Now" on any priced hotspot
2. wallgallery POSTs `{ subject, price, size? }` to a Netlify Function
3. Netlify Function calls Square Checkout API → gets a live `checkoutUrl`
4. Buyer is redirected to Square, pays, receives email receipt
5. Square redirects buyer back to wallgallery with order confirmation

Tasks:

- [x] Set up Square developer account and sandbox credentials.
- [x] Create `netlify/functions/checkout.mjs` — calls Square Checkout API with item name + price.
- [x] Validate request shape (`subject`, `priceMinor`, `quantity`) server-side before calling Square.
- [x] Store `SQUARE_ACCESS_TOKEN` and `SQUARE_LOCATION_ID` as Netlify env vars (never client-side).
- [x] Wire wallgallery Buy button to POST to `/api/checkout` for all priced hotspots.
- [ ] Sandbox E2E test — run `netlify dev`, click Buy Now, complete test payment with Square sandbox card.
- [ ] Configure Square redirect URL back to wallgallery after payment (optional for MVP).
- [ ] Add Netlify production env vars and deploy branch to production.
- [ ] Retire P1 `products.json` / manual link approach once P3 is validated in production.

Exit criteria:

- Any hotspot with a `price` field can be purchased without pre-creating a Square link.
- Square API key never appears in client-side code or network responses.
- Sandbox test purchase completes end-to-end with email receipt.
- Production and sandbox environments are switched by env var only.

## P4 - Order Signal and Fulfillment Queue

Objective: close the loop after payment.

Tasks:

- [ ] Select ingestion mode: webhook first or manual import fallback.
- [ ] Persist canonical `OrderRecord` including fulfillment state.
- [ ] Add minimal fulfillment queue report/view.
- [ ] Define and test status transitions from paid to fulfilled.

Exit criteria:

- Paid order appears in local fulfillment workflow.
- Fulfillment status can be advanced consistently.
- Error paths (duplicate signal, malformed payload) are handled.

## P5 - Operational Hardening

Objective: reduce release and data risk.

Tasks:

- [ ] Separate local, preview, and production commerce configuration.
- [ ] Add smoke test checklist for publish and buy flow.
- [ ] Add rollback notes for checkout and order ingestion paths.
- [ ] Run one preview-to-production rehearsal before scale-up.

Exit criteria:

- Preview can be tested without production side effects.
- Rollback path is documented and exercised at least once.
- Release checklist is used for each commerce deployment.

## Milestone Checklist

- [x] M0 complete: schema delta pack merged and tests green.
- [ ] M1 complete: one live sale path verified.
- [ ] M2 complete: promotion command and validation gate in place.
- [ ] M3 complete: server-side commerce boundary online.
- [ ] M4 complete: payment signal to fulfillment record working.
- [ ] M5 complete: environment isolation and release safety checklist active.

## Branching and Delivery Rules

- Keep changes isolated by repo and feature branch.
- Land one phase at a time with explicit acceptance notes.
- Do not start the next phase until current phase exit criteria are met.

## Immediate Next Step

Complete remaining P1 work in `wallgallery`: render variant selection and Buy action against manual `checkoutUrl`, then run one end-to-end preview purchase test.
