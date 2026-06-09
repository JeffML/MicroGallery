export type ArtStatus = "candidate" | "ready" | "archived";
export type GalleryStatus = "draft" | "published";
export type EditionType = "open" | "limited" | "digital";
export type FulfillmentType = "ship" | "local-pickup" | "digital";
export type OrderStatus = "pending" | "paid" | "fulfilling" | "shipped" | "completed" | "canceled";
export type FulfillmentState = "needs-printing" | "ready-to-ship" | "shipped" | "completed";
export type ImportedAs = "copy" | "move";

export interface ArchiveItem {
  id: string;
  title: string;
  hidden: boolean;
  sourceFile: string;
  importedAs: ImportedAs;
  importedAt: string;
  pixelWidth: number;
  pixelHeight: number;
  artStatus: ArtStatus;
  subject?: string;
  magnification?: string;
  lighting?: string[];
  notes?: string;
  tags?: string[];
  rating?: number;
  captureContext?: {
    microscope?: string;
    camera?: string;
    capturedAt?: string;
  };
}

export interface GalleryHotspot {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  tooltip?: string;
  link?: string;
}

export interface GalleryItem {
  slug: string;
  archiveId: string;
  title: string;
  shortDescription: string;
  collection: string;
  displayImage: string;
  thumbnail: string;
  status: GalleryStatus;
  forSale: boolean;
  subject?: string;
  magnification?: string;
  lighting?: string[];
  tags?: string[];
  notes?: string;
  hotspot?: GalleryHotspot;
}

export interface ProductVariant {
  sku: string;
  slug: string;
  label: string;
  priceMinor: number;
  currency: string;
  editionType: EditionType;
  fulfillment: FulfillmentType;
  active: boolean;
  checkoutUrl?: string;
  squareItemId?: string;
  squareVariationId?: string;
  inventoryPolicy?: string;
  inventoryCount?: number;
}

export interface OrderRecord {
  orderId: string;
  slug: string;
  variantSku: string;
  quantity: number;
  status: OrderStatus;
  fulfillmentState?: FulfillmentState;
  createdAt: string;
  squareOrderId?: string;
  paidAt?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  fulfillmentNotes?: string;
}
