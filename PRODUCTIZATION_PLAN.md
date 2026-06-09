# Productization Plan

Goal: ship a minimal, sellable MicroGallery workflow from curated image to successful payment and fulfillment handoff, while preserving canonical schema discipline.

## Current Position

- Canonical schema, validators, adapters, and governance are in place.
- microAlbum has read/write boundary validation.
- wallgallery has API boundary validation for hotspots.
- Commerce flow is architected but not yet operational.

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

- [ ] Resolve status vocabulary: decide whether `finished` maps to existing `ready` or becomes a new canonical status.
- [ ] Add optional `checkoutUrl` on `ProductVariant` for Level 1 manual Square links.
- [ ] Add explicit fulfillment-state field on `OrderRecord` (for example `needs-printing`, `ready-to-ship`, `shipped`).
- [ ] Tighten hotspot validation constraints to match API boundary behavior.
- [ ] Confirm and document money conversion rule: external dollars to canonical `priceMinor` cents.
- [ ] Update `schema/entities.ts`, `schema/validators.ts`, `schema/adapters.ts`, and tests.

Primary repos/files:

- `MicroGallery/schema/entities.ts`
- `MicroGallery/schema/validators.ts`
- `MicroGallery/schema/adapters.ts`
- `MicroGallery/schema/*.test.ts`

Exit criteria:

- All schema delta tests pass.
- Canonical contracts cover Level 1 checkout-link flow.
- Architecture language and canonical enums/fields are reconciled.

## P1 - MVP Sell Path (Manual Square Links)

Objective: enable real purchases quickly with the least new code.

Tasks:

- [ ] Pick one pilot item and 2-3 variants.
- [ ] Store manual Square payment link per variant in commerce metadata.
- [ ] Render variant selector and Buy button on public item page.
- [ ] Ensure UI disables buy action for inactive or invalid variants.
- [ ] Validate variant record before render and before purchase action.

Exit criteria:

- At least one published item can be purchased end-to-end through Square.
- Variant selected by user maps to the correct payment link.
- No client-side secrets are used.

## P2 - Promotion Pipeline (microAlbum to MicroGallery)

Objective: remove fragile manual JSON edits.

Tasks:

- [ ] Add promotion command to create or update gallery records from archive metadata.
- [ ] Enforce canonical validation during promotion.
- [ ] Apply publish and sell state gates (`draft`, `published`, `forSale`).
- [ ] Emit actionable errors when required display or commerce fields are missing.

Exit criteria:

- New item can be promoted with one command.
- Promotion fails fast with clear validation errors.
- Promotion output is deterministic for identical input.

## P3 - Commerce Boundary Function

Objective: move purchase resolution behind a controlled server boundary.

Tasks:

- [ ] Implement Netlify function for checkout link resolution (manual-link mode first).
- [ ] Validate request shape (`slug`, `variantSku`, `quantity`) with canonical input schema.
- [ ] Reject invalid slug, inactive variant, unpublished item, and malformed requests.
- [ ] Return deterministic error classes and status codes.
- [ ] Keep all secrets and provider tokens server-side only.

Exit criteria:

- Frontend calls one server endpoint for commerce action.
- Boundary responses are stable and test-covered.
- Preview and local runs do not affect production commerce data.

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

- [ ] M0 complete: schema delta pack merged and tests green.
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

Start P0 and implement the minimal schema delta set required for P1 manual payment links: status vocabulary decision, `checkoutUrl`, fulfillment state, and tests.
