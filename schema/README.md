# Schema Module

This folder is the canonical contract source for Archive, Gallery, and Commerce entities.

## Why this lives here

- `MicroGallery` is currently the architecture source-of-truth.
- This module is intentionally framework-neutral TypeScript.
- Other projects should import these contracts rather than redefine fields.

## Files

- `entities.ts`: TypeScript interfaces and enums as type aliases.
- `validators.ts`: Zod runtime validators and parse helpers.
- `index.ts`: Public exports for consumers.

## Boundary and Ownership

- Archive fields: ingest metadata and capture context.
- Gallery fields: public presentation and hotspot geometry.
- Commerce fields: SKU, pricing, and order state.

## Current limitations

- This repo does not yet include runtime wiring into `microAlbum` or `wallgallery`.
- Integration occurs in later phases via adapter and validation rollout tasks.

## Next integration targets

1. Import `archiveItemSchema` in sidecar read/write pathways in `microAlbum`.
2. Import `galleryItemSchema` in payload validation for `wallgallery` hotspot APIs.
3. Import `productVariantSchema` and `orderRecordSchema` in checkout/order functions.
