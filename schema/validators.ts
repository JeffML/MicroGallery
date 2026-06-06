import { z } from "zod";
import type { ArchiveItem, GalleryItem, OrderRecord, ProductVariant } from "./entities";

export const artStatusSchema = z.enum(["candidate", "ready", "archived"]);
export const galleryStatusSchema = z.enum(["draft", "published"]);
export const editionTypeSchema = z.enum(["open", "limited", "digital"]);
export const fulfillmentTypeSchema = z.enum(["ship", "local-pickup", "digital"]);
export const orderStatusSchema = z.enum(["pending", "paid", "fulfilling", "shipped", "completed", "canceled"]);
export const importedAsSchema = z.enum(["copy", "move"]);

const isoDateTimeSchema = z.string().datetime({ offset: true });

export const archiveItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  hidden: z.boolean(),
  sourceFile: z.string().min(1),
  importedAs: importedAsSchema,
  importedAt: isoDateTimeSchema,
  pixelWidth: z.number().int().nonnegative(),
  pixelHeight: z.number().int().nonnegative(),
  artStatus: artStatusSchema,
  subject: z.string().optional(),
  magnification: z.string().optional(),
  lighting: z.array(z.string()).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  rating: z.number().min(0).max(10).optional(),
  captureContext: z
    .object({
      microscope: z.string().optional(),
      camera: z.string().optional(),
      capturedAt: isoDateTimeSchema.optional(),
    })
    .optional(),
});

const galleryHotspotSchema = z
  .object({
    x: z.number().optional(),
    y: z.number().optional(),
    w: z.number().optional(),
    h: z.number().optional(),
    tooltip: z.string().optional(),
    link: z.string().optional(),
  })
  .optional();

export const galleryItemSchema = z
  .object({
    slug: z.string().min(1),
    archiveId: z.string().min(1),
    title: z.string().min(1),
    shortDescription: z.string().min(1),
    collection: z.string().min(1),
    displayImage: z.string().min(1),
    thumbnail: z.string().min(1),
    status: galleryStatusSchema,
    forSale: z.boolean(),
    subject: z.string().optional(),
    magnification: z.string().optional(),
    lighting: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
    hotspot: galleryHotspotSchema,
  })
  .superRefine((value, ctx) => {
    if (value.status === "published") {
      if (!value.title || !value.shortDescription || !value.collection) {
        ctx.addIssue({
          code: "custom",
          message: "Published items require title, shortDescription, and collection.",
        });
      }
      if (!value.displayImage || !value.thumbnail) {
        ctx.addIssue({
          code: "custom",
          message: "Published items require displayImage and thumbnail.",
        });
      }
    }
  });

export const productVariantSchema = z.object({
  sku: z.string().min(1),
  slug: z.string().min(1),
  label: z.string().min(1),
  priceMinor: z.number().int().nonnegative(),
  currency: z.string().length(3).default("USD"),
  editionType: editionTypeSchema,
  fulfillment: fulfillmentTypeSchema,
  active: z.boolean(),
  squareItemId: z.string().optional(),
  squareVariationId: z.string().optional(),
  inventoryPolicy: z.string().optional(),
  inventoryCount: z.number().int().optional(),
});

export const orderRecordSchema = z.object({
  orderId: z.string().min(1),
  slug: z.string().min(1),
  variantSku: z.string().min(1),
  quantity: z.number().int().min(1),
  status: orderStatusSchema,
  createdAt: isoDateTimeSchema,
  squareOrderId: z.string().optional(),
  paidAt: isoDateTimeSchema.optional(),
  customer: z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  fulfillmentNotes: z.string().optional(),
});

export type ArchiveItemInput = z.input<typeof archiveItemSchema>;
export type GalleryItemInput = z.input<typeof galleryItemSchema>;
export type ProductVariantInput = z.input<typeof productVariantSchema>;
export type OrderRecordInput = z.input<typeof orderRecordSchema>;

export function parseArchiveItem(input: unknown): ArchiveItem {
  return archiveItemSchema.parse(input);
}

export function parseGalleryItem(input: unknown): GalleryItem {
  return galleryItemSchema.parse(input);
}

export function parseProductVariant(input: unknown): ProductVariant {
  return productVariantSchema.parse(input);
}

export function parseOrderRecord(input: unknown): OrderRecord {
  return orderRecordSchema.parse(input);
}
