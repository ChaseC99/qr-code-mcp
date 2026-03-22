import { describe, it, expect } from "vitest";
import { formatGeo } from "../geo.js";

describe("formatGeo", () => {
  it("formats positive coordinates", () => {
    expect(formatGeo({ latitude: 40.7128, longitude: -74.006 })).toBe(
      "geo:40.7128,-74.006",
    );
  });

  it("formats negative coordinates", () => {
    expect(formatGeo({ latitude: -33.8688, longitude: 151.2093 })).toBe(
      "geo:-33.8688,151.2093",
    );
  });
});
