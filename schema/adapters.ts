import { parseArchiveItem, parseGalleryItem, parseProductVariant } from "./validators";
import type { ArchiveItem, ArtStatus, EditionType, FulfillmentType, GalleryItem, ImportedAs, ProductVariant } from "./entities";

export interface LegacySidecarSource {
  title: string;
  subject?: string;
  magnification?: string;
  lighting?: string[];
  notes?: string;
  tags?: string[];
  hidden?: boolean;
  sourceFile?: string;
  importedAs?: ImportedAs;
  importedAt?: string;
  pixelWidth?: number;
  pixelHeight?: number;
  rating?: number;
  captureContext?: {
    microscope?: string;
    camera?: string;
    capturedAt?: string;
  };
}

export interface ArchiveItemAdapterOptions {
  id: string;
  artStatus: ArtStatus;
  sourceFile?: string;
  importedAs?: ImportedAs;
  importedAt?: string;
  hidden?: boolean;
  pixelWidth?: number;
  pixelHeight?: number;
}

export interface LegacyHotspotSource {
  x: number;
  y: number;
  w: number;
  h: number;
  tooltip?: string;
  subject?: string;
  magnification?: string;
  lighting?: string[];
  tags?: string[];
  notes?: string;
  price?: string;
  link?: string;
}

export interface GalleryItemAdapterOptions {
  archiveId: string;
  slug: string;
  title: string;
  shortDescription: string;
  collection: string;
  displayImage: string;
  thumbnail: string;
  status?: "draft" | "published";
  forSale?: boolean;
}

export interface LegacyProductSource {
  sku?: string;
  slug?: string;
  label: string;
  price?: string | number;
  currency?: string;
  editionType?: EditionType;
  fulfillment?: FulfillmentType;
  active?: boolean;
  squareItemId?: string;
  squareVariationId?: string;
  inventoryPolicy?: string;
  inventoryCount?: number;
}

export interface ProductVariantAdapterOptions {
  sku: string;
  slug: string;
  label?: string;
  currency?: string;
  editionType?: EditionType;
  fulfillment?: FulfillmentType;
  active?: boolean;
  squareItemId?: string;
  squareVariationId?: string;
  inventoryPolicy?: string;
  inventoryCount?: number;
}

function normalizeDollarsToMinorUnits(value: string | number): number {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError("Price must be a finite number.");
    }
    return Number.isInteger(value) ? value : Math.round(value * 100);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new TypeError("Price cannot be empty.");
  }

  const cleaned = trimmed.replace(/[^0-9.-]/g, "");
  if (!cleaned) {
    throw new TypeError(`Unable to parse price: ${value}`);
  }

  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed)) {
    throw new TypeError(`Unable to parse price: ${value}`);
  }

  return Math.round(parsed * 100);
}

export function adaptLegacySidecarToArchiveItem(
  source: LegacySidecarSource,
  options: ArchiveItemAdapterOptions,
): ArchiveItem {
  return parseArchiveItem({
    id: options.id,
    title: source.title,
    hidden: options.hidden ?? source.hidden ?? false,
    sourceFile: options.sourceFile ?? source.sourceFile ?? `${source.title}.jpg`,
    importedAs: options.importedAs ?? source.importedAs ?? "copy",
    importedAt: options.importedAt ?? source.importedAt ?? new Date().toISOString(),
    pixelWidth: options.pixelWidth ?? source.pixelWidth ?? 0,
    pixelHeight: options.pixelHeight ?? source.pixelHeight ?? 0,
    artStatus: options.artStatus,
    subject: source.subject,
    magnification: source.magnification,
    lighting: source.lighting,
    notes: source.notes,
    tags: source.tags,
    rating: source.rating,
    captureContext: source.captureContext,
  });
}

export function adaptLegacyHotspotToGalleryItem(
  source: LegacyHotspotSource,
  options: GalleryItemAdapterOptions,
): GalleryItem {
  return parseGalleryItem({
    slug: options.slug,
    archiveId: options.archiveId,
    title: options.title,
    shortDescription: options.shortDescription,
    collection: options.collection,
    displayImage: options.displayImage,
    thumbnail: options.thumbnail,
    status: options.status ?? "draft",
    forSale: options.forSale ?? false,
    subject: source.subject ?? source.tooltip,
    magnification: source.magnification,
    lighting: source.lighting,
    tags: source.tags,
    notes: source.notes,
    hotspot: {
      x: source.x,
      y: source.y,
      w: source.w,
      h: source.h,
      tooltip: source.tooltip,
      link: source.link,
    },
  });
}

export function adaptLegacyProductToProductVariant(
  source: LegacyProductSource,
  options: ProductVariantAdapterOptions,
): ProductVariant {
  const sku = source.sku ?? options.sku;
  const slug = source.slug ?? options.slug;
  const label = options.label ?? source.label;
  const currency = options.currency ?? source.currency ?? "USD";
  const editionType = options.editionType ?? source.editionType ?? "open";
  const fulfillment = options.fulfillment ?? source.fulfillment ?? "ship";
  const active = options.active ?? source.active ?? true;
  const priceSource = source.price ?? 0;

  return parseProductVariant({
    sku,
    slug,
    label,
    priceMinor: normalizeDollarsToMinorUnits(priceSource),
    currency,
    editionType,
    fulfillment,
    active,
    squareItemId: options.squareItemId ?? source.squareItemId,
    squareVariationId: options.squareVariationId ?? source.squareVariationId,
    inventoryPolicy: options.inventoryPolicy ?? source.inventoryPolicy,
    inventoryCount: options.inventoryCount ?? source.inventoryCount,
  });
}

export { normalizeDollarsToMinorUnits };
