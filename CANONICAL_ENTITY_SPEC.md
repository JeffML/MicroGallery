# Canonical Entity Specification (Phase 2 Locked)

Status: locked for implementation
Date locked: 2026-06-06
Scope: field contracts only, no migration or backfill

## 1. Global Rules

- Canonical data is split across three layers: archive, gallery, commerce.
- Identity keys are stable and explicit:
  - ArchiveItem.id is internal primary key.
  - GalleryItem.slug is public primary key.
  - ProductVariant.sku is commerce primary key.
  - Order.orderId is local order primary key.
- Money is stored in minor units as integers.
- Date-time values are ISO 8601 strings in UTC.
- Optional means field may be absent; required means field must be present and non-null.

## 2. Enum Sets (Locked)

- artStatus: candidate | ready | archived
- galleryStatus: draft | published
- editionType: open | limited | digital
- fulfillmentType: ship | local-pickup | digital
- orderStatus: pending | paid | fulfilling | shipped | completed | canceled
- importedAs: copy | move

## 3. ArchiveItem

Owner layer: archive
Purpose: internal source-of-truth metadata for imported images

### Required fields

- id: string
- title: string
- hidden: boolean
- sourceFile: string
- importedAs: copy | move
- importedAt: string (ISO 8601)
- pixelWidth: number (integer, >= 0)
- pixelHeight: number (integer, >= 0)
- artStatus: candidate | ready | archived

### Optional fields

- subject: string
- magnification: string
- lighting: string[]
- notes: string
- tags: string[]
- rating: number (0 to 10)
- captureContext: object
  - microscope?: string
  - camera?: string
  - capturedAt?: string (ISO 8601)

### Constraints

- id must be immutable after creation.
- title may change over time; id must not.
- hidden only affects archive visibility, not commerce eligibility directly.

## 4. GalleryItem

Owner layer: gallery
Purpose: public-facing curated metadata

### Required fields

- slug: string
- archiveId: string
- title: string
- shortDescription: string
- collection: string
- displayImage: string
- thumbnail: string
- status: draft | published
- forSale: boolean

### Optional fields

- subject: string
- magnification: string
- lighting: string[]
- tags: string[]
- notes: string
- hotspot: object
  - x?: number
  - y?: number
  - w?: number
  - h?: number
  - tooltip?: string
  - link?: string

### Constraints

- slug is immutable once status becomes published.
- archiveId must reference an existing ArchiveItem.id.
- published requires non-empty title, shortDescription, displayImage, thumbnail, and collection.

## 5. ProductVariant

Owner layer: commerce
Purpose: sellable option tied to a gallery item

### Required fields

- sku: string
- slug: string
- label: string
- priceMinor: number (integer, >= 0)
- currency: string (ISO 4217, default USD)
- editionType: open | limited | digital
- fulfillment: ship | local-pickup | digital
- active: boolean

### Optional fields

- squareItemId: string
- squareVariationId: string
- inventoryPolicy: string
- inventoryCount: number

### Constraints

- sku must be globally unique.
- slug must reference an existing GalleryItem.slug.
- priceMinor replaces legacy text price fields.

## 6. Order

Owner layer: commerce
Purpose: local order tracking and fulfillment state

### Required fields

- orderId: string
- slug: string
- variantSku: string
- quantity: number (integer, >= 1)
- status: pending | paid | fulfilling | shipped | completed | canceled
- createdAt: string (ISO 8601)

### Optional fields

- squareOrderId: string
- paidAt: string (ISO 8601)
- customer: object
  - name?: string
  - email?: string
  - phone?: string
- fulfillmentNotes: string

### Constraints

- variantSku must reference an existing ProductVariant.sku.
- slug should match ProductVariant.slug for the same order line.

## 7. Identity and Join Policy (Locked)

- ArchiveItem.id generation: UUID v4 at import time.
- GalleryItem.slug generation: slugify(title), resolve collisions with numeric suffix.
- ProductVariant.sku format: <slug-prefix>-<size-or-type>-<edition>, uppercase.
- Order.orderId generation: local ULID or UUID v4.

Join paths:

- GalleryItem.archiveId -> ArchiveItem.id
- ProductVariant.slug -> GalleryItem.slug
- Order.variantSku -> ProductVariant.sku
- Order.slug -> GalleryItem.slug

## 8. Boundary Policy (Locked)

- Archive owns ingest and capture metadata.
- Gallery owns public presentation metadata.
- Commerce owns pricing, SKU, Square IDs, and fulfillment state.
- Hotspot geometry fields remain gallery-only.
- Legacy hotspot price text is non-canonical and must not be used as source-of-truth pricing.

## 9. Out of Scope for Phase 2

- Data migration or backfill scripts
- Runtime validator implementation
- API contract wiring

## 10. Acceptance Criteria for Phase 2

Phase 2 is complete when:

- All four entities have required and optional fields locked.
- All enum sets are locked.
- Identity and join policies are locked.
- Money and date formats are locked.
- Layer boundaries are locked.
