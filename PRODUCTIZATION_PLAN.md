# Productization Plan

Goal: ship a minimal, sellable MicroGallery workflow from curated image to successful payment and fulfillment handoff, while preserving canonical schema discipline.

## Current Position

- Canonical schema, validators, adapters, and governance are in place.
- microAlbum has read/write boundary validation.
- wallgallery has API boundary validation for hotspots.
- Commerce flow is architected but not yet operational.

## Phase P1 - MVP Sell Path (Manual Square Links)

Objective: enable real purchases quickly with the least new code.

Scope:
- Publish gallery items with sale-ready variants.
- Store per-variant manual Square payment link.
- Render variant selector and Buy button on public item page.

Out of scope:
- Dynamic checkout link creation.
- Automated catalog sync.
- Webhook processing.

Exit criteria:
- At least one published item can be purchased end-to-end through Square.
- Variant selected by user maps to the correct payment link.
- No client-side secrets are used.

## Phase P2 - Promotion Pipeline (microAlbum to MicroGallery)

Objective: remove fragile manual JSON edits.

Scope:
- Add promotion command to create/update gallery records from archive metadata.
- Enforce canonical validation during promotion.
- Apply publish/sell state gates: draft, published, forSale.

Exit criteria:
- New item can be promoted with one command.
- Promotion fails fast with actionable validation errors.

## Phase P3 - Commerce Boundary Function

Objective: move checkout logic behind a controlled server boundary.

Scope:
- Implement Netlify function for checkout resolution/creation.
- Validate product/variant input with canonical schemas.
- Reject invalid slug, inactive variant, unpublished item, and malformed requests.

Exit criteria:
- Frontend calls one server endpoint for commerce action.
- Boundary returns deterministic error classes and statuses.

## Phase P4 - Order Signal and Fulfillment Queue

Objective: close the loop after payment.

Scope:
- Ingest payment success signal (webhook or manual import fallback).
- Persist canonical OrderRecord shape.
- Provide a minimal fulfillment queue view/report.

Exit criteria:
- Paid order appears in local fulfillment workflow.
- Fulfillment status can be progressed consistently.

## Phase P5 - Operational Hardening

Objective: reduce release and data-risk.

Scope:
- Separate local, preview, and production commerce configuration.
- Add smoke test checklist for publish and buy flow.
- Add rollback notes for checkout and order ingestion paths.

Exit criteria:
- Preview can be tested without production side effects.
- Rollback path is documented and tested at least once.

## Milestone Checklist

1. P1 complete: one live sale path verified.
2. P2 complete: promotion command and validation gate in place.
3. P3 complete: server-side commerce boundary online.
4. P4 complete: payment signal to fulfillment record working.
5. P5 complete: env isolation and release safety checklist active.

## Branching and Delivery Rules

- Keep changes isolated by repo and feature branch.
- Land one phase at a time with explicit acceptance notes.
- Do not start the next phase until current phase exit criteria are met.

## Immediate Next Step

Start P1 by defining the concrete variant fields and payment link storage location for one pilot item, then run a single-item purchase test in preview.
