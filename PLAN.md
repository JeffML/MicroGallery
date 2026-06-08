## One-Page Execution Checklist

Goal: define one canonical metadata language across archive, gallery, and commerce layers using TypeScript plus Zod, without doing migration or backfill in this phase.

Productization execution is tracked separately in `PRODUCTIZATION_PLAN.md`.

Single-owner checklist for a one-person project.

| Phase                              | Owner | Target Date | Deliverable                                                        | Exit Criteria                                                                     | Status               |
| ---------------------------------- | ----- | ----------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------- | -------------------- |
| 1. Field Inventory Matrix          | You   | 2026-06-06  | Single matrix of all current fields                                | Every current field maps to exactly one canonical entity and one owner layer      | Completed 2026-06-05 |
| 2. Canonical Entity Spec           | You   | 2026-06-06  | Final contract for ArchiveItem, GalleryItem, ProductVariant, Order | Required and optional fields, IDs, enums, and price units are locked              | Completed 2026-06-06 |
| 3. Module and Ownership Boundaries | You   | 2026-06-07  | Schema location and import boundaries                              | Archive, gallery, and commerce concerns are separated with no overlap             | Completed 2026-06-06 |
| 4. TypeScript and Zod Plan         | You   | 2026-06-07  | Validator implementation checklist per entity                      | Parse, normalize, and error behavior is documented for each entity                | Completed 2026-06-06 |
| 5. Adapter Contract Definitions    | You   | 2026-06-08  | Boundary mappings only (no migration)                              | Sidecar-to-archive, hotspot-to-gallery, and product linkage contracts are defined | Completed 2026-06-07 |
| 6. Adoption Sequencing             | You   | 2026-06-08  | Rollout sequence and rollback notes                                | Validation order is staged: read-time, write-time, then server boundaries         | Completed 2026-06-08 |
| 7. Governance and Docs             | You   | 2026-06-08  | Schema policy in project docs                                      | New fields require canonical schema updates before implementation                 | Completed 2026-06-08 |

## Week-One Checkpoints

- 2026-06-06 checkpoint: Phases 1 and 2 accepted.
- 2026-06-07 checkpoint: Phases 3 and 4 accepted.
- 2026-06-08 checkpoint: Phases 5 through 7 accepted.

## Weekly Focus

- Day 1: Finish Phases 1 and 2.
- Day 2: Finish Phases 3 and 4.
- Day 3: Finish Phases 5 through 7.

## Phase 6 Rollout Sequence

1. microAlbum read path first
   Validate sidecar-derived archive records when they are loaded, before enforcing validation on writes. Primary target: microAlbum/src/hooks/useImageFiles.js.

2. microAlbum write path second
   Validate archive records before persisting sidecars so edited metadata cannot create invalid canonical records. Primary targets: microAlbum/src/lib/sidecar.js and microAlbum/src/components/MetadataPanel.jsx.

3. wallgallery server boundary third
   Validate incoming hotspot payloads and mapped gallery records at the Netlify API boundary. Primary target: wallgallery/netlify/functions/hotspots.mjs.

4. Commerce and order functions last
   Apply ProductVariant and OrderRecord validation when checkout and order-processing functions are introduced or updated.

## Phase 6 Rollback Notes

1. Start with read-time validation in non-blocking mode where possible, so invalid legacy records can be reported before writes are rejected.
2. Only move to write-time rejection after read-path validation shows stable data quality.
3. Keep API-boundary validation strict once enabled, because server boundaries are the safest enforcement point.

## Appendix: Archived Detail

### Full Step Descriptions

1. Phase 1 - Inventory and contract baseline
   Consolidate currently used fields from existing sources into a schema matrix with source field, canonical field, required or optional, type, and owner layer. Use microAlbum/metadata.json, microAlbum/src/lib/schema.js, microAlbum/src/lib/sidecar.js, wallgallery/hotspots.json, wallgallery/netlify/functions/hotspots.mjs, and MicroGallery/architecture.md. This is a blocking prerequisite for all later phases.

2. Phase 2 - Canonical entity design
   Define canonical entities and strict field semantics for ArchiveItem, GalleryItem, ProductVariant, and Order, including identity strategy (id, slug, sku), enum sets (status, artStatus, fulfillment, editionType), price representation in minor units, and image path conventions. Depends on Phase 1.

3. Phase 3 - Module layout and ownership boundaries
   Define where shared schema code lives and which apps import which entities. Mark hard boundaries so archive metadata, public display metadata, and commerce metadata remain separated. Depends on Phase 2.

4. Phase 4 - TypeScript and Zod contracts
   Create implementation tasks for TypeScript interfaces and paired Zod validators for each canonical entity, including parse and normalize entry points for incoming data. Depends on Phase 3.

5. Phase 5 - Adapter contracts only (no migration)
   Define adapter interfaces for each system boundary only: sidecar to ArchiveItem, hotspot to GalleryItem subset, and gallery product to ProductVariant linkages. Explicitly exclude backfill scripts and mass rewrites in this phase. Depends on Phase 4.

6. Phase 6 - Incremental adoption plan
   Sequence adoption by risk: read-time validation first, write-time validation second, then strict validation in Netlify and server boundaries. Can run in parallel with Phase 5 after core validators exist.

7. Phase 7 - Documentation and governance
   Add a schema reference doc and contribution rules that require schema updates before new metadata fields are introduced. Depends on Phase 4 and can complete in parallel with Phase 6.

### Plain-Language Notes

1. First, list every field that exists today.
   What this means: gather fields from sidecars and hotspots and make one master table.
   Done when: every field has a type, owner layer, and canonical destination.

2. Next, lock the four core record shapes.
   What this means: finalize the exact fields for ArchiveItem, GalleryItem, ProductVariant, and Order.
   Done when: required versus optional fields and IDs are unambiguous.

3. Decide where the shared schema code lives.
   What this means: pick one place for canonical types and validators so both apps can use the same source.
   Done when: ownership boundaries are documented.

4. Define the validator behavior.
   What this means: specify how Zod should parse, normalize, and reject bad records.
   Done when: each entity has clear pass and fail rules.

5. Define adapters only (no migration yet).
   What this means: document translation rules between existing data shapes and canonical shapes.
   Done when: boundary contracts are written without rewriting old data.

6. Roll out validation in safe order.
   What this means: validate reads first, writes second, server boundaries last.
   Done when: rollout order and rollback notes are documented.

7. Add lightweight governance.
   What this means: require schema updates before introducing new metadata fields.
   Done when: a short policy is added to project docs.
