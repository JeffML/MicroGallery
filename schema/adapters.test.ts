import { describe, expect, it } from "vitest";
import {
  adaptLegacyHotspotToGalleryItem,
  adaptLegacyProductToProductVariant,
  adaptLegacySidecarToArchiveItem,
  normalizeDollarsToMinorUnits,
} from "./adapters";

describe("normalizeDollarsToMinorUnits", () => {
  it("parses common currency strings", () => {
    expect(normalizeDollarsToMinorUnits("$65")).toBe(6500);
    expect(normalizeDollarsToMinorUnits("$65.25")).toBe(6525);
  });

  it("treats numeric inputs as dollars", () => {
    expect(normalizeDollarsToMinorUnits(65)).toBe(6500);
    expect(normalizeDollarsToMinorUnits(65.25)).toBe(6525);
  });
});

describe("adaptLegacySidecarToArchiveItem", () => {
  it("fills canonical archive fields from legacy sidecar data", () => {
    const value = adaptLegacySidecarToArchiveItem(
      {
        title: "Amber Drift",
        subject: "Pollen",
        tags: ["botanical"],
        importedAs: "copy",
        importedAt: "2026-06-06T12:00:00Z",
        pixelWidth: 1600,
        pixelHeight: 1200,
      },
      {
        id: "8d58467e-90f0-4559-874e-e17f11714744",
        artStatus: "ready",
      },
    );

    expect(value.id).toBe("8d58467e-90f0-4559-874e-e17f11714744");
    expect(value.artStatus).toBe("ready");
    expect(value.hidden).toBe(false);
  });
});

describe("adaptLegacyHotspotToGalleryItem", () => {
  it("maps hotspot geometry into a gallery item hotspot block", () => {
    const value = adaptLegacyHotspotToGalleryItem(
      {
        x: 10,
        y: 20,
        w: 30,
        h: 40,
        tooltip: "Mountain Ash",
        subject: "Mountain Ash Flowerlet",
        price: "$250",
      },
      {
        archiveId: "8d58467e-90f0-4559-874e-e17f11714744",
        slug: "mountain-ash",
        title: "Mountain Ash",
        shortDescription: "A botanical micrograph",
        collection: "Botanical",
        displayImage: "/images/mountain-ash.jpg",
        thumbnail: "/images/mountain-ash-thumb.jpg",
        status: "published",
        forSale: true,
      },
    );

    expect(value.hotspot?.x).toBe(10);
    expect(value.subject).toBe("Mountain Ash Flowerlet");
    expect(value.status).toBe("published");
  });
});

describe("adaptLegacyProductToProductVariant", () => {
  it("normalizes legacy product pricing to minor units", () => {
    const value = adaptLegacyProductToProductVariant(
      {
        label: "8x10 signed print",
        price: 65,
        editionType: "open",
        fulfillment: "ship",
        checkoutUrl: "https://square.link/u/example",
      },
      {
        sku: "AMBER-8X10-OPEN",
        slug: "amber-drift",
      },
    );

    expect(value.sku).toBe("AMBER-8X10-OPEN");
    expect(value.priceMinor).toBe(6500);
    expect(value.currency).toBe("USD");
    expect(value.checkoutUrl).toBe("https://square.link/u/example");
  });
});
