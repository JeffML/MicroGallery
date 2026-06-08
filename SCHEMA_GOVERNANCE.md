# Schema Governance Policy

This policy keeps metadata changes consistent across MicroGallery, microAlbum, and wallgallery.

## Scope

- Canonical entities: `ArchiveItem`, `GalleryItem`, `ProductVariant`, `OrderRecord`.
- Canonical source files live in `schema/`.
- Boundary adapters are the only allowed translation points.

## Required Change Order

1. Update canonical types in `schema/entities.ts`.
2. Update validation in `schema/validators.ts`.
3. Update boundary adapters in `schema/adapters.ts` if mappings change.
4. Add or update tests for validators and adapters.
5. Only then update consuming app code (`microAlbum`, `wallgallery`, or future commerce functions).

## Non-Negotiable Rules

- No app-specific field may be added directly in consuming app code without a canonical schema update first.
- Validation must be enforced at write or API boundaries before persisting changed data.
- Price fields are stored in minor units only.
- IDs and enums must remain centralized in canonical schema definitions.

## Pull Request Checklist

- Canonical schema files updated as needed.
- Tests updated and passing.
- Rollback impact considered for boundary validation changes.
- PLAN status updated when a governance milestone is completed.

## Versioning Note

Until explicit schema versioning is introduced, any field or enum change is treated as a breaking contract change and must be coordinated across consumers.