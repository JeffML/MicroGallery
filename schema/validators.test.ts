import { describe, expect, it } from "vitest";
import { parseArchiveItem, parseGalleryItem, parseOrderRecord, parseProductVariant } from "./validators";

describe("archiveItem parser", () => {
  it("accepts a valid archive item", () => {
    const value = parseArchiveItem({
      id: "8d58467e-90f0-4559-874e-e17f11714744",
      title: "Amber Drift",
      hidden: false,
      sourceFile: "amber-drift.jpg",
      importedAs: "copy",
      importedAt: "2026-06-06T12:00:00Z",
      pixelWidth: 1600,
      pixelHeight: 1200,
      artStatus: "ready",
      tags: ["pollen", "botanical"],
    });

    expect(value.id).toBe("8d58467e-90f0-4559-874e-e17f11714744");
    expect(value.artStatus).toBe("ready");
  });

  it("rejects invalid importedAs values", () => {
    expect(() =>
      parseArchiveItem({
        id: "a",
        title: "x",
        hidden: false,
        sourceFile: "x.jpg",
        importedAs: "sync",
        importedAt: "2026-06-06T12:00:00Z",
        pixelWidth: 100,
        pixelHeight: 100,
        artStatus: "candidate",
      }),
    ).toThrow();
  });

  it("normalizes finished to ready for archive status", () => {
    const value = parseArchiveItem({
      id: "a",
      title: "x",
      hidden: false,
      sourceFile: "x.jpg",
      importedAs: "copy",
      importedAt: "2026-06-06T12:00:00Z",
      pixelWidth: 100,
      pixelHeight: 100,
      artStatus: "finished",
    });

    expect(value.artStatus).toBe("ready");
  });
});

describe("galleryItem parser", () => {
  it("accepts a valid published gallery item", () => {
    const value = parseGalleryItem({
      slug: "amber-drift",
      archiveId: "8d58467e-90f0-4559-874e-e17f11714744",
      title: "Amber Drift",
      shortDescription: "Botanical micrograph",
      collection: "Botanical",
      displayImage: "/images/amber-drift.jpg",
      thumbnail: "/images/amber-drift-thumb.jpg",
      status: "published",
      forSale: true,
    });

    expect(value.status).toBe("published");
  });

  it("rejects missing required fields", () => {
    expect(() =>
      parseGalleryItem({
        slug: "amber-drift",
        archiveId: "id-1",
        title: "Amber Drift",
        shortDescription: "",
        collection: "Botanical",
        displayImage: "/images/amber-drift.jpg",
        thumbnail: "/images/amber-drift-thumb.jpg",
        status: "published",
        forSale: true,
      }),
    ).toThrow();
  });

  it("rejects hotspot values outside 0-100 bounds", () => {
    expect(() =>
      parseGalleryItem({
        slug: "amber-drift",
        archiveId: "id-1",
        title: "Amber Drift",
        shortDescription: "Botanical micrograph",
        collection: "Botanical",
        displayImage: "/images/amber-drift.jpg",
        thumbnail: "/images/amber-drift-thumb.jpg",
        status: "draft",
        forSale: false,
        hotspot: {
          x: 101,
          y: 20,
          w: 30,
          h: 40,
          tooltip: "Example",
        },
      }),
    ).toThrow();
  });
});

describe("productVariant parser", () => {
  it("accepts a valid product variant", () => {
    const value = parseProductVariant({
      sku: "AMBER-8X10-OPEN",
      slug: "amber-drift",
      label: "8x10 signed print",
      priceMinor: 6500,
      currency: "USD",
      editionType: "open",
      fulfillment: "ship",
      active: true,
      checkoutUrl: "https://square.link/u/example",
    });

    expect(value.priceMinor).toBe(6500);
  });

  it("rejects non-integer money", () => {
    expect(() =>
      parseProductVariant({
        sku: "AMBER-8X10-OPEN",
        slug: "amber-drift",
        label: "8x10 signed print",
        priceMinor: 65.5,
        currency: "USD",
        editionType: "open",
        fulfillment: "ship",
        active: true,
      }),
    ).toThrow();
  });

  it("rejects invalid checkout URLs", () => {
    expect(() =>
      parseProductVariant({
        sku: "AMBER-8X10-OPEN",
        slug: "amber-drift",
        label: "8x10 signed print",
        priceMinor: 6500,
        currency: "USD",
        editionType: "open",
        fulfillment: "ship",
        active: true,
        checkoutUrl: "not-a-url",
      }),
    ).toThrow();
  });
});

describe("orderRecord parser", () => {
  it("accepts a valid order record", () => {
    const value = parseOrderRecord({
      orderId: "01JY2KCA3GS5N6W8Y8S6D29RQR",
      slug: "amber-drift",
      variantSku: "AMBER-8X10-OPEN",
      quantity: 1,
      status: "paid",
      fulfillmentState: "needs-printing",
      createdAt: "2026-06-06T12:00:00Z",
      customer: { email: "buyer@example.com" },
    });

    expect(value.status).toBe("paid");
  });

  it("rejects quantity less than 1", () => {
    expect(() =>
      parseOrderRecord({
        orderId: "01JY2KCA3GS5N6W8Y8S6D29RQR",
        slug: "amber-drift",
        variantSku: "AMBER-8X10-OPEN",
        quantity: 0,
        status: "pending",
        createdAt: "2026-06-06T12:00:00Z",
      }),
    ).toThrow();
  });

  it("rejects unsupported fulfillment states", () => {
    expect(() =>
      parseOrderRecord({
        orderId: "01JY2KCA3GS5N6W8Y8S6D29RQR",
        slug: "amber-drift",
        variantSku: "AMBER-8X10-OPEN",
        quantity: 1,
        status: "paid",
        fulfillmentState: "queued",
        createdAt: "2026-06-06T12:00:00Z",
      }),
    ).toThrow();
  });
});
