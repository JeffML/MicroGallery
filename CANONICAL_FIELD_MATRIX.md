# Canonical Field Inventory Matrix

Phase 1 artifact for canonical schema work.

## Scope

Sources inventoried:
- microAlbum/metadata.json
- microAlbum/src/lib/schema.js
- microAlbum/src/lib/sidecar.js
- wallgallery/hotspots.json
- wallgallery/netlify/functions/hotspots.mjs

Owner layers:
- archive: internal image metadata and ingest provenance
- gallery: public display and wall placement metadata
- commerce: sale and checkout metadata

## Matrix

| Source Field | Canonical Field | Type | Required | Owner Layer | Source(s) | Notes |
|---|---|---|---|---|---|---|
| title | title | string | required | archive | microAlbum/metadata.json, microAlbum/src/lib/schema.js | In imports, set from filename stem |
| subject | subject | string | optional | archive | microAlbum/metadata.json, microAlbum/src/lib/schema.js, wallgallery/hotspots.json | May be surfaced in gallery/search later |
| magnification | magnification | string | optional | archive | microAlbum/metadata.json, microAlbum/src/lib/schema.js, wallgallery/hotspots.json | Capture context |
| lighting | lighting | string[] | optional | archive | microAlbum/metadata.json, microAlbum/src/lib/schema.js, wallgallery/hotspots.json | Multi-select technique list |
| notes | notes | string | optional | archive | microAlbum/metadata.json, microAlbum/src/lib/schema.js, wallgallery/hotspots.json | Curatorial or capture notes |
| tags | tags | string[] | optional | archive | microAlbum/metadata.json, microAlbum/src/lib/schema.js, wallgallery/hotspots.json | Keyword list |
| hidden | hidden | boolean | required | archive | microAlbum/src/lib/schema.js | Internal visibility flag |
| sourceFile | sourceFile | string | required | archive | microAlbum/src/lib/schema.js, microAlbum/src/lib/sidecar.js | Provenance/integrity marker |
| importedAs | importedAs | "copy" \| "move" | required | archive | microAlbum/src/lib/schema.js, microAlbum/src/lib/sidecar.js | Ingest mode |
| importedAt | importedAt | string (ISO8601) | required | archive | microAlbum/src/lib/schema.js, microAlbum/src/lib/sidecar.js | Ingest timestamp |
| pixelWidth | pixelWidth | number | required | archive | microAlbum/src/lib/schema.js, microAlbum/src/lib/sidecar.js | Measured on ingest |
| pixelHeight | pixelHeight | number | required | archive | microAlbum/src/lib/schema.js, microAlbum/src/lib/sidecar.js | Measured on ingest |
| x | hotspot.x | number | required | gallery | wallgallery/hotspots.json | Percent coordinate |
| y | hotspot.y | number | required | gallery | wallgallery/hotspots.json | Percent coordinate |
| w | hotspot.w | number | required | gallery | wallgallery/hotspots.json | Percent width |
| h | hotspot.h | number | required | gallery | wallgallery/hotspots.json | Percent height |
| tooltip | hotspot.tooltip | string | required | gallery | wallgallery/hotspots.json | Public hover label |
| link | hotspot.link | string | optional | gallery | wallgallery/hotspots.json | Optional page link |
| price | listPriceText | string | optional | commerce | wallgallery/hotspots.json | Temporary display-price text; to be replaced by numeric minor-unit price in ProductVariant |

## Coverage Test

Pass rule:
- Every discovered source field appears exactly once in this matrix and maps to exactly one owner layer.

Discovered source field set:
- microAlbum sidecar/schema: title, subject, magnification, lighting, notes, tags, hidden, sourceFile, importedAs, importedAt, pixelWidth, pixelHeight
- wallgallery hotspot data: x, y, w, h, tooltip, subject, magnification, lighting, tags, notes, price, link

Coverage result:
- PASS
- 19 unique source fields discovered and mapped.
- 19 unique source fields mapped exactly once.

## Observations For Phase 2

- subject, magnification, lighting, notes, and tags currently appear in both archive and hotspot contexts; canonical ownership is set to archive, with gallery receiving derived projections where needed.
- price is currently text in wall hotspots and should become numeric minor units under ProductVariant in canonical commerce schema.
- hotspot geometry fields are gallery-only and should not leak into archive schemas.
